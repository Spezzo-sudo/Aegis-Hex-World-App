import { auth } from './firebase';
// FIX: Changed import path to firebase/auth/browser to resolve module export error.
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut,
    AuthError
} from 'firebase/auth/browser';
import { createPlayerColony } from './playerDataService';

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
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await createPlayerColony(userCredential.user.uid, email);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getFriendlyErrorMessage(error as AuthError) };
    }
};

export const signInWithEmail = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        return { success: false, error: getFriendlyErrorMessage(error as AuthError) };
    }
};

export const signOutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to sign out. Please try again.' };
    }
};
