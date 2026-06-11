import { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const BrandColors = {
  primary: '#3355EE',
  pink: '#FF4D94',
  yellow: '#FFCC22',
  green: '#33CC44',
  purple: '#7766DD',
  cream: '#F7F8FF',
};

function getRandomColor() {
  const colors = [BrandColors.pink, BrandColors.yellow, BrandColors.green, BrandColors.purple];
  return colors[Math.floor(Math.random() * colors.length)];
}

const eyeWhiteMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.1 });
const pupilMat = new THREE.MeshStandardMaterial({ color: '#000000', roughness: 0.1 });
const blushMat = new THREE.MeshStandardMaterial({ color: BrandColors.pink, transparent: true, opacity: 0.3 });
const whiteMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 });
const darkMat = new THREE.MeshStandardMaterial({ color: '#1a1a1a', roughness: 0.5 });
const creamMat = new THREE.MeshStandardMaterial({ color: BrandColors.cream, roughness: 0.6 });

interface LimbData {
  pos: number[];
  rot: number[];
  color: string;
}

function MoodEntity({ targetMood, mousePosition }: { targetMood: string; mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const groupRef = useRef<THREE.Group>(null);
  const [currentMood, setCurrentMood] = useState('happy');

  const limbsRef = useRef<LimbData[]>([
    { pos: [-1.2, 0, 0], rot: [0, 0, 0.5], color: BrandColors.primary },
    { pos: [1.2, 0, 0], rot: [0, 0, -0.5], color: BrandColors.pink },
    { pos: [-0.5, -1.5, 0], rot: [0, 0, 0.2], color: BrandColors.yellow },
    { pos: [0.5, -1.5, 0], rot: [0, 0, -0.2], color: BrandColors.green },
  ]);

  const limbMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame(() => {
    if (targetMood && targetMood !== currentMood) {
      setCurrentMood(targetMood);
    }
  });

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.scale.setScalar(1 + Math.sin(t * 2) * 0.02);
      groupRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mousePosition.current.y * 0.2,
        0.1
      );
      groupRef.current.rotation.z = THREE.MathUtils.lerp(
        groupRef.current.rotation.z,
        mousePosition.current.x * 0.2,
        0.1
      );
    }
    limbsRef.current.forEach((limb, i) => {
      const offset = i * 1.5;
      limb.pos[1] = Math.sin(t * 3 + offset) * 0.1;
      const mesh = limbMeshRefs.current[i];
      if (mesh) {
        mesh.position.y = limb.pos[1];
      }
    });
  });

  const mouthRotation = useMemo(
    () => [currentMood === 'sad' ? 3.14 : 0, 0, 0] as [number, number, number],
    [currentMood]
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Torso */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[2, 2.5, 1]} />
        <primitive object={creamMat} attach="material" />
      </mesh>

      {/* Head */}
      <mesh position={[0, 1.8, 0]} castShadow>
        <sphereGeometry args={[1.2, 32, 32]} />
        <primitive object={whiteMat} attach="material" />

        {/* Left eye */}
        <group position={[-0.4, 0.2, 1]}>
          <mesh>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <primitive object={eyeWhiteMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <primitive object={pupilMat} attach="material" />
          </mesh>
        </group>

        {/* Right eye */}
        <group position={[0.4, 0.2, 1]}>
          <mesh>
            <torusGeometry args={[0.3, 0.05, 16, 32]} />
            <primitive object={eyeWhiteMat} attach="material" />
          </mesh>
          <mesh position={[0, 0, 0.1]}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <primitive object={pupilMat} attach="material" />
          </mesh>
        </group>

        {/* Left blush */}
        <mesh position={[-0.7, -0.2, 0.8]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <primitive object={blushMat} attach="material" />
        </mesh>

        {/* Right blush */}
        <mesh position={[0.7, -0.2, 0.8]}>
          <sphereGeometry args={[0.2, 16, 16]} />
          <primitive object={blushMat} attach="material" />
        </mesh>

        {/* Mouth */}
        <group rotation={mouthRotation}>
          <mesh position={[0, -0.4, 1]}>
            <torusGeometry args={[0.3, 0.05, 16, 32, currentMood === 'happy' ? 3.14 : 1.5]} />
            <primitive object={darkMat} attach="material" />
          </mesh>
        </group>
      </mesh>

      {/* Limbs */}
      {limbsRef.current.map((limb, i) => {
        const limbMat = new THREE.MeshStandardMaterial({ color: limb.color, roughness: 0.2 });
        return (
          <mesh
            key={i}
            ref={(el) => { limbMeshRefs.current[i] = el; }}
            position={[limb.pos[0], limb.pos[1], limb.pos[2]]}
            rotation={[limb.rot[0], limb.rot[1], limb.rot[2]]}
            castShadow
          >
            <capsuleGeometry args={[0.3, 1.2, 4, 8]} />
            <primitive object={limbMat} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}

function RotatingShape({
  shapeData,
  type,
}: {
  shapeData: { x: number; y: number; z: number; s: number; r?: number; color: string; speed: number };
  type: 'square' | 'triangle';
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    shapeData.s += Math.sin(t * shapeData.speed + (type === 'square' ? 1 : 2)) * 0.002;
    if (type === 'square') {
      meshRef.current.rotation.y = t * shapeData.speed * 0.1;
    } else {
      meshRef.current.rotation.z = t * shapeData.speed * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[shapeData.x, shapeData.y, shapeData.z]}>
      {type === 'square' ? (
        <planeGeometry args={[shapeData.s, shapeData.s]} />
      ) : (
        <circleGeometry args={[shapeData.s, 3]} />
      )}
      <meshBasicMaterial
        color={shapeData.color}
        transparent
        opacity={0.4}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function BreathingBackground({ mousePosition }: { mousePosition: React.MutableRefObject<{ x: number; y: number }> }) {
  const circles = useRef(
    Array.from({ length: 12 }, () => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
      z: -5 - Math.random() * 5,
      r: 0.5 + Math.random(),
      color: getRandomColor(),
      speed: 0.5 + Math.random() * 0.5,
    }))
  );
  const squares = useRef(
    Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
      z: -5 - Math.random() * 5,
      s: 0.5 + Math.random(),
      color: getRandomColor(),
      speed: 0.5 + Math.random() * 0.5,
    }))
  );
  const triangles = useRef(
    Array.from({ length: 8 }, () => ({
      x: (Math.random() - 0.5) * 15,
      y: (Math.random() - 0.5) * 15,
      z: -5 - Math.random() * 5,
      s: 0.5 + Math.random(),
      color: getRandomColor(),
      speed: 0.5 + Math.random() * 0.5,
    }))
  );

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    mousePosition.current.x;
    mousePosition.current.y;
    circles.current.forEach((c) => {
      c.r += Math.sin(t * c.speed) * 0.002;
    });
  });

  return (
    <>
      {circles.current.map((c, i) => (
        <mesh key={`c-${i}`} position={[c.x, c.y, c.z]}>
          <circleGeometry args={[c.r, 32]} />
          <meshBasicMaterial
            color={c.color}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
      {squares.current.map((s, i) => (
        <RotatingShape key={`s-${i}`} shapeData={s} type="square" />
      ))}
      {triangles.current.map((tr, i) => (
        <RotatingShape key={`t-${i}`} shapeData={tr} type="triangle" />
      ))}
    </>
  );
}

export default function MoodCompanionCanvas() {
  const [targetMood] = useState('happy');
  const mousePosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      mousePosition.current.x = x;
      mousePosition.current.y = y;
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full z-10">
      <Canvas gl={{ alpha: true }} camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <pointLight position={[-5, 3, 2]} intensity={0.4} color="#FFDEF6" />
        <Suspense fallback={null}>
          <MoodEntity targetMood={targetMood} mousePosition={mousePosition} />
          <BreathingBackground mousePosition={mousePosition} />
          <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
        </Suspense>
      </Canvas>
    </div>
  );
}
