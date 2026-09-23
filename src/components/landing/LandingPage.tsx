import React, { useState } from 'react';
import { useStudySync } from '../../store';
import {
  BookOpen,
  Key,
  CheckCircle2,
  Clock,
  Users,
  BarChart2,
  ArrowRight,
  ShieldCheck,
  Zap,
  MessageSquare,
  ChevronRight,
  UserCheck,
  Megaphone,
  TrendingUp,
  CalendarDays,
  Folder,
  Crown,
  LogIn,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { CreateClassModal, JoinClassModal, FastLoginModal } from '../onboarding/OnboardingModals';

// Feature pill shown in the "Why StudySync" section
const FeatureRow: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 py-5 border-b border-[#DBDBDB] dark:border-[#262626] last:border-0">
    <div className="w-9 h-9 rounded-xl bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-center shrink-0 text-black dark:text-white">
      {icon}
    </div>
    <div>
      <h3 className="text-sm font-semibold text-black dark:text-white leading-tight">{title}</h3>
      <p className="text-xs text-[#737373] dark:text-[#A8A8A8] mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const { setActiveTrustPage, switchRole, allUsers } = useStudySync();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [activePreviewTab, setActivePreviewTab] = useState<'Dashboard' | 'Assignments' | 'Attendance' | 'Subjects'>('Dashboard');

  const crUser = allUsers.find(u => u.role === 'CR') || { id: 'user-cr-1', name: 'Aarav Sharma' };
  const studentUser = allUsers.find(u => u.role === 'Student') || { id: 'user-stu-1', name: 'Ishan Patel' };

  const handleInstantCrLogin = () => {
    switchRole('CR', crUser.id);
    onEnterApp();
  };

  const handleInstantStudentLogin = () => {
    switchRole('Student', studentUser.id);
    onEnterApp();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-[#262626] dark:text-[#F5F5F5] flex flex-col relative overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0095F6]/10 dark:bg-[#0095F6]/15 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-black/90 backdrop-blur-md border-b border-[#DBDBDB] dark:border-[#262626]">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-black dark:bg-white flex items-center justify-center shadow-sm">
              <BookOpen className="w-4 h-4 text-white dark:text-black" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-black dark:text-white">StudySync</span>
          </div>

          <nav className="hidden sm:flex items-center gap-5 text-xs font-medium text-[#737373] dark:text-[#A8A8A8]">
            <button onClick={() => setActiveTrustPage('about')} className="hover:text-black dark:hover:text-white transition-colors">About</button>
            <button onClick={() => setActiveTrustPage('security')} className="hover:text-black dark:hover:text-white transition-colors">Security</button>
            <button onClick={onEnterApp} className="hover:text-black dark:hover:text-white transition-colors">Open Demo</button>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white flex items-center gap-1.5 transition-all shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              onClick={() => setIsJoinOpen(true)}
              className="text-xs font-semibold px-3 py-2 rounded-xl border border-[#DBDBDB] dark:border-[#363636] text-black dark:text-white hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-all hidden sm:inline-flex"
            >
              Join Class
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-bold px-3.5 py-2 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-85 transition-all"
            >
              Create Class
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="max-w-6xl mx-auto px-5 lg:px-8 pt-12 pb-10 lg:pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left: Copy */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#F5F5F5] dark:bg-[#1A1A1A] border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-[#262626] dark:text-[#E0E0E0] shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Precision Class Coordination for College CRs</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1]">
                Stop managing your class on WhatsApp.
              </h1>

              <p className="text-base text-[#737373] dark:text-[#A8A8A8] leading-relaxed max-w-lg">
                StudySync gives every class a private, structured workspace — assignment tracking with submission proofs, subject-wise attendance, polls, and official announcements with a single 6-digit code.
              </p>

              {/* Fast 1-Tap Login Badges */}
              <div className="p-3.5 rounded-2xl bg-neutral-50 dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  ⚡ 1-Tap Quick Access (No password required)
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    onClick={handleInstantCrLogin}
                    className="p-2.5 rounded-xl border border-[#0095F6]/40 bg-[#0095F6]/10 hover:bg-[#0095F6]/20 text-xs font-bold text-[#0095F6] flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                      <span>Log In as CR (Aarav)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={handleInstantStudentLogin}
                    className="p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#1A1A1A] hover:border-neutral-400 text-xs font-semibold text-black dark:text-white flex items-center justify-between transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-neutral-400" />
                      <span>Log In as Student (Ishan)</span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-sm"
                >
                  <span>Create your class — free</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsJoinOpen(true)}
                  className="px-6 py-3.5 rounded-xl text-black dark:text-white text-sm font-semibold flex items-center justify-center gap-2 border border-[#DBDBDB] dark:border-[#363636] hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-all"
                >
                  <Key className="w-4 h-4 text-[#0095F6]" />
                  <span>Join with 6-digit code</span>
                </button>
              </div>

              <p className="text-[11px] text-[#A8A8A8] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                No password required · Works on any browser · Data stored locally
              </p>
            </div>

            {/* Right: Feature showcase panel */}
            <div className="rounded-2xl border border-[#DBDBDB] dark:border-[#262626] overflow-hidden bg-[#FAFAFA] dark:bg-[#0A0A0A] shadow-xl">
              {/* Tab bar */}
              <div className="flex border-b border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-black overflow-x-auto">
                {(['Dashboard', 'Assignments', 'Attendance', 'Subjects'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setActivePreviewTab(t)}
                    title={`Preview ${t}`}
                    className={`px-4 py-2.5 text-[11px] font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                      activePreviewTab === t
                        ? 'border-[#0095F6] text-[#0095F6]'
                        : 'border-transparent text-[#8E8E8E] hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {t === 'Subjects' ? 'Subjects & CRs' : t}
                  </button>
                ))}
              </div>

              {/* Dynamic Preview Content */}
              <div className="p-4 space-y-3">
                {activePreviewTab === 'Dashboard' && (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Total Students', val: '32', color: 'text-black dark:text-white' },
                        { label: 'Submitted', val: '28', color: 'text-emerald-600 dark:text-emerald-400' },
                        { label: 'Pending', val: '4', color: 'text-amber-600 dark:text-amber-400' },
                      ].map(s => (
                        <div key={s.label} className="p-2.5 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                          <p className="text-[9px] text-[#8E8E8E] uppercase tracking-wide font-semibold">{s.label}</p>
                          <p className={`text-xl font-extrabold font-mono mt-0.5 ${s.color}`}>{s.val}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-2">
                      {[
                        { title: 'Fluid Mechanics Lab Report', sub: 'Mech', due: 'Due today', pct: 87, warn: true },
                        { title: 'Physics Numericals Unit 4', sub: 'Applied Physics', due: 'Due Fri', pct: 56, warn: false },
                      ].map(a => (
                        <div key={a.title} className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <p className="text-xs font-semibold text-black dark:text-white leading-tight">{a.title}</p>
                              <p className="text-[10px] text-[#8E8E8E] mt-0.5">{a.sub}</p>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 ${a.warn ? 'bg-amber-100 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400' : 'bg-[#EFEFEF] dark:bg-[#262626] text-[#8E8E8E]'}`}>
                              {a.due}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-[#EFEFEF] dark:bg-[#262626] overflow-hidden">
                              <div className="h-full bg-[#0095F6] rounded-full" style={{ width: `${a.pct}%` }} />
                            </div>
                            <span className="text-[10px] font-bold text-[#0095F6] font-mono shrink-0">{a.pct}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {activePreviewTab === 'Assignments' && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                      <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white mb-1">
                        <span>Thermodynamics Assignment 3</span>
                        <span className="text-emerald-500 text-[10px]">Verified Proof</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">Due in 2 days · Max 100 pts · 28 of 32 Submitted</p>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
                      <div className="flex items-center justify-between text-xs font-bold text-black dark:text-white mb-1">
                        <span>CAD Graphics Drawing Sheet 4</span>
                        <span className="text-amber-500 text-[10px]">Due Tomorrow</span>
                      </div>
                      <p className="text-[11px] text-neutral-400">Engineering Graphics · Prof. Murthy</p>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'Attendance' && (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">Class Average Attendance</span>
                        <p className="text-[11px] text-neutral-400">Regulatory threshold 75% met</p>
                      </div>
                      <span className="text-2xl font-bold font-mono text-emerald-500">84%</span>
                    </div>
                    <div className="p-3 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-xs">
                      <span>Recent: Fluid Mechanics Lecture 8</span>
                      <span className="font-mono font-bold text-black dark:text-white">29 Present</span>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'Subjects' && (
                  <div className="space-y-2">
                    {[
                      { name: 'Fluid Mechanics', cr: 'Ishan Patel', color: '#0EA5E9' },
                      { name: 'Applied Physics', cr: 'Neha Kulkarni', color: '#8B5CF6' },
                      { name: 'Engineering Graphics', cr: 'Rohan Verma', color: '#10B981' }
                    ].map(s => (
                      <div key={s.name} className="p-2.5 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-xs font-bold text-black dark:text-white">{s.name}</span>
                        </div>
                        <span className="text-[10px] text-neutral-400">CR: <strong className="text-black dark:text-white">{s.cr}</strong></span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick CTA inside preview */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0095F6]/8 dark:bg-[#0095F6]/10 border border-[#0095F6]/20">
                  <span className="text-[11px] font-semibold text-[#0095F6]">Open live interactive cohort</span>
                  <button onClick={onEnterApp} className="text-[10px] font-bold bg-[#0095F6] hover:bg-[#1877F2] text-white px-2.5 py-1 rounded-lg transition-colors cursor-pointer">
                    Remind All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── WHY STUDYSYNC ── */}
        <section className="max-w-6xl mx-auto px-5 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[11px] font-bold text-[#0095F6] uppercase tracking-widest mb-3">Everything in one place</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight leading-tight mb-2">
                What does StudySync actually do?
              </h2>
              <p className="text-sm text-[#737373] dark:text-[#A8A8A8] leading-relaxed mb-8">
                It replaces chaotic WhatsApp groups, shared Google Sheets, and reminder DMs with one structured tool built specifically for college classes.
              </p>

              <div className="space-y-0 divide-y divide-[#DBDBDB] dark:divide-[#262626]">
                <FeatureRow
                  icon={<CheckCircle2 className="w-4.5 h-4.5" />}
                  title="Assignment tracking with submission proof"
                  desc="Every assignment moves Assigned → Viewed → Submitted automatically. CR sees a live count. Each submission gets a timestamped hash for proof."
                />
                <FeatureRow
                  icon={<UserCheck className="w-4.5 h-4.5" />}
                  title="Attendance with defaulter alerts"
                  desc="Mark present, absent, late, or excused per session. Auto-flags students below 75%. Export full sheets to CSV in one click."
                />
                <FeatureRow
                  icon={<GraduationCap className="w-4.5 h-4.5" />}
                  title="Subject Directory & Subject CR Delegation"
                  desc="Inspect students subject-by-subject. Designate subject representatives who can coordinate specific courses, tracking submissions and attendance per subject."
                />
                <FeatureRow
                  icon={<Megaphone className="w-4.5 h-4.5" />}
                  title="Official broadcasts — not WhatsApp forwards"
                  desc="CR posts pinned announcements the whole class sees immediately. No forwarding, no screenshot-sharing, no one getting left out."
                />
                <FeatureRow
                  icon={<BarChart2 className="w-4.5 h-4.5" />}
                  title="Polls and consensus"
                  desc="CR creates anonymous polls to schedule viva dates, elective choices, or any class decision — results visible instantly."
                />
                <FeatureRow
                  icon={<Folder className="w-4.5 h-4.5" />}
                  title="Resource library"
                  desc="CR uploads notes, syllabus PDFs, and reference material. All students access it without asking 'bhai notes bhej de' every time."
                />
              </div>
            </div>

            {/* Right: Quick comparison */}
            <div className="space-y-5 sticky top-24">
              <div className="rounded-2xl border border-[#DBDBDB] dark:border-[#262626] overflow-hidden bg-white dark:bg-[#121212] shadow-sm">
                <div className="px-5 py-3.5 bg-[#F5F5F5] dark:bg-[#1A1A1A] border-b border-[#DBDBDB] dark:border-[#262626]">
                  <p className="text-xs font-bold text-black dark:text-white">StudySync vs WhatsApp groups</p>
                </div>
                <div className="divide-y divide-[#DBDBDB] dark:divide-[#262626]">
                  {[
                    { point: 'Who submitted the assignment?', wa: 'Ask 32 people one by one', ss: 'Real-time count, names, timestamps' },
                    { point: 'Who was absent today?', wa: 'Go through register or guess', ss: 'One-click session, auto % calculator' },
                    { point: 'Subject-wise student status', wa: 'Lost in chat history', ss: 'Dedicated Subject CR & student inspector' },
                    { point: 'Class announcement', wa: 'Floods the chat, gets buried', ss: 'Pinned broadcast, everyone sees it' },
                    { point: 'Important notes/PDFs', wa: '4D old message, link expired', ss: 'Permanent resource library' },
                    { point: 'Viva date poll', wa: 'Type "1 = Monday, 2 = Tuesday…"', ss: 'Proper anonymous poll, instant result' },
                  ].map(({ point, wa, ss }) => (
                    <div key={point} className="px-5 py-3.5 grid grid-cols-3 gap-3 items-start">
                      <p className="text-[10px] font-semibold text-black dark:text-white col-span-1 leading-snug">{point}</p>
                      <p className="text-[10px] text-[#737373] dark:text-[#A8A8A8] leading-snug col-span-1">❌ {wa}</p>
                      <p className="text-[10px] text-emerald-600 dark:text-emerald-400 leading-snug col-span-1 font-medium">✓ {ss}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="w-full py-3.5 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-md shadow-[#0095F6]/20"
              >
                <span>Create your class now — it's free</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <p className="text-center text-[11px] text-[#A8A8A8]">No account needed. Ready in under 60 seconds.</p>
            </div>
          </div>
        </section>

        {/* ── SIMPLE CTA FOOTER STRIP ── */}
        <section className="border-t border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#0A0A0A]">
          <div className="max-w-6xl mx-auto px-5 lg:px-8 py-14 text-center space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
              Ready to fix your class coordination?
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#A8A8A8] max-w-md mx-auto">
              Create a class, get a 6-digit code, share it. That's it — your entire class is synced.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-extrabold flex items-center gap-2 hover:opacity-90 transition-all shadow-sm"
              >
                <span>I'm the CR — create my class</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsJoinOpen(true)}
                className="px-8 py-3.5 rounded-xl border border-[#DBDBDB] dark:border-[#363636] text-black dark:text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#F5F5F5] dark:hover:bg-[#121212] transition-all"
              >
                <Key className="w-4 h-4 text-[#0095F6]" />
                I'm a student — join with code
              </button>
            </div>
            <button onClick={onEnterApp} className="text-xs text-[#A8A8A8] hover:text-black dark:hover:text-white transition-colors underline-offset-2 hover:underline">
              Just explore the demo workspace first →
            </button>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-black">
        <div className="max-w-6xl mx-auto px-5 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-black dark:bg-white flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white dark:text-black" />
            </div>
            <span className="font-bold text-sm text-black dark:text-white">StudySync</span>
            <span className="text-[#DBDBDB] dark:text-[#262626] mx-1">·</span>
            <span className="text-xs text-[#8E8E8E]">One class code. Nobody left behind.</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-[#8E8E8E]">
            <button onClick={() => setActiveTrustPage('about')} className="hover:text-black dark:hover:text-white transition-colors">About</button>
            <button onClick={() => setActiveTrustPage('privacy')} className="hover:text-black dark:hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setActiveTrustPage('terms')} className="hover:text-black dark:hover:text-white transition-colors">Terms</button>
            <button onClick={() => setActiveTrustPage('security')} className="hover:text-black dark:hover:text-white transition-colors">Security</button>
            <span className="flex items-center gap-1 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All systems up
            </span>
          </div>
        </div>
      </footer>

      <CreateClassModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={onEnterApp} />
      <JoinClassModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} onSuccess={onEnterApp} />
      <FastLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onEnterApp={onEnterApp}
        onOpenJoin={() => setIsJoinOpen(true)}
        onOpenCreate={() => setIsCreateOpen(true)}
      />
    </div>
  );
};
