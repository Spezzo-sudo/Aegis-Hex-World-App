
import { Colony, BuildingType, ResearchType, UnitType, DefenseType, Resource } from '../types';

export const initialColony: Omit<Colony, 'id' | 'name'> = {
  resources: {
    [Resource.Metallum]: 500,
    [Resource.Kristallin]: 500,
    [Resource.PlasmaCore]: 0,
    [Resource.Energie]: 0,
  },
  storage: {
    [Resource.Metallum]: 10000,
    [Resource.Kristallin]: 10000,
    [Resource.PlasmaCore]: 1000,
  },
  buildings: {
    [BuildingType.MetallumMine]: { level: 1 },
    [BuildingType.KristallinSynthesizer]: { level: 1 },
    [BuildingType.PlasmaForge]: { level: 0 },
    [BuildingType.SolarNexus]: { level: 1 },
    [BuildingType.MetallumStorage]: { level: 1 },
    [BuildingType.KristallinStorage]: { level: 1 },
    [BuildingType.PlasmaStorage]: { level: 1 },
    [BuildingType.ResearchLab]: { level: 0 },
    [BuildingType.Shipyard]: { level: 0 },
  },
  research: {
    [ResearchType.EnergyTechnology]: 0,
    [ResearchType.LaserTechnology]: 0,
    [ResearchType.IonTechnology]: 0,
    [ResearchType.PlasmaTechnology]: 0,
    [ResearchType.WarpDrive]: 0,
    [ResearchType.EspionageTechnology]: 0,
    [ResearchType.ComputerTechnology]: 0,
    [ResearchType.Astrophysics]: 0,
  },
  units: {
    [UnitType.LightFighter]: 0,
    [UnitType.HeavyFighter]: 0,
    [UnitType.Cruiser]: 0,
    [UnitType.Battleship]: 0,
    [UnitType.ColonyShip]: 0,
    [UnitType.Recycler]: 0,
    [UnitType.EspionageProbe]: 0,
  },
  defenses: {
    [DefenseType.RocketLauncher]: 0,
    [DefenseType.LightLaser]: 0,
    [DefenseType.HeavyLaser]: 0,
    [DefenseType.GaussCannon]: 0,
    [DefenseType.IonCannon]: 0,
    [DefenseType.PlasmaTurret]: 0,
    [DefenseType.SmallShieldDome]: 0,
    [DefenseType.LargeShieldDome]: 0,
  },
  buildingQueue: [],
  shipyardQueue: [],
  researchQueue: [],
  lastUpdated: Date.now(),
};

type ItemData = {
    name: string;
    description: string;
    special?: string;
    image?: string;
    baseCost: Partial<Record<Resource, number>>;
    costFactor: number;
    baseProduction?: Partial<Record<Resource, number>>;
    baseConsumption?: Partial<Record<Resource, number>>;
    baseStorage?: number;
    baseBuildTime: number; // in seconds
    attack?: number;
    shield?: number;
    hull?: number;
    speed?: number;
};

export const BUILDING_DATA: Record<BuildingType, ItemData> = {
    [BuildingType.MetallumMine]: { name: 'Metallum Mine', description: 'Extracts raw metallum ore from the planet\'s crust.', image: '/images/buildings/metallum-mine.jpg', baseCost: { [Resource.Metallum]: 60, [Resource.Kristallin]: 15 }, costFactor: 1.5, baseProduction: { [Resource.Metallum]: 30 }, baseConsumption: { [Resource.Energie]: 10 }, baseBuildTime: 60 },
    [BuildingType.KristallinSynthesizer]: { name: 'Kristallin Synthesizer', description: 'Synthesizes valuable kristallin from trace elements.', image: '/images/buildings/kristallin-synthesizer.jpg', baseCost: { [Resource.Metallum]: 48, [Resource.Kristallin]: 24 }, costFactor: 1.6, baseProduction: { [Resource.Kristallin]: 15 }, baseConsumption: { [Resource.Energie]: 10 }, baseBuildTime: 75 },
    [BuildingType.PlasmaForge]: { name: 'Plasma Forge', description: 'Refines exotic matter into highly volatile plasma cores.', image: '/images/buildings/plasma-forge.jpg', baseCost: { [Resource.Metallum]: 225, [Resource.Kristallin]: 75 }, costFactor: 1.5, baseProduction: { [Resource.PlasmaCore]: 1 }, baseConsumption: { [Resource.Energie]: 20 }, baseBuildTime: 300 },
    [BuildingType.SolarNexus]: { name: 'Solar Nexus', description: 'Generates energy by harnessing stellar radiation.', image: '/images/buildings/solar-nexus.jpg', baseCost: { [Resource.Metallum]: 75, [Resource.Kristallin]: 30 }, costFactor: 1.5, baseProduction: { [Resource.Energie]: 20 }, baseBuildTime: 90 },
    [BuildingType.MetallumStorage]: { name: 'Metallum Storage', description: 'Increases the maximum storage capacity for Metallum.', image: '/images/buildings/metallum-storage.jpg', baseCost: { [Resource.Metallum]: 1000 }, costFactor: 2, baseStorage: 10000, baseBuildTime: 180 },
    [BuildingType.KristallinStorage]: { name: 'Kristallin Storage', description: 'Increases the maximum storage capacity for Kristallin.', image: '/images/buildings/kristallin-storage.jpg', baseCost: { [Resource.Metallum]: 1000, [Resource.Kristallin]: 500 }, costFactor: 2, baseStorage: 10000, baseBuildTime: 180 },
    [BuildingType.PlasmaStorage]: { name: 'Plasma Storage', description: 'Safely contains unstable Plasma Cores, increasing capacity.', image: '/images/buildings/plasma-storage.jpg', baseCost: { [Resource.Metallum]: 2000, [Resource.Kristallin]: 2000 }, costFactor: 2, baseStorage: 1000, baseBuildTime: 360 },
    [BuildingType.ResearchLab]: { name: 'Research Lab', description: 'Unlocks advanced technologies. Higher levels reduce research time.', image: '/images/buildings/research-lab.jpg', baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 400, [Resource.PlasmaCore]: 200 }, costFactor: 2, special: 'Reduces research time.', baseBuildTime: 600 },
    [BuildingType.Shipyard]: { name: 'Shipyard', description: 'Constructs ships and defensive structures.', image: '/images/buildings/shipyard.jpg', baseCost: { [Resource.Metallum]: 400, [Resource.Kristallin]: 200 }, costFactor: 2, special: 'Higher levels build units faster and unlock new blueprints.', baseBuildTime: 450 },
};

