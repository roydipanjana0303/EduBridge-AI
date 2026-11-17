import React from 'react';
import { UserProfile } from '../types';
import { AppIcon } from './Icons';

interface HeaderProps {
  title: string;
  user: UserProfile;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onSearchSubmit: () => void;
  onNavigateToRewards: () => void;
  onToggleTheme: () => void;
  currentTheme: 'light' | 'dark';
}

export const Header: React.FC<HeaderProps> = ({
  title,
  user,
  searchTerm,
  onSearchChange,
  onSearchSubmit,
  onNavigateToRewards,
  onToggleTheme,
  currentTheme,
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-3 px-4 sm:px-8 py-3 bg-[var(--card)] border-b border-[var(--ink)]">
      <div className="flex items-center gap-3">
        <h1 className="text-xl sm:text-2xl font-black text-[var(--ink)] logo-font tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end max-w-2xl">
        <div className="relative hidden md:block w-64">
          <input
            type="text"
            placeholder="Search notes & topics..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
            className="eb-input py-1.5 px-3 text-sm pr-8"
            aria-label="Search notes"
          />
          <button
            onClick={onSearchSubmit}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ink)] opacity-60 hover:opacity-100"
            title="Search"
          >
            <AppIcon name="search" className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onNavigateToRewards}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--ink)] bg-[var(--mango)] text-[#071B2B] font-bold text-xs sm:text-sm hover:shadow-sm transition-all whitespace-nowrap"
          title="Click to view reward perks"
        >
          <span>🏆</span>
          <span>{user.credits} credits</span>
        </button>

        <button
          onClick={onToggleTheme}
          aria-label="Toggle dark/light theme"
          className="w-9 h-9 rounded-xl border border-[var(--ink)] bg-[var(--card)] text-[var(--ink)] flex items-center justify-center hover:bg-[var(--soft)] transition-colors"
        >
          <AppIcon name={currentTheme === 'dark' ? 'sun' : 'moon'} className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 pl-1 border-l border-[var(--ink)]/20">
          <span
            className="eb-avatar w-8 h-8 text-sm"
            style={{ backgroundColor: user.avatarColor }}
          >
            {user.name.charAt(0).toUpperCase()}
          </span>
          <div className="hidden sm:block text-left text-xs leading-tight">
            <div className="font-bold text-[var(--ink)]">{user.name}</div>
            <div className="text-[var(--chilli)] font-semibold">{user.role}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
