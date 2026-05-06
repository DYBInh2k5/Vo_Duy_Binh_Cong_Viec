import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { motion } from 'motion/react';
import { ArrowLeft, Boxes, Cpu, Layout, CheckCircle2 } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);

  useSEO({
    title: project?.title,
    description: project?.description,
    keywords: project?.tech,
    image: project?.image
  });

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bauhaus-off-white">
        <div className="text-center">
          <h1 className="text-4xl font-black uppercase mb-4">Project Not Found</h1>
          <Link to="/projects" className="underline font-bold uppercase">Back to Archive</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24">
      <button 
        onClick={() => navigate('/projects')}
        className="flex items-center gap-2 font-black uppercase text-sm mb-12 hover:gap-4 transition-all"
      >
        <ArrowLeft size={20} /> Back to Archive
      </button>

      <header className="mb-16">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-bauhaus-red border-4 border-black shrink-0"></div>
          <span className="font-black text-bauhaus-black/40 uppercase tracking-widest text-xs">Project ID // {project.id}</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black uppercase leading-none tracking-tighter mb-8">
          {project.title}
        </h1>
        <div className="flex flex-wrap gap-2">
          {project.tech.map(t => (
            <span key={t} className="bg-black text-white px-4 py-1 border-2 border-black font-black text-xs uppercase italic">
              {t}
            </span>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-24">
        {/* Visual Section */}
        <div className="lg:col-span-12 border-[16px] border-black hard-shadow overflow-hidden group">
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-auto grayscale-hover group-hover:scale-105 transition-all duration-700" 
          />
        </div>

        {/* Narrative Section */}
        <div className="lg:col-span-12 space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <section className="border-4 border-black p-8 bg-white hard-shadow">
              <h2 className="text-4xl font-black uppercase mb-6 flex items-center gap-4 text-bauhaus-red">
                 <Boxes size={32} /> THE CHALLENGE
              </h2>
              <div className="space-y-4">
                <p className="text-xl font-bold leading-relaxed">{project.description}</p>
                <p className="font-bold opacity-60">The primary friction point was optimizing the neural data flow while maintaining structural integrity in a high-concurrency environment.</p>
              </div>
            </section>

            <section className="border-4 border-black p-8 bg-bauhaus-off-white hard-shadow">
              <h2 className="text-4xl font-black uppercase mb-6 flex items-center gap-4 text-bauhaus-blue">
                 <Cpu size={32} /> THE AI SOLUTION
              </h2>
              <div className="space-y-4 font-bold">
                 <p>Implemented a custom LLM pipeline for automated validation of geometric logic. Used RAG (Retrieval-Augmented Generation) to ground the AI's creative output in established Bauhaus principles.</p>
                 <div className="bg-black text-green-500 p-6 font-mono text-xs hard-shadow border-2 border-black">
                   <p className="mb-2">// Optimizing Neural Weights...</p>
                   <p>model.optimize(bauhaus_constraint=True)</p>
                   <p>grid.align(strictly=True)</p>
                 </div>
              </div>
            </section>
          </div>

          <section className="border-8 border-black p-12 bg-bauhaus-yellow hard-shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
               <CheckCircle2 size={120} />
            </div>
            <h2 className="text-5xl font-black uppercase mb-12 relative z-10">QUANTIFIABLE RESULTS</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
               {[
                 { label: 'Latency Efficiency', val: '40% Reduction' },
                 { label: 'Data Accuracy', val: '99.8% Logged' },
                 { label: 'User Engagement', val: '+250% Growth' }
               ].map((res, i) => (
                 <div key={i} className="border-4 border-black bg-white p-6 hard-shadow">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-50">{res.label}</p>
                    <p className="text-3xl font-black uppercase italic">{res.val}</p>
                 </div>
               ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
