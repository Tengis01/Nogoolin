'use client';

import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import {
  ARC,
  LOOK_AT,
  MOBILE_BREAKPOINT,
  MORPH,
  SCENE,
  VIEW_OFFSET_FRACTION,
  smootherstep,
  type IntroTimeline,
} from './intro-config';
import { Deity } from './deity';

// ════════════════════════════════════════════════════════════════
// CAMERA RIG — WF-INTRO-02 + WF-HERO-01/02, WF-MO-03.
//
// The camera position is derived EXCLUSIVELY from the spherical arc
//   (az, r, y) → position.set(r·sin(az), y, r·cos(az))
// and the aim is always lookAt(0, 1.4, 0). There is NO other position
// write in this system — lateral translation is therefore structurally
// impossible. Right-of-frame placement is done in PROJECTION space via
// camera.setViewOffset (negative offsetX → subject appears right), with
// zero angular change and zero parallax. clearViewOffset is never called.
// ════════════════════════════════════════════════════════════════

function arcState(phase: IntroTimeline['phase'], elapsedMs: number) {
  switch (phase) {
    case 'loading': {
      // hold the arc start pose
      return { az: ARC.azimuthFrom, r: ARC.radiusFrom, y: ARC.heightFrom, offsetE: 0 };
    }
    case 'playing': {
      // the single 5s arrival arc — smootherstep on all three params
      const e = smootherstep(elapsedMs / ARC.durationMs);
      return {
        az: ARC.azimuthFrom + (ARC.azimuthTo - ARC.azimuthFrom) * e,
        r: ARC.radiusFrom + (ARC.radiusTo - ARC.radiusFrom) * e,
        y: ARC.heightFrom + (ARC.heightTo - ARC.heightFrom) * e,
        offsetE: 0,
      };
    }
    case 'ready': {
      // camera fully stopped (WF-MO-03) — end-of-arc pose, no offset yet
      return { az: ARC.azimuthTo, r: ARC.radiusTo, y: ARC.heightTo, offsetE: 0 };
    }
    case 'morph': {
      // straight dolly along the view axis (az stays 0 — no angular
      // change); the projection offset ramps with the SAME easing
      const e = smootherstep(elapsedMs / MORPH.durationMs);
      return {
        az: ARC.azimuthTo,
        r: ARC.radiusTo + MORPH.radiusDelta * e,
        y: ARC.heightTo + MORPH.heightDelta * e,
        offsetE: e,
      };
    }
    case 'home': {
      // final pose; offset fully applied (also the instant-path pose:
      // skip / reduced-motion / returning visitor arrive here with e=1)
      return {
        az: ARC.azimuthTo,
        r: ARC.radiusTo + MORPH.radiusDelta,
        y: ARC.heightTo + MORPH.heightDelta,
        offsetE: 1,
      };
    }
  }
}

function CameraRig({ timeline }: { timeline: IntroTimeline }) {
  const { camera, size } = useThree();
  const lookAt = useMemo(() => new THREE.Vector3(...LOOK_AT), []);

  useFrame(() => {
    const elapsed = performance.now() - timeline.phaseStart;
    const { az, r, y, offsetE } = arcState(timeline.phase, elapsed);

    // spherical arc → position. The ONLY camera position write.
    camera.position.set(r * Math.sin(az), y, r * Math.cos(az));
    camera.lookAt(lookAt);

    // WF-HERO-02: asymmetric projection, re-applied every frame with the
    // CURRENT canvas size (covers window resizes for free — never cleared)
    const offFraction =
      window.innerWidth <= MOBILE_BREAKPOINT
        ? VIEW_OFFSET_FRACTION.mobile
        : VIEW_OFFSET_FRACTION.desktop;
    const cam = camera as THREE.PerspectiveCamera;
    cam.setViewOffset(
      size.width,
      size.height,
      -offFraction * size.width * offsetE,
      0,
      size.width,
      size.height,
    );
    cam.updateProjectionMatrix();

    // live readout for the ?debug=camera overlay (Task 2 verification)
    timeline.debug.az = az;
    timeline.debug.radius = r;
    timeline.debug.y = y;
    timeline.debug.offsetE = offsetE;
  });

  return null;
}

