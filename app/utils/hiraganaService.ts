// Character data structure with learning information
export interface HiraganaCharacter {
  character: string;
  romanization: string;
  stage: number;
  lastCorrect: boolean;
}

// Beat pattern management
export interface BeatPattern {
  characters: (HiraganaCharacter | null)[];
  currentBeat: number;
}

export class HiraganaService {
  private static characters: HiraganaCharacter[] = [
    { character: 'あ', romanization: 'a', stage: 0, lastCorrect: false },
    { character: 'い', romanization: 'i', stage: 0, lastCorrect: false },
    { character: 'う', romanization: 'u', stage: 0, lastCorrect: false },
    { character: 'え', romanization: 'e', stage: 0, lastCorrect: false },
    { character: 'お', romanization: 'o', stage: 0, lastCorrect: false },
    { character: 'か', romanization: 'ka', stage: 0, lastCorrect: false },
    { character: 'き', romanization: 'ki', stage: 0, lastCorrect: false },
    { character: 'く', romanization: 'ku', stage: 0, lastCorrect: false },
    { character: 'け', romanization: 'ke', stage: 0, lastCorrect: false },
    { character: 'こ', romanization: 'ko', stage: 0, lastCorrect: false },
    { character: 'さ', romanization: 'sa', stage: 0, lastCorrect: false },
    { character: 'し', romanization: 'shi', stage: 0, lastCorrect: false },
    { character: 'す', romanization: 'su', stage: 0, lastCorrect: false },
    { character: 'せ', romanization: 'se', stage: 0, lastCorrect: false },
    { character: 'そ', romanization: 'so', stage: 0, lastCorrect: false },
    { character: 'た', romanization: 'ta', stage: 0, lastCorrect: false },
    { character: 'ち', romanization: 'chi', stage: 0, lastCorrect: false },
    { character: 'つ', romanization: 'tsu', stage: 0, lastCorrect: false },
    { character: 'て', romanization: 'te', stage: 0, lastCorrect: false },
    { character: 'と', romanization: 'to', stage: 0, lastCorrect: false },
    { character: 'な', romanization: 'na', stage: 0, lastCorrect: false },
    { character: 'に', romanization: 'ni', stage: 0, lastCorrect: false },
    { character: 'ぬ', romanization: 'nu', stage: 0, lastCorrect: false },
    { character: 'ね', romanization: 'ne', stage: 0, lastCorrect: false },
    { character: 'の', romanization: 'no', stage: 0, lastCorrect: false },
    { character: 'は', romanization: 'ha', stage: 0, lastCorrect: false },
    { character: 'ひ', romanization: 'hi', stage: 0, lastCorrect: false },
    { character: 'ふ', romanization: 'fu', stage: 0, lastCorrect: false },
    { character: 'へ', romanization: 'he', stage: 0, lastCorrect: false },
    { character: 'ほ', romanization: 'ho', stage: 0, lastCorrect: false },
    { character: 'ま', romanization: 'ma', stage: 0, lastCorrect: false },
    { character: 'み', romanization: 'mi', stage: 0, lastCorrect: false },
    { character: 'む', romanization: 'mu', stage: 0, lastCorrect: false },
    { character: 'め', romanization: 'me', stage: 0, lastCorrect: false },
    { character: 'も', romanization: 'mo', stage: 0, lastCorrect: false },
    { character: 'や', romanization: 'ya', stage: 0, lastCorrect: false },
    { character: 'ゆ', romanization: 'yu', stage: 0, lastCorrect: false },
    { character: 'よ', romanization: 'yo', stage: 0, lastCorrect: false },
    { character: 'ら', romanization: 'ra', stage: 0, lastCorrect: false },
    { character: 'り', romanization: 'ri', stage: 0, lastCorrect: false },
    { character: 'る', romanization: 'ru', stage: 0, lastCorrect: false },
    { character: 'れ', romanization: 're', stage: 0, lastCorrect: false },
    { character: 'ろ', romanization: 'ro', stage: 0, lastCorrect: false },
    { character: 'わ', romanization: 'wa', stage: 0, lastCorrect: false },
    { character: 'を', romanization: 'wo', stage: 0, lastCorrect: false },
    { character: 'ん', romanization: 'n', stage: 0, lastCorrect: false }
  ];

