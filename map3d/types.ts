/// <reference types="@react-three/fiber" />
import * as THREE from 'three';
import type { Planet } from '../types';

// Hex geometry constants
export const HEX_R = 1.0; // Increased from 0.5 to make hexes larger
export const S3 = Math.sqrt(3);
export const HEX_SPACING_MULTIPLIER = 1.5; // Increased spacing for a larger map feel

// Coordinate conversion helper
export const axialToWorld = (q: number, r: number, height: number = 0): THREE.Vector3 => {
    return new THREE.Vector3(S3 * HEX_R * HEX_SPACING_MULTIPLIER * (q + r / 2), height, (HEX_R * 3 / 2) * HEX_SPACING_MULTIPLIER * r);
};

// Core data structure for a single hex in the 3D map
export type HexData = {
    q: number;
    r: number;
    planet: Planet;
    discovered: boolean;
    isHome: boolean;
};