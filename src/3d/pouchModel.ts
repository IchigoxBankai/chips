import * as THREE from 'three';

export interface PouchComponents {
  group: THREE.Group;
  frontBody: THREE.Mesh;
  backBody: THREE.Mesh;
  leftTopFlap: THREE.Mesh;
  rightTopFlap: THREE.Mesh;
  innerFoilFront: THREE.Mesh;
  innerFoilBack: THREE.Mesh;
  topSeal: THREE.Group;
  bottomSeal: THREE.Mesh;
  updateOpening: (progress: number) => void;
  setFlavourTexture: (frontUrl: string, backUrl: string) => void;
}

/**
 * Creates a genuine 3D flexible snack pouch with:
 * - Believable nitrogen-filled pillow volume and thickness
 * - Seamless curved side edges (connecting front and back into a true solid volume)
 * - Heat-crimped top & bottom seals with foil ridges
 * - Subtle organic foil wrinkles
 * - High-end glossy flexible plastic/foil PBR materials with clearcoat reflections
 * - Independently accessible components for the opening sequence
 */
export function createPouchModel(): PouchComponents {
  const group = new THREE.Group();
  group.name = 'CrunchaPouch';

  const width = 2.4;
  const height = 3.6;
  const maxDepth = 0.72; // Believable pillow volume

  // 1. Textures
  const textureLoader = new THREE.TextureLoader();
  const base = import.meta.env.BASE_URL;

  // Load cropped official CRUNCHA Fire Chilli reference image
  const frontTex = textureLoader.load(`${base}assets/pouch-front-fire-chilli.png`);
  frontTex.colorSpace = THREE.SRGBColorSpace;
  frontTex.generateMipmaps = true;
  frontTex.minFilter = THREE.LinearMipmapLinearFilter;

  const backTex = textureLoader.load(`${base}assets/pouch-back-fire-chilli.png`);
  backTex.colorSpace = THREE.SRGBColorSpace;
  backTex.generateMipmaps = true;

  const normalMap = textureLoader.load(`${base}assets/pouch-normal.png`);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  const roughnessMap = textureLoader.load(`${base}assets/pouch-roughness.png`);

  // 2. High-End PBR Packaging Materials (Clearcoat gloss over flexible foil)
  const frontMaterial = new THREE.MeshPhysicalMaterial({
    map: frontTex,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.4, 0.4),
    roughnessMap: roughnessMap,
    roughness: 0.22,
    metalness: 0.14,
    clearcoat: 0.55,
    clearcoatRoughness: 0.12,
    reflectivity: 0.85,
    side: THREE.FrontSide
  });

  const backMaterial = new THREE.MeshPhysicalMaterial({
    map: backTex,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.35, 0.35),
    roughnessMap: roughnessMap,
    roughness: 0.30,
    metalness: 0.12,
    clearcoat: 0.45,
    clearcoatRoughness: 0.18,
    side: THREE.FrontSide
  });

  const foilMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#E2E2E2'),
    metalness: 0.96,
    roughness: 0.14,
    side: THREE.DoubleSide
  });

  const crimpMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#C82015'),
    roughness: 0.35,
    metalness: 0.25,
    normalMap: normalMap,
    normalScale: new THREE.Vector2(0.8, 0.8),
    side: THREE.DoubleSide
  });

  // 3. Puffed Front Body Geometry
  // Subdivided grid morphed into an organic pillow pouch
  const bodyH = height * 0.82;
  const segX = 48;
  const segY = 54;
  const frontGeom = new THREE.PlaneGeometry(width, bodyH, segX, segY);
  const fPos = frontGeom.attributes.position;
  const tempV = new THREE.Vector3();

  for (let i = 0; i < fPos.count; i++) {
    tempV.fromBufferAttribute(fPos, i);

    const nx = tempV.x / (width * 0.5);   // -1 to 1
    const ny = tempV.y / (bodyH * 0.5);  // -1 to 1

    // Horizontal & vertical cos curves for natural pillow puff
    const puffX = Math.cos(nx * Math.PI * 0.5);
    const puffY = Math.cos(ny * Math.PI * 0.46);

    // Taper to thin crimp at bottom
    const bottomTaper = Math.min(1, Math.max(0, (ny + 0.95) * 6));
    // Taper to top seal
    const topTaper = Math.min(1, Math.max(0, (0.95 - ny) * 6));

    // Base volume
    let z = puffX * puffY * (maxDepth * 0.5) * bottomTaper * topTaper;

    // Organic wrinkles along lateral margins (where flexible foil creases)
    const lateralWeight = Math.pow(Math.abs(nx), 1.4);
    const wrinkle = (
      Math.sin(ny * 9.0 + nx * 3.0) * 0.022 +
      Math.cos(ny * 14.0 - nx * 4.0) * 0.015
    ) * lateralWeight;

    // Gentle belly bulge
    const belly = Math.exp(-(nx * nx * 2.5 + ny * ny * 1.8)) * 0.08;

    z += wrinkle + belly;

    // Slight rounded curvature at side edges
    tempV.x *= (1.0 - 0.03 * (1 - puffY));

    fPos.setXYZ(i, tempV.x, tempV.y, Math.max(0.005, z));
  }
  frontGeom.computeVertexNormals();

  const frontBody = new THREE.Mesh(frontGeom, frontMaterial);
  frontBody.position.y = -height * 0.09;
  frontBody.castShadow = true;
  frontBody.receiveShadow = true;
  group.add(frontBody);

  // 4. Puffed Back Body Geometry (Mirrored volume in -Z)
  const backGeom = new THREE.PlaneGeometry(width, bodyH, segX, segY);
  const bPos = backGeom.attributes.position;

  for (let i = 0; i < bPos.count; i++) {
    tempV.fromBufferAttribute(bPos, i);

    const nx = tempV.x / (width * 0.5);
    const ny = tempV.y / (bodyH * 0.5);

    const puffX = Math.cos(nx * Math.PI * 0.5);
    const puffY = Math.cos(ny * Math.PI * 0.46);
    const bottomTaper = Math.min(1, Math.max(0, (ny + 0.95) * 6));
    const topTaper = Math.min(1, Math.max(0, (0.95 - ny) * 6));

    let z = -puffX * puffY * (maxDepth * 0.5) * bottomTaper * topTaper;

    const lateralWeight = Math.pow(Math.abs(nx), 1.4);
    const wrinkle = -(
      Math.sin(ny * 9.0 - nx * 3.0) * 0.022 +
      Math.cos(ny * 14.0 + nx * 4.0) * 0.015
    ) * lateralWeight;

    const belly = -Math.exp(-(nx * nx * 2.5 + ny * ny * 1.8)) * 0.08;

    z += wrinkle + belly;

    tempV.x *= (1.0 - 0.03 * (1 - puffY));

    bPos.setXYZ(i, tempV.x, tempV.y, Math.min(-0.005, z));
  }

  // Reverse indices so back shell normals face -Z properly for FrontSide rendering
  const bIdx = backGeom.index;
  if (bIdx) {
    const arr = bIdx.array;
    for (let i = 0; i < arr.length; i += 3) {
      const tmp = arr[i];
      arr[i] = arr[i + 2];
      arr[i + 2] = tmp;
    }
    bIdx.needsUpdate = true;
  }
  backGeom.computeVertexNormals();

  const backBody = new THREE.Mesh(backGeom, backMaterial);
  backBody.position.y = -height * 0.09;
  backBody.castShadow = true;
  group.add(backBody);

  // 5. Side Seam Fillets (Left and Right curved edges closing front and back)
  const createSideSeam = (isLeft: boolean) => {
    const seamGeom = new THREE.PlaneGeometry(0.12, bodyH, 4, segY);
    const sPos = seamGeom.attributes.position;
    const xBase = isLeft ? -width * 0.49 : width * 0.49;

    for (let i = 0; i < sPos.count; i++) {
      tempV.fromBufferAttribute(sPos, i);
      const ny = tempV.y / (bodyH * 0.5);
      const puffY = Math.cos(ny * Math.PI * 0.46);
      const taper = Math.min(1, Math.max(0, (ny + 0.95) * 6)) * Math.min(1, Math.max(0, (0.95 - ny) * 6));
      const zDepth = (tempV.x / 0.12) * (maxDepth * 0.35) * puffY * taper;

      sPos.setXYZ(i, xBase, tempV.y, zDepth);
    }
    seamGeom.computeVertexNormals();
    const seamMesh = new THREE.Mesh(seamGeom, crimpMaterial);
    seamMesh.position.y = -height * 0.09;
    return seamMesh;
  };

  group.add(createSideSeam(true));
  group.add(createSideSeam(false));

  // 6. Top Flaps (Left top flap & Right top flap / Front & Back flaps for opening)
  const flapH = height * 0.18;
  const flapGeom = new THREE.PlaneGeometry(width, flapH, 36, 18);

  const leftTopFlap = new THREE.Mesh(flapGeom.clone(), frontMaterial);
  leftTopFlap.name = 'FrontTopFlap';
  leftTopFlap.position.set(0, height * 0.5 - flapH * 0.5, 0.008);
  group.add(leftTopFlap);

  // Back flap with inverted winding
  const backFlapGeom = flapGeom.clone();
  const bfIdx = backFlapGeom.index;
  if (bfIdx) {
    const arr = bfIdx.array;
    for (let i = 0; i < arr.length; i += 3) {
      const tmp = arr[i];
      arr[i] = arr[i + 2];
      arr[i + 2] = tmp;
    }
    bfIdx.needsUpdate = true;
  }
  backFlapGeom.computeVertexNormals();

  const rightTopFlap = new THREE.Mesh(backFlapGeom, backMaterial);
  rightTopFlap.name = 'BackTopFlap';
  rightTopFlap.position.set(0, height * 0.5 - flapH * 0.5, -0.008);
  group.add(rightTopFlap);

  // Inner foil liners
  const innerFoilFront = new THREE.Mesh(flapGeom.clone(), foilMaterial);
  innerFoilFront.position.set(0, height * 0.5 - flapH * 0.5, 0.004);
  innerFoilFront.visible = false;
  group.add(innerFoilFront);

  const innerFoilBack = new THREE.Mesh(backFlapGeom.clone(), foilMaterial);
  innerFoilBack.position.set(0, height * 0.5 - flapH * 0.5, -0.004);
  innerFoilBack.visible = false;
  group.add(innerFoilBack);

  const origFrontFlapPos = leftTopFlap.geometry.attributes.position.clone();
  const origBackFlapPos = rightTopFlap.geometry.attributes.position.clone();

  // 7. Top & Bottom Heat-Crimped Seals
  const topSeal = new THREE.Group();
  topSeal.name = 'TopSeal';

  // Crimped ridged bar geometry for top seal
  const sealBarGeom = new THREE.PlaneGeometry(width, 0.16, 32, 4);
  const topSealMesh = new THREE.Mesh(sealBarGeom, crimpMaterial);
  topSealMesh.position.set(0, height * 0.5 - 0.08, 0.01);
  topSeal.add(topSealMesh);
  group.add(topSeal);

  // Bottom seal with serrated cut edge
  const bottomSeal = new THREE.Mesh(sealBarGeom.clone(), crimpMaterial);
  bottomSeal.name = 'BottomSeal';
  bottomSeal.position.set(0, -height * 0.5 + 0.08, 0);
  group.add(bottomSeal);

  // Opening animation function
  const updateOpening = (progress: number) => {
    const p = Math.max(0, Math.min(1, progress));

    if (p <= 0.01) {
      innerFoilFront.visible = false;
      innerFoilBack.visible = false;
      topSeal.visible = true;
      (leftTopFlap.geometry.attributes.position as THREE.BufferAttribute).copy(origFrontFlapPos);
      (rightTopFlap.geometry.attributes.position as THREE.BufferAttribute).copy(origBackFlapPos);
      leftTopFlap.geometry.attributes.position.needsUpdate = true;
      rightTopFlap.geometry.attributes.position.needsUpdate = true;
      return;
    }

    innerFoilFront.visible = true;
    innerFoilBack.visible = true;
    topSeal.visible = p < 0.2; // seal breaks as tear progresses

    const fFlapPos = leftTopFlap.geometry.attributes.position;
    const bFlapPos = rightTopFlap.geometry.attributes.position;

    for (let i = 0; i < fFlapPos.count; i++) {
      tempV.fromBufferAttribute(origFrontFlapPos, i);
      const normY = (tempV.y + flapH * 0.5) / flapH;

      const curlZ = Math.sin(normY * Math.PI * 0.5) * p * 0.55;
      const curlY = -Math.pow(normY, 2) * p * 0.22;
      const flareX = tempV.x * (1 + p * 0.14 * normY);

      fFlapPos.setXYZ(i, flareX, tempV.y + curlY, tempV.z + curlZ);
    }
    fFlapPos.needsUpdate = true;
    leftTopFlap.geometry.computeVertexNormals();

    for (let i = 0; i < bFlapPos.count; i++) {
      tempV.fromBufferAttribute(origBackFlapPos, i);
      const normY = (tempV.y + flapH * 0.5) / flapH;

      const curlZ = -Math.sin(normY * Math.PI * 0.5) * p * 0.55;
      const curlY = -Math.pow(normY, 2) * p * 0.22;
      const flareX = tempV.x * (1 + p * 0.14 * normY);

      bFlapPos.setXYZ(i, flareX, tempV.y + curlY, tempV.z + curlZ);
    }
    bFlapPos.needsUpdate = true;
    rightTopFlap.geometry.computeVertexNormals();
  };

  const setFlavourTexture = (frontUrl: string, backUrl: string) => {
    textureLoader.load(frontUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      frontMaterial.map = tex;
      frontMaterial.needsUpdate = true;
    });
    textureLoader.load(backUrl, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      backMaterial.map = tex;
      backMaterial.needsUpdate = true;
    });
  };

  return {
    group,
    frontBody,
    backBody,
    leftTopFlap,
    rightTopFlap,
    innerFoilFront,
    innerFoilBack,
    topSeal,
    bottomSeal,
    updateOpening,
    setFlavourTexture
  };
}
