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
  Star
} from 'lucide-react';
import { CreateClassModal, JoinClassModal } from '../onboarding/OnboardingModals';

const StatBadge: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <div className="text-center px-5 py-3 rounded-2xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626]">
    <div className="text-2xl font-extrabold text-black dark:text-white tracking-tight">{value}</div>
    <div className="text-[11px] text-[#8E8E8E] mt-0.5 font-medium">{label}</div>
  </div>
);

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  desc: string;
  accent?: string;
}> = ({ icon, title, desc, accent = 'text-[#0095F6] bg-[#0095F6]/10' }) => (
  <div className="p-6 rounded-2xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6]/40 transition-all duration-200 group">
    <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <h3 className="text-sm font-bold text-black dark:text-white mb-1.5">{title}</h3>
    <p className="text-xs text-[#737373] dark:text-[#A8A8A8] leading-relaxed">{desc}</p>
  </div>
);

export const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const { setActiveTrustPage } = useStudySync();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-black text-[#262626] dark:text-[#F5F5F5] flex flex-col">

      {/* ── TOP NAV ── */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-[#DBDBDB] dark:border-[#262626]">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 h-14 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-base tracking-tight text-black dark:text-white">StudySync</span>
          </div>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-6 text-xs font-medium text-[#737373] dark:text-[#A8A8A8]">
            <button onClick={() => setActiveTrustPage('about')} className="hover:text-black dark:hover:text-white transition-colors">About</button>
            <button onClick={() => setActiveTrustPage('security')} className="hover:text-black dark:hover:text-white transition-colors">Security</button>
            <button onClick={() => setActiveTrustPage('privacy')} className="hover:text-black dark:hover:text-white transition-colors">Privacy</button>
          </nav>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEnterApp}
              className="text-xs font-semibold text-[#737373] dark:text-[#A8A8A8] hover:text-black dark:hover:text-white px-3 py-1.5 rounded-lg transition-colors hidden sm:block"
            >
              Open App
            </button>
            <button
              onClick={() => setIsJoinOpen(true)}
              className="text-xs font-semibold px-3.5 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white hover:border-[#0095F6] transition-all"
            >
              Join with Code
            </button>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="text-xs font-bold px-4 py-2 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white transition-all"
            >
              Create Class
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* ── HERO ── */}
        <section className="max-w-7xl mx-auto px-5 lg:px-10 pt-16 pb-12 lg:pt-24 lg:pb-16">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0095F6]/10 text-[#0095F6] text-xs font-semibold border border-[#0095F6]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0095F6] animate-pulse" />
              Built for Indian engineering colleges
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-black dark:text-white tracking-tight leading-[1.1]">
              Your class.<br />
              <span className="text-[#0095F6]">Finally coordinated.</span>
            </h1>

            {/* Sub */}
            <p className="text-base sm:text-lg text-[#737373] dark:text-[#A8A8A8] leading-relaxed max-w-xl mx-auto">
              No more WhatsApp chaos. StudySync gives every class a private workspace — assignments, attendance, polls, and broadcasts — managed by the Class Representative.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-extrabold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg"
              >
                <span>Create your class</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsJoinOpen(true)}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white dark:bg-[#121212] text-black dark:text-white text-sm font-bold flex items-center justify-center gap-2 border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6] transition-all"
              >
                <Key className="w-4 h-4 text-[#0095F6]" />
                <span>Join with 6-digit code</span>
              </button>
            </div>

            {/* Trust micro-text */}
            <p className="text-[11px] text-[#A8A8A8] flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Free to use · No signup required · Works on any device
            </p>
          </div>
        </section>

        {/* ── APP MOCKUP ── */}
        <section className="max-w-5xl mx-auto px-5 lg:px-10 pb-16">
          <div className="rounded-2xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] shadow-2xl overflow-hidden">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-4 py-3 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818]">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ED4956]" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-[#EFEFEF] dark:bg-[#262626] rounded-md px-3 py-1 text-[10px] font-mono text-[#8E8E8E] text-center max-w-xs mx-auto">
                  studysync.app/dashboard
                </div>
              </div>
            </div>

            {/* App UI snapshot */}
            <div className="grid grid-cols-12 h-56 sm:h-72 divide-x divide-[#DBDBDB] dark:divide-[#262626]">
              {/* Sidebar mock */}
              <div className="col-span-2 p-2.5 space-y-1.5 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <div className="h-6 bg-[#EFEFEF] dark:bg-[#262626] rounded-md" />
                {['Home','Tasks','Attend','Polls','Msgs'].map((l, i) => (
                  <div key={l} className={`h-6 flex items-center gap-1.5 px-1.5 rounded-md ${i === 0 ? 'bg-[#0095F6]/10' : ''}`}>
                    <div className={`w-2.5 h-2.5 rounded-sm shrink-0 ${i === 0 ? 'bg-[#0095F6]' : 'bg-[#DBDBDB] dark:bg-[#262626]'}`} />
                    <div className={`h-1.5 rounded-full flex-1 ${i === 0 ? 'bg-[#0095F6]/40' : 'bg-[#EFEFEF] dark:bg-[#262626]'}`} />
                  </div>
                ))}
              </div>

              {/* Main panel mock */}
              <div className="col-span-7 p-3 space-y-2.5 bg-white dark:bg-[#000000]">
                <div className="flex items-center justify-between mb-1">
                  <div className="h-3 w-28 bg-[#262626] dark:bg-[#F5F5F5] rounded-full opacity-80" />
                  <div className="h-6 w-20 rounded-lg bg-[#0095F6]" />
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[100, 40, 70, 55].map((v, i) => (
                    <div key={i} className="p-2 rounded-xl border border-[#DBDBDB] dark:border-[#262626] space-y-1">
                      <div className="h-1.5 w-8 bg-[#DBDBDB] dark:bg-[#262626] rounded-full" />
                      <div className={`text-[11px] font-bold ${i === 1 ? 'text-amber-500' : 'text-black dark:text-white'}`}>{v}%</div>
                    </div>
                  ))}
                </div>
                {[56, 87, 30].map((pct, i) => (
                  <div key={i} className="p-2.5 rounded-xl border border-[#DBDBDB] dark:border-[#262626] space-y-1.5">
                    <div className="flex justify-between">
                      <div className="h-2 w-24 bg-[#262626] dark:bg-[#F5F5F5] rounded-full opacity-70" />
                      <div className={`h-2 w-8 rounded-full ${pct > 70 ? 'bg-emerald-400' : pct > 50 ? 'bg-[#0095F6]/60' : 'bg-amber-400'}`} />
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-[#EFEFEF] dark:bg-[#262626] overflow-hidden">
                      <div className="h-full bg-[#0095F6] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Right panel mock */}
              <div className="col-span-3 p-2.5 space-y-2 bg-[#FAFAFA] dark:bg-[#0A0A0A]">
                <div className="h-2.5 w-16 bg-[#262626] dark:bg-[#F5F5F5] rounded-full opacity-70" />
                {['Priya S.','Arjun K.','Nisha P.','Rohan M.','Kavya R.'].map((name, i) => (
                  <div key={name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-4 h-4 rounded-full bg-[#DBDBDB] dark:bg-[#262626]" />
                      <div className="h-1.5 w-10 bg-[#DBDBDB] dark:bg-[#262626] rounded-full" />
                    </div>
                    <CheckCircle2 className={`w-3 h-3 ${i < 3 ? 'text-emerald-500' : 'text-[#DBDBDB] dark:text-[#262626]'}`} />
                  </div>
                ))}
                <div className="pt-1">
                  <div className="h-5 rounded-lg bg-[#0095F6]/15 border border-[#0095F6]/30 flex items-center justify-center">
                    <span className="text-[9px] font-bold text-[#0095F6]">Remind 2 pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS STRIP ── */}
        <section className="max-w-7xl mx-auto px-5 lg:px-10 pb-16">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <StatBadge value="10,000+" label="Students using StudySync" />
            <StatBadge value="500+" label="Classes created this semester" />
            <StatBadge value="99.9%" label="Submission accuracy" />
            <StatBadge value="0" label="WhatsApp groups needed" />
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="max-w-7xl mx-auto px-5 lg:px-10 pb-16">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-black dark:text-white tracking-tight">
              Everything your class needs. Nothing it doesn't.
            </h2>
            <p className="text-sm text-[#737373] dark:text-[#A8A8A8] mt-2">
              Built specifically for college class coordination in India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FeatureCard
              icon={<CheckCircle2 className="w-5 h-5 text-[#0095F6]" />}
              title="Live submission tracking"
              desc="Every assignment moves from Assigned → Viewed → Submitted automatically. CR sees the real-time count, not guesswork."
              accent="text-[#0095F6] bg-[#0095F6]/10"
            />
            <FeatureCard
              icon={<Clock className="w-5 h-5 text-amber-500" />}
              title="Smart deadline alerts"
              desc="Automatic 24h and 2h reminders sent to non-submitters. CR can also nudge everyone with one tap."
              accent="text-amber-500 bg-amber-500/10"
            />
            <FeatureCard
              icon={<Users className="w-5 h-5 text-emerald-500" />}
              title="Class roster management"
              desc="Students join via 6-character code. CR can view all members, roll numbers, and last-active time."
              accent="text-emerald-500 bg-emerald-500/10"
            />
            <FeatureCard
              icon={<BarChart2 className="w-5 h-5 text-purple-500" />}
              title="Attendance tracking"
              desc="Mark present, absent, late, or excused. Calculates attendance percentage. Flags students below 75%."
              accent="text-purple-500 bg-purple-500/10"
            />
            <FeatureCard
              icon={<MessageSquare className="w-5 h-5 text-[#0095F6]" />}
              title="Direct messages"
              desc="Students can message the CR directly. Class-wide cohort channel for general discussion."
              accent="text-[#0095F6] bg-[#0095F6]/10"
            />
            <FeatureCard
              icon={<Zap className="w-5 h-5 text-amber-500" />}
              title="Quick polls & consensus"
              desc="CR creates anonymous polls to gauge class mood, schedule votes, or collect feedback in seconds."
              accent="text-amber-500 bg-amber-500/10"
            />
          </div>
        </section>

        {/* ── TESTIMONIAL STRIP ── */}
        <section className="bg-white dark:bg-[#0A0A0A] border-y border-[#DBDBDB] dark:border-[#262626] py-12 px-5 lg:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center gap-0.5 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <p className="text-sm font-semibold text-black dark:text-white">Loved by CRs across 50+ colleges</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { quote: "Finally a tool built for how Indian college classes actually work. Our submission rates went from 60% to 95%.", name: "Priya S.", role: "CR, MECH 3rd Year, VIT" },
                { quote: "I used to spend 2 hours a day chasing submissions on WhatsApp. Now it takes 5 minutes and everything is tracked.", name: "Arjun K.", role: "CR, CSE 2nd Year, SRM" },
                { quote: "The attendance tracker alone saves our department coordinator a week of work every semester.", name: "Nisha P.", role: "CR, ECE 4th Year, NIT Trichy" },
              ].map(t => (
                <div key={t.name} className="p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] space-y-3">
                  <p className="text-xs text-[#737373] dark:text-[#A8A8A8] leading-relaxed italic">"{t.quote}"</p>
                  <div>
                    <p className="text-xs font-bold text-black dark:text-white">{t.name}</p>
                    <p className="text-[10px] text-[#8E8E8E]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA SECTION ── */}
        <section className="max-w-7xl mx-auto px-5 lg:px-10 py-20 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-black dark:text-white tracking-tight mb-4">
            Your class code is waiting.
          </h2>
          <p className="text-sm text-[#737373] dark:text-[#A8A8A8] mb-8 max-w-md mx-auto">
            Create a class in 30 seconds. Share the 6-character code. Done — your entire class is synced.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#0095F6] hover:bg-[#1877F2] text-white text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#0095F6]/25"
            >
              <span>Create a class — it's free</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white dark:bg-[#121212] text-black dark:text-white text-sm font-bold flex items-center justify-center gap-2 border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6] transition-all"
            >
              Explore the demo workspace
            </button>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-black px-5 lg:px-10 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-black dark:bg-white flex items-center justify-center">
              <BookOpen className="w-3.5 h-3.5 text-white dark:text-black" />
            </div>
            <span className="font-extrabold text-sm text-black dark:text-white">StudySync</span>
            <span className="text-[#DBDBDB] dark:text-[#262626]">·</span>
            <span className="text-xs text-[#8E8E8E]">One class code. Nobody left behind.</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-[#8E8E8E]">
            <button onClick={() => setActiveTrustPage('about')} className="hover:text-black dark:hover:text-white transition-colors">About</button>
            <button onClick={() => setActiveTrustPage('privacy')} className="hover:text-black dark:hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setActiveTrustPage('terms')} className="hover:text-black dark:hover:text-white transition-colors">Terms</button>
            <button onClick={() => setActiveTrustPage('security')} className="hover:text-black dark:hover:text-white transition-colors">Security</button>
            <button onClick={() => setActiveTrustPage('status')} className="hover:text-black dark:hover:text-white transition-colors flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              All systems operational
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CreateClassModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={onEnterApp} />
      <JoinClassModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} onSuccess={onEnterApp} />
    </div>
  );
};
