import { create } from 'zustand';
import { Colony, Resource, QueueItem, BuildingType, ResearchType, UnitType, CombatReport, GameObjectType } from './index';

interface PlayerState {
  colony: Colony | null;
  setColony: (colony: Colony) => void;
  updateResources: (resources: Partial<{ [key in Resource]: number }>) => void;
  addQueueItem: (queueType: 'building' | 'research' | 'shipyard', item: QueueItem) => void;
  finishBuilding: (item: QueueItem) => void;
  finishResearch: (item: QueueItem) => void;
  finishShipyard: (item: QueueItem) => void;
  addCombatLog: (report: CombatReport) => void;
}

const finishQueueItem = (state: Colony, queueType: 'buildingQueue' | 'researchQueue' | 'shipyardQueue', item: QueueItem) => {
    return {
        ...state,
        [queueType]: state[queueType].filter(q => q.id !== item.id)
    }
}

export const usePlayerStore = create<PlayerState>((set) => ({
  colony: null,
  setColony: (colony) => set({ colony }),
  updateResources: (resources) =>
    set((state) => {
      if (!state.colony) return {};
      const newResources = { ...state.colony.resources };
      for (const key in resources) {
        const resourceKey = key as Resource;
        newResources[resourceKey] = (newResources[resourceKey] || 0) + (resources[resourceKey] || 0);
      }
      return { colony: { ...state.colony, resources: newResources } };
    }),
  addQueueItem: (queueType, item) => 
    set((state) => {
        if(!state.colony) return {};
        const queueKey = `${queueType}Queue` as 'buildingQueue' | 'researchQueue' | 'shipyardQueue';
        return {
            colony: {
                ...state.colony,
                [queueKey]: [...state.colony[queueKey], item]
            }
        }
    }),
  finishBuilding: (item) => 
    set((state) => {
        if(!state.colony) return {};
        const buildingKey = item.type as BuildingType;

        const newBuildings = { ...state.colony.buildings };
        if(newBuildings[buildingKey]) {
            newBuildings[buildingKey]!.level = item.levelOrAmount;
        } else {
            newBuildings[buildingKey] = { level: 1, energyConsumption: 0 }; // Simplified, energy should be calculated
        }

        return {
            colony: finishQueueItem({ ...state.colony, buildings: newBuildings }, 'buildingQueue', item)
        }
    }),
  finishResearch: (item) =>
    set((state) => {
        if (!state.colony) return {};
        const researchKey = item.type as ResearchType;
        const newResearch = { ...state.colony.research };
        newResearch[researchKey] = item.levelOrAmount;
        return {
            colony: finishQueueItem({ ...state.colony, research: newResearch }, 'researchQueue', item)
        };
    }),
  finishShipyard: (item) =>
    set((state) => {
        if (!state.colony) return {};
        const unitKey = item.type as UnitType;
        const newUnits = { ...state.colony.units };
        newUnits[unitKey] = (newUnits[unitKey] || 0) + item.levelOrAmount;
        return {
            colony: finishQueueItem({ ...state.colony, units: newUnits }, 'shipyardQueue', item)
        };
    }),
  addCombatLog: (report) =>
    set((state) => {
        if (!state.colony) return {};
        return {
            colony: {
                ...state.colony,
                combatLog: [report, ...state.colony.combatLog].slice(0, 10) // Keep last 10 reports
            }
        }
    })
}));