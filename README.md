*still boiling*

## Local Development Setup

Create a `.env` file in the project root with:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
VITE_LLM_API_URL=your_gemini_api_url
VITE_LLM_API_KEY=your_gemini_api_key
```

**Note**: `VITE_SPOTIFY_REDIRECT_URI` defaults to `http://127.0.0.1:5173/callback` if not set.
**Note**: A Spotify Premium account is required. To get whitelisted, contact ___ and provide your Spotify account email. 