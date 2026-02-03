import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSignout, setIsSignout] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const bootstrapAsync = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        if (currentUser) {
          // Verify token is still valid
          const verified = await authService.verifyToken();
          if (verified) {
            setUser(currentUser);
          } else {
            // Token expired
            await authService.logout();
          }
        }
      } catch (e) {
        // Restoring token failed
        console.error('Failed to restore token:', e);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async (email, password) => {
      try {
        setIsLoading(true);
        const response = await authService.login(email, password);
        setUser(response.user);
        setIsSignout(false);
        return { success: true };
      } catch (error) {
        return {
          success: false,
          error: error.response?.data?.message || 'Login failed',
        };
      } finally {
        setIsLoading(false);
      }
    },

    signOut: async () => {
      try {
        setIsLoading(true);
        await authService.logout();
        setUser(null);
        setIsSignout(true);
      } catch (error) {
        console.error('Logout failed:', error);
      } finally {
        setIsLoading(false);
      }
    },

    signUp: async (email, password, name) => {
      // Not implemented for nurse app (admin creates accounts)
      return {
        success: false,
        error: 'Registration not available',
      };
    },
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: authContext.signIn,
        signOut: authContext.signOut,
        signUp: authContext.signUp,
        user,
        isLoading,
        isSignout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
