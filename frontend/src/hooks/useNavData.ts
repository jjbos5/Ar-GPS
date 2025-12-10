// src/hooks/useNavData.ts
import { useEffect, useState } from "react";
import { getBearing, getDistanceMeters } from "../geo";

export interface LatLon {
  lat: number;
  lon: number;
}

interface NavData {
  userPos: LatLon | null;
  heading: number | null;        // phone compass heading 0–360
  bearingToDest: number | null;  // direction to destination
  distance: number | null;       // meters
  arrowAngle: number | null;     // how much to rotate arrow
}

export function useNavData(destination: LatLon): NavData {
  const [userPos, setUserPos] = useState<LatLon | null>(null);
  const [heading, setHeading] = useState<number | null>(null);

  useEffect(() => {
    // --- GPS ---
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        setUserPos({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      (err) => {
        console.error("Geolocation error", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 1000,
        timeout: 10000,
      }
    );

    // --- Compass / orientation ---
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha == null) return;
      // alpha is 0–360, facing "north" is roughly 0
      setHeading(event.alpha);
    };

    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  let bearingToDest: number | null = null;
  let distance: number | null = null;
  let arrowAngle: number | null = null;

  if (userPos) {
    bearingToDest = getBearing(
      userPos.lat,
      userPos.lon,
      destination.lat,
      destination.lon
    );
    distance = getDistanceMeters(
      userPos.lat,
      userPos.lon,
      destination.lat,
      destination.lon
    );

    if (heading != null) {
      // how much to rotate arrow: "where dest is" - "where phone is pointed"
      arrowAngle = (bearingToDest - heading + 360) % 360;
    }
  }

  return { userPos, heading, bearingToDest, distance, arrowAngle };
}
