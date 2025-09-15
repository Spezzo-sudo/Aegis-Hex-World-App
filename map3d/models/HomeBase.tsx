/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';
import { ProceduralHexModel } from '../ProceduralHexModel';
import type { HexModelDescription, MeshInfo } from '../../types/models';

const baseMaterial = new THREE.MeshStandardMaterial({
    color: '#475569',
    metalness: 0.6,
    roughness: 0.4,
});
const accentMaterial = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.8,
    roughness: 0.2,
});
const domeMaterial = new THREE.MeshStandardMaterial({
    color: '#22d3ee',
    transparent: true,
    opacity: 0.2,
    side: THREE.DoubleSide,
    emissive: '#22d3ee',
    emissiveIntensity: 0.2
});
const glowMaterial = new THREE.MeshBasicMaterial({
    color: '#67e8f9',
    toneMapped: false,
});

const BASE_HEIGHT = 0.8;
const SOIL_3_HEIGHT = 0.4;
const SOIL_2_HEIGHT = 0.2;
const SOIL_1_HEIGHT = 0.2;

// FIX: Add explicit MeshInfo type to prevent type inference issues.
const SOIL_3_MESH: MeshInfo = { id: 'diorama_soil_3', geometry: { type: 'cylinder', args: [1.2, 1.3, SOIL_3_HEIGHT, 6] }, material: { type: 'standard', color: '#3B2A22', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT/2, 0], scale: [1, 1, 1] };
const SOIL_2_MESH: MeshInfo = { id: 'diorama_soil_2', geometry: { type: 'cylinder', args: [1.1, 1.2, SOIL_2_HEIGHT, 6] }, material: { type: 'standard', color: '#4E382C', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT/2, 0], scale: [1, 1, 1] };
const SOIL_1_MESH: MeshInfo = { id: 'diorama_soil_1', geometry: { type: 'cylinder', args: [1.0, 1.1, SOIL_1_HEIGHT, 6] }, material: { type: 'standard', color: '#6B4E3C', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT + SOIL_1_HEIGHT/2, 0], scale: [1, 1, 1] };
const TOP_MESH: MeshInfo = { id: 'top_surface', geometry: { type: 'cylinder', args: [1.0, 1.0, 0.05, 6] }, material: { type: 'standard', color: '#1e293b' }, position: [0, BASE_HEIGHT, 0], scale: [1, 1, 1] };

const DIORAMA_BASE_DESC: HexModelDescription = { meshes: [SOIL_3_MESH, SOIL_2_MESH, SOIL_1_MESH, TOP_MESH] };

export function HomeBaseModel(props: ThreeElements['group']) {
  return (
    <group {...props} dispose={null}>
        {/* Diorama Base */}
        <ProceduralHexModel description={DIORAMA_BASE_DESC} />

        {/* Central Structure, moved up to sit on the base */}
        <mesh
            geometry={new THREE.CylinderGeometry(0.6, 0.72, 0.4, 6)}
            material={baseMaterial}
            position-y={BASE_HEIGHT + 0.2}
            rotation={[0, Math.PI / 6, 0]}
            receiveShadow
            castShadow
        />
        <mesh
            geometry={new THREE.CylinderGeometry(0.4, 0.48, 0.4, 6)}
            material={accentMaterial}
            position-y={BASE_HEIGHT + 0.6}
            rotation={[0, Math.PI / 6, 0]}
            castShadow
        />
        <mesh
            geometry={new THREE.CylinderGeometry(0.08, 0.08, 0.6, 4)}
            material={glowMaterial}
            position-y={BASE_HEIGHT + 1.1}
            rotation={[0, Math.PI / 4, 0]}
            castShadow
        />
        
        {/* Energy Dome, adjusted */}
        <mesh
            geometry={new THREE.SphereGeometry(0.96, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)}
            material={domeMaterial}
            position-y={BASE_HEIGHT}
        />
        <mesh position-y={BASE_HEIGHT + 0.01}>
            <ringGeometry args={[0.95, 0.96, 64]} />
            <meshBasicMaterial color="#67e8f9" toneMapped={false} />
        </mesh>
    </group>
  )
}
