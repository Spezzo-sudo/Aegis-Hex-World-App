import React, { useState } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { UnitType, Resource } from '../types';
import { UNIT_DATA } from '../constants/gameData';
import { calculateCost, calculateBuildTime, gameService } from '../services/gameService';
import { ProgressBar } from '../components/ui/ProgressBar';
import { MetallumIcon, KristallinIcon, ClockIcon, ShipyardIcon } from '../constants/icons';

const formatTime = (seconds: number) => {
    if (seconds <= 0) return '0s';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.round(seconds % 60);
    return [h > 0 ? `${h}h` : '', m > 0 ? `${m}m` : '', s > 0 ? `${s}s` : '']
        .filter(Boolean)
        .join(' ');
};

const UnitCard: React.FC<{ type: UnitType }> = ({ type }) => {
  const { colony } = usePlayerStore();
  const [isBuilding, setIsBuilding] = useState(false);
  const [amount, setAmount] = useState(1);

  const data = UNIT_DATA[type];
  if (!data) return null;

  const currentAmount = colony?.units?.[type] || 0;
  const cost = calculateCost(type, amount);
  const time = calculateBuildTime(type, amount, cost);

  const canAfford = colony && Object.entries(cost).every(([res, amount]) => 
      colony.resources[res as Resource] >= (amount || 0)
  );
  
  const handleBuild = async () => {
    setIsBuilding(true);
    await gameService.startConstruction(type, amount);
    setIsBuilding(false);
    setAmount(1);
  };
  
  return (
    <Card className="flex flex-col">
        <div className="flex-grow">
            <div className="flex justify-between items-baseline">
                <h4 className="text-lg font-semibold text-textHi">{data.name}</h4>
                <p className="text-sm text-textMuted tabular-nums">Owned: {currentAmount}</p>
            </div>
            <p className="text-textMuted text-xs mt-1 h-10">{data.description}</p>
            
            <div className="mt-4 border-t border-grid pt-3">
                 <div className="flex items-center space-x-2">
                    <label htmlFor={`amount-${type}`} className="text-sm text-textMuted">Amount:</label>
                    <input 
                        type="number"
                        id={`amount-${type}`}
                        value={amount}
                        min="1"
                        onChange={(e) => setAmount(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-20 bg-bg border border-grid rounded-md p-1 text-center tabular-nums"
                    />
                </div>
                <div className="mt-2 space-y-1 text-textMuted text-sm">
                    <div className="flex items-center justify-between"><div className="flex items-center"><MetallumIcon className="w-4 h-4 mr-2 text-textMuted/50" /> Metallum:</div> <span className="tabular-nums">{cost.Metallum || 0}</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center"><KristallinIcon className="w-4 h-4 mr-2 text-secondary/50" /> Kristallin:</div> <span className="tabular-nums">{cost.Kristallin || 0}</span></div>
                    <div className="flex items-center justify-between"><div className="flex items-center"><ClockIcon className="w-4 h-4 mr-2 text-yellow-500/50" /> Time:</div> <span className="tabular-nums">{formatTime(time)}</span></div>
                </div>
            </div>
        </div>
      
        <div className="mt-4 pt-4 border-t border-grid">
            <Button 
                onClick={handleBuild} 
                disabled={!canAfford || isBuilding || (colony?.shipyardQueue.length || 0) > 4} 
                isLoading={isBuilding}
                className="w-full"
                size="md"
            >
                <ShipyardIcon className="w-5 h-5 mr-1" />
                Build {amount}
            </Button>
        </div>
    </Card>
  );
};

const ShipyardQueue: React.FC = () => {
    const { colony } = usePlayerStore();
    
    if (!colony || colony.shipyardQueue.length === 0) {
        return (
             <Card title="Shipyard Queue">
                <div className="flex flex-col items-center justify-center h-24 text-textMuted/50">
                    <ClockIcon className="w-8 h-8 mb-2" />
                    <span>Queue is empty</span>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Shipyard Queue">
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {colony.shipyardQueue.map(item => (
                    <div className="bg-bg/50 p-3 rounded-lg border border-grid" key={item.id}>
                        <span className="font-semibold text-textHi">{item.levelOrAmount}x {item.type}</span>
                        <ProgressBar startTime={item.startTime} endTime={item.endTime} />
                    </div>
                ))}
            </div>
        </Card>
    );
};


const ShipyardView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Shipyard Control</h2>
        <p className="text-textMuted/80">Construct your fleet to project power across the sectors.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.values(UnitType).filter(type => UNIT_DATA[type]).map(type => (
                    <UnitCard key={type} type={type} />
                ))}
            </div>
        </div>
        <div className="lg:col-span-1">
            <ShipyardQueue />
        </div>
      </div>
    </div>
  );
};

export default ShipyardView;