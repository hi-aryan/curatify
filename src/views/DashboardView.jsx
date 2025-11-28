/*
    DashboardView: the authenticated user's dashboard
    
    Displays personalized features:
    - Playlist sorting
    - Song recommendations from LLM
    - Personality review
    
    Props:
    - profile: user's Spotify profile
    - favoriteArtist: top artist info { name, image }
    - onLogout: callback when user logs out
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
                    {props.favoriteArtist?.image && (
                        <img
                            src={props.favoriteArtist.image}
                            alt={props.favoriteArtist.name}
                            className="w-12 h-12 rounded-full border border-light/40"
                        />
                    )}
                    <div className="text-right">
                        <p className="text-xs uppercase tracking-wide opacity-70">Favourite artist</p>
                        <p className="text-lg font-semibold">
                            {props.favoriteArtist?.name || "Not available"}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={logoutClickHandlerACB}
                    className="px-4 py-2 border border-light rounded"
                >
                    Logout
                </button>
            </header>

            {/* Features grid - placeholders */}
            <section className="p-8 grid gap-6 md:grid-cols-2">
                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Sort Playlists</h2>
                    <p className="text-light">Organize your playlists</p>
                </div>

                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Recommendations</h2>
                    <p className="text-light">AI-powered song suggestions</p>
                </div>

                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Personality</h2>
                    <p className="text-light">Your music personality</p>
                </div>

                <div className="border-2 border-dashed border-light p-6">
                    <h2 className="text-xl font-semibold mb-2">Stats</h2>
                    <p className="text-light">Your listening stats</p>
                </div>
            </section>
        </div>
    );
}

