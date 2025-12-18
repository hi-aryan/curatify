/*
    dashboardUtils.js: Data fetching and calculation utilities for dashboard
    
    Pattern:
    - Orchestration functions: fetch data via API and transform to app format
    - Calculation functions: pure functions that process data
    - Returns clean data ready for Redux dispatch
    - Keeps presenters thin
*/
import {
  getUserTopArtists,
  getUserTopTracks,
  getArtists,
  getPlaylistTracks,
} from "../api/spotifySource";
import { callGeminiJSON } from "../api/llmSource";
import { MOODBOARD_PROMPT } from "../constants/moodboardPrompt";

/**
 * Fetch and transform user's top artist
 * @returns {Object|null} - { name, image, url } or null
 */
export async function fetchTopArtist(accessToken) {
  const response = await getUserTopArtists(accessToken, { limit: 1 });
  const artist = response?.items?.[0];

  if (!artist) return null;

  return {
    name: artist.name,
    image: artist.images?.[0]?.url || null,
    url: artist.external_urls?.spotify || null,
  };
}

/**
 * Fetch user's top tracks
 * @returns {Array} - Array of track objects
 */
export async function fetchTopTracks(accessToken, limit = 3) {
  const response = await getUserTopTracks(accessToken, { limit });
  return response?.items || [];
}

/**
 * Fetch user's top artists
 * @returns {Array} - Array of artist objects
 */
export async function fetchTopArtists(accessToken, limit = 10) {
  const response = await getUserTopArtists(accessToken, { limit });
  return response?.items || [];
}

/**
 * Orchestrate fetching and calculating user's top genre
 * Fetches 50 tracks → extracts artist IDs → fetches artists → calculates genre
 * @returns {string|null} - Top genre name or null
 */
export async function fetchTopGenre(accessToken) {
  // Step 1: Fetch top 50 tracks
  const tracksResponse = await getUserTopTracks(accessToken, { limit: 50 });
  const tracks = tracksResponse?.items || [];

  if (tracks.length === 0) return null;

  // Step 2: Extract unique artist IDs
  const artistIds = extractArtistIdsFromTracks(tracks);
  if (artistIds.length === 0) return null;

  // Step 3: Fetch artist details with genres
  const artistsResponse = await getArtists(accessToken, artistIds);
  const artists = artistsResponse?.artists || [];

  // Step 4: Calculate top genre
  return calculateTopGenreFromTracks(tracks, artists);
}

// CALCULATION FUNCTIONS (pure, no side effects)

/**
 * Calculate the most common genre from tracks and their associated artists
 * @param {Array} tracks - Array of track objects with artists array
 * @param {Array} artists - Array of artist objects with genres property
 * @returns {string|null} - The most common genre, or null if no genres found
 */
function calculateTopGenreFromTracks(tracks, artists) {
  if (!tracks || tracks.length === 0 || !artists || artists.length === 0) {
    return null;
  }

  // Create a map of artist ID to artist object for quick lookup
  const artistMap = new Map();
  artists.forEach((artist) => {
    artistMap.set(artist.id, artist);
  });

  // Collect all genres from artists that appear in the tracks
  const allGenres = [];
  tracks.forEach((track) => {
    track.artists?.forEach((trackArtist) => {
      const fullArtist = artistMap.get(trackArtist.id);
      if (fullArtist?.genres?.length > 0) {
        allGenres.push(...fullArtist.genres);
      }
    });
  });

  if (allGenres.length === 0) return null;

  // Count occurrences of each genre
  const genreCount: Record<string, number> = {};
  allGenres.forEach((genre) => {
    genreCount[genre] = (genreCount[genre] || 0) + 1;
  });

  // Find the genre with the highest count
  let topGenre = null;
  let maxCount = 0;
  Object.entries(genreCount).forEach(([genre, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topGenre = genre;
    }
  });

  return topGenre;
}

/**
 * Extract unique artist IDs from tracks
 * @param {Array} tracks - Array of track objects
 * @returns {Array<string>} - Unique artist IDs
 */
function extractArtistIdsFromTracks(tracks) {
  const artistIds = new Set();

  tracks.forEach((track) => {
    track.artists?.forEach((artist) => {
      artistIds.add(artist.id);
    });
  });

  return Array.from(artistIds);
}

/**
 * Analyze playlist mood using Gemini API
 * @param {string} playlistId - Spotify playlist ID
 * @param {string} accessToken - Spotify access token
 * @returns {Promise<Object>} - { averages: {...}, topSongs: {...} }
 */
export async function analyzePlaylistMood(playlistId, accessToken) {
  // 1. Get playlist tracks
  const playlistData = await getPlaylistTracks(playlistId, accessToken);
  const rawTracks =
    playlistData?.items?.filter(
      (item) => item.track && !item.track.is_local && item.track.name
    ) || [];

  if (rawTracks.length === 0) {
    throw new Error("No valid tracks found in playlist");
  }

  // 2. Map to minimal format for Gemini
  const tracksForGemini = rawTracks.map((item, index) => ({
    index,
    name: item.track.name,
    artists: item.track.artists?.map((a) => a.name).join(", ") || "Unknown",
  }));

  // 3. Call Gemini
  const prompt = MOODBOARD_PROMPT + JSON.stringify(tracksForGemini, null, 2);
  const result = await callGeminiJSON(prompt);

  if (!result.analysis || !Array.isArray(result.analysis)) {
    throw new Error("Invalid analysis format from AI");
  }

  // 4. Match scores back to original tracks
  const analysisMap = new Map();
  result.analysis.forEach((item) => {
    analysisMap.set(item.index, item.scores);
  });

  const categoryAverages: Record<string, number> = {
    happiness: 0,
    sadness: 0,
    energy: 0,
    aura: 0,
  };

  const scoredTracks = rawTracks
    .map((item, index) => {
      const scores = analysisMap.get(index);
      if (!scores) return null;

      // Add to averages
      Object.keys(categoryAverages).forEach((cat) => {
        categoryAverages[cat] += scores[cat] || 0;
      });

      return {
        ...item.track,
        scores,
      };
    })
    .filter((t) => t !== null);

  if (scoredTracks.length === 0) {
    throw new Error("Failed to match any tracks with AI analysis");
  }

  // 5. Calculate Final Averages
  const averages = Object.fromEntries(
    Object.entries(categoryAverages).map(([cat, total]) => [
      cat,
      Number((total / scoredTracks.length).toFixed(3)),
    ])
  );

  // 6. Identify Top Songs per category (Greedy Unique Selection)
  const categories = ["happiness", "sadness", "energy", "aura"];
  const selectedTrackIds = new Set<string>();
  const topSongs: Record<string, any> = {};

  categories.forEach((cat) => {
    // Sort tracks by score in this category
    const sorted = [...scoredTracks].sort(
      (a, b) => (b.scores[cat] || 0) - (a.scores[cat] || 0)
    );

    // Try to find the best song that hasn't been picked yet
    let bestUniqueTrack = sorted.find((t) => !selectedTrackIds.has(t.id));

    // Fallback: if playlist is small or all songs picked, just take the absolute best
    if (!bestUniqueTrack) {
      bestUniqueTrack = sorted[0];
    }

    if (bestUniqueTrack) {
      selectedTrackIds.add(bestUniqueTrack.id);
      topSongs[cat] = {
        ...bestUniqueTrack,
        score: bestUniqueTrack.scores[cat] || 0,
      };
    }
  });

  return {
    averages,
    topSongs,
  };
}
