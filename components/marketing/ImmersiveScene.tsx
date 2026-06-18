'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, AdaptiveDpr, Text } from '@react-three/drei';
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
        <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.064} color="#c8d8f0" anchorX="left" anchorY="middle">WebsiteAgent</Text>
        {['Služby', 'Portfolio', 'Ceník', 'Blog'].map((label, i) => (
          <Text key={i} position={[-0.28 + i * 0.39, 0.99, Z + 0.003]} fontSize={0.048} color="#1e3a5a" anchorX="center" anchorY="middle">{label}</Text>
        ))}
        <mesh position={[1.46, 0.99, Z + 0.002]}>
          <boxGeometry args={[0.28, 0.1, 0.001]} />
          <meshBasicMaterial color="#1d4ed8" />
        </mesh>
        <Text position={[1.46, 0.99, Z + 0.004]} fontSize={0.054} color="#ffffff" anchorX="center" anchorY="middle">Zacit</Text>
      </group>

      {/* BADGE */}
      <group ref={gBadge}>
        <mesh position={[-1.08, 0.77, Z]}>
          <boxGeometry args={[0.54, 0.09, 0.001]} />
          <meshBasicMaterial color="#0f2a5c" />
        </mesh>
        <Text position={[-1.08, 0.77, Z + 0.003]} fontSize={0.046} color="#60a5fa" anchorX="center" anchorY="middle">Hodnoceni 5/5 hvezd</Text>
      </group>

      {/* HEADLINE */}
      <group ref={gH1}>
        <Text position={[-1.29, 0.62, Z + 0.003]} fontSize={0.105} color="#d0e4ff" anchorX="left" anchorY="middle">Vas web</Text>
        <Text position={[-1.29, 0.46, Z + 0.003]} fontSize={0.105} color="#3b82f6" anchorX="left" anchorY="middle">do 48 hodin</Text>
        <mesh position={[0.22, 0.46, Z + 0.001]}>
          <boxGeometry args={[0.018, 0.10, 0.001]} />
          <meshBasicMaterial ref={cursorMat} color="#60a5fa" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* SUB TEXT */}
      <group ref={gSub}>
        <Text position={[-1.69, 0.31, Z + 0.002]} fontSize={0.052} color="#2a4a6a" anchorX="left" anchorY="middle">Profesionalni weby pro ceske firmy.</Text>
        <Text position={[-1.69, 0.21, Z + 0.002]} fontSize={0.052} color="#1e3a56" anchorX="left" anchorY="middle">Bez zalohy, bez zavazku.</Text>
        <Text position={[-1.69, 0.12, Z + 0.002]} fontSize={0.052} color="#162e44" anchorX="left" anchorY="middle">Vysledky do 2 pracovnich dnu.</Text>
      </group>

      {/* CTA BUTTONS */}
      <group ref={gCta}>
        <mesh position={[-1.04, -0.05, Z]}>
          <boxGeometry args={[0.64, 0.17, 0.001]} />
          <meshBasicMaterial color="#1d4ed8" />
        </mesh>
        <Text position={[-1.04, -0.05, Z + 0.003]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle">Ziskat web</Text>
        <mesh position={[-0.32, -0.05, Z]}>
          <boxGeometry args={[0.52, 0.17, 0.001]} />
          <meshBasicMaterial color="#0a1528" />
        </mesh>
        <mesh position={[-0.32, -0.05, Z + 0.001]}>
          <boxGeometry args={[0.52, 0.17, 0.001]} />
          <meshBasicMaterial color="#1a3060" transparent opacity={0.4} />
        </mesh>
        <Text position={[-0.32, -0.05, Z + 0.003]} fontSize={0.062} color="#7aaabf" anchorX="center" anchorY="middle">Zjistit vice</Text>
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
        <Text position={[0.42, 0.9, Z + 0.007]} fontSize={0.046} color="#22c55e" anchorX="left" anchorY="middle">LIVE</Text>
        <Text position={[0.92, 0.9, Z + 0.007]} fontSize={0.046} color="#2a4060" anchorX="center" anchorY="middle">Vykon webu</Text>
        <Text position={[0.38, 0.70, Z + 0.006]} fontSize={0.135} color="#e0eeff" anchorX="left" anchorY="middle">1 247</Text>
        <Text position={[0.38, 0.56, Z + 0.005]} fontSize={0.046} color="#1a3050" anchorX="left" anchorY="middle">Navstevniku / mesic</Text>
        <mesh position={[1.1, 0.70, Z + 0.005]}>
          <boxGeometry args={[0.26, 0.09, 0.001]} />
          <meshBasicMaterial color="#15803d" />
        </mesh>
        <Text position={[1.1, 0.70, Z + 0.007]} fontSize={0.052} color="#4ade80" anchorX="center" anchorY="middle">+34%</Text>
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
        {([
          [-1.2, '#3b82f6', '48h',  'Dodani'],
          [-0.4, '#a78bfa', '50+',  'Webu'],
          [ 0.4, '#34d399', '100%', 'Spokojenost'],
          [ 1.2, '#f59e0b', '0 Kc', 'Zaloha'],
        ] as const).map(([x, c, val, label]) => (
          <group key={x}>
            <Text position={[x, -0.29, Z + 0.003]} fontSize={0.080} color={c} anchorX="center" anchorY="middle">{val}</Text>
            <Text position={[x, -0.43, Z + 0.003]} fontSize={0.040} color="#1a2e44" anchorX="center" anchorY="middle">{label}</Text>
          </group>
        ))}
      </group>

      {/* BOTTOM CARDS */}
      <group ref={gBottom}>
        {([
          [-1.1,  '#06111e', '#2563eb', 'SEO',      'Optimalizace zdarma'],
          [-0.04, '#090820', '#7c3aed', 'Speed',    'PageSpeed 99/100'],
          [ 1.04, '#041410', '#059669', 'Mobile',   'Responzivni design'],
        ] as const).map(([x, bg, accent, title, sub], i) => (
          <group key={i} position={[x, -0.76, Z]}>
            <mesh>
              <boxGeometry args={[0.96, 0.42, 0.004]} />
              <meshBasicMaterial color={bg} />
            </mesh>
            <mesh position={[0, 0.2, 0.003]}>
              <boxGeometry args={[0.96, 0.026, 0.001]} />
              <meshBasicMaterial color={accent} />
            </mesh>
            <Text position={[0, 0.06, 0.004]} fontSize={0.072} color="#c0d8f0" anchorX="center" anchorY="middle">{title}</Text>
            <Text position={[0, -0.08, 0.004]} fontSize={0.046} color="#2a4060" anchorX="center" anchorY="middle">{sub}</Text>
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
      {/* NAV */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#030810" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={2.2} />
      </mesh>
      <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.062} color="#c0d4f0" anchorX="left" anchorY="middle">WebsiteAgent</Text>
      {['Sluzby', 'Ceny', 'Portfolio', 'Kontakt'].map((label, i) => (
        <Text key={i} position={[0.28 + i * 0.4, 0.99, Z + 0.002]} fontSize={0.046} color="#1a2d48" anchorX="center" anchorY="middle">{label}</Text>
      ))}
      <mesh position={[1.5, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.26, 0.1, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      <Text position={[1.5, 0.99, Z + 0.004]} fontSize={0.054} color="#ffffff" anchorX="center" anchorY="middle">Chci web</Text>

      {/* Hero bg */}
      <mesh position={[0, 0.37, Z - 0.003]}>
        <boxGeometry args={[3.38, 1.18, 0.001]} />
        <meshBasicMaterial color="#030a1a" />
      </mesh>
      <mesh position={[0, 0.55, Z - 0.002]}>
        <boxGeometry args={[2.4, 0.6, 0.001]} />
        <meshBasicMaterial color="#0a1e50" transparent opacity={0.35} />
      </mesh>

      {/* Headline */}
      <Text position={[0, 0.74, Z + 0.002]} fontSize={0.110} color="#e0eeff" anchorX="center" anchorY="middle">Moderni web</Text>
      <Text position={[0, 0.55, Z + 0.002]} fontSize={0.110} color="#3b82f6" anchorX="center" anchorY="middle">pro vasi firmu</Text>

      {/* Subtext */}
      <Text position={[0, 0.36, Z + 0.001]} fontSize={0.054} color="#1e3a54" anchorX="center" anchorY="middle">Profesionalni web do 48 hodin.</Text>
      <Text position={[0, 0.27, Z + 0.001]} fontSize={0.050} color="#162e44" anchorX="center" anchorY="middle">Bez zalohy. Bez zavazku.</Text>

      {/* CTAs */}
      <mesh position={[-0.4, 0.1, Z]}>
        <boxGeometry args={[0.65, 0.17, 0.001]} />
        <meshBasicMaterial color="#1d4ed8" />
      </mesh>
      <Text position={[-0.4, 0.1, Z + 0.003]} fontSize={0.064} color="#ffffff" anchorX="center" anchorY="middle">Chci web</Text>
      <mesh position={[0.35, 0.1, Z]}>
        <boxGeometry args={[0.52, 0.17, 0.001]} />
        <meshBasicMaterial color="#0d1e38" />
      </mesh>
      <mesh position={[0.35, 0.1, Z + 0.001]}>
        <boxGeometry args={[0.50, 0.15, 0.001]} />
        <meshBasicMaterial color="#1a3060" transparent opacity={0.4} />
      </mesh>
      <Text position={[0.35, 0.1, Z + 0.003]} fontSize={0.064} color="#6a9abf" anchorX="center" anchorY="middle">Ukazky praci</Text>

      {/* Divider */}
      <mesh position={[0, -0.1, Z]}>
        <boxGeometry args={[3.2, 0.003, 0.001]} />
        <meshBasicMaterial color="#0c1e34" />
      </mesh>

      {/* Feature cards */}
      {([
        [-1.05, '#2563eb', '#040c1e', '#0f2a5c', '#3b82f6', 'Rychle dodani', 'Do 48 hodin'],
        [0,     '#7c3aed', '#090820', '#2a1060', '#8b5cf6', 'SEO zdarma',    'Top Google'],
        [1.05,  '#059669', '#041814', '#063028', '#10b981', 'Záruka kvality','100% spokojenost'],
      ] as const).map(([x, accent, bg, circleBg, dotCol, title, sub], i) => (
        <group key={i} position={[x, -0.6, Z]}>
          <mesh>
            <boxGeometry args={[0.95, 0.75, 0.006]} />
            <meshStandardMaterial color={bg} metalness={0.1} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.37, 0.004]}>
            <boxGeometry args={[0.95, 0.006, 0.001]} />
            <meshBasicMaterial color={accent} />
          </mesh>
          <mesh position={[-0.32, 0.18, 0.005]}>
            <circleGeometry args={[0.055, 12]} />
            <meshBasicMaterial color={circleBg} />
          </mesh>
          <mesh position={[-0.32, 0.18, 0.006]}>
            <sphereGeometry args={[0.028, 8, 8]} />
            <meshStandardMaterial color={dotCol} emissive={dotCol} emissiveIntensity={1.8} />
          </mesh>
          <Text position={[0, 0.04, 0.005]} fontSize={0.070} color="#c0d8f0" anchorX="center" anchorY="middle">{title}</Text>
          <Text position={[0, -0.10, 0.005]} fontSize={0.052} color="#2a4a6a" anchorX="center" anchorY="middle">{sub}</Text>
        </group>
      ))}

      {/* Trust bar */}
      <mesh position={[0, -1.0, Z]}>
        <boxGeometry args={[3.38, 0.08, 0.001]} />
        <meshBasicMaterial color="#020710" />
      </mesh>
      {([
        [-1.1,  '48 hodin'],
        [-0.38, '50+ webu'],
        [0.34,  '100% spokojenost'],
        [1.06,  '0 Kc zaloha'],
      ] as const).map(([x, label]) => (
        <Text key={x} position={[x, -1.0, Z + 0.002]} fontSize={0.040} color="#1a2e44" anchorX="center" anchorY="middle">{label}</Text>
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
      {/* NAV */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#050d1e" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2.0} />
      </mesh>
      <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.060} color="#bdd0f0" anchorX="left" anchorY="middle">FirmaXYZ s.r.o.</Text>
      {['O nas', 'Sluzby', 'Reference', 'Blog', 'Kontakt'].map((label, i) => (
        <Text key={i} position={[-0.5 + i * 0.46, 0.99, Z + 0.002]} fontSize={0.044} color="#162540" anchorX="center" anchorY="middle">{label}</Text>
      ))}

      {/* LEFT SIDEBAR */}
      <mesh position={[-1.38, 0.05, Z]}>
        <boxGeometry args={[0.68, 1.78, 0.005]} />
        <meshStandardMaterial color="#030a18" metalness={0.08} roughness={0.92} />
      </mesh>
      <mesh position={[-1.38, 0.93, Z + 0.003]}>
        <boxGeometry args={[0.68, 0.004, 0.001]} />
        <meshBasicMaterial color="#4a1090" transparent opacity={0.6} />
      </mesh>
      {([
        [0.82, 'Prehled',    false],
        [0.68, 'Projekty',   true],
        [0.54, 'Klienti',    false],
        [0.40, 'Faktury',    false],
        [0.26, 'Zpravy',     false],
        [0.12, 'Analyza',    false],
        [-0.02,'Nastaveni',  false],
        [-0.16,'Tym',        false],
      ] as const).map(([y, label, active]) => (
        <Text key={y} position={[-1.38, y, Z + 0.004]} fontSize={0.048} color={active ? '#a78bfa' : '#0e2244'} anchorX="center" anchorY="middle">{label}</Text>
      ))}
      <mesh position={[-1.7, 0.68, Z + 0.003]}>
        <boxGeometry args={[0.006, 0.042, 0.001]} />
        <meshBasicMaterial color="#7c3aed" />
      </mesh>
      <mesh position={[-1.38, -0.55, Z + 0.003]}>
        <boxGeometry args={[0.48, 0.13, 0.001]} />
        <meshBasicMaterial color="#4a1090" />
      </mesh>
      <Text position={[-1.38, -0.55, Z + 0.005]} fontSize={0.052} color="#c4b5fd" anchorX="center" anchorY="middle">+ Novy projekt</Text>

      {/* MAIN CONTENT */}
      <Text position={[-0.42, 0.82, Z + 0.002]} fontSize={0.090} color="#c0d8f0" anchorX="left" anchorY="middle">Aktivni projekty</Text>
      <Text position={[-0.42, 0.66, Z + 0.002]} fontSize={0.072} color="#8bbcf0" anchorX="left" anchorY="middle">3 zakazky v prubehu</Text>
      {([
        [0.50, 'Web pro Restauraci U Novaku'],
        [0.40, 'E-shop AutoDily Praha — faze 2'],
        [0.30, 'Redesign Kavarna Mlyn, Brno'],
      ] as const).map(([y, text]) => (
        <Text key={y} position={[-0.42, y, Z + 0.001]} fontSize={0.042} color="#122040" anchorX="left" anchorY="middle" maxWidth={1.6}>{text}</Text>
      ))}
      <mesh position={[0.35, 0.14, Z]}>
        <boxGeometry args={[1.85, 0.003, 0.001]} />
        <meshBasicMaterial color="#0c1e34" />
      </mesh>

      {/* Blog cards */}
      {([
        [-0.57, '#040a18', '#060e28', '#1a3c9a', '#0f2a5c', '#2563eb', 'SEO',     'Jak zvysit konverze', '12. 6. 2026'],
        [ 0.35, '#040818', '#08061e', '#3a1078', '#200860', '#7c3aed', 'Design',  'Trendy webu 2026',    '8. 6. 2026'],
        [ 1.27, '#040e0c', '#04120c', '#0d4f3c', '#063028', '#059669', 'Rychlost','PageSpeed optimalizace','3. 6. 2026'],
      ] as const).map(([x, bg, imgBg, imgAcc, catBg, catCol, cat, title, date], i) => (
        <group key={i} position={[x, -0.38, Z]}>
          <mesh>
            <boxGeometry args={[0.82, 0.78, 0.005]} />
            <meshStandardMaterial color={bg} metalness={0.1} roughness={0.9} />
          </mesh>
          <mesh position={[0, 0.25, 0.003]}>
            <boxGeometry args={[0.82, 0.32, 0.001]} />
            <meshBasicMaterial color={imgBg} />
          </mesh>
          <mesh position={[0, 0.25, 0.004]}>
            <boxGeometry args={[0.82, 0.32, 0.001]} />
            <meshBasicMaterial color={imgAcc} transparent opacity={0.3} />
          </mesh>
          <mesh position={[-0.22, 0.05, 0.004]}>
            <boxGeometry args={[0.26, 0.060, 0.001]} />
            <meshBasicMaterial color={catBg} />
          </mesh>
          <Text position={[-0.22, 0.05, 0.006]} fontSize={0.040} color={catCol} anchorX="center" anchorY="middle">{cat}</Text>
          <Text position={[0, -0.09, 0.005]} fontSize={0.054} color="#a0c0e0" anchorX="center" anchorY="middle" maxWidth={0.70}>{title}</Text>
          <Text position={[-0.15, -0.30, 0.005]} fontSize={0.036} color="#1a3040" anchorX="left" anchorY="middle">{date}</Text>
        </group>
      ))}

      {/* FOOTER */}
      <mesh position={[0, -0.98, Z]}>
        <boxGeometry args={[3.38, 0.1, 0.001]} />
        <meshBasicMaterial color="#020710" />
      </mesh>
      {([[-1.1, 'WebsiteAgent'], [-0.28, 'Podminky'], [0.54, 'GDPR'], [1.36, '2026']] as const).map(([x, text]) => (
        <Text key={x} position={[x, -0.98, Z + 0.002]} fontSize={0.036} color="#0e1e34" anchorX="center" anchorY="middle">{text}</Text>
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
  const PROD_COLORS = ['#061420','#08101e','#060c18','#04100c','#080618','#060e10'] as const;
  const ACCENT      = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#3b82f6','#8b5cf6'] as const;
  const BTN_BG      = ['#0f2a5c','#200860','#063028','#3a1808','#0f2a5c','#200860'] as const;
  const IMG_BG      = ['#04101a','#07051a','#041008','#0c0804','#04101a','#07051a'] as const;
  const PRODUCTS = [
    { name: 'Starter web',   price: '9 900 Kc',  cat: 'Zakladni'  },
    { name: 'Business web',  price: '14 900 Kc', cat: 'Oblibeny'  },
    { name: 'E-shop reseni', price: '24 900 Kc', cat: 'Premium'   },
    { name: 'Landing page',  price: '6 900 Kc',  cat: 'Rychle'    },
    { name: 'Redesign webu', price: '12 900 Kc', cat: 'Renovace'  },
    { name: 'SEO balicek',   price: '4 900 Kc',  cat: 'Mesicne'   },
  ] as const;

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
      <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.062} color="#b0d0e0" anchorX="left" anchorY="middle">WebsiteAgent</Text>
      {/* Search bar */}
      <mesh position={[0.2, 0.99, Z + 0.002]}>
        <boxGeometry args={[1.3, 0.09, 0.001]} />
        <meshBasicMaterial color="#070e1a" />
      </mesh>
      <mesh position={[0.2, 0.99, Z + 0.003]}>
        <boxGeometry args={[1.28, 0.07, 0.001]} />
        <meshBasicMaterial color="#0c1828" />
      </mesh>
      <Text position={[-0.36, 0.99, Z + 0.005]} fontSize={0.046} color="#1e3040" anchorX="left" anchorY="middle">Hledat sluzbu...</Text>
      {/* Cart */}
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
      {([
        [0.82,  'KATEGORIE', true],
        [0.60,  'Weby',      false],
        [0.48,  'E-shopy',   false],
        [0.20,  'CENA',      true],
        [-0.05, 'do 15 000', false],
        [-0.42, 'DODANI',    true],
        [-0.65, 'do 48h',    false],
      ] as const).map(([y, label, isHeader]) => (
        <Text key={y} position={[-1.38, y, Z + 0.004]} fontSize={isHeader ? 0.042 : 0.038} color={isHeader ? '#1e3a50' : '#0a1e30'} anchorX="center" anchorY="middle">{label}</Text>
      ))}
      {/* Checkboxes */}
      {([0.60, 0.48, -0.05, -0.65] as const).map((y, i) => (
        <mesh key={y} position={[-1.68, y, Z + 0.004]}>
          <boxGeometry args={[0.040, 0.040, 0.001]} />
          <meshBasicMaterial color={i < 2 ? '#0f4d3c' : '#0a1525'} />
        </mesh>
      ))}

      {/* PRODUCT GRID — 2 rows × 3 cols */}
      {PRODUCTS.map((prod, i) => {
        const x = -0.48 + (i % 3) * 0.83;
        const y = 0.42 - Math.floor(i / 3) * 0.82;
        return (
          <group key={i} position={[x, y, Z]}>
            <mesh>
              <boxGeometry args={[0.78, 0.76, 0.005]} />
              <meshStandardMaterial color={PROD_COLORS[i]} metalness={0.1} roughness={0.9} />
            </mesh>
            <mesh position={[0, 0.19, 0.003]}>
              <boxGeometry args={[0.78, 0.38, 0.001]} />
              <meshBasicMaterial color={IMG_BG[i]} />
            </mesh>
            <mesh position={[0, 0.19, 0.004]}>
              <boxGeometry args={[0.78, 0.38, 0.001]} />
              <meshBasicMaterial color={ACCENT[i]} transparent opacity={0.12} />
            </mesh>
            <Text position={[0, 0.19, 0.006]} fontSize={0.058} color={ACCENT[i]} anchorX="center" anchorY="middle">{prod.cat}</Text>
            <Text position={[0, -0.08, 0.005]} fontSize={0.060} color="#a0bcd4" anchorX="center" anchorY="middle">{prod.name}</Text>
            <Text position={[-0.16, -0.21, 0.005]} fontSize={0.056} color={ACCENT[i]} anchorX="left" anchorY="middle">{prod.price}</Text>
            <mesh position={[0, -0.32, 0.004]}>
              <boxGeometry args={[0.6, 0.10, 0.001]} />
              <meshBasicMaterial color={BTN_BG[i]} />
            </mesh>
            <Text position={[0, -0.32, 0.006]} fontSize={0.048} color={ACCENT[i]} anchorX="center" anchorY="middle">Objednat</Text>
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
