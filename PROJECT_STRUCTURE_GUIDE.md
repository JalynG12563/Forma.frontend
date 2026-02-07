# 📂 Complete Project Structure Guide

## Overview Map

```
forma_app/
├── 📱 Mobile/Web App Layer
├── 🔧 Configuration Layer
├── 🧠 State & Logic Layer
└── 🎨 UI Components Layer
```

---

## 📁 Full Directory Tree

```
forma_app/
│
├── app/                                    # ← NAVIGATION & SCREENS
│   ├── _layout.tsx                        # Root layout (wrap with AuthProvider here)
│   ├── modal.tsx                          # Modal component
│   │
│   ├── (tabs)/                            # Tab-based navigation
│   │   ├── _layout.tsx                   # Tabs layout
│   │   ├── index.tsx                     # Home tab
│   │   └── explore.tsx                   # Explore tab
│   │
│   └── auth/                              # ✨ NEW AUTH SCREENS
│       ├── login.tsx                      # Login screen
│       ├── register.tsx                   # Registration screen
│       ├── forgot-password.tsx            # Forgot password
│       └── reset-password.tsx             # Reset password
│
├── src/                                   # ← CORE LOGIC & STATE
│   │
│   ├── types/                             # TypeScript types
│   │   └── auth.ts                        # ✨ Auth types
│   │
│   ├── store/                             # State management
│   │   ├── appStore.ts                    # General app state
│   │   └── authStore.ts                   # 🔄 Auth state (ENHANCED)
│   │
│   ├── hooks/                             # Custom React hooks
│   │   ├── useAuth.ts                     # 🔄 Main auth hook (ENHANCED)
│   │   ├── use-color-scheme.ts            # Theme hook
│   │   ├── use-color-scheme.web.ts        # Web theme hook
│   │   └── use-theme-color.ts             # Theme color hook
│   │
│   ├── context/                           # React Context providers
│   │   └── authContext.tsx                # ✨ Auth context (NEW)
│   │
│   ├── services/                          # Business logic & API calls
│   │   └── authService.ts                 # ✨ Auth API service (NEW)
│   │
│   ├── config/                            # Configuration files
│   │   └── api.ts                         # 🔄 Axios config (ENHANCED)
│   │
│   └── utils/                             # Utility functions
│       ├── camera.ts                      # Camera utilities
│       ├── secureStorage.ts               # 🔄 Token storage (verified)
│       ├── validation.ts                  # ✨ Form validation (NEW)
│       └── errorHandler.ts                # ✨ Error handling (NEW)
│
├── components/                            # ← REUSABLE UI COMPONENTS
│   ├── external-link.tsx                  # External link component
│   ├── haptic-tab.tsx                     # Tab component with haptics
│   ├── hello-wave.tsx                     # Wave animation
│   ├── parallax-scroll-view.tsx           # Parallax scroll effect
│   ├── themed-text.tsx                    # Styled text
│   ├── themed-view.tsx                    # Styled view/container
│   │
│   └── ui/                                # UI building blocks
│       ├── collapsible.tsx                # Collapsible component
│       ├── icon-symbol.ios.tsx            # iOS icon symbols
│       └── icon-symbol.tsx                # Cross-platform icon
│
├── assets/                                # ← MEDIA & STATIC FILES
│   └── images/                            # Image assets
│
├── constants/                             # ← CONSTANTS & CONFIGS
│   └── theme.ts                           # Theme colors & styles
│
├── hooks/                                 # ← LEGACY HOOKS (OLD)
│   ├── useAuth.ts                         # (Ignore - use src/hooks/useAuth.ts)
│   └── ...                                # Other legacy hooks
│
├── scripts/                               # ← BUILD & UTILITY SCRIPTS
│   └── reset-project.js                   # Reset script
│
├── Desktop/                               # ← EXTRA FILES (Not part of app)
│   └── HackRecycleProject1/               # Old projects
│
├── Documents/                             # ← EXTRA FILES (Not part of app)
│   └── Cloudguard/                        # Documentation
│
├── 📄 Configuration Files
│   ├── app.json                           # Expo config
│   ├── package.json                       # NPM dependencies
│   ├── tsconfig.json                      # TypeScript config
│   └── eslint.config.js                   # ESLint rules
│
└── 📚 Documentation Files
    ├── README.md                          # Original readme
    ├── SETUP_COMPLETE.md                  # Setup notes
    ├── AUTHENTICATION.md                  # ✨ Full auth docs
    ├── AUTH_CHECKLIST.md                  # ✨ Setup guide
    ├── AUTH_INTEGRATION_EXAMPLES.md       # ✨ Code examples
    ├── AUTH_IMPLEMENTATION_SUMMARY.md     # ✨ Summary
    ├── AUTH_FILE_STRUCTURE.md             # ✨ This file
    ├── README_AUTH.md                     # ✨ Quick start
    └── TEST_VERIFICATION_REPORT.md        # ✨ Test results
```

