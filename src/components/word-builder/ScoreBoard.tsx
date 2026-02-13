"use client";

import { Star } from "lucide-react";

interface ScoreBoardProps {
  score: number;
  difficulty: "easy" | "medium" | "hard";
  round: number;
  totalRoundsInLevel: number;
  streak: number;
}

const difficultyColors: Record<string, string> = {
  easy: "bg-primary text-dark",
  medium: "bg-accent text-dark",
  hard: "bg-red-400 text-white",
};

export default function ScoreBoard({
  score,
  difficulty,
  round,
  totalRoundsInLevel,
  streak,
}: ScoreBoardProps) {
  return (
    <div className="flex items-center justify-between w-full bg-white rounded-xl shadow-sm px-4 py-3">
      <div className="flex items-center gap-1.5">
        <Star size={18} className="text-accent fill-accent" />
        <span className="font-bold text-dark text-lg">{score}</span>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${difficultyColors[difficulty]}`}
        >
          {difficulty}
        </span>
        <span className="text-sm font-medium text-dark/60">
          {round}/{totalRoundsInLevel}
        </span>
      </div>

      {streak >= 2 && (
        <span className="text-sm font-bold text-accent">
          {streak}x streak!
        </span>
      )}
    </div>
  );
}
