import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Database, Zap, Cpu, Activity, Github, Globe, Server } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({
    cpu: 45,
    mem: 62,
    latency: 12,
    nodes: 8
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        cpu: Math.floor(Math.random() * 20) + 30,
        mem: Math.floor(Math.random() * 10) + 55,
        latency: Math.floor(Math.random() * 5) + 8,
        nodes: 8
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Bauhaus GitHub Grid Mockup
  const gridData = Array.from({ length: 52 * 7 }, () => Math.random() > 0.7);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24">
      <header className="mb-16">
        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4">
          Personal <span className="text-bauhaus-red">OS</span>
        </h1>
        <div className="h-2 w-full bg-black"></div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
        {/* Real-time Telemetry */}
        <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Cpu />} label="CPU LOAD" value={`${stats.cpu}%`} color="bg-bauhaus-yellow" />
          <StatCard icon={<Database />} label="MEM UTIL" value={`${stats.mem}%`} color="bg-bauhaus-blue text-white" />
          <StatCard icon={<Activity />} label="LATENCY" value={`${stats.latency}ms`} color="bg-bauhaus-red text-white" />
          <StatCard icon={<Server />} label="NODES" value={stats.nodes} color="bg-black text-white" />
        </div>

        {/* Global Status */}
        <div className="border-4 border-black p-6 bg-white hard-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-black uppercase text-xs tracking-widest text-gray-400">System Status</span>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-black"></div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black uppercase">Operation: Active</p>
            <p className="text-xs font-bold text-gray-500 mt-1 uppercase">Neural Core v2.4.0</p>
          </div>
        </div>
      </div>

      {/* GitHub Activity Bauhaus Grid */}
      <section className="border-4 border-black p-8 bg-white hard-shadow mb-16 relative overflow-hidden">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-black text-white border-2 border-black">
              <Github size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter">Neural Contribution Graph</h2>
              <p className="text-xs font-bold uppercase text-gray-500">Mapping 365 Days of Code & Architecture</p>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-4 h-4 bg-bauhaus-off-white border-2 border-black"></div>
            <div className="w-4 h-4 bg-bauhaus-yellow border-2 border-black"></div>
            <div className="w-4 h-4 bg-bauhaus-blue border-2 border-black"></div>
            <div className="w-4 h-4 bg-bauhaus-red border-2 border-black"></div>
          </div>
        </div>

        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-4">
          {gridData.map((active, i) => (
            <div
              key={i}
              className={`w-3 h-3 border border-black/10 transition-colors duration-500 shadow-sm
                ${active 
                  ? (i % 3 === 0 ? 'bg-bauhaus-red' : i % 3 === 1 ? 'bg-bauhaus-blue' : 'bg-bauhaus-yellow') 
                  : 'bg-white'}`}
            ></div>
          ))}
        </div>
      </section>

      {/* Simulated Terminal Log */}
      <section className="bg-black text-green-500 p-8 font-mono text-xs border-4 border-black hard-shadow overflow-hidden group">
        <div className="flex items-center gap-2 mb-4 border-b border-green-500/30 pb-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span className="ml-2 text-green-500/50 uppercase tracking-widest">Neural_Core_Log.sys</span>
        </div>
        <div className="space-y-1">
          <p>[OK] INITIALIZING NEURAL KERNEL...</p>
          <p>[OK] LOADING BAUHAUS_DESIGN_SYSTEM_ASSETS...</p>
          <p>[OK] ESTABLISHING HANDSHAKE WITH PORTFOLIO_V3 API...</p>
          <p className="animate-pulse">_ EXECUTION_PATH: /usr/bin/cody --optimize</p>
          <p className="text-bauhaus-blue">[INFO] SYNCING GITHUB ACTIVITY... 100%</p>
          <p className="text-bauhaus-red">[WARNING] CREATIVE OVERLOAD DETECTED - AUTO-BALANCING...</p>
          <p className="text-bauhaus-yellow">[OK] DESIGN EQUILIBRIUM REACHED.</p>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
  <div className={`border-4 border-black p-4 flex flex-col justify-between hard-shadow ${color}`}>
    <div className="mb-4 opacity-80">{icon}</div>
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-2xl font-black leading-none">{value}</p>
    </div>
  </div>
);

export default Dashboard;