---

## 🗂️ Folder Organization Explained

### **`app/` - Screen & Navigation Layer**
**Purpose:** UI screens and navigation structure  
**What it does:** Renders screens, handles navigation between them  
**Key files:**
- `_layout.tsx` - Root navigator (wrap with `<AuthProvider>` here)
- `auth/` - All authentication screens
- `(tabs)/` - Tabbed navigation screens

**When to edit:** When changing UI, adding screens, or modifying navigation flow

---

### **`src/` - Business Logic Layer**
**Purpose:** App logic, state, and API communication  
**What it does:** Handles all non-UI logic

#### **`src/types/` - TypeScript Interfaces**
```
Purpose: Define data shapes
Example: User interface, LoginCredentials interface
Use case: Type-safe code, IDE autocomplete
```

#### **`src/store/` - State Management**
```
Purpose: Global app state (what the user is doing, who they are, etc.)
Tool: Zustand (lightweight state manager)
Key stores:
  - authStore.ts → Auth state (token, user, loading)
  - appStore.ts → General app state
```

#### **`src/hooks/` - Custom Hooks**
```
Purpose: Reusable logic
Key hooks:
  - useAuth.ts → Auth logic (login, register, logout)
  - use-color-scheme.ts → Theme switching
  - use-theme-color.ts → Color utilities
```

#### **`src/context/` - React Context Providers**
```
Purpose: Global state access without prop drilling
Key contexts:
  - authContext.tsx → Provides useAuthContext() hook
    Used in components: const { user, login, logout } = useAuthContext();
```

#### **`src/services/` - API Communication**
```
Purpose: Talk to backend server
Key services:
  - authService.ts → All auth endpoints
    Functions: login(), register(), resetPassword(), etc.
```

#### **`src/config/` - Configuration**
```
Purpose: Setup external services (like API)
Key configs:
  - api.ts → Axios instance with interceptors
    - Adds auth token to all requests
    - Handles 401 errors
    - Refreshes tokens automatically
```

#### **`src/utils/` - Helper Functions**
```
Purpose: Reusable utilities
Key utilities:
  - validation.ts → Form validation functions
  - errorHandler.ts → Error parsing & messages
  - secureStorage.ts → Secure token persistence
  - camera.ts → Camera utilities
```

### **`components/` - Reusable UI Components**
**Purpose:** Building blocks for screens  
**What it does:** Buttons, text, icons, etc.  
**When to edit:** When creating custom UI components

---

## 🔄 Data Flow Diagram

### **Login Flow (How data moves)**

```
User enters email/password
    ↓
LoginScreen.tsx
    ↓
Calls: useAuthContext().login(email, password)
    ↓
useAuth.ts hook executes:
    - Calls: authService.login()
    ↓
authService.ts sends:
    - POST /auth/login → backend
    ↓
axios (src/config/api.ts):
    - Adds: Authorization header
    - Gets: Response with token
    ↓
useAuth.ts receives response:
    - Saves token: secureStorage.setToken()
    - Updates state: setToken(), setUser()
    ↓
Zustand store (authStore.ts):
    - Updates: token, user, isAuthenticated
    ↓
React Context (authContext.tsx):
    - Makes data available globally
    ↓
All components using useAuthContext():
    - See: user, token, isAuthenticated
    ↓
Navigation layer (app/_layout.tsx):
    - Checks: isAuthenticated
    - Shows: App screens OR Auth screens
```

---

## 📊 File Dependency Chain

### **Authentication Flow Dependencies**

```
LoginScreen (UI)
    ↓ uses
useAuthContext() (Context)
    ↓ wraps
useAuth() (Hook)
    ↓ calls
authService.login() (Service)
    ↓ uses
api (Axios with interceptors)
    ↓ stores in
secureStorage (Secure storage)
    ↓ updates
authStore (Zustand)
```

### **What depends on what:**

```
authStore.ts
  ← useAuth.ts (updates store)
  ← authContext.tsx (reads store)

useAuth.ts
  ← authService.ts (API calls)
  ← secureStorage.ts (token storage)
  ← authStore.ts (state updates)

authContext.tsx
  ← useAuth.ts (wraps it)
  ← Components (useAuthContext hook)

authService.ts
  ← api.ts (makes requests)

api.ts (Axios)
  ← All API calls (adds token header)

secureStorage.ts
  ← useAuth.ts (persists tokens)
```

