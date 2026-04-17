export const STRATEGIC_BASES = [
  // US/NATO
  { id: 'norfolk', name: 'Norfolk Naval', lat: 36.95, lng: -76.31, type: 'us-nato', host: 'USA', description: 'World largest naval base. Atlantic Fleet HQ.' },
  { id: 'ramstein', name: 'Ramstein AB', lat: 49.43, lng: 7.59, type: 'us-nato', host: 'DE', description: 'US Air Forces in Europe HQ.' },
  { id: 'yokosuka', name: 'Yokosuka', lat: 35.28, lng: 139.67, type: 'us-nato', host: 'JP', description: 'US 7th Fleet HQ. Carrier homeport.' },
  { id: 'souda', name: 'Souda Bay', lat: 35.48, lng: 24.14, type: 'us-nato', host: 'GR', description: 'Major NATO naval hub in East Med.' },
  { id: 'djibouti_lemmonier', name: 'Camp Lemonnier', lat: 11.54, lng: 43.15, type: 'us-nato', host: 'DJ', description: 'US AFRICOM hub in Horn of Africa.' },
  { id: 'guam_andersen', name: 'Andersen AFB', lat: 13.58, lng: 144.92, type: 'us-nato', host: 'GU', description: 'Strategic bomber hub in the Pacific.' },
  { id: 'diego_garcia', name: 'Diego Garcia', lat: -7.31, lng: 72.41, type: 'us-nato', host: 'IO', description: 'Strategic BIOT base. Bomber/submarine support.' },
  
  // RUSSIA
  { id: 'sevastopol', name: 'Sevastopol', lat: 44.6, lng: 33.5, type: 'russia', host: 'UA', description: 'Black Sea Fleet HQ. Strategic Crimea hub.' },
  { id: 'kaliningrad', name: 'Kaliningrad', lat: 54.71, lng: 20.51, type: 'russia', host: 'RU', description: 'Baltic Fleet exclave. Iskander deployment site.' },
  { id: 'tartus', name: 'Tartus Naval', lat: 34.9, lng: 35.8, type: 'russia', host: 'SY', description: 'Russia only Med naval base.' },
  { id: 'severomorsk', name: 'Severomorsk', lat: 69.07, lng: 33.42, type: 'russia', host: 'RU', description: 'Northern Fleet HQ. Nuclear submarine hub.' },
  
  // CHINA
  { id: 'hainan_submarine', name: 'Yulin Submarine Base', lat: 18.2, lng: 109.5, type: 'china', host: 'CN', description: 'Major SSBN hub in South China Sea.' },
  { id: 'djibouti_pla', name: 'PLA Support Base', lat: 11.59, lng: 43.08, type: 'china', host: 'DJ', description: 'China first overseas military base.' },
  { id: 'fiery_cross', name: 'Fiery Cross Reef', lat: 9.6, lng: 112.9, type: 'china', host: 'SCS', description: 'Militarized reef in Spratly Islands.' },
  { id: 'ream', name: 'Ream Naval Base', lat: 10.5, lng: 103.6, type: 'china', host: 'KH', description: 'PLA expanded facility in Cambodia.' },
];

export const UNDERSEA_CABLES = [
  { id: 'marea', name: 'MAREA', coords: [[-76.1, 36.8], [-72.4, 37.4], [-50.4, 37.9], [-23.4, 44.7], [-9.9, 46.6], [-4.5, 44.7], [-2.9, 43.3]], owners: ['Meta', 'Microsoft'] },
  { id: 'grace_hopper', name: 'Grace Hopper', coords: [[-72.9, 40.8], [-61.2, 38.7], [-23.4, 46], [-8.1, 49.7], [-9.9, 46.9], [-2.9, 43.3]], owners: ['Google'] },
  { id: 'faster', name: 'FASTER', coords: [[136.9, 34.3], [149.4, 37.6], [140.4, 34.4], [-129.6, 43.7], [135, 30.3], [121.5, 25.2]], owners: ['Google', 'KDDI'] },
  { id: 'seamewe_5', name: 'SeaMeWe-5', coords: [[90.1, 21.8], [43.2, 11.6], [29.7, 31.1], [32.7, 29.1], [5.9, 43.1], [101.5, 1.7], [98.7, 3.8], [15.1, 37.5]], owners: ['Singtel', 'Orange'] },
];

