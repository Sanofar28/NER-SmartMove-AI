import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext.js';
import { RoadSegment, Vehicle, RiskZone, EmergencyRequest } from '../types.js';
import { AlertTriangle, ShieldCheck, Truck, AlertCircle, Navigation, Info, Eye } from 'lucide-react';

interface NERMapProps {
  heightClass?: string;
  focusLocationId?: string;
  showFilters?: boolean;
}

export const NERMap: React.FC<NERMapProps> = ({ 
  heightClass = 'h-[520px]', 
  focusLocationId,
  showFilters = true 
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const { locations, roadSegments, vehicles, riskZones, emergencies, selectedLocation, setSelectedLocation } = useApp();

  const [filterLayer, setFilterLayer] = useState<{
    roads: boolean;
    vehicles: boolean;
    risks: boolean;
    emergencies: boolean;
  }>({
    roads: true,
    vehicles: true,
    risks: true,
    emergencies: true
  });

  const [inspectedEntity, setInspectedEntity] = useState<{
    type: 'road' | 'vehicle' | 'risk' | 'emergency' | 'location';
    title: string;
    subtitle: string;
    riskLevel?: string;
    status?: string;
    details: string;
    action?: string;
    alternative?: string;
    coordinates?: [number, number];
  } | null>(null);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Northeast India centroid approximately lat 26.2, lng 92.8
      const map = L.map(mapContainerRef.current, {
        center: [26.15, 92.8],
        zoom: 7,
        minZoom: 6,
        maxZoom: 14,
        zoomControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // High-performance OpenStreetMap CartoDB Dark or Voyager style tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      layerGroupRef.current = layerGroup;
    }

    return () => {
      // Clean up on component unmount
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Pan to focused or selected location
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const targetLoc = locations.find(l => l.id === focusLocationId) || selectedLocation;
    if (targetLoc) {
      mapInstanceRef.current.flyTo([targetLoc.lat, targetLoc.lng], 9, { duration: 1.2 });
    }
  }, [focusLocationId, selectedLocation]);

  // Render Map Markers, Polylines and Risk Zones
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroupRef.current) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // 1. Draw Road Segments (Polylines)
    if (filterLayer.roads) {
      roadSegments.forEach(road => {
        let color = '#10b981'; // Green Safe
        let dashArray = undefined;
        let weight = 4;

        if (road.status === 'BLOCKED') {
          color = '#ef4444'; // Red Blocked
          dashArray = '6, 8';
          weight = 5;
        } else if (road.riskLevel === 'CRITICAL' || road.status === 'HIGH RISK') {
          color = '#ea580c'; // Deep Orange / Red
          weight = 5;
        } else if (road.riskLevel === 'HIGH') {
          color = '#f97316'; // Orange
        } else if (road.riskLevel === 'MODERATE') {
          color = '#eab308'; // Yellow
        }

        const polyline = L.polyline(road.coordinates, {
          color,
          weight,
          opacity: 0.85,
          dashArray
        });

        polyline.on('click', () => {
          setInspectedEntity({
            type: 'road',
            title: `${road.highwayCode} — ${road.name}`,
            subtitle: `Status: ${road.status} | Risk Level: ${road.riskLevel}`,
            riskLevel: road.riskLevel,
            status: road.status,
            details: `Distance: ${road.distanceKm} km | Landslide Risk: ${road.landslideRiskPercent}% | Soil: ${road.soilMoistureLevel} | Slope: ${road.slopeDegrees}°`,
            action: road.status === 'BLOCKED' ? 'Divert all traffic via designated mountain bypass' : 'Passable with mountain vigilance',
            alternative: road.riskLevel === 'HIGH' || road.status === 'BLOCKED' ? 'Take secondary ridge bypass corridor' : undefined,
            coordinates: road.coordinates[0]
          });
        });

        polyline.addTo(layerGroup);
      });
    }

    // 2. Draw Locations (Hubs)
    locations.forEach(loc => {
      const isSelected = selectedLocation?.id === loc.id;
      const markerHtml = `
        <div class="relative flex items-center justify-center cursor-pointer group">
          <div class="w-7 h-7 rounded-full bg-slate-900 border-2 ${isSelected ? 'border-cyan-400 ring-4 ring-cyan-500/30' : 'border-slate-400'} flex items-center justify-center text-xs font-bold text-white shadow-lg">
            ${loc.accessibilityScore}
          </div>
          <div class="absolute -bottom-6 bg-slate-900/90 text-white text-[10px] px-2 py-0.5 rounded shadow whitespace-nowrap border border-slate-700 pointer-events-none">
            ${loc.name}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        html: markerHtml,
        className: 'custom-div-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([loc.lat, loc.lng], { icon });
      marker.on('click', () => {
        setSelectedLocation(loc);
        setInspectedEntity({
          type: 'location',
          title: `${loc.name} (${loc.state})`,
          subtitle: `Accessibility Score: ${loc.accessibilityScore}/100 | Elevation: ${loc.elevationMeters}m`,
          details: `Terrain: ${loc.terrainType} | Connectivity: ${loc.connectivityPercent}% | Weather: ${loc.weatherSummary.condition} (${loc.weatherSummary.rainfallMm}mm rain)`,
          action: loc.accessibilityScore < 50 ? 'Critical supply replenishment prioritized' : 'Hub operational with active depot telemetry',
          coordinates: [loc.lat, loc.lng]
        });
      });
      marker.addTo(layerGroup);
    });

    // 3. Draw Risk Zones
    if (filterLayer.risks) {
      riskZones.forEach(rz => {
        const markerHtml = `
          <div class="w-8 h-8 rounded-full bg-orange-600/30 border-2 border-orange-500 flex items-center justify-center text-white animate-pulse shadow-lg cursor-pointer">
            <span class="text-xs">⚠️</span>
          </div>
        `;
        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-risk-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([rz.lat, rz.lng], { icon });
        marker.on('click', () => {
          setInspectedEntity({
            type: 'risk',
            title: `INCIDENT RISK: ${rz.name}`,
            subtitle: `Location: ${rz.locationName} (${rz.state})`,
            riskLevel: rz.riskLevel,
            details: `Risk: ${rz.riskScore}% (${rz.riskType}) | Rainfall: ${rz.rainfallMm}mm | Slope: ${rz.slopeDegrees}° | Past Incidents: ${rz.previousIncidentsCount}`,
            action: rz.recommendedAction,
            alternative: rz.alternativeRouteName,
            coordinates: [rz.lat, rz.lng]
          });
        });
        marker.addTo(layerGroup);
      });
    }

    // 4. Draw Vehicles (Blue Markers)
    if (filterLayer.vehicles) {
      vehicles.forEach(veh => {
        const markerHtml = `
          <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-xs shadow-md cursor-pointer hover:scale-110 transition-transform">
            🚚
          </div>
        `;
        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-veh-icon',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([veh.lat, veh.lng], { icon });
        marker.on('click', () => {
          setInspectedEntity({
            type: 'vehicle',
            title: `Vehicle: ${veh.registrationNumber} (${veh.type})`,
            subtitle: `Driver: ${veh.driverName} (${veh.driverPhone})`,
            status: veh.status,
            details: `Location: ${veh.currentLocationName} | Fuel: ${veh.fuelPercent}% | 4WD: ${veh.fourWheelDrive ? 'Yes' : 'No'} | Clearance: ${veh.terrainClearanceMm}mm`,
            action: veh.currentAssignment ? `Assigned to: ${veh.currentAssignment.taskTitle} (ETA: ${veh.currentAssignment.eta})` : 'Standing by at depot for immediate dispatch',
            coordinates: [veh.lat, veh.lng]
          });
        });
        marker.addTo(layerGroup);
      });
    }

    // 5. Draw Active Emergencies (Dark Red Pulse)
    if (filterLayer.emergencies) {
      emergencies.filter(e => e.status !== 'Resolved').forEach(em => {
        const markerHtml = `
          <div class="relative flex items-center justify-center cursor-pointer">
            <span class="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-red-400 opacity-75"></span>
            <div class="w-8 h-8 rounded-full bg-red-700 border-2 border-white flex items-center justify-center text-white text-xs shadow-xl font-bold">
              🚨
            </div>
          </div>
        `;
        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-em-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([em.lat, em.lng], { icon });
        marker.on('click', () => {
          setInspectedEntity({
            type: 'emergency',
            title: `CRITICAL EMERGENCY: ${em.title}`,
            subtitle: `Target: ${em.locationName} (${em.state})`,
            riskLevel: 'CRITICAL',
            status: em.status,
            details: `Resource: ${em.requiredResource} | Priority: ${em.priority} | Staging Depot: ${em.nearestWarehouse}`,
            action: `Avoids: ${em.blockedRouteAvoided} | Recommended: ${em.recommendedRouteName} (ETA: ${em.eta})`,
            alternative: em.recommendedRouteName,
            coordinates: [em.lat, em.lng]
          });
        });
        marker.addTo(layerGroup);
      });
    }

  }, [locations, roadSegments, vehicles, riskZones, emergencies, selectedLocation, filterLayer]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
      {/* Top Map Layer Filters */}
      {showFilters && (
        <div className="absolute top-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 shadow-lg flex flex-wrap gap-2 text-xs">
          <span className="text-slate-400 font-semibold self-center mr-1">Layers:</span>
          <button 
            type="button"
            onClick={() => setFilterLayer(prev => ({ ...prev, roads: !prev.roads }))}
            className={`px-2.5 py-1 rounded transition-colors ${filterLayer.roads ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-medium' : 'bg-slate-800 text-slate-400'}`}
          >
            🛣️ Roads
          </button>
          <button 
            type="button"
            onClick={() => setFilterLayer(prev => ({ ...prev, vehicles: !prev.vehicles }))}
            className={`px-2.5 py-1 rounded transition-colors ${filterLayer.vehicles ? 'bg-blue-500/20 text-blue-300 border border-blue-500/50 font-medium' : 'bg-slate-800 text-slate-400'}`}
          >
            🚚 Vehicles
          </button>
          <button 
            type="button"
            onClick={() => setFilterLayer(prev => ({ ...prev, risks: !prev.risks }))}
            className={`px-2.5 py-1 rounded transition-colors ${filterLayer.risks ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 font-medium' : 'bg-slate-800 text-slate-400'}`}
          >
            ⚠️ Risk Zones
          </button>
          <button 
            type="button"
            onClick={() => setFilterLayer(prev => ({ ...prev, emergencies: !prev.emergencies }))}
            className={`px-2.5 py-1 rounded transition-colors ${filterLayer.emergencies ? 'bg-red-500/20 text-red-300 border border-red-500/50 font-medium' : 'bg-slate-800 text-slate-400'}`}
          >
            🚨 Emergencies
          </button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-3 right-3 z-[1000] bg-slate-900/90 backdrop-blur-md px-3 py-2 rounded-lg border border-slate-700 shadow-lg text-[11px] text-slate-300 space-y-1">
        <div className="font-semibold text-slate-200 border-b border-slate-800 pb-1 mb-1">Status Legend</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Safe</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span> Moderate Risk</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> High Risk</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Critical / Blocked</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> Vehicle</div>
        <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-800 animate-ping"></span> Emergency</div>
      </div>

      {/* Leaflet DOM container */}
      <div ref={mapContainerRef} className={`w-full ${heightClass} z-0`} />

      {/* Interactive Entity Inspection Drawer */}
      {inspectedEntity && (
        <div className="absolute bottom-3 left-3 right-3 z-[1000] max-w-2xl mx-auto bg-slate-900/95 backdrop-blur-lg border border-slate-700 rounded-xl p-4 shadow-2xl animate-in fade-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase bg-slate-800 text-cyan-400 border border-slate-700">
                  {inspectedEntity.type}
                </span>
                {inspectedEntity.riskLevel && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                    inspectedEntity.riskLevel === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    inspectedEntity.riskLevel === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' :
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  }`}>
                    {inspectedEntity.riskLevel} RISK
                  </span>
                )}
                {inspectedEntity.status && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {inspectedEntity.status}
                  </span>
                )}
              </div>
              <h4 className="text-base font-bold text-white mt-1">{inspectedEntity.title}</h4>
              <p className="text-xs text-slate-400">{inspectedEntity.subtitle}</p>
            </div>
            <button 
              type="button"
              onClick={() => setInspectedEntity(null)}
              className="text-slate-400 hover:text-white text-sm p-1 rounded hover:bg-slate-800"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80">
            {inspectedEntity.details}
          </div>

          {inspectedEntity.action && (
            <div className="mt-2 text-xs flex items-start gap-2 text-emerald-400 bg-emerald-950/30 p-2 rounded-lg border border-emerald-800/40">
              <span className="font-semibold text-emerald-300 shrink-0">Recommended Action:</span>
              <span>{inspectedEntity.action}</span>
            </div>
          )}

          {inspectedEntity.alternative && (
            <div className="mt-2 text-xs flex items-start gap-2 text-amber-400 bg-amber-950/30 p-2 rounded-lg border border-amber-800/40">
              <span className="font-semibold text-amber-300 shrink-0">Alternative Route:</span>
              <span>{inspectedEntity.alternative}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
