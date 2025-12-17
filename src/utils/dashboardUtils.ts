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
 * Returns simplified structure with only averages and top song per category
 * @param {string} playlistId - Spotify playlist ID
 * @param {string} accessToken - Spotify access token
 * @returns {Promise<Object>} - { averages: {...}, topSongs: {...} }
 */
export async function analyzePlaylistMood(playlistId, accessToken) {
  // 1. Get playlist tracks
  const playlistData = await getPlaylistTracks(playlistId, accessToken);
  const tracks =
    playlistData?.items?.filter(
      (item) => item.track && !item.track.is_local && item.track.name
    ) || [];

  if (tracks.length === 0) {
    throw new Error("No valid tracks found in playlist");
  }

  // 2. Pass raw Spotify track data directly to Gemini (no transformation needed)
  const prompt =
    MOODBOARD_PROMPT + JSON.stringify({ tracks: { items: tracks } }, null, 2);
  const result = await callGeminiJSON(prompt);

  // 3. Validate response
  if (!result.averages || !result.top_three) {
    throw new Error("Analysis result missing required fields");
  }

  // 4. Create lookup map: "track_name|artist_name" -> full track object
  const trackMap = new Map();
  tracks.forEach((item) => {
    const track = item.track;
    const artistNames = track.artists?.map((a) => a.name).join(", ") || "";
    const key = `${track.name}|${artistNames}`.toLowerCase();
    trackMap.set(key, track);
  });

  // 5. Match Gemini results back to original tracks
  const topSongs = Object.fromEntries(
    Object.entries(result.top_three || {})
      .map(([category, songs]) => {
        const topSong = songs?.[0];
        if (!topSong) return [category, null];

        // Match by track name + artist name
        const key =
          `${topSong.track_name}|${topSong.artist_name}`.toLowerCase();
        const matchedTrack = trackMap.get(key);

        if (matchedTrack) {
          return [
            category,
            {
              ...matchedTrack,
              score: topSong.score,
            },
          ];
        }

        // Fallback: return Gemini data if no match found
        return [
          category,
          {
            name: topSong.track_name,
            artists: topSong.artist_name.split(", ").map((name) => ({ name })),
            external_urls: { spotify: null },
            album: { images: [] },
            score: topSong.score,
          },
        ];
      })
      .filter(([_, song]) => song !== null)
  );

  return {
    averages: result.averages,
    topSongs,
  };
}
