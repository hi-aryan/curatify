import { SPOTIFY_CLIENT_ID, SPOTIFY_REDIRECT_URI, SPOTIFY_AUTH_URL } from "../apiConfig.js";

/*
    Spotify PKCE Authentication
    Handles OAuth 2.0 Authorization Code with PKCE flow
    
    Flow:
    1. User clicks login → redirectToSpotifyAuth()
    2. Spotify redirects back with code → getAccessToken()
    3. App uses token for API calls
*/

// Generate random string for PKCE verifier
function generateCodeVerifier(length) {
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let text = "";
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

// Generate SHA-256 hash for PKCE challenge
async function generateCodeChallenge(verifier) {
    const data = new TextEncoder().encode(verifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

// Redirect user to Spotify login
export async function redirectToSpotifyAuth() {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("spotify_verifier", verifier);

    const params = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        response_type: "code",
        redirect_uri: SPOTIFY_REDIRECT_URI,
        scope: "user-read-private user-read-email user-top-read",
        code_challenge_method: "S256",
        code_challenge: challenge,
    });

    window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

// Exchange authorization code for access token
export async function getAccessToken(code) {
    const verifier = localStorage.getItem("spotify_verifier");
    console.log("[Auth] Verifier from storage:", verifier ? "exists" : "MISSING");
    console.log("[Auth] Redirect URI:", SPOTIFY_REDIRECT_URI);

    const params = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        code_verifier: verifier,
    });

    const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("[Auth] Token error:", errorData);
        throw new Error(`Failed to get access token: ${errorData.error_description || errorData.error}`);
    }

    const data = await response.json();
    console.log("[Auth] Token received successfully");
    localStorage.removeItem("spotify_verifier"); // Clean up
    return data.access_token;
}

// Check if we have a stored token (basic persistence)
export function getStoredToken() {
    return localStorage.getItem("spotify_access_token");
}

export function storeToken(token) {
    localStorage.setItem("spotify_access_token", token);
}

export function clearToken() {
    localStorage.removeItem("spotify_access_token");
    localStorage.removeItem("spotify_verifier");
}

