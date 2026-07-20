'use client';

import { useGLTF } from '@react-three/drei';
import {
  DEITY_GLB_URL,
  DEITY_POSITION,
  DEITY_SCALE,
  SCENE,
} from './intro-config';

// The deity NEVER moves (WF-MO-01) — no rotation, oscillation, or bobbing
// anywhere in this file. Static meshes only.
//
// Placeholder per docs/07 §3.1.4 (WF-INTRO-03): icosahedron r=1.12
// detail=2 + saffron wireframe hint r=1.24 (the hint signals "placeholder"
// and is not rendered in GLB mode). The real Green Tara GLB swaps in by
// setting DEITY_GLB_URL in intro-config.ts — nothing here changes.
export function Deity() {
  return DEITY_GLB_URL ? <GltfDeity url={DEITY_GLB_URL} /> : <PlaceholderDeity />;
}

function PlaceholderDeity() {
  return (
    <group position={DEITY_POSITION} scale={DEITY_SCALE}>
      <mesh>
        <icosahedronGeometry args={[1.12, 2]} />
        <meshStandardMaterial
          color={SCENE.deityColor}
          metalness={0.85}
          roughness={0.3}
          emissive={SCENE.deityEmissive}
        />
      </mesh>
      {/* wireframe hint — placeholder marker only */}
      <mesh>
        <icosahedronGeometry args={[1.24, 1]} />
        <meshBasicMaterial
          color={SCENE.wireframeColor}
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>
    </group>
  );
}

function GltfDeity({ url }: { url: string }) {
  // Draco decoder is SELF-HOSTED at /public/draco (drei defaults to a
  // Google CDN — a hidden runtime dependency the swap must not rely on).
  // The final GLB is Draco-compressed per spec, so this path is mandatory.
  const { scene } = useGLTF(url, '/draco/');
  // GLB origin convention: bottom-center at (0,0,0) → lift onto the
  // pedestal TOP (y=0.35; cylinder h=0.35 sits on the ground) via
  // scene-side position only (see GLB REQUIREMENTS in config)
  return <primitive object={scene} position={[0, 0.35, 0]} scale={DEITY_SCALE} />;
}
