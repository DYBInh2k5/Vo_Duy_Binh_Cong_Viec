import React from 'react';
import { motion, useScroll, useSpring } from 'motion/react';
import { EXPERIENCE } from '../constants';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Cpu, Network, Zap, Terminal } from 'lucide-react';

const Experience = () => {
  const { t } = useTranslation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24 overflow-hidden">
      {/* Progress Line */}
      <motion.div className="fixed top-0 left-0 right-0 h-2 bg-bauhaus-red origin-left z-[100]" style={{ scaleX }} />

      {/* Hero Section */}
      <header className="mb-20 md:mb-32 relative">
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[120px] leading-[0.85] font-black text-black uppercase mb-8 tracking-tighter relative z-10">
          {t('experience.hero').split('\n')[0]}<br />
          <span className="text-bauhaus-blue">{t('experience.hero').split('\n')[1]}</span>
        </h1>
        <div className="w-full md:w-1/2 flex items-center gap-4 relative">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-bauhaus-yellow border-4 border-black shrink-0 animate-pulse"></div>
          <p className="text-lg md:text-xl font-bold max-w-lg text-bauhaus-black/80 leading-relaxed uppercase">
            {t('experience.subtitle')}
          </p>
        </div>
      </header>

      {/* Timeline Section: Technical Map Style */}
      <section className="relative">
        {/* The "Cable" connecting nodes */}
        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-2 bg-black opacity-10"></div>
        <motion.div 
          className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 w-2 bg-bauhaus-red origin-top"
          style={{ scaleY: scrollYProgress }}
        />
        
        <div className="space-y-40">
          {EXPERIENCE.map((job, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div 
                key={`${job.company}-${index}`}
                initial={{ opacity: 0, x: isLeft ? -100 : 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, type: 'spring' }}
                className={`relative flex flex-col md:flex-row items-start md:items-center w-full 
                  ${isLeft ? 'justify-start md:justify-end md:pr-[50%]' : 'justify-start md:pl-[50%]'} 
                  group`}
              >
                {/* Node Connector */}
                <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10 w-12 h-12 border-4 border-black bg-white flex items-center justify-center group-hover:scale-125 group-hover:bg-bauhaus-yellow transition-all shadow-lg
                  ${job.color === 'bauhaus-blue' ? 'rounded-none' : 'rounded-full'}
                `}>
                   {index < 2 ? <Cpu size={20} /> : index < 5 ? <Network size={20} /> : <Zap size={20} />}
                </div>

                {/* Infrastructure Card */}
                <div className={`ml-20 w-full max-w-xl bg-white border-4 border-black p-0 hard-shadow-lg transition-all hover:-translate-y-2 group-hover:border-bauhaus-blue
                  ${isLeft ? 'md:ml-0 md:mr-20' : 'md:ml-20'}`}>
                  
                  <div className="p-4 border-b-4 border-black bg-bauhaus-black text-white flex justify-between items-center">
                    <span className="text-[10px] font-black tracking-widest uppercase italic">{job.period}</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                  </div>

                  <div className="p-8">
                    <h3 className="text-4xl font-black mb-2 uppercase tracking-tighter leading-none group-hover:text-bauhaus-blue transition-colors">
                      {job.role}
                    </h3>
                    <p className="text-sm font-black text-bauhaus-red mb-6 uppercase tracking-widest flex items-center gap-2">
                       <Terminal size={14} /> {job.company}
                    </p>
                    
                    <div className="border-l-4 border-bauhaus-off-white pl-4 mb-6">
                      <p className="font-bold text-bauhaus-black/80 leading-relaxed italic">
                        "{job.description}"
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                       {['AUTONOMOUS', 'SCALABLE', 'OPTIMIZED'].map(tag => (
                         <span key={tag} className="text-[8px] font-black border border-black px-2 py-0.5 uppercase tracking-tighter bg-bauhaus-off-white">
                           {tag}
                         </span>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Background Shadow Text */}
                <div className={`absolute top-0 opacity-[0.02] text-8xl font-black select-none pointer-events-none uppercase 
                  ${isLeft ? 'right-0 -translate-x-full' : 'left-0 translate-x-full'}`}>
                  {job.role.split(' ')[0]}
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Assembly Animation placeholder */}
      <div className="mt-40 border-8 border-black p-20 bg-bauhaus-off-white relative overflow-hidden group">
         <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-40 -right-40 w-80 h-80 border-[20px] border-black opacity-5"
         />
         <div className="relative z-10 text-center">
            <h2 className="text-7xl md:text-9xl font-black uppercase tracking-tighter mb-8 leading-none">SYSTEM<br /><span className="text-bauhaus-red italic">ARCHIVED</span></h2>
            <p className="text-xl font-bold uppercase tracking-widest max-w-2xl mx-auto opacity-60">Every previous role is a modular component of the current architecture.</p>
         </div>
      </div>

      {/* CTA Section */}
      <section className="mt-40 bg-bauhaus-blue border-4 border-black p-12 hard-shadow flex flex-col md:flex-row items-center justify-between gap-12 group">
        <div className="max-w-xl">
          <h2 className="text-6xl font-black text-white mb-6 uppercase leading-none tracking-tighter">
            {t('common.readyToBuild')}
          </h2>
          <p className="text-xl font-bold text-white/90 leading-relaxed uppercase">
            Initialize collaboration on high-performance neural structures.
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/contact"
            className="bg-white text-black border-4 border-black px-10 py-5 font-black uppercase tracking-widest hover:bg-bauhaus-red hover:text-white transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {t('common.getInTouch')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Experience;
