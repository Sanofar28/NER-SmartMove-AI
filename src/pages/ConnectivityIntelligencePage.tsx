import React, { useState } from 'react';
import { useApp } from '../context/AppContext.js';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Download, 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  FileText, 
  MapPin, 
  Smartphone,
  HardDrive
} from 'lucide-react';

export const ConnectivityIntelligencePage: React.FC = () => {
  const { 
    isOffline, 
    toggleOfflineMode, 
    offlineQueue, 
    syncOfflineQueue, 
    roadSegments, 
    locations 
  } = useApp();

  const [downloadedPacks, setDownloadedPacks] = useState<string[]>([
    'Guwahati - Shillong Corridor (NH-06)',
    'Assam Brahmaputra Valley Grid'
  ]);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

  const lowConnRoads = roadSegments.filter(r => r.connectivityPercent < 60);

  const handleDownloadPack = (corridorName: string) => {
    setIsDownloading(corridorName);
    setTimeout(() => {
      setDownloadedPacks(prev => [...prev, corridorName]);
      setIsDownloading(null);
    }, 1200);
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-purple-400" />
            <h1 className="text-2xl font-black text-white tracking-tight">Connectivity & Offline Intelligence</h1>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dead-zone mapping, offline caching architecture, store-and-forward telemetry, and satellite fallback readiness.
          </p>
        </div>

        {/* Offline Toggle Simulation */}
        <button
          type="button"
          onClick={toggleOfflineMode}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all ${
            isOffline 
              ? 'bg-amber-950/70 text-amber-300 border-amber-800' 
              : 'bg-emerald-950/70 text-emerald-300 border-emerald-800'
          }`}
        >
          {isOffline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span>SIMULATING OFFLINE</span>
            </>
          ) : (
            <>
              <Wifi className="w-4 h-4 text-emerald-400" />
              <span>SYSTEM ONLINE</span>
            </>
          )}
        </button>
      </div>

      {/* Offline Status & Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Sync Queue Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <span>Offline Action Queue</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold">
              {offlineQueue.length} Pending
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Incident reports and emergency requests triggered during disconnected mountain passes are encrypted and queued in client IndexedDB storage.
          </p>

          <div className="pt-2 flex items-center justify-between">
            <button
              type="button"
              onClick={syncOfflineQueue}
              disabled={offlineQueue.length === 0 || isOffline}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-bold rounded-lg border border-slate-700 disabled:opacity-40 flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync Telemetry Now</span>
            </button>
          </div>
        </div>

        {/* Offline Navigation Engine */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span>Offline GPS Engine</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
              READY
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Local rule-based heuristic routing calculates safest routes even when completely disconnected from cellular towers and satellite internet.
          </p>

          <div className="text-[11px] text-emerald-400 font-medium">
            ✓ Turn-by-turn hill guidance cached
          </div>
        </div>

        {/* Satellite Handover */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <span>High-Altitude Satcom</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-[10px] font-bold">
              STANDBY
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Automated handover to GSAT-7A / NavIC emergency transponders when cellular signals drop below 15% RSSI in mountain gorges.
          </p>

          <div className="text-[11px] text-purple-300 font-medium">
            ✓ SOS burst messaging protocol active
          </div>
        </div>

      </div>

      {/* Downloadable Offline Corridor Map Packs */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Download className="w-4 h-4 text-cyan-400" />
              <span>Offline Corridor Vector Packs</span>
            </h3>
            <p className="text-xs text-slate-400">Download topographic elevation and routing tiles prior to alpine dispatch</p>
          </div>
          <span className="text-xs text-cyan-400 font-mono">2 / 5 Packs Cached</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {[
            { name: 'Guwahati - Shillong Corridor (NH-06)', size: '14.2 MB', desc: 'Meghalaya tableland & highway bridges' },
            { name: 'Tezpur - Bomdila - Tawang (NH-13)', size: '28.6 MB', desc: 'Sela Pass alpine terrain & switchbacks' },
            { name: 'Silchar - Aizawl Spine (NH-54)', size: '19.4 MB', desc: 'Mizoram ridge access & landslide zones' },
            { name: 'Dimapur - Kohima - Imphal (NH-02)', size: '22.1 MB', desc: 'Nagaland-Manipur highway lifeline' },
            { name: 'Gangtok - Nathula Border Line', size: '16.8 MB', desc: 'High-altitude Sikkim snow pass vectors' },
            { name: 'Assam Brahmaputra Valley Grid', size: '34.0 MB', desc: 'Flood-prone river basin crossings' }
          ].map((pack) => {
            const isInstalled = downloadedPacks.includes(pack.name);
            const isCurrentlyDownloading = isDownloading === pack.name;

            return (
              <div key={pack.name} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{pack.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{pack.size}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">{pack.desc}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80">
                  {isInstalled ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cached on Device</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDownloadPack(pack.name)}
                      disabled={isCurrentlyDownloading}
                      className="w-full py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{isCurrentlyDownloading ? 'Downloading Pack...' : 'Download Vector Pack'}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Critical Low Connectivity Corridors Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Monitored Mountain Gaps & Dead Zones (&lt;60% Signal)</span>
          </h3>
          <span className="text-xs text-slate-400">{lowConnRoads.length} Critical Sectors</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 pb-1">
                <th className="py-2 font-semibold">Corridor</th>
                <th className="py-2 font-semibold">Highway Code</th>
                <th className="py-2 font-semibold">Signal Uptime</th>
                <th className="py-2 font-semibold">Primary Carrier</th>
                <th className="py-2 font-semibold">Dead Zone Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {lowConnRoads.map(road => (
                <tr key={road.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-semibold text-slate-200">{road.name}</td>
                  <td className="py-3 text-cyan-400 font-mono">{road.highwayCode}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-400">{road.connectivityPercent}%</span>
                      <div className="w-16 bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-purple-500 rounded-full" 
                          style={{ width: `${road.connectivityPercent}%` }} 
                        />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">BSNL 4G / Airtel Sat Link</td>
                  <td className="py-3 text-slate-400 text-[11px]">
                    {road.connectivityPercent < 35 
                      ? 'Pre-cache offline route & mandate companion vehicle'
                      : 'Store-and-forward telemetry enabled'}
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
