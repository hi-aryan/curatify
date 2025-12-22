"use client";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../store/store";
import { getValidAccessToken } from "../api/spotifyAuth";
import { addItemToQueue } from "../api/spotifySource";
import { setTopTracks, setTopArtists, setTopGenre } from "../store/userSlice";
import {
  fetchTopTracks,
  fetchTopArtists,
  fetchTopGenre,
} from "../utils/dashboardUtils";
import MyStatsView from "../views/MyStatsView";

/*
    MyStatsPresenter: handles user listening statistics
    
    Pattern:
    - Fetch user's top tracks, artists, and favorite genre
    - Store data in Redux
    - Handle adding tracks to Spotify queue
*/
export function MyStatsPresenter() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);
  const [queueNotification, setQueueNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // UI state for visibility (MVP Refactor)
  const [visibleArtistsCount, setVisibleArtistsCount] = useState(6);
  const [showAllTracks, setShowAllTracks] = useState(false);

  // Auth Protection
  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const topTracks = useSelector((state: RootState) => state.user.topTracks);
  const topArtists = useSelector((state: RootState) => state.user.topArtists);
  const topGenre = useSelector((state: RootState) => state.user.topGenre);

  // Load statistics data on mount
  useEffect(() => {
    async function loadStatsDataACB() {
      const accessToken = await getValidAccessToken();
      if (!accessToken) return;

      // Load top tracks (50 for detailed view)
      if (!topTracks) {
        try {
          const tracks = await fetchTopTracks(accessToken, 50);
          dispatch(setTopTracks(tracks));
        } catch (error) {
          console.error("Failed to fetch top tracks:", error);
        }
      }

      // Load top artists (50 for detailed view)
      if (!topArtists) {
        try {
          const artists = await fetchTopArtists(accessToken, 50);
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

    loadStatsDataACB();
  }, [topTracks, topArtists, topGenre, dispatch]);

  async function handleAddToQueueACB(trackUri: string) {
    if (!trackUri) return;
    try {
      const accessToken = await getValidAccessToken();
      if (accessToken) {
        await addItemToQueue(trackUri, accessToken);
        setQueueNotification({
          type: "success",
          message: "Added to queue! Check your Spotify app 👀",
        });
        setTimeout(() => setQueueNotification(null), 3000);
      }
    } catch (error: any) {
      console.error("Failed to add to queue:", error);
      if (error.message && error.message.includes("404")) {
        setQueueNotification({
          type: "error",
          message:
            "No active device found. Please start playing music in Spotify on a device to use this feature.",
        });
      } else {
        setQueueNotification({
          type: "error",
          message: "Failed to add to queue. Please try again.",
        });
      }
    }
  }

  function handleCloseQueueNotificationACB() {
    setQueueNotification(null);
  }

  function handleShowMoreArtistsACB() {
    setVisibleArtistsCount((prev) => prev + 6);
  }

  function handleShowLessArtistsACB() {
    setVisibleArtistsCount(6);
  }

  function handleToggleTracksACB() {
    setShowAllTracks((prev) => !prev);
  }

  return (
    <MyStatsView
      topTracks={topTracks}
      topArtists={topArtists}
      topGenre={topGenre}
      onAddToQueue={handleAddToQueueACB}
      queueNotification={queueNotification}
      onCloseQueueNotification={handleCloseQueueNotificationACB}
      visibleArtistsCount={visibleArtistsCount}
      showAllTracks={showAllTracks}
      onShowMoreArtists={handleShowMoreArtistsACB}
      onShowLessArtists={handleShowLessArtistsACB}
      onToggleTracks={handleToggleTracksACB}
    />
  );
}
