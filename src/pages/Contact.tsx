import React from 'react';
import { motion } from 'motion/react';
import { PERSONAL_INFO } from '../constants';
import { Mail, Phone, ArrowUpRight, AtSign, Github, Linkedin, Instagram, Facebook, Video, Music, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const [status, setStatus] = React.useState('IDLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('TRANSMITTING');
    setTimeout(() => setStatus('RECEIVED'), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24">
      {/* Hero Section */}
      <section className="mb-16 md:mb-24">
        <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[120px] leading-[0.9] font-black text-black uppercase mb-8 tracking-[-0.04em]">
          {t('nav.contact')}
        </h1>
        <div className="h-4 bg-black w-full mb-2"></div>
        <div className="h-1 bg-black w-full"></div>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Panel: Direct Feed & Socials */}
        <div className="lg:col-span-5 space-y-12">
          {/* Direct Feed */}
          <div className="bg-bauhaus-blue border-4 border-black p-8 hard-shadow relative">
            <div className="absolute -top-6 -left-6 bg-bauhaus-yellow border-4 border-black px-4 py-2 font-black text-black uppercase text-xs tracking-widest">
              Direct Feed
            </div>
            <div className="space-y-8 mt-4">
              <div className="flex items-start gap-4">
                <AtSign size={32} className="text-white" />
                <div>
                  <p className="font-black text-black uppercase text-xs tracking-widest mb-1">Electronic Correspondence</p>
                  <p className="text-[24px] leading-tight font-black text-white tracking-tighter uppercase break-all">
                    {PERSONAL_INFO.email}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Phone size={32} className="text-white" />
                <div>
                  <p className="font-black text-black uppercase text-xs tracking-widest mb-1">Voice Link & Zalo</p>
                  <p className="text-[32px] leading-none font-black text-white tracking-tighter uppercase mb-2">{PERSONAL_INFO.phone}</p>
                  <a 
                    href={`https://zalo.me/${PERSONAL_INFO.zalo}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white text-black px-4 py-1 font-black text-[10px] uppercase border-2 border-black hover:bg-bauhaus-yellow transition-all"
                  >
                    Chat on Zalo
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Socials Grid */}
          <div className="bg-bauhaus-red border-4 border-black p-8 hard-shadow text-white">
            <h3 className="text-3xl font-black uppercase mb-6 tracking-tighter italic">Neural Networks</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { name: 'LinkedIn', url: PERSONAL_INFO.socials.linkedin },
                { name: 'GitHub', url: PERSONAL_INFO.socials.github },
                { name: 'Instagram', url: PERSONAL_INFO.socials.instagram },
                { name: 'Facebook', url: PERSONAL_INFO.socials.facebook }
              ].map(social => (
                <a 
                  key={social.name}
                  className="bg-white border-4 border-black p-4 flex justify-between items-center group hover:bg-bauhaus-yellow transition-colors" 
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="font-black text-black uppercase tracking-widest text-sm">{social.name}</span>
                  <ArrowUpRight size={24} className="text-black group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="aspect-square border-4 border-black overflow-hidden relative grayscale hover:grayscale-0 transition-all duration-500 shadow-[16px_16px_0px_0px_#D02020] group">
            <img 
              alt="Architectural Portrait" 
              className="object-cover w-full h-full contrast-125 group-hover:scale-105 transition-transform duration-700" 
              src={PERSONAL_INFO.profileImage}
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 border-8 border-black/10 pointer-events-none"></div>
          </div>
        </div>

        {/* Right Panel: Contact Form */}
        <div className="lg:col-span-7">
          <div className="bg-bauhaus-yellow border-4 border-black p-6 sm:p-10 hard-shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block font-black text-black uppercase mb-2 text-xs tracking-widest">Subject Identity</label>
                <input 
                  required
                  className="w-full bg-white border-4 border-black p-4 font-black uppercase text-sm text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_#D02020] transition-all" 
                  placeholder="FULL NAME" 
                  type="text"
                />
              </div>
              <div>
                <label className="block font-black text-black uppercase mb-2 text-xs tracking-widest">Return Address (Digital)</label>
                <input 
                  required
                  className="w-full bg-white border-4 border-black p-4 font-black uppercase text-sm text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_#D02020] transition-all" 
                  placeholder="EMAIL@DOMAIN.COM" 
                  type="email"
                />
              </div>
              <div>
                <label className="block font-black text-black uppercase mb-2 text-xs tracking-widest">Protocol Type</label>
                <div className="relative">
                  <select className="w-full bg-white border-4 border-black p-4 font-black uppercase text-sm text-black focus:outline-none focus:shadow-[4px_4px_0px_0px_#D02020] transition-all appearance-none">
                    <option>PROJECT INQUIRY</option>
                    <option>COLLABORATION</option>
                    <option>LECTURE / TALK</option>
                    <option>OTHER INTERACTION</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-black"></div>
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-black text-black uppercase mb-2 text-xs tracking-widest">Transmission Content</label>
                <textarea 
                  required
                  rows={6}
                  className="w-full bg-white border-4 border-black p-4 font-black uppercase text-sm text-black placeholder-gray-400 focus:outline-none focus:shadow-[4px_4px_0px_0px_#D02020] transition-all resize-none" 
                  placeholder="DEFINE YOUR PARAMETERS"
                />
              </div>
              <button 
                type="submit"
                disabled={status !== 'IDLE'}
                className="w-full bg-bauhaus-red text-white py-6 border-4 border-black text-[32px] font-black uppercase hard-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all disabled:opacity-50"
              >
                {status === 'IDLE' && t('common.contactMe')}
                {status === 'TRANSMITTING' && "Transmitting..."}
                {status === 'RECEIVED' && "Protocol Received"}
              </button>
            </form>
          </div>

          {/* Neural Interface Icons */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {[
              { icon: Github, label: 'GitHub', url: PERSONAL_INFO.socials.github },
              { icon: Linkedin, label: 'LinkedIn', url: PERSONAL_INFO.socials.linkedin },
              { icon: Instagram, label: 'Instagram', url: PERSONAL_INFO.socials.instagram },
              { icon: Facebook, label: 'Facebook', url: PERSONAL_INFO.socials.facebook },
              { icon: Globe, label: 'Beacons', url: PERSONAL_INFO.socials.beacons },
              { icon: Video, label: 'TikTok', url: PERSONAL_INFO.socials.tiktok_tech },
              { icon: Music, label: 'YouTube', url: PERSONAL_INFO.socials.youtube }
            ].map((social, i) => (
              <a 
                key={i}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="border-4 border-black bg-white p-4 flex flex-col items-center justify-center gap-2 hard-shadow hover:bg-bauhaus-blue hover:text-white transition-all group active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <social.icon size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                <span className="font-black text-[9px] uppercase tracking-widest">{social.label}</span>
              </a>
            ))}
          </div>
          
          <div className="mt-12 border-4 border-black p-8 bg-white grid grid-cols-1 md:grid-cols-2 gap-8 items-center hard-shadow">
            <div>
              <h4 className="text-3xl font-black text-black uppercase leading-none mb-2 tracking-tighter">Global HQ</h4>
              <p className="font-black text-black/60 uppercase text-xs tracking-widest leading-relaxed">
                {PERSONAL_INFO.location}
              </p>
            </div>
            <div className="h-64 border-4 border-black overflow-hidden relative group">
              <iframe 
                src={`https://maps.google.com/maps?q=${encodeURIComponent(PERSONAL_INFO.location)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer"
                title="Bản đồ vị trí"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

