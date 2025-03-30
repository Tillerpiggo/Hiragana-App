// Character data structure with learning information
export interface RussianCharacter {
  character: string;
  romanization: string;
  stage: number;
  lastCorrect: boolean;
}

// Beat pattern management
export interface BeatPattern {
  characters: (RussianCharacter | null)[];
  currentBeat: number;
  // Track which character is eligible for promotion from each stage
  promotionCandidates: {[stage: number]: RussianCharacter | null};
}

export class RussianService {
  private static characters: RussianCharacter[] = [
    { character: 'А', romanization: 'a', stage: 0, lastCorrect: false },
    { character: 'Б', romanization: 'b', stage: 0, lastCorrect: false },
    { character: 'В', romanization: 'v', stage: 0, lastCorrect: false },
    { character: 'Г', romanization: 'g', stage: 0, lastCorrect: false },
    { character: 'Д', romanization: 'd', stage: 0, lastCorrect: false },
    { character: 'Е', romanization: 'ye', stage: 0, lastCorrect: false },
    { character: 'Ё', romanization: 'yo', stage: 0, lastCorrect: false },
    { character: 'Ж', romanization: 'zh', stage: 0, lastCorrect: false },
    { character: 'З', romanization: 'z', stage: 0, lastCorrect: false },
    { character: 'И', romanization: 'i', stage: 0, lastCorrect: false },
    { character: 'Й', romanization: 'y', stage: 0, lastCorrect: false },
    { character: 'К', romanization: 'k', stage: 0, lastCorrect: false },
    { character: 'Л', romanization: 'l', stage: 0, lastCorrect: false },
    { character: 'М', romanization: 'm', stage: 0, lastCorrect: false },
    { character: 'Н', romanization: 'n', stage: 0, lastCorrect: false },
    { character: 'О', romanization: 'o', stage: 0, lastCorrect: false },
    { character: 'П', romanization: 'p', stage: 0, lastCorrect: false },
    { character: 'Р', romanization: 'r', stage: 0, lastCorrect: false },
    { character: 'С', romanization: 's', stage: 0, lastCorrect: false },
    { character: 'Т', romanization: 't', stage: 0, lastCorrect: false },
    { character: 'У', romanization: 'u', stage: 0, lastCorrect: false },
    { character: 'Ф', romanization: 'f', stage: 0, lastCorrect: false },
    { character: 'Х', romanization: 'kh', stage: 0, lastCorrect: false },
    { character: 'Ц', romanization: 'ts', stage: 0, lastCorrect: false },
    { character: 'Ч', romanization: 'ch', stage: 0, lastCorrect: false },
    { character: 'Ш', romanization: 'sh', stage: 0, lastCorrect: false },
    { character: 'Щ', romanization: 'shch', stage: 0, lastCorrect: false },
    { character: 'Ъ', romanization: 'hard sign', stage: 0, lastCorrect: false },
    { character: 'Ы', romanization: 'y', stage: 0, lastCorrect: false },
    { character: 'Ь', romanization: 'soft sign', stage: 0, lastCorrect: false },
    { character: 'Э', romanization: 'e', stage: 0, lastCorrect: false },
    { character: 'Ю', romanization: 'yu', stage: 0, lastCorrect: false },
    { character: 'Я', romanization: 'ya', stage: 0, lastCorrect: false }
  ];

  private static currentPattern: BeatPattern = {
    characters: Array(16).fill(null),
    currentBeat: 0,
    promotionCandidates: {}
  };

  // Initialize the system with one character at stage 1 and one at stage 2
  static initializeSystem(): void {
    console.group('Initializing RussianBeats System');
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
    console.log('Generating first 16-beat pattern');
    
    // Generate the first pattern
    this.generatePattern();
    console.groupEnd();
  }

  // The rest of the implementation is identical to HiraganaService
  // Just copy the methods from HiraganaService, but replace "Hiragana" with "Russian"
  // ... other methods (generatePattern, evaluatePattern, etc.) ...

