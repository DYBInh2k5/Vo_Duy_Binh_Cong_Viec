import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bot, Mic, MicOff, Search, Cpu, Terminal, FileText, 
  Sparkles, RefreshCw, Radio, FileCode, CheckCircle, ExternalLink,
  LogIn, LogOut, Palette, Play, Database, Lock, UserCheck, Server
} from 'lucide-react';
import { db, auth, loginWithGoogle, logout } from '../lib/firebase';
import { collection, doc, setDoc, getDocs, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

interface GroundingSource {
  title: string;
  url: string;
}

interface StructuredCV {
  themeTitle: string;
  philosophyStatement: string;
  technicalSkills?: { title: string; category: string; competency: string }[];
  gridManifesto?: { nodeId: string; label: string; value: string; accentColor: string }[];
}

const NeuralLab = () => {
  // Global Active Node State
  const [activeNode, setActiveNode] = useState<number>(1);

  // --- NODE 1: MULTIMODAL LIVE AUDIO ---
  const [liveConnected, setLiveConnected] = useState(false);
  const [liveStatus, setLiveStatus] = useState('OFFLINE');
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [liveLog, setLiveLog] = useState<string[]>(['[INFRASTRUCTURE]: PROTOCOL INITIALIZED.']);
  const [micActive, setMicActive] = useState(false);
  const [textInput, setTextInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isPlayingRef = useRef(false);

  // --- NODE 5: AUDIO INPUT STREAM REFS ---
  const micStreamRef = useRef<MediaStream | null>(null);
  const processorNodeRef = useRef<ScriptProcessorNode | null>(null);

  // --- NODE 6: BAUHAUS SVG GENERATIVE ART ---
  const [artPrompt, setArtPrompt] = useState('Thiết kế sơ đồ hạ tầng cơ bắp dữ liệu dạng Bauhaus');
  const [isGeneratingArt, setIsGeneratingArt] = useState(false);
  const [generativeArt, setGenerativeArt] = useState<any>(null);

  // --- NODE 7: INTERACTIVE SANDBOX CODE ---
  const [sandboxDirective, setSandboxDirective] = useState('Mô phỏng bảng đo lưu lượng dữ liệu dạng Bauhaus');
  const [isCompilingSandbox, setIsCompilingSandbox] = useState(false);
  const [sandboxResult, setSandboxResult] = useState<any>(null);

  // --- NODE 8: FIREBASE CONTROL PORTAL ---
  const [authUser, setAuthUser] = useState<any>(null);
  const [syncedCVs, setSyncedCVs] = useState<any[]>([]);
  const [syncedQueries, setSyncedQueries] = useState<any[]>([]);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [isSyncingState, setIsSyncingState] = useState(false);

  // Initialize Audio Source context on first click
  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
    }
  };

  // Downsampler to 16kHz for Gemini Multimodal input stream
  const downsampleBuffer = (buffer: Float32Array, inputSampleRate: number, outputSampleRate: number = 16000) => {
    if (inputSampleRate === outputSampleRate) return buffer;
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;
    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  };

  const startRecording = async () => {
    initAudioContext();
    if (!audioCtxRef.current || !wsRef.current) {
      setLiveLog(prev => [...prev, '[MIC_FAILED]: SOCKET UNCONNECTED OR AUDIO NOT INITIALIZED.']);
      return;
    }
    
    try {
      if (audioCtxRef.current.state === 'suspended') {
        await audioCtxRef.current.resume();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;
      
      const source = audioCtxRef.current.createMediaStreamSource(stream);
      // Create ScriptProcessorNode to process float arrays in chunks (4096 is optimal size)
      const processor = audioCtxRef.current.createScriptProcessor(4096, 1, 1);
      processorNodeRef.current = processor;
      
      const nativeSampleRate = audioCtxRef.current.sampleRate;
      
      processor.onaudioprocess = (e) => {
        const inputData = e.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(inputData, nativeSampleRate, 16000);
        
        // Float to Int16 Conversion
        const pcm16 = new Int16Array(downsampled.length);
        for (let i = 0; i < downsampled.length; i++) {
          const s = Math.max(-1, Math.min(1, downsampled[i]));
          pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }
        
        // Base64 encoding
        let binary = '';
        const bytes = new Uint8Array(pcm16.buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        const base64 = btoa(binary);
        
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ audio: base64 }));
        }
      };
      
      source.connect(processor);
      processor.connect(audioCtxRef.current.destination);
      
      setMicActive(true);
      setLiveLog(prev => [...prev, '[MIC]: STREAMING IN REAL-TIME RAW 16KHZ PCM...']);
    } catch (err: any) {
      console.error("Microphone capture failed:", err);
      setLiveLog(prev => [...prev, `[MIC_ERROR]: ${err.message}`]);
    }
  };

  const stopRecording = () => {
    if (processorNodeRef.current) {
      try {
        processorNodeRef.current.disconnect();
      } catch (_) {}
      processorNodeRef.current = null;
    }
    if (micStreamRef.current) {
      try {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      } catch (_) {}
      micStreamRef.current = null;
    }
    setMicActive(false);
  };

  const connectLiveSocket = () => {
    initAudioContext();
    if (wsRef.current) return;

    setLiveStatus('ESTABLISHING CONNECTION...');
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/live`;
    const socket = new WebSocket(wsUrl);
    wsRef.current = socket;

    socket.onopen = () => {
      setLiveConnected(true);
      setLiveStatus('SYNCHRONIZED');
      setLiveLog(prev => [...prev, '[CONNECTION]: WEBSOCKET TUNNEL MOUNTED ON PORT 3000.']);
    };

    socket.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.status === 'PROTOCOL_ESTABLISHED') {
          setLiveLog(prev => [...prev, '[PROTOCOL]: CODY INTELLIGENCE AGENT ONLINE.']);
        }
        if (data.text) {
          setSpokenTranscript(data.text);
          setLiveLog(prev => [...prev, `[CODY]: ${data.text}`]);
        }
        if (data.audio) {
          // Playback PCM or accumulate in chunk queue
          audioQueueRef.current.push(data.audio);
          processAudioQueue();
        }
        if (data.error) {
          setLiveLog(prev => [...prev, `[ERROR]: ${data.error}`]);
        }
      } catch (err) {
        console.error("Socket packet parse failed:", err);
      }
    };

    socket.onclose = () => {
      setLiveConnected(false);
      setLiveStatus('OFFLINE');
      stopRecording();
      wsRef.current = null;
      setLiveLog(prev => [...prev, '[CONNECTION]: WEBSOCKET TERMINATED.']);
    };
  };

  const disconnectLiveSocket = () => {
    stopRecording();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  };

  const processAudioQueue = async () => {
    if (isPlayingRef.current || audioQueueRef.current.length === 0 || !audioCtxRef.current) return;
    isPlayingRef.current = true;

    try {
      const base64Str = audioQueueRef.current.shift()!;
      const binaryString = atob(base64Str);
      const len = binaryString.length;
      const bytes = new Int16Array(len / 2);
      for (let i = 0; i < len; i += 2) {
        bytes[i / 2] = (binaryString.charCodeAt(i + 1) << 8) | binaryString.charCodeAt(i);
      }

      const float32Data = new Float32Array(bytes.length);
      for (let i = 0; i < bytes.length; i++) {
        float32Data[i] = bytes[i] / 32768.0;
      }

      const audioBuffer = audioCtxRef.current.createBuffer(1, float32Data.length, 16000);
      audioBuffer.copyToChannel(float32Data, 0);

      const sourceNode = audioCtxRef.current.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(audioCtxRef.current.destination);
      sourceNode.onended = () => {
        isPlayingRef.current = false;
        processAudioQueue();
      };
      sourceNode.start(0);
    } catch (err) {
      console.error("Audio block playback error:", err);
      isPlayingRef.current = false;
      processAudioQueue();
    }
  };

  const sendLiveMessage = () => {
    if (!textInput.trim() || !wsRef.current) return;
    setLiveLog(prev => [...prev, `[USER]: ${textInput}`]);
    wsRef.current.send(JSON.stringify({ text: textInput }));
    setTextInput('');
  };

  // --- NODE 2: SEARCH GROUNDING ---
  const [searchQuery, setSearchQuery] = useState('Who is Võ Duy Bình (coDY)?');
  const [searchResponse, setSearchResponse] = useState('');
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearchGrounding = async () => {
    if (!searchQuery.trim() || isSearching) return;
    setIsSearching(true);
    setSearchResponse('');
    setGroundingSources([]);

    try {
      const response = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: searchQuery }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setSearchResponse(data.text);
      setGroundingSources(data.sources || []);

      // Background telemetry write to Firestore (No block to user)
      try {
        const qId = 'q_' + Math.random().toString(36).substring(2, 15);
        await setDoc(doc(db, 'lab_queries', qId), {
          type: 'SEARCH_GROUNDING',
          query: searchQuery,
          response: data.text,
          timestamp: serverTimestamp()
        });
      } catch (fErr) {
        console.warn("Firestore grounding sync skipped:", fErr);
      }
    } catch (err: any) {
      setSearchResponse(`Grounding execution failure: ${err.message}`);
    } finally {
      setIsSearching(false);
    }
  };

  // --- NODE 3: STRUCTURED OUTPUTS ---
  const [cvFocusInput, setCvFocusInput] = useState('A highly specialized node focus on building Generative AI pipelines and React-based Bauhaus interfaces.');
  const [isGeneratingCV, setIsGeneratingCV] = useState(false);
  const [structuredCV, setStructuredCV] = useState<StructuredCV | null>({
    themeTitle: "Neural Architecture Focus",
    philosophyStatement: "SYSTEM EFFICIENCY & STRUCTURAL TRANSPARENCY OVER GRAPHIC DECORATIONS.",
    technicalSkills: [
      { title: "WebSocket Live Integration", category: "AI Node", competency: "98%" },
      { title: "JSON Schema Enforcement", category: "Reliability", competency: "95%" },
      { title: "Context Caching Retrieval", category: "Database", competency: "90%" }
    ],
    gridManifesto: [
      { nodeId: "GRID_01", label: "Structural Blueprint", value: "React 19 core mapped with zero-fluff modular layout engines.", accentColor: "bauhaus-red" },
      { nodeId: "GRID_02", label: "Model Optimization", value: "Gemini Pro integration with strictly bound static context caches.", accentColor: "bauhaus-blue" }
    ]
  });

  const getCustomCV = async () => {
    if (!cvFocusInput.trim() || isGeneratingCV) return;
    setIsGeneratingCV(true);
    try {
      const response = await fetch('/api/gemini/structured-cv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ focus: cvFocusInput }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setStructuredCV(data);

      // Background write generated custom CV registry to Firestore (No block to user)
      try {
        const cvId = 'cv_' + Math.random().toString(36).substring(2, 15);
        await setDoc(doc(db, 'cv_generations', cvId), {
          focus: cvFocusInput,
          themeTitle: data.themeTitle,
          philosophyStatement: data.philosophyStatement,
          timestamp: serverTimestamp()
        });
        setLiveLog(prev => [...prev, `[FIREBASE]: CUSTOM RESUME "${data.themeTitle}" SYNCED.`]);
      } catch (fErr) {
        console.warn("Firestore custom resume sync skipped:", fErr);
      }
    } catch (err: any) {
      alert(`Schema generation failed: ${err.message}`);
    } finally {
      setIsGeneratingCV(false);
    }
  };

  // --- NODE 4: CONTEXT CACHING ---
  const [cacheQuery, setCacheQuery] = useState('How are Firebase rules implemented in this portfolio codebase?');
  const [cacheResult, setCacheResult] = useState('');
  const [cacheStats, setCacheStats] = useState<{ status: string; size: string; latency: string } | null>(null);
  const [isQueryingCache, setIsQueryingCache] = useState(false);

  const queryCachedContext = async () => {
    if (!cacheQuery.trim() || isQueryingCache) return;
    setIsQueryingCache(true);
    try {
      const response = await fetch('/api/gemini/cached-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: cacheQuery }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setCacheResult(data.text);
      setCacheStats({
        status: data.cacheStatus,
        size: data.tokenSize,
        latency: data.latency
      });

      // Background lookup query write to Firestore (No block to user)
      try {
        const qId = 'q_' + Math.random().toString(36).substring(2, 15);
        await setDoc(doc(db, 'lab_queries', qId), {
          type: 'CONTEXT_CACHING',
          query: cacheQuery,
          response: data.text,
          timestamp: serverTimestamp()
        });
      } catch (fErr) {
        console.warn("Firestore caching sync skipped:", fErr);
      }
    } catch (err: any) {
      setCacheResult(`Caching lookup error: ${err.message}`);
    } finally {
      setIsQueryingCache(false);
    }
  };

  // --- NODE 6: BAUHAUS GENERATIVE ART CORE ---
  const generateBauhausArt = async () => {
    if (!artPrompt.trim() || isGeneratingArt) return;
    setIsGeneratingArt(true);
    setGenerativeArt(null);
    try {
      const response = await fetch('/api/gemini/generative-art', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: artPrompt }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setGenerativeArt(data);
    } catch (err: any) {
      alert(`Generative Compilation error: ${err.message}`);
    } finally {
      setIsGeneratingArt(false);
    }
  };

  // --- NODE 7: INTERACTIVE SANDBOX CODE ---
  const compileSandboxComponent = async () => {
    if (!sandboxDirective.trim() || isCompilingSandbox) return;
    setIsCompilingSandbox(true);
    setSandboxResult(null);
    try {
      const response = await fetch('/api/gemini/sandbox-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ directive: sandboxDirective }),
      });
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSandboxResult(data);
    } catch (err: any) {
      alert(`Sandbox compiler error: ${err.message}`);
    } finally {
      setIsCompilingSandbox(false);
    }
  };

  // --- NODE 8: FIREBASE ANALYTICS ENGINE & RECRUITER INSIGHTS PANEL ---
  const fetchDashboardData = async () => {
    setIsLoadingDashboard(true);
    try {
      const cvSnap = await getDocs(query(collection(db, 'cv_generations'), orderBy('timestamp', 'desc'), limit(15)));
      const cvs = cvSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSyncedCVs(cvs);

      const qSnap = await getDocs(query(collection(db, 'lab_queries'), orderBy('timestamp', 'desc'), limit(15)));
      const queries = qSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setSyncedQueries(queries);
    } catch (err: any) {
      console.warn("Recruiter insights access restricted / connection skipped:", err.message);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setAuthUser(user);
      if (user) {
        // Automatically check insight registers
        fetchDashboardData();
      }
    });
    return () => unsub();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-6 pt-24 pb-24 min-h-screen">
      <header className="mb-12 border-b-8 border-black pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-bauhaus-blue border-4 border-black shrink-0"></div>
            <div>
              <h1 className="text-5xl sm:text-7xl font-black uppercase tracking-tighter">
                NEURAL <span className="text-bauhaus-red">LAB</span>
              </h1>
              <p className="text-lg font-bold text-black uppercase tracking-widest opacity-60 mt-1">
                AI Studio Core Integration Engine
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 6, 7, 8].map((num) => (
              <button
                key={num}
                onClick={() => setActiveNode(num)}
                className={`w-12 h-12 flex items-center justify-center font-black border-4 border-black transition-all ${
                  activeNode === num 
                    ? 'bg-bauhaus-yellow text-black translate-x-[-2px] translate-y-[-2px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white text-stone-500 hover:bg-stone-100'
                }`}
              >
                N{num}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* NODE INTERACTIVE WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Navigation & Infrastructure details */}
        <div className="lg:col-span-4 space-y-6">
          <div className="border-4 border-black p-6 bg-white hard-shadow">
            <h3 className="text-xl font-black uppercase tracking-tighter mb-4 border-b-2 border-black pb-2">
              System Core Map
            </h3>
            <div className="space-y-2">
              {[
                { id: 1, tag: 'NODE 01 + 05', title: 'Multimodal Voice Live', color: 'bg-bauhaus-blue text-white', desc: 'Bidirectional raw audio micro-streaming with sub-200ms latency' },
                { id: 2, tag: 'NODE 02', title: 'Search Grounding', color: 'bg-bauhaus-red text-white', desc: 'Real-time validation with inline search references' },
                { id: 3, tag: 'NODE 03', title: 'Structured Outputs', color: 'bg-bauhaus-yellow text-black', desc: 'Enforced JSON schemas rendered as perfect card elements' },
                { id: 4, tag: 'NODE 04', title: 'Context Caching', color: 'bg-black text-white', desc: 'Rapid lookup indexing on the codebase schemas' },
                { id: 6, tag: 'NODE 06', title: 'Bauhaus SVG Art', color: 'bg-bauhaus-red text-white', desc: 'Algorithmic dynamic shape design via Structured outputs' },
                { id: 7, tag: 'NODE 07', title: 'Blueprint Sandbox', color: 'bg-bauhaus-blue text-white', desc: 'Interactive compiler sandbox executing HTML/CSS/JS' },
                { id: 8, tag: 'NODE 08', title: 'Firebase Portal', color: 'bg-bauhaus-yellow text-black', desc: 'Real-time sync telemetry analytics under strict admin auth rules' }
              ].map((node) => (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node.id)}
                  className={`w-full text-left p-4 border-2 border-black transition-all flex flex-col gap-1 ${
                    activeNode === node.id ? 'bg-stone-100 border-l-[12px] border-l-black' : 'hover:bg-stone-50 bg-white'
                  }`}
                >
                  <p className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-none self-start ${node.color}`}>
                    {node.tag}
                  </p>
                  <h4 className="font-extrabold text-md uppercase mt-1">{node.title}</h4>
                  <p className="text-xs font-bold text-stone-600 leading-tight">{node.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="border-4 border-black p-6 bg-bauhaus-yellow text-black hard-shadow">
            <h3 className="font-black uppercase tracking-tighter text-sm mb-2">Protocol Architecture</h3>
            <p className="text-xs font-bold leading-relaxed opacity-85">
              These systems implement full-stack models with robust, secure server proxy conduits (Express hybrid architecture). 
              All intelligence layers run server-side to hide secure access protocols. Built strictly in compliance with high-contrast Bauhaus Brutalism guidelines.
            </p>
          </div>
        </div>

        {/* Right Side: Tab/Workspace Display */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeNode === 1 && (
              <motion.div
                key="node1"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border-8 border-black bg-white p-8 hard-shadow-lg space-y-6"
              >
                <div className="flex justify-between items-center border-b-4 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <Radio className="text-bauhaus-blue animate-pulse" size={32} />
                    <div>
                      <span className="text-[10px] font-black uppercase bg-bauhaus-blue text-white px-2 py-0.5">NODE_01_PROTO</span>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Multimodal Live Session</h2>
                    </div>
                  </div>
                  <div className={`px-3 py-1 border-2 border-black text-xs font-black uppercase ${
                    liveConnected ? 'bg-green-500 text-white' : 'bg-stone-200 text-black animate-pulse'
                  }`}>
                    {liveStatus}
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-600">
                  Connect using bi-directional real-time communication. Realized via a persistent WebSocket pipeline to our backend routing server proxying Gemini 3.1 Live models.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border-4 border-black p-4 bg-stone-50 flex flex-col justify-between h-48">
                    <span className="text-[10px] font-black uppercase opacity-50 block mb-2">Controls</span>
                    
                    <div className="space-y-3">
                      {!liveConnected ? (
                        <button
                          onClick={connectLiveSocket}
                          className="w-full py-3 bg-bauhaus-blue text-white border-2 border-black font-black uppercase tracking-wider text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                        >
                          <Radio className="animate-spin" size={16} /> Install Protocol Network
                        </button>
                      ) : (
                        <button
                          onClick={disconnectLiveSocket}
                          className="w-full py-3 bg-bauhaus-red text-white border-2 border-black font-black uppercase tracking-wider text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                        >
                          Disconnect Protocol
                        </button>
                      )}

                      {liveConnected && (
                        !micActive ? (
                          <button
                            onClick={startRecording}
                            className="w-full py-3 bg-bauhaus-yellow text-black border-2 border-black font-black uppercase tracking-wider text-xs hover:bg-yellow-400 transition-all flex items-center justify-center gap-2"
                          >
                            <Mic size={16} /> Start Microphone Stream (Node 05)
                          </button>
                        ) : (
                          <button
                            onClick={stopRecording}
                            className="w-full py-3 bg-bauhaus-red text-white border-2 border-black font-black uppercase tracking-wider text-xs hover:bg-red-700 animate-pulse transition-all flex items-center justify-center gap-2"
                          >
                            <MicOff size={16} /> Pause Streaming [Live PCM]
                          </button>
                        )
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            if (wsRef.current) {
                              wsRef.current.send(JSON.stringify({ text: "Tell me about your tech stacks and projects" }));
                              setLiveLog(prev => [...prev, '[USER]: Request Stack info']);
                            }
                          }}
                          disabled={!liveConnected}
                          className="flex-1 py-2 border-2 border-black bg-white hover:bg-stone-100 text-[10px] font-black uppercase disabled:opacity-50"
                        >
                          Describe Stack
                        </button>
                        <button
                          onClick={() => {
                            if (wsRef.current) {
                              wsRef.current.send(JSON.stringify({ text: "Say hello and give a motivational quote" }));
                              setLiveLog(prev => [...prev, '[USER]: Request greeting']);
                            }
                          }}
                          disabled={!liveConnected}
                          className="flex-1 py-2 border-2 border-black bg-white hover:bg-stone-100 text-[10px] font-black uppercase disabled:opacity-50"
                        >
                          Request Welcome
                        </button>
                      </div>
                    </div>

                    <div className="text-[10px] uppercase font-bold text-stone-600">
                      * Uses model: <strong className="text-black">gemini-3.1-flash-live-preview</strong>
                    </div>
                  </div>

                  <div className="border-4 border-black bg-black p-4 text-green-400 font-mono text-xs flex flex-col justify-between h-48">
                    <div className="overflow-y-auto max-h-32 custom-scrollbar space-y-1">
                      {liveLog.map((log, i) => (
                        <div key={i}>{log}</div>
                      ))}
                    </div>
                    <div className="border-t border-green-800 pt-2 flex items-center gap-2">
                      <input
                        type="text"
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && sendLiveMessage()}
                        disabled={!liveConnected}
                        placeholder={liveConnected ? "Type raw instruction..." : "Tunnel deactivated"}
                        className="flex-grow bg-transparent border-none text-green-400 focus:outline-none placeholder-green-800 uppercase"
                      />
                    </div>
                  </div>
                </div>

                {spokenTranscript && (
                  <div className="border-4 border-black p-6 bg-bauhaus-yellow/10">
                    <div className="flex items-center gap-2 mb-2 font-black text-xs uppercase text-bauhaus-red">
                      <Bot size={16} /> Live Audio Transcript
                    </div>
                    <p className="font-extrabold italic text-stone-800">
                      &quot;{spokenTranscript}&quot;
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeNode === 2 && (
              <motion.div
                key="node2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border-8 border-black bg-white p-8 hard-shadow-lg space-y-6"
              >
                <div className="flex justify-between items-center border-b-4 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <Search className="text-bauhaus-red" size={32} />
                    <div>
                      <span className="text-[10px] font-black uppercase bg-bauhaus-red text-white px-2 py-0.5">NODE_02_PROTO</span>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Google Search Grounding</h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-600">
                  Enable Google Search validation dynamically within model pipelines. Returns accurate real-time parameters from external search nodes combined with clear citations.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask coDY about tech xu hướng..."
                      className="flex-grow p-4 border-4 border-black font-black uppercase text-xs focus:bg-stone-50 focus:outline-none"
                    />
                    <button
                      onClick={handleSearchGrounding}
                      disabled={isSearching || !searchQuery.trim()}
                      className="bg-black text-white px-8 border-4 border-black font-black uppercase tracking-widest text-xs hover:bg-bauhaus-red transition-all flex items-center gap-2"
                    >
                      {isSearching ? <RefreshCw className="animate-spin" /> : <Sparkles size={16} />} Search
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Citations Column */}
                    <div className="md:col-span-8 border-4 border-black p-6 min-h-60 bg-stone-50 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase opacity-50 block mb-4">Grounded Output</span>
                        {isSearching ? (
                          <div className="flex items-center gap-2 uppercase font-black tracking-widest text-xs">
                            <RefreshCw className="animate-spin text-bauhaus-red" /> Fetching node data...
                          </div>
                        ) : searchResponse ? (
                          <p className="text-sm font-bold leading-relaxed whitespace-pre-wrap">{searchResponse}</p>
                        ) : (
                          <p className="text-xs font-bold text-stone-400 italic">No grounding transaction verified.</p>
                        )}
                      </div>
                    </div>

                    {/* Grounding Source cards */}
                    <div className="md:col-span-4 border-4 border-black p-6 bg-white flex flex-col">
                      <span className="text-[10px] font-black uppercase opacity-50 block mb-4">Source Nodes</span>
                      {groundingSources.length > 0 ? (
                        <div className="space-y-2 overflow-y-auto max-h-52 custom-scrollbar">
                          {groundingSources.map((src, i) => (
                            <a
                              key={i}
                              href={src.url}
                              target="_blank"
                              referrerPolicy="no-referrer"
                              className="block p-3 border-2 border-black bg-white hover:bg-bauhaus-yellow transition-all group"
                            >
                              <div className="flex justify-between items-center gap-2">
                                <span className="font-extrabold text-[10px] uppercase truncate max-w-[80%]">
                                  [{i+1}] {src.title || "External Source"}
                                </span>
                                <ExternalLink size={12} className="shrink-0" />
                              </div>
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs font-bold text-stone-400 italic">No reference anchors found.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeNode === 3 && (
              <motion.div
                key="node3"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border-8 border-black bg-white p-8 hard-shadow-lg space-y-6"
              >
                <div className="flex justify-between items-center border-b-4 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <Cpu className="text-bauhaus-yellow" size={32} />
                    <div>
                      <span className="text-[10px] font-black uppercase bg-bauhaus-yellow text-black px-2 py-0.5">NODE_03_PROTO</span>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Structured CV Generator</h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-600">
                  Enforce JSON schemas using strict model outputs to avoid structural distortion. Create specialized CV styles mapped dynamically to Bauhaus components.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cvFocusInput}
                      onChange={(e) => setCvFocusInput(e.target.value)}
                      placeholder="e.g. Focus on Mobile development and Flutter stacks..."
                      className="flex-grow p-4 border-4 border-black font-black uppercase text-xs focus:bg-stone-50 focus:outline-none"
                    />
                    <button
                      onClick={getCustomCV}
                      disabled={isGeneratingCV || !cvFocusInput.trim()}
                      className="bg-bauhaus-yellow text-black px-8 border-4 border-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all flex items-center gap-2 shrink-0"
                    >
                      {isGeneratingCV ? <RefreshCw className="animate-spin" /> : <FileText size={16} />} Synthesize
                    </button>
                  </div>

                  {structuredCV && (
                    <div className="border-4 border-black p-6 bg-stone-50 space-y-6">
                      <div className="border-b-2 border-black pb-4 flex justify-between items-start">
                        <div>
                          <span className="text-[9px] font-black uppercase bg-black text-white px-2 py-0.5">ENFORCED SCHEMATIC</span>
                          <h3 className="text-2xl font-black uppercase mt-1">Theme: {structuredCV.themeTitle}</h3>
                        </div>
                        <span className="text-xs font-black uppercase bg-green-500 text-white px-2 py-1 border-2 border-black">
                          Verified JSON Out
                        </span>
                      </div>

                      <div className="border-l-4 border-l-bauhaus-blue pl-4 py-1">
                        <span className="text-[10px] font-black uppercase text-stone-600">Philosophy Statement</span>
                        <p className="font-extrabold italic text-sm mt-1">{structuredCV.philosophyStatement}</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Skills Box */}
                        <div className="border-2 border-black p-4 bg-white">
                          <span className="text-[10px] font-black uppercase opacity-55 block mb-3">Structured Skills Inventory</span>
                          <div className="space-y-2">
                            {structuredCV.technicalSkills?.map((skill, index) => (
                              <div key={index} className="flex justify-between items-center hover:bg-stone-50 p-2 border-b border-black last:border-0">
                                <div>
                                  <h5 className="font-extrabold text-xs uppercase">{skill.title}</h5>
                                  <span className="text-[8px] font-bold text-stone-500 uppercase">{skill.category}</span>
                                </div>
                                <span className="font-black text-xs text-bauhaus-blue">{skill.competency}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Grid Manifesto Box */}
                        <div className="grid grid-cols-1 gap-2">
                          {structuredCV.gridManifesto?.map((man, i) => (
                            <div 
                              key={i} 
                              className={`border-2 border-black p-4 text-black flex flex-col justify-between ${
                                man.accentColor === 'bauhaus-red' ? 'bg-bauhaus-red/10' :
                                man.accentColor === 'bauhaus-blue' ? 'bg-bauhaus-blue/10' : 'bg-bauhaus-yellow/10'
                              }`}
                            >
                              <span className="text-[8px] font-black uppercase tracking-widest opacity-60">ID: {man.nodeId}</span>
                              <div>
                                <h5 className="font-black text-xs uppercase mt-1">{man.label}</h5>
                                <p className="text-[11px] font-bold mt-1 text-stone-800">{man.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeNode === 4 && (
              <motion.div
                key="node4"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border-8 border-black bg-white p-8 hard-shadow-lg space-y-6"
              >
                <div className="flex justify-between items-center border-b-4 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <FileCode className="text-black" size={32} />
                    <div>
                      <span className="text-[10px] font-black uppercase bg-black text-white px-2 py-0.5">NODE_04_PROTO</span>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Context Caching Explorer</h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-600">
                  Inject entire codebase contexts, localization specs, and component behaviors into the model&apos;s cache. Speeds up dynamic lookup responses and yields substantial resource savings.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={cacheQuery}
                      onChange={(e) => setCacheQuery(e.target.value)}
                      placeholder="Query cached files or structural layouts..."
                      className="flex-grow p-4 border-4 border-black font-black uppercase text-xs focus:bg-stone-50 focus:outline-none"
                    />
                    <button
                      onClick={queryCachedContext}
                      disabled={isQueryingCache || !cacheQuery.trim()}
                      className="bg-black text-white px-8 border-4 border-black font-black uppercase tracking-widest text-xs hover:bg-bauhaus-blue transition-all flex items-center gap-2"
                    >
                      {isQueryingCache ? <RefreshCw className="animate-spin" /> : <Terminal size={16} />} Query Cache
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Results Box */}
                    <div className="md:col-span-8 border-4 border-black p-6 bg-stone-50 min-h-52 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase opacity-50 block mb-4">Cache Response</span>
                        {isQueryingCache ? (
                          <div className="flex items-center gap-2 uppercase font-black text-xs tracking-widest">
                            <Radio className="animate-pulse text-bauhaus-blue" /> Reading cache tier...
                          </div>
                        ) : cacheResult ? (
                          <p className="text-sm font-bold leading-relaxed">{cacheResult}</p>
                        ) : (
                          <p className="text-xs font-bold text-stone-400 italic">No search performed on cache blocks.</p>
                        )}
                      </div>
                    </div>

                    {/* Metadata Diagnostic Logs */}
                    <div className="md:col-span-4 border-4 border-black p-6 bg-bauhaus-blue text-white flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-black uppercase opacity-60 block mb-4">Diagnostics</span>
                        
                        {cacheStats ? (
                          <div className="space-y-3 font-mono text-xs">
                            <div className="border-b border-white pb-2 flex justify-between">
                              <span className="font-bold opacity-60">Status:</span>
                              <span className="font-black text-bauhaus-yellow flex items-center gap-1">
                                <CheckCircle size={12} /> {cacheStats.status}
                              </span>
                            </div>
                            <div className="border-b border-white pb-2 flex justify-between">
                              <span className="font-bold opacity-60">Cache Size:</span>
                              <span className="font-black">{cacheStats.size}</span>
                            </div>
                            <div className="border-b border-white pb-2 flex justify-between">
                              <span className="font-bold opacity-60">Latency:</span>
                              <span className="font-black text-green-300">{cacheStats.latency}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-bold opacity-60">Hit Count:</span>
                              <span className="font-black">Dynamic</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs font-bold opacity-60 italic">Verify lookup diagnostics.</p>
                        )}
                      </div>
                      
                      <div className="text-[10px] font-black uppercase tracking-widest mt-4 pt-4 border-t border-white/20">
                        Context Cache Hit Optimized
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeNode === 6 && (
              <motion.div
                key="node6"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border-8 border-black bg-white p-8 hard-shadow-lg space-y-6"
              >
                <div className="flex justify-between items-center border-b-4 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <Palette className="text-bauhaus-red" size={32} />
                    <div>
                      <span className="text-[10px] font-black uppercase bg-bauhaus-red text-white px-2 py-0.5">NODE_06_PROTO</span>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Bauhaus SVG Generative Art Core</h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-600">
                  By declaring strict structured outputs mapping, standard models compile precise mathematical coordinates, matching vector lines, and raw colors on a grid layout dynamically.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={artPrompt}
                      onChange={(e) => setArtPrompt(e.target.value)}
                      placeholder="e.g. Sơ đồ mạch điện Bauhaus..."
                      className="flex-grow p-4 border-4 border-black font-black uppercase text-xs focus:bg-stone-50 focus:outline-none"
                    />
                    <button
                      onClick={generateBauhausArt}
                      disabled={isGeneratingArt || !artPrompt.trim()}
                      className="bg-bauhaus-red text-white px-8 border-4 border-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all flex items-center gap-2 shrink-0"
                    >
                      {isGeneratingArt ? <RefreshCw className="animate-spin" /> : <Palette size={16} />} Synthesize SVG
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* SVG CANVAS CONTAINER */}
                    <div className="md:col-span-7 border-4 border-black p-4 bg-stone-100 flex flex-col items-center justify-center min-h-[400px]">
                      {isGeneratingArt ? (
                        <div className="text-center font-black uppercase text-xs animate-pulse">
                          <RefreshCw className="animate-spin text-bauhaus-red mx-auto mb-2" />
                          Plotting coordinate arrays...
                        </div>
                      ) : generativeArt ? (
                        <div className="bg-white border-4 border-black p-4 inline-block shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] w-full max-w-[380px] text-center mx-auto">
                          <svg
                            viewBox="0 0 500 500"
                            width="100%"
                            height="340"
                            className="bg-white border-2 border-black mx-auto"
                          >
                            {generativeArt.elements?.map((el: any, index: number) => {
                              const commonProps = {
                                key: index,
                                fill: el.fill || 'none',
                                stroke: el.stroke || '#000000',
                                strokeWidth: el.strokeWidth || 8,
                              };

                              switch (el.type) {
                                case 'rect':
                                  return (
                                    <rect 
                                      {...commonProps} 
                                      x={el.x ?? 50} 
                                      y={el.y ?? 50} 
                                      width={el.width ?? 100} 
                                      height={el.height ?? 100} 
                                    />
                                  );
                                case 'circle':
                                  return (
                                    <circle 
                                      {...commonProps} 
                                      cx={el.cx ?? 150} 
                                      cy={el.cy ?? 150} 
                                      r={el.r ?? 50} 
                                    />
                                  );
                                case 'line':
                                  return (
                                    <line 
                                      {...commonProps} 
                                      x1={el.x1 ?? 0} 
                                      y1={el.y1 ?? 0} 
                                      x2={el.x2 ?? 100} 
                                      y2={el.y2 ?? 100} 
                                    />
                                  );
                                case 'text':
                                  return (
                                    <text 
                                      {...commonProps} 
                                      x={el.x ?? 50} 
                                      y={el.y ?? 50}
                                      className="font-black text-xs"
                                      style={{ fontSize: '30px', fontFamily: '"Space Grotesk", sans-serif' }}
                                    >
                                      {el.textValue || 'BAUHAUS'}
                                    </text>
                                  );
                                case 'polygon':
                                  return (
                                    <polygon 
                                      {...commonProps} 
                                      points={el.points || '0,0 100,0 50,100'} 
                                    />
                                  );
                                default:
                                  return null;
                              }
                            })}
                          </svg>
                          <div className="mt-4 font-black uppercase text-center text-sm tracking-widest border-t-2 border-black pt-2 truncate pl-1">
                            {generativeArt.title || "BAUHAUS COMPOST"}
                          </div>
                        </div>
                      ) : (
                        <p className="text-stone-400 italic text-xs font-bold">No SVG canvas synthesized.</p>
                      )}
                    </div>

                    {/* SCHEMA ANALYSIS INFO */}
                    <div className="md:col-span-5 border-4 border-black p-6 bg-black text-green-400 font-mono text-xs overflow-y-auto max-h-[400px]">
                      <span className="text-[10px] font-black bg-bauhaus-red text-white px-2 py-0.5 uppercase block mb-3">Structured Vector Nodes</span>
                      {generativeArt ? (
                        <pre className="whitespace-pre-wrap">{JSON.stringify(generativeArt, null, 2)}</pre>
                      ) : (
                        <p className="opacity-50 italic">Execute synthesis to review parsed coordinate schemas.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeNode === 7 && (
              <motion.div
                key="node7"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border-8 border-black bg-white p-8 hard-shadow-lg space-y-6"
              >
                <div className="flex justify-between items-center border-b-4 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <FileCode className="text-bauhaus-blue" size={32} />
                    <div>
                      <span className="text-[10px] font-black uppercase bg-bauhaus-blue text-white px-2 py-0.5">NODE_07_PROTO</span>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Interactive Blueprint Sandbox</h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-600">
                  Translate description directives into high-fidelity web scripts on a sandboxed iframe. Recruiter-initiated interactives load in high-weight Bauhaus brutalist structures securely.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-1 sm:gap-2">
                    <input
                      type="text"
                      value={sandboxDirective}
                      onChange={(e) => setSandboxDirective(e.target.value)}
                      placeholder="e.g. Thuật toán sắp xếp nổi bọt trong Bauhaus..."
                      className="flex-grow p-4 border-4 border-black font-black uppercase text-xs focus:bg-stone-50 focus:outline-none"
                    />
                    <button
                      onClick={compileSandboxComponent}
                      disabled={isCompilingSandbox || !sandboxDirective.trim()}
                      className="bg-bauhaus-blue text-white px-6 sm:px-8 border-4 border-black font-black uppercase tracking-widest text-xs hover:bg-black hover:text-white transition-all flex items-center gap-2 shrink-0"
                    >
                      {isCompilingSandbox ? <RefreshCw className="animate-spin" /> : <Play size={16} />} Run Blueprint
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* IFRAME WORKSPACE PREVIEW */}
                    <div className="md:col-span-7 border-4 border-black p-4 bg-stone-100 flex flex-col h-[500px]">
                      <span className="text-[10px] font-black uppercase opacity-60 block mb-2">Sandbox Frame Output</span>
                      {isCompilingSandbox ? (
                        <div className="flex-grow flex flex-col items-center justify-center font-black uppercase text-xs animate-pulse">
                          <RefreshCw className="animate-spin text-bauhaus-blue mx-auto mb-2" />
                          Evaluating sandboxed compiler modules...
                        </div>
                      ) : sandboxResult ? (
                        <iframe
                          title="Bauhaus Interactive Sandbox"
                          srcDoc={sandboxResult.htmlCode}
                          className="flex-grow bg-white border-4 border-black w-full"
                          sandbox="allow-scripts"
                        />
                      ) : (
                        <div className="flex-grow flex items-center justify-center border-4 border-dashed border-black/30">
                          <p className="text-stone-400 italic text-xs font-bold">Launch blueprint compilation simulation.</p>
                        </div>
                      )}
                    </div>

                    {/* SOURCE CODE ANALYSIS */}
                    <div className="md:col-span-12 lg:col-span-5 border-4 border-black p-6 bg-black text-green-400 font-mono text-xs overflow-y-auto h-[500px] custom-scrollbar">
                      <span className="text-[10px] font-black bg-bauhaus-blue text-white px-2 py-0.5 uppercase block mb-3">Compiled Target Source</span>
                      {sandboxResult ? (
                        <div>
                          <p className="text-xs font-bold text-white mb-2 underline">Description: {sandboxResult.title}</p>
                          <p className="text-[11px] font-bold text-stone-400 mb-4">{sandboxResult.explanation}</p>
                          <pre className="whitespace-pre-wrap">{sandboxResult.htmlCode}</pre>
                        </div>
                      ) : (
                        <p className="opacity-50 italic">Execute compilers to see generated target files.</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeNode === 8 && (
              <motion.div
                key="node8"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="border-8 border-black bg-white p-8 hard-shadow-lg space-y-6"
              >
                <div className="flex justify-between items-center border-b-4 border-black pb-4">
                  <div className="flex items-center gap-3">
                    <Database className="text-bauhaus-yellow" size={32} />
                    <div>
                      <span className="text-[10px] font-black uppercase bg-bauhaus-yellow text-black px-2 py-0.5">NODE_08_PROTO</span>
                      <h2 className="text-3xl font-black uppercase tracking-tighter">Firebase Recruiter Sync Portal</h2>
                    </div>
                  </div>
                </div>

                <p className="text-sm font-bold text-stone-600">
                  Dynamic synchronizations store user-generated custom resume layout focuses mapping dynamically to Firestore documents under absolute authorization credentials.
                </p>

                {!authUser ? (
                  <div className="border-4 border-black p-8 bg-stone-50 text-center space-y-4">
                    <Lock className="mx-auto text-bauhaus-red" size={48} />
                    <h3 className="text-lg font-black uppercase">Authentication Pipeline Locked</h3>
                    <p className="text-xs font-bold text-stone-600 max-w-md mx-auto">
                      Please log in with standard Google Authentications to mount Firestore secure sessions and inspect resume telemetry synchronizations.
                    </p>
                    <button
                      onClick={loginWithGoogle}
                      className="px-6 py-3 bg-bauhaus-yellow text-black border-2 border-black font-black uppercase tracking-wider text-xs hover:bg-black hover:text-white transition-all flex items-center gap-2 mx-auto"
                    >
                      <LogIn size={16} /> Mount Google Channel
                    </button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* User profile header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-stone-100 p-4 border-4 border-black">
                      <div className="flex items-center gap-3">
                        {authUser.photoURL ? (
                          <img src={authUser.photoURL} alt="Avatar" className="w-10 h-10 border-2 border-black rounded-none" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-10 h-10 bg-bauhaus-blue text-white font-black flex items-center justify-center">R</div>
                        )}
                        <div>
                          <p className="text-[10px] font-black uppercase bg-green-500 text-white px-1.5 py-0.5 inline-block">SESSION ACTIVE</p>
                          <h4 className="font-extrabold text-sm">{authUser.displayName || authUser.email}</h4>
                        </div>
                      </div>
                      <button
                        onClick={logout}
                        className="py-1.5 px-3 bg-white hover:bg-bauhaus-red hover:text-white border-2 border-black text-xs font-black uppercase transition-all flex items-center gap-1"
                      >
                        <LogOut size={12} /> Unmount Session
                      </button>
                    </div>

                    {/* METRIC GRIDS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="border-4 border-black p-4 bg-white hard-shadow">
                        <span className="text-[9px] font-black uppercase opacity-60">Custom Resumes Tracked</span>
                        <h5 className="text-4xl font-black mt-1 text-bauhaus-red">{syncedCVs.length}</h5>
                        <p className="text-[10px] font-bold text-stone-600 mt-2">Historic generations log</p>
                      </div>

                      <div className="border-4 border-black p-4 bg-white hard-shadow">
                        <span className="text-[9px] font-black uppercase opacity-60">System Inquiries Synced</span>
                        <h5 className="text-4xl font-black mt-1 text-bauhaus-blue">{syncedQueries.length}</h5>
                        <p className="text-[10px] font-bold text-stone-600 mt-2">Search Grounding & Cache Telemetries</p>
                      </div>

                      <div className="border-4 border-black p-4 bg-bauhaus-yellow text-black hard-shadow col-span-1 sm:col-span-2 lg:col-span-1">
                        <span className="text-[9px] font-black uppercase opacity-60">Portal Security Tier</span>
                        <h5 className="text-2xl font-black mt-2 uppercase flex items-center gap-2">
                          <UserCheck size={20} /> AUTHORIZED
                        </h5>
                        <p className="text-[10px] font-black mt-2 tracking-widest uppercase opacity-80">Firestore Rules Intact</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Synced Resumes Column */}
                      <div className="border-4 border-black p-6 bg-stone-50">
                        <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                          <Server className="text-bauhaus-red" size={16} />
                          <h4 className="font-black uppercase text-sm">Resumes Activity Feed</h4>
                        </div>

                        {isLoadingDashboard ? (
                          <p className="text-xs font-bold text-stone-500 animate-pulse uppercase">Syncing Firestore lines...</p>
                        ) : syncedCVs.length > 0 ? (
                          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                            {syncedCVs.map((cv: any) => (
                              <div key={cv.id} className="border-2 border-black p-3 bg-white hover:bg-stone-50 flex flex-col justify-between">
                                <div>
                                  <div className="flex justify-between items-start gap-2">
                                    <h5 className="font-extrabold text-xs uppercase text-bauhaus-blue truncate max-w-[70%]">{cv.themeTitle}</h5>
                                    <span className="text-[9px] font-bold text-stone-600 shrink-0">
                                      {cv.timestamp?.toDate ? cv.timestamp.toDate().toLocaleDateString() : 'Realtime'}
                                    </span>
                                  </div>
                                  <p className="text-[10px] font-bold text-stone-600 mt-1 line-clamp-2">Focus: &quot;{cv.focus}&quot;</p>
                                  <p className="text-[11px] font-black italic mt-1 border-t border-dotted border-stone-300 pt-1 text-stone-800">
                                    &quot;{cv.philosophyStatement}&quot;
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-stone-600 italic">No CV telemetry records found.</p>
                        )}
                      </div>

                      {/* Synced Queries Column */}
                      <div className="border-4 border-black p-6 bg-stone-50">
                        <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
                          <Terminal className="text-bauhaus-blue" size={16} />
                          <h4 className="font-black uppercase text-sm">Inquiry Telemetry Log</h4>
                        </div>

                        {isLoadingDashboard ? (
                          <p className="text-xs font-bold text-stone-500 animate-pulse uppercase">Syncing Firestore lines...</p>
                        ) : syncedQueries.length > 0 ? (
                          <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                            {syncedQueries.map((q: any) => (
                              <div key={q.id} className="border-2 border-black p-3 bg-white hover:bg-stone-50">
                                <span className={`text-[8px] font-black px-1.5 py-0.5 uppercase ${
                                  q.type === 'SEARCH_GROUNDING' ? 'bg-bauhaus-red text-white' : 'bg-black text-white'
                                }`}>
                                  {q.type}
                                </span>
                                <p className="font-extrabold text-[11px] uppercase mt-2 text-stone-800 line-clamp-1">Q: &quot;{q.query}&quot;</p>
                                <p className="text-[10px] font-bold text-stone-600 line-clamp-2 mt-1 bg-stone-50 p-1.5 border border-stone-300">
                                  {q.response}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs font-bold text-stone-600 italic">No query telemetry records found.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NeuralLab;
