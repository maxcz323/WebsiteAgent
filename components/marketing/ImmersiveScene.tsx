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
function ScreenIdea() {
  const Z = 0.083;
  const cursorRef = useRef<THREE.MeshBasicMaterial>(null!);
  useFrame(({ clock }) => {
    if (cursorRef.current) cursorRef.current.opacity = Math.sin(clock.elapsedTime * 2.8) > 0 ? 0.9 : 0;
  });
  return (
    <>
      {/* Browser chrome */}
      <mesh position={[0, 1.02, Z]}>
        <boxGeometry args={[3.38, 0.13, 0.001]} />
        <meshBasicMaterial color="#080e18" />
      </mesh>
      {(['#ff5f57','#ffbd2e','#28c840'] as const).map((c, i) => (
        <mesh key={i} position={[-1.56 + i * 0.12, 1.02, Z + 0.003]}>
          <circleGeometry args={[0.019, 8]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}
      <mesh position={[0.1, 1.02, Z + 0.002]}>
        <boxGeometry args={[2.4, 0.067, 0.001]} />
        <meshBasicMaterial color="#0e1c2e" />
      </mesh>
      <Text position={[0.1, 1.02, Z + 0.004]} fontSize={0.036} color="#2a4060" anchorX="center" anchorY="middle">websiteagent.cz/novy-projekt</Text>

      {/* Stage label */}
      <Text position={[-1.58, 0.84, Z + 0.003]} fontSize={0.038} color="#2563eb" anchorX="left" anchorY="middle">01 / IDEA</Text>

      {/* Form card */}
      <mesh position={[0, 0.20, Z + 0.001]}>
        <boxGeometry args={[2.9, 1.48, 0.004]} />
        <meshBasicMaterial color="#0c1828" />
      </mesh>
      <mesh position={[0, 0.93, Z + 0.004]}>
        <boxGeometry args={[2.9, 0.001, 0.001]} />
        <meshBasicMaterial color="#1a3050" />
      </mesh>
      <Text position={[-1.03, 0.82, Z + 0.005]} fontSize={0.068} color="#d0e8ff" anchorX="left" anchorY="middle">Nový projekt</Text>
      <Text position={[-1.03, 0.70, Z + 0.005]} fontSize={0.040} color="#3a5878" anchorX="left" anchorY="middle">Řekněte nám co potřebujete</Text>

      {/* Field: Firma */}
      <Text position={[-1.33, 0.55, Z + 0.005]} fontSize={0.036} color="#2a4870" anchorX="left" anchorY="middle">Název firmy</Text>
      <mesh position={[0, 0.44, Z + 0.004]}><boxGeometry args={[2.66, 0.105, 0.001]} /><meshBasicMaterial color="#0e1e30" /></mesh>
      <Text position={[-1.24, 0.44, Z + 0.006]} fontSize={0.048} color="#7aaad8" anchorX="left" anchorY="middle">Kuchař & synové s.r.o.</Text>

      {/* Field: Typ */}
      <Text position={[-1.33, 0.30, Z + 0.005]} fontSize={0.036} color="#2a4870" anchorX="left" anchorY="middle">Typ webu</Text>
      <mesh position={[0, 0.19, Z + 0.004]}><boxGeometry args={[2.66, 0.105, 0.001]} /><meshBasicMaterial color="#0e1e30" /></mesh>
      <Text position={[-1.24, 0.19, Z + 0.006]} fontSize={0.048} color="#7aaad8" anchorX="left" anchorY="middle">Firemní web</Text>
      <Text position={[1.20, 0.19, Z + 0.006]} fontSize={0.048} color="#2a4060" anchorX="right" anchorY="middle">▾</Text>

      {/* Field: Popis (currently typing) */}
      <Text position={[-1.33, 0.05, Z + 0.005]} fontSize={0.036} color="#2a4870" anchorX="left" anchorY="middle">Popis projektu</Text>
      <mesh position={[0, -0.10, Z + 0.004]}><boxGeometry args={[2.66, 0.20, 0.001]} /><meshBasicMaterial color="#0e1e30" /></mesh>
      <Text position={[-1.24, -0.04, Z + 0.006]} fontSize={0.040} color="#5a88b0" anchorX="left" anchorY="middle">Chceme moderní web — restaurace,</Text>
      <Text position={[-1.24, -0.14, Z + 0.006]} fontSize={0.040} color="#5a88b0" anchorX="left" anchorY="middle">rezervace + menu online.</Text>
      <mesh position={[0.40, -0.14, Z + 0.007]}>
        <boxGeometry args={[0.014, 0.068, 0.001]} />
        <meshBasicMaterial ref={cursorRef} color="#60a5fa" transparent opacity={0.9} />
      </mesh>

      {/* Submit */}
      <mesh position={[0.74, -0.38, Z + 0.005]}><boxGeometry args={[0.86, 0.13, 0.001]} /><meshBasicMaterial color="#2563eb" /></mesh>
      <Text position={[0.74, -0.38, Z + 0.007]} fontSize={0.052} color="#ffffff" anchorX="center" anchorY="middle">Odeslat projekt →</Text>

      {/* Confirmation */}
      <mesh position={[-0.68, -0.38, Z + 0.004]}><boxGeometry args={[0.80, 0.09, 0.001]} /><meshBasicMaterial color="#0d2e18" /></mesh>
      <Text position={[-0.68, -0.38, Z + 0.006]} fontSize={0.040} color="#22c55e" anchorX="center" anchorY="middle">✓  Požadavek přijat</Text>

      {/* Bottom trust bar */}
      <mesh position={[0, -0.98, Z]}><boxGeometry args={[3.38, 0.08, 0.001]} /><meshBasicMaterial color="#060d18" /></mesh>
      {([[-1.1,'48 h'],[-0.38,'bez zálohy'],[0.34,'na míru'],[1.1,'50+ projektů']] as const).map(([x,t]) => (
        <Text key={x} position={[x, -0.98, Z + 0.002]} fontSize={0.034} color="#1e3448" anchorX="center" anchorY="middle">{t}</Text>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 1 (DESIGN / BUILD ANIMATION)
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
          <meshBasicMaterial color="#0c2040" />
        </mesh>
        <mesh position={[-1.42, 0.99, Z + 0.004]}>
          <sphereGeometry args={[0.038, 8, 8]} />
          <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={3.0} />
        </mesh>
        <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.064} color="#d8ecff" anchorX="left" anchorY="middle">WebsiteAgent</Text>
        {['Sluzby', 'Portfolio', 'Cenik', 'Blog'].map((label, i) => (
          <Text key={i} position={[-0.28 + i * 0.39, 0.99, Z + 0.003]} fontSize={0.048} color="#3a6090" anchorX="center" anchorY="middle">{label}</Text>
        ))}
        <mesh position={[1.46, 0.99, Z + 0.002]}>
          <boxGeometry args={[0.28, 0.1, 0.001]} />
          <meshBasicMaterial color="#2563eb" />
        </mesh>
        <Text position={[1.46, 0.99, Z + 0.004]} fontSize={0.054} color="#ffffff" anchorX="center" anchorY="middle">Zacit</Text>
      </group>

      {/* STAGE LABEL */}
      <Text position={[-1.58, 0.84, Z + 0.003]} fontSize={0.038} color="#2563eb" anchorX="left" anchorY="middle">02 / DESIGN</Text>

      {/* BADGE */}
      <group ref={gBadge}>
        <mesh position={[-1.08, 0.77, Z]}>
          <boxGeometry args={[0.54, 0.09, 0.001]} />
          <meshBasicMaterial color="#1e4a88" />
        </mesh>
        <Text position={[-1.08, 0.77, Z + 0.003]} fontSize={0.046} color="#93c5fd" anchorX="center" anchorY="middle">Hodnoceni 5/5 hvezd</Text>
      </group>

      {/* HEADLINE */}
      <group ref={gH1}>
        <Text position={[-1.29, 0.62, Z + 0.003]} fontSize={0.105} color="#e8f4ff" anchorX="left" anchorY="middle">Vas web</Text>
        <Text position={[-1.29, 0.46, Z + 0.003]} fontSize={0.105} color="#60a5fa" anchorX="left" anchorY="middle">do 48 hodin</Text>
        <mesh position={[0.22, 0.46, Z + 0.001]}>
          <boxGeometry args={[0.018, 0.10, 0.001]} />
          <meshBasicMaterial ref={cursorMat} color="#93c5fd" transparent opacity={0.9} />
        </mesh>
      </group>

      {/* SUB TEXT */}
      <group ref={gSub}>
        <Text position={[-1.69, 0.31, Z + 0.002]} fontSize={0.052} color="#4a80b0" anchorX="left" anchorY="middle">Profesionalni weby pro ceske firmy.</Text>
        <Text position={[-1.69, 0.21, Z + 0.002]} fontSize={0.052} color="#3a6a8a" anchorX="left" anchorY="middle">Bez zalohy, bez zavazku.</Text>
        <Text position={[-1.69, 0.12, Z + 0.002]} fontSize={0.052} color="#2a5070" anchorX="left" anchorY="middle">Vysledky do 2 pracovnich dnu.</Text>
      </group>

      {/* CTA BUTTONS */}
      <group ref={gCta}>
        <mesh position={[-1.04, -0.05, Z]}>
          <boxGeometry args={[0.64, 0.17, 0.001]} />
          <meshBasicMaterial color="#2563eb" />
        </mesh>
        <Text position={[-1.04, -0.05, Z + 0.003]} fontSize={0.062} color="#ffffff" anchorX="center" anchorY="middle">Ziskat web</Text>
        <mesh position={[-0.32, -0.05, Z]}>
          <boxGeometry args={[0.52, 0.17, 0.001]} />
          <meshBasicMaterial color="#122244" />
        </mesh>
        <mesh position={[-0.32, -0.05, Z + 0.001]}>
          <boxGeometry args={[0.52, 0.17, 0.001]} />
          <meshBasicMaterial color="#1e3c78" transparent opacity={0.5} />
        </mesh>
        <Text position={[-0.32, -0.05, Z + 0.003]} fontSize={0.062} color="#9abdd8" anchorX="center" anchorY="middle">Zjistit vice</Text>
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
        <Text position={[0.92, 0.9, Z + 0.007]} fontSize={0.046} color="#4a6a8a" anchorX="center" anchorY="middle">Vykon webu</Text>
        <Text position={[0.38, 0.70, Z + 0.006]} fontSize={0.135} color="#e8f4ff" anchorX="left" anchorY="middle">1 247</Text>
        <Text position={[0.38, 0.56, Z + 0.005]} fontSize={0.046} color="#3a5a80" anchorX="left" anchorY="middle">Navstevniku / mesic</Text>
        <mesh position={[1.1, 0.70, Z + 0.005]}>
          <boxGeometry args={[0.26, 0.09, 0.001]} />
          <meshBasicMaterial color="#166534" />
        </mesh>
        <Text position={[1.1, 0.70, Z + 0.007]} fontSize={0.052} color="#4ade80" anchorX="center" anchorY="middle">+34%</Text>
        <mesh ref={lineRef} position={[0.92, 0.45, Z + 0.005]}>
          <boxGeometry args={[1.1, 0.028, 0.001]} />
          <meshBasicMaterial color="#3b82f6" transparent opacity={0.5} />
        </mesh>
        <mesh position={[0.92, -0.06, Z + 0.004]}>
          <boxGeometry args={[1.28, 0.54, 0.001]} />
          <meshBasicMaterial color="#091828" transparent opacity={0.8} />
        </mesh>
        {([
          [0.38, '#3b82f6'], [0.55, '#60a5fa'], [0.72, '#22d3ee'],
          [0.89, '#3b82f6'], [1.06, '#60a5fa'],
        ] as const).map(([x, c], i) => (
          <mesh key={i} ref={barRefs[i]} position={[x, -0.62 + BAR_H[i] / 2, Z + 0.005]}>
            <boxGeometry args={[0.1, BAR_H[i], 0.001]} />
            <meshBasicMaterial color={c} transparent opacity={0.9} />
          </mesh>
        ))}
        <mesh position={[0.92, -0.62, Z + 0.005]}>
          <boxGeometry args={[1.28, 0.006, 0.001]} />
          <meshBasicMaterial color="#162840" />
        </mesh>
      </group>

      {/* STATS BAND */}
      <group ref={gStats}>
        <mesh position={[0, -0.35, Z - 0.001]}>
          <boxGeometry args={[3.38, 0.27, 0.001]} />
          <meshBasicMaterial color="#091826" />
        </mesh>
        {([
          [-1.2, '#60a5fa', '48h',  'Dodani'],
          [-0.4, '#22d3ee', '50+',  'Webu'],
          [ 0.4, '#34d399', '100%', 'Spokojenost'],
          [ 1.2, '#f59e0b', '0 Kc', 'Zaloha'],
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
          [ 1.04, '#0a2420', '#10b981', 'Mobile', 'Responzivni design'],
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
   SCREEN CONTENT — STATE 2 (LANDING PAGE CONCEPT)
   Premium hero + 3 feature cards + trust bar
═══════════════════════════════════════════════════════════════ */
function ScreenLanding() {
  const Z = 0.083;
  return (
    <>
      {/* Stage label */}
      <Text position={[-1.58, 0.84, Z + 0.003]} fontSize={0.038} color="#2563eb" anchorX="left" anchorY="middle">03 / FIREMNÍ WEB</Text>

      {/* NAV */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#0c1830" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={3.0} />
      </mesh>
      <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.062} color="#d8ecff" anchorX="left" anchorY="middle">WebsiteAgent</Text>
      {['Sluzby', 'Ceny', 'Portfolio', 'Kontakt'].map((label, i) => (
        <Text key={i} position={[0.28 + i * 0.4, 0.99, Z + 0.002]} fontSize={0.046} color="#3a5070" anchorX="center" anchorY="middle">{label}</Text>
      ))}
      <mesh position={[1.5, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.26, 0.1, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      <Text position={[1.5, 0.99, Z + 0.004]} fontSize={0.054} color="#ffffff" anchorX="center" anchorY="middle">Chci web</Text>

      {/* Hero bg */}
      <mesh position={[0, 0.37, Z - 0.003]}>
        <boxGeometry args={[3.38, 1.18, 0.001]} />
        <meshBasicMaterial color="#091828" />
      </mesh>
      <mesh position={[0, 0.55, Z - 0.002]}>
        <boxGeometry args={[2.4, 0.6, 0.001]} />
        <meshBasicMaterial color="#102050" transparent opacity={0.45} />
      </mesh>

      {/* Headline */}
      <Text position={[0, 0.74, Z + 0.002]} fontSize={0.110} color="#e8f4ff" anchorX="center" anchorY="middle">Moderni web</Text>
      <Text position={[0, 0.55, Z + 0.002]} fontSize={0.110} color="#60a5fa" anchorX="center" anchorY="middle">pro vasi firmu</Text>

      {/* Subtext */}
      <Text position={[0, 0.36, Z + 0.001]} fontSize={0.054} color="#4a7898" anchorX="center" anchorY="middle">Profesionalni web do 48 hodin.</Text>
      <Text position={[0, 0.27, Z + 0.001]} fontSize={0.050} color="#3a6070" anchorX="center" anchorY="middle">Bez zalohy. Bez zavazku.</Text>

      {/* CTAs */}
      <mesh position={[-0.4, 0.1, Z]}>
        <boxGeometry args={[0.65, 0.17, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      <Text position={[-0.4, 0.1, Z + 0.003]} fontSize={0.064} color="#ffffff" anchorX="center" anchorY="middle">Chci web</Text>
      <mesh position={[0.35, 0.1, Z]}>
        <boxGeometry args={[0.52, 0.17, 0.001]} />
        <meshBasicMaterial color="#122244" />
      </mesh>
      <mesh position={[0.35, 0.1, Z + 0.001]}>
        <boxGeometry args={[0.50, 0.15, 0.001]} />
        <meshBasicMaterial color="#1e3c78" transparent opacity={0.5} />
      </mesh>
      <Text position={[0.35, 0.1, Z + 0.003]} fontSize={0.064} color="#9abdd8" anchorX="center" anchorY="middle">Ukazky praci</Text>

      {/* Divider */}
      <mesh position={[0, -0.1, Z]}>
        <boxGeometry args={[3.2, 0.003, 0.001]} />
        <meshBasicMaterial color="#162840" />
      </mesh>

      {/* Feature cards */}
      {([
        [-1.05, '#2563eb', '#0d2038', '#1e4a88', '#3b82f6', 'Rychle dodani', 'Do 48 hodin'],
        [0,     '#22d3ee', '#12102e', '#2a1a68', '#8b5cf6', 'SEO zdarma',    'Top Google'],
        [1.05,  '#10b981', '#0a2420', '#0e3828', '#10b981', 'Zaruka kvality','100% spokojenost'],
      ] as const).map(([x, accent, bg, circleBg, dotCol, title, sub], i) => (
        <group key={i} position={[x, -0.6, Z]}>
          <mesh>
            <boxGeometry args={[0.95, 0.75, 0.006]} />
            <meshBasicMaterial color={bg} />
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
            <meshStandardMaterial color={dotCol} emissive={dotCol} emissiveIntensity={2.2} />
          </mesh>
          <Text position={[0, 0.04, 0.005]} fontSize={0.070} color="#ddf0ff" anchorX="center" anchorY="middle">{title}</Text>
          <Text position={[0, -0.10, 0.005]} fontSize={0.052} color="#4a6a8a" anchorX="center" anchorY="middle">{sub}</Text>
        </group>
      ))}

      {/* Trust bar */}
      <mesh position={[0, -1.0, Z]}>
        <boxGeometry args={[3.38, 0.08, 0.001]} />
        <meshBasicMaterial color="#091826" />
      </mesh>
      {([
        [-1.1,  '48 hodin'],
        [-0.38, '50+ webu'],
        [0.34,  '100% spokojenost'],
        [1.06,  '0 Kc zaloha'],
      ] as const).map(([x, label]) => (
        <Text key={x} position={[x, -1.0, Z + 0.002]} fontSize={0.040} color="#3a5270" anchorX="center" anchorY="middle">{label}</Text>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SCREEN CONTENT — STATE 3 (E-COMMERCE)
   Header + filter sidebar + 2×3 product grid
═══════════════════════════════════════════════════════════════ */
function ScreenEcommerce() {
  const Z = 0.083;
  const PROD_COLORS = ['#0e2235','#101e32','#0e1a2e','#0a1e18','#10102a','#0c1c20'] as const;
  const ACCENT      = ['#3b82f6','#8b5cf6','#10b981','#f59e0b','#22d3ee','#a78bfa'] as const;
  const BTN_BG      = ['#1e4a88','#2a1268','#0e3828','#482010','#1a3c78','#2a1868'] as const;
  const IMG_BG      = ['#0c1e28','#120e28','#0a1c10','#1a1008','#0c1e28','#120e28'] as const;
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
      {/* Stage label */}
      <Text position={[-1.58, 0.84, Z + 0.003]} fontSize={0.038} color="#10b981" anchorX="left" anchorY="middle">04 / E-SHOP</Text>

      {/* HEADER */}
      <mesh position={[0, 0.99, Z]}>
        <boxGeometry args={[3.38, 0.17, 0.001]} />
        <meshBasicMaterial color="#0c1a28" />
      </mesh>
      <mesh position={[-1.42, 0.99, Z + 0.003]}>
        <sphereGeometry args={[0.032, 8, 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2.8} />
      </mesh>
      <Text position={[-1.22, 0.99, Z + 0.003]} fontSize={0.062} color="#d0e8f0" anchorX="left" anchorY="middle">WebsiteAgent</Text>
      {/* Search bar */}
      <mesh position={[0.2, 0.99, Z + 0.002]}>
        <boxGeometry args={[1.3, 0.09, 0.001]} />
        <meshBasicMaterial color="#0e1e30" />
      </mesh>
      <mesh position={[0.2, 0.99, Z + 0.003]}>
        <boxGeometry args={[1.28, 0.07, 0.001]} />
        <meshBasicMaterial color="#162a3e" />
      </mesh>
      <Text position={[-0.36, 0.99, Z + 0.005]} fontSize={0.046} color="#3a5870" anchorX="left" anchorY="middle">Hledat sluzbu...</Text>
      {/* Cart */}
      <mesh position={[1.32, 0.99, Z + 0.002]}>
        <boxGeometry args={[0.22, 0.1, 0.001]} />
        <meshBasicMaterial color="#134f3c" />
      </mesh>
      <mesh position={[1.44, 1.03, Z + 0.004]}>
        <sphereGeometry args={[0.028, 8, 8]} />
        <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={3.0} />
      </mesh>

      {/* FILTER SIDEBAR */}
      <mesh position={[-1.38, 0.0, Z]}>
        <boxGeometry args={[0.68, 1.78, 0.005]} />
        <meshBasicMaterial color="#0c1820" />
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
        <Text key={y} position={[-1.38, y, Z + 0.004]} fontSize={isHeader ? 0.042 : 0.038} color={isHeader ? '#3a6880' : '#2a4a60'} anchorX="center" anchorY="middle">{label}</Text>
      ))}
      {/* Checkboxes */}
      {([0.60, 0.48, -0.05, -0.65] as const).map((y, i) => (
        <mesh key={y} position={[-1.68, y, Z + 0.004]}>
          <boxGeometry args={[0.040, 0.040, 0.001]} />
          <meshBasicMaterial color={i < 2 ? '#166044' : '#1a2838'} />
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
              <meshBasicMaterial color={PROD_COLORS[i]} />
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
            <Text position={[0, -0.08, 0.005]} fontSize={0.060} color="#c0d4e8" anchorX="center" anchorY="middle">{prod.name}</Text>
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
      <Text position={[-1.58, 0.82, Z + 0.003]} fontSize={0.038} color="#22d3ee" anchorX="left" anchorY="middle">05 / VÝSLEDKY</Text>

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
      <Text position={[0, 0.72, Z + 0.003]} fontSize={0.040} color="#1a4830" anchorX="center" anchorY="middle">06 / SPUŠTĚNÍ</Text>

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
  '#1e2840',  // 0 IDEA     - muted grey-blue
  '#1a3c9a',  // 1 DESIGN   - electric blue
  '#1a4080',  // 2 BUSINESS - deep professional blue
  '#0d5a40',  // 3 ECOM     - teal green
  '#0a4870',  // 4 RESULTS  - cyan
  '#0a7040',  // 5 LAUNCH   - green
] as const;
const SCREEN_EM = [
  '#0a1428',  // 0 IDEA
  '#0a1e50',  // 1 DESIGN
  '#0a2040',  // 2 BUSINESS
  '#063a30',  // 3 ECOM
  '#033040',  // 4 RESULTS
  '#043820',  // 5 LAUNCH
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

      {/* Screen glass — extended to minimize visible bezel */}
      <mesh position={[0, 0.035, 0.0575]}>
        <boxGeometry args={[3.56, 2.32, 0.005]} />
        <meshStandardMaterial ref={scrMat} color="#01030a" emissive="#0d2860"
          emissiveIntensity={0.4} roughness={0.95} transparent opacity={0.9} />
      </mesh>
      {/* Screen rim glow */}
      <mesh position={[0, 0.035, 0.061]}>
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

      {/* Screen content — 6-stage story */}
      {section === 0 && <ScreenIdea />}
      {section === 1 && <ScreenHero building={true} />}
      {section === 2 && <ScreenLanding />}
      {section === 3 && <ScreenEcommerce />}
      {section === 4 && <ScreenResults />}
      {section === 5 && <ScreenLaunch />}
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

function ExplosionFragments() {
  const meshRefs = useRef<(THREE.Mesh | null)[]>(Array(FRAGS.length).fill(null));
  const matRefs  = useRef<(THREE.MeshBasicMaterial | null)[]>(Array(FRAGS.length).fill(null));
  useFrame(() => {
    const p    = SV.explodeProgress;
    const ease = p < 0.001 ? 0 : 1 - Math.pow(1 - p, 2.2);
    const op   = p < 0.001 ? 0 : Math.min(1, p * 5.0);
    for (let i = 0; i < FRAGS.length; i++) {
      const mesh = meshRefs.current[i];
      const mat  = matRefs.current[i];
      if (!mesh || !mat) continue;
      const f = FRAGS[i];
      mesh.position.set(f.s[0] + f.v[0] * ease, f.s[1] + f.v[1] * ease, f.s[2] + f.v[2] * ease);
      mesh.rotation.x = ease * f.v[1] * 0.5;
      mesh.rotation.y = ease * f.v[0] * 0.4;
      mesh.rotation.z = ease * (f.v[0] + f.v[1]) * 0.18;
      mat.opacity = op;
    }
  });
  return (
    <>
      {FRAGS.map((f, i) => (
        <mesh key={i} ref={el => { meshRefs.current[i] = el; }} position={f.s}>
          <boxGeometry args={f.g} />
          <meshBasicMaterial ref={el => { matRefs.current[i] = el as THREE.MeshBasicMaterial | null; }} color={f.c} transparent opacity={0} />
        </mesh>
      ))}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   RINGS — 2 elegant orbits (simplified)
═══════════════════════════════════════════════════════════════ */
/* RingAccent and Particles removed — isolated dark void composition */

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

    /* ── 6 CINEMATIC Z-JOURNEY ───────────────────────────────
       Z arc: 11.0 → 9.2 → 3.8 → 11.5 → 5.8 → 10.5 → 20.0
    ─────────────────────────────────────────────────────── */

    /* STATE 0→1: HERO — slow drift in, first breath */
    tl.to(SV, { camZ: 9.2, camY: 0.0, monScale: 1.24, duration: 0.83 }, 0);

    /* STATE 1: DESIGN — dive close to watch the build */
    tl.to(SV, {
      camZ: mobile ? 6.8 : 3.8, camX: mobile ? 0 : -0.4, camY: -0.25,
      monScale: mobile ? 1.36 : 1.55, monRotY: mobile ? 0 : 0.06,
      buildProgress: 1,
      duration: 0.83,
    }, 0.83);

    /* STATE 2: BUSINESS — blast back and orbit right */
    tl.to(SV, {
      camX: mobile ? 0 : 4.5, camY: 0.8, camZ: mobile ? 8.0 : 11.5,
      monRotY: mobile ? -0.12 : -0.36, monRotX: 0.06,
      monScale: 1.14, buildProgress: 0,
      duration: 0.83,
    }, 1.66);

    /* STATE 3: E-COMMERCE — swoop left and approach */
    tl.to(SV, {
      camX: mobile ? 0 : -4.2, camY: -0.5, camZ: mobile ? 7.8 : 5.8,
      monRotY: mobile ? 0.12 : 0.40, monRotX: -0.05,
      monScale: 1.28,
      duration: 0.83,
    }, 2.49);

    /* STATE 4: RESULTS — monitor shrinks to thumbnail, numbers become hero */
    tl.to(SV, {
      camX: mobile ? 0 : 0.6, camY: 0.2, camZ: mobile ? 8.5 : 10.5,
      monRotX: 0.12, monRotY: mobile ? 0 : -0.15,
      monScale: mobile ? 0.72 : 0.36,
      monX: mobile ? 0 : 1.4, monY: mobile ? 0 : 0.6,
      duration: 0.83,
    }, 3.32);

    /* STATE 5: LAUNCH — wide pull-back, monitor explodes outward */
    tl.to(SV, {
      camX: mobile ? 0.5 : -1.5, camY: 3.2, camZ: mobile ? 13.0 : 20.0,
      monRotY: 1.3, monRotX: 0.6,
      monX: 0, monY: 0,
      monScale: mobile ? 0.22 : 0.06,
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
      camera={{ position: [0, 0.2, 11.0], fov: mobile ? 46 : 40 }}
      gl={{ antialias: !mobile, alpha: false, powerPreference: 'high-performance' }}
      dpr={mobile ? [0.75, 1] : [1, 1.2]}
      performance={{ min: 0.5 }}
      style={{ width: '100%', height: '100%' }}
    >
      <AdaptiveDpr pixelated />
      <color attach="background" args={['#060d1a']} />

      <ambientLight intensity={0.35} />
      {/* Key — cool blue from upper-left */}
      <pointLight position={[-6, 5, 4]}   intensity={8.0} color="#2563eb" />
      {/* Fill — cyan from lower-right */}
      <pointLight position={[5, -3, 3]}   intensity={5.0} color="#22d3ee" />
      {/* Explosion accent — red tint when exploding */}
      <pointLight position={[0, 0, 4]}    intensity={section === 5 ? 4.0 : 0} color="#ff2200" />
      <Monitor section={section} />
      <ExplosionFragments />
      <CameraRig section={section} />
    </Canvas>
  );
}

useGLTF.preload('/models/monitor.glb');
