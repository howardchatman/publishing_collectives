"use client";

interface DropSlotProps {
  index: number;
  letter: string | null;
  feedback: "correct" | "incorrect" | null;
  isHighlighted: boolean;
  onDrop: (slotIndex: number, data: string) => void;
  onClick: (slotIndex: number) => void;
}

export default function DropSlot({
  index,
  letter,
  feedback,
  isHighlighted,
  onDrop,
  onClick,
}: DropSlotProps) {
  let borderColor = "border-gray-300";
  let bgColor = "bg-gray-50";

  if (feedback === "correct") {
    borderColor = "border-green-500";
    bgColor = "bg-green-50";
  } else if (feedback === "incorrect") {
    borderColor = "border-red-400";
    bgColor = "bg-red-50";
  } else if (isHighlighted) {
    borderColor = "border-primary";
    bgColor = "bg-primary/10";
  } else if (letter) {
    borderColor = "border-primary";
    bgColor = "bg-white";
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Slot ${index + 1}${letter ? `, contains letter ${letter}` : ", empty"}`}
      data-slot-index={index}
      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 ${
        letter ? "border-solid" : "border-dashed"
      } ${borderColor} ${bgColor} flex items-center justify-center text-xl md:text-2xl font-black text-dark select-none transition-all duration-200 ${
        feedback === "incorrect" ? "animate-[tileShake_0.4s_ease-in-out]" : ""
      } ${letter ? "cursor-pointer" : ""}`}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }}
      onDrop={(e) => {
        e.preventDefault();
        const data = e.dataTransfer.getData("text/plain");
        onDrop(index, data);
      }}
      onClick={() => onClick(index)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(index);
        }
      }}
    >
      {letter}
    </div>
  );
}
