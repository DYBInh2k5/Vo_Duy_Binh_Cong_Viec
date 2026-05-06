import React, { useEffect, useRef } from 'react';

export const BackgroundDynamics = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resize);
    resize();

    const shapes: {
      x: number;
      y: number;
      size: number;
      type: 'circle' | 'square' | 'triangle';
      color: string;
      speedX: number;
      speedY: number;
      rotation: number;
      rotationSpeed: number;
    }[] = [];

    const colors = ['rgba(208, 32, 32, 0.05)', 'rgba(40, 80, 206, 0.05)', 'rgba(255, 215, 0, 0.05)'];

    for (let i = 0; i < 20; i++) {
        shapes.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 100 + 50,
            type: (['circle', 'square', 'triangle'] as const)[Math.floor(Math.random() * 3)],
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.01
        });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      shapes.forEach(shape => {
          shape.x += shape.speedX;
          shape.y += shape.speedY;
          shape.rotation += shape.rotationSpeed;

          if (shape.x < -shape.size) shape.x = width + shape.size;
          if (shape.x > width + shape.size) shape.x = -shape.size;
          if (shape.y < -shape.size) shape.y = height + shape.size;
          if (shape.y > height + shape.size) shape.y = -shape.size;

          ctx.save();
          ctx.translate(shape.x, shape.y);
          ctx.rotate(shape.rotation);
          ctx.fillStyle = shape.color;
          ctx.strokeStyle = 'rgba(0,0,0,0.02)';
          ctx.lineWidth = 1;

          ctx.beginPath();
          if (shape.type === 'circle') {
              ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2);
          } else if (shape.type === 'square') {
              ctx.rect(-shape.size / 2, -shape.size / 2, shape.size, shape.size);
          } else {
              ctx.moveTo(0, -shape.size / 2);
              ctx.lineTo(shape.size / 2, shape.size / 2);
              ctx.lineTo(-shape.size / 2, shape.size / 2);
              ctx.closePath();
          }
          ctx.fill();
          ctx.stroke();
          ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none bg-bauhaus-off-white"
    />
  );
};
