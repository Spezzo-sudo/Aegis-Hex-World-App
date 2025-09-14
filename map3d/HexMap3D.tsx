/// <reference types="@react-three/fiber" />
import React, { useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { HexContents } from './HexContents';
import type { HexData } from './types';

type Props = {
    hexData: HexData[];
    selectedCoords?: { q: number; r: number } | null;
    onHexClick: (x: number, y: number) => void;
};


// Draggable plane for Google Maps-style panning
const PanController = () => {
    return (
        <OrbitControls
            enableDamping
            dampingFactor={0.05} // Smoother damping
            rotateSpeed={0.5}
            minDistance={10}     // More constrained zoom
            maxDistance={50}     // More constrained zoom
            minPolarAngle={Math.PI / 5}    // Constrain vertical angle
            maxPolarAngle={Math.PI / 2.5}  // Constrain vertical angle
            panSpeed={0.8}       // Slower panning
            screenSpacePanning={false} // More intuitive panning at angles
            // Configure mouse buttons for intuitive map navigation:
            // Left-click drag to pan (like Google Maps)
            // Right-click drag to rotate
            mouseButtons={{
                LEFT: THREE.MOUSE.PAN,
                RIGHT: THREE.MOUSE.ROTATE,
            }}
        />
    );
};


// The main 3D canvas component
export default function HexMap3D({ hexData, selectedCoords, onHexClick }: Props) {
    const [hoveredHex, setHoveredHex] = useState<{q: number; r: number} | null>(null);

    return (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 20, 25], fov: 50, far: 400 }} shadows>
            <fog attach="fog" args={['#0D1017', 50, 160]} />
            <ambientLight intensity={0.2} />
            <hemisphereLight intensity={0.3} groundColor="#0D1017" color="#ffffff" />
            <directionalLight
                position={[20, 40, 10]}
                intensity={1.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-camera-far={200}
                shadow-camera-left={-80}
                shadow-camera-right={80}
                shadow-camera-top={80}
                shadow-camera-bottom={-80}
            />
            
            <Suspense fallback={null}>
                <Environment preset="sunset" />
                <HexContents 
                    hexData={hexData} 
                    selectedCoords={selectedCoords} 
                    onHexClick={onHexClick} 
                    hoveredHex={hoveredHex}
                    setHoveredHex={setHoveredHex}
                />
            </Suspense>

            <PanController />
            
            <EffectComposer>
                <Bloom luminanceThreshold={0.9} intensity={0.3} levels={9} mipmapBlur />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </Canvas>
    );
}