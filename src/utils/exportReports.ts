import { Assignment, AttendanceRecord, Member } from '../types';

/**
 * Converts assignment array to formatted CSV data string
 */
export function exportAssignmentsToCSV(assignments: Assignment[]): string {
  const headers = ['ID', 'Title', 'Course', 'Due Date', 'Priority', 'Status', 'Points', 'Description'];
  const rows = assignments.map((a) => [
    `"${a.id}"`,
    `"${(a.title || '').replace(/"/g, '""')}"`,
    `"${a.course || ''}"`,
    `"${a.dueDate || ''}"`,
    `"${a.priority || ''}"`,
    `"${a.status || ''}"`,
    `"${a.points || 100}"`,
    `"${(a.description || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
}

/**
 * Converts attendance history to CSV
 */
export function exportAttendanceToCSV(records: AttendanceRecord[], members: Member[]): string {
  const memberMap = new Map(members.map((m) => [m.id, m]));
  const headers = ['Record ID', 'Date', 'Subject', 'Student Name', 'Roll Number', 'Status'];

  const rows: string[] = [];
  records.forEach((rec) => {
    // If details are present
    const member = memberMap.get(rec.studentId);
    rows.push([
      `"${rec.id}"`,
      `"${rec.date}"`,
      `"${rec.subject}"`,
      `"${member?.name || rec.studentName || 'Student'}"`,
      `"${member?.rollNumber || rec.rollNumber || 'N/A'}"`,
      `"${rec.status}"`,
    ].join(','));
  });

  return [headers.join(','), ...rows].join('\r\n');
}

/**
 * Triggers download of raw CSV file
 */
export function downloadCSV(content: string, filename = 'export.csv') {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Opens a formatted print preview window for assignment progress reports
 */
export function printAssignmentReport(assignments: Assignment[], className = 'StudySync Class') {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const completed = assignments.filter((a) => a.status === 'completed').length;
  const pending = assignments.filter((a) => a.status === 'pending').length;
  const completionRate = assignments.length ? Math.round((completed / assignments.length) * 100) : 0;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Academic Report - ${className}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #1e293b; }
          h1 { margin-bottom: 4px; font-size: 24px; color: #0f172a; }
          .subtitle { color: #64748b; font-size: 14px; margin-bottom: 24px; }
          .summary-cards { display: flex; gap: 16px; margin-bottom: 32px; }
          .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; flex: 1; }
          .card-value { font-size: 20px; font-weight: bold; color: #4338ca; }
          .card-label { font-size: 12px; color: #64748b; text-transform: uppercase; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; font-size: 13px; }
          th { background: #f1f5f9; text-align: left; padding: 10px 12px; border-bottom: 2px solid #cbd5e1; font-weight: 600; }
          td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
          .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
          .badge-high { background: #fee2e2; color: #991b1b; }
          .badge-med { background: #fef3c7; color: #92400e; }
          .badge-low { background: #e0e7ff; color: #3730a3; }
          .badge-completed { background: #dcfce7; color: #166534; }
          .badge-pending { background: #f1f5f9; color: #475569; }
          @media print {
            body { padding: 0; }
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <h1>${className} • Assignment & Submission Report</h1>
        <div class="subtitle">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>

        <div class="summary-cards">
          <div class="card">
            <div class="card-value">${assignments.length}</div>
            <div class="card-label">Total Assignments</div>
          </div>
          <div class="card">
            <div class="card-value">${completed}</div>
            <div class="card-label">Completed</div>
          </div>
          <div class="card">
            <div class="card-value">${pending}</div>
            <div class="card-label">Pending / In Progress</div>
          </div>
          <div class="card">
            <div class="card-value">${completionRate}%</div>
            <div class="card-label">Completion Velocity</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Course</th>
              <th>Assignment Title</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Max Score</th>
            </tr>
          </thead>
          <tbody>
            ${assignments
              .map(
                (a) => `
              <tr>
                <td><strong>${a.course}</strong></td>
                <td>${a.title}</td>
                <td>${new Date(a.dueDate).toLocaleDateString()}</td>
                <td>
                  <span class="badge ${
                    a.priority === 'high' ? 'badge-high' : a.priority === 'medium' ? 'badge-med' : 'badge-low'
                  }">
                    ${a.priority.toUpperCase()}
                  </span>
                </td>
                <td>
                  <span class="badge ${a.status === 'completed' ? 'badge-completed' : 'badge-pending'}">
                    ${a.status}
                  </span>
                </td>
                <td>${a.points || 100} pts</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
