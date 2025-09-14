/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

type PlanetWithRingModelProps = ThreeElements['group'] & {
  material: THREE.Material;
};

const ringMaterial = new THREE.MeshBasicMaterial({ color: '#a8a29e', side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

export function PlanetWithRingModel({ material, ...props }: PlanetWithRingModelProps) {
  return (
    <group {...props} dispose={null}>
      <mesh material={material} castShadow receiveShadow>
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} material={ringMaterial}>
        <ringGeometry args={[1.3, 1.6, 64]} />
      </mesh>
    </group>
  );
}