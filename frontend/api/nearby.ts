import type { VercelRequest, VercelResponse } from '@vercel/node';
import { campusLocations, calculateDistance } from './campusData.js';



export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' });
  }

  const { lat, lng, radius = 500 } = req.body;

  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      error: 'Missing coordinates'
    });
  }

  const results = campusLocations
    .map((loc) => ({
      ...loc,
      distance: calculateDistance(lat, lng, loc.coordinates.lat, loc.coordinates.lng)
    }))
    .filter((loc) => loc.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  return res.status(200).json({
    success: true,
    data: results
  });
}
