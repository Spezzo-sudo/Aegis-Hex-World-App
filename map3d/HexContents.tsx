/// <reference types="@react-three/fiber" />
import React, { useMemo } from 'react';
import * as THREE from 'three';
import { PlanetType } from '../types';
import { HomeBaseModel } from './models/HomeBase';
import type { HexData } from './types';
import { axialToWorld, HEX_R } from './types';
import { PlanetWithRingModel } from './models/PlanetWithRing';
import { AsteroidFieldModel } from './models/AsteroidFieldModel';
import { BarrenModel } from './models/BarrenModel';
import type { HexModelDescription } from '../types/models';
import { ProceduralHexModel } from './ProceduralHexModel';
import { PRE_GENERATED_HEX_MODELS } from '../constants/preGeneratedHexModels';
import { BiomeType } from '../constants/biomeData';

// Coordinate system conversion
const axial_to_oddq = (q: number, r: number) => {
    const x = q;
    const y = r + (q - (q & 1)) / 2;
    return { x, y };
};


// --- UNIFIED BASE MODEL ---
// A thin hex tile with a border, for a flatter map design.
const baseGeo = new THREE.CylinderGeometry(HEX_R, HEX_R, 0.2, 6);
baseGeo.rotateY(Math.PI / 6);
const baseMaterial = new THREE.MeshStandardMaterial({ color: '#334155', metalness: 0.2, roughness: 0.7 });
const borderGeo = new THREE.EdgesGeometry(baseGeo);
const borderMaterial = new THREE.LineBasicMaterial({ color: '#475569' });

const HexBaseModel: React.FC = () => (
    <group position-y={0.1}>
        <mesh geometry={baseGeo} material={baseMaterial} receiveShadow />
        <lineSegments geometry={borderGeo} material={borderMaterial} />
    </group>
);

const FogHexModel: React.FC = () => (
    <mesh position-y={0.1} receiveShadow>
        <cylinderGeometry args={[HEX_R, HEX_R, 0.2, 6]} />
        <meshStandardMaterial color="#0D1017" roughness={0.9} metalness={0.1} />
    </mesh>
);

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


const FallbackPlanetContent: React.FC<{ hex: HexData }> = ({ hex }) => {
    const ModelComponent = fallbackPlanetModels[hex.planet.type];
    const needsBase = hex.planet.type !== PlanetType.AsteroidField;

    return (
        <>
            {needsBase && <HexBaseModel />}
            <group scale={2}>
                 {ModelComponent && <ModelComponent />}
            </group>
        </>
    );
};

const ProceduralPlanetContent: React.FC<{ hex: HexData }> = ({ hex }) => {
    const [modelDesc, setModelDesc] = React.useState<HexModelDescription | null>(null);

    React.useEffect(() => {
        if (!hex.planet.visualBiome) return;
        
        // Use the pre-generated model from the static data file.
        // This completely avoids runtime API calls for map visuals.
        const biomeType = hex.planet.visualBiome as keyof typeof PRE_GENERATED_HEX_MODELS;
        const modelData = PRE_GENERATED_HEX_MODELS[biomeType] || PRE_GENERATED_HEX_MODELS[BiomeType.FertilePlain]; // Fallback to a default
        
        setModelDesc(modelData);
    }, [hex]);

    if (!modelDesc) {
        return <HexBaseModel />; // Show base while loading description (should be instant)
    }

    return (
        <>
            {/* The base model is now included within the procedural description for more control */}
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
    const p = axialToWorld(hex.q, hex.r, 0); // Flatten the map by ignoring elevationValue
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

                let ContentComponent;
                if (!hex.discovered) {
                    ContentComponent = <FogHexModel />;
                } else if (hex.isHome) {
                    ContentComponent = <HomeBaseModel scale={0.4} position-y={0} />;
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