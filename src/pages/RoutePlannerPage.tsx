import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  MovementType, 
  VehicleType, 
  CargoType, 
  PriorityLevel, 
  RouteAnalysisResult,
  RouteOption 
} from '../types.js';
import { 
  Route, 
  Navigation, 
  ShieldCheck, 
  Clock, 
  Fuel, 
  Radio, 
  CloudRain, 
  CheckCircle2, 
  AlertTriangle, 
  Sliders, 
  Compass,
  ArrowRight,
  Info
} from 'lucide-react';
import { NERMap } from '../components/NERMap.js';

export const RoutePlannerPage: React.FC = () => {
  const { locations, activeRouteResult, setActiveRouteResult } = useApp();

  const [originId, setOriginId] = useState<string>(locations[0]?.id || 'loc-guwahati');
  const [destinationId, setDestinationId] = useState<string>(locations[2]?.id || 'loc-tawang');
  const [movementType, setMovementType] = useState<MovementType>('Freight');
  const [vehicle, setVehicle] = useState<VehicleType>('Mini Truck');
  const [cargo, setCargo] = useState<CargoType>('Medicine');
  const [priority, setPriority] = useState<PriorityLevel>('Urgent');

  // Custom weights toggle
  const [showWeightSliders, setShowWeightSliders] = useState<boolean>(false);
  const [weights, setWeights] = useState({
    safety: 40,
    travelTime: 20,
    fuelEfficiency: 15,
    roadQuality: 10,
    connectivity: 10,
    weather: 5
  });

  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (originId === destinationId) {
      setErrorMsg('Origin and destination cannot be the same location. Please choose distinct NER points.');
      return;
    }
    setErrorMsg(null);
    setIsCalculating(true);

    try {
      const res = await fetch('/api/routes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originId,
          destinationId,
          movementType,
          vehicle,
          cargo,
          priority,
          customWeights: weights
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to calculate optimal route');
      }

      const data: RouteAnalysisResult = await res.json();
      setActiveRouteResult(data);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error communicating with NER AI routing engine');
    } finally {
      setIsCalculating(false);
    }
  };

  const formatMinutes = (m: number) => {
    const hours = Math.floor(m / 60);
    const mins = m % 60;
    return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Route className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">Smart Route Planner</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Multi-criteria decision intelligence optimizing for terrain slope, landslide susceptibility, cell signal, and vehicle mechanics.
        </p>
      </div>

      {/* Main Grid: Inputs Form & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              <span>Route Parameters</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowWeightSliders(!showWeightSliders)}
              className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                showWeightSliders ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Scoring Weights</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAnalyze} className="space-y-3.5 text-xs">
            
            {/* Origin & Destination */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">From (Origin)</label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">To (Destination)</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.state})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Movement Type & Vehicle */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Movement Type</label>
                <select
                  value={movementType}
                  onChange={(e) => setMovementType(e.target.value as MovementType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="Freight">Freight Movement</option>
                  <option value="Passenger">Passenger Movement</option>
                  <option value="Emergency">Emergency / Disaster Movement</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Vehicle Classification</label>
                <select
                  value={vehicle}
                  onChange={(e) => setVehicle(e.target.value as VehicleType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="Truck">Truck (Multi-Axle Heavy)</option>
                  <option value="Mini Truck">Mini Truck (4x4 Bolero / Force)</option>
                  <option value="Bus">Bus (Hill Spec Passenger)</option>
                  <option value="Van">Van (Light Commercial / Medical)</option>
                  <option value="Ambulance">Ambulance (4x4 ALS Emergency)</option>
                  <option value="SUV">SUV (High-Clearance 4WD)</option>
                </select>
              </div>
            </div>

            {/* Cargo Type & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cargo / Payload Type</label>
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value as CargoType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="Medicine">Medicine & Vaccines (Sensitive)</option>
                  <option value="Food">Food Grain & Perishables</option>
                  <option value="Fuel">Fuel / POL Tanker</option>
                  <option value="Agricultural">Agricultural Produce</option>
                  <option value="General">General Manufactured Cargo</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-semibold"
                >
                  <option value="Normal">Normal (Economic Balance)</option>
                  <option value="Urgent">Urgent (Fast Delivery Priority)</option>
                  <option value="Emergency">Emergency (Max Safety & Speed)</option>
                </select>
              </div>
            </div>

            {/* Scoring Weights Panel (Collapsible) */}
            {showWeightSliders && (
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 space-y-2.5 text-xs animate-in fade-in duration-200">
                <div className="font-bold text-slate-200 flex items-center justify-between">
                  <span>Scoring Weights Allocation</span>
                  <span className="text-[10px] text-cyan-400">Total: 100%</span>
                </div>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex justify-between text-slate-400">
                    <span>Safety (Landslide/Flood):</span>
                    <span className="font-semibold text-slate-200">{weights.safety}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="70"
                    value={weights.safety}
                    onChange={(e) => setWeights({ ...weights, safety: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />

                  <div className="flex justify-between text-slate-400">
                    <span>Travel Time:</span>
                    <span className="font-semibold text-slate-200">{weights.travelTime}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={weights.travelTime}
                    onChange={(e) => setWeights({ ...weights, travelTime: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />

                  <div className="flex justify-between text-slate-400">
                    <span>Connectivity Uptime:</span>
                    <span className="font-semibold text-slate-200">{weights.connectivity}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    value={weights.connectivity}
                    onChange={(e) => setWeights({ ...weights, connectivity: Number(e.target.value) })}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isCalculating}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>{isCalculating ? 'Calculating Terrain & Risk Matrix...' : 'ANALYZE ROUTE'}</span>
            </button>
          </form>

          {/* Quick Guidance Info */}
          <div className="p-3 rounded-lg bg-slate-950/40 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-slate-300 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>NER Terrain Heuristic:</span>
            </div>
            <p>
              When cargo is <em>Medicine</em> or priority is <em>Emergency</em>, the scoring engine auto-shifts weights to favor fortified ridge corridors, effectively preventing catastrophic halts in landslide-prone zones.
            </p>
          </div>
        </div>

        {/* Right Output Results (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {!activeRouteResult ? (
            <div className="h-full min-h-[380px] bg-slate-900 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <Route className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Route Analysis Awaiting Input</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Select origin and destination in Northeast India, configure vehicle and cargo, then click <strong>ANALYZE ROUTE</strong> to run the multi-factor intelligence engine.
              </p>
              <button
                type="button"
                onClick={() => handleAnalyze()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Run Sample: Guwahati → Tawang (Medical)
              </button>
            </div>
          ) : (
            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-300">
              
              {/* Recommended Route Card */}
              <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 px-3 py-1 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-bl-lg flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>RECOMMENDED ROUTE</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold mb-1">
                  <span>{activeRouteResult.origin.name}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                  <span>{activeRouteResult.destination.name}</span>
                </div>

                <h3 className="text-lg font-black text-white">
                  {activeRouteResult.recommendedRoute.name}
                </h3>

                {/* KPI Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Travel ETA
                    </span>
                    <div className="text-base font-black text-white mt-0.5">
                      {formatMinutes(activeRouteResult.recommendedRoute.estimatedMinutes)}
                    </div>
                    <span className="text-[10px] text-slate-500">{activeRouteResult.recommendedRoute.distanceKm} km</span>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      Risk Index
                    </span>
                    <div className="text-base font-black text-emerald-400 mt-0.5">
                      {activeRouteResult.recommendedRoute.riskPercent}%
                    </div>
                    <span className="text-[10px] text-emerald-500 font-medium">Safe Corridor</span>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-400" />
                      Estimated Fuel
                    </span>
                    <div className="text-base font-black text-white mt-0.5">
                      ₹{activeRouteResult.recommendedRoute.estimatedFuelInr.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500">Elevation adjusted</span>
                  </div>

                  <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Radio className="w-3 h-3 text-blue-400" />
                      Connectivity
                    </span>
                    <div className="text-base font-black text-cyan-300 mt-0.5">
                      {activeRouteResult.recommendedRoute.connectivityPercent}%
                    </div>
                    <span className="text-[10px] text-slate-500">Cell/Sat uptime</span>
                  </div>
                </div>

                {/* AI Route Explanation Points */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>AI Route Explanation</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {activeRouteResult.recommendedRoute.explanationPoints.map((pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 leading-relaxed">
                        <span className="text-emerald-400 shrink-0 font-bold">•</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Transparent Score Breakdown */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-400 mb-2">
                    SCORING FACTOR RATIOS (0 - 100)
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px]">
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400">Safety</div>
                      <div className="font-bold text-emerald-400 text-xs">{activeRouteResult.recommendedRoute.scoreBreakdown.safety}</div>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400">Time</div>
                      <div className="font-bold text-white text-xs">{activeRouteResult.recommendedRoute.scoreBreakdown.travelTime}</div>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400">Fuel</div>
                      <div className="font-bold text-white text-xs">{activeRouteResult.recommendedRoute.scoreBreakdown.fuelEfficiency}</div>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400">Road</div>
                      <div className="font-bold text-white text-xs">{activeRouteResult.recommendedRoute.scoreBreakdown.roadQuality}</div>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400">Signal</div>
                      <div className="font-bold text-cyan-400 text-xs">{activeRouteResult.recommendedRoute.scoreBreakdown.connectivity}</div>
                    </div>
                    <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
                      <div className="text-slate-400">Weather</div>
                      <div className="font-bold text-white text-xs">{activeRouteResult.recommendedRoute.scoreBreakdown.weather}</div>
                    </div>
                  </div>
                </div>

                {activeRouteResult.recommendedRoute.unsuitableWarning && (
                  <div className="mt-3 p-2.5 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{activeRouteResult.recommendedRoute.unsuitableWarning}</span>
                  </div>
                )}
              </div>

              {/* Alternative Route Card */}
              {activeRouteResult.alternativeRoute && (
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      Alternative / Direct Route
                    </span>
                    <span className="text-orange-400 font-semibold">
                      Risk: {activeRouteResult.alternativeRoute.riskPercent}%
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">
                    {activeRouteResult.alternativeRoute.name}
                  </h4>
                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span>Distance: <strong className="text-slate-200">{activeRouteResult.alternativeRoute.distanceKm} km</strong></span>
                    <span>ETA: <strong className="text-slate-200">{formatMinutes(activeRouteResult.alternativeRoute.estimatedMinutes)}</strong></span>
                    <span>Fuel: <strong className="text-slate-200">₹{activeRouteResult.alternativeRoute.estimatedFuelInr.toLocaleString()}</strong></span>
                  </div>
                  <div className="text-slate-400 italic text-[11px] bg-slate-950/50 p-2 rounded">
                    "{activeRouteResult.alternativeRoute.explanationPoints[0]}"
                  </div>
                </div>
              )}

              {/* Terrain & Contingency Guidance */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 space-y-1">
                <div className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Contingency & Alpine Directives:</span>
                </div>
                <p className="leading-relaxed text-slate-400">
                  {activeRouteResult.contingencyAdvice} {activeRouteResult.offlineRecommended && '⚠️ Route traverses areas with <50% mobile connectivity; offline map packet recommended before departure.'}
                </p>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
