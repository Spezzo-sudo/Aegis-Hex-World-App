
import React from 'react';
import { usePlayerStore } from '../../types/usePlayerStore';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { ClockIcon, ChevronUpIcon, ShipyardIcon } from '../../constants/icons';
import { BuildingType, ResearchType } from '../../types';

export const DashboardActivityFeed: React.FC = () => {
    const { colony } = usePlayerStore();
    
    const buildingItem = colony?.buildingQueue[0];
    const researchItem = colony?.researchQueue[0];
    const shipyardItems = colony?.shipyardQueue || [];

    const hasActivity = buildingItem || researchItem || shipyardItems.length > 0;

    return (
        <Card title="Colony Activity Feed">
            {!hasActivity ? (
                <div className="flex flex-col items-center justify-center h-48 text-textMuted/50">
                    <ClockIcon className="w-12 h-12 mb-2" />
                    <span>All systems nominal. No active construction.</span>
                </div>
            ) : (
                <div className="space-y-4">
                    {buildingItem && (
                        <div className="bg-bg/50 p-3 rounded-lg border border-grid">
                            <div className="flex items-center text-sm mb-1">
                                <ChevronUpIcon className="w-5 h-5 mr-2 text-primary"/>
                                <span className="font-semibold text-textHi">Building: {buildingItem.type as BuildingType} (Lvl {buildingItem.levelOrAmount})</span>
                            </div>
                            <ProgressBar startTime={buildingItem.startTime} endTime={buildingItem.endTime} />
                        </div>
                    )}
                    {researchItem && (
                         <div className="bg-bg/50 p-3 rounded-lg border border-grid">
                            <div className="flex items-center text-sm mb-1">
                                <ChevronUpIcon className="w-5 h-5 mr-2 text-primary"/>
                                <span className="font-semibold text-textHi">Researching: {researchItem.type as ResearchType} (Lvl {researchItem.levelOrAmount})</span>
                            </div>
                            <ProgressBar startTime={researchItem.startTime} endTime={researchItem.endTime} />
                        </div>
                    )}
                    {shipyardItems.length > 0 && (
                        <div>
                            <h4 className="text-textHi font-semibold mb-2 flex items-center"><ShipyardIcon className="w-5 h-5 mr-2"/>Shipyard Queue</h4>
                             <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                                {shipyardItems.map(item => (
                                    <div key={item.id} className="bg-bg/50 p-3 rounded-lg border border-grid">
                                        <span className="font-semibold text-textMuted text-sm">{item.levelOrAmount}x {item.type}</span>
                                        <ProgressBar startTime={item.startTime} endTime={item.endTime} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
};
