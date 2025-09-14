/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

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
const domeMaterial = new THREE.MeshBasicMaterial({
    color: '#22d3ee',
    transparent: true,
    opacity: 0.25,
    side: THREE.DoubleSide,
});
const glowMaterial = new THREE.MeshBasicMaterial({
    color: '#67e8f9',
    toneMapped: false,
});
const hexBaseMaterial = new THREE.MeshStandardMaterial({ 
    color: '#1e293b', 
    metalness: 0.2, 
    roughness: 0.7 
});

const hexBaseGeo = new THREE.CylinderGeometry(2.5, 2.5, 1, 6);
hexBaseGeo.rotateY(Math.PI / 6);

export function HomeBaseModel(props: ThreeElements['group']) {
  return (
    <group {...props} dispose={null}>
        {/* Hex Base */}
        <mesh 
            geometry={hexBaseGeo}
            material={hexBaseMaterial}
            position-y={3.5}
            receiveShadow 
        />

        {/* Central Structure */}
        <mesh
            geometry={new THREE.CylinderGeometry(1.5, 1.8, 1, 6)}
            material={baseMaterial}
            position-y={4.5}
            rotation={[0, Math.PI / 6, 0]}
            receiveShadow
            castShadow
        />
        <mesh
            geometry={new THREE.CylinderGeometry(1, 1.2, 1, 6)}
            material={accentMaterial}
            position-y={5.5}
            rotation={[0, Math.PI / 6, 0]}
            castShadow
        />
        <mesh
            geometry={new THREE.CylinderGeometry(0.2, 0.2, 1.5, 4)}
            material={glowMaterial}
            position-y={6.5}
            rotation={[0, Math.PI / 4, 0]}
            castShadow
        />
        
        {/* Energy Dome */}
        <mesh
            geometry={new THREE.SphereGeometry(2.4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)}
            material={domeMaterial}
            position-y={4.0}
        />
        <mesh position-y={4.0}>
            <ringGeometry args={[2.38, 2.4, 64]} />
            <meshBasicMaterial color="#67e8f9" toneMapped={false} />
        </mesh>


        {/* Lights */}
        <pointLight color="#67e8f9" intensity={15} distance={15} position={[0, 5, 0]} />
    </group>
  )
}