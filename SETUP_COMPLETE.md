# React Native Expo Project Setup Guide

## ✅ Completed Setup Steps

This project has been fully configured with the following setup:

### 1. **React Native + Expo**
- Using Expo for faster development and easier testing
- Configured with React Native 0.81.5
- Expo Router for file-based navigation
- New Architecture enabled

### 2. **TypeScript**
- Strict mode enabled
- Path aliases configured (`@/*` maps to project root)
- Type safety across all files

### 3. **Navigation**
- React Navigation installed with bottom tabs navigation
- Expo Router for file-based routing
- Safe area context and gesture handlers configured

### 4. **HTTP Client - Axios**
- Axios installed for API requests
- Configured with environment-specific API endpoints:
  - **Development**: `http://localhost:3000/api`
  - **Staging**: `https://staging-api.formaapp.com/api`
  - **Production**: `https://api.formaapp.com/api`
- Auto-included auth token in requests
- Response interceptors for error handling (401 logout)
- Location: `src/config/api.ts`

### 5. **Environment Configuration**
- `.env` file with support for multiple environments
- `.env.example` for documentation
- Variables with `EXPO_PUBLIC_` prefix are accessible at runtime
- Environment variables:
  - API URLs for dev/staging/prod
  - Camera permissions flag
  - App version

### 6. **Camera Permissions**
- Expo Camera library installed
- Camera permissions configured in `app.json`
- Camera and microphone permissions declared
- Camera utility hook in `src/utils/camera.ts`
- Permission request wrapper for easy implementation

### 7. **UI Component Library - React Native Paper**
- Material Design components
- Theming support built-in
- Used for consistent UI across the app

### 8. **State Management - Zustand**
- Lightweight state management solution
- Two stores created:
  - **Auth Store** (`src/store/authStore.ts`): Manages user authentication state
  - **App Store** (`src/store/appStore.ts`): Manages app-wide settings (theme, language)
- Small bundle size, great performance

### 9. **Secure Storage - Expo Secure Store**
- Tokens stored securely using native OS keychain
- Wrapper utility in `src/utils/secureStorage.ts`
- Methods for:
  - Setting/getting/removing tokens
  - Setting/getting/removing user data
  - Clearing all secure storage

### 10. **Authentication Hook**
- Custom `useAuth()` hook in `src/hooks/useAuth.ts`
- Automatically loads token from secure storage on app start
- Methods for:
  - Login with email/password
  - Signup with email/password/name
  - Logout with cleanup
- Integrates with API client and secure storage

---

## 📁 Project Structure

```
src/
├── config/
│   └── api.ts                 # Axios instance with interceptors
├── store/
│   ├── authStore.ts          # Auth state (Zustand)
│   └── appStore.ts           # App state (Zustand)
├── utils/
│   ├── secureStorage.ts      # Secure storage wrapper
│   └── camera.ts             # Camera permissions hook
├── hooks/
│   └── useAuth.ts            # Authentication hook
app/                           # App routes (Expo Router)
components/                    # Reusable components
constants/                     # App constants
assets/                        # Images and other assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Expo CLI (`npm install -g expo-cli`)
- iOS: Xcode (for iOS development)
- Android: Android Studio (for Android development)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your API endpoints
   ```

3. **Start development server:**
   ```bash
   npm start
   ```

4. **Run on different platforms:**
   ```bash
   npm run ios      # iOS simulator
   npm run android  # Android emulator
   npm run web      # Web browser
   ```

---

## 🔐 Security Best Practices

### Authentication Flow
1. User logs in with credentials
2. API returns auth token and user data
3. Token stored securely in OS keychain
4. Token automatically added to API requests
5. Expired tokens trigger re-login

### Environment Variables
- **Never commit `.env` file** - it's in `.gitignore`
- Use `.env.example` as template for team members
- Production keys should be set via CI/CD or build tools

### Token Management
```typescript
// useAuth hook automatically handles:
// - Saving tokens to secure storage
// - Loading tokens on app start
// - Adding tokens to API requests
// - Clearing tokens on logout

const { login, logout, isAuthenticated } = useAuth();

// Login
await login(email, password);

// Logout
await logout();
```

---

## 📡 API Integration

### Making API Requests

```typescript
import api from '@/src/config/api';

// GET request
const data = await api.get('/endpoint');

// POST request
const response = await api.post('/endpoint', { body });

// With auth (automatic via interceptor)
const userData = await api.get('/user/profile');
```

### Using Authentication

```typescript
import { useAuth } from '@/src/hooks/useAuth';

export function MyComponent() {
  const { login, logout, token, user } = useAuth();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password');
      // Token automatically saved and added to API
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  if (!token) return <LoginScreen />;
  
  return <AuthenticatedScreen user={user} />;
}
```

---

## 🎥 Using Camera

```typescript
import { useCameraPermission } from '@/src/utils/camera';

export function CameraScreen() {
  const { hasPermission, requestCameraPermission } = useCameraPermission();

  const handleCamera = async () => {
    if (!hasPermission) {
      const granted = await requestCameraPermission();
      if (!granted) return;
    }
    // Use camera
  };

  return (
    <CameraView
      facing="back"
      // Camera content
    />
  );
}
```

---

## 🎨 State Management

### Using Auth Store

```typescript
import { useAuthStore } from '@/src/store/authStore';

const { token, user, setToken, setUser } = useAuthStore();
```

### Using App Store

```typescript
import { useAppStore } from '@/src/store/appStore';

const { theme, language, setTheme, setLanguage } = useAppStore();
```

---

## 📦 Installed Dependencies

### Core
- `react` 19.1.0
- `react-native` 0.81.5
- `expo` ~54.0.32
- `expo-router` ~6.0.22
- `typescript` ~5.9.2

### Navigation
- `@react-navigation/native` ^7.1.8
- `@react-navigation/bottom-tabs` ^7.4.0
- `react-native-screens` ~4.16.0
- `react-native-safe-area-context` ~5.6.0
- `react-native-gesture-handler` ~2.28.0

### API & Storage
- `axios` (latest)
- `expo-secure-store` (latest)

### State Management
- `zustand` (latest)

### UI & Camera
- `react-native-paper` (latest)
- `expo-camera` (latest)

---

## 🛠️ Available Scripts

```bash
npm start           # Start Expo development server
npm run ios         # Run on iOS simulator
npm run android     # Run on Android emulator
npm run web         # Run on web browser
npm run lint        # Run ESLint
npm run reset-project  # Reset project to initial state
npm audit fix       # Fix security vulnerabilities
```

---

## 🔗 Useful Resources

- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [Axios Documentation](https://axios-http.com)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Native Paper](https://callstack.github.io/react-native-paper)
- [Expo Secure Store](https://docs.expo.dev/versions/latest/sdk/securestore/)

---

## ⚠️ Known Considerations

1. **Development API URL**: Update `src/config/api.ts` with your actual development server URL
2. **Camera on Web**: Camera functionality has limited support on web platform
3. **Secure Storage on Web**: Uses browser's secure storage (less secure than native)
4. **Token Expiration**: Implement token refresh logic if your API uses short-lived tokens

---

## 🐛 Troubleshooting

### Port already in use
```bash
expo start -c  # Clear cache
```

### Module not found errors
```bash
npm install
npx expo prebuild --clean
```

### Permission issues
Check that permissions are properly declared in `app.json`

### API connection issues
- Verify API URL in `.env`
- Check network connectivity
- Review API interceptors in `src/config/api.ts`

---

**Setup completed on**: January 30, 2026
**Project Status**: ✅ Ready for development
