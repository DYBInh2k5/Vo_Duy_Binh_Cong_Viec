import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Copy, Check, Sparkles, RefreshCw, Layers, ShieldAlert, Cpu, ArrowRight } from 'lucide-react';

interface DeconstructResult {
  optimalCode: string;
  bloatIdentified: string;
  performanceGains: string;
  bauhausRuleAxiom: string;
}

const PRESET_CODES = [
  {
    id: 'react-loop',
    title: 'Heavily Nested React Logic',
    lang: 'React/TypeScript',
    code: `const UserBadge = ({ items, filterText }) => {
  return (
    <div>
      {items.map(item => {
        const uppercaseVal = item.value.toUpperCase();
        let matches = false;
        if (filterText !== "") {
          if (uppercaseVal.indexOf(filterText.toUpperCase()) !== -1) {
            matches = true;
          }
        } else {
          matches = true;
        }
        if (matches) {
          return <span key={item.id} className="badge bg-red">{uppercaseVal}</span>;
        }
        return null;
      })}
    </div>
  );
};`
  },
  {
    id: 'css-spaghetti',
    title: 'Inefficient Inline Tailwind/CSS Combo',
    lang: 'HTML/CSS/Tailwind',
    code: `<div class="card" style="margin-left: 20px; outline: none;" className="border-black border bg-white p-4 p-4 rounded-none shadow shadow-lg flex flex-col justify-start items-start gap-4 gap-4">
  <h1 style="font-weight: 900; font-size: 24px; font-family: sans-serif;" class="tracking-tight tracking-tighter text-black">
    CORE CONTROLLER STATUS
  </h1>
  <p class="text-xs text-stone-500 text-stone-500 leading-relaxed font-mono">
    System active. Waiting for signal.
  </p>
</div>`
  },
  {
    id: 'unoptimal-js',
    title: 'Redundant Array Operations',
    lang: 'JavaScript/TypeScript',
    code: `function filterAndSumLogs(logEntries) {
  let matchedLogs = [];
  for (let i = 0; i < logEntries.length; i++) {
    if (logEntries[i].category === 'PROTO') {
      matchedLogs.push(logEntries[i]);
    }
  }
  let finalScores = matchedLogs.map(l => {
    return {
      id: l.id,
      score: l.score * 1.5,
      timestamp: new Date(l.timestamp).getTime()
    };
  });
  let sumTotal = 0;
  for (let j = 0; j < finalScores.length; j++) {
    sumTotal += finalScores[j].score;
  }
  return { results: finalScores, sum: sumTotal };
}`
  }
];

