'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   SHARED STATE  (GSAP writes every frame, useFrame reads)
═══════════════════════════════════════════════════════════════ */
const SV = {
  camX: 0,    camY: 0.15,  camZ: 8.5,
  monRotX: 0, monRotY: 0,  monScale: 1.22,
  monX: 0,    monY: 0.05,
  buildProgress: 0,   // 0→1: UI assembly animation
  explodeProgress: 0, // 0→1: explosion WOW
};

const M = { x: 0, y: 0, tx: 0, ty: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', e => {
    M.tx = (e.clientX / window.innerWidth)  * 2 - 1;
    M.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   MONITOR HARDWARE
═══════════════════════════════════════════════════════════════ */
function MonitorFallback() {
  return (
    <>
      <mesh>
        <boxGeometry args={[3.76, 2.58, 0.11]} />
        <meshStandardMaterial color="#07090f" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.38, -0.02]}>
        <boxGeometry args={[0.09, 0.52, 0.09]} />
        <meshStandardMaterial color="#06080e" metalness={0.88} roughness={0.12} />
      </mesh>
      <mesh position={[0, -1.62, -0.12]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[0.09, 0.24, 0.09]} />
        <meshStandardMaterial color="#06080e" metalness={0.88} roughness={0.12} />
      </mesh>
      <mesh position={[0, -1.79, -0.3]}>
        <boxGeometry args={[1.55, 0.055, 0.72]} />
        <meshStandardMaterial color="#05070c" metalness={0.9} roughness={0.1} />
      </mesh>
    </>
  );
}

function MonitorGLTF() {
  const { scene } = useGLTF('/models/monitor.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        (obj as THREE.Mesh).material = new THREE.MeshStandardMaterial({
          color: '#07090f', metalness: 0.88, roughness: 0.12,
        });
      }
    });
    return c;
  }, [scene]);
  return <primitive object={cloned} scale={1.0} />;
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 0 + 1 (HERO + BUILD ANIMATION)
   Groups snap in sequentially based on SV.buildProgress
