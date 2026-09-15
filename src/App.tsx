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
import { KeyboardShortcutsModal } from './components/common/KeyboardShortcutsModal';

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
import { SettingsView } from './components/settings/SettingsView';
import { LandingPage } from './components/landing/LandingPage';

const MainLayout: React.FC<{ isDarkMode: boolean; setIsDarkMode: React.Dispatch<React.SetStateAction<boolean>> }> = ({
  isDarkMode,
  setIsDarkMode
}) => {
  const { currentUser, activeTab, isRightPanelOpen, setIsRightPanelOpen } = useStudySync();
  const [showLanding, setShowLanding] = useState(false);

  if (showLanding) {
    return <LandingPage onEnterApp={() => setShowLanding(false)} />;
  }

  const renderCenterContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return currentUser.role === 'CR' ? <CRDashboard /> : <StudentDashboard />;
      case 'assignments':
        return <AssignmentsView />;
      case 'attendance':
        return <AttendanceView />;
      case 'resources':
        return <ResourceLibraryView />;
      case 'polls':
        return <PollsView />;
      case 'calendar':
        return <CalendarView />;
      case 'members':
        return currentUser.role === 'CR' ? <MembersView /> : <StudentDashboard />;
      case 'broadcasts':
        return <BroadcastsView />;
      case 'messages':
        return <MessagesView />;
      case 'analytics':
        return currentUser.role === 'CR' ? <AnalyticsView /> : <StudentDashboard />;
      case 'settings':
        return <SettingsView />;
      default:
        return currentUser.role === 'CR' ? <CRDashboard /> : <StudentDashboard />;
    }
  };

  const [showSoundscapes, setShowSoundscapes] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setShowShortcuts((prev) => !prev);
      }
      if (e.altKey && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setShowSoundscapes((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#080D1A] text-[#0F172A] dark:text-[#F8FAFC] transition-colors duration-150">
      {/* Top Bar */}
      <Header
        onOpenLanding={() => setShowLanding(true)}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Triple-Panel Architecture */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Navigation Panel */}
        <LeftPanel />

        {/* Center Main Fluid Workspace */}
        <main className="flex-1 overflow-y-auto pb-20 md:pb-6 bg-[#F8FAFC] dark:bg-[#080D1A] transition-colors duration-150">
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
      <StudySoundscapesModal isOpen={showSoundscapes} onClose={() => setShowSoundscapes(false)} />
      <AchievementsModal isOpen={showAchievements} onClose={() => setShowAchievements(false)} />
      <KeyboardShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />
      <Toast />
    </div>
  );
};

export function App() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('studysync_theme');
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
      localStorage.setItem('studysync_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('studysync_theme', 'light');
    }
  }, [isDarkMode]);

  return (
    <StudySyncProvider>
      <MainLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </StudySyncProvider>
  );
}

export default App;
