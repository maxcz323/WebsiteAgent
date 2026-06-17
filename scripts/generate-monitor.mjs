/**
 * Generates /public/models/monitor.glb using Three.js + GLTFExporter
 * Run: node scripts/generate-monitor.mjs
 */

/* Node.js polyfills for browser APIs used by GLTFExporter */
if (typeof FileReader === 'undefined') {
  global.FileReader = class {
    readAsArrayBuffer(blob) {
      blob.arrayBuffer().then(buf => {
        this.result = buf;
        if (this.onload)    this.onload({ target: this });
        if (this.onloadend) this.onloadend({ target: this });
      }).catch(err => { if (this.onerror) this.onerror(err); });
    }
  };
}
if (typeof URL === 'undefined') {
  const { URL: NodeURL } = await import('url');
  global.URL = NodeURL;
}

import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { writeFileSync, mkdirSync } from 'fs';

/* ── Materials ───────────────────────────────────────────── */
const bodyMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#07090f'), metalness: 0.88, roughness: 0.12,
});
const chamferMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#0e1828'), metalness: 0.9, roughness: 0.08,
});
const screenMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#01030a'), metalness: 0.0, roughness: 0.95,
});
const rimMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#1a3c9a'),
  emissive: new THREE.Color('#1a3c9a'),
  emissiveIntensity: 0.45,
  transparent: true, opacity: 0.22,
});
const chinMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#060810'), metalness: 0.7, roughness: 0.3,
});
const ledMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#2563eb'),
  emissive: new THREE.Color('#2563eb'),
  emissiveIntensity: 2.5,
});
const standMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#06080e'), metalness: 0.88, roughness: 0.12,
});
const baseMat = new THREE.MeshStandardMaterial({
  color: new THREE.Color('#05070c'), metalness: 0.9, roughness: 0.1,
});

/* ── Helper ─────────────────────────────────────────────── */
function box(w, h, d, mat, px = 0, py = 0, pz = 0, rx = 0, ry = 0, rz = 0, name = '') {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  mesh.position.set(px, py, pz);
  mesh.rotation.set(rx, ry, rz);
  if (name) mesh.name = name;
  return mesh;
}
function sphere(r, mat, px = 0, py = 0, pz = 0, name = '') {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 12), mat);
  mesh.position.set(px, py, pz);
  if (name) mesh.name = name;
  return mesh;
}

/* ── Build scene ────────────────────────────────────────── */
const scene = new THREE.Scene();

// Body
scene.add(box(3.76, 2.58, 0.11, bodyMat, 0, 0, 0, 0, 0, 0, 'Body'));

// Chamfer strips (4 edges)
scene.add(box(3.76, 0.04, 0.04, chamferMat,  0,  1.285, 0.028,  Math.PI/4, 0, 0, 'ChamferTop'));
scene.add(box(3.76, 0.04, 0.04, chamferMat,  0, -1.285, 0.028, -Math.PI/4, 0, 0, 'ChamferBottom'));
scene.add(box(0.04, 2.58, 0.04, chamferMat,  1.875, 0, 0.028, 0,  Math.PI/4, 0, 'ChamferRight'));
scene.add(box(0.04, 2.58, 0.04, chamferMat, -1.875, 0, 0.028, 0, -Math.PI/4, 0, 'ChamferLeft'));

// Screen inset
scene.add(box(3.45, 2.26, 0.008, new THREE.MeshStandardMaterial({ color: new THREE.Color('#020408'), metalness: 0.1, roughness: 0.95 }), 0, 0.035, 0.052, 0, 0, 0, 'ScreenRecess'));
scene.add(box(3.38, 2.20, 0.005, screenMat, 0, 0.035, 0.0575, 0, 0, 0, 'Screen'));
scene.add(box(3.40, 2.22, 0.001, rimMat, 0, 0.035, 0.061, 0, 0, 0, 'ScreenRim'));

// Bezel top highlight
scene.add(box(3.76, 0.006, 0.001, new THREE.MeshStandardMaterial({ color: new THREE.Color('#1e3050'), transparent: true, opacity: 0.5 }), 0, 1.27, 0.056, 0, 0, 0, 'BezelHighlight'));

// Chin
scene.add(box(3.76, 0.1, 0.002, chinMat, 0, -1.205, 0.057, 0, 0, 0, 'Chin'));

// Power LED
scene.add(sphere(0.018, ledMat, 0, -1.205, 0.062, 'PowerLED'));

// Screen light bleed
scene.add(box(3.4, 2.22, 0.001, new THREE.MeshStandardMaterial({ color: new THREE.Color('#0a1e50'), emissive: new THREE.Color('#0a1e50'), emissiveIntensity: 0.1, transparent: true, opacity: 0.05 }), 0, 0.035, 0.054, 0, 0, 0, 'LightBleed'));

// Back panel
scene.add(box(1.6, 1.6, 0.012, new THREE.MeshStandardMaterial({ color: new THREE.Color('#060810'), metalness: 0.85, roughness: 0.15 }), 0, 0.1, -0.058, 0, 0, 0, 'BackPanel'));

// Back vents
[-0.6, -0.4, -0.2, 0.0].forEach((y, i) => {
  scene.add(box(0.9, 0.016, 0.004, new THREE.MeshStandardMaterial({ color: new THREE.Color('#030507'), metalness: 0.6, roughness: 0.4 }), 0, y, -0.056, 0, 0, 0, `Vent${i}`));
});

// Stand neck
scene.add(box(0.09, 0.52, 0.09, standMat, 0, -1.38, -0.02, 0, 0, 0, 'Neck'));
scene.add(box(0.09, 0.24, 0.09, standMat, 0, -1.62, -0.12, 0.32, 0, 0, 'NeckTaper'));

// Stand base
scene.add(box(1.55, 0.055, 0.72, baseMat, 0, -1.79, -0.3, 0, 0, 0, 'Base'));
scene.add(box(1.55, 0.04, 0.04, chamferMat, 0, -1.815, 0.05, Math.PI/4, 0, 0, 'BaseChamfer'));

// Base reflection plane
const reflMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1.55, 0.72),
  new THREE.MeshStandardMaterial({ color: new THREE.Color('#0a1830'), transparent: true, opacity: 0.12, metalness: 1, roughness: 0 }),
);
reflMesh.position.set(0, -1.82, -0.3);
reflMesh.rotation.x = -Math.PI / 2;
reflMesh.name = 'BaseReflection';
scene.add(reflMesh);

/* ── Export ─────────────────────────────────────────────── */
mkdirSync('./public/models', { recursive: true });

const exporter = new GLTFExporter();
const result = await exporter.parseAsync(scene, { binary: true });
const buf = Buffer.from(result);
writeFileSync('./public/models/monitor.glb', buf);
console.log(`✓ Generated public/models/monitor.glb  (${(buf.length / 1024).toFixed(1)} KB)`);
