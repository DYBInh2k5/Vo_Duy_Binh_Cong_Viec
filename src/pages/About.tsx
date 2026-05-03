import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../constants';
import { Terminal, Layout, Zap, Database, Brush, Accessibility, DraftingCompass, Brain, Shield, Rocket, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const About = () => {
  const { t } = useTranslation();
  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24">
      {/* Hero Section */}
      <header className="mb-16 md:mb-24">
        <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[120px] leading-[0.9] font-black text-black uppercase mb-8 tracking-[-0.04em]">
          {t('about.hero').split('\n')[0]}<br />{t('about.hero').split('\n')[1]}
        </h1>
        <div className="w-full h-1 bg-black"></div>
      </header>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">
        {/* Left: Portrait */}
        <div className="md:col-span-5 relative">
          <div className="border-[16px] border-bauhaus-red p-0 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] bg-black">
            <img 
              alt="Võ Duy Bình (coDY) Portrait" 
              className="w-full grayscale contrast-125 block hover:grayscale-0 transition-all duration-700" 
              src={PERSONAL_INFO.profileImage}
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Bauhaus Geometric Element */}
          <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-bauhaus-yellow border-4 border-black z-[-1]"></div>
        </div>

        {/* Right: Content Panels */}
        <div className="md:col-span-7 flex flex-col gap-12">
          {/* Intro Section */}
          <section className="bg-bauhaus-off-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-8 h-8 bg-bauhaus-red border-2 border-black"></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">{t('about.profileProtocol')}</h2>
            </div>
            <div className="space-y-4">
              <p className="text-xl font-bold leading-relaxed">
                {t('about.intro')}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm font-black uppercase tracking-widest pt-4">
                <div className="border-l-4 border-bauhaus-blue pl-4">
                  <span className="text-bauhaus-black/40">{t('about.location')}:</span><br />{PERSONAL_INFO.location}
                </div>
                <div className="border-l-4 border-bauhaus-red pl-4">
                  <span className="text-bauhaus-black/40">{t('about.birth')}:</span><br />{PERSONAL_INFO.birthday}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Philosophy */}
            <section className="bg-bauhaus-yellow border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black uppercase border-b-2 border-black pb-2 mb-4 tracking-widest text-xs">{t('about.philosophyTitle')}</h3>
              <p className="text-md font-bold uppercase tracking-tight">
                {t('about.philosophy')}
              </p>
            </section>
            {/* Goals */}
            <section className="bg-bauhaus-blue text-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="font-black uppercase border-b-2 border-white pb-2 mb-4 tracking-widest text-xs">{t('about.goalsTitle')}</h3>
              <p className="text-md italic font-bold uppercase">
                {t('about.goals')}
              </p>
            </section>
          </div>
        </div>
      </div>

      {/* Expertise Section */}
      <div className="mt-32 border-4 border-black p-12 bg-bauhaus-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-bauhaus-red/20 -mr-32 -mt-32 rounded-full blur-3xl"></div>
        <h2 className="text-5xl font-black uppercase mb-12 tracking-tighter relative z-10">{t('about.stackTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          <div className="space-y-6">
            <h4 className="text-bauhaus-yellow font-black uppercase tracking-[0.2em] text-sm">Engineering</h4>
            <ul className="space-y-2 font-bold uppercase text-xs tracking-widest">
              <li>Full Stack Web</li>
              <li>Mobile Cross-platform</li>
              <li>Cloud Architecture</li>
              <li>API Architecture</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-bauhaus-red font-black uppercase tracking-[0.2em] text-sm">Artificial Intelligence</h4>
            <ul className="space-y-2 font-bold uppercase text-xs tracking-widest">
              <li>LLM Engineering</li>
              <li>Deep Learning</li>
              <li>Creative Automation</li>
              <li>AI Content Strategy</li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-bauhaus-blue font-black uppercase tracking-[0.2em] text-sm">Communications</h4>
            <ul className="space-y-2 font-bold uppercase text-xs tracking-widest">
              <li>Digital Marketing</li>
              <li>Personal Branding</li>
              <li>Video Production</li>
              <li>Content Creation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Horizontal Divider */}
      <div className="my-32 border-b-4 border-black flex justify-between items-end pb-4">
        <span className="text-6xl font-black uppercase tracking-tighter">Capabilities</span>
        <div className="w-12 h-12 bg-bauhaus-red border-4 border-black"></div>
      </div>

      {/* The Stack: Grid of Tech Labels */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "UI Architecture", icon: DraftingCompass },
          { label: "AI Integration", icon: Brain },
          { label: "System Logic", icon: Terminal },
          { label: "Data Flow", icon: Database },
          { label: "Cybersecurity", icon: Shield },
          { label: "Marketing", icon: Rocket },
          { label: "Content Creation", icon: Zap },
          { label: "Global Reach", icon: Globe }
        ].map((item, i) => (
          <div 
            key={i} 
            className={`border-4 border-black p-6 flex flex-col gap-4 transition-none active:translate-x-1 active:translate-y-1 active:shadow-none cursor-pointer
              ${i % 4 === 1 ? 'hover:bg-bauhaus-red hover:text-white' : ''}
              ${i % 4 === 2 ? 'hover:bg-bauhaus-blue hover:text-white' : ''}
              ${i % 4 === 3 ? 'hover:bg-bauhaus-yellow' : ''}
              ${i % 4 === 0 ? 'hover:bg-bauhaus-yellow' : ''}
            `}
          >
            <item.icon size={48} strokeWidth={2.5} />
            <span className="font-black text-sm uppercase tracking-widest">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
