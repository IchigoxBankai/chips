import * as THREE from 'three';
import type { FlavourId } from '../types/cruncha';
import { generatePacketBackTexture, generatePacketBumpMap, generatePacketTexture } from './textureGenerator';

export interface PacketMeshGroup extends THREE.Group {
  updateOpeningProgress: (progress: number) => void;
  setFlavour: (flavourId: FlavourId) => void;
  currentFlavour: FlavourId;
}

/**
 * Creates a photorealistic 3D puffed snack pouch.
 * - Puffed nitrogen-filled pillow volume with organic creases
 * - Separate front and back PBR materials with zero z-fighting or texture mirroring
 * - Sealed crimped top and bottom with metallic foil textures
 * - Believable tactile opening animation that only reveals inner foil and void when scrubbed
 */
export function createPacketMesh(initialFlavour: FlavourId = 'fire-chilli'): PacketMeshGroup {
  const packetGroup = new THREE.Group() as PacketMeshGroup;
  packetGroup.currentFlavour = initialFlavour;

  const width = 2.5;
  const height = 3.8;
  const depth = 0.85;

  const bumpMap = generatePacketBumpMap();

  // Front PBR Material - Semi-gloss flexible snack packaging
  const frontMaterial = new THREE.MeshStandardMaterial({
    map: generatePacketTexture(initialFlavour),
    bumpMap: bumpMap,
    bumpScale: 0.035,
    roughness: 0.28,
    metalness: 0.15,
    side: THREE.FrontSide
  });

  // Back PBR Material - Semi-gloss rear with nutrition facts & barcode
  const backMaterial = new THREE.MeshStandardMaterial({
    map: generatePacketBackTexture(initialFlavour),
    bumpMap: bumpMap,
    bumpScale: 0.035,
    roughness: 0.35,
    metalness: 0.12,
    side: THREE.FrontSide
  });

  // Foil Material for interior cavity
  const foilMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#D8D8D8'),
    metalness: 0.95,
    roughness: 0.15,
    side: THREE.DoubleSide
  });

  // 1. Puffed Pillow Body (Lower 80% of the bag)
  const bodyH = height * 0.80;
  const segX = 40;
  const segY = 40;

  // Front Puffed Shell
  const frontGeom = new THREE.PlaneGeometry(width, bodyH, segX, segY);
  const fPos = frontGeom.attributes.position;
  const tempV = new THREE.Vector3();

  for (let i = 0; i < fPos.count; i++) {
    tempV.fromBufferAttribute(fPos, i);
    const nx = tempV.x / (width * 0.5);   // -1 to 1
    const ny = tempV.y / (bodyH * 0.5);  // -1 to 1

    // Smooth pillow puff formula: max bulge in center, tapers to zero at bottom crimp and top boundary
    const puffX = Math.cos(nx * Math.PI * 0.5);
    const puffY = Math.cos(ny * Math.PI * 0.48);
    const bottomFlatten = Math.min(1, Math.max(0, (ny + 0.92) * 5)); // Flat at bottom crimp

    tempV.z = puffX * puffY * (depth * 0.5) * bottomFlatten;

    // Organic pouch side creases
    const edgeCrease = Math.sin(ny * 8.0) * (1 - Math.abs(nx)) * 0.02;
    tempV.z += edgeCrease;

    fPos.setXYZ(i, tempV.x, tempV.y, tempV.z);
  }
  frontGeom.computeVertexNormals();

  const frontMesh = new THREE.Mesh(frontGeom, frontMaterial);
  frontMesh.position.y = -height * 0.10;
  frontMesh.castShadow = true;
  frontMesh.receiveShadow = true;
  packetGroup.add(frontMesh);

  // Back Puffed Shell (Mirrored in Z, UVs mapped properly for back text)
  const backGeom = new THREE.PlaneGeometry(width, bodyH, segX, segY);
  const bPos = backGeom.attributes.position;

  for (let i = 0; i < bPos.count; i++) {
    tempV.fromBufferAttribute(bPos, i);
    const nx = tempV.x / (width * 0.5);
    const ny = tempV.y / (bodyH * 0.5);

    const puffX = Math.cos(nx * Math.PI * 0.5);
    const puffY = Math.cos(ny * Math.PI * 0.48);
    const bottomFlatten = Math.min(1, Math.max(0, (ny + 0.92) * 5));

    // Bulge in -Z direction
    tempV.z = -puffX * puffY * (depth * 0.5) * bottomFlatten;
    bPos.setXYZ(i, tempV.x, tempV.y, tempV.z);
  }
  // Invert normals and reverse vertex winding so back faces -Z with FrontSide
  backGeom.computeVertexNormals();
  // Reverse indices so back face is outward-facing towards -Z
  const bIndices = backGeom.index;
  if (bIndices) {
    const arr = bIndices.array;
    for (let i = 0; i < arr.length; i += 3) {
      const tmp = arr[i];
      arr[i] = arr[i + 2];
      arr[i + 2] = tmp;
    }
    bIndices.needsUpdate = true;
  }
  backGeom.computeVertexNormals();

  const backMesh = new THREE.Mesh(backGeom, backMaterial);
  backMesh.position.y = -height * 0.10;
  backMesh.castShadow = true;
  packetGroup.add(backMesh);

  // 2. Top Opening Flaps (Upper 20% of the bag)
  const flapH = height * 0.20;
  const flapGeom = new THREE.PlaneGeometry(width, flapH, 32, 16);

  // Front Flap
  const frontFlapMesh = new THREE.Mesh(flapGeom.clone(), frontMaterial);
  frontFlapMesh.position.set(0, height * 0.5 - flapH * 0.5, 0.005);
  packetGroup.add(frontFlapMesh);

  // Back Flap
  const backFlapGeom = flapGeom.clone();
  const bfIndices = backFlapGeom.index;
  if (bfIndices) {
    const arr = bfIndices.array;
    for (let i = 0; i < arr.length; i += 3) {
      const tmp = arr[i];
      arr[i] = arr[i + 2];
      arr[i + 2] = tmp;
    }
    bfIndices.needsUpdate = true;
  }
  backFlapGeom.computeVertexNormals();
  const backFlapMesh = new THREE.Mesh(backFlapGeom, backMaterial);
  backFlapMesh.position.set(0, height * 0.5 - flapH * 0.5, -0.005);
  packetGroup.add(backFlapMesh);

  // Inner foil lining for front flap
  const innerFrontFlap = new THREE.Mesh(flapGeom.clone(), foilMaterial);
  innerFrontFlap.position.set(0, height * 0.5 - flapH * 0.5, 0.002);
  innerFrontFlap.visible = false;
  packetGroup.add(innerFrontFlap);

  // Original flap vertex positions for tear interpolation
  const origFFlapPos = frontFlapMesh.geometry.attributes.position.clone();
  const origBFlapPos = backFlapMesh.geometry.attributes.position.clone();

  // Internal mouth void (HIDDEN by default until opened!)
  const mouthGeom = new THREE.CylinderGeometry(width * 0.35, width * 0.2, 0.6, 24, 1, true);
  const mouthMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    side: THREE.BackSide,
    roughness: 0.95
  });
  const mouthMesh = new THREE.Mesh(mouthGeom, mouthMat);
  mouthMesh.position.set(0, height * 0.38, 0);
  mouthMesh.scale.set(0.001, 0.001, 0.001); // INVISIBLE when closed!
  mouthMesh.visible = false;
  packetGroup.add(mouthMesh);

  // Method to update opening progress (0 = fully sealed, 1 = flared open)
  packetGroup.updateOpeningProgress = (progress: number) => {
    const p = Math.max(0, Math.min(1, progress));

    if (p <= 0.02) {
      mouthMesh.visible = false;
      innerFrontFlap.visible = false;
      (frontFlapMesh.geometry.attributes.position as THREE.BufferAttribute).copy(origFFlapPos);
      (backFlapMesh.geometry.attributes.position as THREE.BufferAttribute).copy(origBFlapPos);
      frontFlapMesh.geometry.attributes.position.needsUpdate = true;
      backFlapMesh.geometry.attributes.position.needsUpdate = true;
      return;
    }

    mouthMesh.visible = true;
    innerFrontFlap.visible = true;
    mouthMesh.scale.set(p * 1.1, 1, p * 0.7);

    const fFlapPos = frontFlapMesh.geometry.attributes.position;
    const bFlapPos = backFlapMesh.geometry.attributes.position;

    for (let i = 0; i < fFlapPos.count; i++) {
      tempV.fromBufferAttribute(origFFlapPos, i);
      const normY = (tempV.y + flapH * 0.5) / flapH; // 0 at base, 1 at top seal

      // Peeling curve: increases towards top seal
      const curlZ = Math.sin(normY * Math.PI * 0.5) * p * 0.55;
      const curlY = -Math.pow(normY, 2) * p * 0.22;
      const flareX = tempV.x * (1 + p * 0.12 * normY);

      fFlapPos.setXYZ(i, flareX, tempV.y + curlY, tempV.z + curlZ);
    }
    fFlapPos.needsUpdate = true;
    frontFlapMesh.geometry.computeVertexNormals();

    for (let i = 0; i < bFlapPos.count; i++) {
      tempV.fromBufferAttribute(origBFlapPos, i);
      const normY = (tempV.y + flapH * 0.5) / flapH;

      const curlZ = -Math.sin(normY * Math.PI * 0.5) * p * 0.55;
      const curlY = -Math.pow(normY, 2) * p * 0.22;
      const flareX = tempV.x * (1 + p * 0.12 * normY);

      bFlapPos.setXYZ(i, flareX, tempV.y + curlY, tempV.z + curlZ);
    }
    bFlapPos.needsUpdate = true;
    backFlapMesh.geometry.computeVertexNormals();
  };

  const textureLoader = new THREE.TextureLoader();
  const applyPouchTexture = (flavourId: FlavourId) => {
    packetGroup.currentFlavour = flavourId;
    frontMaterial.map = generatePacketTexture(flavourId);
    frontMaterial.needsUpdate = true;
    backMaterial.map = generatePacketBackTexture(flavourId);
    backMaterial.needsUpdate = true;

    textureLoader.load(
      `/assets/pouch-${flavourId}.jpg`,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        frontMaterial.map = tex;
        frontMaterial.needsUpdate = true;
      },
      undefined,
      () => {
        // Fallback already assigned
      }
    );
  };

  applyPouchTexture(initialFlavour);

  // Method to swap flavour texture
  packetGroup.setFlavour = (flavourId: FlavourId) => {
    applyPouchTexture(flavourId);
  };

  return packetGroup;
}
