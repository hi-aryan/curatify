"use client";
import { useEffect } from "react";
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
        console.log("Added to queue:", trackUri);
      }
    } catch (error) {
      console.error("Failed to add to queue:", error);
    }
  }

  return (
    <MyStatsView
      topTracks={topTracks}
      topArtists={topArtists}
      topGenre={topGenre}
      onAddToQueue={handleAddToQueueACB}
    />
  );
}
