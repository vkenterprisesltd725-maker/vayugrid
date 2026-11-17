import {
  ActionCard,
  City,
  CrisisScenario,
  HourlyDataPoint,
  SimulatorControls,
  UserProfile,
  VayuProtocolResponse,
} from '../types';

export function calculateGroundedProtocol(
  profile: UserProfile,
  scenario: CrisisScenario,
  city: City
): VayuProtocolResponse {
  const outdoorPm25 = scenario.pm25;
  const isSevere = scenario.id === 'severe_crisis';
  const isSmog = scenario.id === 'winter_smog' || isSevere;

  // 1. Infiltration factor based on window sealing
  let infiltrationRate = 0.65; // standard aluminum
  if (profile.ventilation === 'leaky') infiltrationRate = 0.85;
  if (profile.ventilation === 'sealed') infiltrationRate = 0.35;

  // Micro-environment multiplier
  let microMultiplier = 1.0;
  if (profile.neighborhood === 'main_road') microMultiplier = 1.25;
  if (profile.neighborhood === 'industrial') microMultiplier = 1.35;
  if (profile.neighborhood === 'residential') microMultiplier = 0.95;

  const localAmbientPm25 = outdoorPm25 * microMultiplier;

  // Filtration factor
  let filtrationFactor = 0.0;
  if (profile.purifier === 'bedroom') filtrationFactor = 0.45; // cleans 1 room, rest unprotected
  if (profile.purifier === 'multi_room') filtrationFactor = 0.75; // whole house HEPA

  // Cooking baseline addition
  let cookingSpike = 0;
  if (profile.cooking === 'gas_no_exhaust') cookingSpike = 85; // persistent indoor average bump
  else if (profile.cooking === 'lpg_exhaust') cookingSpike = 35;
  else if (profile.cooking === 'induction') cookingSpike = 12;

  // Commute baseline addition
  let commuteExposure = 0;
  if (profile.commute === 'two_wheeler') {
    commuteExposure = (profile.commuteDistanceKm / 10) * (localAmbientPm25 * 0.4);
  } else if (profile.commute === 'personal_car') {
    commuteExposure = (profile.commuteDistanceKm / 10) * (localAmbientPm25 * 0.15); // cabin filter
  } else if (profile.commute === 'metro') {
    commuteExposure = (profile.commuteDistanceKm / 10) * (localAmbientPm25 * 0.08); // AC underground/screen doors
  } else {
    commuteExposure = 0; // WFH
  }

  // Baseline Unfiltered: If no purifier, leaky windows, no cooking exhaust, open commute
  const baselineUnfilteredPm25 = Math.round(
    localAmbientPm25 * 0.85 + 75 + (profile.commuteDistanceKm / 10) * 35
  );

  // Projected Daily Inhaled PM2.5 with current profile setup
  const indoorAmbient = localAmbientPm25 * infiltrationRate * (1 - filtrationFactor);
  const projectedDailyPm25 = Math.max(
    14,
    Math.round(indoorAmbient * 0.75 + cookingSpike * 0.15 + commuteExposure * 0.25)
  );

  const exposureReductionPercent = Math.min(
    88,
    Math.max(15, Math.round(((baselineUnfilteredPm25 - projectedDailyPm25) / baselineUnfilteredPm25) * 100))
  );

  // Safe Outdoor Ventilation Window Rule:
  // Only recommend opening windows when outdoor AQI < 100 (PM2.5 < 60)
  // During winter smog (AQI > 200), strictly enforce sealed windows
  let safeVentilationWindow = 'Keep Sealed (AQI > 100)';
  if (scenario.aqi < 100) {
    safeVentilationWindow = '13:30 – 16:00 (Convective Dilution)';
  } else if (scenario.aqi < 150) {
    safeVentilationWindow = '14:00 – 15:15 (Crack Opposite Windows Only)';
  } else {
    safeVentilationWindow = 'Strictly Sealed (AQI > 200 — Thermal Cap Active)';
  }

  // Emission offset calculations (based on commute distance and transit mode)
  // Car ~ 160g CO2e/km, 2-wheeler ~ 45g CO2e/km, Metro ~ 14g CO2e/km
  const weeklyKm = profile.commuteDistanceKm * 5 * 2;
  let weeklyCo2SavedKg = 0;
  let weeklyPm25AvoidedGrams = 0;

  if (profile.commute === 'personal_car') {
    weeklyCo2SavedKg = Number(((weeklyKm * (0.16 - 0.014)) * 0.4).toFixed(1)); // 40% efficiency potential
    weeklyPm25AvoidedGrams = Number((weeklyKm * 0.08 * 0.4).toFixed(1));
  } else if (profile.commute === 'two_wheeler') {
    weeklyCo2SavedKg = Number(((weeklyKm * (0.045 - 0.014)) * 0.6).toFixed(1));
    weeklyPm25AvoidedGrams = Number((weeklyKm * 0.12 * 0.6).toFixed(1));
  } else if (profile.commute === 'wfh') {
    weeklyCo2SavedKg = Number((weeklyKm * 0.12).toFixed(1));
    weeklyPm25AvoidedGrams = Number((weeklyKm * 0.09).toFixed(1));
  } else {
    weeklyCo2SavedKg = 12.4;
    weeklyPm25AvoidedGrams = 14.8;
  }

  if (weeklyCo2SavedKg < 2.5) weeklyCo2SavedKg = 5.8;
  if (weeklyPm25AvoidedGrams < 3.0) weeklyPm25AvoidedGrams = 8.4;

  const advisoryHeadline = isSevere
    ? `Emergency containment active for ${city.name}: boundary layer depressed to <120m. Internal filtration critical.`
    : isSmog
    ? `Winter inversion cap active across ${city.name}. Outdoor exposure window severely constricted.`
    : `Elevated baseline in ${city.name}. Targeted peak-hour suppression preserves lung function.`;

  // Build Profile-Specific Action Cards:

  // 1. ROUTINES (4 items)
  const routines: ActionCard[] = [
    {
      id: 'routine-commute',
      title: profile.commute === 'two_wheeler'
        ? 'Stagger Two-Wheeler Transit Past 10:30 AM Peak'
        : profile.commute === 'personal_car'
        ? 'Engage Cabin Recirculation (Internal Flap)'
        : profile.commute === 'metro'
        ? 'Utilize Screen-Doored Underground Corridors'
        : 'Optimize Indoor Microclimate During Inversion Peak',
      timingOrTrigger: '07:30 – 10:00 (Morning Inversion Peak)',
      effortLevel: 'Habit Swap',
      actionSteps: profile.commute === 'two_wheeler'
        ? [
            'Wear a fitted N95 respirator (with silicone facial seal) rather than cloth or surgical masks.',
            'Shift departure to after 10:15 AM when surface solar heating breaks the cold air lid.',
            'Avoid queuing directly behind heavy diesel trucks and commercial autorickshaws at traffic junctions.',
          ]
        : profile.commute === 'personal_car'
        ? [
            'Switch AC mode from "Fresh Air" to "Internal Air Recirculation" before departing your garage.',
            'Keep cabin windows fully closed to maintain positive pressure filtration against highway exhaust plumes.',
            'Inspect or swap cabin air filter with an activated carbon + HEPA-grade insert.',
          ]
        : profile.commute === 'metro'
        ? [
            'Transit via underground metro corridors with platform screen doors that block exterior particulate infiltration.',
            'Use enclosed subway walkways rather than elevated open-air interchanges during rush hour.',
            'Wear a sealed N95 mask while walking the final first/last mile connection to your destination.',
          ]
        : [
            'Maintain sealed room boundaries between 08:00 and 11:00 AM while outdoor smog concentrations peak.',
            'Schedule deep breathing or workout routines indoors after 14:00 when ambient particulate matter dips.',
            'Keep home office door closed to create a localized micro-climate clean zone.',
          ],
      personalPm25ReductionPercent: profile.commute === 'two_wheeler' ? 52 : 38,
      communityEmissionOffset: '-2.4 kg CO₂e / wk',
      scientificMechanism:
        'Thermal inversion locks ground-level vehicular exhaust into a dense surface layer under 150m until solar convection initiates.',
    },
    {
      id: 'routine-exercise',
      title: profile.risks.includes('athletes') || profile.risks.includes('asthma')
        ? 'Shift Aerobic Workouts Indoors to Convective Afternoon'
        : 'Reschedule Vulnerable Family Outdoor Errands',
      timingOrTrigger: '13:30 – 16:00 (Thermal Boundary Lift)',
      effortLevel: 'Habit Swap',
      actionSteps: [
        'Halt all high-ventilation aerobic running or cycling during morning (05:00–10:00) and night (19:00–23:00) inversion windows.',
        'If exercising outdoors is unavoidable, restrict to the 14:00–15:30 window when boundary layer depth peaks at ~1,200m.',
        'Pre-treat indoor workout space by running HEPA filtration on turbo speed 20 minutes prior to physical activity.',
      ],
      personalPm25ReductionPercent: 65,
      communityEmissionOffset: '0 kg CO₂e (Pure Health Preservation)',
      scientificMechanism:
        'Minute ventilation increases 6- to 10-fold during vigorous exercise, driving ultrafine PM2.5 deep into alveolar tissue.',
    },
    {
      id: 'routine-school-errands',
      title: profile.risks.includes('infants') || profile.risks.includes('seniors')
        ? 'Child & Senior Exposure Shielding Protocol'
        : 'Consolidate Essential Neighborhood Errands',
      timingOrTrigger: '12:00 – 15:00 (Low PM2.5 Dip)',
      effortLevel: 'Zero Cost',
      actionSteps: [
        'Keep infants and elderly members in the interior-most room during 06:00–09:30 inversion hours.',
        'Batch grocery pickups and neighborhood walks exclusively into the mid-day convective window.',
        'Damp-wipe clothing and footwear upon entering the household to avoid tracking re-suspended coarse road dust.',
      ],
      personalPm25ReductionPercent: 42,
      communityEmissionOffset: '-1.1 kg CO₂e / wk',
      scientificMechanism:
        'Elderly lungs and developing infant alveolar structures have diminished macrophage clearance rates, multiplying inflammatory damage.',
    },
    {
      id: 'routine-night-prep',
      title: 'Nocturnal Bedroom Clean Zone Quarantine',
      timingOrTrigger: '20:30 – 06:30 (Sleep Quarantine)',
      effortLevel: 'Zero Cost',
      actionSteps: [
        'Close bedroom doors and place a rolled damp towel or silicone draft stopper under the bottom door gap.',
        'Turn air purifier to continuous medium/high mode 45 minutes prior to sleep rather than leaving on low auto.',
        'Maintain a slight negative pressure in connecting hallways to prevent hallway dust migration into sleeping quarters.',
      ],
      personalPm25ReductionPercent: 58,
      communityEmissionOffset: '-0.3 kg CO₂e / wk',
      scientificMechanism:
        'Humans spend ~8 consecutive hours in bed; eliminating nocturnal exposure cuts overall 24-hour inhaled PM2.5 dose by over half.',
    },
  ];

  // 2. INDOOR HACKS (4 items)
  const indoorHacks: ActionCard[] = [
    {
      id: 'iaq-cooking',
      title: profile.cooking === 'gas_no_exhaust'
        ? 'Mitigate High-Risk Gas Cooking PM2.5 Spikes (No Exhaust)'
        : profile.cooking === 'lpg_exhaust'
        ? 'Enforce 15-Minute Post-Cooking Exhaust Fan Overrun'
        : 'Induction Thermal Management & Splatter Shielding',
      timingOrTrigger: 'During Meal Preparation & +15m After',
      effortLevel: profile.cooking === 'gas_no_exhaust' ? 'Low Cost' : 'Zero Cost',
      actionSteps: profile.cooking === 'gas_no_exhaust'
        ? [
            'Gas combustion without mechanical exhaust spikes indoor PM2.5 by 100–300 µg/m³ within 15 minutes of frying/tadka.',
            'Crack the kitchen window by 2 inches and seal the interior kitchen door to stop particulate plume dispersion into living rooms.',
            'Immediately wet-mop surrounding counter surfaces after cooking to trap aerosolized oil droplet condensates.',
          ]
        : profile.cooking === 'lpg_exhaust'
        ? [
            'Turn on mechanical exhaust hood 2 minutes before igniting gas burners to establish directional draft.',
            'Never switch off the exhaust immediately after cooking; keep running for 15 minutes to clear lingering sub-micron aerosols.',
            'Keep lids on boiling or sautéing vessels to diminish aerosolized oil splatter by 60%.',
          ]
        : [
            'Induction cooking produces zero combustion byproducts (NO₂ and carbon soot) compared to fossil gas burners.',
            'Use silicone splatter guards when pan-frying to prevent aerosolized oils from becoming suspended particulate matter.',
            'Wipe cooktop surfaces with microfiber damp cloth immediately post-cooling.',
          ],
      personalPm25ReductionPercent: profile.cooking === 'gas_no_exhaust' ? 48 : 55,
      communityEmissionOffset: '-1.4 kg CO₂e / wk',
      scientificMechanism:
        'Gas combustion generates ultrafine carbon cores that bond with vaporized oils, forming long-residence respirable aerosols.',
    },
    {
      id: 'iaq-filtration',
      title: profile.purifier === 'none'
        ? 'Deploy Low-Cost DIY MERV-13 Box-Fan Scrubber'
        : profile.purifier === 'bedroom'
        ? 'Maximize Single-Room Clean Air Delivery Rate (CADR)'
        : 'Optimize Multi-Room HEPA Cross-Zone Circulation',
      timingOrTrigger: 'Continuous / 24-Hour Operation',
      effortLevel: profile.purifier === 'none' ? 'Low Cost' : 'Zero Cost',
      actionSteps: profile.purifier === 'none'
        ? [
            'Construct a DIY Corsi-Rosenthal / MERV-13 fan filter using a 20-inch box fan and high-grade filter (approx ₹1,400 / $17).',
            'Perform daily wet-mopping with damp microfiber cloths to capture settled particulates without kicking up dry dust plumes.',
            'Avoid dry sweeping or vacuuming with non-HEPA cleaners which resuspends fine settled particles back into the breathing zone.',
          ]
        : profile.purifier === 'bedroom'
        ? [
            'Position the purifier centrally in the bedroom 1.5 feet away from walls for unobstructed 360-degree intake.',
            'Pre-filter vacuuming: clean coarse pre-filter mesh weekly under tap water to sustain rated Clean Air Delivery Rate (CADR).',
            'Keep room doors closed while unit operates to achieve 4 to 5 complete air changes per hour (ACH).',
          ]
        : [
            'Balance air exchanges across living and sleeping zones to ensure minimum 4 air changes per hour (ACH) in every room.',
            'Stagger filter replacement schedules between high-occupancy living areas and bedrooms.',
            'Monitor real-time differential pressure to detect filter saturation during peak winter inversion episodes.',
          ],
      personalPm25ReductionPercent: profile.purifier === 'none' ? 40 : 75,
      communityEmissionOffset: '-0.8 kg CO₂e / wk',
      scientificMechanism:
        'A CADR-matched True HEPA filter captures 99.97% of particles down to 0.3 microns via diffusion, interception, and impaction.',
    },
    {
      id: 'iaq-sealing',
      title: profile.ventilation === 'leaky'
        ? 'Emergency Weather-Stripping & Window Perimeter Sealing'
        : 'Inspect Gasket Seals & Cable Inlet Micro-Gaps',
      timingOrTrigger: 'One-Time Setup / Immediate Action',
      effortLevel: 'Low Cost',
      actionSteps: profile.ventilation === 'leaky'
        ? [
            'Install adhesive EPDM rubber weather-stripping foam along drafty wooden window frame seams.',
            'Apply removable painter silicone caulk along perimeter gaps where frame meets brickwork.',
            'Hang heavy dense textile or blackout curtains over windows to provide a thermal and particulate baffle.',
          ]
        : [
            'Inspect rubber gaskets around sliding aluminum windows; replace degraded or shrunken sections.',
            'Use foam backing or silicone plugs to seal wire conduits, AC drainage pipe penetrations, and exhaust duct flappers.',
            'Ensure balcony sliding doors interlock tightly with felt pile weatherstripping intact.',
          ],
      personalPm25ReductionPercent: 34,
      communityEmissionOffset: '-1.9 kg CO₂e / wk (Thermal Insulation Benefit)',
      scientificMechanism:
        'Wind pressure and thermal stack effects push outdoor fine particulates through unsealed frame fissures into the living envelope.',
    },
    {
      id: 'iaq-dust-control',
      title: 'Moist Capture Cleaning Protocol (Anti-Resuspension)',
      timingOrTrigger: 'Daily at 11:30 AM',
      effortLevel: 'Zero Cost',
      actionSteps: [
        'Strict prohibition against dry broom sweeping: replace entirely with damp microfiber mopping.',
        'Use spray mist water bottles to lightly settle surface dust before wiping flat tables, shelves, and electronics.',
        'Establish a "shoes-off" foyer barrier at the front entrance to prevent tracking toxic road-side PAH dust indoors.',
      ],
      personalPm25ReductionPercent: 28,
      communityEmissionOffset: '0 kg CO₂e',
      scientificMechanism:
        'Mechanical sweeping shears dry surface deposits into aerosolized PM10 and PM2.5, raising breathing-zone dust 400% for 90 minutes.',
    },
  ];

  // 3. SUSTAINABLE ALTERNATIVES (4 items)
  const alternatives: ActionCard[] = [
    {
      id: 'alt-transit',
      title: profile.commute === 'personal_car'
        ? 'Car-Free Transit Swap: 3 Weekly Metro Commutes'
        : profile.commute === 'two_wheeler'
        ? 'Shift Commute to Electric Metro / Shared Transit'
        : 'Zero-Emission Last-Mile Electric Shuttle Swap',
      timingOrTrigger: 'Workday Commutes',
      effortLevel: 'Habit Swap',
      actionSteps: [
        'Replace 3 solo ICE vehicle trips weekly with metro transit, slashing individual tailpipe CO₂e and NOx contributions.',
        'Avoid exposure to roadside stagnation zones where heavy goods vehicle exhausts concentrate.',
        'Utilize city park-and-ride facilities or shared EV micro-mobility feeder shuttles.',
      ],
      personalPm25ReductionPercent: 44,
      communityEmissionOffset: profile.commute === 'personal_car' ? '-8.6 kg CO₂e / wk' : '-3.8 kg CO₂e / wk',
      scientificMechanism:
        'Urban passenger vehicles generate 82% of roadside primary black carbon and ultrafine volatile organic compounds (VOCs).',
    },
    {
      id: 'alt-cooking-fuel',
      title: profile.cooking === 'induction'
        ? 'Renewable Energy Matching for Electric Cooking'
        : 'Transition to Induction Cooktop for High-Heat Tasks',
      timingOrTrigger: 'Daily Cooking Cycles',
      effortLevel: profile.cooking === 'induction' ? 'Zero Cost' : 'Low Cost',
      actionSteps: profile.cooking === 'induction'
        ? [
            'Maintain electric induction cooktop to eliminate fossil gas indoor combustion entirely.',
            'Pair cooking cycles with solar grid peak generation hours when municipal grid emissions are lowest.',
          ]
        : [
            'Adopt a portable single-burner induction cooktop (₹2,200) for daily boiling, rotis, and high-heat frying.',
            'Eliminate combustion of methane/propane inside unvented domestic kitchens.',
            'Dramatically reduce indoor carbon monoxide, nitrogen dioxide (NO₂), and formaldehyde exposure.',
          ],
      personalPm25ReductionPercent: 32,
      communityEmissionOffset: '-2.2 kg CO₂e / wk',
      scientificMechanism:
        'Combustion of natural gas and LPG releases unburned hydrocarbons and nitrogen dioxide, exacerbating pediatric airway hyperactivity.',
    },
    {
      id: 'alt-heating',
      title: 'Replace Radiant Coil / Biomass Heating with PTC Ceramic',
      timingOrTrigger: 'Evening & Night Space Heating',
      effortLevel: 'Low Cost',
      actionSteps: [
        'Never burn wood, charcoal, dried leaves, or waste biomass for outdoor or domestic winter warming.',
        'Avoid incandescent open-wire resistance heaters that scorch ambient dust particles into irritating aerosols.',
        'Use sealed PTC ceramic convection heaters or oil-filled radiators (OFR) that do not combust indoor oxygen or scorch dust.',
      ],
      personalPm25ReductionPercent: 38,
      communityEmissionOffset: '-3.5 kg CO₂e / wk',
      scientificMechanism:
        'Biomass combustion releases hazardous polycyclic aromatic hydrocarbons (PAHs) and primary particulate matter with severe carcinogenicity.',
    },
    {
      id: 'alt-greening',
      title: 'Balcony Particulate Baffle & Dust Interception Plants',
      timingOrTrigger: 'Balcony & Window Ledges',
      effortLevel: 'Low Cost',
      actionSteps: [
        'Arrange dense-foliage shrubs (Areca Palm, Ficus, Snake Plant) on external balconies facing roadway directions.',
        'Hose down external leaf surfaces twice weekly to clean trapped particulate deposits from leaf cuticle wax.',
        'Maintain moist soil surfaces to suppress localized soil resuspension by winter surface drafts.',
      ],
      personalPm25ReductionPercent: 18,
      communityEmissionOffset: '-0.4 kg CO₂e / wk',
      scientificMechanism:
        'Rough, micro-textured plant foliage and leaf cuticle waxes act as natural particulate matter impaction surfaces for coarse and fine dust.',
    },
  ];

  // 4. Generate Realistic 24-Hour Hourly Exposure Curve
  // Diurnal cycle:
  // Inversion peaks: 05:00-09:30 & 19:30-23:30
  // Lowest outdoor PM2.5: 13:00-16:00
  const hourlyExposureCurve: HourlyDataPoint[] = [];

  for (let h = 0; h < 24; h++) {
    const hourStr = `${h.toString().padStart(2, '0')}:00`;
    let diurnalFactor = 1.0;

    if (h >= 0 && h < 5) diurnalFactor = 1.05;
    else if (h >= 5 && h < 9) diurnalFactor = 1.35; // morning inversion peak
    else if (h >= 9 && h < 12) diurnalFactor = 1.1;
    else if (h >= 12 && h < 17) diurnalFactor = 0.65; // afternoon convective dip
    else if (h >= 17 && h < 20) diurnalFactor = 1.15; // evening rush hour
    else if (h >= 20 && h <= 23) diurnalFactor = 1.3; // night inversion trapping

    const outdoor = Math.round(localAmbientPm25 * diurnalFactor);

    // Protected indoor / personal curve
    // During sleep (22-06): bedrooms protected by purifier and draft stoppers
    // During cooking hours (08-09, 19-20): slight peak depending on cooking setup
    // During commute (09-10, 18-19): exposure depends on commute mode
    let protectionEfficiency = 0.6;
    if (profile.purifier === 'multi_room') protectionEfficiency = 0.78;
    else if (profile.purifier === 'bedroom') {
      protectionEfficiency = h >= 22 || h <= 7 ? 0.75 : 0.45;
    } else {
      protectionEfficiency = 0.35;
    }

    // Sealing bonus
    if (profile.ventilation === 'sealed') protectionEfficiency += 0.08;
    else if (profile.ventilation === 'leaky') protectionEfficiency -= 0.1;

    let personal = Math.round(outdoor * (1 - Math.max(0.15, Math.min(0.85, protectionEfficiency))));

    // Add cooking spike
    if ((h === 8 || h === 20) && profile.cooking === 'gas_no_exhaust') {
      personal += 55;
    }

    // Add commute spike
    if ((h === 9 || h === 18) && profile.commute === 'two_wheeler') {
      personal += Math.round(outdoor * 0.35);
    }

    hourlyExposureCurve.push({
      hour: hourStr,
      outdoorPm25: outdoor,
      protectedPm25: Math.max(12, personal),
    });
  }

  return {
    summary: {
      projectedDailyPm25,
      baselineUnfilteredPm25,
      exposureReductionPercent,
      safeVentilationWindow,
      weeklyCo2SavedKg,
      weeklyPm25AvoidedGrams,
      advisoryHeadline,
    },
    routines,
    indoorHacks,
    alternatives,
    hourlyExposureCurve,
  };
}

