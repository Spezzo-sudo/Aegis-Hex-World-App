
import { usePlayerStore } from '../types/usePlayerStore';
import {
    Colony,
    BuildingType,
    ResearchType,
    UnitType,
    DefenseType,
    Resource,
    Resources,
    QueueItem,
    CombatReport,
} from '../types';
import { ALL_ITEM_DATA, BUILDING_DATA, UNIT_DATA, DEFENSE_DATA, initialColony } from '../constants/gameData';
import { v4 as uuidv4 } from 'uuid';

type Constructible = BuildingType | ResearchType | UnitType | DefenseType;
type FleetComposition = Partial<{[key in UnitType | DefenseType]: number}>;

// Helper to get all data for any item type
const getItemData = (type: Constructible) => {
    return ALL_ITEM_DATA[type as keyof typeof ALL_ITEM_DATA];
};

export const calculateCost = (type: Constructible, levelOrAmount: number): Partial<Resources> => {
    const data = getItemData(type);
    if (!data) return {};

    const cost: Partial<Resources> = {};
    if (Object.values(UnitType).includes(type as UnitType) || Object.values(DefenseType).includes(type as DefenseType)) {
        // For units/defenses, cost is linear
        for (const res in data.baseCost) {
            cost[res as Resource] = (data.baseCost[res as Resource] || 0) * levelOrAmount;
        }
    } else {
        // For buildings/research, cost is exponential
        for (const res in data.baseCost) {
            cost[res as Resource] = Math.floor((data.baseCost[res as Resource] || 0) * Math.pow(data.costFactor, levelOrAmount - 1));
        }
    }
    return cost;
};

export const calculateBuildTime = (type: Constructible, levelOrAmount: number, cost: Partial<Resources>): number => {
    const data = getItemData(type);
    if (!data) return 0;
    
    const colony = usePlayerStore.getState().colony;
    if (!colony) return 0;

    let time;

    if (Object.values(UnitType).includes(type as UnitType) || Object.values(DefenseType).includes(type as DefenseType)) {
        // Shipyard/Defense construction time
        const shipyardLevel = colony.buildings[BuildingType.Shipyard]?.level || 1;
        time = (data.baseBuildTime * levelOrAmount) / (1 + shipyardLevel);
    } else {
        const totalCost = (cost.Metallum || 0) + (cost.Kristallin || 0);
        if (totalCost === 0) return 0;

        let labLevel = 1;
        if (Object.values(ResearchType).includes(type as ResearchType)) {
            labLevel = colony.buildings[BuildingType.ResearchLab]?.level || 1;
        }
        
        time = (totalCost / 2500) * (1 / (labLevel + 1)) * 3600;
    }

    return Math.max(1, Math.floor(time / 10)); // Scaled down for better gameplay experience
};

