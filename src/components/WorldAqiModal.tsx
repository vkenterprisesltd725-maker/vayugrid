import React, { useState, useEffect } from 'react';
import {
  Globe,
  Search,
  MapPin,
  RefreshCw,
  X,
  Navigation,
  Check,
  TrendingUp,
  Loader2,
  AlertCircle,
  Eye,
} from 'lucide-react';
import {
  fetchLiveAirQuality,
  fetchWorldRankings,
  searchCities,
  type GeocodedCity,
  type LiveAirQualityData,
} from '../services/liveAirQualityApi';
import type { City, CrisisScenarioId } from '../types';

interface WorldAqiModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLiveCity: (city: City, liveData: LiveAirQualityData) => void;
}

export const WorldAqiModal: React.FC<WorldAqiModalProps> = ({
  isOpen,
  onClose,
  onSelectLiveCity,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodedCity[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const [activeLiveData, setActiveLiveData] = useState<LiveAirQualityData | null>(null);
  const [isLoadingCity, setIsLoadingCity] = useState(false);

  const [worldRankings, setWorldRankings] = useState<LiveAirQualityData[]>([]);
  const [isLoadingRankings, setIsLoadingRankings] = useState(false);

  const [isLocating, setIsLocating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load world rankings on first open
  useEffect(() => {
    if (isOpen && worldRankings.length === 0) {
      loadRankings();
    }
  }, [isOpen]);

  const loadRankings = async () => {
    setIsLoadingRankings(true);
    setErrorMessage(null);
    try {
      const data = await fetchWorldRankings();
      setWorldRankings(data);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not load global rankings. Check internet connection.');
    } finally {
      setIsLoadingRankings(false);
    }
  };

  // Search cities handler
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsSearching(true);
        try {
          const res = await searchCities(searchQuery);
          setSearchResults(res);
        } catch {
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle selecting a search result city
  const handleSelectSearchResult = async (c: GeocodedCity) => {
    setIsLoadingCity(true);
    setErrorMessage(null);
    try {
      const live = await fetchLiveAirQuality(c.latitude, c.longitude, c.name, c.country);
      setActiveLiveData(live);
    } catch {
      setErrorMessage(`Failed to fetch live air data for ${c.name}.`);
    } finally {
      setIsLoadingCity(false);
    }
  };

  // Use GPS location
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }
    setIsLocating(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const live = await fetchLiveAirQuality(lat, lon, 'My Current Location', 'GPS Auto-Detected');
          setActiveLiveData(live);
        } catch {
          setErrorMessage('Could not load live air quality for your location.');
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        setErrorMessage('Location permission denied or unavailable.');
      },
      { timeout: 10000 }
    );
  };

  // Apply to active VayuGrid OS workspace
  const handleApplyCityToApp = (live: LiveAirQualityData) => {
    let scenarioId: CrisisScenarioId = 'moderate';
    if (live.usAqi > 250) scenarioId = 'severe_crisis';
    else if (live.usAqi > 120) scenarioId = 'winter_smog';

    const newCity: City = {
      id: `live-${live.cityName.toLowerCase().replace(/\s+/g, '-')}`,
      name: live.cityName,
      country: live.country,
      landmark: live.landmark || 'Live Monitored Station',
      imageUrl: live.imageUrl || 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=800&q=80',
      scenarios: {
        moderate: { aqi: live.usAqi, pm25: live.pm25, pm10: live.pm10, inversionWindow: '06:30–09:00 & 20:30–22:30' },
        winter_smog: { aqi: live.usAqi, pm25: live.pm25, pm10: live.pm10, inversionWindow: '05:30–10:30 & 19:00–23:30' },
        severe_crisis: { aqi: live.usAqi, pm25: live.pm25, pm10: live.pm10, inversionWindow: '05:00–11:30 & 18:00–01:00' },
      },
    };

    onSelectLiveCity(newCity, live);
    onClose();
  };

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return { bg: 'bg-emerald-500 text-white', bar: 'bg-emerald-500' };
    if (aqi <= 100) return { bg: 'bg-yellow-400 text-zinc-950 font-bold', bar: 'bg-yellow-400' };
    if (aqi <= 150) return { bg: 'bg-orange-500 text-white', bar: 'bg-orange-500' };
    if (aqi <= 200) return { bg: 'bg-red-500 text-white', bar: 'bg-red-500' };
    if (aqi <= 300) return { bg: 'bg-purple-600 text-white', bar: 'bg-purple-600' };
    return { bg: 'bg-rose-900 text-white', bar: 'bg-rose-900' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px]">
      <div className="bg-white border border-[#E4E4E7] rounded-[8px] w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* HEADER */}
        <div className="p-4 border-b border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-sm text-[#09090B]">
                  Live World Air Quality Explorer
                </h3>
                <span className="text-[10px] font-mono uppercase bg-emerald-50 text-emerald-700 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                  Live Internet Open Data
                </span>
              </div>
              <p className="text-[11px] text-[#71717A]">
                Real-time satellite & ground-sensor atmospheric metrics across 40,000+ cities (Open-Meteo)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#71717A] hover:text-[#09090B] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* SEARCH & GEOLOCATION BAR */}
        <div className="p-4 border-b border-[#E4E4E7] bg-white space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#71717A] absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any world city (e.g. Tokyo, London, Sydney, Mumbai, Paris)..."
                className="w-full text-xs pl-8 pr-3 py-2 bg-[#FAFAFA] border border-[#E4E4E7] rounded-[4px] text-[#09090B] focus:outline-none focus:border-[#18181B]"
              />
              {isSearching && (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#71717A] absolute right-3 top-2.5" />
              )}
            </div>

            {/* Use My GPS Location */}
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={isLocating}
              className="w-full sm:w-auto px-3.5 py-2 bg-[#FAFAFA] hover:bg-[#F4F4F5] border border-[#E4E4E7] rounded-[4px] text-xs font-semibold text-[#09090B] flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shrink-0"
              title="Detect live AQI at your exact GPS coordinates"
            >
              {isLocating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Navigation className="w-3.5 h-3.5 text-sky-600" />
              )}
              <span>{isLocating ? 'Locating...' : 'Use My GPS Location'}</span>
            </button>
          </div>

          {/* Search suggestions dropdown list */}
          {searchResults.length > 0 && (
            <div className="border border-[#E4E4E7] rounded-[4px] divide-y divide-[#E4E4E7] max-h-40 overflow-y-auto bg-white shadow-md">
              {searchResults.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => {
                    handleSelectSearchResult(c);
                    setSearchResults([]);
                    setSearchQuery(c.name);
                  }}
                  className="w-full text-left px-3 py-2 text-xs hover:bg-[#F4F4F5] flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-[#09090B]">
                    {c.name} {c.admin1 ? `(${c.admin1})` : ''}
                  </span>
                  <span className="text-[11px] text-[#71717A] font-mono">{c.country}</span>
                </button>
              ))}
            </div>
          )}

          {errorMessage && (
            <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 flex items-center space-x-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>

        {/* ACTIVE INSPECTION CARD (IF SEARCHED) */}
        {activeLiveData && (
          <div className="p-4 bg-sky-50/60 border-b border-[#E4E4E7]">
            <div className="bg-white p-3.5 rounded-[6px] border border-sky-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-base text-[#09090B]">{activeLiveData.cityName}</span>
                  <span className="text-xs text-[#71717A] font-mono">({activeLiveData.country})</span>
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 font-semibold">
                    Live Open Data
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="flex items-center space-x-1">
                    <span className="text-[#71717A]">AQI:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${getAqiColor(activeLiveData.usAqi).bg}`}>
                      {activeLiveData.usAqi}
                    </span>
                  </span>
                  <span>•</span>
                  <span>
                    PM2.5: <strong className="text-[#09090B]">{activeLiveData.pm25} µg/m³</strong>
                  </span>
                  <span>•</span>
                  <span>
                    PM10: <strong className="text-[#09090B]">{activeLiveData.pm10} µg/m³</strong>
                  </span>
                </div>
                <div className="text-xs font-medium pt-0.5 text-[#52525B]">
                  Condition: <strong className="text-[#09090B]">{activeLiveData.statusLabel}</strong>
                </div>
              </div>

              {/* Set as Active button */}
              <button
                type="button"
                onClick={() => handleApplyCityToApp(activeLiveData)}
                className="px-3.5 py-2 bg-[#18181B] hover:bg-[#27272A] text-white rounded-[4px] text-xs font-semibold flex items-center justify-center space-x-1.5 cursor-pointer shadow-none shrink-0"
              >
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Set as Active City in VayuGrid</span>
              </button>
            </div>
          </div>
        )}

        {/* BODY: WORLD AIR QUALITY LEADERBOARD WITH REAL CITY PHOTOS & COLOR CODING */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#52525B]">
              Real-World City Air Quality Leaderboard (Ranked from Most Polluted)
            </span>
            <button
              type="button"
              onClick={loadRankings}
              disabled={isLoadingRankings}
              className="text-[11px] text-[#71717A] hover:text-[#09090B] flex items-center space-x-1 cursor-pointer"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingRankings ? 'animate-spin' : ''}`} />
              <span>Refresh Live</span>
            </button>
          </div>

          {isLoadingRankings ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-2 text-[#71717A]">
              <Loader2 className="w-6 h-6 animate-spin text-[#18181B]" />
              <span className="text-xs font-medium">Connecting to satellite sensors & global meteorological stations...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {worldRankings.map((city, idx) => {
                const colorTheme = getAqiColor(city.usAqi);
                const percent = Math.min(100, Math.round((city.usAqi / 400) * 100));

                return (
                  <div
                    key={city.cityName}
                    className="border border-[#E4E4E7] rounded-[6px] overflow-hidden bg-white hover:border-[#A1A1AA] transition-all flex flex-col justify-between group shadow-xs"
                  >
                    <div className="flex items-center space-x-3 p-3">
                      {/* REAL CITY PHOTO THUMBNAIL */}
                      <div className="w-14 h-14 rounded-[5px] overflow-hidden shrink-0 bg-zinc-800 relative">
                        <img
                          src={
                            city.imageUrl ||
                            'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=200&q=80'
                          }
                          alt={city.cityName}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-0.5 left-0.5 bg-black/70 text-[9px] font-mono text-white px-1 rounded">
                          #{idx + 1}
                        </div>
                      </div>

                      {/* City Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-[#09090B] truncate">
                            {city.cityName}
                          </h4>
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${colorTheme.bg}`}>
                            AQI {city.usAqi}
                          </span>
                        </div>

                        <div className="text-[11px] text-[#71717A] truncate">
                          {city.landmark ? `${city.landmark}, ` : ''}{city.country}
                        </div>

                        {/* Visual Colored Progress Bar */}
                        <div className="mt-1.5 flex items-center space-x-2">
                          <div className="flex-1 bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${colorTheme.bar}`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-[#09090B] font-semibold">
                            {city.pm25} µg/m³
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Row */}
                    <div className="bg-[#FAFAFA] border-t border-[#E4E4E7] px-3 py-1.5 flex items-center justify-between text-[11px]">
                      <span className="text-[#52525B] text-[10px] truncate max-w-[180px]">
                        {city.statusLabel.split('(')[0]}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleApplyCityToApp(city)}
                        className="px-2.5 py-0.5 bg-white hover:bg-[#18181B] hover:text-white border border-[#E4E4E7] rounded text-[11px] font-medium transition-colors cursor-pointer"
                      >
                        Set Active
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#FAFAFA] border-t border-[#E4E4E7] flex justify-between items-center text-[11px] text-[#71717A]">
          <span>Data stream provided live via Open-Meteo European Atmosphere Service (No Key Needed)</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1 bg-white hover:bg-[#F4F4F5] border border-[#E4E4E7] rounded text-xs font-semibold text-[#09090B] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
