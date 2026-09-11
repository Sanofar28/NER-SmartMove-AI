import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { EmergencyRequest, PriorityLevel, NERState, Vehicle } from '../types.js';
import { 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  Truck, 
  ShieldAlert, 
  Clock, 
  MapPin, 
  Plus, 
  ArrowRight,
  HeartPulse,
  LifeBuoy
} from 'lucide-react';
import { AssignVehicleModal } from '../components/AssignVehicleModal.js';

export const EmergencyLogisticsPage: React.FC = () => {
  const { 
    emergencies, 
    locations, 
    vehicles, 
    createEmergency, 
    resolveEmergency, 
    userRole 
  } = useApp();

  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Dispatched' | 'Resolved'>('All');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [vehicleToAssign, setVehicleToAssign] = useState<Vehicle | null>(null);

  // New Emergency Form State
  const [title, setTitle] = useState<string>('Oxygen & Blood Plasma Shortage');
  const [emergencyType, setEmergencyType] = useState<EmergencyRequest['emergencyType']>('Medical');
  const [locationName, setLocationName] = useState<string>(locations[2]?.name || 'Tawang');
  const [state, setState] = useState<NERState>('Arunachal Pradesh');
  const [priority, setPriority] = useState<PriorityLevel>('Emergency');
  const [requiredResource, setRequiredResource] = useState<string>('12 Type-D Medical Oxygen Cylinders');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const filteredEmergencies = filterStatus === 'All'
    ? emergencies
    : emergencies.filter(e => e.status === filterStatus);

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await createEmergency({
      title,
      emergencyType,
      locationName,
      state,
      priority,
      requiredResource
    });
    setIsSubmitting(false);
    if (success) {
      setShowCreateModal(false);
      setTitle('');
    }
  };

  const handleQuickAssign = (emergency: EmergencyRequest) => {
    // Find first available vehicle
    const avail = vehicles.find(v => v.status === 'Available') || vehicles[0];
    setVehicleToAssign(avail);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-red-500 animate-pulse" />
            <h1 className="text-2xl font-black text-white tracking-tight">Emergency Disaster Logistics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Priority lifeline supply corridors, disaster response allocation, medical oxygen routing, and emergency convoy dispatch.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>BROADCAST EMERGENCY SOS</span>
        </button>
      </div>

      {/* KPI Status Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center justify-between">
          <span className="text-slate-400">Total Emergencies Logged</span>
          <span className="font-bold text-white text-base">{emergencies.length}</span>
        </div>
        <div className="bg-slate-900 border border-red-900/40 rounded-xl p-3 flex items-center justify-between bg-red-950/10">
          <span className="text-red-400 font-semibold">Active Pending Incidents</span>
          <span className="font-bold text-red-400 text-base">{emergencies.filter(e => e.status === 'Pending').length}</span>
        </div>
        <div className="bg-slate-900 border border-blue-900/40 rounded-xl p-3 flex items-center justify-between bg-blue-950/10">
          <span className="text-blue-400 font-semibold">Convoys In Transit</span>
          <span className="font-bold text-blue-400 text-base">{emergencies.filter(e => e.status === 'Dispatched').length}</span>
        </div>
        <div className="bg-slate-900 border border-emerald-900/40 rounded-xl p-3 flex items-center justify-between bg-emerald-950/10">
          <span className="text-emerald-400 font-semibold">Successfully Relieved</span>
          <span className="font-bold text-emerald-400 text-base">{emergencies.filter(e => e.status === 'Resolved').length}</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs border-b border-slate-800 pb-2">
        <span className="text-slate-400 font-semibold mr-2">Filter Status:</span>
        {(['All', 'Pending', 'Dispatched', 'Resolved'] as const).map(st => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterStatus === st 
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {st} ({st === 'All' ? emergencies.length : emergencies.filter(e => e.status === st).length})
          </button>
        ))}
      </div>

      {/* Emergencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmergencies.map(em => {
          const isResolved = em.status === 'Resolved';
          const isDispatched = em.status === 'Dispatched';

          return (
            <div
              key={em.id}
              className={`bg-slate-900 rounded-2xl border p-5 shadow-xl flex flex-col justify-between transition-all ${
                isResolved 
                  ? 'border-slate-800 opacity-75' 
                  : isDispatched 
                  ? 'border-blue-500/40 bg-slate-900/90' 
                  : 'border-red-500/50 bg-red-950/10'
              }`}
            >
              <div className="space-y-3">
                {/* Status + Priority */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      em.priority === 'Emergency' ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                      em.priority === 'Urgent' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40' :
                      'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    }`}>
                      {em.priority}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{em.emergencyType}</span>
                  </div>
                  
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    isResolved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                    isDispatched ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                    'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                  }`}>
                    {em.status}
                  </span>
                </div>

                {/* Title & Location */}
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">{em.title}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{em.locationName}, {em.state}</span>
                  </div>
                </div>

                {/* Required Resources */}
                <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Critical Payload:</div>
                  <div className="text-cyan-300 font-bold mt-0.5">{em.requiredResource}</div>
                </div>

                {/* Routing & Depot Telemetry */}
                <div className="space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex justify-between">
                    <span>Nearest Staging Depot:</span>
                    <span className="text-slate-200 font-medium">{em.nearestWarehouse}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Designated Lifeline:</span>
                    <span className="text-emerald-400 font-semibold">{em.recommendedRouteName}</span>
                  </div>
                  <div className="flex justify-between text-red-300">
                    <span>Avoids Hazard:</span>
                    <span>{em.blockedRouteAvoided}</span>
                  </div>
                </div>

                {/* Assigned Vehicle */}
                {em.assignedVehicleName && (
                  <div className="p-2 rounded-lg bg-blue-950/40 border border-blue-800/40 text-xs flex items-center justify-between text-blue-200">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-400" />
                      <span>{em.assignedVehicleName}</span>
                    </span>
                    <span className="font-bold">ETA: {em.eta}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                {!isResolved ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleQuickAssign(em)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Dispatch Fleet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => resolveEmergency(em.id)}
                      className="py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                      title="Mark situation resolved and corridor cleared"
                    >
                      Resolve
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center text-xs text-emerald-400 font-bold flex items-center justify-center gap-1.5 py-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Emergency Supply Delivered & Verified</span>
                  </div>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Create Emergency Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Broadcast Disaster Emergency</h3>
                  <p className="text-xs text-slate-400">Authorize high-priority lifeline corridor mobilization</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Emergency Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Critical Medical Oxygen Run"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Incident Classification</label>
                  <select
                    value={emergencyType}
                    onChange={(e) => setEmergencyType(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="Medical">Medical Urgent Supply</option>
                    <option value="Disaster">Disaster Rescue & Shelter</option>
                    <option value="Food">Food / Rations Air-Drop Link</option>
                    <option value="Landslide rescue">Landslide Road Clearance</option>
                    <option value="Flood evacuation">Flood Evacuation</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Priority Classification</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none font-bold"
                  >
                    <option value="Emergency">🚨 EMERGENCY (Immediate Clear)</option>
                    <option value="Urgent">🟠 URGENT (Priority Staging)</option>
                    <option value="Normal">🟡 NORMAL</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Location</label>
                  <select
                    value={locationName}
                    onChange={(e) => {
                      setLocationName(e.target.value);
                      const m = locations.find(l => l.name === e.target.value);
                      if (m) setState(m.state);
                    }}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none"
                  >
                    {locations.map(loc => (
                      <option key={loc.id} value={loc.name}>{loc.name} ({loc.state})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    disabled
                    value={state}
                    className="w-full bg-slate-950/50 border border-slate-800 rounded-lg p-2.5 text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Required Relief Supplies / Equipment</label>
                <input
                  type="text"
                  required
                  value={requiredResource}
                  onChange={(e) => setRequiredResource(e.target.value)}
                  placeholder="e.g. 500 Food Packets, 20 Water Filtration Kits"
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:ring-1 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-black flex items-center gap-1.5 shadow-lg shadow-red-600/30"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast SOS Order'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* Quick Vehicle Assignment Modal */}
      {vehicleToAssign && (
        <AssignVehicleModal
          vehicle={vehicleToAssign}
          onClose={() => setVehicleToAssign(null)}
        />
      )}

    </div>
  );
};
