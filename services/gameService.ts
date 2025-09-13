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
    ActiveFleet,
    MissionType,
    FleetComposition,
} from '../types';
import { ALL_ITEM_DATA, BUILDING_DATA, UNIT_DATA, DEFENSE_DATA, initialColony } from '../constants/gameData';
import { MAP_SIZE, generateMapData } from '../constants/mapData';
import { v4 as uuidv4 } from 'uuid';

type Constructible = BuildingType | ResearchType | UnitType | DefenseType;

const FOG_OF_WAR_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const mapData = generateMapData(MAP_SIZE);

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
        const shipyardLevel = colony.buildings[BuildingType.Werft]?.level || 1;
        time = (data.baseBuildTime * levelOrAmount) / (1 + shipyardLevel);
    } else {
        const totalCost = (cost.Metallum || 0) + (cost.Kristallin || 0);
        if (totalCost === 0) return 0;

        let labLevel = 1;
        if (Object.values(ResearchType).includes(type as ResearchType)) {
            labLevel = colony.buildings[BuildingType.Forschungsarchiv]?.level || 1;
        }
        
        time = (totalCost / 2500) * (1 / (labLevel + 1)) * 3600;
    }

    return Math.max(1, Math.floor(time / 10)); // Scaled down for better gameplay experience
};

const calculateTravelTime = (origin: {x:number, y:number}, destination: {x:number, y:number}, speed: number, warpBonus: number) => {
    const distance = Math.sqrt(
        Math.pow(destination.x - origin.x, 2) +
        Math.pow(destination.y - origin.y, 2)
    );
    return (distance * 100000) / (speed * warpBonus);
}

