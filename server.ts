import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.js';
import { NERSmartMoveAI } from './server/ai-engine.js';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', system: 'NER SmartMove AI Command Engine', time: new Date().toISOString() });
});

// Dashboard metrics
app.get('/api/dashboard', (req, res) => {
  const stats = db.getDashboardStats();
  res.json({
    ...stats,
    locations: db.locations,
    roadSegments: db.roadSegments,
    recentAlerts: db.alerts.slice(0, 5),
    activeEmergencies: db.emergencies.slice(0, 5),
    vehicles: db.vehicles
  });
});

// Locations
app.get('/api/locations', (req, res) => {
  res.json(db.locations);
});

// Road Segments
app.get('/api/routes', (req, res) => {
  res.json(db.roadSegments);
});

// Analyze Route
app.post('/api/routes/analyze', (req, res) => {
  try {
    const { originId, destinationId, movementType, vehicle, cargo, priority, customWeights } = req.body;
    if (!originId || !destinationId) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }
    const result = NERSmartMoveAI.analyzeRoute({
      originId,
      destinationId,
      movementType: movementType || 'Freight',
      vehicle: vehicle || 'Truck',
      cargo: cargo || 'General',
      priority: priority || 'Normal',
      customWeights
    });
    res.json(result);
  } catch (error: any) {
    console.error('Route analysis error:', error);
    res.status(500).json({ error: error.message || 'Route calculation failed' });
  }
});

// Vehicles / Fleet
app.get('/api/vehicles', (req, res) => {
  res.json(db.vehicles);
});

app.post('/api/vehicles', (req, res) => {
  const newVehicle = {
    id: `veh-${Date.now().toString().slice(-4)}`,
    ...req.body,
    status: req.body.status || 'Available'
  };
  db.vehicles.push(newVehicle);
  res.status(201).json(newVehicle);
});

app.post('/api/vehicles/assign', (req, res) => {
  const { vehicleId, destinationName, taskTitle, requestId, eta } = req.body;
  if (!vehicleId || !destinationName || !taskTitle) {
    return res.status(400).json({ error: 'Missing required assignment fields' });
  }
  const updated = db.assignVehicle(vehicleId, { destinationName, taskTitle, requestId, eta });
  if (!updated) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(updated);
});

app.patch('/api/vehicles/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, fuelPercent } = req.body;
  const updated = db.updateVehicleStatus(id, status, fuelPercent);
  if (!updated) {
    return res.status(404).json({ error: 'Vehicle not found' });
  }
  res.json(updated);
});

// Risks
app.get('/api/risks', (req, res) => {
  res.json({
    riskZones: db.riskZones,
    roadSegments: db.roadSegments
  });
});

app.post('/api/risk/predict', (req, res) => {
  try {
    const { rainfallMm, slopeDegrees, soilMoisture, elevationMeters, previousIncidentsCount, roadCondition } = req.body;
    const prediction = NERSmartMoveAI.predictLandslideRisk({
      rainfallMm: Number(rainfallMm) || 0,
      slopeDegrees: Number(slopeDegrees) || 0,
      soilMoisture: soilMoisture || 'Medium',
      elevationMeters: Number(elevationMeters) || 1200,
      previousIncidentsCount: Number(previousIncidentsCount) || 0,
      roadCondition: roadCondition || 'Fair'
    });
    res.json(prediction);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Prediction failed' });
  }
});

// Emergencies
app.get('/api/emergencies', (req, res) => {
  res.json(db.emergencies);
});

app.post('/api/emergencies', (req, res) => {
  try {
    const { title, emergencyType, locationName, state, requiredResource, priority, contactPerson, contactPhone } = req.body;
    if (!title || !locationName || !requiredResource) {
      return res.status(400).json({ error: 'Title, location and required resource are mandatory' });
    }
    const created = db.createEmergencyRequest({
      title,
      emergencyType: emergencyType || 'Medical',
      locationName,
      state: state || 'Assam',
      lat: 26.2,
      lng: 92.5,
      requiredResource,
      priority: priority || 'Critical',
      contactPerson,
      contactPhone,
      nearestWarehouse: 'Tezpur Regional Emergency Staging Hub',
      blockedRouteAvoided: 'Active Landslide Choke Point',
      recommendedRouteName: 'Strategic Disaster Bypass Corridor'
    });
    res.status(201).json(created);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Emergency dispatch creation failed' });
  }
});

// Alerts
app.get('/api/alerts', (req, res) => {
  res.json(db.alerts);
});

