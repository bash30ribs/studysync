import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StudySyncThreeSceneProps {
  primaryColor?: string;
  particleCount?: number;
  className?: string;
  interactive?: boolean;
}

// Create a circular avatar texture for a student/faculty node
function makeAvatarTexture(color: string, rimColor: string, size = 64): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  // Outer glow
  const glow = ctx.createRadialGradient(cx, cy, r * 0.3, cx, cy, r);
  glow.addColorStop(0, color);
  glow.addColorStop(0.6, color + 'aa');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Inner bright disc
  const inner = ctx.createRadialGradient(cx - 4, cy - 4, 0, cx, cy, r * 0.45);
  inner.addColorStop(0, '#ffffff');
  inner.addColorStop(0.5, color);
  inner.addColorStop(1, rimColor);
  ctx.fillStyle = inner;
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.45, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(canvas);
}

// Create a small flat card texture (assignment card floating element)
function makeCardTexture(accentColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 80;
  const ctx = canvas.getContext('2d')!;

  // Card background
  ctx.fillStyle = 'rgba(10,10,15,0.85)';
  ctx.beginPath();
  ctx.roundRect(0, 0, 128, 80, 8);
  ctx.fill();

  // Top accent bar
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, 128, 4);

  // Fake text lines
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillRect(10, 14, 70, 5);
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.fillRect(10, 26, 100, 3);
  ctx.fillRect(10, 34, 80, 3);
  ctx.fillRect(10, 42, 90, 3);

  // Small progress bar
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.beginPath();
  ctx.roundRect(10, 56, 108, 8, 4);
  ctx.fill();
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.roundRect(10, 56, 70, 8, 4);
  ctx.fill();

  // Border
  ctx.strokeStyle = accentColor + '55';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(0.5, 0.5, 127, 79, 8);
  ctx.stroke();

  return new THREE.CanvasTexture(canvas);
}

