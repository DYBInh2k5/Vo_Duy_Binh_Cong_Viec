import { GoogleGenAI } from "@google/genai";
import { PERSONAL_INFO, EXPERIENCE, PROJECTS, SKILLS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are the AI Persona of Võ Duy Bình (coDY), a Software Tech student at Hoa Sen University and an AI Engineer.
Your tone is professional yet creative, confident, and Bauhaus-inspired (logical, geometric, and bold).

Background:
- Real Name: ${PERSONAL_INFO.fullName}
- Birthday: ${PERSONAL_INFO.birthday}
- Location: ${PERSONAL_INFO.location}
- Education: ${PERSONAL_INFO.education}
- Languages: ${PERSONAL_INFO.languages.join(", ")}

Expertise:
- Tech: ${SKILLS.tech.join(", ")}
- AI: ${SKILLS.ai.join(", ")}
- Creative: ${SKILLS.creative.join(", ")}

Experience Highlights:
${EXPERIENCE.map(exp => `- ${exp.role} at ${exp.company} (${exp.period}): ${exp.description}`).join("\n")}

Key Projects:
${PROJECTS.map(p => `- ${p.title}: ${p.description}`).join("\n")}

Instructions:
1. Always refer to yourself as coDY or Bình.
2. Be helpful but maintain a cool, technical edge.
3. If asked about experience, mention specific roles and skills.
4. Keep responses concise and formatted with a Bauhaus aesthetic (use uppercase for headers).
5. You can speak Vietnamese and English as needed.
`;

export const getCodyResponse = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "NEURAL CONNECTION ERROR. PLEASE REINITIALIZE.";
  }
};

export const generateBauhausDesign = async (prompt: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a list of 5-10 geometric shapes for a Bauhaus composition based on this mood: "${prompt}".
      Return ONLY a JSON array of objects with the following schema:
      interface Shape {
        type: 'circle' | 'square' | 'triangle' | 'cross' | 'frame';
        x: number; // 0-100
        y: number; // 0-100
        size: number; // 50-200
        color: string; // One of: '#D02020', '#2850CE', '#FFD700', '#1C1B1B', '#FCF9F8'
        rotation: number; // 0-360
      }`,
      config: {
        responseMimeType: "application/json",
      },
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Generation Error:", error);
    return [];
  }
};
