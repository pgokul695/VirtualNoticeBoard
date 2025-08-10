import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { apiService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from our backend
          const token = await firebaseUser.getIdToken();
          const userData = await apiService.getCurrentUser(token);
          setUser({
            ...userData,
            token
          });
        } catch (error) {
          console.error('Failed to fetch user data:', error);
          // Use basic Firebase user data if our API fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            role: 'user',
            is_active: true,
            token: await firebaseUser.getIdToken()
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      console.log('Attempting to sign in with email:', email);
      
      // 1. Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Firebase sign-in successful, getting ID token...');
      
      // 2. Get Firebase ID token
      const token = await userCredential.user.getIdToken();
      console.log('Firebase ID token obtained, fetching user data from backend...');
      
      try {
        // 3. Get user data from our backend
        const userData = await apiService.getCurrentUser(token);
        
        if (!userData) {
          console.log('User not found in backend, registration required');
          return { 
            success: false, 
            error: 'User not registered. Please sign up first.',
            requiresRegistration: true
          };
        }
        
        console.log('User data retrieved from backend:', userData);
        
        // 4. Update user state
        setUser({
          ...userData,
          token
        });
        
        return { success: true };
      } catch (apiError) {
        console.error('Error fetching user data from backend:', apiError);
        // If we fail to get user data, still consider it a successful login
        // but mark that we need to complete registration
        if (apiError.status === 404) {
          return { 
            success: true, 
            requiresRegistration: true 
          };
        }
        throw apiError;
      }
    } catch (error) {
      console.error('Sign in failed:', error);
      let errorMessage = 'Failed to sign in. Please check your credentials.';
      
      // Provide more specific error messages
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      } else if (error.code) {
        errorMessage = `Authentication error: ${error.code.replace('auth/', '')}`;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken();
      
      // Register or get user data from our backend
      const userData = await apiService.registerUser({
        token,
        email: result.user.email,
        name: result.user.displayName || result.user.email.split('@')[0]
      });
      
      setUser({
        ...userData,
        token
      });
      
      return { success: true };
    } catch (error) {
      console.error('Google sign in failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign in with Google.' 
      };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, additionalData) => {
    try {
      setLoading(true);
      console.log('Starting user registration for:', email);
      
      // 1. First create the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Firebase user created, getting ID token...');
      
      // 2. Get the Firebase ID token
      const token = await userCredential.user.getIdToken();
      
      // 3. Prepare user data for our backend
      const userData = {
        email,
        name: additionalData.name || email.split('@')[0],
        role: additionalData.role || 'student',
        department: additionalData.department || 'CSE',
        firebase_uid: userCredential.user.uid, // Store Firebase UID in our backend
        is_active: true
      };

      console.log('Creating user in backend:', userData);
      
      // 4. Create user in our backend
      const createdUser = await apiService.createUser({
        ...userData,
        token // Include the Firebase token for backend verification
      });
      
      console.log('User created in backend:', createdUser);
      
      // 5. Sign in the user
      const signInResult = await signIn(email, password);
      
      if (!signInResult.success) {
        throw new Error(signInResult.error || 'Failed to sign in after registration');
      }
      
      return { success: true };
      
    } catch (error) {
      console.error('Sign up failed:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      // Handle specific Firebase errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Please choose a stronger password.';
      } else if (error.code) {
        errorMessage = `Registration error: ${error.code.replace('auth/', '')}`;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await firebaseSignOut(auth);
      setUser(null);
      return { success: true };
    } catch (error) {
      console.error('Sign out failed:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to sign out.' 
      };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signIn, 
      signUp, 
      signOut 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
