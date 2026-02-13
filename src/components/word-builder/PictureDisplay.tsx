"use client";

import Image from "next/image";
import { useState } from "react";

interface PictureDisplayProps {
  emoji: string;
  hint: string;
  imageSrc?: string;
}

export default function PictureDisplay({ emoji, hint, imageSrc }: PictureDisplayProps) {
  const [imgError, setImgError] = useState(false);
  const showImage = imageSrc && !imgError;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-36 h-36 md:w-44 md:h-44 bg-white rounded-3xl shadow-lg border-4 border-primary/30 flex items-center justify-center overflow-hidden"
        role="img"
        aria-label={hint}
      >
        {showImage ? (
          <Image
            src={imageSrc}
            alt={hint}
            width={176}
            height={176}
            className="w-full h-full object-contain p-2"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-7xl md:text-8xl select-none drop-shadow-sm">{emoji}</span>
        )}
      </div>
      <p className="text-base md:text-lg font-semibold text-dark/70 text-center max-w-xs">
        {hint}
      </p>
    </div>
  );
}
