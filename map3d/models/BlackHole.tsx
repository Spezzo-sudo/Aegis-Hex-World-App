// FIX: Add a triple-slash directive to ensure TypeScript loads the type augmentations for JSX elements from @react-three/fiber.
/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';
import { ProceduralHexModel } from '../ProceduralHexModel';
import type { HexModelDescription, MeshInfo } from '../../types/models';

// A simple, reusable material for the black hole to avoid creating it on every render.
const blackHoleMaterial = new THREE.MeshBasicMaterial({
  color: 'black',
  side: THREE.DoubleSide,
});

// FIX: Changed to MeshStandardMaterial to support emissive properties, which are not available on MeshBasicMaterial.
const accretionMaterial = new THREE.MeshStandardMaterial({ color: "#7DF0FF", emissive: "#7DF0FF", emissiveIntensity: 1.5, side: THREE.DoubleSide, toneMapped: false });

const BASE_HEIGHT = 0.8;
const SOIL_3_HEIGHT = 0.4;
const SOIL_2_HEIGHT = 0.2;
const SOIL_1_HEIGHT = 0.2;

// FIX: Add explicit MeshInfo type to prevent type inference issues.
const SOIL_3_MESH: MeshInfo = { id: 'diorama_soil_3', geometry: { type: 'cylinder', args: [1.2, 1.3, SOIL_3_HEIGHT, 6] }, material: { type: 'standard', color: '#111827', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT/2, 0], scale: [1, 1, 1] };
const SOIL_2_MESH: MeshInfo = { id: 'diorama_soil_2', geometry: { type: 'cylinder', args: [1.1, 1.2, SOIL_2_HEIGHT, 6] }, material: { type: 'standard', color: '#1f2937', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT/2, 0], scale: [1, 1, 1] };
const SOIL_1_MESH: MeshInfo = { id: 'diorama_soil_1', geometry: { type: 'cylinder', args: [1.0, 1.1, SOIL_1_HEIGHT, 6] }, material: { type: 'standard', color: '#374151', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT + SOIL_1_HEIGHT/2, 0], scale: [1, 1, 1] };
const TOP_MESH: MeshInfo = { id: 'top', geometry: { type: 'cylinder', args: [1.0, 1.0, 0.05, 6] }, material: { type: 'standard', color: '#0c0a09', roughness: 0.8 }, position: [0, BASE_HEIGHT, 0], scale: [1, 1, 1] };

const DIORAMA_BASE_DESC: HexModelDescription = { meshes: [SOIL_3_MESH, SOIL_2_MESH, SOIL_1_MESH, TOP_MESH] };

export function BlackHoleModel(props: ThreeElements['group']) {
  return (
    <group {...props} dispose={null}>
      {/* Diorama Base */}
       <ProceduralHexModel description={DIORAMA_BASE_DESC} />
       
      {/* Black Hole */}
      <mesh material={blackHoleMaterial} position-y={BASE_HEIGHT + 0.2}>
        <sphereGeometry args={[0.16, 32, 32]} />
      </mesh>
      {/* Accretion Disk */}
      <mesh material={accretionMaterial} position-y={BASE_HEIGHT + 0.2} rotation-x={-1.7}>
         <ringGeometry args={[0.2, 0.32, 64]} />
      </mesh>
    </group>
  );
}
