import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SettingsPage() {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-[#002855] mb-4"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>
      <h1 className="text-3xl font-bold text-[#002855]">Settings</h1>
      <p className="text-gray-600 mt-2">Coming soon: App preferences and accessibility options</p>
    </div>
  );
}