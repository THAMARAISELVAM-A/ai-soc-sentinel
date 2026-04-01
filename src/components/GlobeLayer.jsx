import React, { useState, useEffect, useRef } from "react";
import Globe from "react-globe.gl";

export function GlobeLayer({ dim, countries, arcs, rings, mapPoints, liveMode, globeRef }) {
  const [hoverD, setHoverD] = useState();

  return (
    <div className="wm-globe-container">
      <Globe
        ref={globeRef}
        width={dim.w} height={dim.h} backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Realistic Atmosphere
        showAtmosphere={true} 
        atmosphereColor="rgba(59, 130, 246, 0.4)" 
        atmosphereAltitude={0.15}
        
        // Nation Polygons (GeoJSON)
        polygonsData={countries.features}
        polygonAltitude={d => d === hoverD ? 0.08 : 0.01}
        polygonCapColor={d => d === hoverD ? 'rgba(59, 130, 246, 0.4)' : 'rgba(10, 15, 20, 0.1)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.1)'}
        polygonStrokeColor={() => '#111'}
        onPolygonHover={setHoverD}
        
        // Arcs & Shockwaves
        arcsData={arcs} 
        arcStartLat={d=>d.startLat} arcStartLng={d=>d.startLng} 
        arcEndLat={d=>d.endLat} arcEndLng={d=>d.endLng} 
        arcColor={d=>d.color} 
        arcDashLength={0.4} arcDashGap={0.2} arcDashAnimateTime={2000}
        
        ringsData={rings} 
        ringColor={t => t => `${t.color}${Math.round(255*(1-t)).toString(16).padStart(2,'0')}`} 
        ringMaxRadius={d => d.maxR} 
        ringPropagationSpeed={3} 
        ringRepeatPeriod={800}
        
        // 3D Hexagonal Pillars
        hexBinPointsData={mapPoints} 
        hexBinPointLat={d=>d.lat} hexBinPointLng={d=>d.lng}
        hexBinPointWeight={d => d.rad * 2} 
        hexBinResolution={3} 
        hexMargin={0.2}
        hexTopColor={d => d.points[0].color} 
        hexSideColor={d => `${d.points[0].color}88`}
        hexBinMerge={true}
        
        // Floating 3D Orbits (Labels)
        htmlElementsData={mapPoints}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = `<div style="background:rgba(0,0,0,0.85); border:1px solid ${d.color}; padding:6px 10px; border-radius:4px; color:#c9d1d9; font-family:monospace; font-size:11px; box-shadow:0 0 10px ${d.color}44; white-space: nowrap;"><b style="color:#e6edf3; font-size:12px;">${d.type}</b><br/><span style="color:#8b949e; font-size:9px;">IP: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}</span></div>`;
          el.style.pointerEvents = 'none';
          return el;
        }}
        
        autoRotate={!liveMode} 
        autoRotateSpeed={0.8}
      />
    </div>
  );
}
