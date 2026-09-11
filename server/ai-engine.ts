import { 
  LocationItem, 
  RoadSegment, 
  VehicleType, 
  CargoType, 
  PriorityLevel, 
  MovementType, 
  RouteOption, 
  RouteAnalysisResult,
  RiskLevel 
} from '../src/types.js';
import { db } from './db.js';

export interface RouteAnalysisInput {
  originId: string;
  destinationId: string;
  movementType: MovementType;
  vehicle: VehicleType;
  cargo: CargoType;
  priority: PriorityLevel;
  customWeights?: {
    safety: number;
    travelTime: number;
    fuelEfficiency: number;
    roadQuality: number;
    connectivity: number;
    weather: number;
  };
}

export interface LandslidePredictionInput {
  rainfallMm: number;
  slopeDegrees: number;
  soilMoisture: 'Low' | 'Medium' | 'High' | 'Saturated';
  elevationMeters: number;
  previousIncidentsCount: number;
  roadCondition: 'Good' | 'Fair' | 'Poor' | 'Degraded';
}

export class NERSmartMoveAI {
  /**
   * Predicts landslide risk percentage based on geotechnical and meteorological factors.
   */
  static predictLandslideRisk(input: LandslidePredictionInput) {
    // 1. Rainfall factor (up to 40 pts)
    const rainScore = Math.min(40, (input.rainfallMm / 140) * 40);

    // 2. Slope angle factor (up to 30 pts)
    // Mountain slopes > 45 degrees exhibit exponential creep in NER
    const slopeScore = Math.min(30, (Math.max(0, input.slopeDegrees - 15) / 55) * 30);

    // 3. Soil moisture saturation factor (up to 18 pts)
    let moistureScore = 4;
    if (input.soilMoisture === 'Medium') moistureScore = 9;
    if (input.soilMoisture === 'High') moistureScore = 15;
    if (input.soilMoisture === 'Saturated') moistureScore = 18;

    // 4. Historical occurrences factor (up to 12 pts)
    const historyScore = Math.min(12, input.previousIncidentsCount * 2.5);

    // 5. Road structural condition factor
    let conditionScore = 2;
    if (input.roadCondition === 'Poor') conditionScore = 6;
    if (input.roadCondition === 'Degraded') conditionScore = 9;

    let totalScore = Math.round(rainScore + slopeScore + moistureScore + historyScore + conditionScore);
    totalScore = Math.max(5, Math.min(99, totalScore));

    let riskLevel: RiskLevel = 'LOW';
    if (totalScore >= 75) riskLevel = 'CRITICAL';
    else if (totalScore >= 55) riskLevel = 'HIGH';
    else if (totalScore >= 35) riskLevel = 'MODERATE';

    let recommendation = 'Standard commercial transit permitted with routine mountain caution.';
    if (riskLevel === 'CRITICAL') {
      recommendation = 'Avoid non-essential movement through this road segment. Heavy freight prohibited; 4x4 pilot escort required.';
    } else if (riskLevel === 'HIGH') {
      recommendation = 'Daylight transit only. Advise caution around active landslide chutes and monitor BRO updates.';
    } else if (riskLevel === 'MODERATE') {
      recommendation = 'Passable with standard precautions. Maintain low speed on ghat curves.';
    }

    return {
      riskPercent: totalScore,
      riskLevel,
      recommendation,
      breakdown: {
        rainfallFactor: Math.round(rainScore),
        slopeFactor: Math.round(slopeScore),
        moistureFactor: Math.round(moistureScore),
        historyFactor: Math.round(historyScore),
        roadConditionFactor: Math.round(conditionScore)
      }
    };
  }

