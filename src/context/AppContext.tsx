import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  LocationItem, 
  RoadSegment, 
  Vehicle, 
  RiskZone, 
  EmergencyRequest, 
  AlertNotification, 
  RoadIncidentReport, 
  UserRole,
  DemoSettings,
  RouteAnalysisResult,
  VehicleType
} from '../types.js';

interface OfflineQueueItem {
  id: string;
  type: 'EMERGENCY_REQUEST' | 'INCIDENT_REPORT' | 'VEHICLE_ASSIGN';
  payload: any;
  timestamp: string;
}

interface AppContextType {
  locations: LocationItem[];
  roadSegments: RoadSegment[];
  vehicles: Vehicle[];
  riskZones: RiskZone[];
  emergencies: EmergencyRequest[];
  alerts: AlertNotification[];
  incidentReports: RoadIncidentReport[];
  demoSettings: DemoSettings;
  userRole: UserRole;
  isOffline: boolean;
  offlineQueue: OfflineQueueItem[];
  searchQuery: string;
  selectedLocation: LocationItem | null;
  activeRouteResult: RouteAnalysisResult | null;
  isLoading: boolean;
  isReportingModalOpen: boolean;
  setUserRole: (role: UserRole) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLocation: (loc: LocationItem | null) => void;
  setActiveRouteResult: (result: RouteAnalysisResult | null) => void;
  setIsReportingModalOpen: (open: boolean) => void;
  toggleOfflineMode: () => void;
  fetchDashboardData: () => Promise<void>;
  assignVehicle: (vehicleId: string, payload: { destinationName: string; taskTitle: string; requestId?: string; eta?: string }) => Promise<boolean>;
  updateVehicleStatus: (vehicleId: string, status: Vehicle['status'], fuelPercent?: number) => Promise<boolean>;
  createEmergency: (data: any) => Promise<EmergencyRequest | null>;
  reportIncident: (data: any) => Promise<boolean>;
  markAlertRead: (id: string) => Promise<void>;
  markAllAlertsRead: () => Promise<void>;
  updateDemoSettings: (settings: Partial<DemoSettings>) => Promise<void>;
  syncOfflineQueue: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'ner_smartmove_cache_v1';
const OFFLINE_QUEUE_KEY = 'ner_smartmove_offline_queue_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [roadSegments, setRoadSegments] = useState<RoadSegment[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [riskZones, setRiskZones] = useState<RiskZone[]>([]);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>([]);
  const [alerts, setAlerts] = useState<AlertNotification[]>([]);
  const [incidentReports, setIncidentReports] = useState<RoadIncidentReport[]>([]);
  const [demoSettings, setDemoSettings] = useState<DemoSettings>({
    demoModeActive: true,
    monsoonRainfallMultiplier: 1.0,
    simulateRoadBlockages: false,
    offlineSimulation: false
  });
  const [userRole, setUserRole] = useState<UserRole>('ADMIN');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);
  const [offlineQueue, setOfflineQueue] = useState<OfflineQueueItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<LocationItem | null>(null);
  const [activeRouteResult, setActiveRouteResult] = useState<RouteAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isReportingModalOpen, setIsReportingModalOpen] = useState<boolean>(false);

  // Load offline queue and cached state from localStorage on boot
  useEffect(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed.locations) setLocations(parsed.locations);
        if (parsed.roadSegments) setRoadSegments(parsed.roadSegments);
        if (parsed.vehicles) setVehicles(parsed.vehicles);
        if (parsed.riskZones) setRiskZones(parsed.riskZones);
        if (parsed.emergencies) setEmergencies(parsed.emergencies);
        if (parsed.alerts) setAlerts(parsed.alerts);
      }

      const cachedQueue = localStorage.getItem(OFFLINE_QUEUE_KEY);
      if (cachedQueue) {
        setOfflineQueue(JSON.parse(cachedQueue));
      }
    } catch (e) {
      console.warn('Could not read from local storage cache:', e);
    }

    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    fetchDashboardData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save to local storage for offline readiness
  useEffect(() => {
    if (locations.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
          locations,
          roadSegments,
          vehicles,
          riskZones,
          emergencies,
          alerts,
          lastCached: new Date().toISOString()
        }));
      } catch (e) {
        console.warn('Local storage write failed:', e);
      }
    }
  }, [locations, roadSegments, vehicles, riskZones, emergencies, alerts]);

  // Save offline queue
  useEffect(() => {
    try {
      localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
    } catch (e) {
      console.warn('Failed to save offline queue:', e);
    }
  }, [offlineQueue]);

  // Initial fetch from backend REST API
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [dashRes, risksRes, emergenciesRes, alertsRes] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/risks'),
        fetch('/api/emergencies'),
        fetch('/api/alerts')
      ]);

      if (dashRes.ok) {
        const dashData = await dashRes.json();
        setLocations(dashData.locations || []);
        setRoadSegments(dashData.roadSegments || []);
        setVehicles(dashData.vehicles || []);
        if (dashData.locations?.length && !selectedLocation) {
          setSelectedLocation(dashData.locations[0]);
        }
      }

      if (risksRes.ok) {
        const risksData = await risksRes.json();
        setRiskZones(risksData.riskZones || []);
      }

      if (emergenciesRes.ok) {
        const emData = await emergenciesRes.json();
        setEmergencies(emData || []);
      }

      if (alertsRes.ok) {
        const alData = await alertsRes.json();
        setAlerts(alData || []);
      }
    } catch (err) {
      console.warn('Backend fetch failed, relying on offline local cache:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleOfflineMode = () => {
    setIsOffline(prev => {
      const next = !prev;
      if (!next && offlineQueue.length > 0) {
        // Just returned online, trigger sync
        setTimeout(() => syncOfflineQueue(), 300);
      }
      return next;
    });
  };

  const syncOfflineQueue = async () => {
    if (offlineQueue.length === 0) return;
    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actions: offlineQueue })
      });
      if (res.ok) {
        setOfflineQueue([]);
        localStorage.removeItem(OFFLINE_QUEUE_KEY);
        await fetchDashboardData();
      }
    } catch (e) {
      console.error('Sync offline queue failed:', e);
    }
  };

  const assignVehicle = async (vehicleId: string, payload: { destinationName: string; taskTitle: string; requestId?: string; eta?: string }) => {
    // If offline, update locally and queue
    if (isOffline) {
      setVehicles(prev => prev.map(v => v.id === vehicleId ? {
        ...v,
        status: 'On Route',
        currentAssignment: {
          requestId: payload.requestId || `task-${Date.now()}`,
          taskTitle: payload.taskTitle,
          destinationName: payload.destinationName,
          eta: payload.eta || '3h 30m'
        }
      } : v));

      setOfflineQueue(prev => [...prev, {
        id: `queue-${Date.now()}`,
        type: 'VEHICLE_ASSIGN',
        payload: { vehicleId, ...payload },
        timestamp: new Date().toISOString()
      }]);
      return true;
    }

    try {
      const res = await fetch('/api/vehicles/assign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleId, ...payload })
      });
      if (res.ok) {
        const updated = await res.json();
        setVehicles(prev => prev.map(v => v.id === vehicleId ? updated : v));
        // Refresh alerts and dashboard
        fetch('/api/alerts').then(r => r.json()).then(setAlerts).catch(() => {});
        return true;
      }
    } catch (e) {
      console.error('Assign vehicle failed:', e);
    }
    return false;
  };

  const updateVehicleStatus = async (vehicleId: string, status: Vehicle['status'], fuelPercent?: number) => {
    setVehicles(prev => prev.map(v => {
      if (v.id === vehicleId) {
        const updated = { ...v, status };
        if (fuelPercent !== undefined) updated.fuelPercent = fuelPercent;
        if (status === 'Available') delete updated.currentAssignment;
        return updated;
      }
      return v;
    }));

    if (!isOffline) {
      try {
        await fetch(`/api/vehicles/${vehicleId}/status`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, fuelPercent })
        });
      } catch (e) {
        console.error('Vehicle status update failed:', e);
      }
    }
    return true;
  };

  const createEmergency = async (data: any) => {
    if (isOffline) {
      const tempId = `em-off-${Date.now().toString().slice(-4)}`;
      const newEm: EmergencyRequest = {
        id: tempId,
        title: data.title,
        emergencyType: data.emergencyType || 'Medical',
        locationName: data.locationName,
        state: data.state || 'Assam',
        lat: 26.2,
        lng: 92.5,
        requiredResource: data.requiredResource,
        priority: data.priority || 'Critical',
        status: 'Dispatched',
        createdAt: new Date().toISOString(),
        assignedVehicleName: 'Local Rapid Response Unit (Queued)',
        nearestWarehouse: 'Regional Emergency Depot',
        blockedRouteAvoided: 'Active Hazard Avoidance Active',
        recommendedRouteName: 'Direct Emergency Ridge Route',
        eta: '2h 15m'
      };
      setEmergencies(prev => [newEm, ...prev]);
      setOfflineQueue(prev => [...prev, {
        id: `queue-${Date.now()}`,
        type: 'EMERGENCY_REQUEST',
        payload: data,
        timestamp: new Date().toISOString()
      }]);
      return newEm;
    }

    try {
      const res = await fetch('/api/emergencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const created = await res.json();
        setEmergencies(prev => [created, ...prev]);
        fetch('/api/alerts').then(r => r.json()).then(setAlerts).catch(() => {});
        fetch('/api/vehicles').then(r => r.json()).then(setVehicles).catch(() => {});
        return created;
      }
    } catch (e) {
      console.error('Create emergency failed:', e);
    }
    return null;
  };

  const reportIncident = async (data: any) => {
    if (isOffline) {
      const newInc: RoadIncidentReport = {
        id: `inc-off-${Date.now().toString().slice(-4)}`,
        locationName: data.locationName,
        state: data.state || 'Assam',
        issueType: data.issueType,
        severity: data.severity || 'HIGH',
        description: data.description,
        reportedBy: data.reportedBy || 'Offline Field Officer',
        reportedAt: new Date().toISOString(),
        status: 'Verified'
      };
      setIncidentReports(prev => [newInc, ...prev]);
      setOfflineQueue(prev => [...prev, {
        id: `queue-${Date.now()}`,
        type: 'INCIDENT_REPORT',
        payload: data,
        timestamp: new Date().toISOString()
      }]);
      return true;
    }

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        const result = await res.json();
        setIncidentReports(prev => [result.incident, ...prev]);
        fetchDashboardData();
        return true;
      }
    } catch (e) {
      console.error('Report incident failed:', e);
    }
    return false;
  };

  const markAlertRead = async (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    if (!isOffline) {
      try {
        await fetch(`/api/alerts/${id}`, { method: 'PATCH' });
      } catch (e) {
        console.warn('Failed to mark alert as read on server:', e);
      }
    }
  };

  const markAllAlertsRead = async () => {
    setAlerts(prev => prev.map(a => ({ ...a, isRead: true })));
    if (!isOffline) {
      try {
        await fetch('/api/alerts/read-all', { method: 'POST' });
      } catch (e) {
        console.warn('Failed to mark all alerts read:', e);
      }
    }
  };

  const updateDemoSettings = async (settings: Partial<DemoSettings>) => {
    setDemoSettings(prev => ({ ...prev, ...settings }));
    try {
      const res = await fetch('/api/demo/adjust', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        fetchDashboardData();
      }
    } catch (e) {
      console.warn('Demo settings adjustment failed:', e);
    }
  };

  return (
    <AppContext.Provider value={{
      locations,
      roadSegments,
      vehicles,
      riskZones,
      emergencies,
      alerts,
      incidentReports,
      demoSettings,
      userRole,
      isOffline,
      offlineQueue,
      searchQuery,
      selectedLocation,
      activeRouteResult,
      isLoading,
      isReportingModalOpen,
      setUserRole,
      setSearchQuery,
      setSelectedLocation,
      setActiveRouteResult,
      setIsReportingModalOpen,
      toggleOfflineMode,
      fetchDashboardData,
      assignVehicle,
      updateVehicleStatus,
      createEmergency,
      reportIncident,
      markAlertRead,
      markAllAlertsRead,
      updateDemoSettings,
      syncOfflineQueue
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
