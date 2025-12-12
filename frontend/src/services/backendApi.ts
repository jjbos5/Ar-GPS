// ------------------------------------------------------
//  BASE URL — Vercel Backend Only
// ------------------------------------------------------

// You MUST set this in your .env file:
// VITE_API_URL="https://your-vercel-project.vercel.app/api"
//
// If missing, fallback to "/api" so Vercel serverless works.

let API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Remove accidental trailing slash ("/api/" → "/api")
API_BASE_URL = API_BASE_URL.replace(/\/$/, "");


// ------------------------------------------------------
//  TYPE DEFINITIONS (MATCHING BACKEND)
// ------------------------------------------------------

export interface BackendLocation {
  id: string;
  name: string;
  type: "building" | "landmark" | "entrance" | "parking";
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

  // Support for Google Maps polyline overlay
  polyline?: { lat: number; lng: number }[];
}


// ------------------------------------------------------
//  API FUNCTIONS
// ------------------------------------------------------

// Fetch all campus locations
export const fetchLocations = async (): Promise<BackendLocation[]> => {
  const res = await fetch(`${API_BASE_URL}/locations`);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Failed to fetch locations");
  }
  return json.data;
};

// Fetch one location by ID
export const fetchLocationById = async (
  id: string
): Promise<BackendLocation> => {
  const res = await fetch(`${API_BASE_URL}/locations/${id}`);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Location not found");
  }
  return json.data;
};

// Search locations
export const searchLocations = async (
  query?: string,
  type?: string
): Promise<BackendLocation[]> => {
  const params = new URLSearchParams();
  if (query) params.append("query", query);
  if (type) params.append("type", type);

  const res = await fetch(`${API_BASE_URL}/locations/search?${params}`);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Search failed");
  }
  return json.data;
};

// Get walking route between coordinates
export const calculateRoute = async (
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number
): Promise<BackendRoute> => {
  const res = await fetch(`${API_BASE_URL}/route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      start: { lat: startLat, lng: startLng },
      end: { lat: endLat, lng: endLng },
    }),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Route calculation failed");
  }
  return json.data;
};

// Get route using backend location IDs
export const getRouteByLocationIds = async (
  startId: string,
  endId: string
): Promise<BackendRoute> => {
  const res = await fetch(`${API_BASE_URL}/route/locations`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startId, endId }),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Route calculation failed");
  }
  return json.data;
};

// Nearby locations within radius
export const getNearbyLocations = async (
  lat: number,
  lng: number,
  radius: number = 500
): Promise<(BackendLocation & { distance: number })[]> => {
  const res = await fetch(`${API_BASE_URL}/nearby`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng, radius }),
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.error || "Failed to get nearby locations");
  }
  return json.data;
};


// ------------------------------------------------------
//  CONVERTER → "Destination" shape for your frontend
// ------------------------------------------------------

export const convertToDestination = (location: BackendLocation) => ({
  id: location.id,
  name: location.name,
  description: location.description || "",
  category: mapTypeToCategory(location.type),

  latitude: location.coordinates.lat,
  longitude: location.coordinates.lng,

  imageUrl: undefined,
  isAccessible: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

// Map backend types to frontend UI categories
function mapTypeToCategory(
  type: string
):
  | "academic"
  | "dining"
  | "residential"
  | "athletic"
  | "library"
  | "parking"
  | "health"
  | "recreation"
  | "other" {
  const mapping: Record<string, string> = {
    building: "academic",
    landmark: "other",
    entrance: "other",
    parking: "parking",
  };

  return (mapping[type] as any) || "other";
}