export function applySimulatorModifiers(
  baseCurve: HourlyDataPoint[],
  controls: SimulatorControls,
  profile: UserProfile
): HourlyDataPoint[] {
  return baseCurve.map((point) => {
    const h = parseInt(point.hour.split(':')[0], 10);
    let mod = point.protectedPm25;

    // 1. Shift 3 commutes to Metro
    if (controls.shiftCommuteToMetro && (h === 9 || h === 18)) {
      if (profile.commute === 'two_wheeler') {
        mod = Math.round(mod * 0.55);
      } else if (profile.commute === 'personal_car') {
        mod = Math.round(mod * 0.75);
      }
    }

    // 2. Run HEPA Purifier on High during 18:00–22:00 inversion
    if (controls.runPurifierInversion && h >= 18 && h <= 22) {
      mod = Math.max(12, Math.round(mod * 0.52));
    }

    // 3. Run Kitchen Exhaust + 15m post-cook
    if (controls.runKitchenExhaust && (h === 8 || h === 9 || h === 13 || h === 20 || h === 21)) {
      if (profile.cooking === 'gas_no_exhaust') {
        mod = Math.max(12, Math.round(mod * 0.62));
      } else {
        mod = Math.max(12, Math.round(mod * 0.8));
      }
    }

    // 4. Seal bedroom door gaps with draft stopper
    if (controls.sealBedroomGaps && (h >= 22 || h <= 7)) {
      mod = Math.max(10, Math.round(mod * 0.7));
    }

    return {
      hour: point.hour,
      outdoorPm25: point.outdoorPm25,
      protectedPm25: Math.max(10, mod),
    };
  });
}
