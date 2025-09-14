import { Colony, BuildingType, ResearchType, UnitType, DefenseType, Resource } from '../types';
import { MAP_SIZE } from './mapData';

const homeBaseCoords = { x: Math.floor(MAP_SIZE / 2), y: Math.floor(MAP_SIZE / 2) };
const now = Date.now();
const initialVisibleHexes: Colony['mapVisibility'] = {};
const initialVisibilityRadius = 8;
// Make an 11x11 square around the home base visible initially
for (let x = homeBaseCoords.x - initialVisibilityRadius; x <= homeBaseCoords.x + initialVisibilityRadius; x++) {
    for (let y = homeBaseCoords.y - initialVisibilityRadius; y <= homeBaseCoords.y + initialVisibilityRadius; y++) {
        // Ensure we don't try to make hexes outside the map visible
        if (x >= 0 && x < MAP_SIZE && y >= 0 && y < MAP_SIZE) {
            initialVisibleHexes[`${x}:${y}`] = { lastSeen: now };
        }
    }
}

const allBuildings = Object.values(BuildingType).reduce((acc, type) => {
    acc[type] = { level: 0 };
    return acc;
}, {} as Record<BuildingType, { level: number }>);

const allResearch = Object.values(ResearchType).reduce((acc, type) => {
    acc[type] = 0;
    return acc;
}, {} as Record<ResearchType, number>);

const allUnits = Object.values(UnitType).reduce((acc, type) => {
    acc[type] = 0;
    return acc;
}, {} as Record<UnitType, number>);

const allDefenses = Object.values(DefenseType).reduce((acc, type) => {
    acc[type] = 0;
    return acc;
}, {} as Record<DefenseType, number>);


