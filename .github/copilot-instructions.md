# Forma App - React Native Expo Project

## Project Overview
This is a React Native Expo project for cross-platform mobile development. It uses Expo Router for navigation and includes pre-configured support for iOS, Android, and web platforms.

## Technology Stack
- **Framework**: React Native with Expo
- **Navigation**: Expo Router v6
- **React Version**: 19.1.0
- **Expo Version**: ~54.0.32
- **TypeScript**: Yes (tsconfig.json configured)
- **Node Version**: v22.14.0 or higher
- **npm Version**: 11.6.1 or higher

## Project Structure
```
forma_app/
├── app/                    # Expo Router app directory with routes
├── assets/                 # Images, fonts, and other static assets
├── components/             # Reusable React components
├── constants/              # App constants and configuration
├── hooks/                  # Custom React hooks
├── scripts/                # Build and utility scripts
├── package.json            # Project dependencies and scripts
├── app.json                # Expo configuration
├── tsconfig.json           # TypeScript configuration
└── eslint.config.js        # ESLint configuration
```

## Available Commands

### Development
- `npm start` - Start the Expo development server
- `npm run android` - Build and run on Android emulator/device
- `npm run ios` - Build and run on iOS simulator (requires macOS)
- `npm run web` - Run web version in browser

### Code Quality
- `npm run lint` - Run ESLint to check code quality

### Maintenance
- `npm run reset-project` - Reset project to default template state

## Getting Started

1. **Install dependencies** (already done during project creation):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm start
   ```

3. **Run on a platform**:
   - Press `w` to run on web
   - Press `a` to run on Android
   - Press `i` to run on iOS (macOS only)
   - Or use dedicated npm commands listed above

## Key Features
- ✅ Expo Router v6 with file-based routing
- ✅ TypeScript support
- ✅ React Navigation integration
- ✅ Vector icons support
- ✅ Haptics and system UI integration
- ✅ Web support via Expo Web
- ✅ Dark mode support
- ✅ New React Compiler enabled (experimental)
- ✅ Type-safe routes enabled

## Development Tips
- Hot reload is enabled by default during `npm start`
- Use the Expo Go app on physical devices for quick testing
- For iOS development on Mac, use Xcode or ios simulator
- For Android, use Android Studio or connected Android device
- Web development available through the browser

## Additional Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router Guide](https://expo.github.io/router/introduction)
- [React Navigation](https://reactnavigation.org/)
