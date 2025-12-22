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
import { redirectToSpotifyAuth } from "../api/spotifyAuth";
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
  
  function handleQueueAllACB() {
    if (dummyPlaylist.length === 0) return;

    // Set flag to resume action on the Dashboard
    localStorage.setItem("pendingQueueAction", "true");

    if (!isLoggedIn) {
      loginClickACB();
    } else {
      router.push("/dashboard");
    }
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
    />
  );
}
