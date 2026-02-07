import { AuthError } from '@/src/types/auth';

export class AuthErrorHandler {
  static readonly ERRORS = {
    INVALID_EMAIL: {
      code: 'INVALID_EMAIL',
      message: 'Please enter a valid email address',
    },
    WEAK_PASSWORD: {
      code: 'WEAK_PASSWORD',
      message: 'Password must be at least 8 characters with uppercase, lowercase, and numbers',
    },
    PASSWORDS_DONT_MATCH: {
      code: 'PASSWORDS_DONT_MATCH',
      message: 'Passwords do not match',
    },
    USER_NOT_FOUND: {
      code: 'USER_NOT_FOUND',
      message: 'User not found. Please check your email.',
    },
    INVALID_PASSWORD: {
      code: 'INVALID_PASSWORD',
      message: 'Incorrect password. Please try again.',
    },
    USER_ALREADY_EXISTS: {
      code: 'USER_ALREADY_EXISTS',
      message: 'An account with this email already exists',
    },
    INVALID_TOKEN: {
      code: 'INVALID_TOKEN',
      message: 'Reset link is invalid or has expired',
    },
    TOKEN_EXPIRED: {
      code: 'TOKEN_EXPIRED',
      message: 'Reset link has expired. Please request a new one.',
    },
    NETWORK_ERROR: {
      code: 'NETWORK_ERROR',
      message: 'Network connection error. Please check your internet connection.',
    },
    SERVER_ERROR: {
      code: 'SERVER_ERROR',
      message: 'Server error. Please try again later.',
    },
    UNAUTHORIZED: {
      code: 'UNAUTHORIZED',
      message: 'Session expired. Please log in again.',
    },
  };

  static parseError(error: any): AuthError {
    // If it's already an AuthError, return it
    if (error.code && error.message) {
      return error;
    }

    // Handle axios errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      if (data?.code && data?.message) {
        return {
          code: data.code,
          message: data.message,
          field: data.field,
        };
      }

      // Handle common HTTP errors
      switch (status) {
        case 400:
          return {
            code: 'INVALID_REQUEST',
            message: data?.message || 'Invalid request. Please check your input.',
          };
        case 401:
          return this.ERRORS.UNAUTHORIZED;
        case 404:
          return this.ERRORS.USER_NOT_FOUND;
        case 409:
          return this.ERRORS.USER_ALREADY_EXISTS;
        case 500:
          return this.ERRORS.SERVER_ERROR;
        default:
          return {
            code: 'UNKNOWN_ERROR',
            message: data?.message || 'An unexpected error occurred',
          };
      }
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED' || error.code === 'ENOTFOUND') {
      return this.ERRORS.NETWORK_ERROR;
    }

    // Handle Error messages
    if (error.message) {
      // Try to map common error messages
      if (error.message.includes('network')) {
        return this.ERRORS.NETWORK_ERROR;
      }
      if (error.message.includes('email')) {
        return this.ERRORS.INVALID_EMAIL;
      }
      if (error.message.includes('password')) {
        return this.ERRORS.WEAK_PASSWORD;
      }

      return {
        code: 'ERROR',
        message: error.message,
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'An unknown error occurred. Please try again.',
    };
  }

  static getUserFriendlyMessage(error: any): string {
    const parsed = this.parseError(error);
    return parsed.message;
  }

  static getFieldError(error: any, field: string): string | null {
    const parsed = this.parseError(error);
    if (parsed.field === field) {
      return parsed.message;
    }
    return null;
  }
}

export const handleAuthError = (error: any, showAlert: (message: string) => void) => {
  const authError = AuthErrorHandler.parseError(error);
  showAlert(authError.message);
};
