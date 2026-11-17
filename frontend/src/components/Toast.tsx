import React from 'react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--ink)] text-[var(--bg)] px-5 py-2.5 rounded-xl font-bold shadow-2xl z-50 transition-all duration-300 ease-out border border-[var(--mango)] flex items-center gap-2"
    >
      <span className="w-2 h-2 rounded-full bg-[var(--mint)] animate-ping" />
      <span>{message}</span>
    </div>
  );
};
