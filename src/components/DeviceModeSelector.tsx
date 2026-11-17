import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  Check,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import type { DeviceInfo, DeviceOverrideMode } from '../hooks/useDeviceDetection';

interface DeviceModeSelectorProps {
  deviceInfo: DeviceInfo;
  liquidGlassEnabled?: boolean;
}

export const DeviceModeSelector: React.FC<DeviceModeSelectorProps> = ({
  deviceInfo,
  liquidGlassEnabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const getDeviceIcon = () => {
    if (deviceInfo.effectiveFormFactor === 'mobile') {
      return <Smartphone className="w-3.5 h-3.5 text-emerald-600" />;
    }
    if (deviceInfo.effectiveFormFactor === 'tablet') {
      return <Tablet className="w-3.5 h-3.5 text-sky-600" />;
    }
    return <Monitor className="w-3.5 h-3.5 text-indigo-600" />;
  };

  const modes: { id: DeviceOverrideMode; label: string; icon: typeof Monitor; desc: string }[] = [
    {
      id: 'auto',
      label: `Auto (${deviceInfo.detectedOs.toUpperCase()})`,
      icon: Sparkles,
      desc: 'Automatically matches your real device screen and OS',
    },
    {
      id: 'windows',
      label: 'Windows Desktop Layout',
      icon: Monitor,
      desc: 'High-density SaaS cockpit with fixed sidebar & Ctrl+K',
    },
    {
      id: 'android',
      label: 'Android Mobile App Layout',
      icon: Smartphone,
      desc: 'Thumb-friendly bottom bar, touch targets & sheet controls',
    },
    {
      id: 'tablet',
      label: 'Tablet / iPad Split Layout',
      icon: Tablet,
      desc: 'Optimized 2-column balanced touch grid for tablets',
    },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-1.5 px-2 py-1 text-xs font-semibold rounded-[4px] border transition-colors cursor-pointer ${
          liquidGlassEnabled
            ? 'liquid-glass-pill hover:bg-white'
            : 'bg-[#FAFAFA] hover:bg-[#F4F4F5] border-[#E4E4E7] text-[#09090B]'
        }`}
        title={`Device: ${deviceInfo.displayName} (Click to switch preview)`}
      >
        {getDeviceIcon()}
        <span className="hidden sm:inline font-mono text-[11px]">
          {deviceInfo.overrideMode === 'auto'
            ? deviceInfo.displayName
            : deviceInfo.overrideMode.toUpperCase()}
        </span>
        <ChevronDown className="w-3 h-3 text-[#71717A]" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 mt-1 w-64 rounded-[6px] shadow-xl py-1 z-50 ${
            liquidGlassEnabled ? 'liquid-glass-panel' : 'bg-white border border-[#E4E4E7]'
          }`}
        >
          <div className="px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase text-[#71717A] border-b border-[#E4E4E7]/60">
            Device UI Layout Optimizer
          </div>
          {modes.map((m) => {
            const Icon = m.icon;
            const isSelected = deviceInfo.overrideMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  deviceInfo.setOverrideMode(m.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-start space-x-2 hover:bg-[#F4F4F5] transition-colors cursor-pointer ${
                  isSelected ? 'bg-zinc-100 font-semibold text-[#09090B]' : 'text-[#52525B]'
                }`}
              >
                <Icon className="w-4 h-4 mt-0.5 shrink-0 text-[#18181B]" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">{m.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                  </div>
                  <div className="text-[10px] text-[#71717A] leading-tight mt-0.5">
                    {m.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
