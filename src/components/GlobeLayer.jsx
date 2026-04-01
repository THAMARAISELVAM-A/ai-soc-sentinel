import React, { useState } from "react";
import Globe from "react-globe.gl";

export function GlobeLayer({ dim, countries, arcs, rings, mapPoints, liveMode, globeRef }) {
  const [hoverD, setHoverD] = useState();

  return (
    <div className="wm-globe-container">
      <Globe
        ref={globeRef}
        width={dim.w} height={dim.h} 
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-dark.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        
        // Realistic Atmosphere
        showAtmosphere={true} 
        atmosphereColor="#3b82f6" 
        atmosphereAltitude={0.12}
        
        // Nation Polygons (GeoJSON)
        polygonsData={countries.features}
        polygonAltitude={d => d === hoverD ? 0.06 : 0.01}
        polygonCapColor={d => d === hoverD ? 'rgba(59, 130, 246, 0.4)' : 'rgba(59, 130, 246, 0.05)'}
        polygonSideColor={() => 'rgba(0, 0, 0, 0.2)'}
        polygonStrokeColor={() => 'rgba(255, 255, 255, 0.05)'}
        onPolygonHover={setHoverD}
        polygonTransitionDuration={300}
        
        // Arcs & Shockwaves
        arcsData={arcs} 
        arcStartLat={d=>d.startLat} arcStartLng={d=>d.startLng} 
        arcEndLat={d=>d.endLat} arcEndLng={d=>d.endLng} 
        arcColor={d=>d.color} 
        arcDashLength={0.4} 
        arcDashGap={4} 
        arcDashAnimateTime={1000}
        arcStroke={0.5}
        
        ringsData={rings} 
        ringColor={d => t => `${d.color}${Math.round(255*(1-t)).toString(16).padStart(2,'0')}`} 
        ringMaxRadius={d => d.maxR} 
        ringPropagationSpeed={2.5} 
        ringRepeatPeriod={1000}
        
        // 3D Hexagonal Pillars
        hexBinPointsData={mapPoints} 
        hexBinPointLat={d=>d.lat} hexBinPointLng={d=>d.lng}
        hexBinPointWeight={d => d.rad * 2.5} 
        hexBinResolution={3} 
        hexMargin={0.2}
        hexTopColor={d => d.points[0].color} 
        hexSideColor={d => `${d.points[0].color}44`}
        hexBinMerge={true}
        hexAltitude={d => d.sumWeight * 0.05}
        
        // Custom Points (Glow effect)
        pointsData={mapPoints}
        pointLat={d => d.lat}
        pointLng={d => d.lng}
        pointColor={d => d.color}
        pointRadius={0.4}
        pointsMerge={true}
        pointAltitude={0.02}

        // Floating 3D Orbits (Labels)
        htmlElementsData={mapPoints}
        htmlElement={d => {
          const el = document.createElement('div');
          el.innerHTML = `<div style="background:rgba(3,4,8,0.9); border:1px solid ${d.color}66; padding:4px 8px; border-radius:2px; color:#fff; font-family:'JetBrains Mono',monospace; font-size:9px; box-shadow:0 0 15px ${d.color}33; white-space: nowrap; backdrop-filter: blur(4px);"><b style="color:${d.color}; font-size:10px; letter-spacing:0.05em;">${d.type}</b><br/><span style="color:#8b949e; font-size:8px;">TRACE: ${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}.**.**</span></div>`;
          el.style.pointerEvents = 'none';
          return el;
        }}
        
        autoRotate={!liveMode} 
        autoRotateSpeed={0.5}
      />
    </div>
  );
}
