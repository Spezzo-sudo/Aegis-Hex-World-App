

import { create } from 'zustand';
// The User type should be imported from 'firebase/auth' in the v9+ modular SDK.
// FIX: Use a named import for the User type from 'firebase/auth'.
// This resolves the module resolution error.
import type { User } from 'firebase/auth';

interface AuthState {
  // FIX: Use User type from the named import.
  user: User | null;
  isLoading: boolean;
  error: string | null;
  // FIX: Use User type from the named import.
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true, // Start in loading state until first auth check
  error: null,
  setUser: (user) => set({ user, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));