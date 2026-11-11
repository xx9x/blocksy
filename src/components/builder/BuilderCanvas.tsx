"use client";

import { useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { BRICK_COLORS, BRICK_HEIGHT, footprint, type BrickColor, type BrickSize } from "@/lib/bricks";
import { BOARD_SIZE } from "@/lib/state";
import { brickGeometry, plasticMaterial, singleStudGeometry } from "@/components/three/geometry";
import { StudioLights } from "@/components/three/StudioLights";

export interface PlacedView {
  brickId: string;
  x: number;
  z: number;
  level: number;
  rotated: boolean;
  color: BrickColor;
  size: BrickSize;
}

export interface GhostView {
  x: number;
  z: number;
  level: number;
  w: number;
  d: number;
  color: BrickColor;
  ok: boolean;
}

const B = BOARD_SIZE;
const H = BRICK_HEIGHT;
const PLATE_H = 0.32;

const baseplateMaterial = new THREE.MeshStandardMaterial({ color: "#E9EDF5", roughness: 0.5 });
const ghostBad = new THREE.MeshStandardMaterial({ color: "#FF777B", transparent: true, opacity: 0.5, depthWrite: false });
const removeHover = new THREE.MeshBasicMaterial({ color: "#FF777B", transparent: true, opacity: 0.35, depthWrite: false });
const ghostMaterials = new Map<string, THREE.MeshStandardMaterial>();
function ghostMaterial(hex: string) {
  let m = ghostMaterials.get(hex);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ color: hex, transparent: true, opacity: 0.55, depthWrite: false, roughness: 0.4 });
    ghostMaterials.set(hex, m);
  }
  return m;
}

/** Board cell (x, z) → world-space centre of a w×d footprint. */
function worldPos(x: number, z: number, w: number, d: number, level: number): [number, number, number] {
  return [x + w / 2 - B / 2, level * H, z + d / 2 - B / 2];
}

function Baseplate() {
  const studs = useRef<THREE.InstancedMesh>(null);
  useLayoutEffect(() => {
    const m = studs.current;
    if (!m) return;
    const o = new THREE.Object3D();
    let i = 0;
    for (let x = 0; x < B; x++)
      for (let z = 0; z < B; z++) {
        o.position.set(x + 0.5 - B / 2, 0, z + 0.5 - B / 2);
        o.updateMatrix();
        m.setMatrixAt(i++, o.matrix);
      }
    m.instanceMatrix.needsUpdate = true;
  }, []);
  return (
    <group>
      <mesh position={[0, -PLATE_H / 2, 0]} receiveShadow material={baseplateMaterial}>
        <boxGeometry args={[B + 0.4, PLATE_H, B + 0.4]} />
      </mesh>
      {/* One instanced draw call for all 144 studs. */}
      <instancedMesh ref={studs} args={[singleStudGeometry(), baseplateMaterial, B * B]} receiveShadow castShadow />
    </group>
  );
}

function BrickMesh({ p, animate, highlight }: { p: PlacedView; animate: boolean; highlight: boolean }) {
  const ref = useRef<THREE.Mesh>(null);
  const [w, d] = footprint(p.size, p.rotated);
  const pos = worldPos(p.x, p.z, w, d, p.level);
  const geometry = brickGeometry(w, d);
  const material = plasticMaterial(BRICK_COLORS[p.color].hex);
  const t = useRef(animate ? 0 : 1);

  useFrame((_, dt) => {
    const m = ref.current;
    if (!m || t.current >= 1) return;
    t.current = Math.min(1, t.current + dt / 0.28);
    const u = t.current;
    // fall, then a tiny "click" settle
    const fall = u < 0.75 ? 1 - Math.pow(u / 0.75, 2) : 0;
    const settle = u >= 0.75 ? Math.sin(((u - 0.75) / 0.25) * Math.PI) * 0.04 : 0;
    m.position.y = pos[1] + fall * 1.4 + settle;
    const squash = u >= 0.75 ? 1 - Math.sin(((u - 0.75) / 0.25) * Math.PI) * 0.04 : 1;
    m.scale.set(1, squash, 1);
  });

  return (
    <group>
      <mesh
        ref={ref}
        geometry={geometry}
        material={material}
        position={[pos[0], pos[1] + (animate ? 1.4 : 0), pos[2]]}
        castShadow
        receiveShadow
        userData={{ brickId: p.brickId }}
      />
      {highlight && (
        <mesh geometry={geometry} material={removeHover} position={pos} scale={[1.04, 1.04, 1.04]} raycast={() => null} />
      )}
    </group>
  );
}

