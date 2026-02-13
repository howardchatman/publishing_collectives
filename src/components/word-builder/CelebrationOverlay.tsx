"use client";

import { useEffect } from "react";

interface CelebrationOverlayProps {
  word: string;
  points: number;
  isLevelUp: boolean;
  onContinue: () => void;
}

export default function CelebrationOverlay({
  word,
  points,
  isLevelUp,
  onContinue,
}: CelebrationOverlayProps) {
  // Auto-advance after 3 seconds
  useEffect(() => {
    const timer = setTimeout(onContinue, 3000);
    return () => clearTimeout(timer);
  }, [onContinue]);

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-dark/40">
      <div className="animate-[celebrationPop_0.4s_ease-out] bg-white rounded-3xl shadow-2xl px-8 py-10 mx-4 max-w-sm w-full text-center">
        <span className="text-6xl block mb-4">
          {isLevelUp ? "🚀" : "⭐"}
        </span>

        {isLevelUp && (
          <p className="text-accent font-black text-xl uppercase tracking-wide mb-2">
            Level Up!
          </p>
        )}

        <h3 className="text-2xl md:text-3xl font-black text-dark">
          {word}
        </h3>

        <p className="mt-2 text-lg font-semibold text-primary">
          +{points} points!
        </p>

        <button
          onClick={onContinue}
          className="mt-6 bg-primary hover:bg-primary-dark text-dark font-semibold px-8 py-3 rounded-full transition-colors"
        >
          Next Word
        </button>
      </div>
    </div>
  );
}
