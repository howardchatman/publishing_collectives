"use client";

import { getPhonemeType } from "@/lib/phoneme-blender-data";

interface PhonemeBubbleProps {
  phoneme: string;
  id: string;
  isSelected: boolean;
  isPlaced: boolean;
  onDragStart: (id: string) => void;
  onClick: (id: string) => void;
}

export default function PhonemeBubble({
  phoneme,
  id,
  isSelected,
  isPlaced,
  onDragStart,
  onClick,
}: PhonemeBubbleProps) {
  if (isPlaced) {
    return (
      <div className="min-w-[3rem] h-12 md:min-w-[3.5rem] md:h-14 rounded-full border-2 border-dashed border-gray-200 bg-gray-50 px-3" />
    );
  }

  const type = getPhonemeType(phoneme);
  const colorClasses =
    type === "vowel"
      ? "bg-primary/20 border-primary"
      : "bg-accent/20 border-accent";

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Sound ${phoneme}`}
      aria-pressed={isSelected}
      data-bubble-id={id}
      className={`min-w-[3rem] h-12 md:min-w-[3.5rem] md:h-14 rounded-full border-2 px-3 shadow-md flex items-center justify-center text-lg md:text-xl font-black text-dark select-none cursor-grab active:cursor-grabbing transition-all duration-150 ${colorClasses} ${
        isSelected
          ? "ring-2 ring-primary scale-105 shadow-lg"
          : "hover:shadow-lg active:scale-95"
      }`}
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ source: "bubble", id })
        );
        e.dataTransfer.effectAllowed = "move";
        onDragStart(id);
      }}
      onClick={() => onClick(id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(id);
        }
      }}
    >
      {phoneme}
    </div>
  );
}
