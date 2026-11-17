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

### Frontend only
```bash
cd frontend
npm install
npm run dev
```
Visit `http://localhost:3000`.

### Backend + PostgreSQL + Redis + public community chat
1. Copy `deployment/.env.example` to `deployment/.env` and replace every placeholder secret/password.
2. From `deployment/`, run `docker compose up --build`.
3. In `frontend/`, copy `.env.example` to `.env.local`, then run `npm install && npm run dev`.
4. Register a student account from the login screen. Sign in on a second browser/device to verify shared, database-backed community messages.

The community chat uses the Spring Boot API and PostgreSQL; the WebSocket endpoint is `/ws` and requires a JWT in the STOMP CONNECT `Authorization` header. The UI also polls as a fallback. See [`docs/COMMUNITY_CHAT.md`](docs/COMMUNITY_CHAT.md) for API details and the production-readiness checklist.

**Production warning:** This is an integration foundation, not a security-certified public launch or a load-tested 5,000-concurrent-user deployment. Email verification, account recovery, membership/DMs, moderation, distributed WebSocket fan-out, LiveKit browser media client, object storage, rate limiting and infrastructure load testing remain required. Do not expose the development Compose defaults to the public internet.


## Live voice/video and screen sharing

The community voice-channel action now opens a LiveKit-powered room UI. Configure `LIVEKIT_URL`, `LIVEKIT_API_KEY`, and `LIVEKIT_API_SECRET` in the backend environment before joining. The API secret must remain server-side. Install frontend dependencies with `npm install`; then run `npm run build`. Browser microphone/camera permissions and HTTPS (except localhost) are required. Screen sharing availability depends on browser support and user permission.

## Frontend demo login (no backend required)

The frontend includes a local-only student demo account so you can explore the existing UI without starting Spring Boot or PostgreSQL:

- Email: `student@edubridge.ai`
- Password: `Student@123`
- Select **Student** on the sign-in screen.

This demo session is stored in the browser's local storage and survives refreshes. Sign out to clear it. Demo mode is only for UI evaluation: it does not create a server account, synchronize data across devices, or enable backend-dependent features such as real-time community messaging and voice/video. Real accounts still use the Spring Boot authentication API.


### Local demo accounts (no backend)

For UI testing only, select the matching account type on the sign-in screen:

- Student: `student@edubridge.ai` / `Student@123`
- Mentor: `mentor@edubridge.ai` / `Mentor@123`

Use separate browser profiles (or one browser and an incognito window) to sign in as both users at the same time. Demo sessions are stored locally in each browser. These demo accounts do not provide server-side messaging or real voice/video calling; real calls require the Spring Boot token endpoint and configured LiveKit service.
