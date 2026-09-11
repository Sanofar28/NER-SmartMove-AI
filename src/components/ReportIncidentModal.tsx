import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { AlertTriangle, X, Check, ShieldAlert } from 'lucide-react';
import { NERState } from '../types.js';

export const ReportIncidentModal: React.FC = () => {
  const { isReportingModalOpen, setIsReportingModalOpen, reportIncident, locations, userRole } = useApp();

  const [locationName, setLocationName] = useState<string>(locations[0]?.name || 'Guwahati');
  const [state, setState] = useState<NERState>('Assam');
  const [issueType, setIssueType] = useState<'Landslide' | 'Flood' | 'Road damage' | 'Accident' | 'Blocked road' | 'Bridge problem'>('Landslide');
  const [severity, setSeverity] = useState<'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('HIGH');
  const [description, setDescription] = useState<string>('');
  const [reportedBy, setReportedBy] = useState<string>(`${userRole} Officer`);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isReportingModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    const success = await reportIncident({
      locationName,
      state,
      issueType,
      severity,
      description,
      reportedBy
    });

    setIsSubmitting(false);
    if (success) {
      setSuccessMessage('Incident recorded successfully! Road risk escalated and alert dispatched.');
      setTimeout(() => {
        setSuccessMessage(null);
        setIsReportingModalOpen(false);
        setDescription('');
      }, 1400);
    }
  };

  const nerStates: NERState[] = [
    'Assam',
    'Arunachal Pradesh',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Tripura',
    'Sikkim'
  ];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Report Road Incident</h3>
              <p className="text-xs text-slate-400">Escalate hazard to regional command center</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => setIsReportingModalOpen(false)}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {successMessage ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Incident Broadcasted</h4>
            <p className="text-xs text-slate-300">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Location */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Affected Location / Corridor</label>
                <select 
                  value={locationName} 
                  onChange={(e) => {
                    setLocationName(e.target.value);
                    const matched = locations.find(l => l.name === e.target.value);
                    if (matched) setState(matched.state);
                  }}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.name}>{loc.name} ({loc.state})</option>
                  ))}
                  <option value="Sela Pass Km 42">Sela Pass Km 42 (Arunachal)</option>
                  <option value="Sonapur Tunnel Approach">Sonapur Tunnel Approach (Meghalaya)</option>
                  <option value="Jatinga Valley Ghat">Jatinga Valley Ghat (Assam)</option>
                  <option value="Chumukedima Landslide Stretch">Chumukedima Landslide Stretch (Nagaland)</option>
                </select>
              </div>

              {/* State */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">State</label>
                <select 
                  value={state} 
                  onChange={(e) => setState(e.target.value as NERState)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  {nerStates.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Issue Type */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Hazard / Issue Type</label>
                <select 
                  value={issueType} 
                  onChange={(e) => setIssueType(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                >
                  <option value="Landslide">Landslide / Mudslip</option>
                  <option value="Flood">Flash Flood / Waterlogging</option>
                  <option value="Road damage">Severe Road Damage / Sinking</option>
                  <option value="Accident">Vehicle Overturn / Accident</option>
                  <option value="Blocked road">Complete Road Blockade</option>
                  <option value="Bridge problem">Bridge Scour / Structural Issue</option>
                </select>
              </div>

              {/* Severity */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Severity Level</label>
                <select 
                  value={severity} 
                  onChange={(e) => setSeverity(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 font-semibold"
                >
                  <option value="CRITICAL">🔴 CRITICAL — Total Blockage</option>
                  <option value="HIGH">🟠 HIGH — Dangerous Pass</option>
                  <option value="MODERATE">🟡 MODERATE — Restricted Speed</option>
                  <option value="LOW">🟢 LOW — Minor Road Hazard</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Description & Ground Conditions</label>
              <textarea 
                rows={3}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="e.g. Sludge and boulders blocking lane. Rainfall continuing heavily. Alternating convoy only."
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none placeholder-slate-500"
              />
            </div>

            {/* Reporter info */}
            <div>
              <label className="block font-semibold text-slate-300 mb-1.5">Reported By</label>
              <input 
                type="text"
                value={reportedBy}
                onChange={(e) => setReportedBy(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
              <button 
                type="button"
                onClick={() => setIsReportingModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting || !description.trim()}
                className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-600/30"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>{isSubmitting ? 'Broadcasting...' : 'Broadcast Report'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
