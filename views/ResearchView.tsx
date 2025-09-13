
import React, { useState } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ResearchType, Resource } from '../types';
import { RESEARCH_DATA } from '../constants/gameData';
import { calculateCost, calculateBuildTime, gameService } from '../services/gameService';
import { ProgressBar } from '../components/ui/ProgressBar';
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

const ResearchCard: React.FC<{ type: ResearchType }> = ({ type }) => {
  const { colony } = usePlayerStore();
  const [isResearching, setIsResearching] = useState(false);
  
  const data = RESEARCH_DATA[type];
  const currentLevel = colony?.research[type] || 0;
  const targetLevel = currentLevel + 1;
  const cost = calculateCost(type, targetLevel);
  const time = calculateBuildTime(type, targetLevel, cost);

  const canAfford = colony && Object.entries(cost).every(([res, amount]) => 
      colony.resources[res as Resource] >= (amount || 0)
  );

  const handleResearch = async () => {
    setIsResearching(true);
    await gameService.startConstruction(type);
    setIsResearching(false);
  };

  return (
    <Card className="flex flex-col">
        <div className="flex-grow">
            <div className="flex justify-between items-baseline">
                <h4 className="text-lg font-semibold text-textHi">{data.name}</h4>
                <p className="text-sm text-textMuted tabular-nums">Level {currentLevel}</p>
            </div>
            <p className="text-textMuted text-xs mt-1 h-12">{data.description}</p>
            
            {data.special && (
                <div className="mt-3 pt-3 border-t border-grid/50">
                    <h5 className="text-xs font-semibold text-primary uppercase tracking-wider">Effect</h5>
                    <p className="text-xs text-textMuted italic mt-1">{data.special}</p>
                </div>
            )}

            <details className="mt-4 text-sm group cursor-pointer">
                <summary className="text-xs text-textMuted group-hover:text-textHi list-none">
                    <div className="flex items-center justify-between">
                        <span>Research Level {targetLevel}</span>
                         <ChevronUpIcon className="w-4 h-4 group-open:rotate-180" />
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
                onClick={handleResearch} 
                disabled={!canAfford || isResearching || (colony?.researchQueue.length || 0) > 0} 
                isLoading={isResearching}
                className="w-full"
                size="md"
            >
                <ChevronUpIcon className="w-5 h-5 mr-1" />
                Research
            </Button>
        </div>
    </Card>
  );
};

const ResearchQueue: React.FC = () => {
    const { colony } = usePlayerStore();
    const item = colony?.researchQueue[0];

    if (!item) return null;

    return (
        <Card title="Active Research">
            <div className="bg-bg/50 p-3 rounded-lg border border-grid">
                <span className="font-semibold text-textHi">{item.type} (Lvl {item.levelOrAmount})</span>
                <ProgressBar startTime={item.startTime} endTime={item.endTime} />
            </div>
        </Card>
    );
};

const ResearchView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Research Archives</h2>
        <p className="text-textMuted/80">Unlock new technologies to gain an advantage.</p>
      </div>

      <ResearchQueue />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {Object.values(ResearchType).map(type => (
            <ResearchCard key={type} type={type as ResearchType} />
        ))}
      </div>
    </div>
  );
};

export default ResearchView;