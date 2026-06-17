'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   SHARED STATE — GSAP writes, useFrame reads
═══════════════════════════════════════════════════════════════ */
const SV = {
  camX: 0, camY: 0.15, camZ: 8.5,
  monRotX: 0, monRotY: 0, monScale: 1.22,
  monX: 0.1, monY: 0.05,
  svcVis: 0, portVis: 0, statVis: 0,
};

const M = { x: 0, y: 0, tx: 0, ty: 0 };
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', e => {
    M.tx = (e.clientX / window.innerWidth) * 2 - 1;
    M.ty = -((e.clientY / window.innerHeight) * 2 - 1);
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════════
   MONITOR HARDWARE — GLTF model (fallback = procedural geometry)
   Place the downloaded GLB at: /public/models/monitor.glb
   Download from: https://sketchfab.com/3d-models/office-monitor-workstation-monitor-6a7b0147890242418a49f6db26657ab4
   Select "Autoconverted model (GLTF)" → rename to monitor.glb
═══════════════════════════════════════════════════════════════ */

/* Adjust these two constants after placing the GLB file */
const GLB_SCALE    = 0.145; /* scale up/down if monitor appears wrong size  */
const GLB_ROT_Y    = Math.PI; /* 180° — SketchUp models usually face backward */

function MonitorFallback() {
  return (
    <>
      <mesh>
        <boxGeometry args={[3.76, 2.58, 0.11]} />
        <meshStandardMaterial color="#07090f" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0,  1.285, 0.028]} rotation={[Math.PI/4, 0, 0]}>
        <boxGeometry args={[3.76, 0.038, 0.038]} />
        <meshStandardMaterial color="#0e1828" metalness={0.9} roughness={0.08} />
      </mesh>
      <mesh position={[0, -1.285, 0.028]} rotation={[-Math.PI/4, 0, 0]}>
        <boxGeometry args={[3.76, 0.038, 0.038]} />
        <meshStandardMaterial color="#0e1828" metalness={0.9} roughness={0.08} />
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
        const mesh = obj as THREE.Mesh;
        /* Detect screen mesh by its position (front-facing, flat) and
           give it a dark emissive material; everything else gets metal */
        mesh.material = new THREE.MeshStandardMaterial({
          color: '#07090f',
          metalness: 0.88,
          roughness: 0.12,
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
      }
    });
    return c;
  }, [scene]);

  return (
    <primitive
      object={cloned}
      scale={GLB_SCALE}
      rotation={[0, GLB_ROT_Y, 0]}
    />
  );
}

