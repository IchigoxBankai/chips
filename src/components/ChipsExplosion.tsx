import { Activity, Flame, Volume2, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';

interface ChipsExplosionProps {
  onExploreFlavours: () => void;
}

export const ChipsExplosion: React.FC<ChipsExplosionProps> = ({ onExploreFlavours }) => {
  const [crunchCount, setCrunchCount] = useState(0);

  const handleCrunchBite = () => {
    sounds.playCrunch();
    setCrunchCount((prev) => prev + 1);

    // Trigger sudden scatter boost in 3D explosion
    const api = (window as unknown as { cruncha3D?: { setExplosionProgress: (p: number) => void } }).cruncha3D;
    if (api) {
      api.setExplosionProgress(0.9);
      setTimeout(() => {
        api.setExplosionProgress(0.5);
      }, 400);
    }
  };

  return (
    <section
      id="explosion"
      className="relative min-h-screen w-full bg-gradient-to-b from-[#D32F2F] via-[#FF641F] to-[#FFD43B] text-[#171717] flex flex-col items-center justify-between py-16 md:py-20 px-6 overflow-hidden"
    >
      {/* Decorative Energy Rays */}
      <div className="absolute inset-0 opacity-15 pointer-events-none grain-overlay" />

      {/* Top Badge */}
      <div className="z-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white text-[#171717] text-xs font-black uppercase tracking-wider border-2 border-[#171717] shadow-[0_3px_0_0_#171717]">
          <Zap className="w-4 h-4 text-[#FF641F]" />
          <span>SCENE 03 — ZERO RESISTANCE CRUNCH BURST</span>
        </div>
      </div>

      {/* Headline */}
      <div className="z-20 text-center max-w-4xl mx-auto my-auto pointer-events-none">
        <h2 className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tighter uppercase font-heading text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          THAT'S THE SOUND
          <br />
          <span className="text-[#FFD43B] inline-block bg-[#171717] px-6 py-1 transform rotate-1 rounded-2xl shadow-[0_8px_0_0_#FFFFFF]">
            OF HAPPINESS.
          </span>
        </h2>
        <p className="mt-6 text-sm sm:text-xl font-bold text-white max-w-2xl mx-auto drop-shadow-md">
          Flying at multi-axis trajectories with parabolic flight paths. Every curved saddle chip is double-fried for maximum acoustic resonance.
        </p>

        {/* Interactive Crunch Button */}
        <div className="mt-8 flex justify-center pointer-events-auto">
          <button
            onClick={handleCrunchBite}
            className="group flex items-center gap-3 px-8 py-4 bg-[#171717] hover:bg-black text-[#FFD43B] rounded-full text-sm sm:text-base font-black uppercase tracking-wider border-2 border-white shadow-[0_6px_0_0_#FFFFFF] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          >
            <Volume2 className="w-5 h-5 text-[#FF641F] group-hover:scale-125 transition-transform" />
            <span>MAKE IT CRUNCH!</span>
            {crunchCount > 0 && (
              <span className="bg-[#FF641F] text-white px-2.5 py-0.5 rounded-full text-xs">
                +{crunchCount} CRUNCHES
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Bottom Technical & Sensory Highlights */}
      <div className="z-20 w-full max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-[#171717] shadow-[0_4px_0_0_#171717]">
          <div className="flex items-center gap-2 text-[#FF641F] font-black text-xs uppercase mb-1">
            <Activity className="w-4 h-4" />
            <span>ACOUSTIC ANALYSIS</span>
          </div>
          <div className="text-2xl font-black font-heading text-[#171717]">86.4 DECIBELS</div>
          <div className="text-xs font-semibold text-stone-600 mt-1">
            Scientifically calibrated snap frequency that triggers instant dopamine release.
          </div>
        </div>

        <div className="p-4 bg-white/90 backdrop-blur-md rounded-2xl border-2 border-[#171717] shadow-[0_4px_0_0_#171717]">
          <div className="flex items-center gap-2 text-[#75A94B] font-black text-xs uppercase mb-1">
            <Flame className="w-4 h-4" />
            <span>SADDLE GEOMETRY</span>
          </div>
          <div className="text-2xl font-black font-heading text-[#171717]">1.2MM THICK CUT</div>
          <div className="text-xs font-semibold text-stone-600 mt-1">
            Hyperbolic paraboloid curve designed to carry 40% more seasoning per bite.
          </div>
        </div>

        <div className="p-4 bg-[#FF641F] text-white rounded-2xl border-2 border-[#171717] shadow-[0_4px_0_0_#171717] flex flex-col justify-between">
          <div>
            <div className="text-xs font-black uppercase text-[#FFD43B] mb-1">NEXT CHAPTER</div>
            <div className="text-xl font-black font-heading">5 SIGNATURE FLAVOURS</div>
          </div>
          <button
            onClick={() => {
              sounds.playPop(520);
              onExploreFlavours();
            }}
            className="mt-3 text-xs font-black uppercase tracking-wider bg-white text-[#171717] px-4 py-2 rounded-full hover:bg-[#FFF4DE] transition-colors cursor-pointer self-start"
          >
            DISCOVER FLAVOURS ↓
          </button>
        </div>
      </div>
    </section>
  );
};

