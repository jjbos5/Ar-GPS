// frontend/src/pages/ARPage.tsx

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

import type { Destination } from "../types";
import type { BackendRoute } from "../backendApi";

import WebXRArrow from "../components/webXRArrow";
import CameraOverlayArrow from "../components/CameraOverlayArrow";
import type { LatLon } from "../hooks/useNavData";

export default function ARPage() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [destination, setDestination] = useState<Destination | null>(null);
  const [route, setRoute] = useState<BackendRoute | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [arSupported, setArSupported] = useState<boolean | null>(null);

  // --------------------------------------------------------
  // (1) Ask iOS for motion/orientation permission on first tap
  // --------------------------------------------------------
  useEffect(() => {
    const enableIOSOrientation = async () => {
      try {
        const anyDO = DeviceOrientationEvent as any;

        if (typeof anyDO?.requestPermission === "function") {
          const response = await anyDO.requestPermission();
          console.log("iOS Motion Permission:", response);
        }
      } catch (err) {
        console.warn("Could not request iOS motion permission", err);
      }
    };

    const handler = () => {
      enableIOSOrientation();
    };

    window.addEventListener("click", handler, { once: true });

    return () => {
      window.removeEventListener("click", handler);
    };
  }, []);

  // --------------------------------------------------------
  // (2) Load destination + route, start camera & XR check
  // --------------------------------------------------------
  useEffect(() => {
    // Load destination from localStorage
    const storedDest = localStorage.getItem("selectedDestination");
    if (storedDest) {
      setDestination(JSON.parse(storedDest));
    } else {
      navigate("/destinations");
      return;
    }

    // Load optional route
    const storedRoute = localStorage.getItem("activeRoute");
    if (storedRoute) {
      try {
        setRoute(JSON.parse(storedRoute));
      } catch (err) {
        console.error("Failed to parse activeRoute:", err);
      }
    }

    // Check WebXR AR support
    checkARSupport();

    // Start fallback camera
    startCamera();

    return () => {
      stopCamera();
    };
  }, [navigate]);

  // --------------------------------------------------------
  // (3) WebXR Support Detection
  // --------------------------------------------------------
  const checkARSupport = async () => {
    if (!navigator.xr) {
      setArSupported(false);
      return;
    }

    try {
      const supported = await navigator.xr.isSessionSupported("immersive-ar");
      setArSupported(supported);
    } catch (err) {
      console.warn("XR check failed:", err);
      setArSupported(false);
    }
  };

  // --------------------------------------------------------
  // (4) Fallback Camera Mode
  // --------------------------------------------------------
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
  };

  const handleExit = () => {
    stopCamera();
    navigate("/map");
  };

  if (!destination) return null;

  // --------------------------------------------------------
  // (5) If WebXR is supported -> use AR mode
  // --------------------------------------------------------
  if (arSupported === true) {
    const destCoords: LatLon = {
      lat: destination.latitude,
      lon: destination.longitude,
    };

    return <WebXRArrow destination={destCoords} />;
  }

  // --------------------------------------------------------
  // (6) UI Fallback AR Mode (CameraOverlayArrow)
  // --------------------------------------------------------
  const distanceMeters = route?.distance ?? null;
  const etaMinutes = route?.duration ?? null;
  const nextInstruction =
    route?.waypoints?.[1]?.instruction ||
    route?.waypoints?.[0]?.instruction ||
    "Continue straight ahead";

  return (
    <div className="fixed inset-0 bg-black">
      {/* Fallback UI AR */}
      <CameraOverlayArrow
        destination={{
          lat: destination.latitude,
          lon: destination.longitude,
        }}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <button
            onClick={handleExit}
            className="p-2 bg-white/20 backdrop-blur rounded-full"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="flex-1 bg-white/20 backdrop-blur rounded-xl px-4 py-3">
            <p className="text-white font-semibold truncate">
              {destination.name}
            </p>
          </div>
        </div>
      </div>

      {/* T-Bone Mascot */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        <img
          src="/tbone-3d.png"
          alt="T-Bone guide"
          className="w-24 h-24 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Bottom Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow-2xl">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-gray-500 uppercase">Distance</div>
              <div className="text-2xl font-bold text-[#002855]">
                {distanceMeters ? `${Math.round(distanceMeters)}m` : "—"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 uppercase">ETA</div>
              <div className="text-2xl font-bold text-[#002855]">
                {etaMinutes ?? "—"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 uppercase">Direction</div>
              <div className="text-2xl">⬆️</div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-600">
            {nextInstruction}
          </div>
        </div>
      </div>
    </div>
  );
}
