
import React from 'react';
import { Modal } from '../ui/Modal';
import { CombatReport, UnitType, DefenseType } from '../../types';
import { ALL_ITEM_DATA } from '../../constants/gameData';
import { MetallumIcon, KristallinIcon } from '../../constants/icons';

const FleetDetails: React.FC<{
    title: string;
    fleet: CombatReport['attacker']['fleet'];
    losses: CombatReport['attacker']['losses'];
    lossesValue: CombatReport['attacker']['lossesValue'];
}> = ({ title, fleet, losses, lossesValue }) => (
    <div className="p-3 bg-bg/50 rounded-lg border border-grid">
        <h4 className="text-lg font-semibold text-primary mb-2">{title}</h4>
        <div className="space-y-1 text-sm max-h-48 overflow-y-auto pr-2">
            {Object.keys(fleet).length > 0 ? Object.entries(fleet).map(([type, count]) => (
                <div key={type} className="flex justify-between items-center">
                    <span className="text-textMuted">{ALL_ITEM_DATA[type as keyof typeof ALL_ITEM_DATA]?.name}</span>
                    <div className="flex items-center space-x-2 tabular-nums">
                        <span>{count}</span>
                        {losses[type as keyof typeof losses]! > 0 && <span className="text-red-400">(-{losses[type as keyof typeof losses]})</span>}
                    </div>
                </div>
            )) : <p className="text-textMuted/50 italic">No units present.</p>}
        </div>
        <div className="mt-3 pt-3 border-t border-grid text-sm">
             <div className="flex justify-between font-semibold">
                <span>Total Losses Value:</span>
                <div className="flex items-center space-x-2">
                    <div className="flex items-center"><MetallumIcon className="w-4 h-4 mr-1 text-textMuted/70" /> {Math.floor(lossesValue.metallum)}</div>
                    <div className="flex items-center"><KristallinIcon className="w-4 h-4 mr-1 text-secondary/70" /> {Math.floor(lossesValue.kristallin)}</div>
                </div>
            </div>
        </div>
    </div>
);

export const CombatReportModal: React.FC<{ report: CombatReport | null; onClose: () => void }> = ({ report, onClose }) => {
    if (!report) return null;

    const winnerText = report.winner === 'draw' ? 'The battle was a draw.' : `The ${report.winner} is victorious.`;
    const winnerColor = report.winner === 'attacker' ? 'text-primary' : report.winner === 'defender' ? 'text-yellow-400' : 'text-textMuted';

    return (
        <Modal isOpen={!!report} onClose={onClose} title="Combat Simulation Report">
            <div className="space-y-4">
                <div className="text-center p-4 bg-surface rounded-lg">
                    <h3 className={`text-2xl font-bold ${winnerColor}`}>{winnerText}</h3>
                    <p className="text-textMuted text-sm">
                        Report ID: {report.id}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FleetDetails title="Attacker" fleet={report.attacker.fleet} losses={report.attacker.losses} lossesValue={report.attacker.lossesValue} />
                    <FleetDetails title="Defender" fleet={report.defender.fleet} losses={report.defender.losses} lossesValue={report.defender.lossesValue} />
                </div>
                
                 <div className="p-3 bg-bg/50 rounded-lg border border-grid">
                    <h4 className="text-base font-semibold text-textHi">Debris Field Created</h4>
                     <p className="text-sm text-textMuted">The battle resulted in a salvageable debris field containing:</p>
                    <div className="mt-2 flex items-center space-x-4 font-semibold tabular-nums">
                         <div className="flex items-center"><MetallumIcon className="w-4 h-4 mr-1 text-textMuted/70" /> Metallum: {Math.floor(report.debris.metallum)}</div>
                         <div className="flex items-center"><KristallinIcon className="w-4 h-4 mr-1 text-secondary/70" /> Kristallin: {Math.floor(report.debris.kristallin)}</div>
                    </div>
                 </div>
            </div>
        </Modal>
    );
};