const processTick = (currentColony: Colony) => {
    const now = Date.now();
    const timeSinceLastUpdate = (now - currentColony.lastUpdated) / 1000;

    const newResources = { ...currentColony.resources };
    const completedItems: QueueItem[] = [];
    const colonyCoords = `${currentColony.coordinates.x}:${currentColony.coordinates.y}`;
    const planetData = mapData[colonyCoords];

    // --- Resource Generation ---
    let totalEnergyProduction = 0;
    let totalEnergyConsumption = 0;

    Object.values(BuildingType).forEach(type => {
        const building = currentColony.buildings[type];
        const data = BUILDING_DATA[type];
        if (building.level > 0) {
            if (data.baseProduction?.Energie) {
                let baseProd = Math.floor(data.baseProduction.Energie * building.level * Math.pow(1.1, building.level));
                // Apply elevation bonus to production
                if (planetData.elevation === 'mid') baseProd *= 1.01;
                if (planetData.elevation === 'high') baseProd *= 1.02;
                // Apply biome bonus to production
                if (planetData?.biome?.resource === Resource.Energie) {
                     baseProd *= (1 + planetData.biome.deltaPct / 100);
                }
                totalEnergyProduction += baseProd;
            }
             if (data.baseConsumption?.Energie) {
                totalEnergyConsumption += Math.floor(data.baseConsumption.Energie * building.level * Math.pow(1.1, building.level));
            }
        }
    });
    
    const energyFactor = totalEnergyProduction > 0 ? Math.min(1, totalEnergyProduction / (totalEnergyConsumption || 1)) : 0;
    
    Object.values(BuildingType).forEach(type => {
        const building = currentColony.buildings[type];
        const data = BUILDING_DATA[type];
         if (building.level > 0 && data.baseProduction) {
            for(const res in data.baseProduction) {
                if (res !== Resource.Energie) {
                     let productionPerSecond = (data.baseProduction[res as Resource]! * building.level * Math.pow(1.1, building.level)) / 3600;
                     
                     if (planetData?.biome?.resource === res) {
                        productionPerSecond *= (1 + planetData.biome.deltaPct / 100);
                     }
                     
                     if (planetData.elevation === 'low' && (res === Resource.Metallum || res === Resource.Kristallin)) {
                        productionPerSecond *= 1.02;
                     } else if (planetData.elevation === 'mid') {
                        productionPerSecond *= 1.01;
                     }

                     newResources[res as Resource] += productionPerSecond * timeSinceLastUpdate * energyFactor;
                }
            }
        }
    });

    newResources.Energie = totalEnergyProduction - totalEnergyConsumption;

    Object.keys(currentColony.storage).forEach(res => {
        const resource = res as keyof typeof currentColony.storage;
        newResources[resource] = Math.min(newResources[resource], currentColony.storage[resource]);
    });


    // --- Queue Processing ---
    const newBuildingQueue = [...currentColony.buildingQueue];
    const newShipyardQueue = [...currentColony.shipyardQueue];
    const newResearchQueue = [...currentColony.researchQueue];
    const newBuildings = { ...currentColony.buildings };
    const newResearch = { ...currentColony.research };
    let newUnits = { ...currentColony.units };
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
      [Resource.Metallum]: (BUILDING_DATA[BuildingType.MetallumSpeicher].baseStorage || 0) * (Math.pow(1.5, newBuildings[BuildingType.MetallumSpeicher].level)) + initialColony.storage.Metallum,
      [Resource.Kristallin]: (BUILDING_DATA[BuildingType.KristallinSpeicher].baseStorage || 0) * (Math.pow(1.5, newBuildings[BuildingType.KristallinSpeicher].level)) + initialColony.storage.Kristallin,
      [Resource.PlasmaCore]: (BUILDING_DATA[BuildingType.PlasmaSpeicher].baseStorage || 0) * (Math.pow(1.5, newBuildings[BuildingType.PlasmaSpeicher].level)) + initialColony.storage.PlasmaCore,
    };
    
    // --- Fleet and Visibility Processing ---
    const remainingFleets: ActiveFleet[] = [];
    const newCombatReports = [...currentColony.combatReports];
    const newMapVisibility = { ...currentColony.mapVisibility };

    currentColony.activeFleets.forEach(fleet => {
        if (now < fleet.arrivalTime) {
            remainingFleets.push(fleet);
            return;
        }

        // --- Fleet has arrived ---
        if (fleet.returnTrip) {
            // Returning fleet deposits cargo
            if (fleet.cargo) {
                for (const res in fleet.cargo) {
                    newResources[res as Resource] += fleet.cargo[res as Resource]!;
                }
            }
        } else if (fleet.mission === MissionType.Explore) {
            // Reveal the destination and adjacent hexes
            const { x, y } = fleet.destination;
            const neighbors = [[x, y], [x+1, y], [x-1, y], [x, y+1], [x, y-1]];
            neighbors.forEach(([nx, ny]) => {
                newMapVisibility[`${nx}:${ny}`] = { lastSeen: now };
            });
        } else if (fleet.mission === MissionType.Attack) {
            const targetPlanet = mapData[`${fleet.destination.x}:${fleet.destination.y}`];
            if (targetPlanet?.npc) {
                const report = simulateCombat(fleet.units, targetPlanet.npc.fleet, currentColony.name, 'Pirates');
                report.coordinates = fleet.destination;
                
                if (report.winner === 'attacker') {
                    const plunder: Partial<Resources> = {};
                    let cargoSpace = 0; // Future implementation
                    
                    for (const res in targetPlanet.npc.resources) {
                        plunder[res as Resource] = targetPlanet.npc.resources[res as Resource]! * 0.5;
                    }
                    report.plunder = plunder;

                    const survivingFleet: FleetComposition = {};
                    for (const type in fleet.units) {
                        const unitType = type as UnitType;
                        const initialCount = fleet.units[unitType] || 0;
                        const losses = report.attacker.losses[unitType] || 0;
                        if (initialCount > losses) {
                            survivingFleet[unitType] = initialCount - losses;
                        }
                    }

                    if (Object.keys(survivingFleet).length > 0) {
                        let slowestSpeed = Infinity;
                        for(const type in survivingFleet) {
                            const unitData = UNIT_DATA[type as UnitType];
                            if (unitData.speed && unitData.speed < slowestSpeed) {
                                slowestSpeed = unitData.speed;
                            }
                        }

                        const warpDriveBonus = 1 + (currentColony.research[ResearchType.WarpDrive] * 0.1);
                        const travelTimeMs = calculateTravelTime(fleet.destination, fleet.origin, slowestSpeed, warpDriveBonus);
                        
                        const returnFleet: ActiveFleet = {
                            ...fleet,
                            units: survivingFleet,
                            origin: fleet.destination,
                            destination: fleet.origin,
                            departureTime: now,
                            arrivalTime: now + travelTimeMs,
                            returnTrip: true,
                            cargo: plunder,
                        };
                        remainingFleets.push(returnFleet);
                    }
                }
                newCombatReports.unshift(report);
            }
        }
    });

    for (const key in newMapVisibility) {
        if (now - newMapVisibility[key].lastSeen > FOG_OF_WAR_DURATION) {
            if (key !== `${currentColony.coordinates.x}:${currentColony.coordinates.y}`) {
                delete newMapVisibility[key];
            }
        }
    }


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
        activeFleets: remainingFleets,
        mapVisibility: newMapVisibility,
        combatReports: newCombatReports.slice(0, 20), // Keep last 20 reports
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

