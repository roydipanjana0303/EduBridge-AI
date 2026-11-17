
import React, { useState } from 'react';
import { UserRole, UserProfile } from '../types';
import { Logo } from '../components/Icons';
import { ApiService } from '../services/api';

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
  const [role] = useState<UserRole>(initialRole);
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = isRegistering
        ? await ApiService.register({
            name: name.trim(),
            email: email.trim(),
            password,
          })
        : await ApiService.login({
            email: email.trim(),
            password,
          });

      onLogin(result.user);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to authenticate. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <Logo size={32} />

          <button
            type="button"
            onClick={onBackToHome}
            className="eb-btn ghost sm"
          >
            Back to Home
          </button>
        </div>

        <h2 className="text-2xl font-black mb-1 logo-font">
          {isRegistering
            ? 'Create Student Account'
            : role === 'Student'
              ? 'Student Portal'
              : role === 'Admin'
                ? 'Admin Portal'
                : 'Mentor Dashboard'}
        </h2>

        <p className="text-xs opacity-75 mb-5">
          {isRegistering
            ? 'Create your EduBridge AI student account.'
            : 'Sign in with your registered EduBridge AI credentials.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <div>
              <label className="block text-xs font-bold mb-1 opacity-90">
                Your Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="eb-input text-sm"
                maxLength={120}
                required
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold mb-1 opacity-90">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="eb-input text-sm"
              autoComplete="email"
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
              placeholder="Enter your password"
              className="eb-input text-sm"
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={isRegistering ? 8 : undefined}
              required
            />

            {isRegistering && (
              <p className="text-xs opacity-60 mt-1">
                Password must contain at least 8 characters.
              </p>
            )}
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-600"
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="eb-btn red w-full py-3 text-sm font-black mt-2 disabled:opacity-60"
          >
            {loading
              ? 'Please wait...'
              : isRegistering
                ? 'Create Account'
                : 'Log In'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          {isRegistering
            ? 'Already have an account?'
            : "Don't have an account?"}

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setIsRegistering((current) => !current);
              setError('');
              setPassword('');
            }}
            className="ml-2 font-bold underline"
          >
            {isRegistering ? 'Log in' : 'Register'}
          </button>
        </div>

        {isRegistering && (
          <p className="text-xs text-center opacity-60 mt-3">
            Public registration creates student accounts. Teacher and admin
            accounts are provided by the institution.
          </p>
        )}
      </div>
    </div>
  );
};
