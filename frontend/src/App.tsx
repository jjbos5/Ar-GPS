import Home from './pages/Home';
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const DestinationsPage = lazy(() => import('./pages/DestinationsPage'));
const MapPage = lazy(() => import('./pages/MapPage'));
const ARPage = lazy(() => import('./pages/ARPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[#002855] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/ar" element={<ARPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;