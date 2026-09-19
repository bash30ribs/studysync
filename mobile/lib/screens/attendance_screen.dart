import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/study_sync_provider.dart';
import '../theme/app_theme.dart';
import '../models/attendance.dart';

class AttendanceScreen extends StatelessWidget {
  const AttendanceScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();
    final isDark = provider.isDarkMode;
    final cardBorder = isDark ? const Color(0xFF262626) : const Color(0xFFDBDBDB);
    final cardBg = isDark ? const Color(0xFF121212) : const Color(0xFFFAFAFA);
    final secondaryText = isDark ? const Color(0xFFA8A8A8) : const Color(0xFF737373);
    final percentage = provider.attendancePercentage;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Attendance'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Compliance Gauge Card
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: cardBorder),
            ),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Text(
                      'Overall Compliance',
                      style: TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: percentage >= 75
                            ? AppTheme.instagramBlue.withOpacity(0.12)
                            : AppTheme.alertRed.withOpacity(0.12),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text(
                        percentage >= 75 ? 'Safe (> 75%)' : 'Warning (< 75%)',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w700,
                          color: percentage >= 75 ? AppTheme.instagramBlue : AppTheme.alertRed,
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 120,
                      height: 120,
                      child: CircularProgressIndicator(
                        value: percentage / 100,
                        strokeWidth: 8,
                        backgroundColor: isDark ? const Color(0xFF262626) : const Color(0xFFE5E5E5),
                        valueColor: AlwaysStoppedAnimation<Color>(
                          percentage >= 75 ? AppTheme.instagramBlue : AppTheme.alertRed,
                        ),
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '${percentage.toStringAsFixed(0)}%',
                          style: const TextStyle(fontSize: 26, fontWeight: FontWeight.w800),
                        ),
                        Text(
                          'Present',
                          style: TextStyle(fontSize: 11, color: secondaryText),
                        ),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text(
                  'Minimum university attendance requirement is 75%. You can afford to miss 2 more sessions while remaining eligible.',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 12, color: secondaryText, height: 1.4),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Session Logs List
          const Text(
            'RECENT LECTURE SESSIONS',
            style: TextStyle(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              letterSpacing: 0.5,
              color: Colors.grey,
            ),
          ),
          const SizedBox(height: 10),

          ...provider.attendanceRecords.map((rec) {
            Color statusColor;
            String statusText;
            switch (rec.status) {
              case AttendanceStatus.present:
                statusColor = AppTheme.instagramBlue;
                statusText = 'Present';
                break;
              case AttendanceStatus.late:
                statusColor = Colors.amber.shade700;
                statusText = 'Late';
                break;
              case AttendanceStatus.absent:
                statusColor = AppTheme.alertRed;
                statusText = 'Absent';
                break;
            }

            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: cardBg,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: cardBorder),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          rec.subject,
                          style: const TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              DateFormat('MMM d, yyyy').format(rec.date),
                              style: TextStyle(fontSize: 11, color: secondaryText),
                            ),
                            Text(' · ', style: TextStyle(color: secondaryText)),
                            Text(
                              rec.timeSlot,
                              style: TextStyle(fontSize: 11, color: secondaryText),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(
                      color: statusColor.withOpacity(0.12),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Text(
                      statusText,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: statusColor,
                      ),
                    ),
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
