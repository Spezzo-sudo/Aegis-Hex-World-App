
import { useEffect, useRef } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { gameService } from '../services/gameService';

const GAME_TICK_MS = 1000;

export const useGameLoop = () => {
  const colony = usePlayerStore((state) => state.colony);
  const updateColony = usePlayerStore((state) => state.updateColony);
  const lastTickRef = useRef<number | null>(null);

  useEffect(() => {
    if (!colony) {
      lastTickRef.current = null;
      return;
    }

    if (lastTickRef.current === null) {
      lastTickRef.current = colony.lastUpdated;
    }

    const gameLoop = () => {
      // We need to get the latest colony state from the store inside the loop
      const freshColony = usePlayerStore.getState().colony;
      if (!freshColony) return;

      const now = Date.now();
      lastTickRef.current = now;
      
      const { updatedColony } = gameService.processTick(freshColony);

      updateColony(updatedColony);
    };

    const intervalId = setInterval(gameLoop, GAME_TICK_MS);

    return () => clearInterval(intervalId);
  }, [colony, updateColony]);
};
