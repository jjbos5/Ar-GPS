import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation as NavigationIcon, MapPin } from 'lucide-react';
import type { Destination } from '../types';

export default function MapPage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    // Get selected destination from localStorage
    const stored = localStorage.getItem('selectedDestination');
    if (stored) {
      setDestination(JSON.parse(stored));
    } else {
      // No destination selected, go back
      navigate('/destinations');
    }
  }, [navigate]);

  const handleStartAR = async () => {
  // Check if device has camera
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert('Camera not available on this device. Please use a mobile device.');
      return;
    }
    
    // Try to access camera
    await navigator.mediaDevices.getUserMedia({ video: true });
    navigate('/ar');
  } catch (error) {
    alert('Camera access denied or not available');
  }
};

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#002855] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3 mb-2">
          <button 
            onClick={() => navigate('/destinations')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#002855]" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#002855]">Route to</h1>
            <p className="text-sm text-gray-600">{destination.name}</p>
          </div>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="flex-1 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Map view coming soon!</p>
            <p className="text-sm text-gray-500">
              Will show interactive map with your route
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-white shadow-lg rounded-t-3xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 flex-shrink-0">
            <img 
              src={destination.imageUrl || 'https://via.placeholder.com/64'} 
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-[#002855]">{destination.name}</h2>
            <p className="text-sm text-gray-600">{destination.description}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-6 mb-6 text-center">
          <div className="flex-1">
            <div className="text-2xl font-bold text-[#002855]">0.3</div>
            <div className="text-xs text-gray-500">MILES</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-[#002855]">5</div>
            <div className="text-xs text-gray-500">MINUTES</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-[#002855]">👟</div>
            <div className="text-xs text-gray-500">WALKING</div>
          </div>
        </div>

        {/* Action Buttons */}
        <button
          onClick={handleStartAR}
          className="w-full bg-[#002855] text-white rounded-2xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-3 flex items-center justify-center gap-3"
        >
          <NavigationIcon className="w-6 h-6" />
          Start AR Navigation
        </button>

        <button
          onClick={() => navigate('/destinations')}
          className="w-full bg-gray-100 text-gray-700 rounded-xl px-6 py-3 font-semibold hover:bg-gray-200 transition-all"
        >
          Choose Different Destination
        </button>
      </div>
    </div>
  );
}