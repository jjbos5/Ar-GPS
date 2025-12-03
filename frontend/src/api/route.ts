import { findRoute } from './campusData';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { start, end } = req.body || {};

  if (!start || !end || !start.lat || !start.lng || !end.lat || !end.lng) {
    return res.status(400).json({
      success: false,
      error: 'Invalid coordinates'
    });
  }

  const route = findRoute(start.lat, start.lng, end.lat, end.lng);

  res.status(200).json({
    success: true,
    data: route
  });
}
