import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { CargoType, PriorityLevel, VehicleType } from '../types.js';
import { 
  PackageCheck, 
  Truck, 
  Fuel, 
  Clock, 
  ShieldAlert, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FreightOptimizerPage: React.FC = () => {
  const { locations, vehicles, assignVehicle } = useApp();
  const navigate = useNavigate();

  const [cargo, setCargo] = useState<CargoType>('Medicine');
  const [weightKg, setWeightKg] = useState<number>(800);
  const [volumeM3, setVolumeM3] = useState<number>(4.5);
  const [priority, setPriority] = useState<PriorityLevel>('Urgent');
  const [originId, setOriginId] = useState<string>(locations[0]?.id || 'loc-guwahati');
  const [destinationId, setDestinationId] = useState<string>(locations[2]?.id || 'loc-tawang');
  const [preferredVehicle, setPreferredVehicle] = useState<VehicleType | ''>('');

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [dispatchSuccess, setDispatchSuccess] = useState<boolean>(false);

  const handleOptimize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsOptimizing(true);
    try {
      const res = await fetch('/api/freight/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cargo,
          weightKg,
          volumeM3,
          priority,
          originId,
          destinationId,
          preferredVehicle: preferredVehicle || undefined
        })
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      }
    } catch (err) {
      console.error('Freight optimization failed:', err);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleDispatch = async () => {
    if (!result) return;
    setIsDispatching(true);
    
    // Find matching vehicle
    const recType = result.recommendedVehicle;
    const avail = vehicles.find(v => v.status === 'Available' && v.type === recType) || vehicles.find(v => v.status === 'Available') || vehicles[0];
    
    if (avail) {
      const dest = locations.find(l => l.id === destinationId);
      await assignVehicle(avail.id, {
        destinationName: dest?.name || 'NER Forward Depot',
        taskTitle: `${priority} Freight: ${weightKg}kg ${cargo}`,
        eta: `${Math.floor(result.estimatedMinutes / 60)}h ${result.estimatedMinutes % 60}m`
      });
      setDispatchSuccess(true);
      setTimeout(() => {
        setDispatchSuccess(false);
        navigate('/fleet-management');
      }, 1500);
    }
    setIsDispatching(false);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <PackageCheck className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">Freight Optimizer</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Intelligent cargo-to-vehicle matching, mountain load balancing, fuel economics, and route risk prioritization.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Form (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <h2 className="text-sm font-bold text-white pb-2 border-b border-slate-800 flex items-center justify-between">
            <span>Cargo & Movement Specification</span>
            <span className="text-[10px] text-cyan-400 font-mono">NER-FRT-V2</span>
          </h2>

          <form onSubmit={handleOptimize} className="space-y-3.5 text-xs">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Origin Terminal</label>
                <select
                  value={originId}
                  onChange={(e) => setOriginId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.state})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Destination Post</label>
                <select
                  value={destinationId}
                  onChange={(e) => setDestinationId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name} ({loc.state})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Cargo Type</label>
                <select
                  value={cargo}
                  onChange={(e) => setCargo(e.target.value as CargoType)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                >
                  <option value="Medicine">Medicine (Cold-chain / Fragile)</option>
                  <option value="Food">Food & Grain Provisions</option>
                  <option value="Fuel">Fuel (Hazardous Tanker)</option>
                  <option value="Agricultural">Agricultural Goods</option>
                  <option value="General">General Manufactured Cargo</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Dispatch Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none font-semibold"
                >
                  <option value="Normal">Normal</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Total Weight (kg)</label>
                <input
                  type="number"
                  min="50"
                  max="40000"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Volume (m³)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="100"
                  value={volumeM3}
                  onChange={(e) => setVolumeM3(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Manual Vehicle Override (Optional)</label>
              <select
                value={preferredVehicle}
                onChange={(e) => setPreferredVehicle(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-slate-200 focus:ring-1 focus:ring-cyan-500 focus:outline-none"
              >
                <option value="">-- Let AI Recommend Optimal Vehicle --</option>
                <option value="Truck">Truck (Multi-axle Heavy)</option>
                <option value="Mini Truck">Mini Truck (4x4 Bolero / Force)</option>
                <option value="Van">Van (Light Commercial)</option>
                <option value="SUV">SUV (High-Clearance 4WD)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isOptimizing}
              className="w-full py-3 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-cyan-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isOptimizing ? 'Optimizing Freight Load...' : 'OPTIMIZE FREIGHT LOGISTICS'}</span>
            </button>
          </form>
        </div>

        {/* Output Results (7 cols) */}
        <div className="lg:col-span-7">
          {!result ? (
            <div className="h-full min-h-[360px] bg-slate-900 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-800/50 flex items-center justify-center text-cyan-400">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Freight Evaluation Engine Ready</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Configure cargo parameters or click below to evaluate real-time transport feasibility across Northeast terrain corridors.
              </p>
              <button
                type="button"
                onClick={() => handleOptimize()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                Load Example: 800 kg Medicine to Tawang
              </button>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in duration-300">
              
              {/* Main Recommendation Box */}
              <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-cyan-400">AI Recommendation</span>
                    <h3 className="text-lg font-black text-white flex items-center gap-2 mt-0.5">
                      <Truck className="w-5 h-5 text-cyan-400" />
                      <span>{result.recommendedVehicle}</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400">Priority Allocation:</span>
                    <div className="text-xs font-black text-amber-400">{result.priorityRank}</div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 bg-slate-950/80 p-3 rounded-xl border border-slate-800 leading-relaxed">
                  <strong className="text-white">Vehicle Matching Rationale: </strong>
                  {result.vehicleRationale}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Fuel className="w-3 h-3 text-amber-400" />
                      Estimated Fuel
                    </div>
                    <div className="text-base font-black text-white mt-1">
                      ₹{result.estimatedFuelInr.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-slate-500">Includes grade factor</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      Travel Duration
                    </div>
                    <div className="text-base font-black text-white mt-1">
                      {Math.floor(result.estimatedMinutes / 60)}h {result.estimatedMinutes % 60}m
                    </div>
                    <span className="text-[10px] text-slate-500">{result.recommendedRoute.distanceKm} km</span>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                    <div className="text-[10px] text-slate-400 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-400" />
                      Corridor Risk
                    </div>
                    <div className="text-base font-black text-emerald-400 mt-1">
                      {result.recommendedRoute.riskPercent}%
                    </div>
                    <span className="text-[10px] text-emerald-500">Lower risk bypass</span>
                  </div>
                </div>

                {/* Recommended Corridor details */}
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-200 mb-1">Recommended Transit Corridor:</div>
                  <div className="text-xs font-semibold text-cyan-300">{result.recommendedRoute.name}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    ✓ Selected because: {result.recommendedRoute.explanationPoints[0]}
                  </div>
                </div>

                {result.unsuitableWarning && (
                  <div className="p-3 rounded-lg bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{result.unsuitableWarning}</span>
                  </div>
                )}

                {/* Action button */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Ready to dispatch consignment?</span>
                  <button
                    type="button"
                    onClick={handleDispatch}
                    disabled={isDispatching || dispatchSuccess}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {dispatchSuccess ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Dispatched to Fleet!</span>
                      </>
                    ) : (
                      <>
                        <Truck className="w-4 h-4" />
                        <span>{isDispatching ? 'Allocating...' : 'DISPATCH FREIGHT'}</span>
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
