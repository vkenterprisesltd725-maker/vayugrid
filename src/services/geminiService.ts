import { GoogleGenAI } from '@google/genai';
import {
  City,
  CrisisScenario,
  UserProfile,
  VayuProtocolResponse,
} from '../types';
import { calculateGroundedProtocol } from './groundedEngine';

const STORAGE_API_KEY = 'vayugrid_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem(STORAGE_API_KEY);
  if (stored && stored.trim().length > 0) return stored.trim();
  // Check vite env
  const envKey = (import.meta as unknown as { env: Record<string, string> }).env?.VITE_GEMINI_API_KEY;
  return envKey || '';
}

export function setStoredApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_API_KEY, key.trim());
}

export async function generateVayuProtocol(
  profile: UserProfile,
  scenario: CrisisScenario,
  city: City,
  apiKeyOverride?: string
): Promise<{ protocol: VayuProtocolResponse; source: 'gemini' | 'grounded-engine'; error?: string }> {
  const apiKey = (apiKeyOverride || getStoredApiKey()).trim();

  if (!apiKey) {
    // Deterministic grounded engine fallback
    const fallback = calculateGroundedProtocol(profile, scenario, city);
    return {
      protocol: fallback,
      source: 'grounded-engine',
    };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `You are VayuGrid OS, a high-craft, precision atmospheric exposure and urban air quality intelligence engine.
Your task is to generate a hyper-personalized, scientifically rigorous winter air pollution and indoor air quality protocol.
Ground all reasoning in:
- CPCB National AQI PM2.5 breakpoints: 0-30 Good, 31-60 Satisfactory, 61-90 Moderate, 91-120 Poor, 121-250 Very Poor, 251-500 Severe.
- WHO 24-hour guideline (15 µg/m³).
- Thermal inversion windows (boundary layer compression trapping nocturnal & early morning emissions).
- Convective boundary layer lift windows (typically 13:00 to 16:00).
- Ventilation rule: ONLY recommend opening windows when outdoor AQI < 100 (PM2.5 < 60 µg/m³). When AQI > 200, strictly enforce sealed windows and internal recirculation.
- Cooking rule: Gas cooking without exhaust spikes indoor PM2.5 by 100-300 µg/m³. Exhaust overrunning for 15m cuts cooking PM2.5 by 50-60%.
- Filtration rule: A CADR-matched HEPA unit delivering 4-5 air changes/hour cuts indoor PM2.5 by 70-80% in 30 minutes. For 'none', recommend DIY MERV-13 box-fan or wet-mopping.
- Commute: Tailor to commute mode and distance.

Return STRICT JSON complying with this structure:
{
  "summary": {
    "projectedDailyPm25": number,
    "baselineUnfilteredPm25": number,
    "exposureReductionPercent": number,
    "safeVentilationWindow": string,
    "weeklyCo2SavedKg": number,
    "weeklyPm25AvoidedGrams": number,
    "advisoryHeadline": string
  },
  "routines": [
    {
      "id": string,
      "title": string,
      "timingOrTrigger": string,
      "effortLevel": "Zero Cost" | "Low Cost" | "Habit Swap",
      "actionSteps": string[],
      "personalPm25ReductionPercent": number,
      "communityEmissionOffset": string,
      "scientificMechanism": string
    }
  ], // exactly 4 items
  "indoorHacks": [
    // exactly 4 items with same structure
  ],
  "alternatives": [
    // exactly 4 items with same structure
  ],
  "hourlyExposureCurve": [
    { "hour": "00:00", "outdoorPm25": number, "protectedPm25": number }
    // 24 points from "00:00" to "23:00"
  ]
}`;

    const userPrompt = `Generate the VayuGrid Protocol for this profile:
- City: ${city.name} (${city.country})
- Scenario: ${scenario.label} (AQI: ${scenario.aqi}, PM2.5: ${scenario.pm25} µg/m³, PM10: ${scenario.pm10} µg/m³)
- Inversion Window: ${scenario.thermalInversionWindow}
- Micro-Environment: ${profile.neighborhood}
- Household Risk Profile: ${profile.risks.join(', ') || 'General population'}
- Air Purifier Setup: ${profile.purifier}
- Ventilation & Sealing: ${profile.ventilation}
- Cooking Setup: ${profile.cooking}
- Primary Commute: ${profile.commute} (${profile.commuteDistanceKm} km round trip daily)

Provide realistic tabular metrics, crisp imperative action steps, and 1-sentence scientific mechanisms.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: 'application/json',
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini API');
    }

    const parsed = JSON.parse(text) as VayuProtocolResponse;

    // Validate minimal structure
    if (
      parsed.summary &&
      Array.isArray(parsed.routines) &&
      Array.isArray(parsed.indoorHacks) &&
      Array.isArray(parsed.alternatives) &&
      Array.isArray(parsed.hourlyExposureCurve)
    ) {
      return {
        protocol: parsed,
        source: 'gemini',
      };
    } else {
      throw new Error('Invalid JSON structure returned by model');
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.warn('Gemini API call failed, falling back to grounded engine:', message);
    const fallback = calculateGroundedProtocol(profile, scenario, city);
    return {
      protocol: fallback,
      source: 'grounded-engine',
      error: message,
    };
  }
}

export async function askVayuAssistant(
  question: string,
  profile: UserProfile,
  scenario: CrisisScenario,
  city: City,
  apiKeyOverride?: string
): Promise<string> {
  const apiKey = (apiKeyOverride || getStoredApiKey()).trim();

  if (!apiKey) {
    // Grounded deterministic Q&A helper
    return getOfflineAnswer(question, profile, scenario, city);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `You are VayuGrid OS, an expert urban air quality and environmental health intelligence system.
User Context:
- City: ${city.name}
- Scenario: ${scenario.label} (AQI: ${scenario.aqi}, PM2.5: ${scenario.pm25} µg/m³)
- Inversion Window: ${scenario.thermalInversionWindow}
- Household: ${profile.neighborhood} area, ${profile.risks.join(', ')}, Purifier: ${profile.purifier}, Cooking: ${profile.cooking}, Commute: ${profile.commute} (${profile.commuteDistanceKm} km)

Question: "${question}"

Provide a crisp, direct, scientifically grounded answer in 3-4 bullet points or short paragraphs. Explicitly cite PM2.5 levels, physiological mechanisms, or CPCB/WHO exposure rules. No fluff, no purple prose.`;

    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return res.text || getOfflineAnswer(question, profile, scenario, city);
  } catch (err) {
    console.warn('Gemini Q&A failed, using offline grounded response:', err);
    return getOfflineAnswer(question, profile, scenario, city);
  }
}

function getOfflineAnswer(
  question: string,
  profile: UserProfile,
  scenario: CrisisScenario,
  city: City
): string {
  const q = question.toLowerCase();

  if (q.includes('jog') || q.includes('run') || q.includes('exercise') || q.includes('walk')) {
    if (scenario.aqi > 200) {
      return `**Strict Advisory for ${city.name} (AQI ${scenario.aqi}): No outdoor aerobic exercise.**\n\n- **Inversion Trap:** Surface air is trapped between ${scenario.thermalInversionWindow}. Fine particulate matter (PM2.5: ${scenario.pm25} µg/m³) is 10-20x the WHO safe threshold (15 µg/m³).\n- **Physiological Danger:** Vigorous aerobic exercise increases minute ventilation from 6 L/min to 60–100 L/min, shifting breathing from nasal filtration to oral inhalation, depositing millions of ultrafine particles deep into alveoli.\n- **Recommended Alternative:** Shift all cardio workouts indoors in a sealed room with HEPA filtration active, or postpone brisk walking until 14:00–15:30 when solar heating raises the atmospheric mixing height.`;
    } else {
      return `**Outdoor Exercise Window for ${city.name} (AQI ${scenario.aqi}):**\n\n- The safest window is strictly **13:30 – 16:00** when solar radiation breaks nocturnal thermal inversion and expands the boundary layer.\n- Avoid 06:00–09:30 AM morning walks completely as stagnant cold air concentrates particulate emissions near ground level.\n- For vulnerable individuals (${profile.risks.join(', ') || 'general'}), indoor workouts are strongly preferred.`;
    }
  }

  if (q.includes('purifier') || q.includes('filter') || q.includes('no purifier') || q.includes('diy') || q.includes('cost')) {
    return `**Zero & Low-Cost IAQ Action Plan:**\n\n- **DIY Corsi-Rosenthal Box-Fan:** If you lack a commercial purifier, tape a 20×20" MERV-13 filter to the intake side of a standard 20-inch box fan. This costs ~₹1,400 ($17) and yields 200+ CFM Clean Air Delivery Rate (CADR), rivaling units costing 5x more.\n- **Wet-Mopping Protocol:** Dry brooms shear settled dust into airborne PM2.5 for 2+ hours. Daily microfiber wet-mopping captures settled particles with zero resuspension.\n- **Clean Zone Strategy:** Quarantine one bedroom by rolling a damp towel beneath door crevices and sealing window gaps. Concentrating filtration in a single sealed zone reduces nocturnal exposure by >60%.`;
  }

  if (q.includes('cook') || q.includes('roti') || q.includes('fry') || q.includes('gas') || q.includes('exhaust')) {
    return `**Indoor Cooking Exposure Dynamics:**\n\n- **Combustion Spike:** LPG/PNG open burner combustion without mechanical exhaust generates localized PM2.5 spikes of **100–300 µg/m³**, accompanied by elevated Nitrogen Dioxide (NO₂) and ultrafine soot.\n- **Exhaust Protocol:** Turn on exhaust fans 2 minutes before igniting burners to establish airflow draft, and keep running for a minimum of **15 minutes post-cooking** to clear lingering sub-micron condensates.\n- **Physical Isolation:** Close interior kitchen doors and open an exterior kitchen window 2 inches during cooking to direct thermal plumes away from bedrooms and living spaces.`;
  }

  if (q.includes('window') || q.includes('air out') || q.includes('ventilat')) {
    if (scenario.aqi > 150) {
      return `**Ventilation Rule for ${city.name} (AQI ${scenario.aqi}): Windows must remain strictly sealed.**\n\n- Ambient PM2.5 is ${scenario.pm25} µg/m³. Opening windows will equalize indoor air with toxic ambient concentrations within 18 minutes.\n- Keep air conditioning on internal recirculation mode.\n- Only brief cross-ventilation (5 minutes) should be attempted, strictly between **14:00 and 15:00**, if indoor CO₂ levels exceed 1,500 ppm.`;
    } else {
      return `**Ventilation Advisory:**\n\n- Outdoor AQI is ${scenario.aqi}. The safe ventilation window is **13:30 – 15:30** when thermal convection disperses ground-level smog.\n- Avoid opening windows during morning (06:00–10:00) and late evening (19:00–23:00) thermal inversion episodes.`;
    }
  }

  return `**VayuGrid Intelligence Protocol for ${city.name}:**\n\n- Current Scenario: **${scenario.label}** with AQI **${scenario.aqi}** and PM2.5 at **${scenario.pm25} µg/m³** (${Math.round(scenario.pm25 / 15)}x WHO 24h limit).\n- Inversion Trap Active: **${scenario.thermalInversionWindow}**.\n- Household Setup: ${profile.neighborhood} zone with ${profile.purifier === 'none' ? 'no purifier' : profile.purifier + ' purifier'} and ${profile.cooking} cooking setup.\n- Immediate Recommendation: Maintain sealed window perimeters, enforce 15-minute kitchen exhaust overrun, and restrict outdoor commutes or transit to outside the morning inversion peak.`;
}
