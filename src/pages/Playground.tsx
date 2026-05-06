import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Trash2, Download, Play, RefreshCw, Layers, MousePointer2, Plus, MessageSquare, Terminal, Send } from 'lucide-react';
import { toPng } from 'html-to-image';
import { getCodyResponse, generateBauhausDesign } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface PromptExample {
  title: string;
  category: string;
  prompt: string;
}

const PROMPT_LIBRARY: PromptExample[] = [
  {
    title: 'Bauhaus Composition',
    category: 'Design',
    prompt: 'A struggle between tension and balance using only squares and thin lines.'
  },
  {
    title: 'Content Automation',
    category: 'Growth',
    prompt: 'Generate a 15-second hook for a tech review on TikTok targeting Gen Z.'
  },
  {
    title: 'Code Optimizer',
    category: 'Engineering',
    prompt: 'Refactor this React component for maximum performance using useMemo and useCallback.'
  }
];

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
  
  // Chatbot State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'SYSTEM INITIALIZED. I AM CODY AI. HOW CAN I ASSIST YOUR CREATIVE LOGIC TODAY?', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const colors = ['#D02020', '#2850CE', '#FFD700', '#1C1B1B', '#FCF9F8'];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      const generatedShapes = await generateBauhausDesign(prompt);
      const shapesWithIds = generatedShapes.map((s: any) => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9),
        opacity: 1
      }));
      setShapes(shapesWithIds);
    } catch (err: any) {
      console.error(err);
      alert("Neural grid failure. Please retry.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: chatInput, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsTyping(true);

    try {
      const response = await getCodyResponse(chatInput);
      const assistantMessage: Message = { role: 'assistant', content: response || '', timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  const clearCanvas = () => setShapes([]);

  const exportAsImage = async () => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = await toPng(canvasRef.current, { cacheBust: true, quality: 1 });
      const link = document.createElement('a');
      link.download = `bauhaus-composition-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    }
  };
  
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
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">LAB / <span className="text-bauhaus-blue">PLAYGROUND</span></h1>
        </div>
        <p className="text-xl font-bold uppercase italic tracking-tight opacity-60">Interactive AI Experiments & Geometric Logic</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: AI Assistant & Prompts */}
        <div className="lg:col-span-4 space-y-6">
          {/* coDY AI Persona */}
          <div className="border-4 border-black bg-white hard-shadow flex flex-col h-[500px]">
             <div className="p-4 border-b-4 border-black bg-bauhaus-black text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <MessageSquare size={18} />
                   <h3 className="font-black uppercase tracking-widest text-xs">coDY AI PERSONA [v2.0]</h3>
                </div>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-sm custom-scrollbar">
                {messages.map((msg, i) => (
                   <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                   >
                     <p className="text-[10px] uppercase font-black mb-1 opacity-40">{msg.role === 'user' ? 'USER_INPUT' : 'CODY_SYSTEM'}</p>
                     <div className={`p-3 border-2 border-black max-w-[85%] ${msg.role === 'user' ? 'bg-bauhaus-yellow' : 'bg-bauhaus-off-white'}`}>
                        {msg.content}
                     </div>
                   </motion.div>
                ))}
                {isTyping && (
                  <div className="flex gap-2 p-2">
                    <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 bg-black animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 bg-black animate-bounce"></div>
                  </div>
                )}
                <div ref={chatEndRef} />
             </div>

             <form onSubmit={handleChat} className="p-4 border-t-4 border-black bg-white flex gap-2">
                <input 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask coDY anything..."
                  className="flex-1 font-bold outline-none uppercase text-xs"
                />
                <button type="submit" className="bg-black text-white p-2 hover:bg-bauhaus-red transition-colors">
                  <Send size={18} />
                </button>
             </form>
          </div>

          {/* Prompt Library */}
          <div className="border-4 border-black p-6 bg-white hard-shadow">
            <h3 className="font-black uppercase tracking-widest text-xs mb-4 border-b-2 border-black pb-2">Prompt Library</h3>
            <div className="space-y-3">
               {PROMPT_LIBRARY.map((item, i) => (
                 <button 
                  key={i}
                  onClick={() => setPrompt(item.prompt)}
                  className="w-full text-left p-3 border-2 border-black hover:bg-bauhaus-off-white transition-all group"
                 >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[10px] font-black uppercase text-bauhaus-blue">{item.category}</span>
                      <Terminal size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="font-bold text-xs leading-tight">{item.title}</p>
                 </button>
               ))}
            </div>
          </div>
        </div>

        {/* Right Column: Bauhaus Engine */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
             {/* Engine Sidebar (Nested) */}
             <div className="md:col-span-4 space-y-6">
                <div className="border-4 border-black p-6 bg-white hard-shadow">
                  <h3 className="font-black uppercase tracking-widest text-xs mb-4 border-b-2 border-black pb-2">Geometric Logic</h3>
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., 'Anxious geometric struggle'..."
                    className="w-full h-32 p-4 border-2 border-black font-bold focus:bg-bauhaus-yellow outline-none transition-colors"
                  />
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="w-full mt-4 bg-bauhaus-black text-white py-4 font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-bauhaus-red transition-all disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />}
                    Compute Shapes
                  </button>
                </div>

                <div className="border-4 border-black p-6 bg-white hard-shadow">
                  <h3 className="font-black uppercase tracking-widest text-xs mb-4 border-b-2 border-black pb-2">Manual Override</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <ToolButton onClick={() => addShape('square')} icon={<Layers />} label="Block" />
                    <ToolButton onClick={() => addShape('circle')} icon={<RefreshCw />} label="Orbital" />
                    <ToolButton onClick={() => addShape('triangle')} icon={<Play className="rotate-[-90deg]" />} label="Vector" />
                    <ToolButton onClick={() => addShape('cross')} icon={<Plus />} label="Cross" />
                  </div>
                  <button
                    onClick={clearCanvas}
                    className="w-full mt-6 border-2 border-black py-2 font-black uppercase text-xs hover:bg-gray-100 flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} /> Reset Engine
                  </button>
                </div>
             </div>

             {/* Canvas Area (Nested) */}
             <div className="md:col-span-8 bg-bauhaus-off-white border-8 border-black relative aspect-square overflow-hidden hard-shadow-lg group" ref={canvasRef}>
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
                    <p className="text-4xl font-black uppercase tracking-tighter italic">Neural Void</p>
                    <p className="font-bold uppercase text-xs mt-2">Initialize logic to begin</p>
                  </div>
                )}

                {isGenerating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-8 border-black border-t-bauhaus-red animate-spin mb-4"></div>
                    <p className="font-black uppercase tracking-widest text-sm animate-pulse">Calculating Proportions...</p>
                  </div>
                )}

                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                      onClick={exportAsImage}
                      className="bg-black text-white p-4 border-2 border-black hover:bg-bauhaus-blue transition-all shadow-lg"
                      title="Export Logical Result"
                    >
                      <Download size={24} />
                   </button>
                </div>
             </div>
          </div>

          {/* Mini AI Tool: Text-to-Bauhaus Art */}
          <div className="border-4 border-black p-8 bg-bauhaus-yellow hard-shadow">
             <div className="flex items-center gap-4 mb-6">
                <Sparkles className="text-bauhaus-red" />
                <h2 className="text-4xl font-black uppercase tracking-tighter">AI ART FACTORY</h2>
             </div>
             <p className="font-bold text-sm mb-6 max-w-2xl opacity-70">
                A specialized neural pipeline that translates emotional semantics into geometric Bauhaus syntax. 
                Enter any abstract concept and watch the AI construct a visual representation.
             </p>
             <div className="flex gap-4">
                <button 
                  onClick={() => setPrompt('Nostalgic blue architecture')}
                  className="px-4 py-2 bg-white border-2 border-black font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all"
                >
                  Nostalgic Blue
                </button>
                <button 
                  onClick={() => setPrompt('Angry red chaos')}
                  className="px-4 py-2 bg-white border-2 border-black font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all"
                >
                  Angry Red
                </button>
                <button 
                  onClick={() => setPrompt('Perfect golden silence')}
                  className="px-4 py-2 bg-white border-2 border-black font-black uppercase text-[10px] hover:bg-black hover:text-white transition-all"
                >
                  Golden Silence
                </button>
             </div>
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

