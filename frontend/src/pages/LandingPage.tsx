import React from 'react';
import { Logo, AppIcon } from '../components/Icons';
import { UserRole } from '../types';

interface LandingPageProps {
  onOpenLogin: (role?: UserRole) => void;
}

const FEATURE_LIST = [
  { icon: 'groups', title: 'Dual Login System', desc: 'Distinct, customized workflows and tools for students and mentors.' },
  { icon: 'notes', title: 'Smart Notes Library', desc: 'Upload, categorize, search and keep your study materials accessible for years.' },
  { icon: 'chat', title: 'Student–Mentor Chat', desc: 'Direct, focused 1-on-1 academic guidance with instant responses and file sharing.' },
  { icon: 'voice', title: 'Voice Study Rooms', desc: 'Drop-in audio channels for focused group study, late-night debugs and quiet grinds.' },
  { icon: 'groups', title: 'Collaborative Squads', desc: 'Join targeted exam groups, share peer notes, and motivate each other.' },
  { icon: 'qa', title: 'Community Q&A Forum', desc: 'Ask complex doubts and receive verified answers from subject mentors and peers.' },
  { icon: 'ai', title: 'AI Academic Assistant', desc: 'Instant 24/7 conceptual explanations, custom quiz generation and weekly planning.' },
  { icon: 'gap', title: 'Study Gap Recovery', desc: 'Personalized comeback roadmap formulated from your past saved notes after time away.' },
  { icon: 'career', title: 'Career Roadmaps', desc: 'Step-by-step milestone pathways across Tech, Medicine, Design and Business.' },
  { icon: 'quiz', title: 'Interactive Assessments', desc: 'Timed quizzes with real-time feedback, detailed explanations and credit rewards.' },
  { icon: 'offline', title: 'Offline Learning Mode', desc: 'Study notes, review lessons and attempt quizzes even without an internet connection.' },
  { icon: 'rewards', title: 'Gamified Credit Rewards', desc: 'Earn points through study consistency and redeem them for 1-on-1 mentor sessions.' },
  { icon: 'home', title: 'Progress Mastery Tracking', desc: 'Visualize your progress across subjects, study streaks, and daily task completion.' },
];

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenLogin }) => {
  return (
    <div className="relative z-10 min-h-screen text-[var(--ink)]">
      {/* Top Navbar */}
      <header className="max-w-6xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
        <Logo size={32} />

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-[var(--ink)] opacity-85">
          <a href="#why" className="hover:text-[var(--chilli)] transition-colors">Why EduBridge</a>
          <a href="#features" className="hover:text-[var(--chilli)] transition-colors">Features</a>
          <a href="#how" className="hover:text-[var(--chilli)] transition-colors">How it works</a>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenLogin('Student')}
            className="eb-btn ghost sm"
          >
            Log in
          </button>
          <button
            onClick={() => onOpenLogin('Student')}
            className="eb-btn red sm"
          >
            Get started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <span className="eb-chip on mb-4">
              ✨ Learn together. Connect better. Grow forever.
            </span>
            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.08] mt-2 mb-4">
              Learning shouldn’t stop at the <span className="bg-gradient-to-r from-[var(--mango)] to-[var(--soft)] px-2 rounded-lg">classroom.</span>
            </h1>
            <p className="text-lg opacity-85 max-w-xl mb-6 leading-relaxed">
              EduBridge AI brings your notes, mentors, doubts and study groups into one cohesive place, so every learning journey stays organized, continuous, and rewarding.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onOpenLogin('Student')}
                className="eb-btn red text-base px-6 py-3"
              >
                Join as student →
              </button>
              <button
                onClick={() => onOpenLogin('Mentor')}
                className="eb-btn ghost text-base px-6 py-3"
              >
                Join as mentor
              </button>
            </div>

            <div className="flex flex-wrap gap-2 mt-8 text-xs font-bold opacity-80">
              <span className="eb-chip">✓ Notes that stay forever</span>
              <span className="eb-chip">✓ 1-on-1 Mentor guidance</span>
              <span className="eb-chip">✓ Drop-in voice rooms</span>
              <span className="eb-chip">✓ Offline PWA ready</span>
            </div>
          </div>

          {/* Interactive Hero Card Preview */}
          <div className="lg:col-span-5">
            <div className="eb-card relative border-2 border-[var(--ink)] bg-[var(--card)] shadow-xl p-5">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--ink)]/15">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-[var(--chilli)]" />
                  <b className="text-sm">Today’s Learning Streak</b>
                </div>
                <span className="eb-chip on text-xs">🔥 6-day streak</span>
              </div>

              <div className="space-y-3 my-4">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Physics (Mechanics)</span>
                    <span>72%</span>
                  </div>
                  <div className="eb-bar">
                    <span className="eb-bar-fill" style={{ width: '72%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Mathematics (Calculus)</span>
                    <span>55%</span>
                  </div>
                  <div className="eb-bar">
                    <span className="eb-bar-fill" style={{ width: '55%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Computer Science (DSA)</span>
                    <span>84%</span>
                  </div>
                  <div className="eb-bar">
                    <span className="eb-bar-fill" style={{ width: '84%' }} />
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[var(--ink)]/15">
                <div className="p-2.5 rounded-xl bg-[var(--soft)] text-xs border border-[var(--ink)]/20">
                  <b className="text-[var(--chilli)]">Meera Ma’am (Physics):</b> Share your doubt on friction and I’ll review it tonight!
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--mango)] text-[#071B2B] text-xs font-medium ml-4 border border-[var(--ink)]/30">
                  <b>Aarav:</b> Working on rolling friction formulas right now!
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section id="why" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--ink)]/15">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Studying is scattered. We fix that.
          </h2>
          <p className="opacity-75 text-base">
            Students juggle 5+ disconnected apps for notes, coaching, doubt solving, and revision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="eb-card">
            <div className="w-10 h-10 rounded-xl bg-[var(--mango)] text-[#071B2B] flex items-center justify-center font-bold mb-3">
              📁
            </div>
            <h3 className="text-xl font-bold mb-2">Notes disappear</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Physical notebooks get lost and chat links expire. Keep every note indexed in a personal cloud library you can reopen years later.
            </p>
          </div>

          <div className="eb-card">
            <div className="w-10 h-10 rounded-xl bg-[var(--mango)] text-[#071B2B] flex items-center justify-center font-bold mb-3">
              🎙️
            </div>
            <h3 className="text-xl font-bold mb-2">Mentors are hard to reach</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              High teacher-to-student ratios mean questions go unanswered. Chat channels, drop-in voice study rooms and community Q&A put guidance one click away.
            </p>
          </div>

          <div className="eb-card">
            <div className="w-10 h-10 rounded-xl bg-[var(--mango)] text-[#071B2B] flex items-center justify-center font-bold mb-3">
              🔄
            </div>
            <h3 className="text-xl font-bold mb-2">Study breaks hurt momentum</h3>
            <p className="text-sm opacity-80 leading-relaxed">
              Returning to studies after exams, illness, or vacations is overwhelming. Our Study Gap Recovery calculates a customized restart plan from your own notes.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--ink)]/15">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            Everything in one unified platform
          </h2>
          <p className="opacity-75 text-base">
            Thirteen purpose-built tools designed specifically for continuous academic growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURE_LIST.map((feat, idx) => (
            <div key={idx} className="eb-card group hover:-translate-y-1 transition-transform">
              <div className="w-10 h-10 rounded-xl bg-[var(--mango)] text-[#071B2B] flex items-center justify-center mb-3">
                <AppIcon name={feat.icon} className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold mb-1.5">{feat.title}</h3>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 border-t border-[var(--ink)]/15">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
            How EduBridge AI works
          </h2>
          <p className="opacity-75 text-base">
            Simple 3-step setup to supercharge your study routine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="eb-card relative">
            <span className="w-9 h-9 rounded-xl bg-[var(--chilli)] text-white font-black flex items-center justify-center mb-4">
              1
            </span>
            <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
            <p className="text-sm opacity-80">
              Sign up as a student or mentor in under 30 seconds to access your personalized learning cockpit.
            </p>
          </div>

          <div className="eb-card relative">
            <span className="w-9 h-9 rounded-xl bg-[var(--chilli)] text-white font-black flex items-center justify-center mb-4">
              2
            </span>
            <h3 className="text-xl font-bold mb-2">Add Your Study Notes</h3>
            <p className="text-sm opacity-80">
              Upload class notes, formula sheets and past papers. Tag by subject and download them for offline access anytime.
            </p>
          </div>

          <div className="eb-card relative">
            <span className="w-9 h-9 rounded-xl bg-[var(--chilli)] text-white font-black flex items-center justify-center mb-4">
              3
            </span>
            <h3 className="text-xl font-bold mb-2">Learn, Ask & Recover</h3>
            <p className="text-sm opacity-80">
              Engage with AI assistants, attend live voice study rooms, take assessments, earn rewards, and stay unstoppable.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-[var(--chilli)] text-white rounded-2xl p-8 sm:p-12 text-center border-2 border-[var(--ink)] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-5xl font-black mb-4">
              One platform. Every note. Every connection.
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Join thousands of students and mentors bridging the gap to academic excellence.
            </p>
            <button
              onClick={() => onOpenLogin('Student')}
              className="eb-btn bg-white text-[#071B2B] text-base font-black px-8 py-3.5 hover:bg-[var(--mango)]"
            >
              Get Started for Free Now →
            </button>
          </div>
        </div>

        <footer className="text-center text-xs opacity-70 mt-10">
          <p>© {new Date().getFullYear()} EduBridge AI. Learn together. Connect better. Grow forever.</p>
        </footer>
      </section>
    </div>
  );
};
