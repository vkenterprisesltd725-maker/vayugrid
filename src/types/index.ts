export type CrisisScenarioId = 'moderate' | 'winter_smog' | 'severe_crisis';

export interface CrisisScenario {
  id: CrisisScenarioId;
  label: string;
  aqi: number;
  pm25: number;
  pm10: number;
  statusText: string;
  statusType: 'moderate' | 'poor' | 'severe';
  thermalInversionWindow: string;
  description: string;
}

export interface City {
  id: string;
  name: string;
  country: string;
  landmark?: string;
  imageUrl?: string;
  scenarios: Record<CrisisScenarioId, {
    aqi: number;
    pm25: number;
    pm10: number;
    inversionWindow: string;
  }>;
}

export type NeighborhoodType = 'main_road' | 'residential' | 'industrial';

export type HouseholdRisk = 'infants' | 'seniors' | 'asthma' | 'athletes';

export type AirPurifierSetup = 'none' | 'bedroom' | 'multi_room';

export type VentilationSetup = 'leaky' | 'standard' | 'sealed';

export type CookingSetup = 'lpg_exhaust' | 'gas_no_exhaust' | 'induction';

export type CommuteType = 'two_wheeler' | 'personal_car' | 'metro' | 'wfh';

export interface UserProfile {
  cityId: string;
  customCityName?: string;
  neighborhood: NeighborhoodType;
  risks: HouseholdRisk[];
  purifier: AirPurifierSetup;
  ventilation: VentilationSetup;
  cooking: CookingSetup;
  commute: CommuteType;
  commuteDistanceKm: number;
}

export interface ActionCard {
  id: string;
  title: string;
  timingOrTrigger: string;
  effortLevel: 'Zero Cost' | 'Low Cost' | 'Habit Swap';
  actionSteps: string[];
  personalPm25ReductionPercent: number;
  communityEmissionOffset: string;
  scientificMechanism: string;
}

export interface HourlyDataPoint {
  hour: string; // "00:00" to "23:00"
  outdoorPm25: number;
  protectedPm25: number;
}

export interface VayuProtocolResponse {
  summary: {
    projectedDailyPm25: number;
    baselineUnfilteredPm25: number;
    exposureReductionPercent: number;
    safeVentilationWindow: string;
    weeklyCo2SavedKg: number;
    weeklyPm25AvoidedGrams: number;
    advisoryHeadline: string;
  };
  routines: ActionCard[];
  indoorHacks: ActionCard[];
  alternatives: ActionCard[];
  hourlyExposureCurve: HourlyDataPoint[];
}

export interface SimulatorControls {
  shiftCommuteToMetro: boolean;
  runPurifierInversion: boolean;
  runKitchenExhaust: boolean;
  sealBedroomGaps: boolean;
}
