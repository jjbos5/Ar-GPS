import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Navigation as NavigationIcon,
  AlertCircle,
} from "lucide-react";

import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

import { calculateRoute } from "../services/backendApi";
import type { BackendRoute } from "../services/backendApi";
import type { Destination } from "../types";

/**
 * IMPORTANT:
 * Keep this array OUTSIDE the component
 * to avoid LoadScript reload warnings
 */
const GOOGLE_MAP_LIBRARIES = ["places"] as const;

// Secure marker icons
const BLUE_DOT = "https://maps.google.com/mapfiles/ms/icons/blue-dot.png";
const RED_DOT = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

export default function MapPage() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState<Destination | null>(null);
  const [route, setRoute] = useState<BackendRoute | null>(null);
  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);

  const [isRouteLoading, setIsRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");

  /* -------------------- GOOGLE MAP LOADER -------------------- */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: GOOGLE_MAP_LIBRARIES as unknown as string[],
  });

  /* -------------------- LOAD DESTINATION -------------------- */
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

  /* -------------------- FETCH ROUTE -------------------- */
  const fetchRouteForDestination = useCallback((dest: Destination) => {
    if (!navigator.geolocation) {
      setRouteError("Geolocation is not supported.");
      return;
    }

    setIsRouteLoading(true);
    setRouteError("");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const startLat = pos.coords.latitude;
        const startLng = pos.coords.longitude;

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
            })) || [];

          const withPolyline = {
            ...r,
            polyline,
          } as BackendRoute;

          setRoute(withPolyline);
          localStorage.setItem("activeRoute", JSON.stringify(withPolyline));
        } catch (err) {
          console.error("Route error:", err);
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

  /* -------------------- START AR -------------------- */
  const handleStartAR = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      navigate("/ar");
    } catch {
      alert("Camera access denied or unavailable.");
    }
  };

  if (!destination) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const distanceMeters = route?.distance ?? null;
  const distanceMiles = distanceMeters ? distanceMeters / 1609.34 : null;
  const etaMinutes = route?.duration ?? null;

  /* ============================ RENDER ============================ */
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* HEADER */}
      <div className="bg-white shadow-sm p-4">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => navigate("/destinations")}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-[#002855]" />
          </button>

          <div className="flex-1">
            <h1 className="text-xl font-bold text-[#002855]">Route to</h1>
            <p className="text-sm text-gray-600 truncate">
              {destination.name}
            </p>
          </div>
        </div>

        {isRouteLoading && (
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-3 h-3 border-2 border-blue-800 border-t-transparent rounded-full animate-spin" />
            Calculating walking route…
          </div>
        )}

        {!isRouteLoading && routeError && (
          <div className="flex items-center gap-2 text-xs text-red-600 mt-2">
            <AlertCircle className="w-4 h-4" />
            {routeError}
          </div>
        )}
      </div>

      {/* ===================== MAP (FIXED HEIGHT) ===================== */}
      <div className="relative w-full h-[55vh]">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: "100%", height: "100%" }}
            center={{
              lat: destination.latitude,
              lng: destination.longitude,
            }}
            zoom={16}
            options={{
              disableDefaultUI: true,
              gestureHandling: "greedy",
            }}
          >
            {userPos && (
              <Marker position={userPos} icon={{ url: BLUE_DOT }} />
            )}

            <Marker
              position={{
                lat: destination.latitude,
                lng: destination.longitude,
              }}
              icon={{ url: RED_DOT }}
            />

            {route?.polyline && (
              <Polyline
                path={route.polyline}
                options={{
                  strokeColor: "#002855",
                  strokeOpacity: 0.9,
                  strokeWeight: 5,
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              Loading map…
            </div>
          </div>
        )}

        {/* T-BONE OVERLAY */}
        <div className="absolute left-6 bottom-6 z-10 pointer-events-none">
          <img
            src="/popup_tbone.png"
            alt="T-Bone"
            className="w-32 h-32 object-contain drop-shadow-2xl"
          />
        </div>
      </div>

      {/* ===================== BOTTOM PANEL ===================== */}
      <div className="bg-white shadow-2xl rounded-t-3xl p-6">
        <div className="grid grid-cols-3 gap-4 mb-6 text-center">
          <div>
            <div className="text-2xl font-bold text-[#002855]">
              {distanceMeters ? `${Math.round(distanceMeters)}m` : "—"}
            </div>
            <div className="text-xs text-gray-500">DISTANCE</div>
            {distanceMiles && (
              <div className="text-[10px] text-gray-400">
                (~{distanceMiles.toFixed(2)} mi)
              </div>
            )}
          </div>

          <div>
            <div className="text-2xl font-bold text-[#002855]">
              {etaMinutes ?? "—"}
            </div>
            <div className="text-xs text-gray-500">MINUTES</div>
          </div>

          <div>
            <div className="text-2xl">🚶</div>
            <div className="text-xs text-gray-500">WALKING</div>
          </div>
        </div>

        <button
          onClick={handleStartAR}
          className="w-full bg-[#002855] text-white rounded-2xl px-8 py-4 font-bold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 mb-3"
        >
          <NavigationIcon className="w-6 h-6" />
          Start AR Navigation
        </button>

        <button
          onClick={() => navigate("/destinations")}
          className="w-full bg-gray-100 text-gray-700 rounded-xl px-6 py-3 font-semibold hover:bg-gray-200"
        >
          Choose Different Destination
        </button>
      </div>
    </div>
  );
}
