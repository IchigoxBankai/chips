import { Box, Flame, Minus, Package, Plus, Sparkles, Star } from 'lucide-react';
import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { useCart } from '../context/CartContext';
import { FLAVOURS } from '../data/flavours';
import type { Flavour, FlavourId } from '../types/cruncha';

interface ProductCollectionProps {
  onOpenNutrition: (flavour: Flavour) => void;
  onPreviewFlavour3D: (id: FlavourId) => void;
}

export const ProductCollection: React.FC<ProductCollectionProps> = ({
  onOpenNutrition,
  onPreviewFlavour3D
}) => {
  const { addToCart } = useCart();

  // Local quantity selections for individual cards
  const [quantities, setQuantities] = useState<Record<string, number>>({
    'fire-chilli': 1,
    'sour-cream-onion': 1,
    'classic-salted': 1,
    'tangy-masala': 1,
    'cheese-blast': 1
  });

  // Filter state
  const [filter, setFilter] = useState<'all' | 'spicy' | 'savory' | 'cheesy'>('all');

  // Custom 5-Pack Box Builder state
  const [customBox, setCustomBox] = useState<Record<FlavourId, number>>({
    'fire-chilli': 1,
    'sour-cream-onion': 1,
    'classic-salted': 1,
    'tangy-masala': 1,
    'cheese-blast': 1
  });

  const boxTotalItems = Object.values(customBox).reduce((a, b) => a + b, 0);

  const handleQtyChange = (id: string, delta: number) => {
    sounds.playPop(480);
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleBoxQtyChange = (id: FlavourId, delta: number) => {
    sounds.playPop(520);
    setCustomBox((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next < 0) return prev;
      if (delta > 0 && boxTotalItems >= 5) return prev; // max 5
      return { ...prev, [id]: next };
    });
  };

  const handleAddBoxToCart = () => {
    sounds.playCrunch();
    Object.entries(customBox).forEach(([id, qty]) => {
      if (qty > 0) {
        addToCart(id as FlavourId, qty);
      }
    });
  };

  const filteredFlavours = FLAVOURS.filter((flv) => {
    if (filter === 'spicy') return flv.heatLevel >= 2;
    if (filter === 'savory') return flv.id === 'sour-cream-onion' || flv.id === 'classic-salted';
    if (filter === 'cheesy') return flv.id === 'cheese-blast';
    return true;
  });

  return (
    <section
      id="collection"
      className="relative min-h-screen w-full bg-[#FFF4DE] text-[#171717] py-24 px-6 sm:px-12 lg:px-20 grain-overlay"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b-4 border-[#171717] pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF641F] text-white text-xs font-black uppercase tracking-wider mb-4 border border-[#171717] shadow-[0_2px_0_0_#171717]">
              <Package className="w-4 h-4" />
              <span>SCENE 05 — THE PANTRY COLLECTION</span>
            </div>

            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tighter font-heading text-[#171717] leading-none">
              YOUR BOX.
              <br />
              <span className="text-[#FF641F]">YOUR RULES.</span>
            </h2>
          </div>

          <p className="mt-4 md:mt-0 text-sm sm:text-base font-semibold text-stone-700 max-w-md">
            Order single pouches or build a custom 5-pack box for an automatic 15% discount and free express shipping right to your door.
          </p>
        </div>

        {/* Interactive Custom 5-Pack Box Builder Banner */}
        <div className="mb-16 p-6 sm:p-8 rounded-3xl bg-white border-4 border-[#171717] shadow-[0_8px_0_0_#171717] relative overflow-hidden">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-md">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD43B] text-[#171717] text-xs font-black uppercase tracking-wider mb-2 border border-[#171717]">
                <Sparkles className="w-3.5 h-3.5 text-[#FF641F]" />
                <span>BUILD-A-BOX DEAL • 15% OFF</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase text-[#171717]">
                CURATE YOUR 5-PACK
              </h3>
              <p className="text-xs sm:text-sm font-medium text-stone-600 mt-1">
                Select any 5 bags of your choice. Fill the meter to unlock the 15% discount and FREE shipping!
              </p>
            </div>

            {/* Selection Meter & Slot Preview */}
            <div className="flex-1 w-full max-w-xl">
              <div className="flex items-center justify-between text-xs font-black uppercase mb-2">
                <span>Box Progress ({boxTotalItems} / 5 Packs)</span>
                <span className={boxTotalItems === 5 ? 'text-green-600' : 'text-[#FF641F]'}>
                  {boxTotalItems === 5 ? '🎉 15% DISCOUNT UNLOCKED!' : `Add ${5 - boxTotalItems} more`}
                </span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full border-2 border-[#171717] overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD43B] via-[#FF641F] to-green-500 transition-all duration-300"
                  style={{ width: `${(boxTotalItems / 5) * 100}%` }}
                />
              </div>

              {/* Quick Box Allocator */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {FLAVOURS.map((f) => {
                  const qty = customBox[f.id] || 0;
                  return (
                    <div
                      key={f.id}
                      className="p-2 rounded-xl border-2 border-[#171717] bg-[#FFF4DE] flex flex-col items-center text-center"
                    >
                      <span className="text-[10px] font-black uppercase line-clamp-1">{f.name}</span>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button
                          onClick={() => handleBoxQtyChange(f.id, -1)}
                          className="w-5 h-5 rounded-full bg-white border border-[#171717] text-xs font-black flex items-center justify-center cursor-pointer hover:bg-stone-100"
                        >
                          -
                        </button>
                        <span className="text-xs font-black w-4">{qty}</span>
                        <button
                          onClick={() => handleBoxQtyChange(f.id, 1)}
                          disabled={boxTotalItems >= 5}
                          className={`w-5 h-5 rounded-full border border-[#171717] text-xs font-black flex items-center justify-center ${
                            boxTotalItems >= 5
                              ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                              : 'bg-[#FF641F] text-white hover:bg-[#E05012] cursor-pointer'
                          }`}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Add Complete Box Button */}
            <button
              onClick={handleAddBoxToCart}
              disabled={boxTotalItems === 0}
              className={`w-full lg:w-auto px-6 py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#171717] transition-all flex items-center justify-center gap-2 ${
                boxTotalItems === 5
                  ? 'bg-[#FF641F] hover:bg-[#E05012] text-white shadow-[0_5px_0_0_#171717] active:translate-y-1 active:shadow-none cursor-pointer'
                  : boxTotalItems > 0
                  ? 'bg-[#171717] text-[#FFD43B] hover:bg-black cursor-pointer'
                  : 'bg-stone-200 text-stone-400 border-stone-300 cursor-not-allowed'
              }`}
            >
              <Box className="w-4 h-4" />
              <span>ADD BOX TO CART ({boxTotalItems} ITEMS)</span>
            </button>
          </div>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center gap-2 mb-8 pb-2">
          {(['all', 'spicy', 'savory', 'cheesy'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sounds.playPop(540);
                setFilter(cat);
              }}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#171717] transition-all cursor-pointer ${
                filter === cat
                  ? 'bg-[#171717] text-[#FFD43B] shadow-[0_3px_0_0_#171717]'
                  : 'bg-white text-[#171717] hover:bg-stone-50'
              }`}
            >
              {cat === 'all' ? 'All Flavours (5)' : `${cat.toUpperCase()}`}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFlavours.map((product) => {
            const qty = quantities[product.id] || 1;

            return (
              <div
                key={product.id}
                className="group rounded-3xl bg-white border-4 border-[#171717] shadow-[0_8px_0_0_#171717] hover:shadow-[0_12px_0_0_#FF641F] transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Card Top / Visual Representation */}
                <div
                  className="p-6 relative transition-colors duration-300 flex flex-col items-center"
                  style={{
                    backgroundColor: product.primaryColor
                  }}
                >
                  {/* Top Badges */}
                  <div className="w-full flex items-center justify-between mb-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#171717] text-[#FFD43B] text-[10px] font-black uppercase tracking-widest border border-white/20">
                      {product.badge}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase border border-white/30">
                      {product.weight}
                    </span>
                  </div>

                  {/* Studio Photographic Pouch Graphic & 3D Preview Trigger */}
                  <div className="my-4 relative flex flex-col items-center">
                    <div className="w-48 h-64 relative flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/cruncha-${product.id}-hero.png`}
                        alt={`${product.name} Pouch`}
                        className="max-h-full w-auto object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.35)]"
                        loading="lazy"
                      />
                    </div>

                    <button
                      onClick={() => onPreviewFlavour3D(product.id)}
                      className="mt-3 px-3.5 py-1.5 rounded-full bg-white text-[#171717] text-[10px] font-black uppercase tracking-wider border border-[#171717] shadow-[0_2px_0_0_#171717] hover:bg-[#FFD43B] transition-colors cursor-pointer"
                    >
                      ✦ INTERACT IN 3D
                    </button>
                  </div>

                  {/* Sensory quick stats */}
                  <div className="w-full flex items-center justify-around py-2 bg-black/25 backdrop-blur-md rounded-xl text-white text-[11px] font-bold">
                    <div className="flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-[#FFD43B]" />
                      <span>Heat: {product.heatLevel}/5</span>
                    </div>
                    <div className="w-px h-3 bg-white/20" />
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#FFD43B]" />
                      <span>Crunch: {product.crunchFactor}</span>
                    </div>
                  </div>
                </div>

                {/* Card Content & Pricing Controls */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-white">
                  <div>
                    <h4 className="text-2xl font-black uppercase font-heading text-[#171717]">
                      {product.name}
                    </h4>
                    <p className="text-xs font-semibold text-stone-600 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    <button
                      onClick={() => onOpenNutrition(product)}
                      className="mt-2 text-[11px] font-black uppercase tracking-wider text-[#FF641F] hover:underline cursor-pointer"
                    >
                      View Ingredients & Nutrition →
                    </button>
                  </div>

                  {/* Quantity Stepper & Add to Cart */}
                  <div className="mt-6 pt-4 border-t-2 border-stone-200 flex flex-col sm:flex-row items-center gap-3">
                    {/* Price */}
                    <div className="text-2xl font-black font-heading text-[#171717] self-start sm:self-center">
                      ${product.price.toFixed(2)}
                    </div>

                    {/* Stepper */}
                    <div className="flex items-center rounded-full border-2 border-[#171717] bg-[#FFF4DE] p-1 ml-auto">
                      <button
                        onClick={() => handleQtyChange(product.id, -1)}
                        className="w-7 h-7 rounded-full bg-white border border-[#171717] flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-black">{qty}</span>
                      <button
                        onClick={() => handleQtyChange(product.id, 1)}
                        className="w-7 h-7 rounded-full bg-[#171717] text-white flex items-center justify-center hover:bg-stone-800 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Add to Cart button */}
                    <button
                      onClick={() => addToCart(product.id, qty)}
                      className="w-full sm:w-auto px-5 py-3 rounded-full bg-[#FF641F] hover:bg-[#E05012] text-white text-xs font-black uppercase tracking-wider border-2 border-[#171717] shadow-[0_3px_0_0_#171717] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer whitespace-nowrap"
                    >
                      ADD TO CART
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
