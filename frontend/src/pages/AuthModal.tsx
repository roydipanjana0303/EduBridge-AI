import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Logo } from '../components/Icons';

interface AuthModalProps {
  initialRole?: UserRole;
  onLogin: (profile: UserProfile, credentials: { email: string; password: string; mode: 'login' | 'register' }) => Promise<void> | void;
  onBackToHome: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialRole = 'Student',
  onLogin,
  onBackToHome,
}) => {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [name, setName] = useState(initialRole === 'Student' ? 'Student' : 'Meera Mentor');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState(initialRole === 'Student' ? 'student@edubridge.ai' : 'mentor@edubridge.ai');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    setName(newRole === 'Student' ? 'Student' : 'Meera Mentor');
    setEmail(newRole === 'Student' ? 'student@edubridge.ai' : 'mentor@edubridge.ai');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || (role === 'Student' ? 'Student User' : 'Mentor User');
    setBusy(true); setError('');
    Promise.resolve(onLogin({
      name: finalName,
      role,
      credits: role === 'Student' ? 240 : 500,
      streak: role === 'Student' ? 6 : 42,
      avatarColor: role === 'Student' ? '#B9E4E8' : '#9ED5DC',
    }, { email, password, mode })).catch((err: unknown) => setError(err instanceof Error ? err.message : 'Authentication failed')).finally(() => setBusy(false));
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
            Account Access
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

          <div className="mb-4 rounded-lg border border-[var(--ink)]/20 bg-[var(--soft)] p-3 text-xs">
            <strong>Verified Database Accounts</strong>
            <div className="mt-1"><b>Student:</b> student@edubridge.ai / Student@123</div>
            <div><b>Mentor:</b> mentor@edubridge.ai / Mentor@123</div>
            <div className="mt-1 opacity-70">Or click <b>Create account</b> below to register a brand new account!</div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1 opacity-90">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="eb-input text-sm mb-3"
                required
              />
              <label className="block text-xs font-bold mb-1 opacity-90">Display name</label>
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
                placeholder="Enter password (min 8 characters)"
                className="eb-input text-sm"
                minLength={mode === 'register' ? 8 : 1}
                required
              />
            </div>
            {error && (
              <div role="alert" className="p-2.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs font-bold text-red-600">
                {error}
              </div>
            )}
            <div className="flex gap-4 text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError('');
                  if (!email) setEmail(role === 'Student' ? 'student@edubridge.ai' : 'mentor@edubridge.ai');
                }}
                className={`transition-all ${mode === 'login' ? 'font-black underline text-[var(--chilli)]' : 'opacity-70 hover:opacity-100'}`}
              >
                Sign in to existing account
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  if (email === 'student@edubridge.ai' || email === 'mentor@edubridge.ai') {
                    setEmail('');
                    setName('');
                  }
                }}
                className={`transition-all ${mode === 'register' ? 'font-black underline text-[var(--chilli)]' : 'opacity-70 hover:opacity-100'}`}
              >
                Create new account
              </button>
            </div>
            <button
              type="submit"
              disabled={busy || !email || !password || (mode === 'register' && password.length < 8)}
              className="eb-btn red w-full py-3 text-sm font-black mt-2"
            >
              {busy ? 'Please wait…' : mode === 'register' ? 'Create account' : 'Sign in'} →
            </button>
          </form>

       </div>
      </div>
    </div>
  );
};
