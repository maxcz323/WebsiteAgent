'use client';

import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
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
   FLOATING SERVICE CARDS
═══════════════════════════════════════════════════════════════ */
function ServiceCards() {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const tx = -3.8 + (1 - SV.svcVis) * 6;
    g.current.position.x += (tx - g.current.position.x) * 0.06;
    g.current.children.forEach((c, i) => {
      (c as THREE.Group).position.y = [0.85, 0, -0.85][i] + Math.sin(t * 0.55 + i * 1.2) * 0.06;
    });
  });
  return (
    <group ref={g} position={[-3.8, 0, 0]}>
      {([
        { c: '#2563eb', label: 'Landing page',  price: '9 900 Kč' },
        { c: '#7c3aed', label: 'Firemní web',   price: '14 900 Kč' },
        { c: '#059669', label: 'E-commerce',    price: '24 900 Kč' },
      ] as const).map((s, i) => (
        <group key={i} position={[0, [0.85, 0, -0.85][i], 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.5, 0.025]} />
            <meshStandardMaterial color="#0a1020" transparent opacity={0.9} />
          </mesh>
          <mesh position={[-1.07, 0, 0.015]}>
            <boxGeometry args={[0.04, 0.5, 0.01]} />
            <meshStandardMaterial color={s.c} emissive={s.c} emissiveIntensity={1.2} />
          </mesh>
          {/* Label block */}
          <mesh position={[0, 0.1, 0.015]}>
            <boxGeometry args={[1.5, 0.1, 0.001]} />
            <meshBasicMaterial color="#e2e8f0" />
          </mesh>
          <mesh position={[0.1, -0.1, 0.015]}>
            <boxGeometry args={[0.8, 0.07, 0.001]} />
            <meshBasicMaterial color={s.c} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO CARDS
═══════════════════════════════════════════════════════════════ */
const PORT = [
  { x: 2.7,  y: 0.85,  z: -0.5, c1: '#1d4ed8', c2: '#3b82f6' },
  { x: 2.7,  y: -0.55, z: -1.0, c1: '#0f766e', c2: '#0d9488' },
  { x: -2.7, y: 0.85,  z: -0.5, c1: '#d97706', c2: '#f59e0b' },
  { x: -2.7, y: -0.55, z: -1.0, c1: '#7c3aed', c2: '#a78bfa' },
] as const;

function PortCard({ idx }: { idx: number }) {
  const ref = useRef<THREE.Group>(null!);
  const { x, y, z, c1 } = PORT[idx];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const target = SV.portVis > 0.01 ? 1 : 0;
    ref.current.scale.setScalar(ref.current.scale.x + (target - ref.current.scale.x) * 0.07);
    ref.current.position.y = y + Math.sin(t * 0.45 + idx * 1.5) * 0.09;
    ref.current.rotation.y = Math.sin(t * 0.28 + idx) * 0.05;
  });
  return (
    <group ref={ref} position={[x, y, z]} scale={0}>
      <mesh>
        <boxGeometry args={[2.0, 1.2, 0.04]} />
        <meshStandardMaterial color={c1} metalness={0.1} roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.45, 0.025]}>
        <boxGeometry args={[1.5, 0.1, 0.001]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[-0.4, 0.25, 0.025]}>
        <boxGeometry args={[0.55, 0.25, 0.001]} />
        <meshBasicMaterial color="rgba(255,255,255,0.18)" />
      </mesh>
    </group>
  );
}

function ProjectPanels() {
  return <>{PORT.map((_, i) => <PortCard key={i} idx={i} />)}</>;
}

/* ═══════════════════════════════════════════════════════════════
   STAT ORBS
═══════════════════════════════════════════════════════════════ */
const STATS = [
  { x: -2.3, y: 1.35 },
  { x:  2.3, y: 1.35 },
  { x: -2.3, y: -1.05 },
  { x:  2.3, y: -1.05 },
] as const;

function StatOrb({ idx }: { idx: number }) {
  const ref = useRef<THREE.Group>(null!);
  const { x, y } = STATS[idx];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const target = SV.statVis > 0.01 ? 1 : 0;
    ref.current.scale.setScalar(ref.current.scale.x + (target - ref.current.scale.x) * 0.07);
    ref.current.position.y = y + Math.sin(t * 0.4 + idx) * 0.07;
    ref.current.rotation.y = t * 0.2 + idx;
  });
  return (
    <group ref={ref} position={[x, y, 0.5]} scale={0}>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#080e1a" metalness={0.5} roughness={0.4} transparent opacity={0.92} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.6, 0.014, 8, 64]} />
        <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={1.0} transparent opacity={0.7} />
      </mesh>
      {/* Cross accent */}
      <mesh position={[0, 0, 0.56]}>
        <boxGeometry args={[0.22, 0.04, 0.001]} />
        <meshBasicMaterial color="white" />
      </mesh>
      <mesh position={[0, 0, 0.56]}>
        <boxGeometry args={[0.04, 0.22, 0.001]} />
        <meshBasicMaterial color="white" />
      </mesh>
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
