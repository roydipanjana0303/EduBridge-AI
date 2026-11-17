import React from 'react';

export const Logo: React.FC<{ size?: number }> = ({ size = 32 }) => (
  <div className="flex items-center gap-2 select-none">
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true" className="flex-none">
      <rect x="4" y="4" width="92" height="92" rx="24" fill="#071B2B" />
      <path d="M20 72Q50 18 80 72" fill="none" stroke="#B9E4E8" strokeWidth="8" strokeLinecap="round" />
      <path d="M14 72H86" stroke="#167D8D" strokeWidth="8" strokeLinecap="round" />
      <circle cx="50" cy="52" r="6" fill="#EEEEEE" />
    </svg>
    <span className="font-extrabold text-xl tracking-tight text-[var(--ink)] logo-font">
      Edu<b className="text-[var(--chilli)]">Bridge</b> AI
    </span>
  </div>
);

export const AppIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-5 h-5' }) => {
  const iconPaths: Record<string, string> = {
    home: "M3 11l9-8 9 8v10H3z",
    notes: "M5 3h11l3 3v15H5zM9 10h6M9 14h6",
    chat: "M4 5h16v11H9l-5 4z",
    voice: "M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM5 11a7 7 0 0 0 14 0M12 18v3",
    groups: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c0-3.5 2.7-6 6-6s6 2.5 6 6M17 8a2.5 2.5 0 1 1 0 5M18 14c2 .5 3 2.5 3 5",
    qa: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17v.01",
    ai: "M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z",
    gap: "M3 18h18M5 18v-5a7 7 0 0 1 14 0v5",
    career: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9l-2 5-5 1 2-5z",
    quiz: "M6 5h12v16H6zM9 3h6v4H9zM9 14l2 2 4-4",
    offline: "M12 4v12m0 0l-4-4m4 4l4-4M5 20h14",
    rewards: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3",
    sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5",
    moon: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z",
    out: "M10 4H5v16h5M15 8l4 4-4 4M19 12H9",
    check: "M20 6L9 17l-5-5",
    search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.35-4.35",
    arrowUp: "M12 19V5M5 12l7-7 7 7",
    upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
    mic: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
    micOff: "M1 1l22 22M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23M12 19v4M8 23h8"
  };

  const path = iconPaths[name] || iconPaths['home'];

  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
};