export const CONFLICT_ZONES = [
  { id: 'ukraine_war', name: 'Ukraine Theater', coords: [[22.1, 48.1], [24.1, 51.9], [32.8, 52.3], [40.2, 49.6], [36.5, 46.6], [28.2, 45.5], [22.1, 48.1]], intensity: 'critical' },
  { id: 'red_sea_crisis', name: 'Red Sea Chokepoint', coords: [[42.6, 16.5], [43.3, 12.6], [45.5, 13.0], [51.5, 14.7], [52.2, 15.6], [43.5, 17.0], [42.6, 16.5]], intensity: 'high' },
  { id: 'taiwan_strait', name: 'Taiwan Strait Tensions', coords: [[117.5, 25.5], [123, 27], [125, 23.5], [119.5, 21.5], [117.5, 25.5]], intensity: 'high' },
];

export const SANCTIONED_REGIONS = [
  { id: 'russia_sanctions', name: 'Russia Total Sanctions', coords: [[30, 70], [180, 70], [180, 45], [30, 45], [30, 70]], color: '#f43f5e' },
  { id: 'iran_sanctions', name: 'Iran Infrastructure Sanctions', coords: [[44, 39], [63, 37], [61, 25], [48, 25], [44, 39]], color: '#f97316' },
  { id: 'nk_sanctions', name: 'DPRK Full Embargo', coords: [[124, 40], [130, 43], [131, 38], [125, 37], [124, 40]], color: '#ef4444' },
];

export const NUCLEAR_FACILITIES = [
  { id: 'zaporizhzhia', name: 'Zaporizhzhia NPP', lat: 47.51, lng: 34.58, status: 'contested', type: 'plant' },
  { id: 'natanz', name: 'Natanz Enrichment', lat: 33.72, lng: 51.73, status: 'active', type: 'enrichment' },
  { id: 'yongbyon', name: 'Yongbyon', lat: 39.8, lng: 125.75, status: 'active', type: 'weapons' },
  { id: 'Sellafield', name: 'Sellafield Site', lat: 54.42, lng: -3.50, status: 'active', type: 'processing' },
];

export const NATURAL_ANOMALIES = [
  { id: 'fuji_activity', name: 'Mt. Fuji Seismic Pulse', lat: 35.36, lng: 138.72, type: 'volcanic', intensity: 'low' },
  { id: 'la_palma', name: 'Cumbre Vieja Hotspot', lat: 28.57, lng: -17.84, type: 'volcanic', intensity: 'medium' },
  { id: 'iceland_rift', name: 'Reykjanes Rift', lat: 63.89, lng: -22.45, type: 'seismic', intensity: 'high' },
];

export const CYBER_APT_HUBS = [
  { id: 'lazarus_hub', name: 'Lazarus Ops Center', lat: 39.03, lng: 125.75, group: 'APT38', status: 'active' },
  { id: 'fancy_bear', name: 'Fancy Bear Node', lat: 55.75, lng: 37.61, group: 'APT28', status: 'active' },
  { id: 'equation_group', name: 'Equation Cluster', lat: 39.11, lng: -76.77, group: 'NSA/GHE', status: 'stealth' },
];

export const STRATEGIC_WATERWAYS = [
  { id: 'hormuz', name: 'Strait of Hormuz', lat: 26.50, lng: 56.50, description: 'Critical energy chokepoint.' },
  { id: 'suez', name: 'Suez Transit', lat: 30.50, lng: 32.30, description: 'Global trade artery.' },
  { id: 'panama', name: 'Panama Canal', lat: 9.12, lng: -79.67, description: 'Logistics pivot node.' },
];
