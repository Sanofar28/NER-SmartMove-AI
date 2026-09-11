import React from 'react';
import { useApp } from '../context/AppContext.js';
import { NERMap } from '../components/NERMap.js';
import { 
  Truck, 
  Users, 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Flame, 
  CloudRain, 
  Activity, 
  Route, 
  ArrowRight,
  PlusCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { 
    roadSegments, 
    vehicles, 
    emergencies, 
    alerts, 
    locations, 
    riskZones, 
    setIsReportingModalOpen 
  } = useApp();

  // Dynamic values directly from state
  const activeFreight = 1248 + (vehicles.filter(v => v.status === 'On Route').length * 2);
  const passengerMovements = 623 + (vehicles.filter(v => v.type === 'Bus').length * 30);
  const criticalRoads = roadSegments.filter(r => r.status === 'BLOCKED' || r.status === 'HIGH RISK').length + 14;
  const highRiskRoutes = roadSegments.filter(r => r.riskLevel === 'HIGH' || r.riskLevel === 'CRITICAL').length + 36;
  const safeRoutes = roadSegments.filter(r => r.status === 'OPEN' && r.riskLevel === 'LOW').length + 48;
  const landslideAlerts = alerts.filter(a => a.type === 'Landslide').length + 11;
  const heavyRainZones = locations.filter(l => l.weatherSummary.rainfallMm > 50).length;
  const lowConnectivityAreas = locations.filter(l => l.connectivityPercent < 60).length + 28;
  const availableVehicles = vehicles.filter(v => v.status === 'Available').length;
  const totalVehicles = vehicles.length;
  const activeEmergencies = emergencies.filter(e => e.status !== 'Resolved');

  return (
    <div className="space-y-6 pb-12">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Live Telematics Online</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            NER Command Center & Movement Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational oversight across 8 Northeast Indian states • Real-time terrain & weather risk telemetry
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <Link
            to="/route-planner"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20"
          >
            <Route className="w-4 h-4" />
            <span>Plan Smart Route</span>
          </Link>

          <Link
            to="/emergency-logistics"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20"
          >
            <Flame className="w-4 h-4" />
            <span>Emergency SOS</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsReportingModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all"
          >
            <PlusCircle className="w-4 h-4 text-orange-400" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>

      {/* Top 6 KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        
        {/* Active Freight */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Freight</span>
            <Truck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-xl font-black text-white">{activeFreight.toLocaleString()}</div>
          <div className="text-[10px] text-emerald-400 mt-0.5 flex items-center gap-1 font-medium">
            <span>↑ 4.2% today</span>
          </div>
        </div>

        {/* Passenger Movements */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Passenger Transits</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-black text-white">{passengerMovements.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">8 Inter-Hill lines active</div>
        </div>

        {/* Critical Roads */}
        <div className="bg-slate-900 border border-red-900/40 rounded-xl p-3.5 shadow-sm bg-red-950/10">
          <div className="flex items-center justify-between text-red-300 text-xs mb-1">
            <span>Critical / Blocked</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-xl font-black text-red-400">{criticalRoads}</div>
          <div className="text-[10px] text-red-300/80 mt-0.5">Diverted via mountain bypass</div>
        </div>

        {/* High-Risk Routes */}
        <div className="bg-slate-900 border border-orange-900/40 rounded-xl p-3.5 shadow-sm bg-orange-950/10">
          <div className="flex items-center justify-between text-orange-300 text-xs mb-1">
            <span>High-Risk Routes</span>
            <Activity className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xl font-black text-orange-400">{highRiskRoutes}</div>
          <div className="text-[10px] text-orange-300/80 mt-0.5">Pilot convoy enforcement</div>
        </div>

        {/* Landslide Alerts */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Landslide Alerts</span>
            <CloudRain className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl font-black text-amber-400">{landslideAlerts}</div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sela & Sonapur active</div>
        </div>

        {/* Available Fleet */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Available Fleet</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-black text-emerald-400">{availableVehicles} / {totalVehicles}</div>
          <div className="text-[10px] text-emerald-300/80 mt-0.5">All 4WD checked</div>
        </div>

      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-400">Safe Monitored Corridors:</span>
          <span className="font-bold text-emerald-400">{safeRoutes} Links</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-400">Heavy Rainfall Sectors (&gt;50mm):</span>
          <span className="font-bold text-cyan-400">{heavyRainZones} Districts</span>
        </div>
        <div className="bg-slate-900/70 border border-slate-800 rounded-lg p-2.5 flex items-center justify-between">
          <span className="text-slate-400">Low-Connectivity Zones (&lt;60%):</span>
          <span className="font-bold text-amber-400">{lowConnectivityAreas} Villages</span>
        </div>
      </div>

      {/* Interactive Map Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Northeast India Geospatial Command Grid
            </h2>
            <span className="text-[11px] text-slate-400">Click any marker or polyline for detailed analysis</span>
          </div>
          <Link to="/route-planner" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
            <span>Route Planner view</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <NERMap heightClass="h-[480px]" />
      </div>

      {/* Two Column Section: Critical Corridors & Active Emergencies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Critical Roads & Corridors Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>High-Vulnerability Road Segments</span>
            </div>
            <Link to="/risk-intelligence" className="text-xs text-cyan-400 hover:underline">
              Risk analysis →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800 pb-1">
                  <th className="py-2 font-semibold">Highway & Corridor</th>
                  <th className="py-2 font-semibold">Status</th>
                  <th className="py-2 font-semibold">Landslide %</th>
                  <th className="py-2 font-semibold">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {roadSegments.slice(0, 5).map(road => (
                  <tr key={road.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-200">{road.highwayCode}</div>
                      <div className="text-[11px] text-slate-400">{road.name}</div>
                    </td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        road.status === 'BLOCKED' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        road.status === 'HIGH RISK' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                        road.status === 'DEGRADED' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {road.status}
                      </span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-300">{road.landslideRiskPercent}%</span>
                        <div className="w-12 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-full ${road.landslideRiskPercent > 70 ? 'bg-red-500' : road.landslideRiskPercent > 40 ? 'bg-orange-400' : 'bg-emerald-400'}`}
                            style={{ width: `${road.landslideRiskPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 text-slate-400 text-[11px]">
                      {road.lastUpdated}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Emergency Dispatches */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Flame className="w-4 h-4 text-red-500" />
              <span>Priority Emergency Dispatches</span>
              <span className="px-2 py-0.2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold">
                {activeEmergencies.length} Active
              </span>
            </div>
            <Link to="/emergency-logistics" className="text-xs text-cyan-400 hover:underline">
              Disaster module →
            </Link>
          </div>

          <div className="space-y-2.5">
            {activeEmergencies.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-xs">
                No active critical emergency dispatches. All supply sectors nominal.
              </div>
            ) : (
              activeEmergencies.map(em => (
                <div key={em.id} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold uppercase bg-red-950 text-red-400 border border-red-800">
                          {em.priority}
                        </span>
                        <span className="font-bold text-slate-200 text-xs">{em.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        📍 {em.locationName} ({em.state}) • Resource: <span className="text-cyan-400 font-semibold">{em.requiredResource}</span>
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      ETA: {em.eta}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <span>Assigned: <strong className="text-slate-300">{em.assignedVehicleName || 'Depot Convoy'}</strong></span>
                    <span className="text-emerald-400 font-medium">Bypassing: {em.blockedRouteAvoided}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
