import React, { useState } from 'react';
import {
  Share2,
  Printer,
  Sparkles,
  Droplets,
  HelpCircle,
} from 'lucide-react';
import type {
  ActionCard,
  City,
  CrisisScenario,
  HourlyDataPoint,
  SimulatorControls,
  UserProfile,
  VayuProtocolResponse,
} from '../types';
import { CityHeroBanner } from './CityHeroBanner';
import { CitizenViewBanner } from './CitizenViewBanner';
import { KpiStrip } from './KpiStrip';
import { ActionCardItem } from './ActionCardItem';
import { ExposureSimulator } from './ExposureSimulator';
import { LiquidGlassChamber } from './LiquidGlassChamber';

interface DashboardProps {
  protocol: VayuProtocolResponse;
  selectedCity: City;
  selectedScenario: CrisisScenario;
  profile: UserProfile;
  simulatedCurve: HourlyDataPoint[];
  simulatorControls: SimulatorControls;
  onToggleSimulatorControl: (key: keyof SimulatorControls) => void;
  activeHabitIds: Set<string>;
  onToggleHabit: (id: string) => void;
  onCopyWhatsAppBrief: () => void;
  engineSource?: 'gemini' | 'grounded-engine';
  liquidGlassEnabled?: boolean;
  onOpenJargonBuster?: () => void;
  onDetectLocation?: () => void;
  isDetectingLocation?: boolean;
}

type TabType = 'routines' | 'indoorHacks' | 'alternatives';

