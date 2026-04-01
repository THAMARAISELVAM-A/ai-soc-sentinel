import React, { useMemo } from "react";
import Globe from "react-globe.gl";

const DOMAIN_COLORS = {
  CYBER: "#3b82f6",
  FINANCE: "#f59e0b",
  GEOINT: "#10b981"
};

export function GlobeLayer({ dim, countries, arcs, rings, mapPoints, liveMode, globeRef, activeDomain }) {
  
  const domainColor = DOMAIN_COLORS[activeDomain] || "#3b82f6";

  // Elite clutter control
  const eliteArcs = useMemo(() => arcs.slice(-12), [arcs]);
  const eliteRings = useMemo(() => rings.slice(-4), [rings]);

  const globeData = useMemo(() => {
    return mapPoints.map(p => ({
      ...p,
      size: p.size || 0.15,
      color: domainColor
    }));
  }, [mapPoints, domainColor]);

  return (
    <div className="wm-globe-container">
      <Globe
        ref={globeRef}
        width={dim.w} height={dim.h} 
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere={true} 
        atmosphereColor={domainColor} 
        atmosphereAltitude={0.18}
        
        // High-Density Hex Polygon Geography
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.7}
        hexPolygonColor={() => 'hsla(0, 0%, 100%, 0.12)'}
        hexPolygonAltitude={0.015}

        // Holographic Arc Visuals
        arcsData={liveMode ? eliteArcs : []}
        arcColor={(d) => d.severity === 'critical' ? '#ef4444' : domainColor}
        arcAltitudeAutoscale={0.4}
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashAnimateTime={1200}
        arcStroke={0.5}

        // Advanced Rings
        ringsData={liveMode ? eliteRings : []}
        ringColor={() => (t) => `hsla(${activeDomain === 'FINANCE' ? '38, 92%, 50%' : activeDomain === 'GEOINT' ? '162, 84%, 39%' : '217, 91%, 60%'}, ${0.8 * (1 - t)})`}
        ringMaxRadius={5}
        ringPropagationSpeed={3}

        // POI Interactive Markers
        htmlElementsData={liveMode ? globeData.slice(-15) : []}
        htmlElement={(d) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="globe-poi" style="pointer-events: none; opacity: 0.95; transform: translate(-50%, -100%);">
               <div style="background: white; width: 6px; height: 6px; border-radius: 50%; box-shadow: 0 0 20px ${domainColor}; border: 2px solid ${domainColor};"></div>
               <div class="poi-label" style="background: hsla(220, 30%, 2%, 0.98); border: 1px solid ${domainColor}77; color: white; padding: 8px 14px; border-radius: 6px; font-family: 'JetBrains Mono', monospace; font-size: 10px; backdrop-filter: blur(12px); margin-top: 12px; min-width: 120px; box-shadow: 0 15px 30px rgba(0,0,0,0.6);">
                  <div style="color: ${domainColor}; font-weight: 900; letter-spacing: 0.12em; margin-bottom: 6px; text-transform: uppercase;">${d.label || d.type || 'NODE-SIG'}</div>
                  <div style="opacity: 0.4; font-size: 9px; font-weight: 400;">TRACKER ID: ${Math.random().toString(36).substr(2, 6).toUpperCase()}</div>
               </div>
            </div>
          `;
          return el;
        }}
        
        autoRotate={!liveMode} 
        autoRotateSpeed={0.4}
      />
    </div>
  );
}
