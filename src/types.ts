export type NERState = 
  | 'Assam'
  | 'Arunachal Pradesh'
  | 'Manipur'
  | 'Meghalaya'
  | 'Mizoram'
  | 'Nagaland'
  | 'Tripura'
  | 'Sikkim';

export type MovementType = 'Freight' | 'Passenger' | 'Emergency';

export type VehicleType = 
  | 'Truck'
  | 'Mini Truck'
  | 'Bus'
  | 'Van'
  | 'Ambulance'
  | 'SUV';

export type CargoType = 
  | 'Medicine'
  | 'Food'
  | 'Fuel'
  | 'Agricultural'
  | 'General';

export type PriorityLevel = 'Normal' | 'Urgent' | 'Emergency';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type RoadStatus = 'OPEN' | 'DEGRADED' | 'HIGH RISK' | 'BLOCKED';

export type UserRole = 'ADMIN' | 'LOGISTICS MANAGER' | 'DRIVER' | 'FIELD OFFICER';

export interface LocationItem {
  id: string;
  name: string;
  state: NERState;
  lat: number;
  lng: number;
  elevationMeters: number;
  terrainType: string;
  connectivityPercent: number; // 0 - 100
  accessibilityScore: number;  // 0 - 100
  weatherSummary: {
    tempC: number;
    condition: string;
    rainfallMm: number;
    windKmh: number;
    humidity: number;
  };
  hasDepot: boolean;
  hasMedicalCenter: boolean;
}

export interface RoadSegment {
  id: string;
  name: string;
  highwayCode: string;
  fromLocationId: string;
  toLocationId: string;
  distanceKm: number;
  normalTravelMinutes: number;
  status: RoadStatus;
  riskLevel: RiskLevel;
  landslideRiskPercent: number;
  slopeDegrees: number;
  soilMoistureLevel: 'Low' | 'Medium' | 'High' | 'Saturated';
  bridgeCondition: 'Optimal' | 'Caution' | 'Damaged';
  connectivityPercent: number;
  averageSpeedKmh: number;
  lastUpdated: string;
  coordinates: [number, number][]; // Polylines [lat, lng]
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  capacityKg: number;
  driverName: string;
  driverPhone: string;
  currentLocationId: string;
  currentLocationName: string;
  lat: number;
  lng: number;
  fuelPercent: number;
  status: 'Available' | 'On Route' | 'Maintenance' | 'Emergency';
  currentAssignment?: {
    requestId?: string;
    taskTitle: string;
    destinationName: string;
    eta: string;
  };
  terrainClearanceMm: number;
  fourWheelDrive: boolean;
}

export interface RiskZone {
  id: string;
  name: string;
  locationName: string;
  state: NERState;
  lat: number;
  lng: number;
  riskType: 'Landslide' | 'Flash Flood' | 'Road Collapse' | 'Bridge Failure' | 'Severe Weather';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  contributingFactors: string[];
  rainfallMm: number;
  slopeDegrees: number;
  soilMoisture: string;
  previousIncidentsCount: number;
  lastUpdated: string;
  recommendedAction: string;
  alternativeRouteName: string;
}

export interface RouteOption {
  id: string;
  name: string;
  viaLocations: string[];
  distanceKm: number;
  estimatedMinutes: number;
  safetyScore: number; // 0 - 100 (higher is safer)
  overallScore: number; // 0 - 100
  riskPercent: number;
  estimatedFuelInr: number;
  connectivityPercent: number;
  weatherCondition: string;
  roadCondition: string;
  isRecommended: boolean;
  scoreBreakdown: {
    safety: number;
    travelTime: number;
    fuelEfficiency: number;
    roadQuality: number;
    connectivity: number;
    weather: number;
    vehicleSuitability: number;
  };
  explanationPoints: string[];
  roadSegmentIds: string[];
  unsuitableWarning?: string;
}

export interface RouteAnalysisResult {
  origin: LocationItem;
  destination: LocationItem;
  movementType: MovementType;
  vehicle: VehicleType;
  cargo: CargoType;
  priority: PriorityLevel;
  recommendedRoute: RouteOption;
  alternativeRoute?: RouteOption;
  terrainSummary: string;
  contingencyAdvice: string;
  offlineRecommended: boolean;
}

export interface EmergencyRequest {
  id: string;
  title: string;
  emergencyType: 'Flood' | 'Landslide' | 'Medical' | 'Road Block' | 'Food Supply' | 'Evacuation';
  locationName: string;
  state: NERState;
  lat: number;
  lng: number;
  requiredResource: 'Medicine' | 'Food' | 'Water' | 'Rescue equipment';
  priority: 'Critical' | 'Urgent';
  status: 'Pending' | 'Dispatched' | 'On Route' | 'Delivered' | 'Resolved';
  createdAt: string;
  assignedVehicleId?: string;
  assignedVehicleName?: string;
  nearestWarehouse: string;
  blockedRouteAvoided: string;
  recommendedRouteName: string;
  eta: string;
  contactPerson?: string;
  contactPhone?: string;
}

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  type: 'Landslide' | 'Weather' | 'Road Block' | 'Connectivity' | 'Delivery' | 'Emergency';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  locationName: string;
  state: NERState;
  timestamp: string;
  isRead: boolean;
  actionRoute?: string;
  relatedEntityId?: string;
}

export interface RoadIncidentReport {
  id: string;
  locationName: string;
  state: NERState;
  issueType: 'Landslide' | 'Flood' | 'Road damage' | 'Accident' | 'Blocked road' | 'Bridge problem';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  description: string;
  reportedBy: string;
  reportedAt: string;
  status: 'Verified' | 'Under Investigation' | 'Resolved';
  roadSegmentId?: string;
}

export interface AccessibilityBreakdown {
  locationId: string;
  locationName: string;
  state: NERState;
  overallScore: number;
  category: 'Excellent' | 'Good' | 'Moderate' | 'Poor' | 'Critical';
  factors: {
    roadAccessibility: number; // 0 - 100
    publicTransportAvailability: number; // 0 - 100
    emergencyAccess: number; // 0 - 100
    connectivity: number; // 0 - 100
    weatherImpact: number; // 0 - 100
    terrainDifficulty: number; // 0 - 100
  };
  isolationVulnerability: string;
  availableBusesDaily: number;
  avgAmbulanceReachMinutes: number;
  primaryLifelineRoute: string;
}

export interface DemoSettings {
  demoModeActive: boolean;
  monsoonRainfallMultiplier: number; // 1.0 = normal, 2.5 = torrential
  simulateRoadBlockages: boolean;
  simulatedBlockedRoadId?: string;
  offlineSimulation: boolean;
  customRainfallMm?: number;
}
