/// <reference types="@react-three/fiber" />
import React, { useMemo } from 'react';
import * as THREE from 'three';
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
    // FIX: Pass the 'side' property to the material parameters to support options like double-sided rendering.
    const params: THREE.MeshStandardMaterialParameters = {
        color: matInfo.color,
        roughness: matInfo.roughness ?? 0.5,
        metalness: matInfo.metalness ?? 0.5,
        emissive: matInfo.emissive,
        emissiveIntensity: matInfo.emissiveIntensity,
        transparent: matInfo.transparent ?? false,
        opacity: matInfo.opacity ?? 1,
        // FIX: Cast the 'side' property to THREE.Side to resolve the type mismatch.
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

const ModelMesh: React.FC<{ info: MeshInfo }> = ({ info }) => {
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
    return (
        <pointLight
            color={info.color}
            intensity={info.intensity}
            position={info.position}
            distance={info.distance}
        />
    );
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