import { campusLocations } from '../campusData';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { query, type } = req.query;

  let results = campusLocations;

  if (type) {
    const t = String(type);
    results = results.filter(loc => loc.type === t);
  }

  if (query) {
    const searchTerm = String(query).toLowerCase();
    results = results.filter(loc =>
      loc.name.toLowerCase().includes(searchTerm) ||
      loc.description?.toLowerCase().includes(searchTerm)
    );
  }

  return res.status(200).json({
    success: true,
    data: results
  });
}
