import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { ResourceCategory, ResourceItem } from '../../types';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  BookOpen, 
  FileCode, 
  Layers, 
  Upload,
  CheckCircle2,
  X,
  Sparkles
} from 'lucide-react';
import { generateResourceStudyAids, FormattedSummary } from '../../utils/resourceFormatter';

export const ResourceLibraryView: React.FC = () => {
  const { 
    currentUser, 
    currentClass, 
    resources, 
    uploadResource, 
    deleteResource, 
    incrementResourceDownload 
  } = useStudySync();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [activeStudyAid, setActiveStudyAid] = useState<{ item: ResourceItem; guide: FormattedSummary } | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState(currentClass.subjects[0] || 'Fluid Mechanics');
  const [category, setCategory] = useState<ResourceCategory>('notes');
  const [description, setDescription] = useState('');
  const [fileName, setFileName] = useState('');

  const categories: { id: ResourceCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Resources' },
    { id: 'pyq', label: 'Solved PYQs' },
    { id: 'notes', label: 'Lecture Notes' },
    { id: 'formula', label: 'Formula & Steam Tables' },
    { id: 'lab', label: 'Lab Manuals' },
    { id: 'syllabus', label: 'Syllabus & Blueprint' }
  ];

  const filteredResources = resources.filter(res => {
    const matchesSub = selectedSubject === 'ALL' || res.subject === selectedSubject;
    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesCat && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    uploadResource({
      title: title.trim(),
      subject,
      category,
      description: description.trim() || 'Shared course study reference',
      fileName: fileName.trim() || `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: `${(Math.random() * 8 + 1.2).toFixed(1)} MB`
    });

    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
    setFileName('');
  };

  const getCategoryBadge = (cat: ResourceCategory) => {
    switch (cat) {
      case 'pyq':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF6EC] dark:bg-[#F59E0B]/15 text-[#D97706] dark:text-[#FBBF24]">PYQ Exam Paper</span>;
      case 'notes':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4]">Lecture Notes</span>;
      case 'formula':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EEF2FF] dark:bg-[#6366F1]/15 text-[#4F46E5] dark:text-[#818CF8]">Reference Sheet</span>;
      case 'lab':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8]">Lab Guide</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F1F5F9] dark:bg-[#1E293B] text-[#475569] dark:text-[#94A3B8]">Document</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-[#0F2044] dark:text-white tracking-tight">
              Class Resource Library
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] border border-[#00B4A6]/20">
              {resources.length} Shared Files
            </span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Centralized academic repository for {currentClass.name}. Solved question papers, handwritten lecture notes, and formula sheets.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00B4A6] hover:bg-[#009E91] dark:bg-[#00D2C4] dark:hover:bg-[#00B4A6] text-white dark:text-[#09132B] text-xs font-bold transition-all shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Study Material</span>
        </button>
      </div>

      {/* Filters & Search Row */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] font-bold'
                    : 'bg-white dark:bg-[#15203B] text-[#64748B] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E293B]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers, notes, topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
            />
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold text-[#64748B] dark:text-[#94A3B8] mr-1">Subject:</span>
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedSubject === 'ALL'
                ? 'bg-[#00B4A6]/15 dark:bg-[#00D2C4]/20 text-[#00897B] dark:text-[#00D2C4] font-bold'
                : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#15203B]'
            }`}
          >
            All
          </button>
          {currentClass.subjects.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
                selectedSubject === s
                  ? 'bg-[#00B4A6]/15 dark:bg-[#00D2C4]/20 text-[#00897B] dark:text-[#00D2C4] font-bold'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#15203B]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredResources.length === 0 ? (
          <div className="col-span-full py-16 text-center text-xs text-[#64748B] dark:text-[#94A3B8] bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B]">
            No study materials found matching your filters. Click "Upload Study Material" to share notes with your class.
          </div>
        ) : (
          filteredResources.map(res => (
            <div
              key={res.id}
              className="p-4 rounded-2xl bg-white dark:bg-[#0F172A] border border-[#E2E8F0] dark:border-[#1E293B] shadow-xs flex flex-col justify-between hover:border-[#00B4A6]/40 dark:hover:border-[#00D2C4]/40 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  {getCategoryBadge(res.category)}
                  <span className="text-[10px] font-mono text-[#64748B] dark:text-[#94A3B8]">
                    {res.fileSize}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-[#0F2044] dark:text-white line-clamp-2 group-hover:text-[#00B4A6] dark:group-hover:text-[#00D2C4] transition-colors">
                  {res.title}
                </h3>

                <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1.5 line-clamp-2">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                <div className="truncate pr-2">
                  <span className="font-semibold text-[#0F2044] dark:text-white block truncate">
                    {res.subject}
                  </span>
                  <span className="text-[10px] text-[#94A3B8] block truncate">
                    By {res.uploadedByName}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      const guide = generateResourceStudyAids(res.title, res.description, res.subject);
                      setActiveStudyAid({ item: res, guide });
                    }}
                    className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-600 hover:text-white transition-colors"
                    title="Generate AI Key Takeaways & Exam Review Prompts"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => incrementResourceDownload(res.id)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E6F8F6] dark:bg-[#00D2C4]/15 text-[#00897B] dark:text-[#00D2C4] font-bold text-xs hover:bg-[#00B4A6] hover:text-white dark:hover:bg-[#00D2C4] dark:hover:text-[#09132B] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{res.downloadsCount}</span>
                  </button>

                  {(currentUser.role === 'CR' || currentUser.id === res.uploadedBy) && (
                    <button
                      onClick={() => deleteResource(res.id)}
                      className="p-1 rounded-lg text-[#94A3B8] hover:text-[#DC2626] hover:bg-[#FEF2F2] dark:hover:bg-[#EF4444]/10 transition-colors"
                      title="Delete resource (Undoable)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#0F172A] rounded-2xl border border-[#E2E8F0] dark:border-[#1E293B] shadow-2xl overflow-hidden">
            <form onSubmit={handleUploadSubmit}>
              <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-[#0F2044] dark:text-white">
                  Upload Study Material
                </h3>
                <span className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                  Available to entire cohort
                </span>
              </div>

              <div className="p-6 space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. End-Sem 2024 Solved Thermodynamics PYQ"
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                      Subject *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                    >
                      {currentClass.subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                    >
                      <option value="pyq">Solved PYQ Paper</option>
                      <option value="notes">Lecture Notes</option>
                      <option value="formula">Formula Sheet / Tables</option>
                      <option value="lab">Lab Manual</option>
                      <option value="syllabus">Syllabus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                    Description & Topic Coverage
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what chapters or solutions are included..."
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#15203B] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#0F2044] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-1 focus:ring-[#00B4A6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#475569] dark:text-[#94A3B8] mb-1">
                    File Attachment
                  </label>
                  <div className="border-2 border-dashed border-[#CBD5E1] dark:border-[#334155] rounded-xl p-4 text-center bg-[#F8FAFC]/50 dark:bg-[#15203B]/20">
                    <Upload className="w-5 h-5 mx-auto text-[#00B4A6] dark:text-[#00D2C4] mb-1" />
                    <p className="text-xs text-[#0F2044] dark:text-white font-semibold">
                      Drag and drop PDF/DOCX or click to browse
                    </p>
                    <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-0.5">
                      Max file size: 25 MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#E2E8F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/40 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-medium text-[#475569] dark:text-[#94A3B8]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#00B4A6] hover:bg-[#009E91] dark:bg-[#00D2C4] dark:hover:bg-[#00B4A6] text-white dark:text-[#09132B] text-xs font-bold shadow-xs transition-colors"
                >
                  Publish Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Study Guide Modal */}
      {activeStudyAid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white">
                    AI Study Guide: {activeStudyAid.item.subject}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Est. {activeStudyAid.guide.estimatedReadMinutes} min review • {activeStudyAid.item.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudyAid(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                  Key Conceptual Takeaways
                </h4>
                <ul className="space-y-2">
                  {activeStudyAid.guide.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2">
                  Suggested Exam Review Prompts
                </h4>
                <ul className="space-y-2">
                  {activeStudyAid.guide.suggestedReviewQuestions.map((q, idx) => (
                    <li key={idx} className="text-xs text-slate-300 bg-slate-800/40 p-2.5 rounded-lg border border-slate-800">
                      <strong>Q{idx + 1}:</strong> {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-slate-800 bg-slate-900/60 flex justify-end">
              <button
                onClick={() => setActiveStudyAid(null)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
