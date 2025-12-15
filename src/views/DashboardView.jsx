/*
    DashboardView: the authenticated user's dashboard
    
    Displays personalized features:
    - Playlist sorting
    - Song recommendations from LLM
    - Personality review
    
    Props:
    - profile: user's Spotify profile
    - favoriteArtist: top artist info { name, image, url }
    - topTracks: array of top 3 tracks from Spotify
    - topArtists: array of top artists from Spotify
    - topGenre: favorite genre calculated from top 50 tracks
    - onLogout: callback when user logs out
    - onNavigateToLanding: callback when user clicks to go to landing page
    - geminiPrompt: current prompt input for Gemini test
    - geminiResponse: response text from Gemini API
    - geminiLoading: whether Gemini API call is in progress
    - geminiError: error message if Gemini API call failed
    - onGeminiPromptChange: callback when prompt input changes
    - onTestGemini: callback to trigger Gemini API test
    - playlists: array of user's playlists
    - selectedPlaylistId: currently selected playlist ID
    - onPlaylistSelect: callback when playlist is selected
    - onAnalyzePlaylist: callback to trigger playlist analysis
    - moodboardAnalysis: analysis result object
    - moodboardLoading: whether analysis is in progress
    - moodboardError: error message if analysis failed
*/
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CollapsibleCard } from "@/components/ui/collapsible-card";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { MoodboardCard } from "@/components/MoodboardCard";

export function DashboardView(props) {
    function logoutClickHandlerACB() {
        props.onLogout();
    }

    function navigateToLandingHandlerACB() {
        props.onNavigateToLanding();
    }

    return (
        <div className="min-h-screen">
            {/* Header with user info */}
            <header className="p-8 flex flex-wrap gap-6 justify-between items-center">
                <div className="flex items-center gap-4">
                    {props.profile?.images?.[0]?.url && (
                        <DropdownMenu
                            trigger={
                                <img
                                    src={props.profile.images[0].url}
                                    alt="Profile"
                                    className="w-12 h-12 rounded-full cursor-pointer transition-transform duration-200 hover:scale-110"
                                />
                            }
                        >
                            <Button
                                onClick={logoutClickHandlerACB}
                                variant="outline"
                                className="hover:-rotate-2 hover:scale-105 transition-all duration-200"
                            >
                                Logout
                            </Button>
                            <Button
                                onClick={props.onNavigateToAbout}
                                variant="outline"
                                className="w-full mt-2 hover:-rotate-2 hover:scale-105 transition-all duration-200"
                            >
                                About
                            </Button>
                        </DropdownMenu>
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
                        <p className="text-lg font-semibold group">
                            {(props.favoriteArtist?.name || "Not available").split('').map((char, index) => (
                                <span
                                    key={`${char}-${index}`}
                                    className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-green"
                                    style={{ transitionDelay: `${index * 30}ms` }}
                                >
                                    {char === ' ' ? '\u00A0' : char}
                                </span>
                            ))}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        onClick={navigateToLandingHandlerACB}
                        variant="outline"
                        className="hover:-rotate-2 hover:scale-105 transition-all duration-200"
                    >
                        Home
                    </Button>
                </div>
            </header>

            {/* Features grid - placeholders */}
            <section className="p-8 grid gap-6 md:grid-cols-2">
                <Card className="border-light/40 bg-dark/40">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Sort Playlists</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-light opacity-60">Coming soon</p>
                    </CardContent>
                </Card>

                <Card className="border-light/40 bg-dark/40">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-light opacity-60">AI-powered song suggestions</p>
                    </CardContent>
                </Card>

                <MoodboardCard
                    playlists={props.playlists}
                    selectedPlaylistId={props.selectedPlaylistId}
                    onPlaylistSelect={props.onPlaylistSelect}
                    onAnalyze={props.onAnalyzePlaylist}
                    analysis={props.moodboardAnalysis}
                    loading={props.moodboardLoading}
                    error={props.moodboardError}
                />

                <CollapsibleCard 
                    title="Listening Statistics"
                    peekContent={
                        /* Top 3 Tracks - Always visible */
                        <div>
                            <h3 className="text-sm uppercase tracking-wide opacity-70 mb-3">Top 3 Tracks</h3> {/* TODO: this week? more specific! */}
                            {props.topTracks && props.topTracks.length > 0 ? (
                                <div className="space-y-2">
                                    {props.topTracks.map((track, index) => (
                                        <div key={track.id} className="flex items-center gap-3">
                                            <span className="text-xl font-bold text-light/40 w-6 text-center">{index + 1}</span>
                                            {track.album?.images?.[2]?.url && (
                                                <img
                                                    src={track.album.images[2].url}
                                                    alt={track.name}
                                                    className="w-10 h-10 rounded object-cover"
                                                />
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <a
                                                    href={track.external_urls?.spotify}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block font-semibold truncate transition-colors duration-150 hover:text-green"
                                                >
                                                    {track.name}
                                                </a>
                                                <p className="text-sm opacity-70 truncate">
                                                    {track.artists?.map(a => a.name).join(', ')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm opacity-60">Loading tracks...</p>
                            )}
                        </div>
                    }
                >
                    <div className="space-y-6 pt-2">
                        {/* Favorite Genre */}
                        {props.topGenre ? (
                            <div className="border border-light/30 rounded p-4 bg-dark/30">
                                <p className="text-xs uppercase tracking-wide text-light/70 mb-2">
                                    Your Favorite Genre
                                </p>
                                <p className="text-2xl font-semibold capitalize text-light group">
                                    {props.topGenre.split('').map((char, index) => (
                                        <span
                                            key={`${char}-${index}`}
                                            className="inline-block transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:text-green"
                                            style={{ transitionDelay: `${index * 30}ms` }}
                                        >
                                            {char === ' ' ? '\u00A0' : char}
                                        </span>
                                    ))}
                                </p>
                                <p className="text-xs text-light/60 mt-2">Based on your top 50 tracks</p>
                            </div>
                        ) : (
                            <div className="border border-light/30 rounded p-4 bg-dark/20">
                                <p className="text-xs uppercase tracking-wide text-light/70 mb-2">Your Favorite Genre</p>
                                <p className="text-sm text-light/60">Calculating...</p>
                            </div>
                        )}

                        {/* Top Artists */}
                        <div>
                            <h3 className="text-sm uppercase tracking-wide opacity-70 mb-3">Top Artists</h3>
                            {props.topArtists && props.topArtists.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {props.topArtists.slice(0, 5).map((artist) => (
                                        <a
                                            key={artist.id}
                                            href={artist.external_urls?.spotify}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 px-3 py-1.5 border border-light/30 rounded-full hover:bg-green/10 hover:border-green/50 hover:text-green transition-all duration-200"
                                        >
                                            {artist.images?.[2]?.url && (
                                                <img
                                                    src={artist.images[2].url}
                                                    alt={artist.name}
                                                    className="w-6 h-6 rounded-full object-cover"
                                                />
                                            )}
                                            <span className="text-sm font-medium">{artist.name}</span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm opacity-60">Loading artists...</p>
                            )}
                        </div>
                    </div>
                </CollapsibleCard>

            </section>
        </div>
    );
}

