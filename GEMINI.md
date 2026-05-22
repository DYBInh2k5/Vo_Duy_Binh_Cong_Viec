# Gemini AI Implementation Guidelines

This project leverages Google Gemini for intelligent features. Follow these patterns when implementing AI capabilities.

## 🤖 Model Selection
- **Primary Model**: `gemini-1.5-flash` for fast, responsive UI interactions and text processing.
- **Secondary Model**: `gemini-1.5-pro` for deep code analysis or complex architectural reasoning.

## 🛠️ Implementation Patterns
- **SDK**: Use the `@google/genai` TypeScript SDK.
- **Initialization**: 
  ```ts
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  ```
- **Context Awareness**: Always provide the Bauhaus design guidelines from `AGENTS.md` to the model when generating UI components or content.

## 🎨 Creative Constraints
- AI-generated text should be concise, structural, and align with the "Neural Infrastructure" theme.
- Avoid flowery or generic marketing language.
- Use the term "Initialize", "Protocol", "Node", and "Infrastructure" where appropriate.
