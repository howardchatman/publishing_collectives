"use client";

import { useReducer, useCallback, useState, useRef, useEffect } from "react";
import {
  PHONEME_LEVELS,
  getRoundPhonemes,
  calculateSpeedBonus,
  calculatePoints,
} from "@/lib/phoneme-blender-data";
import ScoreBoard from "@/components/word-builder/ScoreBoard";
import PictureDisplay from "@/components/word-builder/PictureDisplay";
import CelebrationOverlay from "@/components/word-builder/CelebrationOverlay";
import PhonemeBubble from "./PhonemeBubble";
import BlendingZone from "./BlendingZone";
import BlendAnimation from "./BlendAnimation";
import SpeedTimer from "./SpeedTimer";
import LessonScreen from "./LessonScreen";

// ─── Types ───────────────────────────────────────────────────────────

interface BubbleData {
  phoneme: string;
  id: string;
  placed: boolean;
}

interface GameState {
  levelIndex: number;
  wordIndex: number;
  bubbles: BubbleData[];
  slots: (string | null)[]; // bubble IDs
  score: number;
  streak: number;
  feedback: "none" | "correct" | "incorrect";
  slotFeedback: ("correct" | "incorrect" | null)[];
  gameOver: boolean;
  showCelebration: boolean;
  showBlendAnimation: boolean;
  showLesson: boolean;
  pointsEarned: number;
  isLevelUp: boolean;
  roundStartTime: number;
  blendedWord: string | null;
}

type GameAction =
  | { type: "START_LEVEL" }
  | { type: "PLACE_BUBBLE"; bubbleId: string; slotIndex: number }
  | { type: "REMOVE_BUBBLE"; slotIndex: number }
  | { type: "BLEND" }
  | { type: "BLEND_ANIMATION_COMPLETE" }
  | { type: "NEXT_ROUND" }
  | { type: "RESET_GAME" };

// ─── Helpers ─────────────────────────────────────────────────────────

function buildBubbles(levelIndex: number, wordIndex: number): BubbleData[] {
  const entry = PHONEME_LEVELS[levelIndex].words[wordIndex];
  const scrambled = getRoundPhonemes(entry);
  return scrambled.map((phoneme, i) => ({
    phoneme,
    id: `${phoneme}-${i}`,
    placed: false,
  }));
}

