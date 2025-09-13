import { Colony, BuildingType, ResearchType, UnitType, DefenseType, Resource } from '../types';

const homeBaseCoords = { x: 5, y: 5 };
const now = Date.now();
const initialVisibleHexes: Colony['mapVisibility'] = {};
// Make a 3x3 square around the home base visible initially
for (let x = homeBaseCoords.x - 1; x <= homeBaseCoords.x + 1; x++) {
    for (let y = homeBaseCoords.y - 1; y <= homeBaseCoords.y + 1; y++) {
        initialVisibleHexes[`${x}:${y}`] = { lastSeen: now };
    }
}

export const initialColony: Omit<Colony, 'id' | 'name'> = {
  coordinates: homeBaseCoords,
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
    [BuildingType.Schmelzwerk]: { level: 1 },
    [BuildingType.Fraktursaege]: { level: 1 },
    [BuildingType.PlasmaSiphon]: { level: 0 },
    [BuildingType.Energiekern]: { level: 1 },
    [BuildingType.MetallumSpeicher]: { level: 1 },
    [BuildingType.KristallinSpeicher]: { level: 1 },
    [BuildingType.PlasmaSpeicher]: { level: 1 },
    [BuildingType.Forschungsarchiv]: { level: 0 },
    [BuildingType.Werft]: { level: 0 },
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
    [UnitType.SkimJaeger]: 0,
    [UnitType.AegisFregatte]: 0,
    [UnitType.PhalanxKreuzer]: 0,
    [UnitType.SpektralBomber]: 0,
    [UnitType.Kolonieschiff]: 0,
    [UnitType.Recycler]: 0,
    [UnitType.NyxSpaeher]: 5,
  },
  defenses: {
    [DefenseType.Raketenwerfer]: 0,
    [DefenseType.LeichtesLasergeschuetz]: 0,
    [DefenseType.SchweresLasergeschuetz]: 0,
    [DefenseType.Gausskanone]: 0,
    [DefenseType.IonenTurm]: 0,
    [DefenseType.PlasmaBastion]: 0,
    [DefenseType.SchildArray]: 0,
    [DefenseType.AegisSchildkuppel]: 0,
  },
  buildingQueue: [],
  shipyardQueue: [],
  researchQueue: [],
  activeFleets: [],
  mapVisibility: initialVisibleHexes,
  combatReports: [],
  lastUpdated: now,
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
    [BuildingType.Schmelzwerk]: { name: 'Schmelzwerk', description: 'Produziert das Grundmetall Metallum aus planetarem Erz.', image: '/images/buildings/metallum-mine.jpg', baseCost: { [Resource.Metallum]: 60, [Resource.Kristallin]: 15 }, costFactor: 1.5, baseProduction: { [Resource.Metallum]: 30 }, baseConsumption: { [Resource.Energie]: 10 }, baseBuildTime: 60 },
    [BuildingType.Fraktursaege]: { name: 'Fraktursäge', description: 'Synthetisiert wertvolles Kristallin aus Spurenelementen.', image: '/images/buildings/kristallin-synthesizer.jpg', baseCost: { [Resource.Metallum]: 48, [Resource.Kristallin]: 24 }, costFactor: 1.6, baseProduction: { [Resource.Kristallin]: 15 }, baseConsumption: { [Resource.Energie]: 10 }, baseBuildTime: 75 },
    [BuildingType.PlasmaSiphon]: { name: 'Plasma-Siphon', description: 'Raffiniert exotische Materie zu hochexplosiven Plasma-Kernen.', image: '/images/buildings/plasma-forge.jpg', baseCost: { [Resource.Metallum]: 225, [Resource.Kristallin]: 75 }, costFactor: 1.5, baseProduction: { [Resource.PlasmaCore]: 1 }, baseConsumption: { [Resource.Energie]: 20 }, baseBuildTime: 300 },
    [BuildingType.Energiekern]: { name: 'Energiekern', description: 'Erzeugt Energie durch die Nutzung stellarer Strahlung und dient als Basis-Energieversorgung.', image: '/images/buildings/solar-nexus.jpg', baseCost: { [Resource.Metallum]: 75, [Resource.Kristallin]: 30 }, costFactor: 1.5, baseProduction: { [Resource.Energie]: 20 }, baseBuildTime: 90 },
    [BuildingType.MetallumSpeicher]: { name: 'Metallum Speicher', description: 'Erweitert die Lagerkapazität für Metallum in großen Silos.', image: '/images/buildings/metallum-storage.jpg', baseCost: { [Resource.Metallum]: 1000 }, costFactor: 2, baseStorage: 10000, baseBuildTime: 180 },
    [BuildingType.KristallinSpeicher]: { name: 'Kristallin Speicher', description: 'Erweitert die Lagerkapazität für Kristallin in gesicherten Behältern.', image: '/images/buildings/kristallin-storage.jpg', baseCost: { [Resource.Metallum]: 1000, [Resource.Kristallin]: 500 }, costFactor: 2, baseStorage: 10000, baseBuildTime: 180 },
    [BuildingType.PlasmaSpeicher]: { name: 'Plasma Speicher', description: 'Sichere Eindämmung für instabile Plasma-Kerne und Erhöhung der Lagerkapazität.', image: '/images/buildings/plasma-storage.jpg', baseCost: { [Resource.Metallum]: 2000, [Resource.Kristallin]: 2000 }, costFactor: 2, baseStorage: 1000, baseBuildTime: 360 },
    [BuildingType.Forschungsarchiv]: { name: 'Forschungsarchiv', description: 'Schaltet fortschrittliche Technologien frei. Höhere Stufen beschleunigen die Forschung.', image: '/images/buildings/research-lab.jpg', baseCost: { [Resource.Metallum]: 200, [Resource.Kristallin]: 400, [Resource.PlasmaCore]: 200 }, costFactor: 2, special: 'Reduziert die Forschungszeit.', baseBuildTime: 600 },
    [BuildingType.Werft]: { name: 'Werft', description: 'Konstruiert Schiffe und Verteidigungsanlagen. Höhere Stufen ermöglichen den Bau größerer Einheiten.', image: '/images/buildings/shipyard.jpg', baseCost: { [Resource.Metallum]: 400, [Resource.Kristallin]: 200 }, costFactor: 2, special: 'Höhere Stufen bauen Einheiten schneller und schalten neue Baupläne frei.', baseBuildTime: 450 },
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
    [UnitType.SkimJaeger]: { name: 'Skim-Jäger', description: 'Ein schneller Angreifer, ideal für schnelle Überfälle und die Abwehr feindlicher Jäger.', image: '/images/ships/light-fighter.jpg', baseCost: { [Resource.Metallum]: 3000, [Resource.Kristallin]: 1000 }, costFactor: 1, attack: 50, shield: 10, hull: 400, speed: 10000, baseBuildTime: 120 },
    [UnitType.AegisFregatte]: { name: 'Aegis-Fregatte', description: 'Das Rückgrat der Flotte. Eine vielseitige Linien-Fregatte, die es mit den meisten Zielen aufnehmen kann.', image: '/images/ships/heavy-fighter.jpg', baseCost: { [Resource.Metallum]: 6000, [Resource.Kristallin]: 4000 }, costFactor: 1, attack: 150, shield: 25, hull: 1000, speed: 7500, baseBuildTime: 300 },
    [UnitType.PhalanxKreuzer]: { name: 'Phalanx-Kreuzer', description: 'Spezialisiert auf die Bekämpfung von Fregatten und kleineren Schiffen durch Salvenfeuer.', image: '/images/ships/cruiser.jpg', baseCost: { [Resource.Metallum]: 20000, [Resource.Kristallin]: 7000 }, costFactor: 1, attack: 400, shield: 50, hull: 2700, speed: 5000, baseBuildTime: 900 },
    [UnitType.SpektralBomber]: { name: 'Spektral-Bomber', description: 'Ein schwerer Bomber zur Zerstörung von planetaren Strukturen und Verteidigungsanlagen.', image: '/images/ships/battleship.jpg', baseCost: { [Resource.Metallum]: 45000, [Resource.Kristallin]: 15000 }, costFactor: 1, attack: 1000, shield: 200, hull: 6000, speed: 2500, baseBuildTime: 2400 },
    [UnitType.Kolonieschiff]: { name: 'Kolonieschiff', description: 'Ein unbewaffnetes Schiff zur Gründung neuer Kolonien auf fernen Welten.', image: '/images/ships/colony-ship.jpg', baseCost: { [Resource.Metallum]: 10000, [Resource.Kristallin]: 20000 }, costFactor: 1, attack: 0, shield: 100, hull: 3000, speed: 1000, baseBuildTime: 4800 },
    [UnitType.Recycler]: { name: 'Recycler', description: 'Sammelt wertvolle Ressourcen aus Trümmerfeldern, die nach großen Schlachten zurückbleiben.', image: '/images/ships/recycler.jpg', baseCost: { [Resource.Metallum]: 10000, [Resource.Kristallin]: 6000 }, costFactor: 1, attack: 1, shield: 10, hull: 1600, speed: 2000, baseBuildTime: 1800 },
    [UnitType.NyxSpaeher]: { name: 'Nyx-Späher', description: 'Eine kleine, schnelle Sonde mit Tarntechnologie, die zur Aufklärung feindlicher Planeten eingesetzt wird.', image: '/images/ships/espionage-probe.jpg', baseCost: { [Resource.Metallum]: 0, [Resource.Kristallin]: 1000 }, costFactor: 1, attack: 0, shield: 0, hull: 100, speed: 100000, baseBuildTime: 30 },
};