const processTick = (currentColony: Colony) => {
    const now = Date.now();
    const timeSinceLastUpdate = (now - currentColony.lastUpdated) / 1000;

    const newResources = { ...currentColony.resources };
    const completedItems: QueueItem[] = [];

    let energyBalance = 0;
    Object.values(BuildingType).forEach(type => {
        const building = currentColony.buildings[type];
        const data = BUILDING_DATA[type];
        if (building.level > 0) {
            if (data.baseProduction?.Energie) {
                energyBalance += Math.floor(data.baseProduction.Energie * building.level * Math.pow(1.1, building.level));
            }
             if (data.baseConsumption?.Energie) {
                energyBalance -= Math.floor(data.baseConsumption.Energie * building.level * Math.pow(1.1, building.level));
            }
        }
    });
    
    const productionFactor = energyBalance >= 0 ? 1 : Math.max(0, (currentColony.resources.Energie + energyBalance) / (Math.abs(energyBalance) || 1));
    
    Object.values(BuildingType).forEach(type => {
        const building = currentColony.buildings[type];
        const data = BUILDING_DATA[type];
         if (building.level > 0 && data.baseProduction) {
            for(const res in data.baseProduction) {
                if (res !== Resource.Energie) {
                     const productionPerSecond = (data.baseProduction[res as Resource]! * building.level * Math.pow(1.1, building.level)) / 3600;
                     newResources[res as Resource] += productionPerSecond * timeSinceLastUpdate * productionFactor;
                }
            }
        }
    });

    newResources.Energie = energyBalance;

    Object.keys(currentColony.storage).forEach(res => {
        const resource = res as keyof typeof currentColony.storage;
        newResources[resource] = Math.min(newResources[resource], currentColony.storage[resource]);
    });


    const newBuildingQueue = [...currentColony.buildingQueue];
    const newShipyardQueue = [...currentColony.shipyardQueue];
    const newResearchQueue = [...currentColony.researchQueue];
    const newBuildings = { ...currentColony.buildings };
    const newResearch = { ...currentColony.research };
    const newUnits = { ...currentColony.units };
    const newDefenses = { ...currentColony.defenses };

    if (newBuildingQueue.length > 0 && newBuildingQueue[0].endTime <= now) {
        const completed = newBuildingQueue.shift()!;
        completedItems.push(completed);
        newBuildings[completed.type as BuildingType] = { level: completed.levelOrAmount };
    }

    if (newResearchQueue.length > 0 && newResearchQueue[0].endTime <= now) {
        const completed = newResearchQueue.shift()!;
        completedItems.push(completed);
        newResearch[completed.type as ResearchType] = completed.levelOrAmount;
    }

    const stillBuilding: QueueItem[] = [];
    newShipyardQueue.forEach(item => {
        if (item.endTime <= now) {
            completedItems.push(item);
            const type = item.type;
            if (Object.values(UnitType).includes(type as UnitType)) {
                newUnits[type as UnitType] = (newUnits[type as UnitType] || 0) + item.levelOrAmount;
            } else {
                 newDefenses[type as DefenseType] = (newDefenses[type as DefenseType] || 0) + item.levelOrAmount;
            }
        } else {
            stillBuilding.push(item);
        }
    });

    const newStorage = {
      [Resource.Metallum]: (BUILDING_DATA[BuildingType.MetallumStorage].baseStorage || 0) * (Math.pow(1.5, newBuildings[BuildingType.MetallumStorage].level)) + initialColony.storage.Metallum,
      [Resource.Kristallin]: (BUILDING_DATA[BuildingType.KristallinStorage].baseStorage || 0) * (Math.pow(1.5, newBuildings[BuildingType.KristallinStorage].level)) + initialColony.storage.Kristallin,
      [Resource.PlasmaCore]: (BUILDING_DATA[BuildingType.PlasmaStorage].baseStorage || 0) * (Math.pow(1.5, newBuildings[BuildingType.PlasmaStorage].level)) + initialColony.storage.PlasmaCore,
    };

    const updatedColony: Partial<Colony> = {
        resources: newResources,
        storage: newStorage,
        buildingQueue: newBuildingQueue,
        shipyardQueue: stillBuilding,
        researchQueue: newResearchQueue,
        buildings: newBuildings,
        research: newResearch,
        units: newUnits,
        defenses: newDefenses,
        lastUpdated: now,
    };

    return { updatedColony, completedItems };
};

