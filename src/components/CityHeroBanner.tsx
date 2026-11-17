import React from 'react';
import { MapPin, Eye, Wind, Navigation, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import type { City, CrisisScenario } from '../types';

interface CityHeroBannerProps {
  city: City;
  scenario: CrisisScenario;
  liquidGlassEnabled?: boolean;
  onDetectLocation?: () => void;
  isDetectingLocation?: boolean;
}

export const CityHeroBanner: React.FC<CityHeroBannerProps> = ({
  city,
  scenario,
  liquidGlassEnabled = false,
  onDetectLocation,
  isDetectingLocation = false,
}) => {
  const cityScenarioData = city.scenarios[scenario.id];
  const activeAqi = cityScenarioData ? cityScenarioData.aqi : scenario.aqi;
  const activePm25 = cityScenarioData ? cityScenarioData.pm25 : scenario.pm25;
  const activePm10 = cityScenarioData ? cityScenarioData.pm10 : scenario.pm10;
  const activeInversion = cityScenarioData ? cityScenarioData.inversionWindow : scenario.thermalInversionWindow;

  // Determine color status based on standard environmental color codes
  const getAqiColorTheme = (aqi: number) => {
    if (aqi <= 50) {
      return {
        bgBadge: 'bg-emerald-500 text-white',
        border: 'border-emerald-400',
        label: 'Good (Clean Air)',
        textColor: 'text-emerald-700',
        overlayGradient: 'from-emerald-950/80 via-emerald-900/40 to-transparent',
        visibility: 'Crystal Clear (> 10 km)',
        spectrumPercent: Math.min(100, (aqi / 500) * 100),
      };
    }
    if (aqi <= 100) {
      return {
        bgBadge: 'bg-yellow-500 text-zinc-950',
        border: 'border-yellow-400',
        label: 'Moderate (Caution)',
        textColor: 'text-yellow-800',
        overlayGradient: 'from-amber-950/85 via-amber-900/50 to-transparent',
        visibility: 'Mild Haze (6–8 km)',
        spectrumPercent: Math.min(100, (aqi / 500) * 100),
      };
    }
    if (aqi <= 150) {
      return {
        bgBadge: 'bg-orange-500 text-white',
        border: 'border-orange-400',
        label: 'Unhealthy for Sensitive Groups',
        textColor: 'text-orange-700',
        overlayGradient: 'from-orange-950/90 via-orange-900/55 to-transparent',
        visibility: 'Moderate Smog (3–5 km)',
        spectrumPercent: Math.min(100, (aqi / 500) * 100),
      };
    }
    if (aqi <= 200) {
      return {
        bgBadge: 'bg-red-500 text-white',
        border: 'border-red-400',
        label: 'Unhealthy (Wear N95)',
        textColor: 'text-red-700',
        overlayGradient: 'from-red-950/90 via-red-900/60 to-transparent',
        visibility: 'Dense Smog (1.5–3 km)',
        spectrumPercent: Math.min(100, (aqi / 500) * 100),
      };
    }
    if (aqi <= 300) {
      return {
        bgBadge: 'bg-purple-600 text-white',
        border: 'border-purple-400',
        label: 'Very Unhealthy (Stay Indoors)',
        textColor: 'text-purple-700',
        overlayGradient: 'from-purple-950/92 via-purple-900/65 to-transparent',
        visibility: 'Heavy Smog Layer (< 1.5 km)',
        spectrumPercent: Math.min(100, (aqi / 500) * 100),
      };
    }
    return {
      bgBadge: 'bg-rose-900 text-white animate-pulse',
      border: 'border-rose-500',
      label: 'Hazardous Emergency',
      textColor: 'text-rose-800',
      overlayGradient: 'from-zinc-950/95 via-rose-950/70 to-zinc-900/40',
      visibility: 'Severe Inversion Veil (< 600 m)',
      spectrumPercent: Math.min(100, (aqi / 500) * 100),
    };
  };

  const theme = getAqiColorTheme(activeAqi);

  return (
    <div
      className={`rounded-[8px] overflow-hidden border relative transition-all duration-300 shadow-sm ${
        liquidGlassEnabled
          ? 'liquid-glass-panel border-white/80'
          : 'bg-white border-[#E4E4E7]'
      }`}
    >
      {/* CITY PHOTOGRAPHY WITH DYNAMIC ATMOSPHERIC SMOG OVERLAY */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-zinc-900">
        <img
          src={
            city.imageUrl ||
            'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80'
          }
          alt={`${city.name} skyline`}
          className="w-full h-full object-cover object-center filter transition-all duration-700 brightness-90 hover:scale-105"
        />

        {/* Dynamic atmospheric color gradient overlay based on current smog */}
        <div className={`absolute inset-0 bg-gradient-to-t ${theme.overlayGradient}`} />

        {/* TOP BADGE: CITY & LANDMARK */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
          <div className="flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-sm max-w-[70%]">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-bold text-xs truncate">{city.name}</span>
            <span className="text-zinc-400 text-[11px] truncate">({city.country})</span>
          </div>

          {/* Visibility indicator */}
          <div className="flex items-center space-x-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20 text-white text-[11px] font-mono">
            <Eye className="w-3 h-3 text-amber-300" />
            <span>{theme.visibility}</span>
          </div>
        </div>

        {/* BOTTOM HERO CONTENT ON PHOTO */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-col sm:flex-row sm:items-end justify-between gap-3 z-10 text-white">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-[4px] uppercase font-mono tracking-wide ${theme.bgBadge}`}>
                AQI {activeAqi}
              </span>
              <span className="text-sm font-semibold tracking-tight text-white drop-shadow-md">
                {theme.label}
              </span>
            </div>
            <p className="text-xs text-zinc-200 drop-shadow-sm max-w-lg leading-relaxed hidden sm:block">
              {scenario.description} Inversion lid active between <strong className="text-white font-mono">{activeInversion}</strong>.
            </p>
          </div>

          {/* Real-time PM values overlay */}
          <div className="flex items-center space-x-2 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-[6px] border border-white/20 font-mono text-xs self-start sm:self-auto">
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">PM2.5</span>
              <span className="font-bold text-amber-300">{activePm25} µg/m³</span>
            </div>
            <div className="h-6 w-[1px] bg-white/20 mx-1" />
            <div className="flex flex-col">
              <span className="text-[10px] text-zinc-400">PM10</span>
              <span className="font-bold text-zinc-200">{activePm10} µg/m³</span>
            </div>
          </div>
        </div>
      </div>

      {/* REVERSED GEOCODED DEVICE LOCATION ADDRESS STRIP */}
      <div className="bg-[#FAFAFA] border-t border-[#E4E4E7] px-3.5 py-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-2 min-w-0">
          <MapPin className="w-4 h-4 text-rose-600 shrink-0 animate-bounce" />
          <div className="truncate">
            <span className="font-bold text-[#09090B]">Location Address: </span>
            <span className="text-[#52525B] font-mono text-[11px]">
              {city.landmark ? city.landmark : `${city.name}, ${city.country}`}
            </span>
          </div>
        </div>

        {onDetectLocation && (
          <button
            type="button"
            onClick={onDetectLocation}
            disabled={isDetectingLocation}
            className="px-2.5 py-1 bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] rounded text-[11px] font-semibold text-[#09090B] flex items-center space-x-1 cursor-pointer shrink-0 self-start sm:self-auto shadow-xs"
            title="Auto-detect current GPS address & street details"
          >
            {isDetectingLocation ? (
              <Loader2 className="w-3 h-3 animate-spin text-sky-600" />
            ) : (
              <Navigation className="w-3 h-3 text-sky-600" />
            )}
            <span>{isDetectingLocation ? 'Resolving Address...' : 'Detect Device Address'}</span>
          </button>
        )}
      </div>

      {/* CONTINUOUS MULTI-COLOR AQI SPECTRUM BAR */}
      <div className="p-3 bg-white border-t border-[#E4E4E7] space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-semibold text-[#52525B] uppercase tracking-wider text-[10px]">
            Air Quality Color Spectrum
          </span>
          <span className="font-mono text-xs font-bold text-[#09090B]">
            Position: {activeAqi} of 500 Max
          </span>
        </div>

        {/* Colored Segments Spectrum */}
        <div className="relative h-3 w-full rounded-full overflow-hidden flex shadow-inner">
          <div className="w-[10%] bg-emerald-500 h-full" title="Good (0-50)" />
          <div className="w-[10%] bg-yellow-400 h-full" title="Moderate (51-100)" />
          <div className="w-[10%] bg-orange-500 h-full" title="Unhealthy for Sensitive (101-150)" />
          <div className="w-[10%] bg-red-500 h-full" title="Unhealthy (151-200)" />
          <div className="w-[20%] bg-purple-600 h-full" title="Very Unhealthy (201-300)" />
          <div className="w-[40%] bg-rose-900 h-full" title="Hazardous (301-500)" />

          {/* Live indicator pin */}
          <div
            className="absolute top-0 bottom-0 w-2.5 bg-white border-2 border-black rounded-full transform -translate-x-1/2 shadow-md transition-all duration-700"
            style={{ left: `${Math.max(2, Math.min(98, (activeAqi / 500) * 100))}%` }}
          />
        </div>

        {/* Spectrum Labels */}
        <div className="flex justify-between text-[9px] font-mono font-medium text-[#71717A] pt-0.5">
          <span className="text-emerald-700">0 Good</span>
          <span className="text-yellow-700">50 Mod</span>
          <span className="text-orange-700">100 Caution</span>
          <span className="text-red-700">150 Unhealthy</span>
          <span className="text-purple-700">200 Very Unhealthy</span>
          <span className="text-rose-900">300+ Hazardous</span>
        </div>
      </div>
    </div>
  );
};
