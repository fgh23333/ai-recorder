import { FC } from "react";

interface ProgressBarProps {
  progress: number; // 0 to 100
  height?: number; // Optional height in pixels
  label?: string; // Left side label
}

export const ProgressBar: FC<ProgressBarProps> = ({
  progress,
  height = 4,
  label = "Processing",
}) => {
  // Ensure progress stays within 0-100 range
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="w-full">
      {/* Labels */}
      <div className="flex justify-between mb-2">
        <span className="text-gray-400 text-sm">{label}</span>
        <span className="text-gray-400 text-sm">
          {clampedProgress === 100 ? "DONE" : `${Math.round(clampedProgress)}%`}
        </span>
      </div>

      {/* Progress bar */}
      <div className="relative w-full bg-gray-900 overflow-hidden">
        {/* Background bar */}
        <div className="h-full bg-gray-800" style={{ height: `${height}px` }} />

        {/* Progress indicator */}
        <div
          className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-300 ease-out"
          style={{
            width: `${clampedProgress}%`,
            height: `${height}px`,
          }}
        />
      </div>
    </div>
  );
};
