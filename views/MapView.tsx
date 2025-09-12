import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { generatePlanetLore } from '../services/geminiService';
import { gameService } from '../services/gameService';
import { HexTileData, UnitType } from '../types';
import { usePlayerStore } from '../types/usePlayerStore';
import { AttackIcon, EnergieIcon } from '../constants/icons';

// --- Hex Grid 2.5D Logic ---
const HEX_SIZE = 60;
const HEX_HEIGHT = 5; // The "thickness" of the prism

// Define shades for lighting effect (top-left light source)
const topFaceFill = "hsl(220, 33%, 12%)";
const sideFaceFillDark = "hsl(220, 33%, 8%)";
const sideFaceFillLight = "hsl(220, 33%, 10%)";
const gridStroke = "#1B2A3E";

const ownerColorMap: { [key: string]: string } = {
    'You': '#2CE2C7', // primary
    'Rogue Drones': '#FF7AE6', // alliance-c for hostile
};

const HexDefs: React.FC = React.memo(() => (
    <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
        <pattern id="fog-noise" patternUnits="userSpaceOnUse" width="100" height="100">
            <rect width="100" height="100" fill="rgba(7, 14, 24, 0.85)" />
            <circle cx="20" cy="30" r="0.5" fill="white" opacity="0.1"/>
            <circle cx="80" cy="70" r="0.4" fill="white" opacity="0.15"/>
            <circle cx="50" cy="90" r="0.6" fill="white" opacity="0.1"/>
            <circle cx="10" cy="80" r="0.5" fill="white" opacity="0.15"/>
            <circle cx="90" cy="10" r="0.5" fill="white" opacity="0.1"/>
            <circle cx="50" cy="10" r="0.5" fill="white" opacity="0.15"/>
            <circle cx="25" cy="75" r="0.4" fill="white" opacity="0.1"/>
            <circle cx="75" cy="50" r="0.6" fill="white" opacity="0.15"/>
        </pattern>
        {/* Glyphs */}
        <symbol id="glyph-metallum" viewBox="-20 -20 40 40">
            <path d="M-15 -6 H 15 M-18 0 H 18 M-15 6 H 15" strokeWidth="2.5" className="stroke-textMuted/50" fill="none" />
        </symbol>
        <symbol id="glyph-kristallin" viewBox="-20 -20 40 40">
            <path d="M0 -12 L-10 0 L0 3 L10 0 Z M-10 0 L-8 10 L0 3 Z M10 0 L8 10 L0 3 Z" strokeWidth="2" className="stroke-secondary/60" fill="rgba(122, 162, 255, 0.1)" />
        </symbol>
        <symbol id="glyph-plasma" viewBox="-20 -20 40 40">
            <path d="M 0,0 a 10,10 0 1,0 1.5, -3 a 5,5 0 1,1 -1,-2" strokeWidth="2.5" className="stroke-alliance-c/70" fill="none" />
        </symbol>
        <symbol id="glyph-neutral" viewBox="-20 -20 40 40">
            <circle cx="0" cy="0" r="3" className="fill-textMuted/50" />
        </symbol>
        {/* Alliance Patterns */}
        <pattern id="pattern-alliance-b" patternUnits="userSpaceOnUse" width="8" height="8">
            <circle cx="4" cy="4" r="1.5" className="fill-secondary" />
        </pattern>
    </defs>
));

