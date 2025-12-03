import { campusLocations } from '../campusData';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { id } = req.query;
  const idStr = Array.isArray(id) ? id[0] : id;

  const location = campusLocations.find(loc => loc.id === idStr);

  if (!location) {
    return res.status(404).json({
      success: false,
      error: 'Location not found'
    });
  }

  res.status(200).json({
    success: true,
    data: location
  });
}
