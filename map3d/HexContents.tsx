/// <reference types="@react-three/fiber" />
import React, { useMemo, useState } from 'react';
import * as THREE from 'three';
import { PlanetType } from '../types';
import { HomeBaseModel } from './models/HomeBase';
import type { HexData } from './types';
import { axialToWorld, HEX_R } from './types';
import { PlanetWithRingModel } from './models/PlanetWithRing';
import { AsteroidFieldModel } from './models/AsteroidFieldModel';
import { BarrenModel } from './models/BarrenModel';
// FIX: Add MeshInfo to imports for explicit typing.
import type { HexModelDescription, MeshInfo } from '../../types/models';
import { ProceduralHexModel } from './ProceduralHexModel';
import { PRE_GENERATED_HEX_MODELS } from '../constants/preGeneratedHexModels';
import { BiomeType } from '../constants/biomeData';
import { BlackHoleModel } from './models/BlackHole';

// Coordinate system conversion
const axial_to_oddq = (q: number, r: number) => {
    const x = q;
    const y = r + (q - (q & 1)) / 2;
    return { x, y };
};

// New Enhanced Base Model for fallbacks and fog
const FogHexBaseModel: React.FC = () => {
    const BASE_HEIGHT = 0.8;
    const SOIL_3_HEIGHT = 0.4;
    const SOIL_2_HEIGHT = 0.2;
    const SOIL_1_HEIGHT = 0.2;

    // FIX: Add explicit MeshInfo type to prevent type inference issues.
    const SOIL_3_MESH: MeshInfo = { id: 'diorama_soil_3', geometry: { type: 'cylinder', args: [1.2, 1.3, SOIL_3_HEIGHT, 6] }, material: { type: 'standard', color: '#111827', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT/2, 0], scale: [1, 1, 1] };
    const SOIL_2_MESH: MeshInfo = { id: 'diorama_soil_2', geometry: { type: 'cylinder', args: [1.1, 1.2, SOIL_2_HEIGHT, 6] }, material: { type: 'standard', color: '#1f2937', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT/2, 0], scale: [1, 1, 1] };
    const SOIL_1_MESH: MeshInfo = { id: 'diorama_soil_1', geometry: { type: 'cylinder', args: [1.0, 1.1, SOIL_1_HEIGHT, 6] }, material: { type: 'standard', color: '#374151', roughness: 0.9 }, position: [0, SOIL_3_HEIGHT + SOIL_2_HEIGHT + SOIL_1_HEIGHT/2, 0], scale: [1, 1, 1] };
    const TOP_MESH: MeshInfo = { id: 'top', geometry: { type: 'cylinder', args: [1.0, 1.0, 0.05, 6] }, material: { type: 'standard', color: '#111827', roughness: 0.8 }, position: [0, BASE_HEIGHT, 0], scale: [1, 1, 1] };

    const desc: HexModelDescription = { meshes: [SOIL_3_MESH, SOIL_2_MESH, SOIL_1_MESH, TOP_MESH] };
    
    return <ProceduralHexModel description={desc} />;
};


const FogHexModel: React.FC = () => <FogHexBaseModel />;

const deepSpaceMaterial = new THREE.MeshStandardMaterial({ color: '#05080D', metalness: 0.3, roughness: 0.6, transparent: true, opacity: 0.5 });
const emptyGeo = new THREE.CylinderGeometry(HEX_R, HEX_R, 0.1, 6);
emptyGeo.rotateY(Math.PI / 6);
const EmptySpaceModel: React.FC = () => (
    <mesh geometry={emptyGeo} material={deepSpaceMaterial} position-y={0.05} receiveShadow />
);


const gasGiantMaterial = new THREE.MeshStandardMaterial({ color: '#c4b5fd', roughness: 0.4, metalness: 0.1 });

// Static mapping for fallback planet types not covered by procedural generation
const fallbackPlanetModels: Partial<Record<PlanetType, React.FC<any>>> = {
    [PlanetType.GasGiant]: () => <PlanetWithRingModel material={gasGiantMaterial} scale={0.8} position-y={1.1} />,
    [PlanetType.AsteroidField]: AsteroidFieldModel,
    [PlanetType.Barren]: BarrenModel,
};

const specialBiomeModels: Partial<Record<BiomeType, React.FC<any>>> = {
    [BiomeType.BlackHole]: () => <BlackHoleModel scale={0.4} position-y={0.5} />,
    [BiomeType.TimeRift]: () => <ProceduralHexModel description={PRE_GENERATED_HEX_MODELS[BiomeType.TimeRift][0]} />,
    [BiomeType.StormField]: () => <ProceduralHexModel description={PRE_GENERATED_HEX_MODELS[BiomeType.StormField][0]} />,
    [BiomeType.PrismField]: () => <ProceduralHexModel description={PRE_GENERATED_HEX_MODELS[BiomeType.PrismField][0]} />,
}


const FallbackPlanetContent: React.FC<{ hex: HexData }> = ({ hex }) => {
    const ModelComponent = fallbackPlanetModels[hex.planet.type];
    const needsBase = hex.planet.type !== PlanetType.AsteroidField;

    return (
        <>
            {needsBase && <ProceduralHexModel description={PRE_GENERATED_HEX_MODELS[BiomeType.Wasteland][0]} />}
            <group scale={2}>
                 {ModelComponent && <ModelComponent />}
            </group>
        </>
    );
};