// ── Atmosphere: the ONLY things allowed to stay alive (WF-MO-02) ────
function Atmosphere({ timeline }: { timeline: IntroTimeline }) {
  const key = useRef<THREE.PointLight>(null);
  const rim = useRef<THREE.PointLight>(null);
  const halo = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!timeline.motionEnabled) return; // reduced-motion: everything static
    const t = clock.elapsedTime;
    // exact breathing formulas from docs/07 §3.1.4
    if (key.current) key.current.intensity = 1.15 + 0.18 * Math.sin(t * 0.7);
    if (rim.current) rim.current.intensity = 0.85 + 0.12 * Math.sin(t * 0.5 + 1.6);
    if (halo.current) {
      (halo.current.material as THREE.MeshBasicMaterial).opacity =
        0.78 + 0.07 * Math.sin(t * 0.9);
    }
  });

  return (
    <>
      <ambientLight color={SCENE.ambientColor} intensity={0.8} />
      {/* key light on the camera's arrival side */}
      <pointLight ref={key} color={SCENE.keyLightColor} intensity={1.25} position={[6, 7, 5]} />
      <pointLight ref={rim} color={SCENE.rimLightColor} intensity={0.9} position={[-5.5, 3, -4.5]} />
      {/* halo torus behind the deity — breathes in opacity only */}
      <mesh ref={halo} position={[0, 1.5, -0.55]}>
        <torusGeometry args={[2.15, 0.014, 16, 100]} />
        <meshBasicMaterial color={SCENE.haloColor} transparent opacity={0.78} />
      </mesh>
    </>
  );
}

const PARTICLE_COUNT = 360;

function Particles({ timeline }: { timeline: IntroTimeline }) {
  const points = useRef<THREE.Points>(null);
  // cylinder volume r 1.5–7, y 0–6 (docs/07 §3.1.4)
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.5 + Math.random() * 5.5;
      arr[i * 3] = radius * Math.cos(angle);
      arr[i * 3 + 1] = Math.random() * 6;
      arr[i * 3 + 2] = radius * Math.sin(angle);
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!timeline.motionEnabled || !points.current) return;
    const attr = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      let y = attr.getY(i) + 0.0035; // drift per spec; wrap at 6
      if (y > 6) y = 0;
      attr.setY(i, y);
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={SCENE.particleColor}
        size={0.035}
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function SceneContents({ timeline }: { timeline: IntroTimeline }) {
  return (
    <>
      <fog attach="fog" args={[SCENE.bg1, SCENE.fogNear, SCENE.fogFar]} />
      <CameraRig timeline={timeline} />
      <Atmosphere timeline={timeline} />
      <Particles timeline={timeline} />
      <Deity />
      {/* pedestal — sits on the ground, top at y=0.35 */}
      <mesh position={[0, 0.175, 0]}>
        <cylinderGeometry args={[1.45, 1.85, 0.35, 48]} />
        <meshStandardMaterial color={SCENE.pedestalColor} roughness={0.92} />
      </mesh>
      {/* ground disc */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[30, 64]} />
        <meshStandardMaterial color={SCENE.groundColor} />
      </mesh>
    </>
  );
}

// One persistent canvas for the whole page lifetime (WF-HERO-01) — the
// PARENT container resizes 100vh→35vh; this component never remounts.
// Transparent clear: the CSS radial gradient behind it provides the
// #245842→#1B4634 background (flat fills are prohibited — they read as
// pitch black); fog still uses the edge color so depth fades match.
export function IntroScene({ timeline }: { timeline: IntroTimeline }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
      camera={{ fov: 50, near: 0.1, far: 60 }}
      frameloop={timeline.motionEnabled ? 'always' : 'demand'}
      resize={{ scroll: false }}
      className="!absolute !inset-0"
    >
      <SceneContents timeline={timeline} />
    </Canvas>
  );
}
