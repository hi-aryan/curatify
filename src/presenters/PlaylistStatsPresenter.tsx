"use client";
import { useEffect, useState } from "react";
import { getValidAccessToken } from "../api/spotifyAuth";
import { getUserPlaylists, addItemToQueue } from "../api/spotifySource";
import { useMoodboard } from "../hooks/useMoodboard";
import PlaylistStatsView from "../views/PlaylistStatsView";

/*
    PlaylistStatsPresenter: handles moodboard analysis and playlist stats
    
    Pattern:
    - Fetch user playlists from Spotify
    - Use useMoodboard hook to analyze selected playlist
    - Handle playlist selection and analysis
*/
export function PlaylistStatsPresenter() {
  // Moodboard state - hook gets its own token internally
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const {
    analysis: moodboardAnalysis,
    loading: moodboardLoading,
    error: moodboardError,
    analyze: analyzePlaylist,
  } = useMoodboard();

  // Fetch playlists on mount
  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const accessToken = await getValidAccessToken();
        if (accessToken) {
          const playlistsResponse = await getUserPlaylists(accessToken);
          setPlaylists(playlistsResponse?.items || []);
        }
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }
    }

    fetchPlaylists();
  }, []);

  const handlePlaylistSelect = (playlistId: string) => {
    setSelectedPlaylistId(playlistId);
  };

  const handleAnalyzePlaylist = async () => {
    if (!selectedPlaylistId) return;
    await analyzePlaylist(selectedPlaylistId);
  };

  const handleAddToQueue = async (trackUri: string) => {
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        await addItemToQueue(trackUri, accessToken);
      }
    } catch (error) {
      console.error("Failed to add to queue:", error);
    }
  };

  return (
    <PlaylistStatsView
      playlists={playlists}
      selectedPlaylistId={selectedPlaylistId}
      onPlaylistSelect={handlePlaylistSelect}
      onAnalyze={handleAnalyzePlaylist}
      analysis={moodboardAnalysis}
      loading={moodboardLoading}
      error={moodboardError}
      onAddToQueue={handleAddToQueue}
    />
  );
}
