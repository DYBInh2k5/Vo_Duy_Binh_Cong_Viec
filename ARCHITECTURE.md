# Project Architecture - coDY Portfolio

This document outlines the technical architecture and organization of the coDY Portfolio application.

## Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Modern Bauhaus Aesthetic)
- **Animations:** Framer Motion (`motion/react`)
- **Icons:** Lucide React
- **Typeface:** Inter, Space Grotesk

## Project Structure

```text
/
├── public/                 # Static assets (images, favicon)
│   └── profile_cody.jpg    # Main profile picture
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx      # Global navigation
│   │   └── Footer.tsx      # Dynamic footer with social links
│   ├── pages/              # Main route views
│   │   ├── Home.tsx        # Bauhaus-style landing page
│   │   ├── Projects.tsx    # Gallery of works
│   │   ├── About.tsx       # Biography and portrait
│   │   ├── Experience.tsx  # Timeline-based resume
│   │   ├── Capabilities.tsx # Skill visualization
│   │   ├── Playground.tsx  # Experiments and side projects
│   │   └── Contact.tsx     # Outreach and location info
│   ├── constants.ts        # CENTRAL DATA STORE (SSoT)
│   ├── App.tsx             # Main routing and layout
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles and Tailwind imports
├── metadata.json           # App metadata and permissions
└── package.json            # Dependencies and scripts
```

## Architectural Design Patterns

### 1. Single Source of Truth (SSoT)
All content (Projects, Experience, Skills, Personal Info) is centralized in `/src/constants.ts`. This allows for easy maintenance and potential future migration to a CMS or dynamic database.

### 2. Bauhaus Aesthetic System
- **Grid-Based Layouts:** Strong use of borders and geometric alignment.
- **Strict Color Palette:** `bauhaus-red`, `bauhaus-yellow`, `bauhaus-blue`, and `bauhaus-black`.
- **High Contrast:** Heavy use of black borders and shadows (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`).

### 3. Motion System
Using Framer Motion for:
- Page transitions (fade-in, slide-up).
- Hover effects on cards and buttons.
- Staggered entrances for list items.

## Data Flow
1. Data is defined in `constants.ts`.
2. Pages import specific constants (e.g., `PROJECTS`, `EXPERIENCE`).
3. Components receive data via props or direct imports to render UI.
