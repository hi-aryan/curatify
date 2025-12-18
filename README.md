_still boiling_

## Local Development Setup

## Deployed app: Curatify.se

Create a `.env` file in the project root with:

```
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_client_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback
NEXT_PUBLIC_LLM_API_URL=your_gemini_api_url
NEXT_PUBLIC_LLM_API_KEY=your_gemini_api_key
```

**Note**: `NEXT_PUBLIC_SPOTIFY_REDIRECT_URI` defaults to `http://127.0.0.1:3000/callback` if not set.
**Note**: A Spotify Premium account is required. To get whitelisted, contact \_\_\_ and provide your Spotify account email.

Project description:
Spotify playlist curator. Includes moodboard for specific songs, filtering by countries, genres, emotions, release date, as well as editing and sorting user playlists.

What we have done:

- **Migration to Next.js App Router** (v16)
- Spotify authentication working (PKCE flow)
- Personal stats page
- Landing view with Nordic top 50
- Playlist personality analysis using Gemini API

What we still plan to do:

- **Database Integration (Postgres + Drizzle)** for user persistence
- Sort playlist features + edit your own playlist
- Recommendations based on a song, genre, mood
- UI improvements (text, icons, layouts)
- Navigation bar

Project file structure:

The project follows a Model-View-Presenter (MVP) architecture pattern adapted for Next.js.

**Core files:**

- `src/app/layout.jsx` - Root layout with Redux StoreProvider
- `src/app/page.jsx` - Main entry controller
- `src/app/AppInitializer.jsx` - Handles session restoration on mount
- `src/apiConfig.js` - Centralizes API configuration from environment variables

**MVP architecture:**

- `src/presenters/` - Client Components (`'use client'`) connecting Redux state to views
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

## Used 3rd Party Components & Libraries

### UI & Styling

- **Shadcn UI**: Used for core UI components (Cards, Buttons, Sidebar, Dropdowns, etc.), built on Radix UI and Tailwind CSS.
- **Aceternity UI**:
  - `Multi Step Loader` (for analysis loading states)
  - `3D Card` (visual effects in NordicMap)
- **Framer Motion**: Used for fluid animations.
- **Lucide React** & **Tabler Icons**: Icon sets.

### Data & State

- **Redux Toolkit**: Global state management.
- **Drizzle ORM** & **PostgreSQL**: Backend database and ORM.

### APIs

- **Spotify Web API**: Music data and user authentication.
- **Google Gemini API**: LLM for playlist mood analysis.
