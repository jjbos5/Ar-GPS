/**
 * Geographic coordinate (latitude/longitude)
 */
export interface Coordinate {
  latitude: number;
  longitude: number;
}

/**
 * A point along a route where something happens (direction change, AR trigger, etc.)
 */
export interface Waypoint extends Coordinate {
  id: string;
  order: number; // Sequence in the route (0, 1, 2...)
  anchorTagId?: string; // QR/AprilTag marker ID for re-anchoring AR
  actionTrigger?: WaypointAction; // What happens when user reaches this point
  distanceFromPrevious?: number; // Meters from last waypoint
}

/**
 * Actions that can be triggered when reaching a waypoint
 */
export type WaypointAction = 
  | 'wave' // T-Bone waves
  | 'point' // T-Bone points in direction
  | 'celebrate' // Reached destination!
  | 'turn-left'
  | 'turn-right'
  | 'continue-straight';

/**
 * A complete navigation route from point A to B
 */
export interface Route {
  id: string;
  startDestinationId: string;
  endDestinationId: string;
  waypoints: Waypoint[];
  totalDistance: number; // Total meters
  estimatedDuration: number; // Estimated minutes
  isAccessible: boolean; // Wheelchair-accessible route
  createdAt: string;
}

/**
 * Active navigation session (what user is currently following)
 */
export interface NavigationSession {
  route: Route;
  currentWaypointIndex: number; // Which waypoint user is heading toward
  startTime: Date;
  userLocation: Coordinate;
  distanceRemaining: number; // Meters to destination
  etaMinutes: number; // Minutes remaining
  isOffRoute: boolean; // User deviated >15m from path
}

/**
 * User's current position and heading
 */
export interface UserLocation extends Coordinate {
  heading?: number; // Compass direction (0-360 degrees, 0 = North)
  accuracy?: number; // GPS accuracy in meters
  speed?: number; // Movement speed in m/s
  timestamp: number;
}