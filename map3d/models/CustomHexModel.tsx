// FIX: Add a triple-slash directive to ensure TypeScript loads the type augmentations for JSX elements from @react-three/fiber.
/// <reference types="@react-three/fiber" />
import React, { useMemo, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import type { HexData } from '../types';
import { axialToWorld } from '../types';

// This component has been refactored to use InstancedMesh for performance.
// It loads a single OBJ model and renders it at multiple hex locations
// efficiently, drastically reducing draw calls.

const defaultMaterial = new THREE.MeshStandardMaterial({
    color: '#94a3b8',
    metalness: 0.1,
    roughness: 0.8,
});

// A fallback mesh to display if the model fails to load or parse.
// This prevents the entire map from crashing if one asset is broken.
const FallbackMesh: React.FC<{position: [number, number, number]}> = ({ position }) => (
    <mesh position={position}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial color="red" emissive="red" emissiveIntensity={2} />
    </mesh>
)

interface InstancedCustomModelProps {
    modelFile: string;
    hexes: HexData[];
}

export const CustomHexModel: React.FC<InstancedCustomModelProps> = ({ modelFile, hexes }) => {
    const modelUrl = `/models/hexes/${modelFile}`;
    const obj = useLoader(OBJLoader, modelUrl);

    // Extract geometry and apply a default material.
    // This makes the loading more robust, as it ensures that even if the
    // original .obj or its .mtl file has material issues, we can still
    // extract a renderable geometry.
    const geometry = useMemo(() => {
        let geo: THREE.BufferGeometry | null = null;
        obj.traverse(child => {
            if ((child as THREE.Mesh).isMesh) {
                // Proactively apply our default material to ensure consistency and fix potential material errors.
                (child as THREE.Mesh).material = defaultMaterial;
                // If we haven't found a geometry yet, take this one.
                if (!geo) {
                    geo = (child as THREE.Mesh).geometry;
                }
            }
        });
        if (!geo) {
            console.warn(`No geometry found in model file: ${modelFile}`);
        }
        return geo;
    }, [obj, modelFile]);


    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    useEffect(() => {
        if (!meshRef.current || !geometry) return;

        // Position an instance of the model for each hex provided.
        hexes.forEach((hex, i) => {
            const pos = axialToWorld(hex.q, hex.r);
            pos.y += 0.8; // Align with hex surface height

            dummy.position.copy(pos);
            dummy.scale.set(0.4, 0.4, 0.4);
            dummy.rotation.y = -Math.PI / 2;
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [hexes, geometry]);

    // If no geometry could be extracted, render a visible fallback for each hex
    // so it's clear that something is missing.
    if (!geometry) {
        return (
            <group>
                {hexes.map(hex => {
                    const pos = axialToWorld(hex.q, hex.r);
                    pos.y += 0.8;
                    return <FallbackMesh key={`${hex.q}-${hex.r}`} position={[pos.x, pos.y, pos.z]} />
                })}
            </group>
        );
    }

    return (
        <instancedMesh ref={meshRef} args={[geometry, defaultMaterial, hexes.length]} />
    );
};