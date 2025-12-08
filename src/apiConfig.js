/*
    API Configuration
    
    Environment variables are loaded from .env file
    Next.js exposes env vars prefixed with NEXT_PUBLIC_ to the client
    
    For production: Set NEXT_PUBLIC_SPOTIFY_REDIRECT_URI in Vercel environment variables
    For local dev: Defaults to http://localhost:3000/callback
*/

// Spotify API
export const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;

// Redirect URI: Use environment variable if set, otherwise default to local dev
// In production (Vercel), set NEXT_PUBLIC_SPOTIFY_REDIRECT_URI to your domain + /callback
// Example: https://yourdomain.com/callback
export const SPOTIFY_REDIRECT_URI =
  process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || "http://localhost:3000/callback";

export const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// LLM API (currently Gemini)
// NEXT_PUBLIC_LLM_API_KEY should be your Google AI Studio API key
export const LLM_API_URL = process.env.NEXT_PUBLIC_LLM_API_URL;
export const LLM_API_KEY = process.env.NEXT_PUBLIC_LLM_API_KEY;

// Validate required environment variables
if (!SPOTIFY_CLIENT_ID && typeof window !== 'undefined') {
  console.error(
    "NEXT_PUBLIC_SPOTIFY_CLIENT_ID is missing. Please set it in your .env file or Vercel environment variables."
  );
}

if ((!LLM_API_URL || !LLM_API_KEY) && typeof window !== 'undefined') {
  console.warn(
    "LLM API configuration is missing. Some features may not work. Set NEXT_PUBLIC_LLM_API_URL and NEXT_PUBLIC_LLM_API_KEY."
  );
}

