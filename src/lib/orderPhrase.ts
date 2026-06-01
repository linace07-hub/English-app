export type WordToken = { id: number; word: string };

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Build clickable word bank for order-phrase exercises. */
export function getOrderPhraseBank(exercise: {
  scrambledWords?: string[];
  correctAnswer: string;
}): WordToken[] {
  if (exercise.scrambledWords?.length) {
    return exercise.scrambledWords.map((word, id) => ({ id, word }));
  }

  const words = exercise.correctAnswer.trim().split(/\s+/).filter(Boolean);
  const tokens = words.map((word, id) => ({ id, word }));
  return shuffle(tokens);
}

export function normalizePhrase(phrase: string): string {
  return phrase
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s+([?.!,])/g, '$1');
}

export function phrasesMatch(userPhrase: string, correctAnswer: string): boolean {
  return (
    normalizePhrase(userPhrase).toLowerCase() ===
    normalizePhrase(correctAnswer).toLowerCase()
  );
}

export function joinOrderedWords(slots: WordToken[]): string {
  return slots.map((s) => s.word).join(' ');
}
