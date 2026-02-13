"use client";

import { useReducer, useCallback, useState, useRef, useEffect } from "react";
import {
  DIFFICULTY_LEVELS,
  scrambleWord,
  getDistractorLetters,
} from "@/lib/word-builder-data";
import PictureDisplay from "./PictureDisplay";
import ScoreBoard from "./ScoreBoard";
import LetterTile from "./LetterTile";
import WordSlots from "./WordSlots";
import CelebrationOverlay from "./CelebrationOverlay";

// ─── Types ───────────────────────────────────────────────────────────

interface TileData {
  letter: string;
  placed: boolean; // true if tile is currently in a slot
}

interface GameState {
  difficultyIndex: number;
  wordIndex: number;
  tiles: TileData[];
  slots: (number | null)[]; // each slot holds a tile index or null
  score: number;
  streak: number;
  feedback: "none" | "correct" | "incorrect";
  slotFeedback: ("correct" | "incorrect" | null)[];
  gameOver: boolean;
  showCelebration: boolean;
  pointsEarned: number;
  isLevelUp: boolean;
}

type GameAction =
  | { type: "PLACE_TILE"; tileIndex: number; slotIndex: number }
  | { type: "REMOVE_TILE"; slotIndex: number }
  | { type: "CHECK_WORD" }
  | { type: "NEXT_ROUND" }
  | { type: "RESET_GAME" }
  | { type: "DISMISS_CELEBRATION" };

// ─── Helpers ─────────────────────────────────────────────────────────

function getDistractorCount(difficultyIndex: number): number {
  if (difficultyIndex === 0) return 0;
  if (difficultyIndex === 1) return 1;
  return 2;
}

function buildInitialTiles(word: string, difficultyIndex: number): TileData[] {
  const distractors = getDistractorLetters(
    word,
    getDistractorCount(difficultyIndex)
  );
  const allLetters = [...word.split(""), ...distractors];
  const scrambled = scrambleWord(allLetters.join(""));
  return scrambled.map((letter) => ({ letter, placed: false }));
}

function createInitialState(): GameState {
  const word = DIFFICULTY_LEVELS[0].words[0].word;
  const tiles = buildInitialTiles(word, 0);
  return {
    difficultyIndex: 0,
    wordIndex: 0,
    tiles,
    slots: Array(word.length).fill(null),
    score: 0,
    streak: 0,
    feedback: "none",
    slotFeedback: Array(word.length).fill(null),
    gameOver: false,
    showCelebration: false,
    pointsEarned: 0,
    isLevelUp: false,
  };
}

function getCurrentWord(state: GameState): string {
  return DIFFICULTY_LEVELS[state.difficultyIndex].words[state.wordIndex].word;
}

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "PLACE_TILE": {
      const { tileIndex, slotIndex } = action;
      if (state.tiles[tileIndex].placed) return state;

      const newTiles = [...state.tiles];
      const newSlots = [...state.slots];

      // If slot already occupied, return that tile first
      const existingTile = newSlots[slotIndex];
      if (existingTile !== null) {
        newTiles[existingTile] = { ...newTiles[existingTile], placed: false };
      }

      newTiles[tileIndex] = { ...newTiles[tileIndex], placed: true };
      newSlots[slotIndex] = tileIndex;

      return {
        ...state,
        tiles: newTiles,
        slots: newSlots,
        feedback: "none",
        slotFeedback: Array(newSlots.length).fill(null),
      };
    }

    case "REMOVE_TILE": {
      const { slotIndex } = action;
      const tileIndex = state.slots[slotIndex];
      if (tileIndex === null) return state;

      const newTiles = [...state.tiles];
      const newSlots = [...state.slots];

      newTiles[tileIndex] = { ...newTiles[tileIndex], placed: false };
      newSlots[slotIndex] = null;

      return {
        ...state,
        tiles: newTiles,
        slots: newSlots,
        feedback: "none",
        slotFeedback: Array(newSlots.length).fill(null),
      };
    }

    case "CHECK_WORD": {
      const word = getCurrentWord(state);
      const spelled = state.slots
        .map((ti) => (ti !== null ? state.tiles[ti].letter : ""))
        .join("");

      if (spelled.length !== word.length || state.slots.includes(null)) {
        return state; // not all slots filled
      }

      const isCorrect = spelled === word;

      if (isCorrect) {
        const streak = state.streak + 1;
        const points = 10 + (streak >= 2 ? (streak - 1) * 2 : 0);

        // Check if this was the last word in the level
        const wordsInLevel =
          DIFFICULTY_LEVELS[state.difficultyIndex].words.length;
        const isLastWordInLevel = state.wordIndex + 1 >= wordsInLevel;
        const isLastLevel =
          state.difficultyIndex + 1 >= DIFFICULTY_LEVELS.length;
        const isLevelUp = isLastWordInLevel && !isLastLevel;

        return {
          ...state,
          score: state.score + points,
          streak,
          feedback: "correct",
          slotFeedback: state.slots.map(() => "correct"),
          showCelebration: true,
          pointsEarned: points,
          isLevelUp,
          gameOver: isLastWordInLevel && isLastLevel,
        };
      }

      return {
        ...state,
        streak: 0,
        feedback: "incorrect",
        slotFeedback: state.slots.map((ti, i) => {
          if (ti === null) return null;
          return state.tiles[ti].letter === word[i] ? "correct" : "incorrect";
        }),
      };
    }

    case "NEXT_ROUND": {
      const wordsInLevel =
        DIFFICULTY_LEVELS[state.difficultyIndex].words.length;
      let nextDifficulty = state.difficultyIndex;
      let nextWord = state.wordIndex + 1;

      if (nextWord >= wordsInLevel) {
        nextDifficulty = state.difficultyIndex + 1;
        nextWord = 0;
      }

      if (nextDifficulty >= DIFFICULTY_LEVELS.length) {
        return { ...state, gameOver: true, showCelebration: false };
      }

      const word = DIFFICULTY_LEVELS[nextDifficulty].words[nextWord].word;
      const tiles = buildInitialTiles(word, nextDifficulty);

      return {
        ...state,
        difficultyIndex: nextDifficulty,
        wordIndex: nextWord,
        tiles,
        slots: Array(word.length).fill(null),
        feedback: "none",
        slotFeedback: Array(word.length).fill(null),
        showCelebration: false,
        pointsEarned: 0,
        isLevelUp: false,
      };
    }

    case "DISMISS_CELEBRATION": {
      return { ...state, showCelebration: false };
    }

    case "RESET_GAME": {
      return createInitialState();
    }

    default:
      return state;
  }
}

