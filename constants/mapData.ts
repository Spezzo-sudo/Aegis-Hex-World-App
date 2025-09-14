import { PlanetType, Resource, MapData, Planet, Elevation, UnitType, DefenseType } from '../types';
import { BiomeType } from './biomeData';

export const MAP_SIZE = 51; // Must be an odd number

export const PLANET_DATA: Record<PlanetType, { color: string }> = {
    [PlanetType.Terran]: { color: 'rgba(44, 226, 199, 0.15)' },
    [PlanetType.Volcanic]: { color: 'rgba(255, 122, 230, 0.15)' },
    [PlanetType.Ice]: { color: 'rgba(122, 162, 255, 0.15)' },
    [PlanetType.GasGiant]: { color: 'rgba(180, 122, 255, 0.15)' },
    [PlanetType.AsteroidField]: { color: 'rgba(156, 179, 209, 0.15)' },
    [PlanetType.Barren]: { color: 'rgba(156, 179, 209, 0.05)' },
    [PlanetType.EmptySpace]: { color: 'rgba(13, 16, 23, 0.0)' },
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
    const resources = [Resource.Ferrolyt, Resource.Luminis, Resource.Obskurit, Resource.Ätherharz];
    const elevations: Elevation[] = ['low', 'mid', 'high'];
    const terranBiomes = [BiomeType.FertilePlain, BiomeType.Forest];
    const barrenBiomes = [BiomeType.Wasteland, BiomeType.Mountains];
    const center = Math.floor(size / 2);

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const key = `${x}:${y}`;
            const isCenterZone = x >= center - 2 && x <= center + 2 && y >= center - 2 && y <= center + 2;

            // 30% chance for empty space, but not in the central starting area
            if (!isCenterZone && random() < 0.30) {
                map[key] = { type: PlanetType.EmptySpace, elevation: 'low' };
                continue;
            }
            
            const availablePlanetTypes = planetTypes.filter(pt => pt !== PlanetType.EmptySpace);
            const typeIndex = Math.floor(random() * availablePlanetTypes.length);
            const type = availablePlanetTypes[typeIndex];

            const elevationIndex = Math.floor(random() * elevations.length);
            const elevation = elevations[elevationIndex];
            
            let planet: Planet = { type, elevation };
            
            // Assign a visual biome based on planet type
            if (type === PlanetType.Terran) {
                planet.visualBiome = terranBiomes[Math.floor(random() * terranBiomes.length)];
            } else if (type === PlanetType.Volcanic) {
                planet.visualBiome = BiomeType.LavaFlows;
            } else if (type === PlanetType.Barren) {
                 planet.visualBiome = barrenBiomes[Math.floor(random() * barrenBiomes.length)];
            } else if (type === PlanetType.Ice) {
                planet.visualBiome = BiomeType.CrystalSpires; // Re-purpose Ice planets to be crystal fields visually
            } else {
                planet.visualBiome = BiomeType.Wasteland;
            }


            // 30% chance for a planet to also have a resource bonus
            if (random() < 0.3) {
                const resourceIndex = Math.floor(random() * resources.length);
                const resource = resources[resourceIndex];
                const delta = (random() * 20) - 5;
                planet.biome = {
                    resource: resource,
                    deltaPct: parseFloat(delta.toFixed(0)),
                }
                // Override visual biome for certain resources to make them stand out
                if(resource === Resource.Obskurit || resource === Resource.Luminis) {
                    planet.visualBiome = BiomeType.CrystalSpires;
                }
                if(resource === Resource.Ferrolyt) {
                    planet.visualBiome = BiomeType.Mountains;
                }
            }
            
            // 10% chance of spawning a pirate outpost, but not in the central 5x5 grid
            if (!isCenterZone && random() < 0.10) {
                planet.npc = {
                    type: 'pirate',
                    fleet: {
                        [UnitType.SkimJaeger]: Math.floor(random() * 10) + 5,
                    },
                    resources: {
                        [Resource.Ferrolyt]: Math.floor(random() * 5000) + 1000,
                        [Resource.Luminis]: Math.floor(random() * 2500) + 500,
                    }
                }
                planet.visualBiome = BiomeType.PirateOutpost;
            }


            map[key] = planet;
        }
    }
    return map;
};