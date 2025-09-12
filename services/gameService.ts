import { BuildingType, Cost, Resource, GameObjectType, ResearchType, UnitType, CombatReport } from '../types';
import { BUILDING_DATA, RESEARCH_DATA, UNIT_DATA } from '../constants/gameData';
import { usePlayerStore } from '../types/usePlayerStore';

type DataType = typeof BUILDING_DATA | typeof RESEARCH_DATA | typeof UNIT_DATA;

// Helper to get data for any game object type
const getGameObjectData = (type: GameObjectType) => {
    if (type in BuildingType) return { data: BUILDING_DATA[type as BuildingType], collection: 'buildings' };
    if (type in ResearchType) return { data: RESEARCH_DATA[type as ResearchType], collection: 'research' };
    if (type in UnitType) return { data: UNIT_DATA[type as UnitType], collection: 'units' };
    return null;
}

// Helper to calculate cost for a given level or amount
export const calculateCost = (type: GameObjectType, levelOrAmount: number): Cost => {
  const data = getGameObjectData(type)?.data;
  if (!data) return {};

  const cost: Cost = {};
  const costFactor = 'costFactor' in data ? data.costFactor : 1;

  for (const resource in data.baseCost) {
    const resKey = resource as Resource;
    if (type in UnitType) {
        cost[resKey] = Math.floor(data.baseCost[resKey]! * levelOrAmount);
    } else {
        cost[resKey] = Math.floor(data.baseCost[resKey]! * Math.pow(costFactor, levelOrAmount - 1));
    }
  }
  return cost;
};

// Helper to calculate build time
export const calculateBuildTime = (type: GameObjectType, levelOrAmount: number, cost: Cost): number => {
    const data = getGameObjectData(type)?.data;
    if (!data) return 0;
    
    if ('baseTime' in data && data.baseTime !== undefined) {
      const timeFactor = (type in BuildingType || type in ResearchType) ? Math.pow(1.5, levelOrAmount - 1) : levelOrAmount;
      return Math.floor(data.baseTime * timeFactor);
    }
    
    // Fallback for older data structure
    const totalCost = (cost.Metallum || 0) + (cost.Kristallin || 0);
    return Math.floor(totalCost / (2500 * (1 + (usePlayerStore.getState().colony?.buildings[BuildingType.Werft]?.level || 1)))) * 3600;
};


// Main game service
export const gameService = {
  startConstruction: async (type: BuildingType | ResearchType | UnitType, amount = 1): Promise<{success: boolean, message: string}> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const { colony, updateResources, addQueueItem } = usePlayerStore.getState();
            const { data, collection } = getGameObjectData(type) || {};
            if (!colony || !data || !collection) {
                return resolve({ success: false, message: "Invalid type." });
            }

            const currentLevel = (collection === 'units' ? 0 : colony[collection as 'buildings' | 'research'][type]?.level || 0);
            const targetLevelOrAmount = type in UnitType ? amount : currentLevel + 1;
            const cost = calculateCost(type, targetLevelOrAmount);
            
            for (const resource in cost) {
                const resKey = resource as Resource;
                if (colony.resources[resKey] < cost[resKey]!) {
                    return resolve({ success: false, message: `Not enough ${resKey}.`});
                }
            }

            const resourceDeductions: Partial<{ [key in Resource]: number }> = {};
            for (const resource in cost) {
                const resKey = resource as Resource;
                resourceDeductions[resKey] = -cost[resKey]!;
            }
            updateResources(resourceDeductions);
            
            const buildTime = calculateBuildTime(type, targetLevelOrAmount, cost) * 1000; // in ms
            const now = Date.now();
            const newItem = {
                id: `${type}-${now}`,
                type,
                levelOrAmount: targetLevelOrAmount,
                startTime: now,
                endTime: now + buildTime,
            };

            const queueType = collection === 'buildings' ? 'building' : collection === 'research' ? 'research' : 'shipyard';
            addQueueItem(queueType, newItem);
            
            resolve({ success: true, message: `${type} construction started.` });
        }, 300); // Simulate network latency
    });
  },

  resolveCombat: (attackerUnits: Partial<{[key in UnitType]: number}>): CombatReport => {
      // Simplified combat: Attacker wins if they have more ships. 50% losses for winner, 100% for loser.
      // FIX: The reduce function did not account for potentially undefined unit values, which could result in NaN.
      // Coalescing undefined to 0 ensures a correct sum.
      const attackerCount = Object.values(attackerUnits).reduce((a, b) => a + (b || 0), 0);
      const defenderCount = 10; // Mock defender has 10 ships
      const result: 'win' | 'loss' = attackerCount > defenderCount ? 'win' : 'loss';
      
      const { colony } = usePlayerStore.getState();
      const report: CombatReport = {
          id: `cr-${Date.now()}`,
          timestamp: Date.now(),
          attacker: colony?.name || 'Player',
          defender: 'Rogue Drones',
          result: result,
          loot: result === 'win' ? { [Resource.Metallum]: 1000, [Resource.Kristallin]: 500 } : {},
          losses: {
              attacker: result === 'win' ? Object.fromEntries(Object.entries(attackerUnits).map(([k,v]) => [k, Math.ceil(v!/2)])) : attackerUnits,
              defender: {}
          }
      };

      if (result === 'win') {
          usePlayerStore.getState().updateResources(report.loot);
      }
      // In a real app, unit losses would be deducted here.
      usePlayerStore.getState().addCombatLog(report);
      return report;
  }
};