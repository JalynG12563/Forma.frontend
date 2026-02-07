# 🔍 Quick Reference Card

**Print this or bookmark it!**

---

## 🎯 File Quick Lookup

| Need To... | File | What's There |
|-----------|------|-------------|
| Change login UI | `app/auth/login.tsx` | 320 lines - form + validation display |
| Change registration UI | `app/auth/register.tsx` | 340 lines - form + fields |
| Change forgot password UI | `app/auth/forgot-password.tsx` | 200 lines - email input |
| Change reset password UI | `app/auth/reset-password.tsx` | 240 lines - new password input |
| Change API URL | `src/config/api.ts:14` | `baseURL: '...'` |
| Add validation rule | `src/utils/validation.ts` | Validation functions |
| Change error message | `src/utils/errorHandler.ts` | Error definitions |
| View auth state | `src/store/authStore.ts` | Zustand store |
| View auth logic | `src/hooks/useAuth.ts` | Main auth logic |
| View API endpoints | `src/services/authService.ts` | All API calls |
| Make auth global | `src/context/authContext.tsx` | Context provider |
| Change colors | `constants/theme.ts` | Theme values |
| Fix navigation | `app/_layout.tsx` | Navigation setup |
| Store/get token | `src/utils/secureStorage.ts` | Secure storage |
| Type definitions | `src/types/auth.ts` | TypeScript interfaces |

---

## 🚀 Code Snippets

### Use Auth Anywhere
```typescript
import { useAuthContext } from '@/src/context/authContext';

export function MyComponent() {
  const { user, login, logout, isLoading } = useAuthContext();
  
  return (
    <View>
      <Text>{user?.name}</Text>
      <Button onPress={logout} title="Logout" />
    </View>
  );
}
```

### Make API Call with Auth
```typescript
import api from '@/src/config/api';

// Token is automatically added!
const response = await api.get('/user/profile');
```

### Validate Form
```typescript
import { validateRegistration } from '@/src/utils/validation';

const errors = validateRegistration({
  email: 'test@example.com',
  password: 'Password123',
  confirmPassword: 'Password123',
  name: 'John'
});

if (Object.keys(errors).length > 0) {
  // Show errors
}
```

### Handle Errors
```typescript
import { AuthErrorHandler } from '@/src/utils/errorHandler';

try {
  await login(email, password);
} catch (error) {
  const message = AuthErrorHandler.getUserFriendlyMessage(error);
  Alert.alert('Error', message);
}
```

---

## 🧩 Component Props & Returns

### useAuthContext() Returns
```typescript
{
  user: User | null           // Currently logged in user
  token: string | null        // Auth token
  isLoading: boolean          // API calls in progress
  error: string | null        // Last error
  isAuthenticated: boolean    // Is user logged in
  login: (email, password) => Promise<void>
  register: (email, password, confirmPassword, name) => Promise<void>
  logout: () => Promise<void>
  requestPasswordReset: (email) => Promise<void>
  resetPassword: (token, password, confirmPassword) => Promise<void>
}
```

### User Object Structure
```typescript
{
  id: string           // User ID
  email: string        // Email address
  name: string         // Display name
  avatar?: string      // Profile picture (optional)
  createdAt?: string   // Account creation date (optional)
}
```

---

## 🔄 Common Operations

### Login User
```typescript
const { login } = useAuthContext();

await login('user@example.com', 'password123');
```

### Register New User
```typescript
const { register } = useAuthContext();

await register(
  'user@example.com',
  'Password123',
  'Password123',
  'John Doe'
);
```

### Logout User
```typescript
const { logout } = useAuthContext();

await logout();
```

### Reset Password
```typescript
const { requestPasswordReset } = useAuthContext();

// Step 1: Request reset email
await requestPasswordReset('user@example.com');

// Step 2: User gets email with reset token

// Step 3: Reset password
const { resetPassword } = useAuthContext();
await resetPassword(resetToken, 'NewPassword123', 'NewPassword123');
```

---

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| Email | Valid format (RFC 5322), required |
| Password | 8+ chars, 1+ uppercase, 1+ lowercase, 1+ number |
| Name | 2-50 characters, required |
| Confirm Password | Must match password field |

---

## 🐛 Quick Debug Checklist

**API not working?**
- [ ] Check `src/config/api.ts` line 14 (correct URL?)
- [ ] Check network tab in debugger
- [ ] Check backend is running
- [ ] Check request/response format

**Token not persisting?**
- [ ] Check `useAuth.ts` useEffect runs on startup
- [ ] Check `secureStorage.ts` functions are called
- [ ] Check Android/iOS secure store permissions
- [ ] Check `authStore.ts` is updated

