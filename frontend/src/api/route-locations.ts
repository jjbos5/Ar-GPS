import { campusLocations, findRoute } from './campusData';

export default function handler(req: any, res: any){
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { startId, endId } = req.body || {};

  const startLocation = campusLocations.find(loc => loc.id === startId);
  const endLocation = campusLocations.find(loc => loc.id === endId);

  if (!startLocation || !endLocation) {
    return res.status(404).json({
      success: false,
      error: 'Location not found'
    });
  }

  const route = findRoute(
    startLocation.coordinates.lat,
    startLocation.coordinates.lng,
    endLocation.coordinates.lat,
    endLocation.coordinates.lng
  );

  res.status(200).json({
    success: true,
    data: {
      ...route,
      start: startLocation,
      end: endLocation
    }
  });
}