const Hex: React.FC<{ tile: HexTileData; onClick: () => void; isSelected: boolean; zoomLevel: number; }> = React.memo(({ tile, onClick, isSelected, zoomLevel }) => {
  const { q, r } = tile;
  const x = HEX_SIZE * 1.5 * q;
  const y = HEX_SIZE * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
  const isExplored = tile.isExplored ?? false;
  
  const effectiveHexHeight = HEX_HEIGHT * Math.min(1, zoomLevel / 0.6);

  const corners = useMemo(() => Array.from({ length: 6 }).map((_, i) => {
    const angle_rad = Math.PI / 180 * (60 * i);
    return { x: x + HEX_SIZE * Math.cos(angle_rad), y: y + HEX_SIZE * Math.sin(angle_rad) };
  }), [x, y]);

  const topPoints = corners.map(c => `${c.x},${c.y}`).join(' ');
  const side1Points = `${corners[0].x},${corners[0].y} ${corners[1].x},${corners[1].y} ${corners[1].x},${corners[1].y + effectiveHexHeight} ${corners[0].x},${corners[0].y + effectiveHexHeight}`;
  const side2Points = `${corners[1].x},${corners[1].y} ${corners[2].x},${corners[2].y} ${corners[2].x},${corners[2].y + effectiveHexHeight} ${corners[1].x},${corners[1].y + effectiveHexHeight}`;
  
  const rimColor = ownerColorMap[tile.owner || ''] || 'transparent';
  const rimPattern = tile.owner === 'Alliance B' ? 'url(#pattern-alliance-b)' : rimColor;

  const glyphType = useMemo(() => {
    if (tile.bonus?.includes('Metallum')) return '#glyph-metallum';
    if (tile.bonus?.includes('Kristallin')) return '#glyph-kristallin';
    if (tile.bonus?.includes('Plasma')) return '#glyph-plasma';
    if (tile.bonus?.includes('Energy')) return 'energy';
    return '#glyph-neutral';
  }, [tile.bonus]);

  return (
    <g 
      onClick={isExplored ? onClick : undefined} 
      className={isExplored ? "cursor-pointer group relative" : "relative"}
    >
      {/* 2.5D Prism Sides */}
      <polygon points={side1Points} fill={sideFaceFillLight} stroke={gridStroke} strokeWidth="1" strokeOpacity="0.7" />
      <polygon points={side2Points} fill={sideFaceFillDark} stroke={gridStroke} strokeWidth="1" strokeOpacity="0.7" />
      
      {/* Top Face and Details */}
      {isExplored ? (
        <>
          {/* Top Face */}
          <polygon points={topPoints} fill={topFaceFill} stroke={gridStroke} strokeWidth="1" strokeOpacity="0.7" />
          <polygon points={topPoints} className="fill-transparent group-hover:fill-primary/10 transition-colors duration-200" />
          
          {/* Ownership Rim */}
           <polygon points={topPoints} fill="none" stroke={rimPattern} strokeWidth="3" filter={tile.owner ? "url(#glow)" : "none"} />

          {/* Glyph */}
          <g transform={`translate(${x}, ${y}) scale(0.8)`}>
            {glyphType === 'energy' 
              ? <EnergieIcon className="w-10 h-10 -translate-x-5 -translate-y-5 text-yellow-400/70" /> 
              : <use href={glyphType} width="40" height="40" x="-20" y="-20" />}
          </g>

          {/* Wealth Pips - visible at mid-zoom */}
          {zoomLevel > 0.5 && tile.wealth && Array.from({ length: tile.wealth }).map((_, i) => (
            <circle key={i} cx={x + (i - (tile.wealth! - 1) / 2) * 10} cy={y + HEX_SIZE * 0.75} r="2" className="fill-textMuted/70" />
          ))}

          {/* Planet Type Label - visible at close-zoom */}
          {zoomLevel > 0.9 && (
            <text x={x} y={y - HEX_SIZE * 0.65} textAnchor="middle" className="fill-textMuted/80 text-[10px] font-semibold pointer-events-none transition-opacity duration-200 uppercase tracking-widest">
                {tile.type}
            </text>
          )}
          
          {/* Selection / Hover States */}
          {isSelected && (
              <polygon points={topPoints} fill="none" className="stroke-primary" strokeWidth="2" />
          )}
          <foreignObject x={x - HEX_SIZE} y={y - HEX_SIZE} width={HEX_SIZE*2} height={HEX_SIZE*2} className="pointer-events-none">
              <div className="w-full h-full relative overflow-hidden">
                 <div className="absolute top-0 w-1/2 h-full bg-gradient-to-r from-transparent to-white/20 -skew-x-12 transition-transform duration-500 ease-in-out -translate-x-full group-hover:translate-x-[250%]" />
              </div>
          </foreignObject>
        </>
      ) : (
        <polygon points={topPoints} fill="url(#fog-noise)" stroke={gridStroke} strokeWidth="1" strokeOpacity="0.7" />
      )}
    </g>
  );
});

