import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import React, { useEffect, useState } from 'react';

import { CrunchaCanvas } from './3d/CrunchaCanvas';
import { BrandFinale } from './components/BrandFinale';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ChipsExplosion } from './components/ChipsExplosion';
import { FlavourDiscovery } from './components/FlavourDiscovery';
import { Hero } from './components/Hero';
import { Navbar } from './components/Navbar';
import { NutritionModal } from './components/NutritionModal';
import { OpeningScene } from './components/OpeningScene';
import { ProductCollection } from './components/ProductCollection';
import { ScrollTravelingPacket } from './components/ScrollTravelingPacket';
import { CartProvider } from './context/CartContext';
import type { Flavour, FlavourId } from './types/cruncha';

gsap.registerPlugin(ScrollTrigger);

const AppContent: React.FC = () => {
  const [activeFlavourId, setActiveFlavourId] = useState<FlavourId>('fire-chilli');
  const [nutritionFlavour, setNutritionFlavour] = useState<Flavour | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [tearProgress, setTearProgress] = useState(0);

  // Smooth Lenis Scroll setup & GSAP ScrollTrigger Synchronization
  useEffect(() => {
    // 1. Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth easeOutExpo
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true
    });

    lenis.on('scroll', ScrollTrigger.update);

    const updateLenis = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateLenis);
    gsap.ticker.lagSmoothing(0);

    // 2. Set up GSAP Storytelling Timelines
    const ctx = gsap.context(() => {
      const pouchEl = document.getElementById('scroll-traveling-packet');
      const isDesktop = window.innerWidth >= 1024;
      const startX = isDesktop ? Math.min(340, window.innerWidth * 0.22) : 0;
      const startY = isDesktop ? 10 : 35;

      // Initial placement inside Hero stage
      if (pouchEl) {
        gsap.set(pouchEl, {
          x: startX,
          y: startY,
          rotationY: -8,
          rotationX: 2,
          scale: 1,
          opacity: 1
        });
      }

      // Timeline 1: Hero to Scene 02 (The Big Opening)
      // When scrolling down, the chips packet smoothly comes down from the right into the center of Scene 02
      ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        endTrigger: '#the-opening',
        end: 'top top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const curX = THREE_LERP(startX, 0, p);
          const curY = THREE_LERP(startY, 0, p);
          const rotY = THREE_LERP(-8, 0, p);
          const rotX = THREE_LERP(2, 0, p);
          const sc = THREE_LERP(1.0, 1.06, p);

          if (pouchEl) {
            gsap.set(pouchEl, {
              x: curX,
              y: curY,
              rotationY: rotY,
              rotationX: rotX,
              scale: sc,
              opacity: 1
            });
          }
        }
      });

      // Timeline 2: Scene 02 (The Big Opening)
      // Packet settles in Scene 02. As user scrolls past Scene 02 towards Scene 03,
      // the packet scrolls away WITH Scene 02 and does NOT follow down into Scene 03.
      ScrollTrigger.create({
        trigger: '#the-opening',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          setTearProgress(p);

          if (pouchEl) {
            const openingEl = document.getElementById('the-opening');
            const h = openingEl ? openingEl.clientHeight : window.innerHeight;
            const scrollUpY = -p * h;
            gsap.set(pouchEl, {
              x: 0,
              y: scrollUpY,
              rotationY: 0,
              rotationX: 0,
              scale: 1.06,
              opacity: p > 0.85 ? Math.max(0, (1 - p) * 6.6) : 1
            });
          }
        }
      });

      // Timeline 6: Scene 07 (Brand Finale) - Reveal 5-pack lineup
      ScrollTrigger.create({
        trigger: '#finale',
        start: 'top center',
        end: 'bottom bottom'
      });
    });

    return () => {
      ctx.revert();
      lenis.destroy();
      gsap.ticker.remove(updateLenis);
    };
  }, []);

  const handleSelectFlavour = (id: FlavourId) => {
    setActiveFlavourId(id);
    const api = (window as unknown as { cruncha3D?: { setFlavour: (f: FlavourId) => void } }).cruncha3D;
    if (api) {
      api.setFlavour(id);
    }
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#FFF4DE] text-[#171717] selection:bg-[#FF641F] selection:text-white">
      {/* 3D WebGL Canvas Layer (Particles & Background Studio FX) */}
      <CrunchaCanvas
        activeFlavour={activeFlavourId}
      />

      {/* Continuous Photorealistic Traveling Packet (Comes down smoothly on scroll) */}
      <ScrollTravelingPacket
        activeFlavour={activeFlavourId}
        tearProgress={tearProgress}
      />

      {/* Persistent Navigation Bar */}
      <Navbar />

      {/* Main Content Flow: 7 Scenes */}
      <main className="relative z-20">
        {/* Scene 01: Hero */}
        <Hero
          onTearOpenClick={() => handleScrollToSection('the-opening')}
          onShopClick={() => handleScrollToSection('flavours')}
        />

        {/* Scene 02: The Big Opening */}
        <OpeningScene
          tearProgress={tearProgress}
          onTearProgressChange={(p) => setTearProgress(p)}
          onManualTear={() => handleScrollToSection('explosion')}
        />

        {/* Scene 03: Chips Explosion */}
        <ChipsExplosion
          onExploreFlavours={() => handleScrollToSection('flavours')}
        />

        {/* Scene 04: Flavour Discovery */}
        <FlavourDiscovery
          activeFlavourId={activeFlavourId}
          onSelectFlavour={handleSelectFlavour}
          onOpenNutrition={(flv) => setNutritionFlavour(flv)}
          onGoToCollection={() => handleScrollToSection('collection')}
        />

        {/* Scene 05: Product Collection */}
        <ProductCollection
          onOpenNutrition={(flv) => setNutritionFlavour(flv)}
          onPreviewFlavour3D={(id) => {
            handleSelectFlavour(id);
            handleScrollToSection('flavours');
          }}
        />

        {/* Scene 07: Brand Finale & Footer */}
        <BrandFinale
          onOrderBoxClick={() => handleScrollToSection('collection')}
          onSelectFlavour={handleSelectFlavour}
        />
      </main>

      {/* Scene 06: Cart Drawer (Slide-in) */}
      <CartDrawer
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Preview Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />

      {/* Nutrition & Whole Ingredients Modal */}
      <NutritionModal
        flavour={nutritionFlavour}
        onClose={() => setNutritionFlavour(null)}
      />
    </div>
  );
};

function THREE_LERP(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
