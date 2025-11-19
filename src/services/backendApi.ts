// Service to connect to your teammate's Express backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Types matching your backend
interface BackendLocation {
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

interface BackendRoute {
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
  try {
    const response = await fetch(`${API_BASE_URL}/locations`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to fetch locations');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching locations:', error);
    throw error;
  }
};

// Get a specific location by ID
export const fetchLocationById = async (id: string): Promise<BackendLocation> => {
  try {
    const response = await fetch(`${API_BASE_URL}/locations/${id}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Location not found');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error fetching location:', error);
    throw error;
  }
};

// Search locations
export const searchLocations = async (query?: string, type?: string): Promise<BackendLocation[]> => {
  try {
    const params = new URLSearchParams();
    if (query) params.append('query', query);
    if (type) params.append('type', type);
    
    const response = await fetch(`${API_BASE_URL}/locations/search?${params}`);
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Search failed');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error searching locations:', error);
    throw error;
  }
};

// Get route between two coordinates
export const calculateRoute = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<BackendRoute> => {
  try {
    const response = await fetch(`${API_BASE_URL}/route`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
  } catch (error) {
    console.error('Error calculating route:', error);
    throw error;
  }
};

// Get route between two location IDs
export const getRouteByLocationIds = async (
  startId: string,
  endId: string
): Promise<BackendRoute> => {
  try {
    const response = await fetch(`${API_BASE_URL}/route/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        startId,
        endId
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Route calculation failed');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error getting route:', error);
    throw error;
  }
};

// Get nearby locations
export const getNearbyLocations = async (
  lat: number,
  lng: number,
  radius: number = 500
): Promise<(BackendLocation & { distance: number })[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/nearby`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lat,
        lng,
        radius
      })
    });
    
    const result = await response.json();
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to get nearby locations');
    }
    
    return result.data;
  } catch (error) {
    console.error('Error getting nearby locations:', error);
    throw error;
  }
};

// Convert backend location to your Destination type
export const convertToDestination = (location: BackendLocation) => {
  return {
    id: location.id,
    name: location.name,
    description: location.description || '',
    category: mapTypeToCategory(location.type),
    latitude: location.coordinates.lat,
    longitude: location.coordinates.lng,
    imageUrl: undefined, // Add default or placeholder
    isAccessible: true, // Default to true
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

// Helper to map backend types to your categories
function mapTypeToCategory(type: string): 'academic' | 'dining' | 'residential' | 'athletic' | 'library' | 'parking' | 'health' | 'recreation' | 'other' {
  const mapping: Record<string, any> = {
    'building': 'academic',
    'landmark': 'other',
    'entrance': 'other',
    'parking': 'parking',
  };
  return mapping[type] || 'other';
}