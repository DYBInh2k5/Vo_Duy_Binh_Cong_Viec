import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, Terminal, ArrowRight, CornerDownLeft, Sparkles, 
  FileDown, LayoutGrid, Eye, HelpCircle, X, ChevronRight, Play
} from 'lucide-react';
import { generateResumePDF } from '../services/resumeService';

export const CommandPalette: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { mode, toggleMode } = useTheme();
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Sound generator helper for diagnostic feeling
  const playDiagnosticBeep = (freq = 800, type: OscillatorType = 'square', duration = 0.08) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Ignored if browser blocks audio autoplay/interaction
    }
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Commmand+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearch('');
        setSelectedIndex(0);
        playDiagnosticBeep(600, 'triangle', 0.12);
      }

      // Close on escape
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        playDiagnosticBeep(400, 'sawtooth', 0.08);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Command palette focus retention
  useEffect(() => {
    if (isOpen) {
      // Small timeout to let animation finish before focusing input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const commandItems = [
    // Navigation Nodes
    {
      id: 'nav-home',
      category: 'NAVIGATION GATEWAYS',
      title: '1. Home Base Node [Trang Chủ]',
      description: 'Primary landing terminal with system overview and credentials',
      action: () => navigate('/'),
      icon: <Terminal size={14} className="text-bauhaus-red" />
    },
    {
      id: 'nav-neurallab',
      category: 'AI METADATA LABS',
      title: '2. Neural Lab & Dynamic CV [AI & CV Designer]',
      description: 'Generative AI focus editor & live Bauhaus CV generation node',
      action: () => navigate('/neurallab'),
      icon: <Sparkles size={14} className="text-bauhaus-yellow" />
    },
    {
      id: 'nav-projects',
      category: 'COLLECTIONS & LOGS',
      title: '3. Built Works Matrix [Danh Sách Dự Án]',
      description: 'Engineered pipelines, web applications, and brutalist interfaces',
      action: () => navigate('/projects'),
      icon: <LayoutGrid size={14} className="text-stone-800" />
    },
    {
      id: 'nav-about',
      category: 'IDENTITY RECORDS',
      title: '4. About Vo Duy Binh (coDY) [Giới Thiệu]',
      description: 'Professional credentials, philosophy, and interactive files',
      action: () => navigate('/about'),
      icon: <ChevronRight size={14} className="text-bauhaus-blue" />
    },
    {
      id: 'nav-experience',
      category: 'IDENTITY RECORDS',
      title: '5. Career Timeline Log [Kinh Nghiệm]',
      description: 'Time series of full-stack developer roles and achievements',
      action: () => navigate('/experience'),
      icon: <ChevronRight size={14} className="text-bauhaus-red" />
    },
    {
      id: 'nav-capabilities',
      category: 'IDENTITY RECORDS',
      title: '6. Technological Spectrum [Kỹ Năng]',
      description: 'Deep stack of frameworks, databases, and AI algorithms',
      action: () => navigate('/capabilities'),
      icon: <ChevronRight size={14} className="text-bauhaus-yellow" />
    },
    {
      id: 'nav-playground',
      category: 'AI METADATA LABS',
      title: '7. Experiential Playground [Sân Chơi Thử Nghiệm]',
      description: 'Interactive canvas, graphic dynamic tools, and real-time labs',
      action: () => navigate('/playground'),
      icon: <Sparkles size={14} className="text-bauhaus-blue" />
    },
    {
      id: 'nav-guestbook',
      category: 'COLLECTIONS & LOGS',
      title: '8. Decentralized Guestbook [Sổ Lưu Bút]',
      description: 'Sign the matrix guest registry utilizing Firestore security guidelines',
      action: () => navigate('/guestbook'),
      icon: <FileDown size={14} className="text-stone-800" />
    },
    {
      id: 'nav-rubik',
      category: 'AI METADATA LABS',
      title: "9. Rubik's Cube Simulator [Mô phỏng Rubik]",
      description: 'Algorithmic 3D canvas puzzle and speed stats registry',
      action: () => navigate('/rubik'),
      icon: <Sparkles size={14} className="text-bauhaus-red" />
    },
    {
      id: 'nav-contact',
      category: 'NAVIGATION GATEWAYS',
      title: '10. Transmission Gateway [Liên Hệ]',
      description: 'Send messages directly into the centralized Firestore inbox pipeline',
      action: () => navigate('/contact'),
      icon: <Terminal size={14} className="text-bauhaus-blue" />
    },
    {
      id: 'nav-blog',
      category: 'COLLECTIONS & LOGS',
      title: '11. Chronicles Blog [Bài Viết & Nghiên Cứu]',
      description: 'Deep articles, design philosophies, and architectural walkthroughs',
      action: () => navigate('/blog'),
      icon: <LayoutGrid size={14} className="text-stone-800" />
    },
    {
      id: 'nav-dashboard',
      category: 'AI METADATA LABS',
      title: '12. Analytics Dashboard [Bảng Phân Tích]',
      description: 'Dynamic telemetry, visitor statistics, and system nodes logs',
      action: () => navigate('/dashboard'),
      icon: <Sparkles size={14} className="text-bauhaus-yellow" />
    },

    // System Utilities
    {
      id: 'act-ai',
      category: 'SYSTEM UTILITIES',
      title: '⚡ Invoke coDY AI Assistant [Trợ Lý AI]',
      description: 'Triggers the specialized real-time Google Gemini assistant terminal',
      action: () => {
        window.dispatchEvent(new CustomEvent('open-ai-assistant'));
      },
      icon: <Sparkles size={14} className="text-bauhaus-red" />
    },
    {
      id: 'act-resume',
      category: 'SYSTEM UTILITIES',
      title: '⚡ Extract/Download PDF Resume [Tải PDF Resume]',
      description: 'Dynamically bundle and download the classic stripped PDF resume file',
      action: () => {
        generateResumePDF();
      },
      icon: <FileDown size={14} className="text-bauhaus-blue" />
    },
    {
      id: 'act-theme',
      category: 'SYSTEM UTILITIES',
      title: '⚡ Trigger System Design Mode [Đổi Chế Độ Vẽ]',
      description: `Switch interface layout framework style (Current style: ${mode.toUpperCase()})`,
      action: () => {
        toggleMode();
      },
      icon: <Eye size={14} className="text-bauhaus-yellow" />
    },
    {
      id: 'act-lang',
      category: 'SYSTEM UTILITIES',
      title: '⚡ Swap Transmission Language [Đổi Ngôn Ngữ]',
      description: `Toggles current localization locale between English and Vietnamese`,
      action: () => {
        const nextLang = i18n.language === 'en' ? 'vi' : 'en';
        i18n.changeLanguage(nextLang);
      },
      icon: <Terminal size={14} className="text-stone-800" />
    },
    {
      id: 'act-beep',
      category: 'SYSTEM UTILITIES',
      title: '⚡ Launch Diagnostic System Sound [Âm Thanh Chẩn Đoán]',
      description: 'Play structured oscillators sound to test browser audio matrix pipeline',
      action: () => {
        playDiagnosticBeep(1200, 'square', 0.2);
        setTimeout(() => playDiagnosticBeep(1600, 'square', 0.15), 100);
      },
      icon: <Play size={14} className="text-bauhaus-red" />
    }
  ];

  // Filtering based on search state
  const filteredCommands = commandItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.description.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Index boundary correction on search change
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Listen to arrows and enter
  useEffect(() => {
    const handleNavigationKeys = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
        playDiagnosticBeep(500, 'sine', 0.04);
        
        // Scroll item into view automatically
        const listEl = listRef.current;
        const selectedEl = listEl?.children[selectedIndex + 1] as HTMLElement; // Offset search input
        if (listEl && selectedEl) {
          const listHeight = listEl.clientHeight;
          const elTop = selectedEl.offsetTop;
          const elHeight = selectedEl.clientHeight;
          if (elTop + elHeight > listEl.scrollTop + listHeight) {
            listEl.scrollTop = elTop + elHeight - listHeight;
          } else if (elTop < listEl.scrollTop) {
            listEl.scrollTop = elTop;
          }
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        playDiagnosticBeep(500, 'sine', 0.04);

        const listEl = listRef.current;
        const selectedEl = listEl?.children[selectedIndex - 1] as HTMLElement;
        if (listEl && selectedEl) {
          const elTop = selectedEl.offsetTop;
          if (elTop < listEl.scrollTop) {
            listEl.scrollTop = elTop;
          }
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          playDiagnosticBeep(900, 'triangle', 0.15);
          filteredCommands[selectedIndex].action();
          setIsOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleNavigationKeys);
    return () => window.removeEventListener('keydown', handleNavigationKeys);
  }, [isOpen, selectedIndex, filteredCommands]);

  return (
    <>
      {/* Floating command helper shortcut in the corner (no-print) */}
      <button
        onClick={() => {
          setIsOpen(true);
          playDiagnosticBeep(650, 'triangle', 0.12);
        }}
        className="fixed bottom-24 right-8 w-14 h-14 bg-bauhaus-blue text-white flex flex-col items-center justify-center rounded-none border-2 border-bauhaus-black shadow-[4px_4px_0px_0px_rgba(255,255,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all z-40 no-print"
        title="Open Command Center (⌘K)"
        id="command-center-launcher"
      >
        <Terminal size={18} />
        <span className="text-[7px] font-mono tracking-tighter mt-1 font-bold">CMD K</span>
      </button>

      {/* Render Dialog with AnimatePresence */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-start justify-center pt-16 md:pt-28 px-4 no-print" id="command-palette-container">
            {/* Dark semi-opaque backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs"
              onClick={() => {
                setIsOpen(false);
                playDiagnosticBeep(400, 'sawtooth', 0.08);
              }}
            />

            {/* Main Command Dialog Panel styled strictly in Bauhaus Brutalism */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
              ref={containerRef}
              className="relative w-full max-w-2xl bg-white border-4 border-black shadow-[16px_16px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[80vh]"
            >
              
              {/* Header: Input element / Title bar */}
              <div className="bg-bauhaus-yellow border-b-4 border-black p-4 flex gap-4 items-center">
                <Search size={22} className="text-black stroke-[3]" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="KÍCH HOẠT SHORTCUT / NHẬP TÌM KIẾM NODE HỆ THỐNG..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-grow bg-transparent text-black text-sm md:text-base font-black uppercase tracking-tight placeholder-black/50 outline-none border-none font-sans"
                />
                
                {/* Micro Close indicator */}
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    playDiagnosticBeep(300, 'triangle', 0.05);
                  }} 
                  className="border-2 border-black p-1 hover:bg-black hover:text-white transition-colors"
                >
                  <X size={14} className="stroke-[3]" />
                </button>
              </div>

              {/* Central items viewport */}
              <div 
                ref={listRef}
                className="flex-grow overflow-y-auto max-h-[450px]"
              >
                {filteredCommands.length > 0 ? (
                  <div className="divide-y-2 divide-black text-left">
                    {/* Map nodes grouped optionally or just clean list items with category titles */}
                    {filteredCommands.map((cmd, index) => {
                      const isSelected = index === selectedIndex;
                      
                      // Identify background color based on category/selected state
                      let bgClass = 'bg-white';
                      if (isSelected) {
                        if (cmd.category === 'NAVIGATION GATEWAYS') bgClass = 'bg-bauhaus-red text-white';
                        else if (cmd.category === 'AI METADATA LABS') bgClass = 'bg-bauhaus-blue text-white';
                        else if (cmd.category === 'IDENTITY RECORDS') bgClass = 'bg-bauhaus-yellow text-black';
                        else bgClass = 'bg-black text-white';
                      }

                      return (
                        <div
                          key={cmd.id}
                          onClick={() => {
                            playDiagnosticBeep(900, 'triangle', 0.15);
                            cmd.action();
                            setIsOpen(false);
                          }}
                          className={`p-4 transition-all duration-100 cursor-pointer flex justify-between items-center ${bgClass} group`}
                        >
                          <div className="flex gap-4 items-start max-w-[85%]">
                            {/* Icon block framed nicely in small border */}
                            <div className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 border-black ${
                              isSelected ? 'bg-white text-black' : 'bg-stone-100 text-stone-800'
                            }`}>
                              {cmd.icon}
                            </div>
                            
                            <div className="space-y-0.5">
                              <span className={`text-[8px] font-mono font-black uppercase tracking-wider block ${
                                isSelected ? (cmd.category === 'IDENTITY RECORDS' ? 'text-black' : 'text-white/80') : 'text-stone-500'
                              }`}>
                                {cmd.category}
                              </span>
                              <h5 className="font-extrabold text-xs md:text-sm uppercase tracking-tighter">
                                {cmd.title}
                              </h5>
                              <p className={`text-[10px] md:text-xs font-medium leading-tight ${
                                isSelected ? (cmd.category === 'IDENTITY RECORDS' ? 'text-black' : 'text-stone-200') : 'text-stone-600'
                              }`}>
                                {cmd.description}
                              </p>
                            </div>
                          </div>

                          {/* Quick access Enter icon indicator */}
                          {isSelected && (
                            <div className="shrink-0 animate-pulse">
                              <span className={`text-[8px] font-bold border px-1.5 py-0.5 uppercase tracking-wide flex items-center gap-1 ${
                                cmd.category === 'IDENTITY RECORDS' ? 'border-black text-black' : 'border-current text-white'
                              }`}>
                                <CornerDownLeft size={8} /> Enter
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-stone-50 border-b border-black">
                    <HelpCircle size={32} className="mx-auto text-stone-400 mb-2" />
                    <h5 className="font-black uppercase text-sm tracking-tight text-stone-700">
                      KHÔNG TÌM THẤY KẾT QUẢ PHÙ HỢP
                    </h5>
                    <p className="text-xs text-stone-500 font-bold max-w-xs mx-auto mt-1 uppercase">
                      "FORM FOLLOWS FUNCTION" - Thử lại bằng từ khóa tối giản hoặc tên chuyên ngành.
                    </p>
                  </div>
                )}
              </div>

              {/* Status Bar / Footer instruction logs */}
              <div className="bg-stone-100 border-t-4 border-black p-3.5 px-6 font-mono text-[9px] text-stone-600 flex justify-between items-center uppercase font-black">
                <div className="flex gap-4 items-center flex-wrap">
                  <span>⌨️ <strong className="text-black">↑↓</strong> CHUẨN ĐỊNH VỊ</span>
                  <span><strong className="text-black">ENTER</strong> THỰC THI CHỌN</span>
                  <span><strong className="text-black">ESC</strong> ĐÓNG KÊNH</span>
                </div>
                <div className="hidden sm:block">
                  <span>OPERATIONAL MATRIX GATEWAY V2.1</span>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