// ─── Component ───────────────────────────────────────────────────────

export default function WordBuilderGame() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [selectedTile, setSelectedTile] = useState<number | null>(null);
  const [highlightedSlot, setHighlightedSlot] = useState<number | null>(null);
  const [touchDrag, setTouchDrag] = useState<{
    tileIndex: number;
    letter: string;
    x: number;
    y: number;
  } | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);

  const currentLevel = DIFFICULTY_LEVELS[state.difficultyIndex];
  const currentWordEntry = currentLevel.words[state.wordIndex];
  const allSlotsFilled = !state.slots.includes(null);

  // ── Drag and Drop (desktop) ──

  const handleTileDragStart = useCallback((_index: number) => {
    setSelectedTile(null);
  }, []);

  const handleSlotDrop = useCallback(
    (slotIndex: number, data: string) => {
      try {
        const parsed = JSON.parse(data);
        if (parsed.source === "tile") {
          dispatch({ type: "PLACE_TILE", tileIndex: parsed.index, slotIndex });
        }
      } catch {
        // ignore
      }
      setHighlightedSlot(null);
    },
    []
  );

  // ── Touch drag (mobile) ──

  const handleTouchStart = useCallback(
    (tileIndex: number, e: React.TouchEvent) => {
      const tile = state.tiles[tileIndex];
      if (tile.placed) return;
      const touch = e.touches[0];
      setTouchDrag({
        tileIndex,
        letter: tile.letter,
        x: touch.clientX,
        y: touch.clientY,
      });
      setSelectedTile(null);
    },
    [state.tiles]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!touchDrag) return;
      const touch = e.touches[0];
      setTouchDrag((prev) =>
        prev ? { ...prev, x: touch.clientX, y: touch.clientY } : null
      );

      // Hit test for slot highlighting
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (el) {
        const slotEl = el.closest("[data-slot-index]") as HTMLElement | null;
        if (slotEl) {
          setHighlightedSlot(Number(slotEl.dataset.slotIndex));
        } else {
          setHighlightedSlot(null);
        }
      }
    },
    [touchDrag]
  );

  const handleTouchEnd = useCallback(() => {
    if (!touchDrag) return;
    if (highlightedSlot !== null) {
      dispatch({
        type: "PLACE_TILE",
        tileIndex: touchDrag.tileIndex,
        slotIndex: highlightedSlot,
      });
    }
    setTouchDrag(null);
    setHighlightedSlot(null);
  }, [touchDrag, highlightedSlot]);

  // ── Click-to-place ──

  const handleTileClick = useCallback(
    (tileIndex: number) => {
      if (state.tiles[tileIndex].placed) return;
      if (selectedTile === tileIndex) {
        setSelectedTile(null);
      } else {
        setSelectedTile(tileIndex);
      }
    },
    [state.tiles, selectedTile]
  );

  const handleSlotClick = useCallback(
    (slotIndex: number) => {
      // If a tile is selected, place it
      if (selectedTile !== null) {
        dispatch({ type: "PLACE_TILE", tileIndex: selectedTile, slotIndex });
        setSelectedTile(null);
        return;
      }
      // If slot has a letter, remove it
      if (state.slots[slotIndex] !== null) {
        dispatch({ type: "REMOVE_TILE", slotIndex });
      }
    },
    [selectedTile, state.slots]
  );

  // ── Prevent scroll during touch drag ──

  useEffect(() => {
    if (!touchDrag) return;
    const prevent = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", prevent, { passive: false });
    return () => document.removeEventListener("touchmove", prevent);
  }, [touchDrag]);

  // ── Game Over screen ──

  if (state.gameOver && !state.showCelebration) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <span className="text-7xl">🏆</span>
        <h2 className="text-3xl md:text-4xl font-black text-dark text-center">
          Amazing Job!
        </h2>
        <p className="text-xl font-semibold text-dark/70">
          Final Score: {state.score} points
        </p>
        <p className="text-base text-dark/60">
          You spelled all 24 words!
        </p>
        <button
          onClick={() => dispatch({ type: "RESET_GAME" })}
          className="mt-4 bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors text-lg"
        >
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div
      ref={gameRef}
      className="flex flex-col items-center gap-6 select-none"
      style={{ touchAction: "none" }}
      role="application"
      aria-label="Word Builder spelling game"
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Score */}
      <ScoreBoard
        score={state.score}
        difficulty={currentLevel.name}
        round={state.wordIndex + 1}
        totalRoundsInLevel={currentLevel.words.length}
        streak={state.streak}
      />

      {/* Picture */}
      <PictureDisplay
        emoji={currentWordEntry.emoji}
        hint={currentWordEntry.hint}
        imageSrc={currentWordEntry.imageSrc}
      />

      {/* Drop Slots */}
      <WordSlots
        placedLetters={state.slots.map((ti) =>
          ti !== null ? state.tiles[ti].letter : null
        )}
        slotFeedback={state.slotFeedback}
        highlightedSlot={highlightedSlot}
        onDrop={handleSlotDrop}
        onSlotClick={handleSlotClick}
      />

      {/* Available Letter Tiles */}
      <div className="flex flex-wrap items-center justify-center gap-3 min-h-[60px]">
        {state.tiles.map((tile, i) => (
          <div
            key={i}
            onTouchStart={(e) => handleTouchStart(i, e)}
          >
            <LetterTile
              letter={tile.letter}
              index={i}
              isSelected={selectedTile === i}
              isPlaced={tile.placed}
              onDragStart={handleTileDragStart}
              onClick={handleTileClick}
            />
          </div>
        ))}
      </div>

      {/* Check Button */}
      <button
        onClick={() => dispatch({ type: "CHECK_WORD" })}
        disabled={!allSlotsFilled || state.feedback === "correct"}
        className={`px-10 py-3 rounded-full text-lg font-bold transition-all duration-200 ${
          allSlotsFilled && state.feedback !== "correct"
            ? "bg-accent hover:bg-amber-500 text-dark shadow-md hover:shadow-lg active:scale-95"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        Check Spelling!
      </button>

      {/* Feedback messages */}
      {state.feedback === "incorrect" && (
        <p className="text-base font-semibold text-red-500 animate-[tileShake_0.4s_ease-in-out]">
          Almost! Try rearranging the letters!
        </p>
      )}

      {/* Accessibility live region */}
      <div aria-live="polite" className="sr-only">
        {state.feedback === "correct" &&
          `Correct! You spelled ${currentWordEntry.word}. ${state.pointsEarned} points earned.`}
        {state.feedback === "incorrect" &&
          "Not quite right. Try rearranging the letters!"}
      </div>

      {/* Celebration Overlay */}
      {state.showCelebration && (
        <CelebrationOverlay
          word={currentWordEntry.word}
          points={state.pointsEarned}
          isLevelUp={state.isLevelUp}
          onContinue={() => dispatch({ type: "NEXT_ROUND" })}
        />
      )}

      {/* Touch drag ghost */}
      {touchDrag && (
        <div
          className="fixed pointer-events-none z-50 w-12 h-12 bg-white border-2 border-accent rounded-xl shadow-xl flex items-center justify-center text-xl font-black text-dark scale-110"
          style={{
            left: touchDrag.x - 24,
            top: touchDrag.y - 24,
          }}
        >
          {touchDrag.letter}
        </div>
      )}
    </div>
  );
}
