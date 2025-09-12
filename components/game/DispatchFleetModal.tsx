
import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { usePlayerStore } from '../../types/usePlayerStore';
import { UnitType } from '../../types';
import { UNIT_DATA } from '../../constants/gameData';
import { Button } from '../ui/Button';

interface DispatchFleetModalProps {
  isOpen: boolean;
  onClose: () => void;
  target: { galaxy: number; system: number; position: number };
}

export const DispatchFleetModal: React.FC<DispatchFleetModalProps> = ({ isOpen, onClose, target }) => {
  const { colony } = usePlayerStore();
  const [fleet, setFleet] = useState<Partial<Record<UnitType, number>>>({});

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
    // In a real game, this would send fleet data to the server
    console.log(`Dispatching fleet to ${target.galaxy}:${target.system}:${target.position}`, fleet);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Dispatch Fleet to ${target.galaxy}:${target.system}:${target.position}`}>
      <div className="space-y-4">
        <p className="text-textMuted">Select units to include in the fleet. Only available units are shown.</p>
        <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
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
        <div className="flex justify-end pt-4 border-t border-grid">
          <Button onClick={handleDispatch} disabled={Object.keys(fleet).length === 0}>
            Launch Fleet
          </Button>
        </div>
      </div>
    </Modal>
  );
};
