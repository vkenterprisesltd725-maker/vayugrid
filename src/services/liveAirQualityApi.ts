export interface LiveAirQualityData {
  cityName: string;
  country: string;
  latitude: number;
  longitude: number;
  pm25: number;
  pm10: number;
  usAqi: number;
  europeanAqi: number;
  time: string;
  hourlyPm25: { hour: string; pm25: number }[];
  statusLabel: string;
  statusColor: string;
  isLive: boolean;
  imageUrl?: string;
  landmark?: string;
}

export interface GeocodedCity {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  countryCode: string;
  admin1?: string;
}

// Convert PM2.5 (µg/m³) to US AQI roughly if us_aqi is not directly available
export function pm25ToUsAqi(pm: number): number {
  if (pm <= 12.0) return Math.round((50 / 12.0) * pm);
  if (pm <= 35.4) return Math.round(50 + ((100 - 50) / (35.4 - 12.1)) * (pm - 12.1));
  if (pm <= 55.4) return Math.round(101 + ((150 - 101) / (55.4 - 35.5)) * (pm - 35.5));
  if (pm <= 150.4) return Math.round(151 + ((200 - 151) / (150.4 - 55.5)) * (pm - 55.5));
  if (pm <= 250.4) return Math.round(201 + ((300 - 201) / (250.4 - 150.5)) * (pm - 150.5));
  if (pm <= 350.4) return Math.round(301 + ((400 - 301) / (350.4 - 250.5)) * (pm - 250.5));
  return Math.round(401 + ((500 - 401) / (500.4 - 350.5)) * (pm - 350.5));
}

export function getAqiCategory(aqi: number): { label: string; color: string; advice: string } {
  if (aqi <= 50) {
    return {
      label: 'Good (Clean Air)',
      color: 'bg-emerald-500 text-white border-emerald-400',
      advice: 'Air is clean and fresh. Perfect for outdoor activities and airing out your home.',
    };
  }
  if (aqi <= 100) {
    return {
      label: 'Moderate (Caution)',
      color: 'bg-yellow-500 text-zinc-950 border-yellow-400',
      advice: 'Acceptable air quality. Very sensitive people should reduce prolonged outdoor exertion.',
    };
  }
  if (aqi <= 150) {
    return {
      label: 'Unhealthy for Sensitive Groups',
      color: 'bg-orange-500 text-white border-orange-400',
      advice: 'Kids, elderly, and people with asthma should limit heavy outdoor activities.',
    };
  }
  if (aqi <= 200) {
    return {
      label: 'Unhealthy (Wear N95)',
      color: 'bg-red-500 text-white border-red-400',
      advice: 'Everyone should wear an N95 mask outside and keep home windows closed.',
    };
  }
  if (aqi <= 300) {
    return {
      label: 'Very Unhealthy (Stay Indoors)',
      color: 'bg-purple-600 text-white border-purple-400',
      advice: 'Health alert! Avoid all outdoor exercise. Run air purifiers on high.',
    };
  }
  return {
    label: 'Hazardous (Emergency Smog)',
    color: 'bg-rose-900 text-white border-rose-500',
    advice: 'Emergency conditions. Stay strictly indoors with sealed doors and windows.',
  };
}

// 1. Fetch Live Air Quality from Open-Meteo Free API (NO API KEY REQUIRED)
export async function fetchLiveAirQuality(
  latitude: number,
  longitude: number,
  cityName: string,
  country: string,
  imageUrl?: string,
  landmark?: string
): Promise<LiveAirQualityData> {
  const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=pm10,pm2_5,us_aqi,european_aqi&hourly=pm2_5,pm10&forecast_days=1`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Air Quality API error: ${response.statusText}`);
  }

  const data = await response.json();

  const currentPm25 = Math.round(data.current?.pm2_5 ?? 45);
  const currentPm10 = Math.round(data.current?.pm10 ?? 75);
  const usAqi = Math.round(data.current?.us_aqi ?? pm25ToUsAqi(currentPm25));
  const europeanAqi = Math.round(data.current?.european_aqi ?? 50);

  const hourlyTimes = data.hourly?.time || [];
  const hourlyPm25Values = data.hourly?.pm2_5 || [];

  const hourlyPm25 = hourlyTimes.slice(0, 24).map((t: string, i: number) => {
    const hourStr = t.split('T')[1] || `${i}:00`;
    return {
      hour: hourStr,
      pm25: Math.round(hourlyPm25Values[i] ?? currentPm25),
    };
  });

  const cat = getAqiCategory(usAqi);

  return {
    cityName,
    country,
    latitude,
    longitude,
    pm25: currentPm25,
    pm10: currentPm10,
    usAqi,
    europeanAqi,
    time: data.current?.time || new Date().toISOString(),
    hourlyPm25,
    statusLabel: cat.label,
    statusColor: cat.color,
    isLive: true,
    imageUrl,
    landmark,
  };
}

