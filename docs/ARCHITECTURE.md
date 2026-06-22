# Architecture Documentation

## Overview

This is a production-ready React Native mobile application built with Expo, TypeScript, Redux Toolkit, and React Navigation.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React Native + Expo ~51 |
| Language | TypeScript ~5.3 (strict mode) |
| State Management | Redux Toolkit + redux-persist |
| Navigation | React Navigation 6 (Stack + Tabs + Drawer) |
| API Client | Axios with interceptors |
| Forms | React Hook Form + Yup |
| Auth Storage | expo-secure-store |
| Local Storage | AsyncStorage |
| i18n | i18next + react-i18next |
| Testing | Jest + @testing-library/react-native |

## Project Structure

```
src/
├── types/          # TypeScript type definitions
├── constants/      # App-wide constants (API, colors, strings)
├── utils/          # Pure utility functions
├── services/       # API and external service integrations
├── store/          # Redux store, slices, middleware
│   ├── slices/     # Redux slices (auth, tasks, notifications, ui)
│   └── middleware/ # Custom Redux middleware
├── contexts/       # React contexts (Theme, Auth)
├── theme/          # Design tokens (colors, spacing, typography)
├── i18n/           # Internationalization (en, es)
├── hooks/          # Custom React hooks
├── components/     # Reusable UI components
│   ├── ui/         # Base UI primitives
│   ├── forms/      # Form-specific components
│   ├── layout/     # Layout components
│   └── common/     # App-wide common components
├── navigation/     # React Navigation setup
│   ├── index.tsx   # Root navigator
│   ├── AuthNavigator.tsx
│   ├── MainNavigator.tsx (tabs)
│   ├── DrawerNavigator.tsx
│   ├── HomeNavigator.tsx
│   ├── TaskNavigator.tsx
│   ├── linking.ts  # Deep linking config
│   └── options.ts  # Navigation options
├── screens/        # Screen components
│   ├── auth/       # Login, Register, ForgotPassword, ResetPassword
│   ├── home/       # Home, Notifications
│   ├── profile/    # Profile, EditProfile
│   ├── settings/   # Settings
│   ├── tasks/      # TaskList, TaskDetail, CreateTask, EditTask
│   └── search/     # Search
└── assets/         # Images, fonts, icons
```

## State Management

### Redux Store
The app uses Redux Toolkit with four slices:

- **authSlice** — User authentication state, tokens
- **taskSlice** — Tasks CRUD state with pagination
- **notificationSlice** — Push notifications and in-app notifications
- **uiSlice** — Theme mode, language, loading state, toast messages

Redux Persist is configured to persist `auth` and `ui` slices to AsyncStorage.

### API Middleware
Custom `apiMiddleware` listens for rejected async thunks and automatically shows toast error messages.

## Authentication Flow

1. App starts → `restoreAuthThunk` checks SecureStore for existing tokens
2. If tokens exist → user is authenticated → Main navigator shown
3. If no tokens → Auth navigator shown
4. On login → tokens saved to SecureStore via `storageService`
5. API requests → `Authorization: ****** header injected by Axios interceptor
6. On 401 response → automatic token refresh attempted
7. If refresh fails → user logged out, tokens cleared

## Navigation Architecture

```
Root Stack
├── Auth Stack (unauthenticated)
│   ├── Login
│   ├── Register
│   ├── ForgotPassword
│   └── ResetPassword
└── Drawer Navigator (authenticated)
    ├── Main Tab Navigator
    │   ├── Home Stack (Home, Notifications)
    │   ├── Task Stack (TaskList, TaskDetail, CreateTask, EditTask)
    │   ├── Search Screen
    │   └── Profile Stack (Profile, EditProfile, Settings)
    └── Settings Screen
```

## Theme System

The app supports light, dark, and system (auto) themes:

- `ThemeContext` wraps the app and provides the resolved theme
- Theme is persisted to AsyncStorage
- `useTheme()` hook provides access to colors, spacing, typography
- All components use theme colors from `theme.colors.*`

## API Layer

```
services/api.ts           # Axios instance with interceptors
services/auth.service.ts  # Auth operations
services/user.service.ts  # User profile operations
services/task.service.ts  # Task CRUD operations
services/notification.service.ts # Push notifications
services/storage.service.ts      # SecureStore wrapper
```

## Forms

All forms use React Hook Form + Yup validation:

```tsx
const { control, handleSubmit } = useForm<LoginCredentials>({
  resolver: yupResolver(loginSchema),
});
```

The `FormInput` and `FormButton` components handle the boilerplate of connecting RHF `Controller` to UI components.

## Deep Linking

The app supports deep links with the `mobileapp://` scheme:

- `mobileapp://login` → Login screen
- `mobileapp://tasks/{id}` → Task detail
- `mobileapp://reset-password/{token}` → Reset password

## Internationalization

Two locales supported: English (`en`) and Spanish (`es`).

```ts
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
t('auth.loginTitle') // "Welcome Back"
```

Language preference is persisted to AsyncStorage.
