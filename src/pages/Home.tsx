import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '../constants';
import { useSEO } from '../hooks/useSEO';

import { BauhausGraphic } from '../components/BauhausGraphic';
import { WWELogo } from '../components/WWELogo';
import { ThreeScene } from '../components/ThreeScene';

const Home = () => {
  const featuredProjects = PROJECTS.slice(0, 3);

  useSEO({
    description: 'Portfolio of Võ Duy Bình (coDY) - Software Tech Student, Content Creator, and AI Engineer specialising in Bauhaus-inspired digital experiences.',
    keywords: ['Võ Duy Bình', 'coDY', 'Software Tech Student', 'Content Creator', 'AI Engineer', 'Bauhaus Design', 'React Portfolio']
  });

  return (
    <div className="max-w-7xl mx-auto px-8 pt-16">
      {/* Hero Section */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-gutter min-h-[716px] items-center mb-xl">
        <div className="lg:col-span-8 flex flex-col gap-sm">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] leading-[0.9] font-black text-bauhaus-black uppercase tracking-[-0.04em]">
              VÕ DUY BÌNH <br />
              <span className="text-bauhaus-red">(coDY)</span>
            </h1>
            <p className="text-xl sm:text-2xl md:text-[32px] font-bold text-bauhaus-blue uppercase mt-base tracking-tight">
              Software Tech Student | Content Creator | AI Engineer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-md mt-lg">
              <Link
                to="/projects"
                className="bg-bauhaus-red text-white px-10 py-4 border-4 border-black font-bold text-lg uppercase hard-shadow hover:hard-shadow-lg transition-all active:translate-x-1 active:translate-y-1 active:shadow-none text-center"
              >
                View Projects
              </Link>
              <Link
                to="/contact"
                className="bg-transparent text-black px-10 py-4 border-4 border-black font-bold text-lg uppercase hover:bg-black/5 transition-all active:translate-x-1 active:translate-y-1 active:shadow-none text-center"
              >
                Contact Me
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hero Right Panel: Bauhaus 3D Composition */}
        <div className="lg:col-span-4 relative h-[500px] hidden lg:block border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden">
          <ThreeScene />
          <div className="absolute top-4 left-4 bg-black text-white px-2 py-1 font-mono text-xs uppercase tracking-widest z-10">
            Interactive 3D Grid
          </div>
        </div>
      </section>

      {/* Intro Section */}
      <section className="mt-xl border-y-4 border-black py-16 grid grid-cols-1 lg:grid-cols-12 gap-md mb-xl">
        <div className="lg:col-span-4">
          <h2 className="text-5xl font-bold uppercase text-black leading-[52px]">Innovation &<br />Execution</h2>
        </div>
        <div className="lg:col-span-8 flex flex-col justify-center">
          <p className="text-xl leading-[30px] max-w-2xl text-bauhaus-black/80">
            Bridging the gap between avant-garde visual aesthetics and robust technical architecture. I build digital experiences that respect the grid while pushing the boundaries of functional art.
          </p>
          <div className="flex gap-sm mt-md">
            <div className="w-4 h-4 bg-bauhaus-red border-2 border-black"></div>
            <div className="w-4 h-4 bg-bauhaus-blue border-2 border-black"></div>
            <div className="w-4 h-4 bg-bauhaus-yellow border-2 border-black"></div>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="mt-xl mb-xl">
        <div className="flex justify-between items-end mb-lg">
          <h3 className="text-5xl font-black uppercase tracking-tighter">Featured Projects</h3>
          <div className="hidden md:block h-1 flex-1 bg-black mx-md mb-4"></div>
          <div className="font-bold uppercase tracking-widest text-sm">Archive / 2024</div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
          {featuredProjects.map((project) => (
            <motion.article 
              key={project.id}
              className="bg-white border-4 border-black flex flex-col hard-shadow hover:hard-shadow-lg transition-all group"
            >
              <div className="h-64 border-b-4 border-black overflow-hidden relative">
                <img 
                  className="w-full h-full object-cover grayscale-hover transition-transform duration-500" 
                  src={project.image} 
                  alt={project.title}
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-bauhaus-yellow border-2 border-black px-3 py-1 font-bold uppercase text-xs">
                  {project.category}
                </div>
              </div>
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="text-[32px] font-bold uppercase mb-2 tracking-tight">{project.title}</h4>
                <p className="text-base font-normal text-bauhaus-black/70 flex-grow leading-relaxed">
                  {project.description}
                </p>
                <div className="mt-8 flex justify-between items-center group-hover:text-bauhaus-red transition-colors">
                  <Link to="/projects" className="font-bold uppercase underline decoration-2 underline-offset-2">Details</Link>
                  <ArrowRight size={24} />
                </div>
              </div>
              <div className={`h-2 bg-bauhaus-${project.color.split('-')[1]} w-0 group-hover:w-full transition-all duration-300`}></div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-xl grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
        <div className="md:col-span-2 bg-bauhaus-yellow border-4 border-black p-8 sm:p-12 hard-shadow">
          <div className="text-7xl sm:text-9xl lg:text-[120px] leading-[0.9] font-black text-black">10+</div>
          <div className="text-xl sm:text-2xl font-bold uppercase mt-base tracking-tight">Languages &<br />Frameworks</div>
        </div>
        <div className="bg-bauhaus-blue border-4 border-black p-12 hard-shadow text-white">
          <div className="text-6xl font-black">05</div>
          <div className="text-sm font-bold uppercase mt-base tracking-widest">Active Channels</div>
        </div>
        <div className="bg-bauhaus-red border-4 border-black p-12 hard-shadow text-white">
          <div className="text-6xl font-black">AI</div>
          <div className="text-sm font-bold uppercase mt-base tracking-widest">Powered Creativity</div>
        </div>
      </section>

      {/* Scroll-telling Bauhaus Assembly */}
      <section className="mt-40 mb-40 relative py-40 bg-black text-white overflow-hidden border-y-8 border-bauhaus-red">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block p-4 border-4 border-white mb-8"
          >
            <div className="w-16 h-16 bg-bauhaus-yellow"></div>
          </motion.div>
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-8 leading-none">THE GRID AS ARCHITECTURE</h2>
          <p className="text-xl font-bold uppercase tracking-widest opacity-60 max-w-2xl mx-auto">
            Design is not just visual. It is a structural mandate for efficiency, logic, and human interaction.
          </p>
        </div>

        <div className="mt-20 flex justify-center gap-20">
          <ScrollShape color="bg-bauhaus-red" delay={0} axis="y" />
          <ScrollShape color="bg-bauhaus-blue" delay={0.2} axis="x" />
          <ScrollShape color="bg-bauhaus-yellow" delay={0.4} axis="y" />
        </div>
      </section>
    </div>
  );
};

const ScrollShape = ({ color, delay, axis }: { color: string, delay: number, axis: 'x' | 'y' }) => {
  const { scrollYProgress } = useScroll();
  const move = useTransform(scrollYProgress, [0.3, 0.7], [axis === 'x' ? -500 : 500, 0]);
  const opacity = useTransform(scrollYProgress, [0.4, 0.6], [0, 1]);
  const rotate = useTransform(scrollYProgress, [0.4, 0.6], [axis === 'x' ? -90 : 90, 0]);

  return (
    <motion.div 
      style={{ [axis]: move, opacity, rotate }}
      className={`w-32 h-32 border-4 border-white ${color} hard-shadow`}
    />
  );
};

export default Home;
