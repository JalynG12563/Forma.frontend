# 🔧 Troubleshooting & Debugging Guide

## Table of Contents
1. [Common Issues](#common-issues)
2. [Debugging Tools](#debugging-tools)
3. [Error Messages & Solutions](#error-messages--solutions)
4. [Step-by-Step Debugging](#step-by-step-debugging)
5. [Performance Issues](#performance-issues)

---

## Common Issues

### Issue 1: Login Not Working

**Symptoms:** Login button doesn't do anything or shows generic error

**Debugging Steps:**

```typescript
// Step 1: Add console logs to see where it breaks
// In app/auth/login.tsx

const handleLogin = async () => {
  try {
    console.log('1. Login clicked with:', { email, password });
    const result = await login(email, password);
    console.log('2. Login success:', result);
    onLoginSuccess?.();
  } catch (error) {
    console.log('3. Login error:', error);
    Alert.alert('Login Failed', error.message);
  }
};
```

**Check in this order:**

1. **Is useAuthContext working?**
   ```typescript
   // Should not throw error "useAuthContext must be used within AuthProvider"
   const { login } = useAuthContext();
   console.log('useAuthContext available:', !!login);
   ```

2. **Is API configured?**
   ```typescript
   // In src/config/api.ts, check line 14
   const API_CONFIG = {
     development: {
       baseURL: 'http://localhost:3000/api',  // ← Is this correct?
   ```

3. **Is backend responding?**
   ```typescript
   // In React Native debugger Network tab
   - Check POST request to /auth/login
   - Check response code (200, 400, 500, etc)
   - Check response body contains token
   ```

4. **Is token format correct?**
   ```typescript
   // Token should be JWT format
   // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   // (3 parts separated by dots)
   ```

**Solution Checklist:**
- [ ] Update API URL in `src/config/api.ts`
- [ ] Verify backend endpoint exists
- [ ] Check request headers (Content-Type, etc)
- [ ] Verify response includes `token` and `user`
- [ ] Check backend error logs
- [ ] Test with Postman/curl first

---

### Issue 2: Token Not Persisting After App Restart

**Symptoms:** User logged in, closed app, reopened app, now logged out

**Debugging Steps:**

```typescript
// Step 1: Check if token saves to secure storage
// In src/utils/secureStorage.ts

export const secureStorage = {
  async setToken(token: string): Promise<void> {
    try {
      console.log('Saving token:', token.substring(0, 20) + '...');
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      console.log('✓ Token saved');
    } catch (error) {
      console.error('✗ Failed to save token:', error);
      throw error;
    }
  },
  
  async getToken(): Promise<string | null> {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      console.log('Retrieved token:', token?.substring(0, 20) + '...' || 'none');
      return token;
    } catch (error) {
      console.error('✗ Failed to get token:', error);
      return null;
    }
  },
};
```

**Check in this order:**

1. **Does useAuth hook load token on startup?**
   ```typescript
   // In src/hooks/useAuth.ts, first useEffect should run
   // Add console.log to verify:
   
   useEffect(() => {
     const loadToken = async () => {
       console.log('Loading token on startup...');
       const savedToken = await secureStorage.getToken();
       console.log('Loaded token:', savedToken);
       if (savedToken) {
         setToken(savedToken);
       }
     };
     loadToken();
   }, [setToken]);
   ```

2. **Are secure storage permissions set?**
   - Android: Check `AndroidManifest.xml`
   - iOS: Check `info.plist`

3. **Is token actually saving?**
   ```typescript
   // In login function, after receiving token:
   console.log('About to save token:', token);
   await secureStorage.setToken(token);
   console.log('Token saved, getting it back:', await secureStorage.getToken());
   ```

**Solution Checklist:**
- [ ] Add console logs to secureStorage functions
- [ ] Check permissions for secure storage
- [ ] Verify setToken is called after login
- [ ] Verify getToken is called on app startup
- [ ] Test on actual device (simulator might have issues)
- [ ] Check app logs for storage errors

---

### Issue 3: API Requests Missing Auth Header

**Symptoms:** API returns 401 Unauthorized even though user is logged in

**Debugging Steps:**

```typescript
// Step 1: Verify interceptor is working
// In src/config/api.ts, add logging:

api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('auth_token');
    console.log('Request interceptor - token exists:', !!token);
    console.log('Current headers:', config.headers);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✓ Added auth header');
    } else {
      console.log('✗ No token to add');
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);
```

**Check in this order:**

1. **Is token in store?**
   ```typescript
   // In any component
   const { token } = useAuthContext();
   console.log('Token in context:', token);
   ```

2. **Is interceptor running?**
   ```typescript
   // Look at React Native debugger Network tab
   - Right click request
   - View headers
   - Should see: Authorization: Bearer eyJ...
   ```

3. **Is Authorization header format correct?**
   ```typescript
   // Should be exactly:
   Authorization: Bearer {token}
   // NOT:
   Authorization: {token}
   Authorization: JWT {token}
   Authorization: "Bearer {token}"  // extra quotes
   ```

**Solution Checklist:**
- [ ] Verify token exists in store (not null)
- [ ] Check token is valid JWT format
- [ ] Check interceptor adds header (view in Network tab)
- [ ] Verify header format matches backend expectations
- [ ] Test API endpoint separately with curl/Postman

---

### Issue 4: Validation Errors Not Showing

**Symptoms:** User enters invalid data, no error messages appear

**Debugging Steps:**

```typescript
// Step 1: Verify validation is called
// In app/auth/login.tsx, add logging:

const handleLogin = async () => {
  const errors = validateLogin(credentials);
  console.log('Validation errors:', errors);
  
  if (Object.keys(errors).length > 0) {
    console.log('✓ Errors found, setting state');
    setValidationErrors(errors);
    return;
  }
  console.log('✓ No validation errors, proceeding');
  // ...
};
```

**Check in this order:**

1. **Is validation function working?**
   ```typescript
   // Test directly in console
   import { validateLogin } from '@/src/utils/validation';
   
   const errors = validateLogin({
     email: 'invalid',
     password: ''
   });
   console.log(errors);
   // Should show: { email: '...', password: '...' }
   ```

2. **Is error state updating?**
   ```typescript
   console.log('Validation errors state:', validationErrors);
   // Should show errors object
   ```

3. **Is error displayed in JSX?**
   ```typescript
   {validationErrors.email && (
     <Text style={styles.errorText}>{validationErrors.email}</Text>
   )}
   // Make sure this JSX is in render
   ```

**Solution Checklist:**
- [ ] Add console logs to validation function
- [ ] Check error state is being set
- [ ] Verify error message exists in styles
- [ ] Check error text color is visible
- [ ] Test validation function in isolation

---

### Issue 5: 401 Errors and Token Refresh Not Working

**Symptoms:** API calls return 401, automatic token refresh doesn't happen

**Debugging Steps:**

```typescript
// In src/config/api.ts, add detailed logging:

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    console.log('Response error - Status:', error.response?.status);
    
    if (error.response?.status === 401) {
      console.log('Got 401 - attempting token refresh');
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        console.log('Refresh token exists:', !!refreshToken);
        
        if (refreshToken) {
          console.log('Sending refresh request...');
          const response = await axios.post(`${config.baseURL}/auth/refresh`, {
            refreshToken
          });
          
          console.log('✓ Token refreshed');
          const newToken = response.data.token;
          localStorage.setItem('auth_token', newToken);
          
          // Retry original request
          const originalRequest = error.config as any;
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return api(originalRequest);
        }
      } catch (err) {
        console.error('✗ Refresh failed:', err);
        // Logout user
      }
    }
    return Promise.reject(error);
  }
);
```

**Solution Checklist:**
- [ ] Verify refresh token endpoint exists
- [ ] Check refresh token is valid
- [ ] Ensure token refresh returns new token
- [ ] Verify new token is saved
- [ ] Check original request is retried
- [ ] Test endpoint with curl/Postman first

---

## Debugging Tools

### 1. React Native Debugger

**View Network Requests:**
- Open React Native Debugger
- Go to Network tab
- Make API call
- Inspect request/response

**View Console:**
- Open React Native Debugger
- Go to Console tab
- See all console.log() output

**View State:**
- Open React Native Debugger
- Use Redux DevTools
- See store changes

### 2. VSCode Debugging

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Attach Debugger"
    }
  ]
}
```

### 3. Console Logging Strategy

```typescript
// Good: Consistent logging
console.log('🔵 Auth: Loading token');
console.log('🟢 Auth: Token loaded successfully');
console.log('🔴 Auth: Token load failed', error);

// Bad: No context
console.log('Token');
console.log(error);
```

### 4. Postman Testing

```
Before testing React app, test API with Postman:

1. POST /auth/login
   Body: { email, password }
   Expected: { token, user }

2. GET /user/profile
   Headers: Authorization: Bearer {token}
   Expected: User data

3. POST /auth/refresh
   Body: { refreshToken }
   Expected: { token }
```

---

## Error Messages & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "useAuthContext must be used within AuthProvider" | AuthProvider not wrapping app | Wrap app with `<AuthProvider>` in `app/_layout.tsx` |
| "Cannot read property 'login' of undefined" | useAuthContext not available | Check AuthProvider exists, check import |
| "Network Error" | Backend unreachable | Check API URL, check backend running, check WiFi |
| "401 Unauthorized" | Token missing or invalid | Check token saved, check token not expired |
| "Invalid email" | Email validation failed | Check regex in `validation.ts` |
| "Password must be..." | Password doesn't meet requirements | Check password has upper, lower, number, 8+ chars |
| "User not found" | Email doesn't exist | Make sure user registered first |
| "Incorrect password" | Wrong password | Check caps lock, check typed correctly |

---

## Step-by-Step Debugging

### Scenario: Login completely broken

**Step 1: Isolate the problem**
```typescript
// Test validation first
const { errors } = validateLogin({ email, password });
console.log('Validation:', errors);

// If validation passes, test API
const response = await authService.login({ email, password });
console.log('API response:', response);

// If API works, test context
const { login } = useAuthContext();
await login(email, password);
```

**Step 2: Add console logs at each layer**
```
Screen → console.log('Button clicked')
   ↓
Context → console.log('useAuthContext called')
   ↓
Hook → console.log('useAuth.login called')
   ↓
Service → console.log('authService.login called')
   ↓
API → console.log('Request sent')
```

**Step 3: Check each file**
```
✓ Is app/_layout.tsx wrapping with AuthProvider?
✓ Is login.tsx importing useAuthContext correctly?
✓ Is authContext.tsx providing the hook?
✓ Is useAuth.ts implementing login?
✓ Is authService.ts calling correct endpoint?
✓ Is api.ts configured correctly?
```

### Scenario: Token not persisting

**Step 1: Verify save flow**
```
login() → setToken() → secureStorage.setToken()
         ↓
Check each step with console.log
```

**Step 2: Verify load flow**
```
App starts → useAuth useEffect → secureStorage.getToken() → setToken()
                                                             ↓
Check each step with console.log
```

**Step 3: Test secure storage directly**
```typescript
// In any component
const testStorage = async () => {
  await secureStorage.setToken('test_token');
  const token = await secureStorage.getToken();
  console.log('Saved and retrieved:', token === 'test_token');
};
```

---

## Performance Issues

### Issue: App is slow

**Debugging:**
```typescript
// Check for unnecessary re-renders
console.log('LoginScreen rendered');
// Should only log once on load

// Check for inefficient loops
const bigList = items.map(() => {
  console.log('Mapping item');  // Should log N times, not many more
});

// Check for API call loops
useEffect(() => {
  login();  // Don't do this! Infinite loop
}, []);

useEffect(() => {
  login();
}, [login]);  // Better, only runs when login changes
```

**Solutions:**
- Use `useCallback` for function props
- Use selective subscriptions with Zustand
- Memoize expensive components
- Check Network tab for extra API calls

### Issue: Memory leak warning

**Cause:** useEffect not cleaned up properly

**Fix:**
```typescript
useEffect(() => {
  let mounted = true;
  
  const load = async () => {
    const token = await secureStorage.getToken();
    if (mounted) {
      setToken(token);
    }
  };
  
  load();
  
  return () => {
    mounted = false;  // ← Cleanup
  };
}, [setToken]);
```

---

## Testing Checklist

Before deploying, test:

- [ ] Login with valid credentials
- [ ] Login with invalid email
- [ ] Login with wrong password
- [ ] Register with valid data
- [ ] Register with weak password
- [ ] Register with existing email
- [ ] Logout and verify
- [ ] Close app and reopen (token persists?)
- [ ] Request password reset
- [ ] Reset password
- [ ] Make API call with token
- [ ] Token refresh on 401
- [ ] Network error handling
- [ ] Very long input (check for overflow)
- [ ] Rapid button clicks (check for race conditions)
- [ ] Switch networks (WiFi to cellular)
- [ ] Low battery mode

---

**Happy debugging! 🎯**
