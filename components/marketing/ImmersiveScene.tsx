'use client';

import { useRef, useMemo, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   MODULE-LEVEL STATE — GSAP writes, useFrame reads
═══════════════════════════════════════════════════════════════ */
const SV = {
  camX: 0,    camY: 0,    camZ: 12,
  monRotX: 0, monRotY: 0, monScale: 1,
  monX: 0.4,  monY: 0.1,
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
   SCREEN PANELS — rendered inside Html on the monitor
═══════════════════════════════════════════════════════════════ */
const FONT = "'Inter','Segoe UI',system-ui,sans-serif";
const BASE_SCREEN: React.CSSProperties = {
  width: '640px', height: '420px', background: '#040d1e',
  fontFamily: FONT, overflow: 'hidden', position: 'relative', color: 'white',
};

function ScreenBoot() {
  return (
    <div style={{ ...BASE_SCREEN, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(59,130,246,0.5)' }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
      </div>
      <p style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>WebsiteAgent</p>
      <p style={{ fontSize: '11px', color: '#475569', margin: 0 }}>Initializing…</p>
      <div style={{ display: 'flex', gap: '5px', marginTop: '4px' }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2563eb', animation: `blink 1.2s ${i * 0.2}s infinite ease-in-out` }} />
        ))}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:.25;transform:scale(.8)}50%{opacity:1;transform:scale(1.3)}}`}</style>
    </div>
  );
}

function ScreenHero() {
  return (
    <div style={BASE_SCREEN}>
      <div style={{ height: '34px', background: '#080f22', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '8px', borderBottom: '1px solid #0d1b30' }}>
        <div style={{ width: '52px', height: '13px', background: '#2563eb', borderRadius: '3px' }} />
        <div style={{ flex: 1 }} />
        {['Jak to funguje', 'Cena', 'O nás'].map(l => <span key={l} style={{ color: '#2a3a5c', fontSize: '10px', marginLeft: '8px' }}>{l}</span>)}
        <div style={{ width: '58px', height: '20px', background: '#2563eb', borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: 'white', fontSize: '9px', fontWeight: 700 }}>Získat web</span>
        </div>
      </div>
      <div style={{ padding: '22px 24px 0' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(37,99,235,.1)', border: '1px solid rgba(37,99,235,.25)', borderRadius: '20px', padding: '3px 10px', marginBottom: '10px' }}>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#60a5fa', animation: 'blink 2s infinite' }} />
          <span style={{ color: '#60a5fa', fontSize: '9px', fontWeight: 600 }}>Lokální firmy · Praha, Brno, celá ČR</span>
        </div>
        <p style={{ fontSize: '20px', fontWeight: 800, lineHeight: 1.15, margin: '0 0 7px', letterSpacing: '-.025em' }}>
          Web, který vaší firmě<br />
          <span style={{ background: 'linear-gradient(90deg,#60a5fa,#3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>posune vpřed.</span>
        </p>
        <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.65, maxWidth: '340px', margin: '0 0 14px' }}>
          Moderní weby pro lokální podnikatele. Profesionální design, hotovo za&nbsp;48 hodin. Platíte až po schválení.
        </p>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <div style={{ height: '28px', background: '#2563eb', borderRadius: '6px', padding: '0 14px', display: 'flex', alignItems: 'center', boxShadow: '0 0 20px rgba(37,99,235,.4)' }}>
            <span style={{ fontSize: '10px', fontWeight: 700 }}>Získat web ke shlédnutí →</span>
          </div>
          <div style={{ height: '28px', border: '1px solid #1e3060', borderRadius: '6px', padding: '0 12px', display: 'flex', alignItems: 'center' }}>
            <span style={{ color: '#64748b', fontSize: '10px' }}>Jak to funguje</span>
          </div>
        </div>
      </div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '52px', background: '#050c1c', display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderTop: '1px solid #0d1b30' }}>
        {[['48h', 'Dodání'], ['50+', 'Webů'], ['100%', 'Spokojení'], ['0 Kč', 'Záloha']].map(([n, l]) => (
          <div key={l} style={{ textAlign: 'center' }}>
            <p style={{ color: '#3b82f6', fontSize: '14px', fontWeight: 800, margin: 0 }}>{n}</p>
            <p style={{ color: '#475569', fontSize: '8px', margin: 0 }}>{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenServices() {
  return (
    <div style={BASE_SCREEN}>
      <div style={{ padding: '18px 22px' }}>
        <p style={{ color: '#60a5fa', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 6px' }}>Naše služby</p>
        <p style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 18px', letterSpacing: '-.02em' }}>Co pro vás uděláme</p>
        {[
          { n: '01', t: 'Landing page', p: 'od 9 900 Kč', c: '#2563eb', d: 'Jednostránkový web na konverzi' },
          { n: '02', t: 'Firemní web', p: 'od 14 900 Kč', c: '#7c3aed', d: 'Kompletní prezentace firmy' },
          { n: '03', t: 'E-commerce', p: 'od 24 900 Kč', c: '#059669', d: 'Plnohodnotný online obchod' },
        ].map((s, i) => (
          <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0', borderBottom: i < 2 ? '1px solid #0d1b30' : 'none' }}>
            <span style={{ color: '#334155', fontSize: '9px', fontFamily: 'monospace', width: '18px' }}>{s.n}</span>
            <div style={{ width: '3px', height: '32px', background: s.c, borderRadius: '2px', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: 'white', fontSize: '13px', fontWeight: 700, margin: '0 0 2px' }}>{s.t}</p>
              <p style={{ color: '#475569', fontSize: '9px', margin: 0 }}>{s.d}</p>
            </div>
            <span style={{ color: '#64748b', fontSize: '10px', fontWeight: 600 }}>{s.p}</span>
          </div>
        ))}
        <div style={{ marginTop: '14px', padding: '10px 12px', background: 'rgba(37,99,235,.07)', borderRadius: '8px', border: '1px solid rgba(37,99,235,.18)' }}>
          <p style={{ color: '#60a5fa', fontSize: '9px', margin: 0 }}>✓ Platíte až po schválení  ✓ Bez zálohy  ✓ Na míru</p>
        </div>
      </div>
    </div>
  );
}

function ScreenPortfolio() {
  return (
    <div style={BASE_SCREEN}>
      <div style={{ padding: '14px 18px' }}>
        <p style={{ color: '#60a5fa', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.1em', margin: '0 0 5px' }}>Naše práce</p>
        <p style={{ fontSize: '16px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-.02em' }}>Weby, které mluví za sebe</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '7px' }}>
          {[
            { g: 'linear-gradient(135deg,#1d4ed8,#3b82f6)', t: 'Instalatér Praha', r: '+340 % kontaktů' },
            { g: 'linear-gradient(135deg,#0f766e,#0d9488)', t: 'Zubní ordinace Brno', r: '70 % nových pac.' },
            { g: 'linear-gradient(135deg,#d97706,#f59e0b)', t: 'Kavárna Jihlava', r: '+40 % rezervací' },
            { g: 'linear-gradient(135deg,#7c3aed,#a78bfa)', t: 'Autoservis Plzeň', r: '+120 % poptávek' },
          ].map((p, i) => (
            <div key={i} style={{ borderRadius: '8px', background: p.g, padding: '12px', position: 'relative', overflow: 'hidden', minHeight: '74px' }}>
              <p style={{ color: 'white', fontSize: '10px', fontWeight: 700, margin: '0 0 5px' }}>{p.t}</p>
              <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,.15)', borderRadius: '10px', padding: '2px 7px' }}>
                <span style={{ color: 'white', fontSize: '8px', fontWeight: 600 }}>{p.r}</span>
              </div>
              <div style={{ position: 'absolute', bottom: '6px', right: '6px', width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'white', fontSize: '9px' }}>→</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span style={{ color: '#3b82f6', fontSize: '10px', fontWeight: 600 }}>Prohlédnout celé portfolio →</span>
        </div>
      </div>
    </div>
  );
}

function ScreenStats() {
  return (
    <div style={{ ...BASE_SCREEN, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: '#0d1626' }}>
      {[
        { n: '48h', l: 'Průměrné dodání', s: 'od poptávky po hotový web' },
        { n: '50+', l: 'Dokončených webů', s: 'pro lokální podnikatele' },
        { n: '100%', l: 'Spokojených klientů', s: 'kteří by nás doporučili' },
        { n: '0 Kč', l: 'Záloha předem', s: 'platíte až po schválení' },
      ].map((s, i) => (
        <div key={i} style={{ background: '#040d1e', padding: '22px 18px', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '2px', height: '34px', background: 'linear-gradient(#3b82f6,transparent)' }} />
          <p style={{ fontSize: '26px', fontWeight: 800, margin: '0 0 4px', letterSpacing: '-.03em', color: 'white' }}>{s.n}</p>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#e2e8f0', margin: '0 0 2px' }}>{s.l}</p>
          <p style={{ fontSize: '8px', color: '#475569', margin: 0 }}>{s.s}</p>
        </div>
      ))}
    </div>
  );
}

function ScreenCTA() {
  return (
    <div style={{ ...BASE_SCREEN, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '28px', gap: '12px', textAlign: 'center' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '13px', background: 'linear-gradient(135deg,#1d4ed8,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 50px rgba(37,99,235,.5)' }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </div>
      <p style={{ fontSize: '20px', fontWeight: 800, margin: 0, letterSpacing: '-.025em', lineHeight: 1.18 }}>Váš nový web<br />čeká na vás.</p>
      <p style={{ fontSize: '11px', color: '#64748b', margin: 0, maxWidth: '280px', lineHeight: 1.65 }}>Poptávka je zdarma. Do 24 hodin se ozveme s první ukázkou.</p>
      <div style={{ width: '100%', maxWidth: '290px', height: '36px', background: '#2563eb', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 40px rgba(37,99,235,.5)', cursor: 'pointer' }}>
        <span style={{ fontSize: '11px', fontWeight: 700 }}>Získat web ke shlédnutí zdarma →</span>
      </div>
    </div>
  );
}

const SCREENS = [ScreenBoot, ScreenHero, ScreenServices, ScreenPortfolio, ScreenStats, ScreenCTA];

/* ═══════════════════════════════════════════════════════════════
   MONITOR
═══════════════════════════════════════════════════════════════ */
function Monitor({ section }: { section: number }) {
  const groupRef  = useRef<THREE.Group>(null!);
  const scrMat    = useRef<THREE.MeshStandardMaterial>(null!);
  const rimMat    = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    M.x += (M.tx - M.x) * 0.04;
    M.y += (M.ty - M.y) * 0.04;

    groupRef.current.rotation.x += (SV.monRotX - M.y * 0.04 - groupRef.current.rotation.x) * 0.07;
    groupRef.current.rotation.y += (SV.monRotY + M.x * 0.06 - groupRef.current.rotation.y) * 0.07;
    const sc = SV.monScale;
    groupRef.current.scale.setScalar(groupRef.current.scale.x + (sc - groupRef.current.scale.x) * 0.07);
    groupRef.current.position.x += (SV.monX - groupRef.current.position.x) * 0.07;
    groupRef.current.position.y += (SV.monY + Math.sin(t * 0.5) * 0.07 - groupRef.current.position.y) * 0.06;

    if (scrMat.current) scrMat.current.emissiveIntensity = 0.28 + Math.sin(t * 2) * 0.04;
    if (rimMat.current) rimMat.current.emissiveIntensity = 0.6  + Math.sin(t * 2) * 0.18;
  });

  const ScreenComp = SCREENS[section] ?? SCREENS[0];

  return (
    <group ref={groupRef} position={[SV.monX, SV.monY, 0]}>
      {/* Body */}
      <mesh castShadow>
        <boxGeometry args={[3.5, 2.4, 0.14]} />
        <meshStandardMaterial color="#111d38" metalness={0.72} roughness={0.28} />
      </mesh>
      {/* Screen backing */}
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[3.2, 2.1, 0.01]} />
        <meshStandardMaterial ref={scrMat} color="#040d1e" emissive="#0e2860" emissiveIntensity={0.28} roughness={1} />
      </mesh>
      {/* Rim glow */}
      <mesh position={[0, 0, 0.0745]}>
        <boxGeometry args={[3.22, 2.12, 0.001]} />
        <meshStandardMaterial ref={rimMat} color="#1a3c9a" emissive="#1a3c9a" emissiveIntensity={0.6} transparent opacity={0.3} />
      </mesh>
      {/* HTML screen content */}
      <Html
        as="div"
        transform
        position={[0, 0.02, 0.092]}
        scale={0.0047}
        style={{ pointerEvents: 'none', transition: 'opacity 0.4s' }}
        zIndexRange={[0, 50]}
      >
        <ScreenComp />
      </Html>
      {/* Stand neck */}
      <mesh position={[0, -1.36, -0.01]}>
        <boxGeometry args={[0.14, 0.46, 0.11]} />
        <meshStandardMaterial color="#0c1525" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Base */}
      <mesh position={[0, -1.62, -0.16]}>
        <boxGeometry args={[1.35, 0.07, 0.65]} />
        <meshStandardMaterial color="#0c1525" metalness={0.5} roughness={0.5} />
      </mesh>
      {/* Base shadow plane */}
      <mesh position={[0, -1.66, -0.16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 0.8]} />
        <meshStandardMaterial color="#06060a" transparent opacity={0.25} metalness={0.6} roughness={0} />
      </mesh>
    </group>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOATING ELEMENTS — Services, Portfolio, Stats
═══════════════════════════════════════════════════════════════ */
function ServiceCards() {
  const g = useRef<THREE.Group>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const vis = SV.svcVis;
    const tx = -3.6 + (1 - vis) * 6;
    g.current.position.x += (tx - g.current.position.x) * 0.06;
    g.current.children.forEach((c, i) => {
      (c as THREE.Group).position.y = Math.sin(t * 0.6 + i * 1.2) * 0.06;
    });
  });

  return (
    <group ref={g} position={[-3.6, 0, 0]}>
      {[
        { y: 0.85, color: '#2563eb', label: 'Landing page',  price: 'od 9 900 Kč'  },
        { y: 0,    color: '#7c3aed', label: 'Firemní web',   price: 'od 14 900 Kč' },
        { y: -0.85,color: '#059669', label: 'E-commerce',    price: 'od 24 900 Kč' },
      ].map((s, i) => (
        <group key={i} position={[0, s.y, 0]}>
          <mesh>
            <boxGeometry args={[2.1, 0.48, 0.03]} />
            <meshStandardMaterial color="#0a1528" transparent opacity={0.85} />
          </mesh>
          <mesh position={[-1.02, 0, 0.02]}>
            <boxGeometry args={[0.04, 0.48, 0.01]} />
            <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.9} />
          </mesh>
          <Html transform position={[0, 0, 0.025]} scale={0.003} style={{ pointerEvents: 'none' }} zIndexRange={[0, 40]}>
            <div style={{ width: '700px', height: '160px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 20px 0 50px', fontFamily: FONT }}>
              <p style={{ color: 'white', fontSize: '22px', fontWeight: 800, margin: '0 0 3px', letterSpacing: '-.02em' }}>{s.label}</p>
              <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '15px', margin: 0 }}>{s.price}</p>
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}

const PORT_CARDS = [
  { x: 2.6,  y: 0.8,  z: -0.5, color: '#1d4ed8', label: 'Instalatér Praha',  result: '+340%' },
  { x: 2.6,  y: -0.5, z: -1,   color: '#0f766e', label: 'Zubní ordinace',    result: '70% nových' },
  { x: -2.6, y: 0.8,  z: -0.5, color: '#d97706', label: 'Kavárna Jihlava',   result: '+40%' },
  { x: -2.6, y: -0.5, z: -1,   color: '#7c3aed', label: 'Autoservis Plzeň',  result: '+120%' },
] as const;

function PortCard({ idx, color, label, result }: { idx: number; color: string; label: string; result: string }) {
  const ref = useRef<THREE.Group>(null!);
  const { x, y, z } = PORT_CARDS[idx];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const target = SV.portVis > 0.01 ? 1 : 0;
    ref.current.scale.setScalar(ref.current.scale.x + (target - ref.current.scale.x) * 0.06);
    ref.current.position.y = y + Math.sin(t * 0.5 + idx * 1.5) * 0.08;
    ref.current.rotation.y = Math.sin(t * 0.3 + idx) * 0.04;
  });
  return (
    <group ref={ref} position={[x, y, z]} scale={0}>
      <mesh>
        <boxGeometry args={[1.9, 1.15, 0.04]} />
        <meshStandardMaterial color={color} metalness={0.1} roughness={0.6} />
      </mesh>
      <Html transform position={[0, 0, 0.025]} scale={0.003} style={{ pointerEvents: 'none' }} zIndexRange={[0, 40]}>
        <div style={{ width: '633px', height: '383px', padding: '20px', fontFamily: FONT, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: '12px', margin: 0 }}>Realizace</p>
          <div>
            <p style={{ color: 'white', fontSize: '18px', fontWeight: 800, margin: '0 0 6px' }}>{label}</p>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,.18)', borderRadius: '12px', padding: '4px 12px' }}>
              <span style={{ color: 'white', fontSize: '13px', fontWeight: 700 }}>{result} výsledek</span>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function ProjectPanels() {
  return (
    <>
      {PORT_CARDS.map((c, i) => (
        <PortCard key={i} idx={i} color={c.color} label={c.label} result={c.result} />
      ))}
    </>
  );
}

const STAT_DATA = [
  { x: -2.2, y: 1.3,  n: '48h',  l: 'Dodání'     },
  { x:  2.2, y: 1.3,  n: '50+',  l: 'Webů'        },
  { x: -2.2, y: -1.0, n: '100%', l: 'Spokojení'   },
  { x:  2.2, y: -1.0, n: '0 Kč', l: 'Záloha'      },
] as const;

function StatOrb({ idx, n, l }: { idx: number; n: string; l: string }) {
  const ref = useRef<THREE.Group>(null!);
  const { x, y } = STAT_DATA[idx];
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const target = SV.statVis > 0.01 ? 1 : 0;
    ref.current.scale.setScalar(ref.current.scale.x + (target - ref.current.scale.x) * 0.06);
    ref.current.position.y = y + Math.sin(t * 0.4 + idx) * 0.06;
  });
  return (
    <group ref={ref} position={[x, y, 0.5]} scale={0}>
      <mesh>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial color="#0a1528" metalness={0.4} roughness={0.5} transparent opacity={0.9} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.58, 0.015, 8, 64]} />
        <meshStandardMaterial color="#2563eb" emissive="#2563eb" emissiveIntensity={0.8} transparent opacity={0.6} />
      </mesh>
      <Html transform position={[0, 0, 0.56]} scale={0.0025} style={{ pointerEvents: 'none' }} zIndexRange={[0, 40]}>
        <div style={{ width: '440px', height: '440px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: FONT }}>
          <p style={{ color: 'white', fontSize: '56px', fontWeight: 800, margin: 0, letterSpacing: '-.04em' }}>{n}</p>
          <p style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 600, margin: 0 }}>{l}</p>
        </div>
      </Html>
    </group>
  );
}

function StatPanels() {
  return (
    <>
      {STAT_DATA.map((s, i) => <StatOrb key={i} idx={i} n={s.n} l={s.l} />)}
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════
   AMBIENT — Particles, Ring, Camera
═══════════════════════════════════════════════════════════════ */
function Particles({ count = 2800 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 9 + Math.random() * 10, θ = Math.random() * Math.PI * 2, φ = Math.acos(2 * Math.random() - 1);
      arr[i*3]=r*Math.sin(φ)*Math.cos(θ); arr[i*3+1]=r*Math.sin(φ)*Math.sin(θ); arr[i*3+2]=r*Math.cos(φ);
    }
    return arr;
  }, [count]);
  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock: c }) => { ref.current.rotation.y = c.elapsedTime * 0.018; ref.current.rotation.x = Math.sin(c.elapsedTime * 0.007) * 0.05; });
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[positions, 3]} /></bufferGeometry>
      <pointsMaterial size={0.022} color="#4f8ef7" sizeAttenuation transparent opacity={0.65} />
    </points>
  );
}

function RingAccent() {
  const r = useRef<THREE.Mesh>(null!);
  useFrame(({ clock: c }) => {
    r.current.rotation.z = c.elapsedTime * 0.07;
    r.current.rotation.x = Math.sin(c.elapsedTime * 0.04) * 0.25 + 0.45;
  });
  return (
    <mesh ref={r} position={[0.4, 0.1, -1.8]}>
      <torusGeometry args={[3.0, 0.014, 8, 90]} />
      <meshStandardMaterial color="#1e4090" emissive="#1e4090" emissiveIntensity={1.3} transparent opacity={0.5} />
    </mesh>
  );
}

function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (SV.camX - camera.position.x) * 0.06;
    camera.position.y += (SV.camY - camera.position.y) * 0.06;
    camera.position.z += (SV.camZ - camera.position.z) * 0.06;
    camera.lookAt(SV.monX * 0.4, SV.monY * 0.2, 0);
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

    /* ── GSAP timeline ────────────────────────────────────────── */
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.2,
      },
    });

    // S1→S2: Camera zooms in to hero
    tl.to(SV, { camZ: 6.8, monX: 0.3, duration: 1 }, 0);
    tl.to(SV, { monRotY: -0.07, duration: 0.6 }, 0.4);

    // S2→S3: Camera circles left, services appear
    tl.to(SV, { camX: -1.8, camY: 0.35, camZ: 7.8, monRotY: 0.25, monX: 0.5, svcVis: 1, duration: 1 }, 1);

    // S3→S4: Zoom in close for portfolio
    tl.to(SV, { camX: 0.6, camY: -0.25, camZ: 4.8, monRotY: -0.04, monScale: 1.07, portVis: 1, svcVis: 0, duration: 1 }, 2);

    // S4→S5: Pull back for stats
    tl.to(SV, { camX: 1.4, camY: -0.55, camZ: 9, monRotX: -0.14, monRotY: -0.1, monScale: 1, statVis: 1, portVis: 0, duration: 1 }, 3);

    // S5→S6: Final CTA
    tl.to(SV, { camX: 0, camY: 0, camZ: 11, monRotX: 0, monRotY: 0, monScale: 0.84, statVis: 0, duration: 1 }, 4);

    /* ── Section tracking ────────────────────────────────────── */
    const onScroll = () => {
      const sH = window.innerHeight;
      const s = Math.min(5, Math.max(0, Math.floor(window.scrollY / sH)));
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
      camera={{ position: [0, 0, 12], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ width: '100%', height: '100%', background: 'transparent' }}
    >
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
