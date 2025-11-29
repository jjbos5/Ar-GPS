import type { Destination, Route, Waypoint } from '../types';

// Mock Pace University destinations
export const mockDestinations: Destination[] = [
  {
    id: '1',
    name: 'Pace Plaza',
    description: 'Main campus hub and gathering space',
    category: 'other',
    latitude: 40.7110,
    longitude: -73.9840,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Bianco Library',
    description: 'Main academic library with study rooms',
    category: 'library',
    latitude: 40.7115,
    longitude: -73.9835,
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Kessel Student Center',
    description: 'Student activities, dining, and events',
    category: 'dining',
    latitude: 40.7108,
    longitude: -73.9845,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '4',
    name: 'Lubin School of Business',
    description: 'Business school classrooms and offices',
    category: 'academic',
    latitude: 40.7112,
    longitude: -73.9838,
    imageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '5',
    name: 'Schimmel Center',
    description: 'Performing arts theater and events',
    category: 'recreation',
    latitude: 40.7107,
    longitude: -73.9842,
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '6',
    name: 'Athletic & Fitness Center',
    description: 'Gym, pool, and sports facilities',
    category: 'athletic',
    latitude: 40.7105,
    longitude: -73.9850,
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '7',
    name: 'Maria\'s Tower',
    description: 'Residence hall',
    category: 'residential',
    latitude: 40.7118,
    longitude: -73.9832,
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '8',
    name: 'Health Services',
    description: 'Student health center and counseling',
    category: 'health',
    latitude: 40.7113,
    longitude: -73.9848,
    imageUrl: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400',
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// Mock waypoints for a sample route
const sampleWaypoints: Waypoint[] = [
  {
    id: 'w1',
    latitude: 40.7110,
    longitude: -73.9840,
    order: 0,
    actionTrigger: 'wave',
  },
  {
    id: 'w2',
    latitude: 40.7112,
    longitude: -73.9838,
    order: 1,
    actionTrigger: 'continue-straight',
    distanceFromPrevious: 30,
  },
  {
    id: 'w3',
    latitude: 40.7114,
    longitude: -73.9836,
    order: 2,
    actionTrigger: 'turn-left',
    distanceFromPrevious: 35,
  },
  {
    id: 'w4',
    latitude: 40.7115,
    longitude: -73.9835,
    order: 3,
    actionTrigger: 'celebrate',
    distanceFromPrevious: 20,
  },
];

// Mock route (Pace Plaza to Library)
export const mockRoute: Route = {
  id: 'route1',
  startDestinationId: '1',
  endDestinationId: '2',
  waypoints: sampleWaypoints,
  totalDistance: 85, // meters
  estimatedDuration: 2, // minutes
  isAccessible: true,
  createdAt: new Date().toISOString(),
};

// Helper function to get destination by ID
export const getDestinationById = (id: string): Destination | undefined => {
  return mockDestinations.find(dest => dest.id === id);
};

// Helper to simulate fetching data (with delay like real API)
export const fetchMockDestinations = (): Promise<Destination[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockDestinations), 500); // 500ms delay
  });
};

export const fetchMockRoute = (_startId: string, _endId: string): Promise<Route> => {  return new Promise((resolve) => {
    setTimeout(() => resolve(mockRoute), 800);
  });
};