import React, { useEffect, useState } from 'react';
import { ActiveView } from '../types';
import { Logo, AppIcon } from './Icons';

interface SidebarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  onLogout: () => void;
}

const NAV_ITEMS: { id: ActiveView; label: string; icon: string; category?: string }[] = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'notes', label: 'Notes library', icon: 'notes' },
  { id: 'chat', label: 'Mentor chat', icon: 'chat' },
  { id: 'community', label: 'Community chat', icon: 'groups' },
  { id: 'voice', label: 'Voice rooms', icon: 'voice' },
  { id: 'groups', label: 'Group study', icon: 'groups' },
  { id: 'qa', label: 'Q&A doubts', icon: 'qa' },
  { id: 'ai', label: 'AI assistant', icon: 'ai' },
  { id: 'gap', label: 'Study gap recovery', icon: 'gap' },
  { id: 'career', label: 'Career roadmaps', icon: 'career' },
  { id: 'quiz', label: 'Assessments', icon: 'quiz' },
  { id: 'offline', label: 'Offline notes', icon: 'offline' },
  { id: 'rewards', label: 'Rewards store', icon: 'rewards' },
];

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onSelectView, onLogout }) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('edubridge_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('edubridge_sidebar_collapsed', String(next));
      } catch {
        /* ignore */
      }
      return next;
    });
  };

  // Keyboard shortcut Ctrl+B or Cmd+B to toggle sidebar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        toggleCollapse();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Mobile Top Navigation Toggle Bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-2.5 bg-[var(--card)] border-b border-[var(--ink)] z-30">
        <Logo size={24} />
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[var(--ink)] bg-[var(--soft)] text-xs font-bold"
            aria-label="Toggle navigation menu"
          >
            <AppIcon name="menu" className="w-4 h-4" />
            <span>Menu</span>
          </button>
        </div>
      </div>

      {/* Mobile Backdrop Overlay */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Main Responsive & Collapsible Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen bg-[var(--card)] border-r border-[var(--ink)] flex flex-col justify-between shrink-0 z-50 md:z-20 p-3 sm:p-4 transition-[width,transform] duration-300 ease-in-out overflow-y-auto ${
          /* Desktop Width */
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${
          /* Mobile Drawer Visibility */
          mobileDrawerOpen ? 'translate-x-0 w-64 shadow-2xl' : '-translate-x-full md:translate-x-0'
        }`}
        aria-label="Sidebar navigation"
      >
        <div className="flex flex-col gap-1 w-full">
          {/* Top Header: Logo + Collapse/Expand Toggle Button */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[var(--ink)]/15 min-h-[44px]">
            <div className="overflow-hidden">
              <Logo size={isCollapsed ? 28 : 30} compact={isCollapsed} />
            </div>

            {/* Desktop Collapse / Expand Toggle Button */}
            <button
              onClick={toggleCollapse}
              className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--ink)]/20 hover:border-[var(--ink)] bg-[var(--soft)] text-[var(--ink)] transition-all hover:scale-105"
              title={isCollapsed ? 'Expand sidebar (Ctrl+B)' : 'Collapse sidebar (Ctrl+B)'}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <AppIcon
                name={isCollapsed ? 'chevronRight' : 'chevronLeft'}
                className="w-4 h-4 transition-transform duration-200"
              />
            </button>

            {/* Mobile Close Button */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="md:hidden flex items-center justify-center w-7 h-7 rounded-lg border border-[var(--ink)] bg-[var(--soft)] font-bold text-sm"
              title="Close menu"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 w-full" aria-label="Main Navigation">
            {NAV_ITEMS.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectView(item.id);
                    setMobileDrawerOpen(false);
                  }}
                  title={isCollapsed ? item.label : undefined}
                  aria-label={item.label}
                  className={`flex items-center gap-3 rounded-xl text-sm font-semibold transition-all text-left border relative group ${
                    isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5'
                  } ${
                    isActive
                      ? 'bg-[var(--chilli)] text-white border-transparent shadow-md'
                      : 'text-[var(--ink)] hover:bg-[var(--soft)] border-transparent'
                  }`}
                >
                  <AppIcon name={item.icon} className="w-5 h-5 shrink-0" />

                  {!isCollapsed && <span className="truncate">{item.label}</span>}

                  {/* Floating tooltip on hover when collapsed */}
                  {isCollapsed && (
                    <span className="hidden md:group-hover:block absolute left-full ml-3 px-2.5 py-1.5 bg-[var(--ink)] text-[var(--bg)] text-xs font-bold rounded-lg shadow-xl whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Area: Collapse Hint & Logout Button */}
        <div className="pt-4 border-t border-[var(--ink)]/15 mt-auto flex flex-col gap-2">
          {/* Collapse status badge when expanded */}
          {!isCollapsed && (
            <div className="hidden md:flex items-center justify-between px-2 text-[10px] opacity-60 font-semibold select-none">
              <span>SHORTCUT</span>
              <kbd className="px-1.5 py-0.5 rounded bg-[var(--soft)] border border-[var(--ink)]/20 text-[9px]">
                Ctrl + B
              </kbd>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={onLogout}
            title="Exit / Log out"
            aria-label="Log out"
            className={`flex items-center gap-3 rounded-xl text-sm font-semibold text-[var(--ink)] hover:bg-[var(--soft)] hover:text-red-500 transition-colors border border-transparent ${
              isCollapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5 w-full'
            }`}
          >
            <AppIcon name="out" className="w-5 h-5 shrink-0" />
            {!isCollapsed && <span className="truncate">Exit / Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
