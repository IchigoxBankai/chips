import { ArrowRight, Minus, Plus, Sparkles, Tag, Trash2, Truck, X } from 'lucide-react';
import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { useCart } from '../context/CartContext';

interface CartDrawerProps {
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onCheckout }) => {
  const {
    items,
    isOpen,
    closeCart,
    removeFromCart,
    updateQuantity,
    totalCount,
    subtotal,
    discount,
    finalTotal,
    shippingFee,
    freeShippingThreshold,
    promoCode,
    applyPromoCode
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [promoError, setPromoError] = useState(false);

  const handleApplyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode) return;
    const ok = applyPromoCode(inputCode);
    if (!ok) {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 2500);
    }
  };

  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-in Drawer Container from Right */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-md bg-[#FFF4DE] text-[#171717] border-l-4 border-[#171717] shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-6 border-b-2 border-[#171717]/15 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black font-heading tracking-tight">YOUR CRUNCH CART</span>
                <span className="px-2 py-0.5 rounded-full bg-[#FF641F] text-white text-xs font-black">
                  {totalCount}
                </span>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-stone-100 transition-colors border border-stone-200 cursor-pointer"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5 text-stone-700" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="mt-4 p-3 rounded-2xl bg-[#FFF4DE] border-2 border-[#171717]">
              <div className="flex items-center justify-between text-xs font-black uppercase mb-1.5">
                <span className="flex items-center gap-1.5 text-[#171717]">
                  <Truck className="w-4 h-4 text-[#FF641F]" />
                  {amountToFreeShipping === 0 ? 'FREE EXPRESS SHIPPING UNLOCKED!' : `ADD $${amountToFreeShipping.toFixed(2)} FOR FREE SHIPPING`}
                </span>
                <span className="text-[10px] text-stone-500">{Math.round(freeShippingProgress)}%</span>
              </div>
              <div className="w-full h-2.5 bg-white rounded-full border border-[#171717] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FFD43B] to-[#FF641F] transition-all duration-300"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-white border-2 border-[#171717] flex items-center justify-center text-3xl mb-4 shadow-[0_4px_0_0_#171717]">
                  🥔
                </div>
                <h4 className="text-xl font-black font-heading uppercase">YOUR CART IS HUNGRY</h4>
                <p className="text-xs text-stone-600 mt-2 max-w-xs">
                  Your box has zero chips right now. Add Fire Chilli or build a custom 5-pack to get crunching!
                </p>
                <button
                  onClick={closeCart}
                  className="mt-6 px-6 py-3 rounded-full bg-[#FF641F] text-white text-xs font-black uppercase tracking-wider border-2 border-[#171717] shadow-[0_4px_0_0_#171717] hover:bg-[#E05012] cursor-pointer"
                >
                  START SHOPPING
                </button>
              </div>
            ) : (
              items.map((item) => (
                  <div
                    key={item.flavourId}
                    className="p-4 rounded-2xl bg-white border-2 border-[#171717] shadow-[0_4px_0_0_#171717] flex items-center gap-4"
                  >
                    {/* Flavour Studio Thumbnail */}
                    <div className="w-14 h-18 flex items-center justify-center shrink-0">
                      <img
                        src={`${import.meta.env.BASE_URL}assets/cruncha-${item.flavourId}-hero.png`}
                        alt={item.name}
                        className="max-h-full w-auto object-contain drop-shadow"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h5 className="text-sm font-black uppercase tracking-tight text-[#171717] truncate">
                            {item.name}
                          </h5>
                          <span className="text-[11px] font-semibold text-stone-500">
                            Net Wt. {item.weight} • Kettle Cooked
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.flavourId)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity Stepper & Line Price */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-full border border-[#171717] bg-[#FFF4DE] p-0.5">
                          <button
                            onClick={() => updateQuantity(item.flavourId, -1)}
                            className="w-6 h-6 rounded-full bg-white border border-[#171717] flex items-center justify-center hover:bg-stone-100 cursor-pointer"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-black">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.flavourId, 1)}
                            className="w-6 h-6 rounded-full bg-[#171717] text-white flex items-center justify-center hover:bg-stone-800 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-sm font-black font-heading text-[#171717]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>

          {/* Footer & Order Summary */}
          {items.length > 0 && (
            <div className="p-6 bg-white border-t-2 border-[#171717]/15">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyCode} className="mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="TRY 'CRUNCH15'"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-full border-2 border-[#171717] bg-[#FFF4DE] text-xs font-bold uppercase placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#FF641F]"
                    />
                    <Tag className="w-3.5 h-3.5 text-stone-400 absolute right-3.5 top-3" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-full bg-[#171717] text-white text-xs font-black uppercase tracking-wider hover:bg-stone-800 border-2 border-[#171717] cursor-pointer"
                  >
                    APPLY
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-red-600 font-bold mt-1">Invalid code! Try "CRUNCH15".</p>
                )}
                {promoCode && (
                  <p className="text-[11px] text-green-600 font-bold mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Code '{promoCode}' active (-15%)
                  </p>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs font-semibold text-stone-600 border-b border-stone-200 pb-3 mb-3">
                <div className="flex justify-between">
                  <span>Subtotal ({totalCount} items)</span>
                  <span className="font-bold text-[#171717]">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-bold">
                    <span>Promo Discount (15%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Snacking Shipping</span>
                  <span className="font-bold text-[#171717]">
                    {shippingFee === 0 ? 'FREE' : `$${shippingFee.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Final Subtotal & Checkout CTA */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-base font-black font-heading uppercase text-[#171717]">TOTAL</span>
                <span className="text-2xl font-black font-heading text-[#FF641F]">
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => {
                  sounds.playCrunch();
                  onCheckout();
                }}
                className="w-full flex items-center justify-center gap-3 py-4 rounded-full bg-[#FF641F] hover:bg-[#E05012] text-white font-black text-sm uppercase tracking-wider border-2 border-[#171717] shadow-[0_5px_0_0_#171717] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
