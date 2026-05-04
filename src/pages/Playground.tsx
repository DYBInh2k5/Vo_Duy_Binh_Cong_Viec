import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, Download, Play, RefreshCw, Layers, MousePointer2, Plus } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface Shape {
  id: string;
  type: 'circle' | 'square' | 'triangle' | 'cross' | 'frame';
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  opacity: number;
}

const Playground = () => {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  const colors = ['#D02020', '#2850CE', '#FFD700', '#1C1B1B', '#FCF9F8'];

  const addShape = (type: Shape['type']) => {
    const newShape: Shape = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      size: Math.random() * 100 + 50,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      opacity: 1
    };
    setShapes([...shapes, newShape]);
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    setIsGenerating(true);
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("API Key missing");
      
      const genAI = new GoogleGenAI({ apiKey });
      const model = genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{
          role: "user",
          parts: [{
            text: `Act as a Bauhaus design engine. Based on the prompt "${prompt}", generate a list of 5-8 geometric shapes. 
            Return ONLY a valid JSON array of objects with this structure: 
            {"type": "circle"|"square"|"triangle", "x": 0-100, "y": 0-100, "size": 50-200, "color": "#D02020"|"#2850CE"|"#FFD700"|"#1C1B1B", "rotation": 0-360}
            Do not include any markdown or text around the JSON.`
          }]
        }]
      });

      const response = await model;
      const text = response.text;
      const jsonStr = text.replace(/```json|```/g, '').trim();
      const generatedShapes = JSON.parse(jsonStr).map((s: any) => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9),
        opacity: 1
      }));
      
      setShapes(generatedShapes);
    } catch (err) {
      console.error(err);
      alert("Neural grid failure. Please retry.");
    } finally {
      setIsGenerating(false);
    }
  };

  const clearCanvas = () => setShapes([]);
  
  const generateComposition = () => {
    const newShapes: Shape[] = [];
    const count = 10 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < count; i++) {
      const type = (['circle', 'square', 'triangle', 'cross', 'frame'] as const)[Math.floor(Math.random() * 5)];
      newShapes.push({
        id: Math.random().toString(36).substr(2, 9),
        type,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        size: Math.random() * 150 + 50,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: (Math.floor(Math.random() * 4) * 90) + (Math.random() > 0.8 ? 45 : 0),
        opacity: Math.random() * 0.5 + 0.5
      });
    }
    setShapes(newShapes);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24 min-h-screen">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-bauhaus-red border-4 border-black shrink-0"></div>
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">LAB / <span className="text-bauhaus-blue">01</span></h1>
        </div>
        <p className="text-xl font-bold uppercase italic tracking-tight opacity-60">Bauhaus Generative Composition Engine</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Controls Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-4 border-black p-6 bg-white hard-shadow">
            <h3 className="font-black uppercase tracking-widest text-xs mb-4 border-b-2 border-black pb-2">Neural Input</h3>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., 'Anxious geometric struggle' or 'Calm circular balance'..."
              className="w-full h-32 p-4 border-2 border-black font-bold focus:bg-bauhaus-yellow outline-none transition-colors"
            />
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full mt-4 bg-bauhaus-black text-white py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bauhaus-red transition-all disabled:opacity-50"
            >
              {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
              Execute Generation
            </button>
          </div>

          <div className="border-4 border-black p-6 bg-white hard-shadow">
            <h3 className="font-black uppercase tracking-widest text-xs mb-4 border-b-2 border-black pb-2">Manual Override</h3>
            <div className="grid grid-cols-2 gap-2">
              <ToolButton onClick={() => addShape('square')} icon={<Layers />} label="Block" />
              <ToolButton onClick={() => addShape('circle')} icon={<RefreshCw />} label="Orbital" />
              <ToolButton onClick={() => addShape('triangle')} icon={<Play className="rotate-[-90deg]" />} label="Vector" />
              <ToolButton onClick={() => addShape('cross')} icon={<Plus />} label="Cross" />
              <ToolButton onClick={() => addShape('frame')} icon={<div className="w-4 h-4 border-2 border-black" />} label="Frame" />
              <button 
                onClick={generateComposition}
                className="bg-bauhaus-yellow border-2 border-black font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-black hover:text-white transition-all"
              >
                Auto Composition
              </button>
            </div>
            <button
              onClick={clearCanvas}
              className="w-full mt-6 border-2 border-black py-2 font-black uppercase text-xs hover:bg-gray-100 flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Clear Composition
            </button>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="lg:col-span-8 bg-bauhaus-off-white border-8 border-black relative aspect-square overflow-hidden hard-shadow-lg group">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(black 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>
          
          <AnimatePresence>
            {shapes.map((shape) => (
              <motion.div
                key={shape.id}
                initial={{ scale: 0, opacity: 0, rotate: 0 }}
                animate={{ 
                  scale: 1, 
                  opacity: shape.opacity, 
                  rotate: shape.rotation,
                  left: `${shape.x}%`,
                  top: `${shape.y}%`
                }}
                exit={{ scale: 0, opacity: 0 }}
                drag
                dragMomentum={false}
                className="absolute cursor-grab active:cursor-grabbing"
                style={{
                  width: shape.size,
                  height: shape.size,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <ShapeRenderer type={shape.type} color={shape.color} />
              </motion.div>
            ))}
          </AnimatePresence>

          {shapes.length === 0 && !isGenerating && (
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-20">
              <MousePointer2 size={64} className="mb-4" />
              <p className="text-4xl font-black uppercase tracking-tighter italic">Empty Canvas</p>
              <p className="font-bold uppercase text-xs mt-2">Enter prompt or use controls to begin</p>
            </div>
          )}

          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-8 border-black border-t-bauhaus-red animate-spin mb-4"></div>
              <p className="font-black uppercase tracking-widest text-sm animate-pulse">Computing Geometric Logic...</p>
            </div>
          )}

          {/* Export Overlay */}
          <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
             <button className="bg-black text-white p-4 border-2 border-black hover:bg-bauhaus-blue transition-all">
                <Download size={24} />
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ToolButton = ({ onClick, icon, label }: { onClick: () => void, icon: React.ReactNode, label: string }) => (
  <button
    onClick={onClick}
    className="flex-1 border-2 border-black py-4 bg-bauhaus-off-white hover:bg-bauhaus-yellow transition-all flex flex-col items-center justify-center gap-2 group"
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
  </button>
);

const ShapeRenderer = ({ type, color }: { type: Shape['type'], color: string }) => {
  switch (type) {
    case 'circle':
      return <div className="w-full h-full rounded-full border-2 border-black" style={{ backgroundColor: color }} />;
    case 'square':
      return <div className="w-full h-full border-2 border-black" style={{ backgroundColor: color }} />;
    case 'triangle':
      return (
        <div 
          className="w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[86.6px]" 
          style={{ borderBottomColor: 'black', position: 'relative' }}
        >
          <div 
             className="w-0 h-0 border-l-[46px] border-l-transparent border-r-[46px] border-r-transparent border-b-[80px] absolute left-[-46px] top-[4px]"
             style={{ borderBottomColor: color }}
          />
        </div>
      );
    case 'cross':
      return (
        <div className="w-full h-full relative" style={{ color }}>
          <div className="absolute top-1/2 left-0 w-full h-1/4 bg-current -translate-y-1/2 border-2 border-black" />
          <div className="absolute left-1/2 top-0 h-full w-1/4 bg-current -translate-x-1/2 border-2 border-black" />
        </div>
      );
    case 'frame':
      return <div className="w-full h-full border-[12px] border-black" style={{ borderColor: 'black', backgroundColor: 'transparent' }}>
        <div className="w-full h-full border-4 border-current" style={{ borderColor: color }} />
      </div>;
    default:
      return null;
  }
};

export default Playground;

