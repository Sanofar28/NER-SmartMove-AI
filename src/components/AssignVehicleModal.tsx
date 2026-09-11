import React, { useState } from 'react';
import { Vehicle } from '../types.js';
import { useApp } from '../context/AppContext.js';
import { Truck, X, Check, MapPin } from 'lucide-react';

interface AssignVehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
}

export const AssignVehicleModal: React.FC<AssignVehicleModalProps> = ({ vehicle, onClose }) => {
  const { locations, assignVehicle, emergencies } = useApp();

  const [destinationName, setDestinationName] = useState<string>(locations[1]?.name || 'Shillong');
  const [taskTitle, setTaskTitle] = useState<string>('Essential Food & Medical Supply Run');
  const [eta, setEta] = useState<string>('3h 45m');
  const [selectedEmergencyId, setSelectedEmergencyId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  if (!vehicle) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const ok = await assignVehicle(vehicle.id, {
      destinationName,
      taskTitle,
      requestId: selectedEmergencyId || undefined,
      eta
    });
    setIsSubmitting(false);
    if (ok) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1200);
    }
  };

  const pendingEmergencies = emergencies.filter(e => e.status === 'Pending' || e.status === 'Dispatched');

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950/80 border border-blue-800 flex items-center justify-center text-blue-400">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Assign Movement Duty</h3>
              <p className="text-xs text-slate-400">{vehicle.registrationNumber} • {vehicle.type}</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Vehicle Dispatched!</h4>
            <p className="text-xs text-slate-300">Status set to "On Route". Telematics tracking initiated.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            {/* Vehicle telemetry card */}
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Driver:</span>
                <span className="font-semibold text-white">{vehicle.driverName} ({vehicle.driverPhone})</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Current Base:</span>
                <span className="font-semibold text-cyan-400">{vehicle.currentLocationName}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span className="text-slate-500">Fuel & Spec:</span>
                <span>{vehicle.fuelPercent}% Tank • {vehicle.fourWheelDrive ? '4WD High Terrain' : 'Standard 2WD'}</span>
              </div>
            </div>

            {/* Link to Emergency Request if desired */}
            {pendingEmergencies.length > 0 && (
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Link to Active Emergency (Optional)</label>
                <select 
                  value={selectedEmergencyId} 
                  onChange={(e) => {
                    const id = e.target.value;
                    setSelectedEmergencyId(id);
                    const em = emergencies.find(x => x.id === id);
                    if (em) {
                      setDestinationName(em.locationName);
                      setTaskTitle(`EMERGENCY: ${em.title}`);
                      setEta(em.eta || '2h 30m');
                    }
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="">-- Manual Assignment --</option>
                  {pendingEmergencies.map(em => (
                    <option key={em.id} value={em.id}>
                      [{em.priority}] {em.emergencyType}: {em.locationName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Destination */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Target Destination</label>
              <select 
                value={destinationName} 
                onChange={(e) => setDestinationName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              >
                {locations.map(loc => (
                  <option key={loc.id} value={loc.name}>{loc.name} ({loc.state})</option>
                ))}
              </select>
            </div>

            {/* Task Title */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Movement Title / Cargo Consignment</label>
              <input 
                type="text"
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* ETA */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Expected Travel Duration (ETA)</label>
              <input 
                type="text"
                required
                value={eta}
                onChange={(e) => setEta(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button 
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
