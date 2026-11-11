import React, { createContext, useContext, useEffect, useState } from 'react';
import { sounds } from '../audio/soundEffects';
import { FLAVOUR_MAP } from '../data/flavours';
import type { CartItem, FlavourId } from '../types/cruncha';

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (flavourId: FlavourId, quantity?: number) => void;
  removeFromCart: (flavourId: FlavourId) => void;
  updateQuantity: (flavourId: FlavourId, delta: number) => void;
  clearCart: () => void;
  totalCount: number;
  subtotal: number;
  discount: number;
  finalTotal: number;
  shippingFee: number;
  freeShippingThreshold: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  promoDiscountRate: number;
  isSoundMuted: boolean;
  toggleSound: () => void;
  isInspectMode: boolean;
  toggleInspectMode: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([
    // Start with 1 Fire Chilli and 1 Sour Cream & Onion so user immediately sees cart populated if opened
    {
      flavourId: 'fire-chilli',
      name: 'Fire Chilli',
      price: 3.49,
      quantity: 2,
      weight: '140g',
      primaryColor: '#F04432'
    },
    {
      flavourId: 'sour-cream-onion',
      name: 'Sour Cream & Onion',
      price: 3.49,
      quantity: 1,
      weight: '140g',
      primaryColor: '#75A94B'
    }
  ]);

  const [isOpen, setIsOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const [isSoundMuted, setIsSoundMuted] = useState(false);
  const [isInspectMode, setIsInspectMode] = useState(false);

  // Sync mute state
  useEffect(() => {
    setIsSoundMuted(sounds.getMuted());
  }, []);

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsSoundMuted(muted);
  };

  const toggleInspectMode = () => {
    sounds.playPop(480);
    setIsInspectMode((prev) => !prev);
  };

  const openCart = () => {
    sounds.playRustle();
    setIsOpen(true);
  };

  const closeCart = () => {
    sounds.playPop(400);
    setIsOpen(false);
  };

  const toggleCart = () => {
    if (isOpen) {
      closeCart();
    } else {
      openCart();
    }
  };

  const addToCart = (flavourId: FlavourId, quantity = 1) => {
    const flavour = FLAVOUR_MAP[flavourId];
    if (!flavour) return;

    sounds.playCrunch();

    setItems((prev) => {
      const existing = prev.find((i) => i.flavourId === flavourId);
      if (existing) {
        return prev.map((item) =>
          item.flavourId === flavourId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [
        ...prev,
        {
          flavourId,
          name: flavour.name,
          price: flavour.price,
          quantity,
          weight: flavour.weight,
          primaryColor: flavour.primaryColor
        }
      ];
    });

    // Auto open cart drawer to give immediate feedback
    setIsOpen(true);
  };

  const removeFromCart = (flavourId: FlavourId) => {
    sounds.playPop(340);
    setItems((prev) => prev.filter((i) => i.flavourId !== flavourId));
  };

  const updateQuantity = (flavourId: FlavourId, delta: number) => {
    sounds.playPop(520);
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.flavourId === flavourId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    if (clean === 'CRUNCH15' || clean === 'CRUNCH') {
      sounds.playCrunch();
      setPromoCode(clean);
      setPromoDiscountRate(0.15); // 15% discount
      return true;
    }
    sounds.playPop(280);
    return false;
  };

  // Calculations
  const totalCount = items.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = items.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const freeShippingThreshold = 20.0;
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 3.99;
  const discount = subtotal * promoDiscountRate;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
        subtotal,
        discount,
        finalTotal,
        shippingFee,
        freeShippingThreshold,
        promoCode,
        applyPromoCode,
        promoDiscountRate,
        isSoundMuted,
        toggleSound,
        isInspectMode,
        toggleInspectMode
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
