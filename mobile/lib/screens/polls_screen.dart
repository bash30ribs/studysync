import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/study_sync_provider.dart';
import '../theme/app_theme.dart';
import '../models/poll.dart';

class PollsScreen extends StatelessWidget {
  const PollsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();
    final isDark = provider.isDarkMode;
    final cardBorder = isDark ? const Color(0xFF262626) : const Color(0xFFDBDBDB);
    final cardBg = isDark ? const Color(0xFF121212) : const Color(0xFFFAFAFA);
    final secondaryText = isDark ? const Color(0xFFA8A8A8) : const Color(0xFF737373);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Cohort Polls'),
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: provider.polls.length,
        itemBuilder: (context, index) {
          final poll = provider.polls[index];
          final totalVotes = poll.totalVotes;

          return Container(
            margin: const EdgeInsets.only(bottom: 16),
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
                      poll.authorName,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: secondaryText,
                      ),
                    ),
                    Text(
                      '$totalVotes total votes',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: AppTheme.instagramBlue,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                Text(
                  poll.question,
                  style: const TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                    height: 1.35,
                  ),
                ),
                const SizedBox(height: 16),

                // Options list
                ...poll.options.map((opt) {
                  final isSelected = poll.userVotedOptionId == opt.id;
                  final percentage = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0.0;

                  return GestureDetector(
                    onTap: () {
                      provider.votePoll(poll.id, opt.id);
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      height: 44,
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF1C1C1C) : const Color(0xFFEFEFEF),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSelected ? AppTheme.instagramBlue : Colors.transparent,
                          width: 1.5,
                        ),
                      ),
                      child: Stack(
                        children: [
                          // Percentage fill bar
                          FractionallySizedBox(
                            widthFactor: (percentage / 100).clamp(0.0, 1.0),
                            child: Container(
                              decoration: BoxDecoration(
                                color: isSelected
                                    ? AppTheme.instagramBlue.withOpacity(0.25)
                                    : (isDark ? const Color(0xFF2E2E2E) : const Color(0xFFD6D6D6)),
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                          ),
                          // Content Row
                          Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Row(
                                  children: [
                                    if (isSelected)
                                      const Padding(
                                        padding: EdgeInsets.only(right: 6),
                                        child: Icon(Icons.check_circle, size: 14, color: AppTheme.instagramBlue),
                                      ),
                                    Text(
                                      opt.text,
                                      style: TextStyle(
                                        fontSize: 12,
                                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                                        color: isSelected
                                            ? (isDark ? Colors.white : Colors.black)
                                            : (isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626)),
                                      ),
                                    ),
                                  ],
                                ),
                                Text(
                                  '${percentage.toStringAsFixed(0)}%',
                                  style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: isSelected ? AppTheme.instagramBlue : secondaryText,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }),
              ],
            ),
          );
        },
      ),
    );
  }
}
