import * as THREE from 'three';
import { FLAVOUR_MAP } from '../data/flavours';
import type { FlavourId } from '../types/cruncha';

const frontTextureCache: Record<string, THREE.CanvasTexture> = {};
const backTextureCache: Record<string, THREE.CanvasTexture> = {};
const bumpTextureCache: Record<string, THREE.CanvasTexture> = {};

/**
 * Creates an ultra-premium, photorealistic 2048x2048 front packaging texture for CRUNCHA.
 * Features studio-grade typography, foil accents, dynamic badges, and realistic snack brand details.
 */
export function generatePacketTexture(flavourId: FlavourId): THREE.CanvasTexture {
  if (frontTextureCache[flavourId]) {
    return frontTextureCache[flavourId];
  }

  const flavour = FLAVOUR_MAP[flavourId] || FLAVOUR_MAP['fire-chilli'];
  const width = 1024;
  const height = 1536;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. Rich deep radial-linear brand gradient
  const bgGrad = ctx.createRadialGradient(
    width * 0.5, height * 0.45, 80,
    width * 0.5, height * 0.5, width * 0.9
  );
  bgGrad.addColorStop(0, flavour.secondaryColor);
  bgGrad.addColorStop(0.55, flavour.primaryColor);
  bgGrad.addColorStop(1, '#0e0b0b');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle luxury micro-pattern (geometric snack rays)
  ctx.save();
  ctx.translate(width / 2, height * 0.44);
  for (let i = 0; i < 24; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, width * 0.95, (i * Math.PI) / 12, ((i + 0.4) * Math.PI) / 12);
    ctx.lineTo(0, 0);
    ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.04)' : 'rgba(0, 0, 0, 0.06)';
    ctx.fill();
  }
  ctx.restore();

  // 3. Metallic Foil Crimped Top Seal
  const crimpHeight = 110;
  drawMetallicCrimp(ctx, 0, 0, width, crimpHeight, true);

  // 4. Metallic Foil Crimped Bottom Seal
  drawMetallicCrimp(ctx, 0, height - crimpHeight, width, crimpHeight, false);

  // 5. Header Badges
  // Left: 100% Kettle Cooked
  ctx.save();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.roundRect(width * 0.08, crimpHeight + 20, 280, 52, 26);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FFD43B';
  ctx.font = '900 18px "Space Grotesk", sans-serif';
  ctx.fillText('⚡ 100% KETTLE COOKED', width * 0.11, crimpHeight + 52);

  // Right: Net Wt Badge
  ctx.fillStyle = '#FFD43B';
  ctx.beginPath();
  ctx.roundRect(width * 0.68, crimpHeight + 20, 240, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#171717';
  ctx.font = '900 20px "Space Grotesk", sans-serif';
  ctx.fillText(`NET WT. ${flavour.weight}`, width * 0.72, crimpHeight + 52);
  ctx.restore();

  // 6. Primary Brand Wordmark: "CRUNCHA"
  // Crafted with heavy 3D layered drop shadows & gold metallic gradient
  ctx.save();
  ctx.textAlign = 'center';

  const logoY = height * 0.25;

  // Outer bold shadow
  ctx.font = '900 160px "Archivo Black", sans-serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
  ctx.fillText('CRUNCHA', width / 2 + 6, logoY + 12);

  // Black contour outline
  ctx.strokeStyle = '#171717';
  ctx.lineWidth = 24;
  ctx.strokeText('CRUNCHA', width / 2, logoY);

  // Warm gold / cream inner gradient fill
  const wordGrad = ctx.createLinearGradient(0, logoY - 120, 0, logoY);
  wordGrad.addColorStop(0, '#FFFFFF');
  wordGrad.addColorStop(0.3, '#FFF4DE');
  wordGrad.addColorStop(0.7, '#FFD43B');
  wordGrad.addColorStop(1, '#FF8A37');
  ctx.fillStyle = wordGrad;
  ctx.fillText('CRUNCHA', width / 2, logoY);

  // Brand Tagline banner under wordmark
  ctx.fillStyle = '#171717';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 270, logoY + 22, 540, 46, 23);
  ctx.fill();

  ctx.fillStyle = '#FFD43B';
  ctx.font = '900 21px "Space Grotesk", sans-serif';
  ctx.letterSpacing = '3px';
  ctx.fillText('GOOD VIBES. BIG CRUNCH.', width / 2, logoY + 53);
  ctx.restore();

  // 7. Center Flavour Graphic: Delicious Golden Potato Chip with Seasoning
  ctx.save();
  ctx.translate(width / 2, height * 0.53);

  // Ambient gold glow behind chip
  const glow = ctx.createRadialGradient(0, 0, 40, 0, 0, 280);
  glow.addColorStop(0, 'rgba(255, 230, 150, 0.6)');
  glow.addColorStop(0.5, 'rgba(255, 180, 50, 0.2)');
  glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(0, 0, 280, 0, Math.PI * 2);
  ctx.fill();

  // Deep shadow under chip
  ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 24;

  // Curved saddle-shaped potato chip illustration
  const chipGrad = ctx.createLinearGradient(-180, -100, 180, 100);
  chipGrad.addColorStop(0, '#FFE685');  // Bright golden highlight
  chipGrad.addColorStop(0.4, '#F4BE38'); // Golden potato
  chipGrad.addColorStop(0.8, '#D88A1A'); // Toasted kettle edge
  chipGrad.addColorStop(1, '#964E07');   // Crispy roasted crust

  ctx.fillStyle = chipGrad;
  ctx.beginPath();
  ctx.ellipse(0, 0, 220, 140, -Math.PI / 16, 0, Math.PI * 2);
  ctx.fill();

  // Chip surface kettle contour fold
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = 'rgba(180, 90, 10, 0.35)';
  ctx.beginPath();
  ctx.ellipse(-20, 25, 175, 75, -Math.PI / 12, 0, Math.PI * 2);
  ctx.fill();

  // Blisters / roasted golden bubbles
  ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
  for (let b = 0; b < 18; b++) {
    const bx = (Math.random() - 0.5) * 300;
    const by = (Math.random() - 0.5) * 160;
    ctx.beginPath();
    ctx.arc(bx, by, Math.random() * 8 + 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Realistic Seasoning Flecks on Chip
  const spiceColor =
    flavourId === 'fire-chilli' ? '#B71C1C' :
    flavourId === 'sour-cream-onion' ? '#2E7D32' :
    flavourId === 'tangy-masala' ? '#4A148C' :
    flavourId === 'cheese-blast' ? '#E65100' : '#8D6E63';

  ctx.fillStyle = spiceColor;
  for (let s = 0; s < 120; s++) {
    const sx = (Math.random() - 0.5) * 340;
    const sy = (Math.random() - 0.5) * 200;
    ctx.fillRect(sx, sy, Math.random() * 4 + 1.5, Math.random() * 4 + 1.5);
  }

  // Sparkling sea salt crystals
  ctx.fillStyle = '#FFFFFF';
  for (let s = 0; s < 60; s++) {
    const sx = (Math.random() - 0.5) * 340;
    const sy = (Math.random() - 0.5) * 200;
    ctx.fillRect(sx, sy, 2.5, 2.5);
  }
  ctx.restore();

  // 8. Flavour Name Typography
  ctx.save();
  ctx.textAlign = 'center';

  // Flavour title in Archivo Black
  ctx.font = '900 82px "Archivo Black", sans-serif';
  ctx.fillStyle = '#000000';
  ctx.fillText(flavour.name.toUpperCase(), width / 2 + 4, height * 0.74 + 4);

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(flavour.name.toUpperCase(), width / 2, height * 0.74);

  // Subtitle
  ctx.font = '800 24px "Space Grotesk", sans-serif';
  ctx.fillStyle = '#FFD43B';
  ctx.letterSpacing = '1px';
  ctx.fillText(flavour.tagline, width / 2, height * 0.785);

  // Crunch Rating Pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.beginPath();
  ctx.roundRect(width / 2 - 200, height * 0.815, 400, 50, 25);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 212, 59, 0.4)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FFD43B';
  ctx.font = '900 22px "Space Grotesk", sans-serif';
  ctx.fillText(`★ CRUNCH SCORE: ${flavour.crunchFactor} / 10 ★`, width / 2, height * 0.85);
  ctx.restore();

  // 9. Bottom Quality Indicators
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.font = '700 16px "Space Grotesk", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('NON-GMO • GLUTEN-FREE • SMALL BATCH KETTLE FRIED', width / 2, height - crimpHeight - 25);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  frontTextureCache[flavourId] = texture;

  return texture;
}

