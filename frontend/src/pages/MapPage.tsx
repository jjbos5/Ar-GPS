// frontend/src/pages/MapPage.tsx

import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Navigation as NavigationIcon } from "lucide-react";

import { GoogleMap, Marker, Polyline, useJsApiLoader } from "@react-google-maps/api";

import { calculateRoute } from "../services/backendApi";
import type { BackendRoute } from "../services/backendApi";
import type { Destination } from "../types";

// HTTPS-safe marker icons
const BLUE_DOT = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
const RED_DOT = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

export default function MapPage() {
  const navigate = useNavigate();
  const mapRef = useRef<google.maps.Map | null>(null);

  const [destination, setDestination] = useState<Destination | null>(null);
  const [route, setRoute] = useState<BackendRoute | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
  });

  useEffect(() => {
    const stored = localStorage.getItem("selectedDestination");
    if (!stored) {
      navigate("/destinations");
      return;
    }

    const dest: Destination = JSON.parse(stored);
    setDestination(dest);
    fetchRouteForDestination(dest);
  }, [navigate]);

  const fetchRouteForDestination = useCallback((dest: Destination) => {
    if (!navigator.geolocation) {
      setRouteError("Geolocation is not supported.");
      return;
    }

    setIsRouteLoading(true);
    setRouteError("");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const startLat = position.coords.latitude;
        const startLng = position.coords.longitude;
        setUserPos({ lat: startLat, lng: startLng });

        try {
          const r = await calculateRoute(
            startLat,
            startLng,
            dest.latitude,
            dest.longitude
          );

          const polyline =
            r.waypoints?.map((wp) => ({
              lat: wp.lat,
              lng: wp.lng,
            })) ?? [];

          setRoute({ ...r, polyline } as BackendRoute);
        } catch {
          setRouteError("Could not calculate a walking route.");
        } finally {
          setIsRouteLoading(false);
        }
      },
      () => {
        setRouteError("Location permission denied.");
        setIsRouteLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const distanceMeters = route?.distance ?? null;
  const distanceMiles = distanceMeters ? distanceMeters / 1609.34 : null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate("/destinations")} className="p-2">
            <ArrowLeft className="w-6 h-6 text-[#002855]" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-[#002855]">Route to</h1>
            <p className="text-sm text-gray-600">{destination.name}</p>
          </div>
        </div>

        {isRouteLoading && <div className="text-xs">Calculating route…</div>}
        {routeError && <div className="text-xs text-red-600">{routeError}</div>}
      </div>

      {/* MAP */}
      <div className="flex-1 relative">
        {isLoaded ? (
          <GoogleMap
            onLoad={(map) => {
              mapRef.current = map;
            }}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{ lat: destination.latitude, lng: destination.longitude }}
            zoom={16}
          >
            {userPos && <Marker position={userPos} icon={{ url: BLUE_DOT }} />}
            <Marker
              position={{ lat: destination.latitude, lng: destination.longitude }}
              icon={{ url: RED_DOT }}
            />
            {route?.polyline && (
              <Polyline
                path={route.polyline}
                options={{ strokeColor: "#002855", strokeWeight: 5 }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            Loading map…
          </div>
        )}
      </div>

      {/* BOTTOM PANEL */}
      <div className="bg-white p-6">
        <div className="text-center">
          <div className="text-xl font-bold">
            {distanceMeters ? `${Math.round(distanceMeters)}m` : "—"}
          </div>
          {distanceMiles && (
            <div className="text-xs text-gray-400">
              (~{distanceMiles.toFixed(2)} mi)
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/ar")}
          className="w-full bg-[#002855] text-white mt-4 py-3 rounded-xl"
        >
          <NavigationIcon className="inline mr-2" />
          Start AR Navigation
        </button>
      </div>
    </div>
  );
}
