import React from 'react';
import {
  Home,
  Users,
  Navigation,
  Loader2,
  Sparkles,
  Sliders,
} from 'lucide-react';
import type {
  AirPurifierSetup,
  CookingSetup,
  CommuteType,
  HouseholdRisk,
  NeighborhoodType,
  UserProfile,
  VentilationSetup,
} from '../types';

interface SidebarProps {
  profile: UserProfile;
  onChangeProfile: (updater: (prev: UserProfile) => UserProfile) => void;
  onRegenerate: () => void;
  isLoading: boolean;
  engineSource?: 'gemini' | 'grounded-engine';
  liquidGlassEnabled?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  profile,
  onChangeProfile,
  onRegenerate,
  isLoading,
  engineSource = 'grounded-engine',
  liquidGlassEnabled = false,
}) => {
  const toggleRisk = (risk: HouseholdRisk) => {
    onChangeProfile((prev) => {
      const exists = prev.risks.includes(risk);
      const updatedRisks = exists
        ? prev.risks.filter((r) => r !== risk)
        : [...prev.risks, risk];
      return { ...prev, risks: updatedRisks };
    });
  };

  return (
    <aside
      className={`w-[300px] shrink-0 flex flex-col h-[calc(100vh-56px)] select-none transition-all ${
        liquidGlassEnabled
          ? 'liquid-glass-sidebar'
          : 'border-r border-[#E4E4E7] bg-white'
      }`}
    >
      {/* Sidebar Header */}
      <div
        className={`p-4 border-b flex items-center justify-between ${
          liquidGlassEnabled
            ? 'border-white/60 bg-white/40'
            : 'border-[#E4E4E7] bg-[#FAFAFA]'
        }`}
      >
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-[#09090B]" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-[#09090B]">
            Household & Exposure Profiler
          </h2>
        </div>
        <span
          className={`text-[10px] font-mono px-1.5 py-0.5 rounded-[4px] border ${
            engineSource === 'gemini'
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
              : 'bg-zinc-100 text-zinc-600 border-zinc-200'
          }`}
          title={engineSource === 'gemini' ? 'Running live Gemini 2.5 Flash' : 'Running Deterministic Grounded Engine'}
        >
          {engineSource === 'gemini' ? 'Gemini 2.5' : 'Grounded'}
        </span>
      </div>

      {/* Form Controls Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {/* 1. NEIGHBORHOOD MICRO-ENVIRONMENT */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-[#52525B] uppercase tracking-wide flex items-center justify-between">
            <span>Micro-Environment</span>
            <span className="text-[10px] font-normal text-[#71717A] lowercase">ambient drift</span>
          </label>
          <div className="grid grid-cols-1 gap-1">
            {[
              { id: 'main_road', label: 'Main Road / Traffic Corridor', sub: '+25% NOx & soot' },
              { id: 'residential', label: 'Residential Colony', sub: 'Baseline urban mix' },
              { id: 'industrial', label: 'Industrial / Construction Edge', sub: '+35% coarse dust' },
            ].map((item) => {
              const active = profile.neighborhood === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() =>
                    onChangeProfile((prev) => ({
                      ...prev,
                      neighborhood: item.id as NeighborhoodType,
                    }))
                  }
                  className={`text-left px-2.5 py-1.5 rounded-[4px] border transition-colors flex items-center justify-between cursor-pointer ${
                    active
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : liquidGlassEnabled
                      ? 'bg-white/60 hover:bg-white text-[#52525B] hover:text-[#09090B] border-white/80'
                      : 'bg-[#FAFAFA] text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5] border-[#E4E4E7]'
                  }`}
                >
                  <span className="font-medium text-[11px]">{item.label}</span>
                  <span className={`text-[10px] font-mono ${active ? 'text-zinc-300' : 'text-[#71717A]'}`}>
                    {item.sub}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. HOUSEHOLD RISK PROFILE */}
        <div className="space-y-2">
          <label className="text-[11px] font-semibold text-[#52525B] uppercase tracking-wide flex items-center justify-between">
            <span className="flex items-center space-x-1">
              <Users className="w-3.5 h-3.5 text-[#71717A]" />
              <span>Vulnerable Populations</span>
            </span>
            <span className="text-[10px] font-mono text-[#71717A]">
              {profile.risks.length} selected
            </span>
          </label>
          <div className="space-y-1.5">
            {[
              { id: 'infants', label: 'Infants / Toddlers', desc: 'Diminished alveolar clearance' },
              { id: 'seniors', label: 'Seniors (65+ years)', desc: 'Cardiovascular susceptibility' },
              { id: 'asthma', label: 'Asthma / Respiratory Sensitivity', desc: 'Airway hyper-reactivity' },
              { id: 'athletes', label: 'Outdoor Athletes / Runners', desc: 'High minute-volume ventilation' },
            ].map((risk) => {
              const isChecked = profile.risks.includes(risk.id as HouseholdRisk);
              return (
                <label
                  key={risk.id}
                  className={`flex items-start space-x-2.5 p-2 rounded-[4px] border cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-[#F4F4F5] border-[#18181B] text-[#09090B]'
                      : liquidGlassEnabled
                      ? 'bg-white/60 border-white/80 text-[#52525B] hover:bg-white'
                      : 'bg-white border-[#E4E4E7] text-[#52525B] hover:bg-[#FAFAFA]'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleRisk(risk.id as HouseholdRisk)}
                    className="mt-0.5 rounded-[3px] accent-[#18181B] border-[#E4E4E7] focus:ring-0 cursor-pointer"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[11px] leading-tight text-[#09090B]">
                      {risk.label}
                    </div>
                    <div className="text-[10px] text-[#71717A] leading-tight mt-0.5">
                      {risk.desc}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* 3. HOME INFRASTRUCTURE */}
        <div className="space-y-3 pt-2 border-t border-[#E4E4E7]">
          <div className="text-[11px] font-semibold text-[#52525B] uppercase tracking-wide flex items-center space-x-1">
            <Home className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Home Infrastructure</span>
          </div>

          {/* Air Purifier */}
          <div className="space-y-1">
            <div className="text-[11px] text-[#71717A] flex justify-between">
              <span>Air Purifier Setup</span>
              <span className="font-mono text-[10px]">CADR status</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'none', label: 'None' },
                { id: 'bedroom', label: '1 Room' },
                { id: 'multi_room', label: 'Multi HEPA' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    onChangeProfile((prev) => ({
                      ...prev,
                      purifier: opt.id as AirPurifierSetup,
                    }))
                  }
                  className={`py-1.5 px-1 text-[11px] font-medium text-center rounded-[4px] border transition-colors cursor-pointer ${
                    profile.purifier === opt.id
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : liquidGlassEnabled
                      ? 'bg-white/60 hover:bg-white text-[#52525B] border-white/80'
                      : 'bg-[#FAFAFA] text-[#52525B] hover:bg-[#F4F4F5] border-[#E4E4E7]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sealing & Ventilation */}
          <div className="space-y-1">
            <div className="text-[11px] text-[#71717A] flex justify-between">
              <span>Envelope & Sealing</span>
              <span className="font-mono text-[10px]">infiltration</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'leaky', label: 'Leaky Wood' },
                { id: 'standard', label: 'Std Alum' },
                { id: 'sealed', label: 'Sealed' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    onChangeProfile((prev) => ({
                      ...prev,
                      ventilation: opt.id as VentilationSetup,
                    }))
                  }
                  className={`py-1.5 px-1 text-[11px] font-medium text-center rounded-[4px] border transition-colors cursor-pointer ${
                    profile.ventilation === opt.id
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : liquidGlassEnabled
                      ? 'bg-white/60 hover:bg-white text-[#52525B] border-white/80'
                      : 'bg-[#FAFAFA] text-[#52525B] hover:bg-[#F4F4F5] border-[#E4E4E7]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cooking Setup */}
          <div className="space-y-1">
            <div className="text-[11px] text-[#71717A] flex justify-between">
              <span>Kitchen Fuel & Exhaust</span>
              <span className="font-mono text-[10px]">combustion</span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {[
                { id: 'lpg_exhaust', label: 'LPG/PNG Gas + Exhaust Fan' },
                { id: 'gas_no_exhaust', label: 'Gas (No Mechanical Exhaust)' },
                { id: 'induction', label: 'Induction / Electric Cooktop' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() =>
                    onChangeProfile((prev) => ({
                      ...prev,
                      cooking: opt.id as CookingSetup,
                    }))
                  }
                  className={`text-left px-2.5 py-1.5 text-[11px] font-medium rounded-[4px] border transition-colors flex items-center justify-between cursor-pointer ${
                    profile.cooking === opt.id
                      ? 'bg-[#18181B] text-white border-[#18181B]'
                      : liquidGlassEnabled
                      ? 'bg-white/60 hover:bg-white text-[#52525B] border-white/80'
                      : 'bg-[#FAFAFA] text-[#52525B] hover:bg-[#F4F4F5] border-[#E4E4E7]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {opt.id === 'gas_no_exhaust' && (
                    <span className="text-[10px] text-amber-500 font-mono font-bold">!</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. COMMUTE & DAILY HABIT */}
        <div className="space-y-3 pt-2 border-t border-[#E4E4E7]">
          <div className="text-[11px] font-semibold text-[#52525B] uppercase tracking-wide flex items-center space-x-1">
            <Navigation className="w-3.5 h-3.5 text-[#71717A]" />
            <span>Transit & Commute Habit</span>
          </div>

          {/* Commute Mode Dropdown */}
          <div className="space-y-1">
            <label className="text-[11px] text-[#71717A]">Primary Transport Mode</label>
            <select
              value={profile.commute}
              onChange={(e) =>
                onChangeProfile((prev) => ({
                  ...prev,
                  commute: e.target.value as CommuteType,
                }))
              }
              className={`w-full text-xs px-2.5 py-1.5 rounded-[4px] text-[#09090B] font-medium focus:outline-none focus:border-[#18181B] cursor-pointer ${
                liquidGlassEnabled ? 'bg-white/70 border border-white/80' : 'bg-[#FAFAFA] border border-[#E4E4E7]'
              }`}
            >
              <option value="two_wheeler">2-Wheeler / Open Auto (Direct Plume Exposure)</option>
              <option value="personal_car">Personal Car (Enclosed Cabin / Filtered)</option>
              <option value="metro">Metro / Public Transit (HVAC Screened)</option>
              <option value="wfh">Work / Study from Home (Zero Transit)</option>
            </select>
          </div>

          {/* Distance Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#71717A]">Daily Round-Trip Distance:</span>
              <span className="font-mono font-bold text-[#09090B] tabular-nums">
                {profile.commuteDistanceKm} km
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="40"
              step="1"
              value={profile.commuteDistanceKm}
              onChange={(e) =>
                onChangeProfile((prev) => ({
                  ...prev,
                  commuteDistanceKm: Number(e.target.value),
                }))
              }
              className="w-full accent-[#18181B] cursor-pointer h-1.5 bg-[#E4E4E7] rounded-lg appearance-none"
            />
            <div className="flex justify-between text-[10px] font-mono text-[#71717A]">
              <span>0 km</span>
              <span>20 km</span>
              <span>40 km</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM CTA: Regenerate Tailored Protocol */}
      <div
        className={`p-4 border-t ${
          liquidGlassEnabled ? 'border-white/60 bg-white/40' : 'border-[#E4E4E7] bg-white'
        }`}
      >
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className="w-full py-2.5 px-3 bg-[#18181B] hover:bg-[#27272A] active:bg-[#09090B] text-white rounded-[4px] font-medium text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-60 cursor-pointer shadow-none"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Analyzing Smog Dynamics...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 text-zinc-300" />
              <span>Regenerate Tailored Protocol</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
