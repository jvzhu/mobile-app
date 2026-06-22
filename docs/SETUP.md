# Setup & Installation Guide

## Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI (`npm install -g expo-cli` or `npx expo`)
- EAS CLI (`npm install -g eas-cli`)
- iOS: Xcode 15+ (macOS only)
- Android: Android Studio with SDK 34+

## Quick Start

### 1. Clone and Install

```bash
git clone <repo-url>
cd mobile-app
npm install
```

### 2. Environment Setup

```bash
cp .env.example .env
```

Edit `.env` with your actual values:
- `API_BASE_URL` — Your backend API URL
- `EAS_PROJECT_ID` — From EAS dashboard

### 3. Start Development Server

```bash
npx expo start
```

Press `i` for iOS Simulator, `a` for Android Emulator, or scan the QR code with Expo Go.

## TypeScript Path Aliases

The project uses path aliases configured in both `tsconfig.json` and `babel.config.js`:

```ts
import { Button } from '@components/ui/Button';
import { useAuth } from '@hooks/useAuth';
import { taskService } from '@services/task.service';
```

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## Type Checking

```bash
npm run type-check
```

## EAS Setup

### Login to EAS
```bash
eas login
```

### Configure Project
```bash
eas build:configure
```

Update `eas.json` with your project details.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `API_BASE_URL` | Backend API base URL | Yes |
| `API_TIMEOUT` | Request timeout in ms | No (30000) |
| `APP_ENV` | development/staging/production | No |
| `EAS_PROJECT_ID` | EAS project ID | Yes |
| `SENTRY_DSN` | Sentry error tracking DSN | No |

## Troubleshooting

### Metro bundler cache issues
```bash
npx expo start --clear
```

### iOS build issues
```bash
cd ios && pod install && cd ..
```

### Android build issues
```bash
cd android && ./gradlew clean && cd ..
```

### Module resolution errors
Ensure `babel.config.js` and `tsconfig.json` path aliases match exactly.
