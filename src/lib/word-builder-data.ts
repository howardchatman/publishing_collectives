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
      { word: "SUN", emoji: "\u2600\uFE0F", hint: "It shines bright in the sky!", imageSrc: "/images/games/sun.png" },
      { word: "CAT", emoji: "\uD83D\uDC31", hint: "This pet says 'meow'!", imageSrc: "/images/games/cat.png" },
      { word: "DOG", emoji: "\uD83D\uDC36", hint: "This pet says 'woof'!", imageSrc: "/images/games/dog.png" },
      { word: "HAT", emoji: "\uD83E\uDDE2", hint: "You wear it on your head!", imageSrc: "/images/games/hat.png" },
      { word: "BEE", emoji: "\uD83D\uDC1D", hint: "It makes honey and goes 'buzz'!", imageSrc: "/images/games/bee.png" },
      { word: "CUP", emoji: "\u2615", hint: "You drink from it!", imageSrc: "/images/games/cup.png" },
      { word: "BUS", emoji: "\uD83D\uDE8C", hint: "A big vehicle that carries many people!", imageSrc: "/images/games/bus.png" },
      { word: "FISH", emoji: "\uD83D\uDC1F", hint: "It swims in the water!", imageSrc: "/images/games/fish.png" },
    ],
  },
  {
    name: "medium",
    label: "Medium",
    words: [
      { word: "BOOK", emoji: "\uD83D\uDCD6", hint: "You read stories in it!", imageSrc: "/images/games/book.png" },
      { word: "MOON", emoji: "\uD83C\uDF19", hint: "It lights up the night sky!", imageSrc: "/images/games/moon.png" },
      { word: "STAR", emoji: "\u2B50", hint: "It twinkles in the night sky!", imageSrc: "/images/games/star.png" },
      { word: "TREE", emoji: "\uD83C\uDF33", hint: "It has leaves and grows tall!", imageSrc: "/images/games/tree.png" },
      { word: "RAIN", emoji: "\uD83C\uDF27\uFE0F", hint: "Water falling from clouds!", imageSrc: "/images/games/rain.png" },
      { word: "BIRD", emoji: "\uD83D\uDC26", hint: "It has wings and can fly!", imageSrc: "/images/games/bird.png" },
      { word: "FROG", emoji: "\uD83D\uDC38", hint: "It says 'ribbit' and hops!", imageSrc: "/images/games/frog.png" },
      { word: "CAKE", emoji: "\uD83C\uDF82", hint: "A sweet treat for birthdays!", imageSrc: "/images/games/cake.png" },
    ],
  },
  {
    name: "hard",
    label: "Hard",
    words: [
      { word: "CLOUD", emoji: "\u2601\uFE0F", hint: "White and fluffy in the sky!", imageSrc: "/images/games/cloud.png" },
      { word: "HOUSE", emoji: "\uD83C\uDFE0", hint: "You live inside it!", imageSrc: "/images/games/house.png" },
      { word: "SMILE", emoji: "\uD83D\uDE0A", hint: "What you do when you're happy!", imageSrc: "/images/games/smile.png" },
      { word: "HEART", emoji: "\u2764\uFE0F", hint: "A symbol of love!", imageSrc: "/images/games/heart.png" },
      { word: "MUSIC", emoji: "\uD83C\uDFB5", hint: "Sounds you listen and dance to!", imageSrc: "/images/games/music.png" },
      { word: "LIGHT", emoji: "\uD83D\uDCA1", hint: "It helps you see in the dark!", imageSrc: "/images/games/light.png" },
      { word: "DREAM", emoji: "\uD83D\uDCAD", hint: "Stories your mind tells when you sleep!", imageSrc: "/images/games/dream.png" },
      { word: "OCEAN", emoji: "\uD83C\uDF0A", hint: "A very big body of salty water!", imageSrc: "/images/games/ocean.png" },
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
