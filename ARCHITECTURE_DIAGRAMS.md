# 🏗️ Architecture Diagrams & Visual Guides

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (React Native/Web)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              UI LAYER (app/)                             │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐ ┌──────────┐  │   │
│  │  │  Login   │  │Register  │  │ Forgot   │ │  Reset   │  │   │
│  │  │ Screen   │  │ Screen   │  │ Password │ │ Password │  │   │
│  │  └─────┬────┘  └────┬─────┘  └────┬─────┘ └────┬─────┘  │   │
│  │        └──────────┬─────────────┬──────────────┘         │   │
│  └─────────────────┼──────────────┼──────────────────────────┘   │
│                    │              │                              │
│  ┌─────────────────▼──────────────▼──────────────────────────┐   │
│  │         STATE & LOGIC LAYER (src/)                       │   │
│  │                                                           │   │
│  │  ┌──────────────────────────────────────────────────┐    │   │
│  │  │  Context Layer (authContext.tsx)                 │    │   │
│  │  │  └─ Provides: useAuthContext() hook to all      │    │   │
│  │  └──┬───────────────────────────────────────────────┘    │   │
│  │     │                                                      │   │
│  │  ┌──▼─────────────────────────────────────────────────┐   │   │
│  │  │  Hook Layer (useAuth.ts)                          │   │   │
│  │  │  ├─ login(email, password)                        │   │   │
│  │  │  ├─ register(email, password, name)               │   │   │
│  │  │  ├─ logout()                                      │   │   │
│  │  │  ├─ requestPasswordReset(email)                   │   │   │
│  │  │  ├─ resetPassword(token, password)                │   │   │
│  │  │  └─ Updates authStore state                       │   │   │
│  │  └──┬──────────────────────────────────────────────┬─┘   │   │
│  │     │                                              │      │   │
│  │  ┌──▼──────────────┐    ┌──────────────────────┬──▼───┐  │   │
│  │  │ Store (Zustand) │    │  API Service Layer   │      │  │   │
│  │  │ (authStore.ts)  │    │ (authService.ts)     │      │  │   │
│  │  │                 │    │                      │      │  │   │
│  │  │ • token         │    │ • login()            │      │  │   │
│  │  │ • user          │    │ • register()         │      │  │   │
│  │  │ • isLoading     │    │ • logout()           │      │  │   │
│  │  │ • error         │    │ • requestPasswordReset   │  │   │
│  │  │ • isAuthenticated   │ • resetPassword()    │      │  │   │
│  │  └──────────────────┘    │ • refreshToken()     │      │  │   │
│  │                         └──┬─────────────────────┘      │   │
│  │                            │                           │   │
│  └────────────────────────────┼───────────────────────────┘   │
│                               │                                │
│  ┌────────────────────────────▼───────────────────────────┐   │
│  │       HTTP & SECURITY LAYER (src/config/)              │   │
│  │                                                        │   │
│  │  Axios Instance (api.ts)                              │   │
│  │  ┌──────────────────────────────────────────────┐     │   │
│  │  │ Request Interceptor                          │     │   │
│  │  │ ├─ Gets token from store                     │     │   │
│  │  │ ├─ Adds: Authorization: Bearer {token}       │     │   │
│  │  │ └─ Sends request with auth header            │     │   │
│  │  └──┬───────────────────────────────────────────┘     │   │
│  │     │                                                  │   │
│  │  ┌──▼───────────────────────────────────────────┐     │   │
│  │  │ Response Interceptor                         │     │   │
│  │  │ ├─ Check: Status 401?                        │     │   │
│  │  │ ├─ If yes: Refresh token via /auth/refresh   │     │   │
│  │  │ ├─ Queue failed requests                     │     │   │
│  │  │ ├─ Retry with new token                      │     │   │
│  │  │ └─ If refresh fails: Logout user             │     │   │
│  │  └──┬───────────────────────────────────────────┘     │   │
│  │     │                                                  │   │
│  └─────┼──────────────────────────────────────────────┘   │
│        │                                                    │
│  ┌─────▼──────────────────────────────────────────────┐   │
│  │  STORAGE LAYER (src/utils/)                        │   │
│  │                                                   │   │
│  │  Secure Storage (secureStorage.ts)                │   │
│  │  ├─ setToken(token)                              │   │
│  │  ├─ getToken()                                   │   │
│  │  ├─ setUserData(user)                            │   │
│  │  └─ clearAll()                                   │   │
│  │                                                   │   │
│  │  Using: expo-secure-store (platform secure)      │   │
│  └───────────────────────────────────────────────────┘   │
│                                                            │
└────────────────────────────────────────────────────┬──────┘
                                                     │
                                    ┌────────────────▼────────────┐
                                    │   BACKEND API SERVER       │
                                    │                            │
                                    │  POST /auth/login          │
                                    │  POST /auth/register       │
                                    │  POST /auth/logout         │
                                    │  POST /auth/forgot-password│
                                    │  POST /auth/reset-password │
                                    │  POST /auth/refresh        │
                                    │  GET  /auth/verify         │
                                    │                            │
                                    │  Other endpoints...        │
                                    └────────────────────────────┘
