import React, { useState, useEffect } from 'react';
import { PROJECTS as ALL_PROJECTS } from '../constants';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ArrowRight, Github, ExternalLink, GitBranch, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Projects = () => {
  const { t } = useTranslation();
  const [filter, setFilter] = React.useState('ALL');
  const [repos, setRepos] = useState<any[]>([]);
  const [reposLoading, setReposLoading] = useState(true);
  const categories = ['ALL', 'AI', 'WEB', 'MOBILE'];

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch('https://api.github.com/users/DYBInh2k5/repos?sort=updated&per_page=6');
        const data = await response.json();
        if (Array.isArray(data)) {
          setRepos(data);
        }
      } catch (error) {
        console.error("Github API Error:", error);
      } finally {
        setReposLoading(false);
      }
    };
    fetchRepos();
  }, []);

  const filteredProjects = filter === 'ALL' 
    ? ALL_PROJECTS 
    : ALL_PROJECTS.filter(p => p.category.toUpperCase() === filter);

  return (
    <div className="max-w-[1440px] mx-auto px-8 pt-16 pb-24">
      {/* Header */}
      <header className="mb-lg">
        <h1 className="text-5xl sm:text-7xl md:text-9xl lg:text-[120px] leading-[0.9] font-black text-bauhaus-black mb-md tracking-[-0.04em] uppercase">
          {t('nav.projects')}
        </h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 border-4 border-black font-bold uppercase text-sm hard-shadow transition-all active:translate-x-1 active:translate-y-1 active:shadow-none ${
                filter === cat 
                  ? 'bg-bauhaus-red text-white' 
                  : 'bg-white text-black hover:bg-bauhaus-yellow'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mt-lg">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => {
            // Asymmetric layout logic from design snippet (8-4, 4-8 pattern)
            const layoutIndex = index % 2;
            const isLarge = (Math.floor(index / 2) % 2 === 0) ? (layoutIndex === 0) : (layoutIndex === 1);
            
            return (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`${isLarge ? 'md:col-span-8' : 'md:col-span-4'} group relative bg-white border-4 border-black hard-shadow overflow-hidden flex flex-col`}
              >
                {/* Top Badge */}
                <div className={`absolute top-0 right-0 w-16 h-16 z-10 flex items-center justify-center ${index % 2 === 0 ? 'bg-bauhaus-red' : 'bg-bauhaus-blue'}`}>
                  <Star className="text-white fill-current" size={24} />
                </div>

                {/* Image Container */}
                <div className={`${isLarge ? 'h-[250px] sm:h-[450px]' : 'h-[200px] sm:h-[300px]'} overflow-hidden border-b-4 border-black relative`}>
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover grayscale-hover group-hover:scale-105 transition-all duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-bauhaus-yellow border-2 border-black px-3 py-1 font-bold uppercase text-xs">
                    {project.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 bg-white flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-[32px] font-bold uppercase tracking-tighter leading-none group-hover:text-bauhaus-red transition-colors">
                      {project.title}
                    </h3>
                    <div className="flex gap-2">
                      {project.tech.slice(0, 2).map(t => (
                        <span key={t} className="bg-bauhaus-off-white px-3 py-1 border-2 border-black font-bold text-xs uppercase">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className={`text-bauhaus-black/70 leading-relaxed ${isLarge ? 'text-xl max-w-2xl' : 'text-md'} flex-grow`}>
                    {project.description}
                  </p>
                  <Link 
                    to={`/projects`} 
                    className="mt-6 flex justify-between items-center group-hover:translate-x-2 transition-transform"
                  >
                    <span className="font-bold text-bauhaus-red uppercase underline decoration-2 underline-offset-4">Details</span>
                    <ArrowRight size={24} className="text-black" />
                  </Link>
                </div>
                
                {/* Bottom animated bar */}
                <div className={`h-2 bg-bauhaus-${project.color.split('-')[1]} w-0 group-hover:w-full transition-all duration-500`}></div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Github Repos Section */}
      <div className="mt-24">
        <div className="flex items-center gap-4 mb-12">
          <Github size={48} className="text-bauhaus-black" />
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tighter">Live Repository Feed</h2>
        </div>

        {reposLoading ? (
          <div className="flex justify-center p-20">
            <RefreshCw className="animate-spin text-bauhaus-blue" size={32} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {repos.map((repo, i) => (
              <motion.a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="bg-bauhaus-black text-white p-6 border-4 border-black hover:bg-white hover:text-black transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <GitBranch size={20} className="text-bauhaus-yellow" />
                  <ExternalLink size={20} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-black truncate uppercase mb-2">{repo.name}</h3>
                <p className="text-xs opacity-60 mb-6 line-clamp-2 h-8">
                  {repo.description || "No description provided."}
                </p>
                <div className="flex gap-4 text-[10px] font-black uppercase">
                  <span>{repo.language || "Unknown"}</span>
                  <span className="text-bauhaus-red">★ {repo.stargazers_count}</span>
                  <span className="text-bauhaus-blue">Forks: {repo.forks_count}</span>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>

      {/* Section Break */}
      <div className="w-full h-1 bg-black my-xl"></div>

      {/* Call to Action */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-xl">
        <div className="md:col-span-7 bg-bauhaus-red p-8 sm:p-12 border-4 border-black hard-shadow text-white">
          <h2 className="text-4xl sm:text-6xl font-black uppercase mb-6 leading-none tracking-tighter">
            Ready to build<br />the future?
          </h2>
          <p className="text-xl mb-8 max-w-md opacity-90">
            I translate complex problems into geometric solutions. Let's construct something meaningful.
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-black text-white px-10 py-4 font-bold uppercase border-2 border-white hard-shadow hover:bg-white hover:text-black transition-all"
          >
            Start a Project
          </Link>
        </div>
        <div className="md:col-span-5 flex flex-col justify-between">
          <div className="bg-bauhaus-yellow p-8 border-4 border-black flex items-center justify-center h-48 md:h-full hard-shadow">
            <span className="text-8xl md:text-[120px] font-black text-black italic select-none">!</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Projects;