export const initialColony: Omit<Colony, 'id' | 'name'> = {
  coordinates: homeBaseCoords,
  resources: {
    [Resource.Ferrolyt]: 500,
    [Resource.Luminis]: 250,
    [Resource.Obskurit]: 0,
    [Resource.Ätherharz]: 500,
    [Resource.Energie]: 0,
  },
  storage: {
    [Resource.Ferrolyt]: 10000,
    [Resource.Luminis]: 10000,
    [Resource.Obskurit]: 1000,
    [Resource.Ätherharz]: 10000,
  },
  buildings: {
    ...allBuildings,
    [BuildingType.FerrolytForge]: { level: 1 },
    [BuildingType.LuminisFormer]: { level: 1 },
    [BuildingType.AetherharzExtractor]: { level: 1 },
    [BuildingType.EnergyCore]: { level: 1 },
    [BuildingType.FerrolytSilo]: { level: 1 },
    [BuildingType.LuminisSilo]: { level: 1 },
    [BuildingType.ObskuritSilo]: { level: 1 },
    [BuildingType.AetherharzSilo]: { level: 1 },
  },
  research: allResearch,
  units: {
      ...allUnits,
      [UnitType.NyxSpaeher]: 5,
  },
  defenses: allDefenses,
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
    [BuildingType.AetherharzExtractor]: { name: 'Ätherharz-Extraktor', description: 'Gewinnt Ätherharz aus dem Boden oder der lokalen Flora.', image: '/images/buildings/aetherharz-extractor.jpg', baseCost: { [Resource.Ferrolyt]: 60, [Resource.Luminis]: 15 }, costFactor: 1.5, baseProduction: { [Resource.Ätherharz]: 30 }, baseConsumption: { [Resource.Energie]: 10 }, baseBuildTime: 60 },
    [BuildingType.FerrolytForge]: { name: 'Ferrolyt-Schmiede', description: 'Erzeugt robuste Legierungen und Panzerplatten für den Schiffsbau.', image: '/images/buildings/ferrolyt-forge.jpg', baseCost: { [Resource.Ferrolyt]: 48, [Resource.Luminis]: 24 }, costFactor: 1.6, baseProduction: { [Resource.Ferrolyt]: 20 }, baseConsumption: { [Resource.Energie]: 10 }, baseBuildTime: 75 },
    [BuildingType.LuminisFormer]: { name: 'Luminis-Kristallformer', description: 'Produziert Lichtleiter, Schild- und Sensorkomponenten.', image: '/images/buildings/luminis-former.jpg', baseCost: { [Resource.Ferrolyt]: 48, [Resource.Luminis]: 24 }, costFactor: 1.6, baseProduction: { [Resource.Luminis]: 10 }, baseConsumption: { [Resource.Energie]: 12 }, baseBuildTime: 85 },
    [BuildingType.ObskuritCompressor]: { name: 'Obskurit-Kompressor', description: 'Presst Obskurit zu Hochdichteblöcken für Bastionen und Tarnmodule.', image: '/images/buildings/obskurit-compressor.jpg', baseCost: { [Resource.Ferrolyt]: 225, [Resource.Luminis]: 75 }, costFactor: 1.5, baseProduction: { [Resource.Obskurit]: 1 }, baseConsumption: { [Resource.Energie]: 25 }, baseBuildTime: 300 },
    [BuildingType.EnergyCore]: { name: 'Energiekern', description: 'Stellt den Basisstrom für die Kolonie bereit. Energie kann zugewiesen werden.', image: '/images/buildings/energy-core.jpg', baseCost: { [Resource.Ferrolyt]: 75, [Resource.Luminis]: 30 }, costFactor: 1.5, baseProduction: { [Resource.Energie]: 20 }, baseBuildTime: 90 },
    [BuildingType.AetherharzSilo]: { name: 'Ätherharz-Silo', description: 'Modulares Lager für Ätherharz. Überlauf führt zu Verlusten.', image: '/images/buildings/aetherharz-silo.jpg', baseCost: { [Resource.Ferrolyt]: 1000, [Resource.Luminis]: 500 }, costFactor: 2, baseStorage: 10000, baseBuildTime: 180 },
    [BuildingType.FerrolytSilo]: { name: 'Ferrolyt-Silo', description: 'Modulares Lager für Ferrolyt. Überlauf führt zu Verlusten.', image: '/images/buildings/ferrolyt-silo.jpg', baseCost: { [Resource.Ferrolyt]: 1000 }, costFactor: 2, baseStorage: 10000, baseBuildTime: 180 },
    [BuildingType.LuminisSilo]: { name: 'Luminis-Silo', description: 'Modulares Lager für Luminis. Überlauf führt zu Verlusten.', image: '/images/buildings/luminis-silo.jpg', baseCost: { [Resource.Luminis]: 1000 }, costFactor: 2, baseStorage: 10000, baseBuildTime: 180 },
    [BuildingType.ObskuritSilo]: { name: 'Obskurit-Silo', description: 'Modulares Lager für Obskurit. Überlauf führt zu Verlusten.', image: '/images/buildings/obskurit-silo.jpg', baseCost: { [Resource.Ferrolyt]: 2000, [Resource.Luminis]: 2000 }, costFactor: 2, baseStorage: 1000, baseBuildTime: 360 },
    [BuildingType.ResearchArchive]: { name: 'Forschungsarchiv', description: 'Der Kern des Tech-Trees. Schaltet neue Technologien frei.', image: '/images/buildings/research-archive.jpg', baseCost: { [Resource.Ferrolyt]: 200, [Resource.Luminis]: 400 }, costFactor: 2, special: 'Schaltet Forschungen frei.', baseBuildTime: 600 },
    [BuildingType.Shipyard]: { name: 'Werft', description: 'Produziert Einheiten basierend auf freigeschalteten Blueprints.', image: '/images/buildings/shipyard.jpg', baseCost: { [Resource.Ferrolyt]: 400, [Resource.Luminis]: 200 }, costFactor: 2, special: 'Höhere Stufen bauen Einheiten schneller.', baseBuildTime: 450 },
    [BuildingType.AetherharzRefinery]: { name: 'Ätherharz-Raffinerie', description: 'Veredelt Harz zu Treibstoff und reduziert die Flottenkosten.', baseCost: { [Resource.Ferrolyt]: 500, [Resource.Luminis]: 250 }, costFactor: 1.8, baseBuildTime: 400 },
    [BuildingType.PlasmaChamber]: { name: 'Plasmakammer', description: 'Erweiterte Energiequelle mit erhöhtem Wirkungsgrad für Schilde.', baseCost: { [Resource.Ferrolyt]: 1000, [Resource.Luminis]: 1000, [Resource.Obskurit]: 50 }, costFactor: 2, baseProduction: { [Resource.Energie]: 100 }, baseBuildTime: 1200 },
    [BuildingType.ConstructionYard]: { name: 'Bauhof', description: 'Reduziert global die Bauzeit und schaltet zusätzliche Bau-Queues frei.', baseCost: { [Resource.Ferrolyt]: 300, [Resource.Luminis]: 150 }, costFactor: 2, baseBuildTime: 500 },
    [BuildingType.Nanoforge]: { name: 'Nanoforge', description: 'Stellt seltene Komponenten für fortschrittliche Einheiten her.', baseCost: { [Resource.Ferrolyt]: 5000, [Resource.Luminis]: 8000, [Resource.Obskurit]: 200 }, costFactor: 2.2, baseBuildTime: 3600 },
    [BuildingType.LogisticsHub]: { name: 'Logistik-Hub', description: 'Reduziert Bau- und Fertigungszeiten im Umkreis.', baseCost: { [Resource.Ferrolyt]: 600, [Resource.Luminis]: 300 }, costFactor: 1.9, baseBuildTime: 700 },
    [BuildingType.TensorLab]: { name: 'Tensor-Labor', description: 'Erhöht die Forschungsgeschwindigkeit und ermöglicht Projektfokus.', baseCost: { [Resource.Ferrolyt]: 800, [Resource.Luminis]: 1200 }, costFactor: 2, baseBuildTime: 1800 },
    [BuildingType.CryptologySphere]: { name: 'Kryptologie-Sphäre', description: 'Ermöglicht Spionage und Gegenaufklärung.', baseCost: { [Resource.Ferrolyt]: 1500, [Resource.Luminis]: 2500, [Resource.Obskurit]: 100 }, costFactor: 2.1, baseBuildTime: 2500 },
    [BuildingType.Dock]: { name: 'Dock', description: 'Erhöht die Flottenkapazität und den Umschlag.', baseCost: { [Resource.Ferrolyt]: 300, [Resource.Luminis]: 100 }, costFactor: 1.5, baseBuildTime: 300 },
    [BuildingType.RepairBay]: { name: 'Reparaturbucht', description: 'Ermöglicht passive und beschleunigte Reparatur von Schiffen.', baseCost: { [Resource.Ferrolyt]: 500, [Resource.Luminis]: 200 }, costFactor: 1.8, baseBuildTime: 600 },
};

