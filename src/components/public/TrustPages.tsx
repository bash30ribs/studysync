import React from 'react';
import { useStudySync } from '../../store';
import { 
  ShieldCheck, 
  Lock, 
  Server, 
  Activity, 
  FileText, 
  Users, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  Key, 
  Database,
  ExternalLink,
  GraduationCap
} from 'lucide-react';

export const TrustPages: React.FC = () => {
  const { activeTrustPage, setActiveTrustPage } = useStudySync();

  if (!activeTrustPage) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white dark:bg-[#0B132B] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTrustPage(null)}
              className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-[#1E293B] text-[#475569] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#0F2044] dark:text-white capitalize">
                {activeTrustPage === 'privacy' && 'Privacy Policy'}
                {activeTrustPage === 'terms' && 'Terms of Service'}
                {activeTrustPage === 'security' && 'Security & Data Architecture'}
                {activeTrustPage === 'status' && 'System Infrastructure & Status (status.studysync.app)'}
                {activeTrustPage === 'about' && 'About StudySync'}
              </h2>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                StudySync Trust & Governance Center • Version 2.4 (2026)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTrustPage('privacy')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${activeTrustPage === 'privacy' ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#15203B]'}`}
            >
              Privacy
            </button>
            <button
              onClick={() => setActiveTrustPage('terms')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${activeTrustPage === 'terms' ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#15203B]'}`}
            >
              Terms
            </button>
            <button
              onClick={() => setActiveTrustPage('security')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${activeTrustPage === 'security' ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#15203B]'}`}
            >
              Security
            </button>
            <button
              onClick={() => setActiveTrustPage('status')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${activeTrustPage === 'status' ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#15203B]'}`}
            >
              Status
            </button>
            <button
              onClick={() => setActiveTrustPage('about')}
              className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${activeTrustPage === 'about' ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B]' : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#15203B]'}`}
            >
              About
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs sm:text-sm text-[#334155] dark:text-[#CBD5E1] leading-relaxed">
          {/* 1. Privacy Policy */}
          {activeTrustPage === 'privacy' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#E6F8F6] dark:bg-[#00D2C4]/10 border border-[#00B4A6]/20 text-[#00897B] dark:text-[#00D2C4] flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs">Zero Commercial Data Selling</h4>
                  <p className="text-[11px] mt-0.5 opacity-90">
                    StudySync is built for academic coordination. We never monetize student data, run targeted advertisements, or sell personal records to third-party brokers.
                  </p>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#0F2044] dark:text-white">1. Information We Collect</h3>
              <p>
                We collect only information essential to coordinating class submissions, attendance, and official broadcasts:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Identity Information:</strong> Student name, institutional email address, university roll number, and Class Representative designation.</li>
                <li><strong>Academic Artifacts:</strong> Submitted assignment files, timestamp verification metadata, text responses, and attendance logs.</li>
                <li><strong>Security & Audit Logs:</strong> Cryptographic SHA-256 submission proofs, browser agent hashes, and IP mock telemetry to prevent fraudulent submission tampering.</li>
              </ul>

              <h3 className="text-base font-bold text-[#0F2044] dark:text-white mt-4">2. GDPR & Student Privacy Standards</h3>
              <p>
                Under European GDPR principles and international student privacy acts, you retain full rights to export your complete academic portfolio or request total deletion upon semester graduation.
              </p>

              <h3 className="text-base font-bold text-[#0F2044] dark:text-white mt-4">3. Data Retention & Archiving</h3>
              <p>
                Class data is preserved through the active semester. Upon CR handover or semester archiving, files remain in read-only audit status accessible exclusively by enrolled cohort members.
              </p>
            </div>
          )}

          {/* 2. Terms of Service */}
          {activeTrustPage === 'terms' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-[#0F2044] dark:text-white">1. Acceptance of Terms</h3>
              <p>
                By enrolling in or creating a class section on StudySync, you agree to abide by institutional academic integrity codes, role governance rules, and mutual respect guidelines.
              </p>

              <h3 className="text-base font-bold text-[#0F2044] dark:text-white mt-4">2. Class Representative (CR) Responsibilities</h3>
              <p>
                Class Representatives act as administrative stewards. CRs agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Accurately publish professor deadlines, syllabus guidelines, and official notices without malicious tampering.</li>
                <li>Maintain neutral, unbiased attendance logging and submission verification.</li>
                <li>Execute formal CR Handover upon semester transition to preserve cohort records.</li>
              </ul>

              <h3 className="text-base font-bold text-[#0F2044] dark:text-white mt-4">3. Tamper-Evident Submission Proofs</h3>
              <p>
                Every assignment submission generates an immutable cryptographic verification hash (`SHA-256`). Attempting to manipulate local system clocks or forge submission timestamps constitutes a breach of academic integrity.
              </p>
            </div>
          )}

          {/* 3. Security Overview */}
          {activeTrustPage === 'security' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/40 space-y-2">
                  <div className="flex items-center gap-2 text-[#00B4A6] dark:text-[#00D2C4] font-bold text-xs">
                    <Lock className="w-4 h-4" />
                    <span>AES-256 E2E Encryption</span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    All peer-to-peer discussions and CR direct messages are encrypted at rest and in transit using industry-standard AES-256 ciphers.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/40 space-y-2">
                  <div className="flex items-center gap-2 text-[#00B4A6] dark:text-[#00D2C4] font-bold text-xs">
                    <Key className="w-4 h-4" />
                    <span>SHA-256 Submission Hashes</span>
                  </div>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                    Guarantees proof of delivery with unforgeable client-side cryptographic receipts stamped with ISO timestamps.
                  </p>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#0F2044] dark:text-white mt-4">Granular Role-Based Access Control (RBAC)</h3>
              <p>
                The platform enforces strict separation between student submissions and evaluation layers. Students can inspect only their individual grading scores, personal attendance tallies, and class broadcasts, while CRs manage aggregate compliance.
              </p>
            </div>
          )}

          {/* 4. Live Status Page */}
          {activeTrustPage === 'status' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-[#E6F8F6] dark:bg-[#00D2C4]/10 border border-[#00B4A6]/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-[#00B4A6] dark:bg-[#00D2C4] animate-ping" />
                  <div>
                    <h4 className="font-bold text-xs text-[#00897B] dark:text-[#00D2C4]">All Systems Fully Operational</h4>
                    <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">99.98% Uptime recorded across the last 90 academic days</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-white dark:bg-[#080D1A] text-[10px] font-mono font-bold text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/30">
                  status.studysync.app
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/30">
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">WebSocket Push Relay</div>
                  <div className="text-base font-bold text-[#0F2044] dark:text-white mt-1">18ms Latency</div>
                  <div className="text-[10px] text-[#00B4A6] dark:text-[#00D2C4] mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Operational
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/30">
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Submission Proof Engine</div>
                  <div className="text-base font-bold text-[#0F2044] dark:text-white mt-1">100% Verified</div>
                  <div className="text-[10px] text-[#00B4A6] dark:text-[#00D2C4] mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Operational
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/30">
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">Email & Notification Bridge</div>
                  <div className="text-base font-bold text-[#0F2044] dark:text-white mt-1">99.99% Delivered</div>
                  <div className="text-[10px] text-[#00B4A6] dark:text-[#00D2C4] mt-1 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Operational
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-xs text-[#0F2044] dark:text-white mt-4">Recent Incident Ledger</h4>
              <div className="p-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#64748B] dark:text-[#94A3B8]">
                No outages or service degradation reported in the past 30 days. All cluster endpoints running normally.
              </div>
            </div>
          )}

          {/* 5. About Page */}
          {activeTrustPage === 'about' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] flex items-center justify-center font-extrabold text-sm">
                  SS
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#0F2044] dark:text-white">The StudySync Mission</h3>
                  <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Built by engineering students to end academic WhatsApp chaos</p>
                </div>
              </div>

              <p>
                Every semester, college classes run on chaotic, unsearchable WhatsApp group chats where critical assignment deadlines get buried under 400 casual messages, attendance disputes occur weekly, and CRs waste hours chasing submissions.
              </p>

              <p>
                <strong>StudySync was designed with one rule:</strong> Give CRs and students a precision coordination tool inspired by Linear and Notion. One 6-character class code connects the entire cohort with instant submission tracking, attendance logging, and tamper-proof verification.
              </p>

              <div className="p-4 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/30 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-[#0F2044] dark:text-white">Institutional Support & Inquiries</div>
                  <div className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">contact@studysync.app • Academic Governance Office</div>
                </div>
                <GraduationCap className="w-6 h-6 text-[#00B4A6] dark:text-[#00D2C4]" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/40 flex items-center justify-between text-xs text-[#64748B] dark:text-[#94A3B8]">
          <span>Protected by SHA-256 Cryptographic Audit Ledger</span>
          <button
            onClick={() => setActiveTrustPage(null)}
            className="px-4 py-1.5 rounded-lg bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] font-bold text-xs hover:opacity-90 transition-opacity"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
