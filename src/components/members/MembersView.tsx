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
          <h1 className="text-xl lg:text-2xl font-extrabold text-[#0F2044] dark:text-white tracking-tight">
            Class Roster & Members
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Manage enrolled students, monitor overall submission rates, and inspect device audit logs.
          </p>
        </div>

        <button
          onClick={exportMembersCSV}
          className="px-3.5 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] hover:bg-[#F8FAFC] dark:hover:bg-[#15203B] text-xs font-semibold text-[#0F2044] dark:text-white flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#64748B] dark:text-[#94A3B8]" />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-[#64748B] dark:text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student name, roll number, or email..."
          className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] text-[#0F2044] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#00B4A6]/20 focus:border-[#00B4A6] dark:focus:border-[#00D2C4] shadow-xs"
        />
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#0F172A] border border-[#E2E7F0] dark:border-[#1E293B] rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E7F0] dark:border-[#1E293B] bg-[#F8FAFC] dark:bg-[#15203B]/60 text-[10px] font-bold text-[#64748B] dark:text-[#94A3B8] uppercase tracking-wider">
                <th className="py-3 px-4 sm:px-6">Student</th>
                <th className="py-3 px-4">Roll Number</th>
                <th className="py-3 px-4">Joined Date</th>
                <th className="py-3 px-4">Submission Rate</th>
                <th className="py-3 px-4">Last Active</th>
                <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E7F0] dark:divide-[#1E293B] text-xs">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[#64748B] dark:text-[#94A3B8]">
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
                          ? 'bg-[#E6F8F6]/60 dark:bg-[#00D2C4]/10 font-medium'
                          : 'hover:bg-[#F8FAFC] dark:hover:bg-[#15203B]/50'
                      }`}
                    >
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[#0F2044] dark:bg-[#00D2C4] text-white dark:text-[#09132B] flex items-center justify-center font-extrabold text-xs shrink-0 shadow-xs">
                            {stu.name.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm text-[#0F2044] dark:text-white truncate">
                              {stu.name}
                            </p>
                            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] truncate">
                              {stu.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Roll No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0F2044] dark:text-white">
                        {stu.rollNo || 'N/A'}
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-mono text-[#64748B] dark:text-[#94A3B8]">
                        {new Date(stu.joinedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>

                      {/* Submission Rate Bar */}
                      <td className="py-3.5 px-4">
                        <div className="w-36 space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-mono text-[#0F2044] dark:text-white font-bold">
                              {submittedCount}/{totalAsg}
                            </span>
                            <span className="font-mono font-extrabold text-[#00897B] dark:text-[#00D2C4]">
                              {ratePercent}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-[#E2E7F0] dark:bg-[#1E293B] overflow-hidden">
                            <div
                              className="h-full bg-[#00B4A6] dark:bg-[#00D2C4] progress-bar-fill rounded-full"
                              style={{ width: `${ratePercent}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-4 text-[#64748B] dark:text-[#94A3B8]">
                        {stu.lastActive}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-6 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setStudentToDelete({ id: stu.id, name: stu.name })}
                          title="Remove student from class"
                          className="p-1.5 rounded-lg text-[#64748B] hover:text-[#E63946] hover:bg-[#FDECEC] dark:hover:bg-[#E63946]/20 transition-colors"
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
          <p className="text-xs sm:text-sm text-[#0F2044] dark:text-white">
            Are you sure you want to remove <span className="font-bold">{studentToDelete?.name}</span> from the class roster?
            Their submission logs will be disconnected from active assignments.
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <button
              onClick={() => setStudentToDelete(null)}
              className="px-4 py-2 rounded-lg border border-[#E2E7F0] dark:border-[#1E293B] text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F2044] dark:hover:text-white"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="px-4 py-2 rounded-lg bg-[#E63946] hover:bg-[#D62839] text-white text-xs font-bold shadow-xs"
            >
              Remove Student
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
