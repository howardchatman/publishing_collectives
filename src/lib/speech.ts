let speechSupported: boolean | null = null;

function isSpeechSupported(): boolean {
  if (speechSupported !== null) return speechSupported;
  speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  return speechSupported;
}

/** Speak a full word clearly — this is what the Speech API does well */
export function speakWord(word: string): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.rate = 0.7;
  utterance.pitch = 1.0;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

/** Speak the word slowly, stretching it out to emphasize sounds */
export function speakWordSlowly(word: string): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(word.toLowerCase());
  utterance.rate = 0.4;
  utterance.pitch = 1.0;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

/**
 * For the blend animation: speak the word slowly first,
 * then speak it at normal speed.
 */
export function speakBlend(_phonemes: string[], word: string): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();

  // First: slow pronunciation so kids hear the sounds
  speakWordSlowly(word);

  // Then: normal speed after a delay
  setTimeout(() => speakWord(word), 1200);
}

/**
 * Speak a phoneme sound — uses the letter name as a simple fallback
 * since the Speech API can't reliably produce isolated phoneme sounds.
 */
export function speakPhoneme(phoneme: string): void {
  if (!isSpeechSupported()) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(phoneme.toLowerCase());
  utterance.rate = 0.6;
  utterance.pitch = 1.0;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}
