# Curatify - Spotify Curator

Spotify playlist curator with Nordic charts visualization and AI-powered recommendations.

## Project Structure

```
new-project/
├── index.html              # Entry HTML
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS for Tailwind
└── src/
    ├── main.jsx            # React entry point (renders App with Redux Provider)
    ├── App.jsx             # Root component with routing
    ├── index.css           # Tailwind imports
    ├── apiConfig.js        # API endpoints and keys
    ├── resolvePromise.js   # Promise state helper (from TW1-3)
    │
    ├── store/              # Redux store
    │   ├── index.js        # Store configuration
    │   ├── userSlice.js    # Auth state (isLoggedIn, profile)
    │   └── chartsSlice.js  # Charts state (selectedCountry, data)
    │
    ├── api/                # API source files
    │   ├── spotifySource.js    # Spotify API calls
    │   └── llmSource.js        # OpenAI/Gemini API calls
    │
    ├── presenters/         # Presenters (connect Redux to Views)
    │   ├── LandingPresenter.jsx
    │   └── DashboardPresenter.jsx
    │
    └── views/              # Views (pure presentation)
        ├── SuspenseView.jsx    # Loading/error states (reusable)
        ├── LandingView.jsx     # Public landing page
        └── DashboardView.jsx   # Authenticated dashboard
```

## MVP Pattern (from TW1-3)

### Model → Redux Store
- State is managed in Redux slices (`store/`)
- Each slice handles a domain (user, charts)
- Actions modify state via reducers

### View → Views
- Pure presentation components (`views/`)
- Receive data via props
- Fire **custom events** via callback props (`onXyz`)
- Use Tailwind for styling

### Presenter → Presenters
- Connect Redux state to Views (`presenters/`)
- Use `useSelector` to read state
- Define `xyzACB` functions that `dispatch` actions
- Pass state and callbacks to Views

## Naming Conventions

| Pattern | Usage | Example |
|---------|-------|---------|
| `ACB` | Async callbacks passed to Views | `loginClickACB` |
| `CB` | Array callbacks (map/filter) | `renderItemCB` |
| `onXyz` | Custom event props | `onLoginClick` |
| `xyzHandlerACB` | Native event handlers in Views | `clickHandlerACB` |

## Getting Started

```bash
cd new-project
npm install
npm run dev
```

## Next Steps

1. **Set up Spotify OAuth** in `apiConfig.js` and `spotifySource.js`
2. **Build the Nordic map** component for LandingView
3. **Implement chart fetching** in `chartsSlice.js`
4. **Add more Views/Presenters** as features grow
5. **Style with Tailwind** - update `tailwind.config.js` for theme

## Key Differences from TW1-3

| TW1-3 | Project |
|-------|---------|
| MobX `observable` | Redux `createSlice` |
| `observer()` wrapper | `useSelector` hook |
| Direct model mutation | `dispatch(action)` |
| Custom CSS | Tailwind classes |


## The Palette
(hardcoded in tailwind.config file)
bg-dark, text-dark → #2F2F2F
bg-light, text-light → #F8FFE5
bg-green, text-green, border-green → #6CE395
bg-blue, text-blue → #2757B2
bg-pink, text-pink → #EF476F