═══════════════════════════════════════════════════════════════ */
function ScreenHero({ building }: { building: boolean }) {
  const gNav    = useRef<THREE.Group>(null!);
  const gBadge  = useRef<THREE.Group>(null!);
  const gH1     = useRef<THREE.Group>(null!);
  const gSub    = useRef<THREE.Group>(null!);
  const gCta    = useRef<THREE.Group>(null!);
  const gCard   = useRef<THREE.Group>(null!);
  const gStats  = useRef<THREE.Group>(null!);
  const gBottom = useRef<THREE.Group>(null!);

  const cursorMat  = useRef<THREE.MeshBasicMaterial>(null!);
  const liveDotMat = useRef<THREE.MeshStandardMaterial>(null!);
  const lineRef    = useRef<THREE.Mesh>(null!);
  const barRefs    = [
    useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!),
  ];
  const BAR_H    = [0.22, 0.32, 0.18, 0.38, 0.28];
  const BAR_FREQ = [1.1, 0.85, 1.35, 0.7, 1.0];

  const snap = (grp: React.MutableRefObject<THREE.Group>, vis: number) => {
    if (!grp.current) return;
    const t = vis > 0.01 ? 1 : 0;
    grp.current.scale.setScalar(grp.current.scale.x + (t - grp.current.scale.x) * 0.18);
  };

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime;
    const bp = building ? SV.buildProgress : 1;
    const v  = (from: number, to: number) =>
      Math.max(0, Math.min(1, (bp - from) / Math.max(to - from, 0.001)));

    snap(gNav,    v(0.03, 0.14));
    snap(gBadge,  v(0.22, 0.34));
    snap(gH1,     v(0.40, 0.54));
    snap(gSub,    v(0.55, 0.68));
    snap(gCta,    v(0.68, 0.80));
    snap(gCard,   v(0.80, 0.92));
    snap(gStats,  v(0.90, 1.00));
    snap(gBottom, v(0.95, 1.00));

    if (cursorMat.current) cursorMat.current.opacity = Math.sin(t * 3.5) > 0 ? 0.9 : 0;
    if (liveDotMat.current) liveDotMat.current.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.8;
    if (lineRef.current) lineRef.current.scale.x = 0.85 + Math.sin(t * 0.6) * 0.12;
    barRefs.forEach((r, i) => {
      if (!r.current) return;
      const h = BAR_H[i] + Math.sin(t * BAR_FREQ[i] + i * 0.8) * 0.08;
      r.current.scale.y = h / BAR_H[i];
      r.current.position.y = -0.62 + h / 2;
    });
  });

  const Z = 0.083;
  return (
    <>
      {/* NAV */}
      <group ref={gNav}>
        <mesh position={[0, 0.99, Z]}>
          <boxGeometry args={[3.38, 0.19, 0.001]} />
          <meshBasicMaterial color="#040b16" />
        </mesh>
        <mesh position={[-1.42, 0.99, Z + 0.004]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={2.5} />
        </mesh>
        <mesh position={[-1.24, 0.99, Z + 0.002]}>
          <boxGeometry args={[0.22, 0.055, 0.001]} />
          <meshBasicMaterial color="#c8d8f0" />
        </mesh>
        {[-0.28, 0.15, 0.56, 0.95].map((x, i) => (
          <mesh key={i} position={[x, 0.99, Z + 0.002]}>
            <boxGeometry args={[0.18, 0.042, 0.001]} />
            <meshBasicMaterial color="#182d48" />
          </mesh>
        ))}
        <mesh position={[1.46, 0.99, Z + 0.002]}>
          <boxGeometry args={[0.28, 0.1, 0.001]} />
          <meshBasicMaterial color="#1d4ed8" />
        </mesh>
      </group>

      {/* BADGE */}
      <group ref={gBadge}>
        <mesh position={[-1.08, 0.77, Z]}>
          <boxGeometry args={[0.54, 0.09, 0.001]} />
          <meshBasicMaterial color="#0f2a5c" />
        </mesh>
        <mesh position={[-1.08, 0.77, Z + 0.001]}>
          <boxGeometry args={[0.52, 0.07, 0.001]} />
          <meshBasicMaterial color="#1a3c9a" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* HEADLINE */}
      <group ref={gH1}>
        <mesh position={[-0.79, 0.62, Z]}>
          <boxGeometry args={[1.02, 0.13, 0.001]} />
          <meshBasicMaterial color="#d0e4ff" />
        </mesh>
        <mesh position={[-0.68, 0.46, Z]}>
          <boxGeometry args={[1.24, 0.13, 0.001]} />
          <meshBasicMaterial color="#3b82f6" />
        </mesh>
        <mesh position={[0.19, 0.46, Z + 0.001]}>
          <boxGeometry args={[0.018, 0.12, 0.001]} />
          <meshBasicMaterial ref={cursorMat} color="#60a5fa" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* SUB TEXT */}
      <group ref={gSub}>
        {[[1.6, 0.31], [1.35, 0.21], [0.95, 0.12]].map(([w, y], i) => (
          <mesh key={i} position={[-1.69 + (w as number) / 2, y, Z]}>
            <boxGeometry args={[(w as number), 0.046, 0.001]} />
            <meshBasicMaterial color="#0e2040" />
          </mesh>
        ))}
      </group>

      {/* CTA BUTTONS */}
      <group ref={gCta}>
        <mesh position={[-1.04, -0.05, Z]}>
          <boxGeometry args={[0.64, 0.17, 0.001]} />
          <meshBasicMaterial color="#1d4ed8" />
        </mesh>
        <mesh position={[-0.32, -0.05, Z]}>
          <boxGeometry args={[0.52, 0.17, 0.001]} />
          <meshBasicMaterial color="#0a1528" />
        </mesh>
        <mesh position={[-0.32, -0.05, Z + 0.001]}>
          <boxGeometry args={[0.52, 0.17, 0.001]} />
          <meshBasicMaterial color="#1a3060" transparent opacity={0.4} />
        </mesh>
      </group>

      {/* DASHBOARD CARD */}
      <group ref={gCard}>
        <mesh position={[0.92, 0.42, Z]}>
          <boxGeometry args={[1.32, 0.98, 0.006]} />
          <meshStandardMaterial color="#040c1c" metalness={0.1} roughness={0.9} />
        </mesh>
        <mesh position={[0.92, 0.9, Z + 0.005]}>
          <boxGeometry args={[1.32, 0.09, 0.001]} />
          <meshBasicMaterial color="#060f20" />
        </mesh>
        <mesh position={[0.34, 0.9, Z + 0.008]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial ref={liveDotMat} color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
        </mesh>
        <mesh position={[0.76, 0.9, Z + 0.007]}>
          <boxGeometry args={[0.55, 0.042, 0.001]} />
          <meshBasicMaterial color="#1a2d44" />
        </mesh>
        <mesh position={[0.56, 0.7, Z + 0.005]}>
          <boxGeometry args={[0.36, 0.14, 0.001]} />
          <meshBasicMaterial color="#e0eeff" />
        </mesh>
        <mesh position={[0.65, 0.56, Z + 0.005]}>
          <boxGeometry args={[0.55, 0.044, 0.001]} />
          <meshBasicMaterial color="#0e2040" />
        </mesh>
        <mesh position={[1.1, 0.70, Z + 0.005]}>
          <boxGeometry args={[0.22, 0.08, 0.001]} />
          <meshBasicMaterial color="#15803d" />
        </mesh>
        <mesh ref={lineRef} position={[0.92, 0.45, Z + 0.005]}>
          <boxGeometry args={[1.1, 0.028, 0.001]} />
          <meshBasicMaterial color="#2563eb" transparent opacity={0.4} />
        </mesh>
        <mesh position={[0.92, -0.06, Z + 0.004]}>
          <boxGeometry args={[1.28, 0.54, 0.001]} />
          <meshBasicMaterial color="#020810" transparent opacity={0.7} />
        </mesh>
        {([
          [0.38, '#3b82f6'], [0.55, '#3b82f6'], [0.72, '#60a5fa'],
          [0.89, '#2563eb'], [1.06, '#60a5fa'],
        ] as const).map(([x, c], i) => (
          <mesh key={i} ref={barRefs[i]} position={[x, -0.62 + BAR_H[i] / 2, Z + 0.005]}>
            <boxGeometry args={[0.1, BAR_H[i], 0.001]} />
            <meshBasicMaterial color={c} transparent opacity={0.8} />
          </mesh>
        ))}
        <mesh position={[0.92, -0.62, Z + 0.005]}>
          <boxGeometry args={[1.28, 0.006, 0.001]} />
          <meshBasicMaterial color="#0e2040" />
        </mesh>
      </group>

      {/* STATS BAND */}
      <group ref={gStats}>
        <mesh position={[0, -0.35, Z - 0.001]}>
          <boxGeometry args={[3.38, 0.27, 0.001]} />
          <meshBasicMaterial color="#030911" />
        </mesh>
        {([[-1.2, '#3b82f6'], [-0.4, '#a78bfa'], [0.4, '#34d399'], [1.2, '#f59e0b']] as const).map(([x, c]) => (
          <group key={x}>
            <mesh position={[x, -0.3, Z + 0.002]}>
              <boxGeometry args={[0.28, 0.12, 0.001]} />
              <meshBasicMaterial color={c} transparent opacity={0.9} />
            </mesh>
            <mesh position={[x, -0.43, Z + 0.002]}>
              <boxGeometry args={[0.32, 0.042, 0.001]} />
              <meshBasicMaterial color="#0b1a2e" />
            </mesh>
          </group>
        ))}
      </group>

      {/* BOTTOM CARDS */}
      <group ref={gBottom}>
        {([-1.1, -0.04, 1.04] as const).map((x, i) => (
          <group key={i} position={[x, -0.76, Z]}>
            <mesh>
              <boxGeometry args={[0.96, 0.42, 0.004]} />
              <meshBasicMaterial color={['#06111e', '#090820', '#041410'][i]} />
            </mesh>
            <mesh position={[0, 0.2, 0.003]}>
              <boxGeometry args={[0.96, 0.026, 0.001]} />
              <meshBasicMaterial color={['#2563eb', '#7c3aed', '#059669'][i]} />
            </mesh>
            {[0.06, -0.06, -0.15].map((dy, j) => (
              <mesh key={j} position={[0, dy, 0.003]}>
                <boxGeometry args={[(0.7 - j * 0.08), 0.038, 0.001]} />
                <meshBasicMaterial color={['#0e2040', '#12103a', '#061a12'][i]} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 2 (LANDING PAGE CONCEPT)
   Premium hero + 3 feature cards + trust bar
═══════════════════════════════════════════════════════════════ */
function ScreenLanding() {
  const Z = 0.083;
  return (
    <>
      {/* NAV — dark, minimal */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#030810" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2.2} />
      </mesh>
      <mesh position={[-1.24, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.22, 0.052, 0.001]} />
        <meshBasicMaterial color="#c0d4f0" />
      </mesh>
      {[0.6, 1.1, 1.52].map((x, i) => (
        <mesh key={i} position={[x, 0.99, Z + 0.002]}>
          <boxGeometry args={[0.2, 0.038, 0.001]} />
          <meshBasicMaterial color="#1a2d48" />
        </mesh>
      ))}
      <mesh position={[1.5, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.26, 0.1, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>

      {/* HERO gradient bg */}
      <mesh position={[0, 0.37, Z - 0.003]}>
        <boxGeometry args={[3.38, 1.18, 0.001]} />
        <meshBasicMaterial color="#030a1a" />
      </mesh>
      {/* Subtle hero glow */}
      <mesh position={[0, 0.55, Z - 0.002]}>
        <boxGeometry args={[2.4, 0.6, 0.001]} />
        <meshBasicMaterial color="#0a1e50" transparent opacity={0.35} />
      </mesh>

      {/* BIG HEADLINE — centered */}
      <mesh position={[0, 0.74, Z]}>
        <boxGeometry args={[2.2, 0.16, 0.001]} />
        <meshBasicMaterial color="#e0eeff" />
      </mesh>
      <mesh position={[0, 0.55, Z]}>
        <boxGeometry args={[1.65, 0.16, 0.001]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>

      {/* Sub text */}
      <mesh position={[0, 0.36, Z]}>
        <boxGeometry args={[1.8, 0.05, 0.001]} />
        <meshBasicMaterial color="#2a3e5a" />
      </mesh>
      <mesh position={[0, 0.28, Z]}>
        <boxGeometry args={[1.4, 0.05, 0.001]} />
        <meshBasicMaterial color="#1e3050" />
      </mesh>

      {/* CTAs — centered */}
      <mesh position={[-0.4, 0.1, Z]}>
        <boxGeometry args={[0.65, 0.17, 0.001]} />
        <meshBasicMaterial color="#1d4ed8" />
      </mesh>
      <mesh position={[0.35, 0.1, Z]}>
        <boxGeometry args={[0.52, 0.17, 0.001]} />
        <meshBasicMaterial color="#0d1e38" />
      </mesh>
      <mesh position={[0.35, 0.1, Z + 0.001]}>
        <boxGeometry args={[0.50, 0.15, 0.001]} />
        <meshBasicMaterial color="#1a3060" transparent opacity={0.4} />
      </mesh>

      {/* Divider */}
      <mesh position={[0, -0.1, Z]}>
        <boxGeometry args={[3.2, 0.003, 0.001]} />
        <meshBasicMaterial color="#0c1e34" />
      </mesh>

      {/* FEATURE CARDS — 3 columns */}
      {([-1.05, 0, 1.05] as const).map((x, i) => (
        <group key={i} position={[x, -0.6, Z]}>
          <mesh>
            <boxGeometry args={[0.95, 0.75, 0.006]} />
            <meshStandardMaterial color="#040c1e" metalness={0.1} roughness={0.9} />
          </mesh>
          {/* Top accent */}
          <mesh position={[0, 0.37, 0.004]}>
            <boxGeometry args={[0.95, 0.006, 0.001]} />
            <meshBasicMaterial color={['#2563eb', '#7c3aed', '#059669'][i]} />
          </mesh>
          {/* Icon circle */}
          <mesh position={[-0.32, 0.2, 0.005]}>
            <circleGeometry args={[0.055, 12]} />
            <meshBasicMaterial color={['#0f2a5c', '#2a1060', '#063028'][i]} />
          </mesh>
          <mesh position={[-0.32, 0.2, 0.006]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial
              color={['#3b82f6', '#8b5cf6', '#10b981'][i]}
              emissive={['#3b82f6', '#8b5cf6', '#10b981'][i]}
              emissiveIntensity={1.8}
            />
          </mesh>
          {/* Title line */}
          <mesh position={[0, 0.05, 0.004]}>
            <boxGeometry args={[0.7, 0.065, 0.001]} />
            <meshBasicMaterial color="#c0d8f0" />
          </mesh>
          {/* Body lines */}
          <mesh position={[0, -0.1, 0.004]}>
            <boxGeometry args={[0.75, 0.04, 0.001]} />
            <meshBasicMaterial color="#1a2d44" />
          </mesh>
          <mesh position={[-0.07, -0.18, 0.004]}>
            <boxGeometry args={[0.62, 0.04, 0.001]} />
            <meshBasicMaterial color="#142236" />
          </mesh>
        </group>
      ))}

      {/* TRUST BAR — bottom */}
      <mesh position={[0, -1.0, Z]}>
        <boxGeometry args={[3.38, 0.08, 0.001]} />
        <meshBasicMaterial color="#020710" />
      </mesh>
      {([-1.1, -0.38, 0.34, 1.06] as const).map((x, i) => (
        <mesh key={i} position={[x, -1.0, Z + 0.002]}>
          <boxGeometry args={[0.38, 0.03, 0.001]} />
          <meshBasicMaterial color="#0e1e34" />
        </mesh>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 3 (CORPORATE WEBSITE)
   Sidebar nav + multi-column content + news cards
═══════════════════════════════════════════════════════════════ */
function ScreenCorporate() {
  const Z = 0.083;
  return (
    <>
      {/* NAV — slightly lighter, more links */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#050d1e" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[-1.24, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.22, 0.052, 0.001]} />
        <meshBasicMaterial color="#bdd0f0" />
      </mesh>
      {[-0.5, -0.1, 0.3, 0.68, 1.06, 1.44].map((x, i) => (
        <mesh key={i} position={[x, 0.99, Z + 0.002]}>
          <boxGeometry args={[0.22, 0.038, 0.001]} />
          <meshBasicMaterial color="#162540" />
        </mesh>
      ))}

      {/* LEFT SIDEBAR */}
      <mesh position={[-1.38, 0.05, Z]}>
        <boxGeometry args={[0.68, 1.78, 0.005]} />
        <meshStandardMaterial color="#030a18" metalness={0.08} roughness={0.92} />
      </mesh>
      {/* Sidebar top accent */}
      <mesh position={[-1.38, 0.93, Z + 0.003]}>
        <boxGeometry args={[0.68, 0.004, 0.001]} />
        <meshBasicMaterial color="#4a1090" transparent opacity={0.6} />
      </mesh>
      {/* Sidebar nav items */}
      {[0.82, 0.68, 0.54, 0.40, 0.26, 0.12, -0.02, -0.16].map((y, i) => (
        <mesh key={i} position={[-1.38, y, Z + 0.003]}>
          <boxGeometry args={[i === 1 ? 0.52 : 0.44, 0.042, 0.001]} />
          <meshBasicMaterial color={i === 1 ? '#2a1060' : '#0d1e36'} />
        </mesh>
      ))}
      {/* Active indicator */}
      <mesh position={[-1.7, 0.68, Z + 0.003]}>
        <boxGeometry args={[0.006, 0.042, 0.001]} />
        <meshBasicMaterial color="#7c3aed" />
      </mesh>
      {/* Sidebar CTA */}
      <mesh position={[-1.38, -0.55, Z + 0.003]}>
        <boxGeometry args={[0.48, 0.13, 0.001]} />
        <meshBasicMaterial color="#4a1090" />
      </mesh>

      {/* MAIN CONTENT area */}
      {/* Section heading */}
      <mesh position={[0.35, 0.82, Z]}>
        <boxGeometry args={[1.85, 0.12, 0.001]} />
        <meshBasicMaterial color="#c0d8f0" />
      </mesh>
      <mesh position={[0.2, 0.66, Z]}>
        <boxGeometry args={[1.55, 0.12, 0.001]} />
        <meshBasicMaterial color="#8bbcf0" />
      </mesh>
      {/* Body text */}
      {[0.5, 0.4, 0.3].map((y, i) => (
        <mesh key={i} position={[0.2, y, Z]}>
          <boxGeometry args={[(1.7 - i * 0.15), 0.04, 0.001]} />
          <meshBasicMaterial color="#122040" />
        </mesh>
      ))}
      {/* Divider */}
      <mesh position={[0.35, 0.14, Z]}>
        <boxGeometry args={[1.85, 0.003, 0.001]} />
        <meshBasicMaterial color="#0c1e34" />
      </mesh>

      {/* NEWS/BLOG CARDS — 3 cols */}
      {([-0.57, 0.35, 1.27] as const).map((x, i) => (
        <group key={i} position={[x, -0.38, Z]}>
          <mesh>
            <boxGeometry args={[0.82, 0.78, 0.005]} />
            <meshStandardMaterial color="#040a18" metalness={0.1} roughness={0.9} />
          </mesh>
          {/* Image placeholder */}
          <mesh position={[0, 0.25, 0.003]}>
            <boxGeometry args={[0.82, 0.32, 0.001]} />
            <meshBasicMaterial color={['#060e28', '#08061e', '#04120c'][i]} />
          </mesh>
          {/* Image accent gradient */}
          <mesh position={[0, 0.25, 0.004]}>
            <boxGeometry args={[0.82, 0.32, 0.001]} />
            <meshBasicMaterial
              color={['#1a3c9a', '#3a1078', '#0d4f3c'][i]}
              transparent opacity={0.3}
            />
          </mesh>
          {/* Category pill */}
          <mesh position={[-0.24, 0.05, 0.004]}>
            <boxGeometry args={[0.28, 0.065, 0.001]} />
            <meshBasicMaterial color={['#0f2a5c', '#200860', '#063028'][i]} />
          </mesh>
          {/* Title */}
          <mesh position={[0, -0.09, 0.004]}>
            <boxGeometry args={[0.65, 0.055, 0.001]} />
            <meshBasicMaterial color="#a0c0e0" />
          </mesh>
          <mesh position={[-0.05, -0.18, 0.004]}>
            <boxGeometry args={[0.55, 0.055, 0.001]} />
            <meshBasicMaterial color="#708090" />
          </mesh>
          {/* Date line */}
          <mesh position={[-0.15, -0.3, 0.004]}>
            <boxGeometry args={[0.35, 0.03, 0.001]} />
            <meshBasicMaterial color="#0e1e34" />
          </mesh>
        </group>
      ))}

      {/* FOOTER STRIP */}
      <mesh position={[0, -0.98, Z]}>
        <boxGeometry args={[3.38, 0.1, 0.001]} />
        <meshBasicMaterial color="#020710" />
      </mesh>
      {([-1.1, -0.28, 0.54, 1.36] as const).map((x, i) => (
        <mesh key={i} position={[x, -0.98, Z + 0.002]}>
          <boxGeometry args={[0.42, 0.032, 0.001]} />
          <meshBasicMaterial color="#0e1e34" />
        </mesh>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 4 (E-COMMERCE)
   Header + filter sidebar + 2×3 product grid
═══════════════════════════════════════════════════════════════ */
function ScreenEcommerce() {
  const Z = 0.083;
  const PROD_COLORS = [
    '#061420', '#08101e', '#060c18',
    '#04100c', '#080618', '#060e10',
  ] as const;
  const ACCENT = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#3b82f6','#8b5cf6'] as const;

  return (
    <>
      {/* HEADER */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#030a12" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2.0} />
      </mesh>
      <mesh position={[-1.24, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.22, 0.052, 0.001]} />
        <meshBasicMaterial color="#b0d0e0" />
      </mesh>
      {/* Search bar */}
      <mesh position={[0.2, 0.99, Z + 0.002]}>
        <boxGeometry args={[1.3, 0.09, 0.001]} />
        <meshBasicMaterial color="#070e1a" />
      </mesh>
      <mesh position={[0.2, 0.99, Z + 0.003]}>
        <boxGeometry args={[1.28, 0.07, 0.001]} />
        <meshBasicMaterial color="#0c1828" />
      </mesh>
      {/* Cart badge */}
      <mesh position={[1.32, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.22, 0.1, 0.001]} />
        <meshBasicMaterial color="#0d4f3c" />
      </mesh>
      <mesh position={[1.44, 1.03, Z + 0.004]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2.5} />
      </mesh>

      {/* FILTER SIDEBAR */}
      <mesh position={[-1.38, 0.0, Z]}>
        <boxGeometry args={[0.68, 1.78, 0.005]} />
        <meshStandardMaterial color="#030b0e" metalness={0.08} roughness={0.92} />
      </mesh>
      {/* Filter section labels */}
      {[0.82, 0.6, 0.2, -0.05, -0.42, -0.65].map((y, i) => (
        <mesh key={i} position={[-1.38, y, Z + 0.003]}>
          <boxGeometry args={[i % 3 === 0 ? 0.5 : 0.38, i % 3 === 0 ? 0.048 : 0.038, 0.001]} />
          <meshBasicMaterial color={i % 3 === 0 ? '#0d2035' : '#081520'} />
        </mesh>
      ))}
      {/* Filter checkboxes */}
      {[0.48, 0.36, -0.18, -0.3, -0.55].map((y, i) => (
        <group key={i} position={[-1.38, y, Z + 0.003]}>
          <mesh position={[-0.27, 0, 0]}>
            <boxGeometry args={[0.04, 0.04, 0.001]} />
            <meshBasicMaterial color={i < 2 ? '#0f4d3c' : '#0a1525'} />
          </mesh>
          <mesh position={[0.04, 0, 0]}>
            <boxGeometry args={[0.32, 0.03, 0.001]} />
            <meshBasicMaterial color="#0a1828" />
          </mesh>
        </group>
      ))}

      {/* PRODUCT GRID — 2 rows × 3 columns */}
      {[0, 1, 2, 3, 4, 5].map(i => {
        const col = i % 3;
        const row = Math.floor(i / 3);
        const x = -0.48 + col * 0.83;
        const y = 0.42 - row * 0.82;
        return (
          <group key={i} position={[x, y, Z]}>
            <mesh>
              <boxGeometry args={[0.78, 0.76, 0.005]} />
              <meshStandardMaterial color={PROD_COLORS[i]} metalness={0.1} roughness={0.9} />
            </mesh>
            {/* Product image area */}
            <mesh position={[0, 0.19, 0.003]}>
              <boxGeometry args={[0.78, 0.38, 0.001]} />
              <meshBasicMaterial color={['#04101a','#07051a','#041008','#0c0804','#04101a','#07051a'][i]} />
            </mesh>
            {/* Image accent */}
            <mesh position={[0, 0.19, 0.004]}>
              <boxGeometry args={[0.78, 0.38, 0.001]} />
              <meshBasicMaterial color={ACCENT[i]} transparent opacity={0.12} />
            </mesh>
            {/* Product name */}
            <mesh position={[-0.05, -0.09, 0.004]}>
              <boxGeometry args={[0.6, 0.048, 0.001]} />
              <meshBasicMaterial color="#a0bcd4" />
            </mesh>
            {/* Price */}
            <mesh position={[-0.2, -0.21, 0.004]}>
              <boxGeometry args={[0.28, 0.065, 0.001]} />
              <meshBasicMaterial color={ACCENT[i]} transparent opacity={0.9} />
            </mesh>
            {/* Add to cart button */}
            <mesh position={[0, -0.32, 0.004]}>
              <boxGeometry args={[0.6, 0.1, 0.001]} />
              <meshBasicMaterial color={['#0f2a5c','#200860','#063028','#3a1808','#0f2a5c','#200860'][i]} />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MONITOR WRAPPER — hardware + screen + transform animation
═══════════════════════════════════════════════════════════════ */
const SCREEN_RIM = [
  '#1a3c9a', '#1a3c9a', '#1a4080',
  '#4a1090', '#0d7058', '#300808',
] as const;
const SCREEN_EM = [
  '#0a1e50', '#0a1e50', '#0a2040',
  '#160c50', '#063a30', '#100404',
] as const;

function Monitor({ section }: { section: number }) {
  const group  = useRef<THREE.Group>(null!);
  const scrMat = useRef<THREE.MeshStandardMaterial>(null!);
  const rimMat = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime;
    M.x += (M.tx - M.x) * 0.04;
    M.y += (M.ty - M.y) * 0.04;

    group.current.rotation.y  += (SV.monRotY + M.x * 0.042 - group.current.rotation.y)  * 0.044;
    group.current.rotation.x  += (SV.monRotX - M.y * 0.028 - group.current.rotation.x)  * 0.044;
    group.current.scale.setScalar(
      group.current.scale.x + (SV.monScale - group.current.scale.x) * 0.044,
    );
    group.current.position.x += (SV.monX - group.current.position.x) * 0.044;
    group.current.position.y += (SV.monY + Math.sin(t * 0.38) * 0.042 - group.current.position.y) * 0.044;

    const si = Math.min(section, 5);
    if (scrMat.current) {
      scrMat.current.emissive.set(SCREEN_EM[si]);
      scrMat.current.emissiveIntensity = 0.25 + Math.sin(t * 2) * 0.04;
    }
    if (rimMat.current) {
      rimMat.current.emissive.set(SCREEN_RIM[si]);
      rimMat.current.color.set(SCREEN_RIM[si]);
      rimMat.current.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.18;
    }
  });

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      {/* Hardware */}
      <Suspense fallback={<MonitorFallback />}>
        <MonitorGLTF />
      </Suspense>

      {/* Screen glass */}
      <mesh position={[0, 0.035, 0.0575]}>
        <boxGeometry args={[3.38, 2.2, 0.005]} />
        <meshStandardMaterial ref={scrMat} color="#01030a" emissive="#0a1e50"
          emissiveIntensity={0.25} roughness={0.95} transparent opacity={0.92} />
      </mesh>
      {/* Screen rim glow */}
      <mesh position={[0, 0.035, 0.061]}>
        <boxGeometry args={[3.4, 2.22, 0.001]} />
        <meshStandardMaterial ref={rimMat} color="#1a3c9a" emissive="#1a3c9a"
          emissiveIntensity={0.6} transparent opacity={0.22} />
      </mesh>

      {/* Screen content — switches per section */}
      {section < 5 && (
        <>
          {(section === 0 || section === 1) && <ScreenHero building={section === 1} />}
          {section === 2 && <ScreenLanding />}
          {section === 3 && <ScreenCorporate />}
          {section === 4 && <ScreenEcommerce />}
        </>
      )}
      {/* State 5: screen goes dark (handled by emissive → red, no content) */}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPLOSION — UI FRAGMENTS FLY IN WORLD SPACE
   Each fragment: starts near monitor center → flies outward
═══════════════════════════════════════════════════════════════ */
type FragData = {
  s: [number, number, number]; // start position
  v: [number, number, number]; // velocity (direction × magnitude)
  g: [number, number, number]; // geometry (w, h, d)
  c: string;                   // color
};

const FRAGS: FragData[] = [
  { s: [0, 0.99, 0.1],      v: [0.3, 4.5, 3.0],    g: [2.8, 0.17, 0.02],  c: '#04101e' }, // nav bar
  { s: [-1.42, 0.99, 0.15], v: [-3.5, 3.8, 4.0],   g: [0.2, 0.2, 0.04],   c: '#2563eb' }, // logo dot
  { s: [-0.8, 0.62, 0.12],  v: [-2.0, 2.5, 5.0],   g: [1.02, 0.13, 0.02], c: '#d0e4ff' }, // h1 line 1
  { s: [-0.68, 0.46, 0.12], v: [-1.2, 2.0, 5.5],   g: [1.24, 0.13, 0.02], c: '#3b82f6' }, // h1 line 2
  { s: [-1.1, 0.77, 0.12],  v: [-2.5, 3.0, 3.5],   g: [0.54, 0.09, 0.02], c: '#0f2a5c' }, // badge
  { s: [-0.95, 0.31, 0.1],  v: [-2.2, 1.2, 4.0],   g: [0.85, 0.046, 0.02],c: '#0e2040' }, // sub 1
  { s: [-0.8, 0.21, 0.1],   v: [-1.8, 0.8, 4.5],   g: [0.7, 0.046, 0.02], c: '#0e2040' }, // sub 2
  { s: [-1.04, -0.05, 0.13],v: [-3.5, -1.0, 4.5],  g: [0.64, 0.17, 0.04], c: '#1d4ed8' }, // cta 1
  { s: [-0.32, -0.05, 0.12],v: [-1.0, -2.0, 3.5],  g: [0.52, 0.17, 0.03], c: '#0a1528' }, // cta 2
  { s: [0.92, 0.42, 0.18],  v: [4.0, 1.8, 2.5],    g: [1.32, 0.98, 0.06], c: '#040c1c' }, // dashboard card
  { s: [0.38, -0.4, 0.14],  v: [2.5, -4.0, 3.5],   g: [0.1, 0.22, 0.02],  c: '#3b82f6' }, // bar 1
  { s: [0.55, -0.28, 0.14], v: [3.0, -3.5, 4.0],   g: [0.1, 0.34, 0.02],  c: '#60a5fa' }, // bar 2
  { s: [0.72, -0.44, 0.14], v: [2.0, -4.5, 3.0],   g: [0.1, 0.18, 0.02],  c: '#2563eb' }, // bar 3
  { s: [0.89, -0.24, 0.14], v: [4.5, -2.5, 3.0],   g: [0.1, 0.46, 0.02],  c: '#4f8ef7' }, // bar 4
  { s: [1.06, -0.34, 0.14], v: [3.5, -3.0, 3.5],   g: [0.1, 0.26, 0.02],  c: '#3b82f6' }, // bar 5
  { s: [0, -0.35, 0.09],    v: [0.5, -5.5, 2.0],   g: [3.0, 0.27, 0.02],  c: '#030911' }, // stats band
  { s: [-1.2, -0.3, 0.12],  v: [-3.5, -3.5, 2.5],  g: [0.28, 0.12, 0.02], c: '#3b82f6' }, // stat 1
  { s: [-0.4, -0.3, 0.12],  v: [-0.5, -4.5, 3.0],  g: [0.28, 0.12, 0.02], c: '#a78bfa' }, // stat 2
  { s: [0.4, -0.3, 0.12],   v: [1.0, -4.0, 2.5],   g: [0.28, 0.12, 0.02], c: '#34d399' }, // stat 3
  { s: [1.2, -0.3, 0.12],   v: [4.0, -3.0, 2.0],   g: [0.28, 0.12, 0.02], c: '#f59e0b' }, // stat 4
  { s: [-1.1, -0.76, 0.09], v: [-4.5, -4.0, 1.5],  g: [0.96, 0.42, 0.04], c: '#06111e' }, // card 1
  { s: [-0.04, -0.76, 0.09],v: [0.5, -5.5, 1.0],   g: [0.96, 0.42, 0.04], c: '#090820' }, // card 2
  { s: [1.04, -0.76, 0.09], v: [4.5, -3.5, 1.5],   g: [0.96, 0.42, 0.04], c: '#041410' }, // card 3
];

function ExplosionFragment({ s, v, g, c }: FragData) {
  const mesh = useRef<THREE.Mesh>(null!);
  const mat  = useRef<THREE.MeshBasicMaterial>(null!);

  useFrame(() => {
    if (!mesh.current || !mat.current) return;
    const p = SV.explodeProgress;
    if (p < 0.001) {
      mesh.current.position.set(s[0], s[1], s[2]);
      mat.current.opacity = 0;
      return;
    }
    const ease = 1 - Math.pow(1 - p, 2.2); // ease-out
    mesh.current.position.set(
      s[0] + v[0] * ease,
      s[1] + v[1] * ease,
      s[2] + v[2] * ease,
    );
    // Fragments spin as they fly
    mesh.current.rotation.x = ease * v[1] * 0.5;
    mesh.current.rotation.y = ease * v[0] * 0.4;
    mesh.current.rotation.z = ease * (v[0] + v[1]) * 0.18;
    // Fade in quickly then hold
    mat.current.opacity = Math.min(1, p * 5.0);
  });

  return (
    <mesh ref={mesh} position={[s[0], s[1], s[2]]}>
      <boxGeometry args={g} />
      <meshBasicMaterial ref={mat} color={c} transparent opacity={0} />
    </mesh>
  );
}

function ExplosionFragments() {
  return <>{FRAGS.map((f, i) => <ExplosionFragment key={i} {...f} />)}</>;
}

/* ═══════════════════════════════════════════════════════════════
   RINGS — 2 elegant orbits (simplified)
═══════════════════════════════════════════════════════════════ */
function RingAccent() {
  const r1 = useRef<THREE.Mesh>(null!);
  const r2 = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // Main orbit — large, slow, blue, cinematic tilt
    r1.current.rotation.z = t * 0.055;
    r1.current.rotation.x = Math.sin(t * 0.034) * 0.28 + 0.52;
    // Secondary orbit — medium, counter-rotate, purple
    r2.current.rotation.z = -t * 0.038;
    r2.current.rotation.y =  t * 0.022;
    r2.current.rotation.x = Math.cos(t * 0.028) * 0.22 + 0.88;
  });

  return (
    <>
      {/* Main orbit */}
      <mesh ref={r1} position={[0.3, 0.1, -2]}>
        <torusGeometry args={[4.0, 0.012, 8, 100]} />
        <meshStandardMaterial color="#1e4090" emissive="#1e4090" emissiveIntensity={1.6} transparent opacity={0.45} />
      </mesh>
      {/* Secondary orbit */}
      <mesh ref={r2} position={[-0.4, 0.2, -3]}>
        <torusGeometry args={[5.5, 0.007, 8, 120]} />
        <meshStandardMaterial color="#5b21b6" emissive="#5b21b6" emissiveIntensity={1.0} transparent opacity={0.25} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════════════════ */
function makePos(count: number, rMin: number, rMax: number) {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = rMin + Math.random() * (rMax - rMin);
    const θ = Math.random() * Math.PI * 2;
    const φ = Math.acos(2 * Math.random() - 1);
    arr[i*3]   = r * Math.sin(φ) * Math.cos(θ);
    arr[i*3+1] = r * Math.sin(φ) * Math.sin(θ);
    arr[i*3+2] = r * Math.cos(φ);
  }
  return arr;
}

function Particles({ mobile }: { mobile?: boolean }) {
  const count = mobile ? 500 : 1800;
  const pos1  = useMemo(() => makePos(count, 9, 19), [count]);
  const pos2  = useMemo(() => makePos(mobile ? 0 : 400, 6, 14), [mobile]);
  const r1 = useRef<THREE.Points>(null!);
  const r2 = useRef<THREE.Points>(null!);

  useFrame(({ clock: c }) => {
    r1.current.rotation.y =  c.elapsedTime * 0.018;
    r1.current.rotation.x =  Math.sin(c.elapsedTime * 0.007) * 0.05;
    if (r2.current) {
      r2.current.rotation.y = -c.elapsedTime * 0.012;
      r2.current.rotation.x =  Math.sin(c.elapsedTime * 0.009) * 0.04;
    }
  });

  return (
    <>
      <points ref={r1}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pos1, 3]} />
        </bufferGeometry>
        <pointsMaterial size={mobile ? 0.02 : 0.022} color="#4f8ef7" sizeAttenuation transparent opacity={0.55} />
      </points>
      {!mobile && (
        <points ref={r2}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[pos2, 3]} />
          </bufferGeometry>
          <pointsMaterial size={0.026} color="#9b7ef8" sizeAttenuation transparent opacity={0.35} />
        </points>
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   CINEMATIC CAMERA RIG
═══════════════════════════════════════════════════════════════ */
function CameraRig({ section }: { section: number }) {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    // During explosion: add cinematic camera shake
    const shake = SV.explodeProgress > 0.05
      ? SV.explodeProgress * 0.04
      : 0;
    camera.position.x += (SV.camX + Math.sin(t * 1.2) * shake - camera.position.x) * 0.038;
    camera.position.y += (SV.camY + Math.cos(t * 0.9) * shake - camera.position.y) * 0.038;
    camera.position.z += (SV.camZ - camera.position.z) * 0.038;
    camera.lookAt(SV.monX * 0.4, SV.monY * 0.15, 0);
  });
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   ROOM — stůl · podlaha · zdi
═══════════════════════════════════════════════════════════════ */
function Room() {
  return (
    <>
      {/* Desk surface */}
      <mesh position={[0, -2.5, -0.3]}>
        <boxGeometry args={[8.2, 0.13, 3.2]} />
        <meshStandardMaterial color="#100a03" metalness={0.06} roughness={0.84} />
      </mesh>
      {/* Front edge highlight */}
      <mesh position={[0, -2.435, 1.3]}>
        <boxGeometry args={[8.2, 0.014, 0.012]} />
        <meshStandardMaterial color="#2c1a08" metalness={0.18} roughness={0.5} />
      </mesh>

      {/* Legs — 4 corners */}
      {([-3.8, 3.8] as const).flatMap(x =>
        ([-0.75, -1.75] as const).map((z, j) => (
          <mesh key={`${x}-${j}`} position={[x, -3.75, z]}>
            <boxGeometry args={[0.10, 2.5, 0.10]} />
            <meshStandardMaterial color="#0d0702" metalness={0.04} roughness={0.9} />
          </mesh>
        ))
      )}

      {/* Floor */}
      <mesh position={[0, -5.05, -1.0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[48, 32]} />
        <meshStandardMaterial color="#0b0906" metalness={0.02} roughness={0.96} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 1.5, -4.0]}>
        <planeGeometry args={[32, 20]} />
        <meshStandardMaterial color="#0f0f19" metalness={0.0} roughness={0.98} />
      </mesh>
      {/* Back wall warm tint strip (simulates bounced lamp light) */}
      <mesh position={[2.5, -1.2, -3.98]}>
        <planeGeometry args={[3.5, 4.0]} />
        <meshStandardMaterial color="#4a1e06" emissive="#3a1204" emissiveIntensity={0.18} transparent opacity={0.22} />
      </mesh>

      {/* Left wall */}
      <mesh position={[-11, 1.5, -2]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0e0e18" metalness={0.0} roughness={0.98} />
      </mesh>
      {/* Right wall */}
      <mesh position={[11, 1.5, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#0e0e18" metalness={0.0} roughness={0.98} />
      </mesh>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   DESK LAMP — teplé cozy světlo
═══════════════════════════════════════════════════════════════ */
function DeskLamp() {
  const lightRef = useRef<THREE.PointLight>(null!);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      lightRef.current.intensity = 3.6 + Math.sin(clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group position={[2.9, -2.44, 0.5]}>
      {/* Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.18, 0.22, 0.06, 12]} />
        <meshStandardMaterial color="#1c1006" metalness={0.65} roughness={0.35} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.53, 0]}>
        <cylinderGeometry args={[0.018, 0.022, 1.0, 8]} />
        <meshStandardMaterial color="#261508" metalness={0.6} roughness={0.4} />
      </mesh>
      {/* Shade — wide opening faces down (default cone: base at -y) */}
      <mesh position={[0, 1.03, 0]}>
        <coneGeometry args={[0.30, 0.36, 14, 1, true]} />
        <meshStandardMaterial
          color="#b85820"
          emissive="#701e00"
          emissiveIntensity={0.55}
          metalness={0.2}
          roughness={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Bulb glow */}
      <mesh position={[0, 1.0, 0]}>
        <sphereGeometry args={[0.042, 8, 8]} />
        <meshStandardMaterial color="#ffe090" emissive="#ffcc44" emissiveIntensity={5.5} />
      </mesh>
      {/* Point light — warm amber */}
      <pointLight ref={lightRef} position={[0, 0.85, 0]} intensity={3.6} color="#ff9430" distance={11} decay={2} />
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   EXPORTED SCENE
═══════════════════════════════════════════════════════════════ */
interface Props {
  scrollContainerRef: React.RefObject<HTMLDivElement | null>;
  mobile?: boolean;
}

export function ImmersiveScene({ scrollContainerRef, mobile = false }: Props) {
  const [section, setSection] = useState(0);
  const secRef = useRef(0);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    /* Reset */
    Object.assign(SV, {
      camX: 0, camY: 0.15, camZ: 8.5,
      monRotX: 0, monRotY: 0, monScale: 1.22,
      monX: 0, monY: 0.05,
      buildProgress: 0, explodeProgress: 0,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el, scroller: window,
        start: 'top top', end: 'bottom bottom',
        scrub: 1.4,
      },
    });

    /* ── 6 CINEMATIC STATES ──────────────────────────────────
       tl position 0-5 maps to 600vh container via scrub
       Each section ≈ 0.83 tl units (5 / 6 sections)
    ─────────────────────────────────────────────────────── */

    /* STATE 0→1: HERO — camera slowly drifts, breathes */
    tl.to(SV, { camZ: 7.8, camY: 0.05, monScale: 1.28, duration: 0.83 }, 0);

    /* STATE 1: BUILD — camera moves IN to watch assembly */
    tl.to(SV, {
      camZ: mobile ? 6.2 : 5.6, camX: mobile ? 0 : -0.4, camY: -0.12,
      monScale: 1.38, monRotY: mobile ? 0 : 0.08,
      buildProgress: 1,
      duration: 0.83,
    }, 0.83);

    /* STATE 2: LANDING — camera ORBITS RIGHT, monitor tilts */
    tl.to(SV, {
      camX: mobile ? 0 : 3.2, camY: 0.6, camZ: mobile ? 7.5 : 8.2,
      monRotY: mobile ? -0.12 : -0.32, monRotX: 0.06,
      monScale: 1.18, buildProgress: 0,
      duration: 0.83,
    }, 1.66);

    /* STATE 3: CORPORATE — camera ORBITS LEFT, monitor flips */
    tl.to(SV, {
      camX: mobile ? 0 : -3.0, camY: -0.4, camZ: mobile ? 7.5 : 8.0,
      monRotY: mobile ? 0.12 : 0.34, monRotX: -0.04,
      monScale: 1.14,
      duration: 0.83,
    }, 2.49);

    /* STATE 4: E-COMMERCE — low dramatic angle */
    tl.to(SV, {
      camX: mobile ? 0 : 0.8, camY: mobile ? -1.0 : -2.4, camZ: mobile ? 7.0 : 6.8,
      monRotX: -0.22, monRotY: mobile ? 0 : -0.08,
      monScale: 1.25,
      duration: 0.83,
    }, 3.32);

    /* STATE 5: EXPLODE — WOW MOMENT
       Camera DRAMATICALLY pulls back + tilts up
       Monitor spins and shrinks as it "breaks apart"
       Fragments fly out via SV.explodeProgress */
    tl.to(SV, {
      camX: mobile ? 0.5 : -2.0, camY: 2.8, camZ: mobile ? 13.0 : 18.0,
      monRotY: 1.2, monRotX: 0.55,
      monScale: mobile ? 0.25 : 0.08,
      explodeProgress: 1,
      duration: 0.83,
    }, 4.15);

    const onScroll = () => {
      const s = Math.min(5, Math.max(0, Math.floor(window.scrollY / window.innerHeight)));
      if (s !== secRef.current) { secRef.current = s; setSection(s); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
      window.removeEventListener('scroll', onScroll);
    };
  }, [scrollContainerRef, mobile]);

  return (
    <Canvas
      camera={{ position: [0, 0.15, 8.5], fov: mobile ? 46 : 40 }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}
      dpr={mobile ? [0.75, 1] : [1, 1.5]}
      performance={{ min: 0.5 }}
      style={{ width: '100%', height: '100%' }}
    >
      <AdaptiveDpr pixelated />
      <color attach="background" args={['#06060a']} />

      <ambientLight intensity={0.12} />
      {/* Key — cool blue from upper-left */}
      <pointLight position={[-6, 5, 4]}   intensity={5.5} color="#3b82f6" />
      {/* Fill — purple from lower-right */}
      <pointLight position={[5, -3, 3]}   intensity={3.0} color="#8b5cf6" />
      {/* Front — soft white */}
      <pointLight position={[0, 3, 8]}    intensity={0.7} color="#ffffff" />
      {/* Rim — cyan right */}
      <pointLight position={[3, 1, 2]}    intensity={1.8} color="#60a5fa" />
      {/* Back — deep blue */}
      <pointLight position={[0, 0, -6]}   intensity={1.4} color="#1a3c9a" />
      {/* Explosion accent — red tint when exploding */}
      <pointLight position={[0, 0, 4]}    intensity={section === 5 ? 4.0 : 0} color="#ff2200" />
      {/* Cozy warm fill — floor/desk bounce */}
      <pointLight position={[0, -3.8, 1.0]}  intensity={0.6} color="#5c2200" />
      {/* Cozy warm wall fill — lamp spill */}
      <pointLight position={[3.5, -1.0, -2.5]} intensity={0.85} color="#8b3010" />

      <Room />
      <DeskLamp />
      <Particles mobile={mobile} />
      {!mobile && <RingAccent />}
      <Monitor section={section} />
      <ExplosionFragments />
      <CameraRig section={section} />
    </Canvas>
  );
}

useGLTF.preload('/models/monitor.glb');
