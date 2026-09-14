"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function DustParticles() {
  const count = 2500;
  const mesh = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#00F0FF"), // Cyan
      new THREE.Color("#FF003C"), // Magenta
      new THREE.Color("#FFD700"), // Yellow
      new THREE.Color("#444466"), // Dim gray-blue
      new THREE.Color("#111122"), // Very dim
    ];

    for (let i = 0; i < count; i++) {
      // Spread across a wide and tall area
// eslint-disable-next-line react-hooks/purity
      pos[i * 3] = (Math.random() - 0.5) * 30; // x
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60; // y (extra tall for scrolling)
      // eslint-disable-next-line react-hooks/purity
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15 - 5; // z

      // Weighted random color (mostly dim, some bright)
      // eslint-disable-next-line react-hooks/purity
      const rand = Math.random();
      let color;
      if (rand > 0.97) color = colorPalette[0]; // Cyan
      else if (rand > 0.94) color = colorPalette[1]; // Magenta
      else if (rand > 0.92) color = colorPalette[2]; // Yellow
      else if (rand > 0.5) color = colorPalette[3]; // Dim gray
      else color = colorPalette[4]; // Very dim

      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;
    }
    return [pos, col];
  }, []);

  useFrame((state) => {
    if (!mesh.current || !group.current) return;

    // Subtle slow drift
    mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
    mesh.current.rotation.x = state.clock.elapsedTime * 0.01;

    // Parallax scroll effect
    // Move particles UP when user scrolls DOWN to simulate depth
    const scrollY = window.scrollY;
    group.current.position.y = scrollY * 0.008;
  });

  return (
    <group ref={group}>
      <points ref={mesh}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        {/* Square particles for retro 8-bit feel */}
        <pointsMaterial
          size={0.05}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export default function DigitalDust() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <DustParticles />
      </Canvas>
    </div>
  );
}
