import React from 'react';
import { NoteItem } from '../types';

interface OfflineViewProps {
  notes: NoteItem[];
  isOfflineMode: boolean;
  onToggleOfflineMode: () => void;
  onOpenNote: (note: NoteItem) => void;
}

export const OfflineView: React.FC<OfflineViewProps> = ({
  notes,
  isOfflineMode,
  onToggleOfflineMode,
  onOpenNote,
}) => {
  const downloadedNotes = notes.filter((n) => n.isOffline);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Offline Learning & Downloads
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Access your critical study notes, formula cheat sheets, and offline materials on trains, buses, or areas with zero internet connectivity.
        </p>
      </div>

      {/* Offline Mode Switcher */}
      <div className="eb-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-extrabold text-base">Offline Simulation Mode</h3>
          <p className="text-xs opacity-75 mt-0.5">
            {isOfflineMode
              ? 'ACTIVE: Only locally downloaded notes and offline features are visible.'
              : 'INACTIVE: You are currently browsing the live online cloud library.'}
          </p>
        </div>

        <button
          onClick={onToggleOfflineMode}
          className={`eb-btn sm text-xs font-black ${
            isOfflineMode ? 'red' : 'mint'
          }`}
        >
          {isOfflineMode ? 'Disable Offline Mode' : '⚡ Simulate Offline Mode'}
        </button>
      </div>

      {/* Storage stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="eb-card">
          <div className="text-xs font-bold opacity-70">Downloaded Notes</div>
          <div className="text-3xl font-black mt-1 text-[var(--chilli)] logo-font">
            {downloadedNotes.length}
          </div>
          <div className="text-[11px] opacity-60 mt-1">Available without internet</div>
        </div>
        <div className="eb-card">
          <div className="text-xs font-bold opacity-70">Local Cache Used</div>
          <div className="text-3xl font-black mt-1 text-[var(--ink)] logo-font">
            5.3 MB
          </div>
          <div className="text-[11px] opacity-60 mt-1">IndexedDB browser storage</div>
        </div>
        <div className="eb-card">
          <div className="text-xs font-bold opacity-70">PWA Offline Sync</div>
          <div className="text-3xl font-black mt-1 text-[var(--mint)] logo-font">
            Ready ✓
          </div>
          <div className="text-[11px] opacity-60 mt-1">Background synchronization enabled</div>
        </div>
      </div>

      {/* Downloaded Notes Grid */}
      <div className="space-y-3">
        <h3 className="text-base font-black text-[var(--ink)]">
          Locally Cached Study Notes ({downloadedNotes.length})
        </h3>

        {downloadedNotes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {downloadedNotes.map((note) => (
              <div
                key={note.id}
                className="eb-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="eb-tag text-xs bg-[var(--mango)]">
                      {note.subject}
                    </span>
                    <span className="text-[10px] font-bold text-[var(--chilli)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--chilli)]" />
                      Cached
                    </span>
                  </div>
                  <h4 className="font-extrabold text-sm mb-1">{note.title}</h4>
                  <div className="text-xs opacity-70">Saved: {note.date}</div>
                </div>

                <div className="pt-3 border-t border-[var(--ink)]/15 mt-3 flex justify-end">
                  <button
                    onClick={() => onOpenNote(note)}
                    className="eb-btn sm text-xs w-full"
                  >
                    📖 Read Offline
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="eb-card text-center py-10">
            <p className="font-bold text-sm">No notes downloaded yet.</p>
            <p className="text-xs opacity-60 mt-1">
              Visit the Notes Library and click "Download" on any note to cache it for offline reading.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
