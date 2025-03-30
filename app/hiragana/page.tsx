"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { HiraganaService, HiraganaCharacter } from "../utils/hiraganaService";
import Progress from "../components/Progress";
import Button from "../components/Button";

export default function HiraganaPage() {
  // Game state
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(100);
  const [currentCharacter, setCurrentCharacter] = useState<HiraganaCharacter | null>(null);
  const [userInput, setUserInput] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [backgroundColor, setBackgroundColor] = useState("bg-white");
  
  // Fixed beat duration of 0.8 seconds (800ms)
  const beatDuration = 800;
  
  // Use refs to track the latest values without triggering re-renders
  const userInputRef = useRef("");
  const currentCharacterRef = useRef<HiraganaCharacter | null>(null);
  
  // Keep refs in sync with state
  useEffect(() => {
    userInputRef.current = userInput;
  }, [userInput]);
  
  useEffect(() => {
    currentCharacterRef.current = currentCharacter;
  }, [currentCharacter]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Check the user's answer
  const checkAnswer = useCallback(() => {
    // Use the refs to get current values
    const userInputValue = userInputRef.current;
    const character = currentCharacterRef.current;
    
    if (!character) return;
    
    // Compare the current values
    const userInputClean = userInputValue.trim().toLowerCase();
    const correctAnswerClean = character.romanization.trim().toLowerCase();
    const correct = userInputClean === correctAnswerClean;
    
    // Report the result to the service
    HiraganaService.reportResult(character, correct);
    
    // Update UI state based on result
    setIsCorrect(correct);
    setBackgroundColor(correct ? "bg-green-100" : "bg-red-100");
    
    // Reset background color after flash
    setTimeout(() => {
      setBackgroundColor("bg-white");
    }, 300);
    
    // Move to next character
    setTimeout(nextCharacter, 0);
  }, []);
  
  // Get the next character
  const nextCharacter = useCallback(() => {
    // Get the next character from the service
    const character = HiraganaService.getNextCharacter();
    setCurrentCharacter(character);
    currentCharacterRef.current = character;
    
    // Reset for next beat
    setUserInput("");
    userInputRef.current = "";
    setTimeRemaining(100);
    setIsCorrect(null);
    
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
  }, [checkAnswer]);
  
  // Start the game
  const startGame = useCallback(() => {
    // Initialize the learning system
    HiraganaService.initializeSystem();
    
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

          <Button onClick={startGame} className="w-full py-6 text-lg">
            Start Learning
          </Button>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full max-w-md">
          {/* Rhythm indicator */}
          <Progress value={timeRemaining} className="w-full h-2 mb-8" />

          {/* Character display */}
          <div className="text-9xl font-bold mb-8">
            {currentCharacter?.character}
          </div>
          
          {/* Show hint for stage 1 characters that were incorrect last time */}
          {currentCharacter && 
           currentCharacter.stage === 1 && 
           !currentCharacter.lastCorrect && (
            <div className="text-lg text-gray-500 mb-4">
              {"(" + currentCharacter.romanization + ")"}
            </div>
          )}

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
          </div>
        </div>
      )}
    </div>
  );
} 