export const Dashboard: React.FC<DashboardProps> = ({
  protocol,
  selectedCity,
  selectedScenario,
  profile,
  simulatedCurve,
  simulatorControls,
  onToggleSimulatorControl,
  activeHabitIds,
  onToggleHabit,
  onCopyWhatsAppBrief,
  liquidGlassEnabled = false,
  onOpenJargonBuster,
  onDetectLocation,
  isDetectingLocation = false,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('routines');

  const tabCards: Record<TabType, ActionCard[]> = {
    routines: protocol.routines || [],
    indoorHacks: protocol.indoorHacks || [],
    alternatives: protocol.alternatives || [],
  };

  const currentCards = tabCards[activeTab];

  // Calculate total habits across all 3 categories (12 total items)
  const totalHabits =
    (protocol.routines?.length || 0) +
    (protocol.indoorHacks?.length || 0) +
    (protocol.alternatives?.length || 0);

  const activeCount = activeHabitIds.size;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6 max-w-5xl mx-auto print:p-0 print:max-w-none relative z-10 pb-20 sm:pb-6">
      {/* 0. REAL CITY SKYLINE PHOTOGRAPHY & AQI COLOR SPECTRUM BANNER WITH EXACT LOCATION ADDRESS */}
      <CityHeroBanner
        city={selectedCity}
        scenario={selectedScenario}
        liquidGlassEnabled={liquidGlassEnabled}
        onDetectLocation={onDetectLocation}
        isDetectingLocation={isDetectingLocation}
      />

      {/* 1. CITIZEN SIMPLE VIEW: Family Daily Air Safety Cheat Sheet */}
      <CitizenViewBanner
        scenario={selectedScenario}
        city={selectedCity}
        profile={profile}
        onOpenJargonBuster={onOpenJargonBuster || (() => {})}
        liquidGlassEnabled={liquidGlassEnabled}
      />

      {/* 2. ADVISORY BANNER / SCENARIO ALERT */}
      <div
        className={`rounded-[6px] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden transition-all ${
          liquidGlassEnabled
            ? 'liquid-glass-panel'
            : 'bg-white border border-[#E4E4E7]'
        }`}
      >
        {liquidGlassEnabled && <div className="glass-specular-glare" />}
        <div className="flex items-start space-x-3 relative z-10">
          <div className="w-8 h-8 rounded-[4px] bg-[#18181B] text-white flex items-center justify-center shrink-0 font-bold">
            !
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                {selectedCity.name} Tactical Air Quality Assessment
              </h2>
              <span className="text-[10px] font-mono text-[#71717A]">
                Scenario: {selectedScenario.label}
              </span>
            </div>
            <p className="text-xs text-[#52525B] mt-1 leading-relaxed">
              {protocol.summary.advisoryHeadline}
            </p>
          </div>
        </div>

        <div className="shrink-0 flex items-center space-x-2 text-xs font-mono relative z-10">
          <span className="text-[#71717A]">Inversion Trap:</span>
          <span className="font-semibold text-[#09090B] bg-[#F4F4F5] px-2 py-1 rounded-[4px] border border-[#E4E4E7] tabular-nums">
            {selectedCity.scenarios[selectedScenario.id]?.inversionWindow || selectedScenario.thermalInversionWindow}
          </span>
        </div>
      </div>

      {/* LIQUID GLASS OPTICAL REFRACTION CHAMBER (Featured when Liquid Glass is active) */}
      {liquidGlassEnabled && (
        <LiquidGlassChamber
          scenario={selectedScenario}
          city={selectedCity}
          profile={profile}
          projectedPm25={protocol.summary.projectedDailyPm25}
        />
      )}

      {/* ROW 1: EXECUTIVE EXPOSURE & IMPACT SUMMARY STRIP */}
      <KpiStrip
        summary={protocol.summary}
        activeHabitsCount={activeCount}
        totalHabitsCount={totalHabits}
        liquidGlassEnabled={liquidGlassEnabled}
      />

      {/* ROW 2: SEGMENTED PROTOCOL NAVIGATION + EXPORT CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        {/* Segmented Tab Bar */}
        <div
          className={`inline-flex p-1 rounded-[6px] self-start sm:self-auto overflow-x-auto max-w-full no-scrollbar ${
            liquidGlassEnabled
              ? 'liquid-glass-pill'
              : 'bg-[#F4F4F5] border border-[#E4E4E7]'
          }`}
        >
          {[
            { id: 'routines', label: '1. Low-Emission Daily Routines' },
            { id: 'indoorHacks', label: '2. Indoor Air Quality (IAQ) Hacks' },
            { id: 'alternatives', label: '3. Sustainable Alternatives' },
          ].map((tab) => {
            const isCurrent = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`px-3 py-1.5 text-xs rounded-[4px] font-medium transition-colors cursor-pointer whitespace-nowrap ${
                  isCurrent
                    ? liquidGlassEnabled
                      ? 'bg-white/90 text-[#09090B] font-semibold shadow-sm border border-white'
                      : 'bg-white text-[#09090B] border border-[#E4E4E7] shadow-none font-semibold'
                    : 'text-[#52525B] hover:text-[#09090B] border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Utility Buttons */}
        <div className="flex items-center space-x-2">
          {/* Copy Family WhatsApp Brief */}
          <button
            type="button"
            onClick={onCopyWhatsAppBrief}
            className={`px-2.5 py-1.5 rounded-[4px] text-xs font-medium text-[#09090B] flex items-center space-x-1.5 transition-colors cursor-pointer ${
              liquidGlassEnabled
                ? 'liquid-glass-pill hover:bg-white'
                : 'bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] shadow-none'
            }`}
            title="Copy clean WhatsApp family briefing text"
          >
            <Share2 className="w-3.5 h-3.5 text-[#71717A]" />
            <span className="hidden sm:inline">Copy Family WhatsApp Brief</span>
            <span className="sm:hidden">Share</span>
          </button>

          {/* Print / PDF Playbook */}
          <button
            type="button"
            onClick={handlePrint}
            className={`px-2.5 py-1.5 rounded-[4px] text-xs font-medium text-[#09090B] flex items-center space-x-1.5 transition-colors cursor-pointer ${
              liquidGlassEnabled
                ? 'liquid-glass-pill hover:bg-white'
                : 'bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] shadow-none'
            }`}
            title="Print or export PDF tactical playbook"
          >
            <Printer className="w-3.5 h-3.5 text-[#71717A]" />
            <span className="hidden sm:inline">Print / PDF Playbook</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>

      {/* ROW 3: STRUCTURED AI RECOMMENDATION CARDS (2-column grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {currentCards.map((card) => (
          <ActionCardItem
            key={card.id}
            card={card}
            categoryLabel={
              activeTab === 'routines'
                ? 'Routine'
                : activeTab === 'indoorHacks'
                ? 'IAQ Protocol'
                : 'Sustainable Swap'
            }
            isActive={activeHabitIds.has(card.id)}
            onToggleActive={onToggleHabit}
            liquidGlassEnabled={liquidGlassEnabled}
          />
        ))}
      </div>

      {/* ROW 4: INTERACTIVE "WHAT-IF" LIFESTYLE & EXPOSURE SIMULATOR */}
      <ExposureSimulator
        baseCurve={protocol.hourlyExposureCurve}
        simulatedCurve={simulatedCurve}
        controls={simulatorControls}
        onToggleControl={onToggleSimulatorControl}
        profile={profile}
        liquidGlassEnabled={liquidGlassEnabled}
      />

      {/* DOMAIN FOOTER: Scientific Grounding Metadata */}
      <div className="text-[11px] text-[#71717A] border-t border-[#E4E4E7] pt-4 pb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex items-center space-x-2">
          <span>Engine Grounding:</span>
          <span className="font-mono text-[#09090B]">CPCB NAQI (India)</span>
          <span>•</span>
          <span className="font-mono text-[#09090B]">WHO 2021 AQG (15 µg/m³)</span>
          <span>•</span>
          <span className="font-mono text-[#09090B]">ASHRAE 62.2 Ventilation</span>
        </div>
        <div className="flex items-center space-x-2">
          {liquidGlassEnabled && (
            <span className="flex items-center space-x-1 text-sky-700 font-medium">
              <Droplets className="w-3 h-3" />
              <span>Liquid Glass Optic Mode Active</span>
              <span>•</span>
            </span>
          )}
          <span>VayuGrid OS v1.0 • Designed for Everyday Citizens & Families</span>
        </div>
      </div>
    </div>
  );
};
