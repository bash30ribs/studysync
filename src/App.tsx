import React, { useState, useEffect } from 'react';
import { StudySyncProvider, useStudySync } from './store';
import { Header } from './components/layout/Header';
import { LeftPanel } from './components/layout/LeftPanel';
import { RightPanel } from './components/layout/RightPanel';
import { MobileNav } from './components/layout/MobileNav';
import { Toast } from './components/common/Feedback';
import { SubmitDrawer } from './components/assignments/SubmitDrawer';
import { CommandPalette } from './components/common/CommandPalette';
import { ShortcutsModal } from './components/common/ShortcutsModal';
import { QRCodeModal } from './components/common/QRCodeModal';
import { TrustPages } from './components/public/TrustPages';
import { StudySoundscapesModal } from './components/common/StudySoundscapesModal';
import { AchievementsModal } from './components/common/AchievementsModal';
import { ErrorBoundary } from './components/common/ErrorBoundary';

import { CRDashboard } from './components/dashboard/CRDashboard';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { AssignmentsView } from './components/assignments/AssignmentsView';
import { AttendanceView } from './components/attendance/AttendanceView';
import { ResourceLibraryView } from './components/resources/ResourceLibraryView';
import { PollsView } from './components/polls/PollsView';
import { CalendarView } from './components/calendar/CalendarView';
import { MembersView } from './components/members/MembersView';
import { BroadcastsView } from './components/broadcasts/BroadcastsView';
import { MessagesView } from './components/messages/MessagesView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { StudentAnalyticsView } from './components/analytics/StudentAnalyticsView';
import { SettingsView } from './components/settings/SettingsView';
import { SubjectsView } from './components/subjects/SubjectsView';
import { LandingPage } from './components/landing/LandingPage';
import { HolisticGrowthView } from './components/growth/HolisticGrowthView';
import { FacultyOversightView } from './components/faculty/FacultyOversightView';
import { RolePortalsModal } from './components/auth/RolePortalsModal';

