# TrashLab Challenge – Copilot Financial Clone 👋

High-fidelity clone of the Copilot Financial App for the [TrashLab](https://trashlab.com/) technical challenge. React Native + Expo (Development Builds), feature-based architecture, dark/light theme.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Yarn](https://yarnpkg.com/) (package manager for this project)
- Xcode (iOS simulator and/or physical device)
- Android Studio (optional, for Android)

## Installation & running

### 1. Install dependencies

```bash
yarn install
```

### 2. Prebuild (first time or after adding native modules)

```bash
yarn prebuild:ios
# or
yarn prebuild:android
```

### 3. Run the app

**iOS (simulator)**

```bash
yarn ios
```

**iOS on a specific device**

```bash
yarn ios --device
# or use the convenience scripts:
yarn ios:18   # iPhone 16 Pro
yarn ios:26   # iPhone 17 Pro
```

**Development server only**

```bash
yarn start
```

Then press `i` for iOS simulator or `a` for Android emulator. Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) (no Expo Go).

## Project structure

- `src/app/` – Expo Router: `_layout.tsx` (fonts, theme, DB init), `index.tsx` (main tab + pager)
- `src/core/` – Theme (`theme.ts`), `ThemeProvider`, `ThemeContext`, storage, shared types
- `src/components/` – Shared UI: `SegmentedControl`, `PagerPage`, `BudgetChart`, `CategoriesDonut`, etc.
- `src/features/` – Screens by domain: Dashboard, Categories, Recurrings, Goals (each with its own `index.tsx`)
- `src/hooks/` – `useTheme`, `useColorScheme`, `useDatabase`, `use-glass-capability`
- `src/db/` – expo-sqlite: `schema`, `seed`, `queries`, `initDb` (called at app boot)

## Architectural decisions

- **Single main route + PagerView:** One `index` route hosts a custom segmented header and `react-native-pager-view` for swipeable tabs (Dashboard, Categories, Recurrings, Goals). No Expo Router file-per-tab; focus keys drive per-screen animations when a tab is selected.
- **Feature-based layout:** Each feature lives under `src/features/<name>/` and exposes a single screen component. Shared logic and UI live in `src/core/` and `src/components/`.
- **Theme:** Central `theme.ts` (light/dark palettes), `ThemeProvider` in root layout, `useTheme()` in components. Path alias `@/` for imports.
- **Data:** expo-sqlite with a single schema (categories, budgets, transactions, goals, recurrings, etc.). `initDb()` runs in `_layout` before render; seed fills demo data and backfills empty goals/recurrings. Queries live in `db/queries.ts`; screens use hooks that call the DB.
- **Charts/Donuts:** Skia (`@shopify/react-native-skia`) for `CategoriesDonut` and budget visualizations; stroked-arc donuts and screen-scoped re-runs via `triggerKey`/focus keys.

## Libraries used

| Area                      | Libraries                                                                                                                                |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Core**                  | React 19, React Native 0.81, Expo SDK 54 (expo-router, expo-sqlite, expo-image, expo-splash-screen, expo-status-bar, expo-haptics, etc.) |
| **Navigation / UI**       | Expo Router (file-based), React Navigation (Stack), react-native-pager-view, react-native-screens, react-native-safe-area-context        |
| **Animations & gestures** | react-native-reanimated, react-native-gesture-handler                                                                                    |
| **Lists & performance**   | @shopify/flash-list                                                                                                                      |
| **Graphics**              | @shopify/react-native-skia                                                                                                               |
| **Data & storage**        | expo-sqlite, react-native-mmkv (core/storage)                                                                                            |
| **Fonts & assets**        | @expo-google-fonts/inter, @expo/vector-icons, expo-image                                                                                 |
| **Tooling**               | TypeScript 5.9, ESLint (eslint-config-expo), babel-plugin-module-resolver (`@/`)                                                         |

## Scalability

The structure is built to scale without artificial constraints:

- **Features** are isolated; new screens = new folders under `src/features/` and registration in the main pager/segmented control.
- **Core** holds cross-cutting concerns (theme, storage, types); components stay presentational and reusable.
- **DB** is behind `getDb()` and query helpers; swapping to a different backend or adding a sync layer would not require changing feature UI code.
- **No global state library** for this scope; theme and DB are enough. Redux/Zustand/React Query can be added per feature or at root if the product grows.

So there are no inherent scalability ceilings; the architecture allows adding features, theming, and data sources without refactors.

## Thought process & how Cursor helped

- **Goal:** Match the Copilot Financial look and behavior (tabs, charts, donuts, dark/light theme) in a maintainable React Native + Expo app.
- **Approach:** Start from a single index route and a pager, then add one feature at a time (Dashboard → Categories → Recurrings → Goals), reusing a shared theme and component set. Data was modeled in SQLite (schema + seed) so each screen could read real-shaped data.
- **Cursor’s role:** Used for fast iteration on layout and styling (e.g. SegmentedControl, card layouts, progress colors), for implementing Skia donuts and stroked-arc behavior, and for wiring DB seed/queries and focus-key animation triggers. Also used to fix tooling (e.g. ESLint unrs-resolver native binding) by adjusting config and stripping the TypeScript import resolver so the IDE and CLI both run cleanly. Decisions (feature layout, single pager, theme in core) were made explicitly; Cursor helped implement them and keep patterns consistent across files.
