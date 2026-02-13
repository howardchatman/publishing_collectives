// Phoneme pronunciation map — maps written phonemes to
// how they should be spoken for the Web Speech API
const PHONEME_PRONUNCIATION: Record<string, string> = {
  // Single consonants
  B: "buh", C: "kuh", D: "duh", F: "fff", G: "guh",
  H: "huh", J: "juh", K: "kuh", L: "lll", M: "mmm",
  N: "nnn", P: "puh", Q: "kwuh", R: "rrr", S: "sss",
  T: "tuh", V: "vvv", W: "wuh", X: "ks", Y: "yuh", Z: "zzz",
  // Single vowels (short sounds)
  A: "aah", E: "eh", I: "ih", O: "oh", U: "uh",
  // Consonant blends
  BL: "bl", BR: "br", CL: "cl", CR: "cr", DR: "dr",
  FL: "fl", FR: "fr", GL: "gl", GR: "gr", PL: "pl",
  PR: "pr", SL: "sl", SM: "sm", SN: "sn", SP: "sp",
  ST: "st", STR: "str", SW: "sw", TR: "tr", TW: "tw",
  SC: "sk", SK: "sk", SCR: "scr",
  // Digraphs
  SH: "shh", CH: "chuh", TH: "thh", WH: "wh", PH: "ff",
  CK: "k", NG: "ng",
  // Vowel teams (long sounds)
  EE: "ee", OO: "oo", AI: "ay", OA: "oh", EA: "ee",
  OU: "ow", AW: "aw", OI: "oy", IE: "eye", UE: "oo",
  // R-controlled vowels
  AR: "ar", OR: "or", ER: "er", IR: "er", UR: "er",
  // Silent e combinations
  LE: "ul",
};

let speechSupported: boolean | null = null;

function isSpeechSupported(): boolean {
  if (speechSupported !== null) return speechSupported;
  speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  return speechSupported;
}

export function speakPhoneme(phoneme: string): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();
  const text = PHONEME_PRONUNCIATION[phoneme.toUpperCase()] ?? phoneme.toLowerCase();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.8;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function speakWord(word: string): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.rate = 0.75;
  utterance.pitch = 1.1;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

export function speakBlend(phonemes: string[], word: string): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();

  // Speak each phoneme with a pause, then the full word
  let delay = 0;
  for (const phoneme of phonemes) {
    setTimeout(() => speakPhoneme(phoneme), delay);
    delay += 600;
  }
  setTimeout(() => speakWord(word), delay + 300);
}
