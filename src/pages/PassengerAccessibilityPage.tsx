import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { NERState, AccessibilityBreakdown } from '../types.js';
import { 
  Users, 
  MapPin, 
  Bus, 
  HeartPulse, 
  Radio, 
  Mountain, 
  CloudRain, 
  ShieldCheck, 
  AlertTriangle,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const PassengerAccessibilityPage: React.FC = () => {
  const { locations } = useApp();

  const [selectedState, setSelectedState] = useState<NERState | 'All'>('All');
  const [selectedLocId, setSelectedLocId] = useState<string>(locations[0]?.id || 'loc-guwahati');

  const nerStates: (NERState | 'All')[] = [
    'All',
    'Assam',
    'Arunachal Pradesh',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Sikkim'
  ];

  const filteredLocations = selectedState === 'All' 
    ? locations 
    : locations.filter(l => l.state === selectedState);

  const activeLoc = locations.find(l => l.id === selectedLocId) || locations[0];

  // Derive granular 6-factor accessibility analysis for the active location
  const deriveBreakdown = (loc: typeof activeLoc): AccessibilityBreakdown => {
    const isAlpine = loc.elevationMeters > 1500;
    const isLowland = loc.elevationMeters < 100;

    const roadAcc = isLowland ? 96 : isAlpine ? Math.max(30, Math.round(loc.accessibilityScore * 0.9)) : 74;
    const pubTrans = isLowland ? 94 : isAlpine ? 32 : 68;
    const emAccess = loc.hasMedicalCenter ? (isAlpine ? 45 : 88) : 35;
    const conn = loc.connectivityPercent;
    const weatherImpact = Math.max(15, 100 - loc.weatherSummary.rainfallMm);
    const terrainDiff = isLowland ? 90 : isAlpine ? 25 : 62;

    const overall = loc.accessibilityScore;
    let category: AccessibilityBreakdown['category'] = 'Good';
    if (overall >= 85) category = 'Excellent';
    else if (overall >= 65) category = 'Good';
    else if (overall >= 50) category = 'Moderate';
    else if (overall >= 35) category = 'Poor';
    else category = 'Critical';

    let vuln = 'Lowland connectivity with multi-lane highway access.';
    if (isAlpine) {
      vuln = `High mountain choke points subject to seasonal cloudburst cutoffs and single-pass vulnerability via Sela/Himalayan passes.`;
    } else if (loc.elevationMeters > 500) {
      vuln = `Ghat transit subject to intermittent mudslides during heavy precipitation events.`;
    }

    return {
      locationId: loc.id,
      locationName: loc.name,
      state: loc.state,
      overallScore: overall,
      category,
      factors: {
        roadAccessibility: roadAcc,
        publicTransportAvailability: pubTrans,
        emergencyAccess: emAccess,
        connectivity: conn,
        weatherImpact,
        terrainDifficulty: terrainDiff
      },
      isolationVulnerability: vuln,
      availableBusesDaily: isLowland ? 120 : isAlpine ? 3 : 24,
      avgAmbulanceReachMinutes: isLowland ? 14 : isAlpine ? 190 : 50,
      primaryLifelineRoute: `${loc.name} Arterial Connecting Corridor`
    };
  };

  const breakdown = deriveBreakdown(activeLoc);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">Passenger Accessibility Intelligence</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Comprehensive 6-factor accessibility analysis for Northeast Indian towns, villages, and remote administrative centers.
        </p>
      </div>

      {/* State Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-400 font-semibold mr-1 text-[11px]">Filter State:</span>
        {nerStates.map(s => (
          <button
            key={s}
            type="button"
            onClick={() => setSelectedState(s)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-all font-semibold ${
              selectedState === s 
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20' 
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Location Selector Grid (4 cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Monitored Centers ({filteredLocations.length})
            </h3>
            <span className="text-[10px] text-slate-400">Select to inspect</span>
          </div>

          <div className="max-h-[580px] overflow-y-auto space-y-2 pr-1">
            {filteredLocations.map(loc => {
              const isSelected = loc.id === selectedLocId;
              return (
                <div
                  key={loc.id}
                  onClick={() => setSelectedLocId(loc.id)}
                  className={`p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected 
                      ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">{loc.name}</div>
                      <div className="text-[10px] text-slate-400">{loc.state} • {loc.elevationMeters}m alt</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-cyan-400">{loc.accessibilityScore} / 100</div>
                      <span className={`text-[9px] font-semibold px-1.5 py-0.2 rounded ${
                        loc.accessibilityScore >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
                        loc.accessibilityScore >= 60 ? 'bg-blue-500/20 text-blue-400' :
                        loc.accessibilityScore >= 45 ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {loc.accessibilityScore >= 80 ? 'Excellent' : loc.accessibilityScore >= 60 ? 'Good' : loc.accessibilityScore >= 45 ? 'Moderate' : 'Critical'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Breakdown Panel (8 cols) */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* Main Score Hero Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">{activeLoc.state} District Center</span>
                </div>
                <h2 className="text-2xl font-black text-white mt-1">{activeLoc.name}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{activeLoc.terrainType} • Coordinates: {activeLoc.lat.toFixed(3)}°N, {activeLoc.lng.toFixed(3)}°E</p>
              </div>

              {/* Large Score Badge */}
              <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 font-semibold uppercase">Accessibility Score</div>
                  <div className={`text-xs font-bold ${
                    breakdown.category === 'Excellent' ? 'text-emerald-400' :
                    breakdown.category === 'Good' ? 'text-blue-400' :
                    breakdown.category === 'Moderate' ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {breakdown.category} Category
                  </div>
                </div>
                <div className="w-14 h-14 rounded-xl bg-slate-900 border-2 border-cyan-500 flex items-center justify-center font-black text-2xl text-cyan-400 shadow-lg shadow-cyan-500/20">
                  {breakdown.overallScore}
                </div>
              </div>
            </div>

            {/* 6 Key Factors Breakdown Progress Bars */}
            <div className="mt-5 space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Six-Factor Dimensional Evaluation
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                
                {/* Road Accessibility */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Compass className="w-3.5 h-3.5 text-cyan-400" />
                      Road Accessibility
                    </span>
                    <span className="font-bold text-white">{breakdown.factors.roadAccessibility}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${breakdown.factors.roadAccessibility}%` }} />
                  </div>
                </div>

                {/* Public Transport Availability */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Bus className="w-3.5 h-3.5 text-blue-400" />
                      Public Transport Availability
                    </span>
                    <span className="font-bold text-white">{breakdown.factors.publicTransportAvailability}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: `${breakdown.factors.publicTransportAvailability}%` }} />
                  </div>
                </div>

                {/* Emergency Medical Access */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                      Emergency Access Time
                    </span>
                    <span className="font-bold text-white">{breakdown.factors.emergencyAccess}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: `${breakdown.factors.emergencyAccess}%` }} />
                  </div>
                </div>

                {/* Cellular & Digital Connectivity */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Radio className="w-3.5 h-3.5 text-purple-400" />
                      Digital & Cell Connectivity
                    </span>
                    <span className="font-bold text-white">{breakdown.factors.connectivity}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${breakdown.factors.connectivity}%` }} />
                  </div>
                </div>

                {/* Weather Impact Resilience */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CloudRain className="w-3.5 h-3.5 text-amber-400" />
                      Weather Impact Resilience
                    </span>
                    <span className="font-bold text-white">{breakdown.factors.weatherImpact}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${breakdown.factors.weatherImpact}%` }} />
                  </div>
                </div>

                {/* Terrain Gradient Difficulty */}
                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Mountain className="w-3.5 h-3.5 text-emerald-400" />
                      Terrain Feasibility
                    </span>
                    <span className="font-bold text-white">{breakdown.factors.terrainDifficulty}/100</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${breakdown.factors.terrainDifficulty}%` }} />
                  </div>
                </div>

              </div>
            </div>

            {/* Operational Metrics Sub-panel */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">Daily Public Bus Trips</span>
                <div className="text-lg font-bold text-white mt-0.5">{breakdown.availableBusesDaily} Daily Lines</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">Ambulance Response Time</span>
                <div className="text-lg font-bold text-red-400 mt-0.5">~{breakdown.avgAmbulanceReachMinutes} mins</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-slate-400 text-[10px]">Cellular Telemetry</span>
                <div className="text-lg font-bold text-cyan-400 mt-0.5">{activeLoc.connectivityPercent}% Signal</div>
              </div>
            </div>

            {/* Isolation Vulnerability Warning */}
            <div className="mt-4 p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-amber-400 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                <span>Isolation Vulnerability Assessment:</span>
              </span>
              <p className="text-slate-300 leading-relaxed pl-5">
                {breakdown.isolationVulnerability}
              </p>
            </div>

            {/* Direct Plan Route Link */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Need to calculate passenger route to this location?</span>
              <Link
                to={`/route-planner`}
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
              >
                <span>Plan Route to {activeLoc.name}</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
