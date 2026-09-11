import React from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.js';
import { 
  LayoutDashboard, 
  Route, 
  PackageCheck, 
  Users, 
  AlertOctagon, 
  Flame, 
  Radio, 
  Truck, 
  BellRing, 
  BarChart3, 
  Settings2,
  Shield,
  Layers
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { alerts, emergencies, vehicles, userRole } = useApp();

  const unreadAlertsCount = alerts.filter(a => !a.isRead).length;
  const activeEmergenciesCount = emergencies.filter(e => e.status !== 'Resolved').length;
  const availableVehiclesCount = vehicles.filter(v => v.status === 'Available').length;

  const navItems = [
    { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/route-planner', label: 'Smart Route Planner', icon: Route },
    { to: '/freight-optimizer', label: 'Freight Optimizer', icon: PackageCheck },
    { to: '/passenger-accessibility', label: 'Passenger Accessibility', icon: Users },
    { to: '/risk-intelligence', label: 'Risk Intelligence', icon: AlertOctagon },
    { 
      to: '/emergency-logistics', 
      label: 'Emergency Logistics', 
      icon: Flame, 
      badge: activeEmergenciesCount > 0 ? activeEmergenciesCount : undefined,
      badgeColor: 'bg-red-500 text-white animate-pulse'
    },
    { to: '/connectivity-intelligence', label: 'Connectivity Intel', icon: Radio },
    { 
      to: '/fleet-management', 
      label: 'Fleet Management', 
      icon: Truck, 
      badge: availableVehiclesCount > 0 ? `${availableVehiclesCount} avail` : undefined,
      badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
    },
    { 
      to: '/alerts', 
      label: 'Alerts', 
      icon: BellRing, 
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined,
      badgeColor: 'bg-orange-500 text-white'
    },
    { to: '/analytics', label: 'Analytics', icon: BarChart3 },
    { to: '/settings', label: 'Settings', icon: Settings2 }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Role Context Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold uppercase tracking-wider text-[11px] text-slate-300">Command Center Role</span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-white tracking-wide">{userRole}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => `
                flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group
                ${isActive 
                  ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-500/10' 
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent'}
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Regional Status Summary Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/40 text-[11px] text-slate-400 space-y-2">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium text-slate-300">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            NER Region State
          </span>
          <span className="text-emerald-400 font-semibold">8 States Monitored</span>
        </div>
        <div className="text-[10px] text-slate-500 leading-relaxed">
          Assam • Arunachal • Manipur • Meghalaya • Mizoram • Nagaland • Tripura • Sikkim
        </div>
      </div>
    </aside>
  );
};