export const RESEARCH_DATA: Record<ResearchType, Omit<ItemData, 'image'>> = {
    [ResearchType.EnergyTechnology]: { name: 'Energy Technology', description: 'Improves energy production and efficiency across the colony.', baseCost: { [Resource.Metallum]: 0, [Resource.Kristallin]: 800 }, costFactor: 2, special: 'Increases energy output from all sources.', baseBuildTime: 1200 },
    [ResearchType.LaserTechnology]: { name: 'Laser Technology', description: 'Unlocks and improves laser-based weaponry.', baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 100 }, costFactor: 2, baseBuildTime: 600 },
    [ResearchType.IonTechnology]: { name: 'Ion Technology', description: 'Advanced particle beam tech for powerful weapons and shields.', baseCost: { [Resource.Metallum]: 1000, [Resource.Kristallin]: 300 }, costFactor: 2, baseBuildTime: 1500 },
    [ResearchType.PlasmaTechnology]: { name: 'Plasma Technology', description: 'Weaponizes superheated plasma for devastating effect.', baseCost: { [Resource.Metallum]: 2000, [Resource.Kristallin]: 4000 }, costFactor: 2, baseBuildTime: 3000 },
    [ResearchType.WarpDrive]: { name: 'Warp Drive', description: 'Increases the speed of all starships.', baseCost: { [Resource.Metallum]: 400, [Resource.Kristallin]: 200 }, costFactor: 2, special: 'Each level increases ship speed.', baseBuildTime: 1800 },
    [ResearchType.EspionageTechnology]: { name: 'Espionage Technology', description: 'Enhances information gathering and counter-espionage.', baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 1000 }, costFactor: 2, baseBuildTime: 2400 },
    [ResearchType.ComputerTechnology]: { name: 'Computer Technology', description: 'Improves computational power, allowing for more concurrent fleets.', baseCost: { [Resource.Metallum]: 0, [Resource.Kristallin]: 400 }, costFactor: 2, baseBuildTime: 900 },
    [ResearchType.Astrophysics]: { name: 'Astrophysics', description: 'Advanced deep-space scanning to discover and colonize new planets.', baseCost: { [Resource.Metallum]: 4000, [Resource.Kristallin]: 8000 }, costFactor: 1.75, baseBuildTime: 5000 },
};