/**
 * Creates an authentic BACK packaging texture for CRUNCHA.
 * Features full nutrition label, ingredients, barcode, brand manifesto.
 */
export function generatePacketBackTexture(flavourId: FlavourId): THREE.CanvasTexture {
  if (backTextureCache[flavourId]) {
    return backTextureCache[flavourId];
  }

  const flavour = FLAVOUR_MAP[flavourId] || FLAVOUR_MAP['fire-chilli'];
  const width = 1024;
  const height = 1536;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep matte dark background for rear of bag
  ctx.fillStyle = '#1a1616';
  ctx.fillRect(0, 0, width, height);

  const crimpHeight = 110;
  drawMetallicCrimp(ctx, 0, 0, width, crimpHeight, true);
  drawMetallicCrimp(ctx, 0, height - crimpHeight, width, crimpHeight, false);

  // Brand Story Box
  ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
  ctx.beginPath();
  ctx.roundRect(60, crimpHeight + 30, width - 120, 220, 20);
  ctx.fill();

  ctx.fillStyle = '#FFD43B';
  ctx.font = '900 24px "Space Grotesk", sans-serif';
  ctx.fillText('THE CRUNCHA PROMISE', 90, crimpHeight + 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 18px "Inter", sans-serif';
  ctx.fillText('We take whole, farm-grown Russet potatoes, slice them thick,', 90, crimpHeight + 110);
  ctx.fillText('and kettle-cook each batch until the snap is audible from across the room.', 90, crimpHeight + 140);
  ctx.fillText('Pure spices. Good vibes. Real crunch. No shortcuts.', 90, crimpHeight + 170);

  // Nutrition Facts Panel
  const panelX = 60;
  const panelY = crimpHeight + 280;
  const panelW = 420;

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(panelX, panelY, panelW, 560);

  ctx.fillStyle = '#000000';
  ctx.font = '900 40px "Archivo Black", sans-serif';
  ctx.fillText('Nutrition Facts', panelX + 20, panelY + 50);

  ctx.font = '600 16px "Inter", sans-serif';
  ctx.fillText('About 5 servings per bag', panelX + 20, panelY + 80);
  ctx.fillText('Serving size: 1 oz (28g / ~15 chips)', panelX + 20, panelY + 105);

  ctx.fillRect(panelX + 20, panelY + 115, panelW - 40, 10);

  ctx.font = '900 28px "Space Grotesk", sans-serif';
  ctx.fillText('Calories 150', panelX + 20, panelY + 155);

  ctx.fillRect(panelX + 20, panelY + 170, panelW - 40, 4);

  ctx.font = '700 16px "Inter", sans-serif';
  ctx.fillText(`Total Fat ${flavour.nutrition.fat}`, panelX + 20, panelY + 200);
  ctx.fillText(`Sodium ${flavour.nutrition.sodium}`, panelX + 20, panelY + 240);
  ctx.fillText(`Total Carb ${flavour.nutrition.carbs}`, panelX + 20, panelY + 280);
  ctx.fillText(`Protein ${flavour.nutrition.protein}`, panelX + 20, panelY + 320);

  // Barcode
  const barX = width - 360;
  const barY = height - crimpHeight - 200;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(barX, barY, 280, 120);

  ctx.fillStyle = '#000000';
  for (let bx = 15; bx < 265; bx += Math.floor(Math.random() * 8 + 4)) {
    ctx.fillRect(barX + bx, barY + 10, 3, 85);
  }
  ctx.font = '700 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('8 901234 567890', barX + 140, barY + 112);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  backTextureCache[flavourId] = texture;

  return texture;
}

/**
 * Draws metallic crimping ridges with highlights and zig-zag teeth.
 */
function drawMetallicCrimp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  isTop: boolean
) {
  // Foil gradient
  const crimpGrad = ctx.createLinearGradient(0, y, 0, y + h);
  crimpGrad.addColorStop(0, '#A0A0A0');
  crimpGrad.addColorStop(0.3, '#E8E8E8');
  crimpGrad.addColorStop(0.7, '#C0C0C0');
  crimpGrad.addColorStop(1, '#808080');
  ctx.fillStyle = crimpGrad;
  ctx.fillRect(x, y, w, h);

  // Vertical crimp indentation ridges
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  ctx.lineWidth = 3;
  for (let rx = 0; rx < w; rx += 14) {
    ctx.beginPath();
    ctx.moveTo(rx, y);
    ctx.lineTo(rx, y + h);
    ctx.stroke();

    // High specular highlight next to shadow
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.moveTo(rx + 3, y);
    ctx.lineTo(rx + 3, y + h);
    ctx.stroke();
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
  }

  // Horizontal seal clamp line
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  const lineY = isTop ? y + h - 8 : y + 8;
  ctx.fillRect(x, lineY, w, 4);
}

/**
 * Normal/Bump map for pouch wrinkles and crimp indentations.
 */
export function generatePacketBumpMap(): THREE.CanvasTexture {
  if (bumpTextureCache['default']) {
    return bumpTextureCache['default'];
  }

  const width = 512;
  const height = 768;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, width, height);

  // Top/bottom crimp grooves
  const crimpH = 55;
  for (let x = 0; x < width; x += 7) {
    ctx.fillStyle = x % 14 === 0 ? '#404040' : '#C0C0C0';
    ctx.fillRect(x, 0, 3, crimpH);
    ctx.fillRect(x, height - crimpH, 3, crimpH);
  }

  // Organic foil wrinkling
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 4;
  for (let y = crimpH + 50; y < height - crimpH - 50; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(width * 0.35, y - 20, width * 0.65, y + 20, width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  bumpTextureCache['default'] = texture;
  return texture;
}
