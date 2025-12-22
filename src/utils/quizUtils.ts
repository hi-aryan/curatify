/**
 * Quiz Utility
 * Handles persistence and data structures for the landing page quiz
 */

const STORAGE_KEY = "curatify_quiz_answers";

export interface QuizAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface QuizState {
  answers: QuizAnswer[];
  completed: boolean;
  selectedCountry: string | null;
  dismissed?: boolean; // New: prevents annoying popups
}

/**
 * Save quiz answers to localStorage
 */
export function saveQuizPersistence(state: QuizState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/**
 * Load quiz answers from localStorage
 */
export function loadQuizPersistence(): QuizState | null {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Clear quiz results
 */
export function clearQuizPersistence(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function markQuizDismissed(): void {
  const current = loadQuizPersistence();
  if (current) {
    saveQuizPersistence({ ...current, dismissed: true });
  }
}

/**
 * Definition of potential quiz questions
 * (Subset of 50 for MVP)
 */
export const QUIZ_QUESTIONS = [
  {
    id: "vibe",
    question: "How would you describe your music mood?",
    options: ["Chill & Melodic", "High Energy & Hype", "Nostalgic"]
  },
  {
    id: "discovery",
    question: "When discovering music, do you prefer...",
    options: ["Safe bets and hits", "Underground gems", "Experimental sounds"]
  },
  {
    id: "setting",
    question: "Where do you listen to music most?",
    options: ["At work/study", "At the gym", "Commuting", "At home"]
  },
  {
    id: "social",
    question: "Do you like sharing your music taste?",
    options: ["Always! I'm a curator", "Sometimes with close friends", "I'm a private listener"]
  },
  {
    id: "adventure",
    question: "How adventurous is your taste?",
    options: ["Give me the usual", "Surprise me a bit", "Take me to another dimension"]
  }
];
