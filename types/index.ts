
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
    MetallumMine = 'Metallum Mine',
    KristallinSynthesizer = 'Kristallin Synthesizer',
    PlasmaForge = 'Plasma Forge',
    SolarNexus = 'Solar Nexus',
    MetallumStorage = 'Metallum Storage',
    KristallinStorage = 'Kristallin Storage',
    PlasmaStorage = 'Plasma Storage',
    ResearchLab = 'Research Lab',
    Shipyard = 'Shipyard',
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
    LightFighter = 'Light Fighter',
    HeavyFighter = 'Heavy Fighter',
    Cruiser = 'Cruiser',
    Battleship = 'Battleship',
    ColonyShip = 'Colony Ship',
    Recycler = 'Recycler',
    EspionageProbe = 'Espionage Probe',
}

export enum DefenseType {
    RocketLauncher = 'Rocket Launcher',
    LightLaser = 'Light Laser',
    HeavyLaser = 'Heavy Laser',
    GaussCannon = 'Gauss Cannon',
    IonCannon = 'Ion Cannon',
    PlasmaTurret = 'Plasma Turret',
    SmallShieldDome = 'Small Shield Dome',
    LargeShieldDome = 'Large Shield Dome',
}

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

export interface Colony {
    id: string;
    name: string;
    resources: Resources;
    storage: Record<Resource.Metallum | Resource.Kristallin | Resource.PlasmaCore, number>;
    buildings: Record<BuildingType, Building>;
    research: Record<ResearchType, number>;
    units: Record<UnitType, number>;
    defenses: Record<DefenseType, number>;
    buildingQueue: QueueItem[];
    shipyardQueue: QueueItem[];
    researchQueue: QueueItem[];
    lastUpdated: number;
}

export type CombatParticipant = {
    fleet: Partial<Record<UnitType | DefenseType, number>>;
    losses: Partial<Record<UnitType | DefenseType, number>>;
    fleetValue: { metallum: number, kristallin: number };
    lossesValue: { metallum: number, kristallin: number };
};

export interface CombatReport {
    id: string;
    timestamp: number;
    attacker: CombatParticipant;
    defender: CombatParticipant;
    winner: 'attacker' | 'defender' | 'draw';
    rounds: CombatRound[];
    debris: { metallum: number, kristallin: number };
}

export interface CombatRound {
    round: number;
    attackerFleet: Partial<Record<UnitType | DefenseType, { count: number, shields: number, hull: number }>>;
    defenderFleet: Partial<Record<UnitType | DefenseType, { count: number, shields: number, hull: number }>>;
    attackerShots: number;
    defenderShots: number;
    log: string[];
}
