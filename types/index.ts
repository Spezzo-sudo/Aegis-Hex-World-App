

export enum GameView {
    Base = 'base',
    Buildings = 'buildings',
    Map = 'map',
    Research = 'research',
    Shipyard = 'shipyard',
    Alliance = 'alliance',
    Market = 'market',
    Simulator = 'simulator',
}

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
    MetallumSpeicher = 'Metallum Speicher',
    KristallinSpeicher = 'Kristallin Speicher',
    PlasmaSpeicher = 'Plasma Speicher',
    Forschungsarchiv = 'Forschungsarchiv',
    Werft = 'Werft',
}

export enum ResearchType {
    EnergyTechnology = 'Energy Technology',
    LaserTechnology = 'Laser Technology',
    IonTechnology = 'Ion Technology',
    PlasmaTechnology = 'Plasma Technology',
    WarpDrive = 'Warp Drive',
    EspionageTechnology = 'Espionage Technology',
    ComputerTechnology = 'Computer Technology',
    Astrophysics = 'Astrophysics',
}

export enum UnitType {
    SkimJaeger = 'Skim-Jäger',
    AegisFregatte = 'Aegis-Fregatte',
    PhalanxKreuzer = 'Phalanx-Kreuzer',
    SpektralBomber = 'Spektral-Bomber',
    Kolonieschiff = 'Kolonieschiff',
    Recycler = 'Recycler',
    NyxSpaeher = 'Nyx-Späher',
}

export enum DefenseType {
    Raketenwerfer = 'Raketenwerfer',
    LeichtesLasergeschuetz = 'Leichtes Lasergeschütz',
    SchweresLasergeschuetz = 'Schweres Lasergeschütz',
    Gausskanone = 'Gausskanone',
    IonenTurm = 'Ionen-Turm',
    PlasmaBastion = 'Plasma-Bastion',
    SchildArray = 'Schild-Array',
    AegisSchildkuppel = 'Aegis-Schildkuppel',
}

export enum MissionType {
    Explore = 'Explore',
    Attack = 'Attack',
    Transport = 'Transport',
    Colonize = 'Colonize',
}

export enum PlanetType {
    Terran = 'Terran',
    Volcanic = 'Volcanic',
    Ice = 'Ice',
    GasGiant = 'Gas Giant',
    AsteroidField = 'Asteroid Field',
    Barren = 'Barren',
}

export type Elevation = 'low' | 'mid' | 'high';

export type FleetComposition = Partial<{[key in UnitType | DefenseType]: number}>;

export interface NpcInfo {
    type: 'pirate';
    fleet: FleetComposition;
    resources: Partial<Resources>; // Plunderable resources
}

export interface Planet {
    type: PlanetType;
    elevation: Elevation;
    biome?: {
        resource: Resource;
        deltaPct: number; // e.g., 15 for +15%, -5 for -5%
    };
    npc?: NpcInfo;
}

export type MapData = Record<string, Planet>;

export type Resources = Record<Resource, number>;

export interface Building {
    level: number;
}

export interface Research {
    level: number;
}

export interface QueueItem {
    id: string; // unique id for the item in the queue
    type: BuildingType | ResearchType | UnitType | DefenseType;
    levelOrAmount: number;
    startTime: number;
    endTime: number;
}

export interface ActiveFleet {
    id: string;
    units: Partial<Record<UnitType, number>>;
    origin: { x: number; y: number };
    destination: { x: number; y: number };
    mission: MissionType;
    departureTime: number;
    arrivalTime: number;
    returnTrip?: boolean;
    cargo?: Partial<Resources>;
}

export interface Colony {
    id: string;
    name: string;
    coordinates: { x: number; y: number };
    resources: Resources;
    storage: Record<Resource.Metallum | Resource.Kristallin | Resource.PlasmaCore, number>;
    buildings: Record<BuildingType, Building>;
    research: Record<ResearchType, number>;
    units: Record<UnitType, number>;
    defenses: Record<DefenseType, number>;
    buildingQueue: QueueItem[];
    shipyardQueue: QueueItem[];
    researchQueue: QueueItem[];
    activeFleets: ActiveFleet[];
    mapVisibility: Record<string, { lastSeen: number }>; // key: "x:y"
    combatReports: CombatReport[];
    lastUpdated: number;
}

export type CombatParticipant = {
    fleet: Partial<Record<UnitType | DefenseType, number>>;
    losses: Partial<Record<UnitType | DefenseType, number>>;
    fleetValue: { metallum: number, kristallin: number };
    lossesValue: { metallum: number, kristallin: number };
    name: string;
};

export interface CombatReport {
    id: string;
    timestamp: number;
    coordinates: { x: number; y: number };
    attacker: CombatParticipant;
    defender: CombatParticipant;
    winner: 'attacker' | 'defender' | 'draw';
    rounds: CombatRound[];
    debris: { metallum: number, kristallin: number };
    plunder?: Partial<Resources>;
}

export interface CombatRound {
    round: number;
    attackerFleet: Partial<Record<UnitType | DefenseType, { count: number, shields: number, hull: number }>>;
    defenderFleet: Partial<Record<UnitType | DefenseType, { count: number, shields: number, hull: number }>>;
    attackerShots: number;
    defenderShots: number;
    log: string[];
}