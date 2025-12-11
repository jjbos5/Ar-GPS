// src/components/CameraOverlayArrow.tsx
import React, { useEffect, useRef } from "react";
import { useNavData, type LatLon } from "../hooks/useNavData";

interface Props {
  destination: LatLon;
}

const CameraOverlayArrow: React.FC<Props> = ({ destination }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { distance, heading, bearingToDest, arrowAngle } = useNavData(destination);

  // Start camera
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (e) {
        console.error("Camera error:", e);
      }
    };

    startCamera();
  }, []);

  const prettyDistance =
    distance == null
      ? "…"
      : distance < 1000
        ? `${distance.toFixed(0)} m`
        : `${(distance / 1000).toFixed(2)} km`;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Center arrow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-md"
          style={{
            transform: `rotate(${(arrowAngle ?? 0) - 90}deg)`,
            transition: "transform 0.2s linear",
          }}
        >
          <img
            src="/arrow.png"
            alt="direction arrow"
            className="w-12 h-12 object-contain"
          />
        </div>
      </div>

      {/* 🔥 DEBUG OVERLAY — shows real-time heading, bearing, arrow rotation */}
      <div className="absolute top-4 left-4 bg-black/60 text-white text-xs p-2 rounded leading-tight">
        <div>heading: {heading?.toFixed(1) ?? "—"}°</div>
        <div>bearing: {bearingToDest?.toFixed(1) ?? "—"}°</div>
        <div>arrow: {arrowAngle?.toFixed(1) ?? "—"}°</div>
      </div>

      {/* Bottom info bar */}
      <div className="absolute bottom-4 left-0 right-0 px-4">
        <div className="mx-auto max-w-md bg-white/90 rounded-2xl p-3 flex justify-between text-sm font-semibold">
          <div>
            <div className="text-gray-500 text-xs">DISTANCE</div>
            <div>{prettyDistance}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">MODE</div>
            <div>Camera overlay</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraOverlayArrow;
