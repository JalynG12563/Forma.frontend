# Authentication System Documentation

## Overview

This document outlines the complete authentication system implementation for the Forma app. It includes login, registration, password reset, and session management.

## Architecture

### Components

1. **Types** (`src/types/auth.ts`)
   - User interface
   - Login/Register credentials
   - Password reset types
   - Auth response types
   - Validation error types

2. **Services** (`src/services/authService.ts`)
   - API communication with backend auth endpoints
   - Handles register, login, password reset, token refresh

3. **State Management** (`src/store/authStore.ts`)
   - Zustand store for auth state
   - Manages token, user, loading, and error states

4. **Hooks** (`src/hooks/useAuth.ts`)
   - Custom hook for auth operations
   - Handles token persistence
   - API interceptor setup
   - Core auth functions

5. **Context** (`src/context/authContext.tsx`)
   - React Context for global auth state
   - Provider component for wrapping app

6. **Utilities**
   - `validation.ts` - Form validation logic
   - `secureStorage.ts` - Secure token storage
   - `errorHandler.ts` - Error parsing and user-friendly messages

7. **Screens**
   - `app/auth/login.tsx` - Login screen
   - `app/auth/register.tsx` - Registration screen
   - `app/auth/forgot-password.tsx` - Forgot password screen
   - `app/auth/reset-password.tsx` - Password reset screen

## Implementation Guide

### 1. Setup Auth Provider

Wrap your app root with the AuthProvider:

```tsx
import { AuthProvider } from '@/src/context/authContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      {/* Your app content */}
    </AuthProvider>
  );
}
```

### 2. Using Authentication in Components

```tsx
import { useAuthContext } from '@/src/context/authContext';

export function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuthContext();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // Navigate to home
    } catch (error) {
      // Handle error
    }
  };

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return <UserProfile user={user} />;
}
```

### 3. Using useAuth Hook Directly

For more granular control:

```tsx
import { useAuth } from '@/src/hooks/useAuth';

export function LoginComponent() {
  const { login, isLoading, error } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login({ email, password });
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    // Your JSX
  );
}
```

## Features

### ✅ Secure Token Storage
- Uses `expo-secure-store` for secure token persistence
- Tokens are automatically loaded on app startup
- Tokens are automatically attached to API requests

### ✅ Automatic Token Attachment
- All API requests include Authorization header
- Token is set in axios interceptors
- Handles 401 errors and token refresh

### ✅ Form Validation
- Email format validation
- Password strength requirements
- Password confirmation matching
- Name validation
- Real-time error display

### ✅ Error Handling
- User-friendly error messages
- Error parsing from server responses
- Field-specific error handling
- Network error detection

### ✅ Session Management
- Persistent login (survives app restart)
- Automatic logout on token expiration
- Manual logout with credential clearing
- Token refresh mechanism

### ✅ Password Management
- Secure password reset flow
- Password reset tokens with expiration
- Password strength validation
- Forgot password email flow

## API Endpoints Required

Your backend should implement these endpoints:

```
POST /auth/register
  - Body: { email, password, name }
  - Response: { token, user, refreshToken? }

POST /auth/login
  - Body: { email, password }
  - Response: { token, user, refreshToken? }

POST /auth/logout
  - Headers: Authorization: Bearer <token>
  - Response: { message }

POST /auth/forgot-password
  - Body: { email }
  - Response: { message }

POST /auth/reset-password
  - Body: { token, password }
  - Response: { message }

POST /auth/refresh
  - Body: { refreshToken }
  - Response: { token, user }

POST /auth/verify
  - Body: { token }
  - Response: { valid }
```

## Password Requirements

- Minimum 8 characters
- At least 1 uppercase letter
- At least 1 lowercase letter
- At least 1 number

## Validation Rules

### Email
- Valid format (RFC 5322)
- Required

### Password
- 8+ characters
- 1+ uppercase
- 1+ lowercase
- 1+ number
- Required

### Confirm Password
- Must match password field
- Required

### Name
- 2-50 characters
- Required

## Error Handling

The `AuthErrorHandler` utility provides:

```tsx
import { AuthErrorHandler } from '@/src/utils/errorHandler';

// Get user-friendly message
const message = AuthErrorHandler.getUserFriendlyMessage(error);

// Check for specific error
if (error.code === 'USER_ALREADY_EXISTS') {
  // Handle duplicate user
}

// Get field-specific error
const fieldError = AuthErrorHandler.getFieldError(error, 'email');
```

## Token Management

### Token Storage
- Tokens stored in secure storage automatically
- Retrieved on app startup
- Cleared on logout

### Token Refresh
- Automatic refresh on 401 response
- Queues failed requests during refresh
- Retries original request with new token

### Token Header
- Automatically added: `Authorization: Bearer <token>`
- Applied to all API requests via axios interceptor

## Testing the Auth Flow

### Test Login
```tsx
import { useAuthContext } from '@/src/context/authContext';

export function TestLogin() {
  const { login } = useAuthContext();

  const test = async () => {
    await login('test@example.com', 'TestPassword123');
  };

  return <Button title="Test Login" onPress={test} />;
}
```

### Test Registration
```tsx
const { register } = useAuthContext();

await register(
  'newuser@example.com',
  'Password123',
  'Password123',
  'John Doe'
);
```

### Test Logout
```tsx
const { logout } = useAuthContext();

await logout();
// User will be cleared from state and storage
```

## Navigation Setup

Example of setting up protected routes:

```tsx
import { useAuthContext } from '@/src/context/authContext';

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return <SplashScreen />;
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}
```

## Security Best Practices

1. **Never log tokens** - They should not appear in console logs
2. **HTTPS only** - Always use HTTPS in production
3. **Token expiration** - Implement server-side token expiration
4. **Refresh tokens** - Use refresh tokens for extended sessions
5. **Secure storage** - Use secure storage for tokens (already implemented)
6. **CORS** - Configure CORS properly on backend
7. **Rate limiting** - Implement rate limiting on auth endpoints

## Troubleshooting

### Token not persisting
- Check if `expo-secure-store` is properly installed
- Verify secure storage permissions (Android/iOS)
- Check localStorage fallback on web

### 401 errors on requests
- Verify token is being set in Authorization header
- Check token hasn't expired
- Verify token format: `Bearer <token>`

### Login fails
- Check API endpoint URL configuration
- Verify backend is running
- Check request/response format matches API

### Validation errors not showing
- Ensure validation functions are called before API call
- Check error state is being displayed in UI
- Verify validation rules match backend

## Future Enhancements

- [ ] Two-factor authentication
- [ ] Social login (Google, Apple, etc.)
- [ ] Biometric authentication
- [ ] Session management dashboard
- [ ] Account deactivation
- [ ] Email verification
- [ ] Remember me functionality
