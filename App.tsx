
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { usePlayerStore } from './types/usePlayerStore';
import { useAuthStore } from './types/useAuthStore';
import BaseView from './views/BaseView';
import BuildingsView from './views/BuildingsView';
import MapView from './views/MapView';
import ResearchView from './views/ResearchView';
import ShipyardView from './views/ShipyardView';
import AllianceView from './views/AllianceView';
import MarketView from './views/MarketView';
import AuthView from './views/AuthView';
import SimulatorView from './views/SimulatorView';
import { Header } from './components/layout/Header';
import { Dock } from './components/layout/Dock';
import { GameView } from './types/index';
// import { auth } from './services/firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { getPlayerColony, updatePlayerColony, createPlayerColony } from './services/playerDataService';
import { useDebounce } from './hooks/useDebounce';
import { useGameLoop } from './hooks/useGameLoop';
import { initialColony } from './constants/gameData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<GameView>(GameView.Base);
  const { colony, setColony } = usePlayerStore();
  const { user, setUser, isLoading, setLoading } = useAuthStore();
  const initialLoadComplete = useRef(false);

  useGameLoop(); // Activate the core game loop for resource generation and queue management.

  /*
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [setUser, setLoading]);
  */

  // Mock auth and data loading to bypass login
  useEffect(() => {
    const mockUser = {
        uid: 'mock-user-01',
        email: 'commander@aegis.net',
    };
    // Cast to any to satisfy the User type from firebase, which is complex.
    // The app only uses uid and email.
    setUser(mockUser as any);
    setLoading(false);

    const mockColony = {
        ...initialColony,
        id: mockUser.uid,
        name: "Commander's Bastion",
    };
    setColony(mockColony);
  }, [setUser, setLoading, setColony]);
  
  // Load player data on login, clear on logout
  /*
  useEffect(() => {
    if (user) {
      initialLoadComplete.current = false; // Reset save guard on new login
      const fetchColony = async () => {
        let colonyData = await getPlayerColony(user.uid);
        // If no colony is found (e.g., signup flow interruption), create one.
        if (!colonyData) {
            console.warn("Colony data not found for user, creating a new one:", user.uid);
            colonyData = await createPlayerColony(user.uid, user.email || `player-${user.uid}`);
        }
        setColony(colonyData);
      };
      fetchColony();
    } else {
      clearColony();
    }
  }, [user, setColony, clearColony]);
  */

  // Debounce colony state for saving to Firestore to batch rapid updates.
  const debouncedColony = useDebounce(colony, 5000);

  // Auto-save colony data to Firestore when it changes
  useEffect(() => {
    // Do not save until we have a logged-in user and debounced data.
    if (!debouncedColony || !user) {
      return;
    }

    // On the first run with loaded data, set a flag and exit.
    // This prevents immediately saving the data we just fetched.
    if (!initialLoadComplete.current) {
        initialLoadComplete.current = true;
        return;
    }
    
    // For all subsequent changes, save to the database.
    // updatePlayerColony(user.uid, debouncedColony);
  }, [debouncedColony, user]);

  const renderView = () => {
    switch (currentView) {
      case GameView.Base:
        return <BaseView />;
      case GameView.Buildings:
        return <BuildingsView />;
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
      case GameView.Simulator:
        return <SimulatorView />;
      default:
        return <BaseView />;
    }
  };
  
  const handleViewChange = useCallback((view: GameView) => {
    setCurrentView(view);
  }, []);

  if (isLoading) {
      return (
      <div className="flex h-screen w-screen items-center justify-center bg-bg text-primary">
        <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-xl font-semibold">Connecting to Aegis Network...</p>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      <div className="starfield stars1"></div>
      <div className="starfield stars2"></div>
      <div className="starfield stars3"></div>
      {!user ? (
          <AuthView />
      ) : !colony ? (
         <div className="flex h-screen w-screen items-center justify-center bg-bg text-primary">
            <svg className="animate-spin h-8 w-8 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-xl font-semibold">Loading Colony Data...</p>
        </div>
      ) : (
        <div className="relative z-10 flex flex-col h-full bg-transparent text-textMuted">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {renderView()}
          </main>
          <Dock currentView={currentView} setView={handleViewChange} />
        </div>
      )}
    </div>
  );
};

export default App;