'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useMemo } from 'react';

/* ─── Shared smooth mouse (module-level, client-only) ────────────── */
const M = {
  target: typeof window !== 'undefined' ? new THREE.Vector2() : { x: 0, y: 0 } as { x: number; y: number },
  smooth: typeof window !== 'undefined' ? new THREE.Vector2() : { x: 0, y: 0 } as { x: number; y: number },
};
if (typeof window !== 'undefined') {
  window.addEventListener('mousemove', (e) => {
    (M.target as THREE.Vector2).set(
      (e.clientX / window.innerWidth) * 2 - 1,
      -((e.clientY / window.innerHeight) * 2 - 1),
    );
  }, { passive: true });
}

/* ─── Camera rig ──────────────────────────────────────────────────── */
function CameraRig() {
  const { camera } = useThree();
  useFrame(() => {
    (M.smooth as THREE.Vector2).lerp(M.target as THREE.Vector2, 0.04);
    camera.position.x += (M.smooth.x * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (M.smooth.y * 0.3 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

/* ─── Monitor ─────────────────────────────────────────────────────── */
function Monitor() {
  const group  = useRef<THREE.Group>(null!);
  const screen = useRef<THREE.MeshStandardMaterial>(null!);
  const rim    = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    group.current.rotation.y += (M.smooth.x * 0.2  - group.current.rotation.y)  * 0.055;
    group.current.rotation.x += (-M.smooth.y * 0.1 - group.current.rotation.x) * 0.055;
    group.current.position.y  = Math.sin(t * 0.55) * 0.08;
    screen.current.emissiveIntensity = 0.32 + Math.sin(t * 2.2) * 0.04;
    rim.current.emissiveIntensity    = 0.7  + Math.sin(t * 2.2) * 0.2;
  });

  return (
    <group ref={group} position={[0.8, 0.15, 0]}>
      {/* Body */}
      <mesh>
        <boxGeometry args={[3.5, 2.4, 0.14]} />
        <meshStandardMaterial color="#111d38" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Screen backing */}
      <mesh position={[0, 0, 0.075]}>
        <boxGeometry args={[3.2, 2.1, 0.01]} />
        <meshStandardMaterial ref={screen} color="#040d1e" emissive="#0e2860" emissiveIntensity={0.32} roughness={1} />
      </mesh>

      {/* Screen rim glow */}
      <mesh position={[0, 0, 0.074]}>
        <boxGeometry args={[3.22, 2.12, 0.001]} />
        <meshStandardMaterial ref={rim} color="#1a3c9a" emissive="#1a3c9a" emissiveIntensity={0.7} transparent opacity={0.35} />
      </mesh>

      {/* ── Website mockup geometry ── */}
      {/* Nav */}
      <mesh position={[0, 0.92, 0.082]}>
        <boxGeometry args={[3.18, 0.2, 0.001]} />
        <meshBasicMaterial color="#080e1e" />
      </mesh>
      {/* Logo */}
      <mesh position={[-1.34, 0.92, 0.083]}>
        <boxGeometry args={[0.32, 0.1, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      {/* Nav links */}
      {[-0.3, 0.1, 0.5, 0.9].map((x, i) => (
        <mesh key={i} position={[x, 0.92, 0.083]}>
          <boxGeometry args={[0.24, 0.06, 0.001]} />
          <meshBasicMaterial color="#1e3060" />
        </mesh>
      ))}

      {/* Hero headline 1 */}
      <mesh position={[-0.7, 0.64, 0.082]}>
        <boxGeometry args={[1.4, 0.14, 0.001]} />
        <meshBasicMaterial color="#1e40af" />
      </mesh>
      {/* Hero headline 2 – blue gradient */}
      <mesh position={[-0.55, 0.44, 0.082]}>
        <boxGeometry args={[1.7, 0.14, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      {/* Sub-text lines */}
      {[0.24, 0.12, 0.0].map((y, i) => (
        <mesh key={i} position={[-0.65 + i * 0.05, y, 0.082]}>
          <boxGeometry args={[1.55 - i * 0.12, 0.055, 0.001]} />
          <meshBasicMaterial color="#1e3060" />
        </mesh>
      ))}
      {/* CTA button */}
      <mesh position={[-1.05, -0.12, 0.082]}>
        <boxGeometry args={[0.62, 0.18, 0.001]} />
        <meshBasicMaterial color="#2563eb" />
      </mesh>
      <mesh position={[-0.45, -0.12, 0.082]}>
        <boxGeometry args={[0.5, 0.18, 0.001]} />
        <meshBasicMaterial color="#111d38" />
      </mesh>

      {/* Stats dark band */}
      <mesh position={[0, -0.38, 0.082]}>
        <boxGeometry args={[3.18, 0.34, 0.001]} />
        <meshBasicMaterial color="#050c1c" />
      </mesh>
      {([[-1.1, '#3b82f6'], [-0.35, '#a78bfa'], [0.4, '#34d399'], [1.15, '#fbbf24']] as const).map(([x, c]) => (
        <mesh key={x} position={[x, -0.38, 0.083]}>
          <boxGeometry args={[0.32, 0.16, 0.001]} />
          <meshBasicMaterial color={c} />
        </mesh>
      ))}

      {/* Service cards */}
      {([-1.0, 0.05, 1.1] as const).map((x, i) => (
        <group key={i} position={[x, -0.82, 0.082]}>
          <mesh>
            <boxGeometry args={[0.9, 0.52, 0.001]} />
            <meshBasicMaterial color={['#0a1530', '#0d0f2a', '#051510'][i]} />
          </mesh>
          <mesh position={[0, 0.25, 0.001]}>
            <boxGeometry args={[0.88, 0.025, 0.001]} />
            <meshBasicMaterial color={['#2563eb', '#7c3aed', '#059669'][i]} />
          </mesh>
          <mesh position={[-0.22, 0.12, 0.001]}>
            <boxGeometry args={[0.35, 0.08, 0.001]} />
            <meshBasicMaterial color={['#1e3a8a', '#3b0764', '#064e3b'][i]} />
          </mesh>
          {[0.02, -0.08, -0.16].map((y, j) => (
            <mesh key={j} position={[0, y, 0.001]}>
              <boxGeometry args={[0.7 - j * 0.06, 0.05, 0.001]} />
              <meshBasicMaterial color="#0d1a30" />
            </mesh>
          ))}
        </group>
      ))}

      {/* Stand */}
      <mesh position={[0, -1.36, -0.01]}>
        <boxGeometry args={[0.14, 0.46, 0.11]} />
        <meshStandardMaterial color="#0c1525" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.62, -0.15]}>
        <boxGeometry args={[1.35, 0.07, 0.65]} />
        <meshStandardMaterial color="#0c1525" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Reflection */}
      <mesh position={[0, -1.66, -0.15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.35, 0.65]} />
        <meshStandardMaterial color="#0a1830" transparent opacity={0.15} metalness={1} roughness={0} />
      </mesh>
    </group>
  );
}

/* ─── Particles ───────────────────────────────────────────────────── */
function Particles({ count = 3000 }: { count?: number }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r     = 8 + Math.random() * 10;
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      arr[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  const ref = useRef<THREE.Points>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.y = clock.elapsedTime * 0.02;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.009) * 0.06;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.023} color="#3b82f6" sizeAttenuation transparent opacity={0.55} />
    </points>
  );
}

/* ─── Floating wireframe shapes ──────────────────────────────────── */
function Floater({
  geom, color, orbit, speed, phase, yAmp,
}: {
  geom: React.ReactElement;
  color: string;
  orbit: number;
  speed: number;
  phase: number;
  yAmp: number;
}) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const a = t * speed + phase;
    ref.current.position.x = Math.cos(a) * orbit;
    ref.current.position.z = Math.sin(a) * orbit - 1.5;
    ref.current.position.y = Math.sin(t * yAmp + phase) * 0.4;
    ref.current.rotation.x += 0.008;
    ref.current.rotation.y += 0.012;
  });
  return (
    <mesh ref={ref}>
      {geom}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} wireframe transparent opacity={0.75} />
    </mesh>
  );
}

