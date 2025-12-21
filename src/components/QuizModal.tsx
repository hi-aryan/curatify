/**
 * QuizModal Component
 * Purely presentational component for the interactive onboarding quiz.
 */
import React from "react";
import { Button } from "./ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "./ui/card";
import { QUIZ_QUESTIONS } from "../utils/quizUtils";
import { Progress } from "@/components/ui/progress";

interface QuizModalProps {
  question: typeof QUIZ_QUESTIONS[0];
  step: number;
  totalSteps: number;
  onAnswer: (answer: string) => void;
  onClose: () => void;
}

export function QuizModal({ question, step, totalSteps, onAnswer, onClose }: QuizModalProps) {
  const progress = (step / totalSteps) * 100;

  return (
    <div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xl animate-in fade-in duration-300"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-lg bg-dark/80 border-light/20 backdrop-blur-md shadow-2xl relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-light/40 hover:text-light transition-colors p-2"
        >
          ✕
        </button>
        
        {/* Glow effect */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green to-blue-500 opacity-50" />
        
        <CardHeader className="pt-8 text-center pb-2">
          <div className="text-green text-xs font-bold tracking-widest uppercase mb-2">
            Step {step} of {totalSteps}
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-center leading-tight">
              {question.question}
            </h3>
            <p className="text-xs text-center opacity-50 uppercase tracking-widest">
              Select one option
            </p>
          </div>

          <div className="grid gap-3">
            {question.options.map((option) => (
              <Button
                key={option}
                variant="outline"
                className="w-full h-12 justify-start px-6 text-sm hover:bg-green/10 hover:border-green/50 hover:text-green transition-all duration-200 border-light/10 bg-light/5"
                onClick={() => onAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-6 pb-8 pt-4">
          <div className="w-full px-2">
            <Progress value={progress} className="h-1.5 bg-light/10" indicatorClassName="bg-green shadow-[0_0_10px_rgba(30,215,96,0.5)] transition-all duration-500" />
          </div>
          <button 
            onClick={onClose}
            className="text-light/40 hover:text-light/80 text-xs transition-colors underline underline-offset-4"
          >
            I'll do this later
          </button>
        </CardFooter>
      </Card>
    </div>
  );
}
