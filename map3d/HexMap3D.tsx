/// <reference types="@react-three/fiber" />
import React, { useState, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { HexContents } from './HexContents';
import type { HexData } from './types';

type Props = {
    hexData: HexData[];
    selectedCoords?: { q: number; r: number } | null;
    homeBasePosition: THREE.Vector3 | null;
    onHexClick: (x: number, y: number) => void;
};

const CameraAndControlsManager: React.FC<{ homeBasePosition: THREE.Vector3 | null }> = ({ homeBasePosition }) => {
    const { camera, controls } = useThree();
    
    React.useEffect(() => {
        if (homeBasePosition && controls) {
            const target = homeBasePosition;
            camera.position.set(target.x, target.y + 20, target.z + 25);
            (controls as any).target.set(target.x, target.y, target.z);
            // FIX: Cast `controls` to `any` to call the `update` method, which is
            // present on the OrbitControls instance but not on its base EventDispatcher type.
            (controls as any).update();
        }
    }, [homeBasePosition, camera, controls]);

    return (
        <OrbitControls
            enableDamping
            dampingFactor={0.05}
            enableRotate={true}
            rotateSpeed={0.5}
            minDistance={5}
            maxDistance={80}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2.2}
            panSpeed={0.8}
            screenSpacePanning={false}
            mouseButtons={{
                LEFT: THREE.MOUSE.PAN,
                RIGHT: THREE.MOUSE.ROTATE,
            }}
            touches={{
                ONE: THREE.TOUCH.PAN,
                TWO: THREE.TOUCH.DOLLY_ROTATE,
            }}
        />
    );
};


// The main 3D canvas component
export default function HexMap3D({ hexData, selectedCoords, homeBasePosition, onHexClick }: Props) {
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

            <CameraAndControlsManager homeBasePosition={homeBasePosition} />
            
            <EffectComposer>
                <Bloom luminanceThreshold={0.9} intensity={0.3} levels={9} mipmapBlur />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </Canvas>
    );
}