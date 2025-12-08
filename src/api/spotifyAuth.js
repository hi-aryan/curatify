import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_AUTH_URL,
} from "../apiConfig.js";

/*
    Spotify PKCE Authentication
    Handles OAuth 2.0 Authorization Code with PKCE flow
    
    Flow:
    1. User clicks login → redirectToSpotifyAuth()
    2. Spotify redirects back with code → getAccessToken()
    3. App uses token for API calls
    4. When token expires → refreshAccessToken() gets a new one
    
    Each user gets their own unique access token stored in their browser.
*/

// Generate random string for PKCE verifier
function generateCodeVerifier(length) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
  if (!SPOTIFY_CLIENT_ID) {
    throw new Error(
      "Spotify Client ID is missing. Please set NEXT_PUBLIC_SPOTIFY_CLIENT_ID in your environment variables."
    );
  }

  if (!SPOTIFY_REDIRECT_URI) {
    throw new Error(
      "Spotify Redirect URI is missing. Please set NEXT_PUBLIC_SPOTIFY_REDIRECT_URI in your environment variables."
    );
  }

  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  // Store verifier in localStorage to persist across OAuth redirect
  // The verifier is single-use and deleted after token exchange
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

// Exchange authorization code for tokens
export async function getAccessToken(code) {
  if (!SPOTIFY_CLIENT_ID) {
    throw new Error(
      "Spotify Client ID is missing. Please set NEXT_PUBLIC_SPOTIFY_CLIENT_ID in your environment variables."
    );
  }

  if (!SPOTIFY_REDIRECT_URI) {
    throw new Error(
      "Spotify Redirect URI is missing. Please set NEXT_PUBLIC_SPOTIFY_REDIRECT_URI in your environment variables."
    );
  }

  const verifier = localStorage.getItem("spotify_verifier");

  if (!verifier) {
    throw new Error(
      "Missing code verifier. Please try logging in again from the home page."
    );
  }

  if (!code) {
    throw new Error("Authorization code is missing.");
  }

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
    throw new Error(
      `Failed to get access token: ${
        errorData.error_description || errorData.error
      }`
    );
  }

  const data = await response.json();
  localStorage.removeItem("spotify_verifier");

  // Store all token data
  storeTokenData(data.access_token, data.refresh_token, data.expires_in);
  return data.access_token;
}

// Refresh an expired access token
export async function refreshAccessToken() {
  if (!SPOTIFY_CLIENT_ID) {
    throw new Error(
      "Spotify Client ID is missing. Please set NEXT_PUBLIC_SPOTIFY_CLIENT_ID in your environment variables."
    );
  }

  const refreshToken = localStorage.getItem("spotify_refresh_token");
  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    grant_type: "refresh_token",
    refresh_token: refreshToken,
  });

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    clearTokenData();
    throw new Error("Failed to refresh token");
  }

  const data = await response.json();
  // Spotify may return a new refresh token
  storeTokenData(
    data.access_token,
    data.refresh_token || refreshToken,
    data.expires_in
  );
  return data.access_token;
}

// Get a valid access token (refreshes if expired)
export async function getValidAccessToken() {
  if (isTokenExpired()) {
    return await refreshAccessToken();
  }
  return localStorage.getItem("spotify_access_token");
}

// Check if token is expired (with 60s buffer)
export function isTokenExpired() {
  const expiresAt = localStorage.getItem("spotify_token_expires_at");
  if (!expiresAt) return true;
  return Date.now() > parseInt(expiresAt) - 60000; // 60s buffer
}

// Store token data in localStorage
function storeTokenData(accessToken, refreshToken, expiresIn) {
  localStorage.setItem("spotify_access_token", accessToken);
  if (refreshToken) {
    localStorage.setItem("spotify_refresh_token", refreshToken);
  }
  const expiresAt = Date.now() + expiresIn * 1000;
  localStorage.setItem("spotify_token_expires_at", expiresAt.toString());
}

// Get stored access token (without validation)
export function getStoredToken() {
  return localStorage.getItem("spotify_access_token");
}

// Clear all token data
export function clearTokenData() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expires_at");
  localStorage.removeItem("spotify_verifier");
}
