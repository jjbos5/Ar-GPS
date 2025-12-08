// frontend/api/campusData.ts

export interface Location {
  id: string;
  name: string;
  type: 'building' | 'landmark' | 'entrance' | 'parking';
  coordinates: {
    lat: number;
    lng: number;
    altitude?: number;
  };
  description?: string;
  arAnchor?: {
    x: number;
    y: number;
    z: number;
  };
}

export interface PathNode {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  connections: string[];
}

export interface Route {
  distance: number;
  duration: number;
  waypoints: {
    lat: number;
    lng: number;
    instruction?: string;
  }[];
}

// ========= REAL CAMPUS LOCATIONS (PACE PLEASANTVILLE) =========

export const campusLocations: Location[] = [
  {
    id: "goldstein-recreation-center",
    name: "Ann & Alfred Goldstein Health, Fitness & Recreation Center",
    type: "building",
    coordinates: { lat: 41.126231, lng: -73.8076645 },
    description: "",
    arAnchor: { x: 0, y: 0, z: 0 }
  },
  {
    id: "welcome-center",
    name: "Welcome Center",
    type: "building",
    coordinates: { lat: 41.126231, lng: -73.8076645 },
    description: "",
    arAnchor: { x: 5, y: 0, z: 5 }
  },
  {
    id: "willcox-hall",
    name: "Willcox Hall",
    type: "building",
    coordinates: { lat: 41.126231, lng: -73.8076645 },
    description: "",
    arAnchor: { x: -5, y: 0, z: 10 }
  },
  {
    id: "goldstein-academic-center",
    name: "Goldstein Academic Center",
    type: "building",
    coordinates: { lat: 41.1265495, lng: -73.8076576 },
    description: "",
    arAnchor: { x: 10, y: 0, z: 15 }
  },
  {
    id: "north-hall",
    name: "North Hall",
    type: "building",
    coordinates: { lat: 41.1270351, lng: -73.8073665 },
    description: "",
    arAnchor: { x: 15, y: 0, z: 20 }
  },
  {
    id: "miller-hall",
    name: "Miller Hall",
    type: "building",
    coordinates: { lat: 41.1271709, lng: -73.8086627 },
    description: "",
    arAnchor: { x: 20, y: 0, z: 25 }
  },
  {
    id: "lienhard-hall",
    name: "Lienhard Hall",
    type: "building",
    coordinates: { lat: 41.1271709, lng: -73.8086627 },
    description: "",
    arAnchor: { x: 22, y: 0, z: 27 }
  },
  {
    id: "library",
    name: "Library",
    type: "building",
    coordinates: { lat: 41.1276482, lng: -73.808836 },
    description: "",
    arAnchor: { x: 25, y: 0, z: 30 }
  },
  {
    id: "kessel-student-center",
    name: "Kessel Student Center",
    type: "building",
    coordinates: { lat: 41.1278519, lng: -73.8089191 },
    description: "",
    arAnchor: { x: 30, y: 0, z: 30 }
  },
  {
    id: "choate-house",
    name: "Choate House",
    type: "building",
    coordinates: { lat: 41.1292563, lng: -73.8095707 },
    description: "",
    arAnchor: { x: 35, y: 0, z: 35 }
  },
  {
    id: "elm-hall",
    name: "Elm Hall",
    type: "building",
    coordinates: { lat: 41.1290584, lng: -73.8083777 },
    description: "",
    arAnchor: { x: 40, y: 0, z: 40 }
  },
  {
    id: "martin-hall",
    name: "Martin Hall",
    type: "building",
    coordinates: { lat: 41.1291606, lng: -73.8080692 },
    description: "",
    arAnchor: { x: 45, y: 0, z: 45 }
  },
  {
    id: "alumni-hall",
    name: "Alumni Hall",
    type: "building",
    coordinates: { lat: 41.1293248, lng: -73.8084271 },
    description: "",
    arAnchor: { x: 50, y: 0, z: 50 }
  },
  {
    id: "university-health-care",
    name: "University Health Care",
    type: "building",
    coordinates: { lat: 41.1293248, lng: -73.8084271 },
    description: "",
    arAnchor: { x: 52, y: 0, z: 52 }
  },
  {
    id: "goldstein-rec-center-top",
    name: "Ann & Alfred Goldstein Health, Fitness & Recreation Center (Upper)",
    type: "building",
    coordinates: { lat: 41.1293558, lng: -73.8093772 },
    description: "",
    arAnchor: { x: 55, y: 0, z: 55 }
  },
  {
    id: "pace-pool",
    name: "Pace Pool",
    type: "building",
    coordinates: { lat: 41.1293558, lng: -73.8093772 },
    description: "",
    arAnchor: { x: 57, y: 0, z: 57 }
  },
  {
    id: "admissions-office",
    name: "Office of Undergraduate Admission",
    type: "building",
    coordinates: { lat: 41.1303482, lng: -73.8099331 },
    description: "",
    arAnchor: { x: 60, y: 0, z: 60 }
  },
  {
    id: "finnerty-field",
    name: "Peter X. Finnerty Field",
    type: "building",
    coordinates: { lat: 41.1292164, lng: -73.8115401 },
    description: "",
    arAnchor: { x: 65, y: 0, z: 65 }
  },
  {
    id: "pace-stadium",
    name: "Pace Stadium",
    type: "building",
    coordinates: { lat: 41.1292164, lng: -73.8115401 },
    description: "",
    arAnchor: { x: 67, y: 0, z: 67 }
  },
  {
    id: "softball-field",
    name: "Pace Softball Field",
    type: "building",
    coordinates: { lat: 41.1259319, lng: -73.8091405 },
    description: "",
    arAnchor: { x: 70, y: 0, z: 70 }
  },
  {
    id: "school-of-education",
    name: "School of Education",
    type: "building",
    coordinates: { lat: 41.1266574, lng: -73.8067458 },
    description: "",
    arAnchor: { x: 75, y: 0, z: 75 }
  },
  {
    id: "townhouses",
    name: "Townhouses",
    type: "building",
    coordinates: { lat: 41.1317346, lng: -73.8090174 },
    description: "",
    arAnchor: { x: 80, y: 0, z: 80 }
  }
];

