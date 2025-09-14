import React, { useState, useMemo, useCallback } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { gameService } from '../services/gameService';
import { Planet, PlanetType } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { DispatchFleetModal } from '../components/game/DispatchFleetModal';
import { FerrolytIcon, LuminisIcon, SkullIcon, ChevronUpIcon } from '../constants/icons';
import { agentService } from '../services/agentService';
import HexMap3D from '../map3d/HexMap3D';
import type { HexData } from '../map3d/types';
import { useContentCacheStore } from '../types/useContentCacheStore';

// Helper function to convert from the game's offset coordinates to axial coordinates for the 3D map
const oddq_to_axial = (x: number, y: number) => {
    const q = x;
    const r = y - (x - (x & 1)) / 2;
    return { q, r };
};

const PlanetInfo: React.FC<{ planet: Planet, coords: {x: number, y: number} }> = ({ planet, coords }) => {
    if (planet.type === PlanetType.EmptySpace) {
        return (
            <div className="space-y-3">
                <h3 className="text-xl font-bold text-textHi">Uncharted Space [{coords.x}:{coords.y}]</h3>
                <p className="text-sm text-textMuted italic">
                    The void between worlds. Sensors detect nothing of interest, but this sector can be explored to update navigational charts.
                </p>
            </div>
        );
    }
    
    const bonus = planet.biome?.resource ? `${(planet.biome.deltaPct || 0) > 0 ? '+' : ''}${planet.biome.deltaPct}% ${planet.biome.resource}` : undefined;
    const cacheKey = `${planet.type}:${bonus || 'none'}`;
    
    const { getPlanetLore, setPlanetLore } = useContentCacheStore();

    const [lore, setLore] = useState(() => getPlanetLore(cacheKey) || '');
    const [isLoadingLore, setIsLoadingLore] = useState(false);
    
    // Reset lore when planet changes, checking cache first
    React.useEffect(() => {
        setLore(getPlanetLore(cacheKey) || '');
    }, [planet, coords, cacheKey, getPlanetLore]);

    const handleGenerateLore = async () => {
        const cachedLore = getPlanetLore(cacheKey);
        if (cachedLore) {
            setLore(cachedLore);
            return;
        }

        setIsLoadingLore(true);
        const generatedLore = await agentService.lore.generatePlanetLore(planet.type, bonus);
        setLore(generatedLore);
        setPlanetLore(cacheKey, generatedLore);
        setIsLoadingLore(false);
    };

    return (
        <div className="space-y-3">
            <h3 className="text-xl font-bold text-textHi">{planet.type} Planet [{coords.x}:{coords.y}]</h3>
            <p className="text-sm text-textMuted">Elevation: <span className="capitalize text-textHi">{planet.elevation}</span></p>
            {planet.biome?.resource && (
                <p className={`text-sm ${(planet.biome.deltaPct || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Resource Bonus: {bonus}
                </p>
            )}
            {planet.npc && (
                 <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <h4 className="font-semibold text-red-400 flex items-center"><SkullIcon className="w-5 h-5 mr-2" />Feindliche Präsenz entdeckt</h4>
                    <div className="text-xs text-textMuted mt-1">
                        <p>Piratenkräfte bewachen Ressourcen.</p>
                        <div className="flex items-center space-x-4 mt-2">
                             {planet.npc.resources.Ferrolyt && <div className="flex items-center"><FerrolytIcon className="w-4 h-4 mr-1"/>{planet.npc.resources.Ferrolyt}</div>}
                             {planet.npc.resources.Luminis && <div className="flex items-center"><LuminisIcon className="w-4 h-4 mr-1"/>{planet.npc.resources.Luminis}</div>}
                        </div>
                    </div>
                 </div>
            )}
            
            <div className="mt-2">
                {!lore && (
                    <button onClick={handleGenerateLore} disabled={isLoadingLore} className="text-xs text-secondary hover:text-primary transition disabled:opacity-50">
                        {isLoadingLore ? 'Scrying...' : 'Scry for Details'}
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
    const [isPanelCollapsed, setIsPanelCollapsed] = useState(true);

    const mapData = useMemo(() => gameService.getMapData(), []);
    
    const handleHexClick = useCallback((x: number, y: number) => {
        setSelectedHex({ x, y });
        setIsPanelCollapsed(false); // Open panel on selection
    }, []);
    
    const togglePanel = () => setIsPanelCollapsed(prev => !prev);

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
        <div className="h-full w-full relative animate-fade-in">
            {selectedHex && (
                <DispatchFleetModal 
                    isOpen={isDispatchModalOpen}
                    onClose={() => setIsDispatchModalOpen(false)}
                    target={selectedHex}
                />
            )}

            <div className="absolute inset-0 rounded-xl overflow-hidden bg-surface border border-grid shadow-lg shadow-black/20 cursor-grab active:cursor-grabbing">
                 <HexMap3D 
                    hexData={hexData} 
                    selectedCoords={selectedCoords}
                    onHexClick={handleHexClick}
                 />
            </div>

            <div className={`absolute bottom-0 left-0 right-0 z-10 p-2 transition-transform duration-300 ease-in-out ${isPanelCollapsed && selectedHex ? 'translate-y-[calc(100%-60px)]' : 'translate-y-0'}`}>
                <Card titleClassName="cursor-pointer" contentClassName={isPanelCollapsed ? '!p-0 h-0 overflow-hidden' : ''} className="backdrop-blur-sm bg-surface/80">
                   <div onClick={togglePanel} className="flex items-center justify-between p-4 cursor-pointer">
                        <h3 className="text-base font-semibold text-textHi tracking-wide">Sektor Details</h3>
                        <ChevronUpIcon className={`w-6 h-6 text-textMuted transition-transform ${isPanelCollapsed ? 'rotate-180' : ''}`} />
                   </div>
                    {selectedPlanet && selectedHex ? (
                        <div className="flex flex-col h-full p-4 pt-0">
                            <div className="flex-grow">
                                <PlanetInfo planet={selectedPlanet} coords={selectedHex}/>
                            </div>
                            <div className="mt-4 pt-4 border-t border-grid">
                                <Button className="w-full" onClick={() => setIsDispatchModalOpen(true)}>Flotte entsenden</Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full text-textMuted/50 p-4">
                            <p>Interagiere mit der Karte, um Sektor-Details anzuzeigen.</p>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default MapView;