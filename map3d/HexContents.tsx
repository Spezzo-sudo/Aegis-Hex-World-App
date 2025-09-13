
import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Planet, PlanetType } from '../types';
import { AsteroidModel } from './models/Asteroid';
import { BlackHoleModel } from './models/BlackHole';
import { HomeBaseModel } from './models/HomeBase';
// FIX: Correctly import PlanetBasicModel which is now exported from its file.
import { PlanetBasicModel } from './models/PlanetBasic';
import { PlanetWithRingModel } from './models/PlanetWithRing';

// --- Shared Types & Helpers ---
export const HEX_R = 0.5;
export const S3 = Math.sqrt(3);

export const axialToWorld = (q: number, r: number): THREE.Vector3 => {
    return new THREE.Vector3(S3 * HEX_R * (q + r / 2), 0, (HEX_R * 3 / 2) * r);
};

export type HexData = {
    q: number;
    r: number;
    planet: Planet;
    discovered: boolean;
    isHome: boolean;
};

// --- Model Components ---
const PLANET_MATERIALS: Record<PlanetType, THREE.MeshStandardMaterial | THREE.MeshPhysicalMaterial> = {
    [PlanetType.Terran]: new THREE.MeshStandardMaterial({ color: '#5eead4', roughness: 0.6 }),
    [PlanetType.Volcanic]: new THREE.MeshStandardMaterial({ color: '#fb7185', roughness: 0.8, emissive: '#e11d48', emissiveIntensity: 0.2 }),
    // FIX: Use MeshPhysicalMaterial for the 'Ice' planet type to support 'transmission' and 'ior' properties.
    [PlanetType.Ice]: new THREE.MeshPhysicalMaterial({ color: '#93c5fd', roughness: 0.1, metalness: 0.1, transmission: 0.5, ior: 1.4 }),
    [PlanetType.GasGiant]: new THREE.MeshStandardMaterial({ color: '#c4b5fd', roughness: 0.9 }),
    [PlanetType.AsteroidField]: new THREE.MeshStandardMaterial({ color: '#94a3b8', roughness: 0.9 }),
    [PlanetType.Barren]: new THREE.MeshStandardMaterial({ color: '#a8a29e', roughness: 0.95 }),
};

function PlanetModel({ planet, position }: { planet: Planet, position: THREE.Vector3 }) {
    const ref = useRef<THREE.Group>(null!);
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.1;
    });

    const material = PLANET_MATERIALS[planet.type] || PLANET_MATERIALS[PlanetType.Barren];
    const scale = planet.type === PlanetType.GasGiant ? 0.25 : 0.2;

    return (
        <group ref={ref} position={position} scale={scale}>
            {planet.type === PlanetType.GasGiant ? <PlanetWithRingModel material={material}/> : <PlanetBasicModel material={material}/>}
        </group>
    );
}

function PirateBase({ position }: { position: THREE.Vector3 }) {
     const ref = useRef<THREE.Group>(null!);
    useFrame((_, delta) => {
        if (ref.current) ref.current.rotation.y += delta * 0.2;
    });
    return (
        <group ref={ref} position={position} scale={0.25}>
            <BlackHoleModel />
        </group>
    )
}

function HomeBase({ position }: { position: THREE.Vector3 }) {
    return (
        <group position={position} scale={0.15} rotation-y={Math.PI / 6}>
            <HomeBaseModel />
        </group>
    )
}

function AsteroidField({ position }: { position: THREE.Vector3 }) {
    const meshRef = useRef<THREE.InstancedMesh>(null!);
    const { nodes } = AsteroidModel.useGLTF();
    
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const count = 100;

    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < count; i++) {
            dummy.position.set(
                (Math.random() - 0.5) * 1.5,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 1.5
            );
            dummy.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );
            dummy.scale.setScalar(Math.random() * 0.05 + 0.02);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, dummy]);

    const rockGeometry = (nodes.RockA as THREE.Mesh).geometry;

    return (
         <group position={position}>
            <instancedMesh ref={meshRef} args={[rockGeometry, undefined, count]}>
                <meshStandardMaterial color="#57534e" roughness={0.8} />
            </instancedMesh>
        </group>
    )
}

// --- Main Contents Component ---

type Props = {
    hexData: HexData[];
};

export function HexContents({ hexData }: Props) {
    const discoveredHexes = useMemo(() => hexData.filter(h => h.discovered), [hexData]);

    return (
        <Suspense fallback={null}>
            {discoveredHexes.map(({ q, r, planet, isHome }) => {
                const position = axialToWorld(q, r);
                position.y += 0.8; // Elevation of discovered hexes
                
                if (isHome) {
                    return <HomeBase key={`${q}-${r}`} position={position} />;
                }
                
                if (planet.npc?.type === 'pirate') {
                     return <PirateBase key={`${q}-${r}`} position={position} />;
                }
                
                if (planet.type === PlanetType.AsteroidField) {
                     return <AsteroidField key={`${q}-${r}`} position={position} />;
                }

                return <PlanetModel key={`${q}-${r}`} planet={planet} position={position} />;
            })}
        </Suspense>
    );
}