/* ═══════════════════════════════════════════════════════════════
   MONITOR — animation wrapper + screen content overlay
═══════════════════════════════════════════════════════════════ */
function Monitor({ section }: { section: number }) {
  const group   = useRef<THREE.Group>(null!);
  const scrMat  = useRef<THREE.MeshStandardMaterial>(null!);
  const rimMat  = useRef<THREE.MeshStandardMaterial>(null!);
  const cursorRef = useRef<THREE.MeshBasicMaterial>(null!);
  const liveDot   = useRef<THREE.MeshStandardMaterial>(null!);
  /* Animated chart bars (right-side analytics preview) */
  const barRefs = [
    useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!),
    useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!), useRef<THREE.Mesh>(null!),
  ];
  /* Animated visitor count line */
  const lineRef = useRef<THREE.Mesh>(null!);

  const ACCENT = ['#0a1e50','#0a2860','#160c50','#063a30','#0a1e50','#160c50'];
  const RIM    = ['#1a3c9a','#1a5cb8','#4a1090','#0d7058','#1a3c9a','#3a1090'];

  /* Bar heights — animated per bar */
  const BAR_H    = [0.22, 0.32, 0.18, 0.38, 0.28];
  const BAR_FREQ = [1.1,  0.85, 1.35, 0.7,  1.0 ];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    M.x += (M.tx - M.x) * 0.04;
    M.y += (M.ty - M.y) * 0.04;

    group.current.rotation.y += (SV.monRotY + M.x * 0.045 - group.current.rotation.y) * 0.045;
    group.current.rotation.x += (SV.monRotX - M.y * 0.03  - group.current.rotation.x) * 0.045;
    group.current.scale.setScalar(group.current.scale.x + (SV.monScale - group.current.scale.x) * 0.045);
    group.current.position.x += (SV.monX - group.current.position.x) * 0.045;
    group.current.position.y += (SV.monY + Math.sin(t * 0.38) * 0.045 - group.current.position.y) * 0.045;

    const si = Math.min(section, ACCENT.length - 1);
    if (scrMat.current) { scrMat.current.emissiveIntensity = 0.25 + Math.sin(t * 2) * 0.04; scrMat.current.emissive.set(ACCENT[si]); }
    if (rimMat.current) { rimMat.current.emissiveIntensity = 0.6 + Math.sin(t * 2) * 0.18; rimMat.current.emissive.set(RIM[si]); rimMat.current.color.set(RIM[si]); }

    /* Blinking cursor */
    if (cursorRef.current) cursorRef.current.opacity = Math.sin(t * 3.5) > 0 ? 0.9 : 0;

    /* Pulsing live dot */
    if (liveDot.current) liveDot.current.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.8;

    /* Animated chart bars — oscillate around base height */
    barRefs.forEach((r, i) => {
      if (!r.current) return;
      const h = BAR_H[i] + Math.sin(t * BAR_FREQ[i] + i * 0.8) * 0.08;
      r.current.scale.y = h / BAR_H[i];
      r.current.position.y = -0.62 + h / 2;
    });

    /* Visitor line width pulse */
    if (lineRef.current) lineRef.current.scale.x = 0.85 + Math.sin(t * 0.6) * 0.12;
  });

  const Z = 0.083; /* z offset for screen surface elements */

  return (
    <group ref={group} position={[SV.monX, SV.monY, 0]}>

      {/* ══ HARDWARE — GLTF model (fallback = procedural geometry) ══ */}
      <Suspense fallback={<MonitorFallback />}>
        <MonitorGLTF />
      </Suspense>

      {/* Screen glass overlay (keeps emissive animation on any hardware) */}
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

      {/* ── NAV BAR ── */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.19, 0.001]} />
        <meshBasicMaterial color="#040b16" />
      </mesh>
      {/* Logo */}
      <mesh position={[-1.4, 0.99, Z+0.001]}>
        <boxGeometry args={[0.1, 0.08, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      <mesh position={[-1.25, 0.99, Z+0.001]}>
        <boxGeometry args={[0.24, 0.06, 0.001]} />
        <meshBasicMaterial color="#c8d8f0" />
      </mesh>
      {/* Nav links */}
      {[-0.25, 0.18, 0.6, 1.05].map((x, i) => (
        <mesh key={i} position={[x, 0.99, Z+0.001]}>
          <boxGeometry args={[0.2, 0.045, 0.001]} />
          <meshBasicMaterial color="#1a2d4a" />
        </mesh>
      ))}
      {/* Nav CTA pill */}
      <mesh position={[1.45, 0.99, Z+0.001]}>
        <boxGeometry args={[0.26, 0.1, 0.001]} />
        <meshBasicMaterial color="#1d4ed8" />
      </mesh>

      {/* ── HERO LEFT — headline + CTA ── */}
      {/* Badge */}
      <mesh position={[-1.1, 0.77, Z]}>
        <boxGeometry args={[0.52, 0.09, 0.001]} />
        <meshBasicMaterial color="#0f2a5c" />
      </mesh>
      <mesh position={[-1.1, 0.77, Z+0.001]}>
        <boxGeometry args={[0.5, 0.07, 0.001]} />
        <meshBasicMaterial color="#1a3c9a" transparent opacity={0.5} />
      </mesh>
      {/* H1 line 1 */}
      <mesh position={[-0.82, 0.62, Z]}>
        <boxGeometry args={[1.0, 0.12, 0.001]} />
        <meshBasicMaterial color="#d0e4ff" />
      </mesh>
      {/* H1 line 2 — blue accent */}
      <mesh position={[-0.72, 0.47, Z]}>
        <boxGeometry args={[1.2, 0.12, 0.001]} />
        <meshBasicMaterial color="#3b82f6" />
      </mesh>
      {/* Blinking cursor after headline */}
      <mesh position={[0.17, 0.47, Z+0.001]}>
        <boxGeometry args={[0.018, 0.11, 0.001]} />
        <meshBasicMaterial ref={cursorRef} color="#60a5fa" transparent opacity={0.9} />
      </mesh>
      {/* Sub text lines */}
      {[[1.6, 0.31], [1.35, 0.2], [0.95, 0.1]].map(([w, y], i) => (
        <mesh key={i} position={[-1.69 + w / 2, y, Z]}>
          <boxGeometry args={[w, 0.047, 0.001]} />
          <meshBasicMaterial color="#0e2040" />
        </mesh>
      ))}
      {/* CTA primary */}
      <mesh position={[-1.05, -0.05, Z]}>
        <boxGeometry args={[0.62, 0.16, 0.001]} />
        <meshBasicMaterial color="#1d4ed8" />
      </mesh>
      {/* CTA secondary */}
      <mesh position={[-0.35, -0.05, Z]}>
        <boxGeometry args={[0.5, 0.16, 0.001]} />
        <meshBasicMaterial color="#0a1528" />
      </mesh>
      <mesh position={[-0.35, -0.05, Z+0.001]}>
        <boxGeometry args={[0.5, 0.16, 0.001]} />
        <meshBasicMaterial color="#1a3060" transparent opacity={0.4} />
      </mesh>

      {/* ── HERO RIGHT — analytics dashboard preview ── */}
      {/* Dashboard card */}
      <mesh position={[0.92, 0.44, Z]}>
        <boxGeometry args={[1.32, 1.0, 0.006]} />
        <meshStandardMaterial color="#040c1c" metalness={0.1} roughness={0.9} />
      </mesh>
      {/* Card top bar */}
      <mesh position={[0.92, 0.93, Z+0.005]}>
        <boxGeometry args={[1.32, 0.09, 0.001]} />
        <meshBasicMaterial color="#060f20" />
      </mesh>
      {/* Live indicator dot */}
      <mesh position={[0.34, 0.93, Z+0.007]}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshStandardMaterial ref={liveDot} color="#22c55e" emissive="#22c55e" emissiveIntensity={1.2} />
      </mesh>
      {/* Card title block */}
      <mesh position={[0.75, 0.93, Z+0.007]}>
        <boxGeometry args={[0.55, 0.042, 0.001]} />
        <meshBasicMaterial color="#1a2d44" />
      </mesh>
      {/* Big number */}
      <mesh position={[0.56, 0.73, Z+0.005]}>
        <boxGeometry args={[0.35, 0.14, 0.001]} />
        <meshBasicMaterial color="#e0eeff" />
      </mesh>
      {/* Sub number label */}
      <mesh position={[0.65, 0.58, Z+0.005]}>
        <boxGeometry args={[0.55, 0.045, 0.001]} />
        <meshBasicMaterial color="#0e2040" />
      </mesh>
      {/* Green up-arrow indicator */}
      <mesh position={[1.1, 0.72, Z+0.005]}>
        <boxGeometry args={[0.22, 0.08, 0.001]} />
        <meshBasicMaterial color="#15803d" />
      </mesh>
      {/* Visitor trend line (animated width) */}
      <mesh ref={lineRef} position={[0.92, 0.48, Z+0.005]}>
        <boxGeometry args={[1.1, 0.028, 0.001]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.4} />
      </mesh>
      {/* Chart area dark bg */}
      <mesh position={[0.92, -0.1, Z+0.004]}>
        <boxGeometry args={[1.3, 0.55, 0.001]} />
        <meshBasicMaterial color="#020810" transparent opacity={0.7} />
      </mesh>
      {/* Animated chart bars */}
      {([
        [0.38, '#3b82f6'], [0.55, '#3b82f6'], [0.72, '#60a5fa'],
        [0.89, '#2563eb'], [1.06, '#60a5fa'],
      ] as const).map(([x, c], i) => (
        <mesh key={i} ref={barRefs[i]} position={[x, -0.62 + BAR_H[i] / 2, Z+0.005]}>
          <boxGeometry args={[0.1, BAR_H[i], 0.001]} />
          <meshBasicMaterial color={c} transparent opacity={0.8} />
        </mesh>
      ))}
      {/* X-axis line */}
      <mesh position={[0.92, -0.62, Z+0.005]}>
        <boxGeometry args={[1.28, 0.006, 0.001]} />
        <meshBasicMaterial color="#0e2040" />
      </mesh>
      {/* Small label dots */}
      {[0.38, 0.55, 0.72, 0.89, 1.06].map((x, i) => (
        <mesh key={i} position={[x, -0.66, Z+0.005]}>
          <boxGeometry args={[0.032, 0.032, 0.001]} />
          <meshBasicMaterial color="#112040" />
        </mesh>
      ))}

      {/* ── STATS BAND ── */}
      <mesh position={[0, -0.35, Z-0.001]}>
        <boxGeometry args={[3.38, 0.28, 0.001]} />
        <meshBasicMaterial color="#030911" />
      </mesh>
      {([[-1.2,'#3b82f6'],[-0.4,'#a78bfa'],[0.4,'#34d399'],[1.2,'#f59e0b']] as const).map(([x, c]) => (
        <group key={x}>
          <mesh position={[x, -0.3, Z+0.002]}>
            <boxGeometry args={[0.26, 0.12, 0.001]} />
            <meshBasicMaterial color={c} transparent opacity={0.9} />
          </mesh>
          <mesh position={[x, -0.43, Z+0.002]}>
            <boxGeometry args={[0.32, 0.042, 0.001]} />
            <meshBasicMaterial color="#0b1a2e" />
          </mesh>
        </group>
      ))}

      {/* ── BOTTOM CARDS ROW ── */}
      {([-1.1, -0.03, 1.04] as const).map((x, i) => (
        <group key={i} position={[x, -0.78, Z]}>
          <mesh>
            <boxGeometry args={[0.96, 0.44, 0.004]} />
            <meshBasicMaterial color={['#06111e','#090820','#041410'][i]} />
          </mesh>
          <mesh position={[0, 0.21, 0.003]}>
            <boxGeometry args={[0.96, 0.028, 0.001]} />
            <meshBasicMaterial color={['#2563eb','#7c3aed','#059669'][i]} />
          </mesh>
          {[0.08, -0.04, -0.14].map((dy, j) => (
            <mesh key={j} position={[0, dy, 0.003]}>
              <boxGeometry args={[(0.7 - j * 0.08), 0.04, 0.001]} />
              <meshBasicMaterial color={['#0e2040','#12103a','#061a12'][i]} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING SERVICE CARDS  (text mirrors page S2)
═══════════════════════════════════════════════════════════════ */
const SVC_DATA = [
  { c: '#2563eb', title: '48 hodin',            sub: 'od poptávky po doručení'         },
  { c: '#7c3aed', title: 'Bez závazku',          sub: 'nejdřív vidíte, pak zaplatíte'  },
  { c: '#059669', title: 'Přesně na míru',       sub: 'váš obor, váš styl, váš zákazník' },
] as const;

const SVC_Y = [0.9, 0, -0.9] as const;

function SvcCard({ idx }: { idx: number }) {
  const ref = useRef<THREE.Group>(null!);
  const emRef = useRef<THREE.MeshStandardMaterial>(null!);
  const { c, title, sub } = SVC_DATA[idx];
  const y0 = SVC_Y[idx];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    /* Gentle stagger — each card 0.18 behind previous */
    const vis = Math.max(0, Math.min(1, (SV.svcVis - idx * 0.18) * 2.2));

    if (vis < 0.02) {
      ref.current.scale.setScalar(0);
      return;
    }

    /* Scale reveal from 0 → 1 — cards materialise in place, no dramatic fly */
    ref.current.scale.setScalar(ref.current.scale.x + (vis - ref.current.scale.x) * 0.045);
    /* Gentle y-lift as they appear, then settle to float */
    const liftY = (1 - vis) * 0.18;
    ref.current.position.y = y0 + liftY + Math.sin(t * 0.45 + idx * 1.4) * 0.055;
    /* Subtle glow pulse — calmer */
    if (emRef.current) emRef.current.emissiveIntensity = 1.1 + Math.sin(t * 1.4 + idx * 0.9) * 0.25;
  });

  return (
    <group ref={ref} position={[-2.75, y0, 0.25]} scale={0}>
      {/* Card body */}
      <mesh>
        <boxGeometry args={[2.05, 0.6, 0.022]} />
        <meshStandardMaterial color="#060d1a" metalness={0.12} roughness={0.88} transparent opacity={0.96} />
      </mesh>
      {/* Subtle border tint */}
      <mesh position={[0, 0, 0.013]}>
        <boxGeometry args={[2.05, 0.6, 0.001]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={0.06} transparent opacity={0.1} />
      </mesh>
      {/* Left glow strip */}
      <mesh position={[-0.998, 0, 0.013]}>
        <boxGeometry args={[0.04, 0.6, 0.005]} />
        <meshStandardMaterial ref={emRef} color={c} emissive={c} emissiveIntensity={1.6} />
      </mesh>
      {/* Icon dot */}
      <mesh position={[-0.81, 0.12, 0.015]}>
        <sphereGeometry args={[0.036, 10, 10]} />
        <meshStandardMaterial color={c} emissive={c} emissiveIntensity={2.8} />
      </mesh>
      {/* Divider line */}
      <mesh position={[0.1, 0, 0.014]}>
        <boxGeometry args={[1.55, 0.004, 0.001]} />
        <meshBasicMaterial color={c} transparent opacity={0.18} />
      </mesh>
      {/* Title */}
      <Text position={[-0.65, 0.12, 0.016]} fontSize={0.138} color="white" anchorX="left" anchorY="middle">
        {title}
      </Text>
      {/* Sub */}
      <Text position={[-0.65, -0.11, 0.016]} fontSize={0.085} color="#6a7f98" anchorX="left" anchorY="middle">
        {sub}
      </Text>
    </group>
  );
}

function ServiceCards() {
  return <>{SVC_DATA.map((_, i) => <SvcCard key={i} idx={i} />)}</>;
}

/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO CARDS  (text mirrors page S4)
═══════════════════════════════════════════════════════════════ */
const PORT = [
  { x: 2.55,  y: 0.82,  z: -0.4, c1: '#1a3a8a', c2: '#3b82f6', tag: 'Instalatér Praha',  result: '+340%', metric: 'organická návštěvnost' },
  { x: 2.55,  y: -0.65, z: -0.9, c1: '#0b4f42', c2: '#0d9488', tag: 'Zubní ordinace',    result: '70%',   metric: 'nových pacientů online' },
  { x: -2.55, y: 0.82,  z: -0.4, c1: '#7a3a08', c2: '#f59e0b', tag: 'Kavárna Jihlava',   result: '+40%',  metric: 'rezervací přes web'     },
  { x: -2.55, y: -0.65, z: -0.9, c1: '#3b1278', c2: '#a78bfa', tag: 'Autoservis Plzeň',  result: '+120%', metric: 'příchozích kontaktů'    },
] as const;

function PortCard({ idx }: { idx: number }) {
  const ref    = useRef<THREE.Group>(null!);
  const glowRef = useRef<THREE.MeshStandardMaterial>(null!);
  const { x, y, z, c1, c2, tag, result, metric } = PORT[idx];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (SV.portVis < 0.02) {
      ref.current.scale.setScalar(0);
      return;
    }

    /* Staggered per card */
    const vis = Math.max(0, Math.min(1, (SV.portVis - idx * 0.1) * 1.8));
    const target = vis;
    ref.current.scale.setScalar(ref.current.scale.x + (target - ref.current.scale.x) * 0.045);
    ref.current.position.y = y + (1 - vis) * 0.15 + Math.sin(t * 0.42 + idx * 1.5) * 0.07;
    ref.current.rotation.y = Math.sin(t * 0.22 + idx) * 0.032;
    if (glowRef.current) glowRef.current.emissiveIntensity = 0.45 + Math.sin(t * 1.2 + idx * 0.7) * 0.12;
  });

  return (
    <group ref={ref} position={[x, y, z]} scale={0}>
      {/* Dark base */}
      <mesh>
        <boxGeometry args={[2.0, 1.3, 0.04]} />
        <meshStandardMaterial color="#060c16" metalness={0.18} roughness={0.82} />
      </mesh>
      {/* Colored bottom band */}
      <mesh position={[0, -0.55, 0.022]}>
        <boxGeometry args={[2.0, 0.2, 0.001]} />
        <meshStandardMaterial ref={glowRef} color={c1} emissive={c2} emissiveIntensity={0.55} transparent opacity={0.9} />
      </mesh>
      {/* Top accent line */}
      <mesh position={[0, 0.64, 0.022]}>
        <boxGeometry args={[2.0, 0.008, 0.001]} />
        <meshBasicMaterial color={c2} transparent opacity={0.5} />
      </mesh>
      {/* Vertical left line */}
      <mesh position={[-0.96, 0, 0.022]}>
        <boxGeometry args={[0.006, 1.3, 0.001]} />
        <meshBasicMaterial color={c2} transparent opacity={0.2} />
      </mesh>

      {/* Tag: small label */}
      <Text position={[-0.88, 0.52, 0.025]} fontSize={0.085} color={c2} anchorX="left" anchorY="middle">
        {tag}
      </Text>
      {/* Big result */}
      <Text position={[-0.88, 0.15, 0.025]} fontSize={0.48} color="white" anchorX="left" anchorY="middle">
        {result}
      </Text>
      {/* Metric */}
      <Text position={[-0.88, -0.3, 0.025]} fontSize={0.09} color="#8096b0" anchorX="left" anchorY="middle">
        {metric}
      </Text>
    </group>
  );
}

function ProjectPanels() {
  return <>{PORT.map((_, i) => <PortCard key={i} idx={i} />)}</>;
}

/* ═══════════════════════════════════════════════════════════════
   STAT ORBS — gyro rings + text  (mirrors page S5)
═══════════════════════════════════════════════════════════════ */
const STATS = [
  { x: -2.25, y: 1.3,  n: '48h',  l: 'Dodání'     },
  { x:  2.25, y: 1.3,  n: '50+',  l: 'Webů'        },
  { x: -2.25, y: -1.0, n: '100%', l: 'Spokojení'   },
  { x:  2.25, y: -1.0, n: '0 Kč', l: 'Záloha'      },
] as const;

const ORBS_RING_COLORS = ['#2563eb','#7c3aed','#059669','#0891b2'] as const;
const ORBS_RING2_COLORS = ['#60a5fa','#a78bfa','#34d399','#38bdf8'] as const;

/* Spinning ring — own useFrame so it rotates independently */
function GyroRing({ radius, tube, color, tilt, speed }: {
  radius: number; tube: number; color: string; tilt: number; speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => { ref.current.rotation.y = clock.elapsedTime * speed; });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, tube, 10, 80]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1} transparent opacity={0.7} />
    </mesh>
  );
}

function StatOrb({ idx }: { idx: number }) {
  const ref   = useRef<THREE.Group>(null!);
  const sphRef = useRef<THREE.MeshStandardMaterial>(null!);
  const { x, y, n, l } = STATS[idx];
  const rc1 = ORBS_RING_COLORS[idx];
  const rc2 = ORBS_RING2_COLORS[idx];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;

    if (SV.statVis < 0.02) {
      ref.current.scale.setScalar(0);
      return;
    }

    const vis = Math.max(0, Math.min(1, (SV.statVis - idx * 0.08) * 1.8));
    ref.current.scale.setScalar(ref.current.scale.x + (vis - ref.current.scale.x) * 0.042);
    ref.current.position.y = y + (1 - vis) * 0.2 + Math.sin(t * 0.38 + idx) * 0.07;
    ref.current.rotation.y = t * 0.07 + idx * 0.9;
    if (sphRef.current) sphRef.current.emissiveIntensity = 0.07 + Math.sin(t * 1.4 + idx) * 0.05;
  });

  return (
    <group ref={ref} position={[x, y, 0.5]} scale={0}>
      {/* Inner sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial ref={sphRef} color="#060a12" metalness={0.65} roughness={0.25}
          emissive={rc1} emissiveIntensity={0.08} transparent opacity={0.96} />
      </mesh>

      {/* Equatorial ring */}
      <GyroRing radius={0.62} tube={0.013} color={rc1} tilt={Math.PI / 2} speed={0.4 + idx * 0.08} />
      {/* Tilted gyro ring */}
      <GyroRing radius={0.68} tube={0.008} color={rc2} tilt={0.65 + idx * 0.15} speed={-(0.28 + idx * 0.06)} />

      {/* 4 tick dots around equator */}
      {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((a, j) => (
        <mesh key={j} position={[Math.cos(a) * 0.64, 0, Math.sin(a) * 0.64]}>
          <sphereGeometry args={[0.016, 6, 6]} />
          <meshStandardMaterial color={rc1} emissive={rc1} emissiveIntensity={3.0} />
        </mesh>
      ))}

      {/* Big number */}
      <Text position={[0, 0.1, 0.52]} fontSize={0.22} color="white" anchorX="center" anchorY="middle">
        {n}
      </Text>
      {/* Label */}
      <Text position={[0, -0.16, 0.52]} fontSize={0.1} color={rc2} anchorX="center" anchorY="middle">
        {l}
      </Text>
    </group>
  );
}

