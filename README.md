# TrashLab Challenge – Copilot Financial Clone 👋

High-fidelity clone of the Copilot Financial App for the [TrashLab](https://trashlab.com/) technical challenge. React Native + Expo (Development Builds), feature-based architecture, dark/light theme.

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [Yarn](https://yarnpkg.com/) (package manager for this project)
- Xcode (iOS simulator and/or physical device)
- Android Studio (optional, for Android)

## Get started

### 1. Install dependencies

```bash
yarn install
```

### 2. Run the app

**iOS (simulator or device)**

```bash
yarn ios
```

To run on a connected physical device (e.g. iPhone):

```bash
yarn ios --device
```

**Development server only**

```bash
yarn start
```

Then press `i` for iOS simulator or `a` for Android emulator. Use a [development build](https://docs.expo.dev/develop/development-builds/introduction/) (no Expo Go).

### 3. Reset starter (optional)

```bash
yarn reset-project
```

Moves starter code to `app-example` and gives a blank `app` directory.

## Project structure

- `app/` – Expo Router file-based routes (root)
- `src/core/` – Theme (`theme.ts`), `ThemeProvider`, config
- `src/components/` – Shared UI (buttons, typography, progress)
- `src/features/` – Dashboard, Categories, Recurrings, Goals
- `src/hooks/` – `useTheme`, `useColorScheme`, `useDatabase`
- `src/api/` – Mock data and providers
- `src/db/` – MMKV + expo-sqlite setup

## Features

- Budget overview and spending curve (Dashboard)
- Category budgets with progress (Categories)
- Recurring payments timeline (Recurrings)
- Savings goals with radial progress (Goals)
- Dark/Light theme (TrashLab palette)
- Swipeable segmented navigation
- Targets iOS 18 and iOS 26 (no Expo Go)

## Learn more

- [Expo docs](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [Development builds](https://docs.expo.dev/develop/development-builds/introduction/)
