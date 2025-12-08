// POST /api/nearby
import { campusLocations, calculateDistance } from './campusData';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { lat, lng, radius = 500 } = req.body || {};

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

  return res.status(200).json({
    success: true,
    data: nearby
  });
}
