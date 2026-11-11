"use client";

import { useLayoutEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, useCursor } from "@react-three/drei";
import { BRICK_COLORS, BRICK_HEIGHT, BRICK_SIZES } from "@/lib/bricks";
import { FLOATERS, SHIELD, type Floater, type ShieldBrick } from "@/lib/shield";
import { brickGeometry, plasticMaterial } from "./geometry";
import { StudioLights } from "./StudioLights";

const H = BRICK_HEIGHT;
const TARGET = new THREE.Vector3(0.3, 5.5, 0);
const HOVER_HEIGHT = 2.4;
const PERIOD = 5.6;
const MAX_TILT = 0.1;
/** How far a hovered brick slides out of the wall, toward the viewer. */
const PULL = 0.32;

const easeInQuad = (t: number) => t * t;
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smoothstep = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const damp = THREE.MathUtils.damp;

/**
 * Where a "snap" brick sits along its loop: [lift above its slot, squash].
 * Lift never goes below 0, so a brick can never sink into the row beneath it.
 */
function snapPose(t: number): [number, number] {
  // hover above the slot with a gentle bob (starts and ends at HOVER_HEIGHT)
  if (t < 0.2) return [HOVER_HEIGHT + Math.sin((t / 0.2) * Math.PI * 2) * 0.08, 1];
  // drop straight down, accelerating into the studs
  if (t < 0.4) return [HOVER_HEIGHT * (1 - easeInQuad((t - 0.2) / 0.2)), 1];
  // the "click": a tiny rebound and squash (scaled from the brick's base)
  if (t < 0.48) {
    const k = Math.sin(((t - 0.4) / 0.08) * Math.PI);
    return [k * 0.05, 1 - k * 0.03];
  }
  if (t < 0.84) return [0, 1];
  // lift off again
  return [HOVER_HEIGHT * easeInOut((t - 0.84) / 0.16), 1];
}

/** Tilt only once the brick is well clear of its neighbors. */
function tiltFor(lift: number) {
  return MAX_TILT * smoothstep(1.1, HOVER_HEIGHT, lift);
}

function CameraRig() {
  const { camera, size } = useThree();
  useLayoutEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const dist = aspect < 0.85 ? 34 : aspect < 1.1 ? 30.5 : 26.5;
    const dir = new THREE.Vector3(0.24, 0.32, 0.92).normalize();
    camera.position.copy(TARGET).addScaledVector(dir, dist);
    camera.lookAt(TARGET);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

function ShieldBrickMesh({
  b,
  reduced,
  hovered,
}: {
  b: ShieldBrick;
  reduced: boolean;
  hovered: React.RefObject<string | null>;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const pull = useRef(0);
  const geometry = brickGeometry(b.len, 2);
  const material = plasticMaterial(BRICK_COLORS[b.color].hex);
  const base = useMemo(() => new THREE.Vector3(b.x + b.len / 2, b.row * H, 0), [b]);
  const dir = b.anim && b.anim.phase > 0.2 ? -1 : 1;

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    m.position.copy(base);
    m.rotation.set(0, 0, 0);
    if (reduced && b.anim && b.anim.phase > 0.2) {
      // static pose: one brick waiting above its slot
      m.position.y = base.y + HOVER_HEIGHT;
      m.rotation.z = MAX_TILT * dir;
    }
  }, [base, reduced, b.anim, dir]);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m || reduced) return;
    // Hover slides the brick out of the wall (along z), never up or sideways,
    // so it can't pass through the bricks around it.
    pull.current = damp(pull.current, hovered.current === b.id ? PULL : 0, 12, dt);
    m.position.z = base.z + pull.current;
    if (b.anim) {
      const t = (state.clock.elapsedTime / PERIOD + b.anim.phase) % 1;
      const [lift, squash] = snapPose(t);
      const tilt = tiltFor(lift);
      m.position.y = base.y + lift;
      m.rotation.z = tilt * dir;
      m.rotation.x = tilt * 0.35;
      m.scale.set(1, squash, 1);
    }
  });

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      castShadow
      receiveShadow
      userData={{ id: b.id }}
    />
  );
}

function FloaterMesh({ f, reduced }: { f: Floater; reduced: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const spin = useRef(0);
  const [w, d] = BRICK_SIZES[f.size];
  const geometry = brickGeometry(w, d);
  const material = plasticMaterial(BRICK_COLORS[f.color].hex);

  useLayoutEffect(() => {
    const m = ref.current;
    if (!m) return;
    m.position.set(...f.pos);
    m.rotation.set(...f.rot);
  }, [f]);

  useFrame((state, dt) => {
    const m = ref.current;
    if (!m || reduced) return;
    const t = state.clock.elapsedTime * f.speed;
    spin.current = damp(spin.current, 0, 3, dt);
    m.position.y = f.pos[1] + Math.sin(t + f.pos[0]) * 0.32;
    m.rotation.x = f.rot[0] + Math.sin(t * 0.7) * 0.12;
    m.rotation.y += dt * (0.18 * f.speed + spin.current);
    m.rotation.z = f.rot[2] + Math.cos(t * 0.6) * 0.1;
  });

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    spin.current = 9;
  };

  return (
    <mesh
      ref={ref}
      geometry={geometry}
      material={material}
      castShadow
      onClick={onClick}
      userData={{ floater: true, spin }}
    />
  );
}

function Scene({ reduced }: { reduced: boolean }) {
  const rig = useRef<THREE.Group>(null);
  const hovered = useRef<string | null>(null);
  const [pointer, setPointer] = useState(false);
  useCursor(pointer);

  useFrame((state, dt) => {
    const g = rig.current;
    if (!g || reduced) return;
    const t = state.clock.elapsedTime;
    g.rotation.y = damp(g.rotation.y, -0.16 + state.pointer.x * 0.22 + Math.sin(t * 0.25) * 0.05, 3, dt);
    g.rotation.x = damp(g.rotation.x, -state.pointer.y * 0.05, 3, dt);
    g.position.y = Math.sin(t * 0.8) * 0.12;
  });

  const setHover = (id: string | null) => {
    hovered.current = id;
    setPointer(!!id);
  };

  return (
    <>
      <CameraRig />
      <StudioLights />
      <group ref={rig} rotation={[0, -0.16, 0]}>
        <group
          onPointerMove={(e) => {
            e.stopPropagation();
            const id = (e.object.userData as { id?: string }).id ?? null;
            if (id !== hovered.current) setHover(id);
          }}
          onPointerOut={() => setHover(null)}
        >
          {SHIELD.map((b) => (
            <ShieldBrickMesh key={b.id} b={b} reduced={reduced} hovered={hovered} />
          ))}
        </group>
        {FLOATERS.map((f) => (
          <FloaterMesh key={f.id} f={f} reduced={reduced} />
        ))}
      </group>
      <ContactShadows
        position={[0, -1.1, 0]}
        opacity={0.4}
        scale={19}
        blur={2.6}
        far={6}
        resolution={512}
        color="#3d4a6b"
        frames={reduced ? 1 : Infinity}
      />
    </>
  );
}

export default function HeroCanvas({
  reduced,
  active,
  onReady,
}: {
  reduced: boolean;
  active: boolean;
  onReady?: () => void;
}) {
  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.75]}
      frameloop={reduced ? "demand" : active ? "always" : "never"}
      camera={{ fov: 30, near: 0.5, far: 120, position: [12, 13, 25] }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
      aria-hidden
    >
      <Scene reduced={reduced} />
    </Canvas>
  );
}
