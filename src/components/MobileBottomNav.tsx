import React from 'react';
import {
  Home,
  Sliders,
  MessageCircle,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

export type MobileTab = 'home' | 'simulator' | 'profiler' | 'world' | 'chat';

interface MobileBottomNavProps {
  activeTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  onOpenChat: () => void;
  onOpenWorldAqi: () => void;
  liquidGlassEnabled?: boolean;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenChat,
  onOpenWorldAqi,
  liquidGlassEnabled = false,
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 h-16 border-t flex items-center justify-around px-2 pb-1 select-none transition-all ${
        liquidGlassEnabled
          ? 'liquid-glass-header border-t-white/80'
          : 'bg-white border-t-[#E4E4E7] shadow-lg'
      }`}
    >
      {/* 1. Home / Dashboard */}
      <button
        type="button"
        onClick={() => onChangeTab('home')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-[6px] transition-colors cursor-pointer ${
          activeTab === 'home'
            ? 'text-[#18181B] font-bold'
            : 'text-[#71717A] hover:text-[#09090B]'
        }`}
      >
        <Home className={`w-4 h-4 ${activeTab === 'home' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">Home</span>
      </button>

      {/* 2. Simulator & 24h Curve */}
      <button
        type="button"
        onClick={() => onChangeTab('simulator')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-[6px] transition-colors cursor-pointer ${
          activeTab === 'simulator'
            ? 'text-[#18181B] font-bold'
            : 'text-[#71717A] hover:text-[#09090B]'
        }`}
      >
        <Sliders className={`w-4 h-4 ${activeTab === 'simulator' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">What-If</span>
      </button>

      {/* 3. My Setup (Household Profiler) */}
      <button
        type="button"
        onClick={() => onChangeTab('profiler')}
        className={`flex flex-col items-center justify-center py-1 px-2 rounded-[6px] transition-colors cursor-pointer ${
          activeTab === 'profiler'
            ? 'text-[#18181B] font-bold'
            : 'text-[#71717A] hover:text-[#09090B]'
        }`}
      >
        <SlidersHorizontal className={`w-4 h-4 ${activeTab === 'profiler' ? 'stroke-[2.5]' : ''}`} />
        <span className="text-[10px] mt-0.5">My Setup</span>
      </button>

      {/* 4. Live World AQI */}
      <button
        type="button"
        onClick={() => onOpenWorldAqi()}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-[6px] text-[#71717A] hover:text-[#09090B] transition-colors cursor-pointer relative"
      >
        <Globe className="w-4 h-4 text-sky-600" />
        <span className="text-[10px] mt-0.5">World AQI</span>
        <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </button>

      {/* 5. Ask Vayu Chat */}
      <button
        type="button"
        onClick={() => onOpenChat()}
        className="flex flex-col items-center justify-center py-1 px-2 rounded-[6px] text-emerald-700 hover:text-emerald-800 transition-colors cursor-pointer"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-[10px] mt-0.5 font-bold">Ask Vayu</span>
      </button>
    </nav>
  );
};
