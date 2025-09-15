// types/models.ts

// Defines the shape of the JSON object that the HexModelAgent will generate.
// This structure is used by ProceduralHexModel.tsx to render the 3D scene.

export type Vector3 = [number, number, number];

export interface MaterialInfo {
  type: 'standard' | 'basic';
  color: string; // hex color string
  emissive?: string; // hex color string
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  opacity?: number;
  transparent?: boolean;
  side?: number;
}

export interface GeometryInfo {
  type: 'sphere' | 'box' | 'cylinder' | 'cone' | 'icosahedron' | 'ring' | 'plane' | 'torus';
  args: number[]; // Arguments for the THREE.js geometry constructor
}

export interface AnimationInfo {
  type: 'pulse' | 'float';
  speed: number;
  intensity: number;
}

export interface MeshInfo {
  id: string;
  geometry: GeometryInfo;
  material: MaterialInfo;
  position: Vector3;
  scale: Vector3;
  rotation?: Vector3;
  animation?: AnimationInfo;
}

export interface LightInfo {
  type: 'point' | 'spot';
  color: string;
  intensity: number;
  position: Vector3;
  distance?: number;
}

export interface HexModelDescription {
  meshes: MeshInfo[];
  lights?: LightInfo[];
}