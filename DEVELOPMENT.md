# Development Roadmap & Changelog

This document tracks the evolution of the coDY Portfolio project from its initial generation to its current state.

## 2026-05-04: Version 2.0.0 (Full-Stack & Firebase)
### Major Transitions
- **Full-Stack Architecture:** Migrated from SPA to a hybrid Express + Vite server. This enables secure backend operations like SMTP email handling via Nodemailer.
- **Backend Sync:** Integrated `server.ts` to handle `/api/contact` requests, ensuring reliable email transmission to `binhvo20055@gmail.com`.
- **Firebase God-Mode:** 
    - **App Check:** Implemented reCAPTCHA v3 protection to secure the Firebase SDK.
    - **Remote Config:** Added a global maintenance mode and dynamic theme control.
    - **Messaging:** Set up FCM for push notifications (Background + Foreground support).
    - **Cloud Functions:** Drafted serverless triggers for contact processing and image optimization.
- **Security:** Hardened `firestore.rules` to prevent unauthorized access while allowing public contact form submissions.

## 2026-05-03: Version 1.3.0
### Updates
- **Deployment Prep:** Added `vercel.json` to handle SPA routing (rewrites to `index.html`).
- **Documentation:** Initial documentation suite (Architecture, Database, Roadmap).

## 2026-05-03: Version 1.1.0
### Updates
- **Project Expansion:** Added three new specialized projects:
    - AI Video Generation Studio
    - Neural Network Monitor
    - Cyber-Physical Security Interface.
- **Assets:** Successfully integrated the user-provided profile picture (`/profile_cody.jpg`) and moved it to the standard `public/` directory for production serving.
- **Identity:** Updated `PERSONAL_INFO` constant with correct LinkedIn links and Vietnamese social media handles.

## 2026-05-03: Version 1.0.0
### Initial Release
- **Core Architecture:** Implemented React + Vite + Tailwind foundation.
- **Design:** Established the Bauhaus Aesthetic (Red/Blue/Yellow/Black).
- **Navigation:** Multi-page layout (Home, About, Projects, Experience, Capabilities, Playground, Contact).
- **Animations:** Integrated Framer Motion for smooth Bauhaus box entrances.

## Future Plans
- [ ] Integration with a Headless CMS (Contentful/Sanity).
- [ ] Multilingual support (Vietnamese/English toggle).
- [ ] Dark mode toggle (Bauhaus Dark variant).
