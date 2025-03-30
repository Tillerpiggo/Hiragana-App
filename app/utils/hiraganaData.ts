// Basic hiragana data - each entry has the character and its romanization
export const hiraganaData = [
  { character: 'あ', romanization: 'a' },
  { character: 'い', romanization: 'i' },
  { character: 'う', romanization: 'u' },
  { character: 'え', romanization: 'e' },
  { character: 'お', romanization: 'o' },
  { character: 'か', romanization: 'ka' },
  { character: 'き', romanization: 'ki' },
  { character: 'く', romanization: 'ku' },
  { character: 'け', romanization: 'ke' },
  { character: 'こ', romanization: 'ko' },
  { character: 'さ', romanization: 'sa' },
  { character: 'し', romanization: 'shi' },
  { character: 'す', romanization: 'su' },
  { character: 'せ', romanization: 'se' },
  { character: 'そ', romanization: 'so' },
  { character: 'た', romanization: 'ta' },
  { character: 'ち', romanization: 'chi' },
  { character: 'つ', romanization: 'tsu' },
  { character: 'て', romanization: 'te' },
  { character: 'と', romanization: 'to' },
  // Add more characters as needed
];

// Dummy backend service
export class HiraganaService {
  static getRandomHiragana() {
    const randomIndex = Math.floor(Math.random() * hiraganaData.length);
    return hiraganaData[randomIndex];
  }
} 