import { SPOTIFY_API_URL } from "../apiConfig.js";

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

// TODO: Add more Spotify API functions as needed
// - getTopCharts(countryCode)
// - getUserPlaylists(accessToken)
// - createPlaylist(accessToken, name, tracks)

