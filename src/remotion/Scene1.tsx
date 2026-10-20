import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";

export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Timing constants
  const p1Start = 0;
  const p2Start = 50;
  const p3Start = 100;

  // Pain point 1: "Устали записывать клиентов в блокнот?"
  const p1Opacity = interpolate(frame, [p1Start, p1Start + 15], [0, 1], { extrapolateRight: "clamp" });
  const p1Y = spring({ fps, frame: frame - p1Start, config: { damping: 12 } });

  // Pain point 2: "Путаница в расписании?"
  const p2Opacity = interpolate(frame, [p2Start, p2Start + 15], [0, 1], { extrapolateRight: "clamp" });
  const p2Y = spring({ fps, frame: frame - p2Start, config: { damping: 12 } });

  // Pain point 3: "Клиенты забывают о записи?"
  const p3Opacity = interpolate(frame, [p3Start, p3Start + 15], [0, 1], { extrapolateRight: "clamp" });
  const p3Y = spring({ fps, frame: frame - p3Start, config: { damping: 12 } });

  // Fade out whole scene
  const fadeOutOpacity = interpolate(frame, [160, 180], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill className="bg-riva-canvas flex flex-col items-center justify-center gap-12 px-12" style={{ opacity: fadeOutOpacity }}>

      {frame >= p1Start && (
        <div
          className="bg-riva-surface px-8 py-6 rounded-3xl shadow-riva-elevated text-center max-w-[80%]"
          style={{ opacity: p1Opacity, transform: `translateY(${100 - p1Y * 100}px)` }}
        >
          <p className="text-4xl text-riva-text-primary font-sans font-semibold leading-tight">
            Устали записывать клиентов в блокнот? 📝
          </p>
        </div>
      )}

      {frame >= p2Start && (
        <div
          className="bg-white px-8 py-6 rounded-3xl shadow-riva-elevated text-center max-w-[80%] border border-riva-borderLight"
          style={{ opacity: p2Opacity, transform: `translateY(${100 - p2Y * 100}px)` }}
        >
          <p className="text-4xl text-riva-text-primary font-sans font-semibold leading-tight">
            Путаница в расписании? 🤯
          </p>
        </div>
      )}

      {frame >= p3Start && (
        <div
          className="bg-riva-surface px-8 py-6 rounded-3xl shadow-riva-elevated text-center max-w-[80%]"
          style={{ opacity: p3Opacity, transform: `translateY(${100 - p3Y * 100}px)` }}
        >
          <p className="text-4xl text-riva-text-primary font-sans font-semibold leading-tight">
            Клиенты забывают о записи? ⏰
          </p>
        </div>
      )}

    </AbsoluteFill>
  );
};
