import React, { useMemo, useRef, useState, useEffect, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas, useThree, extend } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { useDrag } from '@use-gesture/react';
import { Planet, PlanetType } from '../types';
import { HexContents } from './HexContents';

// Coordinate systems and constants
const HEX_R = 0.5;
const S3 = Math.sqrt(3);

export const axialToWorld = (q: number, r: number): THREE.Vector3 => {
    return new THREE.Vector3(S3 * HEX_R * (q + r / 2), 0, (HEX_R * 3 / 2) * r);
};

const axial_to_oddq = (q: number, r: number) => {
    const x = q;
    const y = r + (q - (q & 1)) / 2;
    return { x, y };
};

// Pre-create geometry for performance
const baseHexGeo = new THREE.CylinderGeometry(HEX_R, HEX_R, 1, 6);
baseHexGeo.rotateY(Math.PI / 6);

const glowGeo = new THREE.PlaneGeometry(S3 * HEX_R, 2 * HEX_R);
glowGeo.rotateX(-Math.PI / 2);
glowGeo.rotateZ(Math.PI / 6);

// Data types
export type HexData = {
    q: number;
    r: number;
    planet: Planet;
    discovered: boolean;
    isHome: boolean;
};

type Props = {
    hexData: HexData[];
    selectedCoords?: { q: number; r: number } | null;
    onHexClick: (x: number, y: number) => void;
};

// Component for the hex containers
function HexInstances({ hexData, selectedCoords, onHexClick }: Props) {
    const mesh = useRef<THREE.InstancedMesh>(null!);
    const glowMesh = useRef<THREE.InstancedMesh>(null!);
    const { raycaster, camera, size } = useThree();
    const [hovered, setHovered] = useState<number | null>(null);

    const n = hexData.length;
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const color = useMemo(() => new THREE.Color(), []);

    useEffect(() => {
        if (!mesh.current || !glowMesh.current) return;

        let glowCount = 0;
        for (let i = 0; i < n; i++) {
            const hex = hexData[i];
            const p = axialToWorld(hex.q, hex.r);
            const isSelected = selectedCoords?.q === hex.q && selectedCoords?.r === hex.r;
            const isHovered = i === hovered;
            
            const height = hex.discovered ? 0.8 : 0.05;
            dummy.position.set(p.x, height / 2, p.z);
            dummy.scale.set(1, height, 1);
            dummy.updateMatrix();
            mesh.current.setMatrixAt(i, dummy.matrix);

            // Set color for hex container
            color.set(hex.discovered ? '#1e293b' : '#11151C'); // Darker for fog
            mesh.current.setColorAt(i, color);

            // Handle glows (selection, home, hover)
            if (hex.discovered && (isSelected || hex.isHome || isHovered)) {
                dummy.scale.set(1.1, 1.1, 1.1);
                dummy.position.set(p.x, 0.01, p.z);
                dummy.updateMatrix();
                glowMesh.current.setMatrixAt(glowCount, dummy.matrix);

                if (isSelected) color.setHex(0xffffff);
                else if (hex.isHome) color.setHex(0x22d3ee);
                else if (isHovered) color.setHex(0x94a3b8);
                
                glowMesh.current.setColorAt(glowCount, color);
                glowCount++;
            }
        }
        glowMesh.current.count = glowCount;
        mesh.current.instanceMatrix.needsUpdate = true;
        mesh.current.instanceColor!.needsUpdate = true;
        glowMesh.current.instanceMatrix.needsUpdate = true;
        glowMesh.current.instanceColor!.needsUpdate = true;
    }, [hexData, hovered, selectedCoords, n]);

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            const pointer = new THREE.Vector2();
            pointer.x = (event.clientX / size.width) * 2 - 1;
            pointer.y = -(event.clientY / size.height) * 2 + 1;
            raycaster.setFromCamera(pointer, camera);
            const intersects = raycaster.intersectObject(mesh.current);
            if (intersects.length > 0 && intersects[0].instanceId !== undefined) {
                setHovered(intersects[0].instanceId);
            } else {
                setHovered(null);
            }
        };

        const handleClick = () => {
             if (hovered !== null) {
                const tile = hexData[hovered];
                if (tile.discovered) {
                    const { x, y } = axial_to_oddq(tile.q, tile.r);
                    onHexClick(x, y);
                }
            }
        }

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('click', handleClick);
        };
    }, [camera, raycaster, size, onHexClick, hexData, hovered]);

    return (
        <>
            <instancedMesh ref={mesh} args={[baseHexGeo, undefined, n]}>
                <meshStandardMaterial vertexColors metalness={0.1} roughness={0.9} transparent opacity={0.15} />
            </instancedMesh>
            <instancedMesh ref={glowMesh} args={[glowGeo, undefined, n]}>
                <meshBasicMaterial vertexColors transparent opacity={0.3} blending={THREE.AdditiveBlending} />
            </instancedMesh>
        </>
    );
}

// Draggable plane for Google Maps-style panning
const PanController = () => {
    const { camera, controls } = useThree();
    
    useDrag(
        ({ offset: [dx, dy], pinching }) => {
            if (pinching || !controls) return;
            const target = (controls as any).target as THREE.Vector3;
            const newPos = new THREE.Vector3(-dx / 100, 0, -dy / 100).add(target);
            
            camera.position.set(newPos.x, camera.position.y, newPos.z);
            target.set(newPos.x, newPos.y, newPos.z);
        },
        { eventOptions: { passive: false } }
    );
    
    return null;
};


// The main 3D canvas component
export default function HexMap3D({ hexData, selectedCoords, onHexClick }: Props) {
    return (
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 8, 10], fov: 50 }}>
            <ambientLight intensity={0.2} />
            <hemisphereLight intensity={0.2} groundColor="black" />
            <directionalLight position={[10, 20, 5]} intensity={0.5} />
            
            <Suspense fallback={null}>
                <Environment preset="night" />
                <HexInstances hexData={hexData} selectedCoords={selectedCoords} onHexClick={onHexClick} />
                <HexContents hexData={hexData} />
            </Suspense>

            <OrbitControls
                enableDamping
                dampingFactor={0.1}
                rotateSpeed={0.5}
                minDistance={5}
                maxDistance={25}
                minPolarAngle={Math.PI / 8}
                maxPolarAngle={Math.PI / 2.5}
                enablePan={false} // Disable default panning
            />
            
            <PanController />
            
            <EffectComposer>
                <Bloom luminanceThreshold={0.8} intensity={1.2} levels={8} mipmapBlur />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </Canvas>
    );
}