  // Debug helper to print character stages
  private static logCharacterStages(): void {
    console.group('Current Character Stages:');
    const stageGroups: Record<number, RussianCharacter[]> = {};
    
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

  // Generate a 16-beat pattern based on character stages
  static generatePattern(): void {
    console.group('Generating 16-Beat Pattern');
    
    // Reset the pattern
    this.currentPattern = {
      characters: Array(16).fill(null),
      currentBeat: 0,
      promotionCandidates: {}
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
    
    // Check if we have any stage 3+ characters
    const hasStage3Plus = stage3Chars.length > 0 || stage4Chars.length > 0 || stage5PlusChars.length > 0;
    
    // Special case: exactly one stage 1 character and one stage 2 character
    // and no higher stage characters - create alternating pattern
    if (stage1Chars.length === 1 && stage2Chars.length === 1 && !hasStage3Plus) {
      console.log('Special case: Creating alternating pattern (1-2-1-2) with single Stage 1 and Stage 2 characters');
      
      const stage1Char = stage1Chars[0];
      const stage2Char = stage2Chars[0];
      
      // Set promotion candidates
      this.currentPattern.promotionCandidates[1] = stage1Char;
      this.currentPattern.promotionCandidates[2] = stage2Char;
      
      console.log(`Selected promotion candidate for Stage 1: ${stage1Char.character}`);
      console.log(`Selected promotion candidate for Stage 2: ${stage2Char.character}`);
      
      // Assign alternating pattern for full 16 beats
      for (let i = 0; i < 16; i++) {
        if (i % 2 === 0) {
          this.currentPattern.characters[i] = stage1Char;
        } else {
          this.currentPattern.characters[i] = stage2Char;
        }
      }
      
      console.log(`Created alternating pattern with ${stage1Char.character}(Stage 1) and ${stage2Char.character}(Stage 2)`);
    } else {
      // Normal pattern generation
      
      // Define beat positions by stage for 16-beat pattern
      const downbeats = [0, 4, 8, 12]; // Stage 1
      const upbeats = [2, 6, 10, 14];  // Stage 2
      const offbeats = [1, 3, 5, 7, 9, 11, 13, 15]; // Stage 3
      
      // For each stage, select a single character to fill all positions for that stage
      // and make it the promotion candidate
      
      // Stage 1 - select one character for all downbeats
      if (stage1Chars.length > 0) {
        // Select random character from stage 1
        const selectedStage1Char = this.getRandomChar(stage1Chars);
        this.currentPattern.promotionCandidates[1] = selectedStage1Char;
        console.log(`Selected promotion candidate for Stage 1: ${selectedStage1Char.character}`);
        
        // Use this character for all downbeats
        for (const beat of downbeats) {
          this.currentPattern.characters[beat] = selectedStage1Char;
          console.log(`Beat ${beat} (Downbeat): Assigned Stage 1 character ${selectedStage1Char.character}`);
        }
      }
      
      // Stage 2 - select one character for all upbeats
      if (stage2Chars.length > 0) {
        // Select random character from stage 2
        const selectedStage2Char = this.getRandomChar(stage2Chars);
        this.currentPattern.promotionCandidates[2] = selectedStage2Char;
        console.log(`Selected promotion candidate for Stage 2: ${selectedStage2Char.character}`);
        
        // Use this character for all upbeats
        for (const beat of upbeats) {
          this.currentPattern.characters[beat] = selectedStage2Char;
          console.log(`Beat ${beat} (Upbeat): Assigned Stage 2 character ${selectedStage2Char.character}`);
        }
      }
      
      // Stage 3 - select one character for all offbeats, but with chances for lower stage characters
      if (stage3Chars.length > 0) {
        // Select random character from stage 3 as primary promotion candidate
        const selectedStage3Char = this.getRandomChar(stage3Chars);
        this.currentPattern.promotionCandidates[3] = selectedStage3Char;
        console.log(`Selected promotion candidate for Stage 3: ${selectedStage3Char.character}`);
        
        // Select random stage 1 and stage 2 characters to occasionally appear in offbeats
        const stage1ForOffbeats = stage1Chars.length > 0 ? this.getRandomChar(stage1Chars) : null;
        const stage2ForOffbeats = stage2Chars.length > 0 ? this.getRandomChar(stage2Chars) : null;
        
        if (stage1ForOffbeats) {
          console.log(`Selected Stage 1 character ${stage1ForOffbeats.character} for occasional offbeat appearance`);
        }
        
        if (stage2ForOffbeats) {
          console.log(`Selected Stage 2 character ${stage2ForOffbeats.character} for rare offbeat appearance`);
        }
        
        // Assign characters to offbeats with probability distribution
        for (const beat of offbeats) {
          // Generate a random number to determine which character to use
          const randomValue = Math.random();
          
          if (randomValue < 0.05 && stage2ForOffbeats) {
            // 5% chance for stage 2 character
            this.currentPattern.characters[beat] = stage2ForOffbeats;
            console.log(`Beat ${beat} (Off-beat): Assigned Stage 2 character ${stage2ForOffbeats.character} (rare variation)`);
          } else if (randomValue < 0.20 && stage1ForOffbeats) {
            // 15% chance for stage 1 character 
            this.currentPattern.characters[beat] = stage1ForOffbeats;
            console.log(`Beat ${beat} (Off-beat): Assigned Stage 1 character ${stage1ForOffbeats.character} (occasional variation)`);
          } else {
            // 80% chance for stage 3 character (default)
            this.currentPattern.characters[beat] = selectedStage3Char;
            console.log(`Beat ${beat} (Off-beat): Assigned Stage 3 character ${selectedStage3Char.character}`);
          }
        }
      } else if (stage3Chars.length === 0) {
        // If no stage 3 characters, distribute stage 1 and 2 characters across offbeats
        console.log("No Stage 3 characters available. Distributing Stage 1 and 2 characters in offbeats");
        
        for (const beat of offbeats) {
          const randomValue = Math.random();
          
          if (randomValue < 0.3 && stage2Chars.length > 0) {
            // 30% chance for stage 2 character when no stage 3 is available
            const randomStage2 = this.getRandomChar(stage2Chars);
            this.currentPattern.characters[beat] = randomStage2;
            console.log(`Beat ${beat} (Off-beat): Assigned Stage 2 character ${randomStage2.character} (no Stage 3 available)`);
          } else if (stage1Chars.length > 0) {
            // 70% chance for stage 1 character when no stage 3 is available
            const randomStage1 = this.getRandomChar(stage1Chars);
            this.currentPattern.characters[beat] = randomStage1;
            console.log(`Beat ${beat} (Off-beat): Assigned Stage 1 character ${randomStage1.character} (no Stage 3 available)`);
          }
          // If neither stage 1 nor 2 characters are available, leave null for now
          // The fill-in pass later will handle these null positions
        }
      }
      
      // Stage 4 - select one character to replace stage 3 in one position from each half
      if (stage4Chars.length > 0 && offbeats.some(beat => this.currentPattern.characters[beat] !== null)) {
        // Select random character from stage 4
        const selectedStage4Char = this.getRandomChar(stage4Chars);
        this.currentPattern.promotionCandidates[4] = selectedStage4Char;
        console.log(`Selected promotion candidate for Stage 4: ${selectedStage4Char.character}`);
        
        // First half replacement
        const firstHalfOffbeats = offbeats.filter(b => b < 8);
        if (firstHalfOffbeats.some(beat => this.currentPattern.characters[beat] !== null)) {
          const randomOffBeat = firstHalfOffbeats[Math.floor(Math.random() * firstHalfOffbeats.length)];
          const previousChar = this.currentPattern.characters[randomOffBeat]!.character;
          this.currentPattern.characters[randomOffBeat] = selectedStage4Char;
          console.log(`Beat ${randomOffBeat} (Off-beat): Replaced Stage 3 character ${previousChar} with Stage 4 character ${selectedStage4Char.character}`);
        }
        
        // Second half replacement
        const secondHalfOffbeats = offbeats.filter(b => b >= 8);
        if (secondHalfOffbeats.some(beat => this.currentPattern.characters[beat] !== null)) {
          const randomOffBeat = secondHalfOffbeats[Math.floor(Math.random() * secondHalfOffbeats.length)];
          const previousChar = this.currentPattern.characters[randomOffBeat]!.character;
          this.currentPattern.characters[randomOffBeat] = selectedStage4Char;
          console.log(`Beat ${randomOffBeat} (Off-beat): Replaced Stage 3 character ${previousChar} with Stage 4 character ${selectedStage4Char.character}`);
        }
      }
      
      // Stage 5+ - select one character that may replace others probabilistically
      if (stage5PlusChars.length > 0) {
        // Select random character from stage 5+
        const selectedStage5PlusChar = this.getRandomChar(stage5PlusChars);
        this.currentPattern.promotionCandidates[5] = selectedStage5PlusChar;
        console.log(`Selected promotion candidate for Stage 5+: ${selectedStage5PlusChar.character}`);
        
        for (let i = 0; i < 16; i++) {
          // 10% chance to replace with the selected Stage 5+ character
          if (Math.random() < 0.1) {
            const previousChar = this.currentPattern.characters[i]?.character || 'none';
            this.currentPattern.characters[i] = selectedStage5PlusChar;
            console.log(`Beat ${i}: Replaced character ${previousChar} with Stage 5+ character ${selectedStage5PlusChar.character} (random chance)`);
          }
        }
      }
      
      // Fill in any null positions by extending the previous character
      for (let i = 0; i < 16; i++) {
        if (this.currentPattern.characters[i] === null) {
          if (i > 0 && this.currentPattern.characters[i-1] !== null) {
            this.currentPattern.characters[i] = this.currentPattern.characters[i-1];
            console.log(`Beat ${i}: Filled null position by extending previous character ${this.currentPattern.characters[i]!.character}`);
          } else if (i === 0) {
            // If the first position is null, use a Stage 1 character
            if (stage1Chars.length > 0) {
              // Use the selected promotion candidate for consistency
              const selectedChar = this.currentPattern.promotionCandidates[1] || this.getRandomChar(stage1Chars);
              this.currentPattern.characters[i] = selectedChar;
              console.log(`Beat ${i}: Filled first position with Stage 1 character ${selectedChar.character}`);
            } else {
              const stage0Char = this.getRandomChar(this.characters.filter(char => char.stage === 0));
              if (stage0Char) {
                this.currentPattern.characters[i] = stage0Char;
                console.log(`Beat ${i}: Filled first position with Stage 0 character ${stage0Char.character}`);
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
    console.log('Final 16-beat pattern:');
    this.currentPattern.characters.forEach((char, index) => {
      if (char) {
        console.log(`Beat ${index}: ${char.character}(${char.romanization}) - Stage ${char.stage}`);
      } else {
        console.log(`Beat ${index}: NULL CHARACTER - PATTERN GENERATION ERROR`);
      }
    });
    
    console.log('Promotion candidates for this pattern:');
    Object.entries(this.currentPattern.promotionCandidates).forEach(([stage, char]) => {
      if (char) {
        console.log(`Stage ${stage}: ${char.character}(${char.romanization})`);
      }
    });
    
    // Reset the current beat
    this.currentPattern.currentBeat = 0;
    console.groupEnd();
  }

  // Get the next character in the pattern
  static getNextCharacter(): RussianCharacter {
    if (this.currentPattern.currentBeat >= 16) {
      console.group('Pattern Complete');
      console.log('All 16 beats completed. Evaluating pattern and generating new one.');
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
  static reportResult(character: RussianCharacter, correct: boolean): void {
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
    
    // Check for errors in each character and demote if needed
    for (const [char, result] of results.entries()) {
      const character = this.characters.find(c => c.character === char);
      if (character) {
        console.log(`Character ${character.character}(${character.romanization}) - Stage ${character.stage} - Correct: ${result.correct}/${result.total}`);
        
        // If any errors, demote the character
        if (result.correct < result.total) {
          console.log(`  Errors detected. Demoting to Stage ${character.stage > 1 ? character.stage - 1 : 1}`);
          this.demoteCharacter(character);
        }
      }
    }
    
    // Collect perfect score characters by stage
    const perfectChars: Map<number, RussianCharacter[]> = new Map();
    for (const [char, result] of results.entries()) {
      if (result.correct === result.total) {
        const character = this.characters.find(c => c.character === char);
        if (character) {
          if (!perfectChars.has(character.stage)) {
            perfectChars.set(character.stage, []);
          }
          perfectChars.get(character.stage)!.push(character);
        }
      }
    }
    
    // Log perfect characters by stage
    console.log('Characters with perfect scores by stage:');
    perfectChars.forEach((chars, stage) => {
      console.log(`Stage ${stage}: ${chars.map(c => c.character).join(', ')}`);
    });
    
    // First, handle Stage 5+ promotions (these don't conflict with others)
    let stage5PlusPromoted = false;
    if (perfectChars.has(5)) {
      const stage5PlusChar = perfectChars.get(5)![0];
      console.log(`Promoting Stage 5+ character ${stage5PlusChar.character} to Stage ${stage5PlusChar.stage + 1}`);
      this.promoteCharacter(stage5PlusChar);
      stage5PlusPromoted = true;
    }
    
    // Check for promotions in Stages 1-4, prioritizing the lowest stage with multiple characters
    let promotedLowerStage = false;
    
    // Get current stage distribution
    const stageDistribution = new Map<number, number>();
    for (const char of this.characters) {
      if (char.stage >= 1 && char.stage <= 4) {
        if (!stageDistribution.has(char.stage)) {
          stageDistribution.set(char.stage, 0);
        }
        stageDistribution.set(char.stage, stageDistribution.get(char.stage)! + 1);
      }
    }
    
    console.log('Current stage distribution (1-4):');
    stageDistribution.forEach((count, stage) => {
      console.log(`Stage ${stage}: ${count} characters`);
    });
    
    // Find the lowest stage with multiple characters
    for (let stage = 1; stage <= 4; stage++) {
      if (stageDistribution.get(stage) && stageDistribution.get(stage)! > 1) {
        // If we have multiple characters in this stage and some had perfect scores
        if (perfectChars.has(stage) && perfectChars.get(stage)!.length > 0) {
          const charToPromote = perfectChars.get(stage)![0];
          console.log(`Found lowest stage (${stage}) with multiple characters. Promoting ${charToPromote.character} to Stage ${charToPromote.stage + 1}`);
          this.promoteCharacter(charToPromote);
          promotedLowerStage = true;
          break;
        }
      }
    }
    
    // If we didn't promote any character yet, try to promote from any stage 1-4
    if (!promotedLowerStage && !stage5PlusPromoted) {
      for (let stage = 1; stage <= 4; stage++) {
        if (perfectChars.has(stage) && perfectChars.get(stage)!.length > 0) {
          const charToPromote = perfectChars.get(stage)![0];
          console.log(`No lower stage with multiple characters found. Promoting ${charToPromote.character} from Stage ${stage} to Stage ${stage + 1}`);
          this.promoteCharacter(charToPromote);
          break;
        }
      }
    }
    
    this.logCharacterStages();
    console.groupEnd();
  }

  // Promote a character to the next stage
  private static promoteCharacter(character: RussianCharacter): void {
    character.stage++;
  }

  // Demote a character, but not below stage 1
  private static demoteCharacter(character: RussianCharacter): void {
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
  private static getRandomChar(characters: RussianCharacter[]): RussianCharacter {
    if (characters.length === 0) return null!;
    return characters[Math.floor(Math.random() * characters.length)];
  }
} 