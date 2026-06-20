import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RefreshCw, Sparkles, Video, Eye, Copy, Check, Info, FileText, ArrowRight, Volume2 } from 'lucide-react';

interface ScriptScene {
  sceneNumber: number;
  duration: string;
  visualCue: string;
  audioCue: string;
  spokenScript: string;
}

interface ScriptResponse {
  title: string;
  videoTopic: string;
  visualTheme: string;
  scenes: ScriptScene[];
  estimatedDuration: string;
  productionNotes: string;
}

export default function NeuralScriptArchitect() {
  const [topic, setTopic] = useState('Why modern software engineers need Bauhaus design thinking');
  const [tone, setTone] = useState('Dynamic/Tiktok-Engaged');
  const [platform, setPlatform] = useState('TikTok / Shorts');
  const [visualLayout, setVisualLayout] = useState('High-contrast Bauhaus slides');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isCopiedFull, setIsCopiedFull] = useState(false);

  // Playback / Teleprompter State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(3000); // ms per scene
  const [consoleLog, setConsoleLog] = useState('MEDIA CORE: System configured. Ready for prompt input.');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial high-impact script template as a stunning preset
  const [scriptData, setScriptData] = useState<ScriptResponse>({
    title: "GRID VS FLOW: BAUHAUS IN TECH",
    videoTopic: "Why modern software engineers need Bauhaus design thinking",
    visualTheme: "High-contrast Bauhaus slides with primary geometry",
    estimatedDuration: "15 Seconds",
    productionNotes: "Use high-energy backing tracks. Cut sharply on every transition. Match visual timing strictly.",
    scenes: [
      {
        sceneNumber: 1,
        duration: "3s",
        visualCue: "A massive solid black screen. Suddenly, a bright #FF0000 red circle drops in from top-right. Text appears in giant bold font: 'YOUR CODE IS SLOP.'",
        audioCue: "Deep sub bass drop followed by an ultra-fast synthesizer sweep.",
        spokenScript: "Your code layout is messy because you are decorating. Stop copying arbitrary templates. Embrace structure."
      },
      {
        sceneNumber: 2,
        duration: "4s",
        visualCue: "Split-screen grid. Left side has a chaotic glowing spaghetti line; right side has raw, elegant, parallel grid paths aligned perfectly. Overlay a blue box over the grid.",
        audioCue: "Crisp mechanical clock clicking sound. Beats intensity doubles.",
        spokenScript: "Bauhaus Brutalism works because form follows function. Less decoration means less cognitive load on your compile pipeline."
      },
      {
        sceneNumber: 3,
        duration: "4s",
        visualCue: "Camera shifts to close-up of a code sandbox wrapping coordinates inside a bold frame. An cursor clicks 'EXECUTE PIPELINE' triggering a yellow flash.",
        audioCue: "High-frequency terminal diagnostic beep.",
        spokenScript: "When we strip the fluff, only the ultimate performance remains. Choose rigid layout alignments over bloated custom aesthetics."
      },
      {
        sceneNumber: 4,
        duration: "4s",
        visualCue: "The screen flashes Bauhaus yellow. Giant black tracking-tighter text displays: 'VDB / CODY'. Social beacons link overlays in clear mono font.",
        audioCue: "Tension resolution chord with sharp vinyl audio scratch halt.",
        spokenScript: "Build systems that operate with absolute graphic intent. Explore the system nodes at beacons.ai/cody.vdb. Join the grid."
      }
    ]
  });

  // Teleprompter Playback loop
  useEffect(() => {
    if (isPlaying) {
      setConsoleLog(`PLAYBACK: Simulating scene 0${currentSceneIndex + 1} stream.`);
      timerRef.current = setTimeout(() => {
        if (currentSceneIndex < scriptData.scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
        } else {
          setCurrentSceneIndex(0);
          setIsPlaying(false);
          setConsoleLog(`PLAYBACK: Script simulation loop completed successfully.`);
        }
      }, playbackSpeed);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, currentSceneIndex, playbackSpeed, scriptData.scenes.length]);

  const handleGenerateScript = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentSceneIndex(0);
    setConsoleLog('MEDIA CORE: Initiating script synthesis protocol with server-side AI proxy...');

    try {
      const res = await fetch('/api/gemini/media-script', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic,
          tone,
          platform,
          visualLayout
        })
      });

      if (!res.ok) throw new Error("Script synthesis server pipe returned non-ok status.");
      
      const data = await res.json();
      if (data && data.scenes && data.scenes.length > 0) {
        setScriptData(data);
        setConsoleLog('MEDIA CORE: AI media script compiled and verified safely.');
      } else {
        throw new Error("Invalid schema structure returned.");
      }
    } catch (err: any) {
      console.warn("Script generation keyless bypass triggered. Compiling high-fidelity fallback...", err);
      // Generate a customized responsive offline fallback matching the user's input topic
      const topicUpper = topic.toUpperCase();
      const backupTitle = topic.length > 20 ? topic.substring(0, 20).toUpperCase() : topicUpper;
      
      setScriptData({
        title: `MEDIA CORE // ${backupTitle}`,
        videoTopic: topic,
        visualTheme: visualLayout,
        estimatedDuration: "30 Seconds",
        productionNotes: `Optimized for ${platform}. Execution style relies on ${tone} matching high contrast Bauhaus structures.`,
        scenes: [
          {
            sceneNumber: 1,
            duration: "5s",
            visualCue: `Extreme close up of a bold terminal console rendering "${backupTitle}". A massive blue square sweeps across the bottom grid alignment.`,
            audioCue: "High-tension oscillator sweep with raw metal mechanical strike.",
            spokenScript: `Ever wondered why ${topic} is changing the paradigm? Standard approaches are failing because they prioritize surface bloat.`
          },
          {
            sceneNumber: 2,
            duration: "8s",
            visualCue: "A vertical grid splits. Left side has primary colors red, blue, and yellow flowing into a single node. High-contrast labels blink: 'ACTIVE PIPELINE'.",
            audioCue: "Stray electronic static crackle resolving into a solid four-on-the-floor beat.",
            spokenScript: `By modeling this directly in the design workspace, we enforce functional structures. When visual style serves raw purpose, complexity vanishes.`
          },
          {
            sceneNumber: 3,
            duration: "9s",
            visualCue: "Interactive code debugger panel highlights optimized output blocks. The lines represent high-speed functional assets. Red border flashes.",
            audioCue: "Series of high-speed micro-beeps indicating compilation stability.",
            spokenScript: `Võ Duy Bình (coDY) builds this exact integration. We deconstruct redundant overheads, engineering zero-bloat automated systems.`
          },
          {
            sceneNumber: 4,
            duration: "8s",
            visualCue: "A clean white backdrop with zero-margin borders. Text displays: 'CONNECT NOW: VDB_PORTFOLIO'. Dynamic QR card animations activate.",
            audioCue: "Elegant synth pad resolution chord fade-out.",
            spokenScript: `Stop coding decoration. Start orchestrating logical architecture. Scan our portal registers and explore the portfolio node today.`
          }
        ]
      });
      setConsoleLog('MEDIA CORE (OFFLINE FALLBACK): Bespoke layout matched. Standardized on coDY automation pipelines.');
    } finally {
      setIsLoading(false);
    }
  };

  const copySceneText = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    setConsoleLog(`SYS: Copied Scene ${index + 1} spoken script.`);
  };

  const copyFullScript = () => {
    const fullText = `TITLE: ${scriptData.title}
TOPIC: ${scriptData.videoTopic}
DURATION: ${scriptData.estimatedDuration}
PLATFORM: ${platform}
VISUAL THEME: ${scriptData.visualTheme}

SCENES:
${scriptData.scenes.map(s => `[SCENE 0${s.sceneNumber}] (${s.duration})
VISUAL: ${s.visualCue}
AUDIO: ${s.audioCue}
SCRIPT: "${s.spokenScript}"`).join('\n\n')}

PRODUCTION NOTES: ${scriptData.productionNotes}`;

    navigator.clipboard.writeText(fullText);
    setIsCopiedFull(true);
    setTimeout(() => setIsCopiedFull(false), 2000);
    setConsoleLog(`SYS: Full compiled script markdown copied to clipboard.`);
  };

  const triggerStepForward = () => {
    if (currentSceneIndex < scriptData.scenes.length - 1) {
      setCurrentSceneIndex(prev => prev + 1);
      setConsoleLog(`PLAYBACK: Manual advanced to scene 0${currentSceneIndex + 2}.`);
    } else {
      setCurrentSceneIndex(0);
      setConsoleLog(`PLAYBACK: Recalibrated telemetry back to scene 01.`);
    }
  };

  return (
    <motion.div
      key="node-15-script"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white border-8 border-black p-8 hard-shadow-lg space-y-6 lg:col-span-8 w-full text-left"
    >
      {/* Banner Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-4 border-black pb-4">
        <div>
          <span className="text-xs font-black bg-bauhaus-yellow text-black px-3 py-1 uppercase tracking-widest border border-black">
            NODE 15 // CREATIVE AUTOMATION
          </span>
          <h2 className="text-4xl font-extrabold uppercase tracking-tighter mt-2 text-black">
            AI MEDIA SCRIPT ARCHITECT
          </h2>
          <p className="text-xs font-bold text-stone-600 uppercase tracking-wider mt-1">
            Bespoke video & script pipeline customized for technical branding, leveraging coDY's background at Ống Ngắm Media
          </p>
        </div>
        <Video size={36} className="text-bauhaus-blue hidden sm:block animate-pulse" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left column: input configurations */}
        <form onSubmit={handleGenerateScript} className="xl:col-span-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                VIDEO TARGET TOPIC / KEYWORD:
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="ENTER TOPIC DECOMPOSITIONS..."
                rows={3}
                className="w-full border-2 border-black p-2.5 font-mono text-xs font-bold uppercase outline-none bg-white focus:bg-bauhaus-yellow text-black resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                  PLATFORM CHANNEL:
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono text-[10px] font-bold uppercase outline-none bg-white focus:bg-bauhaus-yellow text-black cursor-pointer"
                >
                  <option value="TikTok / Shorts">TIKTOK // SHORTS</option>
                  <option value="YouTube Video Lineup">YOUTUBE DEEP-DIVE</option>
                  <option value="LinkedIn Brand Post">LINKEDIN HIGHLIGHT</option>
                  <option value="Instagram Reel Flow">INSTAGRAM REEL</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                  TRANSMISSION TONE:
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full border-2 border-black p-2 font-mono text-[10px] font-bold uppercase outline-none bg-white focus:bg-bauhaus-yellow text-black cursor-pointer"
                >
                  <option value="Dynamic/Tiktok-Engaged">DYNAMIC ACTION-FIRST</option>
                  <option value="Brutalist/Philosophical">BRUTALIST FILTERS</option>
                  <option value="Deep Technical/Developer">DEVELOPER BLUEPRINTS</option>
                  <option value="Conversational/Intro">CONVERSATIONAL TALK</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-stone-600 block leading-tight">
                VISUAL PRESENTATION LAYOUT:
              </label>
              <select
                value={visualLayout}
                onChange={(e) => setVisualLayout(e.target.value)}
                className="w-full border-2 border-black p-2 font-mono text-[10px] font-bold uppercase outline-none bg-white focus:bg-bauhaus-yellow text-black cursor-pointer"
              >
                <option value="High-contrast Bauhaus slides">HIGH-CONTRAST BAUHAUS SLIDES</option>
                <option value="Live Code Sandbox & terminal log scroll">LIVE SANDBOX & TERMINAL TRACK</option>
                <option value="Symmetry Talking Head closeup">SYMMETRIC TALKING HEAD CLOSEUP</option>
                <option value="Conceptual Abstract Vector SVG animations">CONCEPTUAL ABSTRACT VECTOR SVG</option>
              </select>
            </div>

            {/* Production notes insight box */}
            <div className="border-2 border-black border-dashed p-4 bg-stone-50 font-mono text-[9px] leading-relaxed text-stone-600">
              <div className="flex items-center gap-1.5 font-black text-black mb-1">
                <Info size={12} className="text-bauhaus-blue" />
                PRODUCTION DIRECTIONS:
              </div>
              {scriptData.productionNotes.toUpperCase()}
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading || !topic.trim()}
              className="w-full bg-black text-white font-black uppercase text-xs tracking-wider border-4 border-black p-4 hover:bg-bauhaus-red hover:text-white transition-colors shadow-[4px_4px_0_0_rgba(16,16,16,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] active:translate-x-0 active:translate-y-0 active:shadow-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  ORCHESTRATING SCENE FLOW...
                </>
              ) : (
                <>
                  <Sparkles size={14} className="text-bauhaus-yellow" />
                  SYNTHESIZE AUDIOVISUAL SCRIPT
                </>
              )}
            </button>
          </div>
        </form>

        {/* Right column: Dynamic script visualizer & playback engine */}
        <div className="xl:col-span-7 space-y-4">
          {/* Teleprompter Playback Terminal */}
          <div className="border-4 border-black bg-stone-100 p-4 relative overflow-hidden h-[240px] flex flex-col justify-between shadow-[4px_4px_0px_black]">
            {/* Top Bauhaus color blocks indicator bar */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-bauhaus-red via-bauhaus-blue to-bauhaus-yellow"></div>
            
            <div className="space-y-2 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-black px-2 py-0.5 bg-black text-white uppercase tracking-wider font-mono">
                  🔴 PLAYBACK MONITOR // SCENE 0{currentSceneIndex + 1}
                </span>
                <span className="text-[10px] font-mono text-stone-500 font-bold">
                  {scriptData.scenes[currentSceneIndex]?.duration} SLICE
                </span>
              </div>

              {/* Spoken script layout acting as active teleprompter display */}
              <div className="py-2">
                <h3 className="text-xs font-mono font-black text-bauhaus-red uppercase tracking-tight">Active Spoken Flow:</h3>
                <motion.p
                  key={currentSceneIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-md sm:text-lg font-black text-black leading-tight uppercase mt-1 tracking-tight select-all min-h-[70px]"
                >
                  &quot;{scriptData.scenes[currentSceneIndex]?.spokenScript}&quot;
                </motion.p>
              </div>
            </div>

            {/* Custom Interactive Teleprompter controls */}
            <div className="border-t-2 border-stone-300 pt-3 flex flex-wrap gap-3 justify-between items-center">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(!isPlaying);
                    setConsoleLog(`PLAYBACK: Manual toggle simulator ${!isPlaying ? 'ACTIVE' : 'PAUSED'}.`);
                  }}
                  className={`px-4 py-2 text-[10px] font-mono font-black uppercase tracking-wider border-2 border-black flex items-center gap-1 hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-0 active:translate-y-0 transition-all ${
                    isPlaying ? 'bg-bauhaus-red text-white' : 'bg-bauhaus-yellow text-black'
                  }`}
                >
                  {isPlaying ? <Pause size={10} /> : <Play size={10} />}
                  {isPlaying ? 'PAUSE PROMPT' : 'START MONITOR'}
                </button>

                <button
                  type="button"
                  onClick={triggerStepForward}
                  className="px-3 py-2 text-[10px] font-mono font-black uppercase text-black bg-white hover:bg-black hover:text-white border-2 border-black transition-all"
                  title="Forward to next scene"
                >
                  <ArrowRight size={10} />
                </button>
              </div>

              <div className="flex gap-2 items-center font-mono">
                <span className="text-[8px] font-black text-stone-500 uppercase">SPEED:</span>
                <select
                  value={playbackSpeed}
                  onChange={(e) => {
                    setPlaybackSpeed(Number(e.target.value));
                    setConsoleLog(`PLAYBACK: Set sequence tick speed to ${e.target.value}ms.`);
                  }}
                  className="border border-black bg-white p-1 text-[9px] font-bold outline-none"
                >
                  <option value={2000}>2s FAST</option>
                  <option value={3000}>3s NORMAL</option>
                  <option value={5000}>5s SLOW</option>
                </select>
              </div>
            </div>
          </div>

          {/* Fully Expanded Storyboard Grid */}
          <div className="border-4 border-black p-4 bg-white space-y-4">
            <div className="flex justify-between items-center border-b-2 border-black pb-2">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-bauhaus-blue" />
                <h4 className="font-black uppercase text-xs tracking-wider">AUDIOVISUAL STORYBOARD ({scriptData.scenes.length} SCENES)</h4>
              </div>
              <button
                type="button"
                onClick={copyFullScript}
                className={`py-1.5 px-3 border-2 border-black hover:bg-black hover:text-white transition-all font-mono text-[9px] font-black uppercase flex items-center gap-1.5 ${
                  isCopiedFull ? 'bg-green-500 text-white border-green-600' : 'bg-stone-50'
                }`}
              >
                {isCopiedFull ? <Check size={10} /> : <Copy size={10} />}
                {isCopiedFull ? 'COPIED FULL' : 'COPY MARKDOWN'}
              </button>
            </div>

            {/* Scenes Scroll Container */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
              {scriptData.scenes.map((scene, i) => {
                const isActive = i === currentSceneIndex;
                return (
                  <div
                    key={scene.sceneNumber}
                    onClick={() => {
                      setCurrentSceneIndex(i);
                      setConsoleLog(`PLAYBACK: Focused on scene 0${i + 1}.`);
                    }}
                    className={`border-2 p-4 cursor-pointer transition-all ${
                      isActive
                        ? 'border-black bg-stone-50 shadow-[3px_3px_0px_rgba(0,0,0,1)]'
                        : 'border-stone-200 hover:border-black bg-white hover:bg-stone-50/50'
                    }`}
                  >
                    <div className="flex justify-between items-center border-b border-dashed border-stone-300 pb-1.5 mb-2.5">
                      <span className={`text-[9px] font-mono font-black py-0.5 px-2 select-none ${
                        isActive ? 'bg-bauhaus-red text-white' : 'bg-stone-100 text-stone-500'
                      }`}>
                        SLATE 0{scene.sceneNumber} // {scene.duration}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          copySceneText(scene.spokenScript, i);
                        }}
                        className="p-1 border border-stone-300 hover:border-black text-stone-500 hover:text-black transition-all bg-white"
                        title="Copy scenic speech text only"
                      >
                        {copiedIndex === i ? <Check size={10} className="text-green-600" /> : <Copy size={10} />}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="p-2 border border-stone-200 bg-stone-50 leading-relaxed uppercase select-all">
                        <span className="text-[8px] font-black text-bauhaus-blue block mb-1">📐 VISUAL ARRANGEMENT:</span>
                        {scene.visualCue}
                      </div>

                      <div className="p-2 border border-stone-200 bg-stone-50 leading-relaxed uppercase select-all">
                        <span className="text-[8px] font-black text-bauhaus-yellow block mb-1 flex items-center gap-1">
                          <Volume2 size={9} />
                          AUDIO ACOUSTICS:
                        </span>
                        {scene.audioCue}
                      </div>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-dotted border-stone-300">
                      <p className="text-xs font-bold text-stone-600 leading-tight block select-all uppercase">
                        <strong className="text-black font-black">SCRIPTED SPEECH: </strong>
                        &quot;{scene.spokenScript}&quot;
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Diagnostic status line */}
          <div className="border-2 border-black bg-black text-[#00FF00] p-2 font-mono text-[9px] uppercase tracking-wider text-left">
            {consoleLog}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
