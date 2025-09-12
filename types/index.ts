export enum Resource {
  Metallum = 'Metallum',
  Kristallin = 'Kristallin',
  PlasmaCore = 'PlasmaCore',
  Energie = 'Energie',
}

export enum BuildingType {
  Schmelzwerk = 'Schmelzwerk',
  Fraktursaege = 'Fraktursäge',
  PlasmaSiphon = 'Plasma-Siphon',
  Energiekern = 'Energiekern',
  Werft = 'Werft',
  Forschungsarchiv = 'Forschungsarchiv',
  Speicher = 'Speicher',
  Sensorik = 'Sensorik',
  Dock = 'Dock',
  Plasmakammer = 'Plasmakammer',
  AegisSchildkuppel = 'Aegis-Schildkuppel',
}

export enum ResearchType {
  ReaktorOptimierung = 'Reaktor-Optimierung',
  ExtraktionsAlgorithmen = 'Extraktions-Algorithmen',
  HyperraumNavigation = 'Hyperraum-Navigation',
  Schiffsarchitektur = 'Schiffsarchitektur',
  Schildharmonie = 'Schildharmonie',
  Tarnprotokolle = 'Tarnprotokolle',
  Kryptologie = 'Kryptologie',
}

export enum UnitType {
    SkimJaeger = 'Skim-Jäger',
    AegisFregatte = 'Aegis-Fregatte',
    SpektralBomber = 'Spektral-Bomber',
    PhalanxKreuzer = 'Phalanx-Kreuzer',
    NyxSpaeher = 'Nyx-Späher',
    LeitsternTraeger = 'Leitstern-Träger',
}

export enum DefenseType {
    IonenTurm = 'Ionen-Turm',
    PlasmaBastion = 'Plasma-Bastion',
    SchildArray = 'Schild-Array',
}

export type GameObjectType = BuildingType | ResearchType | UnitType | DefenseType;

export interface Cost {
  [Resource.Metallum]?: number;
  [Resource.Kristallin]?: number;
  [Resource.PlasmaCore]?: number;
}

export interface QueueItem {
  id: string;
  type: GameObjectType;
  levelOrAmount: number; // For buildings/research level, for units amount
  startTime: number;
  endTime: number;
}

export interface Building {
  level: number;
  energyConsumption: number;
}

export interface Unit {
    type: UnitType;
    count: number;
}

export interface CombatReport {
    id: string;
    timestamp: number;
    attacker: string;
    defender: string;
    result: 'win' | 'loss' | 'draw';
    loot: Partial<{ [key in Resource]: number }>;
    losses: {
        attacker: Partial<{[key in UnitType]: number}>,
        defender: Partial<{[key in UnitType | DefenseType]: number}>
    };
}

export interface Colony {
  id: string;
  name: string;
  resources: {
    [key in Resource]: number;
  };
  storage: {
    [key in Resource]?: number;
  };
  buildings: {
    [key in BuildingType]?: Building;
  };
  research: {
    [key in ResearchType]?: number;
  };
  units: {
    [key in UnitType]?: number;
  };
  buildingQueue: QueueItem[];
  researchQueue: QueueItem[];
  shipyardQueue: QueueItem[];
  combatLog: CombatReport[];
}

export enum GameView {
    Base = 'Base',
    Map = 'Map',
    Research = 'Research',
    Shipyard = 'Shipyard',
    Alliance = 'Alliance',
    Market = 'Market',
}


export interface HexTileData {
  q: number;
  r: number;
  s: number;
  type: string;
  bonus?: string;
  owner?: string;
  isHostile?: boolean;
  wealth?: number;
  isExplored?: boolean;
}