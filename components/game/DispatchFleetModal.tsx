import React, { useState } from 'react';
import { Modal } from '../../Modal';
import { usePlayerStore } from '../../types/usePlayerStore';
import { MissionType, UnitType } from '../../types';
import { UNIT_DATA } from '../../constants/gameData';
import { Button } from '../ui/Button';
import { gameService } from '../../services/gameService';

interface DispatchFleetModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: { x: number; y: number };
}

export const DispatchFleetModal: React.FC<DispatchFleetModalProps> = ({ isOpen, onClose, target }) => {
  const { colony } = usePlayerStore();
  const [fleet, setFleet] = useState<Partial<Record<UnitType, number>>>({});
  const [mission, setMission] = useState<MissionType>(MissionType.Explore);
  
  const mapData = gameService.getMapData();
  const targetPlanet = mapData[`${target.x}:${target.y}`];
  const canAttack = !!targetPlanet?.npc;

  const handleUnitChange = (type: UnitType, count: number) => {
    const available = colony?.units[type] || 0;
    const newCount = Math.max(0, Math.min(available, count));
    const newFleet = { ...fleet };
    if (newCount > 0) {
        newFleet[type] = newCount;
    } else {
        delete newFleet[type];
    }
    setFleet(newFleet);
  };
  
  const handleDispatch = () => {
    gameService.dispatchFleet(fleet, target, mission);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Dispatch Fleet to [${target.x}:${target.y}]`}>
      <div className="space-y-4">
        
        <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Select Mission</label>
            <select
                value={mission}
                onChange={(e) => setMission(e.target.value as MissionType)}
                className="w-full bg-bg border border-grid rounded-md p-2 text-textHi"
            >
                <option value={MissionType.Explore}>Explore</option>
                {canAttack && <option value={MissionType.Attack}>Attack</option>}
                <option value={MissionType.Transport} disabled>Transport</option>
                <option value={MissionType.Colonize} disabled>Colonize</option>
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-textMuted mb-1">Assemble Fleet</label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2 border-t border-b border-grid py-2">
            {Object.values(UnitType).map(type => {
                const available = colony?.units[type] || 0;
                if (available === 0) return null;
                const data = UNIT_DATA[type];
                return (
                <div key={type} className="flex items-center justify-between p-2 bg-bg/50 rounded-md">
                    <label htmlFor={`dispatch-${type}`} className="text-textHi">{data.name} <span className="text-textMuted text-xs">(Available: {available})</span></label>
                    <input
                    id={`dispatch-${type}`}
                    type="number"
                    min="0"
                    max={available}
                    value={fleet[type] || 0}
                    onChange={e => handleUnitChange(type, parseInt(e.target.value) || 0)}
                    className="w-24 bg-bg border border-grid rounded-md p-1 text-center tabular-nums"
                    />
                </div>
                );
            })}
            </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button onClick={handleDispatch} disabled={Object.keys(fleet).length === 0}>
            Launch Fleet
          </Button>
        </div>
      </div>
    </Modal>
  );
};