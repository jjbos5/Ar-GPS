import type { VercelRequest, VercelResponse } from '@vercel/node';
import { campusLocations } from '../campusData';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const { query, type } = req.query;

  let results = campusLocations;

  if (type) {
    results = results.filter((loc) => loc.type === type);
  }

  if (query) {
    const term = String(query).toLowerCase();
    results = results.filter(
      (loc) =>
        loc.name.toLowerCase().includes(term) ||
        loc.description?.toLowerCase().includes(term)
    );
  }

  res.status(200).json({
    success: true,
    data: results
  });
}
