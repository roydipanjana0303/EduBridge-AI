import React, { useState, useRef, useEffect } from 'react';

interface AIMessage {
  id: string;
  sender: 'ai' | 'me';
  text: string;
}

export const AIView: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! I am your EduBridge Academic Assistant. I can ground explanations in your uploaded notes, break down tricky equations, generate practice quiz questions, or design your weekly study timetable.',
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const QUICK_PROMPTS = [
    'Explain Photosynthesis & Light Reactions',
    'Quiz me on Newton’s Laws',
    'Plan my study week for Boards',
    'Derive Kinetic Energy Formula',
    'Difference between Stack and Queue',
  ];

  const handleAsk = (queryText?: string) => {
    const q = (queryText || inputVal).trim();
    if (!q) return;

    const userMsg: AIMessage = { id: Date.now().toString(), sender: 'me', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = '';
      const lower = q.toLowerCase();

      if (lower.includes('photo')) {
        reply =
          '🌱 Photosynthesis is the biochemical process by which plants convert light energy into chemical energy stored in glucose:\n\n1. Light-Dependent Reactions (in Thylakoid membranes): Chlorophyll absorbs photons, splitting H₂O into electrons, protons, and releasing O₂. ATP and NADPH are synthesized.\n2. Light-Independent Calvin Cycle (in Stroma): Carbon fixation uses ATP and NADPH to convert CO₂ into 3-carbon sugars (G3P).\n\n💡 Pro Tip: Think of thylakoids as solar panels, and stroma as the sugar factory!';
      } else if (lower.includes('newton') || lower.includes('force')) {
        reply =
          '⚡ Newton’s Laws in a nutshell:\n\n1. 1st Law (Inertia): An object remains at rest or constant velocity unless acted upon by a net external force.\n2. 2nd Law (Dynamics): Net force equals rate of change of momentum (F = dp/dt = m · a for constant mass).\n3. 3rd Law (Action-Reaction): Whenever object A exerts a force on object B, object B exerts an equal and opposite force on object A (FAB = -FBA).\n\nNotice: Action and reaction act on DIFFERENT bodies, which is why they never cancel each other out!';
      } else if (lower.includes('quiz')) {
        reply =
          '🎯 Quick Practice Question:\n\n"A ball is thrown vertically upward with velocity v. At the highest point of its trajectory, what are its velocity and acceleration?"\n\nOptions:\nA) v = 0, a = 0\nB) v = 0, a = 9.8 m/s² downward\nC) v = v, a = 9.8 m/s² upward\n\nTake your guess, or visit the Assessments tab for full scored practice with credit points!';
      } else if (lower.includes('plan') || lower.includes('week')) {
        reply =
          '📅 Optimal 7-Day Study Cadence:\n\n• Monday: Physics mechanics & concept notes revision (2 hrs)\n• Tuesday: Calculus problem sets (Integration substitution) (1.5 hrs)\n• Wednesday: Organic chemistry reaction mechanisms + Q&A doubt resolution (2 hrs)\n• Thursday: Computer Science DSA / Python data structures (1.5 hrs)\n• Friday: Weekly mock quiz in Assessments tab + weak area review (2 hrs)\n• Weekend: Join voice study rooms for group recap + Study Gap Recovery plan review.';
      } else {
        reply = `Great query on "${q}"! Let’s break it down into first principles:\n\n1. Core Definition: Identify the underlying fundamental definitions and governing laws.\n2. Step-by-Step Derivation: Analyze how boundary constraints or formulas apply.\n3. Common Pitfall: Many students confuse intuition with formal proofs here. Review your saved notes in the Notes Library for grounded reference.\n\nWould you like me to generate a 2-question test on this topic?`;
      }

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: reply },
      ]);
      setIsTyping(false);
    }, 750);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          AI Academic Assistant
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Ask questions grounded in your course materials, request concept breakdowns, or get a custom revision plan.
        </p>
      </div>

      <div className="eb-card flex flex-col h-[540px] p-4 sm:p-5">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {messages.map((m) => {
            const isMe = m.sender === 'me';
            return (
              <div
                key={m.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border shadow-sm ${
                    isMe
                      ? 'bg-[var(--mango)] text-[#071B2B] border-[var(--ink)]/30 rounded-br-sm font-semibold'
                      : 'bg-[var(--soft)] text-[var(--ink)] border-[var(--ink)]/20 rounded-bl-sm whitespace-pre-line'
                  }`}
                >
                  {!isMe && (
                    <div className="flex items-center gap-1.5 text-[11px] font-black text-[var(--chilli)] mb-1 uppercase tracking-wider">
                      <span>✨</span> EduBridge AI Assistant
                    </div>
                  )}
                  {m.text}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start">
              <div className="p-3 rounded-2xl bg-[var(--soft)] text-xs font-bold text-[var(--chilli)] flex items-center gap-2 border border-[var(--ink)]/15">
                <span className="live-dot" />
                <span>AI is formulating grounded response...</span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Quick prompt chips */}
        <div className="pt-3 pb-2 flex flex-wrap gap-1.5 border-t border-[var(--ink)]/15">
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleAsk(prompt)}
              className="eb-chip text-[11px] py-1 hover:border-[var(--chilli)]"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input box */}
        <div className="pt-2 flex gap-2">
          <input
            type="text"
            placeholder="Ask anything about your syllabus or saved notes..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAsk()}
            className="eb-input py-2 text-sm flex-1"
          />
          <button
            onClick={() => handleAsk()}
            className="eb-btn red text-sm font-black px-5"
          >
            Ask AI ↵
          </button>
        </div>
      </div>
    </div>
  );
};
