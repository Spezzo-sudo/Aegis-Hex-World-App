/// <reference types="@react-three/fiber" />
import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { ThreeElements } from '@react-three/fiber';

const asteroidMaterial = new THREE.MeshStandardMaterial({ color: '#57534e', roughness: 0.8, metalness: 0.2 });
const asteroidGeo = new THREE.IcosahedronGeometry(1, 0);
const ASTEROID_COUNT = 15;

const mulberry32 = (a: number) => {
    return () => {
        let t = a += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

export function AsteroidFieldModel(props: ThreeElements['group']) {
    const rand = useMemo(() => mulberry32(123), []);
    const meshRef = useRef<THREE.InstancedMesh>(null!);

    useEffect(() => {
        if (!meshRef.current) return;
        const dummy = new THREE.Object3D();
        for (let i = 0; i < ASTEROID_COUNT; i++) {
            dummy.position.set(
                (rand() - 0.5) * 3.0, // Increased range
                0.3 + (rand() * 1.4), // Lowered to match flat map
                (rand() - 0.5) * 3.0  // Increased range
            );
            dummy.rotation.set(
                rand() * Math.PI,
                rand() * Math.PI,
                rand() * Math.PI
            );
            const scale = 0.1 + rand() * 0.3; // Increased scale
            dummy.scale.set(scale, scale, scale);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [rand]);

    return (
        <instancedMesh ref={meshRef} args={[asteroidGeo, asteroidMaterial, ASTEROID_COUNT]} castShadow />
    );
}