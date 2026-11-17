import React, { useState, useEffect } from 'react';
import { UserProfile, ActiveView, NoteItem, MentorProfile, UserRole } from './types';
import {
  INITIAL_NOTES,
  INITIAL_MENTORS,
  INITIAL_VOICE_ROOMS,
  INITIAL_STUDY_GROUPS,
  INITIAL_QA,
} from './data/mockData';
import { ParticleCanvas } from './components/ParticleCanvas';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { LandingPage } from './pages/LandingPage';
import { AuthModal } from './pages/AuthModal';
import { HomeView } from './pages/HomeView';
import { TeacherDashboardView } from './pages/TeacherDashboardView';
import { NotesView } from './pages/NotesView';
import { ChatView } from './pages/ChatView';
import { VoiceView } from './pages/VoiceView';
import { GroupsView } from './pages/GroupsView';
import { QAView } from './pages/QAView';
import { AIView } from './pages/AIView';
import { GapRecoveryView } from './pages/GapRecoveryView';
import { CareerRoadmapView } from './pages/CareerRoadmapView';
import { QuizView } from './pages/QuizView';
import { OfflineView } from './pages/OfflineView';
import { RewardsView } from './pages/RewardsView';

export const App: React.FC = () => {
  // Authentication & Navigation
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [authRole, setAuthRole] = useState<UserRole>('Student');

  // User Profile
  const [user, setUser] = useState<UserProfile>({
    name: 'Aarav',
    role: 'Student',
    credits: 240,
    streak: 6,
    avatarColor: '#B9E4E8',
  });

  // Current View & Theme
  const [currentView, setCurrentView] = useState<ActiveView>('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // App Data
  const [notes, setNotes] = useState<NoteItem[]>(INITIAL_NOTES);
  const [mentors, setMentors] = useState<MentorProfile[]>(INITIAL_MENTORS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync theme to root element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toast helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2400);
  };

  // Credits helper
  const handleAddCredits = (amount: number, reason: string) => {
    setUser((prev) => ({ ...prev, credits: prev.credits + amount }));
    showToast(reason);
  };

  // Toggle Theme
  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Search Submit
  const handleSearchSubmit = () => {
    setCurrentView('notes');
  };

  // Note actions
  const handleAddNote = (newNoteData: Omit<NoteItem, 'id'>) => {
    const created: NoteItem = {
      ...newNoteData,
      id: Date.now().toString(),
    };
    setNotes([created, ...notes]);
    handleAddCredits(10, 'Uploaded note! +10 credits');
  };

  const handleToggleOfflineNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isOffline: !n.isOffline } : n))
    );
  };

  // Chat message sending with simulated mentor replies
  const handleSendMessage = (mentorId: string, text: string) => {
    const userMsg = {
      id: Date.now().toString(),
      sender: 'me' as const,
      text,
    };

    setMentors((prev) =>
      prev.map((m) => {
        if (m.id === mentorId) {
          return {
            ...m,
            messages: [...m.messages, userMsg],
          };
        }
        return m;
      })
    );

    // Simulated mentor reply
    setTimeout(() => {
      const mentorReplies: Record<string, string[]> = {
        m1: [
          'Excellent question! Look at the free body diagram and resolve the normal contact force along the inclined plane.',
          'Review formula 4 in the Physics cheat sheet—it highlights why static friction exceeds kinetic friction.',
          'Great progress Aarav! I have marked this doubt as resolved in your tracker.',
        ],
        m2: [
          'Substitute u = x² + 1 and du = 2x dx. The integral simplifies immediately.',
          'Check your limits of integration when applying trigonometric substitution!',
          'That solution is mathematically rigorous. Well done!',
        ],
        m3: [
          'Notice your recursive base condition: if n <= 1 return n. Without that, you will trigger a stack overflow.',
          'Your time complexity here is O(N log N) which is optimal for this sorting problem.',
          'Code verified! Push this to your portfolio repository.',
        ],
      };

      const repliesList = mentorReplies[mentorId] || mentorReplies['m1'];
      const randomReply = repliesList[Math.floor(Math.random() * repliesList.length)];

      const mentorReplyMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'them' as const,
        text: randomReply,
      };

      setMentors((prev) =>
        prev.map((m) => {
          if (m.id === mentorId) {
            return {
              ...m,
              messages: [...m.messages, mentorReplyMsg],
            };
          }
          return m;
        })
      );
    }, 1000);
  };

  // Redeem Reward
  const handleRedeem = (cost: number, title: string) => {
    if (user.credits < cost) {
      showToast(`Need ${cost - user.credits} more credits to unlock!`);
      return;
    }
    setUser((prev) => ({ ...prev, credits: prev.credits - cost }));
    showToast(`Claimed perk: ${title} 🎉`);
  };

  // Section title mapping
  const VIEW_TITLES: Record<ActiveView, string> = {
    home: user.role === 'Student' ? 'Student Cockpit' : 'Mentor Dashboard',
    notes: 'Smart Notes Library',
    chat: 'Mentor Chat',
    voice: 'Voice Study Rooms',
    groups: 'Study Squads',
    qa: 'Doubt Q&A Forum',
    ai: 'AI Academic Assistant',
    gap: 'Study Gap Recovery',
    career: 'Career Roadmaps',
    quiz: 'Assessments & Quizzes',
    offline: 'Offline Learning',
    rewards: 'Rewards & Perks Store',
  };

  // If user is not logged in: show Landing Page or Auth Modal
  if (!isAuthenticated) {
    if (showAuthModal) {
      return (
        <div className="relative min-h-screen">
          <ParticleCanvas />
          <AuthModal
            initialRole={authRole}
            onLogin={(profile) => {
              setUser(profile);
              setIsAuthenticated(true);
              setShowAuthModal(false);
              showToast(`Welcome back, ${profile.name}!`);
            }}
            onBackToHome={() => setShowAuthModal(false)}
          />
          <Toast message={toastMessage} />
        </div>
      );
    }

    return (
      <div className="relative min-h-screen">
        <ParticleCanvas />
        <LandingPage
          onOpenLogin={(role = 'Student') => {
            setAuthRole(role);
            setShowAuthModal(true);
          }}
        />
        <Toast message={toastMessage} />
      </div>
    );
  }

  // Filter notes when in Offline Mode
  const activeNotes = isOfflineMode ? notes.filter((n) => n.isOffline) : notes;

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row bg-[var(--bg)] text-[var(--ink)]">
      {/* Dynamic background network animation */}
      <ParticleCanvas />

      {/* Responsive Navigation Sidebar */}
      <Sidebar
        currentView={currentView}
        onSelectView={(v) => {
          setCurrentView(v);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={() => {
          setIsAuthenticated(false);
          showToast('Signed out. See you next study session!');
        }}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Header */}
        <Header
          title={VIEW_TITLES[currentView]}
          user={user}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearchSubmit}
          onNavigateToRewards={() => setCurrentView('rewards')}
          onToggleTheme={handleToggleTheme}
          currentTheme={theme}
        />

        {/* Offline Banner */}
        {isOfflineMode && (
          <div className="bg-[var(--ink)] text-[var(--bg)] px-4 py-2 text-center text-xs font-bold border-b border-[var(--mango)] flex items-center justify-center gap-2">
            <span>⚡ Offline Mode Active: Displaying cached materials only.</span>
            <button
              onClick={() => setIsOfflineMode(false)}
              className="underline text-[var(--mango)] hover:opacity-80"
            >
              Re-enable live mode
            </button>
          </div>
        )}

        {/* Active View Container */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto">
          {currentView === 'home' && (
            user.role === 'Mentor' ? (
              <TeacherDashboardView
                user={user}
                notes={notes}
                onAddNote={handleAddNote}
                onToast={showToast}
              />
            ) : (
              <HomeView
                user={user}
                notesCount={notes.length}
                onNavigate={setCurrentView}
                onAddCredits={handleAddCredits}
              />
            )
          )}

          {currentView === 'notes' && (
            <NotesView
              notes={activeNotes}
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onAddNote={handleAddNote}
              onToggleOffline={handleToggleOfflineNote}
              onToast={showToast}
            />
          )}

          {currentView === 'chat' && (
            <ChatView
              mentors={mentors}
              onSendMessage={handleSendMessage}
              onToast={showToast}
            />
          )}

          {currentView === 'voice' && (
            <VoiceView
              rooms={INITIAL_VOICE_ROOMS}
              userName={user.name}
              onToast={showToast}
            />
          )}

          {currentView === 'groups' && (
            <GroupsView
              initialGroups={INITIAL_STUDY_GROUPS}
              onToast={showToast}
            />
          )}

          {currentView === 'qa' && (
            <QAView
              initialQA={INITIAL_QA}
              userName={user.name}
              onAddCredits={handleAddCredits}
              onToast={showToast}
            />
          )}

          {currentView === 'ai' && <AIView />}

          {currentView === 'gap' && (
            <GapRecoveryView
              notes={notes}
              onAddCredits={handleAddCredits}
              onToast={showToast}
            />
          )}

          {currentView === 'career' && <CareerRoadmapView />}

          {currentView === 'quiz' && (
            <QuizView
              onAddCredits={handleAddCredits}
              onToast={showToast}
            />
          )}

          {currentView === 'offline' && (
            <OfflineView
              notes={notes}
              isOfflineMode={isOfflineMode}
              onToggleOfflineMode={() => setIsOfflineMode(!isOfflineMode)}
              onOpenNote={(note) => {
                showToast(`Opening offline note: ${note.title}`);
                setCurrentView('notes');
              }}
            />
          )}

          {currentView === 'rewards' && (
            <RewardsView
              currentCredits={user.credits}
              onRedeem={handleRedeem}
            />
          )}
        </main>
      </div>

      {/* Global Interactive Toast */}
      <Toast message={toastMessage} />
    </div>
  );
};

export default App;
