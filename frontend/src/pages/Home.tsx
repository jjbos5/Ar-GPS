import { useNavigate } from 'react-router-dom';
import { Navigation, Info, Settings } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col p-6">
      {/* Pace Logo - Top Left */}
      <div className="mb-8">
        <div className="inline-flex items-center bg-[#002855] px-4 py-2 rounded">
          <span className="text-white font-bold text-lg">PACE</span>
          <span className="text-[#FDB515] font-bold text-xs ml-1">UNIVERSITY</span>
        </div>
      </div>

      {/* Main Content - Center */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full -mt-20">
        {/* T-Bone Mascot - Large */}
        <div className="mb-8">
          <img 
            src="/tbone_pointing.png" 
            alt="T-Bone mascot pointing" 
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-[#002855] mb-3 text-center">
          Campus Navigator
        </h1>

        {/* Subtitle */}
        <p className="text-base text-gray-600 text-center mb-2 px-4">
          Your AR-powered guide to Pace University
        </p>

        {/* Description */}
        <p className="text-sm text-gray-500 text-center mb-10 px-6">
          Never get lost on campus. Let T-Bone guide you to any building, 
          classroom, or facility with augmented reality navigation.
        </p>

        {/* Main CTA Button */}
        <button
          onClick={() => navigate('/destinations')}
          className="w-full bg-[#002855] text-white rounded-2xl px-8 py-5 font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-4 flex items-center justify-center gap-3"
        >
          <Navigation className="w-6 h-6" />
          Start Navigation
        </button>

        {/* Secondary Buttons */}
        <div className="w-full space-y-3">
          <button
            onClick={() => navigate('/about')}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-4 font-semibold hover:border-[#002855] transition-all flex items-center justify-center gap-2"
          >
            <Info className="w-5 h-5" />
            About This App
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full bg-white border-2 border-gray-300 text-gray-700 rounded-xl px-6 py-4 font-semibold hover:border-[#002855] transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-400 mt-8">
        <p>Powered by T-Bone, your friendly campus guide</p>
      </div>
    </div>
  );
}

export default Home;