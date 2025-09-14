
import { create } from 'zustand';
import type { HexModelDescription } from './models';

interface ContentCacheState {
  planetLore: Map<string, string>;
  buildingLore: Map<string, string>;
  buildingImages: Map<string, string>;
  hexModels: Map<string, HexModelDescription>;
  
  getPlanetLore: (key: string) => string | undefined;
  setPlanetLore: (key: string, lore: string) => void;
  getBuildingLore: (key: string) => string | undefined;
  setBuildingLore: (key: string, lore: string) => void;
  getBuildingImage: (key: string) => string | undefined;
  setBuildingImage: (key: string, imageUrl: string) => void;
  getHexModel: (key: string) => HexModelDescription | undefined;
  setHexModel: (key: string, model: HexModelDescription) => void;
}

export const useContentCacheStore = create<ContentCacheState>((set, get) => ({
  planetLore: new Map(),
  buildingLore: new Map(),
  buildingImages: new Map(),
  hexModels: new Map(),
  
  getPlanetLore: (key) => get().planetLore.get(key),
  setPlanetLore: (key, lore) => set((state) => ({
    planetLore: new Map(state.planetLore).set(key, lore),
  })),

  getBuildingLore: (key) => get().buildingLore.get(key),
  setBuildingLore: (key, lore) => set((state) => ({
    buildingLore: new Map(state.buildingLore).set(key, lore),
  })),

  getBuildingImage: (key) => get().buildingImages.get(key),
  setBuildingImage: (key, imageUrl) => set((state) => ({
    buildingImages: new Map(state.buildingImages).set(key, imageUrl),
  })),

  getHexModel: (key) => get().hexModels.get(key),
  setHexModel: (key, model) => set((state) => ({
    hexModels: new Map(state.hexModels).set(key, model),
  })),
}));
