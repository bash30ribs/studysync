import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/study_sync_provider.dart';
import '../theme/app_theme.dart';
import '../models/assignment.dart';

class AssignmentsScreen extends StatefulWidget {
  const AssignmentsScreen({super.key});

  @override
  State<AssignmentsScreen> createState() => _AssignmentsScreenState();
}

class _AssignmentsScreenState extends State<AssignmentsScreen> {
  String _filter = 'All'; // 'All', 'Pending', 'Submitted'

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();
    final isDark = provider.isDarkMode;
    final cardBorder = isDark ? const Color(0xFF262626) : const Color(0xFFDBDBDB);
    final cardBg = isDark ? const Color(0xFF121212) : const Color(0xFFFAFAFA);
    final secondaryText = isDark ? const Color(0xFFA8A8A8) : const Color(0xFF737373);

    final filteredList = provider.assignments.where((a) {
      if (_filter == 'Pending') return !a.isSubmitted;
      if (_filter == 'Submitted') return a.isSubmitted;
      return true;
    }).toList();

    return Scaffold(
      appBar: AppBar(
        title: const Text('Assignments'),
        actions: [
          IconButton(
            icon: const Icon(Icons.tune, size: 20),
            onPressed: () {},
          ),
        ],
      ),
      body: Column(
        children: [
          // Filter segmented row
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Container(
              padding: const EdgeInsets.all(3),
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF181818) : const Color(0xFFEFEFEF),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Row(
                children: ['All', 'Pending', 'Submitted'].map((filterName) {
                  final isSelected = _filter == filterName;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _filter = filterName),
                      child: Container(
                        padding: const EdgeInsets.symmetric(vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected
                              ? (isDark ? const Color(0xFF262626) : Colors.white)
                              : Colors.transparent,
                          borderRadius: BorderRadius.circular(8),
                          boxShadow: isSelected
                              ? [
                                  BoxShadow(
                                    color: Colors.black.withOpacity(0.06),
                                    blurRadius: 4,
                                    offset: const Offset(0, 1),
                                  )
                                ]
                              : null,
                        ),
                        alignment: Alignment.center,
                        child: Text(
                          filterName,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected
                                ? (isDark ? Colors.white : Colors.black)
                                : secondaryText,
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
            ),
          ),

          // Assignment list
          Expanded(
            child: filteredList.isEmpty
                ? Center(
                    child: Text(
                      'No assignments found in this tab.',
                      style: TextStyle(color: secondaryText, fontSize: 13),
                    ),
                  )
                : ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: filteredList.length,
                    itemBuilder: (context, index) {
                      final asg = filteredList[index];
                      final isOverdue = asg.deadline.isBefore(DateTime.now()) && !asg.isSubmitted;

                      return Container(
                        margin: const EdgeInsets.only(bottom: 12),
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: cardBorder),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: isDark ? const Color(0xFF1C1C1C) : const Color(0xFFEFEFEF),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    asg.subject,
                                    style: const TextStyle(
                                      fontSize: 11,
                                      fontWeight: FontWeight.w700,
                                      letterSpacing: 0.2,
                                    ),
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: asg.isSubmitted
                                        ? AppTheme.instagramBlue.withOpacity(0.12)
                                        : (isOverdue
                                            ? AppTheme.alertRed.withOpacity(0.12)
                                            : Colors.amber.withOpacity(0.12)),
                                    borderRadius: BorderRadius.circular(12),
                                  ),
                                  child: Text(
                                    asg.isSubmitted
                                        ? 'Submitted'
                                        : (isOverdue ? 'Overdue' : 'Pending'),
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      color: asg.isSubmitted
                                          ? AppTheme.instagramBlue
                                          : (isOverdue ? AppTheme.alertRed : Colors.amber.shade700),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 10),
                            Text(
                              asg.title,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            const SizedBox(height: 6),
                            Text(
                              asg.description,
                              style: TextStyle(
                                fontSize: 12,
                                height: 1.4,
                                color: secondaryText,
                              ),
                            ),
                            const SizedBox(height: 14),
                            Divider(color: cardBorder, height: 1),
                            const SizedBox(height: 10),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    Icon(
                                      Icons.calendar_today_outlined,
                                      size: 13,
                                      color: isOverdue ? AppTheme.alertRed : secondaryText,
                                    ),
                                    const SizedBox(width: 4),
                                    Text(
                                      'Due: ${DateFormat('MMM d, h:mm a').format(asg.deadline)}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: isOverdue ? FontWeight.w700 : FontWeight.w500,
                                        color: isOverdue ? AppTheme.alertRed : secondaryText,
                                      ),
                                    ),
                                  ],
                                ),
                                if (!asg.isSubmitted)
                                  ElevatedButton(
                                    onPressed: () => _showSubmitSheet(context, asg, provider),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: AppTheme.instagramBlue,
                                      foregroundColor: Colors.white,
                                      elevation: 0,
                                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                                      minimumSize: Size.zero,
                                      tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                    ),
                                    child: const Text('Turn In', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                                  )
                                else
                                  Row(
                                    children: [
                                      const Icon(Icons.check_circle, color: AppTheme.instagramBlue, size: 14),
                                      const SizedBox(width: 4),
                                      Text(
                                        'Turned In',
                                        style: TextStyle(
                                          color: AppTheme.instagramBlue,
                                          fontSize: 11,
                                          fontWeight: FontWeight.w700,
                                        ),
                                      ),
                                    ],
                                  ),
                              ],
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }

  void _showSubmitSheet(BuildContext context, Assignment asg, StudySyncProvider provider) {
    final noteController = TextEditingController();
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: provider.isDarkMode ? const Color(0xFF121212) : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Center(
                child: Container(
                  width: 36,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.grey.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Submit Assignment',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: provider.isDarkMode ? Colors.white : Colors.black,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                asg.title,
                style: const TextStyle(fontSize: 12, color: Colors.grey),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: noteController,
                decoration: InputDecoration(
                  hintText: 'Add note (e.g. Uploaded to lab portal / attached report)',
                  hintStyle: const TextStyle(fontSize: 12, color: Colors.grey),
                  filled: true,
                  fillColor: provider.isDarkMode ? const Color(0xFF1C1C1C) : const Color(0xFFF5F5F5),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(10),
                    borderSide: BorderSide.none,
                  ),
                  contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                ),
                maxLines: 3,
              ),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: () {
                    provider.submitAssignment(
                      asg.id,
                      noteController.text.trim().isNotEmpty ? noteController.text.trim() : 'Submitted on Mobile',
                    );
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Successfully turned in "${asg.title}"!')),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.instagramBlue,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    padding: const EdgeInsets.symmetric(vertical: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                  ),
                  child: const Text('Confirm Submission', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}
