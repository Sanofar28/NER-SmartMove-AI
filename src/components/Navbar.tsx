import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { UserRole } from '../types.js';
import { 
  Bell, 
  Wifi, 
  WifiOff, 
  Search, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders,
  ChevronDown,
  Compass,
  RefreshCw,
  UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { 
    userRole, 
    setUserRole, 
    isOffline, 
    toggleOfflineMode, 
    offlineQueue, 
    syncOfflineQueue, 
    alerts, 
    markAlertRead, 
    markAllAlertsRead,
    searchQuery, 
    setSearchQuery,
    setIsReportingModalOpen,
    demoSettings
  } = useApp();

  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const unreadAlerts = alerts.filter(a => !a.isRead);

  const roles: UserRole[] = ['ADMIN', 'LOGISTICS MANAGER', 'DRIVER', 'FIELD OFFICER'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-cyan-600 to-emerald-500 flex items-center justify-center text-white shadow-md shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight flex items-center gap-1.5 text-white">
                NER SmartMove <span className="text-cyan-400 font-mono text-xs px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800">AI</span>
              </div>
              <div className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Northeast India Movement & Logistics Intelligence
              </div>
            </div>
          </Link>

          {/* Demo Mode Badge */}
          {demoSettings.demoModeActive && (
            <Link 
              to="/settings" 
              className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800 hover:bg-emerald-900/50 transition-colors"
              title="Click to tune simulation parameters in Settings"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              DEMO DATA MODE
            </Link>
          )}
        </div>

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search locations, routes, vehicles, alerts..."
              className="w-full bg-slate-950/70 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500 transition-all"
            />
          </div>
        </form>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          
          {/* Report Road Issue Quick Trigger */}
          <button 
            type="button"
            onClick={() => setIsReportingModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-red-950/60 text-red-300 border border-red-800 hover:bg-red-900/60 transition-colors shadow-sm"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span className="hidden sm:inline">Report Issue</span>
          </button>

          {/* Online / Offline Switcher */}
          <div className="flex items-center gap-1.5">
            <button 
              type="button"
              onClick={toggleOfflineMode}
              className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-all border ${
                isOffline 
                  ? 'bg-amber-950/60 text-amber-300 border-amber-800 hover:bg-amber-900/60' 
                  : 'bg-emerald-950/60 text-emerald-300 border-emerald-800 hover:bg-emerald-900/60'
              }`}
              title="Click to toggle network simulation and test offline queueing"
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>OFFLINE MODE</span>
                  {offlineQueue.length > 0 && (
                    <span className="px-1.5 py-0.2 bg-amber-600 text-slate-950 rounded text-[10px] font-bold">
                      {offlineQueue.length} queued
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">ONLINE</span>
                </>
              )}
            </button>

            {/* Sync trigger if queue has items */}
            {offlineQueue.length > 0 && !isOffline && (
              <button 
                type="button"
                onClick={syncOfflineQueue}
                className="p-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900 text-xs flex items-center gap-1"
                title="Sync offline actions to backend"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[10px]">Sync ({offlineQueue.length})</span>
              </button>
            )}
          </div>

          {/* Alerts Notification Bell */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsAlertsOpen(!isAlertsOpen)}
              className="relative p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Notification Alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {unreadAlerts.length}
                </span>
              )}
            </button>

            {/* Alerts Dropdown Popover */}
            {isAlertsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-cyan-400" />
                    <span>Real-time NER Alerts</span>
                    <span className="text-[10px] text-slate-400">({unreadAlerts.length} unread)</span>
                  </div>
                  {unreadAlerts.length > 0 && (
                    <button 
                      type="button"
                      onClick={() => markAllAlertsRead()}
                      className="text-[11px] text-cyan-400 hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto space-y-2 divide-y divide-slate-800/60">
                  {alerts.slice(0, 5).map(alert => (
                    <div 
                      key={alert.id}
                      onClick={() => {
                        markAlertRead(alert.id);
                        if (alert.actionRoute) {
                          navigate(alert.actionRoute);
                          setIsAlertsOpen(false);
                        }
                      }}
                      className={`pt-2 first:pt-0 cursor-pointer p-1.5 rounded hover:bg-slate-800/60 transition-colors ${!alert.isRead ? 'bg-slate-800/40' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div className="font-semibold text-slate-200">{alert.title}</div>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                          alert.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          alert.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400' : 'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{alert.message}</p>
                      <div className="flex items-center justify-between mt-1 text-[10px] text-slate-500">
                        <span>{alert.locationName}</span>
                        <span>{alert.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 mt-2 text-center">
                  <Link 
                    to="/alerts" 
                    onClick={() => setIsAlertsOpen(false)}
                    className="text-cyan-400 font-semibold hover:underline text-xs"
                  >
                    View all alerts →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-200 transition-colors"
            >
              <UserCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden lg:inline">{userRole}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs">
                <div className="px-2 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800 mb-1">
                  Active Access Role
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setUserRole(r);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                      userRole === r ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{r}</span>
                    {userRole === r && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
};