function StatPanels() {
  return <>{STATS.map((_, i) => <StatOrb key={i} idx={i} />)}</>;
}

/* ═══════════════════════════════════════════════════════════════
   PARTICLES
═══════════════════════════════════════════════════════════════ */
function Particles() {
  const count = 2800;
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 10;
      const θ = Math.random() * Math.PI * 2;
      const φ = Math.acos(2 * Math.random() - 1);
      arr[i*3]   = r * Math.sin(φ) * Math.cos(θ);
      arr[i*3+1] = r * Math.sin(φ) * Math.sin(θ);
      arr[i*3+2] = r * Math.cos(φ);
    }
    return arr;
  }, []);
  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock: c }) => {
    ref.current.rotation.y = c.elapsedTime * 0.018;
    ref.current.rotation.x = Math.sin(c.elapsedTime * 0.007) * 0.05;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.024} color="#4f8ef7" sizeAttenuation transparent opacity={0.65} />
    </points>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RING + CAMERA
═══════════════════════════════════════════════════════════════ */
function RingAccent() {
  const r = useRef<THREE.Mesh>(null!);
  useFrame(({ clock: c }) => {
    r.current.rotation.z = c.elapsedTime * 0.07;
    r.current.rotation.x = Math.sin(c.elapsedTime * 0.04) * 0.25 + 0.45;
  });
  return (
    <mesh ref={r} position={[0.4, 0.1, -2]}>
      <torusGeometry args={[3.2, 0.014, 8, 90]} />
      <meshStandardMaterial color="#1e4090" emissive="#1e4090" emissiveIntensity={1.4} transparent opacity={0.5} />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (SV.camX - camera.position.x) * 0.038;
    camera.position.y += (SV.camY - camera.position.y) * 0.038;
    camera.position.z += (SV.camZ - camera.position.z) * 0.038;
    camera.lookAt(SV.monX * 0.42, SV.monY * 0.18, 0);
  });
  return null;
}

