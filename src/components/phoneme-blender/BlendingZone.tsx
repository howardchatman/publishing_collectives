"use client";

import { ChevronRight } from "lucide-react";
import { Fragment } from "react";

interface BlendingZoneProps {
  placedPhonemes: (string | null)[];
  slotFeedback: ("correct" | "incorrect" | null)[];
  highlightedSlot: number | null;
  onDrop: (slotIndex: number, data: string) => void;
  onSlotClick: (slotIndex: number) => void;
}

export default function BlendingZone({
  placedPhonemes,
  slotFeedback,
  highlightedSlot,
  onDrop,
  onSlotClick,
}: BlendingZoneProps) {
  return (
    <div className="w-full bg-white rounded-2xl shadow-md p-4">
      <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-3 text-center">
        Blending Zone
      </p>
      <div className="flex items-center justify-center gap-1 md:gap-2">
        {placedPhonemes.map((phoneme, i) => {
          let borderColor = "border-gray-300";
          let bgColor = "bg-gray-50";

          if (slotFeedback[i] === "correct") {
            borderColor = "border-green-500";
            bgColor = "bg-green-50";
          } else if (slotFeedback[i] === "incorrect") {
            borderColor = "border-red-400";
            bgColor = "bg-red-50";
          } else if (highlightedSlot === i) {
            borderColor = "border-primary";
            bgColor = "bg-primary/10";
          } else if (phoneme) {
            borderColor = "border-primary";
            bgColor = "bg-white";
          }

          return (
            <Fragment key={i}>
              <div
                role="button"
                tabIndex={0}
                aria-label={`Blending slot ${i + 1}${phoneme ? `, contains sound ${phoneme}` : ", empty"}`}
                data-slot-index={i}
                className={`min-w-[3rem] h-12 md:min-w-[3.5rem] md:h-14 rounded-full border-2 ${
                  phoneme ? "border-solid" : "border-dashed"
                } ${borderColor} ${bgColor} px-3 flex items-center justify-center text-lg md:text-xl font-black text-dark select-none transition-all duration-200 ${
                  slotFeedback[i] === "incorrect" ? "animate-[tileShake_0.4s_ease-in-out]" : ""
                } ${phoneme ? "cursor-pointer" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = "move";
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  onDrop(i, e.dataTransfer.getData("text/plain"));
                }}
                onClick={() => onSlotClick(i)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onSlotClick(i);
                  }
                }}
              >
                {phoneme}
              </div>
              {i < placedPhonemes.length - 1 && (
                <ChevronRight size={16} className="text-dark/20 shrink-0" />
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
