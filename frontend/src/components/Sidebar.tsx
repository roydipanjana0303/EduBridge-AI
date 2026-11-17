import React from 'react';
import { ActiveView } from '../types';
import { Logo, AppIcon } from './Icons';

interface SidebarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: ActiveView; label: string; icon: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'notes', label: 'Notes library', icon: 'notes' },
  { id: 'chat', label: 'Mentor chat', icon: 'chat' },
  { id: 'voice', label: 'Voice rooms', icon: 'voice' },
  { id: 'groups', label: 'Group study', icon: 'groups' },
  { id: 'qa', label: 'Q&A', icon: 'qa' },
  { id: 'ai', label: 'AI assistant', icon: 'ai' },
  { id: 'gap', label: 'Study gap recovery', icon: 'gap' },
  { id: 'career', label: 'Career roadmaps', icon: 'career' },
  { id: 'quiz', label: 'Assessments', icon: 'quiz' },
  { id: 'offline', label: 'Offline', icon: 'offline' },
  { id: 'rewards', label: 'Rewards', icon: 'rewards' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, onLogout }) => {
  return (
    <aside className="w-full md:w-60 bg-[var(--card)] border-b md:border-b-0 md:border-r border-[var(--ink)] flex flex-row md:flex-col justify-between shrink-0 md:sticky md:top-0 md:h-screen overflow-x-auto md:overflow-y-auto z-20 p-2 sm:p-4">
      <div className="flex md:flex-col items-center md:items-stretch gap-1 w-full">
        <div className="hidden md:block mb-5 px-2 pt-1">
          <Logo size={28} />
        </div>

        <nav className="flex md:flex-col items-center md:items-stretch gap-1 w-full" aria-label="Main Navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectView(item.id)}
                className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold transition-all whitespace-nowrap text-left border ${
                  isActive
                    ? 'bg-[var(--chilli)] text-white border-transparent shadow-sm'
                    : 'text-[var(--ink)] hover:bg-[var(--soft)] border-transparent'
                }`}
              >
                <AppIcon name={item.icon} className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="hidden md:block pt-4 border-t border-[var(--ink)]/15 mt-auto">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-[var(--ink)] hover:bg-[var(--soft)] w-full transition-colors"
        >
          <AppIcon name="out" className="w-4 h-4" />
          <span>Exit / Log out</span>
        </button>
      </div>
    </aside>
  );
};
