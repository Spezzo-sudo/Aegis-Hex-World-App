
import { create } from 'zustand';
import { Colony } from './index';

interface PlayerState {
  colony: Colony | null;
  setColony: (colony: Colony) => void;
  updateColony: (updatedFields: Partial<Colony>) => void;
  clearColony: () => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  colony: null,
  setColony: (colony) => set({ colony }),
  updateColony: (updatedFields) => set((state) => ({
    colony: state.colony ? { ...state.colony, ...updatedFields, lastUpdated: Date.now() } : null,
  })),
  clearColony: () => set({ colony: null }),
}));
