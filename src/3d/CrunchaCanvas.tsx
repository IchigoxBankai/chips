import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { FlavourId } from '../types/cruncha';
import { createExplosionSystem, type ExplosionSystem } from './explosionSystem';
import { createPouchModel, type PouchComponents } from './pouchModel';

interface CrunchaCanvasProps {
  activeFlavour: FlavourId;
  onFlavourChange?: (flavour: FlavourId) => void;
  isInspectMode?: boolean;
}

export const CrunchaCanvas: React.FC<CrunchaCanvasProps> = ({
  activeFlavour,
  isInspectMode = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const pouchRef = useRef<PouchComponents | null>(null);
  const explosionRef = useRef<ExplosionSystem | null>(null);
  const shadowMeshRef = useRef<THREE.Mesh | null>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);

  // Flavour texture sync
  useEffect(() => {
    if (pouchRef.current) {
      if (activeFlavour === 'fire-chilli') {
        pouchRef.current.setFlavourTexture(
          '/assets/pouch-front-fire-chilli.png',
          '/assets/pouch-back-fire-chilli.png'
        );
      } else {
        pouchRef.current.setFlavourTexture(
          `/assets/pouch-${activeFlavour}.jpg`,
          '/assets/pouch-back-fire-chilli.png'
        );
      }
    }
    if (explosionRef.current) {
      explosionRef.current.setFlavour(activeFlavour);
    }
  }, [activeFlavour]);

  useEffect(() => {
    if (pouchRef.current && pouchRef.current.group) {
      // Keep pouch mesh hidden in canvas to avoid duplicate overlapping packets with Hero
      pouchRef.current.group.visible = false;
      if (shadowMeshRef.current) shadowMeshRef.current.visible = false;
    }
  }, [isInspectMode]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 2. Camera setup - High-end product commercial perspective
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.8);
    cameraRef.current = camera;

    // 3. WebGL Renderer
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch (err) {
      console.warn('WebGL initialization fallback:', err);
      setWebGLSupported(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Commercial Studio Lighting Rig
    // Ambient light - warm tone
    const ambientLight = new THREE.AmbientLight(0xfff6eb, 1.1);
    scene.add(ambientLight);

    // Key Light - soft directional light from top right
    const keyLight = new THREE.DirectionalLight(0xfffaee, 2.5);
    keyLight.position.set(3.8, 4.5, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0008;
    scene.add(keyLight);

    // Rim Backlight - High-impact edge glint on metallic pouch shoulders
    const rimLight = new THREE.DirectionalLight(0xffa834, 3.2);
    rimLight.position.set(-4.0, 3.8, -3.8);
    scene.add(rimLight);

    // Left Edge Kick Light - Reveals curved volume of the side seam
    const kickLight = new THREE.DirectionalLight(0xffffff, 1.3);
    kickLight.position.set(-4.2, 0.2, 2.0);
    scene.add(kickLight);

    // Front-bottom fill light
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.85);
    fillLight.position.set(0, -3.2, 3.5);
    scene.add(fillLight);

    // 5. Authentic 3D Flexible Snack Pouch Model
    const pouch = createPouchModel();
    pouchRef.current = pouch;

    const isMobile = window.innerWidth < 768;
    const targetX = isMobile ? 0 : 1.78;
    const targetY = isMobile ? -0.28 : 0.05;

    // Start with 3D pouch ready
    pouch.group.position.set(targetX, targetY, 0.1);
    pouch.group.rotation.set(-0.04, -0.24, 0.04);
    pouch.group.scale.set(0.96, 0.96, 0.96);
    // Canvas pouch remains hidden so Hero's crisp isolated product handles 360 inspect
    pouch.group.visible = false;
    scene.add(pouch.group);

    // 6. Realistic Soft Contact Shadow Beneath Floating Pouch
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 256;
    shadowCanvas.height = 256;
    const sCtx = shadowCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(128, 128, 15, 128, 128, 110);
    sGrad.addColorStop(0, 'rgba(23, 23, 23, 0.45)');
    sGrad.addColorStop(0.5, 'rgba(23, 23, 23, 0.15)');
    sGrad.addColorStop(1, 'rgba(23, 23, 23, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 256, 256);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.4), shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(targetX, -2.4, 0);
    shadowMesh.visible = false;
    scene.add(shadowMesh);
    shadowMeshRef.current = shadowMesh;

    // 7. Explosion System for Scene 03 (Chips Explosion)
    // NOTE: Chips are reserved for the dedicated explosion scene, NOT in the hero!
    const explosion = createExplosionSystem(activeFlavour);
    explosion.position.set(0, -0.2, 0);
    scene.add(explosion);
    explosionRef.current = explosion;

    // 8. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 9. Animation Loop (Idle floating + inspect rotation)
    const clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Subtle idle floating breathing animation
      if (pouch.group && !isInspectMode) {
        // Soft vertical float
        pouch.group.position.y = targetY + Math.sin(elapsed * 1.4) * 0.07;
        // Subtle organic breathing tilt
        pouch.group.rotation.z = 0.04 + Math.cos(elapsed * 1.1) * 0.015;
        pouch.group.rotation.x = -0.04 + Math.sin(elapsed * 0.9) * 0.012;

        // Shadow scales subtly with height
        if (shadowMeshRef.current) {
          const shadowScale = 1.0 - (pouch.group.position.y - targetY) * 0.3;
          shadowMeshRef.current.scale.set(shadowScale, shadowScale, 1);
          shadowMeshRef.current.position.x = pouch.group.position.x;
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // 10. Expose API for GSAP ScrollTrigger
    (window as unknown as {
      cruncha3D?: {
        setPacketTransform: (x: number, y: number, z: number, rx: number, ry: number, rz: number, scale?: number) => void;
        setOpeningProgress: (progress: number) => void;
        setExplosionProgress: (progress: number) => void;
        setFlavour: (flavourId: FlavourId) => void;
        setFinaleVisibility: (visible: boolean) => void;
      }
    }).cruncha3D = {
      setPacketTransform: (x, y, z, rx, ry, rz, scale = 1.0) => {
        if (!pouch.group) return;
        pouch.group.position.set(x, y, z);
        pouch.group.rotation.set(rx, ry, rz);
        pouch.group.scale.set(scale, scale, scale);

        if (shadowMeshRef.current) {
          shadowMeshRef.current.position.x = x;
          shadowMeshRef.current.position.z = z;
          shadowMeshRef.current.visible = y > -2.0;
        }
      },
      setOpeningProgress: (prog) => {
        pouch.updateOpening(prog);
      },
      setExplosionProgress: (prog) => {
        if (explosionRef.current) {
          explosionRef.current.updateExplosion(prog);
        }
      },
      setFlavour: (flavourId) => {
        if (flavourId === 'fire-chilli') {
          pouch.setFlavourTexture(
            '/assets/pouch-front-fire-chilli.png',
            '/assets/pouch-back-fire-chilli.png'
          );
        } else {
          pouch.setFlavourTexture(
            `/assets/pouch-${flavourId}.jpg`,
            '/assets/pouch-back-fire-chilli.png'
          );
        }
        if (explosionRef.current) {
          explosionRef.current.setFlavour(flavourId);
        }
      },
      setFinaleVisibility: () => {
        // Finale visibility handler
      }
    };

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  if (!webGLSupported) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8 bg-[#FFF4DE] text-center">
        <div className="max-w-md p-6 bg-white rounded-2xl shadow-xl border-4 border-[#171717]">
          <span className="text-4xl">🥔</span>
          <h3 className="text-2xl font-black mt-2">CRUNCHA 3D STUDIO</h3>
          <p className="text-sm mt-2 text-stone-600">
            WebGL is running in performance-compatible mode.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-10"
    />
  );
};
