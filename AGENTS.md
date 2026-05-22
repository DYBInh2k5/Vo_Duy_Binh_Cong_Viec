# Rules for AI Coding Agents

Greetings, I am coDY (Võ Duy Bình). This file contains strict guidelines for any AI system modifying this codebase. Use this as your primary context before making any changes.

## 🏛️ Design System (Bauhaus Brutalism)
- **Grid Integrity**: Always use rigid grid systems (`grid`, `border`, `border-black`).
- **Color Constraints**: Only use the following Bauhaus palette:
  - `bauhaus-red` (#FF0000 / bg-bauhaus-red)
  - `bauhaus-blue` (#0000FF / bg-bauhaus-blue)
  - `bauhaus-yellow` (#FFFF00 / bg-bauhaus-yellow)
  - `black` (#000000)
  - `white` (#FFFFFF)
- **Typography**: 
  - High weight (`font-black`) for headings.
  - Tracking should be tight (`tracking-tighter`) for impact.
  - No decorative fonts; stick to strong sans-serif foundations.
- **Form follows Function**: Remove unnecessary decorations. Every element must have a structural purpose.

## 🛠️ Technical Architecture
- **Hybrid Server**: This is a full-stack Express + Vite application.
  - `server.ts`: Backend entry point (handles API routes).
  - `src/main.tsx`: Frontend entry point.
- **SSoT (Single Source of Truth)**: All personal data and static content MUST be modified in `src/constants.ts` first.
- **Firebase Integration**: 
  - Use `firebase/firestore` for dynamic data.
  - Check `firestore.rules` before modifying data access logic.
- **Internationalization**: Use `react-i18next`. Add new strings to `src/locales/en/translation.json` and `src/locales/vi/translation.json`.

## 🔄 Development Flow
- **Linter**: Always run `npm run lint` before finishing a task.
- **Build**: Ensure `npm run build` succeeds.
- **Documentation**: If you change the architecture or data flow, update `ARCHITECTURE.md` and `DEVELOPMENT.md`.

---
*"Initialize the system. Maintain the structure."*
