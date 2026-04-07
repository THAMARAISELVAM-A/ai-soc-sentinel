import React, { useMemo, useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";

const DOMAIN_COLORS = {
  CYBER: "#3b82f6",
  FINANCE: "#f59e0b",
  GEOINT: "#10b981"
};

// Simulated LEO satellite constellation (lat/lng updated via orbital physics sim)
const SAT_INITIAL = Array.from({ length: 28 }, (_, i) => ({
  id: `SAT-${String(i + 1).padStart(3, '0')}`,
  lat: (Math.random() - 0.5) * 160,
  lng: (Math.random() - 0.5) * 360,
  alt: 0.18 + Math.random() * 0.1,
  speed: (0.4 + Math.random() * 0.3) * (Math.random() > 0.5 ? 1 : -1),
  inclination: 28 + Math.random() * 90,
  type: i < 10 ? 'ISS/LEO' : i < 20 ? 'Starlink' : 'Recon',
}));

export function GlobeLayer({ dim, countries, arcs, rings, mapPoints, liveMode, globeRef, activeDomain }) {
  const domainColor = DOMAIN_COLORS[activeDomain] || "#3b82f6";
  const [satellites, setSatellites] = useState(SAT_INITIAL);
  const animRef = useRef();
  const frameRef = useRef(0);

  // Orbital simulation — update satellite positions every frame
  useEffect(() => {
    const tick = () => {
      frameRef.current++;
      // Only update positions every 4 frames for performance
      if (frameRef.current % 4 === 0) {
        setSatellites(prev => prev.map(sat => {
          const newLng = ((sat.lng + sat.speed + 180) % 360) - 180;
          // Simulate inclination as a sinusoidal latitude wobble
          const phase = (newLng / 180) * Math.PI;
          const newLat = Math.sin(phase) * (sat.inclination / 2);
          return { ...sat, lat: newLat, lng: newLng };
        }));
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  const eliteArcs = useMemo(() => arcs.slice(-12), [arcs]);
  const eliteRings = useMemo(() => rings.slice(-4), [rings]);

  const globeData = useMemo(() => mapPoints.map(p => ({
    ...p,
    size: p.size || 0.15,
    color: domainColor
  })), [mapPoints, domainColor]);

  // Satellite trails — last positions as custom paths
  const satTrails = useMemo(() => satellites.map(sat => ({
    coords: [
      [sat.lat, sat.lng, sat.alt + 0.02],
      [sat.lat - sat.speed * 0.5, ((sat.lng - sat.speed * 6) + 180) % 360 - 180, sat.alt + 0.02],
    ]
  })), [satellites]);

  const ringHsl = useMemo(() => {
    if (activeDomain === 'FINANCE') return '38, 92%, 50%';
    if (activeDomain === 'GEOINT') return '162, 84%, 39%';
    return '217, 91%, 60%';
  }, [activeDomain]);

  return (
    <div className="wm-globe-container" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Globe
        ref={globeRef}
        width={dim.w}
        height={dim.h}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={domainColor}
        atmosphereAltitude={0.2}

        /* ── GLOBE SURFACE ── */
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"

        /* ── HEX POLYGON GRID overlay (semi-transparent, from countries data) ── */
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.65}
        hexPolygonColor={() => `color-mix(in srgb, ${domainColor} 18%, transparent)`}
        hexPolygonAltitude={0.008}

        /* ── ATTACK ARCS ── */
        arcsData={liveMode ? eliteArcs : []}
        arcColor={(d) => d.color || (d.severity === 'critical' ? '#ef4444' : domainColor)}
        arcAltitudeAutoscale={0.45}
        arcDashLength={0.5}
        arcDashGap={3}
        arcDashAnimateTime={1000}
        arcStroke={0.6}
        arcLabel={(d) => `<div style="background:rgba(0,0,0,0.9);padding:8px 12px;border-radius:6px;border:1px solid #ef4444;font-size:11px;color:white">${d.color?.includes('ef4444') ? '🔴 CRITICAL' : '⚠️ HIGH'} THREAT ARC</div>`}

        /* ── PULSE RINGS ── */
        ringsData={liveMode ? eliteRings : []}
        ringColor={() => (t) => `hsla(${ringHsl}, ${0.85 * (1 - t)})`}
        ringMaxRadius={6}
        ringPropagationSpeed={3.5}
        ringRepeatPeriod={700}

        /* ── THREAT NODES (HTML pins) ── */
        htmlElementsData={liveMode ? globeData.slice(-18) : []}
        htmlElement={(d) => {
          const el = document.createElement('div');
          el.style.cssText = 'pointer-events: none; transform: translate(-50%, -100%);';
          el.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
              <div style="
                background: white; width: 8px; height: 8px; border-radius: 50%;
                box-shadow: 0 0 16px ${domainColor}, 0 0 30px ${domainColor}55;
                border: 2px solid ${domainColor}; animation: pulse 1.5s infinite;
              "></div>
              <div style="
                background: rgba(1,2,4,0.95); border: 1px solid ${domainColor}55;
                color: white; padding: 6px 12px; border-radius: 6px;
                font-family: 'JetBrains Mono',monospace; font-size: 9px;
                backdrop-filter: blur(12px); min-width: 100px; text-align:center;
                box-shadow: 0 8px 24px rgba(0,0,0,0.7);
              ">
                <div style="color:${domainColor};font-weight:900;letter-spacing:.12em;margin-bottom:3px;">${d.label || d.type || 'NODE'}</div>
                <div style="opacity:0.4;font-size:8px;">ID: ${Math.random().toString(36).substr(2,6).toUpperCase()}</div>
              </div>
            </div>
          `;
          return el;
        }}

        /* ── SATELLITES (custom 3D pins at altitude) ── */
        customLayerData={satellites}
        customThreeObject={(sat) => {
          const THREE = window.THREE;
          if (!THREE) return null;
          const group = new THREE.Group();

          // Satellite body (glowing cyan box)
          const color = sat.type === 'Recon' ? 0xff4444 : sat.type === 'ISS/LEO' ? 0x00ff88 : 0x00cfff;
          const geo = new THREE.BoxGeometry(0.6, 0.18, 0.6);
          const mat = new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 0.7 });
          group.add(new THREE.Mesh(geo, mat));

          // Solar panels (flat planes)
          const panelGeo = new THREE.BoxGeometry(1.6, 0.04, 0.35);
          const panelMat = new THREE.MeshLambertMaterial({ color: 0x2244aa, emissive: 0x1133aa, emissiveIntensity: 0.5 });
          const panel = new THREE.Mesh(panelGeo, panelMat);
          group.add(panel);

          return group;
        }}
        customThreeObjectUpdate={(obj, sat) => {
          const THREE = window.THREE;
          if (!THREE || !globeRef.current) return;
          Object.assign(obj.position, globeRef.current.getCoords(sat.lat, sat.lng, sat.alt));
        }}

        /* ── ROTATION ── */
        autoRotate={!liveMode}
        autoRotateSpeed={0.35}
      />
    </div>
  );
}
