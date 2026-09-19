import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/study_sync_provider.dart';
import '../theme/app_theme.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();
    final isDark = provider.isDarkMode;
    final cardBorder = isDark ? const Color(0xFF262626) : const Color(0xFFDBDBDB);
    final cardBg = isDark ? const Color(0xFF121212) : const Color(0xFFFAFAFA);
    final secondaryText = isDark ? const Color(0xFFA8A8A8) : const Color(0xFF737373);

    return Scaffold(
      appBar: AppBar(
        title: Text(provider.rollNo.toLowerCase()),
        actions: [
          IconButton(
            icon: Icon(isDark ? Icons.light_mode_outlined : Icons.dark_mode_outlined),
            onPressed: () => provider.toggleTheme(),
            tooltip: 'Toggle Theme',
          ),
          IconButton(
            icon: const Icon(Icons.menu),
            onPressed: () {},
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          // Instagram Header Profile Row
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(3),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  border: Border.all(color: AppTheme.instagramBlue, width: 2),
                ),
                child: CircleAvatar(
                  radius: 36,
                  backgroundColor: isDark ? const Color(0xFF262626) : const Color(0xFFEFEFEF),
                  child: Text(
                    provider.userName.substring(0, 1),
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: isDark ? Colors.white : Colors.black,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 24),
              Expanded(
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    _buildStatCol('${provider.assignments.where((a) => a.isSubmitted).length}', 'Tasks Done'),
                    _buildStatCol('${provider.attendancePercentage.toStringAsFixed(0)}%', 'Attendance'),
                    _buildStatCol('Level 4', 'Scholar'),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // Bio details
          Text(
            provider.userName,
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w700),
          ),
          const SizedBox(height: 2),
          Text(
            '${provider.className} Cohort · Roll #${provider.rollNo}',
            style: TextStyle(fontSize: 12, color: secondaryText),
          ),
          const SizedBox(height: 4),
          Text(
            'Mechanical Engineering Department\nStudySync real-time peer network node active.',
            style: TextStyle(
              fontSize: 12,
              height: 1.35,
              color: isDark ? const Color(0xFFE5E5E5) : const Color(0xFF262626),
            ),
          ),

          const SizedBox(height: 16),

          // Action Buttons: Edit Profile & Switch Persona
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () {},
                  style: OutlinedButton.styleFrom(
                    side: BorderSide(color: cardBorder),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    backgroundColor: isDark ? const Color(0xFF181818) : const Color(0xFFEFEFEF),
                  ),
                  child: Text(
                    'Edit Profile',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w700,
                      color: isDark ? Colors.white : Colors.black,
                    ),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: ElevatedButton(
                  onPressed: () {
                    provider.toggleRole();
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Switched view to ${provider.userRole}')),
                    );
                  },
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.instagramBlue,
                    foregroundColor: Colors.white,
                    elevation: 0,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                  ),
                  child: Text(
                    'Switch to ${provider.userRole == 'Student' ? 'CR' : 'Student'}',
                    style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Class Access Key Card
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: cardBorder),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text(
                      'Cohort Access Key',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'Invite peer students to ${provider.className}',
                      style: TextStyle(fontSize: 11, color: secondaryText),
                    ),
                  ],
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1C1C1C) : const Color(0xFFEFEFEF),
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: cardBorder),
                  ),
                  child: const Text(
                    'MECH3A',
                    style: TextStyle(
                      fontFamily: 'monospace',
                      fontWeight: FontWeight.w800,
                      fontSize: 13,
                      letterSpacing: 1.5,
                      color: AppTheme.instagramBlue,
                    ),
                  ),
                ),
              ],
            ),
          ),

          const SizedBox(height: 16),

          // Settings Options
          Container(
            decoration: BoxDecoration(
              color: cardBg,
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: cardBorder),
            ),
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.palette_outlined, size: 20),
                  title: const Text('Theme Appearance', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  trailing: Text(
                    isDark ? 'Dark AMOLED' : 'Clean Light',
                    style: TextStyle(fontSize: 12, color: secondaryText),
                  ),
                  onTap: () => provider.toggleTheme(),
                ),
                Divider(color: cardBorder, height: 1),
                ListTile(
                  leading: const Icon(Icons.notifications_none, size: 20),
                  title: const Text('Broadcast Notifications', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  trailing: const Icon(Icons.chevron_right, size: 18),
                  onTap: () {},
                ),
                Divider(color: cardBorder, height: 1),
                ListTile(
                  leading: const Icon(Icons.security, size: 20),
                  title: const Text('Academic Integrity & Security', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600)),
                  trailing: const Icon(Icons.chevron_right, size: 18),
                  onTap: () {},
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatCol(String count, String label) {
    return Column(
      children: [
        Text(
          count,
          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w800),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(fontSize: 11, color: Colors.grey),
        ),
      ],
    );
  }
}
