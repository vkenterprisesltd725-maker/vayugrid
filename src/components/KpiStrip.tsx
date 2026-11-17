import React from 'react';
import {
  Wind,
  Leaf,
  CheckCircle2,
  TrendingDown,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import type { VayuProtocolResponse } from '../types';

interface KpiStripProps {
  summary: VayuProtocolResponse['summary'];
  activeHabitsCount: number;
  totalHabitsCount: number;
  liquidGlassEnabled?: boolean;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  summary,
  activeHabitsCount,
  totalHabitsCount,
  liquidGlassEnabled = false,
}) => {
  const readinessPercent = Math.round(
    totalHabitsCount > 0 ? (activeHabitsCount / totalHabitsCount) * 100 : 0
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {/* KPI 1: Projected Daily Inhaled PM2.5 (Emerald Accent) */}
      <div
        className={`rounded-[6px] p-3.5 flex flex-col justify-between relative overflow-hidden border-l-4 border-l-emerald-500 shadow-xs ${
          liquidGlassEnabled
            ? 'liquid-glass-panel'
            : 'bg-white border border-[#E4E4E7]'
        }`}
      >
        {liquidGlassEnabled && <div className="glass-specular-glare" />}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-bold text-[#52525B] uppercase tracking-wide">
            Projected Inhaled PM2.5
          </span>
          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-emerald-500 text-white flex items-center space-x-1 tabular-nums shadow-xs">
            <TrendingDown className="w-3 h-3" />
            <span>-{summary.exposureReductionPercent}%</span>
          </span>
        </div>
        <div className="mt-2 flex items-baseline space-x-2 relative z-10">
          <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums tracking-tight">
            {summary.projectedDailyPm25}
          </span>
          <span className="text-xs font-mono text-[#71717A]">µg/m³</span>
          <span className="text-[11px] text-[#71717A] font-mono tabular-nums">
            vs <span className="line-through text-red-500">{summary.baselineUnfilteredPm25}</span> raw
          </span>
        </div>
        <div className="mt-2 text-[10px] text-[#52525B] leading-tight relative z-10">
          Personal dosage calculated across commute, sleep & indoor cooking.
        </div>
      </div>

      {/* KPI 2: Safe Outdoor Ventilation Window (Sky Accent) */}
      <div
        className={`rounded-[6px] p-3.5 flex flex-col justify-between relative overflow-hidden border-l-4 border-l-sky-500 shadow-xs ${
          liquidGlassEnabled
            ? 'liquid-glass-panel'
            : 'bg-white border border-[#E4E4E7]'
        }`}
      >
        {liquidGlassEnabled && <div className="glass-specular-glare" />}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-bold text-[#52525B] uppercase tracking-wide">
            Ventilation Window
          </span>
          <Wind className="w-3.5 h-3.5 text-sky-600" />
        </div>
        <div className="mt-2 relative z-10">
          <div className="text-sm font-semibold font-mono text-sky-950 tabular-nums leading-tight">
            {summary.safeVentilationWindow}
          </div>
        </div>
        <div className="mt-2 text-[10px] text-[#52525B] leading-tight flex items-center space-x-1 relative z-10">
          <Clock className="w-3 h-3 text-[#71717A] shrink-0" />
          <span>Bound by atmospheric mixing height & surface inversion.</span>
        </div>
      </div>

      {/* KPI 3: Weekly Community Emission Offset (Teal Accent) */}
      <div
        className={`rounded-[6px] p-3.5 flex flex-col justify-between relative overflow-hidden border-l-4 border-l-teal-500 shadow-xs ${
          liquidGlassEnabled
            ? 'liquid-glass-panel'
            : 'bg-white border border-[#E4E4E7]'
        }`}
      >
        {liquidGlassEnabled && <div className="glass-specular-glare" />}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-bold text-[#52525B] uppercase tracking-wide">
            Weekly Emission Offset
          </span>
          <Leaf className="w-3.5 h-3.5 text-teal-600" />
        </div>
        <div className="mt-2 flex items-baseline space-x-3 relative z-10">
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-bold font-mono text-teal-800 tabular-nums">
              {summary.weeklyCo2SavedKg}
            </span>
            <span className="text-xs font-mono text-[#71717A]">kg CO₂e</span>
          </div>
          <div className="text-xs text-[#71717A] font-mono">&</div>
          <div className="flex items-baseline space-x-1">
            <span className="text-base font-bold font-mono text-teal-800 tabular-nums">
              {summary.weeklyPm25AvoidedGrams}
            </span>
            <span className="text-xs font-mono text-[#71717A]">g PM2.5</span>
          </div>
        </div>
        <div className="mt-2 text-[10px] text-[#52525B] leading-tight relative z-10">
          Tailpipe CO₂e & combustion particulate prevented into city air.
        </div>
      </div>

      {/* KPI 4: Action Readiness (Indigo Accent with Green Meter) */}
      <div
        className={`rounded-[6px] p-3.5 flex flex-col justify-between relative overflow-hidden border-l-4 border-l-indigo-500 shadow-xs ${
          liquidGlassEnabled
            ? 'liquid-glass-panel'
            : 'bg-white border border-[#E4E4E7]'
        }`}
      >
        {liquidGlassEnabled && <div className="glass-specular-glare" />}
        <div className="flex items-center justify-between relative z-10">
          <span className="text-[11px] font-bold text-[#52525B] uppercase tracking-wide">
            Action Readiness
          </span>
          <span className="text-xs font-mono font-bold text-indigo-900 tabular-nums">
            {activeHabitsCount}/{totalHabitsCount} Active
          </span>
        </div>
        <div className="mt-2 relative z-10">
          <div className="w-full bg-zinc-100 h-2.5 rounded-[4px] overflow-hidden border border-[#E4E4E7]">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full transition-all duration-500 rounded-[3px]"
              style={{ width: `${readinessPercent}%` }}
            />
          </div>
        </div>
        <div className="mt-2 text-[10px] text-[#52525B] flex justify-between items-center leading-tight relative z-10">
          <span className="font-semibold text-emerald-700">{readinessPercent}% Protocols Active</span>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        </div>
      </div>
    </div>
  );
};