export const RESEARCH_DATA: Record<ResearchType, Omit<ItemData, 'image'>> = {
    [ResearchType.ReaktorOptimierung]: { name: 'Reaktor-Optimierung', description: 'Verbessert die Energieeffizienz in der gesamten Kolonie.', baseCost: { [Resource.Luminis]: 800, [Resource.Ätherharz]: 400 }, costFactor: 2, special: 'Erhöht die Energieproduktion aller Quellen.', baseBuildTime: 1800 },
    [ResearchType.ExtraktionsAlgorithmen]: { name: 'Extraktions-Algorithmen', description: 'Steigert den Ertrag und die Purity-Nutzung von Ressourcenfeldern.', baseCost: { [Resource.Ferrolyt]: 400, [Resource.Luminis]: 200 }, costFactor: 1.8, special: 'Erhöht die Ressourcenproduktion.', baseBuildTime: 1200 },
    [ResearchType.HarzKatalyse]: { name: 'Harz-Katalyse', description: 'Erhöht die Treibstoffausbeute und senkt so die Kosten für Flottenmissionen.', baseCost: { [Resource.Ätherharz]: 1000, [Resource.Luminis]: 500 }, costFactor: 2, special: 'Reduziert den Treibstoffverbrauch.', baseBuildTime: 2400 },
    [ResearchType.HyperraumNavigation]: { name: 'Hyperraum-Navigation', description: 'Verkürzt die Reisezeit für alle Flotten.', baseCost: { [Resource.Ferrolyt]: 800, [Resource.Luminis]: 1600 }, costFactor: 2.2, special: 'Erhöht die Flottengeschwindigkeit.', baseBuildTime: 3000 },
    [ResearchType.RelaisProtokolle]: { name: 'Relais-Protokolle', description: 'Erhöht die Kommunikationsreichweite und reduziert Flottenlatenz.', baseCost: { [Resource.Ferrolyt]: 600, [Resource.Luminis]: 300 }, costFactor: 1.9, baseBuildTime: 1500 },
    [ResearchType.Schiffsarchitektur]: { name: 'Schiffsarchitektur', description: 'Schaltet neue Schiffsklassen (Blueprints) und Slots in der Werft frei.', baseCost: { [Resource.Ferrolyt]: 2000, [Resource.Luminis]: 1000 }, costFactor: 2.5, special: 'Schaltet neue Einheiten frei.', baseBuildTime: 4000 },
    [ResearchType.Schildharmonie]: { name: 'Schildharmonie', description: 'Verbessert die Schild-HP und Regenerationsrate aller Einheiten und Strukturen.', baseCost: { [Resource.Luminis]: 2500, [Resource.Obskurit]: 100 }, costFactor: 2.1, special: 'Stärkere Schilde.', baseBuildTime: 3600 },
    [ResearchType.Tarnprotokolle]: { name: 'Tarnprotokolle', description: 'Reduziert die Signatur von Schiffen und ermöglicht den Bau von Tarnmodulen.', baseCost: { [Resource.Obskurit]: 500, [Resource.Luminis]: 3000 }, costFactor: 2.3, special: 'Ermöglicht Tarnung.', baseBuildTime: 5000 },
    [ResearchType.Kryptologie]: { name: 'Kryptologie', description: 'Verbessert die Scanqualität und die Abwehr feindlicher Spionage.', baseCost: { [Resource.Ferrolyt]: 1200, [Resource.Luminis]: 1800 }, costFactor: 2, baseBuildTime: 2800 },
    [ResearchType.IonenDurchbruch]: { name: 'Ionen-Durchbruch', description: 'Erhöht den Schaden von Ionenwaffen gegen Schilde.', baseCost: { [Resource.Ferrolyt]: 1500, [Resource.Luminis]: 500 }, costFactor: 1.8, baseBuildTime: 2000 },
    [ResearchType.PlasmaLanzenfokus]: { name: 'Plasma-Lanzenfokus', description: 'Erhöht den Strukturschaden von Plasmawaffen.', baseCost: { [Resource.Ferrolyt]: 2500, [Resource.Luminis]: 1500 }, costFactor: 1.8, baseBuildTime: 3200 },
    [ResearchType.DrohnenschwarmKI]: { name: 'Drohnenschwarm-KI', description: 'Verbessert die Zielkoordination und Trefferquote von Drohnenschwärmen.', baseCost: { [Resource.Luminis]: 2000, [Resource.Ätherharz]: 2000 }, costFactor: 2, baseBuildTime: 4500 },
};