const PlanetInfo: React.FC<{ tile: HexTileData | null }> = ({ tile }) => {
    const [lore, setLore] = useState('');
    const [isLoadingLore, setIsLoadingLore] = useState(false);
    const [isAttacking, setIsAttacking] = useState(false);
    const { colony } = usePlayerStore();

    useEffect(() => {
        setLore(''); 
    }, [tile]);

    const handleGenerateLore = async () => {
        if (!tile) return;
        setIsLoadingLore(true);
        const generatedLore = await generatePlanetLore(tile.type, tile.bonus);
        setLore(generatedLore);
        setIsLoadingLore(false);
    };

    const handleAttack = async () => {
        if (!tile || !colony?.units) return;
        setIsAttacking(true);
        const fleet = colony.units;
        gameService.resolveCombat(fleet as Partial<{[key in UnitType]: number}>);
        setTimeout(() => setIsAttacking(false), 1000);
    };

    if (!tile) {
        return (
            <Card title="Sector Details" className="bg-surface/80 backdrop-blur-md md:h-full">
                <p className="text-textMuted">Select a hex to view details.</p>
            </Card>
        );
    }
    
    if (!tile.isExplored) {
        return (
            <Card title="Unknown Sector" className="bg-surface/80 backdrop-blur-md md:h-full">
                <p className="text-textMuted">This sector is obscured by the fog of war. Send a probe or fleet to explore it.</p>
            </Card>
        );
    }

    const canAttack = tile.owner !== 'You' && tile.isHostile;
    const totalShips = Object.values(colony?.units || {}).reduce((a, b) => a + (Number(b) || 0), 0);

    return (
        <Card title={`Hex (${tile.q}, ${tile.r})`} className="flex flex-col bg-surface/80 backdrop-blur-md md:h-full">
            <div className="flex-grow">
                <h4 className="text-xl font-bold text-textHi">{tile.type} Planet</h4>
                {tile.bonus && <p className="text-yellow-400 text-sm">{tile.bonus}</p>}
                {tile.owner && <p className="text-textMuted text-sm">Owner: <span style={{color: ownerColorMap[tile.owner] || 'inherit'}}>{tile.owner}</span></p>}
                
                <div className="mt-4">
                    <Button onClick={handleGenerateLore} isLoading={isLoadingLore} disabled={isLoadingLore} size="sm" variant="secondary">
                        Scan for Lore
                    </Button>
                    {lore && (
                        <div className="mt-4 p-3 bg-bg/50 rounded-md border border-grid">
                            <p className="text-textMuted italic text-sm">{lore}</p>
                        </div>
                    )}
                </div>
            </div>
            {canAttack && (
                 <div className="mt-4 border-t border-red-500/20 pt-4">
                     <h5 className="text-red-400 font-bold mb-2">Hostile Sector</h5>
                    <Button onClick={handleAttack} isLoading={isAttacking} disabled={isAttacking || totalShips === 0} size="md" variant="danger" className="w-full">
                        <AttackIcon className="w-5 h-5 mr-2" />
                        Attack ({totalShips} Ships)
                    </Button>
                </div>
            )}
        </Card>
    );
}

const generateMap = (radius: number): HexTileData[] => {
    const tiles: HexTileData[] = [];
    const types = ['Terran', 'Volcanic', 'Ice', 'Gas Giant', 'Asteroid Field'];
    const bonuses = {
        'Terran': ['+10% Metallum', '+5% Kristallin'],
        'Volcanic': ['+20% Metallum', '+5% Energy'],
        'Ice': ['+20% Kristallin'],
        'Gas Giant': ['+15% Plasma'],
        'Asteroid Field': ['+30% Metallum'],
    };

    for (let q = -radius; q <= radius; q++) {
        for (let r = Math.max(-radius, -q - radius); r <= Math.min(radius, -q + radius); r++) {
            const s = -q - r;
            const isHostile = Math.random() > 0.8 && (q !== 0 || r !== 0);
            const type = types[Math.floor(Math.random() * types.length)];
            tiles.push({ 
                q, r, s, type, 
                isHostile, 
                owner: isHostile ? 'Rogue Drones' : undefined,
                bonus: bonuses[type as keyof typeof bonuses][0],
                wealth: Math.floor(Math.random() * 3) + 1,
                isExplored: false,
            });
        }
    }
    const homeTile = tiles.find(t => t.q === 0 && t.r === 0);
    if(homeTile) {
        homeTile.type = 'Home';
        homeTile.owner = 'You';
        homeTile.bonus = '+10% All Production';
        homeTile.isHostile = false;
        homeTile.wealth = 3;
        
        // Explore a larger starting area
        const startRadius = 2;
        tiles.forEach(tile => {
            // Using cube coordinates distance from origin (0,0,0)
            const dist = (Math.abs(tile.q) + Math.abs(tile.r) + Math.abs(tile.s)) / 2;
            if (dist <= startRadius) {
                tile.isExplored = true;
                // Also ensure these starting tiles are not hostile for a safer start
                if (tile.q !== 0 || tile.r !== 0) {
                   tile.isHostile = false;
                   tile.owner = undefined;
                }
            }
        });
    }
    return tiles;
}

