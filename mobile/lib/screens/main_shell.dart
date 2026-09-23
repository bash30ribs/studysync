import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/study_sync_provider.dart';
import '../theme/app_theme.dart';
import 'feed_screen.dart';
import 'assignments_screen.dart';
import 'attendance_screen.dart';
import 'polls_screen.dart';
import 'profile_screen.dart';
import 'messages_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    FeedScreen(),
    AssignmentsScreen(),
    AttendanceScreen(),
    PollsScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();
    final isDark = provider.isDarkMode;
    final navBorder = isDark ? const Color(0xFF262626) : const Color(0xFFDBDBDB);

    return Scaffold(
      appBar: _currentIndex == 0
          ? AppBar(
              title: const Text(
                'StudySync',
                style: TextStyle(
                  fontFamily: 'sans-serif',
                  fontWeight: FontWeight.w800,
                  fontSize: 22,
                  letterSpacing: -0.8,
                ),
              ),
              actions: [
                Stack(
                  alignment: Alignment.center,
                  children: [
                    IconButton(
                      icon: const Icon(Icons.favorite_border, size: 24),
                      onPressed: () {},
                    ),
                    Positioned(
                      top: 14,
                      right: 14,
                      child: Container(
                        width: 7,
                        height: 7,
                        decoration: const BoxDecoration(
                          color: AppTheme.alertRed,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ],
                ),
                IconButton(
                  icon: const Icon(Icons.send_outlined, size: 22),
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(builder: (_) => const MessagesScreen()),
                    );
                  },
                ),
              ],
            )
          : null,
      body: Column(
        children: [
          if (provider.isOffline)
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 12),
              color: const Color(0xFFD97706),
              child: const Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.wifi_off, size: 14, color: Colors.white),
                  SizedBox(width: 6),
                  Text(
                    'Offline Mode · Changes saved to local cache',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 11,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
            ),
          Expanded(
            child: IndexedStack(
              index: _currentIndex,
              children: _screens,
            ),
          ),
        ],
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          border: Border(top: BorderSide(color: navBorder, width: 0.5)),
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: (index) => setState(() => _currentIndex = index),
          items: const [
            BottomNavigationBarItem(
              icon: Icon(Icons.home_outlined),
              activeIcon: Icon(Icons.home),
              label: 'Feed',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.assignment_outlined),
              activeIcon: Icon(Icons.assignment),
              label: 'Tasks',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.how_to_reg_outlined),
              activeIcon: Icon(Icons.how_to_reg),
              label: 'Roll',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.bar_chart_outlined),
              activeIcon: Icon(Icons.bar_chart),
              label: 'Polls',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person_outline),
              activeIcon: Icon(Icons.person),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
