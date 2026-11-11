"use client";

import { Environment, Lightformer } from "@react-three/drei";

/**
 * Soft product-photography lighting built from in-scene light formers, so no
 * HDR file is downloaded. A pale studio color keeps reflections bright.
 */
export function StudioLights({ shadows = true }: { shadows?: boolean }) {
  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight
        position={[9, 15, 9]}
        intensity={2.6}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={14}
        shadow-camera-bottom={-6}
        shadow-camera-near={1}
        shadow-camera-far={50}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      <directionalLight position={[-10, 6, 6]} intensity={0.45} color="#e3ebff" />
      <Environment resolution={256} frames={1} environmentIntensity={0.55}>
        <color attach="background" args={["#eef1f7"]} />
        <Lightformer form="rect" intensity={2.4} position={[0, 12, 4]} rotation-x={Math.PI / 2} scale={[18, 8, 1]} />
        <Lightformer form="rect" intensity={1.8} position={[12, 4, 8]} rotation-y={-Math.PI / 3} scale={[8, 10, 1]} />
        <Lightformer form="rect" intensity={0.9} position={[-12, 3, 4]} rotation-y={Math.PI / 2.4} scale={[8, 8, 1]} />
        <Lightformer form="ring" intensity={1.6} position={[4, 6, -10]} scale={5} />
        <Lightformer form="rect" intensity={0.6} position={[0, -6, 0]} rotation-x={-Math.PI / 2} scale={[20, 20, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}
