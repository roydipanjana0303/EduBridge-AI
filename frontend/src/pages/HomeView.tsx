import React, { useState } from 'react';
import { UserProfile, ActiveView } from '../types';
import { AppIcon } from '../components/Icons';

interface HomeViewProps {
  user: UserProfile;
  notesCount: number;
  onNavigate: (view: ActiveView) => void;
  onAddCredits: (amount: number, reason: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  user,
  notesCount,
  onNavigate,
  onAddCredits,
}) => {
  const isStudent = user.role === 'Student';

  const [todos, setTodos] = useState([
    { id: '1', text: 'Revise Newton’s Laws & Free Body Diagrams', done: false, credits: 5 },
    { id: '2', text: 'Answer or upvote one community doubt in Q&A', done: false, credits: 5 },
    { id: '3', text: 'Complete daily 4-question assessment quiz', done: false, credits: 10 },
    { id: '4', text: 'Drop into a peer voice study room for 15 mins', done: false, credits: 10 },
  ]);

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newDone = !item.done;
          if (newDone) {
            onAddCredits(item.credits, `+${item.credits} credits! Completed "${item.text.slice(0, 24)}..."`);
          }
          return { ...item, done: newDone };
        }
        return item;
      })
    );
  };

  const progressData = [
    { subject: 'Physics (Mechanics & Waves)', pct: 72, color: 'bg-[var(--mint)]' },
    { subject: 'Mathematics (Calculus & Vectors)', pct: 55, color: 'bg-[var(--chilli)]' },
    { subject: 'Chemistry (Organic Reactions)', pct: 38, color: 'bg-[var(--mango)]' },
    { subject: 'Computer Science (Python & DSA)', pct: 84, color: 'bg-[var(--mint)]' },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting Banner */}
      <div>
        <h2 className="text-2xl sm:text-4xl font-black text-[var(--ink)] logo-font">
          Namaste, {user.name}! 🙏
        </h2>
        <p className="text-sm opacity-75 mt-1">
          {isStudent
            ? `You're on a ${user.streak}-day learning streak. Consistency builds mastery.`
            : 'Your students have submitted doubts and notes for review today.'}
        </p>
      </div>

      {/* Top 3 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Credit Points */}
        <div className="eb-card bg-[var(--mango)] text-[#071B2B] relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-wider opacity-80">
              Credit Points Balance
            </div>
            <div className="text-4xl sm:text-5xl font-black mt-2 logo-font">
              {user.credits}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs font-bold">Earned from quizzes & notes</span>
            <button
              onClick={() => onNavigate('rewards')}
              className="eb-btn ghost sm text-xs"
            >
              Redeem Perks →
            </button>
          </div>
        </div>

        {/* Notes Saved / Students */}
        <div className="eb-card flex flex-col justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-wider opacity-70">
              {isStudent ? 'Smart Notes Saved' : 'Students Mentored'}
            </div>
            <div className="text-4xl sm:text-5xl font-black mt-2 text-[var(--ink)] logo-font">
              {isStudent ? notesCount : 24}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs opacity-75">{isStudent ? 'Available offline' : 'Active learners'}</span>
            <button
              onClick={() => onNavigate('notes')}
              className="eb-btn sm text-xs"
            >
              View Notes →
            </button>
          </div>
        </div>

        {/* Study Streak / Doubts */}
        <div className="eb-card flex flex-col justify-between">
          <div>
            <div className="text-xs font-black uppercase tracking-wider opacity-70">
              {isStudent ? 'Active Study Streak' : 'Doubts Answered'}
            </div>
            <div className="text-4xl sm:text-5xl font-black mt-2 text-[var(--ink)] logo-font flex items-center gap-2">
              <span>{isStudent ? `${user.streak} days` : '138'}</span>
              <span className="text-2xl">{isStudent ? '🔥' : '✨'}</span>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs opacity-75">{isStudent ? 'Top 5% of learners' : '98% satisfaction'}</span>
            <button
              onClick={() => onNavigate(isStudent ? 'quiz' : 'qa')}
              className="eb-btn sm text-xs"
            >
              {isStudent ? 'Take Daily Quiz' : 'Answer Doubts'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Learning Progress & Today's To-Do */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Progress Mastery */}
        <div className="lg:col-span-7 eb-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-black logo-font">Subject Mastery Progress</h3>
            <span className="eb-chip text-xs">Curriculum 2024-25</span>
          </div>

          <div className="space-y-4">
            {progressData.map((item, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between text-xs sm:text-sm font-bold mb-1.5">
                  <span>{item.subject}</span>
                  <span className="text-[var(--chilli)]">{item.pct}%</span>
                </div>
                <div className="eb-bar">
                  <span
                    className="eb-bar-fill"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-[var(--ink)]/15 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('ai')}
              className="eb-btn ghost sm text-xs"
            >
              ✨ Ask AI to explain weak topics
            </button>
            <button
              onClick={() => onNavigate('gap')}
              className="eb-btn sm text-xs"
            >
              🔄 Study Gap Recovery Plan
            </button>
          </div>
        </div>

        {/* Today's Checklist */}
        <div className="lg:col-span-5 eb-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-black logo-font">Daily Study Tasks</h3>
              <span className="text-xs font-bold opacity-75">
                {todos.filter((t) => t.done).length}/{todos.length} done
              </span>
            </div>
            <p className="text-xs opacity-70 mb-4">
              Check off tasks to gain bonus credits and maintain your streak.
            </p>

            <div className="space-y-2.5">
              {todos.map((todo) => (
                <label
                  key={todo.id}
                  className={`flex items-start gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                    todo.done
                      ? 'bg-[var(--soft)]/60 border-[var(--ink)]/20 line-through opacity-70'
                      : 'bg-[var(--card)] border-[var(--ink)] hover:bg-[var(--soft)]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={todo.done}
                    onChange={() => handleToggleTodo(todo.id)}
                    className="mt-0.5 w-4 h-4 rounded cursor-pointer accent-[var(--chilli)]"
                  />
                  <div className="text-xs font-semibold flex-1">
                    {todo.text}
                  </div>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[var(--mango)] text-[#071B2B]">
                    +{todo.credits} pts
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--ink)]/15 flex items-center justify-between text-xs opacity-80">
            <span>Completed tasks reset at midnight</span>
            <button
              onClick={() => onNavigate('voice')}
              className="font-bold hover:underline text-[var(--chilli)]"
            >
              Join voice room →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
