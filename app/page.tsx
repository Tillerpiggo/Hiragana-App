"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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
  
  // Use refs to track the latest values without triggering re-renders
  const userInputRef = useRef("");
  const currentRomanizationRef = useRef("");
  
  // Keep refs in sync with state
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);
  
  useEffect(() => {
    currentRomanizationRef.current = currentRomanization;
  }, [currentRomanization]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check the user's answer - now defined with useCallback
  const checkAnswer = useCallback(() => {
    // Use the refs to get current values
    const userInputValue = userInputRef.current;
    const romanizationValue = currentRomanizationRef.current;
    
    console.log("Checking answer with:", {
      userInput: userInputValue,
      romanization: romanizationValue
    });
    
    // Compare the current values
    const userInputClean = userInputValue.trim().toLowerCase();
    const correctAnswerClean = romanizationValue.trim().toLowerCase();
    const correct = userInputClean === correctAnswerClean;
    
    console.log("Answer is correct:", correct);
    
    // Update UI state based on result
    setIsCorrect(correct);
    setShowFeedback(true);
    setBackgroundColor(correct ? "bg-green-100" : "bg-red-100");
    
    // Reset background color after flash
    setTimeout(() => {
      setBackgroundColor("bg-white");
    }, 300);
    
    // Hide feedback after a while for correct answers
    if (correct) {
      setTimeout(() => {
        setShowFeedback(false);
      }, 800);
    }
    
    // Move to next character
    setTimeout(nextCharacter, 0);
  }, []); // No dependencies needed because we use refs
  
  // Get the next character - now defined with useCallback
  const nextCharacter = useCallback(() => {
    // Get a new random character
    const { character, romanization } = HiraganaService.getRandomHiragana();
    setCurrentCharacter(character);
    setCurrentRomanization(romanization);
    currentRomanizationRef.current = romanization; // Update ref immediately
    
    // Reset for next beat
    setUserInput("");
    userInputRef.current = ""; // Update ref immediately
    setTimeRemaining(100);
    setShowFeedback(false);
    
    // Focus the input field
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Start new timer
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
  }, [beatDuration, checkAnswer]); // Only depends on beatDuration and checkAnswer
  
  // Start the game
  const startGame = useCallback(() => {
    setIsPlaying(true);
    nextCharacter();
  }, [nextCharacter]);
  
  // Handle input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);
    // userInputRef is updated via the useEffect
  }, []);
  
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
            {currentCharacter}
          </div>

          {/* Input field */}
          <div className="w-full relative">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className={cn(
                "w-full text-center text-3xl py-4 border-b-2 outline-none transition-colors",
                isCorrect === null
                  ? "border-gray-300"
                  : isCorrect
                    ? "border-green-500 bg-green-50"
                    : "border-red-500 bg-red-50",
              )}
              placeholder="Type romanization..."
              autoComplete="off"
              autoCapitalize="off"
              spellCheck="false"
            />

            {/* Feedback area */}
            {showFeedback && (
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
