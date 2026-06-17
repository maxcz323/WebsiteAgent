'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   SHARED STATE — GSAP writes, useFrame reads
═══════════════════════════════════════════════════════════════ */
const SV = {
  camX: 0, camY: 0, camZ: 11,
  monRotX: 0, monRotY: 0, monScale: 1,
  monX: 0.6, monY: 0.1,
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
   MONITOR — pure Three.js geometry, no Html
═══════════════════════════════════════════════════════════════ */
function Monitor({ section }: { section: number }) {
  const group   = useRef<THREE.Group>(null!);
  const scrMat  = useRef<THREE.MeshStandardMaterial>(null!);
  const rimMat  = useRef<THREE.MeshStandardMaterial>(null!);

  /* Section-based screen accent colors */
  const ACCENT = ['#0e2860','#0e3870','#1a1060','#0d5040','#0e2860','#1a1060'];
  const RIM    = ['#1a3c9a','#1a5cb8','#4a1090','#0d7058','#1a3c9a','#3a1090'];

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    M.x += (M.tx - M.x) * 0.04;
    M.y += (M.ty - M.y) * 0.04;

    group.current.rotation.y += (SV.monRotY + M.x * 0.06 - group.current.rotation.y) * 0.07;
    group.current.rotation.x += (SV.monRotX - M.y * 0.04 - group.current.rotation.x) * 0.07;
    const sc = SV.monScale;
    group.current.scale.setScalar(group.current.scale.x + (sc - group.current.scale.x) * 0.07);
    group.current.position.x += (SV.monX - group.current.position.x) * 0.07;
    group.current.position.y += (SV.monY + Math.sin(t * 0.5) * 0.06 - group.current.position.y) * 0.06;

    if (scrMat.current) {
      scrMat.current.emissiveIntensity = 0.3 + Math.sin(t * 2) * 0.04;
      scrMat.current.emissive.set(ACCENT[Math.min(section, ACCENT.length - 1)]);
    }
    if (rimMat.current) {
      rimMat.current.emissiveIntensity = 0.65 + Math.sin(t * 2) * 0.18;
      rimMat.current.emissive.set(RIM[Math.min(section, RIM.length - 1)]);
      rimMat.current.color.set(RIM[Math.min(section, RIM.length - 1)]);
    }
  });

  return (
    <group ref={group} position={[SV.monX, SV.monY, 0]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[3.5, 2.4, 0.14]} />
        <meshStandardMaterial color="#0e1522" metalness={0.72} roughness={0.28} />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[3.2, 2.1, 0.01]} />
        <meshStandardMaterial ref={scrMat} color="#030810" emissive="#0e2860" emissiveIntensity={0.3} roughness={1} />
      </mesh>
      {/* Rim glow */}
      <mesh position={[0, 0, 0.0745]}>
        <boxGeometry args={[3.22, 2.12, 0.001]} />
        <meshStandardMaterial ref={rimMat} color="#1a3c9a" emissive="#1a3c9a" emissiveIntensity={0.65} transparent opacity={0.35} />
      </mesh>

      {/* ── Screen content geometry (section-aware) ── */}
      {/* Nav bar */}
      <mesh position={[0, 0.92, 0.082]}>
        <boxGeometry args={[3.18, 0.2, 0.001]} />
        <meshBasicMaterial color="#050c18" />
      </mesh>
      <mesh position={[-1.3, 0.92, 0.083]}>
        <boxGeometry args={[0.3, 0.1, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      {[-0.3, 0.1, 0.5, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 0.92, 0.083]}>
          <boxGeometry args={[0.22, 0.055, 0.001]} />
          <meshBasicMaterial color="#112040" />
        </mesh>
      ))}

      {/* Hero text blocks */}
      <mesh position={[-0.65, 0.62, 0.082]}>
        <boxGeometry args={[1.4, 0.13, 0.001]} />
        <meshBasicMaterial color="#1e40af" />
      </mesh>
      <mesh position={[-0.5, 0.43, 0.082]}>
        <boxGeometry args={[1.7, 0.13, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      {[0.24, 0.12, 0.01].map((y, i) => (
        <mesh key={i} position={[-0.6 + i * 0.04, y, 0.082]}>
          <boxGeometry args={[1.5 - i * 0.1, 0.05, 0.001]} />
          <meshBasicMaterial color="#112040" />
        </mesh>
      ))}

      {/* CTA buttons */}
      <mesh position={[-1.0, -0.12, 0.082]}>
        <boxGeometry args={[0.6, 0.17, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      <mesh position={[-0.42, -0.12, 0.082]}>
        <boxGeometry args={[0.48, 0.17, 0.001]} />
        <meshBasicMaterial color="#0a1222" />
      </mesh>

      {/* Stats band */}
      <mesh position={[0, -0.38, 0.082]}>
        <boxGeometry args={[3.18, 0.32, 0.001]} />
        <meshBasicMaterial color="#030912" />
      </mesh>
      {([[-1.05,'#3b82f6'],[-0.32,'#a78bfa'],[0.4,'#34d399'],[1.12,'#fbbf24']] as const).map(([x, c]) => (
        <mesh key={x} position={[x, -0.38, 0.083]}>
          <boxGeometry args={[0.3, 0.15, 0.001]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}

      {/* Service cards */}
      {([-0.95, 0.08, 1.1] as const).map((x, i) => (
        <group key={i} position={[x, -0.82, 0.082]}>
          <mesh>
            <boxGeometry args={[0.88, 0.5, 0.001]} />
            <meshBasicMaterial color={['#081528','#0c0a22','#051412'][i]} />
          </mesh>
          <mesh position={[0, 0.24, 0.001]}>
            <boxGeometry args={[0.86, 0.022, 0.001]} />
            <meshBasicMaterial color={['#2563eb','#7c3aed','#059669'][i]} />
          </mesh>
        </group>
      ))}

      {/* Stand */}
      <mesh position={[0, -1.36, -0.01]}>
        <boxGeometry args={[0.14, 0.46, 0.11]} />
        <meshStandardMaterial color="#08101e" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.62, -0.16]}>
        <boxGeometry args={[1.35, 0.07, 0.65]} />
        <meshStandardMaterial color="#08101e" metalness={0.5} roughness={0.5} />
      </mesh>
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
    /* Staggered reveal — each card comes out 0.15s after the previous */
    const vis = Math.max(0, Math.min(1, (SV.svcVis - idx * 0.15) * 2));
    /* Fly out from behind monitor center → side position */
    const tx = -2.75 + (1 - vis) * 2.75;
    ref.current.position.x += (tx - ref.current.position.x) * 0.07;
    ref.current.position.y = y0 + Math.sin(t * 0.5 + idx * 1.3) * 0.06;
    ref.current.scale.setScalar(ref.current.scale.x + (vis - ref.current.scale.x) * 0.08);
    /* Pulse glow on accent */
    if (emRef.current) emRef.current.emissiveIntensity = 1.6 + Math.sin(t * 1.8 + idx) * 0.4;
  });

  return (
    <group ref={ref} position={[0, y0, 0.25]} scale={0}>
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
    const target = SV.portVis > 0.01 ? 1 : 0;
    ref.current.scale.setScalar(ref.current.scale.x + (target - ref.current.scale.x) * 0.07);
    ref.current.position.y = y + Math.sin(t * 0.42 + idx * 1.5) * 0.08;
    ref.current.rotation.y = Math.sin(t * 0.25 + idx) * 0.04;
    if (glowRef.current) glowRef.current.emissiveIntensity = 0.55 + Math.sin(t * 1.4 + idx * 0.7) * 0.15;
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
    const target = SV.statVis > 0.01 ? 1 : 0;
    ref.current.scale.setScalar(ref.current.scale.x + (target - ref.current.scale.x) * 0.07);
    ref.current.position.y = y + Math.sin(t * 0.38 + idx) * 0.07;
    /* Slow y-axis drift */
    ref.current.rotation.y = t * 0.08 + idx * 0.9;
    /* Pulsing sphere */
    if (sphRef.current) sphRef.current.emissiveIntensity = 0.08 + Math.sin(t * 1.6 + idx) * 0.06;
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
    camera.position.x += (SV.camX - camera.position.x) * 0.055;
    camera.position.y += (SV.camY - camera.position.y) * 0.055;
    camera.position.z += (SV.camZ - camera.position.z) * 0.055;
    camera.lookAt(SV.monX * 0.35, SV.monY * 0.2, 0);
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
    Object.assign(SV, { camX: 0, camY: 0, camZ: 11, monRotX: 0, monRotY: 0, monScale: 1, monX: 0.6, monY: 0.1, svcVis: 0, portVis: 0, statVis: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        scroller: window,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2,
      },
    });

    tl.to(SV, { camZ: 7, monX: 0.4, duration: 1 }, 0);
    tl.to(SV, { monRotY: -0.07, duration: 0.6 }, 0.4);

    tl.to(SV, { camX: -1.8, camY: 0.3, camZ: 7.8, monRotY: 0.22, monX: 0.5, svcVis: 1, duration: 1 }, 1);

    tl.to(SV, { camX: 0.6, camY: -0.2, camZ: 4.8, monRotY: -0.04, monScale: 1.07, portVis: 1, svcVis: 0, duration: 1 }, 2);

    tl.to(SV, { camX: 1.3, camY: -0.5, camZ: 9, monRotX: -0.13, monRotY: -0.1, monScale: 1, statVis: 1, portVis: 0, duration: 1 }, 3);

    tl.to(SV, { camX: 0, camY: 0, camZ: 11.5, monRotX: 0, monRotY: 0, monScale: 0.85, statVis: 0, duration: 1 }, 4);

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
      camera={{ position: [0, 0, 11], fov: 40 }}
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
