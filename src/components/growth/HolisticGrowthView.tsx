import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { HolisticActivity, HolisticCategory } from '../../types';
import { 
  Award, 
  Rocket, 
  Users, 
  BookOpen, 
  HeartHandshake, 
  Trophy, 
  Plus, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ExternalLink, 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  X,
  FileCheck,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Modal } from '../common/Feedback';

const CATEGORY_CONFIG: Record<HolisticCategory, { label: string; icon: any; color: string; bg: string; border: string }> = {
  hackathon: {
    label: 'Hackathons & Tech',
    icon: Rocket,
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/20'
  },
  leadership: {
    label: 'Leadership & Clubs',
    icon: Users,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/20'
  },
  certification: {
    label: 'Certifications',
    icon: Award,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/20'
  },
  social_impact: {
    label: 'Social Impact & NSS',
    icon: HeartHandshake,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20'
  },
  sports_cultural: {
    label: 'Sports & Cultural',
    icon: Trophy,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/20'
  },
  research: {
    label: 'Research & Papers',
    icon: BookOpen,
    color: 'text-cyan-600 dark:text-cyan-400',
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/20'
  }
};

export const HolisticGrowthView: React.FC = () => {
  const { 
    currentUser, 
    allUsers, 
    holisticActivities, 
    logHolisticActivity, 
    reviewHolisticActivity, 
    showToast 
  } = useStudySync();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending_approval' | 'approved' | 'rejected'>('all');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedReviewActivity, setSelectedReviewActivity] = useState<HolisticActivity | null>(null);
  const [reviewPoints, setReviewPoints] = useState<number>(15);
  const [reviewRemarks, setReviewRemarks] = useState('');

  // Form State for new activity
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<HolisticCategory>('hackathon');
  const [newOrg, setNewOrg] = useState('');
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDesc, setNewDesc] = useState('');
  const [newProofUrl, setNewProofUrl] = useState('');
  const [newEstimatedPoints, setNewEstimatedPoints] = useState<number>(15);

  // Student specific points
  const myActivities = holisticActivities.filter(a => a.studentId === currentUser.id);
  const myApprovedPoints = myActivities
    .filter(a => a.status === 'approved')
    .reduce((sum, a) => sum + (a.points || 0), 0);

  const pendingApprovalsCount = holisticActivities.filter(a => a.status === 'pending_approval').length;

  const handleSubmitActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrg.trim()) {
      showToast('Please enter an activity title and organization', 'error');
      return;
    }

    logHolisticActivity({
      studentId: currentUser.id,
      studentName: currentUser.name,
      studentRollNo: currentUser.rollNo || '23ME000',
      title: newTitle.trim(),
      category: newCategory,
      organizationOrEvent: newOrg.trim(),
      date: newDate,
      description: newDesc.trim(),
      proofUrl: newProofUrl.trim() || 'https://drive.google.com/cert/verified-proof-doc.pdf',
      points: Number(newEstimatedPoints) || 10
    });

    setIsSubmitModalOpen(false);
    setNewTitle('');
    setNewOrg('');
    setNewDesc('');
    setNewProofUrl('');
  };

  const handleApprove = (activity: HolisticActivity) => {
    reviewHolisticActivity(
      activity.id, 
      'approved', 
      reviewPoints || activity.points, 
      reviewRemarks.trim() || 'Accreditation verified. Outstanding contribution!'
    );
    setSelectedReviewActivity(null);
    setReviewRemarks('');
  };

  const handleReject = (activity: HolisticActivity) => {
    reviewHolisticActivity(
      activity.id, 
      'rejected', 
      0, 
      reviewRemarks.trim() || 'Proof document insufficient or event not recognized by AICTE list.'
    );
    setSelectedReviewActivity(null);
    setReviewRemarks('');
  };

  // Filtered Activities
  const filteredActivities = holisticActivities.filter(act => {
    if (activeCategory !== 'all' && act.category !== activeCategory) return false;
    if (statusFilter !== 'all' && act.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchStudent = act.studentName.toLowerCase().includes(q);
      const matchRoll = act.studentRollNo.toLowerCase().includes(q);
      const matchOrg = act.organizationOrEvent.toLowerCase().includes(q);
      if (!matchTitle && !matchStudent && !matchRoll && !matchOrg) return false;
    }
    return true;
  });

  // Leaderboard: Top students sorted by approved holistic points
  const studentUsers = allUsers.filter(u => u.role === 'Student');
  const studentPointsMap = studentUsers.map(u => {
    const studentActs = holisticActivities.filter(a => a.studentId === u.id && a.status === 'approved');
    const pts = studentActs.reduce((acc, a) => acc + (a.points || 0), 0) + (u.holisticPoints || 0);
    return {
      user: u,
      points: pts,
      activitiesCount: studentActs.length
    };
  }).sort((a, b) => b.points - a.points);

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DBDBDB] dark:border-[#262626] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-black dark:text-white">
              Beyond Academics & Holistic Growth
            </h1>
          </div>
          <p className="text-xs text-[#8E8E8E] mt-1">
            NEP 2020 & AICTE 100 Activity Points Portfolio, Hackathons, Club Leadership & Certifications
          </p>
        </div>

        <div className="flex items-center gap-2">
          {currentUser.role === 'Student' && (
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-4 py-2 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Log Non-Academic Achievement</span>
            </button>
          )}

          {currentUser.role === 'Faculty' && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Faculty Accreditation Portal: {pendingApprovalsCount} Pending</span>
            </div>
          )}
        </div>
      </div>

      {/* OVERVIEW BANNERS */}
      {currentUser.role === 'Student' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* AICTE 100 Points Progress Card */}
          <div className="md:col-span-2 p-5 rounded-2xl bg-gradient-to-br from-purple-500/10 via-blue-500/5 to-transparent border border-purple-500/20 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  AICTE Activity Points Degree Requirement
                </span>
                <h3 className="text-2xl font-black text-black dark:text-white mt-1">
                  {myApprovedPoints + (currentUser.holisticPoints || 0)} <span className="text-sm font-medium text-[#8E8E8E]">/ 100 Target Points</span>
                </h3>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  (myApprovedPoints + (currentUser.holisticPoints || 0)) >= 75
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                }`}>
                  {(myApprovedPoints + (currentUser.holisticPoints || 0)) >= 75 ? 'Honours Eligible' : 'In Progress'}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-[#8E8E8E]">
                <span>Progress toward B.Tech Honours Degree</span>
                <span className="font-semibold text-black dark:text-white">
                  {Math.min(100, Math.round(((myApprovedPoints + (currentUser.holisticPoints || 0)) / 100) * 100))}%
                </span>
              </div>
              <div className="w-full bg-[#EFEFEF] dark:bg-[#262626] h-3 rounded-full overflow-hidden p-0.5 border border-[#DBDBDB] dark:border-[#363636]">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-[#0095F6] h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, Math.round(((myApprovedPoints + (currentUser.holisticPoints || 0)) / 100) * 100))}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-[#8E8E8E] pt-2 border-t border-purple-500/10">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span>{myActivities.filter(a => a.status === 'approved').length} Accredited</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{myActivities.filter(a => a.status === 'pending_approval').length} Under Faculty Review</span>
              </div>
            </div>
          </div>

          {/* Quick Submission CTA Card */}
          <div className="p-5 rounded-2xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] flex flex-col justify-between">
            <div>
              <span className="text-xs font-semibold text-black dark:text-white block">
                Have a new Certificate or Win?
              </span>
              <p className="text-xs text-[#8E8E8E] mt-1 leading-relaxed">
                Submit certificates from SIH hackathons, NPTEL/Coursera certifications, IEEE club leadership, or NSS social drives to earn certified credits.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="w-full mt-4 py-2 px-3 rounded-lg bg-black hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4 text-[#0095F6]" />
              <span>Submit Proof for Accreditation</span>
            </button>
          </div>
        </div>
      ) : (
        /* CR & FACULTY INCHARGE SUMMARY CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#8E8E8E]">Total Student Submissions</p>
                <h4 className="text-xl font-bold text-black dark:text-white">{holisticActivities.length}</h4>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#8E8E8E]">Pending Accreditation</p>
                <h4 className="text-xl font-bold text-amber-600 dark:text-amber-400">{pendingApprovalsCount}</h4>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626]">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-[#8E8E8E]">Approved Activity Points</p>
                <h4 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                  {holisticActivities.filter(a => a.status === 'approved').reduce((acc, a) => acc + (a.points || 0), 0)} pts
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY FILTER PILLS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors ${
            activeCategory === 'all'
              ? 'bg-[#0095F6] text-white'
              : 'bg-[#EFEFEF] dark:bg-[#262626] text-[#8E8E8E] hover:text-black dark:hover:text-white'
          }`}
        >
          All Domains ({holisticActivities.length})
        </button>
        {(Object.keys(CATEGORY_CONFIG) as HolisticCategory[]).map(catKey => {
          const cfg = CATEGORY_CONFIG[catKey];
          const Icon = cfg.icon;
          const count = holisticActivities.filter(a => a.category === catKey).length;
          return (
            <button
              key={catKey}
              onClick={() => setActiveCategory(catKey)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 ${
                activeCategory === catKey
                  ? 'bg-black dark:bg-white text-white dark:text-black'
                  : 'bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-[#8E8E8E] hover:text-black dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cfg.label}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT: 2 COLUMNS (ACTIVITIES STREAM + COHORT LEADERBOARD) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT 2 COLUMNS: ACTIVITY FEED */}
        <div className="lg:col-span-2 space-y-4">
          {/* Filter / Search Bar */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E8E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search activities, students, roll numbers or events..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Accredited (Approved)</option>
                <option value="pending_approval">Pending Faculty Review</option>
                <option value="rejected">Rejected / Revisions</option>
              </select>
            </div>
          </div>

          {/* Activity Cards List */}
          {filteredActivities.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] text-center space-y-2">
              <Award className="w-8 h-8 text-[#8E8E8E] mx-auto" />
              <p className="text-xs font-semibold text-black dark:text-white">No holistic activities found</p>
              <p className="text-[11px] text-[#8E8E8E]">Try adjusting your search query or filter tags.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map(activity => {
                const cfg = CATEGORY_CONFIG[activity.category] || CATEGORY_CONFIG.hackathon;
                const CatIcon = cfg.icon;

                return (
                  <div
                    key={activity.id}
                    className="p-4 rounded-xl bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] hover:border-[#0095F6]/50 transition-all space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${cfg.bg} ${cfg.color} shrink-0`}>
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                              {cfg.label}
                            </span>
                            <span className="text-[10px] text-[#8E8E8E]">
                              {activity.date}
                            </span>
                          </div>

                          <h3 className="font-bold text-sm text-black dark:text-white mt-1">
                            {activity.title}
                          </h3>

                          <div className="flex items-center gap-2 text-xs text-[#8E8E8E] mt-0.5">
                            <span className="font-medium text-black dark:text-white">
                              {activity.studentName}
                            </span>
                            <span className="font-mono text-[11px]">({activity.studentRollNo})</span>
                            <span>•</span>
                            <span>{activity.organizationOrEvent}</span>
                          </div>
                        </div>
                      </div>

                      {/* Status & Points Badge */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 font-bold text-sm text-purple-600 dark:text-purple-400 justify-end">
                          <span>+{activity.points} pts</span>
                        </div>
                        {activity.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1">
                            <CheckCircle2 className="w-3 h-3" /> Accredited
                          </span>
                        )}
                        {activity.status === 'pending_approval' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full mt-1">
                            <Clock className="w-3 h-3" /> Under Review
                          </span>
                        )}
                        {activity.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-600 dark:text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full mt-1">
                            <XCircle className="w-3 h-3" /> Rejected
                          </span>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-[#737373] dark:text-[#A8A8A8] leading-relaxed">
                      {activity.description}
                    </p>

                    {/* Proof Link & Faculty Remarks */}
                    <div className="pt-2 border-t border-[#DBDBDB]/50 dark:border-[#262626]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      {activity.proofUrl ? (
                        <a
                          href={activity.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#0095F6] hover:underline flex items-center gap-1 font-medium"
                        >
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>View Verified Proof / Certificate</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-[#8E8E8E] text-[11px]">No proof attachment URL</span>
                      )}

                      {activity.facultyRemarks && (
                        <div className="text-[11px] text-[#8E8E8E] italic bg-[#FAFAFA] dark:bg-[#181818] px-2 py-1 rounded">
                          " {activity.facultyRemarks} "
                        </div>
                      )}
                    </div>

                    {/* Faculty Incharge Review Actions */}
                    {currentUser.role === 'Faculty' && (
                      <div className="pt-2 border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-end gap-2">
                        {activity.status === 'pending_approval' ? (
                          <button
                            onClick={() => {
                              setSelectedReviewActivity(activity);
                              setReviewPoints(activity.points);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Accredit / Review Submission</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedReviewActivity(activity);
                              setReviewPoints(activity.points);
                            }}
                            className="px-2.5 py-1 rounded text-xs text-[#8E8E8E] hover:text-black dark:hover:text-white"
                          >
                            Edit Accreditation
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: COHORT WALL OF FAME / TOP ACHIEVERS */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-xs text-black dark:text-white uppercase tracking-wider">
                  Cohort Wall of Fame
                </h3>
              </div>
              <span className="text-[10px] text-[#8E8E8E]">
                Top Holistic Achievers
              </span>
            </div>

            <div className="space-y-2">
              {studentPointsMap.slice(0, 10).map((item, idx) => (
                <div
                  key={item.user.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      idx === 0
                        ? 'bg-amber-500 text-white shadow-xs'
                        : idx === 1
                        ? 'bg-slate-400 text-white'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-[#EFEFEF] dark:bg-[#262626] text-[#8E8E8E]'
                    }`}>
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="font-semibold text-black dark:text-white truncate">
                        {item.user.name}
                      </p>
                      <p className="text-[10px] text-[#8E8E8E] font-mono">
                        {item.user.rollNo}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-xs text-purple-600 dark:text-purple-400">
                      {item.points} pts
                    </span>
                    <span className="block text-[9px] text-[#8E8E8E]">
                      {item.activitiesCount} events
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AICTE Guidelines Info Box */}
          <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs space-y-2 text-[#737373] dark:text-[#A8A8A8]">
            <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
              <Award className="w-4 h-4" />
              <span>AICTE Activity Point Rules</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              Every B.Tech student admitted under AICTE / NEP framework must acquire 100 activity points prior to degree completion. Points are awarded across Hackathons (20-40 pts), Club Leadership (15-30 pts), and Community NSS (10-25 pts).
            </p>
          </div>
        </div>
      </div>

      {/* MODAL 1: SUBMIT NEW NON-ACADEMIC ACHIEVEMENT */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Log Non-Academic Achievement for Accreditation"
      >
        <form onSubmit={handleSubmitActivity} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Activity / Achievement Title
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="e.g. 1st Place - Smart India Hackathon (SIH 2026)"
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Domain / Category
              </label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as HolisticCategory)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              >
                <option value="hackathon">Hackathon & Tech Competitions</option>
                <option value="leadership">Leadership & Club Roles (IEEE/GDG)</option>
                <option value="certification">Professional Certifications</option>
                <option value="social_impact">Social Impact & NSS Community</option>
                <option value="sports_cultural">Sports & Cultural Performing Arts</option>
                <option value="research">Research Papers & Patents</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Organizing Body / Event
              </label>
              <input
                type="text"
                required
                value={newOrg}
                onChange={(e) => setNewOrg(e.target.value)}
                placeholder="e.g. Ministry of Education / IIT Madras"
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Date Completed
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Claimed Activity Points (5-40 pts)
              </label>
              <input
                type="number"
                min="5"
                max="40"
                value={newEstimatedPoints}
                onChange={(e) => setNewEstimatedPoints(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Certificate / Proof URL (Google Drive / GitHub / Credential Link)
            </label>
            <input
              type="url"
              value={newProofUrl}
              onChange={(e) => setNewProofUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/your-certificate.pdf"
              className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-black dark:text-white mb-1">
              Description of Role & Learnings
            </label>
            <textarea
              rows={3}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Outline your project scope, award level, hours spent, or responsibilities..."
              className="w-full text-xs p-3 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6] resize-none"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitModalOpen(false)}
              className="px-4 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] text-xs font-semibold text-[#8E8E8E]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0095F6] hover:bg-[#1877F2] text-white text-xs font-semibold"
            >
              Submit for Faculty Review
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL 2: FACULTY REVIEW DRAWER / MODAL */}
      {selectedReviewActivity && (
        <Modal
          isOpen={!!selectedReviewActivity}
          onClose={() => setSelectedReviewActivity(null)}
          title="Accreditation & Faculty Review"
        >
          <div className="space-y-4">
            <div className="p-3 rounded-lg bg-[#FAFAFA] dark:bg-[#181818] border border-[#DBDBDB] dark:border-[#262626] space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-black dark:text-white">
                  {selectedReviewActivity.studentName}
                </span>
                <span className="font-mono text-[#8E8E8E]">
                  {selectedReviewActivity.studentRollNo}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-black dark:text-white">
                {selectedReviewActivity.title}
              </h4>
              <p className="text-xs text-[#8E8E8E]">
                {selectedReviewActivity.organizationOrEvent} • {selectedReviewActivity.date}
              </p>
              <p className="text-xs text-black dark:text-white mt-2 leading-relaxed">
                {selectedReviewActivity.description}
              </p>
              {selectedReviewActivity.proofUrl && (
                <div className="pt-2">
                  <a
                    href={selectedReviewActivity.proofUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#0095F6] hover:underline text-xs flex items-center gap-1 font-medium"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Student Certificate Document</span>
                  </a>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Accredited AICTE Points to Award
              </label>
              <input
                type="number"
                min="0"
                max="50"
                value={reviewPoints}
                onChange={(e) => setReviewPoints(Number(e.target.value))}
                className="w-full text-xs px-3 py-2 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-black dark:text-white mb-1">
                Faculty Incharge Endorsement / Remarks
              </label>
              <textarea
                rows={2}
                value={reviewRemarks}
                onChange={(e) => setReviewRemarks(e.target.value)}
                placeholder="e.g. Verified with SIH registry. Outstanding representation of the institution."
                className="w-full text-xs p-3 rounded-lg border border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#181818] text-black dark:text-white focus:outline-none focus:border-[#0095F6] resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#DBDBDB] dark:border-[#262626]">
              <button
                type="button"
                onClick={() => handleReject(selectedReviewActivity)}
                className="px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Reject / Request Resubmission</span>
              </button>
              <button
                type="button"
                onClick={() => handleApprove(selectedReviewActivity)}
                className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Approve & Credit {reviewPoints} Points</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
