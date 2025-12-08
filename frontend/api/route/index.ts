import type { VercelRequest, VercelResponse } from '@vercel/node';
import { findRoute } from '../campusData.js';



export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' });
  }

  const { start, end } = req.body;

  if (!start || !end) {
    return res.status(400).json({ success: false, error: 'Invalid coordinates' });
  }

  const route = findRoute(start.lat, start.lng, end.lat, end.lng);

  return res.status(200).json({
    success: true,
    data: route
  });
}
