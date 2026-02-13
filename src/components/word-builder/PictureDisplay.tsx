"use client";

interface PictureDisplayProps {
  emoji: string;
  hint: string;
  imageSrc?: string;
}

export default function PictureDisplay({ emoji, hint, imageSrc }: PictureDisplayProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-32 h-32 md:w-40 md:h-40 bg-white rounded-2xl shadow-md flex items-center justify-center"
        role="img"
        aria-label={hint}
      >
        {imageSrc ? (
          <img src={imageSrc} alt={hint} className="w-full h-full object-contain p-2 rounded-2xl" />
        ) : (
          <span className="text-7xl md:text-8xl select-none">{emoji}</span>
        )}
      </div>
      <p className="text-base md:text-lg font-semibold text-dark/70 text-center max-w-xs">
        {hint}
      </p>
    </div>
  );
}