const CombatLog: React.FC = () => {
    const { colony } = usePlayerStore();
    if (!colony?.combatLog || colony.combatLog.length === 0) return null;

    return (
        <div className="absolute bottom-4 left-4 bg-surface/80 backdrop-blur-md p-3 rounded-lg border border-grid max-w-sm text-sm z-10">
            <h5 className="font-bold text-primary mb-2">Latest Combat Report</h5>
            {colony.combatLog.map((log) => (
                <div key={log.id} className="border-t border-grid pt-2 mt-2 first:mt-0 first:border-0 first:pt-0">
                    <p>vs. {log.defender}: <span className={log.result === 'win' ? 'text-green-400' : 'text-red-400'}>You {log.result}!</span></p>
                    {log.result === 'win' && typeof log.loot.Metallum === 'number' && <p className="text-xs text-textMuted">Looted {log.loot.Metallum} Metallum.</p>}
                </div>
            ))}
        </div>
    )
}

const MapView: React.FC = () => {
    const [selectedTile, setSelectedTile] = useState<HexTileData | null>(null);
    const mapData = useMemo(() => generateMap(15), []);
    const [transform, setTransform] = useState({ x: 0, y: 0, k: 0.35 });
    const [isPanning, setIsPanning] = useState(false);
    const [startPan, setStartPan] = useState({ x: 0, y: 0 });
    const svgContainerRef = useRef<HTMLDivElement>(null);
    const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
    
    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (entries[0]) {
                const { width, height } = entries[0].contentRect;
                setContainerSize({ width, height });
            }
        });

        if (svgContainerRef.current) {
            resizeObserver.observe(svgContainerRef.current);
        }

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        const homeTile = mapData.find(t => t.owner === 'You');
        if (homeTile) {
            setSelectedTile(homeTile);
        }
    }, [mapData]);

    const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
        if (e.target === e.currentTarget) {
             setIsPanning(true);
             setStartPan({ x: e.clientX / transform.k - transform.x, y: e.clientY / transform.k - transform.y });
        }
    };
    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isPanning) return;
        e.preventDefault();
        setTransform(prev => ({ ...prev, x: e.clientX / transform.k - startPan.x, y: e.clientY / transform.k - startPan.y }));
    };
    const handleMouseUp = () => setIsPanning(false);
    
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const scaleAmount = -e.deltaY * 0.001;
        const newScale = transform.k * (1 + scaleAmount);
        setTransform(prev => ({...prev, k: Math.min(Math.max(0.15, newScale), 1.5)}));
    };

    const handleTileClick = useCallback((tile: HexTileData) => {
        setSelectedTile(tile);
    }, []);

    return (
        <div className="flex flex-col md:flex-row h-full max-h-full gap-6 animate-fade-in">
            <div ref={svgContainerRef} className="flex-1 bg-transparent border border-grid rounded-xl overflow-hidden relative" style={{ cursor: isPanning ? 'grabbing' : 'grab' }}>
                 <svg 
                    className="w-full h-full" 
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <HexDefs />
                    <g transform={`scale(${transform.k}) translate(${transform.x}, ${transform.y})`}>
                        <g transform={`translate(${containerSize.width / (2*transform.k)}, ${containerSize.height / (2*transform.k)})`}>
                          {mapData.map(tile => (
                              <Hex key={`${tile.q}-${tile.r}`} tile={tile} onClick={() => handleTileClick(tile)} isSelected={selectedTile?.q === tile.q && selectedTile?.r === tile.r} zoomLevel={transform.k} />
                          ))}
                        </g>
                    </g>
                </svg>
                <CombatLog />
            </div>
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0 overflow-y-auto">
                <PlanetInfo tile={selectedTile} />
            </div>
        </div>
    );
};

export default MapView;