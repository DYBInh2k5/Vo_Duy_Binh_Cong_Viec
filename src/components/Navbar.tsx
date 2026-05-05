import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Languages, DraftingCompass, Palette } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { mode, toggleMode } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  const navGroups = [
    { 
      label: t('nav.works'), 
      links: [
        { name: t('nav.projects'), path: '/projects' },
        { name: t('nav.blog'), path: '/blog' }
      ]
    },
    { 
      label: t('nav.labs'), 
      links: [
        { name: t('nav.dashboard'), path: '/dashboard' },
        { name: t('nav.guestbook'), path: '/guestbook' },
        { name: t('nav.rubik'), path: '/rubik' },
        { name: t('nav.playground'), path: '/playground' }
      ]
    },
    { 
      label: t('nav.profile'), 
      links: [
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.experience'), path: '/experience' },
        { name: t('nav.capabilities'), path: '/capabilities' }
      ]
    },
  ];

  return (
    <nav className="flex justify-between items-center w-full px-8 h-20 bg-white dark:bg-stone-900 border-b-4 border-black dark:border-white hard-shadow sticky top-0 z-50">
      <Link to="/" className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
        coDY
      </Link>

      {/* Desktop Links */}
      <div className="hidden lg:flex gap-2">
        <Link
          to="/"
          className={`px-4 py-1 uppercase font-black tracking-tighter transition-all hover:bg-bauhaus-yellow hover:text-black ${
            location.pathname === '/' ? 'bg-bauhaus-red text-white' : 'text-black dark:text-white'
          }`}
        >
          {t('nav.home')}
        </Link>
        
        {navGroups.map((group) => (
          <div key={group.label} className="relative group/dropdown">
            <button className="px-4 py-1 uppercase font-black tracking-tighter flex items-center gap-1 hover:bg-bauhaus-yellow transition-all dark:text-white group-hover/dropdown:bg-bauhaus-yellow group-hover/dropdown:text-black focus:outline-none">
              {group.label}
              <motion.span
                animate={{ rotate: 0 }}
                className="text-[10px] opacity-50"
              >▼</motion.span>
            </button>
            <div className="absolute top-full left-0 bg-white border-4 border-black hard-shadow min-w-[200px] hidden group-hover/dropdown:block animate-in fade-in slide-in-from-top-2 duration-200">
              {group.links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-6 py-3 font-black uppercase text-sm border-b-2 border-black last:border-0 hover:bg-bauhaus-red hover:text-white transition-all ${
                    location.pathname === link.path ? 'bg-bauhaus-yellow text-black' : 'text-black'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1 border-2 border-black bg-white hover:bg-bauhaus-blue hover:text-white transition-all font-bold text-xs uppercase"
          title="Toggle Language"
        >
          <Languages size={14} />
          {i18n.language.toUpperCase()}
        </button>

        <button
          onClick={toggleMode}
          className={`flex items-center gap-2 px-3 py-1 border-2 border-black transition-all font-bold text-xs uppercase ${
            mode === 'draft' ? 'bg-black text-white' : 'bg-white text-black hover:bg-bauhaus-yellow'
          }`}
          title={mode === 'draft' ? 'Switch to Bauhaus' : 'Switch to Draft'}
        >
          {mode === 'draft' ? <Palette size={14} /> : <DraftingCompass size={14} />}
          {mode === 'draft' ? 'Bauhaus' : 'Draft'}
        </button>

        <Link 
          to="/contact" 
          className="hidden sm:block bg-bauhaus-red text-white px-6 py-2 border-2 border-black uppercase font-bold hard-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {t('common.contactMe')}
        </Link>
        
        {/* Mobile menu button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 border-2 border-black bg-bauhaus-yellow hard-shadow active:shadow-none active:translate-x-0.5 active:translate-y-0.5"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-50 md:hidden bg-bauhaus-off-white flex flex-col pt-24 px-8 gap-8"
          >
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-6 right-8 p-2 border-2 border-black bg-bauhaus-red text-white hard-shadow"
            >
              <X size={24} />
            </button>
            {[{ name: t('nav.home'), path: '/' }, ...navGroups.flatMap(g => g.links)].map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-4xl font-black tracking-tighter uppercase ${
                  location.pathname === link.path ? 'text-bauhaus-red' : 'text-bauhaus-black'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
