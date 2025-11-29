import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Navigation } from 'lucide-react';
import type { Destination } from '../types';

export default function ARPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [cameraError, setCameraError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    // Get destination
    const stored = localStorage.getItem('selectedDestination');
    if (stored) {
      setDestination(JSON.parse(stored));
    } else {
      navigate('/destinations');
      return;
    }

    // Request camera access
    startCamera();

    // Cleanup
    return () => {
      stopCamera();
    };
  }, [navigate]);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      setCameraError('');

      // Request camera permission
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment', // Use back camera
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      });

      setStream(mediaStream);

      // Attach stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setIsLoading(false);
    } catch (error) {
      console.error('Camera error:', error);
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          setCameraError('Camera permission denied. Please allow camera access in your browser settings.');
        } else if (error.name === 'NotFoundError') {
          setCameraError('No camera found on this device.');
        } else if (error.name === 'NotSupportedError') {
          setCameraError('Camera not supported. Make sure you\'re using HTTPS.');
        } else {
          setCameraError('Unable to access camera: ' + error.message);
        }
      }
      
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleExit = () => {
    stopCamera();
    navigate('/map');
  };

  if (!destination) {
    return null;
  }

  if (cameraError) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <div className="text-6xl mb-6">📷</div>
        <h2 className="text-2xl font-bold mb-4">Camera Error</h2>
        <p className="text-center text-gray-300 mb-6 max-w-md">
          {cameraError}
        </p>
        <button
          onClick={() => navigate('/map')}
          className="bg-white text-gray-900 px-6 py-3 rounded-xl font-semibold"
        >
          Back to Map
        </button>
        <button
          onClick={startCamera}
          className="mt-3 text-blue-400 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white">Starting camera...</p>
          </div>
        </div>
      )}

      {/* AR Overlays */}
      {!isLoading && (
        <>
          {/* Top Bar with Search */}
          <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <button
                onClick={handleExit}
                className="p-2 bg-white/20 backdrop-blur rounded-full"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <div className="flex-1 bg-white/20 backdrop-blur rounded-xl px-4 py-3">
                <p className="text-white font-semibold truncate">{destination.name}</p>
              </div>
            </div>
          </div>

          {/* T-Bone Mascot - Left Side */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <img 
              src="/tbone-3d.png" 
              alt="T-Bone guide" 
              className="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </div>

          {/* Navigation Path - Center */}
          <div className="absolute inset-x-0 bottom-1/3 flex flex-col items-center">
            {/* Blue Path Effect */}
            <div className="relative w-32 h-96">
              {/* Path gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-500/80 to-transparent rounded-t-full blur-sm"></div>
              
              {/* Direction Arrows */}
              <div className="absolute inset-x-0 top-20 flex flex-col items-center gap-8">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Navigation className="w-8 h-8 text-blue-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Navigation className="w-8 h-8 text-blue-600" />
                </div>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <Navigation className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-2xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs text-gray-500 uppercase">Distance</div>
                  <div className="text-2xl font-bold text-[#002855]">85m</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 uppercase">ETA</div>
                  <div className="text-2xl font-bold text-[#002855]">2 min</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase">Direction</div>
                  <div className="text-2xl">⬆️</div>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-600">
                Continue straight ahead
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}