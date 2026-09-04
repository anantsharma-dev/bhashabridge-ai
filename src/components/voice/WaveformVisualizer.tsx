import React, { useEffect, useState } from 'react';

export interface WaveformVisualizerProps {
  isActive: boolean;
  barCount?: number;
  className?: string;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
  isActive,
  barCount = 28,
  className = '',
}) => {
  const [heights, setHeights] = useState<number[]>(() =>
    Array.from({ length: barCount }, () => 15)
  );

  useEffect(() => {
    if (!isActive) {
      setHeights(Array.from({ length: barCount }, () => 12));
      return;
    }

    const interval = setInterval(() => {
      setHeights(
        Array.from({ length: barCount }, (_, i) => {
          // Dynamic sine-wave fluctuation simulating audio frequency spectrum
          const base = Math.sin(Date.now() / 200 + i * 0.4) * 20 + 35;
          const noise = Math.random() * 25;
          return Math.max(10, Math.min(65, Math.round(base + noise)));
        })
      );
    }, 80);

    return () => clearInterval(interval);
  }, [isActive, barCount]);

  return (
    <div className={`flex items-center justify-center gap-1 h-16 px-4 ${className}`}>
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-full transition-all duration-75 ${
            isActive
              ? 'bg-gradient-to-t from-rose-500 via-amber-400 to-emerald-500'
              : 'bg-slate-200'
          }`}
          style={{ height: `${h}px` }}
        />
      ))}
    </div>
  );
};

export default WaveformVisualizer;
