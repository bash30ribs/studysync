import 'package:flutter/material.dart';

class AppTheme {
  static const Color instagramBlue = Color(0xFF0095F6);
  static const Color alertRed = Color(0xFFED4956);

  // Dark Theme (Pure AMOLED Black)
  static final ThemeData darkTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF000000),
    cardColor: const Color(0xFF121212),
    primaryColor: instagramBlue,
    colorScheme: const ColorScheme.dark(
      primary: instagramBlue,
      surface: Color(0xFF121212),
      outline: Color(0xFF262626),
      error: alertRed,
      onPrimary: Colors.white,
      onSurface: Color(0xFFF5F5F5),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFF000000),
      foregroundColor: Colors.white,
      elevation: 0,
      centerTitle: false,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(
        color: Colors.white,
        fontSize: 20,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
      ),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Color(0xFF000000),
      selectedItemColor: Colors.white,
      unselectedItemColor: Color(0xFF737373),
      type: BottomNavigationBarType.fixed,
      elevation: 0,
    ),
    dividerTheme: const DividerThemeData(
      color: Color(0xFF262626),
      thickness: 1,
      space: 1,
    ),
  );

  // Light Theme (Pure Clean White)
  static final ThemeData lightTheme = ThemeData(
    useMaterial3: true,
    brightness: Brightness.light,
    scaffoldBackgroundColor: const Color(0xFFFFFFFF),
    cardColor: const Color(0xFFFAFAFA),
    primaryColor: instagramBlue,
    colorScheme: const ColorScheme.light(
      primary: instagramBlue,
      surface: Color(0xFFFAFAFA),
      outline: Color(0xFFDBDBDB),
      error: alertRed,
      onPrimary: Colors.white,
      onSurface: Color(0xFF000000),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Color(0xFFFFFFFF),
      foregroundColor: Colors.black,
      elevation: 0,
      centerTitle: false,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(
        color: Colors.black,
        fontSize: 20,
        fontWeight: FontWeight.w700,
        letterSpacing: -0.5,
      ),
    ),
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: Color(0xFFFFFFFF),
      selectedItemColor: Colors.black,
      unselectedItemColor: Color(0xFF8E8E8E),
      type: BottomNavigationBarType.fixed,
      elevation: 0,
    ),
    dividerTheme: const DividerThemeData(
      color: Color(0xFFDBDBDB),
      thickness: 1,
      space: 1,
    ),
  );
}
