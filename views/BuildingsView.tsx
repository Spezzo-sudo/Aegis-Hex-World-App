import React, { useState } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BuildingType, Resource } from '../types';
import { BUILDING_DATA } from '../constants/gameData';
import { calculateCost, calculateBuildTime, gameService } from '../services/gameService';
import { generateBuildingLore, generateBuildingImage } from '../services/geminiService';
import { MetallumIcon, KristallinIcon, PlasmaCoreIcon, ClockIcon, ChevronUpIcon, SparklesIcon } from '../constants/icons';

const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', s > 0 ? `${s}s` : '']
        .filter(Boolean)
        .join(' ');
};

const BuildingCard: React.FC<{ type: BuildingType }> = ({ type }) => {
  const { colony } = usePlayerStore();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [lore, setLore] = useState('');
  const [isLoadingLore, setIsLoadingLore] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  
  const building = colony?.buildings[type];
  const data = BUILDING_DATA[type];
  const currentLevel = building?.level || 0;
  const targetLevel = currentLevel + 1;
  const cost = calculateCost(type, targetLevel);
  const time = calculateBuildTime(type, targetLevel, cost);

  const canAfford = colony && Object.entries(cost).every(([res, amount]) => 
      colony.resources[res as Resource] >= (amount || 0)
  );
  
  const isBusy = colony?.buildingQueue.some(item => item.type === type);

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    await gameService.startConstruction(type);
    setIsUpgrading(false);
  };

  const handleGenerateLore = async () => {
    setIsLoadingLore(true);
    const generatedLore = await generateBuildingLore(data.name, data.description);
    setLore(generatedLore);
    setIsLoadingLore(false);
  };
  
  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    const imageUrl = await generateBuildingImage(data.name, data.description);
    if (imageUrl) {
      setGeneratedImage(imageUrl);
    }
    setIsGeneratingImage(false);
  };

  return (
    <Card className="flex flex-col !p-0 overflow-hidden">
        <div className="aspect-video bg-bg overflow-hidden relative group">
            <img src={generatedImage || data.image} alt={data.name} className="w-full h-full object-cover transition-opacity duration-500" />
            
            {isGeneratingImage && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center transition-opacity duration-300">
                    <svg className="animate-spin h-8 w-8 text-primary" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-textHi font-semibold">Generating Art...</p>
                </div>
            )}

            {!generatedImage && !isGeneratingImage && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button onClick={handleGenerateImage} isLoading={isGeneratingImage} variant="secondary">
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Generate Art
                    </Button>
                </div>
            )}
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <div className="flex-grow">
                <div className="flex justify-between items-baseline">
                    <h4 className="text-lg font-semibold text-textHi">{data.name}</h4>
                    <p className="text-sm text-textMuted tabular-nums">Level {currentLevel}</p>
                </div>
                <p className="text-textMuted text-xs mt-1 min-h-[48px]">{data.description}</p>
                
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

                <details className="mt-4 text-sm group cursor-pointer">
                    <summary className="text-sm font-semibold text-textMuted group-hover:text-textHi list-none">
                        <div className="flex items-center justify-between">
                            <span>Upgrade to Level {targetLevel}</span>
                            <ChevronUpIcon className="w-5 h-5 transition-transform duration-200 group-open:rotate-180" />
                        </div>
                    </summary>
                    <div className="mt-2 border-t border-grid pt-2 space-y-1 text-textMuted text-xs">
                        <div className="flex items-center justify-between"><div className="flex items-center"><MetallumIcon className="w-4 h-4 mr-2 text-textMuted/50" /> Metallum:</div> <span className="tabular-nums">{cost.Metallum || 0}</span></div>
                        <div className="flex items-center justify-between"><div className="flex items-center"><KristallinIcon className="w-4 h-4 mr-2 text-secondary/50" /> Kristallin:</div> <span className="tabular-nums">{cost.Kristallin || 0}</span></div>
                        <div className="flex items-center justify-between"><div className="flex items-center"><PlasmaCoreIcon className="w-4 h-4 mr-2 text-alliance-c/50" /> Plasma:</div> <span className="tabular-nums">{cost.PlasmaCore || 0}</span></div>
                        <div className="flex items-center justify-between"><div className="flex items-center"><ClockIcon className="w-4 h-4 mr-2 text-yellow-500/50" /> Time:</div> <span className="tabular-nums">{formatTime(time)}</span></div>
                    </div>
                </details>
            </div>
        
            <div className="mt-4 pt-4 border-t border-grid">
                <Button 
                    onClick={handleUpgrade} 
                    disabled={!canAfford || isUpgrading || isBusy || (colony?.buildingQueue.length || 0) > 0} 
                    isLoading={isUpgrading}
                    className="w-full"
                    size="md"
                >
                    <ChevronUpIcon className="w-5 h-5 mr-1" />
                    {isBusy ? 'In Queue' : 'Upgrade'}
                </Button>
            </div>
        </div>
    </Card>
  );
};

const BuildingsView: React.FC = () => {
    return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Colony Structures</h2>
        <p className="text-textMuted/80">Construct and upgrade buildings to expand your colony.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.values(BuildingType).map(type => (
// FIX: Cast string from Object.values to BuildingType to match component prop type.
              <BuildingCard key={type} type={type as BuildingType} />
          ))}
      </div>
    </div>
  );
};

export default BuildingsView;