# StudySync — System Memory & Project Architecture Reference
> **Permanent Living Documentation**  
> *Last Updated*: October 2026 · StudySync v1.1.0  
> *Repository*: [github.com/bash30ribs/studysync](https://github.com/bash30ribs/studysync)  
> *Production Host*: [studysync-ohdj.onrender.com](https://studysync-ohdj.onrender.com)  

---

## 1. Project Overview & Core Mission

**StudySync** is a unified, high-performance academic command center engineered to streamline day-to-day cohort coordination between **Students**, **Class Representatives (CRs)**, and **Faculty / Teachers**.

### Key Problem It Solves
- Eliminates buried messages across WhatsApp and informal class groups.
- Provides cryptographic SHA-256 receipts for assignment submissions to eliminate "I submitted, but it got lost" disputes.
- Automates attendance monitoring with real-time 75% threshold "bunk radar" calculations.
- Establishes transparent Faculty oversight with signoff queues for CR broadcasts and holistic student credit accreditation.

---

## 2. System Architecture & Dual-Engine Design

StudySync implements a dual-engine architecture to support both rich React component workflows and a zero-dependency, ultra-lightweight standalone HTML workspace.

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             STUDYSYNC v1.1.0                             │
├─────────────────────────────────────┬────────────────────────────────────┤
│         REACT / TS ENGINE           │      STANDALONE HTML ENGINE        │
│    (src/App.tsx, Vite 6, Tailwind)  │ (public/workspace.html & root)     │
├─────────────────────────────────────┼────────────────────────────────────┤
│ • React 19 + TypeScript + Tailwind  │ • Single-file zero-dependency app  │
│ • StudySyncProvider global store    │ • Dual view (Landing + Workspace)  │
│ • Modular view components           │ • Procedural Web Audio synthesizer │
│ • Synchronous localStorage sync     │ • Native RAF tick & physics cursor │
│ • Validated by appRender & vitest   │ • Validated by workspaceFeatures   │
└─────────────────────────────────────┴────────────────────────────────────┘
                                   │
                                   ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      BACKEND & DATA LAYER (server/)                      │
│ • Express server with Multer uploads (/uploads)                          │
│ • Real-time Server-Sent Events (/api/events) for cohort updates          │
│ • Relative API endpoints (/api/*) compatible with Render HTTPS hosting   │
│ • Offline-first resilience: 100% functional via localStorage fallback    │
└──────────────────────────────────────────────────────────────────────────┘
```

### ⚠️ Strict Invariant: HTML Dual-Copy Synchronization
`public/workspace.html` and `workspace.html` (at root) **MUST REMAIN 100% BYTE-FOR-BYTE IDENTICAL**.  
Integration test `src/test/workspaceFeatures.test.ts` asserts:
```typescript
expect(publicHtml).toBe(rootHtml);
```
Any modification made to `public/workspace.html` must always be mirrored to `workspace.html` (e.g., via `cp public/workspace.html workspace.html`).

---

## 3. User Personas & Role Permissions

The application features three distinct personas with dedicated interfaces, custom navigation tabs, and permission boundaries:

| Persona | Active User | Role Key | Core Focus & Views |
| :--- | :--- | :--- | :--- |
| **Student** | Aaditya Verma (`CS21571`) | `STUDENT` | **My Station**: Personal tasks, attendance meter, bunk calculator, receipt generation, extracurricular growth portfolio. |
| **Class Rep (CR)** | Ribhav Sharma (`CS21532`) | `CR` | **Command Center**: Cohort metrics (48 students), brief attachment, deadline editing, interactive attendance radar, roster, broadcast dispatch, poll creation. |
| **Teacher / Faculty** | Dr. M. Sundaram | `FACULTY` | **Executive Dashboard**: Department KPIs, approval queues for broadcast signoffs & growth accreditation, multi-cohort defaulter radar. |

### Role Feature Matrix

```
FEATURE                          STUDENT        CR          FACULTY / HOD
───────────────────────────────────────────────────────────────────────────
My Station Dashboard                ✅          ❌               ❌
Command Center (Cohort Stats)       ❌          ✅               ❌
Executive Multi-Cohort Dashboard    ❌          ❌               ✅
Submit Assignment + SHA-256 Receipt ✅          ❌               ❌
Create Assignment + Attach PDF      ❌          ✅               ❌
Edit Deadlines / Nudge Defaulters   ❌          ✅               ✅
Take Attendance (Interactive Radar) ❌          ✅               ✅
View Own Attendance & Deficit       ✅          ✅               ✅
Submit Holistic Growth Activity     ✅          ❌               ❌
Accredit & Award Growth Points      ❌          ❌               ✅
Approve / Reject CR Broadcasts      ❌          ❌               ✅
Publish Direct Broadcasts           ❌          ✅               ✅
Create Anonymous Class Polls        ❌          ✅               ✅
Vote in Active Polls                ✅          ✅               ✅
Export Cohort CSV / Backup JSON     ❌          ✅               ✅
Focus Soundscapes (Web Audio)       ✅          ✅               ✅
───────────────────────────────────────────────────────────────────────────
```

---

## 4. Navigation & Back Gesture Mechanics

### Problem Previously Encountered
Browser swipe back or hardware back buttons previously dumped the user back to `/` (landing page), losing application state and closing active modals prematurely.

### Implemented Resolution
Both engines now implement a multi-tier `popstate` stack:

1. **Tier 1 — Modals & Overlays**:
   - When a modal opens, `{ view: 'workspace', modal: true }` is pushed to history.
   - Performing a back gesture closes the modal cleanly without changing views or tabs.
2. **Tier 2 — Mobile Drawer**:
   - If the mobile navigation drawer is expanded, back collapses it.
3. **Tier 3 — Tab Navigation**:
   - Changing tabs pushes history (`#assignments`, `#attendance`, etc.).
   - Back gesture steps back to the previously active tab or `#dashboard`.
4. **Tier 4 — Landing Transition**:
   - The application transitions to `#landing` **only** when navigating back beyond the root dashboard.
5. **Keyboard Shortcuts**:
   - `Alt + ←` or `Backspace` (outside input fields) triggers `handleWorkspaceBack()` / `goBack()`.
   - Visible `#wsBackBtn` (HTML) and `#nav-back-button` (React) provide intuitive mouse/touch fallbacks.

---

## 5. Live Backend & Render Deployment Configuration

- **Hosted URL**: `https://studysync-ohdj.onrender.com`
- **Render Hostname Configuration**:
  - `vite.config.ts` includes `server.allowedHosts: ['studysync-ohdj.onrender.com', '.onrender.com']` to prevent Vite 6 DNS-rebinding security rejections.
  - Port binding is dynamic: `port: process.env.PORT ? parseInt(process.env.PORT) : 5173`.
- **Relative Client Paths**:
  - `API_BASE` is set to `''` (relative root).
  - All upload URLs use `/uploads/...`.
  - SSE connection uses `/api/events`.
  - Eliminates mixed-content errors (`http://localhost:3001` vs `https://...`) on HTTPS deployments.
- **Vite Build Isolation**:
  - `vite.config.ts` does **not** import `server/index.js` or backend dependencies (`express`, `multer`) at build time.
  - Ensures `npm run build` succeeds on Render without missing package errors.
- **Offline / Local Fallback**:
  - If the backend is not mounted or the user is offline, the app switches to **Local Sync** mode.
  - All assignments, submissions, attendance logs, and polls persist safely to `localStorage`.

---

## 6. Interactive Features & No Dead Buttons

Every button in the interface triggers a real, functional state change:

1. **Take Attendance**:
   - Real-time modal with interactive student checkboxes.
   - Live attendee counter (`Commit session · X present`).
   - Updates student attendance percentages and session history dynamically upon commit.
2. **New Poll**:
   - Validates question and option inputs.
   - Injects poll directly into `state.polls` for instant cohort voting.
3. **Assignment Submission**:
   - Drag-and-drop file upload with image/PDF preview.
   - Generates authentic SHA-256 cryptographic receipt (`0x...`).
   - Updates submission counts and records immutable entry in ledger.
4. **New Assignment**:
   - Brief attachment dropzone (PDF/DOCX).
   - Generates unique assignment ID, cryptographic hash, and initial submission tracking.
5. **Growth Accreditation**:
   - Faculty approval queue with one-click **Accredit** (`+pts`) or **Reject/Return**.
   - Reflects in Student Growth Portfolio and updates leaderboards.
6. **Focus Soundscapes**:
   - Built-in Web Audio API tone generator (no external audio files required).
   - Supports `Rain`, `Brown Noise`, `Binaural Focus (200Hz/210Hz)`, and `Silence`.
7. **Nudge Defaulters**:
   - Context-aware alert dispatching targeting students under 75% attendance.
   - Visual button confirmation feedback (`✓ Dispatched`).
8. **Export Tools**:
   - Generates and downloads real CSV rosters, assignment reports, and full JSON state backups.

---

## 7. Key File Directory

| File Path | Description |
| :--- | :--- |
| [`public/workspace.html`](file:///home/ribs/freee/studysync/public/workspace.html) | Master standalone dual-view workspace (Landing + Tri-Role Workspace). |
| [`workspace.html`](file:///home/ribs/freee/studysync/workspace.html) | Byte-for-byte identical root mirror of `public/workspace.html`. |
| [`src/App.tsx`](file:///home/ribs/freee/studysync/src/App.tsx) | Core React app component, popstate navigation, dynamic titles, and tab routing. |
| [`src/store/index.tsx`](file:///home/ribs/freee/studysync/src/store/index.tsx) | Central React state manager with persistence, history stack, and demo presets. |
| [`src/utils/api.ts`](file:///home/ribs/freee/studysync/src/utils/api.ts) | Backend API client configured with relative routes and mock fallbacks. |
| [`src/components/layout/Header.tsx`](file:///home/ribs/freee/studysync/src/components/layout/Header.tsx) | App top bar with back navigation, role switcher, soundscapes, and sync status. |
| [`src/components/layout/LeftPanel.tsx`](file:///home/ribs/freee/studysync/src/components/layout/LeftPanel.tsx) | Triple-role navigation drawer with role-filtered menu items and class codes. |
| [`src/components/dashboard/`](file:///home/ribs/freee/studysync/src/components/dashboard/) | Persona dashboards: `CRDashboard.tsx` and `StudentDashboard.tsx`. |
| [`src/components/faculty/FacultyOversightView.tsx`](file:///home/ribs/freee/studysync/src/components/faculty/FacultyOversightView.tsx) | Faculty executive oversight, approval queues, and cohort defaulter monitoring. |
| [`src/components/growth/HolisticGrowthView.tsx`](file:///home/ribs/freee/studysync/src/components/growth/HolisticGrowthView.tsx) | Student holistic growth portfolio and milestone submission deck. |
| [`server/index.js`](file:///home/ribs/freee/studysync/server/index.js) | Standalone Express backend server (Multer uploads, SSE push, activity feed). |
| [`vite.config.ts`](file:///home/ribs/freee/studysync/vite.config.ts) | Vite 6 build configuration with Render allowed hosts and dynamic port binding. |
| [`package.json`](file:///home/ribs/freee/studysync/package.json) | Project scripts, dependencies, engine requirements, and metadata. |

---

## 8. Verification & Maintenance Commands

Always run these commands before committing changes:

```bash
# 1. Verify TypeScript compiles with zero errors
npm run typecheck

# 2. Verify code standards and linting
npm run lint

# 3. Run all unit and integration test suites (79 tests across 12 files)
npm run test

# 4. Verify production bundle builds cleanly
npm run build

# 5. Mirror workspace.html (MANDATORY whenever public/workspace.html changes)
cp public/workspace.html workspace.html
```

---

## 9. Recent Git Commit Log

- `main`: `fix(theme): replace muted steel blue with vibrant high-contrast blue and eliminate text blur filters`
- `6c40167`: `docs: add comprehensive memory.md architecture and system reference`
- `24c71cf`: `fix(build): remove express import from vite.config.ts to resolve Render build failure`
- `bd23074`: `fix: back gesture navigation, live backend sync, and role action wiring`
- `1504b84`: `fix(vite): allow Render domain host and sync workspace features`
- `fca812a`: `feat: implement role-driven tri-view architecture for student station, CR command center, and faculty oversight with approval queue`
