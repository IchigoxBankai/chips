import { CheckCircle2, ShieldCheck, X } from 'lucide-react';
import React from 'react';
import { sounds } from '../audio/soundEffects';
import { useCart } from '../context/CartContext';
import type { Flavour } from '../types/cruncha';

interface NutritionModalProps {
  flavour: Flavour | null;
  onClose: () => void;
}

export const NutritionModal: React.FC<NutritionModalProps> = ({ flavour, onClose }) => {
  const { addToCart } = useCart();

  if (!flavour) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-3xl border-4 border-[#171717] shadow-[0_12px_0_0_#171717] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div
          className="p-6 text-white flex items-center justify-between"
          style={{ backgroundColor: flavour.primaryColor }}
        >
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest bg-black/30 px-2.5 py-0.5 rounded-full">
              NUTRITION & INGREDIENTS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-heading uppercase text-white mt-1">
              {flavour.name}
            </h3>
          </div>
          <button
            onClick={() => {
              sounds.playPop(400);
              onClose();
            }}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nutrition Table */}
        <div className="p-6 space-y-6">
          <div>
            <div className="flex items-baseline justify-between border-b-4 border-[#171717] pb-2">
              <span className="text-2xl font-black font-heading">Nutrition Facts</span>
              <span className="text-xs font-bold text-stone-500">Per 140g Bag</span>
            </div>

            <div className="flex justify-between py-2 border-b border-stone-200 text-sm font-bold">
              <span>Calories</span>
              <span className="font-heading text-lg">{flavour.nutrition.calories}</span>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2 py-3 text-xs border-b border-stone-200 font-medium">
              <div className="flex justify-between">
                <span className="font-bold">Total Fat</span>
                <span>{flavour.nutrition.fat}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Sodium</span>
                <span>{flavour.nutrition.sodium}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Total Carbs</span>
                <span>{flavour.nutrition.carbs}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold">Protein</span>
                <span>{flavour.nutrition.protein}</span>
              </div>
            </div>
          </div>

          {/* Simple Whole Ingredients */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#171717] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span>REAL WHOLE INGREDIENTS</span>
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-medium bg-[#FFF4DE] p-3.5 rounded-xl border-2 border-[#171717]">
              Hand-selected Russet potatoes, cold-pressed sunflower oil, sea salt, dried chili peppers, garlic, onion, natural yeast extract, smoked paprika, cane sugar, citric acid, lime oil, natural smoke aroma.
            </p>
          </div>

          {/* Certified Badges */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-300 text-[10px] font-black uppercase">
              <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <span>Gluten-Free</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-300 text-[10px] font-black uppercase">
              <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <span>Non-GMO</span>
            </div>
            <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-300 text-[10px] font-black uppercase">
              <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <span>No MSG</span>
            </div>
          </div>

          {/* Add to Cart quick CTA */}
          <button
            onClick={() => {
              addToCart(flavour.id, 1);
              onClose();
            }}
            className="w-full py-4 rounded-full bg-[#FF641F] hover:bg-[#E05012] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#171717] shadow-[0_4px_0_0_#171717] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            ADD {flavour.name.toUpperCase()} TO CART • ${flavour.price.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
};
