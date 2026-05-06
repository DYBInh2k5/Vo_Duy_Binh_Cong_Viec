import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Database, Zap, Cpu, Activity, Github, Globe, Server, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: '00:00', traffic: 400 },
  { name: '04:00', traffic: 300 },
  { name: '08:00', traffic: 900 },
  { name: '12:00', traffic: 1200 },
  { name: '16:00', traffic: 1500 },
  { name: '20:00', traffic: 1100 },
  { name: '23:59', traffic: 600 },
];

const Dashboard = () => {
  const [stats, setStats] = useState({
    cpu: 45,
    mem: 62,
    latency: 12,
    nodes: 8
  });

  const [githubStats, setGithubStats] = useState({
    totalRepos: 42,
    totalCommits: 1284,
    followers: 156
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

    // Simulated GitHub API Fetch
    const fetchGithub = async () => {
       // In a real app, you'd fetch from https://api.github.com/users/DYBInh2k5
       // Keeping it static for stability in demo
    };
    fetchGithub();

    return () => clearInterval(interval);
  }, []);

  // Bauhaus GitHub Grid
  const gridData = Array.from({ length: 52 * 7 }, () => Math.random() > 0.7);

  return (
    <div className="max-w-7xl mx-auto px-8 pt-24 pb-24">
      <header className="mb-16">
        <div className="flex items-center gap-4 mb-4">
           <div className="w-12 h-12 bg-bauhaus-red border-4 border-black"></div>
           <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter">
            PERSONAL <span className="text-bauhaus-blue">OS</span>
           </h1>
        </div>
        <div className="h-2 w-full bg-black"></div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-16">
        {/* Real-time Telemetry */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard icon={<Cpu />} label="CPU LOAD" value={`${stats.cpu}%`} color="bg-bauhaus-yellow" trend={<TrendingUp size={12} className="text-bauhaus-red" />} />
          <StatCard icon={<Database />} label="MEM UTIL" value={`${stats.mem}%`} color="bg-bauhaus-blue text-white" trend={<TrendingDown size={12} className="text-white" />} />
          <StatCard icon={<Activity />} label="LATENCY" value={`${stats.latency}ms`} color="bg-bauhaus-red text-white" />
          <StatCard icon={<Server />} label="NODES" value={stats.nodes} color="bg-black text-white" />
        </div>

        {/* Global Status */}
        <div className="border-4 border-black p-6 bg-white hard-shadow flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="font-black uppercase text-[10px] tracking-widest text-gray-400">Security Core</span>
            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse border-2 border-black"></div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-black uppercase">ACTIVE</p>
            <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase italic tracking-tighter leading-none">NO THREATS DETECTED IN SECTOR 7G</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
         {/* Neural Traffic Chart */}
         <div className="lg:col-span-8 border-4 border-black p-8 bg-white hard-shadow">
            <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-2">
               <Globe className="text-bauhaus-blue" /> Neural Traffic Pulse
            </h2>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2850CE" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#2850CE" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                    <XAxis 
                       dataKey="name" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 900, fill: '#000' }} 
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{ fontSize: 10, fontWeight: 900, fill: '#000' }} 
                    />
                    <Tooltip 
                       contentStyle={{ border: '4px solid black', borderRadius: '0', fontWeight: '900', textTransform: 'uppercase' }}
                    />
                    <Area type="monotone" dataKey="traffic" stroke="#2850CE" strokeWidth={4} fillOpacity={1} fill="url(#colorTraffic)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* GitHub Stats Panel */}
         <div className="lg:col-span-4 border-4 border-black p-8 bg-bauhaus-off-white hard-shadow space-y-8">
            <div className="flex items-center gap-4">
               <div className="p-2 bg-black text-white">
                  <Github />
               </div>
               <h3 className="font-black uppercase tracking-tighter">GIT METRICS</h3>
            </div>
            <div className="space-y-6">
               <GitStat label="Repositories" value={githubStats.totalRepos} />
               <GitStat label="Total Commits" value={githubStats.totalCommits} />
               <GitStat label="Followers" value={githubStats.followers} />
            </div>
            <div className="pt-6 border-t-2 border-black/10">
               <p className="text-[10px] font-black uppercase italic opacity-40 leading-tight">Last sync: T+0.04s via Bauhaus Middleware</p>
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

        <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-4 custom-scrollbar">
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

const StatCard = ({ icon, label, value, color, trend }: { icon: React.ReactNode, label: string, value: string | number, color: string, trend?: React.ReactNode }) => (
  <div className={`border-4 border-black p-4 flex flex-col justify-between hard-shadow ${color}`}>
    <div className="flex justify-between items-start">
       <div className="opacity-80">{icon}</div>
       {trend && <div className="animate-bounce">{trend}</div>}
    </div>
    <div className="mt-4">
      <p className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-2xl font-black leading-none">{value}</p>
    </div>
  </div>
);

const GitStat = ({ label, value }: { label: string, value: string | number }) => (
  <div className="flex justify-between items-end border-b-2 border-black pb-2">
    <div>
      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{label}</p>
    </div>
    <p className="text-2xl font-black italic">{value}</p>
  </div>
);

export default Dashboard;