export const UNIT_DATA: Record<UnitType, ItemData> = {
    [UnitType.SkimJaeger]: { name: 'Skim-Jäger', description: 'Ein schneller Raider, ideal für Angriffe auf Bomber und leichte Ziele.', image: '/images/ships/interceptor.jpg', baseCost: { [Resource.Ferrolyt]: 2000, [Resource.Luminis]: 1000 }, costFactor: 1, attack: 50, shield: 20, hull: 300, speed: 10000, baseBuildTime: 90 },
    [UnitType.AegisFregatte]: { name: 'Aegis-Fregatte', description: 'Eine vielseitige Allround-Eskorte, das Rückgrat jeder Flotte.', image: '/images/ships/cruiser.jpg', baseCost: { [Resource.Ferrolyt]: 5000, [Resource.Luminis]: 3000 }, costFactor: 1, attack: 120, shield: 50, hull: 800, speed: 8000, baseBuildTime: 240 },
    [UnitType.SpektralBomber]: { name: 'Spektral-Bomber', description: 'Spezialisiert auf Angriffe gegen stationäre Ziele und Strukturen.', image: '/images/ships/destroyer.jpg', baseCost: { [Resource.Ferrolyt]: 8000, [Resource.Luminis]: 5000 }, costFactor: 1, attack: 300, shield: 25, hull: 1200, speed: 5000, baseBuildTime: 600 },
    [UnitType.PhalanxKreuzer]: { name: 'Phalanx-Kreuzer', description: 'Ein schweres Kampfschiff, effektiv gegen Fregatten und kleinere Kreuzer.', image: '/images/ships/battleship.jpg', baseCost: { [Resource.Ferrolyt]: 20000, [Resource.Luminis]: 12000, [Resource.Obskurit]: 20 }, costFactor: 1, attack: 700, shield: 200, hull: 3000, speed: 3000, baseBuildTime: 1800 },
    [UnitType.NyxSpaeher]: { name: 'Nyx-Späher', description: 'Ein kleines, schnelles Schiff für Stealth-Aufklärung und Scans.', image: '/images/ships/scout-drone.jpg', baseCost: { [Resource.Ferrolyt]: 800, [Resource.Luminis]: 1200 }, costFactor: 1, attack: 5, shield: 10, hull: 100, speed: 100000, baseBuildTime: 45 },
    [UnitType.LeitsternTraeger]: { name: 'Leitstern-Träger', description: 'Ein Trägerschiff, das Drohnenschwärme zur Unterstützung einsetzt.', image: '/images/ships/cruiser.jpg', baseCost: { [Resource.Ferrolyt]: 30000, [Resource.Luminis]: 20000, [Resource.Obskurit]: 50 }, costFactor: 1, attack: 100, shield: 300, hull: 5000, speed: 2000, baseBuildTime: 3600 },
    [UnitType.AtlasTransporter]: { name: 'Atlas-Transporter', description: 'Ein Frachter zum Transport von Ressourcen zwischen Kolonien.', image: '/images/ships/salvager.jpg', baseCost: { [Resource.Ferrolyt]: 4000, [Resource.Luminis]: 2000 }, costFactor: 1, attack: 0, shield: 20, hull: 1000, speed: 4000, baseBuildTime: 400 },
    [UnitType.NomadKolonieschiff]: { name: 'Nomad-Kolonieschiff', description: 'Wird zur Gründung einer neuen Kolonie auf einem bebaubaren Hexfeld benötigt.', image: '/images/ships/colony-ship.jpg', baseCost: { [Resource.Ferrolyt]: 15000, [Resource.Luminis]: 15000, [Resource.Ätherharz]: 5000 }, costFactor: 1, attack: 0, shield: 100, hull: 4000, speed: 1000, baseBuildTime: 5000 },
};

