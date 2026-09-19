import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  Search, 
  Download, 
  Trash2
} from 'lucide-react';
import { Modal } from '../common/Feedback';

export const MembersView: React.FC = () => {
  const { 
    allUsers, 
    assignments, 
    submissions, 
    selectedStudentId, 
    setSelectedStudentId, 
    setIsRightPanelOpen, 
    removeStudent,
    exportMembersCSV
  } = useStudySync();

  const [searchQuery, setSearchQuery] = useState('');
  const [studentToDelete, setStudentToDelete] = useState<{ id: string; name: string } | null>(null);

  const studentList = allUsers.filter(u => u.role === 'Student');

  const filteredStudents = studentList.filter(stu => 
    stu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (stu.rollNo && stu.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSelectStudent = (id: string) => {
    setSelectedStudentId(id);
    setIsRightPanelOpen(true);
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      removeStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="p-4 lg:p-7 space-y-6 max-w-6xl mx-auto">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Class Roster & Members
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Manage enrolled students, monitor overall submission rates, and inspect device audit logs.
          </p>
        </div>

        <button
          onClick={exportMembersCSV}
          className="btn-secondary self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, roll number, or email..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 shadow-xs"
        />
      </div>

      {/* Table */}
      <div className="ui-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/60 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Submission Rate</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500 dark:text-slate-400">
                    No students found matching your search.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(stu => {
                  const isSelected = selectedStudentId === stu.id;
                  const totalAsg = assignments.length;
                  const submittedCount = submissions.filter(s => s.studentId === stu.id && s.status === 'submitted').length;
                  const ratePercent = totalAsg > 0 ? Math.round((submittedCount / totalAsg) * 100) : 0;

                  return (
                    <tr
                      key={stu.id}
                      onClick={() => handleSelectStudent(stu.id)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-teal-50/60 dark:bg-teal-950/20 font-medium'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-900 dark:bg-teal-500 text-white dark:text-slate-950 flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                            {stu.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                              {stu.name}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {stu.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roll No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {stu.rollNo || 'N/A'}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400">
                        {new Date(stu.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Submission Rate Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-36 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-slate-900 dark:text-white font-bold">
                              {submittedCount}/{totalAsg}
                            </span>
                            <span className="font-mono font-extrabold text-teal-600 dark:text-teal-400">
                              {ratePercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div
                              className="h-full bg-teal-500 progress-bar-fill rounded-full"
                              style={{ width: `${ratePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">
                        {stu.lastActive}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setStudentToDelete({ id: stu.id, name: stu.name })}
                          title="Remove student from class"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Student Removal */}
      <Modal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        title="Confirm Student Removal"
      >
        <div className="space-y-4">
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200">
            Are you sure you want to remove <span className="font-bold">{studentToDelete?.name}</span> from the class roster?
            Their submission logs will be disconnected from active assignments.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setStudentToDelete(null)}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Remove Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
