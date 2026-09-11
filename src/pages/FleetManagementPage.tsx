import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { Vehicle, VehicleType } from '../types.js';
import { 
  Truck, 
  ShieldCheck, 
  Fuel, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  Plus, 
  Search,
  Filter
} from 'lucide-react';
import { AssignVehicleModal } from '../components/AssignVehicleModal.js';

export const FleetManagementPage: React.FC = () => {
  const { vehicles, updateVehicleStatus } = useApp();

  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Available' | 'On Route' | 'Maintenance'>('All');
  const [selectedType, setSelectedType] = useState<VehicleType | 'All'>('All');
  const [only4WD, setOnly4WD] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vehicleToAssign, setVehicleToAssign] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(v => {
    if (selectedStatus !== 'All' && v.status !== selectedStatus) return false;
    if (selectedType !== 'All' && v.type !== selectedType) return false;
    if (only4WD && !v.fourWheelDrive) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.registrationNumber.toLowerCase().includes(q) ||
        v.driverName.toLowerCase().includes(q) ||
        v.currentLocationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleReturnToBase = async (vId: string) => {
    await updateVehicleStatus(vId, 'Available');
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">NER Fleet & Vehicle Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            4WD hill-spec vehicle telemetry, payload limits, driver dispatch, and fuel monitoring across depot hubs.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-300">
            Total Fleet: <strong className="text-white font-bold">{vehicles.length}</strong>
          </div>
          <div className="bg-emerald-950/60 border border-emerald-800 px-3 py-2 rounded-xl text-emerald-300">
            Available: <strong className="font-bold">{vehicles.filter(v => v.status === 'Available').length}</strong>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reg #, driver name, location..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Status */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Available">🟢 Available</option>
              <option value="On Route">🔵 On Route</option>
              <option value="Maintenance">🟠 Maintenance</option>
            </select>

            {/* Type */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="All">All Vehicle Types</option>
              <option value="Truck">Heavy Truck</option>
              <option value="Mini Truck">Mini Truck (4x4)</option>
              <option value="Bus">Hill Bus</option>
              <option value="Van">Van</option>
              <option value="Ambulance">Ambulance</option>
              <option value="SUV">SUV 4WD</option>
            </select>

            {/* 4WD Toggle */}
            <button
              type="button"
              onClick={() => setOnly4WD(!only4WD)}
              className={`px-3 py-1.5 rounded-lg border font-semibold transition-colors ${
                only4WD ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' : 'bg-slate-950 border-slate-700 text-slate-400'
              }`}
            >
              4WD Only
            </button>
          </div>

        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map(veh => {
          const isAvailable = veh.status === 'Available';
          const isOnRoute = veh.status === 'On Route';

          return (
            <div
              key={veh.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
            >
              <div className="space-y-3">
                {/* Reg & Status Badge */}
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-mono font-black text-white px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {veh.registrationNumber}
                    </span>
                    <div className="text-xs font-bold text-slate-300 mt-1">{veh.type}</div>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isAvailable ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    isOnRoute ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}>
                    {veh.status}
                  </span>
                </div>

                {/* Driver Details */}
                <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="font-semibold text-white">{veh.driverName}</span>
                    <span className="text-slate-400 text-[11px] flex items-center gap-1">
                      <Phone className="w-3 h-3 text-cyan-400" />
                      {veh.driverPhone}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>Stationed at: <strong className="text-slate-200">{veh.currentLocationName}</strong></span>
                  </div>
                </div>

                {/* Specs & Fuel */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500">Fuel Level</span>
                    <div className="font-bold text-white mt-0.5">{veh.fuelPercent}%</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500">Clearance</span>
                    <div className="font-bold text-white mt-0.5">{veh.terrainClearanceMm} mm</div>
                  </div>
                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-500">Max Payload</span>
                    <div className="font-bold text-white mt-0.5">{(veh.maxWeightCapacityKg / 1000).toFixed(1)}t</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Drivetrain: <strong className="text-slate-200">{veh.fourWheelDrive ? '4WD High Hill Spec' : 'Standard 2WD'}</strong></span>
                </div>

                {/* Current Active Assignment */}
                {veh.currentAssignment && (
                  <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs space-y-1">
                    <div className="flex items-center justify-between text-blue-300 font-bold text-[11px]">
                      <span>Active Task:</span>
                      <span>ETA: {veh.currentAssignment.eta}</span>
                    </div>
                    <div className="text-white text-xs font-semibold">{veh.currentAssignment.taskTitle}</div>
                    <div className="text-slate-400 text-[10px]">Destination: {veh.currentAssignment.destinationName}</div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                {isAvailable ? (
                  <button
                    type="button"
                    onClick={() => setVehicleToAssign(veh)}
                    className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Assign Mission</span>
                  </button>
                ) : isOnRoute ? (
                  <button
                    type="button"
                    onClick={() => handleReturnToBase(veh.id)}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
                  >
                    Mark Trip Complete & Return to Base
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleReturnToBase(veh.id)}
                    className="w-full py-2 rounded-lg bg-emerald-950 hover:bg-emerald-900 text-emerald-300 font-semibold text-xs border border-emerald-800 transition-colors"
                  >
                    Release from Maintenance
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {vehicleToAssign && (
        <AssignVehicleModal
          vehicle={vehicleToAssign}
          onClose={() => setVehicleToAssign(null)}
        />
      )}

    </div>
  );
};
