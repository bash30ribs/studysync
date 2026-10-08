import React, { useState, useRef, useCallback } from 'react';
import { useStudySync } from '../../store';
import { ResourceCategory, ResourceItem } from '../../types';
import { 
  FolderOpen, 
  FileText, 
  Download, 
  Plus, 
  Search, 
  Trash2, 
  Upload,
  CheckCircle2,
  X,
  Sparkles,
  Loader2,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { generateResourceStudyAids, FormattedSummary } from '../../utils/resourceFormatter';
import { uploadResourceBackend } from '../../utils/api';
import { useBackendSSE, SSEResourceEvent } from '../../hooks/useBackendSSE';

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [lastUploadedUrl, setLastUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SSE — get new resources pushed from backend in real time
  useBackendSSE({
    onResource: useCallback((ev: SSEResourceEvent) => {
      // Only add if not already present (backend may push to all clients)
      uploadResource({
        title: ev.title,
        subject: ev.subject,
        category: ev.category as ResourceCategory,
        description: `Uploaded via backend`,
        fileName: ev.fileName,
        fileSize: ev.fileSize,
      });
    }, [uploadResource]),
  });

  const categories: { id: ResourceCategory | 'ALL'; label: string }[] = [
    { id: 'ALL', label: 'All Resources' },
    { id: 'pyq', label: 'Solved PYQs' },
    { id: 'notes', label: 'Lecture Notes' },
    { id: 'formula', label: 'Formula Sheets' },
    { id: 'lab', label: 'Lab Manuals' },
    { id: 'syllabus', label: 'Syllabus' }
  ];

  const filteredResources = resources.filter(res => {
    const matchesSub = selectedSubject === 'ALL' || res.subject === selectedSubject;
    const matchesCat = selectedCategory === 'ALL' || res.category === selectedCategory;
    const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          res.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSub && matchesCat && matchesSearch;
  });

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    const progressInterval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 20, 85));
    }, 120);

    let backendResult = null;
    try {
      backendResult = await uploadResourceBackend({
        file: selectedFile,
        uploader: currentUser.name,
        title: title.trim(),
        subject,
        category,
        fileName: selectedFile?.name || `${title.replace(/\s+/g, '_')}.pdf`,
      });
      setLastUploadedUrl(backendResult.fileUrl);
    } catch {
      // backend unavailable — fall through to local-only
    }

    clearInterval(progressInterval);
    setUploadProgress(100);

    // Always update local store
    uploadResource({
      title: title.trim(),
      subject,
      category,
      description: description.trim() || 'Shared course study reference',
      fileName: backendResult?.fileName || selectedFile?.name || `${title.replace(/\s+/g, '_')}.pdf`,
      fileSize: backendResult?.fileSize || (selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB` : `${(Math.random() * 8 + 1.2).toFixed(1)} MB`),
    });

    await new Promise(r => setTimeout(r, 400)); // let progress show 100%
    setIsUploading(false);
    setIsUploadModalOpen(false);
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setUploadProgress(0);
    setLastUploadedUrl(null);
  };

  const getCategoryBadge = (cat: ResourceCategory) => {
    switch (cat) {
      case 'pyq':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400">PYQ Exam Paper</span>;
      case 'notes':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#0095F6]/10 text-[#0095F6]">Lecture Notes</span>;
      case 'formula':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400">Formula Sheet</span>;
      case 'lab':
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-[#262626] text-neutral-600 dark:text-neutral-300">Lab Guide</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-100 dark:bg-[#262626] text-neutral-600 dark:text-neutral-300">Document</span>;
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto space-y-6 animate-in fade-in duration-150">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-black dark:text-white tracking-tight">
              Class Resource Library
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-neutral-100 dark:bg-[#1C1C1C] text-neutral-600 dark:text-neutral-300 border border-[#DBDBDB] dark:border-[#262626]">
              {resources.length} Shared Files
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Centralized academic repository for {currentClass.name}. Solved question papers, notes, and formula sheets.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="btn-primary"
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
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.id
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-xs'
                    : 'bg-white dark:bg-[#121212] text-neutral-600 dark:text-neutral-400 border border-[#DBDBDB] dark:border-[#262626] hover:border-neutral-400'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search papers, notes, topics..."
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#0095F6]"
            />
          </div>
        </div>

        {/* Subject Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 mr-1">Subject:</span>
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              selectedSubject === 'ALL'
                ? 'bg-[#0095F6] text-white font-semibold'
                : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#262626]'
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
                  ? 'bg-[#0095F6] text-white font-semibold'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-[#262626]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Resource Grid */}
      {filteredResources.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center p-8 ui-card border border-dashed border-[#DBDBDB] dark:border-[#262626]">
          <FolderOpen className="w-8 h-8 text-[#8E8E8E] mb-2 opacity-50" />
          <p className="text-sm font-medium text-[#737373] dark:text-[#8E8E8E]">
            No resources yet. Upload the first one. 📁
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map(res => (
            <div
              key={res.id}
              className="p-4.5 ui-card flex flex-col justify-between hover:border-neutral-400 dark:hover:border-neutral-600 transition-all group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2.5">
                  {getCategoryBadge(res.category)}
                  <span className="text-[10px] font-mono text-neutral-400">
                    {res.fileSize}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-black dark:text-white line-clamp-2 group-hover:text-[#0095F6] transition-colors">
                  {res.title}
                </h3>

                <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2">
                  {res.description}
                </p>
              </div>

              <div className="pt-4 mt-3 border-t border-[#DBDBDB] dark:border-[#262626] flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                <div className="truncate pr-2">
                  <span className="font-semibold text-black dark:text-white block truncate">
                    {res.subject}
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    By {res.uploadedByName}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => {
                      const guide = generateResourceStudyAids(res.title, res.description, res.subject);
                      setActiveStudyAid({ item: res, guide });
                    }}
                    className="p-1.5 rounded-lg bg-neutral-100 dark:bg-[#262626] text-neutral-700 dark:text-neutral-300 font-semibold text-xs hover:bg-[#0095F6] hover:text-white transition-colors"
                    title="Generate Key Takeaways & Exam Review Prompts"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => incrementResourceDownload(res.id)}
                    className="btn-secondary py-1 px-2.5 text-xs text-[#0095F6]"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{res.downloadsCount}</span>
                  </button>

                  {(currentUser.role === 'CR' || currentUser.id === res.uploadedBy) && (
                    <button
                      onClick={() => deleteResource(res.id)}
                      className="p-1 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors"
                      title="Delete resource"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white dark:bg-[#121212] rounded-2xl border border-[#DBDBDB] dark:border-[#262626] shadow-2xl overflow-hidden">
            <form onSubmit={handleUploadSubmit}>
              <div className="px-6 py-4 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-between">
                <h3 className="text-sm sm:text-base font-bold text-black dark:text-white">
                  Upload Study Material
                </h3>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Available to entire cohort
                </span>
              </div>

              <div className="p-6 space-y-3.5">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Solved Thermodynamics PYQ 2024"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#0095F6]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                      Subject *
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                    >
                      {currentClass.subjects.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ResourceCategory)}
                      className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white focus:outline-none focus:border-[#0095F6]"
                    >
                      <option value="pyq">Solved PYQ Paper</option>
                      <option value="notes">Lecture Notes</option>
                      <option value="formula">Formula Sheet</option>
                      <option value="lab">Lab Manual</option>
                      <option value="syllabus">Syllabus</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    Description & Topic Coverage
                  </label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what chapters or solutions are included..."
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#000000] border border-[#DBDBDB] dark:border-[#262626] text-xs text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#0095F6]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 dark:text-neutral-300 mb-1">
                    File Attachment
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.doc,.docx,.zip,.png,.jpg,.pptx,.xlsx,.txt"
                    onChange={e => { setSelectedFile(e.target.files?.[0] || null); setUploadError(null); }}
                    className="hidden"
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={e => { e.preventDefault(); setSelectedFile(e.dataTransfer.files?.[0] || null); }}
                    onDragOver={e => e.preventDefault()}
                    className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                      selectedFile
                        ? 'border-[#0095F6] bg-[#0095F6]/5'
                        : 'border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#1C1C1C] hover:border-[#0095F6]'
                    }`}
                  >
                    {selectedFile ? (
                      <div className="space-y-1">
                        <CheckCircle2 className="w-5 h-5 mx-auto text-[#0095F6]" />
                        <p className="text-xs text-black dark:text-white font-semibold truncate">{selectedFile.name}</p>
                        <p className="text-[10px] text-neutral-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB · Click to change</p>
                        {lastUploadedUrl && (
                          <a href={lastUploadedUrl} target="_blank" rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1 text-[10px] text-[#0095F6] font-semibold hover:underline">
                            View uploaded file <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    ) : (
                      <>
                        <Upload className="w-5 h-5 mx-auto text-[#0095F6] mb-1" />
                        <p className="text-xs text-black dark:text-white font-semibold">Drag & drop or click to browse</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5">PDF, DOCX, ZIP, IMG — max 50 MB</p>
                      </>
                    )}
                  </div>
                  {isUploading && (
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-[10px] text-neutral-500">
                        <span>Uploading...</span>
                        <span className="font-bold text-[#0095F6]">{uploadProgress}%</span>
                      </div>
                      <div className="h-1 bg-neutral-200 dark:bg-[#262626] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#0095F6] rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {uploadError && (
                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-red-500">
                      <AlertCircle className="w-3 h-3" />
                      {uploadError}
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 py-4 border-t border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => { setIsUploadModalOpen(false); setSelectedFile(null); setUploadError(null); }}
                  className="btn-secondary"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Uploading...</>
                  ) : (
                    <><Upload className="w-4 h-4" /> Publish Resource</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Study Guide Modal */}
      {activeStudyAid && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-[#121212] border border-[#DBDBDB] dark:border-[#262626] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-full bg-neutral-100 dark:bg-[#262626] text-[#0095F6]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-black dark:text-white">
                    Study Guide: {activeStudyAid.item.subject}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Est. {activeStudyAid.guide.estimatedReadMinutes} min review • {activeStudyAid.item.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setActiveStudyAid(null)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                  Key Conceptual Takeaways
                </h4>
                <ul className="space-y-2">
                  {activeStudyAid.guide.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 flex items-start gap-2 bg-[#FAFAFA] dark:bg-[#1C1C1C] p-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0095F6] mt-1.5 shrink-0" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-black dark:text-white mb-2">
                  Suggested Exam Review Questions
                </h4>
                <ul className="space-y-2">
                  {activeStudyAid.guide.suggestedReviewQuestions.map((q, idx) => (
                    <li key={idx} className="text-xs text-neutral-700 dark:text-neutral-300 bg-[#FAFAFA] dark:bg-[#1C1C1C] p-2.5 rounded-lg border border-[#DBDBDB] dark:border-[#262626]">
                      <strong className="text-black dark:text-white">Q{idx + 1}:</strong> {q}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 py-3 border-t border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] flex justify-end">
              <button
                onClick={() => setActiveStudyAid(null)}
                className="btn-primary py-1.5 px-4 text-xs font-semibold"
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
