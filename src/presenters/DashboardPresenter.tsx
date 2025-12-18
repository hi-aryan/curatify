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
import { RootState } from "../store/store";
import { clearTokenData, getValidAccessToken } from "../api/spotifyAuth";
import { DashboardView } from "../views/DashboardView";
import {
  fetchTopArtist,
  fetchTopTracks,
  fetchTopArtists,
  fetchTopGenre,
} from "../utils/dashboardUtils";
import {
  followUser,
  getFollowedUsers,
  searchUsers,
  unfollowUser,
} from "../actions/friendActions";

import { addItemToQueue, getUserPlaylists } from "../api/spotifySource";
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

  // Moodboard state - hook gets its own token internally
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState("");
  const {
    analysis: moodboardAnalysis,
    loading: moodboardLoading,
    error: moodboardError,
    analyze: analyzePlaylist,
  } = useMoodboard();

  // Friends State
  const [followedUsers, setFollowedUsers] = useState<any[]>([]);
  const [followLoading, setFollowLoading] = useState(false);
  const [followError, setFollowError] = useState<string | null>(null);

  // UI State moved from View (MVP)
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [friendInput, setFriendInput] = useState("");
  // Search State
  const [searchResults, setSearchResults] = useState<any[]>([]); // New for Search
  const [searchLoading, setSearchLoading] = useState(false); // New for Search

  // Load dashboard data and playlists
  useEffect(() => {
    async function loadDashboardDataACB() {
      try {
        const accessToken = await getValidAccessToken();

        // If getting a valid token fails (session dead), logout and redirect
        if (!accessToken) {
          console.warn("Session invalid or expired. Logging out.");
          logoutACB();
          return;
        }

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

        // Load followed users
        try {
          const followed = await getFollowedUsers(profile?.id);
          setFollowedUsers(followed || []);
        } catch (error) {
          console.error("Failed to load followed users:", error);
          setFollowError("Failed to load friends list. Please try refreshing.");
        }
      } catch (error) {
        console.error("Critical dashboard loading error:", error);
        // On unexpected critical errors, logout to be safe
        logoutACB();
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

  function navigateToLandingACB() {
    router.push("/");
  }

  function navigateToAboutACB() {
    router.push("/about");
  }

  async function handleFollowUserACB(targetName: string) {
    setFollowLoading(true);
    setFollowError(null);
    try {
      const result = await followUser(profile?.id, targetName);
      if (result.success) {
        // Reload list
        const followed = await getFollowedUsers(profile?.id);
        setFollowedUsers(followed || []);
      } else {
        setFollowError(result.error || "Failed to follow user");
      }
    } catch (error) {
      setFollowError("An unexpected error occurred");
      console.error(error);
    } finally {
      setFollowLoading(false);
    }
  }

  function handleFriendsOpen(open: boolean) {
    setIsFriendsOpen(open);
    if (!open) {
      setFriendInput("");
      setFollowError(null);
      setSearchResults([]); // Reset search
    }
  }

  function handleFriendInputChange(val: string) {
    setFriendInput(val);
  }

  // --- New Logic: Search First ---
  async function handleSearchUsersACB(e: React.FormEvent) {
    e.preventDefault();
    if (!friendInput.trim()) return;

    setSearchLoading(true);
    setFollowError(null);

    try {
      const results = await searchUsers(profile?.id, friendInput.trim());
      setSearchResults(results || []);

      if (results && results.length === 0) {
        setFollowError("No users found.");
      }
    } catch (err) {
      console.error(err);
      setFollowError("Error searching users.");
    } finally {
      setSearchLoading(false);
    }
  }

  async function handleUnfollowUserACB(targetUserId: number) {
    if (!confirm("Are you sure you want to unfollow?")) return;

    setFollowLoading(true);
    try {
      const result = await unfollowUser(profile?.id, targetUserId);
      if (result.success) {
        // Update list locally for speed
        setFollowedUsers((prev) => prev.filter((u) => u.id !== targetUserId));
      } else {
        console.error(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFollowLoading(false);
    }
  }

  async function handleAddFriendACB(targetNameOrId: string) {
    // Direct add from search result
    await handleFollowUserACB(targetNameOrId);
    // Clean up search after adding? optional.
    // setSearchResults([]);
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
      // Friends Props
      followedUsers={followedUsers}
      followLoading={followLoading}
      followError={followError}
      // UI Props (MVP Refactor)
      isFriendsOpen={isFriendsOpen}
      friendInput={friendInput}
      onFriendsOpen={handleFriendsOpen}
      onFriendInputChange={handleFriendInputChange}
      onSearchUsers={handleSearchUsersACB}
      searchResults={searchResults}
      searchLoading={searchLoading}
      onAddFriend={handleAddFriendACB}
      onUnfollowUser={handleUnfollowUserACB}
    />
  );
}
