'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Text } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   SHARED STATE  (GSAP writes every frame, useFrame reads)
═══════════════════════════════════════════════════════════════ */
const SV = {
  camX: 0,    camY: 0.2,   camZ: 11.0,
  monRotX: 0, monRotY: 0,  monScale: 1.18,
  monX: 0,    monY: 0.05,
  buildProgress: 0,
  explodeProgress: 0,
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
      {/* Minimal thin stand */}
      <mesh position={[0, -1.36, -0.01]}>
        <cylinderGeometry args={[0.022, 0.028, 0.44, 8]} />
        <meshStandardMaterial color="#060810" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.60, -0.01]}>
        <boxGeometry args={[0.72, 0.022, 0.32]} />
        <meshStandardMaterial color="#05070c" metalness={0.9} roughness={0.1} />
      </mesh>
    </>
  );
}

const STAND_PARTS = new Set(['Neck', 'NeckTaper', 'Base', 'BaseChamfer', 'BaseReflection']);

function MonitorGLTF() {
  const { scene } = useGLTF('/models/monitor.glb');
  const cloned = useMemo(() => {
    const c = scene.clone(true);
    c.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh) {
        if (STAND_PARTS.has(obj.name)) {
          obj.visible = false;
        } else {
          (obj as THREE.Mesh).material = new THREE.MeshStandardMaterial({
            color: '#07090f', metalness: 0.88, roughness: 0.12,
          });
        }
      }
    });
    return c;
  }, [scene]);
  return <primitive object={cloned} scale={1.0} />;
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 0 (IDEA)
   Client intake form / concept brief
═══════════════════════════════════════════════════════════════ */
/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 0 (HERO / BUILD ANIMATION)
   Groups snap in sequentially based on SV.buildProgress
