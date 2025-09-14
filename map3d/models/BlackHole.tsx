// FIX: Add a triple-slash directive to ensure TypeScript loads the type augmentations for JSX elements from @react-three/fiber.
/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

// A simple, reusable material for the black hole to avoid creating it on every render.
const blackHoleMaterial = new THREE.MeshBasicMaterial({
  color: 'black',
  side: THREE.DoubleSide,
});

export function BlackHoleModel(props: ThreeElements['group']) {
  return (
    <group {...props} dispose={null}>
      <mesh material={blackHoleMaterial}>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
}