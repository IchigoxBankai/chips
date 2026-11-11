import { Scissors, Sparkles } from 'lucide-react';
import React from 'react';
import type { FlavourId } from '../types/cruncha';

interface ScrollTravelingPacketProps {
  activeFlavour: FlavourId;
  tearProgress: number;
}

export const ScrollTravelingPacket: React.FC<ScrollTravelingPacketProps> = ({
  activeFlavour,
  tearProgress
}) => {
  const pouchImageSrc = `/assets/cruncha-${activeFlavour}-hero.png`;

  return (
    <div
      id="scroll-traveling-packet"
      className="fixed z-30 pointer-events-none select-none"
      style={{
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        willChange: 'transform, opacity'
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Ambient shadow underneath */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/35 rounded-full blur-md" />

        {/* Pouch Container */}
        <div className="relative w-56 sm:w-64 md:w-72 aspect-[1/1.38]">
          <img
            src={pouchImageSrc}
            alt="CRUNCHA Snack Pouch"
            className="w-full h-full object-contain filter drop-shadow-[0_22px_45px_rgba(23,23,23,0.38)]"
            draggable={false}
          />

          {/* Dotted Tear Line Indicator on Top Seal */}
          {tearProgress <= 0.05 && (
            <div className="absolute top-[8%] left-4 right-4 flex items-center justify-between text-yellow-300 pointer-events-none animate-pulse">
              <div className="h-0.5 flex-1 border-t-2 border-dashed border-[#FFD43B]" />
              <span className="px-2 py-0.5 rounded-full bg-black/75 text-[9px] font-black uppercase tracking-widest text-[#FFD43B] border border-[#FFD43B]/60 flex items-center gap-1 mx-1 shadow-md">
                <Scissors className="w-2.5 h-2.5" />
                <span>PULL TO TEAR</span>
              </span>
              <div className="h-0.5 flex-1 border-t-2 border-dashed border-[#FFD43B]" />
            </div>
          )}

          {/* Animated Foil Tear Separation Overlay */}
          {tearProgress > 0.05 && (
            <div className="absolute top-[6%] left-6 right-6 pointer-events-none transition-all duration-150">
              {/* Silver Foil Lip */}
              <div
                className="w-full rounded-full bg-gradient-to-r from-stone-300 via-white to-stone-400 border-y-2 border-white/90 shadow-[0_0_12px_rgba(255,255,255,0.8)] flex items-center justify-center overflow-hidden"
                style={{
                  height: `${Math.max(6, tearProgress * 32)}px`,
                  transform: `scaleY(${0.4 + tearProgress * 0.6})`
                }}
              >
                <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/60 via-stone-900/80 to-black flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#FFD43B] drop-shadow-md">
                    ✨ FRESH CRISPY CHIPS
                  </span>
                </div>
              </div>

              {/* Sparkling Seasoning Embers */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FFD43B] animate-spin" />
                <span className="text-[10px] font-black uppercase text-white bg-black/60 px-2 py-0.5 rounded-full border border-white/20 whitespace-nowrap">
                  {Math.round(tearProgress * 100)}% UNSEALED
                </span>
                <Sparkles className="w-4 h-4 text-orange-300 animate-pulse" />
              </div>
            </div>
          )}

          {/* Flexible Foil Sheen Sweep across surface */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl opacity-35">
            <div className="w-[80px] h-[200%] bg-gradient-to-r from-transparent via-white/70 to-transparent transform -rotate-45 animate-foil" />
          </div>
        </div>
      </div>
    </div>
  );
};

