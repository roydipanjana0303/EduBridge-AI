import React, { useState, useRef, useEffect } from 'react';
import { MentorProfile } from '../types';
import { ApiService } from '../services/api';

interface ChatViewProps {
  mentors: MentorProfile[];
  onSendMessage: (mentorId: string, text: string) => void;
  onToast: (msg: string) => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  mentors,
  onSendMessage,
  onToast,
}) => {
  const [activeMentorId, setActiveMentorId] = useState<string>(mentors[0]?.id || 'm1');
  const [inputText, setInputText] = useState('');
  const [isAiReplying, setIsAiReplying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeMentor = mentors.find((m) => m.id === activeMentorId) || mentors[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMentor?.messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isAiReplying) return;

    const userText = inputText.trim();
    setInputText('');

    // Add user message immediately
    onSendMessage(activeMentor.id, userText);
    setIsAiReplying(true);

    try {
      // Build history from existing messages for context
      const history = (activeMentor.messages || []).slice(-10).map((msg) => ({
        role: msg.sender === 'me' ? ('user' as const) : ('model' as const),
        text: msg.text,
      }));

      // System context so AI replies as a subject-matter mentor
      const systemPrompt = `You are ${activeMentor.name}, an expert ${activeMentor.subject} mentor on EduBridge AI. Answer the student's question concisely and helpfully. Keep responses under 3 sentences.`;

      const response = await ApiService.askAI({
        message: `[Student question for ${activeMentor.subject} mentor]: ${userText}`,
        history,
        systemPrompt,
      });

      // Add AI mentor reply
      onSendMessage(activeMentor.id, `[AI Mentor] ${response.answer || response.text || 'I am here to help! Could you elaborate on your question?'}`);
    } catch {
      // Fallback to helpful static reply if AI is unavailable
      const fallbacks: Record<string, string[]> = {
        m1: [
          'Look at the free body diagram and resolve forces along the inclined plane.',
          'Review the formula sheet for static vs kinetic friction differences.',
          'Great question! Work through each step and check your signs carefully.',
        ],
        m2: [
          'Try substitution: let u = the inner expression and find du.',
          'Check your limits of integration when using trigonometric substitution.',
          'Double-check your algebra at each step — small errors compound quickly.',
        ],
        m3: [
          'Check your base case first — without it, recursion causes a stack overflow.',
          'Your time complexity looks like O(N log N). Can you justify that?',
          'Write a small test case first, then trace through the algorithm manually.',
        ],
      };
      const list = fallbacks[activeMentor.id] || fallbacks['m1'];
      const reply = list[Math.floor(Math.random() * list.length)];
      onSendMessage(activeMentor.id, reply);
    } finally {
      setIsAiReplying(false);
    }
  };

  const handleShareFile = () => {
    onToast('Attachment uploaded: Doubt_Diagram_Revision.pdf 📎');
    onSendMessage(activeMentor.id, '📎 Shared file: Doubt_Diagram_Revision.pdf');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Student–Mentor Chat
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Direct 1-on-1 access to verified subject mentors. Ask doubts, share code or calculations, and get unstuck.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* Mentor Directory */}
        <div className="md:col-span-4 space-y-2">
          <div className="text-xs font-black uppercase tracking-wider opacity-70 px-1 mb-2">
            Available Mentors
          </div>
          {mentors.map((m) => {
            const isSelected = m.id === activeMentorId;
            return (
              <button
                key={m.id}
                onClick={() => setActiveMentorId(m.id)}
                className={`w-full eb-card text-left p-3 flex items-center gap-3 transition-all ${
                  isSelected
                    ? 'border-2 border-[var(--chilli)] bg-[var(--soft)] shadow-md'
                    : 'hover:bg-[var(--soft)]/50'
                }`}
              >
                <span
                  className="eb-avatar w-10 h-10 text-sm font-black"
                  style={{ backgroundColor: m.avatarColor }}
                >
                  {m.name.charAt(0)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm truncate">{m.name}</span>
                    <span className="text-[10px] font-bold text-[var(--chilli)]">{m.subject}</span>
                  </div>
                  <div className="text-xs opacity-70 flex items-center gap-1.5 mt-0.5">
                    <span className={`w-2 h-2 rounded-full ${m.status === 'Online' ? 'bg-[var(--mint)]' : 'bg-gray-400'}`} />
                    <span>{m.status}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat Thread */}
        <div className="md:col-span-8 eb-card flex flex-col h-[520px] p-4 sm:p-5">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[var(--ink)]/15">
            <div className="flex items-center gap-3">
              <span
                className="eb-avatar w-9 h-9 text-sm"
                style={{ backgroundColor: activeMentor.avatarColor }}
              >
                {activeMentor.name.charAt(0)}
              </span>
              <div>
                <h3 className="font-extrabold text-sm">{activeMentor.name}</h3>
                <span className="text-xs opacity-70">{activeMentor.subject} Specialization • AI-powered responses</span>
              </div>
            </div>
            <button
              onClick={handleShareFile}
              className="eb-btn ghost sm text-xs"
              title="Share file or diagram"
            >
              📎 Share File
            </button>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {activeMentor.messages.map((msg) => {
              const isMe = msg.sender === 'me';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border border-[var(--ink)]/20 shadow-sm ${
                      isMe
                        ? 'bg-[var(--mango)] text-[#071B2B] rounded-br-sm'
                        : 'bg-[var(--soft)] text-[var(--ink)] rounded-bl-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
            {isAiReplying && (
              <div className="flex justify-start">
                <div className="max-w-[82%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-medium border border-[var(--ink)]/20 shadow-sm bg-[var(--soft)] text-[var(--ink)] rounded-bl-sm opacity-60">
                  <span className="animate-pulse">✦ Mentor is typing…</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <form onSubmit={handleSend} className="pt-3 border-t border-[var(--ink)]/15 flex gap-2">
            <input
              type="text"
              placeholder={`Message ${activeMentor.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="eb-input py-2 text-sm flex-1"
              disabled={isAiReplying}
            />
            <button
              type="submit"
              className="eb-btn text-sm font-bold px-4"
              disabled={isAiReplying || !inputText.trim()}
            >
              {isAiReplying ? '…' : 'Send ↵'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
