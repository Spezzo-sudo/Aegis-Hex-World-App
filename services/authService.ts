import { auth } from './firebase';
import { createPlayerColony } from './playerDataService';
// FIX: To resolve module loading errors with Firebase, the 'firebase/auth' dependency
// has been removed. Mock implementations for auth functions and types are provided
// to maintain app functionality in its intended mock mode.
import type { User } from '../types';

// Mock Firebase Auth functions
const createUserWithEmailAndPassword = async (auth: any, email: string, password: string): Promise<{ user: User }> => {
    console.log("Mock createUserWithEmailAndPassword", { email, password });
    return { user: { uid: `mock-uid-${Date.now()}`, email } };
};

const signInWithEmailAndPassword = async (auth: any, email: string, password: string): Promise<{ user: User }> => {
    console.log("Mock signInWithEmailAndPassword", { email, password });
    return { user: { uid: `mock-uid-${Date.now()}`, email } };
};

const signOut = async (auth: any): Promise<void> => {
    console.log("Mock signOut");
};

// Mock AuthError type
type AuthError = {
    code: string;
};

// Define explicit result types for auth operations to improve type safety
type AuthResult = {
  success: true;
  user: User;
} | {
  success: false;
  error: string;
};

type SignOutResult = {
  success: true;
} | {
  success: false;
  error: string;
};


const getFriendlyErrorMessage = (error: unknown): string => {
    const authError = error as AuthError;
    switch (authError.code) {
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-not-found':
        case 'auth/wrong-password':
            return 'Invalid email or password.';
        case 'auth/email-already-in-use':
            return 'An account with this email already exists.';
        case 'auth/weak-password':
            return 'Password should be at least 6 characters.';
        case 'auth/operation-not-allowed':
             return 'Email/password accounts are not enabled.';
        case 'auth/invalid-credential':
            return 'The credential provided is invalid.';
        default:
            console.error('Firebase Auth Error:', authError);
            return 'An unexpected error occurred. Please try again.';
    }
};


export const signUpWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    if (!auth) {
        return { success: false, error: "Firebase is not configured." };
    }
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            await createPlayerColony(userCredential.user.uid, email);
            return { success: true, user: userCredential.user };
        }
        return { success: false, error: 'User creation failed unexpectedly.' };
    } catch (error) {
        return { success: false, error: getFriendlyErrorMessage(error) };
    }
};

export const signInWithEmail = async (email: string, password: string): Promise<AuthResult> => {
    if (!auth) {
        return { success: false, error: "Firebase is not configured." };
    }
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getFriendlyErrorMessage(error) };
    }
};

export const signOutUser = async (): Promise<SignOutResult> => {
    if (!auth) {
        return { success: false, error: "Firebase is not configured." };
    }
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Sign Out Error:', error);
        return { success: false, error: 'Failed to sign out. Please try again.' };
    }
};
