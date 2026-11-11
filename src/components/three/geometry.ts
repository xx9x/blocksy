import * as THREE from "three";
import { RoundedBoxGeometry } from "three-stdlib";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { BRICK_GAP, BRICK_HEIGHT, STUD_HEIGHT, STUD_RADIUS } from "@/lib/bricks";

/**
 * Brick geometry factory. Each footprint is built once and shared by every
 * brick of that size (body + studs merged into a single BufferGeometry, so a
 * brick is one draw call — or one instance in an InstancedMesh).
 *
 * Local origin: centre of the footprint, bottom face at y = 0.
 */

const cache = new Map<string, THREE.BufferGeometry>();

function studGeometry(segments = 28) {
  const r = STUD_RADIUS;
  const h = STUD_HEIGHT;
  // Bottom → top so the lathe's faces point outwards.
  const profile = [
    new THREE.Vector2(r, -0.02),
    new THREE.Vector2(r, h - 0.05),
    new THREE.Vector2(r - 0.006, h - 0.022),
    new THREE.Vector2(r - 0.022, h - 0.006),
    new THREE.Vector2(r - 0.05, h),
    new THREE.Vector2(0, h),
  ];
  return new THREE.LatheGeometry(profile, segments);
}

function prep(g: THREE.BufferGeometry) {
  const n = g.index ? g.toNonIndexed() : g;
  // Keep only the attributes every part shares.
  for (const name of Object.keys(n.attributes)) {
    if (!["position", "normal", "uv"].includes(name)) n.deleteAttribute(name);
  }
  return n;
}

export function brickGeometry(w: number, d: number, quality: "high" | "low" = "high") {
  const key = `${w}x${d}:${quality}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const H = BRICK_HEIGHT;
  const body = new RoundedBoxGeometry(
    w - BRICK_GAP * 2,
    H - BRICK_GAP,
    d - BRICK_GAP * 2,
    quality === "high" ? 4 : 2,
    0.07,
  );
  body.translate(0, (H - BRICK_GAP) / 2, 0);

  const parts: THREE.BufferGeometry[] = [prep(body)];
  const stud = studGeometry(quality === "high" ? 28 : 16);
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < d; j++) {
      const s = stud.clone();
      s.translate(i - w / 2 + 0.5, H - BRICK_GAP, j - d / 2 + 0.5);
      parts.push(prep(s));
    }
  }
  const merged = mergeGeometries(parts, false);
  if (!merged) throw new Error("Could not build brick geometry");
  merged.computeBoundingBox();
  merged.computeBoundingSphere();
  cache.set(key, merged);
  return merged;
}

export function singleStudGeometry() {
  const key = "stud";
  const hit = cache.get(key);
  if (hit) return hit;
  const g = studGeometry(20);
  cache.set(key, g);
  return g;
}

const materials = new Map<string, THREE.MeshPhysicalMaterial>();

/** Glossy ABS-like plastic. Cached per color. */
export function plasticMaterial(hex: string, opts?: { transparent?: boolean; opacity?: number }) {
  const key = `${hex}:${opts?.opacity ?? 1}`;
  const hit = materials.get(key);
  if (hit) return hit;
  const m = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(hex),
    roughness: 0.34,
    metalness: 0,
    clearcoat: 0.55,
    clearcoatRoughness: 0.14,
    specularIntensity: 0.5,
    transparent: opts?.transparent ?? false,
    opacity: opts?.opacity ?? 1,
  });
  materials.set(key, m);
  return m;
}
