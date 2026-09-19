import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/study_sync_provider.dart';
import 'theme/app_theme.dart';
import 'screens/main_shell.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => StudySyncProvider()),
      ],
      child: const StudySyncMobileApp(),
    ),
  );
}

class StudySyncMobileApp extends StatelessWidget {
  const StudySyncMobileApp({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<StudySyncProvider>();

    return MaterialApp(
      title: 'StudySync Mobile',
      debugShowCheckedModeBanner: false,
      themeMode: provider.themeMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      home: const MainShell(),
    );
  }
}