function Ghost({ g }: { g: GhostView }) {
  const pos = worldPos(g.x, g.z, g.w, g.d, g.level);
  const geometry = brickGeometry(g.w, g.d);
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (ref.current) ref.current.position.y = pos[1] + 0.12 + Math.sin(state.clock.elapsedTime * 5) * 0.04;
  });
  return (
    <group>
      <mesh ref={ref} geometry={geometry} material={g.ok ? ghostMaterial(BRICK_COLORS[g.color].hex) : ghostBad} position={pos} raycast={() => null} />
      {/* footprint marker on the surface it will snap to */}
      <mesh position={[pos[0], pos[1] + 0.26, pos[2]]} rotation-x={-Math.PI / 2} raycast={() => null}>
        <planeGeometry args={[g.w - 0.08, g.d - 0.08]} />
        <meshBasicMaterial color={g.ok ? BRICK_COLORS[g.color].hex : "#FF777B"} transparent opacity={0.28} depthWrite={false} />
      </mesh>
    </group>
  );
}

/** Pull the camera back on narrow screens so the whole baseplate fits. */
function FitCamera() {
  const { camera, size } = useThree();
  const fitted = useRef(false);
  useLayoutEffect(() => {
    if (fitted.current) return;
    fitted.current = true;
    const aspect = size.width / Math.max(1, size.height);
    const k = aspect < 0.9 ? 1.75 : aspect < 1.3 ? 1.25 : 1;
    camera.position.set(11 * k, 13 * k, 15 * k);
    camera.lookAt(0, 1.4, 0);
  }, [camera, size]);
  return null;
}

function cellFromEvent(e: ThreeEvent<PointerEvent | MouseEvent>): [number, number] | null {
  if (!e.face) return null;
  const n = e.face.normal.clone().transformDirection(e.object.matrixWorld);
  const target = e.point.clone().addScaledVector(n, 0.5);
  const x = Math.floor(target.x + B / 2);
  const z = Math.floor(target.z + B / 2);
  if (x < 0 || z < 0 || x >= B || z >= B) return null;
  return [x, z];
}

export default function BuilderCanvas({
  placed,
  ghost,
  tool,
  hoverBrick,
  recentId,
  onHoverCell,
  onHoverBrick,
  onPlaceAt,
  onRemove,
  onReady,
}: {
  placed: PlacedView[];
  ghost: GhostView | null;
  tool: "place" | "remove";
  hoverBrick: string | null;
  recentId: string | null;
  onHoverCell: (cell: [number, number] | null) => void;
  onHoverBrick: (id: string | null) => void;
  onPlaceAt: (cell: [number, number]) => void;
  onRemove: (id: string) => void;
  onReady?: () => void;
}) {
  const last = useRef<string>("");

  return (
    <Canvas
      shadows="soft"
      dpr={[1, 1.75]}
      camera={{ position: [11, 13, 15], fov: 35, near: 0.5, far: 200 }}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NeutralToneMapping;
        gl.toneMappingExposure = 1.05;
        onReady?.();
      }}
      onPointerMissed={() => onHoverCell(null)}
    >
      <FitCamera />
      <StudioLights />
      <group
        onPointerMove={(e) => {
          e.stopPropagation();
          const cell = cellFromEvent(e);
          const key = cell ? cell.join(",") : "";
          if (key !== last.current) {
            last.current = key;
            onHoverCell(cell);
          }
          const id = (e.object.userData as { brickId?: string }).brickId ?? null;
          onHoverBrick(id);
        }}
        onPointerOut={() => {
          onHoverBrick(null);
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.delta > 6) return; // it was a camera drag
          if (tool === "remove") {
            const id = (e.object.userData as { brickId?: string }).brickId;
            if (id) onRemove(id);
            return;
          }
          const cell = cellFromEvent(e);
          if (cell) onPlaceAt(cell);
        }}
      >
        <Baseplate />
        {placed.map((p) => (
          <BrickMesh key={p.brickId} p={p} animate={p.brickId === recentId} highlight={tool === "remove" && hoverBrick === p.brickId} />
        ))}
      </group>
      {ghost && tool === "place" && <Ghost g={ghost} />}
      <OrbitControls
        makeDefault
        target={[0, 1.4, 0]}
        enablePan={false}
        enableDamping
        dampingFactor={0.1}
        minDistance={11}
        maxDistance={48}
        minPolarAngle={0.25}
        maxPolarAngle={1.32}
      />
    </Canvas>
  );
}
