import React, { useState, useEffect, useRef } from 'react';
import { POPULAR_LOCATIONS, INITIAL_NEARBY_CABS } from '../data/mockLocations';

export default function TrackingMap({
  pickup,
  dropoff,
  onSelectMapLocation,
  activeCab,
  rideStatus,
  driverAssigned
}) {
  const [zoom, setZoom] = useState(1);
  const [is3D, setIs3D] = useState(false);
  const [showTraffic, setShowTraffic] = useState(true);
  const [nearbyCabs, setNearbyCabs] = useState(INITIAL_NEARBY_CABS);
  const [driverProgress, setDriverProgress] = useState(0); // 0 to 1 along path
  const [driverPos, setDriverPos] = useState(null);
  const [mapTheme, setMapTheme] = useState('dark'); // 'dark' or 'warm'

  // Animate moving nearby cabs smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setNearbyCabs((prev) =>
        prev.map((cab) => {
          // Subtle wandering motion
          const angle = (cab.heading * Math.PI) / 180;
          const deltaX = Math.cos(angle) * 1.2;
          const deltaY = Math.sin(angle) * 1.2;
          let newX = cab.coords.x + deltaX;
          let newY = cab.coords.y + deltaY;

          // Boundary bounce within map coordinates (100 to 900 x, 100 to 600 y)
          let newHeading = cab.heading;
          if (newX < 150 || newX > 850) {
            newHeading = (180 - newHeading + 360) % 360;
          }
          if (newY < 120 || newY > 550) {
            newHeading = (360 - newHeading) % 360;
          }

          // Random slight turn
          if (Math.random() > 0.8) {
            newHeading = (newHeading + (Math.random() * 30 - 15) + 360) % 360;
          }

          return {
            ...cab,
            coords: { x: newX, y: newY },
            heading: newHeading
          };
        })
      );
    }, 150);

    return () => clearInterval(interval);
  }, []);

  // When ride is active, simulate driver driving along the route path
  useEffect(() => {
    if (!driverAssigned || !pickup || !dropoff) {
      setDriverProgress(0);
      setDriverPos(null);
      return;
    }

    const start = pickup.coords;
    const end = dropoff.coords;
    let currentStep = 0;
    const totalSteps = 240;

    const driveInterval = setInterval(() => {
      currentStep++;
      const progress = Math.min(1, currentStep / totalSteps);
      setDriverProgress(progress);

      // Quadratic bezier curve interpolation for natural city routing
      const midX = (start.x + end.x) / 2 + (start.y - end.y) * 0.2;
      const midY = (start.y + end.y) / 2 + (end.x - start.x) * 0.2;

      const t = progress;
      const curX = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
      const curY = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y;

      setDriverPos({ x: curX, y: curY });

      if (progress >= 1) {
        clearInterval(driveInterval);
      }
    }, 100);

    return () => clearInterval(driveInterval);
  }, [driverAssigned, pickup, dropoff]);

  // Generate curved path string between pickup and dropoff
  const getRoutePath = () => {
    if (!pickup || !dropoff) return '';
    const p1 = pickup.coords;
    const p2 = dropoff.coords;
    const midX = (p1.x + p2.x) / 2 + (p1.y - p2.y) * 0.2;
    const midY = (p1.y + p2.y) / 2 + (p2.x - p1.x) * 0.2;
    return `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
  };

  const handleSvgClick = (e) => {
    if (!onSelectMapLocation) return;
    const svg = e.currentTarget;
    const rect = svg.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 1000;
    const clickY = ((e.clientY - rect.top) / rect.height) * 700;

    // Find nearest popular location if within 60 units, otherwise custom pin
    let closest = null;
    let minDist = 9999;
    POPULAR_LOCATIONS.forEach((loc) => {
      const d = Math.hypot(loc.coords.x - clickX, loc.coords.y - clickY);
      if (d < minDist) {
        minDist = d;
        closest = loc;
      }
    });

    if (closest && minDist < 65) {
      onSelectMapLocation(closest);
    } else {
      onSelectMapLocation({
        id: `custom-${Date.now()}`,
        name: `Map Pin (${Math.round(clickX)}, ${Math.round(clickY)})`,
        address: 'Selected on Live Map',
        category: 'Custom Location',
        icon: 'map-pin',
        coords: { x: Math.round(clickX), y: Math.round(clickY) }
      });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[620px] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl flex flex-col">
      {/* Top Map HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        <div className="flex items-center gap-2 bg-[#0B0F17]/85 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg pointer-events-auto">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-semibold text-gray-200">
            {nearbyCabs.length} Velox Cabs Active in Radius
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-medium">
            Live Telemetry
          </span>
        </div>

        {/* Right HUD Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Traffic Toggle */}
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
              showTraffic
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300'
                : 'bg-[#0B0F17]/80 border-white/10 text-gray-400'
            }`}
          >
            🚦 Traffic {showTraffic ? 'ON' : 'OFF'}
          </button>

          {/* 3D Tilt Toggle */}
          <button
            onClick={() => setIs3D(!is3D)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all border ${
              is3D
                ? 'bg-sky-500/20 border-sky-500/40 text-sky-300'
                : 'bg-[#0B0F17]/80 border-white/10 text-gray-400'
            }`}
          >
            📐 3D View
          </button>

          {/* Zoom controls */}
          <div className="flex items-center bg-[#0B0F17]/90 rounded-full border border-white/10 overflow-hidden shadow-md">
            <button
              onClick={() => setZoom((z) => Math.min(1.4, z + 0.1))}
              className="px-2.5 py-1 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10"
              title="Zoom In"
            >
              +
            </button>
            <span className="text-[10px] text-gray-400 px-1">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((z) => Math.max(0.8, z - 0.1))}
              className="px-2.5 py-1 text-sm font-bold text-gray-300 hover:text-white hover:bg-white/10"
              title="Zoom Out"
            >
              -
            </button>
          </div>
        </div>
      </div>

      {/* Driver In-Transit Telemetry HUD Banner (if ride active) */}
      {driverAssigned && (
        <div className="absolute top-16 left-4 right-4 z-20 pointer-events-auto">
          <div className="bg-[#0B0F17]/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-3 shadow-2xl flex items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-black flex items-center justify-center font-bold text-base shadow-lg">
                🚗
              </div>
              <div>
                <div className="text-xs text-amber-400 font-semibold tracking-wide uppercase">
                  {driverProgress < 1 ? 'Chauffeur En Route' : 'Chauffeur Arrived!'}
                </div>
                <div className="text-sm font-bold text-white">
                  {driverAssigned.driverName} • {driverAssigned.car}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-right">
              <div>
                <div className="text-[10px] uppercase text-gray-400">ETA to Destination</div>
                <div className="text-base font-extrabold text-amber-400">
                  {driverProgress < 1 ? `${Math.max(1, Math.round((1 - driverProgress) * 12))} min` : '0 min'}
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-[10px] uppercase text-gray-400">Speed</div>
                <div className="text-xs font-semibold text-gray-200">46 km/h</div>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                OTP: 7429
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SVG Map Container */}
      <div
        className="w-full h-full flex-1 relative overflow-hidden cursor-crosshair select-none transition-transform duration-500 ease-out"
        style={{
          transform: is3D ? `perspective(900px) rotateX(24deg) scale(${zoom})` : `scale(${zoom})`,
          transformOrigin: 'center center'
        }}
      >
        <svg
          viewBox="0 0 1000 700"
          className="w-full h-full object-cover"
          onClick={handleSvgClick}
        >
          <defs>
            {/* Dark City Map Background Grid */}
            <linearGradient id="mapBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B0F19" />
              <stop offset="50%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#090D15" />
            </linearGradient>

            {/* River water gradient */}
            <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284C7" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#0369A1" stopOpacity="0.25" />
            </linearGradient>

            {/* Glowing route gradient */}
            <linearGradient id="routeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="50%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#10B981" />
            </linearGradient>

            {/* Road grid pattern */}
            <pattern id="roadGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
              <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
              <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
            </pattern>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base background */}
          <rect width="1000" height="700" fill="url(#mapBgGrad)" />
          <rect width="1000" height="700" fill="url(#roadGrid)" />

          {/* Curved Scenic River / Bay Area */}
          <path
            d="M 650 0 C 670 180, 780 250, 720 450 C 680 580, 850 640, 1000 680 L 1000 0 Z"
            fill="url(#riverGrad)"
          />
          <path
            d="M 650 0 C 670 180, 780 250, 720 450 C 680 580, 850 640, 1000 680"
            fill="none"
            stroke="rgba(56, 189, 248, 0.4)"
            strokeWidth="2"
            strokeDasharray="6 6"
          />

          {/* Green City Parks */}
          <rect x="220" y="320" width="110" height="90" rx="14" fill="#064E3B" fillOpacity="0.25" stroke="#10B981" strokeOpacity="0.2" />
          <text x="275" y="370" fill="#10B981" fillOpacity="0.6" fontSize="10" textAnchor="middle" fontWeight="bold">Central Park</text>

          <rect x="740" y="490" width="130" height="80" rx="14" fill="#064E3B" fillOpacity="0.2" stroke="#10B981" strokeOpacity="0.15" />
          <text x="805" y="535" fill="#10B981" fillOpacity="0.5" fontSize="10" textAnchor="middle" fontWeight="bold">Waterfront Esplanade</text>

          {/* Major Urban Highway Arteries */}
          <g stroke="rgba(255,255,255,0.09)" strokeWidth="14" strokeLinecap="round" fill="none">
            <path d="M 0 160 L 1000 160" />
            <path d="M 0 350 L 1000 350" />
            <path d="M 0 520 L 1000 520" />
            <path d="M 260 0 L 260 700" />
            <path d="M 510 0 L 510 700" />
            <path d="M 780 0 L 780 700" />
            <path d="M 120 700 L 880 0" />
          </g>

          {/* Inner Asphalt Highway lines */}
          <g stroke="rgba(30, 41, 59, 0.85)" strokeWidth="10" strokeLinecap="round" fill="none">
            <path d="M 0 160 L 1000 160" />
            <path d="M 0 350 L 1000 350" />
            <path d="M 0 520 L 1000 520" />
            <path d="M 260 0 L 260 700" />
            <path d="M 510 0 L 510 700" />
            <path d="M 780 0 L 780 700" />
            <path d="M 120 700 L 880 0" />
          </g>

          {/* Live Traffic Overlay Segments (Optional) */}
          {showTraffic && (
            <g strokeLinecap="round" fill="none" opacity="0.85">
              {/* Green fluid traffic */}
              <path d="M 30 160 L 420 160" stroke="#10B981" strokeWidth="4" />
              <path d="M 510 40 L 510 320" stroke="#10B981" strokeWidth="4" />
              <path d="M 600 350 L 980 350" stroke="#10B981" strokeWidth="4" />
              
              {/* Yellow moderate traffic */}
              <path d="M 420 160 L 680 160" stroke="#F59E0B" strokeWidth="4" strokeDasharray="8 4" />
              <path d="M 260 200 L 260 480" stroke="#F59E0B" strokeWidth="4" />

              {/* Red dense traffic */}
              <path d="M 440 350 L 580 350" stroke="#EF4444" strokeWidth="4" />
              <path d="M 780 200 L 780 380" stroke="#EF4444" strokeWidth="4" strokeDasharray="10 4" />
            </g>
          )}

          {/* District Labels */}
          <text x="780" y="140" fill="#94A3B8" fontSize="12" fontWeight="700" letterSpacing="1">AIRPORT TERMINAL 3</text>
          <text x="420" y="330" fill="#F59E0B" fontSize="13" fontWeight="800" letterSpacing="1">DOWNTOWN FINANCIAL CORE</text>
          <text x="260" y="200" fill="#94A3B8" fontSize="12" fontWeight="700" letterSpacing="1">SILICON CYBER PARK</text>
          <text x="510" y="440" fill="#94A3B8" fontSize="12" fontWeight="700" letterSpacing="1">GRAND CENTRAL METRO</text>
          <text x="720" y="410" fill="#38BDF8" fontSize="12" fontWeight="700" letterSpacing="1">WATERFRONT BAY</text>

          {/* Popular Landmark Markers */}
          {POPULAR_LOCATIONS.map((loc) => {
            const isPickup = pickup?.id === loc.id;
            const isDropoff = dropoff?.id === loc.id;
            return (
              <g
                key={loc.id}
                transform={`translate(${loc.coords.x}, ${loc.coords.y})`}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle
                  r={isPickup || isDropoff ? '12' : '6'}
                  fill={isPickup ? '#F59E0B' : isDropoff ? '#10B981' : '#334155'}
                  stroke="#FFFFFF"
                  strokeWidth={isPickup || isDropoff ? '3' : '1.5'}
                />
                {!isPickup && !isDropoff && (
                  <circle r="12" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
                )}
              </g>
            );
          })}

          {/* Active Route Polyline between Pickup and Dropoff */}
          {pickup && dropoff && (
            <g>
              {/* Outer Route Glow */}
              <path
                d={getRoutePath()}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="10"
                strokeOpacity="0.25"
                strokeLinecap="round"
                filter="url(#glowFilter)"
              />
              {/* Solid Base Route */}
              <path
                d={getRoutePath()}
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              {/* Animated Dashed Flow */}
              <path
                d={getRoutePath()}
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="2"
                strokeDasharray="8 12"
                strokeLinecap="round"
                className="route-dash-flow"
              />
            </g>
          )}

          {/* Pickup Pin Callout */}
          {pickup && (
            <g transform={`translate(${pickup.coords.x}, ${pickup.coords.y})`}>
              <circle r="22" fill="#F59E0B" fillOpacity="0.25" className="radar-ring" />
              <circle r="12" fill="#F59E0B" stroke="#000000" strokeWidth="2.5" />
              <text x="0" y="4" fill="#000000" fontSize="10" fontWeight="900" textAnchor="middle">P</text>
              <g transform="translate(0, -28)">
                <rect x="-65" y="-18" width="130" height="24" rx="6" fill="#0B0F17" stroke="#F59E0B" strokeWidth="1.5" />
                <text x="0" y="-3" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle">
                  PICKUP: {pickup.name.slice(0, 16)}...
                </text>
              </g>
            </g>
          )}

          {/* Dropoff Pin Callout */}
          {dropoff && (
            <g transform={`translate(${dropoff.coords.x}, ${dropoff.coords.y})`}>
              <circle r="22" fill="#10B981" fillOpacity="0.25" className="radar-ring" />
              <circle r="12" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">D</text>
              <g transform="translate(0, -28)">
                <rect x="-65" y="-18" width="130" height="24" rx="6" fill="#0B0F17" stroke="#10B981" strokeWidth="1.5" />
                <text x="0" y="-3" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle">
                  DEST: {dropoff.name.slice(0, 16)}...
                </text>
              </g>
            </g>
          )}

          {/* Nearby Moving Fleet Cabs */}
          {nearbyCabs.map((cab) => (
            <g
              key={cab.id}
              transform={`translate(${cab.coords.x}, ${cab.coords.y}) rotate(${cab.heading})`}
              className="cursor-pointer"
            >
              {/* Soft radar pulse behind each cab */}
              <circle r="16" fill="rgba(245, 158, 11, 0.12)" />
              {/* Car Body (Modern aerodynamic top-down view) */}
              <rect x="-7" y="-14" width="14" height="28" rx="4" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
              {/* Windshield */}
              <rect x="-5" y="-6" width="10" height="6" rx="1.5" fill="#38BDF8" fillOpacity="0.8" />
              {/* Rear glass */}
              <rect x="-4.5" y="6" width="9" height="4" rx="1" fill="#38BDF8" fillOpacity="0.6" />
              {/* Headlight beams */}
              <polygon points="-5,-14 5,-14 12,-32 -12,-32" fill="rgba(254, 240, 138, 0.18)" />
            </g>
          ))}

          {/* Assigned Driver Vehicle (Moving live on path during booked ride) */}
          {driverPos && (
            <g transform={`translate(${driverPos.x}, ${driverPos.y})`} className="car-glow">
              <circle r="32" fill="rgba(245, 158, 11, 0.28)" className="radar-ring" />
              <circle r="16" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="3" />
              {/* Animated Vehicle Silhouette */}
              <rect x="-8" y="-16" width="16" height="32" rx="5" fill="#000000" stroke="#FDE68A" strokeWidth="2" />
              <rect x="-5.5" y="-8" width="11" height="8" rx="2" fill="#38BDF8" />
              <polygon points="-6,-16 6,-16 16,-40 -16,-40" fill="rgba(254, 240, 138, 0.35)" />
              <text x="0" y="4" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">★</text>
            </g>
          )}
        </svg>

        {/* Bottom Interactive Legend / Tip */}
        <div className="absolute bottom-3 left-4 right-4 z-20 flex flex-wrap items-center justify-between text-xs text-gray-400 pointer-events-none">
          <div className="bg-[#0B0F17]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto flex items-center gap-2">
            <span>💡 Click anywhere on map to pin custom pickup or dropoff</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 bg-[#0B0F17]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 pointer-events-auto">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Pickup
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Destination
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block"></span> Velox Chauffeur
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
