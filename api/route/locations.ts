import type { VercelRequest, VercelResponse } from '@vercel/node';
import { campusLocations, findRoute } from '../campusData';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'POST only' });
  }

  const { startId, endId } = req.body;

  const start = campusLocations.find((l) => l.id === startId);
  const end = campusLocations.find((l) => l.id === endId);

  if (!start || !end) {
    return res.status(404).json({
      success: false,
      error: 'Location not found'
    });
  }

  const route = findRoute(
    start.coordinates.lat,
    start.coordinates.lng,
    end.coordinates.lat,
    end.coordinates.lng
  );

  return res.status(200).json({
    success: true,
    data: {
      ...route,
      start,
      end
    }
  });
}
