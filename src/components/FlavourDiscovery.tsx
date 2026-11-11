import { ChevronRight, Droplet, Flame, Info, Plus, Sparkles, Star } from 'lucide-react';
import React from 'react';
import { sounds } from '../audio/soundEffects';
import { useCart } from '../context/CartContext';
import { FLAVOURS } from '../data/flavours';
import type { Flavour, FlavourId } from '../types/cruncha';

interface FlavourDiscoveryProps {
  activeFlavourId: FlavourId;
  onSelectFlavour: (flavourId: FlavourId) => void;
  onOpenNutrition: (flavour: Flavour) => void;
  onGoToCollection: () => void;
}

export const FlavourDiscovery: React.FC<FlavourDiscoveryProps> = ({
  activeFlavourId,
  onSelectFlavour,
  onOpenNutrition,
  onGoToCollection
}) => {
  const { addToCart } = useCart();
  const currentFlavour = FLAVOURS.find((f) => f.id === activeFlavourId) || FLAVOURS[0];

  const handleFlavourChange = (id: FlavourId) => {
    sounds.playPop(620);
    onSelectFlavour(id);
  };

  return (
    <section
      id="flavours"
      className="relative min-h-[140vh] w-full transition-colors duration-700 ease-out py-24 px-6 sm:px-12 lg:px-20 overflow-hidden"
      style={{
        backgroundColor: currentFlavour.primaryColor,
      }}
    >
      {/* Dynamic ambient background radial gradients */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 70% 50%, ${currentFlavour.secondaryColor} 0%, transparent 70%)`
        }}
      />
      <div className="absolute inset-0 grain-overlay opacity-30 pointer-events-none" />

      {/* Top Header & Chapter Tag */}
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center z-20 relative mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md text-white border border-white/20 text-xs font-black uppercase tracking-widest mb-4">
          <Sparkles className="w-4 h-4 text-[#FFD43B]" />
          <span>SCENE 04 — CHAPTER BY CHAPTER</span>
        </div>

        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter text-white font-heading drop-shadow-md">
          FIVE FLAVOURS.
          <br />
          <span className="text-[#FFD43B]">INFINITE CRAVINGS.</span>
        </h2>
      </div>

      {/* Flavour Navigation Tabs */}
      <div className="w-full max-w-5xl mx-auto z-20 relative mb-12 px-4">
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          {FLAVOURS.map((flv) => {
            const isSelected = flv.id === activeFlavourId;
            return (
              <button
                key={flv.id}
                onClick={() => handleFlavourChange(flv.id)}
                className={`flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider transition-all border-2 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#171717] border-[#171717] shadow-[0_4px_0_0_#171717] scale-105'
                    : 'bg-black/35 text-white border-white/20 hover:bg-black/50 hover:border-white/40'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full border border-black/30 shrink-0"
                  style={{ backgroundColor: flv.primaryColor }}
                />
                <span className="whitespace-nowrap">{flv.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Flavour Stage */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-20 relative">
        {/* Left Column: Flavour Story, Tasting Notes & Specs */}
        <div className="lg:col-span-6 flex flex-col items-start text-left">
          {/* Badge */}
          <div className="px-3.5 py-1 rounded-md bg-[#171717] text-[#FFD43B] text-xs font-black uppercase tracking-widest mb-4 border border-white/20">
            {currentFlavour.badge}
          </div>

          <h3 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white font-heading leading-tight drop-shadow-md">
            {currentFlavour.name}
          </h3>

          <p className="text-sm sm:text-base font-bold text-[#FFD43B] uppercase tracking-wider mt-2">
            {currentFlavour.tagline}
          </p>

          <p className="mt-4 text-sm sm:text-lg text-white/90 leading-relaxed font-medium">
            {currentFlavour.description}
          </p>

          {/* Key Tasting Notes Pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {currentFlavour.keyNotes.map((note) => (
              <span
                key={note}
                className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/25"
              >
                ✦ {note}
              </span>
            ))}
          </div>

          {/* Pairing Recommendation */}
          <div className="mt-6 p-4 rounded-2xl bg-black/30 backdrop-blur-md border border-white/20 w-full max-w-md">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#FFD43B] flex items-center gap-1.5 mb-1">
              <Droplet className="w-3.5 h-3.5" />
              <span>PERFECT PAIRING</span>
            </div>
            <div className="text-xs sm:text-sm font-semibold text-white">
              {currentFlavour.pairing}
            </div>
          </div>

          {/* Sensory Metrics (Heat Level & Crunch Factor) */}
          <div className="mt-6 grid grid-cols-2 gap-4 w-full max-w-md">
            {/* Heat Level */}
            <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
              <div className="text-[11px] font-black uppercase tracking-wider text-white/80 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#FFD43B]" />
                <span>HEAT LEVEL</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <span
                    key={lvl}
                    className={`w-4 h-4 rounded-full border border-black/30 transition-all ${
                      lvl <= currentFlavour.heatLevel ? 'bg-[#FFD43B] scale-110' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Crunch Factor */}
            <div className="p-3.5 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20">
              <div className="text-[11px] font-black uppercase tracking-wider text-white/80 mb-1 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-[#FFD43B]" />
                <span>CRUNCH FACTOR</span>
              </div>
              <div className="text-xl font-black text-white font-heading">
                {currentFlavour.crunchFactor} <span className="text-xs font-normal text-white/70">/ 10</span>
              </div>
            </div>
          </div>

          {/* Action CTAs: Add To Cart & Nutrition Modal */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={() => addToCart(currentFlavour.id, 1)}
              className="flex items-center gap-3 px-8 py-4 bg-white hover:bg-[#FFF4DE] text-[#171717] rounded-full text-sm font-black uppercase tracking-wider border-2 border-[#171717] shadow-[0_5px_0_0_#171717] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#FF641F]" />
              <span>ADD TO CART • ${currentFlavour.price.toFixed(2)}</span>
            </button>

            <button
              onClick={() => {
                sounds.playPop(480);
                onOpenNutrition(currentFlavour);
              }}
              className="flex items-center gap-2 px-5 py-4 rounded-full bg-black/40 hover:bg-black/60 text-white text-xs font-black uppercase tracking-wider border border-white/30 transition-all cursor-pointer"
            >
              <Info className="w-4 h-4 text-[#FFD43B]" />
              <span>NUTRITION FACTS</span>
            </button>
          </div>
        </div>

        {/* Right Column: Flavour Showcase Pouch Stage */}
        <div className="lg:col-span-6 h-[460px] sm:h-[520px] lg:h-[580px] relative flex flex-col items-center justify-center">
          {/* Top-right custom box bundle shortcut button */}
          <div className="absolute top-0 right-0 text-right z-20">
            <button
              onClick={onGoToCollection}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/95 backdrop-blur-md text-[#171717] text-xs font-black uppercase tracking-wider border-2 border-[#171717] shadow-[0_3px_0_0_#171717] hover:bg-white hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>CUSTOM 5-PACK BUNDLE</span>
              <ChevronRight className="w-4 h-4 text-[#FF641F] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Ambient Radial Halo behind the pouch */}
          <div
            className="absolute w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] rounded-full blur-3xl opacity-60 pointer-events-none transition-all duration-700"
            style={{
              background: `radial-gradient(circle, ${currentFlavour.secondaryColor} 0%, rgba(0,0,0,0) 70%)`
            }}
          />

          {/* The Packet Image (Slightly smaller, beautifully floating, photorealistic) */}
          <div className="relative z-10 animate-pouch-float transition-all duration-500 ease-out flex items-center justify-center">
            <img
              key={currentFlavour.id}
              src={`${import.meta.env.BASE_URL}assets/cruncha-${currentFlavour.id}-hero.png`}
              alt={`${currentFlavour.name} CRUNCHA Kettle Cooked Potato Chips`}
              className="max-h-[360px] sm:max-h-[420px] lg:max-h-[460px] w-auto object-contain drop-shadow-[0_25px_35px_rgba(0,0,0,0.4)] select-none transition-transform duration-300 hover:scale-105"
              draggable={false}
            />
          </div>

          {/* Flavour Net Wt & Kettle Seal Pill */}
          <div className="mt-4 px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-[11px] font-black uppercase tracking-wider flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: currentFlavour.secondaryColor }} />
            <span>NET WT. {currentFlavour.weight} • 100% KETTLE COOKED</span>
          </div>
        </div>
      </div>
    </section>
  );
};
