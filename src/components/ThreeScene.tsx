import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const StudyingAvatar = () => {
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Subtle head movement
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(t * 0.5) * 0.1;
      headRef.current.rotation.x = Math.sin(t * 0.3) * 0.05 + 0.1;
    }

    // Typing animation
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = -1.2 + Math.sin(t * 20) * 0.05;
      leftArmRef.current.position.y = -0.2 + Math.sin(t * 15) * 0.02;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = -1.2 + Math.cos(t * 22) * 0.05;
      rightArmRef.current.position.y = -0.2 + Math.cos(t * 18) * 0.02;
    }
  });

  return (
    <group position={[0, -1, 0]}>
      {/* Chair / Base */}
      <mesh position={[0, -0.8, -0.5]}>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Body / Torso */}
      <mesh position={[0, 0.5, 0]}>
        <capsuleGeometry args={[0.5, 1, 4, 8]} />
        <meshStandardMaterial color="#111111" /> {/* Black clothing */}
      </mesh>

      {/* Head */}
      <group ref={headRef} position={[0, 1.8, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#E0AC69" /> {/* Skin tone */}
        </mesh>
        {/* Glasses bridge */}
        <mesh position={[0, 0, 0.38]}>
          <boxGeometry args={[0.1, 0.02, 0.05]} />
          <meshStandardMaterial color="black" />
        </mesh>
        {/* Glasses Lens Left */}
        <mesh position={[-0.15, 0, 0.38]}>
          <ringGeometry args={[0.08, 0.1, 32]} />
          <meshStandardMaterial color="black" side={THREE.DoubleSide} />
        </mesh>
        {/* Glasses Lens Right */}
        <mesh position={[0.15, 0, 0.38]}>
          <ringGeometry args={[0.08, 0.1, 32]} />
          <meshStandardMaterial color="black" side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.6, 1.2, 0.2]}>
        <mesh rotation={[0, 0, 0]}>
          <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#E0AC69" />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.6, 1.2, 0.2]}>
        <mesh>
          <capsuleGeometry args={[0.12, 0.6, 4, 8]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.4, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color="#E0AC69" />
        </mesh>
      </group>

      {/* Laptop Desk */}
      <mesh position={[0, 0.5, 1]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[2.5, 0.05, 1.5]} />
        <meshStandardMaterial color="#eeeeee" />
      </mesh>

      {/* Laptop */}
      <group position={[0, 0.6, 1]}>
        {/* Base */}
        <RoundedBox args={[1.2, 0.04, 0.8]} radius={0.02}>
          <meshStandardMaterial color="#cccccc" />
        </RoundedBox>
        {/* Screen */}
        <RoundedBox 
          args={[1.2, 0.8, 0.04]} 
          radius={0.02} 
          position={[0, 0.4, -0.4]} 
          rotation={[-0.3, 0, 0]}
        >
          <meshStandardMaterial color="#222222" />
        </RoundedBox>
        {/* Screen Content (Glow) */}
        <mesh position={[0, 0.4, -0.37]} rotation={[-0.3, 0, 0]}>
          <planeGeometry args={[1.1, 0.7]} />
          <meshStandardMaterial color="#4CAF50" emissive="#4CAF50" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Grid Floor */}
      <gridHelper args={[10, 10, 0x000000, 0xdddddd]} position={[0, -0.9, 0]} />
    </group>
  );
};

export const ThreeScene = () => {
  return (
    <div className="w-full h-full bg-white cursor-move">
      <Canvas camera={{ position: [4, 3, 6], fov: 45 }}>
        <React.Suspense fallback={null}>
          <color attach="background" args={['#ffffff']} />
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
          
          <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
            <StudyingAvatar />
          </Float>

          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 4}
            maxPolarAngle={Math.PI / 2}
          />
        </React.Suspense>
      </Canvas>
    </div>
  );
};
