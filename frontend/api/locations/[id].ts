import type { VercelRequest, VercelResponse } from '@vercel/node';
import { campusLocations } from '../campusData.js';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query;

  const location = campusLocations.find((loc) => loc.id === id);

  if (!location) {
    return res.status(404).json({ success: false, error: 'Location not found' });
  }

  return res.status(200).json({
    success: true,
    data: location
  });
}
