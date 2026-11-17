import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Logo } from '../components/Icons';

interface AuthModalProps {
  initialRole?: UserRole;
  onLogin: (profile: UserProfile) => void;
  onBackToHome: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialRole = 'Student',
  onLogin,
  onBackToHome,
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState(initialRole === 'Student' ? 'Aarav' : 'Meera Ma’am');
  const [password, setPassword] = useState('demo1234');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setName(newRole === 'Student' ? 'Aarav' : 'Meera Ma’am');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (role === 'Student' ? 'Aarav' : 'Meera Ma’am');
    onLogin({
      name: finalName,
      role,
      credits: role === 'Student' ? 240 : 500,
      streak: role === 'Student' ? 6 : 42,
      avatarColor: role === 'Student' ? '#B9E4E8' : '#9ED5DC',
    });
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Logo size={32} />
          <button
            onClick={onBackToHome}
            className="eb-btn ghost sm"
          >
            ← Back to home
          </button>
        </div>

        <div className="eb-card border-2 border-[var(--ink)] bg-[var(--card)] p-6 sm:p-8 relative">
          <div className="absolute -top-3.5 right-4 bg-[var(--chilli)] text-white font-extrabold text-xs px-3 py-0.5 rounded-full border border-[var(--ink)] rotate-3">
            Demo Portal
          </div>

          {/* Role switcher tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 p-1 bg-[var(--soft)] rounded-xl border border-[var(--ink)]/20">
            <button
              type="button"
              onClick={() => handleRoleChange('Student')}
              className={`py-2 text-sm font-black rounded-lg transition-all ${
                role === 'Student'
                  ? 'bg-[var(--mango)] text-[#071B2B] shadow-sm border border-[var(--ink)]'
                  : 'text-[var(--ink)] opacity-70 hover:opacity-100'
              }`}
            >
              🎓 Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('Mentor')}
              className={`py-2 text-sm font-black rounded-lg transition-all ${
                role === 'Mentor'
                  ? 'bg-[var(--mango)] text-[#071B2B] shadow-sm border border-[var(--ink)]'
                  : 'text-[var(--ink)] opacity-70 hover:opacity-100'
              }`}
            >
              👩‍🏫 Mentor / Teacher
            </button>
          </div>

          <h2 className="text-2xl font-black mb-1 logo-font">
            {role === 'Student' ? 'Student Portal' : 'Mentor Dashboard'}
          </h2>
          <p className="text-xs opacity-75 mb-5">
            {role === 'Student'
              ? 'Access your saved notes, mentors, AI assistant and tests.'
              : 'Answer doubts, upload learning materials and monitor students.'}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 opacity-90">
                Your Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="eb-input text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold mb-1 opacity-90">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="eb-input text-sm"
                required
              />
            </div>

            <button
              type="submit"
              className="eb-btn red w-full py-3 text-sm font-black mt-2"
            >
              Log in as {role} →
            </button>
          </form>

          {/* Quick presets */}
          <div className="mt-6 pt-4 border-t border-[var(--ink)]/15">
            <div className="text-xs font-semibold opacity-70 mb-2">Quick demo presets:</div>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setRole('Student');
                  setName('Aarav');
                }}
                className="eb-chip text-xs"
              >
                Aarav (Grade 12 Student)
              </button>
              <button
                type="button"
                onClick={() => {
                  setRole('Mentor');
                  setName('Meera Ma’am');
                }}
                className="eb-chip text-xs"
              >
                Meera Ma’am (Physics Mentor)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
