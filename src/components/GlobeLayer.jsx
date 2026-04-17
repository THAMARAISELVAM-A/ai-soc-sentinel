import React, { useMemo, useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";

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

/**
 * GlobeLayer - High-Fidelity 3D Visualization for AI SOC Sentinel.
 * 
 * This component renders a photorealistic 3D Earth with high-resolution textures, 
 * topology bump-mapping, and interactive layers including:
 * - Real-time Threat Arcs (Attack vectors)
 * - Impact Rings (Anomaly locations)
 * - Strategic Infrastructure (Data centers, nodes)
 * - High-Altitude Satellite Constellation (LEO, Starlink, Recon)
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.dim - Dimension object with { w, h }.
 * @param {Object} props.countries - GeoJSON data for country borders.
 * @param {Array} props.arcs - Live attack arcs with start/end coordinates.
 * @param {Array} props.rings - Impact ring animations.
 * @param {Array} props.mapPoints - Strategic node points.
 * @param {boolean} props.liveMode - If true, enables orbital physics animations.
 * @param {React.MutableRefObject} props.globeRef - Ref for programmatic camera control.
 * @param {string} props.activeDomain - Current operational domain theme.
 */
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

  // 🛰️ Trails: Glowing orbit paths
  const satTrails = useMemo(() => satellites.map(sat => ({
    coords: [
      [sat.lat, sat.lng, sat.alt * 1.05],
      [sat.lat - sat.speed * 4, ((sat.lng - sat.speed * 12) + 180) % 360 - 180, sat.alt * 1.05],
    ]
  })), [satellites]);

  // 📡 Beams: Scanning beams from satellites to globe
  const satBeams = useMemo(() => {
    // Only show beams for a few satellites at a time to keep it clean
    return satellites.filter((_, i) => (frameRef.current + i * 10) % 200 < 30).map(sat => ({
      coords: [
        [sat.lat, sat.lng, sat.alt],
        [sat.lat, sat.lng, 0] // Beam hitting the surface
      ]
    }));
  }, [satellites]);

  const ringHsl = useMemo(() => {
    if (activeDomain === 'FINANCE') return '38, 92%, 50%';
    if (activeDomain === 'GEOINT') return '162, 84%, 39%';
    return '217, 91%, 60%';
  }, [activeDomain]);

  return (
    <div className="wm-globe-container" style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      {/* ── MAIN GLOBE LAYER ── */}
      <Globe
        ref={globeRef}
        width={dim.w}
        height={dim.h}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={domainColor}
        atmosphereAltitude={0.2}

        /* ── PREMIUM SURFACE ── */
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        /* ── DYNAMIC CLOUD LAYER (ALTITUDE: 1.01) ── */
        customLayerData={[{ id: 'clouds' }]}
        customThreeObject={() => {
          const geometry = new THREE.SphereGeometry(100 * 1.018, 75, 75);
          const material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/clouds/clouds.png'),
            transparent: true,
            opacity: 0.45,
            side: THREE.BackSide 
          });
          return new THREE.Mesh(geometry, material);
        }}
        customThreeObjectUpdate={(obj) => {
          obj.rotation.y += 0.00015; 
        }}

        /* ── HEX GRID ── */
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.7}
        hexPolygonColor={() => `color-mix(in srgb, ${domainColor} 20%, transparent)`}
        hexPolygonAltitude={0.005}

        /* ── ATTACK ARCS ── */
        arcsData={liveMode ? eliteArcs : []}
        arcColor={(d) => d.color || (d.severity === 'critical' ? '#f43f5e' : domainColor)}
        arcAltitudeAutoscale={0.5}
        arcDashLength={0.8}
        arcDashGap={3}
        arcDashAnimateTime={2500}
        arcStroke={0.5}

        /* ── PULSE RINGS ── */
        ringsData={liveMode ? eliteRings : []}
        ringColor={() => (t) => `hsla(${ringHsl}, ${0.9 * (1 - t)})`}
        ringMaxRadius={6}
        ringPropagationSpeed={2.5}

        /* ── SAT TRAILS & SCAN BEAMS ── */
        pathsData={liveMode ? [...satTrails, ...satBeams] : []}
        pathColor={(d) => d.coords.length === 2 && d.coords[1][2] === 0 ? `rgba(59, 130, 246, 0.4)` : `rgba(0, 207, 255, 0.08)`}
        pathDashLength={(d) => d.coords.length === 2 && d.coords[1][2] === 0 ? 1 : 0.15}
        pathDashGap={(d) => d.coords.length === 2 && d.coords[1][2] === 0 ? 0 : 0.02}
        pathDashAnimateTime={8000}
        pathStroke={(d) => d.coords.length === 2 && d.coords[1][2] === 0 ? 1.5 : 0.2}

        /* ── SATELLITE UNITS ── */
        objectsData={satellites}
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectThreeObject={(sat) => {
          const group = new THREE.Group();
          const color = sat.type === 'Recon' ? 0xff4444 : sat.type === 'ISS/LEO' ? 0x00ff88 : 0x00cfff;
          
          // Body
          const body = new THREE.Mesh(
            new THREE.BoxGeometry(1.2, 0.3, 1.2),
            new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 3 })
          );
          group.add(body);

          // Solar Wings
          const wingGeo = new THREE.PlaneGeometry(4, 0.8);
          const wingMat = new THREE.MeshLambertMaterial({ color: 0x112244, side: THREE.DoubleSide });
          const wings = new THREE.Mesh(wingGeo, wingMat);
          wings.rotation.x = Math.PI / 2;
          group.add(wings);

          // Radar Dish
          const dishGeo = new THREE.ConeGeometry(0.4, 0.4, 16);
          const dishMat = new THREE.MeshLambertMaterial({ color: 0xcccccc });
          const dish = new THREE.Mesh(dishGeo, dishMat);
          dish.position.y = -0.4;
          dish.rotation.x = Math.PI;
          group.add(dish);

          return group;
        }}

        /* ── DATA NODES (HTML) ── */
        htmlElementsData={liveMode ? globeData.slice(-20) : []}
        htmlElement={(d) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;">
              <div style="width:12px;height:12px;border:2px solid ${domainColor};border-radius:50%;background:rgba(0,0,0,0.5);box-shadow:0 0 20px ${domainColor};"></div>
              <div style="background:rgba(2,4,10,0.85);border:1px solid ${domainColor}88;color:white;padding:6px 12px;border-radius:8px;font-size:10px;margin-top:8px;backdrop-filter:blur(12px);white-space:nowrap;font-weight:700;letter-spacing:1px;box-shadow:0 10px 30px rgba(0,0,0,0.5)">
                ${(d.label || 'NODE').toUpperCase()}
              </div>
            </div>`;
          return el;
        }}

        autoRotate={!liveMode}
        autoRotateSpeed={0.4}
      />
    </div>
  );
}
