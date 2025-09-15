import type { HexModelDescription, MeshInfo } from '../types/models';
import { BiomeType } from './biomeData';
import * as THREE from 'three';

const BASE_HEIGHT = 0.8;
const SOIL_3_HEIGHT = 0.4;
const SOIL_2_HEIGHT = 0.2;
const SOIL_1_HEIGHT = 0.2;

// FIX: Add explicit MeshInfo type to prevent type inference issues.
const SOIL_3_MESH: MeshInfo = { id: 'diorama_soil_3', geometry: { type: 'cylinder', args: [1.2, 1.3, SOIL_3_HEIGHT, 6] }, material: { type: 'standard', color: '#3B2A22', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT/2, 0], scale: [1, 1, 1] };
const SOIL_2_MESH: MeshInfo = { id: 'diorama_soil_2', geometry: { type: 'cylinder', args: [1.1, 1.2, SOIL_2_HEIGHT, 6] }, material: { type: 'standard', color: '#4E382C', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT/2, 0], scale: [1, 1, 1] };
const SOIL_1_MESH: MeshInfo = { id: 'diorama_soil_1', geometry: { type: 'cylinder', args: [1.0, 1.1, SOIL_1_HEIGHT, 6] }, material: { type: 'standard', color: '#6B4E3C', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT + SOIL_1_HEIGHT/2, 0], scale: [1, 1, 1] };
const DIORAMA_BASE_MESHES: MeshInfo[] = [SOIL_3_MESH, SOIL_2_MESH, SOIL_1_MESH];

