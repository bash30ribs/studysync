import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useStudySync } from '../../store';
import { UserRole } from '../../types';
import './LandingPage.css';

interface LandingPageProps {
  onEnterApp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
  const { switchRole, allUsers, createClass, joinClass } = useStudySync();

  // ── Toast State ──
  const [toastState, setToastState] = useState<{ msg: string; tone: 'green' | 'blue' | 'amber'; visible: boolean }>({
    msg: '',
    tone: 'green',
    visible: false
  });
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string, tone: 'green' | 'blue' | 'amber' = 'green') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastState({ msg, tone, visible: true });
    toastTimerRef.current = setTimeout(() => {
      setToastState(prev => ({ ...prev, visible: false }));
    }, 2800);
  }, []);

  // ── Modal State ──
  const [activeModal, setActiveModal] = useState<'login' | 'join' | 'create' | 'about' | 'security' | null>(null);
  const [joinCodeDigits, setJoinCodeDigits] = useState(['', '', '', '', '', '']);
  const [createClassName, setCreateClassName] = useState('AIML 2026 — Division A');
  const [createSubject, setCreateSubject] = useState('Fluid Mechanics');

  // ── Figure 4.1 Mockup State ──
  const [mockTab, setMockTab] = useState<0 | 1 | 2>(0);
  const [counters, setCounters] = useState({ enrolled: 0, subjects: 0, pending: 0, deadlines: 0 });
  const [cohortProgress, setCohortProgress] = useState(40);
  const [remindBtnState, setRemindBtnState] = useState<'idle' | 'sent'>('idle');
  const [nudgeBtnText, setNudgeBtnText] = useState('Nudge Pending');
  const [mockTilt, setMockTilt] = useState({ rx: 0, ry: 0, gx: 50, gy: 50 });

  // ── Calculator State ──
  const [totalLec, setTotalLec] = useState(40);
  const [attLec, setAttLec] = useState(28);
  const [activePreset, setActivePreset] = useState<number | null>(70);

  // ── Proof Simulator State ──
  const [pName, setPName] = useState('Aaditya Verma');
  const [pAss, setPAss] = useState('Fluid Mechanics — Lab Experiment 4');
  const [receiptData, setReceiptData] = useState<{
    name: string;
    ass: string;
    time: string;
    hash: string;
  } | null>(null);

  // ── Audio State ──
  const [isAudioOpen, setIsAudioOpen] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<'rain' | 'brown' | 'binaural' | 'off'>('off');
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioNodesRef = useRef<any[]>([]);
  const masterGainRef = useRef<GainNode | null>(null);

  // ── Scroll & Cursor Refs ──
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const tiltRef = useRef<HTMLDivElement | null>(null);
  const cursorDotRef = useRef<HTMLDivElement | null>(null);
  const cursorRingRef = useRef<HTMLDivElement | null>(null);
  const sprogRef = useRef<HTMLElement | null>(null);
  const progressFillRef = useRef<SVGCircleElement | null>(null);
  const progressNumRef = useRef<HTMLSpanElement | null>(null);
  const progressRingRef = useRef<HTMLDivElement | null>(null);
  const navRef = useRef<HTMLElement | null>(null);
  const heroMeshRef = useRef<HTMLDivElement | null>(null);
  const heroHeadRef = useRef<HTMLDivElement | null>(null);
  const pinnedSplitRef = useRef<HTMLElement | null>(null);
  const chaosCardRef = useRef<HTMLDivElement | null>(null);
  const calmCardRef = useRef<HTMLDivElement | null>(null);
  const hSectionRef = useRef<HTMLElement | null>(null);
  const hTrackRef = useRef<HTMLDivElement | null>(null);

  // ── Persona Handlers ──
  const facultyUser = allUsers.find(u => u.role === 'Faculty') || { id: 'user-fac-1', name: 'Dr. Meenakshi Sundaram' };
  const crUser = allUsers.find(u => u.role === 'CR') || { id: 'user-cr-1', name: 'Ribhav Sharma (CR)' };
  const studentUser = allUsers.find(u => u.role === 'Student') || { id: 'user-stu-1', name: 'Aaditya Verma' };

  const handlePersonaEntry = (role: UserRole, userObj: { id: string; name: string }) => {
    switchRole(role, userObj.id);
    showToast(`Entering as ${role} — ${userObj.name}`, 'blue');
    setTimeout(() => {
      onEnterApp();
    }, 600);
  };

  // ── Custom Cursor Logic ──
  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) return;
    const dot = cursorDotRef.current;
    const ring = cursorRingRef.current;
    if (!dot || !ring) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let active = false;
    let animId: number;

    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!active) {
        active = true;
        document.body.classList.add('pointer-on');
        rx = mx;
        ry = my;
      }
    };

    const onMouseLeave = () => {
      document.body.classList.remove('pointer-on');
      active = false;
    };

    const onMouseDown = () => ring.classList.add('down');
    const onMouseUp = () => ring.classList.remove('down');

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);

    const hoverSel = 'a, button, .btn, .persona, .preset, .trust-chip, input, select, .mtab, .split-card, .arch-card, .file-row, .stu-row';
    const onMouseOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(hoverSel)) ring.classList.add('hover');
    };
    const onMouseOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest(hoverSel)) ring.classList.remove('hover');
    };
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    const loop = () => {
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%,-50%)`;
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      cancelAnimationFrame(animId);
      document.body.classList.remove('pointer-on');
    };
  }, []);

  // ── Scroll Progress & Reveal Intersection Observer ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const CIRC = 2 * Math.PI * 18;
    let ringVisible = false;

    const onScroll = () => {
      const scrollY = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const p = h > 0 ? scrollY / h : 0;

      if (sprogRef.current) sprogRef.current.style.transform = `scaleX(${p})`;
      if (progressFillRef.current) progressFillRef.current.style.strokeDashoffset = String(CIRC * (1 - p));
      if (progressNumRef.current) progressNumRef.current.textContent = String(Math.round(p * 100));

      if (navRef.current) {
        navRef.current.classList.toggle('stuck', scrollY > 24);
      }

      if (progressRingRef.current) {
        if (scrollY > 200 && !ringVisible) {
          progressRingRef.current.classList.add('show');
          ringVisible = true;
        } else if (scrollY <= 200 && ringVisible) {
          progressRingRef.current.classList.remove('show');
          ringVisible = false;
        }
      }

      // Parallax hero
      if (scrollY < 900) {
        if (heroMeshRef.current) heroMeshRef.current.style.transform = `translate3d(0, ${scrollY * 0.28}px, 0)`;
        if (heroHeadRef.current) {
          heroHeadRef.current.style.transform = `translate3d(0, ${scrollY * 0.1}px, 0)`;
          heroHeadRef.current.style.opacity = String(1 - Math.min(scrollY / 550, 1));
        }
      }

      // Pinned Split
      if (pinnedSplitRef.current && chaosCardRef.current && calmCardRef.current && window.innerWidth >= 900) {
        const r = pinnedSplitRef.current.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const progress = Math.min(Math.max(-r.top / total, 0), 1);
        const e = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        const offset = (1 - e) * Math.min(window.innerWidth * 0.55, 600);
        chaosCardRef.current.style.transform = `translateX(${-offset}px) rotate(${-e * 2}deg)`;
        calmCardRef.current.style.transform = `translateX(${offset}px) rotate(${e * 2}deg)`;
        chaosCardRef.current.style.opacity = String(0.3 + e * 0.7);
        calmCardRef.current.style.opacity = String(0.3 + e * 0.7);
      }

      // Horizontal architecture scroll
      if (hSectionRef.current && hTrackRef.current && window.innerWidth >= 900) {
        const r = hSectionRef.current.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        const progress = Math.min(Math.max(-r.top / total, 0), 1);
        const maxX = Math.max(0, hTrackRef.current.scrollWidth - window.innerWidth + 40);
        hTrackRef.current.style.transform = `translate3d(${-progress * maxX}px, 0, 0)`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // Reveal IO
    const revealEls = document.querySelectorAll('.studysync-landing .reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('in');
        else e.target.classList.remove('in');
      });
    }, { threshold: 0.05, rootMargin: '-8% 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));

    const eyebrowEls = document.querySelectorAll('.studysync-landing .eyebrow');
    const eio = new IntersectionObserver((entries) => {
      entries.forEach(e => e.target.classList.toggle('in', e.isIntersecting));
    }, { threshold: 0.5 });
    eyebrowEls.forEach(el => eio.observe(el));

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      io.disconnect();
      eio.disconnect();
    };
  }, []);

  // ── Hero Particle Canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    let pts: Array<{ x: number; y: number; vx: number; vy: number; r: number }> = [];
    let running = true;
    let mx = -9999, my = -9999;
    let animId: number;

    const resize = () => {
      if (!canvas.parentElement) return;
      const r = canvas.parentElement.getBoundingClientRect();
      W = r.width;
      H = r.height;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      const n = Math.min(Math.max(Math.round((W * H) / 24000), 18), 50);
      pts = Array.from({ length: n }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: Math.random() * 1.1 + 0.5
      }));
    };

    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);

      for (const p of pts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
      }

      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 17000) {
            const o = (1 - d2 / 17000) * 0.16;
            ctx.strokeStyle = `rgba(180,195,215,${o})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      for (const p of pts) {
        const dxm = p.x - mx, dym = p.y - my;
        const dm = Math.hypot(dxm, dym);
        const near = dm < 150;
        if (near) {
          ctx.strokeStyle = `rgba(180,200,225,${(1 - dm / 150) * 0.22})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mx, my);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, near ? p.r * 1.5 : p.r, 0, Math.PI * 2);
        ctx.fillStyle = near ? 'rgba(200,215,235,.55)' : 'rgba(160,180,205,.24)';
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const handleMouseLeave = () => { mx = my = -9999; };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove, { passive: true });
    canvas.parentElement?.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', resize);
    resize();
    animId = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
      canvas.parentElement?.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // ── Figure 4.1 Mockup Auto Cycle & Counters ──
  useEffect(() => {
    let animFrame: number;
    const dur = 1400;
    const startTime = performance.now();
    const animateCounters = (now: number) => {
      const t = Math.min((now - startTime) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 4);
      setCounters({
        enrolled: Math.round(10 * ease),
        subjects: Math.round(6 * ease),
        pending: Math.round(20 * ease),
        deadlines: Math.round(3 * ease)
      });
      if (t < 1) animFrame = requestAnimationFrame(animateCounters);
    };
    animFrame = requestAnimationFrame(animateCounters);

    const fillTimer = setTimeout(() => {
      setCohortProgress(60);
    }, 600);

    const tabInterval = setInterval(() => {
      setMockTab(prev => ((prev + 1) % 3) as 0 | 1 | 2);
    }, 5000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(fillTimer);
      clearInterval(tabInterval);
    };
  }, []);

  // ── Figure 4.1 Tilt Movement ──
  const handleStageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const stage = stageRef.current;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setMockTilt({
      rx: -py * 5,
      ry: px * 7,
      gx: px * 100 + 50,
      gy: py * 100 + 50
    });
  };

  const handleStageMouseLeave = () => {
    setMockTilt({ rx: 0, ry: 0, gx: 50, gy: 50 });
  };

  // ── Remind All Particle Burst ──
  const handleRemindAllClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (remindBtnState === 'sent') return;
    setRemindBtnState('sent');
    showToast('Nudge dispatched to 20 pending students', 'green');

    // Spawn tiny particle bursts
    const r = e.currentTarget.getBoundingClientRect();
    for (let i = 0; i < 14; i++) {
      const p = document.createElement('div');
      const size = 4 + Math.random() * 3;
      p.style.cssText = `
        position:fixed;left:${r.left + r.width / 2}px;top:${r.top + r.height / 2}px;
        width:${size}px;height:${size}px;border-radius:50%;
        background:${i % 2 ? 'rgba(200,215,235,.9)' : 'rgba(139,169,196,.9)'};
        pointer-events:none;z-index:99;
      `;
      document.body.appendChild(p);
      const ang = Math.random() * Math.PI * 2;
      const dist = 50 + Math.random() * 80;
      p.animate([
        { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(ang) * dist - 50}%, ${Math.sin(ang) * dist - 50}%) scale(0)`, opacity: 0 }
      ], { duration: 700 + Math.random() * 400, easing: 'cubic-bezier(.2,.8,.2,1)' })
        .onfinish = () => p.remove();
    }

    setTimeout(() => {
      setRemindBtnState('idle');
    }, 2600);
  };

  // ── Nudge Pending Click ──
  const handleNudgePendingClick = () => {
    setNudgeBtnText('Nudge sent');
    showToast('20 students notified via EduTrack push', 'green');
    setTimeout(() => setNudgeBtnText('Nudge Pending'), 2400);
  };

  // ── Calculator Logic ──
  const calcPct = totalLec > 0 ? (attLec / totalLec) * 100 : 0;
  const isCalcSafe = calcPct >= 75;
  const needLectures = Math.max(Math.ceil((0.75 * totalLec - attLec) / 0.25), 0);
  const canMissLectures = Math.max(Math.floor((4 / 3) * attLec - totalLec), 0);

  // ── Proof Simulator SHA-256 ──
  const handleGenerateReceipt = async () => {
    const stamp = new Date();
    const str = `${pName}|${pAss}|${stamp.toISOString()}`;
    let hash = '';
    try {
      if (typeof window !== 'undefined' && window.crypto?.subtle) {
        const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
      }
    } catch {
      // Fallback hash
      hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }
    if (!hash) {
      hash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    }

    setReceiptData({
      name: pName.trim() || 'Unnamed Student',
      ass: pAss,
      time: stamp.toLocaleString('en-IN', { hour12: true }),
      hash: '0x' + hash
    });
    showToast('Submission receipt generated and hashed', 'green');
  };

  const handleCopyHash = () => {
    if (!receiptData) return;
    navigator.clipboard?.writeText(receiptData.hash).then(
      () => showToast('SHA-256 hash copied to clipboard', 'green'),
      () => showToast('Copy blocked by browser', 'amber')
    );
  };

  // ── Focus Audio Web Audio Implementation ──
  const playFocusSound = (kind: 'rain' | 'brown' | 'binaural' | 'off') => {
    if (typeof window === 'undefined') return;

    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        masterGainRef.current = audioCtxRef.current.createGain();
        masterGainRef.current.gain.value = 0;
        masterGainRef.current.connect(audioCtxRef.current.destination);
      }
    }

    const ctx = audioCtxRef.current;
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (ctx.state === 'suspended') ctx.resume();

    // Stop current nodes
    audioNodesRef.current.forEach(n => {
      try { if (n.stop) n.stop(); n.disconnect(); } catch {}
    });
    audioNodesRef.current = [];
    master.gain.setTargetAtTime(0, ctx.currentTime, 0.15);

    if (kind === 'off') {
      setCurrentAudio('off');
      return;
    }

    const makeBuffer = (type: 'white' | 'brown') => {
      const len = ctx.sampleRate * 3;
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      if (type === 'brown') {
        let last = 0;
        for (let i = 0; i < len; i++) {
          const w = Math.random() * 2 - 1;
          last = (last + 0.02 * w) / 1.02;
          d[i] = last * 3.4;
        }
      } else {
        for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      }
      return buf;
    };

    if (kind === 'rain') {
      const src = ctx.createBufferSource();
      src.buffer = makeBuffer('white');
      src.loop = true;
      const bp = ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 1400;
      bp.Q.value = 0.55;
      const hp = ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 380;
      const g = ctx.createGain();
      g.gain.value = 0.3;
      src.connect(hp);
      hp.connect(bp);
      bp.connect(g);
      g.connect(master);
      src.start();
      audioNodesRef.current = [src];
    } else if (kind === 'brown') {
      const src = ctx.createBufferSource();
      src.buffer = makeBuffer('brown');
      src.loop = true;
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 520;
      lp.Q.value = 0.4;
      const g = ctx.createGain();
      g.gain.value = 0.48;
      src.connect(lp);
      lp.connect(g);
      g.connect(master);
      src.start();
      audioNodesRef.current = [src];
    } else if (kind === 'binaural') {
      const g = ctx.createGain();
      g.gain.value = 0.08;
      g.connect(master);

      const mk = (freq: number, pan: number) => {
        const o = ctx.createOscillator();
        o.type = 'sine';
        o.frequency.value = freq;
        if (ctx.createStereoPanner) {
          const p = ctx.createStereoPanner();
          p.pan.value = pan;
          o.connect(p);
          p.connect(g);
        } else {
          o.connect(g);
        }
        o.start();
        audioNodesRef.current.push(o);
      };
      mk(200, -1);
      mk(210, 1);
    }

    master.gain.setTargetAtTime(1, ctx.currentTime, 0.5);
    setCurrentAudio(kind);
    showToast(`Focus sound: ${kind.charAt(0).toUpperCase() + kind.slice(1)}`, 'blue');
  };

  useEffect(() => {
    return () => {
      audioNodesRef.current.forEach(n => {
        try { if (n.stop) n.stop(); n.disconnect(); } catch {}
      });
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  // ── Architecture Cards Data ──
  const archCards = [
    {
      f: 'Figure 4.2',
      t: 'Assignment Proofs & Milestones',
      d: 'Every hand-in is hashed with SHA-256 and timestamped, producing an immutable proof that ends submission disputes permanently.',
      tag: 'Cryptographic'
    },
    {
      f: 'Figure 4.3',
      t: '75% Attendance Defaulter Radar',
      d: 'Real-time percentage calculation with the sessions-required formula. Flags defaulters the moment they cross the danger line.',
      tag: 'Real-time'
    },
    {
      f: 'Figure 4.4',
      t: 'EduTrack RFC Identity Engine',
      d: 'Deterministic STU- / EMP- UID generation with secure credentials. No email loops, no OTP delays, no password resets mid-lecture.',
      tag: 'Identity'
    },
    {
      f: 'Figure 4.5',
      t: 'Immutable Official Broadcasts',
      d: 'CR broadcasts are pinned and permanent. Announcements never get buried under chat or "was that message deleted?".',
      tag: 'Broadcast'
    },
    {
      f: 'Figure 4.6',
      t: 'Democratic Consensus Polls',
      d: 'Anonymous polls for viva scheduling and elective selection. Clean results instead of typing "1 = Monday, 2 = Tuesday".',
      tag: 'Consensus'
    },
    {
      f: 'Figure 4.7',
      t: 'Centralized Academic Vault',
      d: 'PYQs, lab manuals, syllabus PDFs and notes stored permanently. Links never expire, messages never vanish into history.',
      tag: 'Storage'
    }
  ];

  // ── Comparison Table Rows ──
  const cmpRows = [
    { s: 'Who submitted the assignment?', b: 'Ask 32 people one by one in chat', g: 'Real-time count, names, timestamps' },
    { s: 'Who was absent today?', b: 'Go through paper register or guess', g: 'One-click session, auto % calculator' },
    { s: 'Subject-wise student status', b: 'Lost in infinite chat history', g: 'Dedicated Subject CR and inspector' },
    { s: 'Class announcement', b: 'Floods the chat, gets buried', g: 'Pinned broadcast, everyone sees it' },
    { s: 'Important notes / PDFs', b: 'Four-day-old message, link expired', g: 'Permanent resource library' },
    { s: 'Viva date poll', b: 'Type "1 = Monday, 2 = Tuesday…"', g: 'Clean anonymous poll, instant result' }
  ];

  const marqueeItems = [
    'Assignment Proof Ledger', '75% Attendance Radar', 'EduTrack RFC Identity',
    'Immutable Broadcasts', 'Consensus Polls', 'Academic Vault',
    'One-Click Nudges', 'Defaulter Alerts', 'Zero Password Onboarding',
    'Subject-wise CR Roles', 'Live Submission Counters', 'PYQ Library'
  ];

  return (
    <div className="studysync-landing">
      {/* ── CUSTOM CURSOR ── */}
      <div className="cursor-ring" ref={cursorRingRef} id="cursorRing" />
      <div className="cursor-dot" ref={cursorDotRef} id="cursorDot" />

      {/* ── PROGRESS RING (Top Right) ── */}
      <div className="progress-ring" ref={progressRingRef} id="progressRing">
        <svg viewBox="0 0 44 44">
          <circle className="track" cx="22" cy="22" r="18" />
          <circle className="fill" ref={progressFillRef} id="progressFill" cx="22" cy="22" r="18" />
        </svg>
        <span className="num" ref={progressNumRef} id="progressNum">0</span>
      </div>

      <div className="scroll-progress"><i ref={sprogRef} id="sprog" /></div>

      {/* ── TOP NAV ── */}
      <header id="nav" ref={navRef}>
        <div className="wrap nav-inner">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="brand"
            id="brand"
          >
            <span className="brand-mark">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </span>
            <span className="brand-text">StudySync<span className="brand-tag">HUB</span></span>
          </button>

          <nav className="nav-links">
            <a href="#calculator"><span>75% Calculator</span></a>
            <a href="#features"><span>Architecture</span></a>
            <a href="#comparison"><span>Why StudySync</span></a>
            <button onClick={() => setActiveModal('about')}><span>About</span></button>
            <button onClick={() => setActiveModal('security')}><span>Security</span></button>
            <button onClick={onEnterApp}><span>Open Demo</span></button>
          </nav>

          <div className="nav-actions">
            <button className="btn btn-primary" onClick={() => setActiveModal('login')}>Log in</button>
            <button className="btn btn-ghost" onClick={() => setActiveModal('join')}>Join Class</button>
            <button className="btn btn-white" onClick={() => setActiveModal('create')}>Create Class</button>
          </div>
        </div>
      </header>

      <main>
        {/* ── HERO SECTION ── */}
        <section className="hero" id="top">
          <div className="hero-mesh" ref={heroMeshRef} id="heroMesh"><span /><span /></div>
          <canvas ref={canvasRef} id="net" />

          <div className="wrap hero-head" ref={heroHeadRef} id="heroHead">
            <div className="eyebrow-pill reveal" style={{ ['--d' as any]: '.05s' }}>
              <span className="pulse" />
              Precision Academic Platform
              <span style={{ color: 'var(--text-4)' }}>/</span>
              EduTrack Integrated
            </div>

            <h1>
              <span className="sr-only">Stop managing your class on WhatsApp</span>
              <span aria-hidden="true">
                Stop managing your class on <span className="accent">WhatsApp.</span>
              </span>
            </h1>

            <p className="hero-sub">
              <strong>The Precision Class Coordination Engine.</strong> Built for CRs. Trusted by cohorts.
              Instant 75% attendance radar, cryptographic assignment hashes, and RFC student directory —
              without a password.
            </p>

            <div className="cta-row reveal" style={{ ['--d' as any]: '.95s' }}>
              <button className="btn btn-white btn-lg" onClick={() => setActiveModal('create')}>
                Create your class — free
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6"/>
                </svg>
              </button>
              <button className="btn btn-ghost btn-lg" onClick={() => setActiveModal('join')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="7.5" cy="15.5" r="4.5"/>
                  <path d="M10.5 12.5 20 3m-3 0h3v3"/>
                </svg>
                Join with 6-digit code
              </button>
            </div>

            {/* Instant Persona Row */}
            <div className="personas reveal" style={{ ['--d' as any]: '1.05s' }}>
              <div className="personas-label">Instant persona entry</div>

              <button
                className="persona"
                onClick={() => handlePersonaEntry('Faculty', facultyUser)}
              >
                <span className="persona-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10 12 5 2 10l10 5 10-5z"/>
                    <path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>
                  </svg>
                </span>
                <span className="persona-text">
                  <b>Faculty Incharge</b>
                  <i>Dr. M. Sundaram</i>
                </span>
              </button>

              <button
                className="persona"
                onClick={() => handlePersonaEntry('CR', crUser)}
              >
                <span className="persona-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 7l4 4 5-7 5 7 4-4v11H3z"/>
                  </svg>
                </span>
                <span className="persona-text">
                  <b>Class Rep (CR)</b>
                  <i>Ribhav Sharma</i>
                </span>
              </button>

              <button
                className="persona"
                onClick={() => handlePersonaEntry('Student', studentUser)}
              >
                <span className="persona-icon">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  </svg>
                </span>
                <span className="persona-text">
                  <b>Student</b>
                  <i>Aaditya Verma</i>
                </span>
              </button>
            </div>

            <div className="trust reveal" style={{ ['--d' as any]: '1.15s' }}>
              <span className="trust-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                </svg>
                Submission Tracking
              </span>
              <span className="trust-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.7 21a2 2 0 0 1-3.4 0"/>
                </svg>
                1-Click Nudges
              </span>
              <span className="trust-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                </svg>
                Live Class Polls
              </span>
              <span className="trust-chip">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="5" width="20" height="14" rx="2"/>
                  <path d="M7 15h.01M11 15h2M7 11h2M13 11h4"/>
                </svg>
                EduTrack Identity
              </span>
            </div>

            <div className="secure-line reveal" style={{ ['--d' as any]: '1.25s' }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
              </svg>
              No password required · Works in any browser · Data stored locally
            </div>
          </div>

          {/* ── FIGURE 4.1 MOCKUP CARD (3D Tilt) ── */}
          <div className="wrap">
            <div
              className="stage reveal"
              ref={stageRef}
              id="stage"
              style={{ ['--d' as any]: '.8s' }}
              onMouseMove={handleStageMouseMove}
              onMouseLeave={handleStageMouseLeave}
            >
              <div
                className="tilt"
                ref={tiltRef}
                id="tilt"
                style={{
                  transform: `rotateX(${mockTilt.rx}deg) rotateY(${mockTilt.ry}deg)`,
                  transition: 'transform 0.15s ease-out'
                }}
              >
                <div
                  className="mock"
                  id="mock"
                  style={{
                    ['--gx' as any]: `${mockTilt.gx}%`,
                    ['--gy' as any]: `${mockTilt.gy}%`
                  }}
                >
                  <div className="mock-glare" />

                  <div className="mock-bar">
                    <div className="dots"><i /><i /><i /></div>
                    <div className="mock-title">
                      Figure 4.1 · CR Command Center
                      <span className="live-badge"><i />Live</span>
                    </div>
                    <div className="step-badge" id="stepBadge">
                      {mockTab === 0
                        ? 'Step 1/3 · Metric Counters'
                        : mockTab === 1
                        ? 'Step 2/3 · Submissions'
                        : 'Step 3/3 · Nudge Dispatch'}
                    </div>
                  </div>

                  <div className="mock-tabs" id="mockTabs">
                    <button
                      className={`mtab ${mockTab === 0 ? 'active' : ''}`}
                      onClick={() => setMockTab(0)}
                    >
                      Tasks &amp; Deadlines<span className="bar" />
                    </button>
                    <button
                      className={`mtab ${mockTab === 1 ? 'active' : ''}`}
                      onClick={() => setMockTab(1)}
                    >
                      75% Attendance Radar<span className="bar" />
                    </button>
                    <button
                      className={`mtab ${mockTab === 2 ? 'active' : ''}`}
                      onClick={() => setMockTab(2)}
                    >
                      EduTrack Roster Slip<span className="bar" />
                    </button>
                  </div>

                  <div className="mock-body">
                    {/* Tab 0: Tasks & Deadlines */}
                    <div className={`mpane ${mockTab === 0 ? 'active' : ''}`}>
                      <div className="counters">
                        <div className="counter"><span className="counter-label">Enrolled</span><b className="counter-value">{counters.enrolled}</b></div>
                        <div className="counter"><span className="counter-label">Subjects</span><b className="counter-value">{counters.subjects}</b></div>
                        <div className="counter"><span className="counter-label">Pending</span><b className="counter-value">{counters.pending}</b></div>
                        <div className="counter"><span className="counter-label">Deadlines</span><b className="counter-value">{counters.deadlines}</b></div>
                      </div>

                      <div className="assignment">
                        <div className="assignment-label">Live Assignment Preview</div>
                        <h4>Fluid Mechanics — Lab Experiment 4: Bernoulli's Theorem</h4>
                        <div className="assignment-meta">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"/>
                            <path d="M12 6v6l4 2"/>
                          </svg>
                          Due tomorrow · 5:00 PM
                        </div>
                      </div>

                      <div className="progress-row">
                        <div className="progress-top">
                          <span>Cohort submission progress</span>
                          <b id="progLabel">{cohortProgress}%</b>
                        </div>
                        <div className="track"><div className="fill" style={{ width: `${cohortProgress}%` }} id="cohortFill" /></div>
                      </div>

                      <div className="mock-actions">
                        <button className="btn btn-primary btn-sm" id="nudgeBtn" onClick={handleNudgePendingClick}>
                          {nudgeBtnText}
                        </button>
                        <button className="btn btn-ghost btn-sm" onClick={() => showToast('Exporting members roster CSV...', 'blue')}>
                          Export CSV
                        </button>
                      </div>
                    </div>

                    {/* Tab 1: 75% Attendance Radar */}
                    <div className={`mpane ${mockTab === 1 ? 'active' : ''}`}>
                      <div className="defaulter-banner">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z"/>
                          <path d="M12 9v4M12 17h.01"/>
                        </svg>
                        2 defaulters detected below the 75% eligibility threshold
                      </div>

                      <div className="stu-row">
                        <span className="avatar">RK</span>
                        <span>
                          <span className="stu-name">Rohan Kulkarni</span>
                          <span className="stu-meta">CS21554 · AIML 2026</span>
                        </span>
                        <span className="stu-pct bad"><b>68.4%</b><span>Needs 3 sessions</span></span>
                      </div>

                      <div className="stu-row">
                        <span className="avatar">AV</span>
                        <span>
                          <span className="stu-name">Aaditya Verma</span>
                          <span className="stu-meta">CS21571 · AIML 2026</span>
                        </span>
                        <span className="stu-pct good"><b>92.0%</b><span>Eligible</span></span>
                      </div>

                      <div className="stu-row">
                        <span className="avatar">SN</span>
                        <span>
                          <span className="stu-name">Sneha Nair</span>
                          <span className="stu-meta">CS21566 · AIML 2026</span>
                        </span>
                        <span className="stu-pct good"><b>88.1%</b><span>Eligible</span></span>
                      </div>
                    </div>

                    {/* Tab 2: EduTrack Roster Slip */}
                    <div className={`mpane ${mockTab === 2 ? 'active' : ''}`}>
                      <div className="rfc">
                        <div className="rfc-head">
                          <h4>EduTrack RFC Identity Slip</h4>
                          <span>RFC ENGINE</span>
                        </div>
                        <div className="rfc-grid">
                          <div className="rfc-cell"><span>Academic ID</span><b>STU-AIML26WIL001</b></div>
                          <div className="rfc-cell"><span>Roll Number</span><b>CS21554</b></div>
                          <div className="rfc-cell"><span>Credential</span><b>••••••••••••</b></div>
                          <div className="rfc-cell"><span>Status</span><b style={{ color: '#7fa88c' }}>Verified</b></div>
                        </div>
                      </div>
                      <p style={{ fontSize: '12.5px', color: 'var(--text-3)', lineHeight: 1.7, marginTop: '16px', letterSpacing: '-.005em' }}>
                        Every student receives a deterministic RFC identity at enrolment — no email loops,
                        no OTP delays, no password resets in the middle of a lab session.
                      </p>
                    </div>
                  </div>

                  <div className="mock-foot">
                    <span>Experience the full live workspace</span>
                    <button
                      className={`btn btn-primary btn-sm ${remindBtnState === 'sent' ? 'sent' : 'pulse'}`}
                      id="remindBtn"
                      onClick={handleRemindAllClick}
                    >
                      {remindBtnState === 'sent' ? 'Nudge sent' : 'Remind All'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MARQUEE ── */}
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track" id="marqueeTrack">
            {marqueeItems.concat(marqueeItems).map((it, idx) => (
              <span className="marquee-item" key={idx}><i />{it}</span>
            ))}
          </div>
        </div>

        {/* ── CALCULATOR ── */}
        <section className="section" id="calculator">
          <div className="wrap">
            <div className="reveal">
              <span className="eyebrow">Bunk Radar</span>
              <h2>Know exactly how many lectures<br/>you can still miss.</h2>
              <p className="section-sub">
                Drag the sliders. StudySync computes your live eligibility against the 75% university
                threshold and tells you the precise number of sessions needed to return to the safe zone.
              </p>
            </div>

            <div className="calc-grid">
              <div className="panel reveal reveal-left" style={{ ['--d' as any]: '.1s' }}>
                <div className="field">
                  <div className="field-top">
                    <label htmlFor="totalLec">Total conducted lectures</label>
                    <b id="totalVal">{totalLec}</b>
                  </div>
                  <input
                    type="range"
                    id="totalLec"
                    min="10"
                    max="70"
                    value={totalLec}
                    style={{ ['--p' as any]: `${((totalLec - 10) / 60) * 100}%` }}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setTotalLec(val);
                      if (attLec > val) setAttLec(val);
                      setActivePreset(null);
                    }}
                  />
                </div>

                <div className="field">
                  <div className="field-top">
                    <label htmlFor="attLec">Lectures attended</label>
                    <b id="attVal">{attLec}</b>
                  </div>
                  <input
                    type="range"
                    id="attLec"
                    min="0"
                    max={totalLec}
                    value={attLec}
                    style={{ ['--p' as any]: `${(attLec / totalLec) * 100}%` }}
                    onChange={e => {
                      setAttLec(Number(e.target.value));
                      setActivePreset(null);
                    }}
                  />
                </div>

                <div className="field" style={{ marginBottom: 0 }}>
                  <div className="field-top"><label>Quick presets</label></div>
                  <div className="presets" id="presets">
                    <button
                      className={`preset ${activePreset === 70 ? 'active' : ''}`}
                      onClick={() => {
                        setTotalLec(40);
                        setAttLec(28);
                        setActivePreset(70);
                      }}
                    >
                      Defaulter · 70%
                    </button>
                    <button
                      className={`preset ${activePreset === 75 ? 'active' : ''}`}
                      onClick={() => {
                        setTotalLec(40);
                        setAttLec(30);
                        setActivePreset(75);
                      }}
                    >
                      Edge · 75%
                    </button>
                    <button
                      className={`preset ${activePreset === 90 ? 'active' : ''}`}
                      onClick={() => {
                        setTotalLec(40);
                        setAttLec(36);
                        setActivePreset(90);
                      }}
                    >
                      Safe · 90%
                    </button>
                  </div>
                </div>
              </div>

              <div className="panel reveal reveal-right" style={{ ['--d' as any]: '.2s' }}>
                <div className="result">
                  <div className="gauge">
                    <div
                      className="gauge-val"
                      id="gaugeVal"
                      style={{ color: isCalcSafe ? '#7fa88c' : calcPct < 65 ? '#b17d7d' : '#b39a6d' }}
                    >
                      {calcPct.toFixed(1)}%
                    </div>
                    <div className="gauge-label">Live attendance percentage</div>
                  </div>

                  <div className={`verdict ${isCalcSafe ? 'safe' : 'warn'}`} id="verdict">
                    <div className={`verdict-title ${isCalcSafe ? 'safe-t' : 'warn-t'}`} id="verdictTitle">
                      {isCalcSafe ? (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                            <path d="m9 12 2 2 4-4"/>
                          </svg>
                          Exam eligible — Safe zone
                        </>
                      ) : (
                        <>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10.3 3.3 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.3a2 2 0 0 0-3.4 0z"/>
                            <path d="M12 9v4M12 17h.01"/>
                          </svg>
                          Defaulter Warning — Exam at risk
                        </>
                      )}
                    </div>
                    <p id="verdictText">
                      {isCalcSafe ? (
                        <>You can safely miss <b>{canMissLectures}</b> more lectures and still remain above the 75% threshold.</>
                      ) : (
                        <>You must attend the next <b>{needLectures}</b> consecutive lectures without missing any to restore eligibility.</>
                      )}
                    </p>
                  </div>

                  <div className="mini-stats">
                    <div className="mini"><span>Attended</span><b id="miniAtt">{attLec}</b></div>
                    <div className="mini"><span>Missed</span><b id="miniMiss">{totalLec - attLec}</b></div>
                    <div className="mini"><span>Buffer</span><b id="miniBuf" style={{ color: isCalcSafe ? '#7fa88c' : '#b17d7d' }}>{isCalcSafe ? canMissLectures : 0}</b></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PROOF SIMULATOR ── */}
        <section className="section" id="proof">
          <div className="wrap">
            <div className="reveal">
              <span className="eyebrow">Immutable Proof</span>
              <h2>No more “I already submitted it, sir.”</h2>
              <p className="section-sub">
                Every hand-in generates a SHA-256 block hash with a verifiable timestamp.
                If there is ever a dispute, the receipt settles it in one second.
              </p>
            </div>

            <div className="proof-grid">
              <div className="panel reveal reveal-left" style={{ ['--d' as any]: '.1s' }}>
                <div className="form-row">
                  <label htmlFor="pName">Student name</label>
                  <input
                    className="input"
                    id="pName"
                    placeholder="e.g. Aaditya Verma"
                    value={pName}
                    onChange={e => setPName(e.target.value)}
                  />
                </div>
                <div className="form-row">
                  <label htmlFor="pAss">Assignment</label>
                  <select
                    className="select"
                    id="pAss"
                    value={pAss}
                    onChange={e => setPAss(e.target.value)}
                  >
                    <option>Fluid Mechanics — Lab Experiment 4</option>
                    <option>Engineering Maths — Assignment 3</option>
                    <option>Data Structures — Viva Submission</option>
                    <option>Operating Systems — Case Study Report</option>
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  id="genReceipt"
                  style={{ width: '100%', marginTop: '8px' }}
                  onClick={handleGenerateReceipt}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                  Generate submission receipt
                </button>
                <p style={{ fontSize: '11.5px', color: 'var(--text-4)', lineHeight: 1.7, marginTop: '16px', letterSpacing: '-.005em' }}>
                  Hashes are generated client-side. Nothing leaves your browser in this demo.
                </p>
              </div>

              <div className="receipt reveal reveal-right" style={{ ['--d' as any]: '.2s' }} id="receiptCard">
                <div className="receipt-head">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <path d="M14 2v6h6"/>
                  </svg>
                  Submission Receipt
                  <span className="verified-badge">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    Verified
                  </span>
                </div>
                <div className="receipt-body" id="receiptBody">
                  {receiptData ? (
                    <div className="pulse-once">
                      <div className="rrow"><span>Student</span><b>{receiptData.name}</b></div>
                      <div className="rrow"><span>Assignment</span><b>{receiptData.ass}</b></div>
                      <div className="rrow"><span>Timestamp</span><b>{receiptData.time}</b></div>
                      <div className="rrow"><span>Block hash</span><b className="hash">{receiptData.hash.slice(0, 32)}…{receiptData.hash.slice(-16)}</b></div>
                      <div className="rrow"><span>Ledger</span><b style={{ color: '#7fa88c' }}>Immutable · Verified</b></div>
                    </div>
                  ) : (
                    <div className="empty-hint">
                      No receipt generated yet.<br/>
                      Fill in the details and generate.
                    </div>
                  )}
                </div>
                {receiptData && (
                  <div className="receipt-foot" id="receiptFoot">
                    <span className="hint">Immutable · Tamper-evident</span>
                    <button className="btn btn-ghost btn-sm" id="copyHash" onClick={handleCopyHash}>Copy hash</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── PINNED SPLIT (Sticky Scroll Showcase) ── */}
        <section className="pinned-split" ref={pinnedSplitRef} id="pinnedSplit">
          <div className="pinned-viewport">
            <div className="wrap">
              <div className="pinned-intro">
                <span className="eyebrow in">The Difference</span>
                <h2>Same class. Two completely different realities.</h2>
              </div>

              <div className="split-card-grid">
                <div className="split-card chaos" ref={chaosCardRef} id="chaosCard">
                  <div className="split-head">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b17d7d" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.1A8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>
                    </svg>
                    Class Group · 62 members
                    <span className="split-badge">CHAOS</span>
                  </div>
                  <div className="chat-viewport">
                    <div className="chat-track" id="chatTrack">
                      <div className="bubble"><span className="who">Rohit</span>Sir, was attendance taken today?</div>
                      <div className="bubble"><span className="who">Priya</span>Can someone share Unit 3 notes?</div>
                      <div className="bubble me"><span className="who">You</span>Has anyone submitted the assignment yet?</div>
                      <div className="bubble spam"><span className="who">Admin</span>LAB SESSION CANCELLED TOMORROW</div>
                      <div className="bubble"><span className="who">Sahil</span>+1</div>
                      <div className="bubble"><span className="who">Neha</span>Does anyone have last year PYQs?</div>
                      <div className="bubble spam"><span className="who">Karan</span>Sir mentioned 5 PM deadline</div>
                      <div className="bubble"><span className="who">Ananya</span>Why are there 200 messages here?</div>
                      <div className="bubble me"><span className="who">You</span>Is the submission portal working?</div>
                      <div className="bubble"><span className="who">Vivek</span>What is my current attendance?</div>
                      <div className="bubble spam"><span className="who">Rohit</span>When is the viva scheduled?</div>
                      <div className="bubble"><span className="who">Priya</span>Notes please, urgent</div>
                    </div>
                  </div>
                </div>

                <div className="split-card calm" ref={calmCardRef} id="calmCard">
                  <div className="split-head">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#7fa88c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    StudySync · AIML 2026
                    <span className="split-badge">CLEAN</span>
                  </div>
                  <div className="calm-body">
                    <div className="pinned">
                      <div className="pinned-lbl">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 17v5M9 10.8V4h6v6.8l2.4 3.2H6.6z"/>
                        </svg>
                        Pinned Broadcast
                      </div>
                      <h4>Fluid Mechanics Lab 4 submission closes tomorrow at 5:00 PM</h4>
                      <p>34 / 62 submitted · 28 pending · Nudge sent 2 min ago</p>
                    </div>

                    <div className="file-row">
                      <span className="file-ic">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <path d="M14 2v6h6"/>
                        </svg>
                      </span>
                      <span>
                        <b>Unit 3 — Bernoulli's Theorem Notes</b>
                        <span>PDF · 2.4 MB · permanent</span>
                      </span>
                      <span className="file-action">Download</span>
                    </div>

                    <div className="file-row">
                      <span className="file-ic">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M3 3v18h18"/>
                          <path d="m19 9-5 5-4-4-3 3"/>
                        </svg>
                      </span>
                      <span>
                        <b>Attendance Radar — this week</b>
                        <span>2 defaulters flagged automatically</span>
                      </span>
                      <span className="file-action">View</span>
                    </div>

                    <div className="file-row">
                      <span className="file-ic">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 11l3 3L22 4"/>
                          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                        </svg>
                      </span>
                      <span>
                        <b>Viva date poll</b>
                        <span>Anonymous · 41 votes · closes in 3h</span>
                      </span>
                      <span className="file-action">Vote</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HORIZONTAL SCROLL ARCHITECTURE ── */}
        <section className="hscroll-section" ref={hSectionRef} id="features">
          <div className="hscroll-viewport">
            <div className="hscroll-head">
              <span className="eyebrow in">Prototype Architecture</span>
              <h2>Twelve modules. One coordination engine.</h2>
              <p className="section-sub" style={{ marginTop: '14px' }}>
                The academic synopsis distilled into working surfaces — every figure below maps to a real
                component inside the StudySync prototype. Keep scrolling to move through them.
              </p>
            </div>
            <div className="hscroll-track" ref={hTrackRef} id="hscrollTrack">
              {archCards.map((card, idx) => (
                <article className="arch-card" key={idx}>
                  <span className="arch-fig">{card.f}</span>
                  <div className="arch-ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                    </svg>
                  </div>
                  <h3>{card.t}</h3>
                  <p>{card.d}</p>
                  <span className="arch-tag">{card.tag}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── COMPARISON TABLE ── */}
        <section className="section" id="comparison">
          <div className="wrap">
            <div className="reveal">
              <span className="eyebrow">Head to Head</span>
              <h2>StudySync vs WhatsApp groups</h2>
              <p className="section-sub">
                Every row below is a real pain point reported by class representatives during the pilot.
              </p>
            </div>

            <div className="cmp reveal" style={{ ['--d' as any]: '.12s' }} id="cmpTable">
              <div className="cmp-row head">
                <div className="cmp-cell">Scenario</div>
                <div className="cmp-cell">WhatsApp groups</div>
                <div className="cmp-cell">StudySync</div>
              </div>
              {cmpRows.map((r, idx) => (
                <div className="cmp-row" key={idx}>
                  <div className="cmp-cell scenario">{r.s}</div>
                  <div className="cmp-cell bad">
                    <svg className="x" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                    <span>{r.b}</span>
                  </div>
                  <div className="cmp-cell good">
                    <svg className="tick" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5"/>
                    </svg>
                    <span>{r.g}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="section">
          <div className="wrap">
            <div className="cta-wrap reveal">
              <h2>Ready to fix your class coordination?</h2>
              <p>Spin up a class in under 30 seconds. No password, no setup, no group admin drama.</p>
              <div className="cta-row" style={{ marginTop: '32px' }}>
                <button className="btn btn-white btn-lg" onClick={() => setActiveModal('create')}>
                  Create your class — free
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => setActiveModal('join')}>
                  Join with 6-digit code
                </button>
              </div>
              <p style={{ marginTop: '22px', fontSize: '12.5px', color: 'var(--text-4)' }}>
                or{' '}
                <button
                  onClick={onEnterApp}
                  style={{ color: 'var(--accent-2)', textDecoration: 'underline', textUnderlineOffset: '3px', cursor: 'pointer' }}
                >
                  explore the live demo workspace
                </button>
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer>
        <div className="wrap">
          <div className="foot-grid">
            <div className="foot-brand">
              <div className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <span className="brand-mark">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                </span>
                <span className="brand-text">StudySync<span className="brand-tag">HUB</span></span>
              </div>
              <p>The precision class coordination engine for CRs, cohorts and faculty. Built for the 75% rule.</p>
            </div>

            <div className="foot-cols">
              <div className="foot-col">
                <h5>Product</h5>
                <a href="#calculator">75% Calculator</a>
                <a href="#features">Architecture</a>
                <a href="#comparison">Why StudySync</a>
                <button onClick={onEnterApp} style={{ textAlign: 'left' }}>Live Demo</button>
              </div>
              <div className="foot-col">
                <h5>Trust</h5>
                <button onClick={() => setActiveModal('about')} style={{ textAlign: 'left' }}>About</button>
                <button onClick={() => setActiveModal('security')} style={{ textAlign: 'left' }}>Security</button>
                <button onClick={() => setActiveModal('security')} style={{ textAlign: 'left' }}>Privacy</button>
                <button onClick={() => setActiveModal('security')} style={{ textAlign: 'left' }}>Terms</button>
              </div>
            </div>
          </div>

          <div className="foot-bottom">
            <span>© 2026 StudySync HUB · Academic prototype</span>
            <span>No password required · Data stored locally</span>
          </div>
        </div>
      </footer>

      {/* ── AUDIO DOCK ── */}
      <div className={`audio-dock ${isAudioOpen ? 'open' : ''} ${currentAudio !== 'off' ? 'playing' : ''}`} id="audioDock">
        <div className="audio-menu" id="audioMenu">
          <button
            className={currentAudio === 'rain' ? 'active' : ''}
            onClick={() => playFocusSound('rain')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 16.2A4.5 4.5 0 0 0 17.5 8h-1.8A7 7 0 1 0 4 14.9"/>
              <path d="M16 14v6M8 14v6M12 16v6"/>
            </svg>
            Rain
          </button>
          <button
            className={currentAudio === 'brown' ? 'active' : ''}
            onClick={() => playFocusSound('brown')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12h3l3-7 3 14 3-10 3 6 3-3"/>
            </svg>
            Brown Noise
          </button>
          <button
            className={currentAudio === 'binaural' ? 'active' : ''}
            onClick={() => playFocusSound('binaural')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 14v-2a9 9 0 0 1 18 0v2"/>
              <rect x="1" y="14" width="6" height="8" rx="2"/>
              <rect x="17" y="14" width="6" height="8" rx="2"/>
            </svg>
            Binaural Focus
          </button>
          <button
            className={currentAudio === 'off' ? 'active' : ''}
            onClick={() => playFocusSound('off')}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
            Silence
          </button>
        </div>
        <button
          className="audio-toggle"
          id="audioToggle"
          aria-label="Focus soundscapes"
          onClick={() => setIsAudioOpen(prev => !prev)}
        >
          <span className="eq" id="eq"><i /><i /><i /><i /></span>
        </button>
      </div>

      {/* ── INTERACTIVE MODALS ── */}
      <div className={`modal-back ${activeModal ? 'open' : ''}`} id="modalBack" onClick={e => { if (e.target === e.currentTarget) setActiveModal(null); }}>
        <div className="modal" id="modal">
          <button className="modal-x" id="modalX" aria-label="Close" onClick={() => setActiveModal(null)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>

          {activeModal === 'login' && (
            <div>
              <h3>Log in to StudySync</h3>
              <p className="modal-sub">Pick a role to jump straight into the workspace. No password required.</p>
              <div className="role-list">
                <button
                  className="role-btn"
                  onClick={() => {
                    setActiveModal(null);
                    handlePersonaEntry('Faculty', facultyUser);
                  }}
                >
                  <span className="persona-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5"/>
                    </svg>
                  </span>
                  <span><b>Faculty Incharge</b><span>Cohort metrics · defaulter lists</span></span>
                </button>
                <button
                  className="role-btn"
                  onClick={() => {
                    setActiveModal(null);
                    handlePersonaEntry('CR', crUser);
                  }}
                >
                  <span className="persona-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7l4 4 5-7 5 7 4-4v11H3z"/>
                    </svg>
                  </span>
                  <span><b>Class Representative</b><span>Broadcasts · nudges · attendance</span></span>
                </button>
                <button
                  className="role-btn"
                  onClick={() => {
                    setActiveModal(null);
                    handlePersonaEntry('Student', studentUser);
                  }}
                >
                  <span className="persona-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                  </span>
                  <span><b>Student</b><span>Deadlines · attendance % · notes</span></span>
                </button>
              </div>
            </div>
          )}

          {activeModal === 'join' && (
            <div>
              <h3>Join with 6-digit code</h3>
              <p className="modal-sub">Ask your CR for the code projected on the classroom screen.</p>
              <div className="code-inputs" id="codeInputs">
                {joinCodeDigits.map((digit, i) => (
                  <input
                    key={i}
                    id={`join-digit-${i}`}
                    maxLength={1}
                    inputMode="numeric"
                    value={digit}
                    onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      const next = [...joinCodeDigits];
                      next[i] = val;
                      setJoinCodeDigits(next);
                      if (val && i < 5) {
                        document.getElementById(`join-digit-${i + 1}`)?.focus();
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'Backspace' && !joinCodeDigits[i] && i > 0) {
                        document.getElementById(`join-digit-${i - 1}`)?.focus();
                      }
                    }}
                  />
                ))}
              </div>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: '22px' }}
                onClick={() => {
                  const code = joinCodeDigits.join('');
                  if (code.length < 6) {
                    showToast('Enter all 6 digits', 'amber');
                    return;
                  }
                  setActiveModal(null);
                  joinClass(code, studentUser.name || 'Aaditya Verma', 'student@studysync.local');
                  showToast(`Joined class with code ${code}`, 'green');
                  setTimeout(onEnterApp, 500);
                }}
              >
                Join class
              </button>
            </div>
          )}

          {activeModal === 'create' && (
            <div>
              <h3>Create your class</h3>
              <p className="modal-sub">You will be assigned the Class Representative role automatically.</p>
              <div style={{ marginTop: '22px' }}>
                <div className="form-row">
                  <label>Class name</label>
                  <input
                    className="input"
                    value={createClassName}
                    onChange={e => setCreateClassName(e.target.value)}
                    placeholder="e.g. AIML 2026 — Division A"
                  />
                </div>
                <div className="form-row">
                  <label>Subject</label>
                  <input
                    className="input"
                    value={createSubject}
                    onChange={e => setCreateSubject(e.target.value)}
                    placeholder="e.g. Fluid Mechanics"
                  />
                </div>
                <button
                  className="btn btn-white btn-lg"
                  style={{ width: '100%', marginTop: '6px' }}
                  onClick={() => {
                    const name = createClassName.trim() || 'AIML 2026';
                    createClass(name, crUser.name || 'Ribhav Sharma (CR)', 'cr@studysync.local');
                    setActiveModal(null);
                    showToast(`Class "${name}" created!`, 'green');
                    setTimeout(onEnterApp, 500);
                  }}
                >
                  Generate class code
                </button>
              </div>
            </div>
          )}

          {activeModal === 'about' && (
            <div>
              <h3>About StudySync HUB</h3>
              <p className="modal-sub">A precision academic coordination platform built as an engineering prototype.</p>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text-3)', marginTop: '20px', letterSpacing: '-.005em' }}>
                StudySync replaces the chaotic WhatsApp class group, the messy Google Sheet, and the
                lost WhatsApp forward with a single zero-friction hub.
              </p>
              <p style={{ fontSize: '13px', lineHeight: 1.8, color: 'var(--text-3)', marginTop: '14px', letterSpacing: '-.005em' }}>
                It serves three roles — Class Representatives who chase submissions, students who just
                want to know their attendance percentage, and faculty who want cohort visibility without
                joining a group chat.
              </p>
              <div className="mini-stats" style={{ marginTop: '26px', paddingTop: 0 }}>
                <div className="mini"><span>Modules</span><b>12</b></div>
                <div className="mini"><span>Roles</span><b>3</b></div>
                <div className="mini"><span>Passwords</span><b>0</b></div>
              </div>
            </div>
          )}

          {activeModal === 'security' && (
            <div>
              <h3>Security & Privacy</h3>
              <p className="modal-sub">How StudySync handles your academic data.</p>
              <div className="role-list" style={{ marginTop: '20px' }}>
                <div className="role-btn" style={{ cursor: 'default' }}>
                  <span className="persona-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>
                    </svg>
                  </span>
                  <span><b>SHA-256 submission proofs</b><span>Tamper-evident, verifiable receipts</span></span>
                </div>
                <div className="role-btn" style={{ cursor: 'default' }}>
                  <span className="persona-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M7 15h.01M11 15h2M7 11h2M13 11h4"/>
                    </svg>
                  </span>
                  <span><b>EduTrack RFC identity</b><span>Deterministic UIDs, no password storage</span></span>
                </div>
                <div className="role-btn" style={{ cursor: 'default' }}>
                  <span className="persona-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/>
                    </svg>
                  </span>
                  <span><b>Local-first storage</b><span>Demo data never leaves your browser</span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── TOAST ── */}
      <div className={`toast ${toastState.visible ? 'show' : ''}`} id="toast">
        <span
          className="toast-icon"
          id="toastIcon"
          style={{
            background:
              toastState.tone === 'green'
                ? 'rgba(127,168,140,.14)'
                : toastState.tone === 'blue'
                ? 'rgba(139,169,196,.14)'
                : 'rgba(179,154,109,.14)',
            color:
              toastState.tone === 'green'
                ? '#7fa88c'
                : toastState.tone === 'blue'
                ? '#a5bdd2'
                : '#b39a6d'
          }}
        >
          {toastState.tone === 'green' ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
          ) : toastState.tone === 'blue' ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8v4M12 16h.01"/>
            </svg>
          )}
        </span>
        <span id="toastMsg">{toastState.msg}</span>
      </div>
    </div>
  );
};
