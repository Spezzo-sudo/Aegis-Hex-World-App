import React, { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../../types/usePlayerStore';
import { Resource } from '../../types';
import { MetallumIcon, KristallinIcon, PlasmaCoreIcon, EnergieIcon } from '../../constants/icons';

const ResourceItem: React.FC<{ icon: React.ReactNode; value: number; capacity?: number; label: string }> = ({ icon, value, capacity, label }) => {
    const isEnergy = label === Resource.Energie;
    const displayValue = isEnergy ? (value >= 0 ? `+${Math.floor(value)}` : Math.floor(value)) : Math.floor(value);
    const percentage = capacity ? Math.min(100, (value / capacity) * 100) : 0;
    
    const [isPulsing, setIsPulsing] = useState(false);
    const prevValueRef = useRef(value);

    useEffect(() => {
        // Pulse only on resource gain, not for energy changes or initial load
        if (value > prevValueRef.current && !isEnergy && prevValueRef.current !== 0) {
            setIsPulsing(true);
            const timer = setTimeout(() => setIsPulsing(false), 400); // Animation duration
            return () => clearTimeout(timer);
        }
        prevValueRef.current = value;
    }, [value, isEnergy]);


    let valueColor = "text-textHi";
    if (isEnergy) {
        valueColor = value >= 0 ? "text-primary" : "text-red-400";
    } else if (capacity && value / capacity > 0.9) {
        valueColor = "text-yellow-400";
    }
    if (capacity && value / capacity >= 1) {
        valueColor = "text-red-500";
    }

    return (
        <div className="flex items-center space-x-2 bg-surface/70 backdrop-blur-sm p-2 rounded-lg min-w-[150px] relative border border-grid group h-12">
            <div className="flex-shrink-0 w-6 h-6">{icon}</div>
            <div className="flex flex-col text-sm flex-grow">
                <span className="text-textMuted text-xs">{label}</span>
                <span className={`font-semibold ${valueColor} tabular-nums ${isPulsing ? 'pulse-resource' : ''}`}>{displayValue}</span>
            </div>
            {!isEnergy && capacity && (
                 <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-primary/10 rounded-full overflow-hidden">
                    <div className="h-full bg-primary transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                </div>
            )}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block bg-surface text-xs px-2 py-1 rounded-md border border-grid whitespace-nowrap">
                {isEnergy ? "Energy Balance" : `Storage: ${Math.floor(value)} / ${capacity}`}
            </div>
        </div>
    );
}

export const Header: React.FC = () => {
    const { colony } = usePlayerStore();

    if (!colony) return null;

    const { resources, storage, name } = colony;

    return (
        <header className="bg-surface/50 backdrop-blur-sm border-b border-grid p-2 flex items-center justify-between z-20 shrink-0">
            <div className="px-4">
                 <div className="flex items-center justify-center space-x-2">
                    <svg viewBox="0 0 24 24" className="w-7 h-7 text-primary" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                    <h1 className="text-lg font-bold text-textHi tracking-widest hidden sm:block">AEGIS</h1>
                </div>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto p-1">
                <ResourceItem icon={<MetallumIcon className="text-textMuted"/>} value={resources.Metallum} capacity={storage.Metallum} label={Resource.Metallum} />
                <ResourceItem icon={<KristallinIcon className="text-secondary"/>} value={resources.Kristallin} capacity={storage.Kristallin} label={Resource.Kristallin} />
                <ResourceItem icon={<PlasmaCoreIcon className="text-alliance-c"/>} value={resources.PlasmaCore} capacity={storage.PlasmaCore} label={Resource.PlasmaCore} />
                <ResourceItem icon={<EnergieIcon className="text-yellow-400"/>} value={resources.Energie} label={Resource.Energie} />
            </div>
        </header>
    );
};