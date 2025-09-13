import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PlanetType } from '../types';
import { axialToWorld, HexData } from './HexMap3D';

const MAX_ASTEROIDS = 500; // Max asteroids for the whole map

// Pre-create geometries
const regularPlanetGeo = new THREE.SphereGeometry(0.25, 32, 32);
const gasGiantGeo = new THREE.SphereGeometry(0.35, 32, 32);
const ringGeo = new THREE.RingGeometry(0.4, 0.6, 64);
ringGeo.rotateX(-Math.PI / 2);

const asteroidGeo = new THREE.IcosahedronGeometry(0.05, 0);
const pirateGeo = new THREE.OctahedronGeometry(0.15); // Simple diamond shape for pirates
const dustGeo = new THREE.BufferGeometry();
const dustPositions = new Float32Array(300 * 3);
for (let i = 0; i < 300; i++) {
    dustPositions[i*3] = (Math.random() - 0.5) * 1.2;
    dustPositions[i*3 + 1] = (Math.random() - 0.5) * 0.5;
    dustPositions[i*3 + 2] = (Math.random() - 0.5) * 1.2;
}
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
const dustMaterial = new THREE.PointsMaterial({ color: '#475569', size: 0.005, transparent: true, opacity: 0.5 });

// FIX: Use a simple color map for planet types that share a base material but have different colors.
const planetColors = {
    [PlanetType.Terran]: '#4f759b',
    [PlanetType.Barren]: '#95a5a6',
};


