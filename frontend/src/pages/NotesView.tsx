import React, { useRef, useState } from 'react';
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
  General: '#E2E8F0',
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

  // File upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileType, setFileType] = useState<'pdf' | 'docx' | 'image' | 'text'>('text');
  const [fileSizeStr, setFileSizeStr] = useState<string>('1.5 MB');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const subjects = ['All', 'Physics', 'Maths', 'Chemistry', 'Biology', 'CS', 'General'];

  const filteredNotes = notes.filter((n) => {
    const matchesSubj = selectedSubject === 'All' || n.subject === selectedSubject;
    const matchesSearch =
      n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.subject.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubj && matchesSearch;
  });

  const processFile = (file: File) => {
    setSelectedFile(file);

    // Format file size
    const sizeInBytes = file.size;
    const formattedSize =
      sizeInBytes < 1024 * 1024
        ? `${Math.round(sizeInBytes / 1024)} KB`
        : `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    setFileSizeStr(formattedSize);

    // Determine type
    const name = file.name.toLowerCase();
    let type: 'pdf' | 'docx' | 'image' | 'text' = 'text';
    if (name.endsWith('.pdf')) {
      type = 'pdf';
    } else if (name.endsWith('.docx') || name.endsWith('.doc')) {
      type = 'docx';
    } else if (file.type.startsWith('image/') || /\.(png|jpe?g|webp|gif|svg)$/i.test(name)) {
      type = 'image';
    }
    setFileType(type);

    // Auto-fill title if user hasn't typed one
    if (!newTitle.trim()) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      setNewTitle(cleanName);
    }

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onToast(`Selected: ${file.name} (${formattedSize})`);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFileDataUrl('');
    setFileType('text');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      onToast('Please enter a note title or choose a file first.');
      return;
    }

    onAddNote({
      title: newTitle.trim(),
      subject: newSubject,
      date: 'Today',
      isOffline: false,
      fileSize: fileSizeStr,
      fileType: selectedFile ? fileType : 'text',
      fileName: selectedFile?.name,
      fileUrl: fileDataUrl || undefined,
    });

    setNewTitle('');
    clearSelectedFile();
    onToast(`Note saved successfully! +10 credits awarded 🎉`);
  };

  const downloadNoteFile = (note: NoteItem) => {
    if (note.fileUrl) {
      const a = document.createElement('a');
      a.href = note.fileUrl;
      a.download = note.fileName || `${note.title.replace(/\s+/g, '_')}.${note.fileType === 'image' ? 'png' : note.fileType || 'pdf'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      onToast(`Downloading ${note.title} 📥`);
    } else {
      // Generated summary fallback for mock notes
      const content = `EduBridge AI - Study Note\n\nTitle: ${note.title}\nSubject: ${note.subject}\nDate: ${note.date}\nSize: ${note.fileSize || 'Standard'}\n\nKey Concepts:\n- Comprehensive review notes.\n- Formula derivations.\n- Important exam checkpoints.`;
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${note.title.replace(/[^a-zA-Z0-9]/g, '_')}_notes.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onToast(`Downloaded note summary 📥`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Smart Notes Library
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Upload, organize, and access PDFs, Word documents, and photo snapshots of your handwritten notes anytime.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="Search notes & documents..."
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

      {/* Upload Note Card with Real File Support */}
      <div className="eb-card border-2 border-[var(--ink)] bg-[var(--card)] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wide opacity-80">
            Upload Study Material (PDF, DOCX, or Photos)
          </h3>
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[var(--mango)] text-[#071B2B]">
            +10 Credits per note
          </span>
        </div>

        {/* Drag & Drop Zone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[var(--chilli)] bg-[var(--soft)]/70 scale-[0.99]'
              : 'border-[var(--ink)]/30 hover:border-[var(--ink)] hover:bg-[var(--soft)]/40'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,image/*,.png,.jpg,.jpeg,.webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {selectedFile ? (
            <div className="flex flex-col items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--soft)] border border-[var(--ink)]/20 text-xs font-bold text-[var(--ink)]">
                <span>
                  {fileType === 'pdf' && '📄 PDF Document'}
                  {fileType === 'docx' && '📝 Word Document (.docx)'}
                  {fileType === 'image' && '🖼️ Photo / Scan'}
                  {fileType === 'text' && '📄 File'}
                </span>
                <span className="text-[var(--chilli)] font-extrabold">{selectedFile.name}</span>
                <span className="opacity-60">({fileSizeStr})</span>
                <button
                  type="button"
                  onClick={clearSelectedFile}
                  className="ml-2 text-red-500 hover:text-red-700 font-black"
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
              <p className="text-[11px] opacity-70">Click to choose a different file</p>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-2xl">📁</div>
              <div className="text-xs sm:text-sm font-bold text-[var(--ink)]">
                Click to browse or drag & drop files here
              </div>
              <div className="text-[11px] opacity-70">
                Supports <b>PDF</b>, <b>DOCX</b>, and <b>Photos / Handwritten Scans</b> (PNG, JPG, WebP)
              </div>
            </div>
          )}
        </div>

        {/* Note Metadata Form */}
        <form onSubmit={handleUpload} className="flex flex-wrap gap-2.5">
          <input
            type="text"
            placeholder="Note title (e.g. Thermodynamics summary & formulas)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="eb-input flex-1 min-w-[240px] text-sm"
            required
          />

          <select
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="eb-select w-auto min-w-[130px] text-sm font-bold"
          >
            <option value="Physics">Physics</option>
            <option value="Maths">Maths</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Biology">Biology</option>
            <option value="CS">CS</option>
            <option value="General">General</option>
          </select>

          <button type="submit" className="eb-btn red text-sm font-bold whitespace-nowrap">
            + Save Note (+10 pts)
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
                {/* Photo Thumbnail if note has an image */}
                {note.fileType === 'image' && note.fileUrl && (
                  <div
                    className="w-full h-36 rounded-lg mb-3 overflow-hidden bg-black/5 border border-[var(--ink)]/15 cursor-pointer"
                    onClick={() => setPreviewNote(note)}
                  >
                    <img
                      src={note.fileUrl}
                      alt={note.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <span
                    className="eb-tag text-xs font-bold"
                    style={{ backgroundColor: color }}
                  >
                    {note.subject}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {note.fileType === 'pdf' && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-300">
                        PDF
                      </span>
                    )}
                    {note.fileType === 'docx' && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-300">
                        DOCX
                      </span>
                    )}
                    {note.fileType === 'image' && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                        PHOTO
                      </span>
                    )}

                    {note.isOffline && (
                      <span className="text-[11px] font-bold text-[var(--chilli)] flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--chilli)]" />
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-extrabold text-base leading-snug mb-1 text-[var(--ink)]">
                  {note.title}
                </h3>
                <div className="text-xs opacity-70 mb-4">
                  Saved {note.date} • {note.fileSize || '2 MB'}
                  {note.fileName && <span className="block truncate opacity-80 mt-0.5">📎 {note.fileName}</span>}
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
                  onClick={() => downloadNoteFile(note)}
                  className="eb-btn ghost sm text-xs"
                  title="Download file to device"
                >
                  ⬇ Download
                </button>
                <button
                  onClick={() => {
                    onToggleOffline(note.id);
                    onToast(note.isOffline ? 'Removed from offline storage' : 'Cached for offline reading');
                  }}
                  className={`eb-btn ghost sm text-xs ${note.isOffline ? 'text-[var(--chilli)] font-bold' : ''}`}
                  title={note.isOffline ? 'Available offline' : 'Save offline'}
                >
                  {note.isOffline ? '✓ Cached' : '⚡ Cache'}
                </button>
              </div>
            </div>
          );
        })}

        {filteredNotes.length === 0 && (
          <div className="col-span-full py-12 text-center eb-card">
            <p className="text-base font-bold opacity-80">No notes found matching your filter.</p>
            <p className="text-xs opacity-60 mt-1">Upload a PDF, Word document, or Photo above to start your library.</p>
          </div>
        )}
      </div>

      {/* Note Reader & Document Preview Modal */}
      {previewNote && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="eb-card bg-[var(--card)] max-w-2xl w-full max-h-[90vh] flex flex-col p-6 shadow-2xl relative">
            <div className="flex items-start justify-between pb-3 border-b border-[var(--ink)]/20">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="eb-tag text-xs"
                    style={{ backgroundColor: SUBJECT_COLORS[previewNote.subject] || '#B9E4E8' }}
                  >
                    {previewNote.subject}
                  </span>
                  {previewNote.fileType && (
                    <span className="text-[10px] font-black uppercase tracking-wider text-[var(--chilli)]">
                      {previewNote.fileType === 'pdf' && 'PDF Document'}
                      {previewNote.fileType === 'docx' && 'Word Document'}
                      {previewNote.fileType === 'image' && 'Photo / Scan'}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-black">{previewNote.title}</h3>
                <p className="text-xs opacity-70">
                  Saved on {previewNote.date} • {previewNote.fileSize || 'Standard'}
                </p>
              </div>
              <button
                onClick={() => setPreviewNote(null)}
                className="w-8 h-8 rounded-lg border border-[var(--ink)] flex items-center justify-center font-bold hover:bg-[var(--soft)]"
              >
                ✕
              </button>
            </div>

            {/* Document Content View */}
            <div className="my-4 overflow-y-auto space-y-3 text-sm leading-relaxed pr-1 flex-1">
              {/* Photo preview */}
              {previewNote.fileType === 'image' && previewNote.fileUrl ? (
                <div className="flex flex-col items-center gap-2">
                  <img
                    src={previewNote.fileUrl}
                    alt={previewNote.title}
                    className="w-full max-h-[50vh] object-contain rounded-xl border border-[var(--ink)]/20 bg-black/5"
                  />
                  <p className="text-xs opacity-70">High-resolution photo / handwritten note scan</p>
                </div>
              ) : previewNote.fileType === 'pdf' && previewNote.fileUrl ? (
                /* PDF embedded viewer */
                <div className="space-y-2">
                  <iframe
                    src={previewNote.fileUrl}
                    className="w-full h-[48vh] rounded-xl border border-[var(--ink)]/20"
                    title={previewNote.title}
                  />
                  <p className="text-xs opacity-70 text-center">Interactive PDF document viewer</p>
                </div>
              ) : previewNote.fileType === 'docx' ? (
                /* Word DOCX preview */
                <div className="p-5 rounded-xl bg-[var(--soft)] border border-[var(--ink)]/20 space-y-2 text-center">
                  <div className="text-4xl">📝</div>
                  <h4 className="font-black text-base">{previewNote.fileName || `${previewNote.title}.docx`}</h4>
                  <p className="text-xs opacity-75">
                    Microsoft Word Document • {previewNote.fileSize}
                  </p>
                  <p className="text-xs max-w-md mx-auto opacity-70">
                    Click <strong>"Download File"</strong> below to open and edit in Word, LibreOffice, or Google Docs.
                  </p>
                </div>
              ) : (
                /* Standard mock note summary */
                <div className="space-y-3">
                  <p className="p-3 rounded-xl bg-[var(--soft)] border border-[var(--ink)]/20 font-mono text-xs">
                    📄 Verified Note: {previewNote.title}
                  </p>
                  <h4 className="font-bold text-sm">Key Concepts & Principles:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs">
                    <li>Primary formula derivations and fundamental laws.</li>
                    <li>Step-by-step example problem resolutions and boundary conditions.</li>
                    <li>High-frequency board & competitive examination questions.</li>
                  </ul>
                  <div className="p-3 rounded-xl bg-[var(--mango)] text-[#071B2B] text-xs font-semibold">
                    💡 Tip: Ask the <b>AI Academic Assistant</b> to explain or quiz you on this topic!
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[var(--ink)]/20 flex flex-wrap justify-between items-center gap-2">
              <button
                onClick={() => {
                  onToggleOffline(previewNote.id);
                  onToast(previewNote.isOffline ? 'Removed from offline' : 'Cached for offline use');
                  setPreviewNote({ ...previewNote, isOffline: !previewNote.isOffline });
                }}
                className="eb-btn ghost sm text-xs"
              >
                {previewNote.isOffline ? '✓ Saved for Offline' : '⚡ Cache Offline'}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => downloadNoteFile(previewNote)}
                  className="eb-btn sm text-xs font-bold"
                >
                  ⬇ Download File
                </button>
                <button
                  onClick={() => setPreviewNote(null)}
                  className="eb-btn red sm text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