---

## 🎯 Quick Navigation Guide

### **"I need to change the login screen"**
→ Go to: `app/auth/login.tsx`

### **"I need to fix authentication logic"**
→ Go to: `src/hooks/useAuth.ts`

### **"I need to add a new validation rule"**
→ Go to: `src/utils/validation.ts`

### **"I need to change API endpoints"**
→ Go to: `src/services/authService.ts`

### **"I need to change API base URL"**
→ Go to: `src/config/api.ts` (line 14-22)

### **"I need to add a new auth feature"**
→ Create in: `src/services/authService.ts` (service) + `src/hooks/useAuth.ts` (hook)

### **"I need to see error messages"**
→ Go to: `src/utils/errorHandler.ts`

### **"I need to change colors/theme"**
→ Go to: `constants/theme.ts`

### **"I need to understand app state"**
→ Go to: `src/store/authStore.ts` and `src/store/appStore.ts`

### **"Navigation is broken"**
→ Check: `app/_layout.tsx` (root layout/navigation)

---

## 🔐 Authentication System Deep Dive

### **File Relationships**

```
┌─────────────────────────────────────────┐
│ app/auth/login.tsx (UI)                 │
│ - Renders form                          │
│ - Calls useAuthContext()                │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│ src/context/authContext.tsx (Bridge)    │
│ - Provides useAuthContext() hook        │
│ - Wraps useAuth() internally            │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│ src/hooks/useAuth.ts (Logic)            │
│ - login() function                      │
│ - register() function                   │
│ - logout() function                     │
│ - Manages loading/error states          │
│ - Calls authService                     │
│ - Updates authStore                     │
│ - Persists tokens                       │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│ src/services/authService.ts (API Layer) │
│ - login(credentials)                    │
│ - register(credentials)                 │
│ - requestPasswordReset(email)           │
│ - resetPassword(token, password)        │
│ - logout()                              │
│ - refreshToken()                        │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│ src/config/api.ts (HTTP Client)         │
│ - Axios instance                        │
│ - Request interceptor                   │
│  (adds Authorization header)            │
│ - Response interceptor                  │
│  (handles 401, refreshes token)         │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│ Backend API                             │
│ - /auth/login                           │
│ - /auth/register                        │
│ - /auth/forgot-password                 │
│ - /auth/reset-password                  │
│ - /auth/refresh                         │
│ - /auth/logout                          │
└─────────────────────────────────────────┘

Supporting Files:
├── src/store/authStore.ts (State)
├── src/types/auth.ts (Interfaces)
├── src/utils/validation.ts (Form validation)
├── src/utils/errorHandler.ts (Error messages)
├── src/utils/secureStorage.ts (Token persistence)
└── constants/theme.ts (UI theme)
```

---

## 🐛 Debugging Guide

### **Issue: Login not working**

**Check these in order:**

1. **API Configuration**
   - File: `src/config/api.ts` (line 14)
   - Check: baseURL is correct
   - Check: Environment matches your setup

2. **API Service**
   - File: `src/services/authService.ts`
   - Check: `login()` function exists
   - Check: Correct endpoint path

3. **Hook Logic**
   - File: `src/hooks/useAuth.ts`
   - Check: `login()` function calls authService.login()
   - Check: Updates authStore correctly

4. **Context Provider**
   - File: `src/context/authContext.tsx`
   - Check: AuthProvider wraps entire app in `app/_layout.tsx`

5. **Screen Usage**
   - File: `app/auth/login.tsx`
   - Check: Uses `useAuthContext()` correctly

---

### **Issue: Token not persisting after restart**

**Check these:**

1. **Secure Storage**
   - File: `src/utils/secureStorage.ts`
   - Check: `setToken()` is called in useAuth.ts
   - Check: `getToken()` is called on app startup

2. **Hook Initialization**
   - File: `src/hooks/useAuth.ts` (useEffect at top)
   - Check: Token loaded from secure storage
   - Check: Token set in axios headers

3. **Platform Permissions**
   - Android: Check AndroidManifest.xml
   - iOS: Check info.plist
   - Secure store needs permissions

---

### **Issue: API calls not including token**

**Check these:**

1. **Axios Interceptor**
   - File: `src/config/api.ts` (line 50-60)
   - Check: Request interceptor runs
   - Check: Authorization header added

2. **Token in Store**
   - File: `src/store/authStore.ts`
   - Check: Token is not null
   - Check: Token is valid JWT

3. **Headers**
   - Format should be: `Authorization: Bearer {token}`
   - Token should be: `eyJhbGc...` (JWT format)

---

### **Issue: 401 errors on requests**

**Check these:**

