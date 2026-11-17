import React, { useState, useEffect, useMemo, useCallback } from 'react';
import type {
  City,
  CrisisScenario,
  CrisisScenarioId,
  SimulatorControls,
  UserProfile,
  VayuProtocolResponse,
  SitePageId,
} from './types';
import { CITIES, CRISIS_SCENARIOS, DEFAULT_USER_PROFILE } from './data/defaultData';
import {
  calculateGroundedProtocol,
  applySimulatorModifiers,
} from './services/groundedEngine';
import {
  generateVayuProtocol,
  getStoredApiKey,
} from './services/geminiService';
import {
  fetchLiveAirQuality,
  type LiveAirQualityData,
} from './services/liveAirQualityApi';
import { reverseGeocodeCoordinates } from './services/reverseGeocoding';
import { useDeviceDetection } from './hooks/useDeviceDetection';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { QuickAskModal } from './components/QuickAskModal';
import { SettingsModal } from './components/SettingsModal';
import { WorldAqiModal } from './components/WorldAqiModal';
import { JargonBusterModal } from './components/JargonBusterModal';
import { EasyChatWidget } from './components/EasyChatWidget';
import { MobileBottomNav, type MobileTab } from './components/MobileBottomNav';
import { SitePagesModal } from './components/SitePagesModal';
import { Toast } from './components/Toast';

const STORAGE_PROFILE_KEY = 'vayugrid_profile';
const STORAGE_ACTIVE_HABITS = 'vayugrid_active_habits';
const STORAGE_LIQUID_GLASS = 'vayugrid_liquid_glass';

