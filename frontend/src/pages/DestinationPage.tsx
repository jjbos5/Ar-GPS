import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchLocations, convertToDestination } from '../backendApi';
import type { Destination } from '../types';

export default function DestinationsPage() {
  const navigate = useNavigate();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Load real data from backend
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

  // Filtered results
  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory =
      selectedCategory === 'all' || dest.category === selectedCategory;

    const matchesSearch =
      dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Your UI code goes here */}
    </div>
  );
}