function createInitialState(): GameState {
  return {
    levelIndex: 0,
    wordIndex: 0,
    bubbles: [],
    slots: [],
    score: 0,
    streak: 0,
    feedback: "none",
    slotFeedback: [],
    gameOver: false,
    showCelebration: false,
    showBlendAnimation: false,
    showLesson: true,
    pointsEarned: 0,
    isLevelUp: false,
    roundStartTime: Date.now(),
    blendedWord: null,
  };
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_LEVEL": {
      const bubbles = buildBubbles(state.levelIndex, state.wordIndex);
      const phonemeCount = PHONEME_LEVELS[state.levelIndex].words[state.wordIndex].phonemes.length;
      return {
        ...state,
        showLesson: false,
        bubbles,
        slots: Array(phonemeCount).fill(null),
        slotFeedback: Array(phonemeCount).fill(null),
        feedback: "none",
        roundStartTime: Date.now(),
      };
    }

    case "PLACE_BUBBLE": {
      const { bubbleId, slotIndex } = action;
      const bubbleIdx = state.bubbles.findIndex((b) => b.id === bubbleId);
      if (bubbleIdx === -1 || state.bubbles[bubbleIdx].placed) return state;

      const newBubbles = [...state.bubbles];
      const newSlots = [...state.slots];

      // If slot occupied, return that bubble first
      const existing = newSlots[slotIndex];
      if (existing !== null) {
        const existingIdx = newBubbles.findIndex((b) => b.id === existing);
        if (existingIdx !== -1) {
          newBubbles[existingIdx] = { ...newBubbles[existingIdx], placed: false };
        }
      }

      newBubbles[bubbleIdx] = { ...newBubbles[bubbleIdx], placed: true };
      newSlots[slotIndex] = bubbleId;

      return {
        ...state,
        bubbles: newBubbles,
        slots: newSlots,
        feedback: "none",
        slotFeedback: Array(newSlots.length).fill(null),
      };
    }

    case "REMOVE_BUBBLE": {
      const { slotIndex } = action;
      const bubbleId = state.slots[slotIndex];
      if (bubbleId === null) return state;

      const newBubbles = [...state.bubbles];
      const newSlots = [...state.slots];
      const idx = newBubbles.findIndex((b) => b.id === bubbleId);
      if (idx !== -1) {
        newBubbles[idx] = { ...newBubbles[idx], placed: false };
      }
      newSlots[slotIndex] = null;

      return {
        ...state,
        bubbles: newBubbles,
        slots: newSlots,
        feedback: "none",
        slotFeedback: Array(newSlots.length).fill(null),
      };
    }

    case "BLEND": {
      if (state.slots.includes(null)) return state;

      const level = PHONEME_LEVELS[state.levelIndex];
      const entry = level.words[state.wordIndex];
      const placedPhonemes = state.slots.map((id) => {
        const b = state.bubbles.find((b) => b.id === id);
        return b ? b.phoneme : "";
      });

      const isCorrect = placedPhonemes.every((p, i) => p === entry.phonemes[i]);

      if (isCorrect) {
        const elapsed = Date.now() - state.roundStartTime;
        const speedBonus = calculateSpeedBonus(elapsed, entry.phonemes.length);
        const streak = state.streak + 1;
        const points = calculatePoints(streak, speedBonus);

        const isLastWord = state.wordIndex + 1 >= level.words.length;
        const isLastLevel = state.levelIndex + 1 >= PHONEME_LEVELS.length;
        const isLevelUp = isLastWord && !isLastLevel;

        return {
          ...state,
          score: state.score + points,
          streak,
          feedback: "correct",
          slotFeedback: state.slots.map(() => "correct" as const),
          showBlendAnimation: true,
          blendedWord: entry.word,
          pointsEarned: points,
          isLevelUp,
          gameOver: isLastWord && isLastLevel,
        };
      }

      return {
        ...state,
        streak: 0,
        feedback: "incorrect",
        slotFeedback: state.slots.map((id, i) => {
          const b = state.bubbles.find((b) => b.id === id);
          if (!b) return null;
          return b.phoneme === entry.phonemes[i] ? "correct" : "incorrect";
        }),
      };
    }

    case "BLEND_ANIMATION_COMPLETE": {
      return {
        ...state,
        showBlendAnimation: false,
        showCelebration: true,
      };
    }

    case "NEXT_ROUND": {
      const level = PHONEME_LEVELS[state.levelIndex];
      let nextLevel = state.levelIndex;
      let nextWord = state.wordIndex + 1;
      let showLesson = false;

      if (nextWord >= level.words.length) {
        nextLevel = state.levelIndex + 1;
        nextWord = 0;
        showLesson = true;
      }

      if (nextLevel >= PHONEME_LEVELS.length) {
        return { ...state, gameOver: true, showCelebration: false };
      }

      if (showLesson) {
        return {
          ...state,
          levelIndex: nextLevel,
          wordIndex: nextWord,
          showCelebration: false,
          showLesson: true,
          showBlendAnimation: false,
          blendedWord: null,
          pointsEarned: 0,
          isLevelUp: false,
          feedback: "none",
        };
      }

      const bubbles = buildBubbles(nextLevel, nextWord);
      const phonemeCount = PHONEME_LEVELS[nextLevel].words[nextWord].phonemes.length;

      return {
        ...state,
        levelIndex: nextLevel,
        wordIndex: nextWord,
        bubbles,
        slots: Array(phonemeCount).fill(null),
        slotFeedback: Array(phonemeCount).fill(null),
        feedback: "none",
        showCelebration: false,
        showBlendAnimation: false,
        blendedWord: null,
        pointsEarned: 0,
        isLevelUp: false,
        roundStartTime: Date.now(),
      };
    }

    case "RESET_GAME": {
      return createInitialState();
    }

    default:
      return state;
  }
}

// ─── Component ───────────────────────────────────────────────────────

const DIFFICULTY_MAP: Record<number, "easy" | "medium" | "hard"> = {
  0: "easy",
  1: "easy",
  2: "medium",
  3: "hard",
};