const dispatchFleet = (
  fleet: FleetComposition,
  destination: { x: number; y: number },
  mission: MissionType
): boolean => {
  const { colony, updateColony } = usePlayerStore.getState();
  if (!colony) return false;

  const newUnits = { ...colony.units };
  let slowestSpeed = Infinity;

  for (const type in fleet) {
    const unitType = type as UnitType;
    const count = fleet[unitType] || 0;
    if (newUnits[unitType] < count) {
      console.error(`Not enough ${unitType}`);
      return false;
    }
    newUnits[unitType] -= count;
    const unitData = UNIT_DATA[unitType];
    if (unitData.speed && unitData.speed < slowestSpeed) {
      slowestSpeed = unitData.speed;
    }
  }
  
  const warpDriveBonus = 1 + (colony.research[ResearchType.WarpDrive] * 0.1);
  const travelTimeMs = calculateTravelTime(colony.coordinates, destination, slowestSpeed, warpDriveBonus);
  
  const departureTime = Date.now();
  const arrivalTime = departureTime + travelTimeMs;

  const newFleet: ActiveFleet = {
    id: uuidv4(),
    units: fleet,
    origin: colony.coordinates,
    destination,
    mission,
    departureTime,
    arrivalTime,
  };

  updateColony({
    units: newUnits,
    activeFleets: [...colony.activeFleets, newFleet],
  });

  return true;
};

const simulateCombat = (attackerFleet: FleetComposition, defenderFleet: FleetComposition, attackerName: string, defenderName: string): CombatReport => {
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

    const emptyReport = { id: uuidv4(), timestamp: Date.now(), coordinates: {x:0, y:0}, winner: 'draw' as const, attacker: { name: attackerName, fleet: {}, losses: {}, fleetValue: {metallum: 0, kristallin: 0}, lossesValue: {metallum: 0, kristallin: 0}}, defender: { name: defenderName, fleet: {}, losses: {}, fleetValue: {metallum: 0, kristallin: 0}, lossesValue: {metallum: 0, kristallin: 0}}, rounds: [], debris: { metallum: 0, kristallin: 0 }};

    if (attackerValue + defenderValue === 0) return emptyReport;
    
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
        coordinates: {x:0, y:0},
        winner,
        attacker: { name: attackerName, fleet: attackerFleet, losses: attackerLosses, fleetValue: getFleetValue(attackerFleet), lossesValue: attackerLossesValue },
        defender: { name: defenderName, fleet: defenderFleet, losses: defenderLosses, fleetValue: getFleetValue(defenderFleet), lossesValue: defenderLossesValue },
        rounds: [],
        debris: { metallum: (attackerLossesValue.metallum + defenderLossesValue.metallum) * 0.3, kristallin: (attackerLossesValue.kristallin + defenderLossesValue.kristallin) * 0.3 },
    };
};

export const gameService = {
    processTick,
    startConstruction,
    dispatchFleet,
    simulateCombat,
    getMapData: () => mapData,
};