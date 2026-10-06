import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StudySyncThreeSceneProps {
  primaryColor?: string;
  particleCount?: number;
  className?: string;
  interactive?: boolean;
}

export const StudySyncThreeScene: React.FC<StudySyncThreeSceneProps> = ({
  primaryColor = '#0095F6',
  particleCount = 90,
  className = '',
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 85;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Mouse coordinates with damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;
      mouse.targetX = (clientX / width) * 2 - 1;
      mouse.targetY = -(clientY / height) * 2 + 1;
    };

    if (interactive) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    // Scroll offset
    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ── 1. Central Rotating Sync Core (Academic Hologram) ──
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // Outer wireframe icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(18, 1);
    const icoMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(primaryColor),
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const icoMesh = new THREE.Mesh(icoGeo, icoMat);
    coreGroup.add(icoMesh);

    // Inner glowing core
    const innerGeo = new THREE.OctahedronGeometry(9, 0);
    const innerMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#38bdf8'),
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Floating orbital rings (representing synchronization rings)
    const ringGeo1 = new THREE.TorusGeometry(26, 0.2, 16, 100);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#a855f7'),
      transparent: true,
      opacity: 0.25
    });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.TorusGeometry(32, 0.15, 16, 100);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#0095F6'),
      transparent: true,
      opacity: 0.2
    });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // ── 2. Network Node Constellation (Floating Cohort Particles) ──
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    const spread = 120;
    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      particlePositions[idx] = (Math.random() - 0.5) * spread * 1.5;
      particlePositions[idx + 1] = (Math.random() - 0.5) * spread;
      particlePositions[idx + 2] = (Math.random() - 0.5) * spread;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.04,
        y: (Math.random() - 0.5) * 0.04,
        z: (Math.random() - 0.5) * 0.04
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite (circular soft particle)
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(0,149,246,0.8)');
      gradient.addColorStop(1, 'rgba(0,149,246,0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 2.4,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.75
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // ── 3. Dynamic Interconnection Lines ──
    // Max line pairs
    const maxLines = 120;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.35
    });

    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(linesMesh);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ── Animation Loop ──
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow (lerp)
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Rotate central core
      icoMesh.rotation.x = elapsedTime * 0.12;
      icoMesh.rotation.y = elapsedTime * 0.18;
      innerMesh.rotation.x = -elapsedTime * 0.2;
      innerMesh.rotation.z = elapsedTime * 0.25;

      ring1.rotation.z = elapsedTime * 0.15;
      ring2.rotation.z = -elapsedTime * 0.12;

      // Parallax camera movement based on mouse & scroll
      const scrollProgress = Math.min(scrollY / 1200, 1);
      camera.position.x = mouse.x * 12;
      camera.position.y = mouse.y * 8 - scrollProgress * 15;
      camera.lookAt(0, -scrollProgress * 10, 0);

      // Core position subtle sway
      coreGroup.position.x = Math.sin(elapsedTime * 0.5) * 2;
      coreGroup.position.y = Math.cos(elapsedTime * 0.4) * 2;

      // Update particles
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        positions[idx] += particleVelocities[i].x;
        positions[idx + 1] += particleVelocities[i].y;
        positions[idx + 2] += particleVelocities[i].z;

        // Bounce within boundaries
        const boundX = spread * 0.75;
        const boundY = spread * 0.5;
        const boundZ = spread * 0.5;

        if (Math.abs(positions[idx]) > boundX) particleVelocities[i].x *= -1;
        if (Math.abs(positions[idx + 1]) > boundY) particleVelocities[i].y *= -1;
        if (Math.abs(positions[idx + 2]) > boundZ) particleVelocities[i].z *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Update lines between close nodes
      let lineIndex = 0;
      const linePos = lineGeo.attributes.position.array as Float32Array;
      const lineCol = lineGeo.attributes.color.array as Float32Array;
      const maxConnectDist = 24;

      for (let i = 0; i < particleCount && lineIndex < maxLines; i++) {
        const x1 = positions[i * 3];
        const y1 = positions[i * 3 + 1];
        const z1 = positions[i * 3 + 2];

        for (let j = i + 1; j < particleCount && lineIndex < maxLines; j++) {
          const x2 = positions[j * 3];
          const y2 = positions[j * 3 + 1];
          const z2 = positions[j * 3 + 2];

          const dx = x1 - x2;
          const dy = y1 - y2;
          const dz = z1 - z2;
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < maxConnectDist) {
            const ptr = lineIndex * 6;
            linePos[ptr] = x1;
            linePos[ptr + 1] = y1;
            linePos[ptr + 2] = z1;
            linePos[ptr + 3] = x2;
            linePos[ptr + 4] = y2;
            linePos[ptr + 5] = z2;

            const alpha = 1 - dist / maxConnectDist;
            // Gradient color: Cyan to Blue
            lineCol[ptr] = 0.0 * alpha;
            lineCol[ptr + 1] = 0.58 * alpha;
            lineCol[ptr + 2] = 0.96 * alpha;

            lineCol[ptr + 3] = 0.2 * alpha;
            lineCol[ptr + 4] = 0.7 * alpha;
            lineCol[ptr + 5] = 1.0 * alpha;

            lineIndex++;
          }
        }
      }

      // Clear remaining line segments
      for (let k = lineIndex * 6; k < maxLines * 6; k++) {
        linePos[k] = 0;
        lineCol[k] = 0;
      }

      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      // Dispose Three.js resources
      renderer.dispose();
      icoGeo.dispose();
      icoMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      ringGeo1.dispose();
      ringMat1.dispose();
      ringGeo2.dispose();
      ringMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      lineGeo.dispose();
      lineMat.dispose();
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
