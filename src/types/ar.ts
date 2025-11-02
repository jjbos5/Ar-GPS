/**
 * AR anchor marker for re-anchoring (QR codes, AprilTags, etc.)
 */
export interface ARMarker {
  id: string;
  tagId: string; // The actual QR/AprilTag identifier
  latitude: number;
  longitude: number;
  locationDescription: string; // e.g., "Entrance of Student Union"
  qrImageUrl?: string; // URL to QR code image for admin
  createdAt: string;
}

/**
 * Current state of AR session
 */
export interface ARSessionState {
  isActive: boolean;
  isTracking: boolean; // Is AR tracking working?
  lastAnchorTime?: Date; // When was AR last re-anchored
  driftAmount?: number; // Estimated drift in meters
  currentAnimation?: MascotAnimation; // What T-Bone is doing
}

/**
 * T-Bone mascot animations
 */
export type MascotAnimation = 
  | 'idle' // Standing still, breathing
  | 'walking' // Walking animation
  | 'wave' // Friendly wave
  | 'point-left' // Point left
  | 'point-right' // Point right
  | 'point-forward' // Point straight ahead
  | 'celebrate' // Jump/cheer at destination
  | 'confused'; // Lost/off-route animation

/**
 * AR arrow (directional indicator)
 */
export interface ARArrow {
  visible: boolean;
  rotation: number; // Degrees (0-360)
  distance: number; // Meters to next waypoint
  color: string; // Hex color
}