```

---

## Authentication Flow Sequence Diagram

```
User              LoginScreen        useAuthContext      authService        api.ts          secureStorage   authStore      Backend
 │                     │                   │                  │               │                  │              │             │
 ├─ Enter email/pass──>│                   │                  │               │                  │              │             │
 │                     │                   │                  │               │                  │              │             │
 │                     ├─ Click Login─────>│                  │               │                  │              │             │
 │                     │                   │                  │               │                  │              │             │
 │                     │                   ├─ login(email, pwd)               │                  │              │             │
 │                     │                   │                  │               │                  │              │             │
 │                     │                   │                  ├─ login(email, pwd)               │                  │              │
 │                     │                   │                  │               │                  │              │             │
 │                     │                   │                  │               ├─ Request────────────────────────────────────>│
 │                     │                   │                  │               │  POST /auth/login                          │
 │                     │                   │                  │               │                  │              │             │
 │                     │                   │                  │               │<──────────────────────────────────Response──┤
 │                     │                   │                  │               │  { token, user }                             │
 │                     │                   │                  │               │                  │              │             │
 │                     │                   │                  │               ├─ Add header  ────┐                          │
 │                     │                   │                  │               │  Auth: Bearer    │                          │
 │                     │                   │                  │               └──────────────────┘                          │
 │                     │                   │                  │<─ return {token, user}                 │              │             │
 │                     │                   │<─ return response─┤                  │                  │              │             │
 │                     │                   │                  │                  │                  │              │             │
 │                     │                   ├─ setToken()──────────────────────────────────────────────────────>│              │
 │                     │                   │                  │                  │                  │       ✓      │             │
 │                     │                   │                  │                  │                  │       Store  │             │
 │                     │                   │                  │                  │                  │              │             │
 │                     │                   ├─ setUser()───────────────────────────────────────────────────────>│              │
 │                     │                   │                  │                  │                  │              │       ✓     │
 │                     │                   │                  │                  │                  │              │     Update  │
 │                     │                   │                  │                  │                  │              │      State  │
 │                     │                   │                  │                  │                  │              │             │
 │<─ Show home screen ─┤                   │                  │                  │                  │              │             │
 │                     │                   │                  │                  │                  │              │             │
```

---

## Token Refresh Flow

```
API Request with expired token
         │
         ▼
┌─────────────────────────┐
│ axios interceptor       │
│ (response handler)      │
└────────┬────────────────┘
         │
         ├─ Status 401?
         │
    YES  │  NO
    │    └──> Return response ✓
    │
    ▼
┌─────────────────────────────────────┐
│ Try to refresh token                │
│ POST /auth/refresh                  │
│ with: refreshToken                  │
└────────┬────────────────────────────┘
         │
         ├─ Success?
         │
    YES  │  NO
    │    └──> Logout user, clear storage ✗
    │
    ▼
┌─────────────────────────────────────┐
│ Save new token                      │
│ Update store & headers              │
│ Process queued requests             │
└────────┬────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Retry original request with new token
│ (now should succeed!)               │
└────────┬────────────────────────────┘
         │
         ▼
    Return response ✓
```

---

## Form Validation Flow

```
User types in input field
         │
         ▼
┌──────────────────────────────┐
│ onChangeText handler         │
│ Calls: handleInputChange()   │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Validation function          │
│ validateEmail()              │
│ validatePassword()           │
│ validateName()               │
└────────┬─────────────────────┘
         │
         ├─ Error returned?
         │
    YES  │  NO
    │    └──> Clear error display ✓
    │
    ▼
┌──────────────────────────────┐
│ Update validationErrors state│
│ Display error under field    │
└─────────────────────────────┘

Continues until:
- All fields valid → Enable submit button
- User fixes error → Clear that field's error
```

---

## File Interaction Map

```
app/auth/login.tsx
        │
        ├─ imports: useAuthContext
        ├─ imports: validateLogin
        ├─ imports: AuthErrorHandler
        └─ calls methods on returned context
                │
                ▼
src/context/authContext.tsx
        │
        ├─ imports: useAuth
        ├─ provides: useAuthContext hook
        └─ wraps useAuth internally
                │
                ▼
