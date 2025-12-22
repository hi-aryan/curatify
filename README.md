## Deployed app: [Curatify.se](https://curatify.se)

## Local Development Setup

### 1. Requirements
- **Node.js** (v18+)
- **Spotify Premium Account** (for playback/certain API features)
- **PostgreSQL Database** (local or cloud-hosted)

### 2. Environment Variables
Create a `.env` file in the root directory:

```bash
# Spotify API
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_spotify_id
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://127.0.0.1:3000/callback

# AI Analysis (Google Gemini)
NEXT_PUBLIC_LLM_API_URL=https://generativelanguage.googleapis.com/...
NEXT_PUBLIC_LLM_API_KEY=your_gemini_key

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/curatify
```

### 3. Installation & Database Sync
```bash
# Install dependencies
npm install

# Push database schema (Drizzle)
npx drizzle-kit push
```

### 4. Run the Dev Server
```bash
npm run dev
```

---

## Project Architecture (MVP Pattern)

The project follows the **Model-View-Presenter (MVP)** pattern to separate logic from presentation:

- **Presenters (`src/presenters/`)**: The "Brain." They handle side effects, fetch data (using Redux, Server Actions, or APIs), and pass props to Views. Examples: `DashboardPresenter.tsx`, `LandingPresenter.tsx`.
- **Views (`src/views/`)**: The "Face." Pure components that only render UI based on props. Examples: `DashboardView.tsx`, `MyStatsView.tsx`.
- **Model / Data Layer**:
  - `src/actions/`: Server Actions for database persistence (Social follows, user profile sync).
  - `src/db/`: Database schema and configuration via **Drizzle ORM**.
  - `src/api/`: Interfaces for Spotify and Gemini LLM.
  - `src/store/`: Redux Toolkit for global UI state.

---

## 3rd Party Components & Libraries

We use the following 3rd party tools to enhance the user experience. All are **user-visible** unless noted.

| Category | Library | Usage / Location |
| :--- | :--- | :--- |
| **UI Framework** | **Shadcn UI** | Core UI components: Buttons, Cards, Modals, Progress bars (e.g., `src/components/ui/progress.tsx` used in `QuizModal.tsx`). |
| **Visual Effects** | **Aceternity UI** | Premium effects: `Multi Step Loader` (during analysis) and `3D Card` (interactives). Located in `src/components/ui/`. |
| **Animations** | **Framer Motion** | Used for smooth UI transitions, song card hover effects, and infinite scrolls (`InfiniteTrackScroll.tsx`). |
| **Icons** | **Lucide / Tabler** | Integrated within Shadcn components for intuitive navigation. |
| **Data Flow**| **Redux Toolkit** | (Internal) Manages user sessions and UI state across the App Router. |

---

## Features and Core Utilities

- **Music Quiz & Personality**: Classifies your music taste. Logic handled in `src/utils/quizUtils.ts` and rendered via `QuizModal.tsx`.
- **Social Layer**: Search and follow friends to see their top artists. Handled via `src/actions/friendActions.ts`.
- **AI Moodboards**: AI-generated personality analysis of your playlists using Gemini API.
- **Nordic Charts**: Interactive map of Nordic top tracks (DK, FI, NO, SE).
- **User Persistence**: Automatic syncing of your Spotify profile and quiz results to our database via `src/utils/userUtils.ts` and `src/actions/userActions.ts`.