export const HexContents: React.FC<{ hexData: HexData[] }> = ({ hexData }) => {
    // FIX: Use separate InstancedMesh refs for each distinct material type.
    const standardPlanetMesh = useRef<THREE.InstancedMesh>(null!); // For Terran, Barren
    const volcanicPlanetMesh = useRef<THREE.InstancedMesh>(null!);
    const icePlanetMesh = useRef<THREE.InstancedMesh>(null!);
    const gasGiantMesh = useRef<THREE.InstancedMesh>(null!);
    const ringMesh = useRef<THREE.InstancedMesh>(null!);
    const asteroidMesh = useRef<THREE.InstancedMesh>(null!);
    const pirateMesh = useRef<THREE.InstancedMesh>(null!);
    
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const color = useMemo(() => new THREE.Color(), []);

    useEffect(() => {
        const counts = { standard: 0, volcanic: 0, ice: 0, gasGiant: 0, ring: 0, pirate: 0 };
        const asteroidMatrices: THREE.Matrix4[] = [];

        hexData.forEach(hex => {
            if (!hex.discovered) return;

            const p = axialToWorld(hex.q, hex.r);
            const planetType = hex.planet.type;
            const hasRings = planetType === PlanetType.GasGiant || (planetType !== PlanetType.AsteroidField && Math.random() > 0.7);

            // Randomize position and rotation for a chaotic look
            const posOffset = new THREE.Vector3(
                (Math.random() - 0.5) * 0.3,
                0,
                (Math.random() - 0.5) * 0.3
            );
            const randomRotation = new THREE.Euler(
                Math.random() * 0.1,
                Math.random() * Math.PI * 2,
                Math.random() * 0.1
            );
            
            dummy.position.set(p.x + posOffset.x, 0.4, p.z + posOffset.z);
            dummy.rotation.copy(randomRotation);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();

            // FIX: Assign each planet instance to the correct InstancedMesh based on its type.
            switch (planetType) {
                case PlanetType.Terran:
                case PlanetType.Barren:
                    standardPlanetMesh.current.setMatrixAt(counts.standard, dummy.matrix);
                    standardPlanetMesh.current.setColorAt(counts.standard++, color.set(planetColors[planetType]));
                    break;
                case PlanetType.Volcanic:
                    volcanicPlanetMesh.current.setMatrixAt(counts.volcanic++, dummy.matrix);
                    break;
                case PlanetType.Ice:
                    icePlanetMesh.current.setMatrixAt(counts.ice++, dummy.matrix);
                    break;
                case PlanetType.GasGiant:
                    gasGiantMesh.current.setMatrixAt(counts.gasGiant++, dummy.matrix);
                    break;
            }

            // Rings
            if (hasRings) {
                dummy.rotation.set(
                    Math.PI / 2 + (Math.random() - 0.5) * 0.4,
                    randomRotation.y,
                    (Math.random() - 0.5) * 0.3
                );
                dummy.updateMatrix();
                ringMesh.current.setMatrixAt(counts.ring++, dummy.matrix);
            }

            // Asteroid Fields
            if (planetType === PlanetType.AsteroidField) {
                for(let i = 0; i < 15; i++) {
                    if (asteroidMatrices.length >= MAX_ASTEROIDS) break;
                    const astPos = new THREE.Vector3(
                        p.x + (Math.random() - 0.5) * 0.8,
                        0.4 + (Math.random() - 0.5) * 0.4,
                        p.z + (Math.random() - 0.5) * 0.8
                    );
                    dummy.position.copy(astPos);
                    dummy.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
                    const scale = Math.random() * 0.5 + 0.5;
                    dummy.scale.set(scale, scale, scale);
                    dummy.updateMatrix();
                    asteroidMatrices.push(dummy.matrix.clone());
                }
            }

            // Pirate markers
            if (hex.planet.npc?.type === 'pirate') {
                dummy.position.set(p.x, 0.55, p.z);
                dummy.scale.set(1, 1, 1);
                dummy.rotation.set(0, Math.random() * Math.PI, 0.2);
                dummy.updateMatrix();
                pirateMesh.current.setMatrixAt(counts.pirate++, dummy.matrix);
            }
        });

        // Update counts and instance matrices
        standardPlanetMesh.current.count = counts.standard;
        standardPlanetMesh.current.instanceMatrix.needsUpdate = true;
        standardPlanetMesh.current.instanceColor!.needsUpdate = true;
        
        volcanicPlanetMesh.current.count = counts.volcanic;
        volcanicPlanetMesh.current.instanceMatrix.needsUpdate = true;
        
        icePlanetMesh.current.count = counts.ice;
        icePlanetMesh.current.instanceMatrix.needsUpdate = true;

        gasGiantMesh.current.count = counts.gasGiant;
        gasGiantMesh.current.instanceMatrix.needsUpdate = true;
        
        ringMesh.current.count = counts.ring;
        ringMesh.current.instanceMatrix.needsUpdate = true;

        asteroidMatrices.forEach((matrix, i) => asteroidMesh.current.setMatrixAt(i, matrix));
        asteroidMesh.current.count = asteroidMatrices.length;
        asteroidMesh.current.instanceMatrix.needsUpdate = true;

        pirateMesh.current.count = counts.pirate;
        pirateMesh.current.instanceMatrix.needsUpdate = true;
        
    }, [hexData, color]);

    return (
        <>
            <instancedMesh ref={standardPlanetMesh} args={[regularPlanetGeo, undefined, hexData.length]}>
                <meshStandardMaterial vertexColors metalness={0.2} roughness={0.8} />
            </instancedMesh>
            <instancedMesh ref={volcanicPlanetMesh} args={[regularPlanetGeo, undefined, hexData.length]}>
                <meshStandardMaterial color="#591a0f" roughness={0.8} emissive="#ff4500" emissiveIntensity={0.6} />
            </instancedMesh>
            {/* FIX: Use MeshPhysicalMaterial for ice planets to support the 'transmission' property. */}
            <instancedMesh ref={icePlanetMesh} args={[regularPlanetGeo, undefined, hexData.length]}>
                <meshPhysicalMaterial color="#aed6f1" roughness={0.1} metalness={0.2} transmission={0.9} thickness={0.5} />
            </instancedMesh>
            <instancedMesh ref={gasGiantMesh} args={[gasGiantGeo, undefined, hexData.length]}>
                 <meshStandardMaterial color="#e59b3a" roughness={0.9} />
            </instancedMesh>
            <instancedMesh ref={ringMesh} args={[ringGeo, new THREE.MeshBasicMaterial({ color: '#826e5c', side: THREE.DoubleSide, transparent: true, opacity: 0.6 }), hexData.length]} />
            
            <instancedMesh ref={asteroidMesh} args={[asteroidGeo, new THREE.MeshStandardMaterial({ color: '#95a5a6', roughness: 0.9 }), MAX_ASTEROIDS]} />

            <instancedMesh ref={pirateMesh} args={[pirateGeo, new THREE.MeshStandardMaterial({color: '#f43f5e', emissive: '#f43f5e', emissiveIntensity: 0.6, metalness: 0, roughness: 0.5 }), hexData.length]} />
            
            {/* Render dust clouds as individual Points objects, which is valid and performant enough for this scale. */}
            {hexData.map(hex => {
                if (!hex.discovered) return null;
                const p = axialToWorld(hex.q, hex.r);
                return <points key={`${hex.q}-${hex.r}`} position={[p.x, 0.2, p.z]} geometry={dustGeo} material={dustMaterial} />;
            })}
        </>
    );
};
