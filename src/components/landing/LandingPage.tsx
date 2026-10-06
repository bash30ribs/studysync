import React, { useState, useEffect } from 'react';
import { useStudySync } from '../../store';
import {
  BookOpen,
  Key,
  CheckCircle2,
  Users,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  Zap,
  ChevronRight,
  UserCheck,
  Megaphone,
  Folder,
  Crown,
  LogIn,
  GraduationCap,
  Sparkles,
  BellRing,
  Shield,
  Activity,
  Calendar,
  Lock,
  Compass,
  FileCheck2,
  Check
} from 'lucide-react';
import { CreateClassModal, JoinClassModal } from '../onboarding/OnboardingModals';
import { RolePortalsModal } from '../auth/RolePortalsModal';
import { UserRole } from '../../types';

// Feature pill shown in the "Why StudySync" section
const FeatureRow: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 py-5 border-b border-[#1A1A1A] last:border-0 group hover:bg-white/[0.01] transition-colors rounded-xl px-2 -mx-2">
    <div className="w-10 h-10 rounded-xl bg-[#0E0E0E] border border-[#222] group-hover:border-[#0095F6]/40 flex items-center justify-center shrink-0 text-white transition-colors shadow-xs">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-white leading-tight group-hover:text-[#0095F6] transition-colors">{title}</h3>
      <p className="text-xs text-[#A8A8A8] mt-1.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

// Interactive and animated live mockup card for CR Dashboard preview
const AnimatedCRDashboardMockup: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const [activeMockupTab, setActiveMockupTab] = useState<'assignments' | 'attendance' | 'directory'>('assignments');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [progressPct, setProgressPct] = useState(40);
  const [isGreenFlash, setIsGreenFlash] = useState(false);
  const [isNudgeSent, setIsNudgeSent] = useState(false);
  const [isNudgePulsing, setIsNudgePulsing] = useState(false);

  useEffect(() => {
    let t1: ReturnType<typeof setTimeout>;
    let t2: ReturnType<typeof setTimeout>;
    let t3: ReturnType<typeof setTimeout>;
    let t4: ReturnType<typeof setTimeout>;
    let animFrame: number;

    const runCycle = () => {
      // Step 1: 0 - 4s (Counters count up: 0->10, 0->20)
      setStep(1);
      setIsNudgeSent(false);
      setIsNudgePulsing(false);
      setIsGreenFlash(false);
      setProgressPct(40);

      const duration = 1200;
      const startTime = performance.now();
      const animateCounters = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setEnrolledCount(Math.round(ease * 10));
        setPendingCount(Math.round(ease * 20));
        if (progress < 1) {
          animFrame = requestAnimationFrame(animateCounters);
        }
      };
      animFrame = requestAnimationFrame(animateCounters);

      // Step 2: 4s - 8s (Progress bar fills 40% -> 60% with green flash)
      t1 = setTimeout(() => {
        setStep(2);
        setProgressPct(60);
        setIsGreenFlash(true);
        t2 = setTimeout(() => setIsGreenFlash(false), 900);

        // Step 3: 8s - 12s (Nudge button pulses blue, shows "✓ Sent!" for 1.5s, resets)
        t3 = setTimeout(() => {
          setStep(3);
          setIsNudgePulsing(true);
          t4 = setTimeout(() => {
            setIsNudgePulsing(false);
            setIsNudgeSent(true);
            setTimeout(() => {
              setIsNudgeSent(false);
            }, 1500);
          }, 800);
        }, 4000);
      }, 4000);
    };

    runCycle();
    const interval = setInterval(runCycle, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0A0A0A] shadow-[0_0_50px_-15px_rgba(0,149,246,0.25)] relative backdrop-blur-md">
      {/* Mockup Header Bar */}
      <div className="px-4 py-3 bg-[#0E0E0E] border-b border-[#1A1A1A] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Preview — CR Command Center
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A1A1A] text-[#A8A8A8] border border-[#262626]">
            Step {step}/3 {step === 1 ? '· Metric Counters' : step === 2 ? '· Submissions' : '· Instant Nudges'}
          </span>
        </div>
      </div>

      {/* Interactive Feature View Switcher */}
      <div className="px-4 py-2 bg-[#080808] border-b border-[#1A1A1A] flex items-center gap-2 overflow-x-auto text-[11px]">
        <button
          onClick={() => setActiveMockupTab('assignments')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
            activeMockupTab === 'assignments'
              ? 'bg-[#0095F6] text-white shadow-xs'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          Tasks & Deadlines
        </button>
        <button
          onClick={() => setActiveMockupTab('attendance')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
            activeMockupTab === 'attendance'
              ? 'bg-[#0095F6] text-white shadow-xs'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          75% Attendance Radar
        </button>
        <button
          onClick={() => setActiveMockupTab('directory')}
          className={`px-2.5 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
            activeMockupTab === 'directory'
              ? 'bg-[#0095F6] text-white shadow-xs'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          EduTrack Roster Slip
        </button>
      </div>

      {/* Mockup Body */}
      <div className="p-4 sm:p-5 space-y-4">
        {/* Class Overview Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#1A1A1A]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">Class Overview</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1A1A1A] text-[#8E8E8E]">MECH-3A</span>
            </div>
            <p className="text-[11px] text-[#737373]">Live cohort feed & instant student chasing</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#0095F6]/15 text-[#0095F6] border border-[#0095F6]/30">
            Aarav Sharma (CR)
          </span>
        </div>

        {activeMockupTab === 'assignments' ? (
          <>
            {/* 4 Metric Cards */}
            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl bg-[#0E0E0E] border border-[#1A1A1A]">
                <p className="text-[9px] font-semibold text-[#8E8E8E] uppercase tracking-wider">Enrolled</p>
                <p className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">
                  {enrolledCount}
                </p>
                <p className="text-[9px] text-[#737373]">students</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0E0E0E] border border-[#1A1A1A]">
                <p className="text-[9px] font-semibold text-[#0095F6] uppercase tracking-wider">Subjects</p>
                <p className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">6</p>
                <p className="text-[9px] text-[#737373]">manage CRs</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0E0E0E] border border-[#1A1A1A]">
                <p className="text-[9px] font-semibold text-amber-500 uppercase tracking-wider">Pending</p>
                <p className="text-lg sm:text-xl font-bold font-mono text-amber-500 mt-0.5">
                  {pendingCount}
                </p>
                <p className="text-[9px] text-[#737373]">pending</p>
              </div>

              <div className="p-2.5 rounded-xl bg-[#0E0E0E] border border-[#1A1A1A]">
                <p className="text-[9px] font-semibold text-[#8E8E8E] uppercase tracking-wider">Deadlines</p>
                <p className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">3</p>
                <p className="text-[9px] text-[#737373]">active</p>
              </div>
            </div>

            {/* Action Required: Single Live Assignment Card */}
            <div className="p-3.5 rounded-xl bg-[#0E0E0E] border border-[#1A1A1A] space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1A1A1A] text-white">
                      Fluid Mechanics
                    </span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400">
                      Due Tomorrow, 5:00 PM
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white">Lab Experiment 4: Bernoulli's Theorem</h4>
                </div>
                <span className="text-[10px] font-mono text-[#8E8E8E]">
                  {Math.round((progressPct / 100) * 10)}/10 submitted
                </span>
              </div>

              {/* Animated Progress Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-[#8E8E8E] font-mono">
                  <span>Cohort Progress</span>
                  <span className="text-white font-bold">{progressPct}%</span>
                </div>
                <div
                  className={`w-full h-2 rounded-full bg-[#1A1A1A] overflow-hidden transition-all duration-700 ${
                    isGreenFlash ? 'ring-2 ring-emerald-500 shadow-[0_0_12px_#22c55e]' : ''
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isGreenFlash ? 'bg-emerald-500' : 'bg-[#0095F6]'
                    }`}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>

              {/* Nudge Action Bar */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] text-[#737373]">
                  {Math.max(0, 10 - Math.round((progressPct / 100) * 10))} students haven't submitted yet
                </span>
                <button
                  onClick={() => {
                    setIsNudgeSent(true);
                    setTimeout(() => setIsNudgeSent(false), 1500);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                    isNudgeSent
                      ? 'bg-emerald-500 text-white shadow-[0_0_10px_#22c55e]'
                      : isNudgePulsing
                      ? 'bg-[#0095F6] text-white ring-2 ring-[#0095F6] scale-105 shadow-[0_0_12px_#0095F6]'
                      : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  <BellRing className="w-3 h-3" />
                  <span>{isNudgeSent ? '✓ Sent!' : 'Nudge Pending'}</span>
                </button>
              </div>
            </div>
          </>
        ) : activeMockupTab === 'attendance' ? (
          /* Attendance Radar Mockup */
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-[#0E0E0E] border border-[#1A1A1A] flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">75% Defaulter Alert Engine</span>
                <span className="text-[10px] text-[#737373]">Auto-calculates required sessions to clear eligibility</span>
              </div>
              <span className="text-xs font-mono font-bold text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                2 Defaulters
              </span>
            </div>

            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-[#1A1A1A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-[10px]">
                    R
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-xs">Rohan Kulkarni</span>
                    <span className="text-[10px] text-neutral-400 font-mono">23ME014 · Mechanical</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-rose-400 font-mono font-bold block text-xs">68.4%</span>
                  <span className="text-[9px] text-rose-500">Need 3 sessions</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-[#1A1A1A] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-[10px]">
                    A
                  </div>
                  <div>
                    <span className="font-semibold text-white block text-xs">Aaditya Verma</span>
                    <span className="text-[10px] text-neutral-400 font-mono">23ME002 · Mechanical</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-400 font-mono font-bold block text-xs">92.0%</span>
                  <span className="text-[9px] text-emerald-500">Eligible</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* EduTrack Roster Slip Mockup */
          <div className="p-3.5 rounded-xl bg-[#0E0E0E] border border-purple-500/30 space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#222] pb-1.5">
              <span className="text-[10px] text-purple-400 font-bold uppercase font-sans">
                EduTrack Identity Engine
              </span>
              <span className="text-[10px] bg-purple-500/15 text-purple-400 px-1.5 py-0.2 rounded font-sans">
                RFC-Academic
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] text-neutral-500 block font-sans">Student Name:</span>
                <span className="text-white font-sans font-bold">Wilson Gaikwad</span>
              </div>
              <span className="text-[#0095F6] font-bold text-xs bg-[#0095F6]/10 px-2 py-0.5 rounded">
                STU-AIML26WIL001
              </span>
            </div>
            <div className="p-2 rounded bg-black border border-[#222] flex items-center justify-between">
              <span className="text-neutral-400 text-[10px]">Roll No: CS21554</span>
              <span className="text-emerald-400 font-bold text-[11px]">Pass: StudySync@2026!</span>
            </div>
          </div>
        )}

        {/* Live CTA Strip inside card */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0095F6]/10 border border-[#0095F6]/25">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#0095F6]" />
            <span className="text-[11px] font-semibold text-white">Experience full live workspace</span>
          </div>
          <button
            onClick={onEnterApp}
            className="text-[10px] font-bold bg-[#0095F6] hover:bg-[#1877F2] text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            Remind All
          </button>
        </div>
      </div>
    </div>
  );
};

export const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const { setActiveTrustPage, switchRole, allUsers } = useStudySync();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [portalRole, setPortalRole] = useState<UserRole>('Faculty');

  const facultyUser = allUsers.find(u => u.role === 'Faculty') || { id: 'user-fac-1', name: 'Dr. Meenakshi Sundaram' };
  const crUser = allUsers.find(u => u.role === 'CR') || { id: 'user-cr-1', name: 'Ribhav Sharma (CR)' };
  const studentUser = allUsers.find(u => u.role === 'Student') || { id: 'user-stu-1', name: 'Aaditya Verma' };

  const handleInstantFacultyLogin = () => {
    switchRole('Faculty', facultyUser.id);
    onEnterApp();
  };

  const handleInstantCrLogin = () => {
    switchRole('CR', crUser.id);
    onEnterApp();
  };

  const handleInstantStudentLogin = () => {
    switchRole('Student', studentUser.id);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] flex flex-col relative overflow-hidden selection:bg-[#0095F6]/30 selection:text-white">
      {/* Background Ambient Mesh & Grids */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)]" />

      {/* Layered glowing orbs */}
      <div 
        className="glow-ambient absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(0, 149, 246, 0.22) 0%, rgba(59, 130, 246, 0.08) 50%, transparent 80%)'
        }}
      />
      <div 
        className="glow-ambient absolute top-60 right-0 w-[450px] h-[450px] rounded-full -z-10"
        style={{
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, transparent 70%)'
        }}
      />

      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-40 bg-[#000000]/80 backdrop-blur-xl border-b border-white/[0.08] transition-all">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 h-14 flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 group cursor-pointer text-left focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0095F6] rounded-lg p-1 -m-1"
            title="StudySync — Return to top"
            aria-label="StudySync — Return to top of page"
          >
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.4)] group-hover:scale-105 transition-transform duration-150">
              <BookOpen className="w-4 h-4 text-black stroke-[2.4]" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight text-white group-hover:text-blue-400 transition-colors">StudySync</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-[#0095F6]/20 text-[#0095F6] border border-[#0095F6]/30">HUB</span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-7 text-xs font-semibold text-[#A8A8A8]">
            <a href="#features" className="hover:text-white transition-colors cursor-pointer">Architecture</a>
            <a href="#comparison" className="hover:text-white transition-colors cursor-pointer">Why StudySync</a>
            <button onClick={() => setActiveTrustPage('about')} className="hover:text-white transition-colors cursor-pointer">About</button>
            <button onClick={() => setActiveTrustPage('security')} className="hover:text-white transition-colors cursor-pointer">Security</button>
            <button onClick={onEnterApp} className="hover:text-[#0095F6] transition-colors cursor-pointer flex items-center gap-1 font-bold">
              <span>Open Demo</span>
              <Sparkles className="w-3 h-3 text-[#0095F6]" />
            </button>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(0,149,246,0.3)] cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => setIsJoinOpen(true)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-white/10 text-white hover:bg-[#121212] hover:border-white/20 transition-all hidden sm:inline-flex cursor-pointer"
            >
              Join Class
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-white text-black hover:opacity-90 transition-all cursor-pointer shadow-sm"
            >
              Create Class
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* ── HERO SECTION (FIGURE 4.1 IN SYNOPSIS) ── */}
        <section className="max-w-6xl mx-auto px-5 lg:px-8 pt-10 pb-16 lg:pt-16 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-14 items-center">
            {/* Left: Copy with Staggered Entrance */}
            <div className="space-y-6">
              {/* Stagger 1: Precision badge */}
              <div className="hero-stagger-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E0E0E] border border-white/10 text-xs font-semibold text-white shadow-sm backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-neutral-300">Precision Academic Platform · EduTrack Integrated</span>
              </div>

              {/* Stagger 2: Headline */}
              <div className="space-y-2">
                <h1 className="hero-stagger-2 text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold text-white tracking-tight leading-[1.08]">
                  Stop managing your class on WhatsApp.
                </h1>
                <p className="text-xl font-bold bg-gradient-to-r from-[#0095F6] via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  The Precision Class Coordination Engine.
                </p>
              </div>

              {/* Stagger 3: Sub-copy */}
              <p className="hero-stagger-3 text-sm sm:text-base text-[#A8A8A8] leading-relaxed max-w-lg">
                Built for CRs. Trusted by cohorts. No password needed. Instant 75% attendance radar, cryptographic assignment hashes, and RFC student directory.
              </p>

              {/* Stagger 4: Fast 1-Tap Login Badges for 3 Roles */}
              <div className="hero-stagger-4 p-3.5 rounded-2xl bg-[#0A0A0A]/90 border border-white/10 backdrop-blur-md space-y-2 shadow-lg">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#8E8E8E] uppercase tracking-wider block">
                    ⚡ 3 Distinct Role Portals (1-Tap Authenticated)
                  </span>
                  <button
                    onClick={() => {
                      setPortalRole('Faculty');
                      setIsLoginOpen(true);
                    }}
                    className="text-[10px] text-[#0095F6] hover:underline font-semibold cursor-pointer"
                  >
                    View Portals Modal
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={handleInstantFacultyLogin}
                    className="p-2.5 rounded-xl border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-xs font-bold text-purple-400 flex items-center justify-between transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-purple-400 shrink-0" />
                      <div className="text-left">
                        <span className="block leading-tight">Faculty Incharge</span>
                        <span className="text-[10px] text-[#A8A8A8] font-normal block truncate">Dr. M. Sundaram</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  <button
                    onClick={handleInstantCrLogin}
                    className="p-2.5 rounded-xl border border-[#0095F6]/40 bg-[#0095F6]/10 hover:bg-[#0095F6]/20 text-xs font-bold text-[#0095F6] flex items-center justify-between transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="text-left">
                        <span className="block leading-tight">Class Rep (CR)</span>
                        <span className="text-[10px] text-[#A8A8A8] font-normal block truncate">Ribhav Sharma</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>

                  <button
                    onClick={handleInstantStudentLogin}
                    className="p-2.5 rounded-xl border border-white/10 bg-[#121212] hover:border-white/20 text-xs font-semibold text-white flex items-center justify-between transition-all cursor-pointer shadow-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div className="text-left">
                        <span className="block leading-tight">Student Cohort</span>
                        <span className="text-[10px] text-[#A8A8A8] font-normal block truncate">48 Students</span>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                </div>
              </div>

              {/* Stagger 5: Action buttons */}
              <div className="hero-stagger-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-white text-black text-sm font-extrabold flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] cursor-pointer"
                >
                  <span>Create your class — free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsJoinOpen(true)}
                  className="px-6 py-3.5 rounded-xl text-white text-sm font-semibold flex items-center justify-center gap-2 border border-white/10 bg-[#0E0E0E] hover:bg-[#1A1A1A] hover:border-white/20 transition-all cursor-pointer"
                >
                  <Key className="w-4 h-4 text-[#0095F6]" />
                  <span>Join with 6-digit code</span>
                </button>
              </div>

              {/* Stagger 6: 4 Pill Badges below CTA */}
              <div className="hero-stagger-6 flex flex-wrap items-center gap-2 pt-1">
                <span className="px-3 py-1.5 rounded-full bg-[#0E0E0E] border border-[#1A1A1A] text-xs font-medium text-[#E0E0E0] shadow-xs">
                  📊 Submission Tracking
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0E0E0E] border border-[#1A1A1A] text-xs font-medium text-[#E0E0E0] shadow-xs">
                  🔔 1-Click Nudges
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0E0E0E] border border-[#1A1A1A] text-xs font-medium text-[#E0E0E0] shadow-xs">
                  🗳️ Live Class Polls
                </span>
                <span className="px-3 py-1.5 rounded-full bg-[#0E0E0E] border border-[#1A1A1A] text-xs font-medium text-[#0095F6] shadow-xs">
                  🛡️ EduTrack Identity Engine
                </span>
              </div>

              <p className="text-[11px] text-[#737373] flex items-center gap-1.5 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                No password required · Works on any browser · Data stored locally
              </p>
            </div>

            {/* Right: Animated Dark Mockup Card (Figure 4.1 in synopsis) */}
            <div className="w-full">
              <AnimatedCRDashboardMockup onEnterApp={onEnterApp} />
            </div>
          </div>
        </section>

        {/* ── ACADEMIC ARCHITECTURE MATRIX (FIGURES 4.2 - 4.12 IN SYNOPSIS) ── */}
        <section id="features" className="max-w-6xl mx-auto px-5 lg:px-8 py-16 border-t border-white/[0.08]">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0095F6]/10 text-[#0095F6] border border-[#0095F6]/20">
              Technical Prototype Architecture
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              12 Integrated Modules Built For Academic Precision
            </h2>
            <p className="text-xs sm:text-sm text-[#A8A8A8]">
              From cryptographic hand-ins to biometric & manual attendance, StudySync provides end-to-end cohort governance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-[#0095F6]/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-[#0095F6]/10 text-[#0095F6] flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#0095F6] transition-colors">
                Assignment Proofs & Milestones
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-1.5 leading-relaxed">
                Timestamped SHA-256 cryptographic hashes for every document submission. Prevents "I submitted it" disputes.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-rose-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                75% Attendance Defaulter Radar
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-1.5 leading-relaxed">
                Real-time percentage calculator flagging students below threshold. Automatically calculates sessions required to reach 75%.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-purple-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-purple-400 transition-colors">
                EduTrack RFC Identity Engine
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-1.5 leading-relaxed">
                Standards-compliant UID generator for students and teachers (e.g. STU-AIML26..., EMP-CS26...) with credential slips.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-amber-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-3">
                <Megaphone className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors">
                Immutable Official Broadcasts
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-1.5 leading-relaxed">
                Class-wide CR announcements delivered directly to all student views with WhatsApp integration and cryptographic signatures.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-emerald-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-3">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                Democratic Consensus Polls
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-1.5 leading-relaxed">
                Resolve viva schedules, elective selection, and industrial visits with real-time transparent voting bars.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0A0A0A] border border-[#1A1A1A] hover:border-cyan-500/40 transition-all group">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                <Folder className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                Centralized Academic Vault
              </h3>
              <p className="text-xs text-[#8E8E8E] mt-1.5 leading-relaxed">
                High-speed PYQs, lab manuals, and syllabus notes categorized by subject with instant download and local offline caching.
              </p>
            </div>
          </div>
        </section>

        {/* ── WHY STUDYSYNC (AMOLED Dark) ── */}
        <section id="comparison" className="max-w-6xl mx-auto px-5 lg:px-8 py-16 border-t border-white/[0.08]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[11px] font-bold text-[#0095F6] uppercase tracking-widest mb-3">
                Everything in one place
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mb-2">
                What does StudySync actually do?
              </h2>
              <p className="text-sm text-[#A8A8A8] leading-relaxed mb-8">
                It replaces chaotic WhatsApp groups, shared Google Sheets, and reminder DMs with one structured tool built specifically for college classes.
              </p>

              <div className="space-y-0 divide-y divide-[#1A1A1A]">
                <FeatureRow
                  icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  title="Assignment tracking with submission proof"
                  desc="Every assignment moves Assigned → Viewed → Submitted automatically. CR sees a live count. Each submission gets a timestamped hash for proof."
                />
                <FeatureRow
                  icon={<UserCheck className="w-4 h-4 text-purple-400" />}
                  title="Attendance with defaulter alerts"
                  desc="Mark present, absent, late, or excused per session. Auto-flags students below 75%. Export full sheets to CSV in one click."
                />
                <FeatureRow
                  icon={<GraduationCap className="w-4 h-4 text-[#0095F6]" />}
                  title="Subject Directory & Subject CR Delegation"
                  desc="Inspect students subject-by-subject. Designate subject representatives who coordinate specific courses, tracking submissions and attendance per subject."
                />
                <FeatureRow
                  icon={<Megaphone className="w-4 h-4 text-amber-400" />}
                  title="Official broadcasts — not WhatsApp forwards"
                  desc="CR posts pinned announcements the whole class sees immediately. No forwarding, no screenshot-sharing, no one getting left out."
                />
                <FeatureRow
                  icon={<BarChart2 className="w-4 h-4 text-rose-400" />}
                  title="Polls and consensus"
                  desc="CR creates anonymous polls to schedule viva dates, elective choices, or any class decision — results visible instantly."
                />
                <FeatureRow
                  icon={<Folder className="w-4 h-4 text-cyan-400" />}
                  title="Resource library"
                  desc="CR uploads notes, syllabus PDFs, and reference material. All students access it without asking 'bhai notes bhej de' every time."
                />
              </div>
            </div>

            {/* Right: StudySync vs WhatsApp comparison */}
            <div className="space-y-5 lg:sticky lg:top-24">
              <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0A0A0A] shadow-xl backdrop-blur-md">
                <div className="px-5 py-4 bg-[#0E0E0E] border-b border-[#1A1A1A] flex items-center justify-between">
                  <p className="text-xs font-bold text-white">StudySync vs WhatsApp groups</p>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    High Efficiency
                  </span>
                </div>
                <div className="divide-y divide-[#1A1A1A]">
                  {[
                    { point: 'Who submitted the assignment?', wa: 'Ask 32 people one by one', ss: 'Real-time count, names, timestamps' },
                    { point: 'Who was absent today?', wa: 'Go through register or guess', ss: 'One-click session, auto % calculator' },
                    { point: 'Subject-wise student status', wa: 'Lost in chat history', ss: 'Dedicated Subject CR & student inspector' },
                    { point: 'Class announcement', wa: 'Floods the chat, gets buried', ss: 'Pinned broadcast, everyone sees it' },
                    { point: 'Important notes/PDFs', wa: '4D old message, link expired', ss: 'Permanent resource library' },
                    { point: 'Viva date poll', wa: 'Type "1 = Monday, 2 = Tuesday…"', ss: 'Proper anonymous poll, instant result' },
                  ].map(({ point, wa, ss }) => (
                    <div key={point} className="px-5 py-3.5 grid grid-cols-3 gap-3 items-start">
                      <p className="text-[10px] font-semibold text-white col-span-1 leading-snug">{point}</p>
                      <p className="text-[10px] text-[#737373] leading-snug col-span-1">❌ {wa}</p>
                      <p className="text-[10px] text-emerald-400 leading-snug col-span-1 font-medium">✓ {ss}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0095F6]/25 cursor-pointer"
              >
                <span>Create your class now — it's free</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-[#737373]">No account needed. Ready in under 60 seconds.</p>
            </div>
          </div>
        </section>

        {/* ── SIMPLE CTA FOOTER STRIP ── */}
        <section className="border-t border-[#1A1A1A] bg-[#070707] relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none -z-10" />
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-16 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
              Ready to fix your class coordination?
            </h2>
            <p className="text-sm text-[#A8A8A8] max-w-md mx-auto leading-relaxed">
              Create a class, get a 6-digit code, share it. That's it — your entire cohort is synchronized in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-white text-black text-sm font-extrabold flex items-center gap-2 hover:bg-neutral-100 transition-all shadow-sm cursor-pointer"
              >
                <span>Create your class — free</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsJoinOpen(true)}
                className="px-8 py-3.5 rounded-xl border border-white/10 bg-[#0E0E0E] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#1A1A1A] hover:border-white/20 transition-all cursor-pointer"
              >
                <Key className="w-4 h-4 text-[#0095F6]" />
                Join with 6-digit code
              </button>
            </div>
            <div>
              <button
                onClick={onEnterApp}
                className="text-xs text-[#8E8E8E] hover:text-white transition-colors underline-offset-2 hover:underline cursor-pointer"
              >
                Just explore the demo workspace first →
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#1A1A1A] bg-[#000000]">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="font-bold text-sm text-white">StudySync</span>
            <span className="text-[#333] mx-1">·</span>
            <span className="text-xs text-[#737373]">One class code. Nobody left behind.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#737373]">
            <button onClick={() => setActiveTrustPage('about')} className="hover:text-white transition-colors cursor-pointer">About</button>
            <button onClick={() => setActiveTrustPage('privacy')} className="hover:text-white transition-colors cursor-pointer">Privacy</button>
            <button onClick={() => setActiveTrustPage('terms')} className="hover:text-white transition-colors cursor-pointer">Terms</button>
            <button onClick={() => setActiveTrustPage('security')} className="hover:text-white transition-colors cursor-pointer">Security</button>
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All systems online
            </span>
          </div>
        </div>
      </footer>

      <CreateClassModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={onEnterApp} />
      <JoinClassModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} onSuccess={onEnterApp} />
      <RolePortalsModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onEnterApp={onEnterApp}
        initialRole={portalRole}
      />
    </div>
  );
};
