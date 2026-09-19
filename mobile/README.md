# StudySync Mobile Companion (Flutter)

A companion mobile application for **StudySync**, designed with an **Instagram-inspired interface** for modern students and Class Representatives (CRs).

---

## 🎨 Instagram Design System

The mobile application eliminates all neon/vibrant AI-looking gradients, adopting clean contrast and typography inspired by the Instagram app:

- **Dark AMOLED Mode**:
  - Pure `#000000` pitch black background.
  - `#121212` card surfaces with subtle `#262626` borders.
  - High-contrast typography (`#F5F5F5` primary, `#A8A8A8` secondary).
  - `#0095F6` Instagram Blue primary actions and indicators.
  - `#ED4956` alert pills for urgent deadlines and overdue submissions.

- **Clean Light Mode**:
  - Crisp `#FFFFFF` background.
  - `#FAFAFA` elevated card surfaces with `#DBDBDB` borders.
  - High-contrast dark typography (`#000000` primary, `#737373` secondary).
  - `#0095F6` Instagram Blue accents.

---

## 📱 Features Included

1. **Feed & Stories (`FeedScreen`)**:
   - Subject bubble story bar with active highlight rings.
   - Cohort overview banner with instant metric chips (Attendance, Pending Tasks, Rank).
   - Official CR Broadcast feed with verified badge and one-tap WhatsApp sharing.
   - Upcoming urgent deadlines countdown list with instant turn-in buttons.

2. **Assignments Hub (`AssignmentsScreen`)**:
   - Filter segmented bar (`All`, `Pending`, `Submitted`).
   - Cards showing subject, title, deadline, points, and status.
   - Interactive bottom-sheet submission modal with note entry.

3. **Attendance & Roll Call (`AttendanceScreen`)**:
   - Circular compliance gauge (75% threshold warning/safe indicator).
   - Lecture session logs with time slots and status chips (`Present`, `Late`, `Absent`).

4. **Cohort Polls (`PollsScreen`)**:
   - 1-tap live voting with animated percentage fill bars.
   - Real-time vote recount on selection.

5. **Profile & Class Settings (`ProfileScreen`)**:
   - Instagram-style profile header with story ring avatar and stats row.
   - 1-tap dark/light mode switcher.
   - Student / Class Representative role switch.
   - Class access key chip (`MECH3A`).

---

## 🚀 How to Run

Ensure Flutter SDK is installed on your development machine:

```bash
# Verify Flutter installation
flutter doctor

# Navigate to the mobile directory
cd mobile

# Get dependencies
flutter pub get

# Run on connected phone (Android / iOS) or Chrome
flutter run
```

### Supported Platforms
- Android (API 21+)
- iOS (iOS 12.0+)
- Flutter Web & Desktop
