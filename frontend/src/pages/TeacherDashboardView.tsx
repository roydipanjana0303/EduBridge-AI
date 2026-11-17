import React, { useState } from 'react';
import { UserProfile, NoteItem } from '../types';
import { AppIcon } from '../components/Icons';

interface TeacherDashboardProps {
  user: UserProfile;
  notes: NoteItem[];
  onAddNote: (note: Omit<NoteItem, 'id'>) => void;
  onToast: (msg: string) => void;
}

interface StudentPerformance {
  id: string;
  name: string;
  subject: string;
  lastScore: string;
  streak: number;
  status: 'Needs Help' | 'Consistent' | 'Top Performer';
}

const INITIAL_STUDENTS: StudentPerformance[] = [
  { id: 's1', name: 'Aarav Sharma', subject: 'Physics & Maths', lastScore: '4/4 (100%)', streak: 6, status: 'Consistent' },
  { id: 's2', name: 'Kavya Verma', subject: 'Mechanics', lastScore: '3/4 (75%)', streak: 12, status: 'Top Performer' },
  { id: 's3', name: 'Sana Patel', subject: 'Calculus', lastScore: '2/4 (50%)', streak: 2, status: 'Needs Help' },
  { id: 's4', name: 'Rahul Joshi', subject: 'Python DSA', lastScore: '4/4 (100%)', streak: 9, status: 'Top Performer' },
];

