/*
    API Configuration
    
    Environment variables are loaded from .env file (see .env.example)
    Vite exposes env vars prefixed with VITE_ via import.meta.env
    
    For production: Set VITE_SPOTIFY_REDIRECT_URI in Vercel environment variables
    For local dev: Defaults to http://127.0.0.1:5173/callback
*/

// Spotify API
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

// Redirect URI: Use environment variable if set, otherwise default to local dev
// In production (Vercel), set VITE_SPOTIFY_REDIRECT_URI to your domain + /callback
// Example: https://yourdomain.com/callback
export const SPOTIFY_REDIRECT_URI =
  import.meta.env.VITE_SPOTIFY_REDIRECT_URI || "http://127.0.0.1:5173/callback";

export const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// LLM API (currently Gemini)
// VITE_LLM_API_KEY should be your Google AI Studio API key
// NOTE: This will be exposed in the frontend bundle (VITE_ prefix)
// Ensure your API key has proper rate limiting and restrictions
export const LLM_API_URL = import.meta.env.VITE_LLM_API_URL;
export const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;

// Validate required environment variables
if (!SPOTIFY_CLIENT_ID) {
  console.error(
    "VITE_SPOTIFY_CLIENT_ID is missing. Please set it in your .env file or Vercel environment variables."
  );
}

if (!LLM_API_URL || !LLM_API_KEY) {
  console.warn(
    "LLM API configuration is missing. Some features may not work. Set VITE_LLM_API_URL and VITE_LLM_API_KEY."
  );
}

