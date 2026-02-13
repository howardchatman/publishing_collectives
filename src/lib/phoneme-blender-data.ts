// ─── Types ───────────────────────────────────────────────────────────

export interface PhonemeWordEntry {
  word: string;
  phonemes: string[];
  emoji: string;
  hint: string;
  distractors?: string[];
}

export interface PhonicsLesson {
  title: string;
  description: string;
  examples: { phonemes: string[]; word: string }[];
}

export interface PhonemeLevel {
  name: string;
  label: string;
  lesson: PhonicsLesson;
  words: PhonemeWordEntry[];
}

export type PhonemeType = "vowel" | "consonant";

// ─── Constants ───────────────────────────────────────────────────────

const VOWEL_PHONEMES = new Set([
  "A", "E", "I", "O", "U",
  "EE", "OO", "AI", "OA", "EA", "OU", "AW", "OI",
  "AR", "OR", "ER", "IR", "UR",
]);

export const PHONEME_LEVELS: PhonemeLevel[] = [
  {
    name: "letter-sounds",
    label: "Letter Sounds",
    lesson: {
      title: "Every Letter Has a Sound!",
      description: "Each letter makes its own special sound. Let's blend them together to make words!",
      examples: [
        { phonemes: ["C", "A", "T"], word: "CAT" },
        { phonemes: ["S", "U", "N"], word: "SUN" },
      ],
    },
    words: [
      { word: "CAT", phonemes: ["C", "A", "T"], emoji: "\uD83D\uDC31", hint: "Says meow!" },
      { word: "SUN", phonemes: ["S", "U", "N"], emoji: "\u2600\uFE0F", hint: "Shines in the sky!" },
      { word: "DOG", phonemes: ["D", "O", "G"], emoji: "\uD83D\uDC36", hint: "Says woof!" },
      { word: "HAT", phonemes: ["H", "A", "T"], emoji: "\uD83E\uDDE2", hint: "Goes on your head!" },
      { word: "BUS", phonemes: ["B", "U", "S"], emoji: "\uD83D\uDE8C", hint: "A big yellow ride!" },
      { word: "PIG", phonemes: ["P", "I", "G"], emoji: "\uD83D\uDC37", hint: "Oink oink!" },
      { word: "RUG", phonemes: ["R", "U", "G"], emoji: "\uD83E\uDEA7", hint: "Soft on the floor!" },
      { word: "PEN", phonemes: ["P", "E", "N"], emoji: "\uD83D\uDD8A\uFE0F", hint: "You write with it!" },
    ],
  },
  {
    name: "consonant-blends",
    label: "Consonant Blends",
    lesson: {
      title: "Two Consonants Can Work Together!",
      description: "Sometimes two consonants blend their sounds together. You can still hear both sounds!",
      examples: [
        { phonemes: ["ST", "A", "R"], word: "STAR" },
        { phonemes: ["FL", "A", "G"], word: "FLAG" },
      ],
    },
    words: [
      { word: "STAR", phonemes: ["ST", "A", "R"], emoji: "\u2B50", hint: "Twinkles at night!" },
      { word: "FLAG", phonemes: ["FL", "A", "G"], emoji: "\uD83C\uDFF3\uFE0F", hint: "Waves in the wind!" },
      { word: "CRAB", phonemes: ["CR", "A", "B"], emoji: "\uD83E\uDD80", hint: "Has big claws!" },
      { word: "FROG", phonemes: ["FR", "O", "G"], emoji: "\uD83D\uDC38", hint: "Says ribbit!" },
      { word: "DRUM", phonemes: ["DR", "U", "M"], emoji: "\uD83E\uDD41", hint: "You bang on it!" },
      { word: "SNAIL", phonemes: ["SN", "AI", "L"], emoji: "\uD83D\uDC0C", hint: "Carries its house!" },
      { word: "BLOCK", phonemes: ["BL", "O", "CK"], emoji: "\uD83E\uDDF1", hint: "You build with it!" },
      { word: "TRAIN", phonemes: ["TR", "AI", "N"], emoji: "\uD83D\uDE82", hint: "Rides on tracks!" },
    ],
  },
  {
    name: "digraphs",
    label: "Digraphs",
    lesson: {
      title: "Two Letters, One New Sound!",
      description: "Some letter pairs make a brand new sound. SH says /sh/, CH says /ch/, TH says /th/!",
      examples: [
        { phonemes: ["SH", "I", "P"], word: "SHIP" },
        { phonemes: ["CH", "I", "N"], word: "CHIN" },
      ],
    },
    words: [
      { word: "SHIP", phonemes: ["SH", "I", "P"], emoji: "\uD83D\uDEA2", hint: "Sails the seas!" },
      { word: "CHIN", phonemes: ["CH", "I", "N"], emoji: "\uD83D\uDE4D", hint: "Below your mouth!" },
      { word: "THIN", phonemes: ["TH", "I", "N"], emoji: "\uD83E\uDEA1", hint: "Not thick!" },
      { word: "WHALE", phonemes: ["WH", "A", "LE"], emoji: "\uD83D\uDC33", hint: "Biggest in the ocean!" },
      { word: "FISH", phonemes: ["F", "I", "SH"], emoji: "\uD83D\uDC1F", hint: "Swims in water!" },
      { word: "SHARK", phonemes: ["SH", "AR", "K"], emoji: "\uD83E\uDD88", hint: "King of the sea!" },
      { word: "CHEST", phonemes: ["CH", "E", "ST"], emoji: "\uD83E\uDE77", hint: "Holds treasure!" },
      { word: "PATH", phonemes: ["P", "A", "TH"], emoji: "\uD83D\uDEB6", hint: "You walk on it!" },
    ],
  },
  {
    name: "vowel-teams",
    label: "Vowel Teams",
    lesson: {
      title: "When Two Vowels Walk Together!",
      description: "When two vowels are side by side, the first one says its name! AI says /ay/, OA says /oh/, EE says /ee/!",
      examples: [
        { phonemes: ["R", "AI", "N"], word: "RAIN" },
        { phonemes: ["B", "OA", "T"], word: "BOAT" },
      ],
    },
    words: [
      { word: "RAIN", phonemes: ["R", "AI", "N"], emoji: "\uD83C\uDF27\uFE0F", hint: "Falls from clouds!" },
      { word: "BOAT", phonemes: ["B", "OA", "T"], emoji: "\u26F5", hint: "Floats on water!" },
      { word: "SEED", phonemes: ["S", "EE", "D"], emoji: "\uD83C\uDF31", hint: "Grows into a plant!" },
      { word: "MOON", phonemes: ["M", "OO", "N"], emoji: "\uD83C\uDF19", hint: "Glows at night!" },
      { word: "TEAM", phonemes: ["T", "EA", "M"], emoji: "\uD83E\uDD1D", hint: "Work together!" },
      { word: "GOAT", phonemes: ["G", "OA", "T"], emoji: "\uD83D\uDC10", hint: "Says baaah!" },
      { word: "FEET", phonemes: ["F", "EE", "T"], emoji: "\uD83E\uDDB6", hint: "You walk on them!" },
      { word: "TOOTH", phonemes: ["T", "OO", "TH"], emoji: "\uD83E\uDEB7", hint: "In your mouth!" },
    ],
  },
];

// ─── Utilities ───────────────────────────────────────────────────────

export function getPhonemeType(phoneme: string): PhonemeType {
  return VOWEL_PHONEMES.has(phoneme.toUpperCase()) ? "vowel" : "consonant";
}

export function scramblePhonemes(phonemes: string[]): string[] {
  let shuffled: string[];
  do {
    shuffled = [...phonemes];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
  } while (
    shuffled.length > 1 &&
    shuffled.every((p, i) => p === phonemes[i])
  );
  return shuffled;
}

export function getRoundPhonemes(entry: PhonemeWordEntry): string[] {
  const distractors = entry.distractors ?? [];
  return scramblePhonemes([...entry.phonemes, ...distractors]);
}

export function calculateSpeedBonus(elapsedMs: number, phonemeCount: number): number {
  const baseTimeMs = phonemeCount * 2000;
  if (elapsedMs >= baseTimeMs) return 0;
  const ratio = 1 - elapsedMs / baseTimeMs;
  return Math.round(ratio * 5);
}

export function calculatePoints(streak: number, speedBonus: number): number {
  const base = 10;
  const multiplier = streak >= 2 ? 1 + (streak - 1) * 0.2 : 1;
  return Math.round(base * multiplier) + speedBonus;
}