export const TeacherDashboardView: React.FC<TeacherDashboardProps> = ({
  user,
  notes,
  onAddNote,
  onToast,
}) => {
  const [students] = useState<StudentPerformance[]>(INITIAL_STUDENTS);

  // New Note state
  const [noteTitle, setNoteTitle] = useState('');
  const [noteSubject, setNoteSubject] = useState('Physics');

  // Quick Quiz Creator state
  const [quizQuestion, setQuizQuestion] = useState('');
  const [quizSubject, setQuizSubject] = useState('Physics');
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [correctOpt, setCorrectOpt] = useState(0);

  // Pending doubts
  const [pendingDoubts, setPendingDoubts] = useState([
    { id: 'pd1', student: 'Aarav', question: 'Why does static friction increase proportionally with applied lateral force up to a limiting threshold?', reply: '' },
    { id: 'pd2', student: 'Sana', question: 'How do we evaluate the integral of x * e^(x²) using substitution vs integration by parts?', reply: '' },
  ]);

  const handleUploadNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) {
      onToast('Please enter a note title');
      return;
    }

    onAddNote({
      title: noteTitle.trim(),
      subject: noteSubject,
      date: 'Today',
      isOffline: false,
      fileSize: '2.1 MB',
    });

    setNoteTitle('');
    onToast(`Study material published to all enrolled students! 📚`);
  };

  const handlePublishQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizQuestion.trim() || !optA.trim() || !optB.trim()) {
      onToast('Please fill in question text and at least 2 options');
      return;
    }

    onToast(`Diagnostic quiz published in ${quizSubject}! Students notified 🔔`);
    setQuizQuestion('');
    setOptA('');
    setOptB('');
    setOptC('');
  };

  const handleReplyDoubt = (id: string) => {
    const doubt = pendingDoubts.find((d) => d.id === id);
    if (!doubt?.reply.trim()) {
      onToast('Please write a reply before sending');
      return;
    }

    setPendingDoubts((prev) => prev.filter((d) => d.id !== id));
    onToast(`Answer sent to ${doubt.student}! Marked as resolved ✓`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--mango)] text-[#071B2B] font-bold text-xs mb-2 border border-[var(--ink)]">
          👩‍🏫 Teacher & Mentor Control Portal
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Welcome, {user.name}
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Manage courses, publish syllabus notes, create active diagnostic quizzes, and respond to student inquiries.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="eb-card bg-[var(--mango)] text-[#071B2B]">
          <div className="text-xs font-black uppercase opacity-80">Enrolled Students</div>
          <div className="text-4xl font-black mt-2 logo-font">24</div>
          <div className="text-[11px] font-bold mt-1 opacity-80">Across 3 study batches</div>
        </div>

        <div className="eb-card">
          <div className="text-xs font-black uppercase opacity-70">Doubts In Queue</div>
          <div className="text-4xl font-black mt-2 text-[var(--chilli)] logo-font">
            {pendingDoubts.length}
          </div>
          <div className="text-[11px] opacity-70 mt-1">Pending review today</div>
        </div>

        <div className="eb-card">
          <div className="text-xs font-black uppercase opacity-70">Class Notes Shared</div>
          <div className="text-4xl font-black mt-2 text-[var(--ink)] logo-font">
            {notes.length}
          </div>
          <div className="text-[11px] opacity-70 mt-1">Indexed in student libraries</div>
        </div>

        <div className="eb-card">
          <div className="text-xs font-black uppercase opacity-70">Cohort Accuracy</div>
          <div className="text-4xl font-black mt-2 text-[var(--mint)] logo-font">
            78%
          </div>
          <div className="text-[11px] opacity-70 mt-1">Average on diagnostic tests</div>
        </div>
      </div>

      {/* Main Grid: Pending Doubts & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Student Doubts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="eb-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-black logo-font">
                Pending Student Doubts ({pendingDoubts.length})
              </h3>
              <span className="eb-chip text-xs">Priority Queue</span>
            </div>

            {pendingDoubts.length > 0 ? (
              <div className="space-y-4">
                {pendingDoubts.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl bg-[var(--soft)] border border-[var(--ink)]/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-[var(--ink)]">
                        From: <b className="text-[var(--chilli)]">{d.student}</b>
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--card)] border border-[var(--ink)]/20">
                        Awaiting Answer
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-[var(--ink)] leading-relaxed">
                      "{d.question}"
                    </p>

                    <div className="space-y-2 pt-2 border-t border-[var(--ink)]/15">
                      <input
                        type="text"
                        placeholder={`Write clarification for ${d.student}...`}
                        value={d.reply}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPendingDoubts((prev) =>
                            prev.map((item) => (item.id === d.id ? { ...item, reply: val } : item))
                          );
                        }}
                        className="eb-input py-1.5 text-xs"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={() => handleReplyDoubt(d.id)}
                          className="eb-btn sm text-xs font-bold"
                        >
                          Send Answer & Mark Done ✓
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="font-bold text-sm text-[var(--mint)]">All student doubts resolved! 🎉</p>
                <p className="text-xs opacity-70 mt-1">Your inbox is clear for the day.</p>
              </div>
            )}
          </div>

          {/* Student Performance Roster */}
          <div className="eb-card">
            <h3 className="text-lg font-black logo-font mb-3">Enrolled Student Cohort</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[var(--ink)]/20 opacity-70">
                    <th className="pb-2 font-bold">Student</th>
                    <th className="pb-2 font-bold">Focus Area</th>
                    <th className="pb-2 font-bold">Latest Score</th>
                    <th className="pb-2 font-bold">Streak</th>
                    <th className="pb-2 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--ink)]/10">
                  {students.map((st) => (
                    <tr key={st.id} className="py-2.5">
                      <td className="py-2.5 font-bold">{st.name}</td>
                      <td className="py-2.5 opacity-80">{st.subject}</td>
                      <td className="py-2.5 font-bold text-[var(--chilli)]">{st.lastScore}</td>
                      <td className="py-2.5">{st.streak} days 🔥</td>
                      <td className="py-2.5">
                        <span
                          className={`eb-tag text-[10px] ${
                            st.status === 'Needs Help'
                              ? 'bg-[var(--soft)] text-[var(--chilli)]'
                              : 'bg-[var(--mango)]'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Teacher Actions */}
        <div className="lg:col-span-5 space-y-4">
          {/* Upload Notes Form */}
          <div className="eb-card">
            <h3 className="text-base font-black logo-font mb-3 flex items-center gap-2">
              <AppIcon name="upload" className="w-4 h-4 text-[var(--chilli)]" />
              <span>Publish Study Notes to Class</span>
            </h3>
            <form onSubmit={handleUploadNote} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 opacity-80">Document Title</label>
                <input
                  type="text"
                  placeholder="e.g., Electromagnetic Waves Lecture 4 Notes"
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  className="eb-input py-1.5 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-80">Subject Category</label>
                <select
                  value={noteSubject}
                  onChange={(e) => setNoteSubject(e.target.value)}
                  className="eb-select py-1.5 text-xs"
                >
                  <option value="Physics">Physics</option>
                  <option value="Maths">Maths</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Biology">Biology</option>
                  <option value="CS">Computer Science</option>
                </select>
              </div>

              <div className="p-3 rounded-xl border border-dashed border-[var(--ink)]/40 text-center bg-[var(--soft)] text-xs">
                <span>📎 Drag and drop PDF here or </span>
                <span className="font-bold underline cursor-pointer text-[var(--chilli)]">Browse</span>
              </div>

              <button type="submit" className="eb-btn red text-xs font-bold w-full py-2">
                Publish Document to Students
              </button>
            </form>
          </div>

          {/* Create Diagnostic Quiz Form */}
          <div className="eb-card">
            <h3 className="text-base font-black logo-font mb-3 flex items-center gap-2">
              <AppIcon name="quiz" className="w-4 h-4 text-[var(--chilli)]" />
              <span>Publish Quick Quiz Question</span>
            </h3>
            <form onSubmit={handlePublishQuiz} className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1 opacity-80">Question Text</label>
                <input
                  type="text"
                  placeholder="e.g. What is the SI unit of Magnetic Flux?"
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  className="eb-input py-1.5 text-xs"
                />
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Option A (e.g. Tesla)"
                  value={optA}
                  onChange={(e) => setOptA(e.target.value)}
                  className="eb-input py-1 text-xs"
                />
                <input
                  type="text"
                  placeholder="Option B (e.g. Weber)"
                  value={optB}
                  onChange={(e) => setOptB(e.target.value)}
                  className="eb-input py-1 text-xs"
                />
                <input
                  type="text"
                  placeholder="Option C (e.g. Henry)"
                  value={optC}
                  onChange={(e) => setOptC(e.target.value)}
                  className="eb-input py-1 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1 opacity-80">Correct Answer</label>
                <select
                  value={correctOpt}
                  onChange={(e) => setCorrectOpt(Number(e.target.value))}
                  className="eb-select py-1 text-xs"
                >
                  <option value={0}>Option A</option>
                  <option value={1}>Option B</option>
                  <option value={2}>Option C</option>
                </select>
              </div>

              <button type="submit" className="eb-btn text-xs font-bold w-full py-2">
                Deploy Quiz to Enrolled Batches
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
