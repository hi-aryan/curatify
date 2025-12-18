import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus, BarChart3 } from "lucide-react";

import { MultiStepLoader } from "@/components/ui/multi-step-loader";

const loadingStates = [
  { text: "Fetching playlist songs" },
  { text: "Analyzing artists" },
  { text: "Reading the lyrics" },
  { text: "Generating mood profile" },
  { text: "Combining the data" },
  { text: "Cooking up the results!" },
];

interface MoodboardTrack {
  id?: string;
  name: string;
  artists: { name: string }[];
  album?: { images: { url: string }[] };
  external_urls?: { spotify: string };
  score: number;
  uri?: string;
}

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
export function MoodboardCard({
  playlists,
  selectedPlaylistId,
  onPlaylistSelect,
  onAnalyze,
  analysis,
  loading,
  error,
  onAddToQueue,
}) {
  const categories = [
    {
      key: "happiness",
      label: "Happiness",
      topLabel: "Happiest song",
      color: "text-green",
    },
    {
      key: "sadness",
      label: "Sadness",
      topLabel: "Saddest song",
      color: "text-blue",
    },
    {
      key: "energy",
      label: "Energy",
      topLabel: "Most energetic song",
      color: "text-pink",
    },
    {
      key: "aura",
      label: "Aura",
      topLabel: "Strongest aura song",
      color: "text-green/80",
    },
  ];

  return (
    <Card className={cn(
      "border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/50 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 relative overflow-hidden group",
      loading && "min-h-[400px]"
    )}>
      <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-300 transform rotate-12 pointer-events-none">
        <BarChart3 size={200} />
      </div>
      <MultiStepLoader
        loadingStates={loadingStates}
        loading={loading}
        duration={3000}
        loop={false}
      />
      <CardHeader className="relative z-10">
        <CardTitle className="text-xl font-bold tracking-tight opacity-80">
          Your Playlist Moodboard
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4 my-2">
          <div className="flex gap-2">
            <select
              value={selectedPlaylistId || ""}
              onChange={(e) => onPlaylistSelect(e.target.value)}
              disabled={loading || !playlists?.length}
              className="flex-1 px-3 py-2 border border-light/10 rounded bg-dark/60 backdrop-blur-sm text-light focus:outline-none focus:border-green/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <option value="">Playlist to Analyze...</option>
              {playlists?.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
            <Button
              onClick={onAnalyze}
              disabled={loading || !selectedPlaylistId}
              className="bg-white/10 text-white hover:bg-green/80 hover:text-dark border-0 backdrop-blur-sm transition-all duration-300 font-semibold disabled:bg-white/5 disabled:text-white/50"
              variant="outline"
            >
              {loading ? "Analyzing..." : "Analyze"}
            </Button>
          </div>

          {error && <p className="text-sm text-pink">Error: {error}</p>}

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
              {analysis.topSongs &&
                Object.entries(analysis.topSongs).map(
                  ([category, track]: [string, MoodboardTrack]) => {
                    if (!track) return null;
                    const categoryInfo = categories.find(
                      (cat) => cat.key === category
                    );
                    const categoryLabel = categoryInfo?.topLabel || category;

                    return (
                      <div key={category} className="flex items-center gap-3">
                        {track.album?.images?.[2]?.url && (
                          <img
                            src={track.album.images[2].url}
                            alt={track.name}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs uppercase tracking-wide font-semibold opacity-90 mb-1.5 ${
                              categoryInfo?.color || "text-light"
                            }`}
                          >
                            {categoryLabel}
                          </p>
                          {track.external_urls?.spotify ? (
                            <a
                              href={track.external_urls.spotify}
                              target="_blank"
                              rel="noreferrer"
                              className="block font-semibold truncate transition-colors duration-150 hover:text-green"
                            >
                              {track.name}
                            </a>
                          ) : (
                            <p className="text-sm font-medium truncate text-light">
                              {track.name}
                            </p>
                          )}
                          <p className="text-sm opacity-70 truncate">
                            {track.artists?.map((a) => a.name).join(", ")}
                          </p>
                        </div>
                        <span
                          className={`text-sm font-bold ml-4 ${
                            categoryInfo?.color || "text-green"
                          }`}
                        >
                          {(track.score * 100).toFixed(1)}%
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light/50 hover:text-green hover:bg-green/10 ml-2"
                          onClick={() =>
                            onAnalyze && onAddToQueue
                              ? onAddToQueue(track.uri)
                              : null
                          }
                          title="Add to Spotify Queue"
                        >
                          <ListPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  }
                )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
