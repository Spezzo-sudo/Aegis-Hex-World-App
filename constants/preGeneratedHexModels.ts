import type { HexModelDescription } from '../types/models';
import { BiomeType } from './biomeData';

// --- Reusable Components ---
const ROCK_BASE: HexModelDescription['meshes'] = [
  { id: "base_rock", geometry: { type: "cylinder", args: [1.0, 1.0, 0.2, 6] }, material: { type: "standard", color: "#292524", roughness: 0.8, metalness: 0.2 }, "position": [0, 0.1, 0], scale: [1, 1, 1] },
  { id: "base_border", geometry: { type: "ring", args: [0.98, 1.0, 6] }, material: { type: "basic", color: "#9ca3af" }, position: [0, 0.21, 0], rotation: [-Math.PI / 2, 0, Math.PI / 6], scale: [1, 1, 1]}
];
const WATER_SURFACE: HexModelDescription['meshes'] = [
  { id: "water_surface", geometry: { type: "cylinder", args: [0.95, 0.95, 0.1, 6] }, material: { type: "standard", color: "#06b6d4", roughness: 0.2, metalness: 0.1, transparent: true, opacity: 0.8 }, position: [0, 0.15, 0], scale: [1, 1, 1] }
];

// --- Biome Definitions ---
export const PRE_GENERATED_HEX_MODELS: Record<BiomeType, HexModelDescription> = {
  [BiomeType.FertilePlain]: {
    "meshes": [
      ...ROCK_BASE,
      { "id": "grass_surface", "geometry": { "type": "cylinder", "args": [0.95, 0.95, 0.05, 6] }, "material": { "type": "standard", "color": "#15803d", "roughness": 0.9, "metalness": 0 }, "position": [0, 0.2, 0], "scale": [1, 1, 1] },
      { "id": "rock_1", "geometry": { "type": "icosahedron", "args": [0.1, 0] }, "material": { "type": "standard", "color": "#9ca3af", "roughness": 0.7 }, "position": [0.6, 0.25, 0.4], "scale": [1, 0.7, 1.3] },
      { "id": "bush_1", "geometry": { "type": "icosahedron", "args": [0.15, 0] }, "material": { "type": "standard", "color": "#166534", "roughness": 0.8 }, "position": [-0.5, 0.25, -0.5], "scale": [1, 0.6, 1] },
    ]
  },
  [BiomeType.Forest]: {
    "meshes": [
      ...ROCK_BASE,
      { "id": "forest_floor", "geometry": { "type": "cylinder", "args": [0.95, 0.95, 0.05, 6] }, "material": { "type": "standard", "color": "#14532d", "roughness": 0.9 }, "position": [0, 0.2, 0], "scale": [1, 1, 1] },
      { "id": "tree_trunk_1", "geometry": { "type": "cylinder", "args": [0.05, 0.07, 0.5, 5] }, "material": { "type": "standard", "color": "#6b4226" }, "position": [-0.4, 0.45, 0.4], "scale": [1, 1, 1] },
      { "id": "tree_foliage_1", "geometry": { "type": "cone", "args": [0.3, 0.6, 6] }, "material": { "type": "standard", "color": "#15803d" }, "position": [-0.4, 0.85, 0.4], "scale": [1, 1, 1] },
      { "id": "tree_trunk_2", "geometry": { "type": "cylinder", "args": [0.06, 0.08, 0.6, 5] }, "material": { "type": "standard", "color": "#6b4226" }, "position": [0.3, 0.5, -0.2], "scale": [1, 1, 1] },
      { "id": "tree_foliage_2", "geometry": { "type": "cone", "args": [0.35, 0.8, 6] }, "material": { "type": "standard", "color": "#16a34a" }, "position": [0.3, 1.0, -0.2], "scale": [1, 1, 1] },
      { "id": "tree_trunk_3", "geometry": { "type": "cylinder", "args": [0.04, 0.06, 0.4, 5] }, "material": { "type": "standard", "color": "#6b4226" }, "position": [0.5, 0.4, 0.5], "scale": [1, 1, 1] },
      { "id": "tree_foliage_3", "geometry": { "type": "cone", "args": [0.25, 0.5, 6] }, "material": { "type": "standard", "color": "#22c55e" }, "position": [0.5, 0.75, 0.5], "scale": [1, 1, 1] },
    ]
  },
  [BiomeType.Mountains]: {
    "meshes": [
      ...ROCK_BASE,
      { "id": "mountain_top", "geometry": { "type": "cylinder", "args": [0.95, 0.95, 0.05, 6] }, "material": { "type": "standard", "color": "#57534e", "roughness": 0.8 }, "position": [0, 0.2, 0], "scale": [1, 1, 1] },
      { "id": "peak_1", "geometry": { "type": "cone", "args": [0.4, 1.0, 5] }, "material": { "type": "standard", "color": "#78716c", "roughness": 0.7 }, "position": [0.2, 0.7, -0.1], "scale": [1, 1, 1] },
      { "id": "peak_2", "geometry": { "type": "cone", "args": [0.3, 0.8, 5] }, "material": { "type": "standard", "color": "#a8a29e", "roughness": 0.7 }, "position": [-0.3, 0.6, 0.3], "scale": [1, 1, 1] },
    ]
  },
  [BiomeType.Wasteland]: {
    "meshes": [
       ...ROCK_BASE,
      { "id": "sand_surface", "geometry": { "type": "cylinder", "args": [0.95, 0.95, 0.05, 6] }, "material": { "type": "standard", "color": "#ca8a04", "roughness": 0.9 }, "position": [0, 0.2, 0], "scale": [1, 1, 1] },
      { "id": "rock_formation_1", "geometry": { "type": "icosahedron", "args": [0.3, 0] }, "material": { "type": "standard", "color": "#71717a", "roughness": 0.7 }, "position": [-0.3, 0.3, 0.2], "scale": [1.5, 0.8, 1] },
      { "id": "rock_formation_2", "geometry": { "type": "icosahedron", "args": [0.2, 0] }, "material": { "type": "standard", "color": "#a1a1aa", "roughness": 0.7 }, "position": [0.4, 0.25, -0.3], "scale": [1, 1, 1.8] },
    ]
  },
  [BiomeType.CrystalSpires]: {
    "meshes": [
       ...ROCK_BASE,
      { "id": "crystal_ground", "geometry": { "type": "cylinder", "args": [0.95, 0.95, 0.05, 6] }, "material": { "type": "standard", "color": "#4c1d95", "roughness": 0.6 }, "position": [0, 0.2, 0], "scale": [1, 1, 1] },
      { "id": "crystal_1", "geometry": { "type": "cylinder", "args": [0.1, 0.2, 1.2, 6] }, "material": { "type": "standard", "color": "#a78bfa", "emissive": "#8b5cf6", "emissiveIntensity": 1.5, "roughness": 0.2, "transparent": true, "opacity": 0.8 }, "position": [0, 0.8, 0], "scale": [1, 1, 1], "rotation": [0.1, 0, 0.1] },
      { "id": "crystal_2", "geometry": { "type": "cylinder", "args": [0.15, 0.1, 1.0, 6] }, "material": { "type": "standard", "color": "#c4b5fd", "emissive": "#a78bfa", "emissiveIntensity": 1.5, "roughness": 0.2, "transparent": true, "opacity": 0.8 }, "position": [0.4, 0.7, -0.3], "scale": [1, 1, 1], "rotation": [0.3, 0.5, -0.2] },
      { "id": "crystal_3", "geometry": { "type": "cylinder", "args": [0.08, 0.12, 0.8, 6] }, "material": { "type": "standard", "color": "#ddd6fe", "emissive": "#c4b5fd", "emissiveIntensity": 1.5, "roughness": 0.2, "transparent": true, "opacity": 0.8 }, "position": [-0.3, 0.6, 0.4], "scale": [1, 1, 1], "rotation": [-0.2, -0.4, 0.1] },
    ]
  },
  [BiomeType.LavaFlows]: {
    "meshes": [
      ...ROCK_BASE,
      { "id": "cooled_rock", "geometry": { "type": "cylinder", "args": [0.95, 0.95, 0.05, 6] }, "material": { "type": "standard", "color": "#1c1917", "roughness": 0.7 }, "position": [0, 0.2, 0], "scale": [1, 1, 1] },
      { "id": "lava_crack_1", "geometry": { "type": "box", "args": [0.08, 0.06, 1.0] }, "material": { "type": "basic", "color": "#f97316", "emissive": "#f97316", "emissiveIntensity": 2 }, "position": [0, 0.2, 0], "scale": [1, 1, 1], "rotation": [0, 0.5, 0] },
      { "id": "lava_crack_2", "geometry": { "type": "box", "args": [0.06, 0.06, 0.8] }, "material": { "type": "basic", "color": "#fb923c", "emissive": "#fb923c", "emissiveIntensity": 2 }, "position": [0.3, 0.2, 0], "scale": [1, 1, 1], "rotation": [0, -0.8, 0] },
    ]
  },
  [BiomeType.PirateOutpost]: {
    "meshes": [
      ...ROCK_BASE,
      { "id": "platform", "geometry": { "type": "cylinder", "args": [0.95, 0.95, 0.05, 6] }, "material": { "type": "standard", "color": "#475569", "metalness": 0.7, "roughness": 0.5 }, "position": [0, 0.2, 0], "scale": [1, 1, 1] },
      { "id": "main_structure", "geometry": { "type": "box", "args": [0.6, 0.6, 0.6] }, "material": { "type": "standard", "color": "#334155", "metalness": 0.8, "roughness": 0.4 }, "position": [0, 0.5, 0], "scale": [1, 1, 1] },
      { "id": "spire_1", "geometry": { "type": "cone", "args": [0.1, 0.8, 4] }, "material": { "type": "standard", "color": "#dc2626", "emissive": "#dc2626", "emissiveIntensity": 1.5 }, "position": [0.4, 0.9, 0.4], "scale": [1, 1, 1], "rotation": [0, 0.785, 0.5] },
      { "id": "spire_2", "geometry": { "type": "cone", "args": [0.1, 0.8, 4] }, "material": { "type": "standard", "color": "#ef4444", "emissive": "#ef4444", "emissiveIntensity": 1.5 }, "position": [-0.4, 0.9, -0.4], "scale": [1, 1, 1], "rotation": [0, 0.785, -0.5] },
    ]
  },
  [BiomeType.TimeRift]: { "meshes": [...ROCK_BASE, { "id": "rift", "geometry": { "type": "box", "args": [0.04, 0.8, 1.2] }, "material": { "type": "basic", "color": "#A46BFF", "emissive": "#A46BFF", "emissiveIntensity": 3 }, "position": [0, 0.6, 0], "scale": [1, 1, 1] }] },
  [BiomeType.BlackHole]: { "meshes": [...ROCK_BASE, { "id": "hole", "geometry": { "type": "sphere", "args": [0.4, 16, 16] }, "material": { "type": "basic", "color": "#000000" }, "position": [0, 0.6, 0], "scale": [1, 1, 1] }] },
  [BiomeType.StormField]: { "meshes": [...ROCK_BASE, { "id": "rod", "geometry": { "type": "cylinder", "args": [0.04, 0.04, 1.0, 6] }, "material": { "type": "standard", "color": "#C3CED6", "metalness": 1 }, "position": [0, 0.7, 0], "scale": [1, 1, 1] }] },
  [BiomeType.PrismField]: { "meshes": [...ROCK_BASE, { "id": "prism", "geometry": { "type": "cylinder", "args": [0, 0.4, 1.0, 6] }, "material": { "type": "standard", "color": "#FFFFFF", "roughness": 0.1, "transparent": true, "opacity": 0.8 }, "position": [0, 0.7, 0], "scale": [1, 1, 1] }] },
};