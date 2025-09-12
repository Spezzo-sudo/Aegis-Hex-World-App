import React, { useState } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { BuildingType, Resource } from '../types';
import { BUILDING_DATA } from '../constants/gameData';
import { calculateCost, calculateBuildTime, gameService } from '../services/gameService';
import { BuildingQueue } from '../components/layout/game/BuildingQueue';
import { MetallumIcon, KristallinIcon, PlasmaCoreIcon, ClockIcon, ChevronUpIcon } from '../constants/icons';

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
  
  const building = colony?.buildings[type];
  const data = BUILDING_DATA[type];
  const currentLevel = building?.level || 0;
  const targetLevel = currentLevel + 1;
  const cost = calculateCost(type, targetLevel);
  const time = calculateBuildTime(type, targetLevel, cost);

  const canAfford = colony && Object.entries(cost).every(([res, amount]) => 
      colony.resources[res as Resource] >= (amount || 0)
  );

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    await gameService.startConstruction(type);
    setIsUpgrading(false);
  };

  return (
    <Card className="flex flex-col">
        <div className="flex-grow">
            <div className="flex justify-between items-baseline">
                 <h4 className="text-lg font-semibold text-textHi">{data.name}</h4>
                 <p className="text-sm text-textMuted tabular-nums">Level {currentLevel}</p>
            </div>
            <p className="text-textMuted text-xs mt-1 h-10">{data.description}</p>
            
            <details className="mt-4 text-sm group cursor-pointer">
                <summary className="text-xs text-textMuted group-hover:text-textHi list-none">
                    <div className="flex items-center justify-between">
                        <span>Upgrade to Level {targetLevel}</span>
                        <ChevronUpIcon className="w-4 h-4 transition-transform duration-200 group-open:rotate-180" />
                    </div>
                </summary>
                <div className="mt-2 border-t border-grid pt-2 space-y-1 text-textMuted">
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
                disabled={!canAfford || isUpgrading || (colony?.buildingQueue.length || 0) > 0} 
                isLoading={isUpgrading}
                className="w-full"
                size="md"
            >
                <ChevronUpIcon className="w-5 h-5 mr-1" />
                Upgrade
            </Button>
        </div>
    </Card>
  );
};


const BaseView: React.FC = () => {
  const { colony } = usePlayerStore();

  if (!colony) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Base Command</h2>
        <p className="text-textMuted/80">Colony Overview & Management</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Object.values(BuildingType).map(type => (
                <BuildingCard key={type} type={type} />
            ))}
            </div>
        </div>
        <div className="lg:col-span-1">
            <BuildingQueue />
        </div>
      </div>
    </div>
  );
};

export default BaseView;