  private static currentPattern: BeatPattern = {
    characters: Array(8).fill(null),
    currentBeat: 0
  };

  // Initialize the system by promoting initial characters
  static initializeSystem(): void {
    // Promote two random Stage 0 characters to Stage 1
    const stage0Chars = this.characters.filter(char => char.stage === 0);
    if (stage0Chars.length >= 2) {
      this.promoteCharacter(stage0Chars[0]);
      this.promoteCharacter(stage0Chars[1]);
    }
    
    // Generate the first pattern
    this.generatePattern();
  }

  // Generate an 8-beat pattern based on character stages
  static generatePattern(): void {
    // Reset the pattern
    this.currentPattern = {
      characters: Array(8).fill(null),
      currentBeat: 0
    };

    // Ensure we have at least 2 Stage 0 characters
    this.ensureMinimumStage0();
    
    // Ensure we have at least 1 Stage 1 character
    this.ensureMinimumStage1();
    
    // Get characters by stage
    const stage1Chars = this.characters.filter(char => char.stage === 1);
    const stage2Chars = this.characters.filter(char => char.stage === 2);
    const stage3Chars = this.characters.filter(char => char.stage === 3);
    const stage4Chars = this.characters.filter(char => char.stage === 4);
    const stage5PlusChars = this.characters.filter(char => char.stage >= 5);
    
    // Assign stage 1 characters to downbeats (0, 4)
    if (stage1Chars.length > 0) {
      this.currentPattern.characters[0] = this.getRandomChar(stage1Chars);
      if (stage1Chars.length > 1) {
        this.currentPattern.characters[4] = this.getRandomChar(stage1Chars.filter(
          char => char !== this.currentPattern.characters[0]
        ));
      } else {
        this.currentPattern.characters[4] = this.currentPattern.characters[0];
      }
    }
    
    // Assign stage 2 characters to upbeats (2, 6)
    if (stage2Chars.length > 0) {
      this.currentPattern.characters[2] = this.getRandomChar(stage2Chars);
      if (stage2Chars.length > 1) {
        this.currentPattern.characters[6] = this.getRandomChar(stage2Chars.filter(
          char => char !== this.currentPattern.characters[2]
        ));
      } else {
        this.currentPattern.characters[6] = this.currentPattern.characters[2];
      }
    }
    
    // Assign stage 3 characters to off-beats (1, 3, 5, 7)
    const offBeats = [1, 3, 5, 7];
    if (stage3Chars.length > 0) {
      for (const beat of offBeats) {
        if (stage3Chars.length > 0) {
          this.currentPattern.characters[beat] = this.getRandomChar(stage3Chars);
          // Remove the selected character to avoid duplicates
          stage3Chars.splice(stage3Chars.indexOf(this.currentPattern.characters[beat]!), 1);
        }
      }
    }
    
    // Stage 4 randomly replaces one Stage 3 position
    if (stage4Chars.length > 0 && offBeats.some(beat => this.currentPattern.characters[beat] !== null)) {
      // Find an off-beat that has a Stage 3 character
      const availableOffBeats = offBeats.filter(beat => this.currentPattern.characters[beat] !== null);
      if (availableOffBeats.length > 0) {
        const randomOffBeat = availableOffBeats[Math.floor(Math.random() * availableOffBeats.length)];
        this.currentPattern.characters[randomOffBeat] = this.getRandomChar(stage4Chars);
      }
    }
    
    // Stage 5+ occasionally replaces any position (probabilistic)
    if (stage5PlusChars.length > 0) {
      for (let i = 0; i < 8; i++) {
        // 10% chance to replace with a Stage 5+ character
        if (Math.random() < 0.1) {
          this.currentPattern.characters[i] = this.getRandomChar(stage5PlusChars);
        }
      }
    }
    
    // Fill in any null positions by extending the previous character
    for (let i = 0; i < 8; i++) {
      if (this.currentPattern.characters[i] === null) {
        if (i > 0 && this.currentPattern.characters[i-1] !== null) {
          this.currentPattern.characters[i] = this.currentPattern.characters[i-1];
        } else if (i === 0) {
          // If the first position is null, use a Stage 1 or Stage 0 character
          if (stage1Chars.length > 0) {
            this.currentPattern.characters[i] = this.getRandomChar(stage1Chars);
          } else {
            const stage0Char = this.getRandomChar(this.characters.filter(char => char.stage === 0));
            if (stage0Char) {
              this.currentPattern.characters[i] = stage0Char;
            } else {
              // Fallback to any character
              this.currentPattern.characters[i] = this.getRandomChar(this.characters);
            }
          }
        }
      }
    }
    
    // Reset the current beat
    this.currentPattern.currentBeat = 0;
  }

