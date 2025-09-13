import { PlanetType, Resource, MapData, Planet, Elevation, UnitType, DefenseType } from '../types';

export const MAP_SIZE = 11; // Must be an odd number

export const PLANET_DATA: Record<PlanetType, { color: string }> = {
    [PlanetType.Terran]: { color: 'rgba(44, 226, 199, 0.15)' },
    [PlanetType.Volcanic]: { color: 'rgba(255, 122, 230, 0.15)' },
    [PlanetType.Ice]: { color: 'rgba(122, 162, 255, 0.15)' },
    [PlanetType.GasGiant]: { color: 'rgba(180, 122, 255, 0.15)' },
    [PlanetType.AsteroidField]: { color: 'rgba(156, 179, 209, 0.15)' },
    [PlanetType.Barren]: { color: 'rgba(156, 179, 209, 0.05)' },
};

// Simple seeded pseudo-random number generator
const mulberry32 = (a: number) => {
    return () => {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export const generateMapData = (size: number): MapData => {
    const map: MapData = {};
    const seed = 1337;
    const random = mulberry32(seed);

    const planetTypes = Object.values(PlanetType);
    const resources = [Resource.Metallum, Resource.Kristallin, Resource.PlasmaCore];
    const elevations: Elevation[] = ['low', 'mid', 'high'];
    const center = Math.floor(size / 2);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const key = `${x}:${y}`;
            
            const typeIndex = Math.floor(random() * planetTypes.length);
            const type = planetTypes[typeIndex];

            const elevationIndex = Math.floor(random() * elevations.length);
            const elevation = elevations[elevationIndex];
            
            let planet: Planet = { type, elevation };

            // 30% chance of having a resource bonus for suitable planet types
            if (random() < 0.3 && ![PlanetType.Barren, PlanetType.GasGiant].includes(type)) {
                const resourceIndex = Math.floor(random() * resources.length);
                const resource = resources[resourceIndex];
                // Bonus from -5% to +15%
                const delta = (random() * 20) - 5; 
                planet.biome = {
                    resource,
                    deltaPct: parseFloat(delta.toFixed(0)),
                };
            }
            
            // 15% chance of spawning a pirate outpost, but not in the central 3x3 grid
            const isCenterZone = x >= center - 1 && x <= center + 1 && y >= center - 1 && y <= center + 1;
            if (!isCenterZone && random() < 0.15) {
                planet.npc = {
                    type: 'pirate',
                    fleet: {
                        [UnitType.SkimJaeger]: Math.floor(random() * 10) + 5,
                        [DefenseType.Raketenwerfer]: Math.floor(random() * 5) + 2,
                    },
                    resources: {
                        [Resource.Metallum]: Math.floor(random() * 5000) + 1000,
                        [Resource.Kristallin]: Math.floor(random() * 2500) + 500,
                    }
                }
            }


            map[key] = planet;
        }
    }
    return map;
};