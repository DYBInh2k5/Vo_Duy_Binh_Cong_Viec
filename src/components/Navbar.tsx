import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'Playground', path: '/playground' },
    { name: 'Experience', path: '/experience' },
    { name: 'Capabilities', path: '/capabilities' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="flex justify-between items-center w-full px-8 h-20 bg-white dark:bg-stone-900 border-b-4 border-black dark:border-white hard-shadow sticky top-0 z-50">
      <Link to="/" className="text-3xl font-black text-black dark:text-white uppercase tracking-tighter">
        coDY
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`px-4 py-1 uppercase font-bold tracking-tighter transition-none hover:bg-bauhaus-yellow hover:text-black active:translate-x-1 active:translate-y-1 ${
              location.pathname === link.path 
                ? 'bg-bauhaus-red text-white' 
                : 'text-black dark:text-white'
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <Link 
          to="/contact" 
          className="hidden sm:block bg-bauhaus-red text-white px-6 py-2 border-2 border-black uppercase font-bold hard-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          Hire Me
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`text-5xl font-black tracking-tighter uppercase ${
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
