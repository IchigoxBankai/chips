import { ArrowRight, Disc, RefreshCw, Scissors, ShieldAlert, Sparkles, Volume2 } from 'lucide-react';
import React, { useRef } from 'react';
import { sounds } from '../audio/soundEffects';

interface OpeningSceneProps {
  tearProgress: number;
  onTearProgressChange: (p: number) => void;
  onManualTear?: () => void;
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({
  tearProgress,
  onTearProgressChange,
  onManualTear
}) => {
  const animFrameRef = useRef<number | null>(null);

  const ripFoilSmoothly = () => {
    sounds.playFoilTear();
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);

    let p = tearProgress;
    const step = () => {
      p = Math.min(1, p + 0.05);
      onTearProgressChange(p);

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(step);
      } else {
        sounds.playCrunch();
        animFrameRef.current = null;
      }
    };
    animFrameRef.current = requestAnimationFrame(step);
  };

  const resetPouch = () => {
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    sounds.playPop(420);
    onTearProgressChange(0);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    onTearProgressChange(val);

    if (val > 0.05 && val < 0.95 && Math.random() > 0.7) {
      sounds.playPop(300 + val * 400);
    }
    if (val >= 0.98 && tearProgress < 0.98) {
      sounds.playCrunch();
    }
  };

  // Determine current active step based on tear progress
  const activeStep =
    tearProgress >= 0.85 ? 4 : tearProgress >= 0.5 ? 3 : tearProgress >= 0.2 ? 2 : 1;

  return (
    <section
      id="the-opening"
      className="relative min-h-screen w-full bg-gradient-to-b from-[#FFF4DE] via-[#FF641F] to-[#D32F2F] text-white flex flex-col justify-between py-12 md:py-16 px-4 sm:px-8 overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-yellow-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Banner & Headline */}
      <div className="z-20 text-center max-w-4xl mx-auto flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-widest text-[#FFD43B] mb-3">
          <Scissors className="w-3.5 h-3.5" />
          <span>SCENE 02 — THE CEREMONY OF THE OPENING</span>
        </div>

        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase font-heading leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
          READY FOR THE{' '}
          <span className="text-[#FFD43B] underline decoration-white/40">
            BIG CRUNCH?
          </span>
        </h2>
      </div>

      {/* Main 3-Column Tight Staging Area (Left Spec - Center Pouch - Right Spec) */}
      <div className="z-20 w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-6 px-2">
        {/* Left Side Callout */}
        <div className="lg:col-span-3 flex flex-col gap-3 items-center lg:items-end text-center lg:text-right order-2 lg:order-1">
          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 w-full max-w-xs shadow-xl">
            <div className="flex items-center justify-center lg:justify-end gap-1.5 text-[#FFD43B] font-black text-[11px] uppercase tracking-wider mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>NITRO-SEALED CAVITY</span>
            </div>
            <h4 className="text-base font-black uppercase text-white">Zero Crushed Chips</h4>
            <p className="text-[11px] text-white/80 mt-1 leading-relaxed">
              Precision gas cushion keeps every curved kettle chip intact, fresh, and bone-dry from fryer to fingertips.
            </p>
          </div>

          <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/90 w-full max-w-xs">
            <span>⚡ TEAR SPEED: 0.18 SECONDS • 100% BELIEVABLE FOIL</span>
          </div>
        </div>

        {/* Center: Reserved space for ScrollTravelingPacket and tactile interactive controls */}
        <div className="lg:col-span-6 flex flex-col items-center text-center order-1 lg:order-2">
          {/* Reserved stage footprint and click target to trigger foil tear */}
          <div
            onClick={ripFoilSmoothly}
            className="w-56 sm:w-64 md:w-72 aspect-[1/1.38] cursor-pointer select-none pointer-events-auto"
            title="Click to rip foil open!"
          />

          {/* Interactive Tear Slider & Controls */}
          <div className="w-full max-w-xs mt-3 flex flex-col items-center gap-2 pointer-events-auto">
            <div className="flex items-center justify-between w-full text-[10px] font-black uppercase text-white/90">
              <span className="flex items-center gap-1 text-[#FFD43B]">
                <Scissors className="w-3 h-3" />
                <span>DRAG TO UNSEAL:</span>
              </span>
              <span>{Math.round(tearProgress * 100)}%</span>
            </div>

            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={tearProgress}
              onChange={handleSliderChange}
              className="w-full h-2 bg-black/40 rounded-lg appearance-none cursor-ew-resize accent-[#FFD43B] border border-white/20"
            />
          </div>
        </div>

        {/* Right Side Callout */}
        <div className="lg:col-span-3 flex flex-col gap-3 items-center lg:items-start text-center lg:text-left order-3">
          <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 w-full max-w-xs shadow-xl">
            <div className="flex items-center justify-center lg:justify-start gap-1.5 text-[#FFD43B] font-black text-[11px] uppercase tracking-wider mb-1">
              <span>METALLIC INNER BARRIER</span>
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-base font-black uppercase text-white">Food-Grade Aluminum</h4>
            <p className="text-[11px] text-white/80 mt-1 leading-relaxed">
              Light-blocking metallized poly-film seals in smoky spices and preserves maximum acoustic snap.
            </p>
          </div>

          {/* Interactive Trigger Buttons */}
          <div className="flex flex-col gap-2 w-full max-w-xs">
            {tearProgress < 1 ? (
              <button
                onClick={ripFoilSmoothly}
                className="group flex items-center justify-center gap-2 px-5 py-3 bg-[#FFD43B] hover:bg-yellow-300 text-[#171717] rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#171717] shadow-[0_4px_0_0_#171717] active:translate-y-0.5 pointer-events-auto transition-all cursor-pointer"
              >
                <Disc className="w-4 h-4 animate-spin" />
                <span>TAP TO RIP FOIL NOW</span>
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => {
                    sounds.playCrunch();
                    if (onManualTear) onManualTear();
                  }}
                  className="group flex items-center justify-center gap-2 px-5 py-3 bg-[#171717] hover:bg-black text-[#FFD43B] rounded-full text-xs font-black uppercase tracking-wider border-2 border-white shadow-[0_4px_0_0_#FFFFFF] active:translate-y-0.5 pointer-events-auto transition-all cursor-pointer"
                >
                  <Volume2 className="w-4 h-4 text-[#FF641F]" />
                  <span>BURST OPEN! (SCENE 03)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={resetPouch}
                  className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>RE-SEAL POUCH</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Step Indicator Bar */}
      <div className="z-20 w-full max-w-2xl mx-auto bg-black/45 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/20 mt-4">
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-black uppercase tracking-wider mb-2">
          <span className={activeStep >= 1 ? 'text-[#FFD43B]' : 'text-white/40'}>
            1. APPROACH
          </span>
          <span className={activeStep >= 2 ? 'text-[#FFD43B]' : 'text-white/40'}>
            2. TOP UNSEAL
          </span>
          <span className={activeStep >= 3 ? 'text-[#FFD43B]' : 'text-white/40'}>
            3. FOIL TEAR
          </span>
          <span className={activeStep >= 4 ? 'text-[#FFD43B]' : 'text-white/40'}>
            4. EXPANSION
          </span>
        </div>
        <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FFD43B] via-[#FF641F] to-yellow-300 transition-all duration-200"
            style={{ width: `${Math.max(15, tearProgress * 100)}%` }}
          />
        </div>
      </div>
    </section>
  );
};

