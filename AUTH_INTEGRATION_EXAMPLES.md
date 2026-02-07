// Example: Complete Auth Integration

// 1. ROOT LAYOUT - Set up AuthProvider
// app/_layout.tsx

import { AuthProvider } from '@/src/context/authContext';
import { RootNavigator } from '@/src/navigation/RootNavigator';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}

// ---

// 2. NAVIGATION - Conditional rendering based on auth
// src/navigation/RootNavigator.tsx

import { useAuthContext } from '@/src/context/authContext';
import { ActivityIndicator, View } from 'react-native';

export function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return isAuthenticated ? <AppNavigator /> : <AuthNavigator />;
}

// ---

// 3. AUTH NAVIGATOR - Stack for login/register/forgot-password
// src/navigation/AuthNavigator.tsx

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoginScreen } from '@/app/auth/login';
import { RegisterScreen } from '@/app/auth/register';
import { ForgotPasswordScreen } from '@/app/auth/forgot-password';
import { ResetPasswordScreen } from '@/app/auth/reset-password';

const Stack = createNativeStackNavigator();

export function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

// ---

// 4. LOGIN SCREEN USAGE
// app/auth/login.tsx

import { LoginScreen } from '@/app/auth/login';
import { useNavigation } from '@react-navigation/native';

export function LoginScreenWrapper() {
  const navigation = useNavigation<any>();

  return (
    <LoginScreen
      onNavigateToSignUp={() => navigation.navigate('Register')}
      onNavigateToForgotPassword={() => navigation.navigate('ForgotPassword')}
      onLoginSuccess={() => {
        // Auth context is now authenticated
        // Navigation will automatically switch to AppNavigator
      }}
    />
  );
}

// ---

// 5. PROFILE SCREEN - Using auth context
// app/(tabs)/profile.tsx

import { useAuthContext } from '@/src/context/authContext';
import { View, Text, TouchableOpacity } from 'react-native';

export function ProfileScreen() {
  const { user, logout, isLoading } = useAuthContext();

  const handleLogout = async () => {
    try {
      await logout();
      // Navigation automatically switches to AuthNavigator
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
        {user?.name}
      </Text>
      <Text style={{ marginBottom: 10 }}>Email: {user?.email}</Text>
      
      <TouchableOpacity
        onPress={handleLogout}
        disabled={isLoading}
        style={{
          backgroundColor: '#FF6B6B',
          padding: 12,
          borderRadius: 8,
          marginTop: 20,
        }}
      >
        <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
          Sign Out
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ---

// 6. PROTECTED API CALL EXAMPLE
// Example using authenticated API

import api from '@/src/config/api';
import { useAuthContext } from '@/src/context/authContext';

export function UserDataComponent() {
  const { isAuthenticated } = useAuthContext();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated) return;

      try {
        // Token is automatically added to headers
        const response = await api.get('/user/profile');
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated]);

  return <Text>{userData?.name}</Text>;
}

// ---

// 7. FORM VALIDATION EXAMPLE
// Using validation utilities

import { validateRegistration, ValidationError } from '@/src/utils/validation';

function MyForm() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [errors, setErrors] = useState<ValidationError>({});

  const handleSubmit = () => {
    // Validate before submission
    const validationErrors = validateRegistration(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // No errors, proceed with registration
    register(formData);
  };

  return (
    <View>
      {Object.entries(errors).map(([field, error]) => (
        <Text key={field} style={{ color: 'red' }}>{error}</Text>
      ))}
    </View>
  );
}

// ---

// 8. ERROR HANDLING EXAMPLE
// Using error handler

import { AuthErrorHandler } from '@/src/utils/errorHandler';

async function handleLogin(email: string, password: string) {
  try {
    await login({ email, password });
  } catch (error) {
    // Parse error and show user-friendly message
    const userMessage = AuthErrorHandler.getUserFriendlyMessage(error);
    Alert.alert('Login Failed', userMessage);
  }
}

// ---

// 9. SECURE STORAGE EXAMPLE
// Token persistence is automatic, but here's direct usage if needed

import { secureStorage } from '@/src/utils/secureStorage';

// Save token
await secureStorage.setToken('your_token_here');

// Get token
const token = await secureStorage.getToken();

// Clear all
await secureStorage.clearAll();

// ---

// 10. CUSTOM HOOK FOR PROTECTED ROUTES

import { useAuthContext } from '@/src/context/authContext';

export function useProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) {
    return { status: 'loading' };
  }

  if (!isAuthenticated) {
    return { status: 'unauthenticated' };
  }

  return { status: 'authenticated' };
}

// Usage
function MyProtectedScreen() {
  const { status } = useProtectedRoute();

  if (status === 'loading') return <LoadingSpinner />;
  if (status === 'unauthenticated') return <LoginPrompt />;

  return <ProtectedContent />;
}
