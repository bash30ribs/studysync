import React, { useState } from 'react';
import { useStudySync } from '../../store';
import { 
  Search, 
  Download, 
  Trash2,
  Users
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
          <h1 className="text-xl lg:text-2xl font-bold text-black dark:text-white tracking-tight">
            Class Roster & Members
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
            Manage enrolled students, monitor overall submission rates, and inspect student activity.
          </p>
        </div>

        <button
          onClick={exportMembersCSV}
          className="btn-secondary self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, roll number, or email..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DBDBDB] dark:border-[#262626] bg-white dark:bg-[#121212] text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:border-[#0095F6] shadow-xs"
        />
      </div>

      {/* Table */}
      <div className="ui-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DBDBDB] dark:border-[#262626] bg-[#FAFAFA] dark:bg-[#121212] text-[10px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Submission Rate</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DBDBDB] dark:divide-[#262626] text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Users className="w-8 h-8 text-[#3A3A3A] mx-auto mb-1" />
                      <p className="text-sm font-semibold text-[#3A3A3A]">
                        No students yet. Share your class code. 👥
                      </p>
                    </div>
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
                          ? 'bg-neutral-100 dark:bg-[#1C1C1C] font-medium'
                          : 'hover:bg-neutral-50 dark:hover:bg-[#181818]'
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-[#262626] text-black dark:text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {stu.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-black dark:text-white truncate">
                              {stu.name}
                            </p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                              {stu.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roll No */}
                      <td className="py-3.5 px-4 font-mono font-semibold text-black dark:text-white">
                        {stu.rollNo || 'N/A'}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-mono text-neutral-500 dark:text-neutral-400">
                        {new Date(stu.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Submission Rate Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-36 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-black dark:text-white font-semibold">
                              {submittedCount}/{totalAsg}
                            </span>
                            <span className="font-mono font-bold text-[#0095F6]">
                              {ratePercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-neutral-200 dark:bg-[#262626] overflow-hidden">
                            <div
                              className="h-full bg-[#0095F6] progress-bar-fill rounded-full"
                              style={{ width: `${ratePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-neutral-500 dark:text-neutral-400">
                        {stu.lastActive}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setStudentToDelete({ id: stu.id, name: stu.name })}
                          title="Remove student from class"
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-[#ED4956] hover:bg-neutral-100 dark:hover:bg-[#262626] transition-colors"
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
          <p className="text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
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
              className="px-4 py-2 rounded-xl bg-[#ED4956] hover:bg-red-600 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              Remove Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
