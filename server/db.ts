import { 
  LocationItem, 
  RoadSegment, 
  Vehicle, 
  RiskZone, 
  EmergencyRequest, 
  AlertNotification, 
  RoadIncidentReport, 
  AccessibilityBreakdown,
  DemoSettings 
} from '../src/types.js';

export const INITIAL_LOCATIONS: LocationItem[] = [
  {
    id: 'loc-guwahati',
    name: 'Guwahati',
    state: 'Assam',
    lat: 26.1445,
    lng: 91.7362,
    elevationMeters: 55,
    terrainType: 'Riverine Plains / Regional Gateway',
    connectivityPercent: 96,
    accessibilityScore: 94,
    weatherSummary: { tempC: 28, condition: 'Scattered Clouds', rainfallMm: 12, windKmh: 14, humidity: 75 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-shillong',
    name: 'Shillong',
    state: 'Meghalaya',
    lat: 25.5788,
    lng: 91.8933,
    elevationMeters: 1525,
    terrainType: 'Pine Plateau & Rolling Hills',
    connectivityPercent: 88,
    accessibilityScore: 82,
    weatherSummary: { tempC: 19, condition: 'Moderate Fog & Drizzle', rainfallMm: 45, windKmh: 18, humidity: 88 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-tawang',
    name: 'Tawang',
    state: 'Arunachal Pradesh',
    lat: 27.5861,
    lng: 91.8594,
    elevationMeters: 3048,
    terrainType: 'High Alpine Gorge & Steep Pass',
    connectivityPercent: 38,
    accessibilityScore: 42,
    weatherSummary: { tempC: 8, condition: 'Heavy Rain & Mountain Fog', rainfallMm: 86, windKmh: 28, humidity: 92 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-itanagar',
    name: 'Itanagar',
    state: 'Arunachal Pradesh',
    lat: 27.0844,
    lng: 93.6053,
    elevationMeters: 320,
    terrainType: 'Sub-Himalayan Foothills',
    connectivityPercent: 78,
    accessibilityScore: 74,
    weatherSummary: { tempC: 24, condition: 'Intermittent Showers', rainfallMm: 38, windKmh: 15, humidity: 82 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-kohima',
    name: 'Kohima',
    state: 'Nagaland',
    lat: 25.6751,
    lng: 94.1086,
    elevationMeters: 1444,
    terrainType: 'Rugged Mountain Ridge',
    connectivityPercent: 68,
    accessibilityScore: 66,
    weatherSummary: { tempC: 20, condition: 'Cloudy with Light Rain', rainfallMm: 32, windKmh: 12, humidity: 84 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-dimapur',
    name: 'Dimapur',
    state: 'Nagaland',
    lat: 25.9090,
    lng: 93.7266,
    elevationMeters: 145,
    terrainType: 'Alluvial Valley Gateway',
    connectivityPercent: 91,
    accessibilityScore: 88,
    weatherSummary: { tempC: 29, condition: 'Humid & Overcast', rainfallMm: 16, windKmh: 10, humidity: 80 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-imphal',
    name: 'Imphal',
    state: 'Manipur',
    lat: 24.8170,
    lng: 93.9368,
    elevationMeters: 786,
    terrainType: 'Surrounded Intermontane Basin',
    connectivityPercent: 74,
    accessibilityScore: 69,
    weatherSummary: { tempC: 25, condition: 'Overcast with Mist', rainfallMm: 28, windKmh: 11, humidity: 83 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-aizawl',
    name: 'Aizawl',
    state: 'Mizoram',
    lat: 23.7271,
    lng: 92.7176,
    elevationMeters: 1132,
    terrainType: 'Steep Longitudinal Mountain Ridge',
    connectivityPercent: 62,
    accessibilityScore: 60,
    weatherSummary: { tempC: 22, condition: 'Showers & Low Clouds', rainfallMm: 52, windKmh: 19, humidity: 89 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-agartala',
    name: 'Agartala',
    state: 'Tripura',
    lat: 23.8315,
    lng: 91.2868,
    elevationMeters: 15,
    terrainType: 'Low Plains & River Basins',
    connectivityPercent: 90,
    accessibilityScore: 86,
    weatherSummary: { tempC: 30, condition: 'Partly Cloudy', rainfallMm: 14, windKmh: 13, humidity: 76 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-gangtok',
    name: 'Gangtok',
    state: 'Sikkim',
    lat: 27.3389,
    lng: 88.6065,
    elevationMeters: 1650,
    terrainType: 'Himalayan Ridge Corridor',
    connectivityPercent: 76,
    accessibilityScore: 68,
    weatherSummary: { tempC: 17, condition: 'Chilly Rain & Dense Fog', rainfallMm: 62, windKmh: 20, humidity: 91 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-silchar',
    name: 'Silchar',
    state: 'Assam',
    lat: 24.8333,
    lng: 92.7789,
    elevationMeters: 22,
    terrainType: 'Barak Floodplain & Wet Lowlands',
    connectivityPercent: 86,
    accessibilityScore: 81,
    weatherSummary: { tempC: 27, condition: 'Humid Rain Showers', rainfallMm: 42, windKmh: 12, humidity: 87 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-tezpur',
    name: 'Tezpur',
    state: 'Assam',
    lat: 26.6528,
    lng: 92.7926,
    elevationMeters: 48,
    terrainType: 'North Brahmaputra Riverfront',
    connectivityPercent: 89,
    accessibilityScore: 89,
    weatherSummary: { tempC: 27, condition: 'Passing Clouds', rainfallMm: 15, windKmh: 14, humidity: 77 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-bomdila',
    name: 'Bomdila',
    state: 'Arunachal Pradesh',
    lat: 27.2645,
    lng: 92.4231,
    elevationMeters: 2217,
    terrainType: 'High Ridge Transit Node',
    connectivityPercent: 46,
    accessibilityScore: 50,
    weatherSummary: { tempC: 12, condition: 'Dense Fog & Mountain Rain', rainfallMm: 74, windKmh: 24, humidity: 90 },
    hasDepot: true,
    hasMedicalCenter: true
  },
  {
    id: 'loc-sohra',
    name: 'Cherrapunji (Sohra)',
    state: 'Meghalaya',
    lat: 25.2702,
    lng: 91.7323,
    elevationMeters: 1484,
    terrainType: 'High Rain Escarpment & Gorges',
    connectivityPercent: 65,
    accessibilityScore: 63,
    weatherSummary: { tempC: 18, condition: 'Torrential Downpour', rainfallMm: 140, windKmh: 31, humidity: 98 },
    hasDepot: false,
    hasMedicalCenter: true
  }
];

export const INITIAL_ROAD_SEGMENTS: RoadSegment[] = [
  {
    id: 'road-nh27-guw-shillong',
    name: 'NH-6 / GS Road Expressway',
    highwayCode: 'NH-06',
    fromLocationId: 'loc-guwahati',
    toLocationId: 'loc-shillong',
    distanceKm: 100,
    normalTravelMinutes: 150,
    status: 'OPEN',
    riskLevel: 'MODERATE',
    landslideRiskPercent: 24,
    slopeDegrees: 28,
    soilMoistureLevel: 'Medium',
    bridgeCondition: 'Optimal',
    connectivityPercent: 88,
    averageSpeedKmh: 45,
    lastUpdated: '10 mins ago',
    coordinates: [[26.1445, 91.7362], [25.90, 91.80], [25.75, 91.85], [25.5788, 91.8933]]
  },
  {
    id: 'road-nh13-tez-bomdila',
    name: 'Trans-Arunachal Highway (Bhalukpong-Bomdila)',
    highwayCode: 'NH-13',
    fromLocationId: 'loc-tezpur',
    toLocationId: 'loc-bomdila',
    distanceKm: 155,
    normalTravelMinutes: 310,
    status: 'DEGRADED',
    riskLevel: 'HIGH',
    landslideRiskPercent: 68,
    slopeDegrees: 58,
    soilMoistureLevel: 'High',
    bridgeCondition: 'Caution',
    connectivityPercent: 42,
    averageSpeedKmh: 30,
    lastUpdated: '25 mins ago',
    coordinates: [[26.6528, 92.7926], [26.98, 92.65], [27.15, 92.52], [27.2645, 92.4231]]
  },
  {
    id: 'road-bomdila-tawang-sela',
    name: 'Sela Pass Strategic Mountain Road',
    highwayCode: 'NH-13 Extended',
    fromLocationId: 'loc-bomdila',
    toLocationId: 'loc-tawang',
    distanceKm: 175,
    normalTravelMinutes: 380,
    status: 'HIGH RISK',
    riskLevel: 'CRITICAL',
    landslideRiskPercent: 84,
    slopeDegrees: 68,
    soilMoistureLevel: 'Saturated',
    bridgeCondition: 'Caution',
    connectivityPercent: 32,
    averageSpeedKmh: 26,
    lastUpdated: '5 mins ago',
    coordinates: [[27.2645, 92.4231], [27.50, 92.10], [27.51, 91.98], [27.5861, 91.8594]]
  },
  {
    id: 'road-nh29-dimapur-kohima',
    name: 'Kohima-Dimapur 4-Lane Ghat Road',
    highwayCode: 'NH-29',
    fromLocationId: 'loc-dimapur',
    toLocationId: 'loc-kohima',
    distanceKm: 74,
    normalTravelMinutes: 130,
    status: 'OPEN',
    riskLevel: 'MODERATE',
    landslideRiskPercent: 42,
    slopeDegrees: 36,
    soilMoistureLevel: 'Medium',
    bridgeCondition: 'Optimal',
    connectivityPercent: 82,
    averageSpeedKmh: 38,
    lastUpdated: '15 mins ago',
    coordinates: [[25.9090, 93.7266], [25.81, 93.88], [25.72, 94.02], [25.6751, 94.1086]]
  },
  {
    id: 'road-nh2-kohima-imphal',
    name: 'Kohima-Mao-Senapati-Imphal Lifeline',
    highwayCode: 'NH-02',
    fromLocationId: 'loc-kohima',
    toLocationId: 'loc-imphal',
    distanceKm: 138,
    normalTravelMinutes: 240,
    status: 'OPEN',
    riskLevel: 'MODERATE',
    landslideRiskPercent: 35,
    slopeDegrees: 32,
    soilMoistureLevel: 'Medium',
    bridgeCondition: 'Optimal',
    connectivityPercent: 70,
    averageSpeedKmh: 35,
    lastUpdated: '30 mins ago',
    coordinates: [[25.6751, 94.1086], [25.50, 94.12], [25.10, 94.05], [24.8170, 93.9368]]
  },
  {
    id: 'road-nh306-silchar-aizawl',
    name: 'Silchar-Vairengte-Aizawl Ghat Highway',
    highwayCode: 'NH-306',
    fromLocationId: 'loc-silchar',
    toLocationId: 'loc-aizawl',
    distanceKm: 168,
    normalTravelMinutes: 340,
    status: 'DEGRADED',
    riskLevel: 'HIGH',
    landslideRiskPercent: 71,
    slopeDegrees: 54,
    soilMoistureLevel: 'High',
    bridgeCondition: 'Caution',
    connectivityPercent: 55,
    averageSpeedKmh: 28,
    lastUpdated: '12 mins ago',
    coordinates: [[24.8333, 92.7789], [24.50, 92.75], [24.08, 92.73], [23.7271, 92.7176]]
  },
  {
    id: 'road-nh6-shillong-silchar',
    name: 'Sonapur Tunnel & Jaintia Hills Corridor',
    highwayCode: 'NH-06 Jaintia',
    fromLocationId: 'loc-shillong',
    toLocationId: 'loc-silchar',
    distanceKm: 215,
    normalTravelMinutes: 420,
    status: 'HIGH RISK',
    riskLevel: 'CRITICAL',
    landslideRiskPercent: 88,
    slopeDegrees: 62,
    soilMoistureLevel: 'Saturated',
    bridgeCondition: 'Damaged',
    connectivityPercent: 48,
    averageSpeedKmh: 25,
    lastUpdated: '8 mins ago',
    coordinates: [[25.5788, 91.8933], [25.40, 92.20], [25.05, 92.50], [24.8333, 92.7789]]
  },
  {
    id: 'road-nh10-gangtok-corridor',
    name: 'Teesta River Basin Mountain Highway',
    highwayCode: 'NH-10',
    fromLocationId: 'loc-guwahati',
    toLocationId: 'loc-gangtok',
    distanceKm: 530,
    normalTravelMinutes: 720,
    status: 'DEGRADED',
    riskLevel: 'HIGH',
    landslideRiskPercent: 65,
    slopeDegrees: 55,
    soilMoistureLevel: 'High',
    bridgeCondition: 'Caution',
    connectivityPercent: 68,
    averageSpeedKmh: 42,
    lastUpdated: '20 mins ago',
    coordinates: [[26.1445, 91.7362], [26.50, 90.50], [26.70, 89.20], [27.3389, 88.6065]]
  },
  {
    id: 'road-guw-tezpur-itanagar',
    name: 'Assam Valley Northern Corridor to Arunachal',
    highwayCode: 'NH-15/415',
    fromLocationId: 'loc-guwahati',
    toLocationId: 'loc-itanagar',
    distanceKm: 320,
    normalTravelMinutes: 440,
    status: 'OPEN',
    riskLevel: 'LOW',
    landslideRiskPercent: 18,
    slopeDegrees: 18,
    soilMoistureLevel: 'Low',
    bridgeCondition: 'Optimal',
    connectivityPercent: 86,
    averageSpeedKmh: 48,
    lastUpdated: '18 mins ago',
    coordinates: [[26.1445, 91.7362], [26.65, 92.80], [26.90, 93.30], [27.0844, 93.6053]]
  },
  {
    id: 'road-silchar-agartala',
    name: 'Tripura Lifeline Highway',
    highwayCode: 'NH-08',
    fromLocationId: 'loc-silchar',
    toLocationId: 'loc-agartala',
    distanceKm: 270,
    normalTravelMinutes: 480,
    status: 'OPEN',
    riskLevel: 'MODERATE',
    landslideRiskPercent: 32,
    slopeDegrees: 24,
    soilMoistureLevel: 'Medium',
    bridgeCondition: 'Optimal',
    connectivityPercent: 82,
    averageSpeedKmh: 35,
    lastUpdated: '40 mins ago',
    coordinates: [[24.8333, 92.7789], [24.40, 92.20], [23.90, 91.50], [23.8315, 91.2868]]
  }
];

export const INITIAL_VEHICLES: Vehicle[] = [
  {
    id: 'veh-101',
    registrationNumber: 'AS-01-GB-4819',
    type: 'Truck',
    capacityKg: 12000,
    driverName: 'Rajesh Das',
    driverPhone: '+91 94350-11201',
    currentLocationId: 'loc-guwahati',
    currentLocationName: 'Guwahati Transit Hub',
    lat: 26.155,
    lng: 91.745,
    fuelPercent: 86,
    status: 'Available',
    terrainClearanceMm: 280,
    fourWheelDrive: false
  },
  {
    id: 'veh-102',
    registrationNumber: 'AR-04-A-7731',
    type: 'Mini Truck',
    capacityKg: 3200,
    driverName: 'Tenzing Norbu',
    driverPhone: '+91 94022-88192',
    currentLocationId: 'loc-bomdila',
    currentLocationName: 'Bomdila Forward Staging',
    lat: 27.260,
    lng: 92.420,
    fuelPercent: 74,
    status: 'On Route',
    currentAssignment: {
      requestId: 'req-401',
      taskTitle: 'Medicine Supply to Dirang Sub-Center',
      destinationName: 'Tawang Base',
      eta: '4h 15m'
    },
    terrainClearanceMm: 240,
    fourWheelDrive: true
  },
  {
    id: 'veh-103',
    registrationNumber: 'MZ-01-M-9022',
    type: 'Van',
    capacityKg: 1800,
    driverName: 'Lalhmingliana Ralte',
    driverPhone: '+91 98623-44109',
    currentLocationId: 'loc-aizawl',
    currentLocationName: 'Aizawl Civil Hospital Depot',
    lat: 23.730,
    lng: 92.720,
    fuelPercent: 92,
    status: 'Available',
    terrainClearanceMm: 210,
    fourWheelDrive: false
  },
  {
    id: 'veh-104',
    registrationNumber: 'NL-07-H-3382',
    type: 'Truck',
    capacityKg: 16000,
    driverName: 'Bikram Thapa',
    driverPhone: '+91 94360-55912',
    currentLocationId: 'loc-dimapur',
    currentLocationName: 'Dimapur Inter-State Yard',
    lat: 25.912,
    lng: 93.730,
    fuelPercent: 44,
    status: 'Maintenance',
    terrainClearanceMm: 290,
    fourWheelDrive: false
  },
  {
    id: 'veh-105',
    registrationNumber: 'ML-05-D-1194',
    type: 'SUV',
    capacityKg: 950,
    driverName: 'Somnath Sharma',
    driverPhone: '+91 98560-77218',
    currentLocationId: 'loc-shillong',
    currentLocationName: 'Shillong Disaster Response HQ',
    lat: 25.582,
    lng: 91.898,
    fuelPercent: 95,
    status: 'Available',
    terrainClearanceMm: 255,
    fourWheelDrive: true
  },
  {
    id: 'veh-106',
    registrationNumber: 'MN-01-ALS-004',
    type: 'Ambulance',
    capacityKg: 1200,
    driverName: 'Ningombam Singh',
    driverPhone: '+91 97740-66441',
    currentLocationId: 'loc-imphal',
    currentLocationName: 'Imphal RIMS Emergency Wing',
    lat: 24.819,
    lng: 93.940,
    fuelPercent: 88,
    status: 'Emergency',
    currentAssignment: {
      requestId: 'em-903',
      taskTitle: 'Critical Trauma Evacuation',
      destinationName: 'Kohima District Hospital',
      eta: '2h 10m'
    },
    terrainClearanceMm: 230,
    fourWheelDrive: true
  },
  {
    id: 'veh-107',
    registrationNumber: 'SK-01-PB-5509',
    type: 'Bus',
    capacityKg: 6500,
    driverName: 'Karma Bhutia',
    driverPhone: '+91 98320-19402',
    currentLocationId: 'loc-gangtok',
    currentLocationName: 'Gangtok SNT Central Terminus',
    lat: 27.342,
    lng: 88.610,
    fuelPercent: 68,
    status: 'On Route',
    currentAssignment: {
      requestId: 'pass-801',
      taskTitle: 'Inter-Hill Passenger Transit 04',
      destinationName: 'Siliguri Gateway',
      eta: '5h 30m'
    },
    terrainClearanceMm: 220,
    fourWheelDrive: false
  },
  {
    id: 'veh-108',
    registrationNumber: 'TR-01-T-8820',
    type: 'Mini Truck',
    capacityKg: 3500,
    driverName: 'Debabrata Barman',
    driverPhone: '+91 94361-22998',
    currentLocationId: 'loc-agartala',
    currentLocationName: 'Agartala Integrated Checkpost',
    lat: 23.835,
    lng: 91.290,
    fuelPercent: 80,
    status: 'Available',
    terrainClearanceMm: 235,
    fourWheelDrive: true
  }
];

export const INITIAL_RISK_ZONES: RiskZone[] = [
  {
    id: 'risk-sela-pass',
    name: 'Sela Pass High Alpine Corridor',
    locationName: 'Tawang - West Kameng Border',
    state: 'Arunachal Pradesh',
    lat: 27.502,
    lng: 92.105,
    riskType: 'Landslide',
    riskScore: 86,
    riskLevel: 'CRITICAL',
    contributingFactors: [
      'Heavy mountain precipitation (86 mm in 12h)',
      'Slope gradient exceeds 68 degrees',
      'Recent active mud creep at Km 42',
      'Freezing snowmelt saturation'
    ],
    rainfallMm: 86,
    slopeDegrees: 68,
    soilMoisture: 'Saturated',
    previousIncidentsCount: 6,
    lastUpdated: '12 mins ago',
    recommendedAction: 'Mandatory 4x4 only with convoy escort; Heavy trucks prohibited until clearing.',
    alternativeRouteName: 'Bhalukpong-Dirang Lowline bypass via Kalaktang'
  },
  {
    id: 'risk-sonapur-tunnel',
    name: 'Sonapur Tunnel & Jaintia Slopes',
    locationName: 'Sonapur, East Jaintia Hills',
    state: 'Meghalaya',
    lat: 25.120,
    lng: 92.360,
    riskType: 'Flash Flood',
    riskScore: 82,
    riskLevel: 'CRITICAL',
    contributingFactors: [
      'Torrential rainfall (140 mm recorded)',
      'Lubha River water level near danger mark',
      'Mud deposit on tunnel northern portal',
      'Bridge scour warning active'
    ],
    rainfallMm: 140,
    slopeDegrees: 58,
    soilMoisture: 'Saturated',
    previousIncidentsCount: 8,
    lastUpdated: '8 mins ago',
    recommendedAction: 'Halt all multi-axle freight; divert via Umkiang emergency bypass with speed cap 20 km/h.',
    alternativeRouteName: 'Shillong-Mawryngkneng-Dawki Southern Axis'
  },
  {
    id: 'risk-jatinga-ghat',
    name: 'Dima Hasao Jatinga Valley Ghat',
    locationName: 'Haflong - Jatinga',
    state: 'Assam',
    lat: 25.180,
    lng: 93.030,
    riskType: 'Landslide',
    riskScore: 74,
    riskLevel: 'HIGH',
    contributingFactors: [
      'Continuous monsoon rain (65 mm)',
      'Shale soil slippage vulnerability',
      'Under-construction slope stabilization'
    ],
    rainfallMm: 65,
    slopeDegrees: 52,
    soilMoisture: 'High',
    previousIncidentsCount: 4,
    lastUpdated: '25 mins ago',
    recommendedAction: 'Daylight transit only. Heavy radar monitoring at Km 18.',
    alternativeRouteName: 'Lanka-Lumding Railway Link / Flatland detour'
  },
  {
    id: 'risk-teesta-basin',
    name: 'Teesta River 29th Mile Segment',
    locationName: 'NH-10 Corridor',
    state: 'Sikkim',
    lat: 27.050,
    lng: 88.460,
    riskType: 'Road Collapse',
    riskScore: 79,
    riskLevel: 'HIGH',
    contributingFactors: [
      'Teesta high discharge rate',
      'Slope undercut along 1.2 km stretch',
      'Single lane alternating movement'
    ],
    rainfallMm: 72,
    slopeDegrees: 60,
    soilMoisture: 'High',
    previousIncidentsCount: 5,
    lastUpdated: '18 mins ago',
    recommendedAction: 'Light passenger vehicles allowed under pilot. Multi-axle trucks restricted.',
    alternativeRouteName: 'Lava-Algarah-Reshi alternative route'
  },
  {
    id: 'risk-pallel-moreh',
    name: 'Pallel - Lokchao Winding Section',
    locationName: 'Tengnoupal District',
    state: 'Manipur',
    lat: 24.450,
    lng: 94.020,
    riskType: 'Severe Weather',
    riskScore: 54,
    riskLevel: 'MODERATE',
    contributingFactors: [
      'Dense hill fog reducing visibility to <15m',
      'Slippery laterite clay surface'
    ],
    rainfallMm: 38,
    slopeDegrees: 40,
    soilMoisture: 'Medium',
    previousIncidentsCount: 2,
    lastUpdated: '45 mins ago',
    recommendedAction: 'Maintain fog lamps and speed under 30 km/h.',
    alternativeRouteName: 'Kakching interior link'
  }
];

export const INITIAL_EMERGENCIES: EmergencyRequest[] = [
  {
    id: 'em-901',
    title: 'Emergency Pediatric Antibiotics & Antivenom Dispatch',
    emergencyType: 'Medical',
    locationName: 'Tawang Sub-District Hospital',
    state: 'Arunachal Pradesh',
    lat: 27.5861,
    lng: 91.8594,
    requiredResource: 'Medicine',
    priority: 'Critical',
    status: 'Dispatched',
    createdAt: '2026-09-10T17:30:00Z',
    assignedVehicleId: 'veh-102',
    assignedVehicleName: 'Bolero 4x4 Mini Truck (AR-04-A-7731)',
    nearestWarehouse: 'Tezpur Medical Depot Hub',
    blockedRouteAvoided: 'Direct NH-13 Km 42 Landslide Cutoff',
    recommendedRouteName: 'Kalaktang-Rupa High Clearance Bypass',
    eta: '3h 40m',
    contactPerson: 'Dr. L. Tsering, CMO',
    contactPhone: '+91 94360-19283'
  },
  {
    id: 'em-902',
    title: 'Flash Flood Drinking Water & Rations Airdrop Staging',
    emergencyType: 'Flood',
    locationName: 'Silchar Lowland Relief Camp',
    state: 'Assam',
    lat: 24.8333,
    lng: 92.7789,
    requiredResource: 'Water',
    priority: 'Urgent',
    status: 'On Route',
    createdAt: '2026-09-10T16:15:00Z',
    assignedVehicleId: 'veh-105',
    assignedVehicleName: 'Toyota Hilux 4WD (ML-05-D-1194)',
    nearestWarehouse: 'Shillong Central Warehouse',
    blockedRouteAvoided: 'Sonapur Tunnel Southern Choke',
    recommendedRouteName: 'Dawki Border Elevated Ridge Route',
    eta: '1h 50m',
    contactPerson: 'Anupam Roy, Field Relief Officer',
    contactPhone: '+91 98640-33219'
  },
  {
    id: 'em-903',
    title: 'Disaster Relief Fuel & High-Flow Oxygen Generators',
    emergencyType: 'Landslide',
    locationName: 'Aizawl South Cutoff Post',
    state: 'Mizoram',
    lat: 23.7271,
    lng: 92.7176,
    requiredResource: 'Rescue equipment',
    priority: 'Critical',
    status: 'Pending',
    createdAt: '2026-09-10T18:40:00Z',
    nearestWarehouse: 'Silchar Essential Storage Depot',
    blockedRouteAvoided: 'NH-306 Kolasib Sinking Point',
    recommendedRouteName: 'Bairabi Railhead Feeder Axis',
    eta: '4h 10m',
    contactPerson: 'Vanlalruata, State Disaster Authority',
    contactPhone: '+91 98620-88123'
  }
];

export const INITIAL_ALERTS: AlertNotification[] = [
  {
    id: 'alt-01',
    title: '⚠️ Landslide Risk Escalated: Sela Pass Corridor',
    message: 'Continuous heavy rainfall (86mm) triggered multiple active debris slips near Km 42. Non-4x4 vehicles restricted.',
    type: 'Landslide',
    severity: 'CRITICAL',
    locationName: 'Tawang Pass Corridor',
    state: 'Arunachal Pradesh',
    timestamp: '10 mins ago',
    isRead: false,
    actionRoute: '/risk-intelligence',
    relatedEntityId: 'risk-sela-pass'
  },
  {
    id: 'alt-02',
    title: '🌧️ Flash Flood & Tunnel Inflow: Sonapur NH-06',
    message: 'Lubha river surge near Sonapur tunnel entrance causing waterlogging. Diverting heavy freight via Dawki axis.',
    type: 'Weather',
    severity: 'CRITICAL',
    locationName: 'Sonapur Tunnel',
    state: 'Meghalaya',
    timestamp: '18 mins ago',
    isRead: false,
    actionRoute: '/route-planner',
    relatedEntityId: 'road-nh6-shillong-silchar'
  },
  {
    id: 'alt-03',
    title: '🚨 Emergency Dispatch Activated: Pediatric Medicines',
    message: 'Vehicle AR-04-A-7731 dispatched from Bomdila staging to Tawang Sub-District Hospital with cold-chain supplies.',
    type: 'Emergency',
    severity: 'HIGH',
    locationName: 'Bomdila - Tawang',
    state: 'Arunachal Pradesh',
    timestamp: '35 mins ago',
    isRead: false,
    actionRoute: '/emergency-logistics',
    relatedEntityId: 'em-901'
  },
  {
    id: 'alt-04',
    title: '📡 Low Connectivity Warning: Jaintia & Dima Hasao',
    message: 'Cell tower repeater failure between Jowai and Badarpur. Drivers instructed to cache offline map packets.',
    type: 'Connectivity',
    severity: 'MODERATE',
    locationName: 'NH-06 Ghat Sector',
    state: 'Meghalaya',
    timestamp: '1 hour ago',
    isRead: true,
    actionRoute: '/connectivity-intelligence'
  },
  {
    id: 'alt-05',
    title: '🚧 Road Restored to Single-Lane: NH-29 Chumukedima',
    message: 'Debris cleared after localized rockfall. Regulated alternating traffic operational under highway patrol.',
    type: 'Road Block',
    severity: 'MODERATE',
    locationName: 'Dimapur - Kohima Corridor',
    state: 'Nagaland',
    timestamp: '2 hours ago',
    isRead: true,
    actionRoute: '/risk-intelligence'
  }
];

export const INITIAL_INCIDENT_REPORTS: RoadIncidentReport[] = [
  {
    id: 'inc-301',
    locationName: 'Sela Pass Km 42',
    state: 'Arunachal Pradesh',
    issueType: 'Landslide',
    severity: 'CRITICAL',
    description: 'Sludge and boulders blocking 70% of road width following 4 hours of cloudburst.',
    reportedBy: 'Field Officer T. Dorjee (BRO Link)',
    reportedAt: '2026-09-10T18:15:00Z',
    status: 'Verified',
    roadSegmentId: 'road-bomdila-tawang-sela'
  },
  {
    id: 'inc-302',
    locationName: 'Sonapur Tunnel North Approach',
    state: 'Meghalaya',
    issueType: 'Flood',
    severity: 'HIGH',
    description: 'Mudflow and 40cm waterlogging inside tunnel approach road. Heavy axle vehicles unable to traverse.',
    reportedBy: 'Highway Patrol ML-05-P3',
    reportedAt: '2026-09-10T17:45:00Z',
    status: 'Verified',
    roadSegmentId: 'road-nh6-shillong-silchar'
  },
  {
    id: 'inc-303',
    locationName: 'Vairengte Ghat Km 19',
    state: 'Mizoram',
    issueType: 'Road damage',
    severity: 'MODERATE',
    description: 'Road shoulder sinking due to subterranean water leakage. Cones deployed.',
    reportedBy: 'Driver L. Ralte (AS-01 Logistics)',
    reportedAt: '2026-09-10T16:00:00Z',
    status: 'Under Investigation',
    roadSegmentId: 'road-nh306-silchar-aizawl'
  }
];

export const INITIAL_ACCESSIBILITY: AccessibilityBreakdown[] = [
  {
    locationId: 'loc-tawang',
    locationName: 'Tawang',
    state: 'Arunachal Pradesh',
    overallScore: 42,
    category: 'Critical',
    factors: {
      roadAccessibility: 38,
      publicTransportAvailability: 32,
      emergencyAccess: 35,
      connectivity: 38,
      weatherImpact: 25,
      terrainDifficulty: 20
    },
    isolationVulnerability: 'High Alpine Isolation — Dependent on single mountain pass via Sela',
    availableBusesDaily: 2,
    avgAmbulanceReachMinutes: 210,
    primaryLifelineRoute: 'Tezpur-Bhalukpong-Bomdila-Tawang (NH-13)'
  },
  {
    locationId: 'loc-aizawl',
    locationName: 'Aizawl',
    state: 'Mizoram',
    overallScore: 60,
    category: 'Moderate',
    factors: {
      roadAccessibility: 58,
      publicTransportAvailability: 62,
      emergencyAccess: 64,
      connectivity: 62,
      weatherImpact: 55,
      terrainDifficulty: 48
    },
    isolationVulnerability: 'Ridge Top Choke Points — Heavy reliance on NH-306 corridor from Assam',
    availableBusesDaily: 14,
    avgAmbulanceReachMinutes: 85,
    primaryLifelineRoute: 'Silchar-Vairengte-Aizawl (NH-306)'
  },
  {
    locationId: 'loc-kohima',
    locationName: 'Kohima',
    state: 'Nagaland',
    overallScore: 66,
    category: 'Good',
    factors: {
      roadAccessibility: 72,
      publicTransportAvailability: 70,
      emergencyAccess: 68,
      connectivity: 68,
      weatherImpact: 60,
      terrainDifficulty: 58
    },
    isolationVulnerability: 'Ghat Landslide Vulnerability along Dimapur Corridor',
    availableBusesDaily: 28,
    avgAmbulanceReachMinutes: 55,
    primaryLifelineRoute: 'Dimapur-Kohima 4-lane (NH-29)'
  },
  {
    locationId: 'loc-imphal',
    locationName: 'Imphal',
    state: 'Manipur',
    overallScore: 69,
    category: 'Good',
    factors: {
      roadAccessibility: 68,
      publicTransportAvailability: 65,
      emergencyAccess: 74,
      connectivity: 74,
      weatherImpact: 66,
      terrainDifficulty: 65
    },
    isolationVulnerability: 'Intermontane Valley with Fragile Mountain Arteries (NH-2 & NH-37)',
    availableBusesDaily: 22,
    avgAmbulanceReachMinutes: 45,
    primaryLifelineRoute: 'Kohima-Imphal (NH-02) and Jiribam-Imphal (NH-37)'
  },
  {
    locationId: 'loc-gangtok',
    locationName: 'Gangtok',
    state: 'Sikkim',
    overallScore: 68,
    category: 'Good',
    factors: {
      roadAccessibility: 65,
      publicTransportAvailability: 72,
      emergencyAccess: 70,
      connectivity: 76,
      weatherImpact: 52,
      terrainDifficulty: 45
    },
    isolationVulnerability: 'NH-10 Teesta River Cutoff during active monsoon cloudbursts',
    availableBusesDaily: 34,
    avgAmbulanceReachMinutes: 60,
    primaryLifelineRoute: 'Siliguri-Sevoke-Rangpo-Gangtok (NH-10)'
  },
  {
    locationId: 'loc-shillong',
    locationName: 'Shillong',
    state: 'Meghalaya',
    overallScore: 82,
    category: 'Good',
    factors: {
      roadAccessibility: 88,
      publicTransportAvailability: 85,
      emergencyAccess: 86,
      connectivity: 88,
      weatherImpact: 72,
      terrainDifficulty: 70
    },
    isolationVulnerability: 'Moderate — Robust 4-lane link to Guwahati; interior Khasi/Jaintia hills vulnerable',
    availableBusesDaily: 48,
    avgAmbulanceReachMinutes: 25,
    primaryLifelineRoute: 'Guwahati-Shillong 4-Lane Highway (NH-06)'
  },
  {
    locationId: 'loc-guwahati',
    locationName: 'Guwahati',
    state: 'Assam',
    overallScore: 94,
    category: 'Excellent',
    factors: {
      roadAccessibility: 96,
      publicTransportAvailability: 95,
      emergencyAccess: 95,
      connectivity: 96,
      weatherImpact: 88,
      terrainDifficulty: 92
    },
    isolationVulnerability: 'Lowest in Northeast — Multi-modal rail, air, national highway hub',
    availableBusesDaily: 140,
    avgAmbulanceReachMinutes: 12,
    primaryLifelineRoute: 'East-West Corridor / NH-27 Multi-Lane'
  }
];

// In-Memory Mutable State for the Server Session
class NERDataStore {
  locations: LocationItem[] = [...INITIAL_LOCATIONS];
  roadSegments: RoadSegment[] = [...INITIAL_ROAD_SEGMENTS];
  vehicles: Vehicle[] = [...INITIAL_VEHICLES];
  riskZones: RiskZone[] = [...INITIAL_RISK_ZONES];
  emergencies: EmergencyRequest[] = [...INITIAL_EMERGENCIES];
  alerts: AlertNotification[] = [...INITIAL_ALERTS];
  incidentReports: RoadIncidentReport[] = [...INITIAL_INCIDENT_REPORTS];
  accessibility: AccessibilityBreakdown[] = [...INITIAL_ACCESSIBILITY];
  demoSettings: DemoSettings = {
    demoModeActive: true,
    monsoonRainfallMultiplier: 1.0,
    simulateRoadBlockages: false,
    offlineSimulation: false
  };

  getDashboardStats() {
    const activeFreight = 1248 + Math.floor(Math.random() * 12);
    const passengerMovements = 623 + Math.floor(Math.random() * 8);
    const highRiskRoutes = this.roadSegments.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').length + 38;
    const criticalRoads = this.roadSegments.filter(r => r.status === 'HIGH RISK' || r.status === 'BLOCKED').length + 15;
    const landslideAlerts = this.alerts.filter(a => a.type === 'Landslide').length + 11;
    const lowConnectivityAreas = this.locations.filter(l => l.connectivityPercent < 65).length + 26;
    const availableVehicles = this.vehicles.filter(v => v.status === 'Available').length;
    const totalVehicles = this.vehicles.length;
    const emergencyCount = this.emergencies.filter(e => e.status !== 'Resolved').length;

    return {
      activeFreight,
      passengerMovements,
      highRiskRoutes,
      criticalRoads,
      landslideAlerts,
      lowConnectivityAreas,
      availableVehicles,
      totalVehicles,
      emergencyCount,
      timestamp: new Date().toISOString()
    };
  }

  assignVehicle(vehicleId: string, payload: {
    destinationName: string;
    taskTitle: string;
    requestId?: string;
    eta?: string;
  }) {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return null;

    vehicle.status = 'On Route';
    vehicle.currentAssignment = {
      requestId: payload.requestId || `task-${Date.now()}`,
      taskTitle: payload.taskTitle,
      destinationName: payload.destinationName,
      eta: payload.eta || '3h 30m'
    };

    // Also update any matching emergency request
    if (payload.requestId) {
      const emergency = this.emergencies.find(e => e.id === payload.requestId);
      if (emergency) {
        emergency.status = 'On Route';
        emergency.assignedVehicleId = vehicle.id;
        emergency.assignedVehicleName = `${vehicle.type} (${vehicle.registrationNumber})`;
      }
    }

    // Add alert
    const newAlert: AlertNotification = {
      id: `alt-${Date.now()}`,
      title: `🚚 Vehicle Assigned: ${vehicle.registrationNumber}`,
      message: `Assigned to: ${payload.taskTitle} heading for ${payload.destinationName}. Driver: ${vehicle.driverName}`,
      type: 'Delivery',
      severity: 'MODERATE',
      locationName: vehicle.currentLocationName,
      state: 'Assam',
      timestamp: 'Just now',
      isRead: false,
      actionRoute: '/fleet-management',
      relatedEntityId: vehicle.id
    };
    this.alerts.unshift(newAlert);

    return vehicle;
  }

  updateVehicleStatus(vehicleId: string, status: 'Available' | 'On Route' | 'Maintenance' | 'Emergency', fuelPercent?: number) {
    const vehicle = this.vehicles.find(v => v.id === vehicleId);
    if (!vehicle) return null;
    vehicle.status = status;
    if (fuelPercent !== undefined) {
      vehicle.fuelPercent = Math.max(0, Math.min(100, fuelPercent));
    }
    if (status === 'Available') {
      delete vehicle.currentAssignment;
    }
    return vehicle;
  }

  createEmergencyRequest(data: Omit<EmergencyRequest, 'id' | 'createdAt' | 'status' | 'eta'>) {
    // Intelligent dispatch: find nearest depot and suitable vehicle
    const targetLoc = this.locations.find(l => l.name.toLowerCase().includes(data.locationName.toLowerCase())) || this.locations[0];
    
    // Find available vehicle with 4WD if mountain or emergency
    const availableVehicle = this.vehicles.find(v => v.status === 'Available' && v.fourWheelDrive) || 
                            this.vehicles.find(v => v.status === 'Available') || 
                            this.vehicles[0];

    const newId = `em-${Date.now().toString().slice(-4)}`;
    const newEmergency: EmergencyRequest = {
      id: newId,
      ...data,
      status: 'Dispatched',
      createdAt: new Date().toISOString(),
      assignedVehicleId: availableVehicle?.id,
      assignedVehicleName: availableVehicle ? `${availableVehicle.type} (${availableVehicle.registrationNumber})` : 'Convoy Unit 01',
      eta: '2h 45m'
    };

    if (availableVehicle) {
      availableVehicle.status = 'Emergency';
      availableVehicle.currentAssignment = {
        requestId: newId,
        taskTitle: `EMERGENCY: ${data.title}`,
        destinationName: data.locationName,
        eta: '2h 45m'
      };
    }

    this.emergencies.unshift(newEmergency);

    // Create high-priority alert
    const newAlert: AlertNotification = {
      id: `alt-em-${Date.now()}`,
      title: `🚨 Emergency Response Triggered: ${data.emergencyType}`,
      message: `${data.title} at ${data.locationName}. Assigned ${newEmergency.assignedVehicleName}.`,
      type: 'Emergency',
      severity: 'CRITICAL',
      locationName: data.locationName,
      state: data.state,
      timestamp: 'Just now',
      isRead: false,
      actionRoute: '/emergency-logistics',
      relatedEntityId: newId
    };
    this.alerts.unshift(newAlert);

    return newEmergency;
  }

  reportRoadIncident(report: Omit<RoadIncidentReport, 'id' | 'reportedAt' | 'status'>) {
    const newIncident: RoadIncidentReport = {
      id: `inc-${Date.now().toString().slice(-4)}`,
      ...report,
      reportedAt: new Date().toISOString(),
      status: 'Verified'
    };

    this.incidentReports.unshift(newIncident);

    // Update corresponding road segment if matched
    const matchingRoad = this.roadSegments.find(r => 
      r.name.toLowerCase().includes(report.locationName.toLowerCase()) || 
      report.description.toLowerCase().includes(r.highwayCode.toLowerCase())
    );

    if (matchingRoad) {
      if (report.severity === 'CRITICAL') {
        matchingRoad.status = 'BLOCKED';
        matchingRoad.riskLevel = 'CRITICAL';
        matchingRoad.landslideRiskPercent = Math.max(matchingRoad.landslideRiskPercent, 92);
      } else if (report.severity === 'HIGH') {
        matchingRoad.status = 'HIGH RISK';
        matchingRoad.riskLevel = 'HIGH';
        matchingRoad.landslideRiskPercent = Math.max(matchingRoad.landslideRiskPercent, 78);
      }
      matchingRoad.lastUpdated = 'Just now';
    }

    // Add alert
    const newAlert: AlertNotification = {
      id: `alt-inc-${Date.now()}`,
      title: `🚧 ${report.issueType} Reported: ${report.locationName}`,
      message: `${report.description} Severity: ${report.severity}. Field report verified.`,
      type: report.issueType === 'Landslide' ? 'Landslide' : 'Road Block',
      severity: report.severity,
      locationName: report.locationName,
      state: report.state,
      timestamp: 'Just now',
      isRead: false,
      actionRoute: '/risk-intelligence',
      relatedEntityId: newIncident.id
    };
    this.alerts.unshift(newAlert);

    return { incident: newIncident, updatedRoad: matchingRoad };
  }

  markAlertRead(id: string) {
    const alert = this.alerts.find(a => a.id === id);
    if (alert) alert.isRead = true;
    return alert;
  }

  markAllAlertsRead() {
    this.alerts.forEach(a => a.isRead = true);
    return { success: true };
  }

  updateDemoSettings(settings: Partial<DemoSettings>) {
    this.demoSettings = { ...this.demoSettings, ...settings };
    
    // If monsoon multiplier updated, scale road risks dynamically
    if (settings.monsoonRainfallMultiplier !== undefined) {
      const mult = settings.monsoonRainfallMultiplier;
      this.roadSegments.forEach(road => {
        if (road.slopeDegrees > 45) {
          road.landslideRiskPercent = Math.min(99, Math.round(road.landslideRiskPercent * mult));
          if (road.landslideRiskPercent > 80) {
            road.riskLevel = 'CRITICAL';
            road.status = 'HIGH RISK';
          }
        }
      });
      this.riskZones.forEach(rz => {
        rz.rainfallMm = Math.round(rz.rainfallMm * mult);
        rz.riskScore = Math.min(99, Math.round(rz.riskScore * mult));
        if (rz.riskScore > 80) rz.riskLevel = 'CRITICAL';
      });
    }

    if (settings.simulatedBlockedRoadId) {
      const target = this.roadSegments.find(r => r.id === settings.simulatedBlockedRoadId);
      if (target) {
        target.status = 'BLOCKED';
        target.riskLevel = 'CRITICAL';
        target.landslideRiskPercent = 98;
      }
    }

    return this.demoSettings;
  }
}

export const db = new NERDataStore();
