
import React from 'react';

interface NumberBadgeProps {
  number: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'green' | 'blue' | 'yellow' | 'red';
}

const NumberBadge: React.FC<NumberBadgeProps> = ({ number, label, size = 'md', color = 'green' }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-lg px-4 py-2',
    lg: 'text-2xl px-6 py-3 font-tech',
  };

  const colorClasses = {
    green: 'bg-green-900/40 text-green-400 border-green-500/50',
    blue: 'bg-blue-900/40 text-blue-400 border-blue-500/50',
    yellow: 'bg-yellow-900/40 text-yellow-400 border-yellow-500/50',
    red: 'bg-red-900/40 text-red-400 border-red-500/50',
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`rounded-xl border-2 ${sizeClasses[size]} ${colorClasses[color]} flex items-center justify-center font-bold shadow-lg backdrop-blur-sm`}>
        {number}
      </div>
      {label && <span className="text-[10px] mt-1 uppercase tracking-widest text-slate-400 font-semibold">{label}</span>}
    </div>
  );
};

export default NumberBadge;