export const DEFENSE_DATA: Record<DefenseType, Omit<ItemData, 'image'>> = {
    [DefenseType.IonenTurm]: { name: 'Ionen-Turm', description: 'Kurzstreckenverteidigung, effektiv gegen Schilde und kleine Schiffe.', baseCost: { [Resource.Ferrolyt]: 2000, [Resource.Luminis]: 1000 }, costFactor: 1, attack: 90, shield: 20, hull: 300, baseBuildTime: 120 },
    [DefenseType.PlasmaBastion]: { name: 'Plasma-Bastion', description: 'Mittelstreckenverteidigung, spezialisiert auf Schaden an Panzerung und Struktur.', baseCost: { [Resource.Ferrolyt]: 8000, [Resource.Luminis]: 5000 }, costFactor: 1, attack: 350, shield: 100, hull: 1000, baseBuildTime: 500 },
    [DefenseType.SchildArray]: { name: 'Schild-Array', description: 'Projiziert eine Schild-HP-Aura, die verbündete Strukturen in der Nähe stärkt.', baseCost: { [Resource.Luminis]: 10000, [Resource.Obskurit]: 50 }, costFactor: 1, attack: 0, shield: 3000, hull: 1500, baseBuildTime: 1800 },
    [DefenseType.RailLanze]: { name: 'Rail-Lanze', description: 'Langstreckengeschütz mit niedriger Feuerrate, aber hohem Einzelschaden.', baseCost: { [Resource.Ferrolyt]: 30000, [Resource.Luminis]: 10000, [Resource.Obskurit]: 20 }, costFactor: 1, attack: 2000, shield: 200, hull: 4000, baseBuildTime: 3000 },
    [DefenseType.Minenfeld]: { name: 'Minenfeld', description: 'Ein einmalig nutzbares Verteidigungsfeld, effektiv gegen Schwärme.', baseCost: { [Resource.Ferrolyt]: 5000, [Resource.Obskurit]: 100 }, costFactor: 1, attack: 500, shield: 0, hull: 50, baseBuildTime: 900 },
};

export const ALL_ITEM_DATA = { ...BUILDING_DATA, ...RESEARCH_DATA, ...UNIT_DATA, ...DEFENSE_DATA };