import { ShoppingBag, Volume2, VolumeX } from 'lucide-react';
import React from 'react';
import { sounds } from '../audio/soundEffects';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { totalCount, openCart, isSoundMuted, toggleSound } = useCart();

  const scrollTo = (id: string) => {
    sounds.playPop(580);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 sm:px-8 py-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/85 backdrop-blur-md px-5 py-3 rounded-full border-2 border-[#171717] shadow-[0_6px_0_0_#171717]">
        {/* Brand Wordmark */}
        <button
          onClick={() => scrollTo('hero')}
          className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
        >
          <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#171717] group-hover:text-[#FF641F] transition-colors font-heading">
            CRUNCHA
          </span>
          <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-black uppercase bg-[#FFD43B] text-[#171717] rounded-full tracking-wider border border-[#171717]">
            GOOD VIBES
          </span>
        </button>

        {/* Section Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-wider text-[#171717]">
          <button
            onClick={() => scrollTo('the-opening')}
            className="hover:text-[#FF641F] transition-colors cursor-pointer"
          >
            The Opening
          </button>
          <button
            onClick={() => scrollTo('explosion')}
            className="hover:text-[#FF641F] transition-colors cursor-pointer"
          >
            Big Crunch
          </button>
          <button
            onClick={() => scrollTo('flavours')}
            className="hover:text-[#FF641F] transition-colors cursor-pointer"
          >
            5 Flavours
          </button>
          <button
            onClick={() => scrollTo('collection')}
            className="hover:text-[#FF641F] transition-colors cursor-pointer"
          >
            Build Your Box
          </button>
        </nav>

        {/* Interactive Controls & Cart CTA */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            title={isSoundMuted ? 'Unmute Sound' : 'Mute Sound'}
            className="p-2 rounded-full border border-[#171717] bg-[#FFF4DE] hover:bg-[#FFE5B4] text-[#171717] transition-colors cursor-pointer"
            aria-label="Toggle Sound Effects"
          >
            {isSoundMuted ? (
              <VolumeX className="w-4 h-4 text-stone-500" />
            ) : (
              <div className="relative">
                <Volume2 className="w-4 h-4 text-[#FF641F]" />
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#FF641F] rounded-full animate-ping" />
              </div>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            onClick={openCart}
            className="relative flex items-center gap-2 px-4 py-1.5 bg-[#FF641F] hover:bg-[#E05012] text-white rounded-full font-black text-xs uppercase tracking-wider border border-[#171717] shadow-[0_3px_0_0_#171717] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            <span className="bg-white text-[#171717] px-1.5 py-0.5 rounded-full text-[11px] font-black leading-none">
              {totalCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
