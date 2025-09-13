import React from 'react';
import { Modal } from '../ui/Modal';
import { CombatReport, UnitType, DefenseType, Resource } from '../../types';
import { ALL_ITEM_DATA } from '../../constants/gameData';
import { MetallumIcon, KristallinIcon, PlasmaCoreIcon } from '../../constants/icons';

const FleetDetails: React.FC<{
    participant: CombatReport['attacker'];
}> = ({ participant }) => (
    <div className="p-3 bg-bg/50 rounded-lg border border-grid">
        <h4 className="text-lg font-semibold text-primary mb-2">{participant.name}</h4>
        <div className="space-y-1 text-sm max-h-48 overflow-y-auto pr-2">
            {Object.keys(participant.fleet).length > 0 ? Object.entries(participant.fleet).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                    <span className="text-textMuted">{ALL_ITEM_DATA[type as keyof typeof ALL_ITEM_DATA]?.name}</span>
                    <div className="flex items-center space-x-2 tabular-nums">
                        <span>{count}</span>
                        {participant.losses[type as keyof typeof participant.losses]! > 0 && <span className="text-red-400">(-{participant.losses[type as keyof typeof participant.losses]})</span>}
                    </div>
                </div>
            )) : <p className="text-textMuted/50 italic">No units present.</p>}
        </div>
        <div className="mt-3 pt-3 border-t border-grid text-sm">
             <div className="flex justify-between font-semibold">
                <span>Total Losses Value:</span>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center"><MetallumIcon className="w-4 h-4 mr-1 text-textMuted/70" /> {Math.floor(participant.lossesValue.metallum)}</div>
                    <div className="flex items-center"><KristallinIcon className="w-4 h-4 mr-1 text-secondary/70" /> {Math.floor(participant.lossesValue.kristallin)}</div>
                </div>
            </div>
        </div>
    </div>
);

export const CombatReportModal: React.FC<{ report: CombatReport | null; onClose: () => void }> = ({ report, onClose }) => {
    if (!report) return null;

    const winnerText = report.winner === 'draw' ? 'The battle was a draw.' : `${report[report.winner].name} is victorious.`;
    const winnerColor = report.winner === 'attacker' ? 'text-primary' : 'text-yellow-400';

    return (
        <Modal isOpen={!!report} onClose={onClose} title={`Combat Report: [${report.coordinates.x}:${report.coordinates.y}]`}>
            <div className="space-y-4">
                <div className="text-center p-4 bg-surface rounded-lg">
                    <h3 className={`text-2xl font-bold ${winnerColor}`}>{winnerText}</h3>
                    <p className="text-textMuted text-sm">
                        {new Date(report.timestamp).toLocaleString()}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FleetDetails participant={report.attacker} />
                    <FleetDetails participant={report.defender} />
                </div>
                
                 <div className="p-3 bg-bg/50 rounded-lg border border-grid">
                    <h4 className="text-base font-semibold text-textHi">Battle Aftermath</h4>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-textMuted">A salvageable debris field was created:</p>
                            <div className="flex items-center space-x-4 font-semibold tabular-nums text-sm mt-1">
                                <div className="flex items-center"><MetallumIcon className="w-4 h-4 mr-1 text-textMuted/70" /> {Math.floor(report.debris.metallum)}</div>
                                <div className="flex items-center"><KristallinIcon className="w-4 h-4 mr-1 text-secondary/70" /> {Math.floor(report.debris.kristallin)}</div>
                            </div>
                        </div>
                        {report.plunder && Object.keys(report.plunder).length > 0 && (
                             <div>
                                <p className="text-sm text-textMuted">The attacker plundered resources:</p>
                                <div className="flex items-center space-x-4 font-semibold tabular-nums text-sm mt-1">
                                    {report.plunder.Metallum && <div className="flex items-center text-primary"><MetallumIcon className="w-4 h-4 mr-1" /> {Math.floor(report.plunder.Metallum)}</div>}
                                    {report.plunder.Kristallin && <div className="flex items-center text-primary"><KristallinIcon className="w-4 h-4 mr-1" /> {Math.floor(report.plunder.Kristallin)}</div>}
                                    {report.plunder.PlasmaCore && <div className="flex items-center text-primary"><PlasmaCoreIcon className="w-4 h-4 mr-1" /> {Math.floor(report.plunder.PlasmaCore)}</div>}
                                </div>
                            </div>
                        )}
                    </div>
                 </div>
            </div>
        </Modal>
    );
};