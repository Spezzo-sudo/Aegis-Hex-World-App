import React, { useState, useEffect, useRef } from 'react';
import { usePlayerStore } from '../../types/usePlayerStore';
import { useAuthStore } from '../../types/useAuthStore';
import { Resource } from '../../types';
import { MetallumIcon, KristallinIcon, PlasmaCoreIcon, EnergieIcon } from '../../constants/icons';

const ResourceItem: React.FC<{ icon: React.ReactNode; value: number; capacity?: number; label: string }> = ({ icon, value, capacity, label }) => {
    const isEnergy = label === Resource.Energie;
    const displayValue = isEnergy ? (value >= 0 ? `+${Math.floor(value)}` : Math.floor(value)) : Math.floor(value);
    const percentage = capacity ? Math.min(100, (value / capacity) * 100) : 0;
    
    const [isPulsing, setIsPulsing] = useState(false);
    const prevValueRef = useRef(value);

    useEffect(() => {
        if (value > prevValueRef.current && !isEnergy && prevValueRef.current !== 0) {
            setIsPulsing(true);
            const timer = setTimeout(() => setIsPulsing(false), 400);
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
        <div className="flex items-center space-x-3 bg-surface p-2.5 rounded-lg w-[160px] relative border border-grid overflow-hidden">
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">{icon}</div>
            <div className="flex flex-col text-sm flex-grow">
                <span className="font-medium text-textMuted">{label}</span>
                <span className={`font-semibold text-base ${valueColor} tabular-nums ${isPulsing ? 'pulse-resource' : ''}`}>{displayValue}</span>
            </div>
            {!isEnergy && capacity && (
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/10">
                    <div className="h-full bg-primary" style={{ width: `${percentage}%` }}></div>
                </div>
            )}
        </div>
    );
}

export const Header: React.FC = () => {
    const { colony } = usePlayerStore();
    const { user } = useAuthStore();

    if (!colony) return null;

    const { resources, storage } = colony;

    return (
        <header className="bg-bg/80 backdrop-blur-sm border-b border-grid p-2 flex items-center justify-between z-20 shrink-0">
            <div className="px-4">
                 <h1 className="text-xl font-bold text-textHi tracking-wide">Aegis Hex</h1>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3 overflow-x-auto p-1">
                {/* Placeholder icon from screenshot */}
                <div className="w-8 h-8 flex items-center justify-center text-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 11h16M4 17h16M4 5h16"/></svg>
                </div>
                <ResourceItem icon={<MetallumIcon className="w-6 h-6 text-textMuted"/>} value={resources.Metallum} capacity={storage.Metallum} label={Resource.Metallum} />
                <ResourceItem icon={<KristallinIcon className="w-6 h-6 text-secondary"/>} value={resources.Kristallin} capacity={storage.Kristallin} label={Resource.Kristallin} />
            </div>
            <div className="px-4 flex items-center space-x-4">
                <button className="text-textMuted hover:text-primary" aria-label="Settings">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <button className="text-textMuted hover:text-primary" aria-label="Player Profile">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </header>
    );
};