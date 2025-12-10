// frontend/src/pages/DestinationsPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Filter } from 'lucide-react';

import { fetchLocations, convertToDestination } from '../backendApi';
import type { Destination } from '../types';

const CATEGORIES: {
  id: 'all' | 'academic' | 'dining' | 'residential' | 'athletic' | 'library' | 'parking' | 'health' | 'recreation' | 'other';
  label: string;
}[] = [
  { id: 'all',         label: 'All' },
  { id: 'academic',    label: 'Academic' },
  { id: 'residential', label: 'Housing' },
  { id: 'athletic',    label: 'Athletics' },
  { id: 'library',     label: 'Library' },
  { id: 'health',      label: 'Health' },
  { id: 'parking',     label: 'Parking' },
  { id: 'recreation',  label: 'Recreation' },
  { id: 'other',       label: 'Other' },
];

export default function DestinationsPage() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<Destination['category'] | 'all'>('all');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Load real data from backend
  const loadDestinations = async () => {
    try {
      setIsLoading(true);
      setError('');
      const backendLocations = await fetchLocations();
      const clientFormatted = backendLocations.map(convertToDestination);
      setDestinations(clientFormatted);
    } catch (err) {
      console.error('Failed to load destinations:', err);
      setError('Could not load campus locations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  // Filtered results
  const filteredDestinations = destinations.filter((dest) => {
    const matchesCategory =
      selectedCategory === 'all' || dest.category === selectedCategory;

    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleSelectDestination = (dest: Destination) => {
  localStorage.setItem('selectedDestination', JSON.stringify(dest));
  localStorage.removeItem('activeRoute'); // clear old route

  // NEW: Immediately prepare AR coords (lat/lon)
  localStorage.setItem(
    'arDestination',
    JSON.stringify({
      lat: dest.latitude,
      lon: dest.longitude
    })
  );

  navigate('/map'); // Keep your normal flow
};


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm px-4 pt-10 pb-4">
        <h1 className="text-2xl font-bold text-[#002855]">Choose your destination</h1>
        <p className="text-sm text-gray-600 mt-1">
          T-Bone will guide you there in AR
        </p>
      </header>

      {/* Search + Filters */}
      <div className="px-4 pt-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search buildings, halls, or landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FFC72C] focus:border-transparent"
            />
          </div>
          <button className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border ${
                selectedCategory === cat.id
                  ? 'bg-[#002855] text-white border-[#002855]'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 pt-2 pb-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-[#002855] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-gray-500">Loading campus locations...</p>
            </div>
          </div>
        )}

        {!isLoading && error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
            {error}
          </div>
        )}

        {!isLoading && !error && filteredDestinations.length === 0 && (
          <div className="text-center text-gray-500 text-sm mt-8">
            No destinations match your search.
          </div>
        )}

        {!isLoading && !error && filteredDestinations.length > 0 && (
          <div className="mt-2 space-y-3">
            {filteredDestinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => handleSelectDestination(dest)}
                className="w-full text-left bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow flex gap-3"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
                  <img
                    src={dest.imageUrl || '/campus-placeholder.jpg'}
                    alt={dest.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="font-semibold text-[#002855] truncate">
                      {dest.name}
                    </h2>
                    <span className="text-[10px] uppercase tracking-wide text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                      {dest.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {dest.description || 'Tap to navigate here with T-Bone.'}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span>On-campus location</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
