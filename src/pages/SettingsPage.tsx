import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { UserRole } from '../types.js';
import { 
  Settings2, 
  Sparkles, 
  CloudRain, 
  AlertTriangle, 
  Radio, 
  RotateCcw, 
  CheckCircle2, 
  Shield, 
  Sliders, 
  Server,
  Database
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { 
    demoSettings, 
    updateDemoSettings, 
    userRole, 
    setUserRole, 
    locations, 
    roadSegments, 
    vehicles, 
    emergencies,
    alerts 
  } = useApp();

  const [resetSuccess, setResetSuccess] = useState<boolean>(false);

  const roles: { role: UserRole; desc: string }[] = [
    { role: 'ADMIN', desc: 'Full governmental command, system configuration, risk escalation, and regional oversight' },
    { role: 'LOGISTICS MANAGER', desc: 'Freight optimization, vehicle assignment, depot coordination, and delivery tracking' },
    { role: 'DRIVER', desc: 'Assigned route navigation, offline map caching, hill alerts, and SOS signaling' },
    { role: 'FIELD OFFICER', desc: 'Ground incident reporting, slope hazard inspection, and local roadblock verification' }
  ];

  const handleReset = () => {
    updateDemoSettings({
      monsoonIntensityMultiplier: 1.0,
      simulatedLandslideActive: false,
      simulatedNetworkCutoff: false,
      demoModeActive: true
    });
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 1500);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings2 className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-black text-white tracking-tight">System Settings & Simulation Controls</h1>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Simulate severe monsoon cloudbursts, toggle role-based perspectives, calibrate landslide thresholds, and verify live database state.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Demo & Scenario Simulations (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Simulation Scenarios Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Interactive Terrain Simulation Engine</span>
                </h3>
                <p className="text-xs text-slate-400">Dynamically triggers real-time recalculations across all modules</p>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                SIMULATOR ACTIVE
              </span>
            </div>

            {/* Scenario 1: Monsoon Intensity Multiplier */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-2">
                  <CloudRain className="w-4 h-4 text-cyan-400" />
                  <span>Monsoon Rainfall Intensity</span>
                </span>
                <span className="text-xs font-mono font-bold text-cyan-400">
                  {demoSettings.monsoonIntensityMultiplier}x Rainfall
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Increasing this multiplies rainfall telemetry across all 8 states, elevating soil pore pressure and triggering automatic high-risk re-routes.
              </p>
              <div className="flex items-center gap-2 pt-1">
                {[1.0, 1.5, 2.0, 3.0].map(mult => (
                  <button
                    key={mult}
                    type="button"
                    onClick={() => updateDemoSettings({ monsoonIntensityMultiplier: mult })}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      demoSettings.monsoonIntensityMultiplier === mult
                        ? 'bg-cyan-600 text-white font-bold'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {mult === 1.0 ? 'Normal (1.0x)' : mult === 1.5 ? 'Heavy (1.5x)' : mult === 2.0 ? 'Severe (2.0x)' : 'Cloudburst (3.0x)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Scenario 2: Severe Landslide Blockade Trigger */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span>Simulate Sela Pass & Sonapur Major Landslide</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Instantly sets critical passes to <strong>BLOCKED</strong>, testing real-time emergency bypass redirection.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateDemoSettings({ simulatedLandslideActive: !demoSettings.simulatedLandslideActive })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  demoSettings.simulatedLandslideActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {demoSettings.simulatedLandslideActive ? 'ACTIVE BLOCK' : 'Trigger Hazard'}
              </button>
            </div>

            {/* Scenario 3: High-Altitude Network Blackout */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-400" />
                  <span>Simulate Regional Cell Tower Outage</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Tests offline-first queueing, local caching, and store-and-forward telemetry.
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateDemoSettings({ simulatedNetworkCutoff: !demoSettings.simulatedNetworkCutoff })}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  demoSettings.simulatedNetworkCutoff
                    ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
              >
                {demoSettings.simulatedNetworkCutoff ? 'BLACKOUT ON' : 'Trigger Blackout'}
              </button>
            </div>

            {/* Reset Defaults */}
            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Restore baseline NER terrain dataset:</span>
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{resetSuccess ? 'Reset Complete!' : 'Reset Baseline Telemetry'}</span>
              </button>
            </div>

          </div>

          {/* Database Diagnostics */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Operational In-Memory Telemetry Database</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px]">Locations / Hubs</span>
                <div className="text-lg font-bold text-white mt-0.5">{locations.length}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px]">Monitored Corridors</span>
                <div className="text-lg font-bold text-white mt-0.5">{roadSegments.length}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px]">Fleet Units</span>
                <div className="text-lg font-bold text-white mt-0.5">{vehicles.length}</div>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-500 text-[10px]">Active Emergencies</span>
                <div className="text-lg font-bold text-red-400 mt-0.5">{emergencies.length}</div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Role Perspective Switcher (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Shield className="w-4 h-4 text-cyan-400" />
                <span>Command Perspective Role</span>
              </h3>
              <span className="text-xs text-cyan-400 font-mono">{userRole}</span>
            </div>

            <p className="text-xs text-slate-400">
              Switch roles to verify access behaviors, command clearances, and specialized operator workflows.
            </p>

            <div className="space-y-2.5">
              {roles.map(r => {
                const isActive = userRole === r.role;
                return (
                  <div
                    key={r.role}
                    onClick={() => setUserRole(r.role)}
                    className={`p-3.5 rounded-xl cursor-pointer border transition-all ${
                      isActive 
                        ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white tracking-wide">{r.role}</span>
                      {isActive && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Decision Weights Calibration Note */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <span>Safety Decision Calibration</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              In accordance with Ministry of Road Transport & Highways (MoRTH) hill specifications, landslide safety is weighted at minimum 40% for all medical consignments and passenger buses traversing slopes above 22 degrees.
            </p>
            <div className="text-[11px] text-emerald-400 font-semibold">
              ✓ Multi-criteria Decision Making (MCDM) active
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
