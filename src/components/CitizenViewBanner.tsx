import React from 'react';
import {
  Heart,
  Baby,
  DoorClosed,
  ShieldAlert,
  Flame,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import type { City, CrisisScenario, UserProfile } from '../types';

interface CitizenViewBannerProps {
  scenario: CrisisScenario;
  city: City;
  profile: UserProfile;
  onOpenJargonBuster: () => void;
  liquidGlassEnabled?: boolean;
}

export const CitizenViewBanner: React.FC<CitizenViewBannerProps> = ({
  scenario,
  city,
  profile,
  onOpenJargonBuster,
  liquidGlassEnabled = false,
}) => {
  const isSevere = scenario.aqi > 300;
  const isPoor = scenario.aqi > 150;
  const isModerate = scenario.aqi > 90;

  // Simple plain-English recommendations for everyday citizens
  const walkAdvice = isPoor
    ? {
        allowed: false,
        title: 'Morning Walk & Jogging',
        status: '❌ Stay Indoors',
        detail: 'Cold morning air traps toxic smoke at street level. Exercise indoors today.',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
      }
    : isModerate
    ? {
        allowed: true,
        title: 'Morning Walk & Jogging',
        status: '⚠️ Walk After 1:30 PM',
        detail: 'Afternoon sun lifts smog. Avoid morning and late night jogs.',
        badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      }
    : {
        allowed: true,
        title: 'Morning Walk & Jogging',
        status: '✅ Safe for Outdoor Walks',
        detail: 'Air is clean enough for normal outdoor exercise.',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };

  const kidsAdvice = isPoor
    ? {
        title: 'Kids & Seniors',
        status: '⚠️ Keep Inside',
        detail: 'Keep infants, grandparents, and asthma patients in the quietest, closed room.',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
      }
    : {
        title: 'Kids & Seniors',
        status: '✅ Normal Play OK',
        detail: 'Safe for light outdoor play; avoid heavy sprint exertion if sensitive.',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };

  const windowAdvice = isPoor
    ? {
        title: 'Home Windows',
        status: '🚪 Keep Sealed',
        detail: 'Do not open windows today—outside smog will rush inside within 15 minutes.',
        badgeColor: 'bg-red-50 text-red-700 border-red-200',
      }
    : {
        title: 'Home Windows',
        status: '🪟 Air Out 1:30–4:00 PM',
        detail: 'Safe to open windows for 20 minutes in the early afternoon sun to refresh air.',
        badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      };

  const maskAdvice = isPoor
    ? {
        title: 'Mask Needed?',
        status: '😷 Wear N95 Mask',
        detail: 'Cloth & surgical masks leak smog particles. Use a tight-fitting N95 respirator outside.',
        badgeColor: 'bg-orange-50 text-orange-700 border-orange-200',
      }
    : {
        title: 'Mask Needed?',
        status: 'Optional',
        detail: 'Not strictly required unless near heavy diesel traffic or dusty roads.',
        badgeColor: 'bg-zinc-100 text-zinc-700 border-zinc-200',
      };

  const cookingAdvice = {
    title: 'Kitchen Cooking',
    status: profile.cooking === 'gas_no_exhaust' ? '⚠️ Kitchen Exhaust Needed' : '✅ Keep Exhaust On',
    detail: 'Cooking rotis and frying spikes indoor smoke. Keep kitchen exhaust fan running + 15 min after.',
    badgeColor: profile.cooking === 'gas_no_exhaust' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  return (
    <div
      className={`rounded-[6px] p-4 transition-all relative overflow-hidden ${
        liquidGlassEnabled ? 'liquid-glass-panel' : 'bg-white border border-[#E4E4E7]'
      }`}
    >
      {liquidGlassEnabled && <div className="glass-specular-glare" />}

      {/* TOP TITLE STRIP */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#E4E4E7]/60 gap-2 relative z-10">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-[4px] bg-[#18181B] text-white flex items-center justify-center font-bold text-xs">
            🏠
          </div>
          <div>
            <h3 className="font-semibold text-xs text-[#09090B]">
              Family Daily Air Safety Guide for {city.name}
            </h3>
            <p className="text-[11px] text-[#71717A]">
              Plain-English instructions for your family right now — no confusing science terms.
            </p>
          </div>
        </div>

        {/* Explain Terms in Plain English button */}
        <button
          type="button"
          onClick={onOpenJargonBuster}
          className="self-start sm:self-auto px-2.5 py-1 text-[11px] font-medium rounded-[4px] border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#09090B] transition-colors flex items-center space-x-1 cursor-pointer shadow-none"
        >
          <HelpCircle className="w-3.5 h-3.5 text-[#71717A]" />
          <span>Explain Terms in Plain English</span>
        </button>
      </div>

      {/* 5 SIMPLE CARDS FOR CITIZENS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-3 relative z-10">
        {/* Card 1: Walks */}
        <div className="bg-white/70 border border-[#E4E4E7] p-2.5 rounded-[5px] flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[#71717A]">Walks & Runs</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${walkAdvice.badgeColor}`}>
              {walkAdvice.status}
            </span>
          </div>
          <div className="text-xs font-semibold text-[#09090B] leading-tight">
            {walkAdvice.title}
          </div>
          <p className="text-[11px] text-[#52525B] leading-tight">
            {walkAdvice.detail}
          </p>
        </div>

        {/* Card 2: Kids & Seniors */}
        <div className="bg-white/70 border border-[#E4E4E7] p-2.5 rounded-[5px] flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[#71717A]">Kids & Elders</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${kidsAdvice.badgeColor}`}>
              {kidsAdvice.status}
            </span>
          </div>
          <div className="text-xs font-semibold text-[#09090B] leading-tight">
            {kidsAdvice.title}
          </div>
          <p className="text-[11px] text-[#52525B] leading-tight">
            {kidsAdvice.detail}
          </p>
        </div>

        {/* Card 3: Windows */}
        <div className="bg-white/70 border border-[#E4E4E7] p-2.5 rounded-[5px] flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[#71717A]">Windows</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${windowAdvice.badgeColor}`}>
              {windowAdvice.status}
            </span>
          </div>
          <div className="text-xs font-semibold text-[#09090B] leading-tight">
            {windowAdvice.title}
          </div>
          <p className="text-[11px] text-[#52525B] leading-tight">
            {windowAdvice.detail}
          </p>
        </div>

        {/* Card 4: Masks */}
        <div className="bg-white/70 border border-[#E4E4E7] p-2.5 rounded-[5px] flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[#71717A]">Mask</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${maskAdvice.badgeColor}`}>
              {maskAdvice.status}
            </span>
          </div>
          <div className="text-xs font-semibold text-[#09090B] leading-tight">
            {maskAdvice.title}
          </div>
          <p className="text-[11px] text-[#52525B] leading-tight">
            {maskAdvice.detail}
          </p>
        </div>

        {/* Card 5: Kitchen */}
        <div className="bg-white/70 border border-[#E4E4E7] p-2.5 rounded-[5px] flex flex-col justify-between space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase text-[#71717A]">Kitchen</span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${cookingAdvice.badgeColor}`}>
              {cookingAdvice.status}
            </span>
          </div>
          <div className="text-xs font-semibold text-[#09090B] leading-tight">
            {cookingAdvice.title}
          </div>
          <p className="text-[11px] text-[#52525B] leading-tight">
            {cookingAdvice.detail}
          </p>
        </div>
      </div>
    </div>
  );
};
