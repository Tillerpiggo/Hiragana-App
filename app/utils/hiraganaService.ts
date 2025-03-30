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

  // Debug helper to print character stages
  private static logCharacterStages(): void {
    console.group('Current Character Stages:');
    const stageGroups: Record<number, HiraganaCharacter[]> = {};
    
    // Group characters by stage
    this.characters.forEach(char => {
      if (!stageGroups[char.stage]) {
        stageGroups[char.stage] = [];
      }
      stageGroups[char.stage].push(char);
    });
    
    // Log each stage group
    Object.keys(stageGroups).sort((a, b) => Number(a) - Number(b)).forEach(stage => {
      const chars = stageGroups[Number(stage)].map(c => 
        `${c.character}(${c.romanization})${c.lastCorrect ? '✓' : '✗'}`
      ).join(', ');
      console.log(`Stage ${stage}: [${chars}]`);
    });
    
    console.groupEnd();
  }

  // Initialize the system by promoting initial characters
  static initializeSystem(): void {
    console.group('Initializing HiraganaBeats System');
    console.log('Starting with all characters at Stage 0');
    
    // Get stage 0 characters
    const stage0Chars = this.characters.filter(char => char.stage === 0);
    
    if (stage0Chars.length >= 2) {
      // Promote first character to Stage 1
      const char1 = stage0Chars[0];
      console.log(`Promoting initial character to Stage 1: ${char1.character}`);
      this.promoteCharacter(char1);
      
      // Promote second character to Stage 2
      const char2 = stage0Chars[1];
      console.log(`Promoting initial character to Stage 2: ${char2.character}`);
      this.promoteCharacter(char2); // First promotion to Stage 1
      this.promoteCharacter(char2); // Second promotion to Stage 2
    }
    
    this.logCharacterStages();
    console.log('Generating first 8-beat pattern');
    
    // Generate the first pattern
    this.generatePattern();
    console.groupEnd();
  }

  // Generate an 8-beat pattern based on character stages
  static generatePattern(): void {
    console.group('Generating 8-Beat Pattern');
    
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
    
    console.log(`Available characters by stage:`);
    console.log(`Stage 1 (${stage1Chars.length}): ${stage1Chars.map(c => c.character).join(', ')}`);
    console.log(`Stage 2 (${stage2Chars.length}): ${stage2Chars.map(c => c.character).join(', ')}`);
    console.log(`Stage 3 (${stage3Chars.length}): ${stage3Chars.map(c => c.character).join(', ')}`);
    console.log(`Stage 4 (${stage4Chars.length}): ${stage4Chars.map(c => c.character).join(', ')}`);
    console.log(`Stage 5+ (${stage5PlusChars.length}): ${stage5PlusChars.map(c => c.character).join(', ')}`);
    
    // Special case: exactly one stage 1 character and one stage 2 character
    // Create alternating pattern: 1 2 1 2 1 2 1 2
    if (stage1Chars.length === 1 && stage2Chars.length === 1) {
      console.log('Special case: Creating alternating pattern (1 2 1 2) with single Stage 1 and Stage 2 characters');
      
      const stage1Char = stage1Chars[0];
      const stage2Char = stage2Chars[0];
      
      // Assign alternating pattern
      this.currentPattern.characters[0] = stage1Char;
      this.currentPattern.characters[1] = stage2Char;
      this.currentPattern.characters[2] = stage1Char;
      this.currentPattern.characters[3] = stage2Char;
      this.currentPattern.characters[4] = stage1Char;
      this.currentPattern.characters[5] = stage2Char;
      this.currentPattern.characters[6] = stage1Char;
      this.currentPattern.characters[7] = stage2Char;
      
      console.log(`Created alternating pattern with ${stage1Char.character}(Stage 1) and ${stage2Char.character}(Stage 2)`);
    } else {
      // Assign stage 1 characters to downbeats (0, 4)
      if (stage1Chars.length > 0) {
        this.currentPattern.characters[0] = this.getRandomChar(stage1Chars);
        console.log(`Beat 0 (Downbeat): Assigned Stage 1 character ${this.currentPattern.characters[0]!.character}`);
        
        if (stage1Chars.length > 1) {
          this.currentPattern.characters[4] = this.getRandomChar(stage1Chars.filter(
            char => char !== this.currentPattern.characters[0]
          ));
          console.log(`Beat 4 (Downbeat): Assigned different Stage 1 character ${this.currentPattern.characters[4]!.character}`);
        } else {
          this.currentPattern.characters[4] = this.currentPattern.characters[0];
          console.log(`Beat 4 (Downbeat): Reused Stage 1 character ${this.currentPattern.characters[4]!.character} (only one available)`);
        }
      }
      
      // Assign stage 2 characters to upbeats (2, 6)
      if (stage2Chars.length > 0) {
        this.currentPattern.characters[2] = this.getRandomChar(stage2Chars);
        console.log(`Beat 2 (Upbeat): Assigned Stage 2 character ${this.currentPattern.characters[2]!.character}`);
        
        if (stage2Chars.length > 1) {
          this.currentPattern.characters[6] = this.getRandomChar(stage2Chars.filter(
            char => char !== this.currentPattern.characters[2]
          ));
          console.log(`Beat 6 (Upbeat): Assigned different Stage 2 character ${this.currentPattern.characters[6]!.character}`);
        } else {
          this.currentPattern.characters[6] = this.currentPattern.characters[2];
          console.log(`Beat 6 (Upbeat): Reused Stage 2 character ${this.currentPattern.characters[6]!.character} (only one available)`);
        }
      }
      
      // Assign stage 3 characters to off-beats (1, 3, 5, 7)
      // UPDATED: Ensure all offbeats are filled with stage 3 characters
      const offBeats = [1, 3, 5, 7];
      if (stage3Chars.length > 0) {
        // Make a working copy of stage3Chars that we can reuse if needed
        let workingStage3Chars = [...stage3Chars];
        
        for (const beat of offBeats) {
          // If we've used all stage 3 characters, refill the working copy
          if (workingStage3Chars.length === 0) {
            workingStage3Chars = [...stage3Chars];
            console.log('Reusing Stage 3 characters to fill remaining offbeats');
          }
          
          // Assign a stage 3 character to this offbeat
          const char = this.getRandomChar(workingStage3Chars);
          this.currentPattern.characters[beat] = char;
          console.log(`Beat ${beat} (Off-beat): Assigned Stage 3 character ${char.character}`);
          
          // Remove this character from the working copy to avoid immediate repeats
          workingStage3Chars = workingStage3Chars.filter(c => c !== char);
        }
      }
      
      // Stage 4 randomly replaces one Stage 3 position
      if (stage4Chars.length > 0 && offBeats.some(beat => this.currentPattern.characters[beat] !== null)) {
        // Find an off-beat that has a Stage 3 character
        const availableOffBeats = offBeats.filter(beat => this.currentPattern.characters[beat] !== null);
        if (availableOffBeats.length > 0) {
          const randomOffBeat = availableOffBeats[Math.floor(Math.random() * availableOffBeats.length)];
          const previousChar = this.currentPattern.characters[randomOffBeat]!.character;
          this.currentPattern.characters[randomOffBeat] = this.getRandomChar(stage4Chars);
          console.log(`Beat ${randomOffBeat} (Off-beat): Replaced Stage 3 character ${previousChar} with Stage 4 character ${this.currentPattern.characters[randomOffBeat]!.character}`);
        }
      }
      
      // Stage 5+ occasionally replaces any position (probabilistic)
      if (stage5PlusChars.length > 0) {
        for (let i = 0; i < 8; i++) {
          // 10% chance to replace with a Stage 5+ character
          if (Math.random() < 0.1) {
            const previousChar = this.currentPattern.characters[i]?.character || 'none';
            this.currentPattern.characters[i] = this.getRandomChar(stage5PlusChars);
            console.log(`Beat ${i}: Replaced character ${previousChar} with Stage 5+ character ${this.currentPattern.characters[i]!.character} (random chance)`);
          }
        }
      }
      
      // Fill in any null positions by extending the previous character
      for (let i = 0; i < 8; i++) {
        if (this.currentPattern.characters[i] === null) {
          if (i > 0 && this.currentPattern.characters[i-1] !== null) {
            this.currentPattern.characters[i] = this.currentPattern.characters[i-1];
            console.log(`Beat ${i}: Filled null position by extending previous character ${this.currentPattern.characters[i]!.character}`);
          } else if (i === 0) {
            // If the first position is null, use a Stage 1 or Stage 0 character
            if (stage1Chars.length > 0) {
              this.currentPattern.characters[i] = this.getRandomChar(stage1Chars);
              console.log(`Beat ${i}: Filled first position with Stage 1 character ${this.currentPattern.characters[i]!.character}`);
            } else {
              const stage0Char = this.getRandomChar(this.characters.filter(char => char.stage === 0));
              if (stage0Char) {
                this.currentPattern.characters[i] = stage0Char;
                console.log(`Beat ${i}: Filled first position with Stage 0 character ${this.currentPattern.characters[i]!.character}`);
              } else {
                // Fallback to any character
                this.currentPattern.characters[i] = this.getRandomChar(this.characters);
                console.log(`Beat ${i}: Filled first position with fallback character ${this.currentPattern.characters[i]!.character}`);
              }
            }
          }
        }
      }
    }
    
    // Display final pattern
    console.log('Final 8-beat pattern:');
    this.currentPattern.characters.forEach((char, index) => {
      console.log(`Beat ${index}: ${char!.character}(${char!.romanization}) - Stage ${char!.stage}`);
    });
    
    // Reset the current beat
    this.currentPattern.currentBeat = 0;
    console.groupEnd();
  }

  // Get the next character in the pattern
  static getNextCharacter(): HiraganaCharacter {
    if (this.currentPattern.currentBeat >= 8) {
      console.group('Pattern Complete');
      console.log('All 8 beats completed. Evaluating pattern and generating new one.');
      // If we've completed the pattern, generate a new one
      this.evaluatePattern();
      this.generatePattern();
      console.groupEnd();
    }
    
    const character = this.currentPattern.characters[this.currentPattern.currentBeat]!;
    console.log(`Beat ${this.currentPattern.currentBeat}: Serving ${character.character}(${character.romanization}) - Stage ${character.stage}`);
    
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
      console.log(`Character ${character.character}(${character.romanization}) - Answer ${correct ? 'CORRECT ✓' : 'INCORRECT ✗'}`);
    }
  }

  // Evaluate the pattern after completion and promote/demote characters
  private static evaluatePattern(): void {
    console.group('Evaluating Pattern');
    
    // Create a results map to track accuracy for each character
    const results = new Map<string, { total: number, correct: number }>();
    
    // Get unique characters in the pattern
    const uniqueChars = [...new Set(this.currentPattern.characters.filter(c => c !== null))];
    console.log(`Number of unique characters in this pattern: ${uniqueChars.length}`);
    
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
        console.log(`Character ${character.character}(${character.romanization}) - Stage ${character.stage} - Correct: ${result.correct}/${result.total}`);
        
        if (result.correct === result.total) {
          // Perfect accuracy - promote
          console.log(`  Perfect accuracy! Promoting to Stage ${character.stage + 1}`);
          this.promoteCharacter(character);
        } else {
          // Any error - demote
          console.log(`  Errors detected. Demoting to Stage ${character.stage > 1 ? character.stage - 1 : 1}`);
          this.demoteCharacter(character);
        }
      }
    }
    
    this.logCharacterStages();
    console.groupEnd();
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
      console.log(`Only ${stage0Chars.length} Stage 0 characters available. System should introduce new ones in a real implementation.`);
    }
  }

  // Ensure we have at least 1 Stage 1 character
  private static ensureMinimumStage1(): void {
    const stage1Chars = this.characters.filter(char => char.stage === 1);
    if (stage1Chars.length === 0) {
      // Promote a random Stage 0 character to Stage 1
      const stage0Chars = this.characters.filter(char => char.stage === 0);
      if (stage0Chars.length > 0) {
        const char = this.getRandomChar(stage0Chars);
        console.log(`No Stage 1 characters available. Promoting ${char.character} from Stage 0 to Stage 1.`);
        this.promoteCharacter(char);
      } else {
        console.log(`No Stage 0 or Stage 1 characters available. System needs more characters.`);
      }
    }
  }

  // Helper to get a random character from an array
  private static getRandomChar(characters: HiraganaCharacter[]): HiraganaCharacter {
    if (characters.length === 0) return null!;
    return characters[Math.floor(Math.random() * characters.length)];
  }
} 