export const StudySyncThreeScene: React.FC<StudySyncThreeSceneProps> = ({
  primaryColor = '#0095F6',
  particleCount = 55,
  className = '',
  interactive = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Respect reduced-motion preference
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    // ─── Scene, Camera, Renderer ───
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(58, width / height, 0.1, 1000);
    camera.position.z = 100;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // ─── Mouse ───
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = ((e.clientX - rect.left) / width) * 2 - 1;
      mouse.targetY = -(((e.clientY - rect.top) / height) * 2 - 1);
    };
    if (interactive && !prefersReduced) window.addEventListener('mousemove', handleMouseMove);

    let scrollY = window.scrollY;
    const handleScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // ═══════════════════════════════════════════════
    // 1. CENTRAL STUDYSYNC HUB — Glowing sphere with subject rings
    // Metaphor: The StudySync platform as the centre of the class solar system
    // ═══════════════════════════════════════════════
    const hubGroup = new THREE.Group();
    scene.add(hubGroup);

    // Core glowing sphere
    const hubGeo = new THREE.SphereGeometry(10, 32, 32);
    const hubMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(primaryColor),
      transparent: true,
      opacity: 0.18,
      wireframe: true
    });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubGroup.add(hubMesh);

    // Inner bright core — solid
    const coreGeo = new THREE.SphereGeometry(5.5, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#60c8ff'),
      transparent: true,
      opacity: 0.5,
      wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    hubGroup.add(coreMesh);

    // Subject orbital rings — each represents a subject (CS, Maths, Physics, Labs, Electives)
    const subjectRings = [
      { color: '#0095F6', tiltX: Math.PI / 2,    tiltY: 0,              radius: 22, speed:  0.18 }, // CS Blue
      { color: '#f59e0b', tiltX: Math.PI / 6,    tiltY: Math.PI / 3,    radius: 28, speed: -0.13 }, // Maths Amber
      { color: '#a855f7', tiltX: -Math.PI / 4,   tiltY: Math.PI / 5,    radius: 35, speed:  0.10 }, // Physics Purple
      { color: '#10b981', tiltX: Math.PI / 3.5,  tiltY: -Math.PI / 4,   radius: 42, speed: -0.08 }, // Labs Emerald
    ];

    const ringMeshes: THREE.Mesh[] = [];
    subjectRings.forEach((cfg) => {
      const rg = new THREE.TorusGeometry(cfg.radius, 0.22, 8, 120);
      const rm = new THREE.MeshBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: 0.3
      });
      const r = new THREE.Mesh(rg, rm);
      r.rotation.x = cfg.tiltX;
      r.rotation.y = cfg.tiltY;
      hubGroup.add(r);
      ringMeshes.push(r);
    });

    // ═══════════════════════════════════════════════
    // 2. STUDENT / CR / FACULTY NODE CONSTELLATION
    // Color coding: Blue = Students, Amber = CR, Purple = Faculty
    // These float around like a cohort in orbit — you can "see" the class
    // ═══════════════════════════════════════════════
    const nodeTypes = [
      { color: '#38bdf8', rim: '#0066cc', role: 'student', count: Math.floor(particleCount * 0.72), size: 2.8 },
      { color: '#f59e0b', rim: '#b45309', role: 'cr',      count: 4,                                 size: 4.0 },
      { color: '#c084fc', rim: '#7e22ce', role: 'faculty', count: 3,                                 size: 3.5 },
    ];

    interface NodeData {
      px: number; py: number; pz: number;
      vx: number; vy: number; vz: number;
      colorR: number; colorG: number; colorB: number;
      size: number;
    }

    const allNodes: NodeData[] = [];

    const nodeGeo = new THREE.BufferGeometry();
    const nodePosArr: number[] = [];
    const nodeSizeArr: number[] = [];
    const nodeColorArr: number[] = [];
    const nodeTextures: THREE.CanvasTexture[] = [];

    nodeTypes.forEach((nt) => {
      const tex = makeAvatarTexture(nt.color, nt.rim);
      nodeTextures.push(tex);
      const col = new THREE.Color(nt.color);

      for (let i = 0; i < nt.count; i++) {
        // Distribute nodes in a shell around the hub (not too near the center)
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const shellR = 55 + Math.random() * 55;
        const px = shellR * Math.sin(phi) * Math.cos(theta);
        const py = shellR * Math.sin(phi) * Math.sin(theta) * 0.7; // flatten vertically
        const pz = shellR * Math.cos(phi) * 0.6;

        allNodes.push({
          px, py, pz,
          vx: (Math.random() - 0.5) * 0.03,
          vy: (Math.random() - 0.5) * 0.03,
          vz: (Math.random() - 0.5) * 0.03,
          colorR: col.r, colorG: col.g, colorB: col.b,
          size: nt.size,
        });

        nodePosArr.push(px, py, pz);
        nodeSizeArr.push(nt.size);
        nodeColorArr.push(col.r, col.g, col.b);
      }
    });

    const totalNodes = allNodes.length;
    nodeGeo.setAttribute('position', new THREE.Float32BufferAttribute(nodePosArr, 3));
    nodeGeo.setAttribute('color',    new THREE.Float32BufferAttribute(nodeColorArr, 3));

    // Use blended additive student avatar texture
    const studentTex = makeAvatarTexture('#38bdf8', '#0066cc', 64);
    const nodeMat = new THREE.PointsMaterial({
      size: 3.5,
      map: studentTex,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.85,
      sizeAttenuation: true,
    });
    const nodeCloud = new THREE.Points(nodeGeo, nodeMat);
    scene.add(nodeCloud);

    // ═══════════════════════════════════════════════
    // 3. PULSING SYNC BEAMS (connections between nearby students)
    // Metaphor: StudySync keeps everyone connected
    // ═══════════════════════════════════════════════
    const maxBeams = 80;
    const beamPosArr = new Float32Array(maxBeams * 6);
    const beamColArr = new Float32Array(maxBeams * 6);

    const beamGeo = new THREE.BufferGeometry();
    beamGeo.setAttribute('position', new THREE.BufferAttribute(beamPosArr, 3));
    beamGeo.setAttribute('color',    new THREE.BufferAttribute(beamColArr, 3));

    const beamMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.28,
    });
    const beamLines = new THREE.LineSegments(beamGeo, beamMat);
    scene.add(beamLines);

    // ═══════════════════════════════════════════════
    // 4. FLOATING ASSIGNMENT CARDS (academic context props)
    // Small flat planes that look like assignment/attendance cards
    // ═══════════════════════════════════════════════
    const cardColors = ['#0095F6', '#f59e0b', '#10b981', '#c084fc', '#f43f5e', '#38bdf8'];
    const cardMeshes: THREE.Mesh[] = [];
    const cardData: { vx: number; vy: number; vz: number; rx: number; ry: number; rz: number }[] = [];

    for (let i = 0; i < 7; i++) {
      const accentColor = cardColors[i % cardColors.length];
      const cardTex = makeCardTexture(accentColor);

      const cg = new THREE.PlaneGeometry(14, 9);
      const cm = new THREE.MeshBasicMaterial({
        map: cardTex,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
        blending: THREE.NormalBlending,
        depthWrite: false,
      });
      const card = new THREE.Mesh(cg, cm);

      // Position cards in a wide spread area
      card.position.set(
        (Math.random() - 0.5) * 130,
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 60 - 20,
      );
      card.rotation.set(
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      );

      scene.add(card);
      cardMeshes.push(card);
      cardData.push({
        vx: (Math.random() - 0.5) * 0.015,
        vy: (Math.random() - 0.5) * 0.015,
        vz: (Math.random() - 0.5) * 0.010,
        rx: (Math.random() - 0.5) * 0.003,
        ry: (Math.random() - 0.5) * 0.003,
        rz: (Math.random() - 0.5) * 0.002,
      });
    }

    // ═══════════════════════════════════════════════
    // 5. DEEP BACKGROUND STAR DUST (very faint academic context)
    // ═══════════════════════════════════════════════
    const dustGeo = new THREE.BufferGeometry();
    const dustCount = 200;
    const dustPos = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPos[i * 3]     = (Math.random() - 0.5) * 400;
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 300;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 200 - 50;
    }
    dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
    const dustMat = new THREE.PointsMaterial({
      color: 0x334466,
      size: 0.9,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const dustCloud = new THREE.Points(dustGeo, dustMat);
    scene.add(dustCloud);

    // ─── Resize ───
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // ─── Animation Loop ───
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      // ── Hub animations ──
      const pulse = Math.sin(t * 1.4) * 0.03 + 0.97; // subtle scale pulse
      hubMesh.rotation.y  = t * 0.08;
      hubMesh.rotation.x  = t * 0.05;
      coreMesh.rotation.y = -t * 0.15;
      coreMesh.rotation.z = t * 0.10;
      hubGroup.scale.setScalar(pulse);

      // Subject rings orbit
      ringMeshes.forEach((r, i) => {
        r.rotation.z += subjectRings[i].speed * 0.008;
      });

      // Gentle sway of entire hub
      hubGroup.position.x = Math.sin(t * 0.3) * 3;
      hubGroup.position.y = Math.cos(t * 0.22) * 2;

      // ── Parallax camera ──
      const scrollProgress = Math.min(scrollY / 1200, 1);
      if (!prefersReduced) {
        camera.position.x = mouse.x * 10;
        camera.position.y = mouse.y * 6 - scrollProgress * 18;
        camera.lookAt(0, -scrollProgress * 12, 0);
      }

      // ── Node / student drift ──
      const nodePos = nodeGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < totalNodes; i++) {
        const n = allNodes[i];

        // Slow drift
        n.px += n.vx;
        n.py += n.vy;
        n.pz += n.vz;

        // Very gentle gravitational pull toward hub center (keeps cohort cohesive)
        n.vx += (-n.px * 0.00003);
        n.vy += (-n.py * 0.00003);
        n.vz += (-n.pz * 0.00003);

        // Dampen velocity
        n.vx *= 0.999;
        n.vy *= 0.999;
        n.vz *= 0.999;

        // Soft boundary bounce
        const dist = Math.sqrt(n.px * n.px + n.py * n.py + n.pz * n.pz);
        if (dist > 100) {
          n.vx -= n.px * 0.0003;
          n.vy -= n.py * 0.0003;
          n.vz -= n.pz * 0.0003;
        }

        nodePos[i * 3]     = n.px;
        nodePos[i * 3 + 1] = n.py;
        nodePos[i * 3 + 2] = n.pz;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // ── Sync beams: connect nearby student nodes ──
      let beamIdx = 0;
      const maxBeamDist = 30;

      for (let i = 0; i < totalNodes && beamIdx < maxBeams; i++) {
        const n1 = allNodes[i];
        for (let j = i + 1; j < totalNodes && beamIdx < maxBeams; j++) {
          const n2 = allNodes[j];
          const dx = n1.px - n2.px;
          const dy = n1.py - n2.py;
          const dz = n1.pz - n2.pz;
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
          if (d < maxBeamDist) {
            const ptr = beamIdx * 6;
            beamPosArr[ptr]     = n1.px; beamPosArr[ptr + 1] = n1.py; beamPosArr[ptr + 2] = n1.pz;
            beamPosArr[ptr + 3] = n2.px; beamPosArr[ptr + 4] = n2.py; beamPosArr[ptr + 5] = n2.pz;
            const a = (1 - d / maxBeamDist) * (Math.sin(t * 2 + i * 0.5) * 0.3 + 0.7);
            // Beam color blends between the two node colors
            beamColArr[ptr]     = n1.colorR * a; beamColArr[ptr + 1] = n1.colorG * a; beamColArr[ptr + 2] = n1.colorB * a;
            beamColArr[ptr + 3] = n2.colorR * a; beamColArr[ptr + 4] = n2.colorG * a; beamColArr[ptr + 5] = n2.colorB * a;
            beamIdx++;
          }
        }
      }
      // Clear unused beam segments
      for (let k = beamIdx * 6; k < maxBeams * 6; k++) {
        beamPosArr[k] = 0; beamColArr[k] = 0;
      }
      beamGeo.attributes.position.needsUpdate = true;
      beamGeo.attributes.color.needsUpdate = true;

      // ── Floating assignment cards drift ──
      cardMeshes.forEach((card, i) => {
        const cd = cardData[i];
        card.position.x += cd.vx;
        card.position.y += cd.vy;
        card.position.z += cd.vz;
        card.rotation.x += cd.rx;
        card.rotation.y += cd.ry;
        card.rotation.z += cd.rz;

        // Wrap-around boundary
        if (Math.abs(card.position.x) > 80) cd.vx *= -1;
        if (Math.abs(card.position.y) > 55) cd.vy *= -1;
        if (Math.abs(card.position.z) > 50) cd.vz *= -1;

        // Gentle breathe opacity
        (card.material as THREE.MeshBasicMaterial).opacity = 0.3 + Math.sin(t * 0.8 + i * 1.3) * 0.15;
      });

      // ── Dust cloud slow rotation ──
      dustCloud.rotation.y = t * 0.005;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }

      renderer.dispose();
      hubGeo.dispose(); hubMat.dispose();
      coreGeo.dispose(); coreMat.dispose();
      ringMeshes.forEach(r => { r.geometry.dispose(); (r.material as THREE.Material).dispose(); });
      nodeGeo.dispose(); nodeMat.dispose();
      studentTex.dispose();
      nodeTextures.forEach(t => t.dispose());
      beamGeo.dispose(); beamMat.dispose();
      cardMeshes.forEach((c, i) => {
        c.geometry.dispose();
        const m = c.material as THREE.MeshBasicMaterial;
        m.map?.dispose(); m.dispose();
      });
      dustGeo.dispose(); dustMat.dispose();
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
