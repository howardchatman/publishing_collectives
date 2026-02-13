// In-memory cache: text → audio blob URL
const audioCache = new Map<string, string>();

/** Fetch TTS audio from OpenAI via our API route, with caching */
async function fetchTTS(text: string): Promise<string | null> {
  const key = text.toLowerCase();
  const cached = audioCache.get(key);
  if (cached) return cached;

  try {
    const res = await fetch("/api/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: key }),
    });

    if (!res.ok) return null;

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioCache.set(key, url);
    return url;
  } catch {
    return null;
  }
}

/** Play audio from a blob URL */
function playAudio(url: string): HTMLAudioElement {
  const audio = new Audio(url);
  audio.play();
  return audio;
}

// ─── Web Speech API fallback ────────────────────────────────

let speechSupported: boolean | null = null;

function isSpeechSupported(): boolean {
  if (speechSupported !== null) return speechSupported;
  speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;
  return speechSupported;
}

function fallbackSpeak(text: string, rate = 0.7): void {
  if (!isSpeechSupported()) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text.toLowerCase());
  utterance.rate = rate;
  utterance.pitch = 1.0;
  utterance.volume = 1;
  window.speechSynthesis.speak(utterance);
}

// ─── Public API ─────────────────────────────────────────────

/** Speak a word clearly using OpenAI TTS (falls back to Web Speech API) */
export async function speakWord(word: string): Promise<void> {
  const url = await fetchTTS(word);
  if (url) {
    playAudio(url);
  } else {
    fallbackSpeak(word, 0.7);
  }
}

/** Speak the word slowly */
export async function speakWordSlowly(word: string): Promise<void> {
  // OpenAI TTS at slower speed
  const url = await fetchTTS(word);
  if (url) {
    const audio = playAudio(url);
    audio.playbackRate = 0.75;
  } else {
    fallbackSpeak(word, 0.4);
  }
}

/**
 * For the blend animation: speak the word slowly first,
 * then speak it at normal speed.
 */
export async function speakBlend(_phonemes: string[], word: string): Promise<void> {
  // Pre-fetch the audio so both plays are instant
  const url = await fetchTTS(word);

  if (url) {
    const slow = new Audio(url);
    slow.playbackRate = 0.75;
    slow.play();

    setTimeout(() => {
      const normal = new Audio(url);
      normal.play();
    }, 1200);
  } else {
    fallbackSpeak(word, 0.4);
    setTimeout(() => fallbackSpeak(word, 0.7), 1200);
  }
}

/** Speak a phoneme sound */
export async function speakPhoneme(phoneme: string): Promise<void> {
  const url = await fetchTTS(phoneme);
  if (url) {
    playAudio(url);
  } else {
    fallbackSpeak(phoneme, 0.6);
  }
}
