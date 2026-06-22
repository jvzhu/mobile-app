# Deployment Guide

## Building with EAS Build

### Prerequisites
- Expo account
- EAS CLI: `npm install -g eas-cli`
- `eas login`

### Development Build

```bash
# Android APK
eas build --profile development --platform android

# iOS (requires Apple Developer account)
eas build --profile development --platform ios
```

### Preview Build (Internal Testing)

```bash
eas build --profile preview --platform all
```

Preview builds are distributed internally — share the install link with testers.

### Production Build

```bash
# Android AAB (for Play Store)
eas build --profile production --platform android

# iOS IPA (for App Store)
eas build --profile production --platform ios
```

## Submitting to Stores

### Google Play Store

1. Create app in [Google Play Console](https://play.google.com/console)
2. Download service account key (`google-services-key.json`)
3. Update `eas.json` with your app package name
4. Run:

```bash
eas submit --platform android --profile production
```

### Apple App Store

1. Create app in [App Store Connect](https://appstoreconnect.apple.com)
2. Update `eas.json` with your Apple credentials
3. Run:

```bash
eas submit --platform ios --profile production
```

## Over-The-Air (OTA) Updates

With Expo Updates, you can push JavaScript-only updates without going through the store review process.

```bash
eas update --branch production --message "Bug fix"
```

### Update Channels
- `development` — for dev builds
- `preview` — for internal testing
- `production` — for production users

## Environment Configuration

| Profile | Purpose | Distribution |
|---------|---------|-------------|
| `development` | Local dev with dev client | Internal |
| `preview` | QA testing | Internal |
| `production` | App store releases | External |

## CI/CD Pipeline

The repository includes GitHub Actions workflows:

- **ci.yml** — Runs on every PR: type-check, lint, tests
- **build.yml** — Runs on push to `main`: EAS Build for staging/production

### Setting up GitHub Secrets

Add these secrets to your GitHub repository:

| Secret | Description |
|--------|-------------|
| `EXPO_TOKEN` | EAS CLI authentication token |
| `APPLE_ID` | Apple ID for App Store submissions |
| `APPLE_TEAM_ID` | Apple Developer Team ID |
| `ASC_APP_ID` | App Store Connect App ID |

Get your Expo token:
```bash
expo whoami
expo login
# Then go to https://expo.dev/accounts/[username]/settings/access-tokens
```

## Version Management

Update app version in `app.json`:
```json
{
  "expo": {
    "version": "1.2.0",
    "ios": { "buildNumber": "5" },
    "android": { "versionCode": 5 }
  }
}
```

## Monitoring

- **Expo Insights** — Built-in analytics for Expo apps
- **Sentry** — Error tracking (add `SENTRY_DSN` env var)
- **EAS Metadata** — App store listing management

## Rollback

To rollback an OTA update:
```bash
eas update --branch production --message "Rollback" --republish --group <previous-group-id>
```

For native build rollback, resubmit a previous build from EAS dashboard.