  // Get the next character in the pattern
  static getNextCharacter(): HiraganaCharacter {
    if (this.currentPattern.currentBeat >= 8) {
      // If we've completed the pattern, generate a new one
      this.evaluatePattern();
      this.generatePattern();
    }
    
    const character = this.currentPattern.characters[this.currentPattern.currentBeat]!;
    this.currentPattern.currentBeat++;
    
    return character;
  }

  // Report the result for the current character
  static reportResult(character: HiraganaCharacter, correct: boolean): void {
    // Find the character in our array
    const charIndex = this.characters.findIndex(
      c => c.character === character.character
    );
    
    if (charIndex !== -1) {
      // Update the lastCorrect status
      this.characters[charIndex].lastCorrect = correct;
    }
  }

  // Evaluate the pattern after completion and promote/demote characters
  private static evaluatePattern(): void {
    // Create a results map to track accuracy for each character
    const results = new Map<string, { total: number, correct: number }>();
    
    // Get unique characters in the pattern
    const uniqueChars = [...new Set(this.currentPattern.characters.filter(c => c !== null))];
    
    // Initialize results for each character
    for (const char of uniqueChars) {
      results.set(char!.character, { total: 0, correct: 0 });
    }
    
    // Count accuracy for each character in the pattern
    for (const char of this.currentPattern.characters) {
      if (char !== null) {
        const result = results.get(char.character)!;
        result.total++;
        if (char.lastCorrect) {
          result.correct++;
        }
      }
    }
    
    // Promote or demote characters based on accuracy
    for (const [char, result] of results.entries()) {
      const character = this.characters.find(c => c.character === char);
      if (character) {
        if (result.correct === result.total) {
          // Perfect accuracy - promote
          this.promoteCharacter(character);
        } else {
          // Any error - demote
          this.demoteCharacter(character);
        }
      }
    }
  }

  // Promote a character to the next stage
  private static promoteCharacter(character: HiraganaCharacter): void {
    character.stage++;
  }

  // Demote a character, but not below stage 1
  private static demoteCharacter(character: HiraganaCharacter): void {
    if (character.stage > 1) {
      character.stage--;
    } else if (character.stage === 0) {
      character.stage = 1; // Promote Stage 0 to Stage 1 even on mistake
    }
  }

  // Ensure we have at least 2 Stage 0 characters
  private static ensureMinimumStage0(): void {
    const stage0Chars = this.characters.filter(char => char.stage === 0);
    if (stage0Chars.length < 2) {
      // Introduce new Stage 0 characters or reset some higher stages
      // For this implementation, we'll keep it simple and just maintain what we have
    }
  }

  // Ensure we have at least 1 Stage 1 character
  private static ensureMinimumStage1(): void {
    const stage1Chars = this.characters.filter(char => char.stage === 1);
    if (stage1Chars.length === 0) {
      // Promote a random Stage 0 character to Stage 1
      const stage0Chars = this.characters.filter(char => char.stage === 0);
      if (stage0Chars.length > 0) {
        this.promoteCharacter(this.getRandomChar(stage0Chars));
      }
    }
  }

  // Helper to get a random character from an array
  private static getRandomChar(characters: HiraganaCharacter[]): HiraganaCharacter {
    if (characters.length === 0) return null!;
    return characters[Math.floor(Math.random() * characters.length)];
  }
} 