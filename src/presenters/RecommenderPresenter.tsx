"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";
import { clearTokenData, getValidAccessToken } from "../api/spotifyAuth";
import { getAiRecommendations } from "../api/llmSource";
import { addItemToQueue } from "../api/spotifySource";
import {
  setTopArtist,
  setTopTracks,
  setTopArtists,
  setTopGenre,
} from "../store/userSlice";
import {
  fetchTopArtist,
  fetchTopTracks,
  fetchTopArtists,
  fetchTopGenre,
} from "../utils/dashboardUtils";
import RecommenderView from "@/views/RecommenderView";

/*
    RecommenderPresenter: handles AI music recommendations
    
    Pattern:
    - Fetch user's top tracks, artists, and genre from Spotify
    - Use Gemini API to generate AI recommendations
    - Handle adding recommended songs to queue
*/
export function RecommenderPresenter() {
  const dispatch = useDispatch();
  const router = useRouter();
  const profile = useSelector((state: RootState) => state.user.profile);
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // Auth Protection
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const topArtist = useSelector((state: RootState) => state.user.topArtist);
  const topTracks = useSelector((state: RootState) => state.user.topTracks);
  const topArtists = useSelector((state: RootState) => state.user.topArtists);
  const topGenre = useSelector((state: RootState) => state.user.topGenre);

  // AI Recommendations state
  const [recommendations, setRecommendations] = useState(null);
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState(null);

  // Load top tracks, artists, and genre
  useEffect(() => {
    async function loadRecommenderDataACB() {
      const accessToken = await getValidAccessToken();
      if (!accessToken) return;

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

    loadRecommenderDataACB();
  }, [topTracks, topArtists, topGenre, dispatch]);

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

  async function handleAddToQueueACB(trackUri: string) {
    if (!trackUri) return;
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        await addItemToQueue(trackUri, accessToken);
        console.log("Added to queue:", trackUri);
      }
    } catch (error) {
      console.error("Failed to add to queue:", error);
    }
  }

  return (
    <RecommenderView
      recommendations={recommendations}
      recLoading={recLoading}
      recError={recError}
      onGetRecommendations={handleGetRecommendationsACB}
      onAddToQueue={handleAddToQueueACB}
      profile={profile}
    />
  );
}