// ========= SIMPLE PATH GRAPH (placeholder, good enough to demo) =========

export const pathNodes: PathNode[] = [
  {
    id: 'node-main-entrance',
    coordinates: { lat: 41.126231, lng: -73.8076645 },
    connections: ['node-goldstein-academic', 'node-school-education']
  },
  {
    id: 'node-goldstein-academic',
    coordinates: { lat: 41.1265495, lng: -73.8076576 },
    connections: ['node-main-entrance', 'node-kessel', 'node-library']
  },
  {
    id: 'node-library',
    coordinates: { lat: 41.1276482, lng: -73.808836 },
    connections: ['node-goldstein-academic', 'node-kessel', 'node-res-halls']
  },
  {
    id: 'node-kessel',
    coordinates: { lat: 41.1278519, lng: -73.8089191 },
    connections: ['node-library', 'node-res-halls']
  },
  {
    id: 'node-res-halls',
    coordinates: { lat: 41.1291606, lng: -73.8080692 },
    connections: ['node-kessel', 'node-townhouses', 'node-fields']
  },
  {
    id: 'node-townhouses',
    coordinates: { lat: 41.1317346, lng: -73.8090174 },
    connections: ['node-res-halls']
  },
  {
    id: 'node-fields',
    coordinates: { lat: 41.1292164, lng: -73.8115401 },
    connections: ['node-res-halls']
  },
  {
    id: 'node-school-education',
    coordinates: { lat: 41.1266574, lng: -73.8067458 },
    connections: ['node-main-entrance']
  }
];

// ========= HELPERS =========

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export function findRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Route {
  const startNode = pathNodes.reduce((closest, node) => {
    const dist = calculateDistance(startLat, startLng, node.coordinates.lat, node.coordinates.lng);
    return dist < calculateDistance(startLat, startLng, closest.coordinates.lat, closest.coordinates.lng)
      ? node
      : closest;
  });

  const endNode = pathNodes.reduce((closest, node) => {
    const dist = calculateDistance(endLat, endLng, node.coordinates.lat, node.coordinates.lng);
    return dist < calculateDistance(endLat, endLng, closest.coordinates.lat, closest.coordinates.lng)
      ? node
      : closest;
  });

  const waypoints = [
    { lat: startLat, lng: startLng, instruction: 'Start here' },
    { lat: startNode.coordinates.lat, lng: startNode.coordinates.lng, instruction: 'Follow campus path' },
    { lat: endNode.coordinates.lat, lng: endNode.coordinates.lng, instruction: 'Almost there' },
    { lat: endLat, lng: endLng, instruction: 'You have arrived' }
  ];

  const totalDistance = waypoints.reduce((total, point, i) => {
    if (i === 0) return 0;
    const prev = waypoints[i - 1];
    return total + calculateDistance(prev.lat, prev.lng, point.lat, point.lng);
  }, 0);

  return {
    distance: Math.round(totalDistance),
    duration: Math.round(totalDistance / 80), // 80 m/min
    waypoints
  };
}
