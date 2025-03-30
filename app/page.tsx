"use client";

import { useState, useEffect, useRef } from "react";
import { HiraganaService } from "./utils/hiraganaData";
import Progress from "./components/Progress";
import Button from "./components/Button";

export default function Home() {
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [beatDuration, setBeatDuration] = useState(3000); // 3 seconds per character
  const [timeRemaining, setTimeRemaining] = useState(100);
  const [currentCharacter, setCurrentCharacter] = useState("");
  const [currentRomanization, setCurrentRomanization] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("bg-white");
  const [isReviewMode, setIsReviewMode] = useState(false);
  const [lastWrongCharacter, setLastWrongCharacter] = useState("");
  const [lastWrongRomanization, setLastWrongRomanization] = useState("");
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Start the game
  const startGame = () => {
    setIsPlaying(true);
    nextCharacter();
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Get the next character
  const nextCharacter = () => {
    // If we're coming from a wrong answer and not already in review mode,
    // use the next beat to review the wrong character
    if (isCorrect === false && !isReviewMode) {
      setIsReviewMode(true);
      setLastWrongCharacter(currentCharacter);
      setLastWrongRomanization(currentRomanization);
    } else {
      // Either we're already in review mode or the answer was correct
      // Reset review mode and get a new random character
      setIsReviewMode(false);
      const { character, romanization } = HiraganaService.getRandomHiragana();
      setCurrentCharacter(character);
      setCurrentRomanization(romanization);
    }
    
    // Reset for next beat
    setUserInput("");
    setTimeRemaining(100);
    setShowFeedback(false);
    
    // Start the timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    const interval = 100; // Update every 100ms
    const steps = beatDuration / interval;
    let counter = 0;
    
    timerRef.current = setInterval(() => {
      counter++;
      const newTimeRemaining = 100 - (counter / steps) * 100;
      setTimeRemaining(Math.max(0, newTimeRemaining));
      
      // Time's up
      if (counter >= steps) {
        clearInterval(timerRef.current!);
        checkAnswer();
      }
    }, interval);
  };
  
  // Check the user's answer
  const checkAnswer = () => {
    // If we're in review mode, just move to the next character
    // No need to check the answer during review
    if (isReviewMode) {
      setIsCorrect(null);
      nextCharacter();
      return;
    }
    
    // Normal answer checking
    const userInputClean = userInput.trim().toLowerCase();
    const correctAnswerClean = currentRomanization.trim().toLowerCase();
    const correct = userInputClean === correctAnswerClean;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Flash background color
    setBackgroundColor(correct ? "bg-green-100" : "bg-red-100");
    
    // Start next character immediately
    nextCharacter();
    
    // Reset background color after a brief flash
    setTimeout(() => {
      setBackgroundColor("bg-white");
    }, 300);
    
    // Hide feedback after a while (only relevant for correct answers)
    if (correct) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 800);
    }
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);
    
    // Remove auto-check functionality to maintain constant rhythm
    // Let the timer determine when to check the answer
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Helper function to conditionally join classNames
  const cn = (...classes: string[]) => {
    return classes.filter(Boolean).join(' ');
  };

  return (
    <div className={`flex flex-col items-center justify-center min-h-screen ${backgroundColor} text-black p-4 transition-colors duration-300`}>
      {!isPlaying ? (
        <div className="flex flex-col items-center space-y-6 max-w-md text-center">
          <h1 className="text-4xl font-bold">HiraganaBeats</h1>
          <p className="text-lg">
            Learn hiragana through rhythm! Type the romanized pronunciation before the beat ends.
          </p>

          <div className="space-y-4 w-full">
            <div className="flex items-center justify-between">
              <span>Beat Duration:</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBeatDuration((prev) => Math.min(prev + 500, 5000))}
                >
                  Slower
                </Button>
                <span>{beatDuration / 1000}s</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setBeatDuration((prev) => Math.max(prev - 500, 1500))}
                >
                  Faster
                </Button>
              </div>
            </div>
          </div>

          <Button onClick={startGame} className="w-full py-6 text-lg">
            Start Learning
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          {/* Rhythm indicator */}
          <Progress value={timeRemaining} className="w-full h-2 mb-8" />

          {/* Character display */}
          <div
            className={cn(
              "text-9xl font-bold mb-8 transition-transform duration-300 transform",
              timeRemaining < 30 ? "scale-110" : "",
            )}
          >
            {isReviewMode ? lastWrongCharacter : currentCharacter}
          </div>

          {/* Show romanization during review mode */}
          {isReviewMode && (
            <div className="text-4xl mb-6 text-red-600 font-medium">
              {lastWrongRomanization}
            </div>
          )}

          {/* Input field - disable during review mode */}
          <div className="w-full relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              disabled={isReviewMode}
              className={cn(
                "w-full text-center text-3xl py-4 border-b-2 outline-none transition-colors",
                isReviewMode 
                  ? "border-red-300 bg-red-50" 
                  : isCorrect === null
                    ? "border-gray-300"
                    : isCorrect
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50",
              )}
              placeholder={isReviewMode ? "Review..." : "Type romanization..."}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {/* Feedback area - only show for non-review mode */}
            {showFeedback && !isReviewMode && (
              <div
                className={cn(
                  "absolute w-full text-center -bottom-10 text-lg font-medium transition-opacity duration-200",
                  isCorrect ? "text-green-600" : "text-red-600",
                )}
              >
                {isCorrect ? "Correct!" : currentRomanization}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