/* ─── Ring accent ─────────────────────────────────────────────────── */
function RingAccent() {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    ref.current.rotation.z = clock.elapsedTime * 0.08;
    ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.05) * 0.2 + 0.5;
  });
  return (
    <mesh ref={ref} position={[0.8, 0.15, -1.5]}>
      <torusGeometry args={[2.8, 0.015, 8, 80]} />
      <meshStandardMaterial color="#1e4090" emissive="#1e4090" emissiveIntensity={1.2} transparent opacity={0.55} />
    </mesh>
  );
}

/* ─── Scene root ──────────────────────────────────────────────────── */
export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 9], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.2} />
      <pointLight position={[-6, 5, 4]}  intensity={3.0} color="#3b82f6" />
      <pointLight position={[5, -3, 3]}  intensity={1.5} color="#8b5cf6" />
      <pointLight position={[0, 3, 7]}   intensity={0.6} color="#ffffff" />
      <pointLight position={[3, 1, 1]}   intensity={0.8} color="#60a5fa" />

      <Particles />
      <Monitor />
      <RingAccent />

      <Floater geom={<torusGeometry args={[0.24, 0.075, 8, 22]} />}   color="#60a5fa" orbit={3.4} speed={0.32}  phase={0}          yAmp={0.9} />
      <Floater geom={<icosahedronGeometry args={[0.21]} />}             color="#a78bfa" orbit={3.0} speed={-0.26} phase={2.1}        yAmp={1.1} />
      <Floater geom={<octahedronGeometry args={[0.19]} />}              color="#34d399" orbit={3.7} speed={0.2}   phase={4.2}        yAmp={0.7} />
      <Floater geom={<tetrahedronGeometry args={[0.22]} />}             color="#fbbf24" orbit={2.6} speed={-0.38} phase={1.05}       yAmp={1.3} />
      <Floater geom={<dodecahedronGeometry args={[0.17]} />}            color="#f43f5e" orbit={4.0} speed={0.15}  phase={3.14}       yAmp={0.8} />

      <CameraRig />
    </Canvas>
  );
}
