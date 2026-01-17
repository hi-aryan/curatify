import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus, ChevronDown, ChevronUp, Music } from "lucide-react";

/*
    MyStatsView: Deep dive into user's listening statistics
    
    Displays:
    - Top tracks (full list)
    - Favorite genre
    - Top artists (extended list)
    - Listening time metrics
    
    Props:
    - topTracks: array of top tracks from Spotify
    - topArtists: array of top artists from Spotify
    - topGenre: favorite genre calculated from top 50 tracks
    - onAddToQueue: callback to add track to Spotify queue
*/
interface MyStatsViewProps {
  topTracks: any[];
  topArtists: any[];
  topGenre: string;
  onAddToQueue: (uri: string) => void;
  queueNotification: any;
  onCloseQueueNotification: () => void;
  visibleArtistsCount: number;
  showAllTracks: boolean;
  onShowMoreArtists: () => void;
  onShowLessArtists: () => void;
  onToggleTracks: () => void;
}

export default function MyStatsView({
  topTracks,
  topArtists,
  topGenre,
  onAddToQueue,
  queueNotification,
  onCloseQueueNotification,
  visibleArtistsCount,
  showAllTracks,
  onShowMoreArtists,
  onShowLessArtists,
  onToggleTracks,
}: MyStatsViewProps) {
  return (
    <div className="min-h-screen md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Your Listening Statistics</h1>

        {queueNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-dark border border-light/20 rounded-xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 text-center">
              {queueNotification.type === "success" ? (
                <div className="w-12 h-12 rounded-full bg-green/20 text-green flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>
              )}
              <h3 className="text-lg font-bold mb-2">
                {queueNotification.type === "success"
                  ? "Success"
                  : "Action Required"}
              </h3>
              <p className="text-light/70 text-sm mb-6">
                {queueNotification.message}
              </p>
              <Button
                onClick={onCloseQueueNotification}
                className={`w-full ${
                  queueNotification.type === "success"
                    ? "bg-green hover:bg-green/90 text-dark"
                    : "bg-light/10 hover:bg-light/20 text-light"
                }`}
              >
                Okay
              </Button>
            </div>
          </div>
        )}

        {/* Favorite Genre */}
        {topGenre ? (
          <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent hover:border-green/40 hover:shadow-2xl hover:shadow-green/[0.1] transition-all duration-300 relative overflow-hidden group mb-8">
            <div className="absolute right-[-20px] top-[-20px] opacity-[0.03] group-hover:opacity-[0.1] transition-opacity duration-300 transform rotate-12 pointer-events-none">
              <Music size={200} />
            </div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-2xl font-semibold opacity-90">
                Your Favorite Genre
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <p className="text-5xl font-bold capitalize text-green mb-4">
                {topGenre}
              </p>
              <p className="text-light/60">
                Based on your top 50 tracks on Spotify
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-light/10 bg-gradient-to-br from-white/[0.08] to-transparent mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold opacity-90">
                Your Favorite Genre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-light/60">Calculating...</p>
            </CardContent>
          </Card>
        )}

        {/* Top Artists */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Top Artists</h2>
          <Card className="border-light/20 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
            <CardContent className="pt-6">
              {topArtists && topArtists.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {topArtists.slice(0, visibleArtistsCount).map((artist, index) => (
                    <a
                      key={artist.id}
                      href={artist.external_urls?.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="group relative p-4 border border-light/20 rounded-lg hover:border-green/50 hover:shadow-lg hover:shadow-green/10 transition-all duration-200 flex items-center gap-4 overflow-hidden"
                    >
                      {artist.images?.[0]?.url && (
                        <img
                          src={artist.images[0].url}
                          alt={artist.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs text-green font-semibold mb-1">
                          #{index + 1}
                        </div>
                        <p className="font-semibold text-light opacity-90 truncate group-hover:text-green transition-colors">
                          {artist.name}
                        </p>
                      </div>
                      <div className="absolute right-3 bottom-3 translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none">
                        <p className="text-[10px] text-green opacity-90 font-medium uppercase tracking-wider">
                          Open Spotify →
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-light/60 text-center py-8">
                  Loading artists...
                </p>
              )}

              {topArtists && (topArtists.length > visibleArtistsCount || visibleArtistsCount > 6) && (
                <div className="mt-8 flex justify-center gap-4">
                  {topArtists.length > visibleArtistsCount && (
                    <Button
                      variant="outline"
                      onClick={onShowMoreArtists}
                      className="border-light/20 text-light/80 hover:border-green/50 hover:text-green group transition-all"
                    >
                      Show 6 More
                      <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    </Button>
                  )}
                  {visibleArtistsCount > 6 && (
                    <Button
                      variant="outline"
                      onClick={onShowLessArtists}
                      className="border-light/20 text-light/80 hover:border-red-500/50 hover:text-red-400 group transition-all"
                    >
                      Show Less
                      <ChevronUp className="ml-2 w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Top Tracks */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
          <Card className="border-light/20 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
            <CardContent className="pt-6">
              {topTracks && topTracks.length > 0 ? (
                <div className="space-y-3">
                  {(showAllTracks ? topTracks : topTracks.slice(0, 10)).map(
                    (track, index) => (
                      <div
                        key={track.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-light/10 hover:border-green/30 hover:bg-green/5 transition-all duration-200"
                      >
                        <div className="flex flex-col items-center justify-center w-12 flex-shrink-0">
                          <span className="text-xl font-bold text-light/40">
                            {index + 1}
                          </span>
                          {track.trend === "up" && (
                            <div className="flex flex-col items-center text-green leading-none">
                              <span className="mt-1">▲</span>
                              {track.change > 0 && (
                                <span className="text-[10px] font-bold">
                                  {track.change}
                                </span>
                              )}
                            </div>
                          )}
                          {track.trend === "down" && (
                            <div className="flex flex-col items-center text-red-500 leading-none">
                              <span className="mt-1">▼</span>
                              {track.change > 0 && (
                                <span className="text-[10px] font-bold">
                                  {track.change}
                                </span>
                              )}
                            </div>
                          )}
                          {track.trend === "new" && (
                            <span className="text-[10px] font-bold text-blue-400 mt-1 uppercase">
                              New
                            </span>
                          )}
                          {track.trend === "same" && (
                            <span className="text-light/20 text-xs mt-1">-</span>
                          )}
                        </div>

                        {track.album?.images?.[2]?.url && (
                          <img
                            src={track.album.images[2].url}
                            alt={track.name}
                            className="w-12 h-12 rounded object-cover flex-shrink-0"
                          />
                        )}

                        <div className="flex-1 min-w-0">
                          <a
                            href={track.external_urls?.spotify}
                            target="_blank"
                            rel="noreferrer"
                            className="block font-semibold text-light truncate hover:text-green transition-colors duration-150"
                          >
                            {track.name}
                          </a>
                          <p className="text-sm text-light/60 truncate">
                            {track.artists?.map((a) => a.name).join(", ")}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-light/50 hover:text-green hover:bg-green/10 flex-shrink-0"
                          onClick={() => onAddToQueue && onAddToQueue(track.uri)}
                          title="Add to Spotify Queue"
                        >
                          <ListPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-light/60 text-center py-8">
                  Loading tracks...
                </p>
              )}

              {topTracks && topTracks.length > 10 && (
                <div className="mt-8 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={onToggleTracks}
                    className="border-light/20 text-light/80 hover:border-green/50 hover:text-green group transition-all"
                  >
                    {showAllTracks ? "Show Less" : "Show All 50 Tracks"}
                    {showAllTracks ? (
                      <ChevronUp className="ml-2 w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                    ) : (
                      <ChevronDown className="ml-2 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
