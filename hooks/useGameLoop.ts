import { useEffect } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { TICK_INTERVAL, BUILDING_DATA, RESEARCH_DATA } from '../constants/gameData';
import { BuildingType, Resource, ResearchType } from '../types';

export const useGameLoop = () => {
  const { colony, updateResources, finishBuilding, finishResearch, finishShipyard } = usePlayerStore();

  useEffect(() => {
    const gameTick = () => {
      if (!colony) return;
      
      const now = Date.now();

      // Research Bonuses
      const extractionBonus = 1 + ((colony.research[ResearchType.ExtraktionsAlgorithmen] || 0) * 0.05);
      const energyBonus = 1 + ((colony.research[ResearchType.ReaktorOptimierung] || 0) * 0.10);

      // 1. Calculate production
      const production: { [key in Resource]?: number } = {};
      let totalEnergyProduction = 0;
      let totalEnergyConsumption = 0;
      
      (Object.keys(colony.buildings) as BuildingType[]).forEach((type) => {
          const building = colony.buildings[type];
          const data = BUILDING_DATA[type];
          if (!data || !building) return;

          if (data.baseProduction?.resource === Resource.Energie) {
              totalEnergyProduction += (data.baseProduction.amount * Math.pow(data.productionFactor || 1, building.level - 1));
          } else {
              totalEnergyConsumption += (data.baseEnergy || 0) * Math.pow(data.energyFactor || 1, building.level - 1);
          }
      });
      totalEnergyProduction *= energyBonus;
      
      const energyEfficiency = totalEnergyProduction >= totalEnergyConsumption ? 1 : Math.max(0, totalEnergyProduction / totalEnergyConsumption);

      (Object.keys(colony.buildings) as BuildingType[]).forEach((type) => {
          const building = colony.buildings[type];
          const data = BUILDING_DATA[type];
          if (!data || !building || !data.baseProduction || data.baseProduction.resource === Resource.Energie) return;
          
          let producedAmount = (data.baseProduction.amount * Math.pow(data.productionFactor || 1, building.level - 1)) * energyEfficiency;
          if (data.baseProduction.resource === Resource.Metallum || data.baseProduction.resource === Resource.Kristallin) {
              producedAmount *= extractionBonus;
          }
          const resource = data.baseProduction.resource;
          production[resource] = (production[resource] || 0) + producedAmount;
      });

      const producedPerTick = {
          [Resource.Metallum]: (production[Resource.Metallum] || 0) / (3600 / (TICK_INTERVAL / 1000)),
          [Resource.Kristallin]: (production[Resource.Kristallin] || 0) / (3600 / (TICK_INTERVAL / 1000)),
          [Resource.PlasmaCore]: (production[Resource.PlasmaCore] || 0) / (3600 / (TICK_INTERVAL / 1000)),
          [Resource.Energie]: totalEnergyProduction - totalEnergyConsumption,
      };
      
      const cappedResources: Partial<{ [key in Resource]: number }> = {};
      (Object.keys(producedPerTick) as Resource[]).forEach(res => {
        if(res === Resource.Energie) return;
        const currentAmount = colony.resources[res];
        const storageCap = colony.storage[res] || Infinity;
        const gain = producedPerTick[res] || 0;
        const newTotal = Math.min(storageCap, currentAmount + gain);
        if (newTotal > currentAmount) {
          cappedResources[res] = newTotal - currentAmount;
        }
      });
      
      cappedResources[Resource.Energie] = (producedPerTick[Resource.Energie] || 0) - colony.resources[Resource.Energie];
      
      updateResources(cappedResources);

      // 2. Check for completed queue items
      colony.buildingQueue.forEach(item => {
        if (now >= item.endTime) finishBuilding(item);
      });
      colony.researchQueue.forEach(item => {
        if (now >= item.endTime) finishResearch(item);
      });
      colony.shipyardQueue.forEach(item => {
        if (now >= item.endTime) finishShipyard(item);
      });
    };

    const intervalId = setInterval(gameTick, TICK_INTERVAL);
    return () => clearInterval(intervalId);
  }, [colony, updateResources, finishBuilding, finishResearch, finishShipyard]);
};