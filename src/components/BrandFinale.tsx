import { Sparkles, Volume2 } from 'lucide-react';
import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { useCart } from '../context/CartContext';
import { FLAVOURS } from '../data/flavours';
import type { FlavourId } from '../types/cruncha';

interface BrandFinaleProps {
  onOrderBoxClick: () => void;
  onSelectFlavour: (id: FlavourId) => void;
}

export const BrandFinale: React.FC<BrandFinaleProps> = ({
  onOrderBoxClick,
  onSelectFlavour
}) => {
  const { addToCart } = useCart();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [lastCrunched, setLastCrunched] = useState<string | null>(null);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    sounds.playPop(700);
    setSubscribed(true);
  };

  const handleSoundboardCrunch = (flvId: FlavourId, name: string) => {
    sounds.playCrunch();
    setLastCrunched(name);
    onSelectFlavour(flvId);
    setTimeout(() => setLastCrunched(null), 1200);
  };

  return (
    <footer
      id="finale"
      className="relative w-full bg-[#171717] text-white pt-28 pb-16 px-6 sm:px-12 lg:px-20 overflow-hidden"
    >
      {/* Background glow and subtle dots */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF641F]/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 grain-overlay opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto z-20 relative">
        {/* Top Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#FFD43B] text-xs font-black uppercase tracking-widest border border-white/20">
            <Sparkles className="w-4 h-4 text-[#FF641F]" />
            <span>SCENE 07 — THE ULTIMATE FINALE</span>
          </div>
        </div>

        {/* Giant Headline */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl sm:text-7xl md:text-9xl font-black uppercase tracking-tighter font-heading text-white leading-none">
            GO ON.
            <br />
            <span className="text-[#FF641F] underline decoration-wavy decoration-[#FFD43B]">
              MAKE IT CRUNCH.
            </span>
          </h2>
          <p className="mt-6 text-sm sm:text-lg text-stone-300 font-semibold max-w-xl mx-auto">
            From late-night gaming sessions to sunset rooftop hangs.
            CRUNCHA brings the loudest crunch in snack history.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                sounds.playCrunch();
                onOrderBoxClick();
              }}
              className="px-9 py-5 bg-[#FF641F] hover:bg-[#E05012] text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-full border-2 border-white shadow-[0_6px_0_0_#FFFFFF] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              ORDER YOUR CRUNCH BOX
            </button>
            <a
              href="#collection"
              className="px-8 py-5 bg-white/10 hover:bg-white/20 text-white font-black text-sm sm:text-base uppercase tracking-wider rounded-full border-2 border-white/40 transition-colors cursor-pointer"
            >
              SHOP ALL 5 FLAVOURS
            </a>
          </div>
        </div>

        {/* 5 Flavour Lineup & Interactive Soundboard */}
        <div className="my-16 p-8 rounded-3xl bg-white/5 border-2 border-white/15 backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-white/10">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#FFD43B] flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span>INTERACTIVE CRUNCH SOUNDBOARD</span>
              </span>
              <h4 className="text-xl sm:text-2xl font-black font-heading uppercase text-white mt-1">
                TAP ANY PACKET TO AUDITION THE CRUNCH
              </h4>
            </div>
            {lastCrunched && (
              <div className="mt-2 sm:mt-0 px-4 py-1.5 rounded-full bg-[#FF641F] text-white text-xs font-black uppercase tracking-wider animate-bounce">
                💥 {lastCrunched} CRUNCHED!
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {FLAVOURS.map((flv) => (
              <div
                key={flv.id}
                onClick={() => handleSoundboardCrunch(flv.id, flv.name)}
                className="group p-4 rounded-2xl border-2 border-white/20 hover:border-white transition-all duration-300 flex flex-col items-center text-center cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: `${flv.primaryColor}22`
                }}
              >
                {/* Studio Product Pack */}
                <div className="w-24 h-34 flex items-center justify-center mb-3">
                  <img
                    src={`/assets/cruncha-${flv.id}-hero.png`}
                    alt={flv.name}
                    className="max-h-full w-auto object-contain drop-shadow-[0_10px_15px_rgba(0,0,0,0.5)]"
                  />
                </div>

                <span className="text-xs font-black uppercase text-white group-hover:text-[#FFD43B] transition-colors">
                  {flv.name}
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">Crunch {flv.crunchFactor}/10</span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(flv.id, 1);
                  }}
                  className="mt-3 px-3 py-1 rounded-full bg-white text-[#171717] text-[10px] font-black uppercase hover:bg-[#FFD43B] transition-colors cursor-pointer"
                >
                  + Add (${flv.price.toFixed(2)})
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Signup & Perks */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border-t border-b border-white/10 py-12 mb-16">
          <div className="lg:col-span-6">
            <span className="text-xs font-black uppercase tracking-wider text-[#FF641F]">
              THE CRUNCH CLUB
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white mt-1">
              GET 20% OFF YOUR FIRST BOX
            </h3>
            <p className="text-xs sm:text-sm text-stone-400 mt-2 max-w-md">
              Be the first to taste secret drop flavours, get VIP snack discounts, and join our acoustic crunch tasting panel.
            </p>
          </div>

          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 rounded-2xl bg-green-900/60 border border-green-500 text-green-200 text-xs font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-green-400" />
                <span>WELCOME TO THE CRUNCH CLUB! Check your inbox for your 20% coupon code.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-5 py-4 rounded-full bg-white/10 border-2 border-white/20 text-white placeholder:text-stone-500 text-xs font-bold uppercase focus:outline-none focus:border-[#FF641F]"
                  required
                />
                <button
                  type="submit"
                  className="px-8 py-4 rounded-full bg-[#FFD43B] text-[#171717] font-black text-xs uppercase tracking-wider hover:bg-yellow-300 transition-colors border-2 border-[#FFD43B] cursor-pointer"
                >
                  JOIN CLUB
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Massive Brand Footer Wordmark */}
        <div className="text-center my-8 select-none">
          <span className="text-6xl sm:text-9xl md:text-[14rem] font-black font-heading tracking-tighter text-white/10 hover:text-[#FF641F]/30 transition-colors duration-500 block leading-none">
            CRUNCHA
          </span>
        </div>

        {/* Footer Sub-bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-stone-400">
          <div>
            © {new Date().getFullYear()} CRUNCHA SNACK CO. GOOD VIBES. BIG CRUNCH. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">PRIVACY POLICY</span>
            <span className="hover:text-white transition-colors cursor-pointer">TERMS OF SERVICE</span>
            <span className="hover:text-white transition-colors cursor-pointer">ALLERGEN INFO</span>
            <span className="hover:text-white transition-colors cursor-pointer">CONTACT</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
