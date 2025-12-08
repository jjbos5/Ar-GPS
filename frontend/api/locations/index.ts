import type { VercelRequest, VercelResponse } from '@vercel/node';
import { campusLocations } from '../campusData.js';


export default function handler(req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({
    success: true,
    data: campusLocations
  });
}
