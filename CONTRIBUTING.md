# Contributing to StudySync 🎓

Thank you for your interest in contributing to **StudySync**! StudySync is built to empower college Class Representatives (CRs) and students with modern, friction-free class operations.

---

## 🛠️ Local Development Setup

### Prerequisites
- **Node.js**: v18 or higher
- **npm**: v9 or higher
- **Flutter SDK**: (Optional, for mobile app development in `mobile/`)

### Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone git@github.com:bash30ribs/studysync.git
   cd studysync
   ```

2. **Install web dependencies**:
   ```bash
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Run the test suite**:
   ```bash
   npm test -- --run
   ```

5. **Verify the production build**:
   ```bash
   npm run build
   ```

---

## 📐 Design & Engineering Principles

1. **Clean, Honest UI**:
   - Never introduce fake reviews, inflated social proof numbers, or deceptive marketing claims.
   - Respect user focus: Avoid dashboard widget bloat. If a feature has its own tab, keep the dashboard focused on actionable tasks.

2. **Color Palette & Contrast**:
   - Dark theme uses pure `#000000` base, `#121212` / `#181818` card surfaces, and `#262626` borders.
   - Primary action color is clean Instagram blue (`#0095F6`).
   - Avoid neon/saturated teals or low-contrast text.

3. **Security & Data Integrity**:
   - Always sanitize user input in CSV exports using `escapeCSV` to neutralize spreadsheet formula injection (`=`, `+`, `-`, `@`).
   - Mask sensitive cohort codes in shared navigation until explicitly revealed.

4. **Component Design**:
   - Maintain full TypeScript typing with strict interfaces in `src/types/`.
   - Prefer shared utilities in `src/utils/` over inline duplicates.
   - Add unit tests in `src/test/` for all business logic, export helpers, and validation utilities.

---

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature for users
- `fix:` A bug fix
- `docs:` Documentation changes
- `test:` Adding or updating tests
- `refactor:` Code restructuring without behavior changes
- `style:` Formatting or UI styling polish

**Example**:
```bash
git commit -m "feat(dashboard): streamline CR dashboard into focused command hub"
```

---

## 🤝 Pull Request Checklist

Before submitting a PR:
- [ ] `npm test -- --run` passes cleanly with all tests green.
- [ ] `npm run build` completes with zero TypeScript errors.
- [ ] All new utilities or state helpers have corresponding unit tests.
- [ ] Git commit history is clean and descriptive.
