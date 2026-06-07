import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Languages, HelpCircle, Copy, Check, Sparkles, RefreshCw, Layers, ArrowRight } from 'lucide-react';

interface CompiledTranslation {
  prefixKey: string;
  en: {
    title: string;
    subtitle: string;
    description: string;
    action: string;
  };
  vi: {
    title: string;
    subtitle: string;
    description: string;
    action: string;
  };
  explanation: string;
}

export default function NeuralTranslationCompiler() {
  const [sourceText, setSourceText] = useState('Khởi chạy hệ thống tự động hóa và đảm bảo tính hiệu chỉnh chặt chẽ');
  const [selectedContext, setSelectedContext] = useState('Core dashboard instructions & status indicators');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedKey, setCopiedKey] = useState<'EN' | 'VI' | null>(null);
  
  // High-fidelity initial state aligned with Bauhaus themes and Võ Duy Bình portfolio info
  const [compiledData, setCompiledData] = useState<CompiledTranslation>({
    prefixKey: "systemCore",
    en: {
      title: "INITIALIZE SYSTEM AUTOMATION",
      subtitle: "RIGID TELEMETRY PROTOCOLS ACTIVATED SUCCESSFULLY",
      description: "Our core layout engine automatically locks and validates all schema streams to prevent operational deviations. Form follows function.",
      action: "EXECUTE PIPELINE"
    },
    vi: {
      title: "KHỞI CHẠY TỰ ĐỘNG HÓA HỆ THỐNG",
      subtitle: "KÍCH HOẠT THÀNH CÔNG GIAO THỨC ĐO LƯỜNG CHẶT CHẼ",
      description: "Trình dựng bố cục cốt lõi của chúng tôi sẽ tự động khóa và xác thực toàn bộ các luồng cấu trúc dữ liệu để ngăn biến dạng vận hành.",
      action: "THỰC THI QUY TRÌNH"
    },
    explanation: "Synthesized localized wording with zero-bloat phrases. Refined nouns into literal structural triggers aligned with raw system architecture."
  });

  const [activePreviewLanguage, setActivePreviewLanguage] = useState<'EN' | 'VI'>('EN');
  const [interactionLogged, setInteractionLogged] = useState<string>('SYS: Ready for user verification.');

  const handleCompileTranslation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceText.trim()) return;
    setIsLoading(true);
    setInteractionLogged('SYS: Contacting multilingual engine...');

    try {
      const res = await fetch('/api/gemini/i18n-compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceText,
          context: selectedContext
        })
      });

      if (!res.ok) throw new Error("Compilation pipeline returned error status.");
      const data = await res.json();
      if (data && data.en && data.vi) {
        setCompiledData(data);
        setInteractionLogged('SYS: Compiled dictionaries successfully compiled and verified!');
      } else {
        throw new Error("Invalid output layout returned.");
      }
    } catch (err: any) {
      console.error(err);
      setInteractionLogged(`ERROR: ${err.message || 'Verification pipeline aborted.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (lang: 'EN' | 'VI') => {
    const dictionary = lang === 'EN' ? compiledData.en : compiledData.vi;
    const formattedJson = JSON.stringify(
      {
        [compiledData.prefixKey]: {
          title: dictionary.title,
          subtitle: dictionary.subtitle,
          description: dictionary.description,
          action: dictionary.action
        }
      },
      null,
      2
    );

    navigator.clipboard.writeText(formattedJson);
    setCopiedKey(lang);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTriggerAction = () => {
    const currentAction = activePreviewLanguage === 'EN' ? compiledData.en.action : compiledData.vi.action;
    setInteractionLogged(`ACTION: Captured live event handler dispatch: "${currentAction.toUpperCase()}"!`);
  };

  return (
    <motion.div
      key="node-13-i18n"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-8 border-black p-8 hard-shadow-lg space-y-6 lg:col-span-8 w-full text-left"
    >
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-4">
        <div>
          <span className="text-xs font-black bg-bauhaus-red text-white px-3 py-1 uppercase tracking-widest border border-black">
            NODE 13 // TRANSLATOR CORE
          </span>
          <h2 className="text-4xl font-extrabold uppercase tracking-tighter mt-2 text-black">
            LOCALIZED I18N COMPILER
          </h2>
          <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-1">
            Free high-precision Gemini translator generating perfectly valid i18next schema branches for english & vietnamese
          </p>
        </div>
        <Languages size={36} className="text-bauhaus-red hidden sm:block animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Controls Frame */}
        <form onSubmit={handleCompileTranslation} className="md:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                INPUT DICTATION (ENGLISH OR VIETNAMESE):
              </label>
              <textarea
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="E.G. LIÊN KẾT GIAO DIỆN VỚI HỆ THỐNG PHÂN TÍCH DỮ LIỆU ĐỂ TỐI ƯU..."
                rows={3}
                className="w-full border-2 border-black p-2.5 font-mono text-xs font-bold uppercase outline-none bg-white focus:bg-bauhaus-yellow text-black resize-none"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                CONTEXT / BRANDING DIRECTIVE:
              </label>
              <select
                value={selectedContext}
                onChange={(e) => setSelectedContext(e.target.value)}
                className="w-full border-2 border-black p-2 font-mono text-[10px] font-bold uppercase outline-none bg-white focus:bg-bauhaus-yellow text-black cursor-pointer"
              >
                <option value="Core dashboard instructions & status indicators">
                  DASHBOARD INDICATORS & ERRORS
                </option>
                <option value="Marketing & branding slogans">
                  MARKETING & BRANDING SLOGANS
                </option>
                <option value="Technical engineering protocols & architectural metadata">
                  TECHNICAL PLATFORM METADATA
                </option>
                <option value="Resume/CV actions & work progress logs">
                  PORTFOLIO EXPERIENCE & WORKLOGS
                </option>
              </select>
            </div>

            {/* Generated System Insights */}
            {compiledData.explanation && (
              <div className="border-2 border-black border-dashed p-3 bg-stone-50 font-mono text-[9px] leading-relaxed text-stone-600">
                <div className="flex items-center gap-1.5 font-black text-black mb-1">
                  <Sparkles size={11} className="text-bauhaus-red" />
                  SYSTEM CLASSIFICATION EXPL:
                </div>
                {compiledData.explanation.toUpperCase()}
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || !sourceText.trim()}
              className="w-full bg-black text-white font-black uppercase text-xs tracking-wider border-4 border-black p-3 hover:bg-bauhaus-red hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(16,16,16,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  COMPILING TELEMETRY...
                </>
              ) : (
                <>
                  <Layers size={14} />
                  COMPILE NEURAL LOCALES
                </>
              )}
            </button>
          </div>
        </form>

        {/* Dynamic Schema Preview Visualizer Frame */}
        <div className="md:col-span-7 space-y-4">
          {/* Header tabs */}
          <div className="flex justify-between items-center bg-stone-100 p-1 border-2 border-black">
            <div className="flex gap-1.5">
              <span className="text-[10px] font-mono font-black py-1 px-2 uppercase text-stone-500">
                PREVIEW LAYOUT:
              </span>
              <button
                type="button"
                onClick={() => setActivePreviewLanguage('EN')}
                className={`px-3 py-1 font-mono text-[10px] font-extrabold uppercase border border-black ${
                  activePreviewLanguage === 'EN' ? 'bg-black text-white' : 'bg-white hover:bg-stone-50 text-black'
                }`}
              >
                EN (ENGLISH)
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewLanguage('VI')}
                className={`px-3 py-1 font-mono text-[10px] font-extrabold uppercase border border-black ${
                  activePreviewLanguage === 'VI' ? 'bg-black text-white' : 'bg-white hover:bg-stone-50 text-black'
                }`}
              >
                VI (TIẾNG VIỆT)
              </button>
            </div>
            <span className="text-[9px] font-mono font-bold text-stone-500 hidden sm:inline mr-2 bg-stone-200 px-1 py-0.5">
              KEYS: {compiledData.prefixKey}
            </span>
          </div>

          {/* Actual Bauhaus interactive preview container */}
          <div className="border-4 border-black bg-stone-100 p-6 relative overflow-hidden flex flex-col justify-between h-[230px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-left">
            {/* Top Bauhaus accent bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-bauhaus-red"></div>
            
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono font-black text-bauhaus-red bg-black text-white px-2 py-0.5 uppercase tracking-wide">
                /{compiledData.prefixKey}/{activePreviewLanguage.toLowerCase()}
              </span>
              <h3 className="text-xl font-black tracking-tight uppercase leading-tight text-black">
                {activePreviewLanguage === 'EN' ? compiledData.en.title : compiledData.vi.title}
              </h3>
              <p className="text-[10px] font-mono font-extrabold text-stone-500 uppercase tracking-tighter">
                {activePreviewLanguage === 'EN' ? compiledData.en.subtitle : compiledData.vi.subtitle}
              </p>
              <p className="text-xs text-stone-800 leading-relaxed uppercase pt-1 max-h-[85px] overflow-hidden">
                {activePreviewLanguage === 'EN' ? compiledData.en.description : compiledData.vi.description}
              </p>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={handleTriggerAction}
                className="bg-bauhaus-yellow hover:bg-black hover:text-white text-black font-black uppercase text-[10px] border-2 border-black px-4 py-2 hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0"
              >
                {activePreviewLanguage === 'EN' ? compiledData.en.action : compiledData.vi.action}
                <ArrowRight size={10} />
              </button>
              <span className="text-[10px] font-mono font-semibold text-stone-400">
                PROD-STABLE BUILD
              </span>
            </div>
          </div>

          {/* Localized Code/Compilation Snippets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border-4 border-black bg-white p-3 space-y-2">
              <div className="flex justify-between items-center border-b border-black pb-1.5">
                <span className="text-[10px] font-mono font-black uppercase text-stone-700">EN TRANSLATION SNIPPET</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('EN')}
                  className="p-1 hover:bg-stone-100 border border-black hover:text-bauhaus-red transition-all"
                  title="Copy English Dictionary Object"
                >
                  {copiedKey === 'EN' ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                </button>
              </div>
              <pre className="text-[9px] font-mono block overflow-x-auto text-stone-600 bg-stone-50 p-2 border border-stone-200 uppercase leading-normal max-h-28 custom-scrollbar">
{`"${compiledData.prefixKey}": {
  "title": "${compiledData.en.title}",
  "subtitle": "${compiledData.en.subtitle}",
  "description": "${compiledData.en.description}",
  "action": "${compiledData.en.action}"
}`}
              </pre>
            </div>

            <div className="border-4 border-black bg-white p-3 space-y-2">
              <div className="flex justify-between items-center border-b border-black pb-1.5">
                <span className="text-[10px] font-mono font-black uppercase text-stone-700">VI TRANSLATION SNIPPET</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard('VI')}
                  className="p-1 hover:bg-stone-100 border border-black hover:text-bauhaus-red transition-all"
                  title="Copy Vietnamese Dictionary Object"
                >
                  {copiedKey === 'VI' ? <Check size={12} className="text-green-600" /> : <Copy size={12} />}
                </button>
              </div>
              <pre className="text-[9px] font-mono block overflow-x-auto text-stone-600 bg-stone-50 p-2 border border-stone-200 uppercase leading-normal max-h-28 custom-scrollbar">
{`"${compiledData.prefixKey}": {
  "title": "${compiledData.vi.title}",
  "subtitle": "${compiledData.vi.subtitle}",
  "description": "${compiledData.vi.description}",
  "action": "${compiledData.vi.action}"
}`}
              </pre>
            </div>
          </div>

          {/* Interactive Debug log */}
          <div className="border-2 border-black bg-black text-[#00FF00] p-1.5 font-mono text-[9px] uppercase tracking-wider text-left">
            {interactionLogged}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