// --- Biome Definitions ---
// Each biome is now an array of descriptions to support variants.
// FIX: Added 'as const' to all geometry and material 'type' properties to ensure they are inferred as string literals, not the general 'string' type.
export const PRE_GENERATED_HEX_MODELS: Record<BiomeType, HexModelDescription[]> = {
  // --- FertilePlain ("Mystischer Hain mit Teich") ---
  [BiomeType.FertilePlain]: [
    { // Variant A
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "grass_top", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#6BBF59", "roughness": 0.9 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "pond_water", "geometry": { "type": "cylinder" as const, "args": [0.3, 0.3, 0.02, 16] }, "material": { "type": "standard" as const, "color": "#1FBBD0", "transparent": true, "opacity": 0.7, "roughness": 0.1 }, "position": [0.4, BASE_HEIGHT + 0.02, -0.2], "scale": [1, 1, 1] },
        { "id": "pond_rim", "geometry": { "type": "torus" as const, "args": [0.3, 0.03, 8, 16] }, "material": { "type": "standard" as const, "color": "#8d795f", "roughness": 0.9 }, "position": [0.4, BASE_HEIGHT + 0.02, -0.2], "rotation": [-1.57, 0, 0], "scale": [1, 1, 1] },
        { "id": "rock_1", "geometry": { "type": "icosahedron" as const, "args": [0.08, 0] }, "material": { "type": "standard" as const, "color": "#9FA9AF" }, "position": [0.2, BASE_HEIGHT + 0.05, -0.5], "scale": [1, 1, 1] },
        { "id": "tree_trunk", "geometry": { "type": "cylinder" as const, "args": [0.06, 0.09, 0.6, 7] }, "material": { "type": "standard" as const, "color": "#7A5A3E" }, "position": [-0.5, BASE_HEIGHT + 0.3, 0.3], "rotation": [0.3, 0, -0.2], "scale": [1, 1, 1] },
        { "id": "tree_foliage", "geometry": { "type": "icosahedron" as const, "args": [0.4, 0] }, "material": { "type": "standard" as const, "color": "#4FAE54" }, "position": [-0.6, BASE_HEIGHT + 0.7, 0.2], "scale": [1.2, 0.8, 1] },
        { "id": "mushroom_cap_1", "geometry": { "type": "sphere" as const, "args": [0.05, 8, 6, 0, 6.283, 0, 1.57] }, "material": { "type": "standard" as const, "color": "#F39A3C" }, "position": [-0.2, BASE_HEIGHT + 0.05, 0.7], "scale": [1, 1, 1] },
        { "id": "mushroom_stem_1", "geometry": { "type": "cylinder" as const, "args": [0.015, 0.015, 0.04] }, "material": { "type": "standard" as const, "color": "#F2E7CE" }, "position": [-0.2, BASE_HEIGHT + 0.02, 0.7], "scale": [1, 1, 1] }
      ]
    },
    { // Variant B
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "grass_top", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#6BBF59", "roughness": 0.9 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "tree_trunk", "geometry": { "type": "cylinder" as const, "args": [0.07, 0.1, 0.7, 7] }, "material": { "type": "standard" as const, "color": "#7A5A3E" }, "position": [0.5, BASE_HEIGHT + 0.35, -0.1], "rotation": [-0.2, 0, 0.15], "scale": [1, 1, 1] },
        { "id": "tree_foliage", "geometry": { "type": "icosahedron" as const, "args": [0.45, 0] }, "material": { "type": "standard" as const, "color": "#4FAE54" }, "position": [0.6, BASE_HEIGHT + 0.8, -0.05], "scale": [1, 1, 1] },
        { "id": "rock_cluster_1", "geometry": { "type": "icosahedron" as const, "args": [0.09, 0] }, "material": { "type": "standard" as const, "color": "#9FA9AF" }, "position": [-0.4, BASE_HEIGHT + 0.05, 0.5], "scale": [1, 1.2, 1] },
        { "id": "rock_cluster_2", "geometry": { "type": "icosahedron" as const, "args": [0.07, 0] }, "material": { "type": "standard" as const, "color": "#9FA9AF" }, "position": [-0.48, BASE_HEIGHT + 0.05, 0.4], "scale": [1, 1, 1] }
      ]
    }
  ],
  [BiomeType.Forest]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "forest_floor", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#284A35", "roughness": 0.9 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "tree_1_trunk", "geometry": { "type": "cylinder" as const, "args": [0.08, 0.11, 0.9, 5] }, "material": { "type": "standard" as const, "color": "#6b4226" }, "position": [-0.4, BASE_HEIGHT + 0.45, 0.4], "rotation": [0.1, 0, -0.1], "scale": [1, 1, 1] },
        { "id": "tree_1_foliage", "geometry": { "type": "icosahedron" as const, "args": [0.45, 0] }, "material": { "type": "standard" as const, "color": "#408253" }, "position": [-0.4, BASE_HEIGHT + 1.0, 0.4], "scale": [1.1, 0.8, 1] },
        { "id": "tree_2_trunk", "geometry": { "type": "cylinder" as const, "args": [0.09, 0.12, 1.0, 5] }, "material": { "type": "standard" as const, "color": "#5a3820" }, "position": [0.3, BASE_HEIGHT + 0.5, -0.2], "rotation": [-0.1, 0, 0.1], "scale": [1, 1, 1] },
        { "id": "tree_2_foliage", "geometry": { "type": "icosahedron" as const, "args": [0.55, 0] }, "material": { "type": "standard" as const, "color": "#529668" }, "position": [0.3, BASE_HEIGHT + 1.15, -0.2], "scale": [1.2, 0.9, 1.1] }
      ]
    }
  ],
    [BiomeType.Swamp]: [ // Ätherharz-Node
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "mud_top", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#332d20", "roughness": 0.8 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "resin_pool_1", "geometry": { "type": "cylinder" as const, "args": [0.25, 0.25, 0.02, 16] }, "material": { "type": "standard" as const, "color": "#27D3E6", "emissive": "#27D3E6", "emissiveIntensity": 0.5, "roughness": 0.2, "transparent": true, "opacity": 0.8 }, "position": [0.4, BASE_HEIGHT + 0.01, -0.3], "scale": [1, 1, 1] },
        { "id": "resin_pool_2", "geometry": { "type": "cylinder" as const, "args": [0.35, 0.35, 0.02, 16] }, "material": { "type": "standard" as const, "color": "#27D3E6", "emissive": "#178A99", "emissiveIntensity": 0.4, "roughness": 0.2, "transparent": true, "opacity": 0.8 }, "position": [-0.3, BASE_HEIGHT + 0.01, 0.4], "scale": [1, 1, 1] },
        { "id": "droplet_1", "geometry": { "type": "sphere" as const, "args": [0.02, 8, 8] }, "material": { "type": "basic" as const, "color": "#7DF0FF", "toneMapped": false }, "position": [0.4, BASE_HEIGHT + 0.2, -0.3], "animation": { "type": "float", "speed": 1.5, "intensity": 0.1 }, "scale": [1, 1, 1] },
        { "id": "moss_patch_1", "geometry": { "type": "sphere" as const, "args": [0.15, 8, 6, 0, 6.28, 0, 1.57] }, "material": { "type": "standard" as const, "color": "#4FAE54" }, "position": [0.1, BASE_HEIGHT + 0.02, 0.6], "scale": [1.2, 0.2, 1] }
      ]
    }
  ],
    [BiomeType.RedDesert]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "red_sand_surface", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#ea580c", "roughness": 0.9 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "dune_1", "geometry": { "type": "sphere" as const, "args": [0.6, 16, 8] }, "material": { "type": "standard" as const, "color": "#f97316", "roughness": 0.9 }, "position": [-0.3, BASE_HEIGHT - 0.1, 0.2], "scale": [1.4, 0.3, 1.2] },
        { "id": "rock_spire_1", "geometry": { "type": "cone" as const, "args": [0.08, 0.9, 5] }, "material": { "type": "standard" as const, "color": "#92400e", "roughness": 0.8 }, "position": [0.4, BASE_HEIGHT + 0.45, -0.4], "rotation": [0.1, 0.1, -0.1], "scale": [1, 1, 1] }
      ]
    }
  ],
  [BiomeType.TropicalJungle]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "jungle_floor", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#1e4026", "roughness": 0.9 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "leaf_1", "geometry": { "type": "plane" as const, "args": [0.6, 0.3] }, "material": { "type": "standard" as const, "color": "#4d7c0f", "side": 2 }, "position": [-0.3, BASE_HEIGHT + 0.3, 0.3], "rotation": [0.4, 0.8, -0.3], "scale": [1, 1, 1] },
        { "id": "leaf_2", "geometry": { "type": "plane" as const, "args": [0.7, 0.4] }, "material": { "type": "standard" as const, "color": "#65a30d", "side": 2 }, "position": [0.3, BASE_HEIGHT + 0.25, -0.3], "rotation": [-0.4, 0.7, 0.2], "scale": [1, 1, 1] },
        { "id": "exotic_flower", "geometry": { "type": "icosahedron" as const, "args": [0.12, 0] }, "material": { "type": "standard" as const, "color": "#f43f5e", "emissive": "#be123c", "emissiveIntensity": 0.4 }, "position": [0.2, BASE_HEIGHT + 0.1, 0.6], "scale": [1, 0.4, 1] },
      ]
    }
  ],
   [BiomeType.FrozenTundra]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "snow_surface", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#dbeafe", "roughness": 0.8 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "snow_drift", "geometry": { "type": "sphere" as const, "args": [0.6, 16, 8] }, "material": { "type": "standard" as const, "color": "#eff6ff", "roughness": 0.9 }, "position": [-0.3, BASE_HEIGHT - 0.1, 0.2], "scale": [1.2, 0.3, 1.5] },
        { "id": "ice_crystal_1", "geometry": { "type": "icosahedron" as const, "args": [0.25, 0] }, "material": { "type": "standard" as const, "color": "#bfdbfe", "roughness": 0.2, "transparent": true, "opacity": 0.85, "emissive": "#60a5fa", "emissiveIntensity": 0.1 }, "position": [0.4, BASE_HEIGHT + 0.1, -0.3], "scale": [1, 1.2, 1], "rotation": [0.5, 0.5, 0.5] }
      ]
    }
  ],
  [BiomeType.Mountains]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "rock_top", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.3, 6] }, "material": { "type": "standard" as const, "color": "#78716c", "roughness": 0.8 }, "position": [0, BASE_HEIGHT + 0.15, 0], "scale": [1, 1, 1] },
        { "id": "peak_1", "geometry": { "type": "cone" as const, "args": [0.4, 1.2, 8] }, "material": { "type": "standard" as const, "color": "#a8a29e", "roughness": 0.7 }, "position": [0.1, BASE_HEIGHT + 0.9, 0], "rotation": [0, 0, 0.2], "scale": [1, 1, 1] },
        { "id": "peak_2", "geometry": { "type": "cone" as const, "args": [0.3, 0.9, 6] }, "material": { "type": "standard" as const, "color": "#d6d3d1", "roughness": 0.7 }, "position": [-0.3, BASE_HEIGHT + 0.75, 0.3], "rotation": [0, 0, -0.3], "scale": [1, 1, 1] },
        { "id": "snow_cap_1", "geometry": { "type": "cone" as const, "args": [0.2, 0.25, 8] }, "material": { "type": "standard" as const, "color": "#f8fafc", "roughness": 0.9 }, "position": [0.05, BASE_HEIGHT + 1.35, 0], "rotation": [0, 0, 0.2], "scale": [1, 1, 1] },
      ]
    }
  ],
  [BiomeType.Wasteland]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "sand_surface", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#8c6d3a", "roughness": 0.9 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "eroded_rock_1", "geometry": { "type": "icosahedron" as const, "args": [0.4, 0] }, "material": { "type": "standard" as const, "color": "#a1a1aa", "roughness": 0.8 }, "position": [-0.3, BASE_HEIGHT - 0.05, 0.2], "scale": [1.5, 0.3, 0.8], "rotation": [0.5, 0.2, 0] },
      ]
    }
  ],
   [BiomeType.SaltFlats]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "salt_surface", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#f1f5f9", "roughness": 0.6 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "crack_1", "geometry": { "type": "box" as const, "args": [0.02, 0.01, 0.8] }, "material": { "type": "standard" as const, "color": "#94a3b8" }, "position": [0.2, BASE_HEIGHT + 0.02, 0], "rotation": [0, 0.8, 0], "scale": [1, 1, 1] },
        { "id": "salt_crystal_1", "geometry": { "type": "box" as const, "args": [0.08, 0.16, 0.08] }, "material": { "type": "standard" as const, "color": "#f8fafc", "roughness": 0.3, "transparent": true, "opacity": 0.9 }, "position": [-0.4, BASE_HEIGHT + 0.08, -0.1], "rotation": [0.1, 0.5, 0.2], "scale": [1, 1, 1] },
      ]
    }
  ],
  [BiomeType.CrystalSpires]: [ // Luminis-Cluster
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "crystal_ground", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#4c1d95", "roughness": 0.6 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "main_crystal", "geometry": { "type": "cone" as const, "args": [0.18, 1.2, 6] }, "material": { "type": "standard" as const, "color": "#FFC94B", "emissive": "#FFE79A", "emissiveIntensity": 0.6, "roughness": 0.2, "transparent": true, "opacity": 0.85 }, "position": [0, BASE_HEIGHT + 0.6, 0], "rotation": [0.1, 0, 0.1], "scale": [1, 1, 1] },
        { "id": "side_crystal_1", "geometry": { "type": "cone" as const, "args": [0.12, 0.8, 6] }, "material": { "type": "standard" as const, "color": "#FFC94B", "emissive": "#FFE79A", "emissiveIntensity": 0.4, "roughness": 0.2, "transparent": true, "opacity": 0.85 }, "position": [0.35, BASE_HEIGHT + 0.4, -0.25], "rotation": [0.3, 0.5, -0.2], "scale": [1, 1, 1] },
        { "id": "shard_1", "geometry": { "type": "cone" as const, "args": [0.05, 0.3, 6] }, "material": { "type": "standard" as const, "color": "#FFC94B" }, "position": [-0.3, BASE_HEIGHT + 0.15, 0.4], "rotation": [1.0, 0.2, -0.8], "scale": [1, 1, 1] }
      ],
      "lights": [
          { "type": "point", "color": "#FFE79A", "intensity": 1, "position": [0, BASE_HEIGHT + 0.8, 0], "distance": 3 }
      ]
    }
  ],
  [BiomeType.LavaFlows]: [ // Ferrolyt-Ader
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "rock_top", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#2E3440", "roughness": 0.7 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "main_vein", "geometry": { "type": "box" as const, "args": [0.08, 0.02, 1.2] }, "material": { "type": "basic" as const, "color": "#F04747", "toneMapped": false }, "position": [0.2, BASE_HEIGHT + 0.01, -0.1], "rotation": [0, -0.5, 0], "animation": { "type": "pulse", "speed": 0.8, "intensity": 0.5 }, "scale": [1, 1, 1] },
        { "id": "fissure_1", "geometry": { "type": "box" as const, "args": [0.04, 0.01, 0.8] }, "material": { "type": "basic" as const, "color": "#F04747", "toneMapped": false }, "position": [-0.3, BASE_HEIGHT + 0.01, 0.4], "rotation": [0, 0.8, 0], "animation": { "type": "pulse", "speed": 0.8, "intensity": 0.3 }, "scale": [1, 1, 1] }
      ]
    }
  ],
   [BiomeType.ObsidianSpires]: [ // Obskurit-Deposit
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "obsidian_ground", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#1e1b4b", "roughness": 0.8 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "monolith_1", "geometry": { "type": "box" as const, "args": [0.3, 0.8, 0.25] }, "material": { "type": "standard" as const, "color": "#1A1020", "roughness": 0.9 }, "position": [-0.4, BASE_HEIGHT + 0.4, 0.2], "rotation": [0.1, 0.5, 0.1], "scale": [1, 1, 1] },
        { "id": "monolith_2", "geometry": { "type": "box" as const, "args": [0.2, 0.6, 0.2] }, "material": { "type": "standard" as const, "color": "#1A1020", "roughness": 0.9 }, "position": [0.3, BASE_HEIGHT + 0.3, -0.3], "rotation": [-0.1, -0.3, -0.1], "scale": [1, 1, 1] },
        { "id": "monolith_1_crack", "geometry": { "type": "box" as const, "args": [0.31, 0.02, 0.02] }, "material": { "type": "basic" as const, "color": "#A46BFF", "toneMapped": false }, "position": [-0.4, BASE_HEIGHT + 0.3, 0.2], "rotation": [0.1, 0.5, 0.1], "animation": { "type": "pulse", "speed": 1.2, "intensity": 0.8 }, "scale": [1, 1, 1] },
        { "id": "ground_mist", "geometry": { "type": "cylinder" as const, "args": [0.9, 0.9, 0.02, 16] }, "material": { "type": "standard" as const, "color": "#A46BFF", "transparent": true, "opacity": 0.15 }, "position": [0, BASE_HEIGHT + 0.01, 0], "scale": [1, 1, 1] }
      ]
    }
  ],
  [BiomeType.GlowingCaves]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "cave_ground", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#44403c", "roughness": 0.8 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "cave_opening_rim", "geometry": { "type": "torus" as const, "args": [0.4, 0.08, 8, 16] }, "material": { "type": "standard" as const, "color": "#1c1917" }, "position": [0, BASE_HEIGHT - 0.02, 0], "rotation": [-1.57, 0, 0], "scale": [1, 1, 1] },
        { "id": "glow_crystal_1", "geometry": { "type": "cone" as const, "args": [0.06, 0.25, 6] }, "material": { "type": "standard" as const, "color": "#a78bfa", "emissive": "#8b5cf6", "emissiveIntensity": 0.8 }, "position": [-0.3, BASE_HEIGHT + 0.1, -0.4], "rotation": [-0.5, -0.5, 0], "scale": [1, 1, 1] }
      ],
      "lights": [
        { "type": "point", "color": "#a78bfa", "intensity": 0.8, "position": [0, BASE_HEIGHT - 0.2, 0], "distance": 3 }
      ]
    }
  ],
  [BiomeType.PirateOutpost]: [
    {
      "meshes": [
        ...DIORAMA_BASE_MESHES,
        { "id": "platform", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#475569", "metalness": 0.7, "roughness": 0.5 }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] },
        { "id": "main_structure", "geometry": { "type": "box" as const, "args": [0.6, 0.4, 0.5] }, "material": { "type": "standard" as const, "color": "#334155", "metalness": 0.8, "roughness": 0.4 }, "position": [0, BASE_HEIGHT + 0.2, 0], "rotation": [0, 0.3, 0], "scale": [1, 1, 1] },
        { "id": "command_tower", "geometry": { "type": "cylinder" as const, "args": [0.15, 0.12, 0.6, 4] }, "material": { "type": "standard" as const, "color": "#475569" }, "position": [0.2, BASE_HEIGHT + 0.5, -0.1], "rotation": [0, 0.785, 0], "scale": [1, 1, 1] },
        { "id": "warning_light", "geometry": { "type": "sphere" as const, "args": [0.04] }, "material": { "type": "basic" as const, "color": "#dc2626", "toneMapped": false }, "position": [0.2, BASE_HEIGHT + 0.85, -0.1], "animation": { "type": "pulse", "speed": 2.5, "intensity": 1.0 }, "scale": [1, 1, 1] }
      ]
    }
  ],
  [BiomeType.TimeRift]: [
    { "meshes": [ 
        ...DIORAMA_BASE_MESHES,
        { "id": "ground", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#0c0a09" }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] }, 
        { "id": "rift_main", "geometry": { "type": "plane" as const, "args": [0.08, 1.2] }, "material": { "type": "basic" as const, "color": "#A46BFF", "toneMapped": false, "side": 2 }, "position": [0, BASE_HEIGHT + 0.6, 0], "rotation": [0, 0.4, 0], "animation": { "type": "pulse", "speed": 0.4, "intensity": 1.0 }, "scale": [1, 1, 1] }, 
        { "id": "rift_secondary", "geometry": { "type": "plane" as const, "args": [0.04, 0.8] }, "material": { "type": "basic" as const, "color": "#7DF0FF", "toneMapped": false }, "position": [0.1, BASE_HEIGHT + 0.4, 0.1], "rotation": [0, -0.8, 0], "scale": [1, 1, 1] } 
    ]}
  ],
  [BiomeType.BlackHole]: [{ "meshes": [] }], // Handled by dedicated BlackHoleModel
  [BiomeType.StormField]: [
    { "meshes": [ 
        ...DIORAMA_BASE_MESHES,
        { "id": "ground", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#374151" }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] }, 
        { "id": "rod_1", "geometry": { "type": "cylinder" as const, "args": [0.03, 0.03, 0.8, 6] }, "material": { "type": "standard" as const, "color": "#C3CED6", "metalness": 1, "emissive": "#dbeafe", "emissiveIntensity": 0.2 }, "position": [-0.3, BASE_HEIGHT + 0.4, 0.3], "scale": [1, 1, 1] }, 
        { "id": "storm_sphere", "geometry": { "type": "sphere" as const, "args": [0.3, 16, 16] }, "material": { "type": "basic" as const, "color": "#27D3E6", "transparent": true, "opacity": 0.2 }, "position": [0, BASE_HEIGHT + 0.6, 0], "animation": { "type": "pulse", "speed": 2.0, "intensity": 0.5 }, "scale": [1, 1, 1] }
    ]}
  ],
  [BiomeType.PrismField]: [
    { "meshes": [ 
        ...DIORAMA_BASE_MESHES,
        { "id": "ground", "geometry": { "type": "cylinder" as const, "args": [1.0, 1.0, 0.05, 6] }, "material": { "type": "standard" as const, "color": "#312e81" }, "position": [0, BASE_HEIGHT, 0], "scale": [1, 1, 1] }, 
        { "id": "prism_main", "geometry": { "type": "cone" as const, "args": [0.3, 0.9, 6] }, "material": { "type": "standard" as const, "color": "#FFFFFF", "roughness": 0.1, "transparent": true, "opacity": 0.8, "emissive": "#e0e7ff", "emissiveIntensity": 0.3 }, "position": [0, BASE_HEIGHT + 0.45, 0], "animation": { "type": "pulse", "speed": 0.3, "intensity": 0.3 }, "scale": [1, 1, 1] } 
    ]}
  ],
};
