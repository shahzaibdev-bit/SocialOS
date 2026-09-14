"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box } from "@react-three/drei";
import Link from "next/link";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { motion } from "motion/react";
import { Squares } from "./react-bits/Squares";
import { ClickSpark } from "./react-bits/ClickSpark";

type SocialIcon = {
  label: string;
  mark: "x" | "linkedin" | "instagram" | "facebook";
  color: string;
  position: [number, number, number];
  orbit: number;
};

const socialIcons: SocialIcon[] = [
  { label: "X", mark: "x", color: "#F8FAFC", position: [-0.78, 0.58, 0.18], orbit: 0 },
  { label: "LinkedIn", mark: "linkedin", color: "#0A66C2", position: [0.72, 0.5, -0.12], orbit: 1.4 },
  { label: "Instagram", mark: "instagram", color: "#E1306C", position: [-0.68, -0.54, -0.05], orbit: 2.7 },
  { label: "Facebook", mark: "facebook", color: "#1877F2", position: [0.76, -0.46, 0.2], orbit: 4.1 },
];

function createIconTexture(icon: SocialIcon) {
  const canvas = document.createElement("canvas");
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  const border = icon.color;
  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = "#05070B";
  ctx.fillRect(0, 0, size, size);

  ctx.shadowColor = border;
  ctx.shadowBlur = 36;
  ctx.strokeStyle = border;
  ctx.lineWidth = 34;
  ctx.strokeRect(64, 64, size - 128, size - 128);

  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(98, 98, size - 196, 26);
  ctx.fillRect(98, size - 124, size - 196, 26);

  ctx.fillStyle = icon.mark === "x" ? "#FFFFFF" : border;
  ctx.strokeStyle = ctx.fillStyle;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  if (icon.mark === "instagram") {
    ctx.lineWidth = 58;
    ctx.shadowColor = border;
    ctx.shadowBlur = 28;
    ctx.strokeRect(292, 292, 440, 440);
    ctx.beginPath();
    ctx.arc(512, 512, 112, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(652, 372, 34, 0, Math.PI * 2);
    ctx.fill();
  } else {
    const text = icon.mark === "linkedin" ? "in" : icon.mark === "facebook" ? "f" : "X";
    const fontSize = icon.mark === "linkedin" ? 390 : 540;
    ctx.font = `900 ${fontSize}px Arial Black, Impact, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.shadowColor = border;
    ctx.shadowBlur = 32;
    ctx.fillText(text, size / 2, icon.mark === "facebook" ? 545 : 520);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function FloatingSocialTile({ icon }: { icon: SocialIcon }) {
  const group = useRef<THREE.Group>(null);
  const texture = useMemo(() => createIconTexture(icon), [icon]);
  const basePosition = useMemo(() => new THREE.Vector3(...icon.position), [icon.position]);
  const idlePosition = useRef(new THREE.Vector3());
  const pushVector = useRef(new THREE.Vector3());
  const targetPosition = useRef(new THREE.Vector3());
  const pointerPosition = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());
  const scaleTarget = useRef(new THREE.Vector3(1, 1, 1));
  
  useFrame((state, delta) => {
    if (group.current) {
      const elapsed = state.clock.elapsedTime;
      const safeDelta = Math.min(delta, 0.035);
      const pointer = pointerPosition.current;
      const idle = idlePosition.current;
      const push = pushVector.current;
      const target = targetPosition.current;
      const movement = velocity.current;

      pointer.set(state.pointer.x * 2.7, state.pointer.y * 1.75, 0);

      idle.copy(basePosition);
      idle.x += Math.cos(elapsed * (0.38 + icon.orbit * 0.025) + icon.orbit) * 0.16;
      idle.y += Math.sin(elapsed * (0.46 + icon.orbit * 0.02) + icon.orbit * 1.3) * 0.16;
      idle.z += Math.sin(elapsed * (0.52 + icon.orbit * 0.018) + icon.orbit) * 0.11;

      push.copy(idle).sub(pointer);
      const distance = Math.max(push.length(), 0.001);
      const influence = THREE.MathUtils.smoothstep(1.35 - distance, 0, 1.35);

      if (influence > 0) {
        push.normalize().multiplyScalar(influence * 0.38);
      } else {
        push.set(0, 0, 0);
      }

      target.copy(idle).add(push);

      const spring = target.sub(group.current.position).multiplyScalar(12);
      movement.addScaledVector(spring, safeDelta);
      movement.multiplyScalar(Math.pow(0.86, safeDelta * 60));
      group.current.position.addScaledVector(movement, safeDelta);

      const bubbleScale = 1 + influence * 0.07 + Math.sin(elapsed * 0.95 + icon.orbit) * 0.012;
      scaleTarget.current.set(bubbleScale, bubbleScale, bubbleScale);
      group.current.scale.lerp(scaleTarget.current, 0.08);
      group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, Math.sin(elapsed * 0.55 + icon.orbit) * 0.18 - movement.y * 0.08, 0.05);
      group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, Math.cos(elapsed * 0.5 + icon.orbit) * 0.28 + movement.x * 0.08, 0.05);
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, Math.sin(elapsed * 0.45 + icon.orbit) * 0.08, 0.05);
    }
  });

  return (
    <group ref={group} position={icon.position} aria-label={`${icon.label} floating icon`}>
      <mesh position={[0, 0, -0.18]}>
        <sphereGeometry args={[0.58, 32, 32]} />
        <meshBasicMaterial color={icon.color} transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <Box args={[0.82, 0.82, 0.18]} castShadow receiveShadow>
        <meshStandardMaterial color="#05070B" emissive={icon.color} emissiveIntensity={0.18} roughness={0.35} metalness={0.58} />
        <lineSegments>
          <edgesGeometry args={[new THREE.BoxGeometry(0.82, 0.82, 0.18)]} />
          <lineBasicMaterial color={icon.color} />
        </lineSegments>
      </Box>
      <mesh position={[0, 0, 0.102]}>
        <planeGeometry args={[0.7, 0.7]} />
        <meshBasicMaterial map={texture} transparent toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.12]}>
        <planeGeometry args={[1.04, 1.04]} />
        <meshBasicMaterial color={icon.color} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

function FloatingSocialScene() {
  const rig = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (rig.current) {
      rig.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.25) * 0.035;
    }
  });

  return (
    <group ref={rig} position={[0.32, 0.78, 0]} scale={0.78}>
      <mesh position={[0, 0, -0.65]}>
        <torusGeometry args={[1.55, 0.012, 8, 96]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={0.35} />
      </mesh>
      <mesh position={[0, 0, -0.75]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.08, 0.01, 8, 80]} />
        <meshBasicMaterial color="#FF003C" transparent opacity={0.28} />
      </mesh>
      {socialIcons.map((icon) => (
        <FloatingSocialTile key={icon.label} icon={icon} />
      ))}
    </group>
  );
}

export default function Hero() {
  return (
    <section className="relative w-full min-h-[80vh] flex flex-col md:flex-row items-center pt-24">
      {/* Full bleed background for squares */}
      <div className="absolute top-0 left-[calc(-50vw+50%)] w-screen h-full overflow-hidden pointer-events-none z-0">
        <Squares speed={0.5} borderColor="#00F0FF" />
      </div>
      
      <div className="w-full md:w-1/2 flex flex-col items-start justify-center z-10 px-4">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-4xl md:text-6xl font-pixel text-white mb-6 leading-tight uppercase shadow-retro-magenta/50 drop-shadow-lg"
        >
          Automate Your Social Empire.
        </motion.h1>
        <p className="text-lg md:text-xl text-retro-cyan font-mono mb-8 border-l-4 border-retro-magenta pl-4 max-w-lg bg-black/40 py-2">
          The first multi-tenant AI social media OS.
        </p>
        
        <ClickSpark sparkColor="#FF003C">
          <Link href="/signup" className="block bg-retro-magenta text-white px-8 py-4 font-pixel uppercase shadow-retro-cyan hover:shadow-retro-cyan-hover hover:translate-y-[2px] hover:translate-x-[2px] transition-all active:shadow-none active:translate-y-[4px] active:translate-x-[4px]">
            Start Free Trial
          </Link>
        </ClickSpark>
      </div>

      <div className="w-full md:w-1/2 h-[430px] md:h-[620px] lg:h-[720px] relative z-10">
        <Canvas camera={{ position: [0, 0, 5.6], fov: 42 }}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#00F0FF" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#FF003C" />
          <FloatingSocialScene />
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Canvas>
      </div>
    </section>
  );
}
