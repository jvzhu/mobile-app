# Mobile App

A production-ready React Native mobile application built with Expo and TypeScript.

## Features

- **Authentication** — JWT login/register/forgot-password with token auto-refresh
- **Navigation** — Stack, Tab, and Drawer navigators (React Navigation v6)
- **State Management** — Redux Toolkit with redux-persist
- **Theme** — Dark/Light mode with a full design-token system
- **API Layer** — Axios client with interceptors, automatic token refresh, and retry logic
- **Push Notifications** — Expo Notifications integration
- **Offline Support** — NetInfo-aware NetworkBanner and persisted Redux state
- **i18n** — English & Spanish via i18next/react-i18next
- **Forms** — React Hook Form + Yup validation
- **Secure Storage** — expo-secure-store for tokens, AsyncStorage for app data
- **Testing** — Jest + Testing Library for React Native
- **CI/CD** — GitHub Actions for type-check, lint, test, and EAS Build

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env

# 3. Start the development server
npx expo start
```

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with **Expo Go**.

## Project Structure

```
mobile-app/
├── App.tsx                  # Root component (all providers)
├── app.json                 # Expo configuration
├── eas.json                 # EAS Build profiles
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/              # Primitives (Button, Input, Card, …)
│   │   ├── forms/           # React Hook Form wrappers
│   │   ├── layout/          # Screen, Header, ErrorBoundary, …
│   │   └── common/          # LoadingOverlay, NetworkBanner, …
│   ├── constants/           # API endpoints, colors, storage keys
│   ├── contexts/            # ThemeContext, AuthContext
│   ├── hooks/               # Custom hooks (useAuth, useTheme, …)
│   ├── i18n/                # Localization (en, es)
│   ├── navigation/          # Root / Auth / Main / Drawer navigators
│   ├── screens/             # Auth, Home, Tasks, Profile, Settings, Search
│   ├── services/            # API client + service layer
│   ├── store/               # Redux store, slices, middleware
│   ├── theme/               # Light & dark themes, typography, spacing
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Storage, validation, formatting, logger
├── docs/
│   ├── SETUP.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
└── .github/workflows/       # CI and EAS Build workflows
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Launch on Android |
| `npm run ios` | Launch on iOS |
| `npm test` | Run Jest tests |
| `npm run test:coverage` | Tests with coverage report |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript type check |
| `npm run build:android` | EAS build for Android |
| `npm run build:ios` | EAS build for iOS |

## Documentation

- [Setup Guide](docs/SETUP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment](docs/DEPLOYMENT.md)

## Tech Stack

| Category | Library |
|----------|---------|
| Framework | React Native 0.74 + Expo ~51 |
| Language | TypeScript ~5.3 |
| Navigation | React Navigation 6 |
| State | Redux Toolkit + redux-persist |
| API | Axios |
| Forms | React Hook Form + Yup |
| Auth storage | expo-secure-store |
| Notifications | expo-notifications |
| i18n | i18next + react-i18next |
| Testing | Jest + Testing Library |
| Builds | Expo EAS |
