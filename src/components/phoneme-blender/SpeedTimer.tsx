"use client";

import { useState, useEffect } from "react";
import { Timer } from "lucide-react";

interface SpeedTimerProps {
  startTime: number;
  isActive: boolean;
  phonemeCount: number;
}

export default function SpeedTimer({ startTime, isActive, phonemeCount }: SpeedTimerProps) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!isActive) return;
    setElapsed(0);
    const interval = setInterval(() => {
      setElapsed(Date.now() - startTime);
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, isActive]);

  const seconds = (elapsed / 1000).toFixed(1);
  const thresholdMs = phonemeCount * 2000;
  const color =
    elapsed < thresholdMs * 0.5
      ? "text-primary"
      : elapsed < thresholdMs
      ? "text-accent"
      : "text-dark/50";

  return (
    <div className={`flex items-center gap-1.5 ${color} font-bold text-sm transition-colors`}>
      <Timer size={16} />
      <span>{seconds}s</span>
    </div>
  );
}
