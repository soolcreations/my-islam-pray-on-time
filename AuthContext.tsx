// User authentication context for web
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { FirebaseAuthService } from '@shared/firebase/firebaseService';
import { PersistentStorageService } from '@shared/persistence/storageService';
import { WebStorageProvider } from '@shared/persistence/storageService';

// Create instances
const authService = new FirebaseAuthService();
const storageProvider = new WebStorageProvider();
const persistentStorage = new PersistentStorageService(storageProvider);

// Context type definitions
interface AuthContextType {
  currentUser: any;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Register a new user
  const register = async (email: string, password: string, displayName: string) => {
    setError(null);
    try {
      await authService.registerWithEmailAndPassword(email, password, displayName);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email: string, password: string) => {
    setError(null);
    try {
      await authService.signInWithEmailAndPassword(email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    setError(null);
    try {
      await authService.signInWithGoogle();
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setError(null);
    try {
      await authService.signOut();
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  // Reset password
  const resetPassword = async (email: string) => {
    setError(null);
    try {
      await authService.sendPasswordResetEmail(email);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        error,
        register,
        login,
        loginWithGoogle,
        logout,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
