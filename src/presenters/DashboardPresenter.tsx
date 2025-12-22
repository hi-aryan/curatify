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
import { getUserFromDb, saveUserToDb } from "../actions/userActions";
import { getDeepAnalysis } from "../api/llmSource";
import { loadQuizPersistence } from "../utils/quizUtils";

import { addItemToQueue, getUserPlaylists } from "../api/spotifySource";
import { useMoodboard } from "../hooks/useMoodboard";

import { sanitizeArtistsForDb } from "../utils/userUtils";

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
  
  // Initialize loading based on whether data is missing
  const [genreLoading, setGenreLoading] = useState(!topGenre);

  // UI State moved from View (MVP)
  const [isFriendsOpen, setIsFriendsOpen] = useState(false);
  const [friendInput, setFriendInput] = useState("");
  // Search State
  const [searchResults, setSearchResults] = useState<any[]>([]); // New for Search
  const [searchLoading, setSearchLoading] = useState(false); // New for Search

  // Deep Analysis State
  const [dbUser, setDbUser] = useState<any>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<any>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showAnalysisSpotlight, setShowAnalysisSpotlight] = useState(false);

  // Persistence for AI Analysis to avoid redo on every mount/subpage navigation
  useEffect(() => {
    if (typeof window !== "undefined" && profile?.id) {
      const saved = localStorage.getItem(`analysis_${profile.id}`);
      if (saved) {
        try {
          setDeepAnalysis(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved analysis", e);
        }
      }
    }
  }, [profile?.id]);

  useEffect(() => {
    if (deepAnalysis && profile?.id) {
      localStorage.setItem(`analysis_${profile.id}`, JSON.stringify(deepAnalysis));
    }
  }, [deepAnalysis, profile?.id]);

  // Consolidate data loading and sync logic
  useEffect(() => {
    async function initializeDashboardACB() {
      if (!profile?.id || !isLoggedIn) return;

      try {
        // 1. Core Data: Token & Profile
        const accessToken = await getValidAccessToken();
        if (!accessToken) {
          logoutACB();
          return;
        }

        // 2. Fetch Dependent Data (Needed for Syncing/Analysis)
        // We fetch these first to ensure we have the results before syncing to DB
        let currentTopArtists = topArtists;
        
        const spotifyPromises = [
          !topArtist && fetchTopArtist(accessToken).then(a => a && dispatch(setTopArtist(a))),
          !topTracks && fetchTopTracks(accessToken, 50).then(t => dispatch(setTopTracks(t))),
          !topArtists && fetchTopArtists(accessToken, 50).then(a => {
            currentTopArtists = a; // Capture for sync below
            dispatch(setTopArtists(a));
          }),
          !topGenre && (async () => {
            setGenreLoading(true);
            try {
              const g = await fetchTopGenre(accessToken);
              if (g) dispatch(setTopGenre(g));
            } finally {
              setGenreLoading(false);
            }
          })(),
          getUserPlaylists(accessToken, { limit: 50 }).then(r => setPlaylists(r?.items || [])),
          getFollowedUsers(profile.id).then(f => setFollowedUsers(f || []))
        ];

        // Wait for Spotify data to be at least "on its way" or finished
        // We can run DB checks concurrently but MUST ensure sync waits for currentTopArtists
        const dbUserPromise = getUserFromDb(profile.id).then(async (user) => {
          const localQuiz = loadQuizPersistence();
          const hasLocal = !!(localQuiz?.completed && localQuiz.answers.length > 0);

          const dbHasQuiz = !!(Array.isArray(user?.quizAnswers) && user.quizAnswers.length > 0);
          
          if (hasLocal && !dbHasQuiz) {
            // First time onboarding detected
            setShowAnalysisSpotlight(true);
            
            if (!currentTopArtists) {
              console.log("⏳ Waiting for top artists before sync...");
              currentTopArtists = await fetchTopArtists(accessToken, 50);
            }

            // --- ROBUSTNESS: Client-side sanitization & Capping ---
            // We use the shared utility to keep the Next.js RPC/Server Action log lean.
            // This prevents the "GIGANTIC" terminal whitespace issue.
            const leanArtists = sanitizeArtistsForDb(currentTopArtists);

            console.log("🔄 Syncing local quiz to DB with fresh data...");
            await saveUserToDb({ 
              profile, 
              topArtists: leanArtists, 
              quizAnswers: localQuiz.answers 
            });
            const updatedUser = await getUserFromDb(profile.id);
            setDbUser(updatedUser);
          } else {
            setDbUser(user);
          }
        });

        await Promise.allSettled([...spotifyPromises, dbUserPromise]);
      } catch (error) {
        console.error("Dashboard init error:", error);
      }
    }

    initializeDashboardACB();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id, isLoggedIn, dispatch]);

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
  }

  async function handleTriggerAnalysisACB() {
    const quizAnswers = dbUser?.quizAnswers;
    const hasQuizValid = Array.isArray(quizAnswers) && quizAnswers.length > 0;
    
    if (!hasQuizValid || !topTracks || !topArtists) {
      console.warn("Analysis skipped: missing requirements", { hasQuizValid, hasTracks: !!topTracks, hasArtists: !!topArtists });
      return;
    }
    
    setAnalysisLoading(true);
    setAnalysisError(null);
    try {
      console.log("🧠 Triggering Deep Analysis with:", { quizAnswers, tracks: topTracks?.length, artists: topArtists?.length });
      const result = await getDeepAnalysis(topTracks, topArtists, quizAnswers);
      setDeepAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysisError("The music psychologist is busy. Please try again later.");
    } finally {
      setAnalysisLoading(false);
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
      genreLoading={genreLoading}
      // Analysis Props: Spotlight only for first-time session
      hasQuiz={showAnalysisSpotlight}
      deepAnalysis={deepAnalysis}
      analysisLoading={analysisLoading}
      analysisError={analysisError}
      onTriggerAnalysis={handleTriggerAnalysisACB}
    />
  );
}
