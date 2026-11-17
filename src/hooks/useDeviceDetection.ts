import { useState, useEffect } from 'react';

export type DeviceType = 'windows' | 'android' | 'tablet' | 'ios' | 'mac' | 'other';
export type FormFactor = 'desktop' | 'mobile' | 'tablet';
export type DeviceOverrideMode = 'auto' | 'windows' | 'android' | 'tablet';

const STORAGE_DEVICE_MODE = 'vayugrid_device_override';

export interface DeviceInfo {
  detectedOs: DeviceType;
  detectedFormFactor: FormFactor;
  overrideMode: DeviceOverrideMode;
  effectiveFormFactor: FormFactor;
  effectiveOs: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  displayName: string;
  setOverrideMode: (mode: DeviceOverrideMode) => void;
}

export function useDeviceDetection(): DeviceInfo {
  const [overrideMode, setOverrideModeState] = useState<DeviceOverrideMode>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_DEVICE_MODE);
      if (saved && ['auto', 'windows', 'android', 'tablet'].includes(saved)) {
        return saved as DeviceOverrideMode;
      }
    } catch {
      // fallback
    }
    return 'auto';
  });

  const [windowWidth, setWindowWidth] = useState<number>(() =>
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const setOverrideMode = (mode: DeviceOverrideMode) => {
    setOverrideModeState(mode);
    try {
      localStorage.setItem(STORAGE_DEVICE_MODE, mode);
    } catch {
      // ignore
    }
  };

  // Detect real device OS from User-Agent
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  let detectedOs: DeviceType = 'windows';

  if (/android/.test(ua)) {
    detectedOs = 'android';
  } else if (/ipad|tablet/.test(ua) || (/macintosh/.test(ua) && 'ontouchend' in document)) {
    detectedOs = 'tablet';
  } else if (/iphone|ipod/.test(ua)) {
    detectedOs = 'ios';
  } else if (/win/.test(ua)) {
    detectedOs = 'windows';
  } else if (/mac/.test(ua)) {
    detectedOs = 'mac';
  } else {
    detectedOs = 'other';
  }

  // Detect form factor from screen width and UA
  let detectedFormFactor: FormFactor = 'desktop';
  if (detectedOs === 'android' || detectedOs === 'ios' || windowWidth < 768) {
    // Check if tablet size
    if (windowWidth >= 640 && windowWidth < 1024) {
      detectedFormFactor = 'tablet';
    } else if (windowWidth < 640) {
      detectedFormFactor = 'mobile';
    } else {
      detectedFormFactor = 'desktop';
    }
  } else if (detectedOs === 'tablet' || (windowWidth >= 768 && windowWidth <= 1024)) {
    detectedFormFactor = 'tablet';
  } else {
    detectedFormFactor = 'desktop';
  }

  // Compute effective form factor and OS based on override
  let effectiveFormFactor: FormFactor = detectedFormFactor;
  let effectiveOs: DeviceType = detectedOs;

  if (overrideMode === 'windows') {
    effectiveFormFactor = 'desktop';
    effectiveOs = 'windows';
  } else if (overrideMode === 'android') {
    effectiveFormFactor = 'mobile';
    effectiveOs = 'android';
  } else if (overrideMode === 'tablet') {
    effectiveFormFactor = 'tablet';
    effectiveOs = 'tablet';
  }

  const isMobile = effectiveFormFactor === 'mobile';
  const isTablet = effectiveFormFactor === 'tablet';
  const isDesktop = effectiveFormFactor === 'desktop';

  let displayName = 'Windows Desktop';
  if (effectiveOs === 'android') displayName = 'Android Mobile';
  else if (effectiveOs === 'tablet') displayName = 'Tablet Device';
  else if (effectiveOs === 'ios') displayName = 'iOS Mobile';
  else if (effectiveOs === 'mac') displayName = 'macOS Desktop';

  return {
    detectedOs,
    detectedFormFactor,
    overrideMode,
    effectiveFormFactor,
    effectiveOs,
    isMobile,
    isTablet,
    isDesktop,
    displayName,
    setOverrideMode,
  };
}
