import React, { useRef } from "react";
import Globe from "react-globe.gl";

const DOMAIN_COLORS = {
  CYBER: "#3b82f6",
  FINANCE: "#f59e0b",
  GEOINT: "#10b981"
};

export function GlobeLayer({ dim, _countries, _arcs, _rings, mapPoints, _liveMode, _globeRef, activeDomain, _activeLayers }) {
  const domainColor = DOMAIN_COLORS[activeDomain] || "#3b82f6";
  const globeEl = useRef();

  const arcs = [
    { startLat: 40.7, startLng: -74.0, endLat: 51.5, endLng: -0.1, color: '#0ea5e9' },
    { startLat: 40.7, startLng: -74.0, endLat: 35.6, endLng: 139.6, color: '#f97316' },
    { startLat: 40.7, startLng: -74.0, endLat: 1.3, endLng: 103.8, color: '#10b981' },
    { startLat: 51.5, startLng: -0.1, endLat: 48.8, endLng: 2.3, color: '#0ea5e9' },
  ];

  const rings = [
    { lat: 40.7, lng: -74.0, color: '#ef4444' },
    { lat: 51.5, lng: -0.1, color: '#f97316' },
    { lat: 35.6, lng: 139.6, color: '#eab308' },
  ];

  const points = mapPoints || [
    { lat: 40.7, lng: -74.0 },
    { lat: 51.5, lng: -0.1 },
    { lat: 35.6, lng: 139.6 },
    { lat: 1.3, lng: 103.8 },
    { lat: 48.8, lng: 2.3 },
  ];

  const globeProps = {
    ref: globeEl,
    width: dim?.w || 800,
    height: dim?.h || 600,
    globeImageUrl: "//unpkg.com/three-globe/example/img/earth-night.jpg",
    bumpImageUrl: "//unpkg.com/three-globe/example/img/earth-topology.png",
    backgroundImageUrl: "//unpkg.com/three-globe/example/img/night-sky.png",
    pointsData: points,
    pointColor: () => domainColor,
    pointAltitude: 0.02,
    pointRadius: 0.5,
    pointsMerge: true,
    arcsData: arcs,
    arcColor: c => c.color || domainColor,
    arcAltitude: 0.3,
    arcStroke: 1,
    arcDashLength: 0.4,
    arcDashGap: 0.2,
    arcDashAnimateTime: 1500,
    ringsData: rings,
    ringColor: r => r.color || domainColor,
    ringAltitude: 0.05,
    ringMaxRadius: 2,
    ringPropagationSpeed: 2,
    ringRepeatPeriod: 3000,
  };

  return <Globe {...globeProps} />;
}