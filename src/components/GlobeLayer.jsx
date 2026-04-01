import React, { useMemo } from "react";
import Globe from "react-globe.gl";

const DOMAIN_COLORS = {
  CYBER: "#3b82f6",
  FINANCE: "#f59e0b",
  GEOINT: "#10b981"
};

export function GlobeLayer({ dim, countries, arcs, rings, mapPoints, liveMode, globeRef, activeDomain }) {
  
  const domainColor = DOMAIN_COLORS[activeDomain] || "#3b82f6";

  // ZEN FILTER: Limit clutter to elite signals only
  const eliteArcs = useMemo(() => arcs.slice(-12), [arcs]);
  const eliteRings = useMemo(() => rings.slice(-3), [rings]);

  const globeData = useMemo(() => {
    return mapPoints.map(p => ({
      ...p,
      size: p.size || 0.08,
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
        atmosphereAltitude={0.12}
        
        // Zen Hexagons
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.75}
        hexPolygonColor={() => 'rgba(255, 255, 255, 0.04)'}
        hexPolygonAltitude={0.005}

        // Focused Arcs
        arcsData={liveMode ? eliteArcs : []}
        arcColor={(d) => d.severity === 'critical' ? '#ef4444' : domainColor}
        arcAltitudeAutoscale={0.4}
        arcDashLength={0.3}
        arcDashGap={3}
        arcDashAnimateTime={2000}
        arcStroke={0.4}

        // Focused Rings
        ringsData={liveMode ? eliteRings : []}
        ringColor={() => (t) => `rgba(${activeDomain === 'FINANCE' ? '245,158,11' : activeDomain === 'GEOINT' ? '16,185,129' : '59,130,246'},${0.6 * (1 - t)})`}
        ringMaxRadius={4}
        ringPropagationSpeed={2.5}

        // Minimalist Hex-Bins
        hexBinPointsData={globeData}
        hexBinPointLat={d => d.lat}
        hexBinPointLng={d => d.lng}
        hexBinPointWeight="size"
        hexBinResolution={4}
        hexMargin={0.25}
        hexTopColor={() => domainColor}
        hexBottomColor={() => 'rgba(0,0,0,0)'}
        hexAltitude={0.12}

        // Minimalist labels
        htmlElementsData={globeData.slice(0, 20)}
        htmlElement={(d) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="globe-poi" style="pointer-events: none; opacity: 0.8;">
               <div class="poi-dot" style="background: ${domainColor}; width: 6px; height: 6px;"></div>
               <div class="poi-label" style="background:rgba(2,3,6,0.9); border:1px solid ${domainColor}33; color:#ccc; padding:4px 8px; border-radius:2px; font-family:'JetBrains Mono',monospace; font-size:8px; backdrop-filter:blur(10px);">
                  <span style="color: ${domainColor}; font-weight: 800;">${d.label || d.type || 'NODE'}</span>
               </div>
            </div>
          `;
          return el;
        }}
        
        autoRotate={!liveMode} 
        autoRotateSpeed={0.3}
      />
    </div>
  );
}
