import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * MoodboardCard: Displays playlist mood analysis
 * 
 * Props:
 * - playlists: Array of user playlists
 * - selectedPlaylistId: Currently selected playlist ID
 * - onPlaylistSelect: Callback when playlist is selected
 * - onAnalyze: Callback to trigger analysis
 * - analysis: Analysis result { averages: {...}, topSongs: {...} }
 * - loading: Whether analysis is in progress
 * - error: Error message if analysis failed
 */
export function MoodboardCard({ playlists, selectedPlaylistId, onPlaylistSelect, onAnalyze, analysis, loading, error }) {
    const categories = [
        { key: 'happiness', label: 'Happiness', color: 'text-green' },
        { key: 'sadness', label: 'Sadness', color: 'text-blue' },
        { key: 'energy', label: 'Energy', color: 'text-pink' },
        { key: 'aura', label: 'Aura', color: 'text-green' }
    ];

    return (
        <Card className="border-light/40 bg-dark/40">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Personality - Moodboard</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <select
                            value={selectedPlaylistId || ""}
                            onChange={(e) => onPlaylistSelect(e.target.value)}
                            disabled={loading || !playlists?.length}
                            className="flex-1 px-3 py-2 border border-light/30 rounded bg-dark text-light focus:outline-none focus:border-green/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <option value="">Choose a playlist...</option>
                            {playlists?.map((playlist) => (
                                <option key={playlist.id} value={playlist.id}>
                                    {playlist.name}
                                </option>
                            ))}
                        </select>
                        <Button
                            onClick={onAnalyze}
                            disabled={loading || !selectedPlaylistId}
                            className="hover:bg-green/20 hover:border-green/50"
                            variant="outline"
                        >
                            {loading ? "Analyzing..." : "Analyze"}
                        </Button>
                    </div>

                    {error && (
                        <p className="text-sm text-pink">Error: {error}</p>
                    )}

                    {analysis && (
                        <div className="space-y-4 mt-4">
                            {/* Averages */}
                            <div className="flex gap-4 text-sm">
                                {categories.map(({ key, label, color }) => (
                                    <div key={key} className="flex-1 text-center">
                                        <p className="text-xs opacity-60 mb-1">{label}</p>
                                        <p className={`text-lg font-bold ${color}`}>
                                            {(analysis.averages?.[key] * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                ))}
                            </div>

                            {/* Top Songs */}
                            {analysis.topSongs && Object.entries(analysis.topSongs).map(([category, song]) => {
                                if (!song) return null;
                                return (
                                    <div key={category} className="flex items-center justify-between">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs uppercase tracking-wide opacity-70 capitalize">{category}</p>
                                            <p className="text-sm font-medium truncate text-light">{song.track_name}</p>
                                        </div>
                                        <span className="text-sm font-bold text-green ml-4">
                                            {(song.score * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

