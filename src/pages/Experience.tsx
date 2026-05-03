import React from 'react';
import { motion } from 'motion/react';
import { EXPERIENCE } from '../constants';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Experience = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24">
      {/* Hero Section */}
      <header className="mb-20 md:mb-32">
        <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[120px] leading-[0.9] font-black text-black uppercase mb-8 tracking-[-0.04em]">
          {t('experience.hero').split('\n')[0]}<br />{t('experience.hero').split('\n')[1]}
        </h1>
        <div className="w-full md:w-1/2 flex items-center gap-4">
          <div className="h-10 w-10 md:h-12 md:w-12 bg-bauhaus-red border-4 border-black shrink-0"></div>
          <p className="text-lg md:text-xl font-bold max-w-lg text-bauhaus-black/80 leading-relaxed">
            {t('experience.subtitle')}
          </p>
        </div>
      </header>

      {/* Timeline Section */}
      <section className="relative">
        {/* Main Vertical Timeline Line */}
        <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 top-0 bottom-0 w-1 bg-black"></div>
        
        <div className="space-y-32">
          {EXPERIENCE.map((job, index) => {
            const isLeft = index % 2 === 0;
            return (
              <motion.div 
                key={job.company}
                initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative flex flex-col md:flex-row items-start md:items-center w-full 
                  ${isLeft ? 'justify-start md:justify-end md:pr-[50%]' : 'justify-start md:pl-[50%]'} 
                  group`}
              >
                {/* Geometric Milestone Indicator */}
                <div className={`absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10 w-8 h-8 border-4 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  ${job.color === 'bauhaus-blue' ? 'bg-bauhaus-blue rounded-none' : ''}
                  ${job.color === 'bauhaus-red' ? 'bg-bauhaus-red rounded-none' : ''}
                  ${job.color === 'bauhaus-yellow' ? 'bg-bauhaus-yellow rounded-full' : ''}
                  ${job.color === 'bauhaus-black' ? 'bg-black rounded-none' : ''}
                `}></div>

                {/* Content Card */}
                <div className={`ml-16 w-full max-w-md bg-white border-4 border-black p-8 hard-shadow transition-transform hover:-translate-y-1 
                  ${isLeft ? 'md:ml-0 md:mr-16' : 'md:ml-16'}`}>
                  <div className={`inline-block px-4 py-1 font-black text-xs uppercase tracking-widest mb-4 border-2 border-black
                    ${index % 3 === 0 ? 'bg-bauhaus-blue text-white' : index % 3 === 1 ? 'bg-bauhaus-red text-white' : 'bg-bauhaus-yellow text-black'}`}>
                    {job.period}
                  </div>
                  <h3 className="text-3xl font-black mb-1 uppercase tracking-tighter leading-none group-hover:text-bauhaus-red transition-colors">
                    {job.role}
                  </h3>
                  <p className="text-sm font-black text-bauhaus-black/60 mb-4 uppercase tracking-widest">
                    {job.company}
                  </p>
                  <p className="font-bold text-bauhaus-black/80 leading-relaxed">
                    {job.description}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Graphic Element Section */}
          <div className="relative flex justify-center py-24">
            <div className="w-full h-80 border-4 border-black bg-bauhaus-off-white overflow-hidden relative hard-shadow">
              <img 
                className="absolute inset-0 w-full h-full object-cover grayscale opacity-50 contrast-125 hover:opacity-100 transition-opacity duration-700" 
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop" 
                alt="Architectural Detail"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-0 right-0 p-8">
                <span className="text-[120px] font-black text-black opacity-10 select-none">01</span>
              </div>
              <div className="absolute inset-0 border-8 border-bauhaus-red opacity-0 hover:opacity-20 transition-opacity pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-40 bg-bauhaus-red border-4 border-black p-12 hard-shadow flex flex-col md:flex-row items-center justify-between gap-12 group">
        <div className="max-w-xl">
          <h2 className="text-6xl font-black text-white mb-6 uppercase leading-none tracking-tighter">
            {t('common.readyToBuild')}
          </h2>
          <p className="text-xl font-bold text-white/90 leading-relaxed">
            Let's collaborate on structures that defy standard conventions. Functional art for the modern web.
          </p>
        </div>
        <div className="flex gap-4">
          <Link 
            to="/contact"
            className="bg-white text-black border-4 border-black px-10 py-5 font-black uppercase tracking-widest hover:bg-bauhaus-yellow transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            {t('common.getInTouch')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Experience;
