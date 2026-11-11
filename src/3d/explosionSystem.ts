import * as THREE from 'three';
import type { FlavourId } from '../types/cruncha';
import { createPotatoChipGeometry, getChipTexture } from './chipGeometry';

export interface ChipTrajectory {
  mesh: THREE.Mesh;
  startPos: THREE.Vector3;
  endPos: THREE.Vector3;
  midOffset: THREE.Vector3;
  rotSpeed: THREE.Vector3;
  baseScale: number;
}

export interface ExplosionSystem extends THREE.Group {
  updateExplosion: (progress: number) => void;
  setFlavour: (flavourId: FlavourId) => void;
}

export function createExplosionSystem(initialFlavour: FlavourId = 'fire-chilli'): ExplosionSystem {
  const group = new THREE.Group() as ExplosionSystem;

  const chipGeom = createPotatoChipGeometry(0.85, 1.1, 32, 0.32);
  const chipMat = new THREE.MeshStandardMaterial({
    map: getChipTexture(initialFlavour),
    roughness: 0.35,
    metalness: 0.05,
    side: THREE.DoubleSide
  });

  // Try loading photographic chip texture
  const texLoader = new THREE.TextureLoader();
  texLoader.load(`${import.meta.env.BASE_URL}assets/chip-1.jpg`, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    chipMat.map = tex;
    chipMat.needsUpdate = true;
  });

  const trajectories: ChipTrajectory[] = [];
  const chipCount = 28;

  for (let i = 0; i < chipCount; i++) {
    const mesh = new THREE.Mesh(chipGeom, chipMat);

    // Varied trajectories radiating outward and toward camera
    const angle = (i / chipCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
    const distance = 2.5 + Math.random() * 4.5;
    const upward = 1.8 + Math.random() * 3.5;
    // Some chips fly close to the camera for dramatic cinematic depth
    const isForeground = i % 5 === 0;
    const zForward = isForeground ? 3.5 + Math.random() * 2.5 : 0.5 + Math.random() * 2.0;

    const startPos = new THREE.Vector3(
      (Math.random() - 0.5) * 0.4,
      1.2 + (Math.random() - 0.5) * 0.3,
      (Math.random() - 0.5) * 0.2
    );

    const endPos = new THREE.Vector3(
      Math.cos(angle) * distance,
      startPos.y + upward + Math.sin(angle) * 1.5,
      zForward
    );

    const midOffset = new THREE.Vector3(
      (Math.random() - 0.5) * 1.2,
      upward * 0.6 + Math.random() * 0.8,
      zForward * 0.5
    );

    const rotSpeed = new THREE.Vector3(
      (Math.random() - 0.5) * 8.0,
      (Math.random() - 0.5) * 9.0,
      (Math.random() - 0.5) * 7.0
    );

    const baseScale = isForeground ? 1.1 + Math.random() * 0.4 : 0.65 + Math.random() * 0.45;
    mesh.scale.set(0.001, 0.001, 0.001); // invisible at 0
    mesh.castShadow = true;

    group.add(mesh);

    trajectories.push({
      mesh,
      startPos,
      endPos,
      midOffset,
      rotSpeed,
      baseScale
    });
  }

  // Crumb / Seasoning particle burst
  const particleCount = 180;
  const particleGeom = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleStart = new Float32Array(particleCount * 3);
  const particleVel = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const colGold = new THREE.Color('#E5B138');
  const colRed = new THREE.Color('#C62828');
  const colWhite = new THREE.Color('#FFFFFF');

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    const sx = (Math.random() - 0.5) * 0.3;
    const sy = 1.3 + Math.random() * 0.2;
    const sz = (Math.random() - 0.5) * 0.2;

    particleStart[i3] = sx;
    particleStart[i3 + 1] = sy;
    particleStart[i3 + 2] = sz;

    particlePos[i3] = sx;
    particlePos[i3 + 1] = sy;
    particlePos[i3 + 2] = sz;

    // Ballistic spread velocities
    const theta = Math.random() * Math.PI * 2;
    const rSpeed = 1.5 + Math.random() * 3.5;
    particleVel[i3] = Math.cos(theta) * rSpeed;
    particleVel[i3 + 1] = 2.0 + Math.random() * 4.0;
    particleVel[i3 + 2] = 0.5 + Math.random() * 3.0;

    // Color variety
    const cChoice = Math.random();
    const c = cChoice > 0.6 ? colGold : cChoice > 0.3 ? colRed : colWhite;
    particleColors[i3] = c.r;
    particleColors[i3 + 1] = c.g;
    particleColors[i3 + 2] = c.b;
  }

  particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.07,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.NormalBlending
  });

  const particleMesh = new THREE.Points(particleGeom, particleMat);
  group.add(particleMesh);

  // Update logic scrubbed by scroll progress
  group.updateExplosion = (progress: number) => {
    const p = Math.max(0, Math.min(1, progress));

    trajectories.forEach((item, idx) => {
      if (p <= 0.01) {
        item.mesh.scale.set(0.001, 0.001, 0.001);
        item.mesh.position.copy(item.startPos);
        return;
      }

      // Stagger chips slightly by index
      const delay = (idx % 6) * 0.04;
      const chipP = Math.max(0, Math.min(1, (p - delay) / (1 - delay)));

      // Quadratic bezier trajectory
      const t = chipP;
      const p0 = item.startPos;
      const p1 = new THREE.Vector3().copy(item.startPos).add(item.midOffset);
      const p2 = item.endPos;

      const currentPos = new THREE.Vector3()
        .copy(p0).multiplyScalar((1 - t) * (1 - t))
        .add(p1.clone().multiplyScalar(2 * (1 - t) * t))
        .add(p2.clone().multiplyScalar(t * t));

      item.mesh.position.copy(currentPos);

      // Multi-axis rotation
      item.mesh.rotation.x = item.rotSpeed.x * t;
      item.mesh.rotation.y = item.rotSpeed.y * t;
      item.mesh.rotation.z = item.rotSpeed.z * t;

      // Scale pop-in and fade at end
      const scaleEased = Math.min(1, t * 4) * (1 - Math.max(0, t - 0.85) * 4);
      const finalScale = item.baseScale * scaleEased;
      item.mesh.scale.set(finalScale, finalScale, finalScale);
    });

    // Update seasoning particles
    if (p <= 0.02) {
      particleMat.opacity = 0;
    } else {
      particleMat.opacity = Math.min(1, (p - 0.02) * 4) * (1 - Math.max(0, p - 0.8) * 3);
      const posArr = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posArr[i3] = particleStart[i3] + particleVel[i3] * p * 1.4;
        posArr[i3 + 1] = particleStart[i3 + 1] + particleVel[i3 + 1] * p * 1.2 - 3.5 * p * p; // gravity drop
        posArr[i3 + 2] = particleStart[i3 + 2] + particleVel[i3 + 2] * p * 1.3;
      }
      particleGeom.attributes.position.needsUpdate = true;
    }
  };

  group.setFlavour = (flavourId: FlavourId) => {
    chipMat.map = getChipTexture(flavourId);
    chipMat.needsUpdate = true;
  };

  return group;
}
