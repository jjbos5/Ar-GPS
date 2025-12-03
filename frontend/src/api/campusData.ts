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

// Sample data
export const campusLocations: Location[] = [
  {
    id: 'main-building',
    name: 'Main Building',
    type: 'building',
    coordinates: { lat: 40.7128, lng: -74.0060, altitude: 0 },
    description: 'Main academic building with classrooms and offices',
    arAnchor: { x: 0, y: 0, z: 0 }
  },
  {
    id: 'library',
    name: 'Campus Library',
    type: 'building',
    coordinates: { lat: 40.7130, lng: -74.0065, altitude: 0 },
    description: 'Library with study spaces and computer labs',
    arAnchor: { x: 50, y: 0, z: 50 }
  },
  {
    id: 'student-center',
    name: 'Student Center',
    type: 'building',
    coordinates: { lat: 40.7125, lng: -74.0070, altitude: 0 },
    description: 'Student activities and dining',
    arAnchor: { x: -30, y: 0, z: 100 }
  },
  {
    id: 'main-entrance',
    name: 'Main Entrance',
    type: 'entrance',
    coordinates: { lat: 40.7126, lng: -74.0058, altitude: 0 },
    description: 'Main campus entrance',
    arAnchor: { x: -10, y: 0, z: -20 }
  }
];

export const pathNodes: PathNode[] = [
  {
    id: 'node-1',
    coordinates: { lat: 40.7128, lng: -74.0060 },
    connections: ['node-2', 'node-4']
  },
  {
    id: 'node-2',
    coordinates: { lat: 40.7130, lng: -74.0065 },
    connections: ['node-1', 'node-3']
  },
  {
    id: 'node-3',
    coordinates: { lat: 40.7125, lng: -74.0070 },
    connections: ['node-2', 'node-4']
  },
  {
    id: 'node-4',
    coordinates: { lat: 40.7126, lng: -74.0058 },
    connections: ['node-1', 'node-3']
  }
];

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3;
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

export function findRoute(startLat: number, startLng: number, endLat: number, endLng: number): Route {
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
    { lat: startNode.coordinates.lat, lng: startNode.coordinates.lng, instruction: 'Follow the path' },
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
    duration: Math.round(totalDistance / 80),
    waypoints
  };
}
