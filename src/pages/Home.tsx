import { useNavigate } from 'react-router-dom';
import { Navigation, Info, Settings } from 'lucide-react';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-between p-6 pb-8">
      {/* Pace Logo - Top */}
      <div className="w-full pt-4">
        <div className="w-32 h-12 bg-[#002855] flex items-center justify-center rounded">
          <span className="text-white font-bold text-xl">PACE</span>
          <span className="text-[#FDB515] font-bold text-sm ml-1">UNIVERSITY</span>
        </div>
      </div>

      {/* Main Content - Center */}
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md -mt-16">
        {/* T-Bone Mascot */}
        <div className="mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
            <span className="text-6xl">🐕</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#002855] mb-3">
            Campus Navigator
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Your AR-powered guide to Pace University
          </p>
          <p className="text-sm text-gray-500 px-4">
            Never get lost on campus. Let T-Bone guide you to any building, 
            classroom, or facility with augmented reality navigation.
          </p>
        </div>

        {/* Main Action Button */}
        <button
          onClick={() => navigate('/destinations')}
          className="w-full bg-[#002855] text-white rounded-2xl px-8 py-5 font-bold text-lg shadow-lg hover:shadow-xl transition-all mb-4 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Navigation className="w-6 h-6" />
          Start Navigation
        </button>

        {/* Secondary Actions */}
        <div className="w-full space-y-3">
          <button
            onClick={() => navigate('/about')}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-xl px-6 py-4 font-semibold hover:border-[#002855] hover:text-[#002855] transition-all flex items-center justify-center gap-2"
          >
            <Info className="w-5 h-5" />
            About This App
          </button>

          <button
            onClick={() => navigate('/settings')}
            className="w-full bg-white border-2 border-gray-200 text-gray-700 rounded-xl px-6 py-4 font-semibold hover:border-[#002855] hover:text-[#002855] transition-all flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" />
            Settings
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-sm text-gray-500 pt-6">
        <p>Powered by T-Bone, your friendly campus guide</p>
      </div>
    </div>
  );
}

export default Home;