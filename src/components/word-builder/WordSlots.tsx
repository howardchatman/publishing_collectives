"use client";

import DropSlot from "./DropSlot";

interface WordSlotsProps {
  placedLetters: (string | null)[];
  slotFeedback: ("correct" | "incorrect" | null)[];
  highlightedSlot: number | null;
  onDrop: (slotIndex: number, data: string) => void;
  onSlotClick: (slotIndex: number) => void;
}

export default function WordSlots({
  placedLetters,
  slotFeedback,
  highlightedSlot,
  onDrop,
  onSlotClick,
}: WordSlotsProps) {
  return (
    <div className="flex items-center justify-center gap-2 md:gap-3">
      {placedLetters.map((letter, i) => (
        <DropSlot
          key={i}
          index={i}
          letter={letter}
          feedback={slotFeedback[i]}
          isHighlighted={highlightedSlot === i}
          onDrop={onDrop}
          onClick={onSlotClick}
        />
      ))}
    </div>
  );
}
