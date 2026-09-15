# Changelog

All notable changes to the **StudySync** academic platform are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.1.0] - 2026-09-15

### 🚀 Added
- **Web Audio Focus Soundscapes Synthesizer**: Pure procedural ambient noise generator with Brown Noise, Pink Noise, Rain Simulator, and 10Hz Alpha Binaural Beats.
- **RFC 5545 iCalendar (`.ics`) & Google Calendar Sync**: 1-tap calendar subscription and event export with automated 24h reminders.
- **Interactive Keyboard Shortcuts Cheat Sheet**: Quick modal cheat sheet accessible via <kbd>?</kbd> key or header help button.
- **Academic Streaks, Quests & Milestone Badges**: Gamified study XP system with level progression and daily task completion.
- **AI-Assisted Study Guide Generator**: Instant conceptual summary extraction and exam review prompt generator for shared resources.
- **Pomodoro Focus Timer**: Interactive interval timer with Deep Focus, Short Break, and Long Break presets.
- **CSV & Formatted Print Report Generator**: Gradebook and attendance session roster exports for CR administrative reporting.
- **Workspace State Backup & Restore**: JSON snapshot export and schema validation recovery tool.
- **PWA Service Worker Offline Caching**: Stale-while-revalidate caching strategy and PWA install prompt hooks.

### ⚡ Performance & Quality
- Configured Rollup manual chunking splitting React vendor and Lucide icons for ultra-fast initial bundle payload.
- Added comprehensive Vitest unit test suite covering calendar utilities, CSV exporters, and backup validation.
- Configured automated GitHub Actions CI pipeline running lint, test, and production build checks on every push.

---

## [1.0.0] - 2026-09-14

### 🌟 Initial Release
- Multi-role support for Class Representatives (CR) and Students.
- Triple-panel responsive command center.
- Real-time consensus voting and class polls.
- Secure assignment submissions with digital verification hashes.
- Encrypted direct messaging and emergency broadcast alerts.
