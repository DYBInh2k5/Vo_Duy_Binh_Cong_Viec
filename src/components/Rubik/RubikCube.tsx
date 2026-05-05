import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

const COLORS = {
  up: '#ffffff',    // White
  down: '#ffff00',  // Yellow
  left: '#ff8c00',  // Orange
  right: '#ff0000', // Red
  front: '#0000ff', // Blue
  back: '#008000',  // Green
  internal: '#000000' // Black for internal faces
};

interface CubieProps {
  initialPos: [number, number, number];
  size: number;
}

const Cubie = ({ initialPos, size }: CubieProps) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Determine if a face is "internal" or on the surface
  const isInternal = (val: number) => {
    const limit = (size - 1) / 2;
    return Math.abs(val) < limit - 0.1;
  };

  return (
    <group position={initialPos} ref={meshRef}>
      <RoundedBox args={[0.95, 0.95, 0.95]} radius={0.05} smoothness={4}>
        <meshStandardMaterial attach="material-0" color={initialPos[0] > (size-1)/2 - 0.1 ? COLORS.right : COLORS.internal} />
        <meshStandardMaterial attach="material-1" color={initialPos[0] < -(size-1)/2 + 0.1 ? COLORS.left : COLORS.internal} />
        <meshStandardMaterial attach="material-2" color={initialPos[1] > (size-1)/2 - 0.1 ? COLORS.up : COLORS.internal} />
        <meshStandardMaterial attach="material-3" color={initialPos[1] < -(size-1)/2 + 0.1 ? COLORS.down : COLORS.internal} />
        <meshStandardMaterial attach="material-4" color={initialPos[2] > (size-1)/2 - 0.1 ? COLORS.front : COLORS.internal} />
        <meshStandardMaterial attach="material-5" color={initialPos[2] < -(size-1)/2 + 0.1 ? COLORS.back : COLORS.internal} />
      </RoundedBox>
    </group>
  );
};

interface RubikCubeProps {
  size: number;
  rotationQueue: { axis: 'x' | 'y' | 'z'; layer: number; direction: number }[];
  onRotationEnd: () => void;
}

export const RubikCube = ({ size, rotationQueue, onRotationEnd }: RubikCubeProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const [cubies, setCubies] = useState<[number, number, number][]>([]);
  const rotating = useRef(false);

  useEffect(() => {
    const newCubies: [number, number, number][] = [];
    const offset = (size - 1) / 2;
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          newCubies.push([x - offset, y - offset, z - offset]);
        }
      }
    }
    setCubies(newCubies);
  }, [size]);

  useFrame(() => {
    if (rotationQueue.length > 0 && !rotating.current && groupRef.current) {
      const move = rotationQueue[0];
      rotating.current = true;

      const layerCubies: THREE.Object3D[] = [];
      const axisKey = move.axis === 'x' ? 0 : move.axis === 'y' ? 1 : 2;
      
      groupRef.current.children.forEach((child) => {
        if (Math.abs(child.position[move.axis] - move.layer) < 0.1) {
          layerCubies.push(child);
        }
      });

      const pivot = new THREE.Group();
      groupRef.current.add(pivot);
      layerCubies.forEach((c) => pivot.add(c));

      const startTime = performance.now();
      const duration = 200;
      const targetRotation = (Math.PI / 2) * move.direction;

      const animate = (time: number) => {
        const elapsed = time - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3); // easeOutCubic

        pivot.rotation[move.axis] = ease * targetRotation;

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          pivot.updateMatrixWorld();
          layerCubies.forEach((c) => {
            const worldPos = new THREE.Vector3();
            const worldQuat = new THREE.Quaternion();
            c.getWorldPosition(worldPos);
            c.getWorldQuaternion(worldQuat);
            
            groupRef.current!.add(c);
            c.position.copy(worldPos);
            c.quaternion.copy(worldQuat);
            
            // Fix precision
            c.position.x = Math.round(c.position.x * 2) / 2;
            c.position.y = Math.round(c.position.y * 2) / 2;
            c.position.z = Math.round(c.position.z * 2) / 2;
          });
          groupRef.current!.remove(pivot);
          rotating.current = false;
          onRotationEnd();
        }
      };

      requestAnimationFrame(animate);
    }
  });

  return (
    <group ref={groupRef}>
      {cubies.map((pos, i) => (
        <Cubie key={`${size}-${i}`} initialPos={pos} size={size} />
      ))}
    </group>
  );
};
