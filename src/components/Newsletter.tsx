import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';

export const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulate API call
    setTimeout(() => {
      if (email.includes('error')) {
        setStatus('error');
      } else {
        setStatus('success');
        setEmail('');
      }
    }, 1500);
  };

  return (
    <div className="border-8 border-black p-8 md:p-12 bg-white hard-shadow relative overflow-hidden group">
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-bauhaus-red border-4 border-black"></div>
            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter leading-none">THE JOURNAL</h2>
          </div>
          <p className="text-xl font-bold uppercase tracking-tight opacity-70">
            Modular insights on AI, Design Systems, and the future of creative engineering. No noise, just logic.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="YOUR_EMAIL@NODE.SYS"
              className="w-full bg-bauhaus-off-white border-4 border-black p-4 font-black uppercase text-sm outline-none focus:bg-bauhaus-yellow transition-colors"
              required
              disabled={status === 'success' || status === 'loading'}
            />
            <AnimatePresence>
              {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-600"
                >
                  <CheckCircle2 size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            type="submit"
            disabled={status === 'success' || status === 'loading'}
            className={`w-full py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all border-4 border-black
              ${status === 'success' 
                ? 'bg-green-500 text-white border-green-700' 
                : 'bg-black text-white hover:bg-bauhaus-blue hover:translate-x-1 hover:translate-y-1 hover:shadow-none hard-shadow'}`}
          >
            {status === 'loading' ? (
              <div className="w-6 h-6 border-4 border-white border-t-transparent animate-spin rounded-full"></div>
            ) : status === 'success' ? (
              'SUBSCRIPTION_ACTIVE'
            ) : (
              <>INITIALIZE_SYNC <Send size={18} /></>
            )}
          </button>
          
          <AnimatePresence>
            {status === 'error' && (
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-bauhaus-red font-black uppercase text-[10px] flex items-center gap-2"
              >
                <AlertCircle size={14} /> CONNECTION_REFUSED. RETRY_LATER.
              </motion.p>
            )}
          </AnimatePresence>
        </form>
      </div>
    </div>
  );
};