export default function NeuralCodeDeconstructor() {
  const [rawCode, setRawCode] = useState(PRESET_CODES[0].code);
  const [selectedLang, setSelectedLang] = useState(PRESET_CODES[0].lang);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  
  // High-fidelity baseline simulation aligned with system state and coDY's background
  const [deconstructedData, setDeconstructedData] = useState<DeconstructResult>({
    optimalCode: `const UserBadge = ({ items, filterText }: { items: any[]; filterText: string }) => {
  const filterUpper = filterText.toUpperCase();
  
  return (
    <div className="flex flex-wrap gap-2">
      {items.reduce<React.ReactNode[]>((acc, item) => {
        const upperVal = item.value.toUpperCase();
        if (!filterText || upperVal.includes(filterUpper)) {
          acc.push(
            <span key={item.id} className="bg-bauhaus-red text-white p-2 font-mono text-xs font-bold border border-black">
              {upperVal}
            </span>
          );
        }
        return acc;
      }, [])}
    </div>
  );
};`,
    bloatIdentified: "Identified nested conditions inside an iterative array map. Filter criteria was being calculated repeatedly within each loop traversal step. The HTML element relied on loose class structures rather than atomic styling wrappers.",
    performanceGains: "Reduced algorithmic cost from O(N * M) to O(N). Avoided redundant component render states. Replaced standard bad-contrast styles with clean high-impact Bauhaus classes.",
    bauhausRuleAxiom: "FORM FOLLOWS FUNCTION — Remove any architectural layers that do not serve an direct, operational purpose."
  });

  const [terminalLog, setTerminalLog] = useState('SYS: Code optimization engine online.');

  const handleDeconstruct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawCode.trim()) return;
    setIsLoading(true);
    setTerminalLog('SYS: Running AST deconstruction parser...');

    try {
      const res = await fetch('/api/gemini/code-deconstruct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rawCode,
          language: selectedLang
        })
      });

      if (!res.ok) throw new Error("Optimization pipeline returned failed exit code.");
      const data = await res.json();
      if (data && data.optimalCode) {
        setDeconstructedData(data);
        setTerminalLog('SYS: Bauhaus code optimization compiled successfully!');
      } else {
        throw new Error("Invalid schema structure compiled.");
      }
    } catch (err: any) {
      console.error(err);
      setTerminalLog(`ABORTED: ${err.message || 'Verification aborted.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(deconstructedData.optimalCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      key="node-14-deconstruct"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-8 border-black p-8 hard-shadow-lg space-y-6 lg:col-span-8 w-full text-left"
    >
      {/* Visual Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-4">
        <div>
          <span className="text-xs font-black bg-bauhaus-yellow text-black px-3 py-1 uppercase tracking-widest border border-black">
            NODE 14 // REFACTOR PIPELINE
          </span>
          <h2 className="text-4xl font-extrabold uppercase tracking-tighter mt-2 text-black">
            NEURAL CODE DECONSTRUCT ENGINE
          </h2>
          <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-1">
            Zero-fluff AST analyzer stripping out bad boilerplate and redundant statements using high-performance structural constraints
          </p>
        </div>
        <Cpu size={36} className="text-bauhaus-blue hidden sm:block animate-spin-slow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Input Workstation */}
        <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            
            {/* Quick presets selectors */}
            <div className="border-4 border-black p-3 bg-stone-100 space-y-2">
              <span className="text-[10px] font-mono font-black bg-black text-white px-2 py-0.5 uppercase tracking-wider">
                CHOOSE RAW SOURCE PRESETS
              </span>
              <div className="flex flex-col gap-1 text-left">
                {PRESET_CODES.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setRawCode(item.code);
                      setSelectedLang(item.lang);
                      setTerminalLog(`LOADED: Injected ${item.title.toUpperCase()}`);
                    }}
                    className={`border-2 border-black p-1.5 font-mono text-[9px] font-bold uppercase transition-all flex items-center justify-between hover:bg-stone-50 ${
                      rawCode === item.code ? 'bg-bauhaus-yellow text-black font-black' : 'bg-white text-stone-700'
                    }`}
                  >
                    <span>{item.title}</span>
                    <span className="text-[8px] bg-black text-white px-1 font-black shrink-0 ml-1 leading-tight">{item.lang}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Input target lang */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                INPUT DIALECT OVERRIDE:
              </label>
              <input
                type="text"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                placeholder="E.G. TYPESCRIPT, SOLIDITY, TAILWIND..."
                className="w-full border-2 border-black p-2 font-mono text-[10px] font-bold uppercase outline-none bg-white focus:bg-bauhaus-yellow text-black"
              />
            </div>

            {/* Main Text Area */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                PASTE MESSY / UNOPTIMIZED CODE TO DECONSTRUCT:
              </label>
              <textarea
                value={rawCode}
                onChange={(e) => setRawCode(e.target.value)}
                rows={11}
                className="w-full border-2 border-black p-3 font-mono text-[11px] font-bold uppercase leading-normal outline-none bg-white focus:bg-stone-50 select-text text-black custom-scrollbar resize-none"
                required
              />
            </div>

          </div>

          <div className="pt-2">
            <button
              onClick={handleDeconstruct}
              disabled={isLoading || !rawCode.trim()}
              className="w-full bg-black text-white font-black uppercase text-xs tracking-wider border-4 border-black p-3 hover:bg-bauhaus-blue hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(16,16,16,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  ANALYZING CORE ABSTRACT TREE...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-bauhaus-yellow" />
                  DECONSTRUCT & STRIP ALL BLOAT
                </>
              )}
            </button>
          </div>
        </div>

        {/* Audit Results Workstation */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Bauhaus Axiom Badge */}
          <div className="border-4 border-black bg-bauhaus-red text-white p-3 font-mono flex items-center gap-2">
            <ShieldAlert size={16} className="text-white shrink-0 animate-bounce" />
            <div className="text-left leading-tight">
              <span className="text-[8px] font-black uppercase text-stone-200 block">APPLIED STRUCTURAL AXIOM:</span>
              <p className="text-xs font-black tracking-tight uppercase">
                {deconstructedData.bauhausRuleAxiom}
              </p>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="border-4 border-black bg-stone-100 p-4 space-y-1.5 min-h-[100px] flex flex-col justify-between">
              <span className="text-[10px] font-mono font-black text-bauhaus-blue bg-white border border-black px-2 py-0.5 self-start uppercase">
                BLOAT IDENTIFIED
              </span>
              <p className="text-[11px] font-mono text-stone-700 leading-normal uppercase">
                {deconstructedData.bloatIdentified}
              </p>
            </div>

            <div className="border-4 border-black bg-stone-100 p-4 space-y-1.5 min-h-[100px] flex flex-col justify-between">
              <span className="text-[10px] font-mono font-black text-bauhaus-yellow bg-black text-white px-2 py-0.5 self-start uppercase">
                INTELLIGENT EFFICIENCY GAINS
              </span>
              <p className="text-[11px] font-mono text-stone-700 leading-normal uppercase">
                {deconstructedData.performanceGains}
              </p>
            </div>

          </div>

          {/* Optimized Output Frame */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center bg-black text-white p-2 border-2 border-black font-mono text-xs">
              <span className="font-black text-bauhaus-yellow">OPTIMIZED STRUCTURED SCHEMAS</span>
              <button
                onClick={copyCode}
                className="p-1 hover:bg-stone-800 border border-neutral-700 hover:text-bauhaus-yellow transition-all flex items-center gap-1 font-black text-[9px] uppercase px-2 py-0.5"
                title="Copy Clean Reflowed Code"
              >
                {copied ? (
                  <>
                    <Check size={10} className="text-green-400" />
                    COPIED
                  </>
                ) : (
                  <>
                    <Copy size={10} />
                    COPY
                  </>
                )}
              </button>
            </div>
            
            <pre className="text-[11px] font-mono text-black leading-relaxed bg-stone-50 border-4 border-black p-4 max-h-[185px] overflow-auto select-all custom-scrollbar uppercase">
              {deconstructedData.optimalCode}
            </pre>
          </div>

          {/* Live system telemetry log */}
          <div className="border-2 border-black bg-black text-[#00FF00] p-2 font-mono text-[9px] uppercase tracking-wider text-left flex gap-1.5 items-center">
            <Terminal size={12} className="text-[#00FF00] shrink-0 animate-pulse" />
            <span>{terminalLog}</span>
          </div>

        </div>

      </div>
    </motion.div>
  );
}
