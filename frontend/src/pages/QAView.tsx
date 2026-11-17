import React, { useState } from 'react';
import { QAItem } from '../types';

interface QAViewProps {
  initialQA: QAItem[];
  userName: string;
  onAddCredits: (amount: number, reason: string) => void;
  onToast: (msg: string) => void;
}

export const QAView: React.FC<QAViewProps> = ({
  initialQA,
  userName,
  onAddCredits,
  onToast,
}) => {
  const [qaList, setQaList] = useState<QAItem[]>(initialQA);
  const [newQuestion, setNewQuestion] = useState('');
  const [answerDrafts, setAnswerDrafts] = useState<Record<string, string>>({});

  const handleAsk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim()) {
      onToast('Please enter your question first');
      return;
    }

    const item: QAItem = {
      id: Date.now().toString(),
      question: newQuestion.trim(),
      askedBy: userName,
      answer: '',
      upvotes: 1,
      time: 'Just now',
    };

    setQaList([item, ...qaList]);
    setNewQuestion('');
    onAddCredits(5, 'Question posted to Q&A! +5 credits');
    onToast('Your doubt was posted to mentors & peers! +5 credits');
  };

  const handleUpvote = (id: string) => {
    setQaList((prev) =>
      prev.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
  };

  const handleAnswerSubmit = (id: string) => {
    const text = answerDrafts[id]?.trim();
    if (!text) {
      onToast('Please write an answer before submitting');
      return;
    }

    setQaList((prev) =>
      prev.map((q) =>
        q.id === id
          ? {
              ...q,
              answer: text,
              answeredBy: `${userName} (Peer Contributor)`,
            }
          : q
      )
    );

    setAnswerDrafts({ ...answerDrafts, [id]: '' });
    onAddCredits(10, 'Contributed an answer! +10 credits');
    onToast('Answer posted successfully! +10 credits');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Doubt Q&A Forum
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Ask complex questions, share working solutions, and earn credits for helping fellow learners.
        </p>
      </div>

      {/* Ask Question Card */}
      <div className="eb-card">
        <h3 className="text-sm font-bold uppercase tracking-wider opacity-80 mb-2">
          Post a Concept Doubt
        </h3>
        <form onSubmit={handleAsk} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your doubt clearly (e.g. Why does friction do negative work on a rolling cylinder?)"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            className="eb-input py-2.5 text-sm flex-1"
          />
          <button type="submit" className="eb-btn red text-sm font-bold whitespace-nowrap">
            Ask Doubt (+5 pts)
          </button>
        </form>
      </div>

      {/* Doubts List */}
      <div className="space-y-4">
        {qaList.map((item) => (
          <div key={item.id} className="eb-card space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base sm:text-lg font-black text-[var(--ink)]">
                {item.question}
              </h3>
              <button
                onClick={() => handleUpvote(item.id)}
                className="eb-btn ghost sm text-xs shrink-0 flex items-center gap-1 font-bold"
                title="Upvote this question"
              >
                <span>▲</span>
                <span>{item.upvotes}</span>
              </button>
            </div>

            <div className="text-xs opacity-70">
              Asked by <b>{item.askedBy}</b> • {item.time}
            </div>

            {/* Answer Display */}
            {item.answer ? (
              <div className="p-3.5 rounded-xl bg-[var(--soft)] border border-[var(--ink)]/20 space-y-1">
                <div className="text-[11px] font-bold text-[var(--chilli)] uppercase tracking-wide">
                  Verified Answer • {item.answeredBy || 'Mentor'}
                </div>
                <p className="text-xs sm:text-sm text-[var(--ink)] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ) : (
              <div className="pt-2">
                <p className="text-xs opacity-60 italic mb-2">
                  No verified answer yet. Can you solve this?
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write a clear step-by-step solution..."
                    value={answerDrafts[item.id] || ''}
                    onChange={(e) =>
                      setAnswerDrafts({ ...answerDrafts, [item.id]: e.target.value })
                    }
                    className="eb-input py-1.5 text-xs flex-1"
                  />
                  <button
                    onClick={() => handleAnswerSubmit(item.id)}
                    className="eb-btn sm text-xs font-bold whitespace-nowrap"
                  >
                    Submit Answer (+10 pts)
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
