"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  setSelectedCountry,
  addToPlaylist,
  removeFromPlaylist,
  reorderPlaylist,
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
  }, []);

  // Sync persistence to localStorage
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
    />
  );
}