export const UNIT_DATA: Record<UnitType, ItemData> = {
    [UnitType.LightFighter]: { name: 'Light Fighter', description: 'A fast, cheap, and expendable interceptor.', image: '/images/ships/light-fighter.jpg', baseCost: { [Resource.Metallum]: 3000, [Resource.Kristallin]: 1000 }, costFactor: 1, attack: 50, shield: 10, hull: 400, baseBuildTime: 120 },
    [UnitType.HeavyFighter]: { name: 'Heavy Fighter', description: 'Slower but more heavily armed and armored than its light counterpart.', image: '/images/ships/heavy-fighter.jpg', baseCost: { [Resource.Metallum]: 6000, [Resource.Kristallin]: 4000 }, costFactor: 1, attack: 150, shield: 25, hull: 1000, baseBuildTime: 300 },
    [UnitType.Cruiser]: { name: 'Cruiser', description: 'A versatile warship, effective against fighters and lighter defenses.', image: '/images/ships/cruiser.jpg', baseCost: { [Resource.Metallum]: 20000, [Resource.Kristallin]: 7000 }, costFactor: 1, attack: 400, shield: 50, hull: 2700, baseBuildTime: 900 },
    [UnitType.Battleship]: { name: 'Battleship', description: 'The backbone of any serious fleet, capable of destroying anything in its path.', image: '/images/ships/battleship.jpg', baseCost: { [Resource.Metallum]: 45000, [Resource.Kristallin]: 15000 }, costFactor: 1, attack: 1000, shield: 200, hull: 6000, baseBuildTime: 2400 },
    [UnitType.ColonyShip]: { name: 'Colony Ship', description: 'An unarmed vessel used to establish new colonies on distant worlds.', image: '/images/ships/colony-ship.jpg', baseCost: { [Resource.Metallum]: 10000, [Resource.Kristallin]: 20000 }, costFactor: 1, attack: 0, shield: 100, hull: 3000, baseBuildTime: 4800 },
    [UnitType.Recycler]: { name: 'Recycler', description: 'Collects debris fields left after major battles.', image: '/images/ships/recycler.jpg', baseCost: { [Resource.Metallum]: 10000, [Resource.Kristallin]: 6000 }, costFactor: 1, attack: 1, shield: 10, hull: 1600, baseBuildTime: 1800 },
    [UnitType.EspionageProbe]: { name: 'Espionage Probe', description: 'A small, fast drone used to gather intelligence on enemy planets.', image: '/images/ships/espionage-probe.jpg', baseCost: { [Resource.Metallum]: 0, [Resource.Kristallin]: 1000 }, costFactor: 1, attack: 0, shield: 0, hull: 100, baseBuildTime: 30 },
};

export const DEFENSE_DATA: Record<DefenseType, Omit<ItemData, 'image'>> = {
    [DefenseType.RocketLauncher]: { name: 'Rocket Launcher', description: 'Basic, cost-effective defense against light ships.', baseCost: { [Resource.Metallum]: 2000 }, costFactor: 1, attack: 80, shield: 20, hull: 200, baseBuildTime: 60 },
    [DefenseType.LightLaser]: { name: 'Light Laser', description: 'A reliable energy weapon, effective against light fighters.', baseCost: { [Resource.Metallum]: 1500, [Resource.Kristallin]: 500 }, costFactor: 1, attack: 100, shield: 25, hull: 200, baseBuildTime: 75 },
    [DefenseType.HeavyLaser]: { name: 'Heavy Laser', description: 'Upgraded laser cannon with higher damage output.', baseCost: { [Resource.Metallum]: 6000, [Resource.Kristallin]: 2000 }, costFactor: 1, attack: 250, shield: 100, hull: 800, baseBuildTime: 240 },
    [DefenseType.GaussCannon]: { name: 'Gauss Cannon', description: 'Electromagnetic accelerator that fires projectiles at incredible speeds.', baseCost: { [Resource.Metallum]: 20000, [Resource.Kristallin]: 15000 }, costFactor: 1, attack: 1100, shield: 200, hull: 3500, baseBuildTime: 900 },
    [DefenseType.IonCannon]: { name: 'Ion Cannon', description: 'Disrupts ship systems and shields with charged particle beams.', baseCost: { [Resource.Metallum]: 5000, [Resource.Kristallin]: 8000 }, costFactor: 1, attack: 150, shield: 500, hull: 1200, baseBuildTime: 600 },
    [DefenseType.PlasmaTurret]: { name: 'Plasma Turret', description: 'The ultimate in defensive firepower.', baseCost: { [Resource.Metallum]: 50000, [Resource.Kristallin]: 50000 }, costFactor: 1, attack: 3000, shield: 300, hull: 10000, baseBuildTime: 4000 },
    [DefenseType.SmallShieldDome]: { name: 'Small Shield Dome', description: 'Projects a planetary shield that absorbs incoming fire.', baseCost: { [Resource.Metallum]: 10000, [Resource.Kristallin]: 10000 }, costFactor: 1, attack: 1, shield: 2000, hull: 2000, baseBuildTime: 1800 },
    [DefenseType.LargeShieldDome]: { name: 'Large Shield Dome', description: 'A massive upgrade to planetary shielding technology.', baseCost: { [Resource.Metallum]: 50000, [Resource.Kristallin]: 50000 }, costFactor: 1, attack: 1, shield: 10000, hull: 10000, baseBuildTime: 5000 },
};

export const ALL_ITEM_DATA = { ...BUILDING_DATA, ...RESEARCH_DATA, ...UNIT_DATA, ...DEFENSE_DATA };
