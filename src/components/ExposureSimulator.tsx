import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
} from 'recharts';
import { Sliders, ShieldCheck, TrendingDown } from 'lucide-react';
import type { HourlyDataPoint, SimulatorControls, UserProfile } from '../types';

interface ExposureSimulatorProps {
  baseCurve: HourlyDataPoint[];
  simulatedCurve: HourlyDataPoint[];
  controls: SimulatorControls;
  onToggleControl: (key: keyof SimulatorControls) => void;
  profile: UserProfile;
  liquidGlassEnabled?: boolean;
}

export const ExposureSimulator: React.FC<ExposureSimulatorProps> = ({
  baseCurve,
  simulatedCurve,
  controls,
  onToggleControl,
  profile,
  liquidGlassEnabled = false,
}) => {
  // Compute average outdoor vs simulated personal exposure
  const avgOutdoor = Math.round(
    simulatedCurve.reduce((acc, curr) => acc + curr.outdoorPm25, 0) / (simulatedCurve.length || 1)
  );
  const avgPersonal = Math.round(
    simulatedCurve.reduce((acc, curr) => acc + curr.protectedPm25, 0) / (simulatedCurve.length || 1)
  );
  const avgBasePersonal = Math.round(
    baseCurve.reduce((acc, curr) => acc + curr.protectedPm25, 0) / (baseCurve.length || 1)
  );

  const deltaImprovement = Math.max(0, avgBasePersonal - avgPersonal);
  const percentDelta = avgBasePersonal > 0 ? Math.round((deltaImprovement / avgBasePersonal) * 100) : 0;

  return (
    <div
      className={`rounded-[6px] overflow-hidden relative transition-all ${
        liquidGlassEnabled
          ? 'liquid-glass-panel'
          : 'bg-white border border-[#E4E4E7]'
      }`}
    >
      {liquidGlassEnabled && <div className="glass-specular-glare" />}

      {/* HEADER STRIP */}
      <div
        className={`p-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative z-10 ${
          liquidGlassEnabled
            ? 'border-white/60 bg-white/40'
            : 'border-[#E4E4E7] bg-[#FAFAFA]'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#09090B]" />
          <h3 className="font-semibold text-sm text-[#09090B]">
            Interactive "What-If" Lifestyle & Exposure Simulator
          </h3>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-[#71717A]">Simulated Net Delta:</span>
          <span className="font-mono font-semibold px-2 py-0.5 rounded-[4px] bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0] tabular-nums">
            -{deltaImprovement} µg/m³ (-{percentDelta}%)
          </span>
        </div>
      </div>

      {/* 2-COLUMN SPLIT */}
      <div
        className={`grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x relative z-10 ${
          liquidGlassEnabled ? 'divide-white/60' : 'divide-[#E4E4E7]'
        }`}
      >
        {/* LEFT COLUMN: 4 INTERACTIVE CONTROLS (5 cols) */}
        <div
          className={`lg:col-span-5 p-4 space-y-3 ${
            liquidGlassEnabled ? 'bg-white/20' : 'bg-[#FAFAFA]/50'
          }`}
        >
          <div className="text-[11px] font-semibold text-[#52525B] uppercase tracking-wide flex items-center justify-between">
            <span>Intervention Toggles</span>
            <span className="text-[10px] font-mono text-[#71717A]">Profile-Linked</span>
          </div>

          {/* Toggle 1: Metro Transit Swap */}
          <div
            onClick={() => onToggleControl('shiftCommuteToMetro')}
            className={`p-3 rounded-[6px] border cursor-pointer transition-colors ${
              controls.shiftCommuteToMetro
                ? 'bg-white border-emerald-600 ring-1 ring-emerald-600'
                : liquidGlassEnabled
                ? 'bg-white/70 border-white/80 hover:bg-white'
                : 'bg-white border-[#E4E4E7] hover:border-[#A1A1AA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#09090B]">
                Shift 3 Commutes/Wk to Metro
              </span>
              <div
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  controls.shiftCommuteToMetro ? 'bg-emerald-600' : 'bg-[#E4E4E7]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transition-transform ${
                    controls.shiftCommuteToMetro ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#52525B] mt-1 leading-tight">
              Bypasses direct vehicular exhaust plume exposure during 08:30–10:00 & 18:00–19:30 rush hours.
            </p>
            <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-[#71717A]">
              <span>Mode: {profile.commute.replace('_', ' ')}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">-45% commute PM2.5</span>
            </div>
          </div>

          {/* Toggle 2: Run HEPA Purifier on High during Inversion */}
          <div
            onClick={() => onToggleControl('runPurifierInversion')}
            className={`p-3 rounded-[6px] border cursor-pointer transition-colors ${
              controls.runPurifierInversion
                ? 'bg-white border-emerald-600 ring-1 ring-emerald-600'
                : liquidGlassEnabled
                ? 'bg-white/70 border-white/80 hover:bg-white'
                : 'bg-white border-[#E4E4E7] hover:border-[#A1A1AA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#09090B]">
                Turbo HEPA During 18:00–22:00 Inversion
              </span>
              <div
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  controls.runPurifierInversion ? 'bg-emerald-600' : 'bg-[#E4E4E7]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transition-transform ${
                    controls.runPurifierInversion ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#52525B] mt-1 leading-tight">
              Overcomes nocturnal boundary layer compression before family gathers indoors.
            </p>
            <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-[#71717A]">
              <span>Target: 4-5 ACH</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">-48% evening spike</span>
            </div>
          </div>

          {/* Toggle 3: Run Kitchen Exhaust + 15m post-cook */}
          <div
            onClick={() => onToggleControl('runKitchenExhaust')}
            className={`p-3 rounded-[6px] border cursor-pointer transition-colors ${
              controls.runKitchenExhaust
                ? 'bg-white border-emerald-600 ring-1 ring-emerald-600'
                : liquidGlassEnabled
                ? 'bg-white/70 border-white/80 hover:bg-white'
                : 'bg-white border-[#E4E4E7] hover:border-[#A1A1AA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#09090B]">
                Kitchen Exhaust + 15m Post-Cook Overrun
              </span>
              <div
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  controls.runKitchenExhaust ? 'bg-emerald-600' : 'bg-[#E4E4E7]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transition-transform ${
                    controls.runKitchenExhaust ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#52525B] mt-1 leading-tight">
              Expels sub-micron aerosolized oil droplets and combustion soot before hallway migration.
            </p>
            <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-[#71717A]">
              <span>Cooking: {profile.cooking.replace('_', ' ')}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">-38% cooking spike</span>
            </div>
          </div>

          {/* Toggle 4: Seal bedroom door gaps with draft stopper */}
          <div
            onClick={() => onToggleControl('sealBedroomGaps')}
            className={`p-3 rounded-[6px] border cursor-pointer transition-colors ${
              controls.sealBedroomGaps
                ? 'bg-white border-emerald-600 ring-1 ring-emerald-600'
                : liquidGlassEnabled
                ? 'bg-white/70 border-white/80 hover:bg-white'
                : 'bg-white border-[#E4E4E7] hover:border-[#A1A1AA]'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-xs text-[#09090B]">
                Seal Bedroom Door Gaps (Draft Stopper)
              </span>
              <div
                className={`w-9 h-5 flex items-center rounded-full p-0.5 transition-colors ${
                  controls.sealBedroomGaps ? 'bg-emerald-600' : 'bg-[#E4E4E7]'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full transition-transform ${
                    controls.sealBedroomGaps ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <p className="text-[11px] text-[#52525B] mt-1 leading-tight">
              Isolates the sleeping quarters into an airtight clean zone throughout nocturnal inversion.
            </p>
            <div className="mt-2 flex items-center space-x-2 text-[10px] font-mono text-[#71717A]">
              <span>Sealing: {profile.ventilation}</span>
              <span>•</span>
              <span className="text-emerald-700 font-semibold">-30% sleep exposure</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 24-HOUR HOURLY PM2.5 EXPOSURE CURVE (7 cols) */}
        <div className="lg:col-span-7 p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs font-semibold text-[#09090B]">
                24-Hour Diurnal PM2.5 Exposure Profile
              </div>
              <div className="text-[11px] text-[#71717A]">
                Color-coded outdoor ambient vs. personal protected exposure (µg/m³)
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-mono">
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-0.5 bg-amber-500 inline-block" />
                <span className="text-[#71717A]">Outdoor Smoke</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="w-2.5 h-1 bg-emerald-600 inline-block" />
                <span className="text-emerald-700 font-semibold">Protected Inhaled</span>
              </div>
            </div>
          </div>

          {/* Recharts Curve with Color Bands */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulatedCurve} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="hour"
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                  interval={2}
                  fontFamily="JetBrains Mono"
                />
                <YAxis
                  stroke="#71717A"
                  fontSize={10}
                  tickLine={false}
                  fontFamily="JetBrains Mono"
                  domain={[0, 'auto']}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const outdoor = payload.find((p) => p.dataKey === 'outdoorPm25')?.value;
                      const personal = payload.find((p) => p.dataKey === 'protectedPm25')?.value;
                      return (
                        <div
                          className={`p-2.5 rounded-[4px] shadow-lg text-xs font-mono space-y-1 ${
                            liquidGlassEnabled
                              ? 'liquid-glass-panel'
                              : 'bg-white border border-[#E4E4E7]'
                          }`}
                        >
                          <div className="font-semibold text-[#09090B] border-b border-[#E4E4E7] pb-1">
                            Time: {label}
                          </div>
                          <div className="text-amber-700 flex justify-between space-x-3">
                            <span>Outdoor Ambient:</span>
                            <span className="font-bold">{outdoor} µg/m³</span>
                          </div>
                          <div className="text-emerald-700 flex justify-between space-x-3">
                            <span>Your Personal:</span>
                            <span className="font-bold">{personal} µg/m³</span>
                          </div>
                          <div className="text-[10px] text-emerald-700 pt-0.5">
                            WHO 24h Safe Limit: 15 µg/m³
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={15}
                  stroke="#10B981"
                  strokeDasharray="3 3"
                  label={{
                    value: 'WHO Safe 15 µg/m³',
                    fill: '#059669',
                    fontSize: 9,
                    fontFamily: 'JetBrains Mono',
                    position: 'insideBottomRight',
                  }}
                />
                {/* Outdoor Curve in Amber/Smoke */}
                <Line
                  type="monotone"
                  dataKey="outdoorPm25"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  name="Outdoor Ambient"
                  isAnimationActive={true}
                />
                {/* Protected Inhaled Curve in Emerald/Clean */}
                <Line
                  type="monotone"
                  dataKey="protectedPm25"
                  stroke="#059669"
                  strokeWidth={2.5}
                  dot={{ r: 2, fill: '#059669' }}
                  name="Simulated Personal"
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Color-Coded Metric Comparison Footer */}
          <div className="mt-3 pt-3 border-t border-[#E4E4E7] grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-[4px]">
              <div className="text-[10px] uppercase text-amber-800 font-semibold">
                Avg Outdoor PM2.5
              </div>
              <div className="font-mono text-sm font-bold text-amber-900 mt-0.5 tabular-nums">
                {avgOutdoor} µg/m³
              </div>
            </div>
            <div className="p-2 bg-sky-50 border border-sky-200 rounded-[4px]">
              <div className="text-[10px] uppercase text-sky-800 font-semibold">
                Simulated Inhaled
              </div>
              <div className="font-mono text-sm font-bold text-sky-900 mt-0.5 tabular-nums">
                {avgPersonal} µg/m³
              </div>
            </div>
            <div className="p-2 bg-emerald-50 border border-emerald-300 rounded-[4px]">
              <div className="text-[10px] uppercase text-emerald-800 font-semibold">
                Total Shielding
              </div>
              <div className="font-mono text-sm font-bold text-emerald-700 mt-0.5 tabular-nums">
                -{Math.round(((avgOutdoor - avgPersonal) / (avgOutdoor || 1)) * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
