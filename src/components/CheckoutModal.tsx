import confetti from 'canvas-confetti';
import { CreditCard, Lock, X } from 'lucide-react';
import React, { useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { useCart } from '../context/CartContext';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const { items, finalTotal, clearCart } = useCart();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Alex Rivera',
    email: 'alex@cruncha-lover.com',
    address: '742 Evergreen Terrace',
    city: 'Portland',
    zip: '97201'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playCrunch();

    // Trigger celebration confetti
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FF641F', '#FFD43B', '#F04432', '#75A94B', '#3988D5']
    });

    setIsSuccess(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-xl bg-white rounded-3xl border-4 border-[#171717] shadow-[0_16px_0_0_#171717] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-[#FF641F] text-white flex items-center justify-between border-b-4 border-[#171717]">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#FFD43B]" />
            <h3 className="text-xl sm:text-2xl font-black font-heading uppercase text-white">
              {isSuccess ? 'ORDER CONFIRMED!' : 'SECURE CRUNCH CHECKOUT'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-green-100 border-4 border-green-600 flex items-center justify-center text-3xl mb-4">
              🎉
            </div>
            <h4 className="text-3xl font-black font-heading uppercase text-[#171717]">
              CRUNCH INCOMING!
            </h4>
            <p className="text-sm font-semibold text-stone-600 mt-2 max-w-sm">
              Your snack order <span className="text-[#FF641F] font-black">#CRUNCH-90241</span> has been dispatched to our kettle kitchen.
            </p>

            <div className="w-full my-6 p-4 rounded-2xl bg-[#FFF4DE] border-2 border-[#171717] text-left text-xs font-bold space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Estimated Delivery:</span>
                <span className="text-[#171717]">2 Business Days via Snack Express</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Shipping Address:</span>
                <span className="text-[#171717]">{formData.address}, {formData.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Total Charged:</span>
                <span className="text-[#FF641F] font-black">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-8 py-4 rounded-full bg-[#171717] text-[#FFD43B] font-black text-xs uppercase tracking-wider hover:bg-black border-2 border-[#171717] cursor-pointer"
            >
              BACK TO GOOD VIBES
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Order summary mini-preview */}
            <div className="p-3.5 rounded-2xl bg-[#FFF4DE] border-2 border-[#171717] flex items-center justify-between text-xs font-black">
              <span>{items.length} Unique Flavours ({items.reduce((a, b) => a + b.quantity, 0)} bags)</span>
              <span className="text-[#FF641F] font-heading text-base">${finalTotal.toFixed(2)}</span>
            </div>

            {/* Inputs */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#171717] bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF641F]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                  Email for Tracking
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border-2 border-[#171717] bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF641F]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                    Street Address
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#171717] bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF641F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-stone-700 mb-1">
                    City & Zip
                  </label>
                  <input
                    type="text"
                    required
                    value={`${formData.city}, ${formData.zip}`}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border-2 border-[#171717] bg-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-[#FF641F]"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Badge */}
            <div className="p-3 rounded-xl bg-stone-100 border border-stone-300 flex items-center justify-between text-xs font-bold">
              <span className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-stone-600" />
                <span>Simulated Express Pay</span>
              </span>
              <span className="text-[10px] bg-green-200 text-green-900 px-2 py-0.5 rounded-full font-black">
                TEST DEMO READY
              </span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 rounded-full bg-[#FF641F] hover:bg-[#E05012] text-white font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-[#171717] shadow-[0_5px_0_0_#171717] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
            >
              PLACE CRUNCH ORDER • ${finalTotal.toFixed(2)}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
