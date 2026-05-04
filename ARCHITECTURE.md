# Project Architecture - coDY Portfolio

This document outlines the technical architecture and organization of the coDY Portfolio application.

## Tech Stack

- **Framework:** React 18+
- **Build Tool:** Vite
- **Server:** Express (Node.js) via `tsx`
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Modern Bauhaus Aesthetic)
- **Animations:** Framer Motion (`motion/react`)
- **Backend Services:** Firebase (FireStore, Auth, Storage, Remote Config, Cloud Functions, Messaging)
- **Email:** Nodemailer (SMTP/Gmail)

## Project Structure

```text
/
├── firebase/               # Firebase Cloud Functions and setup
├── public/                 # Static assets and Service Workers
│   └── profile_cody.jpg    # Main profile picture
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.tsx      # Global navigation
│   │   ├── Footer.tsx      # Dynamic footer with social links
│   │   └── PushNotificationManager.tsx # Firebase Messaging UI
│   ├── pages/              # Main route views
│   │   ├── Home.tsx        # Bauhaus-style landing page
│   │   └── ...             # Other modular pages
│   ├── hooks/              # Custom React Hooks (Remote Config, etc.)
│   ├── lib/                # Shared libraries (Firebase init)
│   ├── constants.ts        # CENTRAL DATA STORE (SSoT)
│   ├── App.tsx             # Main routing, layout, and Global Maintenance mode
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles and Tailwind imports
├── server.ts               # Express Backend (API routes + Vite Middleware)
├── firestore.rules         # Security Rules for Firestore
├── metadata.json           # App metadata and permissions
└── package.json            # Dependencies and scripts (Full-stack)
```

## Architectural Design Patterns

### 1. Hybrid Full-Stack (Express + Vite)
The application uses an Express server to handle backend logic (like sending secure emails via Nodemailer) while serving the React frontend using Vite middleware in development or static serving in production.

### 2. Firebase Integration (The Brain)
- **Firestore:** Structured data storage for contacts and blog posts.
- **Auth:** Google Identity for administrative access.
- **Remote Config:** Dynamic control over UI (e.g., Maintenance Mode, Theme Accents).
- **Messaging (FCM):** Push notifications for real-time engagement.
- **App Check:** reCAPTCHA v3 protection for backend resources.
- **Cloud Functions:** Serverless logic for image processing and automated responses.

### 3. Bauhaus Aesthetic System
- **Grid-Based Layouts:** Strong use of borders and geometric alignment.
- **Strict Color Palette:** `bauhaus-red`, `bauhaus-yellow`, `bauhaus-blue`, and `bauhaus-black`.
- **High Contrast:** Heavy use of black borders and shadows.

### 4. Motion System
Using Framer Motion for page transitions and micro-interactions.

## Data Flow
1. **Static Content:** Defined in `constants.ts` for speed and SEO.
2. **Dynamic Content:** Fetched from Firestore via Firebase SDK.
3. **Backend Logic:** Frontend calls `/api/*` endpoints on the Express server.
4. **Real-time:** FCM push notifications and Firestore `onSnapshot` listeners.
