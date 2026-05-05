import React, { useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, PerspectiveCamera } from '@react-three/drei';
import { RubikCube } from '../components/Rubik/RubikCube';
import { motion } from 'motion/react';
import { RefreshCw, RotateCcw, Box, ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

const RubikPage = () => {
  const [size, setSize] = useState(3);
  const [rotationQueue, setRotationQueue] = useState<{ axis: 'x' | 'y' | 'z'; layer: number; direction: number }[]>([]);

  const addRotation = (axis: 'x' | 'y' | 'z', layer: number, direction: number) => {
    setRotationQueue(prev => [...prev, { axis, layer, direction }]);
  };

  const onRotationEnd = useCallback(() => {
    setRotationQueue(prev => prev.slice(1));
  }, []);

  const shuffle = () => {
    const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
    const newMoves = Array.from({ length: 20 }, () => {
      const axis = axes[Math.floor(Math.random() * 3)];
      const offset = (size - 1) / 2;
      const layer = Math.floor(Math.random() * size) - offset;
      const direction = Math.random() > 0.5 ? 1 : -1;
      return { axis, layer, direction };
    });
    setRotationQueue(prev => [...prev, ...newMoves]);
  };

  const layers = Array.from({ length: size }, (_, i) => i - (size - 1) / 2);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-20">
      <div className="max-w-7xl mx-auto w-full px-6 py-10 flex flex-col lg:flex-row gap-10 h-[calc(100vh-80px)]">
        
        {/* Left Control Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-6">
          <header>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Rubik Labs</h1>
            <p className="font-mono text-xs text-gray-500 mt-2">v1.2.0 / BAUHAUS DIMENSION</p>
          </header>

          <div className="bg-white border-4 border-black p-6 hard-shadow space-y-6">
            <div>
              <label className="block text-xs font-black uppercase tracking-widest mb-3">Cube Complexity</label>
              <div className="grid grid-cols-3 gap-2">
                {[2, 3, 4].map(s => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`p-3 font-black border-2 border-black transition-all ${size === s ? 'bg-bauhaus-red text-white' : 'hover:bg-gray-100'}`}
                  >
                    {s}x{s}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={shuffle}
              className="w-full bg-black text-white p-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-bauhaus-blue transition-colors"
            >
              <RefreshCw size={20} /> Shuffle Algorithm
            </button>

            <button
              onClick={() => window.location.reload()}
              className="w-full border-4 border-black p-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-gray-100 transition-colors"
            >
              <RotateCcw size={20} /> Hard Reset
            </button>
          </div>

          <div className="hidden lg:block bg-yellow-50 border-4 border-black p-4 text-sm italic font-medium">
            "Space is not a vacuum. It is a structure of geometric possibilities."
            <br />— Bauhaus Theory
          </div>
        </div>

        {/* 3D Viewport */}
        <div className="flex-1 bg-white border-4 border-black relative hard-shadow overflow-hidden group">
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={50} />
            <ambientLight intensity={1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} />
            <Suspense fallback={null}>
              <RubikCube 
                size={size} 
                rotationQueue={rotationQueue} 
                onRotationEnd={onRotationEnd} 
              />
            </Suspense>
            <OrbitControls makeDefault enablePan={false} minDistance={5} maxDistance={15} />
          </Canvas>

          {/* Quick HUD Navigation */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <div className="bg-black text-white px-3 py-1 font-mono text-[10px] uppercase">
              Queue: {rotationQueue.length} moves
            </div>
          </div>
        </div>

        {/* Right Manual Controls (Mobile friendly grid) */}
        <div className="w-full lg:w-48 flex flex-col gap-4 overflow-y-auto pr-2">
          <h3 className="font-black uppercase text-xs tracking-widest text-center py-2 border-b-2 border-black">Manual Axis Control</h3>
          
          <div className="space-y-8">
            {['x', 'y', 'z'].map((axis) => (
              <div key={axis} className="space-y-2">
                <span className="font-mono text-[10px] uppercase opacity-50 block text-center">Axis {axis}</span>
                {layers.map((layer, idx) => (
                  <div key={`${axis}-${layer}`} className="flex gap-2">
                    <button 
                      onClick={() => addRotation(axis as any, layer, 1)}
                      className="flex-1 bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-all flex items-center justify-center"
                    >
                      <ArrowRight size={14} className={axis === 'y' ? '-rotate-90' : axis === 'z' ? 'rotate-90' : ''} />
                    </button>
                    <button 
                      onClick={() => addRotation(axis as any, layer, -1)}
                      className="flex-1 bg-white border-2 border-black p-2 hover:bg-black hover:text-white transition-all flex items-center justify-center"
                    >
                      <ArrowLeft size={14} className={axis === 'y' ? '-rotate-90' : axis === 'z' ? 'rotate-90' : ''} />
                    </button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Suspense = ({ children, fallback }: { children: React.ReactNode, fallback: React.ReactNode }) => {
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
};

export default RubikPage;
