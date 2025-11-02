import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function AboutPage() {
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
      <h1 className="text-3xl font-bold text-[#002855] mb-4">About Campus Navigator</h1>
      <div className="prose max-w-none">
        <p className="text-gray-700 mb-4">
          Campus Navigator is an AR-powered wayfinding app that helps you navigate 
          campus with the help of T-Bone, your friendly digital mascot.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Features</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Interactive campus map</li>
          <li>Turn-by-turn AR navigation</li>
          <li>QR code markers for precision tracking</li>
          <li>Accessible routes for all users</li>
          <li>Works offline with PWA technology</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Version</h2>
        <p className="text-gray-700">1.0.0 - Beta</p>
      </div>
    </div>
  );
}