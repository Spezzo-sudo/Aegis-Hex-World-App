import { Colony, BuildingType, Resource, Cost, ResearchType, UnitType } from '../types';

export const TICK_INTERVAL = 5000; // 5 seconds for faster feedback during development

export const BUILDING_DATA: {
  [key in BuildingType]: {
    name: string;
    description: string;
    baseCost: Cost;
    costFactor: number;
    baseTime: number; // seconds
    baseProduction?: { resource: Resource; amount: number };
    baseEnergy?: number;
    productionFactor?: number;
    energyFactor?: number;
  };
} = {
  [BuildingType.Schmelzwerk]: {
    name: 'Schmelzwerk',
    description: 'Extracts and refines Metallum from the planet\'s crust.',
    baseCost: { [Resource.Metallum]: 60, [Resource.Kristallin]: 15 },
    costFactor: 1.5,
    baseTime: 60,
    baseProduction: { resource: Resource.Metallum, amount: 30 },
    productionFactor: 1.1,
    baseEnergy: 10,
    energyFactor: 1.1,
  },
  [BuildingType.Fraktursaege]: {
    name: 'Fraktursäge',
    description: 'Harvests crystalline structures for industrial use.',
    baseCost: { [Resource.Metallum]: 48, [Resource.Kristallin]: 24 },
    costFactor: 1.6,
    baseTime: 75,
    baseProduction: { resource: Resource.Kristallin, amount: 15 },
    productionFactor: 1.1,
    baseEnergy: 12,
    energyFactor: 1.12,
  },
  [BuildingType.PlasmaSiphon]: {
    name: 'Plasma-Siphon',
    description: 'Siphons and contains volatile plasma energy.',
    baseCost: { [Resource.Metallum]: 225, [Resource.Kristallin]: 75 },
    costFactor: 1.5,
    baseTime: 180,
    baseProduction: { resource: Resource.PlasmaCore, amount: 5 },
    productionFactor: 1.08,
    baseEnergy: 25,
    energyFactor: 1.15,
  },
  [BuildingType.Energiekern]: {
    name: 'Energiekern',
    description: 'Generates the primary energy for the entire colony.',
    baseCost: { [Resource.Metallum]: 75, [Resource.Kristallin]: 30 },
    costFactor: 1.5,
    baseTime: 90,
    baseProduction: { resource: Resource.Energie, amount: 20 },
    productionFactor: 1.1,
  },
   [BuildingType.Werft]: {
    name: 'Werft',
    description: 'Constructs and maintains all space-faring vessels.',
    baseCost: { [Resource.Metallum]: 400, [Resource.Kristallin]: 200 },
    costFactor: 2,
    baseTime: 600,
    baseEnergy: 50,
    energyFactor: 1.2,
  },
  [BuildingType.Forschungsarchiv]: {
    name: 'Forschungsarchiv',
    description: 'Hub for all scientific and technological advancements.',
    baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 400, [Resource.PlasmaCore]: 100 },
    costFactor: 2,
    baseTime: 900,
    baseEnergy: 80,
    energyFactor: 1.2,
  },
  [BuildingType.Speicher]: {
    name: 'Speicher',
    description: 'Increases storage capacity for all resources.',
    baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 100 },
    costFactor: 2,
    baseTime: 300,
    baseEnergy: 5,
    energyFactor: 1.1,
  },
  [BuildingType.Sensorik]: {
    name: 'Sensorik',
    description: 'Advanced sensor array for espionage and threat detection.',
    baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 300, [Resource.PlasmaCore]: 50 },
    costFactor: 1.8,
    baseTime: 450,
    baseEnergy: 40,
    energyFactor: 1.1,
  },
  [BuildingType.Dock]: {
    name: 'Dock',
    description: 'Expands fleet capacity and provides repair bays.',
    baseCost: { [Resource.Metallum]: 1000, [Resource.Kristallin]: 500 },
    costFactor: 2,
    baseTime: 1200,
    baseEnergy: 20,
    energyFactor: 1.1,
  },
  [BuildingType.Plasmakammer]: {
    name: 'Plasmakammer',
    description: 'Advanced power generation, boosting total Energie output.',
    baseCost: { [Resource.Metallum]: 800, [Resource.Kristallin]: 400, [Resource.PlasmaCore]: 200 },
    costFactor: 1.8,
    baseTime: 1800,
    baseProduction: { resource: Resource.Energie, amount: 50 },
    productionFactor: 1.15,
    baseEnergy: 0,
  },
  [BuildingType.AegisSchildkuppel]: {
    name: 'Aegis-Schildkuppel',
    description: 'Generates a planetary defense field to protect against raids.',
    baseCost: { [Resource.Metallum]: 2000, [Resource.Kristallin]: 2000, [Resource.PlasmaCore]: 500 },
    costFactor: 2.5,
    baseTime: 3600,
    baseEnergy: 200,
    energyFactor: 1.3,
  },
};