const startConstruction = async (type: Constructible, amount = 1): Promise<boolean> => {
    const { colony, updateColony } = usePlayerStore.getState();
    if (!colony) return false;

    const isBuilding = Object.values(BuildingType).includes(type as BuildingType);
    const isResearch = Object.values(ResearchType).includes(type as ResearchType);
    const isUnitOrDefense = Object.values(UnitType).includes(type as UnitType) || Object.values(DefenseType).includes(type as DefenseType);

    let targetLevel = 0;
    if (isBuilding) targetLevel = (colony.buildings[type as BuildingType]?.level || 0) + 1;
    if (isResearch) targetLevel = (colony.research[type as ResearchType] || 0) + 1;
    
    const levelOrAmount = isUnitOrDefense ? amount : targetLevel;
    const cost = calculateCost(type, levelOrAmount);

    for (const res in cost) {
        if (colony.resources[res as Resource] < (cost[res as Resource] || 0)) {
            console.error("Not enough resources");
            return false;
        }
    }
    
    const time = calculateBuildTime(type, levelOrAmount, cost);
    const newResources = { ...colony.resources };
    for (const res in cost) {
        newResources[res as Resource] -= (cost[res as Resource] || 0);
    }
    
    const startTime = Date.now();
    const endTime = startTime + time * 1000;
    const queueItem: QueueItem = { id: uuidv4(), type, levelOrAmount, startTime, endTime };
    
    let updatedColony = { ...colony, resources: newResources };

    if (isBuilding) updatedColony.buildingQueue = [...colony.buildingQueue, queueItem];
    else if (isResearch) updatedColony.researchQueue = [...colony.researchQueue, queueItem];
    else if (isUnitOrDefense) updatedColony.shipyardQueue = [...colony.shipyardQueue, queueItem];

    updateColony(updatedColony);
    return true;
};

const simulateCombat = (attackerFleet: FleetComposition, defenderFleet: FleetComposition): CombatReport => {
    const getFleetValue = (fleet: FleetComposition) => {
        let metallum = 0, kristallin = 0;
        for (const type in fleet) {
            const data = ALL_ITEM_DATA[type as keyof typeof ALL_ITEM_DATA];
            const count = fleet[type as keyof typeof fleet] || 0;
            metallum += (data.baseCost.Metallum || 0) * count;
            kristallin += (data.baseCost.Kristallin || 0) * count;
        }
        return { metallum, kristallin };
    };

    const attackerValue = Object.values(getFleetValue(attackerFleet)).reduce((a, b) => a + b, 0);
    const defenderValue = Object.values(getFleetValue(defenderFleet)).reduce((a, b) => a + b, 0);

    if (attackerValue + defenderValue === 0) return { id: uuidv4(), timestamp: Date.now(), winner: 'draw', attacker: { fleet: {}, losses: {}, fleetValue: {metallum: 0, kristallin: 0}, lossesValue: {metallum: 0, kristallin: 0}}, defender: { fleet: {}, losses: {}, fleetValue: {metallum: 0, kristallin: 0}, lossesValue: {metallum: 0, kristallin: 0}}, rounds: [], debris: { metallum: 0, kristallin: 0 }};
    
    const attackerLossRatio = Math.min(1, defenderValue / (attackerValue * 1.2 + 1));
    const defenderLossRatio = Math.min(1, attackerValue / (defenderValue * 1.5 + 1));

    const calculateLosses = (fleet: FleetComposition, ratio: number) => {
        const losses: FleetComposition = {};
        for(const type in fleet) {
            losses[type as keyof typeof fleet] = Math.floor((fleet[type as keyof typeof fleet] || 0) * ratio);
        }
        return losses;
    };

    const attackerLosses = calculateLosses(attackerFleet, attackerLossRatio);
    const defenderLosses = calculateLosses(defenderFleet, defenderLossRatio);
    const attackerLossesValue = getFleetValue(attackerLosses);
    const defenderLossesValue = getFleetValue(defenderLosses);

    const winner = (attackerLossesValue.metallum + attackerLossesValue.kristallin) < (defenderLossesValue.metallum + defenderLossesValue.kristallin) ? 'attacker' : 'defender';

    return {
        id: uuidv4(),
        timestamp: Date.now(),
        winner,
        attacker: { fleet: attackerFleet, losses: attackerLosses, fleetValue: getFleetValue(attackerFleet), lossesValue: attackerLossesValue },
        defender: { fleet: defenderFleet, losses: defenderLosses, fleetValue: getFleetValue(defenderFleet), lossesValue: defenderLossesValue },
        rounds: [],
        debris: { metallum: (attackerLossesValue.metallum + defenderLossesValue.metallum) * 0.3, kristallin: (attackerLossesValue.kristallin + defenderLossesValue.kristallin) * 0.3 },
    };
};

export const gameService = {
    processTick,
    startConstruction,
    simulateCombat,
};
