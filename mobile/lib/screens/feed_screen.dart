import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/study_sync_provider.dart';
import '../theme/app_theme.dart';

class FeedScreen extends StatelessWidget {
  const FeedScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();
    final isDark = provider.isDarkMode;
    final cardBorder = isDark ? const Color(0xFF262626) : const Color(0xFFDBDBDB);
    final cardBg = isDark ? const Color(0xFF121212) : const Color(0xFFFAFAFA);
    final secondaryText = isDark ? const Color(0xFFA8A8A8) : const Color(0xFF737373);

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          // Story-like Subject Bubble Strip
          SliverToBoxAdapter(
            child: Container(
              height: 100,
              padding: const EdgeInsets.symmetric(vertical: 8),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: cardBorder, width: 0.5)),
              ),
              child: ListView(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 12),
                children: [
                  _buildSubjectStory('Fluid Mech', 'FM', true, isDark),
                  _buildSubjectStory('Thermodynamics', 'TD', false, isDark),
                  _buildSubjectStory('Machine Dyn', 'MD', false, isDark),
                  _buildSubjectStory('Materials', 'SM', false, isDark),
                  _buildSubjectStory('Manufacturing', 'MT', false, isDark),
                ],
              ),
            ),
          ),

          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Cohort Welcome Card
                  Container(
                    width: double.infinity,
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
                            Text(
                              '${provider.className} Cohort Hub',
                              style: const TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                              decoration: BoxDecoration(
                                color: AppTheme.instagramBlue.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Text(
                                provider.userRole,
                                style: const TextStyle(
                                  color: AppTheme.instagramBlue,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w700,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Mechanical Engineering 3rd Year · Sem 5 Synchronized',
                          style: TextStyle(
                            fontSize: 12,
                            color: secondaryText,
                          ),
                        ),
                        const SizedBox(height: 16),
                        // Quick Metric Strip
                        Row(
                          children: [
                            _buildMiniMetric(
                              'Attendance',
                              '${provider.attendancePercentage.toStringAsFixed(0)}%',
                              isDark,
                            ),
                            const SizedBox(width: 8),
                            _buildMiniMetric(
                              'Pending Tasks',
                              '${provider.pendingAssignmentsCount}',
                              isDark,
                            ),
                            const SizedBox(width: 8),
                            _buildMiniMetric(
                              'Cohort Rank',
                              '#4 of 58',
                              isDark,
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 20),

                  // Official CR Broadcast Post
                  const Text(
                    'LATEST OFFICIAL BROADCAST',
                    style: TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.5,
                      color: Colors.grey,
                    ),
                  ),
                  const SizedBox(height: 10),

                  Container(
                    decoration: BoxDecoration(
                      color: cardBg,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: cardBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Post Header
                        Padding(
                          padding: const EdgeInsets.all(12),
                          child: Row(
                            children: [
                              Container(
                                width: 34,
                                height: 34,
                                decoration: BoxDecoration(
                                  shape: BoxShape.circle,
                                  border: Border.all(color: AppTheme.instagramBlue, width: 1.5),
                                  color: isDark ? const Color(0xFF262626) : const Color(0xFFEFEFEF),
                                ),
                                alignment: Alignment.center,
                                child: const Text(
                                  'R',
                                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                                ),
                              ),
                              const SizedBox(width: 10),
                              const Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Row(
                                      children: [
                                        Text(
                                          'Rohan Sharma',
                                          style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
                                        ),
                                        SizedBox(width: 4),
                                        Icon(Icons.verified, color: AppTheme.instagramBlue, size: 14),
                                      ],
                                    ),
                                    Text(
                                      'Class Representative · 2 hours ago',
                                      style: TextStyle(fontSize: 11, color: Colors.grey),
                                    ),
                                  ],
                                ),
                              ),
                              IconButton(
                                icon: const Icon(Icons.more_horiz, size: 18),
                                onPressed: () {},
                              ),
                            ],
                          ),
                        ),

                        // Post Body
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                          child: Text(
                            'OFFICIAL NOTICE: All students must submit the Fluid Mechanics boundary layer derivations prior to Friday 5 PM. Prof. Mukherjee has confirmed no late submission extensions will be granted.',
                            style: TextStyle(
                              fontSize: 13,
                              height: 1.45,
                              color: isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626),
                            ),
                          ),
                        ),

                        const SizedBox(height: 12),
                        Divider(color: cardBorder, height: 1),

                        // Post Action Footer
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Row(
                                children: [
                                  Icon(Icons.shield_outlined, size: 14, color: AppTheme.instagramBlue),
                                  const SizedBox(width: 4),
                                  Text(
                                    'Verified dispatch to 58 devices',
                                    style: TextStyle(fontSize: 11, color: secondaryText),
                                  ),
                                ],
                              ),
                              TextButton(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Copied formatted broadcast for WhatsApp!')),
                                  );
                                },
                                style: TextButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                  minimumSize: Size.zero,
                                  tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                                ),
                                child: const Text(
                                  'Share',
                                  style: TextStyle(color: AppTheme.instagramBlue, fontSize: 12, fontWeight: FontWeight.w600),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Urgent Assignments Due Feed
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'CRITICAL UPCOMING TASKS',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 0.5,
                          color: Colors.grey,
                        ),
                      ),
                      Text(
                        '${provider.pendingAssignmentsCount} Pending',
                        style: const TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.instagramBlue,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 10),

                  ...provider.assignments.where((a) => !a.isSubmitted).take(2).map((asg) {
                    final isDueSoon = asg.deadline.difference(DateTime.now()).inHours < 24;
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
                          Container(
                            width: 4,
                            height: 44,
                            decoration: BoxDecoration(
                              color: isDueSoon ? AppTheme.alertRed : AppTheme.instagramBlue,
                              borderRadius: BorderRadius.circular(2),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  asg.subject,
                                  style: TextStyle(
                                    fontSize: 10,
                                    fontWeight: FontWeight.w700,
                                    color: secondaryText,
                                    letterSpacing: 0.3,
                                  ),
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  asg.title,
                                  style: const TextStyle(
                                    fontSize: 13,
                                    fontWeight: FontWeight.w700,
                                  ),
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                ),
                                const SizedBox(height: 4),
                                Row(
                                  children: [
                                    Icon(
                                      Icons.access_time,
                                      size: 11,
                                      color: isDueSoon ? AppTheme.alertRed : secondaryText,
                                    ),
                                    const SizedBox(width: 3),
                                    Text(
                                      'Due ${DateFormat('E, h:mm a').format(asg.deadline)}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        fontWeight: isDueSoon ? FontWeight.w700 : FontWeight.w500,
                                        color: isDueSoon ? AppTheme.alertRed : secondaryText,
                                      ),
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ),
                          ElevatedButton(
                            onPressed: () {
                              provider.submitAssignment(asg.id, 'Submitted via StudySync Mobile');
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('Marked "${asg.title}" as submitted!')),
                              );
                            },
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppTheme.instagramBlue,
                              foregroundColor: Colors.white,
                              elevation: 0,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                              minimumSize: Size.zero,
                              tapTargetSize: MaterialTapTargetSize.shrinkWrap,
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                            ),
                            child: const Text('Submit', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700)),
                          ),
                        ],
                      ),
                    );
                  }),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSubjectStory(String title, String tag, bool isSelected, bool isDark) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 6),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            padding: const EdgeInsets.all(2.5),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              border: Border.all(
                color: isSelected ? AppTheme.instagramBlue : (isDark ? const Color(0xFF333333) : const Color(0xFFE5E5E5)),
                width: 2,
              ),
            ),
            child: CircleAvatar(
              radius: 24,
              backgroundColor: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFEFEFEF),
              child: Text(
                tag,
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: isSelected ? AppTheme.instagramBlue : (isDark ? Colors.white : Colors.black),
                ),
              ),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            title,
            style: const TextStyle(fontSize: 10, fontWeight: FontWeight.w500),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildMiniMetric(String label, String value, bool isDark) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF1C1C1C) : const Color(0xFFEFEFEF),
          borderRadius: BorderRadius.circular(10),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                letterSpacing: -0.3,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                fontSize: 10,
                color: Colors.grey,
                fontWeight: FontWeight.w500,
              ),
              maxLines: 1,
            ),
          ],
        ),
      ),
    );
  }
}
