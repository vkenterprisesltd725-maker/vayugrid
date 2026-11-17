import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string;
  show: boolean;
}

export const Toast: React.FC<ToastProps> = ({ message, show }) => {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-[#18181B] text-white px-3.5 py-2 rounded-[4px] border border-zinc-700 shadow-none text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200">
      <Check className="w-3.5 h-3.5 text-emerald-400" />
      <span>{message}</span>
    </div>
  );
};