// 2. Search Any City in the World using Open-Meteo Geocoding API (FREE, NO KEY)
export async function searchCities(query: string): Promise<GeocodedCity[]> {
  if (!query || query.trim().length < 2) return [];

  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
    query.trim()
  )}&count=8&language=en&format=json`;

  const res = await fetch(url);
  if (!res.ok) return [];

  const data = await res.json();
  if (!data.results || !Array.isArray(data.results)) return [];

  return data.results.map((r: any) => ({
    id: r.id,
    name: r.name,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country || '',
    countryCode: r.country_code || '',
    admin1: r.admin1,
  }));
}

// 3. Predefined Global Cities with Real Photography for World Leaderboard
export const WORLD_KEY_CITIES = [
  {
    name: 'New Delhi',
    country: 'India',
    lat: 28.6139,
    lon: 77.209,
    landmark: 'India Gate',
    imageUrl: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Lahore',
    country: 'Pakistan',
    lat: 31.5497,
    lon: 74.3436,
    landmark: 'Badshahi Mosque',
    imageUrl: 'https://images.unsplash.com/photo-1596706247941-8f5263690d7c?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Beijing',
    country: 'China',
    lat: 39.9042,
    lon: 116.4074,
    landmark: 'Central Tower',
    imageUrl: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Dubai',
    country: 'UAE',
    lat: 25.2048,
    lon: 55.2708,
    landmark: 'Burj Khalifa',
    imageUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Mumbai',
    country: 'India',
    lat: 19.076,
    lon: 72.8777,
    landmark: 'Bandra-Worli Sea Link',
    imageUrl: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Bangkok',
    country: 'Thailand',
    lat: 13.7563,
    lon: 100.5018,
    landmark: 'Wat Arun River',
    imageUrl: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Cairo',
    country: 'Egypt',
    lat: 30.0444,
    lon: 31.2357,
    landmark: 'Nile Skyline',
    imageUrl: 'https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Jakarta',
    country: 'Indonesia',
    lat: -6.2088,
    lon: 106.8456,
    landmark: 'Bundaran HI',
    imageUrl: 'https://images.unsplash.com/photo-1555899434-94d1368aa7af?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'London',
    country: 'United Kingdom',
    lat: 51.5074,
    lon: -0.1278,
    landmark: 'Tower Bridge',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'New York',
    country: 'United States',
    lat: 40.7128,
    lon: -74.006,
    landmark: 'Manhattan Skyline',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Tokyo',
    country: 'Japan',
    lat: 35.6762,
    lon: 139.6503,
    landmark: 'Tokyo Tower',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Paris',
    country: 'France',
    lat: 48.8566,
    lon: 2.3522,
    landmark: 'Eiffel Tower',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'Sydney',
    country: 'Australia',
    lat: -33.8688,
    lon: 151.2093,
    landmark: 'Opera House',
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=400&q=80',
  },
  {
    name: 'São Paulo',
    country: 'Brazil',
    lat: -23.5505,
    lon: -46.6333,
    landmark: 'Paulista Avenue',
    imageUrl: 'https://images.unsplash.com/photo-1578002573549-fb75c27599cb?auto=format&fit=crop&w=400&q=80',
  },
];

// Fetch all major world cities in parallel
export async function fetchWorldRankings(): Promise<LiveAirQualityData[]> {
  const promises = WORLD_KEY_CITIES.map((c) =>
    fetchLiveAirQuality(c.lat, c.lon, c.name, c.country, c.imageUrl, c.landmark).catch(() => ({
      cityName: c.name,
      country: c.country,
      latitude: c.lat,
      longitude: c.lon,
      pm25: 50,
      pm10: 70,
      usAqi: 80,
      europeanAqi: 40,
      time: new Date().toISOString(),
      hourlyPm25: [],
      statusLabel: 'Moderate',
      statusColor: 'bg-yellow-500 text-zinc-950 border-yellow-400',
      isLive: false,
      imageUrl: c.imageUrl,
      landmark: c.landmark,
    }))
  );

  const results = await Promise.all(promises);
  // Sort from most polluted to cleanest
  return results.sort((a, b) => b.usAqi - a.usAqi);
}
