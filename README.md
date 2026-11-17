# EduBridge AI
> **Learn continuously. Recover confidently. Grow with AI.**

EduBridge AI is an AI-powered digital learning platform that brings students, teachers, study notes, and personalized academic support together in one unified place.

---

## 👥 Team Structure & Ownership

| Member | Primary Ownership | Tech Stack | Deliverables |
|---|---|---|---|
| **Member 1** | **Frontend Developer** | **React, TypeScript, Tailwind CSS** | **Landing page, student dashboard, teacher portal, reusable components** |
| Member 2 | Authentication & Backend | Java, Spring Boot, Spring Security, JWT | Registration, login, roles, profile APIs |
| Member 3 | Learning Management & Database | Spring Boot, JPA, PostgreSQL, Supabase Storage | Courses, notes, quizzes, results, progress, rewards |
| Member 4 | AI Developer | Python, FastAPI, LLM, RAG | Chatbot, notes Q&A, career roadmap, recovery plan |
| Member 5 | PWA, Integration & Testing | React, IndexedDB, Service Workers, Postman | Offline notes, downloaded quiz support, integration tests |

---

## 🖥️ Frontend Overview (Member 1)

The complete frontend implementation is located in [`frontend/`](file:///Users/komal/Desktop/EduBridge-AI/frontend):
- **Landing Page**: Modern marketing site with problem breakdowns, interactive preview, 13 core features, and particle background.
- **Role Switcher**: Dual login for Students and Mentors / Teachers.
- **Student Dashboard**: Streaks, wallet credits, subject mastery progress bars, daily task checklist.
- **Teacher Portal**: Review pending doubts, publish class notes, create diagnostic quizzes.
- **Smart Notes Library**: Subject categorization, document reader modal, offline download toggle.
- **1-on-1 Mentor Chat**: Real-time simulated mentor replies and diagram sharing.
- **Voice Study Rooms**: Drop-in audio spaces with live indicators, mute toggle, and participant avatars.
- **Doubt Q&A Forum**: Post doubts (+5 credits), answer peer questions (+10 credits), upvoting.
- **AI Academic Assistant**: 24/7 syllabus tutor with quick prompt chips.
- **Study Gap Recovery**: Interactive duration slider (1–24 months) generating a 3-phase comeback plan from the student's own notes (+20 credits).
- **Career Roadmaps**: Visual milestones across Tech, Medicine, Design, and Business.
- **Diagnostic Assessments**: Timed interactive quizzes with immediate feedback and scoring.
- **Offline Mode**: Toggleable offline mode simulating PWA local caching.
- **Credit Rewards**: Redeemable perks catalogue (mentor calls, formula packs, sticker kits).

---

## ⚡ Quick Start

### 1. Instant Preview (Zero Dependencies)
Double-click or run:
```bash
open index.html
```

### 2. Vite Development Server
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000`.
