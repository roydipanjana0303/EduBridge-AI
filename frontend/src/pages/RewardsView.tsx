import React from 'react';
import { REWARD_ITEMS } from '../data/mockData';

interface RewardsViewProps {
  currentCredits: number;
  onRedeem: (cost: number, title: string) => void;
}

export const RewardsView: React.FC<RewardsViewProps> = ({ currentCredits, onRedeem }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Credit Rewards & Perks
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Your learning consistency translates into tangible academic rewards, mentor consultations, and merchandise.
        </p>
      </div>

      {/* Credit Balance Card */}
      <div className="eb-card bg-[var(--mango)] text-[#071B2B] p-6 sm:p-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="text-xs font-black uppercase tracking-wider opacity-80">
            Available Wallet Balance
          </div>
          <div className="text-5xl sm:text-6xl font-black mt-2 logo-font">
            {currentCredits} <span className="text-2xl font-bold">Credits</span>
          </div>
          <p className="text-xs font-semibold opacity-90 mt-1">
            Keep completing daily quizzes and uploading notes to unlock higher tiers.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-white/70 border border-[var(--ink)]/30 text-xs space-y-1.5">
          <div className="font-extrabold text-sm mb-1">How to earn points:</div>
          <div>• Upload verified study note: <b>+10 pts</b></div>
          <div>• Answer questions correctly in quiz: <b>+10 pts/ea</b></div>
          <div>• Contribute answer in Q&A: <b>+10 pts</b></div>
          <div>• Ask a thoughtful doubt: <b>+5 pts</b></div>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {REWARD_ITEMS.map((reward) => {
          const canAfford = currentCredits >= reward.creditsCost;
          return (
            <div
              key={reward.id}
              className="eb-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="eb-tag text-xs bg-[var(--soft)] font-black text-[var(--chilli)]">
                    {reward.creditsCost} Credits
                  </span>
                  {canAfford && (
                    <span className="text-xs font-bold text-[var(--mint)]">
                      ✓ Unlockable
                    </span>
                  )}
                </div>

                <h3 className="font-extrabold text-lg text-[var(--ink)] mb-1">
                  {reward.title}
                </h3>
                <p className="text-xs opacity-75 leading-relaxed mb-4">
                  {reward.description}
                </p>
              </div>

              <div className="pt-3 border-t border-[var(--ink)]/15 flex items-center justify-between">
                <span className="text-xs opacity-60">
                  {canAfford ? 'Instant digital claim' : `Need ${reward.creditsCost - currentCredits} more`}
                </span>
                <button
                  disabled={!canAfford}
                  onClick={() => onRedeem(reward.creditsCost, reward.title)}
                  className={`eb-btn sm text-xs font-bold ${
                    canAfford ? 'red' : 'opacity-40 cursor-not-allowed'
                  }`}
                >
                  {canAfford ? 'Redeem Perk 🎁' : 'Insufficient Points'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
