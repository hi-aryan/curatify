import {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_REDIRECT_URI,
  SPOTIFY_AUTH_URL,
} from "../apiConfig";

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

const SESSION_KEY = "spotify_session";
const VERIFIER_KEY = "spotify_verifier";

interface SpotifySession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

// Module-level lock for refresh requests to prevent race conditions
let refreshPromise: Promise<string | null> | null = null;

// Generate random string for PKCE verifier
function generateCodeVerifier(length: number) {
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let text = "";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

// Generate SHA-256 hash for PKCE challenge
async function generateCodeChallenge(verifier: string) {
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
  localStorage.setItem(VERIFIER_KEY, verifier);

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID,
    response_type: "code",
    redirect_uri: SPOTIFY_REDIRECT_URI,
    scope:
      "user-read-private user-read-email user-top-read user-modify-playback-state",
    code_challenge_method: "S256",
    code_challenge: challenge,
  });

  window.location.href = `${SPOTIFY_AUTH_URL}?${params.toString()}`;
}

// Exchange authorization code for tokens
export async function getAccessToken(code: string) {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_REDIRECT_URI) {
    throw new Error("Missing Spotify configuration");
  }

  const verifier = localStorage.getItem(VERIFIER_KEY);
  if (!verifier) {
    throw new Error("Missing code verifier. Please try logging in again.");
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
  localStorage.removeItem(VERIFIER_KEY);

  // Atomic storage
  storeTokenData(data.access_token, data.refresh_token, data.expires_in);
  return data.access_token;
}

/**
 * Refresh an expired access token
 * Uses a promise lock to prevent multiple simultaneous refreshes
 */
export async function refreshAccessToken(): Promise<string | null> {
  // Return existing promise if a refresh is already in flight
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      if (!SPOTIFY_CLIENT_ID) return null;

      const session = getSession();
      if (!session || !session.refreshToken) {
        return null;
      }

      const params = new URLSearchParams({
        client_id: SPOTIFY_CLIENT_ID,
        grant_type: "refresh_token",
        refresh_token: session.refreshToken,
      });

      const response = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params,
      });

      if (!response.ok) {
        // If refresh fails (e.g. token revoked/expired), clear session and fail gracefully
        clearTokenData();
        return null;
      }

      const data = await response.json();
      // Atomic storage update
      const newAccessToken = data.access_token;
      storeTokenData(
        newAccessToken,
        data.refresh_token || session.refreshToken,
        data.expires_in
      );
      return newAccessToken;
    } catch (error) {
      console.error("Critical error during token refresh:", error);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

/**
 * Get a valid access token. 
 * Refreshes if expired. returns null if authentication is invalid.
 */
export async function getValidAccessToken(): Promise<string | null> {
  const session = getSession();
  if (!session) return null;

  // Check if token is expired (with 60s buffer)
  const isExpired = Date.now() > session.expiresAt - 60000;
  
  if (isExpired) {
    return await refreshAccessToken();
  }
  
  return session.accessToken;
}

// Check if token is expired (exported for legacy compatibility)
export function isTokenExpired() {
  const session = getSession();
  if (!session) return true;
  return Date.now() > session.expiresAt - 60000;
}

/**
 * Get the current session from atomic storage. 
 * Includes migration logic for old individual keys.
 */
function getSession(): SpotifySession | null {
  const sessionStr = localStorage.getItem(SESSION_KEY);
  if (sessionStr) {
    try {
      return JSON.parse(sessionStr);
    } catch (e) {
      console.error("Corrupt session data:", e);
      clearTokenData();
      return null;
    }
  }

  // MIGRATION: Check for old individual keys
  const oldToken = localStorage.getItem("spotify_access_token");
  const oldRefresh = localStorage.getItem("spotify_refresh_token");
  const oldExpiry = localStorage.getItem("spotify_token_expires_at");

  if (oldToken && oldRefresh && oldExpiry) {
    const session: SpotifySession = {
      accessToken: oldToken,
      refreshToken: oldRefresh,
      expiresAt: parseInt(oldExpiry),
    };
    storeTokenData(session.accessToken, session.refreshToken, 3600); // Guestimate expiry or just force a refresh later
    // Migration cleanup happens in storeTokenData via clearOldKeys
    return session;
  }

  return null;
}

// Store token data in atomic localStorage
function storeTokenData(accessToken: string, refreshToken: string, expiresIn: number) {
  const session: SpotifySession = {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + expiresIn * 1000,
  };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  clearOldKeys();
}

/**
 * Removes legacy individual storage keys
 */
function clearOldKeys() {
  localStorage.removeItem("spotify_access_token");
  localStorage.removeItem("spotify_refresh_token");
  localStorage.removeItem("spotify_token_expires_at");
}

// Get stored access token (without validation)
export function getStoredToken() {
  return getSession()?.accessToken || null;
}

// Clear all session data
export function clearTokenData() {
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(VERIFIER_KEY);
  clearOldKeys();
}