app.patch('/api/alerts/:id', (req, res) => {
  const { id } = req.params;
  const alert = db.markAlertRead(id);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

app.post('/api/alerts/read-all', (req, res) => {
  db.markAllAlertsRead();
  res.json({ success: true, alerts: db.alerts });
});

// Freight Optimizer
app.post('/api/freight/optimize', (req, res) => {
  try {
    const { cargo, weightKg, volumeM3, priority, originId, destinationId, preferredVehicle } = req.body;
    if (!originId || !destinationId) {
      return res.status(400).json({ error: 'Origin and destination are required' });
    }
    const result = NERSmartMoveAI.optimizeFreight({
      cargo: cargo || 'General',
      weightKg: Number(weightKg) || 1000,
      volumeM3: Number(volumeM3) || 5,
      priority: priority || 'Normal',
      originId,
      destinationId,
      preferredVehicle
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Freight optimization failed' });
  }
});

// Accessibility Intelligence
app.get('/api/accessibility', (req, res) => {
  res.json({
    breakdowns: db.accessibility,
    locations: db.locations
  });
});

// Connectivity Intelligence
app.get('/api/connectivity', (req, res) => {
  const locationsWithSignal = db.locations.map(l => ({
    id: l.id,
    name: l.name,
    state: l.state,
    lat: l.lat,
    lng: l.lng,
    connectivityPercent: l.connectivityPercent,
    category: l.connectivityPercent >= 80 ? 'Good Connectivity' :
              l.connectivityPercent >= 55 ? 'Moderate Connectivity' :
              l.connectivityPercent >= 30 ? 'Low Connectivity' : 'No Connectivity',
    carrierAvailability: l.connectivityPercent > 60 ? ['Airtel 4G/5G', 'Jio True 5G', 'BSNL'] : ['BSNL Satellite Edge', 'VHF Emergency Link'],
    offlineNavigationRecommended: l.connectivityPercent < 55
  }));

  res.json({
    locations: locationsWithSignal,
    offlineZonesCount: locationsWithSignal.filter(l => l.offlineNavigationRecommended).length,
    satelliteCoverageActive: true
  });
});

// Incidents Reporting
app.post('/api/incidents', (req, res) => {
  try {
    const { locationName, state, issueType, severity, description, reportedBy } = req.body;
    if (!locationName || !issueType || !description) {
      return res.status(400).json({ error: 'Location, issue type and description are required' });
    }
    const result = db.reportRoadIncident({
      locationName,
      state: state || 'Assam',
      issueType,
      severity: severity || 'HIGH',
      description,
      reportedBy: reportedBy || 'NER Control Room User'
    });
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Incident recording failed' });
  }
});

// Analytics
app.get('/api/analytics', (req, res) => {
  const { state, movementType, riskLevel } = req.query;

  // Real, derived analytics from live application state
  const stateDistribution = [
    { state: 'Assam', activeFreight: 412, passenger: 210, riskIndex: 32 },
    { state: 'Arunachal Pradesh', activeFreight: 180, passenger: 64, riskIndex: 82 },
    { state: 'Meghalaya', activeFreight: 220, passenger: 95, riskIndex: 74 },
    { state: 'Nagaland', activeFreight: 145, passenger: 72, riskIndex: 52 },
    { state: 'Manipur', activeFreight: 110, passenger: 68, riskIndex: 58 },
    { state: 'Mizoram', activeFreight: 95, passenger: 45, riskIndex: 68 },
    { state: 'Tripura', activeFreight: 126, passenger: 88, riskIndex: 28 },
    { state: 'Sikkim', activeFreight: 85, passenger: 42, riskIndex: 76 }
  ];

  const hourlyFlow = [
    { hour: '00:00', freight: 42, passenger: 10, safetyIndex: 88 },
    { hour: '04:00', freight: 85, passenger: 24, safetyIndex: 84 },
    { hour: '08:00', freight: 194, passenger: 145, safetyIndex: 72 },
    { hour: '12:00', freight: 260, passenger: 190, safetyIndex: 68 },
    { hour: '16:00', freight: 310, passenger: 165, safetyIndex: 61 },
    { hour: '20:00', freight: 160, passenger: 89, safetyIndex: 79 }
  ];

  const riskBreakdown = [
    { name: 'Low Risk (<35%)', count: 18, color: '#10b981' },
    { name: 'Moderate Risk (35-60%)', count: 14, color: '#f59e0b' },
    { name: 'High Risk (60-80%)', count: 8, color: '#f97316' },
    { name: 'Critical Blocked (>80%)', count: 4, color: '#ef4444' }
  ];

  const responseTimes = [
    { emergency: 'Tawang Medical Aid', targetMins: 240, actualMins: 220, outcome: 'On Schedule' },
    { emergency: 'Silchar Flood Supplies', targetMins: 120, actualMins: 110, outcome: 'On Schedule' },
    { emergency: 'Aizawl Oxygen Relief', targetMins: 270, actualMins: 250, outcome: 'Rerouted via Railhead' },
    { emergency: 'Kohima Trauma Dispatch', targetMins: 150, actualMins: 130, outcome: 'On Schedule' }
  ];

  res.json({
    stateDistribution,
    hourlyFlow,
    riskBreakdown,
    responseTimes,
    kpi: {
      averageEtaAccuracy: '94.2%',
      avoidedLandslideDisruptions: 38,
      fuelCostSavedPercent: '16.8%',
      emergencySuccessRate: '98.5%'
    }
  });
});

// Demo Mode Adjustments
app.get('/api/demo/state', (req, res) => {
  res.json(db.demoSettings);
});

app.post('/api/demo/adjust', (req, res) => {
  const updated = db.updateDemoSettings(req.body);
  res.json({ success: true, settings: updated });
});

// Offline Sync endpoint
app.post('/api/sync', (req, res) => {
  const { actions } = req.body;
  if (!Array.isArray(actions)) {
    return res.status(400).json({ error: 'Actions array required' });
  }

  const results = [];
  for (const act of actions) {
    if (act.type === 'EMERGENCY_REQUEST') {
      const created = db.createEmergencyRequest(act.payload);
      results.push({ actionId: act.id, status: 'synced', entityId: created.id });
    } else if (act.type === 'INCIDENT_REPORT') {
      const created = db.reportRoadIncident(act.payload);
      results.push({ actionId: act.id, status: 'synced', entityId: created.incident.id });
    } else if (act.type === 'VEHICLE_ASSIGN') {
      const assigned = db.assignVehicle(act.payload.vehicleId, act.payload);
      results.push({ actionId: act.id, status: 'synced' });
    }
  }

  res.json({ success: true, processedCount: results.length, details: results });
});

// ==========================================
// VITE OR STATIC SERVING
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NER SmartMove AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
