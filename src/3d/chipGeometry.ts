import * as THREE from 'three';
import type { FlavourId } from '../types/cruncha';

const chipTextureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * Creates an ultra-realistic, organically curved kettle potato chip geometry.
 * Natural hyperbolic saddle curvature with delicate wavy edges and smooth normals.
 */
export function createPotatoChipGeometry(
  width = 1.1,
  height = 1.35,
  segments = 48,
  curvature = 0.32
): THREE.BufferGeometry {
  const geom = new THREE.PlaneGeometry(width, height, segments, segments);
  const pos = geom.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);

    const nx = v.x / (width * 0.5);   // -1 to 1
    const ny = v.y / (height * 0.5);  // -1 to 1
    const rSq = nx * nx + ny * ny;

    // Smooth kettle saddle curvature (z = k * (x^2 - y^2))
    const saddle = (nx * nx - ny * ny * 0.7) * curvature;

    // Organic wavy ruffle (gentle natural fold)
    const ruffle = Math.sin(ny * 3.5 + nx * 1.5) * 0.045;

    // Slight upturned rim at edges
    const rim = Math.max(0, rSq - 0.5) * 0.08;

    // Delicate micro-warp
    const micro = Math.sin(nx * 8.0) * Math.cos(ny * 9.0) * 0.015;

    v.z = saddle + ruffle + rim + micro;

    // Realistic rounded oval potato slice shape
    const contour = Math.max(0.7, 1 - 0.18 * (ny * ny));
    v.x *= contour;

    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geom.computeVertexNormals();
  return geom;
}

/**
 * Creates a photorealistic, mouth-watering kettle chip canvas texture with:
 * - Golden-yellow baked potato core
 * - Roasted amber-caramelized edges
 * - Crispy surface blister bubbles
 * - Flavour-specific vibrant seasoning granules and salt crystals
 */
export function getChipTexture(flavourId: FlavourId = 'fire-chilli'): THREE.CanvasTexture {
  if (chipTextureCache[flavourId]) {
    return chipTextureCache[flavourId];
  }

  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 1. Golden Potato Base - Multi-stop smooth radial gradient
  const grad = ctx.createRadialGradient(512, 512, 80, 512, 512, 480);
  grad.addColorStop(0, '#FFF2B2');    // Bright golden-cream potato core
  grad.addColorStop(0.45, '#F5C642'); // Rich golden yellow
  grad.addColorStop(0.75, '#E29E25'); // Deep golden roasted
  grad.addColorStop(0.92, '#C47A14'); // Caramelized kettle edge
  grad.addColorStop(1, '#8E4805');    // Crispy roasted crust
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 1024);

  // 2. Potato Cellular Grain & Micro-striations
  ctx.fillStyle = 'rgba(255, 255, 255, 0.16)';
  for (let i = 0; i < 900; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    ctx.beginPath();
    ctx.arc(x, y, Math.random() * 3 + 1, 0, Math.PI * 2);
    ctx.fill();
  }

  // 3. Realistic Fried Oil Sheen & Blisters (Blistered pockets of crispiness)
  for (let i = 0; i < 45; i++) {
    const bx = Math.random() * 800 + 112;
    const by = Math.random() * 800 + 112;
    const r = Math.random() * 16 + 6;

    // Blister shadow
    ctx.fillStyle = 'rgba(120, 60, 5, 0.3)';
    ctx.beginPath();
    ctx.arc(bx + 2, by + 2, r, 0, Math.PI * 2);
    ctx.fill();

    // Blister golden highlight
    ctx.fillStyle = 'rgba(255, 255, 220, 0.55)';
    ctx.beginPath();
    ctx.arc(bx - 1, by - 1, r * 0.8, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Flavour Seasoning Dust & Herbs
  if (flavourId === 'fire-chilli') {
    // Red habanero & fiery smoked paprika flakes
    ctx.fillStyle = '#C62828';
    for (let i = 0; i < 400; i++) {
      const sx = Math.random() * 960 + 32;
      const sy = Math.random() * 960 + 32;
      ctx.fillRect(sx, sy, Math.random() * 4 + 1.5, Math.random() * 4 + 1.5);
    }
    // Chili powder dust
    ctx.fillStyle = 'rgba(230, 81, 0, 0.45)';
    for (let i = 0; i < 300; i++) {
      const sx = Math.random() * 960 + 32;
      const sy = Math.random() * 960 + 32;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (flavourId === 'sour-cream-onion') {
    // Cut garden scallions & chive flakes
    ctx.fillStyle = '#2E7D32';
    for (let i = 0; i < 380; i++) {
      const sx = Math.random() * 960 + 32;
      const sy = Math.random() * 960 + 32;
      ctx.fillRect(sx, sy, Math.random() * 4 + 2, Math.random() * 3 + 1.5);
    }
    // Creamy white dusting
    ctx.fillStyle = 'rgba(255, 255, 240, 0.6)';
    for (let i = 0; i < 250; i++) {
      const sx = Math.random() * 960 + 32;
      const sy = Math.random() * 960 + 32;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (flavourId === 'tangy-masala') {
    // Crushed coriander, amchur & black peppercorns
    ctx.fillStyle = '#4A148C';
    for (let i = 0; i < 300; i++) {
      const sx = Math.random() * 960 + 32;
      const sy = Math.random() * 960 + 32;
      ctx.fillRect(sx, sy, Math.random() * 3.5 + 1.5, Math.random() * 3.5 + 1.5);
    }
    // Golden cumin dust
    ctx.fillStyle = 'rgba(216, 140, 30, 0.6)';
    for (let i = 0; i < 300; i++) {
      const sx = Math.random() * 960 + 32;
      const sy = Math.random() * 960 + 32;
      ctx.beginPath();
      ctx.arc(sx, sy, Math.random() * 3 + 1, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (flavourId === 'cheese-blast') {
    // Golden melted cheddar dust
    ctx.fillStyle = '#FF8F00';
    for (let i = 0; i < 500; i++) {
      const sx = Math.random() * 960 + 32;
      const sy = Math.random() * 960 + 32;
      ctx.fillRect(sx, sy, Math.random() * 3 + 1.5, Math.random() * 3 + 1.5);
    }
  }

  // 5. Glistening Pure Sea Salt Crystals (sparkling geometric specks)
  ctx.fillStyle = '#FFFFFF';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 4;
  for (let s = 0; s < 250; s++) {
    const sx = Math.random() * 960 + 32;
    const sy = Math.random() * 960 + 32;
    ctx.fillRect(sx, sy, 2.5, 2.5);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  chipTextureCache[flavourId] = texture;

  return texture;
}
