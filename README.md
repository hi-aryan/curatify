*still boiling*

## Local Development Setup

## Deployed app: Curatify.se 

Create a `.env` file in the project root with:

```
VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
VITE_SPOTIFY_REDIRECT_URI=http://127.0.0.1:5173/callback
VITE_LLM_API_URL=your_gemini_api_url
VITE_LLM_API_KEY=your_gemini_api_key
```

**Note**: `VITE_SPOTIFY_REDIRECT_URI` defaults to `http://127.0.0.1:5173/callback` if not set.
**Note**: A Spotify Premium account is required. To get whitelisted, contact ___ and provide your Spotify account email. 

Project description: 
Spotify playlist curator. Includes moodboard for specific songs, filtering by countries, genres, emotions, release date, as well as editing and sorting user playlists. 

What we have done:
- Spotify authentication working
- Personal stats page
- Landing view with Nordic top 50
- Playlist personality analysis using Gemini API

What we still plan to do:
- Implement persistence
- Sort playlist features + edit your own playlist
- Recommendations based on a song, genre, mood
- UI improvements (text, icons, layouts)
- Navigation bar
- Other features

Project file structure:

The project follows a Model-View-Presenter (MVP) architecture pattern.

**Core files:**
- `src/main.jsx` - Initializes React app with Redux store
- `src/App.jsx` - Handles routing and session restoration
- `src/apiConfig.js` - Centralizes API configuration from environment variables

**MVP architecture:**
- `src/presenters/` - Presenter components connecting Redux state to views
  - `LandingPresenter.jsx` - Landing page presenter
  - `DashboardPresenter.jsx` - Dashboard presenter
  - `CallbackPresenter.jsx` - OAuth callback handler
- `src/views/` - Pure presentation components
  - `LandingView.jsx` - Landing page view
  - `DashboardView.jsx` - Dashboard view
  - `SuspenseView.jsx` - Loading/error state view

**API layer:**
- `src/api/spotifyAuth.js` - OAuth PKCE flow and token management
- `src/api/spotifySource.js` - Spotify API fetch functions
- `src/api/llmSource.js` - Gemini API calls

**State management:**
- `src/store/userSlice.js` - Authentication and user data (profile, top artists/tracks/genre)
- `src/store/chartsSlice.js` - Nordic charts state and dummy playlist
- `src/store/index.js` - Redux store configuration

**UI components:**
- `src/components/` - Reusable components
  - `MoodboardCard.jsx` - Playlist moodboard display
  - `NordicMap.jsx` - Interactive Nordic countries map
  - `SongCard.jsx` - Song display component
  - `PlaylistDropZone.jsx` - Playlist drag-and-drop zone
  - `ui/` - shadcn/ui components (cards, buttons, dropdowns, etc.)

**Utilities and helpers:**
- `src/utils/dashboardUtils.js` - Data fetching and calculations
- `src/hooks/useMoodboard.js` - Custom hook for playlist analysis
- `src/lib/utils.js` - Shared utility functions
- `src/constants/moodboardPrompt.js` - LLM prompt templates

**Data:**
- `src/data/` - Static data files
  - Nordic charts CSV files (regional charts for DK, FI, NO, SE)
  - `nordicCharts.js` - CSV parser and data access