═══════════════════════════════════════════════════════════════ */
function ScreenHero({ building }: { building: boolean }) {
  const gInitial = useRef<THREE.Group>(null!);
  const gNav    = useRef<THREE.Group>(null!);
  const gBadge  = useRef<THREE.Group>(null!);
  const gH1     = useRef<THREE.Group>(null!);
  const gSub    = useRef<THREE.Group>(null!);
  const gCta    = useRef<THREE.Group>(null!);
  const gCard   = useRef<THREE.Group>(null!);
  const gStats  = useRef<THREE.Group>(null!);
  const gBottom = useRef<THREE.Group>(null!);

  const cursorMat    = useRef<THREE.MeshBasicMaterial>(null!);
  const liveDotMat   = useRef<THREE.MeshStandardMaterial>(null!);
  const lineRef      = useRef<THREE.Mesh>(null!);
  const initDotMat   = useRef<THREE.MeshStandardMaterial>(null!);
  const initLineMat  = useRef<THREE.MeshBasicMaterial>(null!);

  const snap = (grp: React.MutableRefObject<THREE.Group>, vis: number) => {
    if (!grp.current) return;
    grp.current.scale.setScalar(grp.current.scale.x + (vis - grp.current.scale.x) * 0.08);
  };

  useFrame(({ clock }) => {
    const t  = clock.elapsedTime;
    const bp = building ? SV.buildProgress : 1;
    const v  = (from: number, to: number) =>
      Math.max(0, Math.min(1, (bp - from) / Math.max(to - from, 0.001)));

    // Initial splash — visible at 0, fades out before main content appears
    snap(gInitial, 1 - v(0, 0.18));

    snap(gNav,    v(0.04, 0.22));
    snap(gBadge,  v(0.24, 0.42));
    snap(gH1,     v(0.44, 0.62));
    snap(gSub,    v(0.58, 0.74));
    snap(gCta,    v(0.70, 0.84));
    snap(gCard,   v(0.78, 0.94));
    snap(gStats,  v(0.86, 1.00));
    snap(gBottom, v(0.92, 1.00));

    if (cursorMat.current) cursorMat.current.opacity = Math.sin(t * 3.5) > 0 ? 0.9 : 0;
    if (liveDotMat.current) liveDotMat.current.emissiveIntensity = 1.2 + Math.sin(t * 4) * 0.8;
    if (lineRef.current) lineRef.current.scale.x = 0.85 + Math.sin(t * 0.6) * 0.12;
    if (initDotMat.current) initDotMat.current.emissiveIntensity = 1.5 + Math.sin(t * 2.2) * 0.8;
    if (initLineMat.current) initLineMat.current.opacity = 0.18 + Math.sin(t * 0.8) * 0.06;
  });

  const Z = 0.083;
  return (
    <>
      {/* INITIAL SPLASH — visible before scrolling, fades as content builds in */}
      <group ref={gInitial}>
        {/* Subtle horizontal grid lines */}
        {[-0.6, -0.1, 0.4, 0.9].map((y, i) => (
          <mesh key={i} position={[0, y, Z - 0.001]}>
            <boxGeometry args={[3.4, 0.001, 0.001]} />
            <meshBasicMaterial ref={i === 0 ? initLineMat : undefined} color="#0d1e38" transparent opacity={0.18} />
          </mesh>
        ))}

        {/* Center logo dot */}
        <mesh position={[0, 0.22, Z + 0.01]}>
          <sphereGeometry args={[0.048, 16, 16]} />
          <meshStandardMaterial ref={initDotMat} color="#2563eb" emissive="#2563eb" emissiveIntensity={2.0} />
        </mesh>

        {/* Brand name */}
        <Text position={[0, 0.04, Z + 0.008]} fontSize={0.13} color="#d8ecff" anchorX="center" anchorY="middle" letterSpacing={0.04}>
          WebsiteAgent
        </Text>

        {/* Tagline */}
        <Text position={[0, -0.14, Z + 0.007]} fontSize={0.058} color="#2563eb" anchorX="center" anchorY="middle" letterSpacing={0.01}>
          Profesionální weby do 48 hodin
        </Text>

        {/* Divider line */}
        <mesh position={[0, -0.30, Z + 0.006]}>
          <boxGeometry args={[0.64, 0.002, 0.001]} />
          <meshBasicMaterial color="#1e3a6a" />
        </mesh>

        {/* Three stat pills */}
        {([
          [-0.78, '#1a3870', '#60a5fa', '48h',   'dodání'],
          [ 0.00, '#0d3020', '#34d399', '0 Kč',  'záloha'],
          [ 0.78, '#2a1a50', '#a78bfa', '50+',   'projektů'],
        ] as const).map(([x, bg, accent, val, label]) => (
          <group key={x} position={[x, -0.52, Z + 0.005]}>
            <mesh>
              <boxGeometry args={[0.44, 0.22, 0.001]} />
              <meshBasicMaterial color={bg} />
            </mesh>
            <Text position={[0, 0.04, 0.003]} fontSize={0.076} color={accent} anchorX="center" anchorY="middle">{val}</Text>
            <Text position={[0, -0.06, 0.003]} fontSize={0.036} color="#3a5878" anchorX="center" anchorY="middle">{label}</Text>
          </group>
        ))}

        {/* Browser-style address bar at top */}
        <mesh position={[0, 0.94, Z + 0.004]}>
          <boxGeometry args={[2.2, 0.09, 0.001]} />
          <meshBasicMaterial color="#0c1a30" />
        </mesh>
        <mesh position={[-0.86, 0.94, Z + 0.006]}>
          <sphereGeometry args={[0.014, 8, 8]} />
          <meshBasicMaterial color="#22c55e" />
        </mesh>
        <Text position={[0.04, 0.94, Z + 0.007]} fontSize={0.038} color="#2a4a6a" anchorX="center" anchorY="middle">
          websiteagent.cz
        </Text>
      </group>

      {/* NAV */}
      <group ref={gNav}>
        <mesh position={[0, 0.99, Z]}>
          <boxGeometry args={[3.38, 0.19, 0.001]} />
          <meshBasicMaterial color="#0c2040" />
        </mesh>
        <mesh position={[-1.42, 0.99, Z + 0.004]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={3.0} />
        </mesh>
        <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.064} color="#d8ecff" anchorX="left" anchorY="middle">WebsiteAgent</Text>
        {['Služby', 'Portfolio', 'Ceník', 'Blog'].map((label, i) => (
          <Text key={i} position={[-0.28 + i * 0.39, 0.99, Z + 0.003]} fontSize={0.048} color="#3a6090" anchorX="center" anchorY="middle">{label}</Text>
        ))}
        <mesh position={[1.46, 0.99, Z + 0.002]}>
          <boxGeometry args={[0.28, 0.1, 0.001]} />
          <meshBasicMaterial color="#2563eb" />
        </mesh>
        <Text position={[1.46, 0.99, Z + 0.004]} fontSize={0.054} color="#ffffff" anchorX="center" anchorY="middle">Začít</Text>
      </group>

      {/* STAGE LABEL */}
      <Text position={[-1.58, 0.84, Z + 0.003]} fontSize={0.038} color="#2563eb" anchorX="left" anchorY="middle">01 / DESIGN</Text>

      {/* BADGE */}
      <group ref={gBadge}>
        <mesh position={[-1.08, 0.77, Z]}>
          <boxGeometry args={[0.54, 0.09, 0.001]} />
          <meshBasicMaterial color="#1e4a88" />
        </mesh>
        <Text position={[-1.08, 0.77, Z + 0.003]} fontSize={0.046} color="#93c5fd" anchorX="center" anchorY="middle">Hodnocení 5/5 hvězd</Text>
      </group>

      {/* HEADLINE */}
      <group ref={gH1}>
        <Text position={[-1.29, 0.62, Z + 0.003]} fontSize={0.105} color="#e8f4ff" anchorX="left" anchorY="middle">Váš web</Text>
        <Text position={[-1.29, 0.46, Z + 0.003]} fontSize={0.105} color="#60a5fa" anchorX="left" anchorY="middle">do 48 hodin</Text>
        <mesh position={[0.22, 0.46, Z + 0.001]}>
          <boxGeometry args={[0.018, 0.10, 0.001]} />
          <meshBasicMaterial ref={cursorMat} color="#93c5fd" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* SUB TEXT */}
      <group ref={gSub}>
        <Text position={[-1.69, 0.31, Z + 0.002]} fontSize={0.052} color="#4a80b0" anchorX="left" anchorY="middle">Profesionální weby pro české firmy.</Text>
        <Text position={[-1.69, 0.21, Z + 0.002]} fontSize={0.052} color="#3a6a8a" anchorX="left" anchorY="middle">Bez zálohy, bez závazku.</Text>
        <Text position={[-1.69, 0.12, Z + 0.002]} fontSize={0.052} color="#2a5070" anchorX="left" anchorY="middle">Výsledky do 2 pracovních dnů.</Text>
      </group>

      {/* CTA BUTTONS */}
      <group ref={gCta}>
        <mesh position={[-1.04, -0.05, Z]}>
          <boxGeometry args={[0.64, 0.17, 0.001]} />
          <meshBasicMaterial color="#2563eb" />
        </mesh>
        <Text position={[-1.04, -0.05, Z + 0.003]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle">Získat web</Text>
        <mesh position={[-0.32, -0.05, Z]}>
          <boxGeometry args={[0.52, 0.17, 0.001]} />
          <meshBasicMaterial color="#1a3870" transparent opacity={0.55} />
        </mesh>
        <Text position={[-0.32, -0.05, Z + 0.003]} fontSize={0.062} color="#9abdd8" anchorX="center" anchorY="middle">Zjistit více</Text>
      </group>

      {/* DASHBOARD CARD */}
      <group ref={gCard}>
        <mesh position={[0.92, 0.42, Z]}>
          <boxGeometry args={[1.32, 0.98, 0.006]} />
          <meshBasicMaterial color="#0d1e38" />
        </mesh>
        <mesh position={[0.92, 0.9, Z + 0.005]}>
          <boxGeometry args={[1.32, 0.09, 0.001]} />
          <meshBasicMaterial color="#101e35" />
        </mesh>
        <mesh position={[0.34, 0.9, Z + 0.008]}>
          <sphereGeometry args={[0.022, 8, 8]} />
          <meshStandardMaterial ref={liveDotMat} color="#22c55e" emissive="#22c55e" emissiveIntensity={1.8} />
        </mesh>
        <Text position={[0.42, 0.9, Z + 0.007]} fontSize={0.046} color="#22c55e" anchorX="left" anchorY="middle">LIVE</Text>
        <Text position={[0.92, 0.9, Z + 0.007]} fontSize={0.046} color="#4a6a8a" anchorX="center" anchorY="middle">Výkon webu</Text>
        <Text position={[0.38, 0.70, Z + 0.006]} fontSize={0.135} color="#e8f4ff" anchorX="left" anchorY="middle">1 247</Text>
        <Text position={[0.38, 0.56, Z + 0.005]} fontSize={0.046} color="#3a5a80" anchorX="left" anchorY="middle">Návštěvníků / měsíc</Text>
        <mesh position={[1.1, 0.70, Z + 0.005]}>
          <boxGeometry args={[0.26, 0.09, 0.001]} />
          <meshBasicMaterial color="#166534" />
        </mesh>
        <Text position={[1.1, 0.70, Z + 0.007]} fontSize={0.052} color="#4ade80" anchorX="center" anchorY="middle">+34%</Text>
        <mesh ref={lineRef} position={[0.92, 0.45, Z + 0.005]}>
          <boxGeometry args={[1.1, 0.028, 0.001]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
      </group>

      {/* STATS BAND */}
      <group ref={gStats}>
        <mesh position={[0, -0.35, Z - 0.001]}>
          <boxGeometry args={[3.38, 0.27, 0.001]} />
          <meshBasicMaterial color="#091826" />
        </mesh>
        {([
          [-1.2, '#60a5fa', '48h',  'Dodání'],
          [-0.4, '#22d3ee', '50+',  'Webů'],
          [ 0.4, '#34d399', '100%', 'Spokojenost'],
          [ 1.2, '#f59e0b', '0 Kč', 'Záloha'],
        ] as const).map(([x, c, val, label]) => (
          <group key={x}>
            <Text position={[x, -0.29, Z + 0.003]} fontSize={0.080} color={c} anchorX="center" anchorY="middle">{val}</Text>
            <Text position={[x, -0.43, Z + 0.003]} fontSize={0.040} color="#3a5270" anchorX="center" anchorY="middle">{label}</Text>
          </group>
        ))}
      </group>

      {/* BOTTOM CARDS */}
      <group ref={gBottom}>
        {([
          [-1.1,  '#0e2238', '#2563eb', 'SEO',    'Optimalizace zdarma'],
          [-0.04, '#121030', '#22d3ee', 'Speed',  'PageSpeed 99/100'],
          [ 1.04, '#0a2420', '#10b981', 'Mobile', 'Responzivní design'],
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
            <Text position={[0, 0.06, 0.004]} fontSize={0.072} color="#ddf0ff" anchorX="center" anchorY="middle">{title}</Text>
            <Text position={[0, -0.08, 0.004]} fontSize={0.046} color="#4a6a8a" anchorX="center" anchorY="middle">{sub}</Text>
          </group>
        ))}
      </group>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 1 (PROCESS — how it works)
   Clean 3-step timeline — monitor supports, doesn't dominate
═══════════════════════════════════════════════════════════════ */
function ScreenProcess() {
  const Z = 0.083;
  return (
    <>
      {/* NAV */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#0c1830" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3.0} />
      </mesh>
      <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.060} color="#d8ecff" anchorX="left" anchorY="middle">WebsiteAgent</Text>

      {/* Stage + Title */}
      <Text position={[-1.58, 0.82, Z + 0.003]} fontSize={0.036} color="#2563eb" anchorX="left" anchorY="middle">02 / PROCES</Text>
      <Text position={[-1.58, 0.66, Z + 0.003]} fontSize={0.072} color="#c8ddf0" anchorX="left" anchorY="middle">Jak pracujeme</Text>

      {/* 3 Steps */}
      {([
        [0.34,  '01', 'Sdělíte nám co potřebujete', '3 min'],
        [-0.12, '02', 'Navrhneme a vytvoříme web',   '24 h' ],
        [-0.58, '03', 'Váš web je živě online',       '48 h' ],
      ] as const).map(([y, n, label, time], i) => (
        <group key={i}>
          <mesh position={[0, y + 0.24, Z]}>
            <boxGeometry args={[3.1, 0.002, 0.001]} />
            <meshBasicMaterial color="#102030" />
          </mesh>
          <Text position={[-1.55, y + 0.06, Z + 0.003]} fontSize={0.038} color="#1e3a5e" anchorX="left" anchorY="middle">{n}</Text>
          <Text position={[-1.30, y + 0.06, Z + 0.003]} fontSize={0.072} color="#c8ddf0" anchorX="left" anchorY="middle">{label}</Text>
          <Text position={[1.55, y + 0.06, Z + 0.003]} fontSize={0.040} color="#1e3a5e" anchorX="right" anchorY="middle">{time}</Text>
        </group>
      ))}

      {/* Bottom rule */}
      <mesh position={[0, -0.82, Z]}>
        <boxGeometry args={[3.1, 0.002, 0.001]} />
        <meshBasicMaterial color="#102030" />
      </mesh>

      {/* Trust bar */}
      <mesh position={[0, -0.99, Z]}>
        <boxGeometry args={[3.38, 0.08, 0.001]} />
        <meshBasicMaterial color="#060e18" />
      </mesh>
      {([[-1.1,'48 hodin'],[-0.38,'bez zálohy'],[0.34,'na míru'],[1.1,'50+ projektů']] as const).map(([x, t]) => (
        <Text key={x} position={[x, -0.99, Z + 0.002]} fontSize={0.034} color="#1e3448" anchorX="center" anchorY="middle">{t}</Text>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 4 (RESULTS)
   Analytics dashboard — traffic, conversions, revenue
═══════════════════════════════════════════════════════════════ */
function ScreenResults() {
  const Z = 0.083;
  const liveDotMat = useRef<THREE.MeshStandardMaterial>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (liveDotMat.current) liveDotMat.current.emissiveIntensity = 1.0 + Math.sin(t * 3) * 0.8;
  });
  const BAR_H = [0.12, 0.18, 0.14, 0.22, 0.26, 0.20, 0.30, 0.34, 0.28, 0.38, 0.44, 0.50] as const;
  return (
    <>
      {/* NAV */}
      <mesh position={[0, 0.99, Z]}><boxGeometry args={[3.38, 0.17, 0.001]} /><meshBasicMaterial color="#0a1c30" /></mesh>
      <Text position={[-1.58, 0.99, Z + 0.003]} fontSize={0.054} color="#d0e8ff" anchorX="left" anchorY="middle">WebsiteAgent</Text>
      <mesh position={[0.56, 0.99, Z + 0.002]}><boxGeometry args={[0.001, 0.09, 0.001]} /><meshBasicMaterial color="#1a3050" /></mesh>
      <Text position={[0.76, 0.99, Z + 0.003]} fontSize={0.044} color="#3a5878" anchorX="left" anchorY="middle">Analytika</Text>
      <mesh position={[1.38, 0.99, Z + 0.004]}>
        <sphereGeometry args={[0.018, 8, 8]} />
        <meshStandardMaterial ref={liveDotMat} color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </mesh>
      <Text position={[1.46, 0.99, Z + 0.003]} fontSize={0.040} color="#22c55e" anchorX="left" anchorY="middle">LIVE</Text>

      {/* Stage label */}
      <Text position={[-1.58, 0.82, Z + 0.003]} fontSize={0.038} color="#22d3ee" anchorX="left" anchorY="middle">03 / VÝSLEDKY</Text>

      {/* Big visitor count */}
      <mesh position={[-0.52, 0.53, Z + 0.001]}><boxGeometry args={[1.88, 0.60, 0.003]} /><meshBasicMaterial color="#0a1c30" /></mesh>
      <Text position={[-0.52, 0.71, Z + 0.004]} fontSize={0.115} color="#e8f4ff" anchorX="center" anchorY="middle">12,847</Text>
      <Text position={[-0.52, 0.56, Z + 0.004]} fontSize={0.040} color="#3a6080" anchorX="center" anchorY="middle">návštěv tento měsíc</Text>
      <mesh position={[-0.52, 0.39, Z + 0.004]}><boxGeometry args={[0.68, 0.09, 0.001]} /><meshBasicMaterial color="#0d3020" /></mesh>
      <Text position={[-0.52, 0.39, Z + 0.006]} fontSize={0.048} color="#22c55e" anchorX="center" anchorY="middle">↑ +127%</Text>

      {/* Right metric cards */}
      <mesh position={[0.94, 0.68, Z + 0.001]}><boxGeometry args={[0.84, 0.28, 0.003]} /><meshBasicMaterial color="#0a1c30" /></mesh>
      <Text position={[0.94, 0.78, Z + 0.004]} fontSize={0.078} color="#22d3ee" anchorX="center" anchorY="middle">4.2%</Text>
      <Text position={[0.94, 0.64, Z + 0.004]} fontSize={0.034} color="#3a5878" anchorX="center" anchorY="middle">konverzní poměr</Text>

      <mesh position={[0.94, 0.32, Z + 0.001]}><boxGeometry args={[0.84, 0.28, 0.003]} /><meshBasicMaterial color="#0a1c30" /></mesh>
      <Text position={[0.94, 0.42, Z + 0.004]} fontSize={0.078} color="#f59e0b" anchorX="center" anchorY="middle">142k</Text>
      <Text position={[0.94, 0.28, Z + 0.004]} fontSize={0.034} color="#3a5878" anchorX="center" anchorY="middle">Kč tržby</Text>

      {/* Chart */}
      <mesh position={[0, -0.15, Z + 0.001]}><boxGeometry args={[3.1, 0.54, 0.003]} /><meshBasicMaterial color="#080e18" /></mesh>
      <Text position={[-1.44, 0.06, Z + 0.004]} fontSize={0.036} color="#1e3448" anchorX="left" anchorY="middle">Návštěvnost — posledních 12 měsíců</Text>
      {BAR_H.map((h, i) => (
        <mesh key={i} position={[-1.34 + i * 0.244, -0.38 + h / 2, Z + 0.003]}>
          <boxGeometry args={[0.145, h, 0.001]} />
          <meshBasicMaterial color={i > 8 ? '#22d3ee' : '#1e4a6a'} transparent opacity={0.85} />
        </mesh>
      ))}
      <mesh position={[0, -0.46, Z + 0.003]}><boxGeometry args={[2.8, 0.002, 0.001]} /><meshBasicMaterial color="#1a3050" /></mesh>

      {/* Bottom 3 stats */}
      <mesh position={[0, -0.56, Z]}><boxGeometry args={[3.38, 0.27, 0.001]} /><meshBasicMaterial color="#060d1a" /></mesh>
      {([
        [-1.1,  '#60a5fa', '48h',   'průměr dodání'],
        [-0.08, '#22d3ee', '99/100','PageSpeed'],
        [ 0.94, '#34d399', '100%',  'spokojenost'],
      ] as const).map(([x, c, val, lbl]) => (
        <group key={x}>
          <Text position={[x, -0.50, Z + 0.003]} fontSize={0.072} color={c} anchorX="center" anchorY="middle">{val}</Text>
          <Text position={[x, -0.65, Z + 0.003]} fontSize={0.034} color="#2a4060" anchorX="center" anchorY="middle">{lbl}</Text>
        </group>
      ))}

      <mesh position={[0, -0.98, Z]}><boxGeometry args={[3.38, 0.10, 0.001]} /><meshBasicMaterial color="#060d18" /></mesh>
      <Text position={[0, -0.98, Z + 0.002]} fontSize={0.034} color="#1e3448" anchorX="center" anchorY="middle">Přehled výkonu — červen 2026</Text>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 5 (LAUNCH)
   Going LIVE — domain, green indicator, celebration
═══════════════════════════════════════════════════════════════ */
function ScreenLaunch() {
  const Z = 0.083;
  const pulseRef  = useRef<THREE.MeshStandardMaterial>(null!);
  const glowRef   = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const p = 0.5 + Math.sin(t * 2.4) * 0.5;
    if (pulseRef.current) pulseRef.current.emissiveIntensity = 1.5 + p * 2.2;
    if (glowRef.current)  glowRef.current.opacity = 0.04 + p * 0.09;
  });
  return (
    <>
      {/* Full dark bg */}
      <mesh position={[0, 0.05, Z - 0.001]}><boxGeometry args={[3.56, 2.30, 0.001]} /><meshBasicMaterial color="#030e10" /></mesh>

      {/* Stage label */}
      <Text position={[0, 0.72, Z + 0.003]} fontSize={0.040} color="#1a4830" anchorX="center" anchorY="middle">04 / SPUŠTĚNÍ</Text>

      {/* Glow rings */}
      <mesh position={[0, 0.30, Z + 0.002]}>
        <circleGeometry args={[0.34, 32]} />
        <meshBasicMaterial ref={glowRef} color="#22c55e" transparent opacity={0.06} />
      </mesh>
      <mesh position={[0, 0.30, Z + 0.003]}>
        <circleGeometry args={[0.20, 24]} />
        <meshBasicMaterial color="#061e10" />
      </mesh>

      {/* LIVE dot */}
      <mesh position={[0, 0.30, Z + 0.006]}>
        <sphereGeometry args={[0.060, 16, 16]} />
        <meshStandardMaterial ref={pulseRef} color="#22c55e" emissive="#22c55e" emissiveIntensity={2.5} />
      </mesh>

      {/* LIVE text */}
      <Text position={[0, 0.04, Z + 0.005]} fontSize={0.200} color="#22c55e" anchorX="center" anchorY="middle">LIVE</Text>

      {/* Domain */}
      <mesh position={[0, -0.20, Z + 0.003]}><boxGeometry args={[1.88, 0.115, 0.001]} /><meshBasicMaterial color="#081e10" /></mesh>
      <Text position={[0, -0.20, Z + 0.005]} fontSize={0.056} color="#34d399" anchorX="center" anchorY="middle">vaseweb.cz</Text>

      {/* Status line */}
      <Text position={[0, -0.40, Z + 0.004]} fontSize={0.050} color="#3a7858" anchorX="center" anchorY="middle">Váš web je online</Text>
      <Text position={[0, -0.52, Z + 0.004]} fontSize={0.038} color="#1a4028" anchorX="center" anchorY="middle">Spuštěno dnes v 09:42</Text>

      {/* Divider */}
      <mesh position={[0, -0.64, Z + 0.002]}><boxGeometry args={[2.1, 0.002, 0.001]} /><meshBasicMaterial color="#0e2818" /></mesh>

      {/* Bottom stats */}
      {([
        [-0.82, '#22d3ee', '48h',  'od objednávky'],
        [ 0.00, '#22c55e', '100%', 'splněno'],
        [ 0.82, '#f59e0b', '0 Kč', 'záloha'],
      ] as const).map(([x, c, val, lbl]) => (
        <group key={x}>
          <Text position={[x, -0.78, Z + 0.004]} fontSize={0.074} color={c} anchorX="center" anchorY="middle">{val}</Text>
          <Text position={[x, -0.93, Z + 0.004]} fontSize={0.034} color="#1a4028" anchorX="center" anchorY="middle">{lbl}</Text>
        </group>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   MONITOR WRAPPER — hardware + screen + transform animation
═══════════════════════════════════════════════════════════════ */
const SCREEN_RIM = [
  '#1a3c9a',  // 0 HERO    - electric blue (build)
  '#1a4080',  // 1 PROCESS - deep professional blue
  '#0a4870',  // 2 RESULTS - cyan
  '#0a7040',  // 3 CTA     - green (success)
] as const;
const SCREEN_EM = [
  '#0a1e50',  // 0 HERO
  '#0a2040',  // 1 PROCESS
  '#033040',  // 2 RESULTS
  '#043820',  // 3 CTA
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

    const si = Math.min(section, 3);
    if (scrMat.current) {
      scrMat.current.emissive.set(SCREEN_EM[si]);
      scrMat.current.emissiveIntensity = 0.25;
    }
    if (rimMat.current) {
      rimMat.current.emissive.set(SCREEN_RIM[si]);
      rimMat.current.color.set(SCREEN_RIM[si]);
      rimMat.current.emissiveIntensity = 0.6;
    }
  });

  return (
    <group ref={group} position={[0, 0.05, 0]}>
      {/* Hardware */}
      <Suspense fallback={<MonitorFallback />}>
        <MonitorGLTF />
      </Suspense>

      {/* Screen glass */}
      <mesh position={[0, 0.035, 0.050]}>
        <boxGeometry args={[3.56, 2.32, 0.005]} />
        <meshStandardMaterial ref={scrMat} color="#01030a" emissive="#0d2860"
          emissiveIntensity={0.4} roughness={0.95} />
      </mesh>
      {/* Screen rim glow — clearly in front of glass to avoid Z-fighting */}
      <mesh position={[0, 0.035, 0.075]}>
        <boxGeometry args={[3.58, 2.34, 0.001]} />
        <meshStandardMaterial ref={rimMat} color="#1a4aaa" emissive="#1a4aaa"
          emissiveIntensity={0.9} transparent opacity={0.28} />
      </mesh>
      {/* Minimal thin stand */}
      <mesh position={[0, -1.36, -0.01]}>
        <cylinderGeometry args={[0.022, 0.028, 0.44, 8]} />
        <meshStandardMaterial color="#060810" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[0, -1.60, -0.01]}>
        <boxGeometry args={[0.72, 0.022, 0.32]} />
        <meshStandardMaterial color="#05070c" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Screen content — own Suspense per screen so font loading never blanks the whole canvas */}
      <group visible={section === 0}><Suspense fallback={null}><ScreenHero building={true} /></Suspense></group>
      <group visible={section === 1}><Suspense fallback={null}><ScreenProcess /></Suspense></group>
      <group visible={section === 2}><Suspense fallback={null}><ScreenResults /></Suspense></group>
      <group visible={section === 3}><Suspense fallback={null}><ScreenLaunch /></Suspense></group>
    </group>
  );
}

/* ExplosionFragments removed — no longer needed in 4-section narrative */

/* ═══════════════════════════════════════════════════════════════
   CAMERA RIG
═══════════════════════════════════════════════════════════════ */
function CameraRig({ section }: { section: number }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (SV.camX - camera.position.x) * 0.038;
    camera.position.y += (SV.camY - camera.position.y) * 0.038;
    camera.position.z += (SV.camZ - camera.position.z) * 0.038;
    camera.lookAt(SV.monX * 0.55, SV.monY * 0.25, 0);
  });
  return null;
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
  const [visible, setVisible] = useState(false);
  const secRef = useRef(0);

  useEffect(() => {
    // Reset immediately so the very first frame has correct values (important for HMR)
    Object.assign(SV, {
      camX: 0, camY: 0.2, camZ: 11.0,
      monRotX: 0, monRotY: 0, monScale: 1.18,
      monX: 0, monY: 0.05,
      buildProgress: 0, explodeProgress: 0,
    });

    let gsapCleanup: (() => void) | undefined;

    // One-frame defer so scrollContainerRef is guaranteed populated
    const raf = requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el, scroller: window,
          start: 'top top', end: 'bottom bottom',
          scrub: 1.4,
        },
      });

      /* SECTION 0 — camera dives in, monitor builds */
      tl.to(SV, {
        camZ: mobile ? 6.8 : 3.8, camX: mobile ? 0 : -0.4, camY: -0.25,
        monScale: mobile ? 1.36 : 1.55, monRotY: mobile ? 0 : 0.06,
        buildProgress: 1,
        duration: 1.0,
      }, 0);

      /* SECTION 1 — camera pulls back, orbit right, show process */
      tl.to(SV, {
        camZ: mobile ? 8.5 : 9.5, camX: mobile ? 0 : 2.5, camY: 0.4,
        monScale: mobile ? 1.0 : 0.88, monX: mobile ? 0 : -0.6,
        monRotY: mobile ? -0.08 : -0.22, monRotX: 0.05,
        buildProgress: 0,
        duration: 1.0,
      }, 1.0);

      /* SECTION 2 — monitor shrinks to thumbnail */
      tl.to(SV, {
        camZ: mobile ? 8.5 : 10.5, camX: mobile ? 0 : 0.6, camY: 0.2,
        monScale: mobile ? 0.72 : 0.36,
        monX: mobile ? 0 : 1.4, monY: mobile ? 0 : 0.6,
        monRotX: 0.12, monRotY: mobile ? 0 : -0.15,
        duration: 1.0,
      }, 2.0);

      // Recalculate trigger positions after layout is complete
      ScrollTrigger.refresh();

      const onScroll = () => {
        const s = Math.min(3, Math.max(0, Math.floor(window.scrollY / window.innerHeight)));
        if (s !== secRef.current) { secRef.current = s; setSection(s); }
      };
      // Sync section immediately in case page was refreshed mid-scroll
      onScroll();
      window.addEventListener('scroll', onScroll, { passive: true });

      gsapCleanup = () => {
        tl.kill();
        ScrollTrigger.getAll().forEach(t => t.kill());
        window.removeEventListener('scroll', onScroll);
      };
    });

    // Fade in after fonts + scene are ready
    const fadeTimer = setTimeout(() => setVisible(true), 200);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(fadeTimer);
      gsapCleanup?.();
    };
  }, [scrollContainerRef, mobile]);

  return (
    <div style={{ width: '100%', height: '100%', opacity: visible ? 1 : 0, transition: 'opacity 1.4s ease' }}>
    <Canvas
      camera={{ position: [0, 0.2, 11.0], fov: mobile ? 46 : 40 }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}
      dpr={mobile ? [0.75, 1] : [1, 1.2]}
      performance={{ min: 0.5 }}
      style={{ width: '100%', height: '100%' }}
    >
      <color attach="background" args={['#060d1a']} />

      <ambientLight intensity={0.35} />
      <pointLight position={[-6, 5, 4]} intensity={8.0} color="#2563eb" />
      <pointLight position={[5, -3, 3]} intensity={5.0} color="#22d3ee" />
      <Monitor section={section} />
      <CameraRig section={section} />
    </Canvas>
    </div>
  );
}

useGLTF.preload('/models/monitor.glb');
