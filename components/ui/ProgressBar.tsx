import React, { useState, useEffect } from 'react';

interface ProgressBarProps {
  startTime: number;
  endTime: number;
  onComplete?: () => void;
}

const formatTime = (ms: number): string => {
    if (ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};


export const ProgressBar: React.FC<ProgressBarProps> = ({ startTime, endTime, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const calculateProgress = () => {
            const now = Date.now();
            const totalDuration = endTime - startTime;
            if (totalDuration <= 0) {
                setProgress(100);
                setTimeLeft('00:00:00');
                if (onComplete) onComplete();
                return;
            }
            const elapsed = now - startTime;
            const newProgress = Math.min(100, (elapsed / totalDuration) * 100);
            
            setProgress(newProgress);
            setTimeLeft(formatTime(Math.max(0, endTime - now)));

            if (newProgress >= 100) {
                if(onComplete) onComplete();
                clearInterval(interval);
            }
        };

        calculateProgress();
        const interval = setInterval(calculateProgress, 1000);
        return () => clearInterval(interval);
    }, [startTime, endTime, onComplete]);

    return (
        <div className="w-full">
            <div className="flex justify-end items-center mb-1 text-xs text-textMuted tabular-nums">
                <span>{timeLeft}</span>
            </div>
            <div className="w-full bg-primary/10 rounded-full h-2.5 relative overflow-hidden">
                <div 
                    className="bg-primary h-full rounded-full transition-all duration-1000 ease-linear relative" 
                    style={{ width: `${progress}%` }}>
                      <div className="absolute top-0 left-0 h-1/2 w-full bg-white/20 rounded-t-full"></div>
                </div>
            </div>
        </div>
    );
};