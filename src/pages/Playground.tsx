import React from 'react';
import { EXPERIMENTS } from '../constants';
import { motion } from 'motion/react';
import { Brain, MessageSquare, Ticket, Sparkles, Layout, Grid3X3, Layers, Quote } from 'lucide-react';

const Playground = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="px-8 py-16 md:py-xl border-b-4 border-black bg-bauhaus-off-white">
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[120px] leading-[0.9] font-black uppercase mb-lg tracking-[-0.04em]">
            THE LAB /<br />
            <span className="text-bauhaus-red">PLAYGROUND</span>
          </h1>
          <div className="grid grid-cols-12 gap-gutter items-end">
            <div className="col-span-12 md:col-span-6 border-4 border-black p-8 sm:p-12 bg-bauhaus-blue text-white hard-shadow">
              <p className="text-4xl font-black mb-4 uppercase tracking-tighter italic">EXPERIMENTAL ZONE 01</p>
              <p className="text-xl font-bold leading-relaxed opacity-90">
                Where logic meets chaos. A collection of raw ideas, brutalist experiments, and architectural prototypes that challenge standard digital affordances.
              </p>
            </div>
            <div className="col-span-12 md:col-span-1"></div>
            <div className="col-span-12 md:col-span-5">
              <div className="w-full aspect-video bg-white border-4 border-black shadow-[8px_8px_0px_0px_#FFD700] relative overflow-hidden group">
                <img 
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700" 
                  src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop" 
                  alt="Lab Visual"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid / AI Experiments */}
      <section className="bg-white px-8 py-xl overflow-hidden border-b-4 border-black">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <div className="w-8 h-8 bg-bauhaus-red border-2 border-black shrink-0"></div>
            <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter">AI Experiments</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Large Feature Card */}
            <div className="md:col-span-8 border-4 border-black bg-white p-12 hard-shadow hover:shadow-[12px_12px_0px_0px_#D02020] transition-all group">
              <div className="flex justify-between items-start mb-8">
                <span className="bg-bauhaus-yellow text-black font-black text-xs px-4 py-2 uppercase border-2 border-black tracking-widest">V.04 PROTOTYPE</span>
                <Brain size={48} className="text-bauhaus-black" />
              </div>
              <h3 className="text-4xl font-black uppercase mb-4 tracking-tighter italic">Neural Topography Generator</h3>
              <p className="text-xl font-medium mb-12 max-w-2xl text-bauhaus-black/70">
                Generating 3D architectural landscapes based on semantic prompts. This experiment explores the intersection of language and volumetric space.
              </p>
              <div className="grid grid-cols-3 gap-2 h-32 mb-12">
                <div className="bg-bauhaus-black"></div>
                <div className="bg-bauhaus-red"></div>
                <div className="bg-bauhaus-blue"></div>
              </div>
              <button className="w-full md:w-auto px-12 py-4 bg-black text-white font-black uppercase border-2 border-black hard-shadow hover:bg-bauhaus-red active:translate-x-1 active:translate-y-1 active:shadow-none transition-all">
                Launch Sandbox
              </button>
            </div>
            {/* Side Card Stack */}
            <div className="md:col-span-4 flex flex-col gap-8">
              <div className="flex-1 border-4 border-black bg-white p-8 hard-shadow hover:-translate-y-1 transition-transform group">
                <div className="w-12 h-12 bg-bauhaus-blue flex items-center justify-center mb-4 border-2 border-black">
                  <MessageSquare size={24} className="text-white" />
                </div>
                <h4 className="font-black uppercase border-b-2 border-black pb-2 mb-4 tracking-widest text-xs">Semantic UI Lab</h4>
                <p className="font-bold text-bauhaus-black/60 italic leading-snug">Self-assembling interfaces driven by user intent analysis.</p>
              </div>
              <div className="flex-1 border-4 border-black bg-white p-8 hard-shadow hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 bg-bauhaus-red flex items-center justify-center mb-4 border-2 border-black">
                  <Ticket size={24} className="text-white" />
                </div>
                <h4 className="font-black uppercase border-b-2 border-black pb-2 mb-4 tracking-widest text-xs">Prompt-to-Grid</h4>
                <p className="font-bold text-bauhaus-black/60 italic leading-snug">Automated layout engine for constructivist compositions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content System Overlapping Section */}
      <section className="relative z-10 py-xl px-8 bg-bauhaus-off-white">
        <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row items-stretch">
          <div className="w-full md:w-1/2 bg-white border-4 border-black p-12 shadow-[16px_16px_0px_0px_#2850ce] relative z-20">
            <h2 className="text-6xl font-black uppercase mb-8 leading-none tracking-tighter">Content<br/>System</h2>
            <ul className="space-y-4">
              {[
                { label: "Variable Type Scaling", icon: Layout },
                { label: "The Grid-Braker Engine", icon: Grid3X3 },
                { label: "Color-Block Logic V2", icon: Layers }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-4 border-b-4 border-black py-4 group cursor-pointer">
                  <item.icon size={24} className="text-bauhaus-red group-hover:scale-125 transition-transform" />
                  <span className="font-black text-xl uppercase tracking-tighter">{item.label}</span>
                </li>
              ))}
            </ul>
            <div className="mt-12 group overflow-hidden border-4 border-black aspect-video relative">
               <img 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop" 
                alt="Workspace"
                referrerPolicy="no-referrer"
               />
            </div>
          </div>
          <div className="w-full md:w-1/2 bg-bauhaus-yellow border-4 border-black md:-ml-8 md:mt-16 p-12 shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-center">
            <p className="text-3xl font-black text-black mb-8 leading-tight uppercase tracking-tighter">
              "Architecture is the will of an epoch translated into space. Digital systems should follow the same mandate."
            </p>
            <div className="flex items-center gap-4 text-black/60 italic font-bold">
              <Quote size={32} fill="currentColor" />
              <p>Walter Gropius, 1919</p>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Archive Section */}
      <section className="px-8 py-xl bg-bauhaus-black text-white">
        <div className="max-w-screen-2xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
            <div className="col-span-12 md:col-span-4 flex flex-col justify-center">
              <h2 className="text-6xl sm:text-8xl font-black uppercase leading-none mb-8 text-bauhaus-yellow tracking-tighter">ARCHIVE</h2>
              <p className="text-xl font-bold opacity-80 leading-relaxed border-l-4 border-bauhaus-red pl-6">
                A linear history of discarded prototypes, failed experiments, and the rough sketches that built the foundation of coDY.
              </p>
            </div>
            <div className="col-span-12 md:col-span-8 grid grid-cols-2 gap-4">
              {[
                { year: "2021", tag: "PROTOTYPE_A", img: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop" },
                { year: "2022", tag: "SYSTEM_CORE", img: "https://images.unsplash.com/photo-1544391496-1ca7c9745748?q=80&w=800&auto=format&fit=crop" },
                { year: "2023", tag: "FULL_SCALE_ASSEMBLY", img: "https://images.unsplash.com/photo-1487014679447-9f8336841d58?q=80&w=800&auto=format&fit=crop", span: true }
              ].map((item, i) => (
                <div key={i} className={`h-64 border-2 border-white relative group overflow-hidden ${item.span ? 'col-span-2' : ''}`}>
                  <img 
                    className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" 
                    src={item.img} 
                    alt={item.tag} 
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-0 left-0 bg-white text-black font-black px-4 py-2 text-xs uppercase tracking-widest">
                    {item.year} / {item.tag}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Side Protocols */}
      <section className="py-24 max-w-7xl mx-auto px-8">
         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 mb-16">
            <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase whitespace-normal sm:whitespace-nowrap">SIDE_PROTOCOL_LOGS</h2>
            <div className="h-2 w-full sm:flex-grow bg-black"></div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {EXPERIMENTS.map((exp) => (
              <motion.div 
                key={exp.id}
                whileHover={{ y: -10 }}
                className="bg-white border-4 border-black p-8 hard-shadow-lg group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-12">
                   <div className="w-12 h-12 bg-bauhaus-blue border-2 border-black flex items-center justify-center group-hover:bg-bauhaus-red transition-colors">
                      <Sparkles size={24} className="text-white" />
                   </div>
                   <span className="font-black text-xs text-bauhaus-black/40">{exp.date}</span>
                </div>
                <h3 className="text-2xl font-black tracking-tighter mb-4 uppercase italic leading-none">{exp.title}</h3>
                <p className="font-bold text-bauhaus-black/70 mb-8 h-12 overflow-hidden leading-snug">{exp.description}</p>
                <div className="inline-block font-black underline decoration-4 hover:text-bauhaus-red transition-colors">EXPLORE_SOURCE</div>
              </motion.div>
            ))}
         </div>
      </section>
    </div>
  );
};

export default Playground;

