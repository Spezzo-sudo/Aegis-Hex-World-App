import React, { useState, useEffect, useCallback } from 'react';
import { usePlayerStore } from './types/usePlayerStore';
import { useGameLoop } from './hooks/useGameLoop';
import BaseView from './views/BaseView';
import MapView from './views/MapView';
import ResearchView from './views/ResearchView';
import ShipyardView from './views/ShipyardView';
import AllianceView from './views/AllianceView';
import MarketView from './views/MarketView';
import { Header } from './components/layout/Header';
import { Dock } from './components/layout/Dock';
import { GameView } from './types';
import { initialColony } from './constants/gameData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.Map);
  const { colony, setColony } = usePlayerStore();

  // Initialize player data on first load
  useEffect(() => {
    // In a real app, this would be fetched from Firestore
    setColony(initialColony);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Start the game loop
  useGameLoop();

  const renderView = () => {
    switch (currentView) {
      case GameView.Base:
        return <BaseView />;
      case GameView.Map:
        return <MapView />;
      case GameView.Research:
        return <ResearchView />;
      case GameView.Shipyard:
        return <ShipyardView />;
      case GameView.Alliance:
        return <AllianceView />;
      case GameView.Market:
        return <MarketView />;
      default:
        return <BaseView />;
    }
  };
  
  const handleViewChange = useCallback((view: GameView) => {
    setCurrentView(view);
  }, []);

  if (!colony) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg text-primary">
        <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Initializing Aegis Core...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <div className="starfield stars1"></div>
      <div className="starfield stars2"></div>
      <div className="starfield stars3"></div>
      <div className="relative z-10 flex flex-col h-full bg-transparent text-textMuted">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {renderView()}
        </main>
        <Dock currentView={currentView} setView={handleViewChange} />
      </div>
    </div>
  );
};

export default App;