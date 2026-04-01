import React, { useMemo } from "react";
import Globe from "react-globe.gl";

const DOMAIN_COLORS = {
  CYBER: "#3b82f6",
  FINANCE: "#f59e0b",
  GEOINT: "#10b981"
};

export function GlobeLayer({ dim, countries, arcs, rings, mapPoints, liveMode, globeRef, activeDomain }) {
  
  const domainColor = DOMAIN_COLORS[activeDomain] || "#3b82f6";

  const globeData = useMemo(() => {
    return mapPoints.map(p => ({
      ...p,
      size: p.size || 0.1,
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
        atmosphereAltitude={0.15}
        
        // Tactical Nation Polygons
        hexPolygonsData={countries.features}
        hexPolygonResolution={3}
        hexPolygonMargin={0.7}
        hexPolygonColor={() => 'rgba(255, 255, 255, 0.05)'}
        hexPolygonAltitude={0.01}

        // Arcs: Dynamic Domain Vectors
        arcsData={liveMode ? arcs : []}
        arcColor={(d) => d.severity === 'critical' ? '#ef4444' : domainColor}
        arcAltitudeAutoscale={0.5}
        arcDashLength={0.4}
        arcDashGap={2}
        arcDashAnimateTime={1500}
        arcStroke={0.5}

        // Shockwave Rings
        ringsData={liveMode ? rings : []}
        ringColor={() => (t) => `rgba(${activeDomain === 'FINANCE' ? '245,158,11' : activeDomain === 'GEOINT' ? '16,185,129' : '59,130,246'},${1 - t})`}
        ringMaxRadius={5}
        ringPropagationSpeed={3}

        // 3D Hexagonal Infrastructure
        hexBinPointsData={globeData}
        hexBinPointLat={d => d.lat}
        hexBinPointLng={d => d.lng}
        hexBinPointWeight="size"
        hexBinResolution={4}
        hexMargin={0.2}
        hexTopColor={() => domainColor}
        hexBottomColor={() => 'rgba(0,0,0,0)'}
        hexAltitude={0.15}

        // Floating POI Labels
        htmlElementsData={globeData}
        htmlElement={(d) => {
          const el = document.createElement('div');
          el.innerHTML = `
            <div class="globe-poi" style="pointer-events: none;">
               <div class="poi-dot" style="background: ${domainColor}; box-shadow: 0 0 20px ${domainColor}"></div>
               <div class="poi-label" style="background:rgba(3,4,8,0.85); border:1px solid ${domainColor}44; color:white; padding:6px 10px; border-radius:2px; font-family:'JetBrains Mono',monospace; font-size:9px; backdrop-filter:blur(5px); box-shadow: 0 10px 20px rgba(0,0,0,0.5)">
                  <span class="poi-title" style="color: ${domainColor}; font-weight: 800; display: block; margin-bottom: 2px;">${d.label || d.type || 'NODE'}</span>
                  <span class="poi-meta" style="color:#8b949e; opacity: 0.8;">${d.ip || ''}</span>
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
