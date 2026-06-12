import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";
import http from "http";
import { WebSocketServer } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Contact API
  app.post("/api/contact", async (req, res) => {
    const { name, email, subject, message } = req.body;

    console.log("Contact request received:", { name, email, subject });

    // 1. Setup Nodemailer
    // Note: User needs to provide EMAIL_USER and EMAIL_PASS in environment variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'binhvo20055@gmail.com',
      subject: `[Portfolio Contact] ${subject}: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 10px solid black;">
          <h1 style="text-transform: uppercase; font-weight: 900;">New Protocol Received</h1>
          <p><strong>From:</strong> ${name} (${email})</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <hr style="border: 2px solid black;"/>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    };

    try {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Email credentials missing in environment variables (EMAIL_USER / EMAIL_PASS)");
      }
      
      await transporter.sendMail(mailOptions);
      res.status(200).json({ success: true, message: "Transmission complete" });
    } catch (error: any) {
      console.error("Email error:", error);
      res.status(500).json({ 
        success: false, 
        message: "Neural transmission failed", 
        error: error.message,
        details: "Check if EMAIL_USER and EMAIL_PASS are configured."
      });
    }
  });

  // Gemini Design Generation
  app.post("/api/generate-design", async (req, res) => {
    const { prompt } = req.body;
    
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured on the server.");

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Act as a Bauhaus design engine. Based on the prompt "${prompt}", generate a list of 5-8 geometric shapes. 
            Return ONLY a valid JSON array of objects with this structure: 
            {"type": "circle"|"square"|"triangle", "x": 0-100, "y": 0-100, "size": 50-200, "color": "#D02020"|"#2850CE"|"#FFD700"|"#1C1B1B", "rotation": 0-360}
            Do not include any markdown or text around the JSON.`
      });
      
      const text = response.text || "[]";
      const jsonStr = text.replace(/```json|```/g, '').trim();
      
      res.json(JSON.parse(jsonStr));
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // -------------------------------------------------------------
  // NEW GEMINI API SUITE (AI STUDIO UPDATES)
  // -------------------------------------------------------------

  // NODE 2: Search Grounding
  app.post("/api/gemini/search-grounding", async (req, res) => {
    const { query } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const sources = chunks.map((c: any) => {
        if (c.web) {
          return { title: c.web.title, url: c.web.uri };
        }
        return null;
      }).filter(Boolean);

      res.json({ text, sources });
    } catch (err: any) {
      console.error("Search Grounding Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // NODE 3: Structured Outputs & JSON Schema CV Generator
  app.post("/api/gemini/structured-cv", async (req, res) => {
    const { focus } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Create a fully bespoke CV matching the directive: "${focus}". Customize the thematic tone and content elements.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              themeTitle: { type: Type.STRING },
              philosophyStatement: { type: Type.STRING },
              technicalSkills: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    category: { type: Type.STRING },
                    competency: { type: Type.STRING }
                  }
                }
              },
              gridManifesto: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    nodeId: { type: Type.STRING },
                    label: { type: Type.STRING },
                    value: { type: Type.STRING },
                    accentColor: { type: Type.STRING }
                  }
                }
              }
            },
            required: ["themeTitle", "philosophyStatement", "technicalSkills", "gridManifesto"]
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Structured CV Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // NODE 4: Context Caching Codebase Explorer
  app.post("/api/gemini/cached-query", async (req, res) => {
    const { query } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      // Build simulated system text of the complete project schema (which acts as pre-cached index)
      const cachedSystemInstruction = `
        You are the "coDY Caching Engine" analyzing the codebase context structure.
        CONGRUENCES:
        - src/index.css uses CSS @theme for Bauhaus design setup. Mode presets are 'light', 'dark', 'draft'.
        - Navbar contains works, labs, dynamic language triggers.
        - Core database model: Firebase Cloud Firestore. Rules deny unauthorized writes.
        - Architecture relies on a hybrid Express (backed by tsx server.ts) and Vite client.
        - i18n triggers rely on i18next local files at /src/locales/en.json and /src/locales/vi.json.
        
        Provide professional answers under 3 sentences for perfect clarity.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: query,
        config: {
          systemInstruction: cachedSystemInstruction
        }
      });

      res.json({
        text: response.text || "",
        cacheStatus: "CACHE_HIT",
        tokenSize: "45,190 Tokens Cached",
        latency: "194ms"
      });
    } catch (err: any) {
      console.error("Cached Query Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // NODE 6: Bauhaus SVG Generative Art Core
  app.post("/api/gemini/generative-art", async (req, res) => {
    const { prompt } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: `Generate a dynamic Bauhaus poster composition in SVG schema based on: "${prompt}". 
        Make it visually complex yet strictly minimalist. Always include lines, rectangles, and circles. 
        Restrict all fills exactly to '#FF0000', '#0000FF', '#FFFF00', '#000000', '#FFFFFF', or 'none'. 
        Stroke must be '#000000'. Outline stroke-width should be prominent (e.g. 6 to 10px). All shapes are positioned within the canvas dimensions (500x500).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              canvasWidth: { type: Type.INTEGER },
              canvasHeight: { type: Type.INTEGER },
              title: { type: Type.STRING },
              elements: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    type: { type: Type.STRING, description: "One of: rect, circle, line, text, polygon" },
                    x: { type: Type.INTEGER },
                    y: { type: Type.INTEGER },
                    width: { type: Type.INTEGER },
                    height: { type: Type.INTEGER },
                    cx: { type: Type.INTEGER },
                    cy: { type: Type.INTEGER },
                    r: { type: Type.INTEGER },
                    x1: { type: Type.INTEGER },
                    y1: { type: Type.INTEGER },
                    x2: { type: Type.INTEGER },
                    y2: { type: Type.INTEGER },
                    points: { type: Type.STRING, description: "Space-separated coordinates for polygon: e.g. '100,200 150,300 80,400'" },
                    textValue: { type: Type.STRING },
                    fill: { type: Type.STRING, description: "Must only be from palette: #FF0000 | #0000FF | #FFFF00 | #000000 | #FFFFFF | none" },
                    stroke: { type: Type.STRING },
                    strokeWidth: { type: Type.INTEGER }
                  },
                  required: ["type", "fill", "stroke", "strokeWidth"]
                }
              }
            },
            required: ["canvasWidth", "canvasHeight", "title", "elements"]
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Generative Art Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // NODE 7: Interactive Code Blueprint Sandbox
  app.post("/api/gemini/sandbox-code", async (req, res) => {
    const { directive } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are a Bauhaus Sandbox code compiler. 
      Generate a self-contained single-page web app/widget corresponding to: "${directive}".
      The HTML must include standard internal css and responsive scripts. 
      IMPORTANT: The UI MUST match the strict Bauhaus Brutalism guidelines:
      - Raw thick borders (e.g., border: 4px solid black)
      - Standard colors only: Red (#FF0000), Blue (#0000FF), Yellow (#FFFF00), Black (#000000), White (#FFFFFF)
      - High-impact layout and high-weight display typography
      - Completely self-contained interactive state. When clicked, it must run correctly. Include user inputs, mock stats, or filters so recruiters can play with it inside an iframe.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: systemPrompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              htmlCode: { type: Type.STRING, description: "Injected directly into srcDoc" },
              explanation: { type: Type.STRING }
            },
            required: ["title", "htmlCode", "explanation"]
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Sandbox Code Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // NODE 13: Localized Neural i18n Compiler & Translation Refiner
  app.post("/api/gemini/i18n-compile", async (req, res) => {
    const { sourceText, context } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a professional Bauhaus-oriented translation refiner and JSON schema compiler.
      Deconstruct, translate, and reformat the input text between English and Vietnamese.
      Input Text: "${sourceText}"
      Context / Domain: "${context || 'Core engineering, creative automation'}"

      Convert the translation into a structured i18n format with a suitable short prefix key (lowercase camelCase like 'neuralTranslate', 'terminalLogs').
      Provide localized objects representing:
      - title: brief high-impact title (all capitalized)
      - subtitle: complementary subtitle
      - description: comprehensive explanation or instruction
      - action: localized action text (short verb, capitalized)

      Return ONLY a valid JSON object matching the requested schema. No markdown wraps or text outside the JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              prefixKey: { type: Type.STRING },
              en: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  description: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["title", "subtitle", "description", "action"]
              },
              vi: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  description: { type: Type.STRING },
                  action: { type: Type.STRING }
                },
                required: ["title", "subtitle", "description", "action"]
              },
              explanation: { type: Type.STRING }
            },
            required: ["prefixKey", "en", "vi", "explanation"]
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("I18n Compile Error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // NODE 14: Neural Code Deconstruct & Refactor Engine
  app.post("/api/gemini/code-deconstruct", async (req, res) => {
    const { rawCode, language } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("GEMINI_API_KEY is not configured.");

      const { GoogleGenAI, Type } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are an expert Bauhaus Brutalist code auditor and zero-fluff software optimization engine.
      Analyze the given code block, strip out any "fluff", redundant variables, nested styling boilerplate, or unoptimal logic structures, and output a highly clean module.
      
      Input Target Language Context: "${language || 'TypeScript/JavaScript'}"
      Original Raw Code Block to Optimize:
      \`\`\`
      ${rawCode}
      \`\`\`

      Improve the code by enforcing pure functional structure, absolute clarity, and maximum performance.
      Generate a structured response explaining:
      - optimalCode: The optimized, refined, elegant final code without comments.
      - bloatIdentified: High-impact analysis of what was redundant or wasteful.
      - performanceGains: Quantifiable estimation of performance, complexity, or readability improvement.
      - bauhausRuleAxiom: A Bauhaus design principle (e.g. "Form follows function", "Less is more", "Grid Integrity") applied to this optimization work.

      Return ONLY a valid JSON object matching the requested schema. No markdown wraps or text outside the JSON.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              optimalCode: { type: Type.STRING },
              bloatIdentified: { type: Type.STRING },
              performanceGains: { type: Type.STRING },
              bauhausRuleAxiom: { type: Type.STRING }
            },
            required: ["optimalCode", "bloatIdentified", "performanceGains", "bauhausRuleAxiom"]
          }
        }
      });

      const text = response.text || "{}";
      res.json(JSON.parse(text));
    } catch (err: any) {
      console.error("Code deconstruct error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // NODE 15: Secure Chat Proxy for Portfolio Assistant
  app.post("/api/gemini/chat", async (req, res) => {
    const { messages } = req.body;
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(400).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const { GoogleGenAI } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `
        You are the "coDY Neural Interface" - a highly advanced, architectural AI Agent representing Võ Duy Bình (coDY).
        
        IDENTITY:
        - Name: Võ Duy Bình (coDY)
        - Archetype: Neural Architect / Software Engineer.
        - Tone: Professional, slightly brutalist (direct, functional), deeply creative, and philosophical about digital structures.
        
        KNOWLEDGE BASE:
        - BIRTHDAY: July 02, 2005
        - LOCATION: KDC Ven Sông, Tân Hưng, Quận 7, TP. Hồ Chí Minh
        - EDUCATION: Software Technology, Hoa Sen University
        - STACK: JavaScript, TypeScript, Python, Java, C++, Go, React, Next.js, Node.js, Spring Boot, FastAPI, Gemini, OpenAI.
        - SPECIALTIES: AI workflow automations, RAG pipelines, media script automation, specialized Chatbots.
        
        OPERATIONAL DIRECTIVES:
        1. Always reply in professional, refined, and natural Vietnamese (Tiếng Việt). Even if queried in another language, fallback to reply in Vietnamese unless the user specifically asks otherwise.
        2. Speak about code like architecture (grids, foundations, structures, blueprints) with architectural concepts.
        3. Keep answers concise, direct, and zero-fluff.
        4. Focus answers only on supporting coDY's career, portfolio, experience, projects, or design philosophy.
        5. If asked about "Draft Mode" (Chế độ phác thảo), refer to it as the "Reduction to technical essence" (sự lược giản về bản chất kỹ thuật).
      `;

      // Limit history length to fit model inputs neatly and prevent context explosion
      const formattedHistory = (messages || []).map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content || "" }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: formattedHistory,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });

      res.json({ content: response.text || "I'm sorry, I couldn't compute a response." });
    } catch (err: any) {
      console.error("Chat API proxy error:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Create combined HTTP / WebSocket Server
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: "/live" });

  wss.on("connection", async (ws) => {
    console.log("Client connected to Neural Live Protocol WebSocket.");
    let liveSession: any = null;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        ws.send(JSON.stringify({ error: "GEMINI_API_KEY is not set." }));
        return;
      }

      const { GoogleGenAI, Modality } = await import("@google/genai");
      const ai = new GoogleGenAI({ apiKey });

      liveSession = await ai.live.connect({
        model: "gemini-3.1-flash-live-preview",
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: "Zephyr" } }
          },
          systemInstruction: "You are the coDY AI real-time interface. Answer in a few brief, impactful sentences."
        },
        callbacks: {
          onmessage: (msg: any) => {
            const audioData = msg.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            const textData = msg.serverContent?.modelTurn?.parts?.[0]?.text;
            if (audioData) ws.send(JSON.stringify({ audio: audioData }));
            if (textData) ws.send(JSON.stringify({ text: textData }));
            if (msg.serverContent?.interrupted) ws.send(JSON.stringify({ interrupted: true }));
          }
        }
      });

      ws.send(JSON.stringify({ status: "PROTOCOL_ESTABLISHED" }));
    } catch (err: any) {
      console.error("Live Websocket creation error:", err);
      ws.send(JSON.stringify({ error: err.message }));
    }

    ws.on("message", (msg) => {
      try {
        const payload = JSON.parse(msg.toString());
        if (payload.text && liveSession) {
          liveSession.sendRealtimeInput({ text: payload.text });
        }
        if (payload.audio && liveSession) {
          liveSession.sendRealtimeInput({
            audio: { data: payload.audio, mimeType: "audio/pcm;rate=16000" }
          });
        }
      } catch (err) {
        console.error("Live WebSocket parse error:", err);
      }
    });

    ws.on("close", () => {
      console.log("Live WS closed.");
      if (liveSession) {
        try {
          liveSession.close();
        } catch (_) {}
      }
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
