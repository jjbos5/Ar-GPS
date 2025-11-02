import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin } from 'lucide-react';
import { mockDestinations } from '../data/mockData';
import type { Destination } from '../types';

const categories = [
  { value: 'all', label: 'All' },
  { value: 'academic', label: 'Academic' },
  { value: 'dining', label: 'Dining' },
  { value: 'residential', label: 'Housing' },
  { value: 'athletic', label: 'Athletics' },
  { value: 'library', label: 'Library' },
  { value: 'health', label: 'Health' },
  { value: 'recreation', label: 'Recreation' },
  { value: 'other', label: 'Other' },
];

export default function DestinationsPage() {
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDestinations = async () => {
      setLoading(true);
      setTimeout(() => {
        setDestinations(mockDestinations);
        setLoading(false);
      }, 500);
    };
    loadDestinations();
  }, []);

  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         dest.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSelectDestination = (destination: Destination) => {
    localStorage.setItem('selectedDestination', JSON.stringify(destination));
    navigate('/map');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#002855]" />
            </button>
            <h1 className="text-2xl font-bold text-[#002855]">Choose Destination</h1>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search buildings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#002855] focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="px-4 pb-4 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                  selectedCategory === cat.value
                    ? 'bg-[#002855] text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Destinations List */}
      <div className="p-4 space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-[#002855] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 mt-4">Loading destinations...</p>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No destinations found</p>
          </div>
        ) : (
          filteredDestinations.map(destination => (
            <DestinationCard
              key={destination.id}
              destination={destination}
              onSelect={handleSelectDestination}
            />
          ))
        )}
      </div>
    </div>
  );
}

function DestinationCard({ 
  destination, 
  onSelect 
}: { 
  destination: Destination;
  onSelect: (dest: Destination) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const getCategoryEmoji = (category: string) => {
    const emojis: Record<string, string> = {
      academic: '📚',
      dining: '🍽️',
      residential: '🏠',
      athletic: '🏃',
      library: '📖',
      health: '🏥',
      recreation: '🎭',
      other: '📍',
    };
    return emojis[category] || '📍';
  };

  return (
    <div
      onClick={() => onSelect(destination)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      className="relative bg-white rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer overflow-visible group"
    >
      {/* T-Bone Peeking from Right Side */}
      <div 
        className={`absolute -right-3 top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
          isHovered ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
        }`}
      >
        <img 
          src="/tbone-happy.png" 
          alt="T-Bone" 
          className="w-20 h-20 object-contain drop-shadow-lg"
        />
      </div>

      <div className="flex gap-4 p-4">
        {/* Building Image */}
        <div className="w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-200">
          <img 
            src={destination.imageUrl || 'https://via.placeholder.com/96'} 
            alt={destination.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 pr-8">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-lg text-[#002855] truncate">
              {destination.name}
            </h3>
            <span className="text-2xl flex-shrink-0">
              {getCategoryEmoji(destination.category)}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">
            {destination.description}
          </p>

          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              0.3 mi
            </span>
            {destination.isAccessible && (
              <span className="text-green-600 font-medium">♿ Accessible</span>
            )}
          </div>
        </div>
      </div>

      {/* Hover Border Effect */}
      <div className={`absolute inset-0 border-4 border-[#FDB515] rounded-2xl pointer-events-none transition-opacity ${
        isHovered ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </div>
  );
}