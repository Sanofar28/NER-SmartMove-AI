import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { AlertNotification } from '../types.js';
import { 
  BellRing, 
  AlertTriangle, 
  CloudRain, 
  Flame, 
  CheckCheck, 
  Check, 
  Search, 
  Filter, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AlertsPage: React.FC = () => {
  const { 
    alerts, 
    markAlertRead, 
    markAllAlertsRead, 
    setIsReportingModalOpen 
  } = useApp();

  const navigate = useNavigate();

  const [severityFilter, setSeverityFilter] = useState<'All' | 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Landslide' | 'Weather' | 'Road' | 'Emergency'>('All');
  const [search, setSearch] = useState<string>('');

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
    if (typeFilter !== 'All' && a.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a.locationName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BellRing className="w-5 h-5 text-orange-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Real-Time Movement & Hazard Alerts</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Emergency broadcasts, geological slip warnings, cloudburst bulletins, and dynamic corridor re-routing advisories.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAlertsRead}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <CheckCheck className="w-4 h-4 text-cyan-400" />
              <span>Mark All As Read</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsReportingModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-1.5"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Report Hazard</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
          
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alert title, location, road code..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>

          <div className="flex items-center flex-wrap gap-2 text-xs">
            {/* Severity */}
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="All">All Severities</option>
              <option value="CRITICAL">🔴 Critical</option>
              <option value="HIGH">🟠 High</option>
              <option value="MODERATE">🟡 Moderate</option>
              <option value="LOW">🟢 Low</option>
            </select>

            {/* Type */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 text-xs focus:outline-none"
            >
              <option value="All">All Hazard Types</option>
              <option value="Landslide">Landslides</option>
              <option value="Weather">Weather & Rain</option>
              <option value="Road">Road Blocks & Damage</option>
              <option value="Emergency">Disaster & Relief</option>
            </select>
          </div>

        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-800 rounded-2xl text-xs text-slate-400">
            No active alerts matching your filter criteria.
          </div>
        ) : (
          filteredAlerts.map(alert => {
            const isCritical = alert.severity === 'CRITICAL';
            const isHigh = alert.severity === 'HIGH';

            return (
              <div
                key={alert.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg ${
                  !alert.isRead 
                    ? isCritical 
                      ? 'bg-red-950/20 border-red-500/50' 
                      : isHigh 
                      ? 'bg-orange-950/20 border-orange-500/50' 
                      : 'bg-slate-900 border-cyan-500/40'
                    : 'bg-slate-900/60 border-slate-800/80 opacity-80'
                }`}
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                      isHigh ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                      alert.severity === 'MODERATE' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                      'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {alert.severity}
                    </span>

                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5 rounded bg-slate-950 border border-slate-800">
                      {alert.type}
                    </span>

                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">{alert.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">{alert.message}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>📍 {alert.locationName}, {alert.state}</span>
                    <span>🕒 {alert.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {alert.actionRoute && (
                    <button
                      type="button"
                      onClick={() => {
                        markAlertRead(alert.id);
                        navigate(alert.actionRoute!);
                      }}
                      className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>Take Action</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {!alert.isRead ? (
                    <button
                      type="button"
                      onClick={() => markAlertRead(alert.id)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition-colors flex items-center gap-1"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Read</span>
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium px-2 py-1">Archived</span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