**Validation not showing?**
- [ ] Check validation function is called
- [ ] Check error state is displayed in JSX
- [ ] Check styles are correct
- [ ] Check text input onChange is set

**Login button not working?**
- [ ] Check `useAuthContext()` is called correctly
- [ ] Check login function is awaited
- [ ] Check error is caught and displayed
- [ ] Check console for errors

**Navigation broken?**
- [ ] Check `app/_layout.tsx` for conditional rendering
- [ ] Check `isAuthenticated` is updating correctly
- [ ] Check screens are defined in navigation
- [ ] Check AuthProvider wraps entire app

---

## 📝 API Endpoints Reference

```
POST /auth/register
  Input: { email, password, name }
  Output: { token, user, refreshToken? }

POST /auth/login
  Input: { email, password }
  Output: { token, user, refreshToken? }

POST /auth/logout
  Headers: Authorization: Bearer {token}
  Output: { message }

POST /auth/forgot-password
  Input: { email }
  Output: { message }

POST /auth/reset-password
  Input: { token, password }
  Output: { message }

POST /auth/refresh
  Input: { refreshToken }
  Output: { token, user }

POST /auth/verify
  Input: { token }
  Output: { valid }
```

---

## 🔐 Security Checklist

- ✅ Never log tokens
- ✅ Use HTTPS in production
- ✅ Set token expiration (15-60 min)
- ✅ Use refresh tokens
- ✅ Secure storage for tokens
- ✅ Validate on backend too
- ✅ Rate limit auth endpoints
- ✅ CORS configured

---

## 📊 State Values Examples

### While Loading
```javascript
{
  token: 'previous_token',
  user: { id: '123', name: 'John' },
  isLoading: true,        // ← API call in progress
  error: null,
  isAuthenticated: true
}
```

### Login Success
```javascript
{
  token: 'new_jwt_token_here',  // ← Updated
  user: { id: '123', name: 'John' },
  isLoading: false,       // ← Done loading
  error: null,            // ← No error
  isAuthenticated: true   // ← Logged in
}
```

### Login Error
```javascript
{
  token: null,
  user: null,
  isLoading: false,       // ← Done loading
  error: 'Invalid password',  // ← Error message
  isAuthenticated: false
}
```

### After Logout
```javascript
{
  token: null,            // ← Cleared
  user: null,             // ← Cleared
  isLoading: false,
  error: null,
  isAuthenticated: false  // ← Not logged in
}
```

---

## 🎯 Directory Quick Map

```
forma_app/
├── app/               ← Screens & Navigation
│   └── auth/          ← Auth screens
├── src/               ← Business Logic
│   ├── hooks/         ← useAuth hook
│   ├── context/       ← authContext
│   ├── services/      ← authService
│   ├── store/         ← authStore
│   ├── types/         ← Type defs
│   ├── utils/         ← Helpers
│   └── config/        ← api.ts
├── components/        ← Reusable UI
├── constants/         ← Config values
└── assets/            ← Images/media
```

---

## 🔍 Search Tips (Ctrl+Shift+F)

| Want to find... | Search for... |
|-----------------|---------------|
| Login function | `async login` |
| Register function | `async register` |
| API call | `api.post` |
| Error message | `"message"` |
| State update | `setState` |
| Token storage | `setToken` |
| Validation | `validate` |
| Route/screen | `.tsx` (then filter by folder) |

---

## 🚨 DANGER ZONE (Don't mess with these!)

```
⛔ CRITICAL - Auth won't work if broken:
   src/hooks/useAuth.ts
   src/context/authContext.tsx
   src/config/api.ts
   src/store/authStore.ts

⚠️  IMPORTANT - UI/UX will break:
   app/auth/*.tsx
   src/utils/validation.ts
   src/utils/errorHandler.ts

✅ SAFE - Low risk:
   src/utils/secureStorage.ts
   src/services/authService.ts
   constants/theme.ts
```

---

## 📞 File Dependencies

```
Changing: src/types/auth.ts
Impact: Need to update all imports of these types

Changing: src/store/authStore.ts
Impact: useAuth.ts and all components using authContext

Changing: src/config/api.ts
Impact: All API calls (authService)

Changing: src/services/authService.ts
Impact: useAuth.ts (which calls these functions)

Changing: app/auth/login.tsx
Impact: None! (only this screen affected)

Changing: constants/theme.ts
Impact: All screens using theme values
```

---

## ⚡ Performance Tips

1. **Use context selectors** - Only update when needed
2. **Memoize callbacks** - Use `useCallback` in hooks
3. **Lazy load screens** - Split code chunks
4. **Minimize re-renders** - Check dependency arrays
5. **Cache API responses** - Don't call same endpoint twice

---

**Bookmark this for quick reference! 🔖**
