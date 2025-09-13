

import React from 'react';
import { usePlayerStore } from '../../types/usePlayerStore';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { ClockIcon, ChevronUpIcon, ShipyardIcon, AttackIcon, SkullIcon } from '../../constants/icons';
import { BuildingType, ResearchType, CombatReport } from '../../types';

interface DashboardActivityFeedProps {
    onReportClick: (report: CombatReport) => void;
}

const CombatReportFeedItem: React.FC<{report: CombatReport, onClick: () => void}> = ({ report, onClick }) => {
    const isWin = report.winner === 'attacker';
    const title = isWin ? `Victory at [${report.coordinates.x}:${report.coordinates.y}]` : `Defeat at [${report.coordinates.x}:${report.coordinates.y}]`;
    const color = isWin ? 'text-primary' : 'text-red-400';
    
    return (
        <button onClick={onClick} className="w-full text-left bg-bg/50 p-3 rounded-lg border border-grid hover:border-primary/50">
            <div className="flex items-center text-sm mb-1">
                <AttackIcon className={`w-5 h-5 mr-2 ${color}`}/>
                <span className={`font-semibold ${color}`}>{title}</span>
                <span className="ml-auto text-xs text-textMuted">{new Date(report.timestamp).toLocaleTimeString()}</span>
            </div>
            <p className="text-xs text-textMuted/80 pl-7">Your fleet engaged hostile forces. Click to view the full report.</p>
        </button>
    )
}

export const DashboardActivityFeed: React.FC<DashboardActivityFeedProps> = ({ onReportClick }) => {
    const { colony } = usePlayerStore();
    
    const buildingItem = colony?.buildingQueue[0];
    const researchItem = colony?.researchQueue[0];
    const shipyardItems = colony?.shipyardQueue || [];
    const combatReports = colony?.combatReports || [];

    const hasActivity = buildingItem || researchItem || shipyardItems.length > 0 || combatReports.length > 0;

    return (
        <Card title="Colony Activity Feed">
            {!hasActivity ? (
                <div className="flex flex-col items-center justify-center h-48 text-textMuted/50">
                    <ClockIcon className="w-12 h-12 mb-2" />
                    <span>All systems nominal. No active construction.</span>
                </div>
            ) : (
                <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pr-2">
                    {combatReports.length > 0 && (
                        <div>
                             <h4 className="text-textHi font-semibold mb-2 flex items-center"><SkullIcon className="w-5 h-5 mr-2"/>Recent Combat</h4>
                             <div className="space-y-2">
                                {combatReports.filter(Boolean).map(report => (
                                    <CombatReportFeedItem key={report.id} report={report} onClick={() => onReportClick(report)} />
                                ))}
                             </div>
                        </div>
                    )}
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
                             <div className="space-y-2">
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