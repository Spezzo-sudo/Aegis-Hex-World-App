import React, { useState, useMemo, useCallback } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { gameService } from '../services/gameService';
import { Planet } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DispatchFleetModal } from '../components/game/DispatchFleetModal';
import { MetallumIcon, KristallinIcon, SkullIcon } from '../constants/icons';
import { generatePlanetLore } from '../services/geminiService';
import HexMap3D from '../map3d/HexMap3D';
import type { HexData } from '../map3d/HexMap3D';

// Helper function to convert from the game's offset coordinates to axial coordinates for the 3D map
const oddq_to_axial = (x: number, y: number) => {
    const q = x;
    const r = y - (x - (x & 1)) / 2;
    return { q, r };
};

const PlanetInfo: React.FC<{ planet: Planet, coords: {x: number, y: number} }> = ({ planet, coords }) => {
    const [lore, setLore] = useState('');
    const [isLoadingLore, setIsLoadingLore] = useState(false);
    
    // Reset lore when planet changes
    React.useEffect(() => {
        setLore('');
    }, [planet, coords]);

    const bonus = planet.biome ? `${planet.biome.deltaPct > 0 ? '+' : ''}${planet.biome.deltaPct}% ${planet.biome.resource}` : undefined;

    const handleGenerateLore = async () => {
        setIsLoadingLore(true);
        const generatedLore = await generatePlanetLore(planet.type, bonus);
        setLore(generatedLore);
        setIsLoadingLore(false);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-xl font-bold text-textHi">{planet.type} Planet [{coords.x}:{coords.y}]</h3>
            <p className="text-sm text-textMuted">Elevation: <span className="capitalize text-textHi">{planet.elevation}</span></p>
            {planet.biome && (
                <p className={`text-sm ${planet.biome.deltaPct > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Biome: {bonus}
                </p>
            )}
            {planet.npc && (
                 <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <h4 className="font-semibold text-red-400 flex items-center"><SkullIcon className="w-5 h-5 mr-2" />Hostile Presence Detected</h4>
                    <div className="text-xs text-textMuted mt-1">
                        <p>Pirate forces guarding resources.</p>
                        <div className="flex items-center space-x-4 mt-2">
                             {planet.npc.resources.Metallum && <div className="flex items-center"><MetallumIcon className="w-4 h-4 mr-1"/>{planet.npc.resources.Metallum}</div>}
                             {planet.npc.resources.Kristallin && <div className="flex items-center"><KristallinIcon className="w-4 h-4 mr-1"/>{planet.npc.resources.Kristallin}</div>}
                        </div>
                    </div>
                 </div>
            )}
            
            <div className="mt-2">
                {!lore && (
                    <button onClick={handleGenerateLore} disabled={isLoadingLore} className="text-xs text-secondary hover:text-primary transition disabled:opacity-50">
                        {isLoadingLore ? 'Scanning...' : 'Scan for Details'}
                    </button>
                )}
                {lore && (
                    <div className="mt-2 p-2 bg-bg/50 rounded-md border border-grid text-xs text-textMuted italic">
                        {lore}
                    </div>
                )}
            </div>
        </div>
    );
};

const MapView: React.FC = () => {
    const { colony } = usePlayerStore();
    const [selectedHex, setSelectedHex] = useState<{ x: number; y: number } | null>(null);
    const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

    const mapData = useMemo(() => gameService.getMapData(), []);
    
    const handleHexClick = useCallback((x: number, y: number) => {
        setSelectedHex({ x, y });
    }, []);

    const { hexData, selectedCoords } = useMemo(() => {
        if (!colony) return { hexData: [], selectedCoords: null };

        const data: HexData[] = Object.entries(mapData).map(([key, planet]) => {
            const [x, y] = key.split(':').map(Number);
            const { q, r } = oddq_to_axial(x, y);
            const isVisible = !!colony.mapVisibility[key];
            const isHome = x === colony.coordinates.x && y === colony.coordinates.y;

            return {
                q,
                r,
                planet,
                discovered: isVisible,
                isHome,
            };
        });

        const selCoords = selectedHex ? oddq_to_axial(selectedHex.x, selectedHex.y) : null;

        return { hexData: data, selectedCoords: selCoords };
    }, [mapData, colony, selectedHex]);

    if (!colony) return null;
  
    const selectedPlanet = selectedHex ? mapData[`${selectedHex.x}:${selectedHex.y}`] : null;

    return (
        <div className="h-full flex flex-col md:flex-row gap-4 animate-fade-in">
            {selectedHex && (
                <DispatchFleetModal 
                    isOpen={isDispatchModalOpen}
                    onClose={() => setIsDispatchModalOpen(false)}
                    target={selectedHex}
                />
            )}

            <div className="flex-1 rounded-xl overflow-hidden bg-surface border border-grid relative shadow-lg shadow-black/20 cursor-grab active:cursor-grabbing">
                 <HexMap3D 
                    hexData={hexData} 
                    selectedCoords={selectedCoords}
                    onHexClick={handleHexClick}
                 />
            </div>

            <div className="w-full md:w-80 lg:w-96 shrink-0">
                <Card title="Sector Details" className="h-full">
                    {selectedPlanet && selectedHex ? (
                        <div className="flex flex-col h-full">
                            <div className="flex-grow">
                                <PlanetInfo planet={selectedPlanet} coords={selectedHex}/>
                            </div>
                            <div className="mt-4 pt-4 border-t border-grid">
                                <Button className="w-full" onClick={() => setIsDispatchModalOpen(true)}>Dispatch Fleet</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-textMuted/50">
                            <p>Interact with the map to view sector details.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MapView;