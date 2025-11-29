import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation as NavigationIcon } from 'lucide-react';
import type { Destination } from '../types';

export default function MapPage() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState<Destination | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('selectedDestination');
    if (stored) {
      setDestination(JSON.parse(stored));
    } else {
      navigate('/destinations');
    }
  }, [navigate]);

  const handleStartAR = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera not available on this device. Please use a mobile device.');
        return;
      }
      
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

      {/* Map Placeholder with T-Bone */}
      <div className="flex-1 bg-gradient-to-b from-blue-50 to-blue-100 relative overflow-hidden">
        {/* T-Bone Waving */}
        <div className="absolute left-6 bottom-20 z-10">
          <img 
            src="/popup_tbone.png" 
            alt="popup_tbone" 
            className="w-32 h-32 object-contain drop-shadow-2xl"
          />
        </div>

        {/* Map Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center p-6 bg-white/80 backdrop-blur rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-700 font-semibold mb-2">Interactive Map Coming Soon!</p>
            <p className="text-sm text-gray-500">
              Will show your route with turn-by-turn directions
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="bg-white shadow-2xl rounded-t-3xl p-6">
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
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="text-2xl font-bold text-[#002855]">0.3</div>
            <div className="text-xs text-gray-500 uppercase">Miles</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-[#002855]">5</div>
            <div className="text-xs text-gray-500 uppercase">Minutes</div>
          </div>
          <div>
            <div className="text-2xl">🚶</div>
            <div className="text-xs text-gray-500 uppercase">Walking</div>
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