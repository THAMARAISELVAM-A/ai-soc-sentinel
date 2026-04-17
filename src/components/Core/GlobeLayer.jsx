import React, { useMemo, useRef, useEffect, useState } from "react";
import Globe from "react-globe.gl";
import * as THREE from "three";
import { 
  STRATEGIC_BASES, 
  UNDERSEA_CABLES, 
  CONFLICT_ZONES, 
  SANCTIONED_REGIONS,
  NUCLEAR_FACILITIES, 
  NATURAL_ANOMALIES,
  CYBER_APT_HUBS,
  STRATEGIC_WATERWAYS 
} from "../../constants/strategicAssets";

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
export function GlobeLayer({ dim, countries, arcs, rings, mapPoints, liveMode, globeRef, activeDomain, activeLayers }) {
  const domainColor = DOMAIN_COLORS[activeDomain] || "#3b82f6";
  const [satellites, setSatellites] = useState(SAT_INITIAL);
  const animRef = useRef();
  const frameRef = useRef(0);

  // Performance & Idle State
  const idleTimer = useRef(null);
  const isAnimating = useRef(true);

  const wakeGlobe = () => {
    if (!globeRef.current || isAnimating.current) return;
    isAnimating.current = true;
    try { globeRef.current.resumeAnimation(); } catch {}
    scheduleIdlePause();
  };

  const scheduleIdlePause = () => {
    if (idleTimer.current) clearTimeout(idleTimer.current);
    idleTimer.current = setTimeout(() => {
      if (!globeRef.current || !isAnimating.current) return;
      if (globeRef.current.controls()?.autoRotate) return;
      isAnimating.current = false;
      try { globeRef.current.pauseAnimation(); } catch {}
    }, 10000); // Extended to 10s for better UX
  };

  // ── VISIBILITY & RESOURCE OPTIMIZATION ───────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!globeRef.current) return;
      if (document.hidden) {
        globeRef.current.pauseAnimation();
      } else {
        globeRef.current.resumeAnimation();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ── ORBITAL SIMULATION (High-Resolution Delta Timing) ──
  useEffect(() => {
    let lastTime = performance.now();
    const tick = (now) => {
      const delta = now - lastTime;
      if (delta > 32) { // 30fps simulation frequency
        lastTime = now;
        frameRef.current++;
        setSatellites(prev => prev.map(sat => {
          const newLng = ((sat.lng + sat.speed + 180) % 360) - 180;
          const phase = (newLng / 180) * Math.PI;
          const newLat = Math.sin(phase) * (sat.inclination / 2);
          return { ...sat, lat: newLat, lng: newLng };
        }));
      }
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animRef.current);
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, []);

  // Visual Enhancement Injection (Professional Multi-Stage Integration)
  useEffect(() => {
    if (!globeRef.current) return;
    const globe = globeRef.current;
    const scene = globe.scene();
    
    try {
      // 1. Tactical Camera-Relative Light for Depth
      const camLight = new THREE.DirectionalLight(0xffffff, 0.4);
      camLight.position.set(5, 3, 10);
      scene.add(camLight);

      // 2. Advanced Atmospheric Gutter Layer
      const atmosphereGeo = new THREE.SphereGeometry(100 * 1.15, 60, 60);
      const atmosphereMat = new THREE.MeshBasicMaterial({
        color: domainColor,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.1
      });
      const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
      scene.add(atmosphere);

      // 3. Dynamic Light Sync Controller
      let lightAnimRef;
      const updateLights = () => {
        if (globeRef.current) {
          const cam = globeRef.current.camera();
          camLight.position.copy(cam.position);
          camLight.position.multiplyScalar(1.2);
        }
        lightAnimRef = requestAnimationFrame(updateLights);
      };
      lightAnimRef = requestAnimationFrame(updateLights);

      // 4. Starfield Production
      const starCount = 1400;
      const starPositions = new Float32Array(starCount * 3);
      for (let i = 0; i < starCount; i++) {
        const r = 300 + Math.random() * 500;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i * 3 + 2] = r * Math.cos(phi);
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
      const starMat = new THREE.PointsMaterial({ size: 0.8, color: 0xffffff, transparent: true, opacity: 0.5 });
      scene.add(new THREE.Points(starGeo, starMat));

      return () => {
         cancelAnimationFrame(lightAnimRef);
         scene.remove(camLight);
         scene.remove(atmosphere);
      };

    } catch (e) { console.warn("Engine enhancement failed", e); }
    scheduleIdlePause();
  }, [domainColor]);

  const eliteArcs = useMemo(() => arcs.slice(-12), [arcs]);
  const eliteRings = useMemo(() => rings.slice(-4), [rings]);

  const globeData = useMemo(() => mapPoints.map(p => ({
    ...p,
    size: p.size || 0.15,
    color: domainColor
  })), [mapPoints, domainColor]);

  // 🛰️ Trails
  const satTrails = useMemo(() => satellites.map(sat => ({
    coords: [
      [sat.lat, sat.lng, sat.alt * 1.05],
      [sat.lat - 0.5, ((sat.lng - 4) + 180) % 360 - 180, sat.alt * 1.05],
    ]
  })), [satellites]);

  // 📡 Beams
  const satBeams = useMemo(() => {
    return satellites.filter((_, i) => (frameRef.current + i * 5) % 150 < 40).map(sat => ({
      coords: [
        [sat.lat, sat.lng, sat.alt],
        [sat.lat, sat.lng, 0]
      ]
    }));
  }, [satellites]);

  const ringHsl = useMemo(() => {
    if (activeDomain === 'FINANCE') return '45, 92%, 50%';
    if (activeDomain === 'GEOINT') return '160, 84%, 45%';
    return '199, 89%, 48%';
  }, [activeDomain]);

  // ── STRATEGIC LAYER DATA ──
  const strategicCables = useMemo(() => activeLayers.includes('cables') ? UNDERSEA_CABLES : [], [activeLayers]);
  const strategicConflicts = useMemo(() => {
    let polygons = [];
    if (activeLayers.includes('conflict')) polygons.push(...CONFLICT_ZONES);
    if (activeLayers.includes('sanctions')) polygons.push(...SANCTIONED_REGIONS);
    return polygons;
  }, [activeLayers]);

  const strategicPoints = useMemo(() => {
    const pts = [];
    if (activeLayers.includes('military')) pts.push(...STRATEGIC_BASES.map(b => ({ ...b, iconColor: '#f43f5e', type: 'military' })));
    if (activeLayers.includes('nuclear')) pts.push(...NUCLEAR_FACILITIES.map(n => ({ ...n, iconColor: '#10b981', type: 'nuclear' })));
    if (activeLayers.includes('natural')) pts.push(...NATURAL_ANOMALIES.map(a => ({ ...a, iconColor: '#06b6d4', type: 'natural' })));
    if (activeLayers.includes('cyber')) pts.push(...CYBER_APT_HUBS.map(c => ({ ...c, iconColor: '#8b5cf6', type: 'cyber' })));
    if (activeLayers.includes('waterways')) pts.push(...STRATEGIC_WATERWAYS.map(w => ({ ...w, iconColor: '#0ea5e9', type: 'waterway' })));
    return pts;
  }, [activeLayers]);

  return (
    <div className="wm-globe-container" style={{ position: 'fixed', inset: 0, zIndex: 0 }} onMouseDown={wakeGlobe}>
      <Globe
        ref={globeRef}
        width={dim.w}
        height={dim.h}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true}
        atmosphereColor={domainColor}
        atmosphereAltitude={0.18}

        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        customLayerData={[{ id: 'clouds' }]}
        customThreeObject={() => {
          const geometry = new THREE.SphereGeometry(100 * 1.02, 75, 75);
          const material = new THREE.MeshPhongMaterial({
            map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/clouds/clouds.png'),
            transparent: true,
            opacity: 0.3,
            side: THREE.BackSide 
          });
          return new THREE.Mesh(geometry, material);
        }}
        customThreeObjectUpdate={(obj) => { obj.rotation.y += 0.0002; }}

        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.7}
        hexPolygonColor={() => `color-mix(in srgb, ${domainColor} 15%, transparent)`}
        hexPolygonAltitude={0.01}

        arcsData={liveMode ? eliteArcs : []}
        arcColor={(d) => d.color || (d.severity === 'critical' ? '#f43f5e' : domainColor)}
        arcAltitudeAutoscale={0.5}
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={2000}
        arcStroke={0.2}

        ringsData={liveMode ? eliteRings : []}
        ringColor={() => (t) => `hsla(${ringHsl}, ${0.8 * (1 - t)})`}
        ringMaxRadius={10}
        ringPropagationSpeed={4}

        polygonsData={strategicConflicts}
        polygonGeoJsonGeometry={d => ({ type: 'Polygon', coordinates: [d.coords] })}
        polygonCapColor={(d) => d.color ? `color-mix(in srgb, ${d.color} 20%, transparent)` : 'rgba(244, 63, 94, 0.1)'}
        polygonSideColor={(d) => d.color ? `color-mix(in srgb, ${d.color} 40%, transparent)` : 'rgba(244, 63, 94, 0.3)'}
        polygonStrokeColor={(d) => d.color || '#f43f5e'}
        polygonAltitude={0.025}

        pathsData={liveMode ? [...satTrails, ...satBeams, ...strategicCables] : strategicCables}
        pathColor={(d) => d.name ? '#3b82f6' : d.coords.length === 2 && d.coords[1][2] === 0 ? `var(--domain-primary)` : `rgba(255, 255, 255, 0.05)`}
        pathDashLength={(d) => d.name ? 0.3 : (d.coords.length === 2 && d.coords[1][2] === 0 ? 1 : 0.01)}
        pathDashGap={(d) => d.name ? 0.01 : (d.coords.length === 2 && d.coords[1][2] === 0 ? 0 : 0.01)}
        pathDashAnimateTime={4000}
        pathStroke={(d) => d.name ? 0.6 : (d.coords.length === 2 && d.coords[1][2] === 0 ? 0.8 : 0.2)}

        objectsData={satellites}
        objectLat="lat"
        objectLng="lng"
        objectAltitude="alt"
        objectThreeObject={(sat) => {
          const group = new THREE.Group();
          const color = sat.type === 'Recon' ? 0xf43f5e : sat.type === 'ISS/LEO' ? 0x10b981 : 0x0ea5e9;
          const body = new THREE.Mesh(new THREE.OctahedronGeometry(0.8), new THREE.MeshLambertMaterial({ color, emissive: color, emissiveIntensity: 2 }));
          group.add(body);
          const ring = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.05, 8, 40), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 }));
          group.add(ring);
          return group;
        }}

        htmlElementsData={liveMode ? [...globeData.slice(-20), ...strategicPoints] : strategicPoints}
        htmlElement={(d) => {
          const el = document.createElement('div');
          const color = d.iconColor || domainColor;
          const isStrategic = !!d.type;
          el.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;pointer-events:none;filter: drop-shadow(0 0 8px ${color})">
              <div style="width:${isStrategic ? '8px' : '4px'};height:${isStrategic ? '8px' : '4px'};border:1px solid white;border-radius:${isStrategic ? '50%' : '2px'};background:${color};box-shadow:0 0 10px ${color};"></div>
              <div style="background:rgba(1,2,8,0.85);border:1px solid rgba(255,255,255,0.1);color:white;padding:3px 6px;border-radius:2px;font-size:8px;margin-top:6px;backdrop-filter:blur(8px);white-space:nowrap;font-family:var(--mono-font);font-weight:900;letter-spacing:1px;">
                ${(d.name || d.label || 'NODE').toUpperCase()}
              </div>
            </div>`;
          return el;
        }}

        onZoom={wakeGlobe}
        autoRotate={!liveMode}
        autoRotateSpeed={0.3}
      />
    </div>
  );
}
