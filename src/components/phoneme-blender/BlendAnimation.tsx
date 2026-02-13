"use client";

import { useState, useEffect } from "react";
import { getPhonemeType } from "@/lib/phoneme-blender-data";
import { speakBlend } from "@/lib/speech";

interface BlendAnimationProps {
  phonemes: string[];
  word: string;
  onComplete: () => void;
}

export default function BlendAnimation({ phonemes, word, onComplete }: BlendAnimationProps) {
  const [phase, setPhase] = useState<"slide" | "fuse" | "done">("slide");

  useEffect(() => {
    speakBlend(phonemes, word);
    const t1 = setTimeout(() => setPhase("fuse"), 600);
    const t2 = setTimeout(() => setPhase("done"), 1000);
    const t3 = setTimeout(onComplete, 1800);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete, phonemes, word]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/30">
      <div className="relative flex flex-col items-center gap-4">
        {/* Phoneme bubbles sliding and fusing */}
        {phase !== "done" && (
          <div className="flex items-center gap-0">
            {phonemes.map((p, i) => {
              const type = getPhonemeType(p);
              const colorClass =
                type === "vowel"
                  ? "bg-primary/30 border-primary"
                  : "bg-accent/30 border-accent";

              const offset = (i - (phonemes.length - 1) / 2) * 20;

              return (
                <span
                  key={i}
                  className={`inline-flex items-center justify-center min-w-[3rem] h-14 rounded-full border-2 text-xl font-black text-dark px-3 ${colorClass} ${
                    phase === "slide"
                      ? "animate-[phonemeSlideIn_0.5s_ease-out_forwards]"
                      : "animate-[phonemeFadeOut_0.3s_ease-in_forwards]"
                  }`}
                  style={{
                    animationDelay: `${i * 100}ms`,
                    ["--slide-from" as string]: `${offset}px`,
                  }}
                >
                  {p}
                </span>
              );
            })}
          </div>
        )}

        {/* Fused word */}
        {(phase === "fuse" || phase === "done") && (
          <span
            className="text-4xl md:text-5xl font-black text-dark animate-[wordFuseIn_0.5s_ease-out_forwards] bg-white px-8 py-4 rounded-2xl shadow-2xl"
            style={{ boxShadow: "0 0 40px rgba(123, 220, 181, 0.5)" }}
          >
            {word}
          </span>
        )}

        {/* Particle burst */}
        {phase === "done" && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-[particleBurst_0.6s_ease-out_forwards]"
                style={{
                  backgroundColor: i % 2 === 0 ? "#7bdcb5" : "#fca400",
                  transform: `rotate(${i * 45}deg)`,
                  transformOrigin: "center",
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
