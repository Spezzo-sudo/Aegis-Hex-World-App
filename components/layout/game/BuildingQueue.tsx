import React from 'react';
import { usePlayerStore } from '../../../types/usePlayerStore';
import { QueueItem } from '../../../types';
import { Card } from '../../ui/Card';
import { ProgressBar } from '../../ui/ProgressBar';
import { ClockIcon } from '../../../constants/icons';

const QueueItemCard: React.FC<{ item: QueueItem }> = ({ item }) => {
    return (
        <div className="bg-bg/50 p-3 rounded-lg border border-grid">
            <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-textHi">{item.type} (Lvl {item.levelOrAmount})</span>
            </div>
            <ProgressBar startTime={item.startTime} endTime={item.endTime} />
        </div>
    )
}

export const BuildingQueue: React.FC = () => {
    const { colony } = usePlayerStore();
    
    if (!colony || colony.buildingQueue.length === 0) {
        return (
            <Card title="Building Queue">
                <div className="flex flex-col items-center justify-center h-24 text-textMuted/50">
                    <ClockIcon className="w-8 h-8 mb-2" />
                    <span>Queue is empty</span>
                </div>
            </Card>
        );
    }

    return (
        <Card title="Building Queue">
            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {colony.buildingQueue.map(item => (
                    <QueueItemCard key={item.id} item={item} />
                ))}
            </div>
        </Card>
    );
};