import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/mockData';

interface QuizViewProps {
  onAddCredits: (amount: number, reason: string) => void;
  onToast: (msg: string) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onAddCredits, onToast }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentQuestion = QUIZ_QUESTIONS[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (selectedOption !== null) return; // prevent multiple clicks
    setSelectedOption(idx);

    if (idx === currentQuestion.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      setIsCompleted(true);
      const earnedCredits = score * 10;
      if (earnedCredits > 0) {
        onAddCredits(earnedCredits, `Quiz completed! Scored ${score}/${QUIZ_QUESTIONS.length}`);
        onToast(`Quiz complete! +${earnedCredits} credits awarded 🏆`);
      }
    }
  };

  const handleRetake = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const totalQuestions = QUIZ_QUESTIONS.length;
    const finalScore = score;
    const percent = Math.round((finalScore / totalQuestions) * 100);

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
            Assessment Results
          </h2>
          <p className="text-sm opacity-75 mt-0.5">
            Detailed performance breakdown and earned gamification credits.
          </p>
        </div>

        <div className="eb-card text-center py-10 px-6 max-w-lg mx-auto space-y-4">
          <div className="text-6xl sm:text-7xl font-black text-[var(--ink)] logo-font">
            {finalScore}/{totalQuestions}
          </div>
          <div className="text-base font-bold">
            {percent >= 75 ? '🎉 Outstanding Recall!' : '💪 Good Effort! Keep Revising.'}
          </div>
          <p className="text-xs opacity-75 max-w-xs mx-auto">
            You scored {percent}% accuracy and earned{' '}
            <b className="text-[var(--chilli)]">+{finalScore * 10} credit points</b> added to your wallet.
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <button
              onClick={handleRetake}
              className="eb-btn red text-sm font-bold px-6"
            >
              🔄 Retake Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Interactive Diagnostic Quiz
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Reinforce concepts with active recall tests. Each correct question awards +10 credits!
        </p>
      </div>

      <div className="eb-card max-w-2xl space-y-5">
        {/* Progress Header */}
        <div className="flex items-center justify-between">
          <span className="eb-chip on text-xs">
            Question {currentIndex + 1} of {QUIZ_QUESTIONS.length}
          </span>
          <span className="text-xs font-bold opacity-75">
            Current Score: {score}
          </span>
        </div>

        {/* Progress bar */}
        <div className="eb-bar">
          <span
            className="eb-bar-fill"
            style={{ width: `${((currentIndex + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-black text-[var(--ink)] leading-snug">
          {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = idx === currentQuestion.correctAnswer;
            const hasAnswered = selectedOption !== null;

            let btnStyle = 'bg-[var(--card)] border-[var(--ink)] hover:bg-[var(--soft)]';
            if (hasAnswered) {
              if (isCorrect) {
                btnStyle = 'bg-[var(--mango)] text-[#071B2B] border-2 border-[var(--chilli)] font-bold';
              } else if (isSelected) {
                btnStyle = 'bg-[var(--chilli)] text-white border-2 border-[var(--ink)] font-bold';
              } else {
                btnStyle = 'bg-[var(--card)] opacity-40 border-[var(--ink)]/40';
              }
            }

            return (
              <button
                key={idx}
                disabled={hasAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-center justify-between ${btnStyle}`}
              >
                <span>{opt}</span>
                {hasAnswered && isCorrect && <span className="font-black text-sm">✓</span>}
                {hasAnswered && isSelected && !isCorrect && <span className="font-black text-sm">✕</span>}
              </button>
            );
          })}
        </div>

        {/* Explanation when answered */}
        {selectedOption !== null && (
          <div className="p-3 rounded-xl bg-[var(--soft)] text-xs border border-[var(--ink)]/20">
            <b className="text-[var(--chilli)]">Explanation:</b> {currentQuestion.explanation}
          </div>
        )}

        {/* Next Button */}
        {selectedOption !== null && (
          <div className="pt-2 flex justify-end">
            <button
              onClick={handleNext}
              className="eb-btn red text-xs font-black px-6 py-2.5"
            >
              {currentIndex + 1 === QUIZ_QUESTIONS.length ? 'View Final Results 🏆' : 'Next Question →'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
