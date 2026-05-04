import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PROJECTS } from '../constants';
import { motion } from 'motion/react';
import { ArrowLeft, Boxes, Cpu, Layout, CheckCircle2 } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);

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
        <div className="lg:col-span-7 space-y-12">
          <section>
            <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 mb-6 flex items-center gap-4">
               <Boxes className="text-bauhaus-red" /> The Objective
            </h2>
            <p className="text-xl font-bold leading-relaxed">{project.description}</p>
          </section>

          <section>
            <h2 className="text-3xl font-black uppercase border-b-4 border-black pb-2 mb-6 flex items-center gap-4">
               <Cpu className="text-bauhaus-blue" /> Neural Architecture
            </h2>
            <div className="bg-black text-green-500 p-8 font-mono text-sm border-4 border-black hard-shadow-lg">
              <pre className="whitespace-pre-wrap">
{`{
  "engine": "V.02_Core",
  "data_flow": [
    "Input_Vector_Analysis",
    "Semantic_Embedding_Mapping",
    "Geometric_Translation_Logic",
    "Final_Bento_Composition"
  ],
  "dependencies": ${JSON.stringify(project.tech, null, 2)},
  "status": "Production_Stable"
}`}
              </pre>
            </div>
          </section>
        </div>

        {/* Side Panel: Results */}
        <div className="lg:col-span-5 space-y-8">
          <div className="bg-bauhaus-yellow border-4 border-black p-8 hard-shadow">
            <h3 className="font-black uppercase tracking-widest text-xs border-b-2 border-black pb-2 mb-6">Outcome Log</h3>
            <ul className="space-y-4">
              {[
                "100% Structural Consistency",
                "Neural Latency Reduced by 40%",
                "Geometric Accuracy Validated",
                "User Sentiment: High"
              ].map((res, i) => (
                <li key={i} className="flex items-center gap-4 font-black uppercase text-sm italic">
                  <CheckCircle2 size={20} className="text-bauhaus-red" />
                  {res}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="border-4 border-black p-8 bg-white hard-shadow">
             <h3 className="font-black text-bauhaus-blue mb-4 uppercase italic">"The grid is the soul of modular efficiency. This project embodies that mandate."</h3>
             <p className="text-xs font-black uppercase opacity-40">-- coDY Architecture System</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