export const DEFENSE_DATA: Record<DefenseType, Omit<ItemData, 'image'>> = {
    [DefenseType.Raketenwerfer]: { name: 'Raketenwerfer', description: 'Kosteneffektive Basisverteidigung gegen leichte Schiffe.', baseCost: { [Resource.Metallum]: 2000 }, costFactor: 1, attack: 80, shield: 20, hull: 200, baseBuildTime: 60 },
    [DefenseType.LeichtesLasergeschuetz]: { name: 'Leichtes Lasergeschütz', description: 'Eine zuverlässige Energiewaffe, effektiv gegen leichte Jäger.', baseCost: { [Resource.Metallum]: 1500, [Resource.Kristallin]: 500 }, costFactor: 1, attack: 100, shield: 25, hull: 200, baseBuildTime: 75 },
    [DefenseType.SchweresLasergeschuetz]: { name: 'Schweres Lasergeschütz', description: 'Verbesserte Laserkanone mit höherem Schaden.', baseCost: { [Resource.Metallum]: 6000, [Resource.Kristallin]: 2000 }, costFactor: 1, attack: 250, shield: 100, hull: 800, baseBuildTime: 240 },
    [DefenseType.Gausskanone]: { name: 'Gausskanone', description: 'Ein elektromagnetischer Beschleuniger, der Projektile mit unglaublicher Geschwindigkeit abfeuert.', baseCost: { [Resource.Metallum]: 20000, [Resource.Kristallin]: 15000 }, costFactor: 1, attack: 1100, shield: 200, hull: 3500, baseBuildTime: 900 },
    [DefenseType.IonenTurm]: { name: 'Ionen-Turm', description: 'Effektive Verteidigung gegen Jäger und kleine Schiffe durch Störung der Schiffssysteme.', baseCost: { [Resource.Metallum]: 5000, [Resource.Kristallin]: 8000 }, costFactor: 1, attack: 150, shield: 500, hull: 1200, baseBuildTime: 600 },
    [DefenseType.PlasmaBastion]: { name: 'Plasma-Bastion', description: 'Schwere Verteidigungsanlage, spezialisiert auf die Zerstörung schwerer Panzerung.', baseCost: { [Resource.Metallum]: 50000, [Resource.Kristallin]: 50000 }, costFactor: 1, attack: 3000, shield: 300, hull: 10000, baseBuildTime: 4000 },
    [DefenseType.SchildArray]: { name: 'Schild-Array', description: 'Projiziert ein planetarisches Schild, das eingehendes Feuer absorbiert und die Schildpunkte der Verteidigung verstärkt.', baseCost: { [Resource.Metallum]: 10000, [Resource.Kristallin]: 10000 }, costFactor: 1, attack: 1, shield: 2000, hull: 2000, baseBuildTime: 1800 },
    [DefenseType.AegisSchildkuppel]: { name: 'Aegis-Schildkuppel', description: 'Eine massive Schildkuppel, die die Kolonie mit einem starken Verteidigungsfeld schützt.', baseCost: { [Resource.Metallum]: 50000, [Resource.Kristallin]: 50000 }, costFactor: 1, attack: 1, shield: 10000, hull: 10000, baseBuildTime: 5000 },
};

export const ALL_ITEM_DATA = { ...BUILDING_DATA, ...RESEARCH_DATA, ...UNIT_DATA, ...DEFENSE_DATA };