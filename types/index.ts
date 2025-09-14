import { BiomeType } from '../constants/biomeData';

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
    Ferrolyt = 'Ferrolyt',
    Luminis = 'Luminis',
    Obskurit = 'Obskurit',
    Ätherharz = 'Ätherharz',
    Energie = 'Energie',
}

export enum BuildingType {
    // Resource Production
    AetherharzExtractor = 'Ätherharz-Extraktor',
    AetherharzRefinery = 'Ätherharz-Raffinerie',
    FerrolytForge = 'Ferrolyt-Schmiede',
    LuminisFormer = 'Luminis-Kristallformer',
    ObskuritCompressor = 'Obskurit-Kompressor',
    
    // Energy
    EnergyCore = 'Energiekern',
    PlasmaChamber = 'Plasmakammer',

    // Storage
    FerrolytSilo = 'Ferrolyt-Silo',
    LuminisSilo = 'Luminis-Silo',
    ObskuritSilo = 'Obskurit-Silo',
    AetherharzSilo = 'Ätherharz-Silo',
    
    // Construction & Tech
    ConstructionYard = 'Bauhof',
    Nanoforge = 'Nanoforge',
    LogisticsHub = 'Logistik-Hub',
    ResearchArchive = 'Forschungsarchiv',
    TensorLab = 'Tensor-Labor',
    CryptologySphere = 'Kryptologie-Sphäre',

    // Military & Fleet
    Shipyard = 'Werft',
    Dock = 'Dock',
    RepairBay = 'Reparaturbucht',
}

export enum ResearchType {
    ReaktorOptimierung = 'Reaktor-Optimierung',
    ExtraktionsAlgorithmen = 'Extraktions-Algorithmen',
    HarzKatalyse = 'Harz-Katalyse',
    HyperraumNavigation = 'Hyperraum-Navigation',
    RelaisProtokolle = 'Relais-Protokolle',
    Schiffsarchitektur = 'Schiffsarchitektur',
    Schildharmonie = 'Schildharmonie',
    Tarnprotokolle = 'Tarnprotokolle',
    Kryptologie = 'Kryptologie',
    IonenDurchbruch = 'Ionen-Durchbruch',
    PlasmaLanzenfokus = 'Plasma-Lanzenfokus',
    DrohnenschwarmKI = 'Drohnenschwarm-KI',
}

export enum UnitType {
    // Core Fleet
    SkimJaeger = 'Skim-Jäger',
    AegisFregatte = 'Aegis-Fregatte',
    SpektralBomber = 'Spektral-Bomber',
    PhalanxKreuzer = 'Phalanx-Kreuzer',
    NyxSpaeher = 'Nyx-Späher',
    LeitsternTraeger = 'Leitstern-Träger',
    
    // Utility
    AtlasTransporter = 'Atlas-Transporter',
    NomadKolonieschiff = 'Nomad-Kolonieschiff',
}

export enum DefenseType {
    IonenTurm = 'Ionen-Turm',
    PlasmaBastion = 'Plasma-Bastion',
    SchildArray = 'Schild-Array',
    RailLanze = 'Rail-Lanze',
    Minenfeld = 'Minenfeld',
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
    EmptySpace = 'Empty Space',
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
    elevationValue?: number; // For 3D map height
    visualBiome?: BiomeType;
    biome?: {
        resource?: Resource;
        deltaPct?: number; // e.g., 15 for +15%, -5 for -5%
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
    storage: Record<Resource.Ferrolyt | Resource.Luminis | Resource.Obskurit | Resource.Ätherharz, number>;
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
    fleetValue: { ferrolyt: number, luminis: number };
    lossesValue: { ferrolyt: number, luminis: number };
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
    debris: { ferrolyt: number, luminis: number };
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
// FIX: Add a mock User type to remove the dependency on Firebase auth,
// which is causing module resolution errors. The app is designed to run in a
// mock mode, and only uses `uid` and `email` from the user object.
export type User = {
    uid: string;
    email: string | null;
};