const MainLayout: React.FC<{ isDarkMode: boolean; setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  isDarkMode,
  setIsDarkMode
}) => {
  const { currentUser, activeTab, isRightPanelOpen, setIsRightPanelOpen, setIsShortcutsOpen, goBack } = useStudySync();
  const [showLanding, setShowLanding] = useState(() => {
    // Show landing on first visit; remember if user has entered the app before
    try { return !sessionStorage.getItem('studysync_entered'); } catch { return true; }
  });

  // ALL hooks MUST be declared before any early return — React requires
  // the same number of hooks to be called on every single render.
  const [showSoundscapes, setShowSoundscapes] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showRolePortals, setShowRolePortals] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setShowSoundscapes((prev) => !prev);
      }
      if ((e.altKey && e.key === 'ArrowLeft') || (e.key === 'Backspace' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement))) {
        e.preventDefault();
        goBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsShortcutsOpen, goBack]);

  // Priority 6: Dynamic Page Titles
  useEffect(() => {
    if (showLanding) {
      document.title = 'StudySync — Precision Class Coordination';
      return;
    }
    const titles: Record<string, string> = {
      dashboard: 'Dashboard · StudySync',
      assignments: 'Assignments · StudySync',
      attendance: 'Attendance · StudySync',
      growth: 'Holistic Growth · StudySync',
      oversight: 'Faculty Oversight · StudySync',
      resources: 'Resources · StudySync',
      polls: 'Polls · StudySync',
      calendar: 'Calendar · StudySync',
      members: 'Class Roster · StudySync',
      subjects: 'Subjects · StudySync',
      broadcasts: 'Broadcasts · StudySync',
      messages: 'Messages · StudySync',
      analytics: 'Analytics · StudySync',
      settings: 'Settings · StudySync'
    };
    document.title = titles[activeTab] || 'StudySync — Precision Class Coordination';
  }, [activeTab, showLanding]);

  // Early return for landing page — AFTER all hooks are declared
  if (showLanding) {
    return <LandingPage onEnterApp={() => {
      try { sessionStorage.setItem('studysync_entered', '1'); } catch {}
      if (typeof window !== 'undefined' && window.location) {
        window.location.href = '/workspace.html';
      }
      setShowLanding(false);
    }} />;
  }

  const userRole = currentUser?.role || 'CR';

  const renderCenterContent = () => {
    let content: React.ReactNode;
    switch (activeTab) {
      case 'dashboard':
        content = (userRole === 'CR' || userRole === 'Faculty') ? <CRDashboard /> : <StudentDashboard />;
        break;
      case 'assignments':
        content = <AssignmentsView />;
        break;
      case 'attendance':
        content = <AttendanceView />;
        break;
      case 'growth':
        content = <HolisticGrowthView />;
        break;
      case 'oversight':
        content = <FacultyOversightView />;
        break;
      case 'resources':
        content = <ResourceLibraryView />;
        break;
      case 'polls':
        content = <PollsView />;
        break;
      case 'calendar':
        content = <CalendarView />;
        break;
      case 'members':
        content = (userRole === 'CR' || userRole === 'Faculty') ? <MembersView /> : <StudentDashboard />;
        break;
      case 'subjects':
        content = <SubjectsView />;
        break;
      case 'broadcasts':
        content = <BroadcastsView />;
        break;
      case 'messages':
        content = <MessagesView />;
        break;
      case 'analytics':
        content = (userRole === 'CR' || userRole === 'Faculty') ? <AnalyticsView /> : <StudentAnalyticsView />;
        break;
      case 'settings':
        content = <SettingsView />;
        break;
      default:
        content = (userRole === 'CR' || userRole === 'Faculty') ? <CRDashboard /> : <StudentDashboard />;
    }

    return (
      <div key={activeTab} className="page-enter w-full max-w-7xl mx-auto">
        {content}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#fafafa] dark:bg-black text-[#000000] dark:text-[#F5F5F5] transition-colors duration-150">
      {/* Top Bar */}
      <Header
        onOpenLanding={() => {
          try { sessionStorage.removeItem('studysync_entered'); } catch {}
          setShowLanding(true);
        }}
        onOpenSoundscapes={() => setShowSoundscapes(true)}
        onOpenAchievements={() => setShowAchievements(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenRolePortals={() => setShowRolePortals(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Triple-Panel Architecture */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Panel */}
        <LeftPanel />

        {/* Center Main Fluid Workspace */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 bg-[#fafafa] dark:bg-black transition-colors duration-150">
          {renderCenterContent()}
        </main>

        {/* Right Context Detail Panel (Slide-over on mobile/tablet, pinned on desktop) */}
        <RightPanel />

        {/* Mobile Backdrop for Right Panel Drawer */}
        {isRightPanelOpen && (
          <div
            onClick={() => setIsRightPanelOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 lg:hidden"
            aria-hidden="true"
          />
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Global Drawers, Palettes & Modals */}
      <SubmitDrawer />
      <CommandPalette />
      <ShortcutsModal />
      <QRCodeModal />
      <TrustPages />
      <RolePortalsModal isOpen={showRolePortals} onClose={() => setShowRolePortals(false)} />
      <StudySoundscapesModal isOpen={showSoundscapes} onClose={() => setShowSoundscapes(false)} />
      <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} />
      <Toast />
    </div>
  );
};

export function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('studysync-theme') || localStorage.getItem('studysync_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      try {
        localStorage.setItem('studysync-theme', 'dark');
        localStorage.setItem('studysync_theme', 'dark');
      } catch {}
    } else {
      root.classList.remove('dark');
      try {
        localStorage.setItem('studysync-theme', 'light');
        localStorage.setItem('studysync_theme', 'light');
      } catch {}
    }
  }, [isDarkMode]);

  return (
    <ErrorBoundary>
      <StudySyncProvider>
        <MainLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      </StudySyncProvider>
    </ErrorBoundary>
  );
}

export default App;
