/*
    API Configuration
    
    Environment variables are loaded from .env file (see .env.example)
    Vite exposes env vars prefixed with VITE_ via import.meta.env
*/

// Spotify API
export const SPOTIFY_CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
export const SPOTIFY_REDIRECT_URI = "http://127.0.0.1:5173/callback";
export const SPOTIFY_AUTH_URL = "https://accounts.spotify.com/authorize";
export const SPOTIFY_API_URL = "https://api.spotify.com/v1";

// LLM API (OpenAI or Gemini)
export const LLM_API_URL = import.meta.env.VITE_LLM_API_URL;
export const LLM_API_KEY = import.meta.env.VITE_LLM_API_KEY;

