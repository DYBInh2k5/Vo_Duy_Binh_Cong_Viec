import React from 'react';
import { motion } from 'motion/react';

interface WWELogoProps {
  className?: string;
  color?: string;
}

export const WWELogo: React.FC<WWELogoProps> = ({ className, color = '#D02020' }) => {
  return (
    <div className={`relative overflow-hidden bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 1200 800" className="w-[90%] h-[90%] drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">
        {/* Subtle Bauhaus Grid Background */}
        <defs>
          <pattern id="wwe-bauhaus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="black" strokeWidth="0.5" opacity="0.1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#wwe-bauhaus-grid)" />

        <motion.g
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Top Main 'W' Strokes */}
          <motion.path
            d="M 215 50 L 413 545 L 565 240 L 717 545 L 915 50 L 825 50 L 717 310 L 565 50 L 413 310 L 305 50 Z"
            fill="black"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          />

          {/* Bottom Interlocking 'W' Strokes */}
          <motion.path
            d="M 416 630 L 565 310 L 714 630 L 795 790 L 565 390 L 335 790 Z"
            fill="black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          />

          {/* The Iconic Red Slash */}
          <motion.path
            d="M 180 660 C 450 540 750 540 1020 660 L 980 730 C 750 630 450 630 220 730 Z"
            fill={color}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.7, ease: "circOut" }}
            style={{ originX: "0.5" }}
          />
        </motion.g>

        {/* Small Bauhaus Minimalist Accents to tie back to the site theme */}
        <motion.circle 
          cx="1100" cy="100" r="15" fill="#1F346E"
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}
        />
        <motion.rect 
          x="100" y="700" width="30" height="30" fill="#F2B705"
          initial={{ rotate: 45, scale: 0 }} animate={{ rotate: 0, scale: 1 }} transition={{ delay: 1.4 }}
        />
      </svg>
    </div>
  );
};