export const RESEARCH_DATA: {
    [key in ResearchType]: {
        name: string;
        description: string;
        baseCost: Cost;
        costFactor: number;
        baseTime: number; // seconds
    }
} = {
    [ResearchType.ReaktorOptimierung]: {
        name: 'Reaktor-Optimierung',
        description: 'Increases Energie production from all sources by 10% per level.',
        baseCost: { [Resource.PlasmaCore]: 400 },
        costFactor: 2,
        baseTime: 600
    },
    [ResearchType.ExtraktionsAlgorithmen]: {
        name: 'Extraktions-Algorithmen',
        description: 'Boosts Metallum and Kristallin production by 5% per level.',
        baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 100 },
        costFactor: 2,
        baseTime: 300
    },
    [ResearchType.HyperraumNavigation]: { name: 'Hyperraum-Navigation', description: 'Faster fleet travel.', baseCost: { [Resource.PlasmaCore]: 1000 }, costFactor: 2.2, baseTime: 1200 },
    [ResearchType.Schiffsarchitektur]: { name: 'Schiffsarchitektur', description: 'Unlocks advanced ship classes.', baseCost: { [Resource.Metallum]: 1000 }, costFactor: 2.5, baseTime: 1800 },
    [ResearchType.Schildharmonie]: { name: 'Schildharmonie', description: 'Improves shield strength of all units and structures by 10%.', baseCost: { [Resource.Kristallin]: 800 }, costFactor: 1.8, baseTime: 900 },
    [ResearchType.Tarnprotokolle]: { name: 'Tarnprotokolle', description: 'Enables stealth units and operations.', baseCost: { [Resource.PlasmaCore]: 2500 }, costFactor: 3, baseTime: 2400 },
    [ResearchType.Kryptologie]: { name: 'Kryptologie', description: 'Improves espionage defense and Sensorik effectiveness.', baseCost: { [Resource.Kristallin]: 400 }, costFactor: 2, baseTime: 600 },
};

export const UNIT_DATA: {
    [key in UnitType]?: {
        name: string;
        description: string;
        baseCost: Cost;
        baseTime: number; //seconds
        stats: { attack: number, shield: number, armor: number };
    }
} = {
    [UnitType.SkimJaeger]: {
        name: 'Skim-Jäger',
        description: 'A fast, light raider. Effective for quick strikes but vulnerable.',
        baseCost: { [Resource.Metallum]: 3000, [Resource.Kristallin]: 1000 },
        baseTime: 120,
        stats: { attack: 50, shield: 10, armor: 300 },
    },
    [UnitType.AegisFregatte]: {
        name: 'Aegis-Fregatte',
        description: 'The backbone of any fleet. Balanced armor and firepower.',
        baseCost: { [Resource.Metallum]: 6000, [Resource.Kristallin]: 2000 },
        baseTime: 240,
        stats: { attack: 150, shield: 25, armor: 600 },
    },
};

export const initialColony: Colony = {
  id: 'colony-01',
  name: 'Genesis Prime',
  resources: {
    [Resource.Metallum]: 500,
    [Resource.Kristallin]: 500,
    [Resource.PlasmaCore]: 0,
    [Resource.Energie]: 0,
  },
  storage: {
    [Resource.Metallum]: 10000,
    [Resource.Kristallin]: 10000,
    [Resource.PlasmaCore]: 5000,
  },
  buildings: {
    [BuildingType.Schmelzwerk]: { level: 1, energyConsumption: 10 },
    [BuildingType.Fraktursaege]: { level: 1, energyConsumption: 12 },
    [BuildingType.Energiekern]: { level: 1, energyConsumption: 0 },
  },
  research: {},
  units: {},
  buildingQueue: [],
  researchQueue: [],
  shipyardQueue: [],
  combatLog: [],
};
