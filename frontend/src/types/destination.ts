/**
 * Represents a point of interest on campus (building, dining hall, etc.)
 */
export interface Destination {
  id: string;
  name: string;
  description: string;
  category: DestinationCategory;
  latitude: number;
  longitude: number;
  imageUrl?: string; // Changed from image_url for consistency
  floor?: number; // For multi-story buildings
  isAccessible: boolean; // Changed from is_accessible for consistency
  createdAt: string;
  updatedAt: string;
}

/**
 * Categories for filtering destinations
 */
export type DestinationCategory = 
  | 'academic'
  | 'dining'
  | 'residential'
  | 'athletic'
  | 'administrative'
  | 'library'
  | 'parking'
  | 'health'
  | 'recreation'
  | 'other';

/**
 * Simplified destination for lists/search results
 */
export interface DestinationSummary {
  id: string;
  name: string;
  category: DestinationCategory;
  distance?: number; // Distance from user in meters
}

/**
 * Search and filter options
 */
export interface DestinationFilters {
  category?: DestinationCategory;
  searchQuery?: string;
  isAccessibleOnly?: boolean;
  maxDistance?: number; // In meters
}