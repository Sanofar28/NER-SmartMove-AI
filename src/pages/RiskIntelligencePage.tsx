import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { RiskLevel } from '../types.js';
import { 
  AlertOctagon, 
  CloudRain, 
  Mountain, 
  Activity, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Droplets,
  Layers,
  FileText
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const RiskIntelligencePage: React.FC = () => {
  const { roadSegments, riskZones, setIsReportingModalOpen } = useApp();

  const [selectedRiskFilter, setSelectedRiskFilter] = useState<RiskLevel | 'ALL'>('ALL');
  const [selectedSegmentId, setSelectedSegmentId] = useState<string>(roadSegments[0]?.id || 'road-1');

  const filteredRoads = selectedRiskFilter === 'ALL'
    ? roadSegments
    : roadSegments.filter(r => r.riskLevel === selectedRiskFilter);

  const activeRoad = roadSegments.find(r => r.id === selectedSegmentId) || roadSegments[0];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-orange-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Geospatial Risk Intelligence</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time landslide susceptibility, rainfall saturation, slope angle, and geological hazard telemetry across NER mountain corridors.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsReportingModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-red-600/20"
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Report Ground Hazard</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold mr-1">Risk Filter:</span>
        {(['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'] as const).map(lvl => (
          <button
            key={lvl}
            type="button"
            onClick={() => setSelectedRiskFilter(lvl)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              selectedRiskFilter === lvl
                ? 'bg-slate-100 text-slate-900 font-bold'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monitored Corridors List (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Corridors ({filteredRoads.length})
            </span>
            <span className="text-[10px] text-slate-400">Click to evaluate</span>
          </div>

          <div className="max-h-[620px] overflow-y-auto space-y-2 pr-1">
            {filteredRoads.map(road => {
              const isSelected = road.id === selectedSegmentId;
              return (
                <div
                  key={road.id}
                  onClick={() => setSelectedSegmentId(road.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected 
                      ? 'bg-orange-500/15 border-orange-500/50 shadow-md shadow-orange-500/10' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">{road.highwayCode}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          road.status === 'BLOCKED' ? 'bg-red-500/20 text-red-400' :
                          road.status === 'HIGH RISK' ? 'bg-orange-500/20 text-orange-400' :
                          road.status === 'DEGRADED' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {road.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{road.name}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-orange-400">{road.landslideRiskPercent}%</div>
                      <span className="text-[9px] text-slate-500">Risk Index</span>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                    <span>Slope: {road.slopeDegrees}°</span>
                    <span>Rain 24h: {road.rainfallLast24hMm}mm</span>
                    <span>Soil: {road.soilMoistureLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Granular Corridor Deep Dive (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">{activeRoad.highwayCode} Corridor Inspection</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                    activeRoad.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                    activeRoad.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                  }`}>
                    {activeRoad.riskLevel} HAZARD
                  </span>
                </div>
                <h3 className="text-xl font-black text-white mt-1">{activeRoad.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">Length: {activeRoad.distanceKm} km • Historical Landslides: {activeRoad.historicalLandslidesCount} events</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center min-w-[120px]">
                <div className="text-[10px] text-slate-400 uppercase font-semibold">Landslide Index</div>
                <div className="text-2xl font-black text-orange-400">{activeRoad.landslideRiskPercent}%</div>
              </div>
            </div>

            {/* Geological Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                  Hill Slope Gradient
                </span>
                <div className="text-base font-bold text-white mt-1">{activeRoad.slopeDegrees}° Angle</div>
                <span className="text-[10px] text-slate-500">{activeRoad.slopeDegrees > 30 ? 'Critical steep cliff' : 'Moderate grade'}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                  Rainfall (24h / 72h)
                </span>
                <div className="text-base font-bold text-white mt-1">{activeRoad.rainfallLast24hMm}mm / {activeRoad.rainfallLast72hMm}mm</div>
                <span className="text-[10px] text-slate-500">{activeRoad.rainfallLast72hMm > 100 ? 'High saturation' : 'Standard'}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 text-indigo-400" />
                  Soil Moisture Saturation
                </span>
                <div className="text-base font-bold text-white mt-1">{activeRoad.soilMoistureLevel}</div>
                <span className="text-[10px] text-slate-500">Pore pressure elevated</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  Vegetation Cover Index
                </span>
                <div className="text-base font-bold text-white mt-1">{activeRoad.vegetationIndex} NDVI</div>
                <span className="text-[10px] text-slate-500">{activeRoad.vegetationIndex < 0.3 ? 'Sparse root hold' : 'Dense forest'}</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-purple-400" />
                  Cell Signal Connectivity
                </span>
                <div className="text-base font-bold text-white mt-1">{activeRoad.connectivityPercent}% Coverage</div>
                <span className="text-[10px] text-slate-500">SOS radio active</span>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-yellow-400" />
                  Vulnerability Score
                </span>
                <div className="text-base font-bold text-white mt-1">{activeRoad.roadVulnerabilityScore}/100</div>
                <span className="text-[10px] text-slate-500">Infrastructure wear</span>
              </div>

            </div>

            {/* AI Alternative Route Guidance */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>AI Recommended Movement Directive:</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeRoad.status === 'BLOCKED' 
                  ? 'CRITICAL CLOSURE: Complete lane obstruction due to mudslide slurry. All civilian and non-essential freight diverted through secondary ridge bypass.'
                  : activeRoad.landslideRiskPercent > 60
                  ? 'CAUTION: Highly saturated soil along cliff cuts. Restrict movement to 4WD convoys during daylight hours. Night movement discouraged.'
                  : 'SAFE TRANSIT: Route remains open with normal traffic flow. Periodic drone surveillance active.'}
              </p>
              {activeRoad.alternativeRouteName && (
                <div className="text-xs text-cyan-300 bg-cyan-950/40 p-2.5 rounded-lg border border-cyan-800/40 mt-2 flex items-center justify-between">
                  <span>Designated Bypass: <strong>{activeRoad.alternativeRouteName}</strong></span>
                  <Link to="/route-planner" className="text-cyan-400 hover:underline flex items-center gap-1">
                    <span>Route Planner</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </div>

            {/* Geological Incident Bulletin Info */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400">
              <span>Telemetry Timestamp: {activeRoad.lastUpdated}</span>
              <span className="text-slate-500">Geological Survey of India (NER Cell) & BRO Feed</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
