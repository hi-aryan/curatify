/*
    dashboardUtils.js: Data fetching and calculation utilities for dashboard
    
    Pattern:
    - Orchestration functions: fetch data via API and transform to app format
    - Calculation functions: pure functions that process data
    - Returns clean data ready for Redux dispatch
    - Keeps presenters thin
*/
import { getUserTopArtists, getUserTopTracks, getArtists, getPlaylistTracks } from '../api/spotifySource.js';
import { callGeminiAPI } from '../api/llmSource.js';


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
    artists.forEach(artist => {
        artistMap.set(artist.id, artist);
    });
    
    // Collect all genres from artists that appear in the tracks
    const allGenres = [];
    tracks.forEach(track => {
        track.artists?.forEach(trackArtist => {
            const fullArtist = artistMap.get(trackArtist.id);
            if (fullArtist?.genres?.length > 0) {
                allGenres.push(...fullArtist.genres);
            }
        });
    });
    
    if (allGenres.length === 0) return null;
    
    // Count occurrences of each genre
    const genreCount = {};
    allGenres.forEach(genre => {
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
    
    tracks.forEach(track => {
        track.artists?.forEach(artist => {
            artistIds.add(artist.id);
        });
    });
    
    return Array.from(artistIds);
}

const MOODBOARD_PROMPT = `**Role:** You are a musicologist and data processing engine.

**Input Data:** I will provide a JSON object representing a Spotify Playlist.

**Task:**
1. Parse the \`tracks.items\` array from the provided JSON.
2. For every single track, analyze the song title and artist. Based on your knowledge of the song's audio features and lyrics, assign a float score from 0.00 to 1.00 for the following four categories:
   - **Happiness:** (0.0 = Depressing, 1.0 = Ecstatic/Joyful)
   - **Sadness:** (0.0 = Not sad, 1.0 = Devastating/Melancholic)
   - **Energy:** (0.0 = Acoustic/Sleepy, 1.0 = High tempo/Intense)
   - **Aura:** (0.0 = Weak presence, 1.0 = High confidence/Swagger/"Main Character Energy" or atmospheric vibe)
3. Calculate the **Average Score** for each category (Sum of all scores in category / Total number of tracks).
4. Identify the **Top 3 Songs** for each category based on the highest scores.

**Constraints:**
- You must analyze EVERY song in the list.
- Return ONLY valid JSON. Do not include markdown formatting (like \`\`\`json), explanations, or conversational text.
- Do not add any text before or after the JSON object.
- Start your response with { and end with }.

**Output JSON Structure:**
{
  "playlist_analysis": [
    {
      "track_name": "String",
      "artist_name": "String",
      "scores": {
        "happiness": Float,
        "sadness": Float,
        "energy": Float,
        "aura": Float
      }
    }
  ],
  "averages": {
    "happiness": Float,
    "sadness": Float,
    "energy": Float,
    "aura": Float
  },
  "top_three": {
    "happiness": [
      { "track_name": "String", "artist_name": "String", "score": Float },
      { "track_name": "String", "artist_name": "String", "score": Float },
      { "track_name": "String", "artist_name": "String", "score": Float }
    ],
    "sadness": [ ... ],
    "energy": [ ... ],
    "aura": [ ... ]
  }
}

**Playlist Data:**
`;

function parseGeminiJSON(responseText) {
    let jsonText = responseText.trim()
        .replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/g, '');
    
    const firstBrace = jsonText.indexOf('{');
    const lastBrace = jsonText.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace > firstBrace) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
    }
    
    jsonText = jsonText.replace(/,(\s*[}\]])/g, '$1');
    return JSON.parse(jsonText);
}

/**
 * Analyze playlist mood using Gemini API
 */
export async function analyzePlaylistMood(playlistId, accessToken) {
    const playlistData = await getPlaylistTracks(playlistId, accessToken);
    const tracks = playlistData?.items?.filter(item => item.track && !item.track.is_local && item.track.name) || [];
    
    if (tracks.length === 0) {
        throw new Error("No valid tracks found in playlist");
    }
    
    const tracksForAnalysis = tracks.map(item => ({
        track_name: item.track.name,
        artist_name: item.track.artists?.map(a => a.name).join(', ') || 'Unknown Artist'
    }));
    
    const prompt = MOODBOARD_PROMPT + JSON.stringify({ tracks: { items: tracksForAnalysis } }, null, 2);
    const response = await callGeminiAPI(prompt);
    const responseText = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
        throw new Error("No response from Gemini API");
    }
    
    try {
        const result = parseGeminiJSON(responseText);
        if (!result.playlist_analysis || !result.averages || !result.top_three) {
            throw new Error("Analysis result missing required fields");
        }
        return result;
    } catch (error) {
        console.error('Failed to parse Gemini response:', responseText.substring(0, 500));
        throw new Error(`Failed to parse analysis result: ${error.message}`);
    }
}
