/*
    DashboardView: the authenticated user's dashboard
    
    Displays personalized features:
    - Playlist sorting
    - Song recommendations from LLM
    - Personality review
    
    Props:
    - profile: user's Spotify profile
    - favoriteArtist: top artist info { name, image, url }
    - onLogout: callback when user logs out
    - geminiPrompt: current prompt input for Gemini test
    - geminiResponse: response text from Gemini API
    - geminiLoading: whether Gemini API call is in progress
    - geminiError: error message if Gemini API call failed
    - onGeminiPromptChange: callback when prompt input changes
    - onTestGemini: callback to trigger Gemini API test
*/
export function DashboardView(props) {
    function logoutClickHandlerACB() {
        props.onLogout();
    }

    return (
        <div className="min-h-screen">
            {/* Header with user info */}
            <header className="p-8 flex flex-wrap gap-6 justify-between items-center">
                <div className="flex items-center gap-4">
                    {props.profile?.images?.[0]?.url && (
                        <img 
                            src={props.profile.images[0].url} 
                            alt="Profile" 
                            className="w-12 h-12 rounded-full"
                        />
                    )}
                    <div>
                        <h1 className="text-3xl font-bold">
                            Welcome, {props.profile?.display_name || "User"}
                        </h1>
                        <p className="text-sm opacity-70">{props.profile?.email}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {/* conditionally render link if .url is available */}
                    {props.favoriteArtist?.image && (
                        props.favoriteArtist?.url ? (
                            <a
                                href={props.favoriteArtist.url}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block transition-opacity hover:opacity-80"
                            >
                                <img
                                    src={props.favoriteArtist.image}
                                    alt={props.favoriteArtist.name}
                                    className="w-12 h-12 rounded-full object-cover border border-light/40"
                                />
                            </a>
                        ) : (
                            <img
                                src={props.favoriteArtist.image}
                                alt={props.favoriteArtist.name}
                                className="w-12 h-12 rounded-full object-cover border border-light/40"
                            />
                        )
                    )}
                    <div>
                        <p className="text-xs uppercase tracking-wide opacity-70">Favourite artist</p>
                        <p className="text-lg font-semibold">
                            {props.favoriteArtist?.name || "Not available"}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={logoutClickHandlerACB}
                    className="px-4 py-2 border border-light rounded hover:-rotate-2 hover:scale-105 transition-all duration-200"
                >
                    Logout
                </button>
            </header>

            {/* Features grid - placeholders */}
            <section className="p-8 grid gap-6 md:grid-cols-2">
                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Sort Playlists</h2>
                    <p className="text-light opacity-60">Organize your playlists</p>
                </div>

                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
                    <p className="text-light opacity-60">AI-powered song suggestions</p>
                </div>

                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Personality</h2>
                    <p className="text-light opacity-60">Your music personality</p>
                </div>

                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Stats</h2>
                    <p className="text-light opacity-60">Your listening stats</p>
                </div>

                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Gemini API Test</h2>
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                value={props.geminiPrompt || ""}
                                onChange={(e) => props.onGeminiPromptChange(e.target.value)}
                                placeholder="Enter a prompt to test Gemini API..."
                                className="w-full px-3 py-2 border border-light rounded bg-transparent text-light placeholder-light/50 focus:outline-none focus:border-light/80"
                                disabled={props.geminiLoading}
                            />
                        </div>
                        <button
                            onClick={props.onTestGemini}
                            disabled={props.geminiLoading || !props.geminiPrompt?.trim()}
                            className="px-4 py-2 border border-light rounded hover:bg-light/10 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                            {props.geminiLoading ? "Loading..." : "Test Gemini"}
                        </button>
                        {props.geminiError && (
                            <div className="p-3 border border-pink/50 rounded bg-pink/10">
                                <p className="text-sm text-pink">Error: {props.geminiError}</p>
                            </div>
                        )}
                        {props.geminiResponse && (
                            <div className="p-3 border border-light/40 rounded bg-light/5">
                                <p className="text-sm text-light whitespace-pre-wrap">{props.geminiResponse}</p>
                            </div>
                        )}
                    </div>
                </div>

            </section>
        </div>
    );
}

