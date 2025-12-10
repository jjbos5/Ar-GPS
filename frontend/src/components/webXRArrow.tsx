// src/components/WebXRArrow.tsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { type LatLon, useNavData } from "../hooks/useNavData";

interface Props {
  destination: LatLon;
}

const WebXRArrow: React.FC<Props> = ({ destination }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { arrowAngle, distance } = useNavData(destination);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.xr.enabled = true;
    container.appendChild(renderer.domElement);

    // Scene & camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      70,
      container.clientWidth / container.clientHeight,
      0.01,
      100
    );

    // Simple light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 3, 1);
    scene.add(light);

    // 3D triangular arrow pointing -Z
    const arrowGeom = new THREE.ConeGeometry(0.1, 0.3, 32);
    const arrowMat = new THREE.MeshStandardMaterial({ color: 0x2563eb });
    const arrow = new THREE.Mesh(arrowGeom, arrowMat);
    arrow.position.set(0, 0, -3); // 3 meters in front
    arrow.rotation.x = -Math.PI / 2; // point forward
    scene.add(arrow);

    const clock = new THREE.Clock();

    const onSessionStarted = async (session: XRSession) => {
      renderer.xr.setSession(session);

      renderer.setAnimationLoop(() => {
        const dt = clock.getDelta();

        // rotate arrow smoothly toward arrowAngle
        if (arrowAngle != null) {
          const targetRad = THREE.MathUtils.degToRad(arrowAngle);
          const currentY = arrow.rotation.y;
          const diff = targetRad - currentY;
          arrow.rotation.y += diff * Math.min(dt * 5, 1); // smooth
        }

        renderer.render(scene, camera);
      });
    };

    const startXR = async () => {
      if (!navigator.xr) {
        console.warn("WebXR not available");
        return;
      }
      const supported = await navigator.xr.isSessionSupported("immersive-ar");
      if (!supported) {
        console.warn("immersive-ar not supported");
        return;
      }
      const session = await navigator.xr.requestSession("immersive-ar", {
        requiredFeatures: ["local-floor"],
      });
      onSessionStarted(session);
    };

    startXR();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      renderer.setAnimationLoop(null);
      window.removeEventListener("resize", handleResize);
      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [destination, arrowAngle]);

  const prettyDistance =
    distance == null
      ? "…"
      : distance < 1000
      ? `${distance.toFixed(0)} m`
      : `${(distance / 1000).toFixed(2)} km`;

  return (
    <div className="relative w-full h-screen" ref={containerRef}>
      {/* simple HUD overlay */}
      <div className="absolute bottom-4 left-0 right-0 px-4 pointer-events-none">
        <div className="mx-auto max-w-md bg-white/80 rounded-2xl p-3 flex justify-between text-sm font-semibold">
          <div>
            <div className="text-gray-500 text-xs">DISTANCE</div>
            <div>{prettyDistance}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs">MODE</div>
            <div>3D AR</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebXRArrow;
