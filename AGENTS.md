# AGENTS.md

## Project Overview

Build a high-fidelity clone of the Copilot Financial App in < 6 hours using **React Native + Expo (Development Builds)**. The goal is to demonstrate senior-level architecture, UI precision, and performance optimization. This is a technical challenge for https://trashlab.com/. We were requested to do this to have a grasp of my skills as a React Native Engineer.

### Technical Stack

- **Runtime:** Expo Development Build (No Expo Go). Targets iOS 18 and iOS 26.
- **Package Manager:** `yarn` (Mandatory).
- **Persistence:** `react-native-mmkv` for high-speed key-value storage.
- **Local DB:** `expo-sqlite` for relational financial data (Transactions, Categories, Budgets).
- **State management:** `context API` should be sufficient for this project.
- **Navigation:** `expo-router` with Swipeable Segmented Control.
- **Styling:** Centralized `theme.ts` (Dark/Light support).

---

## 🏗 Architecture: Feature-Based (Screaming Architecture)

Organize the project by domain features to ensure scalability and modularity.

```text
src/
├── app/             # Use expo-router for file based routing
├── api/             # Mock data generators and providers
├── db/              # Mock data generators and providers
├── components/      # Shared UI primitives (Buttons, Typography, Progress Indicators)
├── core/            # Config, Theme (theme.ts), Store/DB initialization
├── hooks/           # Global hooks (useTheme, useDatabase)
└── features/        # Domain-specific logic and screens
    ├── dashboard/   # Main spending graph, "To Review" cards
    ├── categories/  # Budget progress bars, nested lists
    ├── recurrings/  # Subscription timeline, payment status
    └── goals/       # Radial progress, savings targets
```

## Strategic Milestones

### 1. Foundation & Theme

- Initialize with yarn.
- Setup `src/core/theme.ts`. Define a strict color palette matching TrashLab Dark/Light modes.
- Implement a ThemeProvider for consistent styling across functional components.

### 2. Database & Persistence Layer

- **MMKV Setup:** Use for user preferences, flags, and session state.
- **expo-sqlite Setup:** Define schemas/tables for Transaction, Category, Budget, and Goal.
- Create a seeding utility to populate the app with mock data on the first launch.

### 3. Navigation & Gestures

- Implement the top Segmented Control using `expo-router`.
- **Swipe Logic:** Transitions between "Dashboard", "Categories", "Recurrings", and "Goals" must support horizontal swipes (using `react-native-pager-view` or `react-native-reanimated`).

### 4. High-Fidelity UI Implementation

- **Dashboard:** Implement the spending curve using `react-native-skia`.
- **Categories:** Hierarchical list with custom progress bars (Spent vs. Budget).
- **Recurrings:** Clean list with icons, sorted by date.
- **Goals:** Radial progress indicators with "saved vs. remaining" stats.

### 5. Native & Performance Polish

- Ensure flawless execution on both iOS and Android emulators.
- Proper Safe Area handling for modern notches/dynamic islands.
- Use FlashList for all list implementations to maintain 60fps.

---

## 🤖 Instance Roles (For Multi-Agent Workflows)

- **Agent 1 (Architect/Data):** Handle expo-sqlite/MMKV schemas, database providers, mock data seeding, and core business logic in `features/`.
- **Agent 2 (UI/UX Specialist):** Handle `theme.ts`, complex animations (Skia/Reanimated), swipe gestures for navigation, and pixel-perfect component matching.

---

## Progress (Current State)

- **Foundation in place:** Feature-based `src/` layout (`core`, `components`, `hooks`, `features`, `api`, `db`). `app/` remains at repo root; `@/*` resolves to `src/*`.
- **Theme:** TrashLab `theme.ts` in `src/core/theme.ts` with `getThemeColors(mode)`. `ThemeProvider` and `useTheme()` in `src/core/ThemeContext.tsx`. Root layout wrapped with `ThemeProvider`; `StatusBar` set to auto.
- **Libraries installed:** expo-dev-client, react-native-mmkv, expo-sqlite, react-native-pager-view, @shopify/flash-list, @shopify/react-native-skia. Package manager: yarn.
- **Targets:** iOS 18 and iOS 26. No expo-glass-effect or @expo/ui; segmented control will be JS-based for compatibility.
- **Stub screens:** `src/features/{dashboard,categories,recurrings,goals}/index.tsx` export placeholder screens.

---

## ⚠️ Critical Constraints

- **No Expo Go:** Strictly target Development Builds.
- **No Financial APIs:** Data must be strictly local and mocked.
- **Strictly Functional:** Responses must be technical, dry, and direct. No filler or value judgments.
