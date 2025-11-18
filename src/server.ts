import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface Location {
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

interface PathNode {
  id: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  connections: string[]; // IDs of connected nodes
}

interface Route {
  distance: number;
  duration: number; // in minutes
  waypoints: {
    lat: number;
    lng: number;
    instruction?: string;
  }[];
}

// Sample Campus Data - Replace with your actual campus coordinates
const campusLocations: Location[] = [
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

// Pathfinding nodes for navigation
const pathNodes: PathNode[] = [
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

// Helper function: Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

// Simple pathfinding algorithm (Dijkstra's algorithm simplified)
function findRoute(startLat: number, startLng: number, endLat: number, endLng: number): Route {
  // Find nearest nodes to start and end points
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

  // Simple path generation (in production, use A* or Dijkstra)
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
    duration: Math.round(totalDistance / 80), // Assuming 80m/min walking speed
    waypoints
  };
}

// API Routes

// Get all locations
app.get('/api/locations', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: campusLocations
  });
});

// Get specific location by ID
app.get('/api/locations/:id', (req: Request, res: Response) => {
  const location = campusLocations.find(loc => loc.id === req.params.id);
  
  if (!location) {
    return res.status(404).json({
      success: false,
      error: 'Location not found'
    });
  }
  
  res.json({
    success: true,
    data: location
  });
});

// Search locations by name or type
app.get('/api/locations/search', (req: Request, res: Response) => {
  const { query, type } = req.query;
  
  let results = campusLocations;
  
  if (type) {
    results = results.filter(loc => loc.type === type);
  }
  
  if (query) {
    const searchTerm = String(query).toLowerCase();
    results = results.filter(loc => 
      loc.name.toLowerCase().includes(searchTerm) ||
      loc.description?.toLowerCase().includes(searchTerm)
    );
  }
  
  res.json({
    success: true,
    data: results
  });
});

// Get route between two points
app.post('/api/route', (req: Request, res: Response) => {
  const { start, end } = req.body;
  
  if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates. Please provide start and end with lat/lng'
    });
  }
  
  const route = findRoute(start.lat, start.lng, end.lat, end.lng);
  
  res.json({
    success: true,
    data: route
  });
});

// Get route by location IDs
app.post('/api/route/locations', (req: Request, res: Response) => {
  const { startId, endId } = req.body;
  
  const startLocation = campusLocations.find(loc => loc.id === startId);
  const endLocation = campusLocations.find(loc => loc.id === endId);
  
  if (!startLocation || !endLocation) {
    return res.status(404).json({
      success: false,
      error: 'Start or end location not found'
    });
  }
  
  const route = findRoute(
    startLocation.coordinates.lat,
    startLocation.coordinates.lng,
    endLocation.coordinates.lat,
    endLocation.coordinates.lng
  );
  
  res.json({
    success: true,
    data: {
      ...route,
      start: startLocation,
      end: endLocation
    }
  });
});

// Get nearby locations
app.post('/api/nearby', (req: Request, res: Response) => {
  const { lat, lng, radius = 500 } = req.body; // radius in meters
  
  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates'
    });
  }
  
  const nearby = campusLocations
    .map(loc => ({
      ...loc,
      distance: calculateDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng)
    }))
    .filter(loc => loc.distance <= radius)
    .sort((a, b) => a.distance - b.distance);
  
  res.json({
    success: true,
    data: nearby
  });
});

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 AR GPS Backend server running on port ${PORT}`);
  console.log(`📍 API endpoints available at http://localhost:${PORT}/api`);
});

export default app;