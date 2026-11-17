import React from 'react';
import { Check, Clock, Microscope } from 'lucide-react';
import type { ActionCard } from '../types';

interface ActionCardItemProps {
  card: ActionCard;
  categoryLabel: string;
  isActive: boolean;
  onToggleActive: (id: string) => void;
  liquidGlassEnabled?: boolean;
}

export const ActionCardItem: React.FC<ActionCardItemProps> = ({
  card,
  categoryLabel,
  isActive,
  onToggleActive,
  liquidGlassEnabled = false,
}) => {
  const getEffortBadge = (effort: ActionCard['effortLevel']) => {
    switch (effort) {
      case 'Zero Cost':
        return 'bg-[#ECFDF5] text-[#065F46] border-[#A7F3D0]';
      case 'Low Cost':
        return 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]';
      case 'Habit Swap':
      default:
        return 'bg-[#F4F4F5] text-[#52525B] border-[#E4E4E7]';
    }
  };

  return (
    <div
      className={`rounded-[6px] flex flex-col justify-between transition-all relative overflow-hidden ${
        liquidGlassEnabled
          ? 'liquid-glass-panel'
          : 'bg-white border'
      } ${
        isActive
          ? 'border-[#18181B] ring-1 ring-[#18181B]'
          : liquidGlassEnabled
          ? ''
          : 'border-[#E4E4E7] hover:border-[#A1A1AA]'
      }`}
    >
      {liquidGlassEnabled && <div className="glass-specular-glare" />}

      {/* CARD MAIN CONTENT */}
      <div className="p-4 space-y-3 relative z-10">
        {/* Top Header Strip */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-[4px] bg-[#FAFAFA] border border-[#E4E4E7] text-[#71717A] font-semibold">
              {categoryLabel}
            </span>
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-[4px] border ${getEffortBadge(
                card.effortLevel
              )}`}
            >
              {card.effortLevel}
            </span>
          </div>

          {/* Interactive Checkbox */}
          <button
            type="button"
            onClick={() => onToggleActive(card.id)}
            className={`flex items-center space-x-1 px-2 py-0.5 rounded-[4px] border text-[11px] transition-colors cursor-pointer ${
              isActive
                ? 'bg-[#18181B] text-white border-[#18181B]'
                : 'bg-white text-[#71717A] hover:text-[#09090B] border-[#E4E4E7]'
            }`}
            title="Mark habit active in your daily protocol"
          >
            <div
              className={`w-3 h-3 rounded-[2px] border flex items-center justify-center ${
                isActive ? 'bg-white border-white text-[#18181B]' : 'border-[#A1A1AA]'
              }`}
            >
              {isActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
            </div>
            <span className="font-medium">{isActive ? 'Active' : 'Mark Active'}</span>
          </button>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-sm text-[#09090B] leading-snug">
          {card.title}
        </h3>

        {/* Timing / Trigger Window */}
        <div className="flex items-center space-x-1.5 text-xs text-[#52525B]">
          <Clock className="w-3.5 h-3.5 text-[#71717A] shrink-0" />
          <span className="font-mono text-[11px] text-[#09090B] font-medium">
            {card.timingOrTrigger}
          </span>
        </div>

        {/* Action Steps */}
        <div className="space-y-1.5 pt-1">
          {card.actionSteps.map((step, idx) => (
            <div key={idx} className="flex items-start space-x-2 text-xs text-[#52525B]">
              <span className="font-mono text-[10px] text-[#71717A] mt-0.5 font-bold">
                0{idx + 1}.
              </span>
              <p className="leading-relaxed flex-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PINNED DIRECT IMPACT LEDGER FOOTER */}
      <div
        className={`border-t p-3 space-y-2 rounded-b-[5px] relative z-10 ${
          liquidGlassEnabled
            ? 'bg-white/40 border-white/60'
            : 'bg-[#F4F4F5] border-[#E4E4E7]'
        }`}
      >
        <div className="flex items-center justify-between text-xs">
          {/* Health Metric Badge */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-semibold uppercase text-[#71717A]">
              Health:
            </span>
            <span className="font-mono text-xs font-semibold px-1.5 py-0.5 rounded-[4px] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] tabular-nums">
              -{card.personalPm25ReductionPercent}% Inhaled PM2.5
            </span>
          </div>

          {/* Community Offset Badge */}
          <div className="flex items-center space-x-1.5">
            <span className="text-[10px] font-semibold uppercase text-[#71717A]">
              Community:
            </span>
            <span className="font-mono text-xs font-medium px-1.5 py-0.5 rounded-[4px] bg-white text-[#09090B] border border-[#E4E4E7] tabular-nums">
              {card.communityEmissionOffset}
            </span>
          </div>
        </div>

        {/* Scientific Mechanism */}
        <div className="flex items-start space-x-1.5 pt-1 border-t border-[#E4E4E7]/60 text-[11px] text-[#52525B]">
          <Microscope className="w-3 h-3 text-[#71717A] mt-0.5 shrink-0" />
          <span className="leading-tight italic">
            <strong className="not-italic font-semibold text-[#09090B]">Why This Works: </strong>
            {card.scientificMechanism}
          </span>
        </div>
      </div>
    </div>
  );
};
