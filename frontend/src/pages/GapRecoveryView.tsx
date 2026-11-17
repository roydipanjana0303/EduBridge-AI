import React, { useState } from 'react';
import { NoteItem } from '../types';

interface GapRecoveryViewProps {
  notes: NoteItem[];
  onAddCredits: (amount: number, reason: string) => void;
  onToast: (msg: string) => void;
}

export const GapRecoveryView: React.FC<GapRecoveryViewProps> = ({
  notes,
  onAddCredits,
  onToast,
}) => {
  const [monthsAway, setMonthsAway] = useState<number>(3);
  const [planStarted, setPlanStarted] = useState<boolean>(false);

  const sampleNotes = notes.slice(0, 3);
  const note1 = sampleNotes[0]?.title || 'Newton’s Laws of Motion';
  const note2 = sampleNotes[1]?.title || 'Integration Cheat Sheet';
  const note3 = sampleNotes[2]?.title || 'Organic Chemistry Mechanisms';

  const handleStartPlan = () => {
    setPlanStarted(true);
    onAddCredits(20, 'Activated Study Gap Recovery Plan! +20 credits');
    onToast('Comeback plan activated! +20 credits awarded 🎯');
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--mango)] text-[#071B2B] font-bold text-xs mb-2 border border-[var(--ink)]">
          ⭐ Key EduBridge Differentiator
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Study Gap Recovery
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Life happens. Whether you took a break due to medical leave, travel, or exams, we rebuild your confidence step-by-step using your own past saved notes.
        </p>
      </div>

      {/* Slider Card */}
      <div className="eb-card space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="gap-range" className="font-extrabold text-base">
            How long has your study break been?
          </label>
          <span className="eb-chip on text-sm font-black">
            {monthsAway} {monthsAway === 1 ? 'Month' : 'Months'} Break
          </span>
        </div>

        <input
          id="gap-range"
          type="range"
          min="1"
          max="24"
          value={monthsAway}
          onChange={(e) => {
            setMonthsAway(Number(e.target.value));
            setPlanStarted(false);
          }}
          className="w-full accent-[var(--chilli)] cursor-pointer"
        />

        <div className="flex justify-between text-xs font-semibold opacity-60">
          <span>1 Month (Quick Refresher)</span>
          <span>6 Months (Semester Break)</span>
          <span>12 Months (Year Off)</span>
          <span>24 Months (Career Pivot)</span>
        </div>
      </div>

      {/* Generated Comeback Plan */}
      <div className="eb-card space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black logo-font">
            Your Tailored Comeback Schedule ({monthsAway} Month Gap)
          </h3>
          <span className="text-xs font-bold text-[var(--chilli)] bg-[var(--soft)] px-2.5 py-1 rounded-lg border border-[var(--ink)]/20">
            {monthsAway <= 2 ? 'Low Intensity Revision' : monthsAway <= 6 ? 'Balanced Re-immersion' : 'Deep Foundations Rebuild'}
          </span>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 sm:pl-8 space-y-6 border-l-2 border-dashed border-[var(--ink)] ml-3 my-2">
          {/* Phase 1 */}
          <div className="relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[var(--chilli)] border-2 border-[var(--ink)]" />
            <div className="font-extrabold text-sm sm:text-base text-[var(--ink)]">
              Week 1: Cognitive Warm-Up & Low-Stress Diagnostics
            </div>
            <p className="text-xs sm:text-sm opacity-80 mt-1 leading-relaxed">
              Read and skim your saved note: <b className="text-[var(--chilli)]">"{note1}"</b>. Take an untimed 3-question quiz in the Assessments tab to gauge passive recall without anxiety.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[var(--mango)] border-2 border-[var(--ink)]" />
            <div className="font-extrabold text-sm sm:text-base text-[var(--ink)]">
              Week {monthsAway > 6 ? '2–4' : '2'}: Rebuilding Core Working Models
            </div>
            <p className="text-xs sm:text-sm opacity-80 mt-1 leading-relaxed">
              Revisit fundamental equations in <b className="text-[var(--chilli)]">"{note2}"</b>. Ask the <b>AI Academic Assistant</b> to explain proofs you feel rusty on and solve 5 guided problems.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="relative">
            <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-4 h-4 rounded-full bg-[var(--mint)] border-2 border-[var(--ink)]" />
            <div className="font-extrabold text-sm sm:text-base text-[var(--ink)]">
              Week {monthsAway > 6 ? '5–8' : '3–4'}: Active Re-integration & Mentor Sync
            </div>
            <p className="text-xs sm:text-sm opacity-80 mt-1 leading-relaxed">
              Tackle <b className="text-[var(--chilli)]">"{note3}"</b>. Drop into the peer voice study rooms to ask mentors remaining questions and rejoin the regular syllabus pace.
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-[var(--ink)]/15 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs opacity-75">
            Activating this plan adds weekly milestones to your dashboard checklist.
          </div>
          <button
            onClick={handleStartPlan}
            disabled={planStarted}
            className={`eb-btn sm text-xs font-black ${
              planStarted ? 'bg-[var(--mint)] text-white' : 'red'
            }`}
          >
            {planStarted ? '✓ Plan Active (+20 credits claimed)' : 'Start My Recovery Plan (+20 pts) →'}
          </button>
        </div>
      </div>
    </div>
  );
};
