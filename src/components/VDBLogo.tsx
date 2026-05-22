import React from 'react';
import { motion } from 'motion/react';

interface VDBLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const VDBLogo: React.FC<VDBLogoProps> = ({ 
  className = '', 
  size = 'md', 
  animated = true 
}) => {
  // Dimensions maps
  const dimensions = {
    sm: { width: 40, height: 40, border: 'border-2' },
    md: { width: 80, height: 80, border: 'border-4' },
    lg: { width: 140, height: 140, border: 'border-4' },
    xl: { width: 240, height: 240, border: 'border-8' },
  };

  const dim = dimensions[size];

  // Motion transitions
  const containerVariants: any = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const shapeVariants: any = {
    hidden: { scale: 0, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      transition: { type: 'spring', stiffness: 200, damping: 15 }
    }
  };

  const lineVariants: any = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 0.8, ease: "easeInOut" }
    }
  };

  return (
    <motion.div
      variants={animated ? containerVariants : undefined}
      initial={animated ? "hidden" : "visible"}
      animate="visible"
      className={`relative inline-flex items-center justify-center bg-white dark:bg-stone-900 border-black dark:border-white select-none overflow-hidden ${dim.border} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(0,0,255,1)] transition-shadow duration-300 ${className}`}
      style={{ width: dim.width, height: dim.height }}
    >
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full p-1"
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Bauhaus Rigid Square Grid Pattern */}
        <defs>
          <pattern id="logo-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <rect width="20" height="20" fill="none" stroke="#ccc" strokeWidth="0.5" strokeOpacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#logo-grid)" />

        {/* --- DYNAMIC BACKGROUND BAUHAUS SHAPES --- */}
        {/* High impact Yellow Block */}
        <motion.rect 
          x="15" 
          y="15" 
          width="75" 
          height="170" 
          fill="#FFFF00" 
          stroke="#000000" 
          strokeWidth="6"
          variants={animated ? shapeVariants : undefined}
          whileHover={{ x: -2, y: -2 }}
        />

        {/* High impact Blue Block */}
        <motion.rect 
          x="90" 
          y="110" 
          width="95" 
          height="75" 
          fill="#0000FF" 
          stroke="#000000" 
          strokeWidth="6"
          variants={animated ? shapeVariants : undefined}
          whileHover={{ x: 2, y: 2 }}
        />

        {/* High impact Red Circle */}
        <motion.circle 
          cx="140" 
          cy="60" 
          r="45" 
          fill="#FF0000" 
          stroke="#000000" 
          strokeWidth="6"
          variants={animated ? shapeVariants : undefined}
          whileHover={{ scale: 1.05 }}
        />

        {/* --- GEOMETRIC MONOGRAM OVERLAY FOR "VDB" --- */}
        
        {/* Letter 'V' component inside the Yellow/White boundary */}
        <motion.path
          d="M 25 35 L 50 165 L 75 35"
          stroke="#000000"
          strokeWidth="12"
          strokeLinecap="square"
          strokeLinejoin="miter"
          variants={animated ? lineVariants : undefined}
        />

        {/* Letter 'D' component inside the Red Circle */}
        <motion.path
          d="M 115 35 L 115 85 C 145 85 145 35 115 35 Z"
          stroke="#FFFFFF"
          strokeWidth="10"
          strokeLinecap="square"
          strokeLinejoin="miter"
          variants={animated ? lineVariants : undefined}
        />

        {/* Letter 'B' component inside the Blue rect */}
        <motion.path
          d="M 110 120 L 110 175 M 110 120 C 135 120 135 145 110 145 C 135 145 135 175 110 175"
          stroke="#FFFFFF"
          strokeWidth="9"
          strokeLinecap="square"
          strokeLinejoin="miter"
          variants={animated ? lineVariants : undefined}
        />

        {/* Core Architectural Accent lines representing constructivist principles */}
        <motion.line 
          x1="0" y1="100" x2="200" y2="100" 
          stroke="#000000" 
          strokeWidth="4" 
          strokeDasharray="4 8"
          variants={animated ? lineVariants : undefined}
        />
        <motion.circle 
          cx="100" cy="100" r="10" 
          fill="#000000"
          variants={animated ? shapeVariants : undefined}
        />
      </svg>
    </motion.div>
  );
};
