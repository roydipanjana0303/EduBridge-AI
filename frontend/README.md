# EduBridge AI — Frontend (Member 1)

This directory contains the complete frontend codebase for **EduBridge AI**, developed by **Member 1 – Frontend Developer** (React · TypeScript · Tailwind CSS).

---

## 🚀 Key Features Implemented

### 1. Public Marketing Landing Page (`LandingPage.tsx`)
- High-conversion responsive hero section with live stats badge, problem-solving value propositions, 13 core features grid, and 3-step onboarding workflow.
- Interactive background network particle canvas (`ParticleCanvas.tsx`).

### 2. Role-Based Authentication (`AuthModal.tsx`)
- Seamless toggle between **Student** and **Mentor / Teacher** roles.
- Pre-filled one-click demo presets (Aarav for Student, Meera Ma'am for Mentor).

### 3. Student Learning Cockpit (`HomeView.tsx`)
- Real-time study streak (🔥), credit points wallet, and notes counter.
- Dynamic subject mastery progress bars (Physics, Mathematics, Chemistry, Computer Science).
- Interactive daily study checklist with gamified credit bonuses.

### 4. Teacher & Mentor Control Portal (`TeacherDashboardView.tsx`)
- Overview of enrolled student batches and cohort diagnostic quiz scores.
- Priority queue for pending student doubts with inline response editor.
- Rapid note publishing form and diagnostic assessment authoring tool.

### 5. Smart Notes Library (`NotesView.tsx`)
- Multi-subject filtering (Physics, Maths, Chemistry, Biology, CS) and search.
- Document upload with point rewards (+10 credits).
- Modal note reader and offline toggle switch.

### 6. Student–Mentor 1-on-1 Chat (`ChatView.tsx`)
- Active mentor directory (Meera Ma’am, Rohan Sir, Divya Di) with status indicators.
- Instant simulated mentor guidance response engine and diagram/file attachment support.

### 7. Voice Study Rooms (`VoiceView.tsx`)
- Drop-in audio rooms (Physics Doubt Den, Maths Silent Grind, CS Late-Night Debug).
- Live pulsing indicators, participant avatars, mic mute/unmute, and join/leave controls.

### 8. Collaborative Study Squads (`GroupsView.tsx`)
- Exam-focused study cohorts (Boards, JEE/NEET, Coding).
- Member counters, join/leave state, and squad creation.

### 9. Doubt Q&A Forum (`QAView.tsx`)
- Post concept questions (+5 credits) and answer peer questions (+10 credits).
- Upvoting counter and verified mentor answer badges.

### 10. AI Academic Assistant (`AIView.tsx`)
- Conversational tutor grounded in syllabus and uploaded study materials.
- Quick action chips: "Explain Photosynthesis", "Quiz me on Newton’s Laws", "Plan my study week".

### 11. Study Gap Recovery (`GapRecoveryView.tsx` - Key Differentiator)
- Interactive absence slider (1 to 24 months break).
- Generates a customized 3-phase comeback plan formulated directly from the learner's own past notes (Warm-Up, Rebuild Basics, Active Re-integration) with +20 credit reward.

### 12. Curated Career Roadmaps (`CareerRoadmapView.tsx`)
- 5-stage milestone architecture across **Tech**, **Medicine**, **Design**, and **Business**.

### 13. Diagnostic Assessments & Quizzes (`QuizView.tsx`)
- Timed multiple choice questions with immediate feedback, detailed rationales, and credit rewards.

### 14. Offline Learning & PWA Readiness (`OfflineView.tsx` & `storage.ts`)
- Toggleable offline simulator with application banner.
- Filters and serves locally cached notes stored in `localStorage` / `IndexedDB`.

### 15. Credit Rewards Store (`RewardsView.tsx`)
- Gamified rewards catalog (1-on-1 mentor sessions, revision formula packs, sticker kits, quiz champ badges).

---

## 🛠️ Project Structure

```text
frontend/
├── index.html                   # Vite entry HTML
├── preview.html                 # Standalone, zero-setup runnable HTML
├── package.json                 # React 18, Vite, TypeScript, Tailwind CSS
├── tsconfig.json                # Strict TypeScript configuration
├── tailwind.config.js           # Theme styling with neo-brutalist palette
├── postcss.config.js
├── .env.example
└── src/
    ├── main.tsx                 # App mount point
    ├── App.tsx                  # State coordinator, routing & views
    ├── router.tsx               # Navigation route definitions
    ├── types/                   # TypeScript interfaces (Note, Mentor, User, QA)
    ├── data/                    # Initial mock database
    ├── styles/                  # Tailwind & global CSS variables
    ├── components/
    │   ├── Header.tsx           # Global search, theme toggle, wallet, avatar
    │   ├── Sidebar.tsx          # Responsive navigation drawer & tabs
    │   ├── ParticleCanvas.tsx   # Interactive background animation
    │   ├── Icons.tsx            # SVG icon primitives & Logo
    │   └── Toast.tsx            # Floating feedback alert system
    ├── pages/                   # All 14 screen views
    └── services/
        ├── api.ts               # Backend (Member 2) & AI (Member 4) API client
        └── storage.ts           # Offline local persistence layer
```

---

## 💻 Running the Code

### Option A: Instant Standalone Preview (No npm install required!)
Double-click `index.html` at the root of the project or `frontend/preview.html` in any web browser, or run:
```bash
open index.html
```

### Option B: Modern Vite Development Server
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.
