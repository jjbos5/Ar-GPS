import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLocations, convertToDestination } from '../backendApi';
import type { Destination } from '../types';

export default function DestinationsPage() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadDestinations = async () => {
    try {
      const backendLocations = await fetchLocations();
      const clientFormatted = backendLocations.map(convertToDestination);
      setDestinations(clientFormatted);
    } catch (err) {
      console.error('Failed to load destinations:', err);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory =
      selectedCategory === 'all' || dest.category === selectedCategory;

    const name = dest.name.toLowerCase();
    const description = (dest.description ?? '').toLowerCase();
    const search = searchQuery.toLowerCase();

    const matchesSearch =
      name.includes(search) || description.includes(search);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen p-4 space-y-4">
      <h1 className="text-2xl font-bold">Destinations</h1>
  
      {/* Search + Category Filter */}
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Search destinations…"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="border px-3 py-2 rounded flex-1"
        />
  
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="all">All</option>
          <option value="academic">Academic</option>
          <option value="parking">Parking</option>
          <option value="other">Other</option>
        </select>
      </div>
  
      {/* ✅ THIS IS THE REAL <ul> */}
      <ul className="space-y-2">
        {filteredDestinations.map(dest => (
          <li
            key={dest.id}
            className="border rounded p-3 cursor-pointer hover:bg-gray-50"
            onClick={() => navigate(`/destinations/${dest.id}`)}
          >
            <div className="font-semibold">{dest.name}</div>
            <div className="text-sm text-gray-600">{dest.category}</div>
            {dest.description && (
              <div className="text-sm mt-1">{dest.description}</div>
            )}
          </li>
        ))}
  
        {filteredDestinations.length === 0 && (
          <li className="text-sm text-gray-500">
            No destinations found.
          </li>
        )}
      </ul>
    </div>
  );
}