import React, { useState } from 'react';
import { CAREER_ROADMAPS } from '../data/mockData';

export const CareerRoadmapView: React.FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('Tech');
  const domains = Object.keys(CAREER_ROADMAPS);

  const steps = CAREER_ROADMAPS[selectedDomain] || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-[var(--ink)] logo-font">
          Curated Career Roadmaps
        </h2>
        <p className="text-sm opacity-75 mt-0.5">
          Pick your aspirational career direction and view the validated sequence of academic skills, projects, and milestone benchmarks.
        </p>
      </div>

      {/* Domain Selection Tabs */}
      <div className="flex flex-wrap gap-2">
        {domains.map((dom) => (
          <button
            key={dom}
            onClick={() => setSelectedDomain(dom)}
            className={`eb-chip text-sm font-bold py-1.5 px-4 ${
              selectedDomain === dom ? 'on' : ''
            }`}
          >
            {dom === 'Tech' && '💻 '}
            {dom === 'Medicine' && '🩺 '}
            {dom === 'Design' && '🎨 '}
            {dom === 'Business' && '📈 '}
            {dom} Pathway
          </button>
        ))}
      </div>

      {/* Roadmap Card */}
      <div className="eb-card space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-black logo-font">
            {selectedDomain} Career Architecture
          </h3>
          <span className="eb-tag text-xs bg-[var(--mango)]">
            5-Stage Milestone Map
          </span>
        </div>

        <div className="relative pl-6 sm:pl-8 space-y-7 border-l-2 border-dashed border-[var(--ink)] ml-3 my-3">
          {steps.map((step, idx) => (
            <div key={idx} className="relative group">
              <span className="absolute -left-[31px] sm:-left-[39px] top-1 w-5 h-5 rounded-full bg-[var(--mango)] border-2 border-[var(--ink)] flex items-center justify-center text-[10px] font-black text-[#071B2B]">
                {idx + 1}
              </span>
              <div className="font-extrabold text-sm sm:text-base text-[var(--ink)] group-hover:text-[var(--chilli)] transition-colors">
                Stage {idx + 1}: {step}
              </div>
              <p className="text-xs opacity-70 mt-1">
                {idx === 0 && 'Foundational Phase: Build core mathematical & algorithmic discipline.'}
                {idx === 1 && 'Applied Implementation: Translate textbook knowledge into tangible proofs and code.'}
                {idx === 2 && 'Peer Collaboration: Work in teams, contribute to real-world repositories and forums.'}
                {idx === 3 && 'Professional Exposure: Real-world apprenticeships, internships, and clinical rotations.'}
                {idx === 4 && 'Mastery & Specialization: Lead high-impact domain initiatives and achieve senior leadership.'}
              </p>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-[var(--ink)]/15 flex flex-wrap items-center justify-between text-xs opacity-80 gap-2">
          <span>Curated by senior industry mentors & EduBridge AI curriculum advisors</span>
          <button
            onClick={() => alert(`Saved ${selectedDomain} roadmap to your profile milestones!`)}
            className="eb-btn sm text-xs font-bold"
          >
            📌 Pin this Roadmap to Profile
          </button>
        </div>
      </div>
    </div>
  );
};
