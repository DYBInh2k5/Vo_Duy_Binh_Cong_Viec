import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';
import { ErrorBoundary } from './ErrorBoundary';
import { VDBLogo } from './VDBLogo';

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

const Bauhaus2DFallback = () => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-stone-50 select-none text-left relative overflow-hidden">
      {/* Decorative Blueprint Lines */}
      <div className="absolute top-0 left-0 w-full h-full grid grid-cols-4 grid-rows-4 pointer-events-none border border-stone-200/50">
        <div className="border-r border-b border-stone-200/40"></div>
        <div className="border-r border-b border-stone-200/40"></div>
        <div className="border-r border-b border-stone-200/40"></div>
        <div className="border-r border-b border-stone-200/40"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6">
        <VDBLogo size="lg" className="hover:rotate-6 transition-transform duration-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" />
        <div className="text-center font-mono space-y-1">
          <div className="font-black text-black tracking-widest text-xs uppercase bg-bauhaus-yellow px-2 py-0.5 border border-black inline-block">
            VDB PROTOCOL ACTIVE
          </div>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mt-1">
            FORM FOLLOWS FUNCTION
          </p>
        </div>
      </div>

      {/* Bauhaus solid mini graphics in background */}
      <div className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-bauhaus-red opacity-10 border border-black"></div>
      <div className="absolute top-4 right-4 w-8 h-8 bg-bauhaus-blue opacity-10 border border-black"></div>
    </div>
  );
};

export const ThreeScene = () => {
  const [webglSupported, setWebglSupported] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const supported = !!(
        window.WebGLRenderingContext && 
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebglSupported(supported);
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return <Bauhaus2DFallback />;
  }

  return (
    <div className="w-full h-full bg-white cursor-move">
      <ErrorBoundary fallback={<Bauhaus2DFallback />}>
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
      </ErrorBoundary>
    </div>
  );
};