export default function PhonemeBlenderGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [selectedBubble, setSelectedBubble] = useState<string | null>(null);
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null);
  const [touchDrag, setTouchDrag] = useState<{
    bubbleId: string;
    phoneme: string;
    x: number;
    y: number;
  } | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);

  const currentLevel = PHONEME_LEVELS[state.levelIndex];
  const currentEntry = currentLevel?.words[state.wordIndex];
  const allSlotsFilled = !state.slots.includes(null);

  // ── Drag and Drop (desktop) ──

  const handleBubbleDragStart = useCallback((_id: string) => {
    setSelectedBubble(null);
  }, []);

  const handleSlotDrop = useCallback((slotIndex: number, data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.source === "bubble") {
        dispatch({ type: "PLACE_BUBBLE", bubbleId: parsed.id, slotIndex });
      }
    } catch {
      // ignore
    }
    setHighlightedSlot(null);
  }, []);

  // ── Touch drag (mobile) ──

  const handleTouchStart = useCallback(
    (bubbleId: string, e: React.TouchEvent) => {
      const bubble = state.bubbles.find((b) => b.id === bubbleId);
      if (!bubble || bubble.placed) return;
      const touch = e.touches[0];
      setTouchDrag({
        bubbleId,
        phoneme: bubble.phoneme,
        x: touch.clientX,
        y: touch.clientY,
      });
      setSelectedBubble(null);
    },
    [state.bubbles]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchDrag) return;
      const touch = e.touches[0];
      setTouchDrag((prev) =>
        prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null
      );
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (el) {
        const slotEl = el.closest("[data-slot-index]") as HTMLElement | null;
        setHighlightedSlot(slotEl ? Number(slotEl.dataset.slotIndex) : null);
      }
    },
    [touchDrag]
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchDrag) return;
    if (highlightedSlot !== null) {
      dispatch({
        type: "PLACE_BUBBLE",
        bubbleId: touchDrag.bubbleId,
        slotIndex: highlightedSlot,
      });
    }
    setTouchDrag(null);
    setHighlightedSlot(null);
  }, [touchDrag, highlightedSlot]);

  // ── Click-to-place ──

  const handleBubbleClick = useCallback(
    (bubbleId: string) => {
      const bubble = state.bubbles.find((b) => b.id === bubbleId);
      if (!bubble || bubble.placed) return;
      setSelectedBubble(selectedBubble === bubbleId ? null : bubbleId);
    },
    [state.bubbles, selectedBubble]
  );

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      if (selectedBubble !== null) {
        dispatch({ type: "PLACE_BUBBLE", bubbleId: selectedBubble, slotIndex });
        setSelectedBubble(null);
        return;
      }
      if (state.slots[slotIndex] !== null) {
        dispatch({ type: "REMOVE_BUBBLE", slotIndex });
      }
    },
    [selectedBubble, state.slots]
  );

  // ── Prevent scroll during touch drag ──

  useEffect(() => {
    if (!touchDrag) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, [touchDrag]);

  // ── Lesson screen ──

  if (state.showLesson && currentLevel) {
    return (
      <LessonScreen
        lesson={currentLevel.lesson}
        levelNumber={state.levelIndex + 1}
        onStart={() => dispatch({ type: "START_LEVEL" })}
      />
    );
  }

  // ── Game Over ──

  if (state.gameOver && !state.showCelebration && !state.showBlendAnimation) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <span className="text-7xl">🏆</span>
        <h2 className="text-3xl md:text-4xl font-black text-dark text-center">
          Phonics Champion!
        </h2>
        <p className="text-xl font-semibold text-dark/70">
          Final Score: {state.score} points
        </p>
        <p className="text-base text-dark/60">
          You mastered all 4 phonics levels!
        </p>
        <button
          onClick={() => dispatch({ type: "RESET_GAME" })}
          className="mt-4 bg-accent hover:bg-amber-500 text-dark font-semibold px-8 py-3 rounded-full transition-colors text-lg"
        >
          Play Again
        </button>
      </div>
    );
  }

  if (!currentEntry) return null;

  return (
    <div
      ref={gameRef}
      className="flex flex-col items-center gap-5 select-none"
      style={{ touchAction: "none" }}
      role="application"
      aria-label="Phoneme Blender phonics game"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Score + Timer row */}
      <div className="w-full flex items-center gap-3">
        <div className="flex-1">
          <ScoreBoard
            score={state.score}
            difficulty={DIFFICULTY_MAP[state.levelIndex] ?? "easy"}
            round={state.wordIndex + 1}
            totalRoundsInLevel={currentLevel.words.length}
            streak={state.streak}
          />
        </div>
        <SpeedTimer
          startTime={state.roundStartTime}
          isActive={state.feedback === "none" && !state.showBlendAnimation}
          phonemeCount={currentEntry.phonemes.length}
        />
      </div>

      {/* Level label */}
      <span className="text-xs font-bold px-3 py-1 rounded-full bg-accent/20 text-accent uppercase tracking-wide">
        {currentLevel.label}
      </span>

      {/* Picture */}
      <PictureDisplay
        emoji={currentEntry.emoji}
        hint={currentEntry.hint}
      />

      {/* Blending Zone */}
      <BlendingZone
        placedPhonemes={state.slots.map((id) => {
          if (id === null) return null;
          const b = state.bubbles.find((b) => b.id === id);
          return b ? b.phoneme : null;
        })}
        slotFeedback={state.slotFeedback}
        highlightedSlot={highlightedSlot}
        onDrop={handleSlotDrop}
        onSlotClick={handleSlotClick}
      />

      {/* Phoneme Bubbles */}
      <div className="flex flex-wrap items-center justify-center gap-3 min-h-[60px]">
        {state.bubbles.map((bubble) => (
          <div
            key={bubble.id}
            onTouchStart={(e) => handleTouchStart(bubble.id, e)}
          >
            <PhonemeBubble
              phoneme={bubble.phoneme}
              id={bubble.id}
              isSelected={selectedBubble === bubble.id}
              isPlaced={bubble.placed}
              onDragStart={handleBubbleDragStart}
              onClick={handleBubbleClick}
            />
          </div>
        ))}
      </div>

      {/* Blend Button */}
      <button
        onClick={() => dispatch({ type: "BLEND" })}
        disabled={!allSlotsFilled || state.feedback === "correct"}
        className={`px-10 py-3 rounded-full text-lg font-bold transition-all duration-200 ${
          allSlotsFilled && state.feedback !== "correct"
            ? "bg-accent hover:bg-amber-500 text-dark shadow-md hover:shadow-lg active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Blend!
      </button>

      {/* Feedback */}
      {state.feedback === "incorrect" && (
        <p className="text-base font-semibold text-red-500 animate-[tileShake_0.4s_ease-in-out]">
          Almost! Try a different order!
        </p>
      )}

      {/* Accessibility live region */}
      <div aria-live="polite" className="sr-only">
        {state.feedback === "correct" &&
          `Correct! You blended ${currentEntry.word}. ${state.pointsEarned} points earned.`}
        {state.feedback === "incorrect" &&
          "Not quite right. Try rearranging the sounds!"}
      </div>

      {/* Blend Animation */}
      {state.showBlendAnimation && state.blendedWord && (
        <BlendAnimation
          phonemes={currentEntry.phonemes}
          word={state.blendedWord}
          onComplete={() => dispatch({ type: "BLEND_ANIMATION_COMPLETE" })}
        />
      )}

      {/* Celebration */}
      {state.showCelebration && (
        <CelebrationOverlay
          word={currentEntry.word}
          points={state.pointsEarned}
          isLevelUp={state.isLevelUp}
          onContinue={() => dispatch({ type: "NEXT_ROUND" })}
          skipSpeak
        />
      )}

      {/* Touch drag ghost */}
      {touchDrag && (
        <div
          className="fixed pointer-events-none z-50 min-w-[3rem] h-12 bg-white border-2 border-accent rounded-full shadow-xl flex items-center justify-center text-lg font-black text-dark px-3 scale-110"
          style={{
            left: touchDrag.x - 24,
            top: touchDrag.y - 24,
          }}
        >
          {touchDrag.phoneme}
        </div>
      )}
    </div>
  );
}
