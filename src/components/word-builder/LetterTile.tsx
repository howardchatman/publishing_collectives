"use client";

interface LetterTileProps {
  letter: string;
  index: number;
  isSelected: boolean;
  isPlaced: boolean;
  onDragStart: (index: number) => void;
  onClick: (index: number) => void;
}

export default function LetterTile({
  letter,
  index,
  isSelected,
  isPlaced,
  onDragStart,
  onClick,
}: LetterTileProps) {
  if (isPlaced) {
    return (
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50" />
    );
  }

  return (
    <div
      draggable
      role="button"
      tabIndex={0}
      aria-label={`Letter ${letter}`}
      aria-pressed={isSelected}
      data-tile-index={index}
      className={`w-12 h-12 md:w-14 md:h-14 rounded-xl border-2 shadow-md flex items-center justify-center text-xl md:text-2xl font-black text-dark select-none cursor-grab active:cursor-grabbing transition-all duration-150 ${
        isSelected
          ? "border-primary bg-primary/20 scale-105 shadow-lg ring-2 ring-primary"
          : "border-accent bg-white hover:shadow-lg active:scale-95"
      }`}
      onDragStart={(e) => {
        e.dataTransfer.setData(
          "text/plain",
          JSON.stringify({ source: "tile", index })
        );
        e.dataTransfer.effectAllowed = "move";
        onDragStart(index);
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
