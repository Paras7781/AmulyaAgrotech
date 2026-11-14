import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface Drone3DCanvasProps {
  className?: string;
  autoRotate?: boolean;
  interactive?: boolean;
  showSpray?: boolean;
  activeHotspot?: string | null;
  onHotspotClick?: (id: string) => void;
  variant?: 'hero' | 'showcase';
}

export function Drone3DCanvas({
  className = '',
  autoRotate = true,
  interactive = true,
  showSpray = true,
  activeHotspot = null,
  onHotspotClick,
  variant = 'hero',
}: Drone3DCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState(true);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support safely
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGLSupported(false);
        return;
      }
    } catch {
      setWebGLSupported(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(variant === 'hero' ? 32 : 38, width / height, 0.1, 100);
    const isSmallScreen = window.matchMedia('(max-width: 700px)').matches;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: !isSmallScreen,
        powerPreference: isSmallScreen ? 'low-power' : 'high-performance',
      });
    } catch {
      setWebGLSupported(false);
      return;
    }
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isSmallScreen ? 1.35 : 1.75));
    container.appendChild(renderer.domElement);

    // 2. Lighting (Natural agricultural sunlight + subtle studio accents)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff6dd, 2.4);
    sunLight.position.set(5, 8, 5);
    sunLight.castShadow = true;
    scene.add(sunLight);

    const goldRimLight = new THREE.DirectionalLight(0xf2c230, 1.8);
    goldRimLight.position.set(-6, -2, -4);
    scene.add(goldRimLight);

    const fillLight = new THREE.PointLight(0x7da469, 1.0, 10);
    fillLight.position.set(0, -2, 2);
    scene.add(fillLight);

    // 3. Materials
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x181a17,
      roughness: 0.35,
      metalness: 0.85,
    });

    const matteDarkMat = new THREE.MeshStandardMaterial({
      color: 0x222621,
      roughness: 0.6,
      metalness: 0.2,
    });

    const goldAccentMat = new THREE.MeshStandardMaterial({
      color: 0xf2c230,
      roughness: 0.25,
      metalness: 0.8,
    });

    const rotorBladeMat = new THREE.MeshStandardMaterial({
      color: 0x282b26,
      roughness: 0.4,
      metalness: 0.3,
      transparent: true,
      opacity: 0.9,
    });

    const glassSensorMat = new THREE.MeshStandardMaterial({
      color: 0x2d8cf0,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x0c3e75,
      emissiveIntensity: 0.6,
    });

    // 4. Construct Hexacopter Agricultural Drone Geometry
    const dronePivot = new THREE.Group();
    scene.add(dronePivot);
    const droneGroup = new THREE.Group();
    dronePivot.add(droneGroup);

    // Central Fuselage Body
    const bodyGeo = new THREE.CylinderGeometry(0.55, 0.65, 0.32, 8);
    const bodyMesh = new THREE.Mesh(bodyGeo, matteDarkMat);
    bodyMesh.castShadow = true;
    droneGroup.add(bodyMesh);

    // Fuselage Top Cover
    const topCoverGeo = new THREE.ConeGeometry(0.56, 0.14, 8);
    const topCoverMesh = new THREE.Mesh(topCoverGeo, carbonMat);
    topCoverMesh.position.y = 0.22;
    droneGroup.add(topCoverMesh);

    // Central Amulya Agrotech Gold Spray Tank
    const tankGeo = new THREE.SphereGeometry(0.44, 16, 12);
    tankGeo.scale(1, 0.68, 1.15);
    const tankMesh = new THREE.Mesh(tankGeo, goldAccentMat);
    tankMesh.position.set(0, -0.15, 0);
    tankMesh.castShadow = true;
    droneGroup.add(tankMesh);

    // GPS / RTK Mast & Puck
    const rtkPoleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.3, 8);
    const rtkPole = new THREE.Mesh(rtkPoleGeo, carbonMat);
    rtkPole.position.set(0, 0.4, -0.22);
    droneGroup.add(rtkPole);

    const rtkPuckGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.04, 16);
    const rtkPuck = new THREE.Mesh(rtkPuckGeo, goldAccentMat);
    rtkPuck.position.set(0, 0.54, -0.22);
    droneGroup.add(rtkPuck);

    // Front Omnidirectional Radar / FPV Sensor Dome
    const radarGeo = new THREE.SphereGeometry(0.14, 16, 12);
    const radarMesh = new THREE.Mesh(radarGeo, glassSensorMat);
    radarMesh.position.set(0, 0.02, 0.62);
    droneGroup.add(radarMesh);

    // Landing Gear (Dual tubular skids)
    const skidGeom = new THREE.CylinderGeometry(0.025, 0.025, 1.6, 12);
    skidGeom.rotateZ(Math.PI / 2);

    const skidLeft = new THREE.Mesh(skidGeom, carbonMat);
    skidLeft.position.set(-0.55, -0.65, 0);
    droneGroup.add(skidLeft);

    const skidRight = new THREE.Mesh(skidGeom, carbonMat);
    skidRight.position.set(0.55, -0.65, 0);
    droneGroup.add(skidRight);

    // Landing Gear Legs
    const legGeom = new THREE.CylinderGeometry(0.02, 0.02, 0.6, 8);
    legGeom.rotateZ(0.28);
    const legFL = new THREE.Mesh(legGeom, carbonMat);
    legFL.position.set(-0.45, -0.4, 0.45);
    droneGroup.add(legFL);

    const legBL = new THREE.Mesh(legGeom, carbonMat);
    legBL.position.set(-0.45, -0.4, -0.45);
    droneGroup.add(legBL);

    const legFR = new THREE.Mesh(legGeom.clone().rotateZ(-0.56), carbonMat);
    legFR.position.set(0.45, -0.4, 0.45);
    droneGroup.add(legFR);

    const legBR = new THREE.Mesh(legGeom.clone().rotateZ(-0.56), carbonMat);
    legBR.position.set(0.45, -0.4, -0.45);
    droneGroup.add(legBR);

    // 6 Carbon Fiber Rotor Arms & Motors in Hexacopter arrangement
    const armCount = 6;
    const armRadius = 1.35;
    const rotorMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < armCount; i++) {
      const angle = (i * Math.PI * 2) / armCount;
      const armDirX = Math.cos(angle);
      const armDirZ = Math.sin(angle);

      // Arm carbon rod
      const armLength = armRadius;
      const armGeo = new THREE.CylinderGeometry(0.03, 0.035, armLength, 8);
      armGeo.rotateZ(Math.PI / 2);
      armGeo.rotateY(angle);
      const armMesh = new THREE.Mesh(armGeo, carbonMat);
      armMesh.position.set((armDirX * armLength) / 2, 0.08, (armDirZ * armLength) / 2);
      droneGroup.add(armMesh);

      // Brushless Motor Pod at tip
      const motorGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.12, 12);
      const motorMesh = new THREE.Mesh(motorGeo, matteDarkMat);
      motorMesh.position.set(armDirX * armRadius, 0.14, armDirZ * armRadius);
      droneGroup.add(motorMesh);

      // Motor Gold Ring Accent
      const ringGeo = new THREE.TorusGeometry(0.092, 0.012, 8, 16);
      ringGeo.rotateX(Math.PI / 2);
      const ringMesh = new THREE.Mesh(ringGeo, goldAccentMat);
      ringMesh.position.set(armDirX * armRadius, 0.18, armDirZ * armRadius);
      droneGroup.add(ringMesh);

      // Twin Propeller Blade
      const bladeGeo = new THREE.BoxGeometry(0.72, 0.01, 0.07);
      const bladeMesh = new THREE.Mesh(bladeGeo, rotorBladeMat);
      bladeMesh.position.set(armDirX * armRadius, 0.22, armDirZ * armRadius);
      droneGroup.add(bladeMesh);
      rotorMeshes.push(bladeMesh);

      // Downward Micron Spray Nozzles (on 4 corner arms)
      if (i % 2 === 0) {
        const nozzleGeo = new THREE.CylinderGeometry(0.018, 0.015, 0.14, 8);
        const nozzleMesh = new THREE.Mesh(nozzleGeo, goldAccentMat);
        nozzleMesh.position.set(armDirX * armRadius * 0.88, -0.06, armDirZ * armRadius * 0.88);
        droneGroup.add(nozzleMesh);
      }
    }

    const modelBounds = new THREE.Box3().setFromObject(droneGroup);
    const modelCenter = modelBounds.getCenter(new THREE.Vector3());
    const modelRadius = modelBounds.getBoundingSphere(new THREE.Sphere()).radius;
    droneGroup.position.sub(modelCenter);
    const centeredPositionY = dronePivot.position.y;
    dronePivot.rotation.x = 0.24;
    dronePivot.rotation.y = variant === 'hero' ? -0.45 : 0.6;

    const frameCamera = (frameWidth: number, frameHeight: number) => {
      if (!frameWidth || !frameHeight) return;
      camera.aspect = frameWidth / frameHeight;
      const verticalFov = THREE.MathUtils.degToRad(camera.fov);
      const verticalTangent = Math.tan(verticalFov / 2);
      const horizontalTangent = verticalTangent * camera.aspect;
      const fitMargin = 0.8;
      const limitingHalfAngle = Math.atan(Math.min(horizontalTangent, verticalTangent) * fitMargin);
      const fitDistance = modelRadius / Math.sin(limitingHalfAngle);
      const target = new THREE.Vector3(0, centeredPositionY, 0);
      camera.position.set(target.x, target.y, target.z + fitDistance * 1.04);
      camera.lookAt(target);
      camera.updateProjectionMatrix();
      renderer.setSize(frameWidth, frameHeight);
    };
    frameCamera(width, height);

    // 5. Spray Mist Particle System (Translucent micro-droplets drifting downwards)
    let sprayParticles: THREE.Points | null = null;
    let particlePositions: Float32Array;
    const particleCount = 280;

    if (showSpray) {
      const sprayGeo = new THREE.BufferGeometry();
      particlePositions = new Float32Array(particleCount * 3);

      for (let p = 0; p < particleCount; p++) {
        particlePositions[p * 3] = (Math.random() - 0.5) * 1.8;
        particlePositions[p * 3 + 1] = -0.2 - Math.random() * 1.6;
        particlePositions[p * 3 + 2] = (Math.random() - 0.5) * 1.8;
      }

      sprayGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const sprayMat = new THREE.PointsMaterial({
        color: 0xe6f4ea,
        size: 0.045,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
      });

      sprayParticles = new THREE.Points(sprayGeo, sprayMat);
      droneGroup.add(sprayParticles);
    }

    // 6. Mouse Interaction & Parallax Orbit
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = dronePivot.rotation.x;
    let targetRotationY = dronePivot.rotation.y;
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.01;
        targetRotationX += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else if (interactive) {
        mouseX = nx;
        mouseY = ny;
        targetRotationY = (variant === 'hero' ? -0.45 : 0.6) + mouseX * 0.55;
        targetRotationX = 0.24 - mouseY * 0.35;
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    // 7. Responsive Resize Handler
    const onResize = () => {
      if (!container) return;
      frameCamera(container.clientWidth, container.clientHeight);
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(onResize)
      : null;
    resizeObserver?.observe(container);
    window.addEventListener('resize', onResize);

    // 8. Animation Render Loop
    let animationFrameId = 0;
    const startTime = performance.now();

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = (performance.now() - startTime) / 1000;

      // Spin rotor propellers continuously
      if (!prefersReducedMotion) {
        rotorMeshes.forEach((blade, index) => {
          blade.rotation.y += (index % 2 === 0 ? 1 : -1) * 0.32;
        });

        // Gentle floating hover oscillation (±5cm altitude, ±2° roll)
        const hoverOffsetY = Math.sin(elapsedTime * 1.8) * 0.07;
        const hoverTiltZ = Math.sin(elapsedTime * 1.2) * 0.035;
        dronePivot.position.y = centeredPositionY + hoverOffsetY;
        dronePivot.rotation.z = hoverTiltZ;

        // Animate downward spray droplet mist
        if (sprayParticles && particlePositions) {
          const positions = sprayParticles.geometry.attributes.position.array as Float32Array;
          for (let p = 0; p < particleCount; p++) {
            positions[p * 3 + 1] -= 0.022; // drift down
            if (positions[p * 3 + 1] < -2.0) {
              positions[p * 3 + 1] = -0.2;
              positions[p * 3] = (Math.random() - 0.5) * 1.6;
              positions[p * 3 + 2] = (Math.random() - 0.5) * 1.6;
            }
          }
          sprayParticles.geometry.attributes.position.needsUpdate = true;
        }

        // Auto slow rotation if not dragging
        if (autoRotate && !isDragging && !isHoveredRef.current && variant === 'showcase') {
          targetRotationY += 0.003;
        }
      }

      // Smooth interpolation for mouse interaction
      dronePivot.rotation.x += (targetRotationX - dronePivot.rotation.x) * 0.06;
      dronePivot.rotation.y += (targetRotationY - dronePivot.rotation.y) * 0.06;

      renderer.render(scene, camera);
    };

    let isInViewport = !('IntersectionObserver' in window);
    const requestRender = () => {
      if (isInViewport && !document.hidden && !animationFrameId) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };
    const stopRender = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = 0;
      }
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        stopRender();
      } else {
        requestRender();
      }
    };
    const visibilityObserver = 'IntersectionObserver' in window
      ? new IntersectionObserver(([entry]) => {
          isInViewport = entry.isIntersecting;
          if (isInViewport) {
            requestRender();
          } else {
            stopRender();
          }
        })
      : null;

    visibilityObserver?.observe(container);
    document.addEventListener('visibilitychange', onVisibilityChange);
    requestRender();

    // Cleanup
    return () => {
      stopRender();
      visibilityObserver?.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      resizeObserver?.disconnect();
      window.removeEventListener('resize', onResize);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);

      // Dispose Geometries and Materials
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((mat) => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });

      renderer.dispose();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [variant, interactive, autoRotate, showSpray]);

  if (!webGLSupported) {
    return (
      <div className={`drone-3d-fallback ${className}`}>
        <img
          src="/assets/campaigns/agribot-hero-banner-new.webp"
          alt="Amulya Agrotech Drone"
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      className={`drone-3d-canvas-wrap ${className}`}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        touchAction: 'pan-y',
        cursor: interactive ? 'grab' : 'default',
      }}
      aria-label="Interactive 3D Agricultural Drone Model"
      role="img"
    >
      <div
        className="drone-3d-hint"
        style={{
          position: 'absolute',
          bottom: '12px',
          right: '16px',
          padding: '4px 10px',
          background: 'rgba(5, 6, 4, 0.65)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '4px',
          color: 'var(--gold, #f2c230)',
          fontFamily: "'DM Mono', monospace",
          fontSize: '10px',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          zIndex: 10,
        }}
      >
        <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: 'var(--gold, #f2c230)' }} />
        3D REALTIME INTERACTIVE • DRAG TO ROTATE
      </div>
    </div>
  );
}

export default Drone3DCanvas;
