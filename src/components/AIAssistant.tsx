import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { PROJECTS, EXPERIENCE, PERSONAL_INFO } from '../constants';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([
    { role: 'assistant', content: "Hi! I'm coDY's AI assistant. How can I help you learn more about his work and experience?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    try {
      const systemInstruction = `
        You are coDY's professional AI Assistant. Your goal is to represent him and answer questions about his portfolio.
        
        BACKGROUND:
        Name: ${PERSONAL_INFO.fullName} (Nickname: ${PERSONAL_INFO.nickname})
        Current Role: ${EXPERIENCE[0].role} at ${EXPERIENCE[0].company}
        Location: ${PERSONAL_INFO.location}
        Education: ${PERSONAL_INFO.education}
        
        EXPERIENCE:
        ${EXPERIENCE.map(exp => `- ${exp.role} at ${exp.company} (${exp.period}): ${exp.description}`).join('\n')}
        
        PROJECTS:
        ${PROJECTS.map(p => `- ${p.title} (${p.category}): ${p.description}. Tech: ${p.tech.join(', ')}`).join('\n')}
        
        INSTRUCTIONS:
        - Be professional, creative, and slightly technical.
        - If someone asks in Vietnamese, reply in Vietnamese.
        - Only answer questions related to coDY's portfolio, skills, and career.
        - Keep answers concise but informative.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', content: userMsg }].map(m => ({
          role: m.role === 'user' ? 'user' : 'model',
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction
        }
      });

      const aiResponse = response.text || "I'm sorry, I couldn't process that.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I'm having trouble connecting right now." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-bauhaus-black text-white flex items-center justify-center rounded-none border-2 border-bauhaus-black shadow-[4px_4px_0px_0px_rgba(255,59,48,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all z-50"
        id="ai-assistant-toggle"
      >
        <MessageSquare size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-8 w-[400px] max-w-[calc(100vw-4rem)] h-[600px] max-h-[calc(100vh-10rem)] bg-bauhaus-off-white border-4 border-bauhaus-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] flex flex-col z-50"
            id="ai-assistant-modal"
          >
            <div className="p-4 border-b-4 border-bauhaus-black bg-bauhaus-yellow flex justify-between items-center">
              <div className="flex items-center gap-2 font-black italic">
                <Bot size={20} />
                CODY AI AGENT
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                <X size={20} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-grow overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-3 border-2 border-bauhaus-black ${msg.role === 'user' ? 'bg-bauhaus-blue text-white' : 'bg-white text-black'}`}>
                    <div className="flex items-center gap-2 mb-1 opacity-50 text-[10px] uppercase font-bold">
                      {msg.role === 'user' ? <User size={12} /> : <Bot size={12} />}
                      {msg.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border-2 border-bauhaus-black p-3 animate-pulse">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-bauhaus-red rounded-full"></div>
                      <div className="w-2 h-2 bg-bauhaus-blue rounded-full"></div>
                      <div className="w-2 h-2 bg-bauhaus-yellow rounded-full"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t-4 border-bauhaus-black bg-white flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about coDY..."
                className="flex-grow p-2 border-2 border-bauhaus-black focus:outline-none focus:bg-bauhaus-off-white text-sm"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="bg-bauhaus-red text-white p-2 border-2 border-bauhaus-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
              >
                <Send size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
