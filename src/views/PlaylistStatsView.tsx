import { MoodboardCard } from "@/components/MoodboardCard";

interface PlaylistStatsViewProps {
  playlists: any[];
  selectedPlaylistId: string;
  onPlaylistSelect: (playlistId: string) => void;
  onAnalyze: () => void;
  analysis: any;
  loading: boolean;
  error: string;
  onAddToQueue: (trackUri: string) => void;
}

export default function PlaylistStatsView({
  playlists,
  selectedPlaylistId,
  onPlaylistSelect,
  onAnalyze,
  analysis,
  loading,
  error,
  onAddToQueue,
}: PlaylistStatsViewProps) {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Playlist Stats</h1>
        <p className="text-light/60 mb-8">
          Deep dive into your playlists and discover their mood profiles.
        </p>

        <MoodboardCard
          playlists={playlists}
          selectedPlaylistId={selectedPlaylistId}
          onPlaylistSelect={onPlaylistSelect}
          onAnalyze={onAnalyze}
          analysis={analysis}
          loading={loading}
          error={error}
          onAddToQueue={onAddToQueue}
        />
      </div>
    </div>
  );
}
