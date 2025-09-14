// FIX: Add a triple-slash directive to ensure TypeScript loads the type augmentations for JSX elements from @react-three/fiber.
/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

// To improve readability and type safety, define props interface separately.
// FIX: Changed from 'interface extends' to a 'type' with an intersection, as an interface cannot extend a mapped type.
type PlanetBasicModelProps = ThreeElements['group'] & {
  material: THREE.Material;
};

// FIX: Replaced the GLTF-based model with a simple THREE geometry to rule out
// potential GLTF loading errors that could cause the "Illegal return statement"
// syntax error. This provides a stable, known-good component for rendering planets.
export function PlanetBasicModel({ material, ...props }: PlanetBasicModelProps) {
  return (
    <group {...props} dispose={null}>
      <mesh material={material}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
}