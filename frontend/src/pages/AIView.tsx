import React, { useState, useRef, useEffect } from 'react';
import { ApiService } from '../services/api';

interface AIMessage {
  id: string;
  sender: 'ai' | 'me';
  text: string;
}

interface ConversationTurn {
  role: 'user' | 'model';
  content: string;
}

export const AIView: React.FC = () => {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      sender: 'ai',
      text: 'Namaste! I am your EduBridge Academic Assistant powered by Google Gemini AI. I can explain concepts step-by-step, break down tricky equations, generate practice quiz questions, or design your weekly study timetable. How can I help you today?',
    },
  ]);
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const QUICK_PROMPTS = [
    'Explain Photosynthesis & Light Reactions',
    'Quiz me on Newton\'s Laws',
    'Plan my study week for Boards',
    'Derive Kinetic Energy Formula',
    'Difference between Stack and Queue',
  ];

  const handleAsk = async (queryText?: string) => {
    const q = (queryText || inputVal).trim();
    if (!q || isTyping) return;

    const userMsg: AIMessage = { id: Date.now().toString(), sender: 'me', text: q };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Build new history entry
    const newHistory: ConversationTurn[] = [...history, { role: 'user', content: q }];

    try {
      const response = await ApiService.askAI({
        message: q,
        history: history,
      });

      const aiText = response.answer || 'Sorry, I could not generate a response. Please try again.';

      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), sender: 'ai', text: aiText },
      ]);

      // Update history with both user msg and AI response
      setHistory([...newHistory, { role: 'model', content: aiText }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: 'The AI service is currently starting up. Please ensure the ai-service is running (run `start.bat` in the ai-service folder), then try again.',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void handleAsk();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          AI Academic Assistant
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Powered by Google Gemini AI — Ask questions, request concept breakdowns, or get a custom revision plan.
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
                      <span>✨</span> EduBridge AI (Gemini)
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
                <span>Gemini AI is generating a response...</span>
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
              onClick={() => void handleAsk(prompt)}
              disabled={isTyping}
              className="eb-chip text-[11px] py-1 hover:border-[var(--chilli)] disabled:opacity-50"
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
            onKeyDown={handleKeyDown}
            disabled={isTyping}
            className="eb-input py-2 text-sm flex-1 disabled:opacity-60"
          />
          <button
            onClick={() => void handleAsk()}
            disabled={isTyping || !inputVal.trim()}
            className="eb-btn red text-sm font-black px-5 disabled:opacity-50"
          >
            {isTyping ? '...' : 'Ask AI ↵'}
          </button>
        </div>
      </div>
    </div>
  );
};
