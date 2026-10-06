import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StudySyncThreeSceneProps {
  primaryColor?: string;
  particleCount?: number;
  className?: string;
  interactive?: boolean;
}

/**
 * Clean, high-end 3D background for StudySync.
 * Uses a cohesive, unified academic blue/cyan palette with a subtle flowing wave grid
 * and elegant drifting constellation nodes. Eliminates chaotic multicolored flashing rings
 * and clumsy rotating geometric primitives in favor of a smooth, premium SaaS-level canvas.
 */
export const StudySyncThreeScene: React.FC<StudySyncThreeSceneProps> = ({
  primaryColor = '#0095F6',
  particleCount = 70,
  className = '',
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Honor accessibility
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || window.innerHeight;

    // ── Three.js Scene, Camera, Renderer ──
    const scene = new THREE.Scene();
    // Soft camera angle
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
    camera.position.set(0, 15, 80);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ── Mouse with smooth interpolation (lerp) ──
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };

    if (interactive && !prefersReducedMotion) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Scroll listener for subtle parallax
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── 1. Elegant Flowing Wave Plane (Represents class synchronization stream) ──
    const gridRows = 28;
    const gridCols = 44;
    const gridWidth = 140;
    const gridDepth = 90;
    const waveGeo = new THREE.PlaneGeometry(gridWidth, gridDepth, gridCols, gridRows);
    waveGeo.rotateX(-Math.PI / 2);
    waveGeo.translate(0, -18, -10);

    const posAttr = waveGeo.attributes.position;
    const initialY = new Float32Array(posAttr.count);
    for (let i = 0; i < posAttr.count; i++) {
      initialY[i] = posAttr.getY(i);
    }

    // Soft cyan/electric blue points for the wave
    const waveMat = new THREE.PointsMaterial({
      color: new THREE.Color(primaryColor),
      size: 1.25,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const wavePoints = new THREE.Points(waveGeo, waveMat);
    scene.add(wavePoints);

    // ── 2. Subtle Constellation Particle Network (Students & CR sync nodes) ──
    const constellationCount = particleCount;
    const nodePositions = new Float32Array(constellationCount * 3);
    const nodeVelocities: { x: number; y: number; z: number }[] = [];

    const spreadX = 110;
    const spreadY = 50;
    const spreadZ = 60;

    for (let i = 0; i < constellationCount; i++) {
      const idx = i * 3;
      nodePositions[idx] = (Math.random() - 0.5) * spreadX;
      nodePositions[idx + 1] = (Math.random() - 0.5) * spreadY + 4;
      nodePositions[idx + 2] = (Math.random() - 0.5) * spreadZ;

      nodeVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02
      });
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));

    // Crisp soft radial glow dot for nodes
    const dotCanvas = document.createElement('canvas');
    dotCanvas.width = 32;
    dotCanvas.height = 32;
    const dotCtx = dotCanvas.getContext('2d');
    if (dotCtx) {
      const grad = dotCtx.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.35, 'rgba(0, 149, 246, 0.85)');
      grad.addColorStop(1, 'rgba(0, 149, 246, 0)');
      dotCtx.fillStyle = grad;
      dotCtx.fillRect(0, 0, 32, 32);
    }
    const dotTexture = new THREE.CanvasTexture(dotCanvas);

    const nodeMat = new THREE.PointsMaterial({
      size: 2.2,
      map: dotTexture,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const nodeCloud = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodeCloud);

    // ── 3. Subtle Connection Filaments between nearby nodes ──
    const maxFilaments = 70;
    const filamentPositions = new Float32Array(maxFilaments * 6);
    const filamentColors = new Float32Array(maxFilaments * 6);

    const filamentGeo = new THREE.BufferGeometry();
    filamentGeo.setAttribute('position', new THREE.BufferAttribute(filamentPositions, 3));
    filamentGeo.setAttribute('color', new THREE.BufferAttribute(filamentColors, 3));

    const filamentMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const filamentMesh = new THREE.LineSegments(filamentGeo, filamentMat);
    scene.add(filamentMesh);

    // ── Resize Handler ──
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ── Animation Loop ──
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // 1. Animate wave plane smoothly (fluid classroom sync stream)
      const currentPos = waveGeo.attributes.position;
      for (let i = 0; i < currentPos.count; i++) {
        const u = currentPos.getX(i);
        const v = currentPos.getZ(i);
        // Harmonic smooth wave
        const yVal =
          Math.sin(u * 0.08 + elapsedTime * 1.2) * 2.2 +
          Math.cos(v * 0.09 + elapsedTime * 0.9) * 2.0;
        currentPos.setY(i, initialY[i] + yVal);
      }
      currentPos.needsUpdate = true;

      // 2. Camera parallax smoothly responsive to mouse and scroll
      const scrollRatio = Math.min(scrollY / 1000, 1);
      if (!prefersReducedMotion) {
        camera.position.x = mouse.x * 8;
        camera.position.y = 15 + mouse.y * 5 - scrollRatio * 10;
        camera.lookAt(0, -scrollRatio * 6, 0);
      }

      // 3. Node positions subtle drift
      const positions = nodeGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < constellationCount; i++) {
        const idx = i * 3;
        positions[idx] += nodeVelocities[i].x;
        positions[idx + 1] += nodeVelocities[i].y;
        positions[idx + 2] += nodeVelocities[i].z;

        // Soft bounce boundaries
        if (Math.abs(positions[idx]) > spreadX * 0.5) nodeVelocities[i].x *= -1;
        if (Math.abs(positions[idx + 1]) > spreadY * 0.5) nodeVelocities[i].y *= -1;
        if (Math.abs(positions[idx + 2]) > spreadZ * 0.5) nodeVelocities[i].z *= -1;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // 4. Subtle connection filaments
      let filamentIdx = 0;
      const fPos = filamentGeo.attributes.position.array as Float32Array;
      const fCol = filamentGeo.attributes.color.array as Float32Array;
      const connectionDist = 20;

      for (let i = 0; i < constellationCount && filamentIdx < maxFilaments; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        for (let j = i + 1; j < constellationCount && filamentIdx < maxFilaments; j++) {
          const x2 = positions[j * 3];
          const y2 = positions[j * 3 + 1];
          const z2 = positions[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < connectionDist) {
            const ptr = filamentIdx * 6;
            fPos[ptr] = x1;
            fPos[ptr + 1] = y1;
            fPos[ptr + 2] = z1;
            fPos[ptr + 3] = x2;
            fPos[ptr + 4] = y2;
            fPos[ptr + 5] = z2;

            const alpha = (1 - dist / connectionDist) * 0.6;
            // Cohesive cyan to clean blue
            fCol[ptr] = 0.0 * alpha;
            fCol[ptr + 1] = 0.58 * alpha;
            fCol[ptr + 2] = 0.96 * alpha;

            fCol[ptr + 3] = 0.22 * alpha;
            fCol[ptr + 4] = 0.74 * alpha;
            fCol[ptr + 5] = 1.0 * alpha;

            filamentIdx++;
          }
        }
      }

      // Zero out unused filaments
      for (let k = filamentIdx * 6; k < maxFilaments * 6; k++) {
        fPos[k] = 0;
        fCol[k] = 0;
      }
      filamentGeo.attributes.position.needsUpdate = true;
      filamentGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // ── Cleanup ──
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      nodeGeo.dispose();
      nodeMat.dispose();
      dotTexture.dispose();
      filamentGeo.dispose();
      filamentMat.dispose();
    };
  }, [primaryColor, particleCount, interactive]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    />
  );
};