/* ═══════════════════════════════════════════════════════════════
   EXPORTED SCENE
═══════════════════════════════════════════════════════════════ */
interface Props { scrollContainerRef: React.RefObject<HTMLDivElement | null>; }

export function ImmersiveScene({ scrollContainerRef }: Props) {
  const [section, setSection] = useState(0);
  const secRef = useRef(0);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    /* Reset SV to initial values on each mount */
    Object.assign(SV, { camX: 0, camY: 0.15, camZ: 8.5, monRotX: 0, monRotY: 0, monScale: 1.22, monX: 0.1, monY: 0.05, svcVis: 0, portVis: 0, statVis: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller: window,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
      },
    });

    /* S1 → S2: gentle zoom-in, monitor stays centered */
    tl.to(SV, { camZ: 7.6, camY: 0.05, monScale: 1.12, duration: 0.6 }, 0);
    tl.to(SV, { monRotY: -0.04, duration: 0.4 }, 0.5);

    /* S2: camera orbits FAR LEFT — monitor barely shifts right (+0.15), fully visible */
    tl.to(SV, { camX: -2.6, camY: 0.35, camZ: 8.8, monX: 0.15, monRotY: 0.22, monScale: 1.05, svcVis: 1, duration: 1 }, 1);

    /* S3: camera swings to front-low — monitor at center, close-up */
    tl.to(SV, { camX: 0, camY: -0.4, camZ: 5.2, monX: 0, monRotX: 0.1, monRotY: 0, monScale: 1.18, portVis: 1, svcVis: 0, duration: 1 }, 2);

    /* S4: camera orbits FAR RIGHT + elevated — monitor barely shifts left (−0.15), fully visible */
    tl.to(SV, { camX: 2.5, camY: 0.8, camZ: 9.5, monX: -0.15, monRotX: -0.14, monRotY: -0.22, monScale: 0.95, statVis: 1, portVis: 0, duration: 1 }, 3);

    /* S5: pull back, centered, CTA moment */
    tl.to(SV, { camX: 0, camY: 0, camZ: 13.5, monX: 0, monRotX: 0, monRotY: 0, monScale: 0.7, statVis: 0, duration: 1 }, 4);

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
  }, [scrollContainerRef]);

  return (
    <Canvas
      camera={{ position: [0, 0.15, 8.5], fov: 40 }}
      gl={{ antialias: true, alpha: false }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%' }}
    >
      {/* Dark background — no transparency issues */}
      <color attach="background" args={['#06060a']} />

      <ambientLight intensity={0.15} />
      <pointLight position={[-6, 5, 4]}  intensity={4.0} color="#3b82f6" />
      <pointLight position={[5, -3, 3]}  intensity={2.2} color="#8b5cf6" />
      <pointLight position={[0, 3, 8]}   intensity={0.6} color="#ffffff" />
      <pointLight position={[3, 1, 2]}   intensity={1.2} color="#60a5fa" />

      <Particles />
      <RingAccent />
      <ServiceCards />
      <ProjectPanels />
      <StatPanels />
      <Monitor section={section} />
      <CameraRig />
    </Canvas>
  );
}