export default function App() {
  // Device Detection Engine (Windows / Android / Tablet)
  const deviceInfo = useDeviceDetection();

  // Mobile Bottom Navigation Tab state
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');

  // 1. Initialize Profile from localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_PROFILE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load profile from localStorage', e);
    }
    return DEFAULT_USER_PROFILE;
  });

  // Save profile to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PROFILE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile to localStorage', e);
    }
  }, [profile]);

  // 2. Liquid Glass Feature State (Default TRUE so user sees it immediately)
  const [liquidGlassEnabled, setLiquidGlassEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_LIQUID_GLASS);
      if (saved !== null) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load liquid glass state', e);
    }
    return true; // default on
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LIQUID_GLASS, JSON.stringify(liquidGlassEnabled));
    } catch (e) {
      console.warn('Failed to save liquid glass state', e);
    }
  }, [liquidGlassEnabled]);

  // 3. City & Scenario State
  const [selectedCity, setSelectedCity] = useState<City>(() => {
    const found = CITIES.find((c) => c.id === profile.cityId);
    return found || CITIES[0];
  });

  const [selectedScenarioId, setSelectedScenarioId] = useState<CrisisScenarioId>('winter_smog');
  const selectedScenario = CRISIS_SCENARIOS[selectedScenarioId];

  // 4. Protocol State
  const [protocol, setProtocol] = useState<VayuProtocolResponse>(() =>
    calculateGroundedProtocol(profile, selectedScenario, selectedCity)
  );
  const [engineSource, setEngineSource] = useState<'gemini' | 'grounded-engine'>('grounded-engine');
  const [isLoading, setIsLoading] = useState(false);

  // 5. Simulator Controls State
  const [simulatorControls, setSimulatorControls] = useState<SimulatorControls>({
    shiftCommuteToMetro: true,
    runPurifierInversion: true,
    runKitchenExhaust: true,
    sealBedroomGaps: false,
  });

  // 6. Active Habits Set
  const [activeHabitIds, setActiveHabitIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_HABITS);
      if (saved) return new Set(JSON.parse(saved));
    } catch (e) {
      console.warn('Failed to load active habits', e);
    }
    return new Set(['routine-commute', 'iaq-cooking', 'iaq-filtration']);
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ACTIVE_HABITS, JSON.stringify(Array.from(activeHabitIds)));
    } catch (e) {
      console.warn('Failed to save active habits', e);
    }
  }, [activeHabitIds]);

  // 7. Modals & Toast State
  const [isQuickAskOpen, setIsQuickAskOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isWorldAqiOpen, setIsWorldAqiOpen] = useState(false);
  const [isJargonBusterOpen, setIsJargonBusterOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isPagesModalOpen, setIsPagesModalOpen] = useState(false);
  const [activeSitePage, setActiveSitePage] = useState<SitePageId>('vikabuilds');
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(() => !!getStoredApiKey());
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const handleOpenPage = useCallback((pageId: SitePageId) => {
    setActiveSitePage(pageId);
    setIsPagesModalOpen(true);
  }, []);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3500);
  }, []);

  // Keyboard shortcut: Cmd/Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsQuickAskOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 8. DEVICE GPS LOCATION WITH FULL REVERSE-GEOCODED HUMAN ADDRESS
  const handleDetectLocationAndAddress = useCallback(() => {
    if (!navigator.geolocation) {
      triggerToast('Geolocation is not supported by your device browser.');
      return;
    }

    setIsDetectingLocation(true);
    triggerToast('Detecting GPS & resolving location address...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;

          // Step 1: Reverse Geocode to full street address & locality
          const resolved = await reverseGeocodeCoordinates(lat, lon);

          // Step 2: Fetch Live Air Quality from Open-Meteo for these exact coordinates
          const live = await fetchLiveAirQuality(
            lat,
            lon,
            resolved.shortName,
            resolved.country,
            undefined,
            resolved.fullAddress
          );

          // Step 3: Determine matching scenario
          let scenId: CrisisScenarioId = 'moderate';
          if (live.usAqi > 250) scenId = 'severe_crisis';
          else if (live.usAqi > 120) scenId = 'winter_smog';
          setSelectedScenarioId(scenId);

          // Step 4: Create localized City object with full address as landmark
          const deviceCity: City = {
            id: `gps-${lat.toFixed(3)}-${lon.toFixed(3)}`,
            name: resolved.shortName,
            country: `${resolved.state ? resolved.state + ', ' : ''}${resolved.country}`,
            landmark: resolved.fullAddress,
            imageUrl:
              'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
            scenarios: {
              moderate: { aqi: live.usAqi, pm25: live.pm25, pm10: live.pm10, inversionWindow: '06:30–09:00 & 20:30–22:30' },
              winter_smog: { aqi: live.usAqi, pm25: live.pm25, pm10: live.pm10, inversionWindow: '05:30–10:30 & 19:00–23:30' },
              severe_crisis: { aqi: live.usAqi, pm25: live.pm25, pm10: live.pm10, inversionWindow: '05:00–11:30 & 18:00–01:00' },
            },
          };

          setSelectedCity(deviceCity);
          setProfile((prev) => ({ ...prev, cityId: deviceCity.id }));

          const updated = calculateGroundedProtocol(
            { ...profile, cityId: deviceCity.id },
            CRISIS_SCENARIOS[scenId],
            deviceCity
          );

          if (live.hourlyPm25 && live.hourlyPm25.length > 0) {
            updated.hourlyExposureCurve = live.hourlyPm25.map((h) => ({
              hour: h.hour,
              outdoorPm25: h.pm25,
              protectedPm25: Math.round(h.pm25 * 0.45),
            }));
          }

          setProtocol(updated);
          triggerToast(`Address Resolved: ${resolved.fullAddress} (AQI: ${live.usAqi})`);
        } catch (err) {
          console.error(err);
          triggerToast('Failed to resolve live address. Check internet connectivity.');
        } finally {
          setIsDetectingLocation(false);
        }
      },
      (error) => {
        setIsDetectingLocation(false);
        triggerToast(`Location access: ${error.message}`);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, [profile, triggerToast]);

  // Regenerate protocol
  const handleRegenerate = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await generateVayuProtocol(profile, selectedScenario, selectedCity);
      setProtocol(res.protocol);
      setEngineSource(res.source);
      if (res.source === 'gemini') {
        triggerToast('Protocol regenerated using Gemini 2.5 Flash');
      } else {
        triggerToast('Protocol updated with grounded atmospheric model');
      }
    } catch (err) {
      console.error(err);
      const fallback = calculateGroundedProtocol(profile, selectedScenario, selectedCity);
      setProtocol(fallback);
      setEngineSource('grounded-engine');
      triggerToast('Grounded model refreshed');
    } finally {
      setIsLoading(false);
    }
  }, [profile, selectedScenario, selectedCity, triggerToast]);

  // Update scenario switcher handler
  const handleSelectScenario = (scenId: CrisisScenarioId) => {
    setSelectedScenarioId(scenId);
    const newScen = CRISIS_SCENARIOS[scenId];
    const updated = calculateGroundedProtocol(profile, newScen, selectedCity);
    setProtocol(updated);
  };

  // Update city handler
  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setProfile((prev) => ({ ...prev, cityId: city.id }));
    const updated = calculateGroundedProtocol(
      { ...profile, cityId: city.id },
      selectedScenario,
      city
    );
    setProtocol(updated);
  };

  // Select live city from World AQI Modal
  const handleSelectLiveCity = (city: City, liveData: LiveAirQualityData) => {
    setSelectedCity(city);
    setProfile((prev) => ({ ...prev, cityId: city.id }));

    let scenId: CrisisScenarioId = 'moderate';
    if (liveData.usAqi > 250) scenId = 'severe_crisis';
    else if (liveData.usAqi > 120) scenId = 'winter_smog';

    setSelectedScenarioId(scenId);

    const updated = calculateGroundedProtocol(
      { ...profile, cityId: city.id },
      CRISIS_SCENARIOS[scenId],
      city
    );

    if (liveData.hourlyPm25 && liveData.hourlyPm25.length > 0) {
      updated.hourlyExposureCurve = liveData.hourlyPm25.map((h) => ({
        hour: h.hour,
        outdoorPm25: h.pm25,
        protectedPm25: Math.round(h.pm25 * 0.45),
      }));
    }

    setProtocol(updated);
    triggerToast(`Live Internet Data Loaded: ${liveData.cityName} (AQI ${liveData.usAqi})`);
  };

  // Custom city name inline update
  const handleCustomCityNameChange = (customName: string) => {
    setSelectedCity((prev) => ({
      ...prev,
      name: customName || 'Custom City',
    }));
  };

  // Toggle habit checkbox
  const handleToggleHabit = (id: string) => {
    setActiveHabitIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle simulator control
  const handleToggleSimulatorControl = (key: keyof SimulatorControls) => {
    setSimulatorControls((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle liquid glass mode
  const handleToggleLiquidGlass = () => {
    setLiquidGlassEnabled((prev) => {
      const nextState = !prev;
      triggerToast(nextState ? 'Liquid Glass Mode Enabled' : 'Architectural Minimal Mode Enabled');
      return nextState;
    });
  };

  // Calculate simulated 24-hour hourly curve
  const simulatedCurve = useMemo(() => {
    if (!protocol.hourlyExposureCurve || protocol.hourlyExposureCurve.length === 0) {
      return [];
    }
    return applySimulatorModifiers(
      protocol.hourlyExposureCurve,
      simulatorControls,
      profile
    );
  }, [protocol.hourlyExposureCurve, simulatorControls, profile]);

  // Format and Copy WhatsApp Family Brief
  const handleCopyWhatsAppBrief = () => {
    const cityData = selectedCity.scenarios[selectedScenario.id];
    const aqi = cityData?.aqi || selectedScenario.aqi;
    const pm25 = cityData?.pm25 || selectedScenario.pm25;
    const inversion = cityData?.inversionWindow || selectedScenario.thermalInversionWindow;

    const topRoutine = protocol.routines?.[0]?.title || 'Stagger commute past 10:30 AM';
    const topIAQ = protocol.indoorHacks?.[0]?.title || 'Run kitchen exhaust + 15 min';
    const topAlt = protocol.alternatives?.[0]?.title || 'Shift to metro / public transit';

    const text = `🌬️ *VayuGrid Smog Advisory for ${selectedCity.name}*
━━━━━━━━━━━━━━━━━━━━
📍 *Location Address:* ${selectedCity.landmark || selectedCity.name}
⚠️ *Status:* ${selectedScenario.label} (AQI ${aqi} | PM2.5 ${pm25} µg/m³)
🛑 *Thermal Inversion Window:* ${inversion}
(Cold air cap active — keep doors & windows sealed)

🕒 *Ventilation Window:* ${protocol.summary.safeVentilationWindow}

🏠 *Household Action Priorities Today:*
1. 🚶 *Routine:* ${topRoutine}
2. 🍳 *Kitchen & IAQ:* ${topIAQ}
3. 🚇 *Transit Swap:* ${topAlt}
4. 🛏️ *Night Prep:* Seal bedroom bottom door gaps with damp towel or draft stopper.

📊 *Impact:* -${protocol.summary.exposureReductionPercent}% personal inhaled PM2.5 dosage | Prevents ${protocol.summary.weeklyCo2SavedKg} kg CO₂e weekly.

Generated via *VayuGrid OS* — Designed for Families & Citizens`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      triggerToast('Copied Family WhatsApp Brief to clipboard!');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col font-sans text-[#09090B] antialiased transition-colors duration-500 relative overflow-hidden ${
        liquidGlassEnabled ? 'liquid-glass-canvas' : 'bg-[#FAFAFA]'
      }`}
    >
      {/* Ambient Atmospheric Fluid Orbs (for Liquid Glass mode) */}
      {liquidGlassEnabled && (
        <>
          <div className="ambient-fluid-orb-1" />
          <div className="ambient-fluid-orb-2" />
        </>
      )}

      {/* Top Telemetry & Scenario Header (Adaptive for Windows / Android / Tablet) */}
      <Header
        selectedCity={selectedCity}
        onSelectCity={handleSelectCity}
        selectedScenario={selectedScenario}
        onSelectScenario={handleSelectScenario}
        onOpenQuickAsk={() => setIsQuickAskOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenWorldAqi={() => setIsWorldAqiOpen(true)}
        onOpenJargonBuster={() => setIsJargonBusterOpen(true)}
        hasApiKey={hasApiKey}
        onCustomCityNameChange={handleCustomCityNameChange}
        liquidGlassEnabled={liquidGlassEnabled}
        onToggleLiquidGlass={handleToggleLiquidGlass}
        deviceInfo={deviceInfo}
        onDetectLocation={handleDetectLocationAndAddress}
        isDetectingLocation={isDetectingLocation}
        onOpenPage={handleOpenPage}
      />

      {/* Main SaaS Workspace: Sidebar + Canvas (Adaptive by Device) */}
      <div className="flex-1 flex overflow-hidden relative z-10">
        {/* Left Sidebar Profiler:
            - On Desktop/Windows: always visible
            - On Tablet: visible or compact
            - On Android/Mobile: visible only when mobileTab === 'profiler'
        */}
        <div
          className={`print:hidden ${
            deviceInfo.isMobile
              ? mobileTab === 'profiler'
                ? 'fixed inset-0 top-14 z-40 bg-white overflow-y-auto pb-20'
                : 'hidden'
              : deviceInfo.isTablet
              ? 'w-72 border-r border-[#E4E4E7]'
              : 'block'
          }`}
        >
          {deviceInfo.isMobile && mobileTab === 'profiler' && (
            <div className="p-3 bg-zinc-100 border-b border-[#E4E4E7] flex justify-between items-center text-xs font-bold">
              <span>My Household Setup & Profiler</span>
              <button
                type="button"
                onClick={() => setMobileTab('home')}
                className="px-2 py-1 bg-white border border-[#E4E4E7] rounded text-[11px]"
              >
                Back to Dashboard
              </button>
            </div>
          )}
          <Sidebar
            profile={profile}
            onChangeProfile={setProfile}
            onRegenerate={handleRegenerate}
            isLoading={isLoading}
            engineSource={engineSource}
            liquidGlassEnabled={liquidGlassEnabled}
          />
        </div>

        {/* Scrollable Main Canvas */}
        {(!deviceInfo.isMobile || mobileTab !== 'profiler') && (
          <Dashboard
            protocol={protocol}
            selectedCity={selectedCity}
            selectedScenario={selectedScenario}
            profile={profile}
            simulatedCurve={simulatedCurve}
            simulatorControls={simulatorControls}
            onToggleSimulatorControl={handleToggleSimulatorControl}
            activeHabitIds={activeHabitIds}
            onToggleHabit={handleToggleHabit}
            onCopyWhatsAppBrief={handleCopyWhatsAppBrief}
            engineSource={engineSource}
            liquidGlassEnabled={liquidGlassEnabled}
            onOpenJargonBuster={() => setIsJargonBusterOpen(true)}
            onDetectLocation={handleDetectLocationAndAddress}
            isDetectingLocation={isDetectingLocation}
            onOpenPage={handleOpenPage}
          />
        )}
      </div>

      {/* Mobile Bottom Navigation Bar (Shows on Android / Mobile) */}
      {deviceInfo.isMobile && (
        <MobileBottomNav
          activeTab={mobileTab}
          onChangeTab={setMobileTab}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenWorldAqi={() => setIsWorldAqiOpen(true)}
          liquidGlassEnabled={liquidGlassEnabled}
        />
      )}

      {/* Modals & Easy Citizen Features */}
      <WorldAqiModal
        isOpen={isWorldAqiOpen}
        onClose={() => setIsWorldAqiOpen(false)}
        onSelectLiveCity={handleSelectLiveCity}
      />

      <JargonBusterModal
        isOpen={isJargonBusterOpen}
        onClose={() => setIsJargonBusterOpen(false)}
      />

      <QuickAskModal
        isOpen={isQuickAskOpen}
        onClose={() => setIsQuickAskOpen(false)}
        profile={profile}
        scenario={selectedScenario}
        city={selectedCity}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onApiKeySaved={() => setHasApiKey(!!getStoredApiKey())}
      />

      {/* VIKABUILDS CREATOR & LEGAL PAGES MODAL */}
      <SitePagesModal
        isOpen={isPagesModalOpen}
        initialPage={activeSitePage}
        onClose={() => setIsPagesModalOpen(false)}
        liquidGlassEnabled={liquidGlassEnabled}
        onShowToast={triggerToast}
      />

      {/* EASY FLOATING CHAT WIDGET ("Ask Vayu") */}
      <EasyChatWidget
        city={selectedCity}
        scenario={selectedScenario}
        profile={profile}
        liquidGlassEnabled={liquidGlassEnabled}
      />

      <Toast message={toastMessage} show={showToast} />
    </div>
  );
}