src/hooks/useAuth.ts
        │
        ├─ imports: authService
        ├─ imports: authStore
        ├─ imports: secureStorage
        ├─ imports: api
        └─ implements: login, register, logout, etc.
                │
        ┌───────┼───────┬──────────┐
        │       │       │          │
        ▼       ▼       ▼          ▼
   authService  │   secureStorage  │
        │       │       │          │
        │       ▼       │          ▼
        │   authStore   │      api.ts
        │       │       │          │
        └───────┼───────┼──────────┘
                │       │          │
                ▼       ▼          ▼
        src/store/   Device   axios instance
        authStore.ts Storage  (with interceptors)
```

---

## State Update Flow (Zustand)

```
API Call Returns
        │
        ▼
useAuth.ts receives: { token, user }
        │
        ├─ Store token: secureStorage.setToken(token)
        │
        ├─ Update store: setToken(token)  ← Zustand
        │  └─ authStore.token = token
        │  └─ authStore.isAuthenticated = true
        │
        ├─ Update store: setUser(user)    ← Zustand
        │  └─ authStore.user = user
        │
        └─ Update store: setError(null)   ← Zustand
           └─ authStore.error = null
                    │
                    ▼
        Zustand triggers re-render
                    │
                    ▼
        useAuthContext() hook returns new values
                    │
                    ▼
        React re-renders subscribed components
                    │
        ┌───────────┴───────────┬─────────────────┐
        │                       │                 │
        ▼                       ▼                 ▼
   LoginScreen           RootNavigator      ProfileScreen
   sees: user             checks:             sees: user
   shows: profile     isAuthenticated        shows: info
```

---

## Error Handling Flow

```
API Call Fails (any error)
        │
        ▼
catch in authService.ts
        │
        ├─ Throw: new Error(message)
        │
        ▼
catch in useAuth.ts
        │
        ├─ Parse error
        ├─ Call: setError(errorMessage)  ← Update store
        ├─ Throw error to component
        │
        ▼
try/catch in LoginScreen
        │
        ├─ Catch error
        ├─ Call: AuthErrorHandler.getUserFriendlyMessage(error)
        ├─ Show: Alert.alert(title, message)
        │
        ▼
User sees readable error message
```

---

## Navigation Flow Based on Auth

```
App Starts
    │
    ▼
RootLayout (_layout.tsx)
    │
    ├─ Renders: <AuthProvider>
    │
    ▼
AuthProvider initializes
    │
    ├─ Calls: useAuth()
    │  └─ Loads token from secure storage
    │  └─ Updates authStore
    │
    ▼
useAuthContext available to all components
    │
    ▼
RootNavigator checks: isAuthenticated
    │
    ├─ TRUE?  ──> Show AppNavigator (app screens)
    │
    └─ FALSE? ──> Show AuthNavigator (login/register)
                    │
                    ├─ LoginScreen
                    ├─ RegisterScreen
                    ├─ ForgotPasswordScreen
                    └─ ResetPasswordScreen

User logs in:
    │
    ├─ isAuthenticated becomes TRUE
    ├─ React re-renders
    └─ Shows AppNavigator automatically

User logs out:
    │
    ├─ isAuthenticated becomes FALSE
    ├─ React re-renders
    └─ Shows AuthNavigator automatically
```

---

## Dependency Layers

```
Layer 1: UI Components (thin, dumb)
├─ LoginScreen
├─ RegisterScreen
├─ ForgotPasswordScreen
└─ ResetPasswordScreen
  └ Only renders & calls hooks
  └ No business logic

Layer 2: Context/Hooks (medium complexity)
├─ useAuthContext() → Easy to use interface
└─ useAuth() → Logic implementation
  └ Calls services
  └ Updates state
  └ Handles loading/errors

Layer 3: Services (business logic)
├─ authService.ts → Pure API calls
└─ api.ts → HTTP client with interceptors
  └ No UI concerns
  └ No state management
  └ Reusable across app

Layer 4: Utilities (helpers)
├─ validation.ts → Form validation
├─ errorHandler.ts → Error messages
├─ secureStorage.ts → Persistent storage
└─ authStore.ts → Zustand state
  └ Single responsibility
  └ Easy to test
  └ Reusable

Layer 5: Infrastructure (frameworks)
├─ React Native → UI framework
├─ Zustand → State manager
├─ Axios → HTTP client
├─ expo-secure-store → Secure storage
└─ Expo → Platform abstraction

Direction: Top layer only knows about its dependencies below
Example: LoginScreen doesn't know about api.ts, only useAuthContext
```

---

## Performance: Minimal Re-renders

```
authStore (Zustand) with selectors:

Component 1:
  const user = useAuthStore(s => s.user)
  └─ Only re-renders when user changes

Component 2:
  const isLoading = useAuthStore(s => s.isLoading)
  └─ Only re-renders when isLoading changes

Component 3:
  const { user, isLoading } = useAuthStore()
  └─ Re-renders when either changes

Benefit:
- LoginScreen only re-renders when loading/error changes
- Not when other unrelated state updates
- Better performance!
```

---

**Now you have visual guides for understanding the system! 🎯**
