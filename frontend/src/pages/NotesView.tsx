import React, { useState } from 'react';
import { NoteItem } from '../types';
import { AppIcon } from '../components/Icons';

interface NotesViewProps {
  notes: NoteItem[];
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onAddNote: (note: Omit<NoteItem, 'id'>) => void;
  onToggleOffline: (id: string) => void;
  onToast: (msg: string) => void;
}

const SUBJECT_COLORS: Record<string, string> = {
  Physics: '#B9E4E8',
  Maths: '#9ED5DC',
  Chemistry: '#D3EEF1',
  Biology: '#B9E4E8',
  CS: '#9ED5DC',
};

export const NotesView: React.FC<NotesViewProps> = ({
  notes,
  searchTerm,
  onSearchChange,
  onAddNote,
  onToggleOffline,
  onToast,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Physics');
  const [previewNote, setPreviewNote] = useState<NoteItem | null>(null);

  const subjects = ['All', 'Physics', 'Maths', 'Chemistry', 'Biology', 'CS'];

  const filteredNotes = notes.filter((n) => {
    const matchesSubj = selectedSubject === 'All' || n.subject === selectedSubject;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubj && matchesSearch;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onToast('Please enter a note title first');
      return;
    }

    onAddNote({
      title: newTitle.trim(),
      subject: newSubject,
      date: 'Today',
      isOffline: false,
      fileSize: '1.5 MB',
    });

    setNewTitle('');
    onToast(`Note saved! +10 credits awarded.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Smart Notes Library
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Everything you’ve saved, categorized and preserved for years. Access anywhere, online or offline.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="eb-input py-2 text-sm pr-8"
            aria-label="Filter notes"
          />
          <AppIcon name="search" className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 opacity-50" />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {subjects.map((sub) => (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`eb-chip text-xs ${selectedSubject === sub ? 'on' : ''}`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Upload Note Card */}
      <div className="eb-card">
        <h3 className="text-sm font-bold uppercase tracking-wide opacity-80 mb-3">
          Upload New Study Material
        </h3>
        <form onSubmit={handleUpload} className="flex flex-wrap gap-2.5">
          <input
            type="text"
            placeholder="Note title (e.g. Thermodynamics summary & formulas)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="eb-input flex-1 min-w-[220px] text-sm"
          />
          <select
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="eb-select w-auto min-w-[130px] text-sm"
          >
            <option value="Physics">Physics</option>
            <option value="Maths">Maths</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="CS">CS</option>
          </select>
          <button type="submit" className="eb-btn red text-sm font-bold">
            + Upload Note (+10 pts)
          </button>
        </form>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotes.map((note) => {
          const color = SUBJECT_COLORS[note.subject] || '#B9E4E8';
          return (
            <div
              key={note.id}
              className="eb-card flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="eb-tag text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {note.subject}
                  </span>
                  {note.isOffline && (
                    <span className="text-[11px] font-bold text-[var(--chilli)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--chilli)]" />
                      Offline Ready
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-base leading-snug mb-1 text-[var(--ink)]">
                  {note.title}
                </h3>
                <div className="text-xs opacity-70 mb-4">
                  Saved {note.date} • {note.fileSize || '2 MB'}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-3 border-t border-[var(--ink)]/15">
                <button
                  onClick={() => setPreviewNote(note)}
                  className="eb-btn sm text-xs flex-1"
                >
                  📖 Open Note
                </button>
                <button
                  onClick={() => {
                    onToggleOffline(note.id);
                    onToast(note.isOffline ? 'Removed from offline storage' : 'Downloaded for offline reading');
                  }}
                  className={`eb-btn ghost sm text-xs ${note.isOffline ? 'text-[var(--chilli)] font-bold' : ''}`}
                  title={note.isOffline ? 'Available offline' : 'Download to device'}
                >
                  {note.isOffline ? '✓ Downloaded' : '⬇ Download'}
                </button>
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="col-span-full py-12 text-center eb-card">
            <p className="text-base font-bold opacity-80">No notes found matching your filter.</p>
            <p className="text-xs opacity-60 mt-1">Upload a note above or clear your search.</p>
          </div>
        )}
      </div>

      {/* Note Reader Modal */}
      {previewNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="eb-card bg-[var(--card)] max-w-xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl relative">
            <div className="flex items-start justify-between pb-4 border-b border-[var(--ink)]/20">
              <div>
                <span className="eb-tag text-xs mb-1" style={{ backgroundColor: SUBJECT_COLORS[previewNote.subject] }}>
                  {previewNote.subject}
                </span>
                <h3 className="text-xl font-black">{previewNote.title}</h3>
                <p className="text-xs opacity-70">Saved on {previewNote.date} • Verified note</p>
              </div>
              <button
                onClick={() => setPreviewNote(null)}
                className="w-8 h-8 rounded-lg border border-[var(--ink)] flex items-center justify-center font-bold hover:bg-[var(--soft)]"
              >
                ✕
              </button>
            </div>

            <div className="my-4 overflow-y-auto space-y-3 text-sm leading-relaxed pr-2">
              <p className="p-3 rounded-xl bg-[var(--soft)] border border-[var(--ink)]/20 font-mono text-xs">
                📄 Document Content Preview: {previewNote.title}
              </p>
              <h4 className="font-bold text-sm">Key Concepts & Principles:</h4>
              <ul className="list-disc pl-5 space-y-1.5 text-xs">
                <li>Primary definition and mathematical derivation with boundary conditions.</li>
                <li>Standard formulas, units of measurement, and dimensional analysis.</li>
                <li>Exam tips: High-frequency questions and common student pitfalls.</li>
                <li>Worked example problems with step-by-step solutions.</li>
              </ul>
              <div className="p-3 rounded-xl bg-[var(--mango)] text-[#071B2B] text-xs font-semibold">
                💡 Tip: You can query this note directly in the <b>AI Academic Assistant</b> tab using the prompt "Explain this note".
              </div>
            </div>

            <div className="pt-4 border-t border-[var(--ink)]/20 flex justify-end gap-2">
              <button
                onClick={() => {
                  onToggleOffline(previewNote.id);
                  onToast(previewNote.isOffline ? 'Removed from offline' : 'Downloaded for offline use');
                  setPreviewNote({ ...previewNote, isOffline: !previewNote.isOffline });
                }}
                className="eb-btn ghost sm text-xs"
              >
                {previewNote.isOffline ? '✓ Saved for Offline' : '⬇ Save Offline'}
              </button>
              <button
                onClick={() => setPreviewNote(null)}
                className="eb-btn red sm text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
