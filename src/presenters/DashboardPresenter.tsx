"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  logout,
  setTopArtist,
  setTopTracks,
  setTopArtists,
  setTopGenre,
} from "../store/userSlice";
import { clearTokenData, getValidAccessToken } from "../api/spotifyAuth";
import { DashboardView } from "../views/DashboardView";
import {
  fetchTopArtist,
  fetchTopTracks,
  fetchTopArtists,
  fetchTopGenre,
} from "../utils/dashboardUtils";
import { getAiRecommendations } from "../api/llmSource";

import { getUserPlaylists, addItemToQueue } from "../api/spotifySource";
import { useMoodboard } from "../hooks/useMoodboard";

/*
    DashboardPresenter: connects Redux store to DashboardView
    
    Pattern:
    - Read user state from Redux
    - Call utils for data fetching/orchestration
    - Dispatch actions to update state
    - Pass to View as props
*/
export function DashboardPresenter() {
  const dispatch = useDispatch();
  const router = useRouter();
  const profile = useSelector((state: any) => state.user.profile);
  const isLoggedIn = useSelector((state: any) => state.user.isLoggedIn);

  // Auth Protection
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);
  const topArtist = useSelector((state: any) => state.user.topArtist);
  const topTracks = useSelector((state: any) => state.user.topTracks);
  const topArtists = useSelector((state: any) => state.user.topArtists);
  const topGenre = useSelector((state: any) => state.user.topGenre);

  // Moodboard state - hook gets its own token internally
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const {
    analysis: moodboardAnalysis,
    loading: moodboardLoading,
    error: moodboardError,
    analyze: analyzePlaylist,
  } = useMoodboard();

  // AI Recommendations state
  const [recommendations, setRecommendations] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);

  // Load dashboard data and playlists
  useEffect(() => {
    async function loadDashboardDataACB() {
      const accessToken = await getValidAccessToken();
      if (!accessToken) return;

      // Load playlists
      try {
        const response = await getUserPlaylists(accessToken, { limit: 50 });
        setPlaylists(response?.items || []);
      } catch (error) {
        console.error("Failed to fetch playlists:", error);
      }

      // Load top artist
      if (!topArtist) {
        try {
          const artist = await fetchTopArtist(accessToken);
          if (artist) dispatch(setTopArtist(artist));
        } catch (error) {
          console.error("Failed to fetch top artist:", error);
        }
      }

      // Load top tracks
      if (!topTracks) {
        try {
          const tracks = await fetchTopTracks(accessToken, 3);
          dispatch(setTopTracks(tracks));
        } catch (error) {
          console.error("Failed to fetch top tracks:", error);
        }
      }

      // Load top artists
      if (!topArtists) {
        try {
          const artists = await fetchTopArtists(accessToken, 10);
          dispatch(setTopArtists(artists));
        } catch (error) {
          console.error("Failed to fetch top artists:", error);
        }
      }

      // Load top genre
      if (!topGenre) {
        try {
          const genre = await fetchTopGenre(accessToken);
          if (genre) dispatch(setTopGenre(genre));
        } catch (error) {
          console.error("Failed to fetch top genre:", error);
        }
      }
    }

    loadDashboardDataACB();
  }, [topArtist, topTracks, topArtists, topGenre, dispatch]);

  function logoutACB() {
    clearTokenData();
    dispatch(logout());
    window.location.href = window.location.origin;
  }

  function analyzePlaylistACB() {
    analyzePlaylist(selectedPlaylistId);
  }

  async function handleGetRecommendationsACB() {
    if (!topTracks || !topArtists || !topGenre) {
      setRecError("Missing profile data. Please play more music on Spotify!");
      return;
    }

    setRecLoading(true);
    setRecError(null);

    try {
      const data = await getAiRecommendations(topTracks, topArtists, topGenre);
      if (data && data.recommendations) {
        setRecommendations(data.recommendations);
      } else {
        setRecError("Failed to get valid recommendations.");
      }
    } catch (error) {
      console.error("Recommendation Error:", error);
      setRecError(`Error: ${error.message}`);
    } finally {
      setRecLoading(false);
    }
  }

  function navigateToLandingACB() {
    router.push("/");
  }

  function navigateToAboutACB() {
    router.push("/about");
  }

  async function addToQueueACB(trackUri) {
    if (!trackUri) return;
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        await addItemToQueue(trackUri, accessToken);
        // Optional: Show success toast/alert
        console.log("Added to queue:", trackUri);
      }
    } catch (error) {
      console.error("Failed to add to queue:", error);
    }
  }

  return (
    <DashboardView
      profile={profile}
      favoriteArtist={topArtist}
      topTracks={topTracks}
      topArtists={topArtists}
      topGenre={topGenre}
      onLogout={logoutACB}
      onNavigateToLanding={navigateToLandingACB}
      onNavigateToAbout={navigateToAboutACB}
      playlists={playlists}
      selectedPlaylistId={selectedPlaylistId}
      onPlaylistSelect={setSelectedPlaylistId}
      onAnalyzePlaylist={analyzePlaylistACB}
      moodboardAnalysis={moodboardAnalysis}
      moodboardLoading={moodboardLoading}
      moodboardError={moodboardError}
      onAddToQueue={addToQueueACB}
      // AI Recommendations props
      recommendations={recommendations}
      recLoading={recLoading}
      recError={recError}
      onGetRecommendations={handleGetRecommendationsACB}
    />
  );
}
