<div align="center">

# 🎓 StudySync
### Modern Academic Class Coordination & Productivity Command Center

[![CI Status](https://github.com/bash30ribs/studysync/actions/workflows/ci.yml/badge.svg)](https://github.com/bash30ribs/studysync/actions)
[![React 19](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 6.0](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.4-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind-v4.3-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tested%20with-Vitest-FCC72B?style=flat-square&logo=vitest)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

<p align="center">
  <b>StudySync</b> is a lightweight, high-velocity class coordination platform bridging the gap between Class Representatives (CRs) and students. Eliminate missed deadlines, fragmented WhatsApp chaos, and coordination friction with real-time consensus, automated reminders, and calendar synchronization.
</p>

</div>

---

## ⚡ Key Highlights & Features

### 📅 Smart Assignment & Schedule Engine
- **Deadline Cadence & Smart Suggester**: AI-assisted assignment scheduling that avoids exam and lab clashes.
- **RFC 5545 iCal & Google Calendar Sync**: 1-click export to Google Calendar, Apple Calendar, and Outlook with automated 24h reminders.
- **Submission Pace Predictor**: Visual progress analytics comparing current cohort turn-in rate against historical averages.

### 📢 High-Trust CR Operations
- **Streamlined Command Hub**: Decluttered, distraction-free CR overview focusing on actionable deadlines, 1-tap broadcasts, and real-time turn-in ratios.
- **Urgent Broadcasts**: Instantly dispatch pinned announcements with character countdown and real-time delivery.
- **Consensus Polls**: Rapid single & multi-choice polls for exam prep reschedule requests and class feedback.
- **Verified Digital Submissions**: Cryptographic submission hashes, device proofs, and timestamps for dispute-free grading.
- **Attendance Session Tracker**: Fast roster roll-calls with exportable attendance CSV reports.
- **Personal Student Analytics**: Detailed attendance audit, defaulter threshold tracking, and per-subject breakdown.
- **Flutter Mobile Companion**: Cross-platform mobile app in `mobile/` with offline cache awareness.

### 🎧 Deep Focus & Gamification Layer
- **Procedural Soundscapes**: Web Audio synthesizer with Brown Noise, Rain, Pink Noise, and 10Hz Alpha Binaural beats without heavy audio assets.
- **Academic Streaks & Badges**: Gamified study habits with streak multipliers, XP progression, and daily study quests.
- **Global Command Palette (`⌘ + K`)**: Lightning-fast universal navigation across all class resources and views.
- **Offline PWA Support**: Progressive Web App with caching and instant mobile install capability.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    A[Student / CR Browser] -->|Interactions| B[StudySync React 19 Frontend]
    B --> C[Global State Store / Context & LocalStorage]
    B --> D[Command Palette Engine Cmd+K]
    B --> E[Web Audio Soundscapes Synthesizer]
    B --> F[iCal / Google Calendar Exporter]
    B --> G[Gradebook & CSV Report Generator]
    B --> H[PWA Service Worker & Cache]
```

---

## ⌨️ Power User Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| <kbd>⌘</kbd> + <kbd>K</kbd> / <kbd>Ctrl</kbd> + <kbd>K</kbd> | Open Global Command Palette |
| <kbd>G</kbd> then <kbd>D</kbd> | Navigate to Main Dashboard |
| <kbd>G</kbd> then <kbd>A</kbd> | Navigate to Assignments Hub |
| <kbd>G</kbd> then <kbd>C</kbd> | Navigate to Class Schedule & Calendar |
| <kbd>G</kbd> then <kbd>R</kbd> | Navigate to Resource Library |
| <kbd>N</kbd> then <kbd>A</kbd> | Quick Modal to Create New Assignment |
| <kbd>N</kbd> then <kbd>B</kbd> | Quick Modal to Create Emergency Broadcast |
| <kbd>Alt</kbd> + <kbd>S</kbd> | Open Focus Soundscapes Ambient Player |
| <kbd>?</kbd> | Open Keyboard Shortcuts Cheat Sheet |

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- **Node.js**: `v20.x` or higher
- **npm**: `v10.x` or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/bash30ribs/studysync.git
cd studysync

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:5173` to explore StudySync locally.

---

## 🧪 Testing & Verification

```bash
# Run unit test suite
npm run test

# Run fast linter
npm run lint

# Build production bundle with optimized chunking
npm run build
```

---

## 🛠️ Tech Stack & Tooling

- **Core**: React 19, TypeScript 6.0, Vite 6
- **Styling**: Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Audio Synthesis**: Web Audio API (Brownian & Pink noise oscillators, stereo panning)
- **Quality**: Vitest, Oxlint, GitHub Actions CI Pipeline

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.
