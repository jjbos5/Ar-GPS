// frontend/src/backendApi.ts

// In dev you can override with VITE_API_URL=http://localhost:3001/api
// In Vercel/prod it will default to `/api` (serverless functions)
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Types matching your backend
export interface BackendLocation {
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

export interface BackendRoute {
  distance: number;
  duration: number;
  waypoints: {
    lat: number;
    lng: number;
    instruction?: string;
  }[];
  start?: BackendLocation;
  end?: BackendLocation;
}

// Get all campus locations
export const fetchLocations = async (): Promise<BackendLocation[]> => {
  const response = await fetch(`${API_BASE_URL}/locations`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch locations');
  }

  return result.data;
};

// Get a specific location by ID
export const fetchLocationById = async (id: string): Promise<BackendLocation> => {
  const response = await fetch(`${API_BASE_URL}/locations/${id}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Location not found');
  }

  return result.data;
};

// Search locations
export const searchLocations = async (
  query?: string,
  type?: string
): Promise<BackendLocation[]> => {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  if (type) params.append('type', type);

  const response = await fetch(`${API_BASE_URL}/locations/search?${params}`);
  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Search failed');
  }

  return result.data;
};

// Get route between two coordinates
export const calculateRoute = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<BackendRoute> => {
  const response = await fetch(`${API_BASE_URL}/route`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      start: { lat: startLat, lng: startLng },
      end: { lat: endLat, lng: endLng }
    })
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Route calculation failed');
  }

  return result.data;
};

// Get route between two location IDs
export const getRouteByLocationIds = async (
  startId: string,
  endId: string
): Promise<BackendRoute> => {
  const response = await fetch(`${API_BASE_URL}/route/locations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ startId, endId })
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Route calculation failed');
  }

  return result.data;
};

// Get nearby locations
export const getNearbyLocations = async (
  lat: number,
  lng: number,
  radius: number = 500
): Promise<(BackendLocation & { distance: number })[]> => {
  const response = await fetch(`${API_BASE_URL}/nearby`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ lat, lng, radius })
  });

  const result = await response.json();

  if (!result.success) {
    throw new Error(result.error || 'Failed to get nearby locations');
  }

  return result.data;
};

// Convert backend location to your Destination type-ish shape
// (your Destination type can match this shape)
export const convertToDestination = (location: BackendLocation) => {
  return {
    id: location.id,
    name: location.name,
    description: location.description || '',
    category: mapTypeToCategory(location.type),
    latitude: location.coordinates.lat,
    longitude: location.coordinates.lng,
    imageUrl: undefined,
    isAccessible: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

function mapTypeToCategory(
  type: string
):
  | 'academic'
  | 'dining'
  | 'residential'
  | 'athletic'
  | 'library'
  | 'parking'
  | 'health'
  | 'recreation'
  | 'other' {
  const mapping: Record<string, any> = {
    building: 'academic',
    landmark: 'other',
    entrance: 'other',
    parking: 'parking'
  };
  return mapping[type] || 'other';
}