const ProceduralPlanetContent: React.FC<{ hex: HexData }> = ({ hex }) => {
    const [modelDesc, setModelDesc] = useState<HexModelDescription | null>(null);

    React.useEffect(() => {
        if (!hex.planet.visualBiome) return;
        
        const biomeType = hex.planet.visualBiome as keyof typeof PRE_GENERATED_HEX_MODELS;
        const modelVariants = PRE_GENERATED_HEX_MODELS[biomeType] || PRE_GENERATED_HEX_MODELS[BiomeType.FertilePlain];
        
        // Simple seeded random to pick a variant consistently
        const variantIndex = Math.abs(Math.floor(hex.q * 31 + hex.r * 17)) % modelVariants.length;
        const modelData = modelVariants[variantIndex];
        
        setModelDesc(modelData);
    }, [hex]);

    if (!modelDesc) {
        return <FogHexBaseModel />; // Show base while loading description
    }

    return (
        <>
            <ProceduralHexModel description={modelDesc} />
        </>
    );
};


// --- Hex Wrapper for Interaction and Positioning ---
const HexWrapper: React.FC<{
    children: React.ReactNode,
    hex: HexData,
    onHexClick: (x: number, y: number) => void;
    setHoveredHex: (hex: {q: number, r: number} | null) => void;
    isSelected: boolean;
    isHovered: boolean;
}> = ({ children, hex, onHexClick, setHoveredHex, isSelected, isHovered }) => {
    const p = axialToWorld(hex.q, hex.r, hex.planet.elevationValue || 0);
    const position: [number, number, number] = [p.x, p.y, p.z];

    const randomRotationY = useMemo(() => {
        const seed = hex.q * 31 + hex.r * 17;
        const rand = Math.abs(Math.sin(seed) * 10000) % 6;
        return Math.floor(rand) * (Math.PI / 3);
    }, [hex.q, hex.r]);
    
    const clickHandler = (e: any) => {
        e.stopPropagation();
        if (hex.discovered) {
            const { x, y } = axial_to_oddq(hex.q, hex.r);
            onHexClick(x, y);
        }
    };
    
    const hoverHandler = (e: any) => {
        e.stopPropagation();
        document.body.style.cursor = hex.discovered ? 'pointer' : 'default';
        setHoveredHex({ q: hex.q, r: hex.r });
    };
    
    const unhoverHandler = (e: any) => {
        e.stopPropagation();
        document.body.style.cursor = 'grab';
        setHoveredHex(null);
    };

    const glowColor = isSelected ? 0xffffff : 0x22d3ee;

    return (
        <group 
            position={position} 
            scale={isHovered && hex.discovered ? 1.05 : 1}
            onClick={clickHandler}
            onPointerOver={hoverHandler}
            onPointerOut={unhoverHandler}
        >
            {(isSelected || hex.isHome) && (
                <mesh position-y={0.02} rotation-x={-Math.PI / 2}>
                    <ringGeometry args={[HEX_R * 1.05, HEX_R * 1.15, 6]} />
                    <meshBasicMaterial color={glowColor} toneMapped={false} side={THREE.DoubleSide} />
                </mesh>
            )}
            <group rotation-y={hex.isHome ? 0 : randomRotationY}>
                {children}
            </group>
        </group>
    )
}


// --- Main Contents Component ---

type Props = {
    hexData: HexData[];
    selectedCoords?: { q: number; r: number } | null;
    onHexClick: (x: number, y: number) => void;
    hoveredHex: {q: number, r: number} | null;
    setHoveredHex: (hex: {q: number, r: number} | null) => void;
};

export function HexContents({ hexData, selectedCoords, onHexClick, hoveredHex, setHoveredHex }: Props) {
    return (
        <group>
            {hexData.map(hex => {
                const key = `${hex.q}-${hex.r}`;
                const isSelected = selectedCoords?.q === hex.q && selectedCoords?.r === hex.r;
                const isHovered = hoveredHex?.q === hex.q && hoveredHex?.r === hex.r;
                const SpecialBiome = hex.planet.visualBiome ? specialBiomeModels[hex.planet.visualBiome] : null;

                let ContentComponent;
                if (!hex.discovered) {
                    ContentComponent = <FogHexModel />;
                } else if (hex.isHome) {
                    ContentComponent = <HomeBaseModel scale={0.4} position-y={0} />;
                } else if (SpecialBiome) {
                    ContentComponent = <SpecialBiome />;
                } else if (hex.planet.type === PlanetType.EmptySpace) {
                    ContentComponent = <EmptySpaceModel />;
                } else if (hex.planet.visualBiome) {
                    ContentComponent = <ProceduralPlanetContent hex={hex} />;
                } else {
                    ContentComponent = <FallbackPlanetContent hex={hex} />;
                }
                
                return (
                    <HexWrapper 
                        key={key} 
                        hex={hex} 
                        onHexClick={onHexClick} 
                        setHoveredHex={setHoveredHex}
                        isSelected={isSelected}
                        isHovered={isHovered}
                    >
                        {ContentComponent}
                    </HexWrapper>
                )
            })}
        </group>
    );
}
