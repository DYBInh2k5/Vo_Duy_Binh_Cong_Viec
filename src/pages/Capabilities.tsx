import React from 'react';
import { motion } from 'motion/react';
import { Terminal, Brain, Palette, DraftingCompass, Cloud, Database, Cpu, Layers } from 'lucide-react';

const Capabilities = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24">
      {/* Hero Section */}
      <header className="mb-16 md:mb-xl grid grid-cols-12 gap- gutter">
        <div className="col-span-12 md:col-span-8">
          <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[120px] leading-[0.9] font-black text-black uppercase mb-8 tracking-[-0.04em]">
            CAPABILITIES
          </h1>
          <div className="h-4 w-full bg-bauhaus-red border-4 border-black mb-6"></div>
          <p className="text-lg md:text-xl font-bold max-w-2xl text-bauhaus-black/80 leading-relaxed">
            A multi-disciplinary stack engineered for performance, precision, and structural integrity. Bridging the gap between geometric abstraction and functional software.
          </p>
        </div>
        <div className="hidden md:flex col-span-4 justify-end items-start pt-4">
          <div className="w-48 h-48 bg-bauhaus-yellow border-4 border-black rounded-full hard-shadow relative overflow-hidden group hover:rotate-12 transition-transform">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-bauhaus-blue border-b-4 border-black group-hover:h-2/3 transition-all"></div>
          </div>
        </div>
      </header>

      {/* Bento Grid for Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-24">
        {/* Tech Stack */}
        <section className="lg:col-span-2 border-4 border-black bg-white p-8 hard-shadow relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-bauhaus-red border-l-4 border-b-4 border-black -mr-12 -mt-12 rotate-45 group-hover:bg-bauhaus-blue transition-colors"></div>
          <div className="flex items-center gap-4 mb-10 relative">
            <div className="w-12 h-12 bg-bauhaus-red border-4 border-black flex items-center justify-center">
              <Terminal size={24} className="text-white" />
            </div>
            <h2 className="text-3xl font-black uppercase tracking-tighter">Tech Stack</h2>
          </div>
          <div className="grid grid-cols-2 gap-8 relative">
            <div className="flex flex-col gap-3">
              {['React / Next.js', 'TypeScript', 'Tailwind CSS'].map(item => (
                <span key={item} className="font-black uppercase bg-bauhaus-blue text-white px-3 py-1 w-fit border-2 border-black text-sm tracking-tight">
                  {item}
                </span>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              {['Node.js', 'Python', 'PostgreSQL'].map(item => (
                <span key={item} className="font-black uppercase bg-bauhaus-blue text-white px-3 py-1 w-fit border-2 border-black text-sm tracking-tight">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* AI Tools */}
        <section className="border-4 border-black bg-white p-8 hard-shadow flex flex-col justify-between hover:bg-bauhaus-yellow transition-colors group">
          <div className="relative">
            <div className="w-16 h-16 bg-bauhaus-yellow rounded-full border-4 border-black flex items-center justify-center mb-8 group-hover:bg-white">
              <Brain size={32} className="text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter">AI Tools</h2>
            <ul className="flex flex-col gap-3">
              {['LLM Integration', 'Vector DBs', 'LangChain'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-bauhaus-red border-2 border-black"></div>
                  <span className="font-black uppercase text-xs tracking-widest">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Creative Stack */}
        <section className="border-4 border-black bg-white p-8 hard-shadow flex flex-col justify-between hover:bg-bauhaus-blue group transition-colors">
          <div>
            <div className="w-16 h-16 bg-bauhaus-blue border-4 border-black flex items-center justify-center mb-8 group-hover:bg-white transition-colors">
              <Palette size={32} className="text-white group-hover:text-black" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-4 tracking-tighter group-hover:text-white">Creative</h2>
            <ul className="flex flex-col gap-3">
              {['Figma Architecture', 'Motion Design', 'Print Systems'].map(item => (
                <li key={item} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-bauhaus-yellow border-2 border-black"></div>
                  <span className="font-black uppercase text-xs tracking-widest group-hover:text-white">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Cloud & DevOps */}
        <section className="lg:col-span-2 border-4 border-black bg-white p-8 hard-shadow flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-black uppercase mb-6 tracking-tighter flex items-center gap-3">
              <Cloud size={24} className="text-bauhaus-red" />
              Cloud & DevOps
            </h2>
            <p className="font-bold text-bauhaus-black/70 mb-8 leading-relaxed">
              Robust infrastructure management with an emphasis on scalability and zero-downtime deployment cycles.
            </p>
            <div className="flex flex-wrap gap-2">
              {['AWS', 'Docker', 'Vercel', 'Terraform'].map(item => (
                <span key={item} className="bg-black text-white px-4 py-1 font-black uppercase border-2 border-black text-xs tracking-widest hover:bg-bauhaus-red transition-colors cursor-default">
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="w-full md:w-48 shrink-0 h-48 border-4 border-black bg-bauhaus-off-white p-0 overflow-hidden relative">
            <img 
              className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500" 
              src="https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=800&auto=format&fit=crop" 
              alt="Data Infrastructure"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border-4 border-black pointer-events-none"></div>
          </div>
        </section>

        {/* Custom Visualization */}
        <section className="lg:col-span-2 border-4 border-black bg-bauhaus-red p-8 hard-shadow text-white relative overflow-hidden group">
          <div className="flex justify-between items-start mb-12 relative z-10">
            <h2 className="text-5xl font-black uppercase leading-none tracking-tighter">Bauhaus<br/>Logic</h2>
            <div className="w-16 h-16 border-4 border-white flex items-center justify-center group-hover:rotate-90 transition-transform duration-500">
              <DraftingCompass size={40} className="text-white" />
            </div>
          </div>
          <div className="flex gap-4 h-32 items-end relative z-10">
            {[100, 60, 85, 45, 70].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="w-8 bg-white border-2 border-black" 
              />
            ))}
            <div className="flex-grow border-b-8 border-white pb-2 text-right">
              <span className="font-black uppercase text-sm tracking-widest group-hover:text-bauhaus-yellow transition-colors">Efficiency Index: 98%</span>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-white/10 rounded-full scale-150"></div>
        </section>
      </div>

      {/* Extended Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        {[
          { icon: Cpu, label: "Core Processing" },
          { icon: Database, label: "Data Integrity" },
          { icon: Layers, label: "System Architecture" },
          { icon: Terminal, label: "Command Logic" }
        ].map((skill, i) => (
          <div key={i} className="border-4 border-black p-6 flex flex-col gap-4 hover:bg-bauhaus-yellow hover:-translate-y-1 transition-all cursor-crosshair">
            <skill.icon size={32} strokeWidth={2.5} />
            <span className="font-black text-xs uppercase tracking-widest">{skill.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Capabilities;