1. **Token Validity**
   - Has token expired?
   - Is token format correct?

2. **Refresh Logic**
   - File: `src/config/api.ts` (line 75-100)
   - Check: 401 handler exists
   - Check: Refresh endpoint works

3. **Backend**
   - Check: Backend returns 401 for invalid tokens
   - Check: Refresh token endpoint exists

---

## 📋 Common Tasks & Where To Find Them

| Task | File | Line Range |
|------|------|-----------|
| Change API URL | `src/config/api.ts` | 14-22 |
| Add validation rule | `src/utils/validation.ts` | 1-60 |
| Change error message | `src/utils/errorHandler.ts` | 1-50 |
| Change login screen UI | `app/auth/login.tsx` | 1-200 |
| Add new auth endpoint | `src/services/authService.ts` | 1-80 |
| Change token storage | `src/utils/secureStorage.ts` | 1-76 |
| Add new state | `src/store/authStore.ts` | 1-40 |
| Change theme colors | `constants/theme.ts` | 1-50 |
| Fix navigation | `app/_layout.tsx` | 1-100 |
| Add new screen | `app/` + create folder | - |

---

## 🧩 Component Composition

### **How screens are built:**

```
LoginScreen (app/auth/login.tsx)
├── Uses hooks:
│   └── useAuthContext() ← Gets auth functions
├── Uses utilities:
│   ├── validateLogin() ← Validate form
│   └── AuthErrorHandler ← Show errors
└── Renders components:
    ├── TextInput ← From react-native
    ├── TouchableOpacity ← From react-native
    └── ActivityIndicator ← Loading spinner
```

---

## 🔌 Extension Points

### **To add a new feature:**

1. **Add types** → `src/types/auth.ts`
2. **Add service function** → `src/services/authService.ts`
3. **Add hook logic** → `src/hooks/useAuth.ts`
4. **Export from context** → `src/context/authContext.tsx`
5. **Use in screen** → `app/auth/newscreen.tsx`

### **Example: Adding "Change Password"**

```
1. src/types/auth.ts
   → Add: ChangePasswordRequest interface

2. src/services/authService.ts
   → Add: changePassword() function

3. src/hooks/useAuth.ts
   → Add: changePassword() function wrapper

4. src/context/authContext.tsx
   → Add: changePassword to context value

5. app/auth/change-password.tsx
   → New screen using useAuthContext().changePassword()
```

---

## 📊 State Flow Summary

```
User Interaction
    ↓
Screen (app/auth/*.tsx)
    ↓
useAuthContext() hook
    ↓
useAuth() implementation
    ↓
authService.* function
    ↓
api.post/get/etc
    ↓
Server response
    ↓
secureStorage (if token)
    ↓
authStore update
    ↓
Component re-renders
    ↓
Navigation updates (if needed)
```

---

## 🎓 Learning Path

**New to this project? Read in this order:**

1. This file (you're here!) 📍
2. `README_AUTH.md` - Overview
3. `AUTHENTICATION.md` - Feature details
4. `AUTH_INTEGRATION_EXAMPLES.md` - Code examples
5. Actual files starting with `src/types/auth.ts`

---

## 🚨 Critical Files (Don't break these!)

```
🔴 CRITICAL (Auth won't work if broken):
  ├── src/hooks/useAuth.ts
  ├── src/config/api.ts
  ├── src/context/authContext.tsx
  ├── src/services/authService.ts
  └── src/store/authStore.ts

🟡 IMPORTANT (UI/UX affected):
  ├── app/auth/*.tsx (screens)
  ├── src/utils/validation.ts
  └── src/utils/errorHandler.ts

🟢 NICE-TO-HAVE (Optional):
  ├── src/utils/secureStorage.ts (unless deploying)
  └── constants/theme.ts (just styling)
```

---

## 💡 Pro Tips

### **Tip 1: Finding where something happens**
Use VSCode search (Ctrl+Shift+F):
- Search for function name: `login(`
- Search for string: "User not found"
- Search in specific folder: `src/hooks/`

### **Tip 2: Understanding the flow**
Add console.log() at each step:
```typescript
// In useAuth.ts login function:
console.log('1. Login called with:', { email });
await authService.login(...)
console.log('2. Service returned:', response);
setToken(newToken);
console.log('3. Token set in store');
```

### **Tip 3: Testing changes**
- Change one file at a time
- Check for TypeScript errors (bottom panel)
- Test in simulator/device
- Check console for errors

### **Tip 4: Debugging API calls**
- Use Network tab in React Native debugger
- Check actual request headers
- Verify response format matches expectations
- Log authService.ts functions

---

**Now you know the structure! Happy debugging! 🚀**
