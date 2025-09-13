

import { auth } from './firebase';
// FIX: Use named imports for Firebase auth functions and types.
// This resolves module resolution errors where the namespace import did not work.
import { AuthError, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { createPlayerColony } from './playerDataService';

// FIX: Use AuthError type from named import.
const getFriendlyErrorMessage = (error: AuthError): string => {
    switch (error.code) {
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
            console.error('Firebase Auth Error:', error);
            return 'An unexpected error occurred. Please try again.';
    }
};


export const signUpWithEmail = async (email: string, password: string) => {
    if (!auth) {
        return { success: false, error: "Firebase is not configured." };
    }
    try {
        // In Firebase v9+, auth methods are imported and the auth instance is passed as the first argument.
        // FIX: Use function from named import.
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential.user) {
            await createPlayerColony(userCredential.user.uid, email);
            return { success: true, user: userCredential.user };
        }
        return { success: false, error: 'User creation failed unexpectedly.' };
    } catch (error) {
        // FIX: Use type from named import for casting.
        return { success: false, error: getFriendlyErrorMessage(error as AuthError) };
    }
};

export const signInWithEmail = async (email: string, password: string) => {
    if (!auth) {
        return { success: false, error: "Firebase is not configured." };
    }
    try {
        // In Firebase v9+, auth methods are imported and the auth instance is passed as the first argument.
        // FIX: Use function from named import.
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        // FIX: Use type from named import for casting.
        return { success: false, error: getFriendlyErrorMessage(error as AuthError) };
    }
};

export const signOutUser = async () => {
    if (!auth) {
        return { success: false, error: "Firebase is not configured." };
    }
    try {
        // In Firebase v9+, auth methods are imported and the auth instance is passed as the first argument.
        // FIX: Use function from named import.
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to sign out. Please try again.' };
    }
};