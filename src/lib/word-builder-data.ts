export interface WordEntry {
  word: string;
  emoji: string;
  hint: string;
  imageSrc?: string;
}

export interface DifficultyLevel {
  name: "easy" | "medium" | "hard";
  label: string;
  words: WordEntry[];
}

export const DIFFICULTY_LEVELS: DifficultyLevel[] = [
  {
    name: "easy",
    label: "Easy",
    words: [
      { word: "SUN", emoji: "\u2600\uFE0F", hint: "It shines bright in the sky!" },
      { word: "CAT", emoji: "\uD83D\uDC31", hint: "This pet says 'meow'!" },
      { word: "DOG", emoji: "\uD83D\uDC36", hint: "This pet says 'woof'!" },
      { word: "HAT", emoji: "\uD83E\uDDE2", hint: "You wear it on your head!" },
      { word: "BEE", emoji: "\uD83D\uDC1D", hint: "It makes honey and goes 'buzz'!" },
      { word: "CUP", emoji: "\u2615", hint: "You drink from it!" },
      { word: "BUS", emoji: "\uD83D\uDE8C", hint: "A big vehicle that carries many people!" },
      { word: "FISH", emoji: "\uD83D\uDC1F", hint: "It swims in the water!" },
    ],
  },
  {
    name: "medium",
    label: "Medium",
    words: [
      { word: "BOOK", emoji: "\uD83D\uDCD6", hint: "You read stories in it!" },
      { word: "MOON", emoji: "\uD83C\uDF19", hint: "It lights up the night sky!" },
      { word: "STAR", emoji: "\u2B50", hint: "It twinkles in the night sky!" },
      { word: "TREE", emoji: "\uD83C\uDF33", hint: "It has leaves and grows tall!" },
      { word: "RAIN", emoji: "\uD83C\uDF27\uFE0F", hint: "Water falling from clouds!" },
      { word: "BIRD", emoji: "\uD83D\uDC26", hint: "It has wings and can fly!" },
      { word: "FROG", emoji: "\uD83D\uDC38", hint: "It says 'ribbit' and hops!" },
      { word: "CAKE", emoji: "\uD83C\uDF82", hint: "A sweet treat for birthdays!" },
    ],
  },
  {
    name: "hard",
    label: "Hard",
    words: [
      { word: "CLOUD", emoji: "\u2601\uFE0F", hint: "White and fluffy in the sky!" },
      { word: "HOUSE", emoji: "\uD83C\uDFE0", hint: "You live inside it!" },
      { word: "SMILE", emoji: "\uD83D\uDE0A", hint: "What you do when you're happy!" },
      { word: "HEART", emoji: "\u2764\uFE0F", hint: "A symbol of love!" },
      { word: "MUSIC", emoji: "\uD83C\uDFB5", hint: "Sounds you listen and dance to!" },
      { word: "LIGHT", emoji: "\uD83D\uDCA1", hint: "It helps you see in the dark!" },
      { word: "DREAM", emoji: "\uD83D\uDCAD", hint: "Stories your mind tells when you sleep!" },
      { word: "OCEAN", emoji: "\uD83C\uDF0A", hint: "A very big body of salty water!" },
    ],
  },
];

export function scrambleWord(word: string): string[] {
  const letters = word.split("");
  let shuffled: string[];
  do {
    shuffled = [...letters];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (shuffled.join("") === word && word.length > 1);
  return shuffled;
}

export function getDistractorLetters(word: string, count: number): string[] {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const wordLetters = new Set(word.split(""));
  const distractors: string[] = [];
  while (distractors.length < count) {
    const letter = alphabet[Math.floor(Math.random() * 26)];
    if (!wordLetters.has(letter) && !distractors.includes(letter)) {
      distractors.push(letter);
    }
  }
  return distractors;
}
