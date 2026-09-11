import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Fuel,
  Users,
  FileSpreadsheet
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const { roadSegments, locations, vehicles, emergencies } = useApp();

  const [timeframe, setTimeframe] = useState<'7d' | '30d' | 'Monsoon 2026'>('30d');

  // State-wise breakdown calculations
  const states = [
    { name: 'Assam', hubs: 3, criticalRoads: 2, avgAccessibility: 88, avgRainfall: 68, activeDispatches: 4 },
    { name: 'Arunachal Pradesh', hubs: 2, criticalRoads: 4, avgAccessibility: 42, avgRainfall: 110, activeDispatches: 3 },
    { name: 'Meghalaya', hubs: 1, criticalRoads: 2, avgAccessibility: 65, avgRainfall: 140, activeDispatches: 2 },
    { name: 'Manipur', hubs: 1, criticalRoads: 2, avgAccessibility: 52, avgRainfall: 75, activeDispatches: 2 },
    { name: 'Nagaland', hubs: 1, criticalRoads: 2, avgAccessibility: 56, avgRainfall: 80, activeDispatches: 1 },
    { name: 'Mizoram', hubs: 1, criticalRoads: 2, avgAccessibility: 51, avgRainfall: 95, activeDispatches: 1 },
    { name: 'Tripura', hubs: 1, criticalRoads: 1, avgAccessibility: 79, avgRainfall: 60, activeDispatches: 1 },
    { name: 'Sikkim', hubs: 1, criticalRoads: 3, avgAccessibility: 48, avgRainfall: 125, activeDispatches: 2 }
  ];

  // CSV Export Generator
  const handleExportCSV = () => {
    const headers = ['Segment ID', 'Highway Code', 'Name', 'Distance (km)', 'Slope (deg)', 'Landslide Risk (%)', 'Soil Moisture', 'Rainfall 24h (mm)', 'Connectivity (%)', 'Status'];
    const rows = roadSegments.map(r => [
      r.id,
      r.highwayCode,
      `"${r.name}"`,
      r.distanceKm,
      r.slopeDegrees,
      r.landslideRiskPercent,
      r.soilMoistureLevel,
      r.rainfallLast24hMm,
      r.connectivityPercent,
      r.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NER_SmartMove_Corridor_Analytics_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Regional Movement & Logistics Analytics</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Comparative state indicators, corridor vulnerability distribution, monsoon degradation trends, and freight efficiency.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs flex gap-1">
            {(['7d', '30d', 'Monsoon 2026'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setTimeframe(t)}
                className={`px-3 py-1 rounded transition-colors font-semibold ${
                  timeframe === t ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20 flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>

      {/* Top 4 KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Average Mountain Delay Index</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white mt-1">+38.4%</div>
          <div className="text-[10px] text-amber-400 mt-1">Due to heavy rains & slope slow-zones</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Critical Road Blockages</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-400 mt-1">17 Corridors</div>
          <div className="text-[10px] text-slate-400 mt-1">Sela, Sonapur & Jatinga active</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Avg Accessibility Index</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300 mt-1">62.8 / 100</div>
          <div className="text-[10px] text-emerald-400 mt-1">↑ 2.1% via alternate ridge corridors</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Freight Fleet Utilization</span>
            <Fuel className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-1">74.2%</div>
          <div className="text-[10px] text-slate-400 mt-1">4WD Bolero and Force trucks leading</div>
        </div>

      </div>

      {/* State-by-State Comparative Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>State-by-State Vulnerability & Movement Index</span>
            </h3>
            <p className="text-xs text-slate-400">Comparing the 8 states of the Northeast Region</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Telemetry: Live Sync</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-2">
                <th className="py-2.5 font-bold">State</th>
                <th className="py-2.5 font-bold">Accessibility Score</th>
                <th className="py-2.5 font-bold">Critical Corridors</th>
                <th className="py-2.5 font-bold">Avg 24h Rainfall</th>
                <th className="py-2.5 font-bold">Active Dispatches</th>
                <th className="py-2.5 font-bold">Status Assessment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {states.map(st => (
                <tr key={st.name} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-bold text-white">{st.name}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-cyan-300">{st.avgAccessibility}/100</span>
                      <div className="w-20 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full ${st.avgAccessibility >= 70 ? 'bg-emerald-400' : st.avgAccessibility >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                          style={{ width: `${st.avgAccessibility}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 font-semibold text-red-400">{st.criticalRoads} hazard links</td>
                  <td className="py-3 text-slate-300">{st.avgRainfall} mm</td>
                  <td className="py-3 font-bold text-white">{st.activeDispatches} convoys</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      st.avgAccessibility < 50 ? 'bg-red-500/20 text-red-400' :
                      st.avgAccessibility < 70 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {st.avgAccessibility < 50 ? 'High Vulnerability' : st.avgAccessibility < 70 ? 'Moderate Pass' : 'Stable Corridor'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
