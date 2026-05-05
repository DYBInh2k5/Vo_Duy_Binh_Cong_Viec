import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import nodemailer from "nodemailer";
import { fileURLToPath } from "url";

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

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
