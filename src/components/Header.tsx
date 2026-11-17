import React, { useState } from 'react';
import {
  Search,
  KeyRound,
  ChevronDown,
  CloudFog,
  Droplets,
  Globe,
  HelpCircle,
  MapPin,
  Navigation,
  Sparkles,
} from 'lucide-react';
import type { City, CrisisScenario, CrisisScenarioId, SitePageId } from '../types';
import { CITIES, CRISIS_SCENARIOS } from '../data/defaultData';
import type { DeviceInfo } from '../hooks/useDeviceDetection';
import { DeviceModeSelector } from './DeviceModeSelector';

interface HeaderProps {
  selectedCity: City;
  onSelectCity: (city: City) => void;
  selectedScenario: CrisisScenario;
  onSelectScenario: (scenarioId: CrisisScenarioId) => void;
  onOpenQuickAsk: () => void;
  onOpenSettings: () => void;
  onOpenWorldAqi?: () => void;
  onOpenJargonBuster?: () => void;
  hasApiKey: boolean;
  onCustomCityNameChange?: (name: string) => void;
  liquidGlassEnabled?: boolean;
  onToggleLiquidGlass?: () => void;
  deviceInfo?: DeviceInfo;
  onDetectLocation?: () => void;
  isDetectingLocation?: boolean;
  onOpenPage?: (pageId: SitePageId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCity,
  onSelectCity,
  selectedScenario,
  onSelectScenario,
  onOpenQuickAsk,
  onOpenSettings,
  onOpenWorldAqi,
  onOpenJargonBuster,
  hasApiKey,
  onCustomCityNameChange,
  liquidGlassEnabled = false,
  onToggleLiquidGlass,
  deviceInfo,
  onDetectLocation,
  isDetectingLocation = false,
  onOpenPage,
}) => {
  const [cityMenuOpen, setCityMenuOpen] = useState(false);
  const [customNameInput, setCustomNameInput] = useState(selectedCity.name);

  // Status pill styles based on exact design system specification
  const getStatusBadge = (statusType: 'moderate' | 'poor' | 'severe') => {
    switch (statusType) {
      case 'moderate':
        return 'bg-yellow-400 text-zinc-950 font-bold border border-yellow-500';
      case 'poor':
        return 'bg-orange-500 text-white font-bold border border-orange-600';
      case 'severe':
      default:
        return 'bg-rose-900 text-white font-bold border border-rose-950 animate-pulse';
    }
  };

  // Get active scenario metrics for selected city
  const cityScenarioData = selectedCity.scenarios[selectedScenario.id];
  const activeAqi = cityScenarioData ? cityScenarioData.aqi : selectedScenario.aqi;
  const activePm25 = cityScenarioData ? cityScenarioData.pm25 : selectedScenario.pm25;
  const activePm10 = cityScenarioData ? cityScenarioData.pm10 : selectedScenario.pm10;
  const activeInversion = cityScenarioData ? cityScenarioData.inversionWindow : selectedScenario.thermalInversionWindow;

  return (
    <header
      className={`h-14 px-4 flex items-center justify-between sticky top-0 z-30 select-none transition-all ${
        liquidGlassEnabled
          ? 'liquid-glass-header'
          : 'border-b border-[#E4E4E7] bg-white'
      }`}
    >
      {/* LEFT: Brand Mark + City Selector + Live World AQI Trigger */}
      <div className="flex items-center space-x-2.5 shrink-0">
        <div className="flex items-center space-x-1.5">
          <div className="w-5 h-5 rounded-[4px] bg-[#18181B] text-white flex items-center justify-center font-bold text-xs tracking-tighter shadow-none">
            V
          </div>
          <span className="font-semibold text-[15px] tracking-tight text-[#09090B]">
            VayuGrid
          </span>
          <span className="text-[10px] font-mono uppercase bg-[#F4F4F5] text-[#71717A] px-1.5 py-0.5 rounded-[4px] border border-[#E4E4E7] font-medium tracking-wide">
            v1.0
          </span>
        </div>

        <div className="h-4 w-[1px] bg-[#E4E4E7] mx-0.5" />

        {/* City Selector Dropdown with Real City Photo Thumbnails */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setCityMenuOpen(!cityMenuOpen)}
            className={`flex items-center space-x-1.5 px-2 py-1 text-xs font-medium text-[#09090B] border rounded-[4px] transition-colors cursor-pointer ${
              liquidGlassEnabled
                ? 'liquid-glass-pill'
                : 'bg-[#FAFAFA] hover:bg-[#F4F4F5] border-[#E4E4E7]'
            }`}
          >
            {selectedCity.imageUrl && (
              <img
                src={selectedCity.imageUrl}
                alt={selectedCity.name}
                className="w-4 h-4 rounded-full object-cover shrink-0 border border-zinc-300"
              />
            )}
            <span className="font-semibold">{selectedCity.name}</span>
            <span className="text-[#71717A] text-[11px] hidden sm:inline">({selectedCity.country})</span>
            <ChevronDown className="w-3 h-3 text-[#71717A]" />
          </button>

          {cityMenuOpen && (
            <div
              className={`absolute left-0 mt-1 w-64 rounded-[6px] shadow-lg py-1 z-50 ${
                liquidGlassEnabled ? 'liquid-glass-panel' : 'bg-white border border-[#E4E4E7]'
              }`}
            >
              <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-[#71717A]">
                Select Urban Station
              </div>
              {CITIES.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  onClick={() => {
                    onSelectCity(city);
                    setCityMenuOpen(false);
                  }}
                  className={`w-full text-left px-2.5 py-1.5 text-xs flex items-center justify-between hover:bg-[#F4F4F5] transition-colors cursor-pointer ${
                    selectedCity.id === city.id ? 'bg-[#F4F4F5] font-semibold text-[#09090B]' : 'text-[#52525B]'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {city.imageUrl && (
                      <img
                        src={city.imageUrl}
                        alt={city.name}
                        className="w-5 h-5 rounded-full object-cover shrink-0 border border-zinc-300"
                      />
                    )}
                    <span className="truncate">{city.name}</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold text-[#09090B] shrink-0">
                    {city.scenarios[selectedScenario.id]?.aqi ? `AQI ${city.scenarios[selectedScenario.id].aqi}` : ''}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* LIVE WORLD AQI BUTTON (Free Internet API) */}
        <button
          type="button"
          onClick={onOpenWorldAqi}
          className="flex items-center space-x-1.5 px-2 py-1 text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-[4px] transition-colors cursor-pointer"
          title="Open Free Live Internet Air Quality Feed & World Map"
        >
          <Globe className="w-3.5 h-3.5 text-sky-600" />
          <span className="hidden sm:inline">World AQI</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
        </button>

        {/* Custom City Name Inline Edit */}
        {selectedCity.id === 'custom' && (
          <div className="flex items-center space-x-1">
            <input
              type="text"
              value={customNameInput}
              onChange={(e) => {
                setCustomNameInput(e.target.value);
                onCustomCityNameChange?.(e.target.value);
              }}
              placeholder="City Name"
              className="text-xs px-2 py-0.5 border border-[#E4E4E7] rounded-[4px] bg-[#FAFAFA] text-[#09090B] w-24 focus:outline-none focus:border-[#18181B]"
            />
          </div>
        )}
      </div>

      {/* CENTER: Live Smog Telemetry Strip with Color Badges */}
      <div
        className={`hidden xl:flex items-center space-x-4 px-3 py-1 rounded-[6px] ${
          liquidGlassEnabled
            ? 'liquid-glass-pill'
            : 'bg-[#FAFAFA] border border-[#E4E4E7]'
        }`}
      >
        {/* CPCB AQI */}
        <div className="flex items-center space-x-1.5">
          <span className="text-[11px] font-bold text-[#52525B]">AQI:</span>
          <span
            className={`text-xs px-2 py-0.5 rounded-[4px] font-mono font-bold tabular-nums ${getStatusBadge(
              selectedScenario.statusType
            )}`}
          >
            {activeAqi}
          </span>
        </div>

        <div className="h-3 w-[1px] bg-[#E4E4E7]" />

        {/* PM2.5 */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] text-[#71717A]">PM2.5:</span>
          <span className="text-xs font-mono font-bold text-amber-700 tabular-nums">
            {activePm25}
          </span>
          <span className="text-[10px] text-[#71717A] font-mono">µg/m³</span>
        </div>

        <div className="h-3 w-[1px] bg-[#E4E4E7]" />

        {/* PM10 */}
        <div className="flex items-center space-x-1">
          <span className="text-[11px] text-[#71717A]">PM10:</span>
          <span className="text-xs font-mono font-bold text-[#09090B] tabular-nums">
            {activePm10}
          </span>
          <span className="text-[10px] text-[#71717A] font-mono">µg/m³</span>
        </div>

        <div className="h-3 w-[1px] bg-[#E4E4E7]" />

        {/* Inversion Window */}
        <div className="flex items-center space-x-1.5">
          <CloudFog className="w-3.5 h-3.5 text-red-600" />
          <span className="text-[11px] text-[#71717A]">Inversion Trap:</span>
          <span className="text-xs font-mono font-bold text-red-800 tabular-nums">
            {activeInversion}
          </span>
        </div>
      </div>

      {/* RIGHT: Device Mode Selector + Crisis Simulator + Glass + Plain English + Settings */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* DEVICE MODE DETECTOR & SELECTOR (Windows / Android / Tablet) */}
        {deviceInfo && (
          <DeviceModeSelector
            deviceInfo={deviceInfo}
            liquidGlassEnabled={liquidGlassEnabled}
          />
        )}

        {/* One-Click Crisis Simulator Pill Switcher with Color Accents */}
        <div
          className={`hidden md:flex items-center p-0.5 rounded-[6px] ${
            liquidGlassEnabled
              ? 'liquid-glass-pill'
              : 'bg-[#F4F4F5] border border-[#E4E4E7]'
          }`}
        >
          {(['moderate', 'winter_smog', 'severe_crisis'] as CrisisScenarioId[]).map((scenId) => {
            const scen = CRISIS_SCENARIOS[scenId];
            const isSelected = selectedScenario.id === scenId;
            const aqiValue = selectedCity.scenarios[scenId]?.aqi || scen.aqi;

            let colorIndicator = 'bg-yellow-400';
            if (scenId === 'winter_smog') colorIndicator = 'bg-orange-500';
            if (scenId === 'severe_crisis') colorIndicator = 'bg-rose-600';

            return (
              <button
                key={scenId}
                type="button"
                onClick={() => onSelectScenario(scenId)}
                className={`px-2 py-1 text-[11px] rounded-[4px] transition-all flex items-center space-x-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white text-[#09090B] shadow-xs font-bold border border-[#E4E4E7]'
                    : 'text-[#52525B] hover:text-[#09090B] border border-transparent'
                }`}
                title={scen.description}
              >
                <span className={`w-2 h-2 rounded-full ${colorIndicator}`} />
                <span>{scen.label}:</span>
                <span className="font-mono tabular-nums font-bold">AQI {aqiValue}</span>
              </button>
            );
          })}
        </div>

        {/* Plain English Guide Button */}
        {onOpenJargonBuster && (
          <button
            type="button"
            onClick={onOpenJargonBuster}
            className={`hidden lg:flex items-center space-x-1 px-2 py-1 text-xs text-[#52525B] hover:text-[#09090B] rounded-[4px] transition-colors cursor-pointer ${
              liquidGlassEnabled ? 'liquid-glass-pill' : 'bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7]'
            }`}
            title="What do PM2.5, AQI and Inversion mean?"
          >
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Plain English</span>
          </button>
        )}

        {/* VIKABUILDS & Company Hub */}
        {onOpenPage && (
          <button
            type="button"
            onClick={() => onOpenPage('vikabuilds')}
            className={`hidden md:flex items-center space-x-1.5 px-2 py-1 text-xs text-[#09090B] hover:bg-[#F4F4F5] rounded-[4px] border transition-colors cursor-pointer ${
              liquidGlassEnabled
                ? 'liquid-glass-pill border-amber-300/40 text-amber-900 font-semibold'
                : 'bg-white border-[#E4E4E7]'
            }`}
            title="VIKABUILDS — About Us, Contact & Policies"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="font-semibold tracking-tight">VIKABUILDS</span>
          </button>
        )}

        {/* LIQUID GLASS FEATURE TOGGLE */}
        <button
          type="button"
          onClick={onToggleLiquidGlass}
          className={`flex items-center space-x-1.5 px-2 py-1 text-xs rounded-[4px] border transition-all cursor-pointer ${
            liquidGlassEnabled
              ? 'bg-[#18181B] text-white border-zinc-700 shadow-[0_0_12px_rgba(56,189,248,0.25)]'
              : 'bg-white text-[#52525B] hover:text-[#09090B] border-[#E4E4E7]'
          }`}
          title="Toggle Liquid Glass Refraction Mode"
        >
          <Droplets className={`w-3.5 h-3.5 ${liquidGlassEnabled ? 'text-sky-400' : 'text-[#71717A]'}`} />
          <span className="font-medium hidden sm:inline">Glass</span>
          <span
            className={`text-[9px] font-mono px-1 py-0.2 rounded uppercase ${
              liquidGlassEnabled ? 'bg-sky-500/20 text-sky-300' : 'bg-zinc-100 text-[#71717A]'
            }`}
          >
            {liquidGlassEnabled ? 'ON' : 'OFF'}
          </span>
        </button>

        {/* Cmd/Ctrl + K Quick Ask Trigger */}
        <button
          type="button"
          onClick={onOpenQuickAsk}
          className={`hidden sm:flex items-center space-x-1.5 px-2.5 py-1 text-xs text-[#52525B] hover:text-[#09090B] rounded-[4px] transition-colors cursor-pointer ${
            liquidGlassEnabled ? 'liquid-glass-pill' : 'bg-[#FAFAFA] hover:bg-[#F4F4F5] border border-[#E4E4E7]'
          }`}
          title="Quick Ask Assistant (Cmd/Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Ask</span>
          <kbd className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded-[3px] border border-[#E4E4E7] text-[#71717A]">
            {deviceInfo?.effectiveOs === 'mac' || deviceInfo?.effectiveOs === 'ios' ? '⌘K' : 'Ctrl+K'}
          </kbd>
        </button>

        {/* Settings / API Key Button */}
        <button
          type="button"
          onClick={onOpenSettings}
          className={`relative p-1.5 text-[#52525B] hover:text-[#09090B] rounded-[4px] transition-colors cursor-pointer ${
            liquidGlassEnabled ? 'liquid-glass-pill' : 'hover:bg-[#F4F4F5] border border-[#E4E4E7]'
          }`}
          title={hasApiKey ? 'Gemini API Connected (Settings)' : 'Configure Gemini API Key'}
        >
          <KeyRound className="w-3.5 h-3.5" />
          {hasApiKey && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          )}
        </button>
      </div>
    </header>
  );
};
