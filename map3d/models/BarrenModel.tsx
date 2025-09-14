/// <reference types="@react-three/fiber" />
import React from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

const groundMaterial = new THREE.MeshStandardMaterial({ color: '#57534e', roughness: 0.9, metalness: 0.0 });
const craterMaterial = new THREE.MeshStandardMaterial({ color: '#44403c', roughness: 1.0 });

const groundGeo = new THREE.CylinderGeometry(1.0, 0.96, 0.2, 6);
groundGeo.rotateY(Math.PI / 6);

const craterGeo1 = new THREE.TorusGeometry(0.2, 0.04, 8, 16);
const craterGeo2 = new THREE.TorusGeometry(0.1, 0.02, 8, 16);

export function BarrenModel(props: ThreeElements['group']) {
  return (
    <group {...props} position-y={1.6}>
        <mesh geometry={groundGeo} material={groundMaterial} receiveShadow />
        <mesh geometry={craterGeo1} material={craterMaterial} position={[0.3, 0.1, -0.2]} rotation-x={Math.PI / 2} />
        <mesh geometry={craterGeo2} material={craterMaterial} position={[-0.4, 0.1, 0.2]} rotation-x={Math.PI / 2} />
        <mesh geometry={craterGeo2} material={craterMaterial} position={[0, 0.1, 0.5]} rotation-x={Math.PI / 2} scale={1.5}/>
    </group>
  );
}
