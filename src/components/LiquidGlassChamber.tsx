import React, { useState } from 'react';
import { Droplets, Wind, Sparkles, RefreshCw, Eye, ShieldCheck } from 'lucide-react';
import type { City, CrisisScenario, UserProfile } from '../types';

interface LiquidGlassChamberProps {
  scenario: CrisisScenario;
  city: City;
  profile: UserProfile;
  projectedPm25: number;
}

export const LiquidGlassChamber: React.FC<LiquidGlassChamberProps> = ({
  scenario,
  city,
  profile,
  projectedPm25,
}) => {
  const [isPurging, setIsPurging] = useState(false);
  const [inversionSpike, setInversionSpike] = useState(false);

  const cityScenarioData = city.scenarios[scenario.id];
  const ambientPm25 = cityScenarioData ? cityScenarioData.pm25 : scenario.pm25;

  // Turbidity / optical density calculation
  // Clean: 0-30, Moderate: 31-90, Poor: 91-250, Severe: 251-500
  const outdoorTurbidity = Math.min(100, Math.round((ambientPm25 / 350) * 100));
  const indoorTurbidity = isPurging
    ? 8
    : Math.min(100, Math.round((projectedPm25 / 350) * 100));

  const handlePurge = () => {
    setIsPurging(true);
    setTimeout(() => setIsPurging(false), 2400);
  };

  const handleInversionSpike = () => {
    setInversionSpike(true);
    setTimeout(() => setInversionSpike(false), 3000);
  };

  return (
    <div className="liquid-glass-panel rounded-[6px] p-4 relative overflow-hidden">
      {/* Specular glare sheen */}
      <div className="glass-specular-glare" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E4E4E7]/60 gap-2 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-[4px] bg-[#18181B] text-white">
            <Droplets className="w-3.5 h-3.5 text-sky-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-xs text-[#09090B] tracking-tight">
                Liquid Glass Optical Refraction Chamber
              </h3>
              <span className="text-[10px] font-mono uppercase bg-sky-50 text-sky-700 px-1.5 py-0.2 rounded border border-sky-200 font-medium">
                Fluid Optics
              </span>
            </div>
            <p className="text-[11px] text-[#52525B]">
              Refractive simulation of particulate fluid turbidity across atmospheric boundaries
            </p>
          </div>
        </div>

        {/* Interactive Simulation Triggers */}
        <div className="flex items-center space-x-1.5 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleInversionSpike}
            disabled={inversionSpike}
            className="px-2 py-1 text-[11px] font-medium rounded-[4px] border border-[#E4E4E7] bg-white/80 hover:bg-white text-[#09090B] transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
            title="Simulate nocturnal thermal inversion compression"
          >
            <Wind className="w-3 h-3 text-amber-600" />
            <span>Simulate Inversion</span>
          </button>

          <button
            type="button"
            onClick={handlePurge}
            disabled={isPurging}
            className="px-2 py-1 text-[11px] font-medium rounded-[4px] border border-sky-200 bg-sky-50 hover:bg-sky-100 text-sky-800 transition-colors flex items-center space-x-1 cursor-pointer disabled:opacity-50"
            title="Trigger turbo HEPA fluid flush"
          >
            <RefreshCw className={`w-3 h-3 ${isPurging ? 'animate-spin' : ''}`} />
            <span>HEPA Purge</span>
          </button>
        </div>
      </div>

      {/* DUAL GLASS CYLINDER COMPARISON */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 relative z-10">
        {/* CYLINDER 1: OUTDOOR AMBIENT COLUMN */}
        <div className="bg-white/60 p-3.5 rounded-[6px] border border-white/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#09090B] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Ambient Urban Atmosphere ({city.name})</span>
            </span>
            <span className="font-mono text-xs font-bold text-[#09090B] tabular-nums">
              {ambientPm25} µg/m³
            </span>
          </div>

          {/* Physical Liquid Glass Tube Horizontal */}
          <div className="relative h-10 w-full liquid-glass-cylinder border border-white/80 flex items-center px-1">
            {/* Fluid fill with optical gradient */}
            <div
              className="h-full rounded-full transition-all duration-700 ease-out flex items-center relative overflow-hidden"
              style={{
                width: `${Math.max(15, outdoorTurbidity)}%`,
                background:
                  scenario.statusType === 'severe'
                    ? 'linear-gradient(90deg, rgba(239, 68, 68, 0.45) 0%, rgba(185, 28, 28, 0.75) 100%)'
                    : scenario.statusType === 'poor'
                    ? 'linear-gradient(90deg, rgba(245, 158, 11, 0.45) 0%, rgba(217, 119, 6, 0.7) 100%)'
                    : 'linear-gradient(90deg, rgba(59, 130, 246, 0.35) 0%, rgba(37, 99, 235, 0.55) 100%)',
              }}
            >
              {/* Suspended particulate matter floating in liquid glass */}
              <div className="absolute inset-0 flex justify-around items-center opacity-70">
                <span className="w-1 h-1 bg-white/90 rounded-full fluid-particle" style={{ animationDelay: '0.2s' }} />
                <span className="w-1.5 h-1.5 bg-zinc-800/60 rounded-full fluid-particle" style={{ animationDelay: '0.7s' }} />
                <span className="w-1 h-1 bg-white/80 rounded-full fluid-particle" style={{ animationDelay: '1.2s' }} />
                <span className="w-2 h-2 bg-zinc-900/50 rounded-full fluid-particle" style={{ animationDelay: '1.8s' }} />
                <span className="w-1 h-1 bg-amber-200/90 rounded-full fluid-particle" style={{ animationDelay: '0.4s' }} />
              </div>

              {/* Meniscus curvature highlight */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/60 blur-[0.5px] rounded-r-full" />
            </div>

            {/* Specular Longitudinal Light Line on Glass Tube */}
            <div className="absolute top-1 left-2 right-2 h-[1.5px] bg-white/70 rounded-full pointer-events-none" />
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#71717A] font-mono">
            <span>Turbidity: {outdoorTurbidity}% Fluid Density</span>
            <span>
              {inversionSpike ? '⚠️ Inversion Cap Sinking' : 'Boundary: Inversion Stagnation'}
            </span>
          </div>
        </div>

        {/* CYLINDER 2: YOUR CLEAN ZONE COLUMN */}
        <div className="bg-white/60 p-3.5 rounded-[6px] border border-white/80 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-[#09090B] flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Personal Inhaled Envelope ({profile.purifier} HEPA)</span>
            </span>
            <span className="font-mono text-xs font-bold text-emerald-700 tabular-nums">
              {isPurging ? 12 : projectedPm25} µg/m³
            </span>
          </div>

          {/* Physical Liquid Glass Tube Horizontal */}
          <div className="relative h-10 w-full liquid-glass-cylinder border border-white/80 flex items-center px-1">
            {/* Fluid fill with crystalline clean gradient */}
            <div
              className="h-full rounded-full transition-all duration-700 ease-out flex items-center relative overflow-hidden"
              style={{
                width: `${Math.max(10, indoorTurbidity)}%`,
                background: isPurging
                  ? 'linear-gradient(90deg, rgba(16, 185, 129, 0.4) 0%, rgba(5, 150, 105, 0.65) 100%)'
                  : 'linear-gradient(90deg, rgba(16, 185, 129, 0.35) 0%, rgba(13, 148, 136, 0.55) 100%)',
              }}
            >
              {/* Purified liquid glass particles */}
              <div className="absolute inset-0 flex justify-around items-center opacity-60">
                <span className="w-0.5 h-0.5 bg-white rounded-full" />
                <span className="w-1 h-1 bg-white/70 rounded-full" />
              </div>

              {/* Meniscus curvature highlight */}
              <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/80 blur-[0.5px] rounded-r-full" />
            </div>

            {/* Specular Longitudinal Light Line on Glass Tube */}
            <div className="absolute top-1 left-2 right-2 h-[1.5px] bg-white/70 rounded-full pointer-events-none" />
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#71717A] font-mono">
            <span>Turbidity: {indoorTurbidity}% Crystalline</span>
            <span className="text-emerald-700 font-semibold">
              {isPurging ? 'HEPA Laminar Flush Active' : `-${Math.round(((ambientPm25 - projectedPm25) / ambientPm25) * 100)}% Fluid Attenuation`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
