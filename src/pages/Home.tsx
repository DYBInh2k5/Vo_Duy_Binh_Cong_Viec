import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { PROJECTS } from '../constants';

const Home = () => {
  const featuredProjects = PROJECTS.slice(0, 3);

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

        {/* Hero Right Panel: Bauhaus Composition */}
        <div className="lg:col-span-4 relative h-[500px] hidden lg:block">
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Blue Circle */}
            <div className="w-64 h-64 bg-bauhaus-blue rounded-full absolute -translate-x-12 -translate-y-12 border-4 border-black shadow-lg"></div>
            {/* Red Square */}
            <div className="w-72 h-72 bg-bauhaus-red absolute translate-x-4 translate-y-4 border-4 border-black shadow-lg"></div>
            {/* Yellow Triangle */}
            <div 
              className="w-80 h-80 bg-bauhaus-yellow absolute translate-x-16 -translate-y-24 border-4 border-black shadow-lg" 
              style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}
            ></div>
            {/* Decorative Lines */}
            <div className="absolute w-full h-1 bg-black rotate-45"></div>
            <div className="absolute w-full h-1 bg-black -rotate-45"></div>
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
    </div>
  );
};

export default Home;
;
