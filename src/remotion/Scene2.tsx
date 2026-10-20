import React from "react";
import { AbsoluteFill, useCurrentFrame, useVideoConfig, spring, interpolate } from "remotion";
import { Calendar, CheckCircle } from "lucide-react";

export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animations
  const sceneOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const scale = spring({ fps, frame: frame, config: { damping: 14 }, from: 0.8, to: 1 });

  // Continuous smooth fly-through/pan effect
  const translateY = interpolate(frame, [0, 270], [0, -400]);

  return (
    <AbsoluteFill className="bg-riva-base overflow-hidden" style={{ opacity: sceneOpacity }}>

      {/* Container for fly-through */}
      <div
        className="w-full h-full flex flex-col gap-6 px-6 py-20"
        style={{ transform: `scale(${scale}) translateY(${translateY}px)` }}
      >

        {/* Header / Hero mock */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-serif text-riva-text-primary mb-2">Riva</h1>
          <p className="text-2xl text-riva-text-secondary font-sans">Premium Beauty Management</p>
        </div>

        {/* Bento Grid layout */}
        <div className="grid grid-cols-2 gap-4">

          {/* Calendar Widget */}
          <div className="bg-riva-surface p-5 rounded-3xl shadow-riva-card col-span-2 flex justify-between items-center">
            <div>
              <p className="text-lg text-riva-text-secondary mb-1">Today&apos;s Schedule</p>
              <h2 className="text-3xl font-semibold text-riva-text-primary">12 Appointments</h2>
            </div>
            <div className="w-16 h-16 rounded-2xl bg-riva-canvas flex items-center justify-center">
              <Calendar className="w-8 h-8 text-riva-text-primary" />
            </div>
          </div>

          {/* Master Card 1 */}
          <div className="bg-riva-surface p-4 rounded-3xl shadow-riva-card">
            <div className="w-full aspect-square bg-riva-canvas rounded-2xl mb-3 flex items-center justify-center overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1595959183082-7b570b7e08e2?q=80&w=200&auto=format&fit=crop" className="object-cover w-full h-full" alt="Master" />
            </div>
            <h3 className="text-xl font-medium text-riva-text-primary">Elena V.</h3>
            <p className="text-sm text-riva-text-muted">Top Stylist</p>
          </div>

          {/* Master Card 2 */}
          <div className="bg-riva-surface p-4 rounded-3xl shadow-riva-card">
            <div className="w-full aspect-square bg-riva-canvas rounded-2xl mb-3 flex items-center justify-center overflow-hidden relative">
               <img src="https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=200&auto=format&fit=crop" className="object-cover w-full h-full" alt="Master" />
            </div>
            <h3 className="text-xl font-medium text-riva-text-primary">Anna M.</h3>
            <p className="text-sm text-riva-text-muted">Nail Artist</p>
          </div>

        </div>

        {/* Appointment List Mock */}
        <div className="mt-4 flex flex-col gap-3">
          <h3 className="text-2xl font-serif text-riva-text-primary mb-2">Upcoming</h3>

          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-riva-surface p-4 rounded-2xl shadow-riva-card flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-riva-status-confirmed flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-riva-status-confirmedText" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-medium text-riva-text-primary">Hair Styling</h4>
                <p className="text-sm text-riva-text-secondary">with Elena V.</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-riva-text-primary">14:00</p>
                <p className="text-sm text-riva-text-muted">Today</p>
              </div>
            </div>
          ))}
        </div>

      </div>

    </AbsoluteFill>
  );
};
