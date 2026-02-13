"use client";

import { getPhonemeType } from "@/lib/phoneme-blender-data";
import type { PhonicsLesson } from "@/lib/phoneme-blender-data";

interface LessonScreenProps {
  lesson: PhonicsLesson;
  levelNumber: number;
  onStart: () => void;
}

export default function LessonScreen({ lesson, levelNumber, onStart }: LessonScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Level badge */}
      <span className="text-xs font-bold px-4 py-1.5 rounded-full bg-accent text-dark uppercase tracking-wide">
        Level {levelNumber}
      </span>

      {/* Title */}
      <h2 className="text-2xl md:text-3xl font-black text-dark text-center leading-snug">
        {lesson.title}
      </h2>

      {/* Description */}
      <p className="text-base md:text-lg text-dark/70 font-medium text-center max-w-md">
        {lesson.description}
      </p>

      {/* Examples */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        {lesson.examples.map((ex, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-md p-4 flex items-center justify-center gap-2"
          >
            {ex.phonemes.map((p, j) => {
              const type = getPhonemeType(p);
              const colorClass =
                type === "vowel"
                  ? "bg-primary/20 border-primary text-dark"
                  : "bg-accent/20 border-accent text-dark";

              return (
                <span key={j}>
                  <span
                    className={`inline-flex items-center justify-center min-w-[2.5rem] h-10 rounded-full border-2 px-2 text-base font-black ${colorClass}`}
                  >
                    {p}
                  </span>
                  {j < ex.phonemes.length - 1 && (
                    <span className="text-dark/30 mx-0.5">+</span>
                  )}
                </span>
              );
            })}
            <span className="text-dark/30 mx-1">=</span>
            <span className="text-xl font-black text-dark">{ex.word}</span>
          </div>
        ))}
      </div>

      {/* Start button */}
      <button
        onClick={onStart}
        className="mt-2 bg-accent hover:bg-amber-500 text-dark font-bold px-10 py-3 rounded-full transition-colors text-lg shadow-md hover:shadow-lg active:scale-95"
      >
        Let&apos;s Practice!
      </button>
    </div>
  );
}