  /**
   * Generates intelligent route evaluation between two NER locations.
   */
  static analyzeRoute(input: RouteAnalysisInput): RouteAnalysisResult {
    const origin = db.locations.find(l => l.id === input.originId) || db.locations[0];
    const destination = db.locations.find(l => l.id === input.destinationId) || db.locations[2]; // default Tawang

    // Calculate approximate direct geodesic distance
    const latDiff = (destination.lat - origin.lat) * 111;
    const lngDiff = (destination.lng - origin.lng) * 105;
    const directKm = Math.round(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 1.45); // Ghat winding factor 1.45x

    // Elevation delta impact
    const elevationDelta = Math.abs(destination.elevationMeters - origin.elevationMeters);
    const isAlpineAscent = destination.elevationMeters > 2000 || origin.elevationMeters > 2000;

    // Check road segments that connect these points or their regional corridors
    const relevantRoads = db.roadSegments.filter(r => 
      r.fromLocationId === origin.id || 
      r.toLocationId === destination.id ||
      r.name.toLowerCase().includes(origin.name.toLowerCase()) ||
      r.name.toLowerCase().includes(destination.name.toLowerCase())
    );

    const hasBlockedRoad = relevantRoads.some(r => r.status === 'BLOCKED');
    const worstRiskPercent = relevantRoads.reduce((max, r) => Math.max(max, r.landslideRiskPercent), 35);

    // Build Route A (Standard / Direct corridor)
    const distA = Math.max(80, directKm);
    let speedA = 36; // kmh average in NER hills
    if (isAlpineAscent) speedA = 28;
    if (input.vehicle === 'Truck') speedA -= 6;
    if (input.vehicle === 'Ambulance' || input.vehicle === 'SUV') speedA += 8;

    const timeMinA = Math.round((distA / Math.max(18, speedA)) * 60);
    const riskA = hasBlockedRoad ? 94 : Math.min(95, worstRiskPercent + (isAlpineAscent ? 15 : 0));
    const connectivityA = Math.round((origin.connectivityPercent + destination.connectivityPercent) / 2 - (isAlpineAscent ? 18 : 6));
    const fuelRateA = input.vehicle === 'Truck' ? 24 : input.vehicle === 'Bus' ? 18 : input.vehicle === 'SUV' ? 12 : 10;
    const fuelCostA = Math.round(distA * fuelRateA * (1 + elevationDelta / 5000));

    // Build Route B (Alternative / Safer high-clearance ridge bypass)
    const distB = Math.round(distA * 1.14); // 14% longer detour
    let speedB = speedA + 3; // bypass has fewer urban bottlenecks
    const timeMinB = Math.round((distB / Math.max(20, speedB)) * 60);
    const riskB = Math.max(12, Math.round(riskA * 0.48)); // 52% safer
    const connectivityB = Math.min(92, connectivityA + 12);
    const fuelCostB = Math.round(distB * fuelRateA * (1 + (elevationDelta * 0.7) / 5000));

    // Vehicle suitability verification
    let vehicleSuitabilityScoreA = 80;
    let vehicleSuitabilityScoreB = 88;
    let warningA = undefined;
    let warningB = undefined;

    if (input.vehicle === 'Truck' && isAlpineAscent) {
      vehicleSuitabilityScoreA = 35;
      warningA = 'Heavy multi-axle truck restricted on narrow switchback hairpin bends (curvatures < 12m).';
      vehicleSuitabilityScoreB = 65;
    }

    if (input.vehicle === 'Ambulance') {
      vehicleSuitabilityScoreA = 90;
      vehicleSuitabilityScoreB = 95;
    }

    // Determine scoring weights
    let wSafety = 0.40;
    let wTime = 0.20;
    let wFuel = 0.15;
    let wRoad = 0.10;
    let wConn = 0.10;
    let wWeather = 0.05;

    if (input.priority === 'Emergency' || input.cargo === 'Medicine' || input.movementType === 'Emergency') {
      wSafety = 0.48;
      wTime = 0.28;
      wRoad = 0.12;
      wConn = 0.08;
      wFuel = 0.04;
    }

    // Calculate Route A overall score
    const safetyScoreA = Math.max(5, 100 - riskA);
    const timeScoreA = Math.max(10, 100 - Math.min(90, (timeMinA / 600) * 80));
    const fuelScoreA = Math.max(10, 100 - Math.min(90, (fuelCostA / 6000) * 80));
    const roadScoreA = hasBlockedRoad ? 5 : (riskA > 70 ? 30 : 75);
    const weatherScoreA = Math.max(15, 100 - (destination.weatherSummary.rainfallMm * 0.8));

    const overallA = Math.round(
      safetyScoreA * wSafety +
      timeScoreA * wTime +
      fuelScoreA * wFuel +
      roadScoreA * wRoad +
      connectivityA * wConn +
      weatherScoreA * wWeather
    );

    // Calculate Route B overall score
    const safetyScoreB = Math.max(10, 100 - riskB);
    const timeScoreB = Math.max(10, 100 - Math.min(90, (timeMinB / 600) * 80));
    const fuelScoreB = Math.max(10, 100 - Math.min(90, (fuelCostB / 6000) * 80));
    const roadScoreB = 84;
    const weatherScoreB = Math.max(25, 100 - (destination.weatherSummary.rainfallMm * 0.45));

    const overallB = Math.round(
      safetyScoreB * wSafety +
      timeScoreB * wTime +
      fuelScoreB * wFuel +
      roadScoreB * wRoad +
      connectivityB * wConn +
      weatherScoreB * wWeather
    );

    // Which route is recommended?
    // Route B is recommended if Route A has high landslide risk, or is blocked, or cargo is sensitive!
    const recommendRouteB = hasBlockedRoad || riskA > 50 || overallB > overallA || input.priority === 'Emergency';

    const formatTime = (mins: number) => {
      const h = Math.floor(mins / 60);
      const m = mins % 60;
      return `${h}h ${m > 0 ? `${m}m` : ''}`;
    };

    const routeAOption: RouteOption = {
      id: 'route-direct-corridor',
      name: `Direct Lifeline Corridor (${origin.name} - ${destination.name})`,
      viaLocations: [origin.name, 'Direct Mountain Axis', destination.name],
      distanceKm: distA,
      estimatedMinutes: timeMinA,
      safetyScore: safetyScoreA,
      overallScore: overallA,
      riskPercent: riskA,
      estimatedFuelInr: fuelCostA,
      connectivityPercent: connectivityA,
      weatherCondition: destination.weatherSummary.condition,
      roadCondition: hasBlockedRoad ? 'BLOCKED' : riskA > 65 ? 'High Landslide Risk' : 'Passable with caution',
      isRecommended: !recommendRouteB,
      scoreBreakdown: {
        safety: Math.round(safetyScoreA),
        travelTime: Math.round(timeScoreA),
        fuelEfficiency: Math.round(fuelScoreA),
        roadQuality: Math.round(roadScoreA),
        connectivity: Math.round(connectivityA),
        weather: Math.round(weatherScoreA),
        vehicleSuitability: vehicleSuitabilityScoreA
      },
      explanationPoints: [
        `Shortest spatial distance (${distA} km) along main highway alignment.`,
        hasBlockedRoad 
          ? 'CRITICAL WARNING: Route is compromised by active landslide/flood blockages.' 
          : `High cumulative slope angle increases incident vulnerability (${riskA}% risk).`,
        `Estimated travel time: ${formatTime(timeMinA)} under nominal traffic.`
      ],
      roadSegmentIds: relevantRoads.map(r => r.id),
      unsuitableWarning: warningA
    };

    const routeBOption: RouteOption = {
      id: 'route-stabilized-bypass',
      name: `Strategic Ridge Bypass & Stabilized Corridor (${origin.name} - ${destination.name})`,
      viaLocations: [origin.name, 'Secondary Ridge Bypass', 'Valley Link', destination.name],
      distanceKm: distB,
      estimatedMinutes: timeMinB,
      safetyScore: safetyScoreB,
      overallScore: overallB,
      riskPercent: riskB,
      estimatedFuelInr: fuelCostB,
      connectivityPercent: connectivityB,
      weatherCondition: 'Moderate rain, cleared mountain pass',
      roadCondition: 'Reinforced concrete / BRO cleared',
      isRecommended: recommendRouteB,
      scoreBreakdown: {
        safety: Math.round(safetyScoreB),
        travelTime: Math.round(timeScoreB),
        fuelEfficiency: Math.round(fuelScoreB),
        roadQuality: Math.round(roadScoreB),
        connectivity: Math.round(connectivityB),
        weather: Math.round(weatherScoreB),
        vehicleSuitability: vehicleSuitabilityScoreB
      },
      explanationPoints: [
        `✓ ${Math.max(25, riskA - riskB)}% lower landslide and flash-flood probability than direct corridor.`,
        `✓ Avoids active landslide slip-faces and severe river erosion zones.`,
        `✓ ${connectivityB}% corridor network uptime ensures live dispatch tracking and telemetry.`,
        `✓ Suitable for selected vehicle class (${input.vehicle}) with adequate turning radius and clearance.`,
        `⚠ ${distB - distA} km longer than direct route, but provides guaranteed passability and prevents critical halts.`
      ],
      roadSegmentIds: relevantRoads.map(r => r.id),
      unsuitableWarning: warningB
    };

    const recommendedRoute = recommendRouteB ? routeBOption : routeAOption;
    const alternativeRoute = recommendRouteB ? routeAOption : routeBOption;

    const offlineRecommended = recommendedRoute.connectivityPercent < 55;

    return {
      origin,
      destination,
      movementType: input.movementType,
      vehicle: input.vehicle,
      cargo: input.cargo,
      priority: input.priority,
      recommendedRoute,
      alternativeRoute,
      terrainSummary: `${origin.terrainType} to ${destination.terrainType} (Elevation variance: ${elevationDelta}m).`,
      contingencyAdvice: isAlpineAscent 
        ? 'Carry high-traction snow chains/mud grips, satellite SOS communicator, and 48-hour emergency rations.'
        : 'Monitor cloudburst radars at transit waypoints. Ensure full auxiliary fuel.',
      offlineRecommended
    };
  }

