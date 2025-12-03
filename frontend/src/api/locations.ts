import { campusLocations } from './campusData';

export default function handler(req: any, res: any)
 {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  res.status(200).json({
    success: true,
    data: campusLocations
  });
}
