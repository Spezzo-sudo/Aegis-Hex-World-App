
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CombatReportModal } from '../components/game/CombatReportModal';
import { gameService } from '../services/gameService';
import { UnitType, DefenseType, CombatReport } from '../types';
import { UNIT_DATA, DEFENSE_DATA } from '../constants/gameData';
import { SimulatorIcon } from '../constants/icons';

type FleetComposition = Partial<{[key in UnitType | DefenseType]: number}>;

const FleetConfigurator: React.FC<{ title: string, fleet: FleetComposition, setFleet: (fleet: FleetComposition) => void }> = ({ title, fleet, setFleet }) => {

    const handleUnitChange = (type: UnitType | DefenseType, count: number) => {
        const newFleet = { ...fleet };
        if (count > 0) {
            newFleet[type] = count;
        } else {
            delete newFleet[type];
        }
        setFleet(newFleet);
    };

    return (
        <Card title={title} className="h-full">
            <div className="space-y-2 max-h-[calc(100vh-400px)] overflow-y-auto pr-2">
                <h4 className="font-semibold text-primary text-sm uppercase tracking-wider">Ships</h4>
                {Object.values(UnitType).map(type => {
                    const data = UNIT_DATA[type];
                    return (
                         <div key={type} className="flex items-center justify-between space-x-2 text-sm">
                            <label htmlFor={`${title}-${type}`} className="text-textMuted flex-grow">{data.name}</label>
                            <input
                                id={`${title}-${type}`}
                                type="number"
                                min="0"
// FIX: Cast string from Object.values to UnitType to correctly index the fleet object.
                                value={fleet[type as UnitType] || 0}
// FIX: Cast string from Object.values to UnitType before passing to handler.
                                onChange={(e) => handleUnitChange(type as UnitType, Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-20 bg-bg border border-grid rounded-md p-1 text-center tabular-nums"
                            />
                        </div>
                    )
                })}
                 <h4 className="font-semibold text-primary text-sm uppercase tracking-wider mt-4 pt-2 border-t border-grid">Defenses</h4>
                 {Object.values(DefenseType).map(type => {
                    const data = DEFENSE_DATA[type];
                    return (
                         <div key={type} className="flex items-center justify-between space-x-2 text-sm">
                            <label htmlFor={`${title}-${type}`} className="text-textMuted flex-grow">{data.name}</label>
                            <input
                                id={`${title}-${type}`}
                                type="number"
                                min="0"
// FIX: Cast string from Object.values to DefenseType to correctly index the fleet object.
                                value={fleet[type as DefenseType] || 0}
// FIX: Cast string from Object.values to DefenseType before passing to handler.
                                onChange={(e) => handleUnitChange(type as DefenseType, Math.max(0, parseInt(e.target.value) || 0))}
                                className="w-20 bg-bg border border-grid rounded-md p-1 text-center tabular-nums"
                            />
                        </div>
                    )
                })}
            </div>
        </Card>
    );
}


const SimulatorView: React.FC = () => {
    const [attackerFleet, setAttackerFleet] = useState<FleetComposition>({});
    const [defenderFleet, setDefenderFleet] = useState<FleetComposition>({});
    const [report, setReport] = useState<CombatReport | null>(null);
    const [isSimulating, setIsSimulating] = useState(false);

    const handleSimulate = () => {
        setIsSimulating(true);
        const combatReport = gameService.simulateCombat(attackerFleet, defenderFleet);
        setReport(combatReport);
        setTimeout(() => setIsSimulating(false), 500); // simulate processing time
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <CombatReportModal report={report} onClose={() => setReport(null)} />
            <div>
                <h2 className="text-3xl font-bold text-primary tracking-wider">Battle Simulator</h2>
                <p className="text-textMuted/80">Test fleet compositions and strategies without risk.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FleetConfigurator title="Attacker Fleet" fleet={attackerFleet} setFleet={setAttackerFleet} />
                <FleetConfigurator title="Defender Fleet" fleet={defenderFleet} setFleet={setDefenderFleet} />
            </div>

            <div className="flex justify-center">
                 <Button 
                    onClick={handleSimulate}
                    size="lg"
                    isLoading={isSimulating}
                    disabled={Object.keys(attackerFleet).length === 0 || Object.keys(defenderFleet).length === 0}
                >
                    <SimulatorIcon className="w-6 h-6 mr-2" />
                    Run Simulation
                </Button>
            </div>
        </div>
    );
};

export default SimulatorView;