  /**
   * Freight optimization evaluation
   */
  static optimizeFreight(input: {
    cargo: CargoType;
    weightKg: number;
    volumeM3?: number;
    priority: PriorityLevel;
    originId: string;
    destinationId: string;
    preferredVehicle?: VehicleType;
  }) {
    // Determine best vehicle based on weight and terrain
    let recommendedVehicle: VehicleType = 'Truck';
    let rationale = '';

    const dest = db.locations.find(l => l.id === input.destinationId);
    const isSteep = (dest?.elevationMeters || 0) > 1500;

    if (input.weightKg <= 1200) {
      recommendedVehicle = isSteep ? 'SUV' : 'Van';
      rationale = 'Lightweight consignment; agile 4WD SUV or Van maximizes mountain speed and safety.';
    } else if (input.weightKg <= 4000) {
      recommendedVehicle = 'Mini Truck';
      rationale = 'Medium payload; 4x4 Mini Truck (e.g. Bolero/Force) has optimal wheelbase for NER switchbacks.';
    } else {
      if (isSteep) {
        recommendedVehicle = 'Mini Truck';
        rationale = 'High altitude mountain route: splitting into two 4x4 Mini Trucks strongly recommended over single heavy truck due to tight hairpins.';
      } else {
        recommendedVehicle = 'Truck';
        rationale = 'Heavy freight corridor on lowland plains/broad highways; 12-16 Ton multi-axle maximizes fuel economy.';
      }
    }

    if (input.cargo === 'Medicine') {
      if (recommendedVehicle === 'Truck') recommendedVehicle = 'Mini Truck';
      rationale = 'Cold-chain and medical sensitivity requires high-speed shock-damped transit and priority bypass routing.';
    }

    // Analyze route with selected/recommended vehicle
    const routeAnalysis = this.analyzeRoute({
      originId: input.originId,
      destinationId: input.destinationId,
      movementType: 'Freight',
      vehicle: input.preferredVehicle || recommendedVehicle,
      cargo: input.cargo,
      priority: input.priority
    });

    return {
      recommendedVehicle,
      vehicleRationale: rationale,
      estimatedFuelInr: routeAnalysis.recommendedRoute.estimatedFuelInr,
      estimatedMinutes: routeAnalysis.recommendedRoute.estimatedMinutes,
      recommendedRoute: routeAnalysis.recommendedRoute,
      priorityRank: input.priority === 'Emergency' ? 'P1 - Immediate Clearance' : input.priority === 'Urgent' ? 'P2 - Fast Track' : 'P3 - Scheduled Movement',
      unsuitableWarning: routeAnalysis.recommendedRoute.unsuitableWarning
    };
  }
}
