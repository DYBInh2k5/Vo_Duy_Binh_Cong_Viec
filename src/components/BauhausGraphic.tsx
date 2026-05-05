import React from 'react';
import { motion } from 'motion/react';

interface BauhausGraphicProps {
  className?: string;
  seed?: string;
}

export const BauhausGraphic: React.FC<BauhausGraphicProps> = ({ className, seed = 'default' }) => {
  // Use seed to generate semi-random but deterministic shapes
  const getSeedNum = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const s = getSeedNum(seed);
  
  // Bauhaus Colors
  const colors = ['#D02020', '#1F346E', '#F2B705', '#000000', '#FFFFFF'];
  
  return (
    <div className={`relative overflow-hidden bg-white border-4 border-black ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Dynamic Abstract Shapes */}
        <motion.circle 
          cx={100 + (s % 200)} 
          cy={100 + ((s >> 2) % 200)} 
          r={40 + (s % 60)} 
          fill={colors[s % 3]} 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mix-blend-multiply"
        />
        
        <motion.rect 
          x={150 + ((s >> 4) % 150)} 
          y={50 + ((s >> 6) % 150)} 
          width={80 + (s % 100)} 
          height={80 + ((s >> 1) % 100)} 
          fill={colors[(s + 1) % 5]} 
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mix-blend-multiply"
        />

        <motion.path 
          d={`M ${50 + (s % 50)} ${300 + (s % 50)} L 350 350 L 50 350 Z`} 
          fill={colors[(s + 2) % 5]} 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="mix-blend-multiply"
        />

        {/* Bold Bauhaus Lines */}
        <line x1="0" y1={200 + (s % 100)} x2="400" y2={200 + (s % 100)} stroke="black" strokeWidth="8" />
        <line x1={200 + (s % 100)} y1="0" x2={200 + (s % 100)} y2="400" stroke="black" strokeWidth="4" />
        
        {/* Accent dots */}
        <circle cx="20" cy="20" r="10" fill="black" />
        <circle cx="380" cy="380" r="10" fill="black" />
      </svg>
      
      {/* Texture Overlay */}
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-30 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]" />
    </div>
  );
};
