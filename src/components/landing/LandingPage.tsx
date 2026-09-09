import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  Key, 
  CheckCircle2, 
  Clock, 
  Lock, 
  ArrowRight, 
  Code2
} from 'lucide-react';
import { CreateClassModal, JoinClassModal } from '../onboarding/OnboardingModals';

export const LandingPage: React.FC<{ onEnterApp: () => void }> = ({ onEnterApp }) => {
  const { setActiveTrustPage } = useStudySync();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#080D1A] text-white flex flex-col justify-between selection:bg-[#00B4A6]/30">
      {/* Top minimal nav */}
      <header className="px-6 lg:px-12 py-5 flex items-center justify-between border-b border-[#141C2E] bg-[#050811]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00B4A6] text-[#080D1A] font-extrabold flex items-center justify-center text-sm shadow-xs">
            SS
          </div>
          <span className="font-extrabold text-lg tracking-tight text-white">
            StudySync
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnterApp}
            className="text-xs font-bold text-[#94A3B8] hover:text-white px-3 py-1.5 rounded-lg transition-colors"
          >
            Open Live Workspace
          </button>
          <button
            onClick={() => setIsJoinOpen(true)}
            className="text-xs font-bold px-3.5 py-1.5 rounded-lg border border-[#25427C] hover:bg-[#15203B] text-white transition-all shadow-xs"
          >
            Join with Code
          </button>
        </div>
      </header>

      {/* SECTION 1: HERO */}
      <main className="flex-1 flex flex-col justify-center px-6 lg:px-12 py-12 lg:py-16 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#15203B] text-[#00D2C4] text-xs font-bold border border-[#25427C]">
              <span className="w-2 h-2 rounded-full bg-[#00D2C4] animate-live-pulse" />
              <span>Engineered for Class Representatives & Students</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Your class.<br />
              <span className="text-[#00D2C4]">Finally in sync.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#94A3B8] max-w-xl leading-relaxed">
              CR-managed. Code-protected. Real-time. No more WhatsApp chaos, lost assignment PDFs, or missed deadlines.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-[#00B4A6] hover:bg-[#009E91] text-[#080D1A] text-sm font-extrabold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#00B4A6]/20"
              >
                <span>Create a class</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsJoinOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-transparent border border-white/20 hover:bg-white/10 text-white text-sm font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Key className="w-4 h-4 text-[#00D2C4]" />
                <span>Join with code</span>
              </button>
            </div>
          </div>

          {/* Right Animated Triple-Panel Mockup */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl border border-[#1E293B] bg-[#050811] p-3 shadow-2xl overflow-hidden">
              {/* Browser mockup header */}
              <div className="flex items-center justify-between px-3 py-2 border-b border-[#141C2E] mb-2.5">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FB7185]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FBBF24]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00D2C4]" />
                </div>
                <div className="font-mono text-[10px] text-[#64748B] bg-[#0E1526] px-3.5 py-0.5 rounded-md border border-[#1E293B]">
                  studysync.app/MECH-3A
                </div>
                <div className="w-10" />
              </div>

              {/* Triple-Panel Visual Mockup */}
              <div className="grid grid-cols-12 gap-2 h-64 sm:h-72 text-left">
                {/* Left Mini Panel */}
                <div className="col-span-3 bg-[#0B132B] rounded-xl p-2.5 border border-[#141C2E] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[10px] font-extrabold text-[#00D2C4] truncate">MECH-3A</div>
                    <div className="font-mono text-[9px] font-bold text-[#94A3B8] bg-[#15203B] p-1 rounded-md">7F2K9Q</div>
                    <div className="space-y-1 pt-1">
                      <div className="h-2 w-full bg-[#00D2C4]/20 rounded" />
                      <div className="h-2 w-3/4 bg-[#141C2E] rounded" />
                      <div className="h-2 w-5/6 bg-[#141C2E] rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-[#00D2C4] font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00D2C4] animate-pulse" />
                    <span>Live Sync</span>
                  </div>
                </div>

                {/* Center Main Panel */}
                <div className="col-span-5 bg-[#0B132B] rounded-xl p-2.5 border border-[#141C2E] flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-white">Live Tasks</span>
                      <span className="text-[9px] text-[#00D2C4] font-mono font-bold">18/32</span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="font-bold text-white truncate">Fluid Mechanics 2</span>
                        <span className="text-[#FBBF24] font-mono font-bold">Due Today</span>
                      </div>
                      <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00D2C4] w-[56%]" />
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-[#0F172A] border border-[#1E293B] space-y-1">
                      <div className="flex items-center justify-between text-[9px]">
                        <span className="font-bold text-white truncate">Physics Lab Report</span>
                        <span className="text-[#00D2C4] font-mono font-bold">Due Fri</span>
                      </div>
                      <div className="w-full h-1 bg-[#1E293B] rounded-full overflow-hidden">
                        <div className="h-full bg-[#00D2C4] w-[87%]" />
                      </div>
                    </div>
                  </div>

                  <div className="p-1.5 rounded-lg bg-[#00D2C4]/10 border border-[#00D2C4]/20 text-[9px] text-[#00D2C4] text-center font-bold">
                    1-Tap Remind Non-Submitters
                  </div>
                </div>

                {/* Right Context Panel */}
                <div className="col-span-4 bg-[#0B132B] rounded-xl p-2.5 border border-[#141C2E] space-y-2 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-white block">Audit Proof</span>
                    <div className="space-y-1 text-[9px]">
                      <div className="flex items-center justify-between text-white/90">
                        <span className="truncate">Ishan Patel</span>
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#00D2C4]" />
                      </div>
                      <div className="flex items-center justify-between text-white/90">
                        <span className="truncate">Neha Kulkarni</span>
                        <CheckCircle2 className="w-2.5 h-2.5 text-[#00D2C4]" />
                      </div>
                      <div className="flex items-center justify-between text-[#FBBF24]">
                        <span className="truncate">Rohan Verma</span>
                        <span className="font-mono">Pending</span>
                      </div>
                    </div>
                  </div>

                  <div className="font-mono text-[8px] text-[#64748B] bg-[#050811] p-1.5 rounded-md border border-[#141C2E] truncate">
                    Hash: 8f92a10b4c7e...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* SECTION 2: 4-COLUMN FEATURE STRIP */}
      <section className="bg-[#050811] border-t border-[#141C2E] px-6 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#0B132B] border border-[#141C2E] text-[#00D2C4] flex items-center justify-center mb-2 shadow-xs">
              <Key className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Code-gated joining</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              6-character unique access keys eliminate institutional IT bottlenecks.
            </p>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#0B132B] border border-[#141C2E] text-[#00D2C4] flex items-center justify-center mb-2 shadow-xs">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Live submission tracking</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Auto-advances from Assigned to Viewed to Submitted with cryptographic logs.
            </p>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#0B132B] border border-[#141C2E] text-[#00D2C4] flex items-center justify-center mb-2 shadow-xs">
              <Clock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Auto reminders</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Automated 24h & 2h notifications plus 1-click manual CR triggers.
            </p>
          </div>

          <div className="space-y-1.5 text-left">
            <div className="w-9 h-9 rounded-xl bg-[#0B132B] border border-[#141C2E] text-[#00D2C4] flex items-center justify-center mb-2 shadow-xs">
              <Lock className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-white">Encrypted broadcasts</h3>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Immutable class announcements and encrypted 1-on-1 CR channels.
            </p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 lg:px-12 py-6 border-t border-[#141C2E] bg-[#050811] text-[#64748B] text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">StudySync</span>
          <span>·</span>
          <span>One class code. Nobody left behind.</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <button 
            onClick={() => setActiveTrustPage('privacy')} 
            className="hover:text-white transition-colors"
          >
            Privacy Policy
          </button>
          <button 
            onClick={() => setActiveTrustPage('terms')} 
            className="hover:text-white transition-colors"
          >
            Terms of Service
          </button>
          <button 
            onClick={() => setActiveTrustPage('security')} 
            className="hover:text-white transition-colors"
          >
            Security & E2EE
          </button>
          <button 
            onClick={() => setActiveTrustPage('status')} 
            className="hover:text-white transition-colors flex items-center gap-1 text-[#00D2C4]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D2C4]" />
            <span>status.studysync.app</span>
          </button>
          <button 
            onClick={() => setActiveTrustPage('about')} 
            className="hover:text-white transition-colors"
          >
            About Story
          </button>
        </div>
      </footer>

      {/* Modals */}
      <CreateClassModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={onEnterApp}
      />

      <JoinClassModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        onSuccess={onEnterApp}
      />
    </div>
  );
};
