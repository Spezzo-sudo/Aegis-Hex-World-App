import { PlanetType, Resource, MapData, Planet, Elevation, UnitType, DefenseType } from '../types';
import { BiomeType } from './biomeData';

export const MAP_SIZE = 31; // Must be an odd number

export const PLANET_DATA: Record<PlanetType, { color: string }> = {
    [PlanetType.Terran]: { color: 'rgba(44, 226, 199, 0.15)' },
    [PlanetType.Volcanic]: { color: 'rgba(255, 122, 230, 0.15)' },
    [PlanetType.Ice]: { color: 'rgba(122, 162, 255, 0.15)' },
    [PlanetType.GasGiant]: { color: 'rgba(180, 122, 255, 0.15)' },
    [PlanetType.AsteroidField]: { color: 'rgba(156, 179, 209, 0.15)' },
    [PlanetType.Barren]: { color: 'rgba(156, 179, 209, 0.05)' },
    [PlanetType.EmptySpace]: { color: 'rgba(13, 16, 23, 0.0)' },
};

// --- Perlin Noise Generator ---
// Credit: https://github.com/josephg/noisejs
const Perlin = new (function() {
    this.p = new Uint8Array(512);
    
    // Initialize permutation table
    const p = [151,160,137,91,90,15,
    131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
    190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
    88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
    77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
    102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
    135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
    5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
    223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
    129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
    251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
    49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
    138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];

    for (let i=0; i < 256 ; i++) this.p[i] = p[i];
    for (let i=0; i < 256; i++) this.p[i+256] = this.p[i];

    const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
    const lerp = (a: number, b: number, t: number) => (1 - t) * a + t * b;
    const grad = (hash: number, x: number, y: number, z: number) => {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h == 12 || h == 14 ? x : z;
        return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
    }
    
    this.noise = (x: number, y: number, z: number = 0) => {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;

        x -= Math.floor(x);
        y -= Math.floor(y);
        z -= Math.floor(z);

        const u = fade(x);
        const v = fade(y);
        const w = fade(z);
        
        const A = this.p[X] + Y, AA = this.p[A] + Z, AB = this.p[A + 1] + Z;
        const B = this.p[X + 1] + Y, BA = this.p[B] + Z, BB = this.p[B + 1] + Z;
        
        return lerp(w, lerp(v, lerp(u, grad(this.p[AA], x, y, z), grad(this.p[BA], x-1, y, z)),
                                  lerp(u, grad(this.p[AB], x, y-1, z), grad(this.p[BB], x-1, y-1, z))),
                       lerp(v, lerp(u, grad(this.p[AA+1], x, y, z-1), grad(this.p[BA+1], x-1, y, z-1)),
                                  lerp(u, grad(this.p[AB+1], x, y-1, z-1), grad(this.p[BB+1], x-1, y-1, z-1))));
    }
})();

const getOctaveNoise = (x: number, y: number, octaves: number, persistence: number, scale: number) => {
    let total = 0;
    let frequency = scale;
    let amplitude = 1;
    let maxValue = 0;
    for (let i = 0; i < octaves; i++) {
        total += Perlin.noise(x * frequency, y * frequency) * amplitude;
        maxValue += amplitude;
        amplitude *= persistence;
        frequency *= 2;
    }
    return total / maxValue;
}

export const generateMapData = (size: number): MapData => {
    const map: MapData = {};
    const center = Math.floor(size / 2);
    const scale = 4.0; // Higher scale = smaller, more frequent features

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            const key = `${x}:${y}`;
            const nx = x / size - 0.5;
            const ny = y / size - 0.5;

            // Generate noise values for elevation and moisture
            const e = getOctaveNoise(nx, ny, 4, 0.5, scale * 3);
            const m = getOctaveNoise(nx + 100, ny + 100, 4, 0.5, scale * 2);

            // Normalize noise to 0-1 range
            const elevationValue = (e + 1) / 2;
            const moistureValue = (m + 1) / 2;
            
            // Determine biome based on noise values
            let visualBiome: BiomeType;
            let elevation: Elevation;
            
            if (elevationValue < 0.3) {
                visualBiome = BiomeType.FertilePlain; // Water/Lowlands
                elevation = 'low';
            } else if (elevationValue < 0.6) {
                 if (moistureValue < 0.4) visualBiome = BiomeType.Wasteland;
                 else visualBiome = BiomeType.Forest;
                 elevation = 'low';
            } else if (elevationValue < 0.8) {
                if (moistureValue < 0.3) visualBiome = BiomeType.LavaFlows;
                else visualBiome = BiomeType.Mountains;
                elevation = 'mid';
            } else {
                visualBiome = BiomeType.CrystalSpires;
                elevation = 'high';
            }

            let planetType: PlanetType;
             switch (visualBiome) {
                case BiomeType.FertilePlain:
                case BiomeType.Forest:
                    planetType = PlanetType.Terran;
                    break;
                case BiomeType.Mountains:
                case BiomeType.Wasteland:
                    planetType = PlanetType.Barren;
                    break;
                case BiomeType.CrystalSpires:
                    planetType = PlanetType.Ice;
                    break;
                case BiomeType.LavaFlows:
                    planetType = PlanetType.Volcanic;
                    break;
                default:
                    planetType = PlanetType.Barren;
            }

            map[key] = {
                type: planetType,
                elevation,
                visualBiome,
                elevationValue: elevationValue * 4, // Multiplier for visual height
            };
        }
    }
    
    // Layer resources and NPCs based on biome types
    const resources = [Resource.Ferrolyt, Resource.Luminis, Resource.Obskurit, Resource.Ätherharz];
    for (const key in map) {
        if (key === `${center}:${center}`) continue; // Skip home base

        const random = Math.random(); // Use a simple random for sparse features
        const biome = map[key].visualBiome;

        // 30% chance for a resource, with some biome affinity
        if (random < 0.3) {
            let resource: Resource | undefined;
            if (biome === BiomeType.Mountains || biome === BiomeType.LavaFlows) resource = Resource.Ferrolyt;
            else if (biome === BiomeType.CrystalSpires) resource = Resource.Luminis;
            else if (biome === BiomeType.Wasteland) resource = Resource.Obskurit;
            else if (biome === BiomeType.Forest || biome === BiomeType.FertilePlain) resource = Resource.Ätherharz;
            
            if (!resource) resource = resources[Math.floor(random * resources.length)];
            
            const delta = (Math.random() * 20) - 5;
            
            map[key].biome = {
                resource: resource,
                deltaPct: parseFloat(delta.toFixed(0)),
            };
        }
        
        // 10% chance for pirates in non-central areas
        if (random > 0.9 && (biome === BiomeType.Wasteland || biome === BiomeType.Mountains)) {
            map[key].npc = {
                type: 'pirate',
                fleet: { [UnitType.SkimJaeger]: Math.floor(Math.random() * 10) + 5 },
                resources: {
                    [Resource.Ferrolyt]: Math.floor(Math.random() * 5000) + 1000,
                    [Resource.Luminis]: Math.floor(Math.random() * 2500) + 500,
                }
            };
            map[key].visualBiome = BiomeType.PirateOutpost;
        }
    }

    // Set the home base
    map[`${center}:${center}`] = {
        type: PlanetType.Terran,
        elevation: 'mid',
        visualBiome: BiomeType.FertilePlain,
        elevationValue: map[`${center}:${center}`].elevationValue,
    };

    return map;
};