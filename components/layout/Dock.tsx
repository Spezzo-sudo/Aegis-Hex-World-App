import React from 'react';
import { GameView } from '../../types';
import { CommandNexusIcon, BuildingsIcon, MapIcon, AllianceIcon, MarketIcon, ShipyardIcon, ResearchIcon, SimulatorIcon } from '../../constants/icons';

interface NavItemProps {
  view: GameView;
  label: string;
  currentView: GameView;
  setView: (view: GameView) => void;
  icon: React.ReactNode;
  disabled?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, currentView, setView, icon, disabled = false }) => {
  const isActive = view === currentView;
  return (
    <button
      onClick={() => setView(view)}
      disabled={disabled}
      className={`flex flex-col items-center justify-center space-y-1 p-2 w-20 h-16 rounded-lg relative group
        ${isActive 
            ? 'text-primary' 
            : 'text-textMuted hover:bg-surface hover:text-textHi'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      aria-label={label}
    >
      <div className="w-6 h-6">{icon}</div>
      <span className="font-semibold text-xs">{label}</span>
      {isActive && <div className="absolute bottom-1.5 h-1 w-8 bg-primary rounded-t-full"></div>}
    </button>
  );
};


interface DockProps {
  currentView: GameView;
  setView: (view: GameView) => void;
}

export const Dock: React.FC<DockProps> = ({ currentView, setView }) => {
  const navItems = [
    { view: GameView.Base, label: 'Dashboard', icon: <CommandNexusIcon />, disabled: false },
    { view: GameView.Buildings, label: 'Buildings', icon: <BuildingsIcon />, disabled: false },
    { view: GameView.Map, label: 'Map', icon: <MapIcon />, disabled: false },
    { view: GameView.Research, label: 'Research', icon: <ResearchIcon />, disabled: false },
    { view: GameView.Shipyard, label: 'Fleet', icon: <ShipyardIcon />, disabled: false },
    { view: GameView.Simulator, label: 'Sim', icon: <SimulatorIcon />, disabled: false },
    { view: GameView.Alliance, label: 'Alliance', icon: <AllianceIcon />, disabled: true },
    { view: GameView.Market, label: 'Market', icon: <MarketIcon />, disabled: true },
  ];

  return (
    <nav className="bg-surface/80 backdrop-blur-sm border-t border-grid flex items-center justify-center p-1 z-20 shrink-0">
        <div className="flex items-center justify-around w-full max-w-2xl">
            {navItems.map(item => (
                <NavItem key={item.view} {...item} currentView={currentView} setView={setView} />
            ))}
        </div>
    </nav>
  );
};