import gsap from 'gsap';
import { Flame, Sparkles } from 'lucide-react';
import React, { useRef } from 'react';
import { sounds } from '../audio/soundEffects';

interface HeroProps {
  onTearOpenClick: () => void;
  onShopClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onTearOpenClick, onShopClick }) => {
  const stageRef = useRef<HTMLDivElement>(null);

  // Mouse hover parallax tilt on the traveling packet (when near top of page)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.scrollY > 120 || !stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

    const pouchEl = document.getElementById('scroll-traveling-packet');
    if (pouchEl) {
      const isDesktop = window.innerWidth >= 1024;
      const startX = isDesktop ? Math.min(340, window.innerWidth * 0.22) : 0;
      const startY = isDesktop ? 10 : 35;

      gsap.to(pouchEl, {
        x: startX - x * 18,
        y: startY + y * 14,
        rotationX: -y * 14,
        rotationY: -8 + x * 18,
        duration: 0.2,
        ease: 'power1.out',
        overwrite: 'auto'
      });
    }
  };

  const handleMouseLeave = () => {
    if (window.scrollY > 120) return;
    const pouchEl = document.getElementById('scroll-traveling-packet');
    if (pouchEl) {
      const isDesktop = window.innerWidth >= 1024;
      const startX = isDesktop ? Math.min(340, window.innerWidth * 0.22) : 0;
      const startY = isDesktop ? 10 : 35;

      gsap.to(pouchEl, {
        x: startX,
        y: startY,
        rotationX: 2,
        rotationY: -8,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto'
      });
    }
  };

  return (
    <section
      id="hero"
      onMouseMove={handleMouseMove}
      className="relative min-h-screen w-full flex flex-col justify-between px-6 sm:px-12 lg:px-20 pt-28 pb-12 overflow-hidden grain-overlay"
    >
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20 my-auto">
        {/* Left Column: Bold Typography & Brand Story */}
        <div className="lg:col-span-6 flex flex-col items-start text-left max-w-xl z-20">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFD43B] border-2 border-[#171717] shadow-[0_3px_0_0_#171717] mb-6">
            <Sparkles className="w-4 h-4 text-[#FF641F]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#171717]">
              GOOD VIBES. BIG CRUNCH.
            </span>
          </div>

          {/* Staggered Headline */}
          <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black text-[#171717] leading-[0.94] tracking-tighter font-heading uppercase">
            LIFE'S <span className="text-[#FF641F] underline decoration-wavy decoration-[#FFD43B] decoration-4">BETTER</span>
            <br />
            WITH A LITTLE
            <br />
            <span className="inline-block bg-[#171717] text-white px-4 py-1.5 mt-2 transform -rotate-1 rounded-xl shadow-[0_8px_0_0_#FF641F]">
              CRUNCH.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg font-medium text-stone-700 leading-relaxed">
            Extra-thick hand-cooked Russet potatoes crisped to deafening perfection.
            Five cinematic flavours crafted with pure spices, good vibes, and zero nonsense.
          </p>

          {/* Call to Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => {
                sounds.playFoilTear();
                onTearOpenClick();
              }}
              className="group flex items-center gap-3 px-8 py-4 bg-[#FF641F] hover:bg-[#E05012] text-white text-sm sm:text-base font-black uppercase tracking-wider rounded-full border-2 border-[#171717] shadow-[0_6px_0_0_#171717] active:translate-y-1 active:shadow-[0_2px_0_0_#171717] transition-all cursor-pointer"
            >
              <Flame className="w-5 h-5 text-[#FFD43B] group-hover:scale-125 transition-transform" />
              <span>TEAR IT OPEN</span>
              <span className="text-xs bg-black/25 px-2 py-0.5 rounded-full font-bold">SCENE 02</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop(520);
                onShopClick();
              }}
              className="px-7 py-4 bg-white hover:bg-[#FFF4DE] text-[#171717] text-sm sm:text-base font-black uppercase tracking-wider rounded-full border-2 border-[#171717] shadow-[0_4px_0_0_#171717] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              EXPLORE 5 FLAVOURS
            </button>
          </div>

          {/* Brand Highlights Bar */}
          <div className="mt-10 pt-6 border-t-2 border-[#171717]/15 flex flex-wrap items-center gap-6 text-xs font-bold uppercase tracking-wider text-stone-600">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF641F]" />
              <span>100% Kettle Cooked</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#75A94B]" />
              <span>Himalayan Rock Salt</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD43B]" />
              <span>10/10 Crunch Rated</span>
            </div>
          </div>
        </div>

        {/* Right Column: Commercial Product Stage (Target landing area for traveling pouch) */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="lg:col-span-6 h-[440px] sm:h-[500px] lg:h-[540px] relative flex items-center justify-center select-none"
        >
          {/* 1. Breathing Energy Glow */}
          <div className="hero-glow-outer">
            <div className="hero-glow-inner" />
          </div>

          {/* 2. Sleek Orbital Ring with Glowing Energy Beads */}
          <div className="hero-orbit-ring" />

          {/* Reserved stage footprint for the continuous traveling packet */}
          <div className="w-56 sm:w-64 md:w-72 aspect-[1/1.38] pointer-events-none" />
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <div className="w-full flex justify-center pt-4 z-20 pointer-events-auto">
        <button
          onClick={onTearOpenClick}
          className="flex flex-col items-center gap-1 group cursor-pointer text-stone-600 hover:text-[#FF641F] transition-colors"
        >
          <span className="text-[10px] font-black tracking-widest uppercase">
            SCROLL FOR BIG CRUNCH
          </span>
          <div className="w-6 h-9 rounded-full border-2 border-[#171717] flex items-start justify-center p-1 bg-white/80 shadow-[0_2px_0_0_#171717]">
            <div className="w-1.5 h-2 bg-[#FF641F] rounded-full animate-bounce" />
          </div>
        </button>
      </div>
    </section>
  );
};
