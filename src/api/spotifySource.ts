import { SPOTIFY_API_URL } from "../apiConfig";

/*
    Spotify API source file
    Contains functions that make fetch calls to Spotify API
    
    Pattern: 
    - Functions return Promises
    - Use gotResponseACB pattern for response handling
    - Use extract...ACB pattern for data transformation
*/

function gotResponseACB(response) {
  if (!response.ok) {
    throw new Error("Spotify API error: " + response.status);
  }
  return response.json();
}

// Get user's profile (requires auth)
export function getUserProfile(accessToken) {
  return fetch(`${SPOTIFY_API_URL}/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(gotResponseACB);
}

// Get a playlist's tracks
export function getPlaylistTracks(playlistId, accessToken) {
  return fetch(`${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(gotResponseACB);
}

export function getUserTopArtists(accessToken, options = {}) {
  const { limit = 50, time_range = "short_term" } = options;
  const params = new URLSearchParams({
    limit: String(limit),
    time_range: time_range,
  });
  return fetch(`${SPOTIFY_API_URL}/me/top/artists?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(gotResponseACB);
}

export function getUserTopTracks(accessToken, options = {}) {
  const { limit = 50, time_range = "short_term" } = options;
  const params = new URLSearchParams({
    limit: String(limit),
    time_range: time_range,
  });
  return fetch(`${SPOTIFY_API_URL}/me/top/tracks?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(gotResponseACB);
}

// Get multiple artists by their IDs (up to 50 at once)
// @param {string} accessToken - Spotify access token
// @param {Array<string>} artistIds - Array of artist IDs
// @returns {Promise} - Promise that resolves to { artists: [...] }
export function getArtists(accessToken, artistIds) {
  if (!artistIds || artistIds.length === 0) {
    return Promise.resolve({ artists: [] });
  }

  // Spotify API allows up to 50 IDs per request
  const ids = artistIds.slice(0, 50).join(",");
  const params = new URLSearchParams({ ids });

  return fetch(`${SPOTIFY_API_URL}/artists?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(gotResponseACB);
}

// Get user's playlists
export function getUserPlaylists(accessToken, options = {}) {
  const { limit = 50, offset = 0 } = options;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
  });
  return fetch(`${SPOTIFY_API_URL}/me/playlists?${params.toString()}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  }).then(gotResponseACB);
}

// TODO: Add more Spotify API functions as needed
// - getTopCharts(countryCode)
// - createPlaylist(accessToken, name, tracks)
