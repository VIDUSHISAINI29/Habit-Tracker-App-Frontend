import { useEffect, useState } from "react";

const ProgressWheel = ({ percent = 0, size = 120, stroke = 12 }) => {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  // Animate progress when percent changes
  useEffect(() => {
    let start = progress;
    let end = Math.max(0, Math.min(100, percent));
    let startTime = null;

    const animate = (time) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      const duration = 800; // animation speed
      const eased = Math.min(elapsed / duration, 1);
      const value = start + (end - start) * eased;

      setProgress(value);

      if (eased < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [percent]);

  const dash = (progress / 100) * circumference;

  // Dynamic stroke color based on percent
  const color =
    progress < 40 ? "#f97316" : progress < 75 ? "#eab308" : "#10b981";

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transition-transform duration-300 drop-shadow-md hover:scale-105"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke}
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${circumference - dash}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ filter: `drop-shadow(0 0 6px ${color}90)` }}
        />

        {/* Center text */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-lg font-extrabold"
          fill={color}
        >
          {Math.round(progress)}%
        </text>
      </svg>
    </div>
  );
}

export default ProgressWheel;