/// <reference types="@react-three/fiber" />
import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import type { Mesh } from 'three';
import type { HexModelDescription, MeshInfo, LightInfo, GeometryInfo, MaterialInfo } from '../types/models';

const geometryCache = new Map<string, THREE.BufferGeometry>();
const materialCache = new Map<string, THREE.Material>();

const getGeometry = (geoInfo: GeometryInfo): THREE.BufferGeometry => {
    const key = `${geoInfo.type}-${geoInfo.args.join(',')}`;
    if (geometryCache.has(key)) return geometryCache.get(key)!;

    let geometry: THREE.BufferGeometry;
    switch (geoInfo.type) {
        case 'box':
            geometry = new THREE.BoxGeometry(...(geoInfo.args as [number, number, number]));
            break;
        case 'sphere':
            geometry = new THREE.SphereGeometry(...(geoInfo.args as [number, number, number]));
            break;
        case 'cylinder':
            geometry = new THREE.CylinderGeometry(...(geoInfo.args as [number, number, number, number]));
            break;
        case 'cone':
            geometry = new THREE.ConeGeometry(...(geoInfo.args as [number, number, number]));
            break;
        case 'icosahedron':
            geometry = new THREE.IcosahedronGeometry(...(geoInfo.args as [number, number]));
            break;
        case 'ring':
            geometry = new THREE.RingGeometry(...(geoInfo.args as [number, number, number]));
            break;
         case 'plane':
            geometry = new THREE.PlaneGeometry(...(geoInfo.args as [number, number]));
            break;
        case 'torus':
            geometry = new THREE.TorusGeometry(...(geoInfo.args as [number, number, number, number, number]));
            break;
        default:
            console.warn(`Unknown geometry type: ${geoInfo.type}, falling back to box.`);
            geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    }
    geometryCache.set(key, geometry);
    return geometry;
};

const getMaterial = (matInfo: MaterialInfo): THREE.Material => {
    const key = JSON.stringify(matInfo);
    if (materialCache.has(key)) return materialCache.get(key)!;

    let material: THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
    const params: THREE.MeshStandardMaterialParameters = {
        color: matInfo.color,
        roughness: matInfo.roughness ?? 0.5,
        metalness: matInfo.metalness ?? 0.5,
        emissive: matInfo.emissive,
        emissiveIntensity: matInfo.emissiveIntensity,
        transparent: matInfo.transparent ?? false,
        opacity: matInfo.opacity ?? 1,
        side: matInfo.side as THREE.Side,
    };

    if (matInfo.type === 'basic') {
        material = new THREE.MeshBasicMaterial(params);
    } else { // 'standard'
        material = new THREE.MeshStandardMaterial(params);
    }
    
    materialCache.set(key, material);
    return material;
}

const AnimatedModelMesh: React.FC<{ info: MeshInfo }> = ({ info }) => {
    const meshRef = useRef<Mesh>(null!);
    const originalPosition = useMemo(() => new THREE.Vector3(...info.position), [info.position]);

    useFrame(({ clock }) => {
        if (!meshRef.current || !info.animation) return;

        const time = clock.getElapsedTime();
        const { type, speed, intensity } = info.animation;

        switch (type) {
            case 'float':
                meshRef.current.position.y = originalPosition.y + Math.sin(time * speed) * intensity;
                break;
            case 'pulse':
                const material = meshRef.current.material as THREE.MeshStandardMaterial | THREE.MeshBasicMaterial;
                if (material && 'emissiveIntensity' in material) {
                    const baseIntensity = info.material.emissiveIntensity || 0;
                    // Use a sin wave that starts at the base intensity and goes up
                    material.emissiveIntensity = baseIntensity + (Math.sin(time * speed) * 0.5 + 0.5) * intensity;
                }
                break;
        }
    });

    const geometry = useMemo(() => getGeometry(info.geometry), [info.geometry]);
    const material = useMemo(() => getMaterial(info.material), [info.material]);

    return (
        <mesh
            ref={meshRef}
            geometry={geometry}
            material={material.clone()} // Clone material to ensure animations don't affect other instances
            position={info.position}
            scale={info.scale}
            rotation={info.rotation as [number, number, number] | undefined}
            castShadow
            receiveShadow
        />
    );
};

const ModelMesh: React.FC<{ info: MeshInfo }> = ({ info }) => {
    if (info.animation) {
        return <AnimatedModelMesh info={info} />;
    }

    const geometry = useMemo(() => getGeometry(info.geometry), [info.geometry]);
    const material = useMemo(() => getMaterial(info.material), [info.material]);
    
    return (
        <mesh
            geometry={geometry}
            material={material}
            position={info.position}
            scale={info.scale}
            rotation={info.rotation as [number, number, number] | undefined}
            castShadow
            receiveShadow
        />
    );
};

const ModelLight: React.FC<{ info: LightInfo }> = ({ info }) => {
    const color = new THREE.Color(info.color);
    switch (info.type) {
        case 'point':
            return <pointLight position={info.position} color={color} intensity={info.intensity} distance={info.distance} />;
        case 'spot':
            return <spotLight position={info.position} color={color} intensity={info.intensity} distance={info.distance} />;
        default:
            return null;
    }
}

export const ProceduralHexModel: React.FC<{ description: HexModelDescription }> = ({ description }) => {
    return (
        <group>
            {description.meshes.map(meshInfo => (
                <ModelMesh key={meshInfo.id} info={meshInfo} />
            ))}
            {description.lights?.map((lightInfo, index) => (
                <ModelLight key={`light-${index}`} info={lightInfo} />
            ))}
        </group>
    );
};