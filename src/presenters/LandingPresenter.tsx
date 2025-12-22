"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  setSelectedCountry,
  addToPlaylist,
  removeFromPlaylist,
  reorderPlaylist,
  setDummyPlaylist,
} from "../store/chartsSlice";
import { redirectToSpotifyAuth, getValidAccessToken } from "../api/spotifyAuth";
import { addItemToQueue } from "../api/spotifySource";
import { RootState } from "../store/store";
import { LandingView } from "../views/LandingView";
import { getCountryTracks } from "../data/nordicCharts";
import { 
  QUIZ_QUESTIONS, 
  saveQuizPersistence, 
  loadQuizPersistence, 
  QuizAnswer 
} from "../utils/quizUtils";

/*
    LandingPresenter: connects Redux store to LandingView
    
    Pattern: 
    - Read state from Redux with useSelector
    - Define ACB functions that dispatch actions or handle navigation
    - Pass state and ACBs to View as props
*/
export function LandingPresenter() {
  const dispatch = useDispatch();
  const router = useRouter();

  const selectedCountry = useSelector(
    (state: RootState) => state.charts.selectedCountry
  );
  const dummyPlaylist = useSelector(
    (state: RootState) => state.charts.dummyPlaylist
  );
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn);

  // Get tracks for the selected country from local CSV data
  const countryTracks = selectedCountry
    ? getCountryTracks(selectedCountry)
    : [];

  // Quiz State
  const [quizStep, setQuizStep] = useState(0); // 0 means not started
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswer[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizDismissed, setQuizDismissed] = useState(false);
  const [queueNotification, setQueueNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isPlaylistLoaded, setIsPlaylistLoaded] = useState(false);

  // Load persistence on mount
  useEffect(() => {
    const saved = loadQuizPersistence();
    if (saved) {
      console.log("📝 Loading quiz persistence:", saved);
      setQuizAnswers(saved.answers);
      setQuizCompleted(saved.completed);
      setQuizDismissed(!!saved.dismissed);
      if (saved.answers.length > 0 && !saved.completed) {
        setQuizStep(saved.answers.length + 1);
      }
    }

    // Load dummy playlist persistence
    const savedPlaylist = localStorage.getItem("dummyPlaylist");
    if (savedPlaylist) {
      try {
        const tracks = JSON.parse(savedPlaylist);
        if (tracks.length > 0) {
          dispatch(setDummyPlaylist(tracks));
        }
      } catch (e) {
        console.error("Failed to load playlist persistence:", e);
      }
    }
    setIsPlaylistLoaded(true);
  }, [dispatch]);

  // Sync quiz persistence to localStorage
  useEffect(() => {
    if (quizAnswers.length > 0 || quizCompleted || quizDismissed) {
      saveQuizPersistence({
        answers: quizAnswers,
        completed: quizCompleted,
        selectedCountry,
        dismissed: quizDismissed
      });
    }
  }, [quizAnswers, quizCompleted, selectedCountry, quizDismissed]);

  // Sync dummy playlist persistence
  useEffect(() => {
    // Only save if we have finished the initial load attempt from storage
    if (isPlaylistLoaded) {
      localStorage.setItem("dummyPlaylist", JSON.stringify(dummyPlaylist));
    }
  }, [dummyPlaylist, isPlaylistLoaded]);

  // Effect to resume pending queue action after login
  useEffect(() => {
    // Resumption criteria:
    // 1. User is logged in
    // 2. Playlist data is actually in the store (length > 0)
    // 3. The pending action flag is in localStorage
    if (
      isLoggedIn && 
      dummyPlaylist.length > 0 && 
      localStorage.getItem("pendingQueueAction") === "true"
    ) {
      localStorage.removeItem("pendingQueueAction");
      handleQueueAllACB();
    }
  }, [isLoggedIn, dummyPlaylist.length]);

  function countryClickACB(countryCode) {
    dispatch(setSelectedCountry(countryCode));
    
    // Only trigger quiz if not already completed and not already browsing
    if (!quizCompleted && !quizDismissed) {
      setShowQuiz(true);
      setQuizStep(1);
    }
  }
  function handleQuizAnswerACB(answer: string) {
    if (answer === "RECALL") {
      setQuizDismissed(false);
      if (!quizCompleted) {
        setShowQuiz(true);
        if (quizStep === 0) setQuizStep(1);
      }
      return;
    }

    const currentQuestion = QUIZ_QUESTIONS[quizStep - 1];
    const newAnswers = [
      ...quizAnswers.filter(a => a.questionId !== currentQuestion.id),
      { questionId: currentQuestion.id, question: currentQuestion.question, answer }
    ];
    
    setQuizAnswers(newAnswers);

    if (quizStep < QUIZ_QUESTIONS.length) {
      setQuizStep(prev => prev + 1);
    } else {
      setQuizCompleted(true);
      setShowQuiz(false);
    }
  }

  function handleQuizCloseACB() {
    setShowQuiz(false);
    setQuizDismissed(true);
  }

  function addToPlaylistACB(track) {
    dispatch(addToPlaylist(track));
  }

  function removeFromPlaylistACB(trackId) {
    dispatch(removeFromPlaylist(trackId));
  }

  function reorderPlaylistACB(newOrder) {
    dispatch(reorderPlaylist(newOrder));
  }

  function loginClickACB() {
    redirectToSpotifyAuth();
  }

  function navigateToDashboardACB() {
    router.push("/dashboard");
  }

  function navigateToAboutACB() {
    router.push("/about");
  }
  
  async function handleQueueAllACB() {
    if (dummyPlaylist.length === 0) return;

    if (!isLoggedIn) {
      // Set flag to resume action after login
      localStorage.setItem("pendingQueueAction", "true");
      // Playlist is already persisted to localStorage via useEffect
      loginClickACB();
      return;
    }

    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        setQueueNotification({
          type: "error",
          message: "Authentication expired. Please sign in again.",
        });
        return;
      }

      // Add each track to queue
      // We do this sequentially to avoid overwhelming the API and for better error reporting
      for (const track of dummyPlaylist) {
        await addItemToQueue(track.uri, accessToken);
      }

      setQueueNotification({
        type: "success",
        message: "Added to queue! Check your Spotify app 👀",
      });
      setTimeout(() => setQueueNotification(null), 5000);
    } catch (error: any) {
      console.error("Failed to add to queue:", error);
      if (error.message && error.message.includes("404")) {
        setQueueNotification({
          type: "error",
          message: "No active device found. Start playing Spotify on a device first!",
        });
      } else {
        setQueueNotification({
          type: "error",
          message: "Failed to add to queue. Please try again.",
        });
      }
    }
  }

  function closeQueueNotificationACB() {
    setQueueNotification(null);
  }

  return (
    <LandingView
      selectedCountry={selectedCountry}
      countryTracks={countryTracks}
      dummyPlaylist={dummyPlaylist}
      onCountryClick={countryClickACB}
      onAddToPlaylist={addToPlaylistACB}
      onRemoveFromPlaylist={removeFromPlaylistACB}
      onReorderPlaylist={reorderPlaylistACB}
      isLoggedIn={isLoggedIn}
      onLoginClick={loginClickACB}
      onNavigateToDashboard={navigateToDashboardACB}
      onNavigateToAbout={navigateToAboutACB}
      quizState={{
        showQuiz,
        currentQuestion: QUIZ_QUESTIONS[quizStep - 1],
        step: quizStep,
        totalSteps: QUIZ_QUESTIONS.length,
        completed: quizCompleted && !quizDismissed && !isLoggedIn,
        showRecallTab: (quizStep > 0 || quizCompleted) && quizDismissed && !isLoggedIn
      }}
      onQuizAnswer={handleQuizAnswerACB}
      onQuizClose={handleQuizCloseACB}
      onQueueAll={handleQueueAllACB}
      queueNotification={queueNotification}
      onCloseQueueNotification={closeQueueNotificationACB}
    />
  );
}
