import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListPlus } from "lucide-react";

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
export default function MyStatsView({
  topTracks,
  topArtists,
  topGenre,
  onAddToQueue,
}) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2">Your Listening Statistics</h1>
        <p className="text-light/60 mb-8">
          Deep dive into your music taste and listening history.
        </p>

        {/* Favorite Genre */}
        {topGenre ? (
          <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Your Favorite Genre
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-5xl font-bold capitalize text-green mb-4">
                {topGenre}
              </p>
              <p className="text-light/60">
                Based on your top 50 tracks on Spotify
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-light/40 bg-dark/40 mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
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
          <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
            <CardContent className="pt-6">
              {topArtists && topArtists.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {topArtists.map((artist, index) => (
                    <a
                      key={artist.id}
                      href={artist.external_urls?.spotify}
                      target="_blank"
                      rel="noreferrer"
                      className="p-4 border border-light/20 rounded-lg hover:border-green/50 hover:shadow-lg hover:shadow-green/10 transition-all duration-200 flex items-start gap-4"
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
                        <p className="font-semibold text-light truncate">
                          {artist.name}
                        </p>
                        <p className="text-sm text-light/60">
                          {artist.genres?.[0] || "Artist"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-light/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          Open on Spotify →
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
            </CardContent>
          </Card>
        </div>

        {/* Top Tracks */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
          <Card className="border-light/40 bg-dark/40 hover:shadow-xl hover:shadow-green/[0.05] transition-shadow">
            <CardContent className="pt-6">
              {topTracks && topTracks.length > 0 ? (
                <div className="space-y-3">
                  {topTracks.map((track, index) => (
                    <div
                      key={track.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-light/10 hover:border-green/30 hover:bg-green/5 transition-all duration-200"
                    >
                      <span className="text-xl font-bold text-light/40 w-8 text-center flex-shrink-0">
                        {index + 1}
                      </span>

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
                  ))}
                </div>
              ) : (
                <p className="text-light/60 text-center py-8">
                  Loading tracks...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
