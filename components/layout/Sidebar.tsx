import React from 'react';
import { GameView } from '../../types';
import { BaseIcon, MapIcon, AllianceIcon, MarketIcon, ShipyardIcon, ResearchIcon } from '../../constants/icons';

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
      className={`flex items-center space-x-4 p-3 w-full text-left rounded-lg transition-all duration-200 relative overflow-hidden group
        ${isActive 
            ? 'bg-cyan-500/10 text-cyan-300' 
            : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
    >
      <div className={`absolute left-0 top-0 h-full w-1 bg-cyan-400 transition-transform duration-300 ${isActive ? 'scale-y-100' : 'scale-y-0'}`}></div>
      <div className="w-6 h-6 z-10">{icon}</div>
      <span className="font-semibold hidden md:block z-10">{label}</span>
      <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-20 h-20 bg-cyan-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </button>
  );
};


interface SidebarProps {
  currentView: GameView;
  setView: (view: GameView) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <nav className="bg-black/20 p-2 md:p-3 flex flex-col space-y-2 border-r border-white/5">
        <div className="text-center py-4 hidden md:flex items-center justify-center space-x-2">
            <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
            <h1 className="text-xl font-bold text-cyan-400 tracking-widest">AEGIS</h1>
        </div>
        <div className="flex-grow space-y-2">
            <NavItem view={GameView.Base} label="Base" currentView={currentView} setView={setView} icon={<BaseIcon/>}/>
            <NavItem view={GameView.Map} label="Map" currentView={currentView} setView={setView} icon={<MapIcon/>}/>
            <NavItem view={GameView.Research} label="Research" currentView={currentView} setView={setView} icon={<ResearchIcon/>}/>
            <NavItem view={GameView.Shipyard} label="Shipyard" currentView={currentView} setView={setView} icon={<ShipyardIcon/>}/>
            <NavItem view={GameView.Alliance} label="Alliance" currentView={currentView} setView={setView} icon={<AllianceIcon/>} disabled={true}/>
            <NavItem view={GameView.Market} label="Market" currentView={currentView} setView={setView} icon={<MarketIcon/>} disabled={true}/>
        </div>
    </nav>
  );
};
