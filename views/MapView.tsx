
import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { MapIcon } from '../constants/icons';
import { generatePlanetLore } from '../services/geminiService';

const MapHex: React.FC<{ type: string; bonus?: string }> = ({ type, bonus }) => {
    const [lore, setLore] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleScan = async () => {
        if (lore) {
            setLore('');
            return;
        }
        setIsLoading(true);
        const generatedLore = await generatePlanetLore(type, bonus);
        setLore(generatedLore);
        setIsLoading(false);
    };

    return (
        <div className="relative group p-2 border border-grid/50 rounded-lg bg-surface hover:bg-surface/80 transition-colors">
            <h4 className="font-semibold text-textHi">{type} Planet</h4>
            {bonus && <p className="text-xs text-primary">{bonus}</p>}
            <button onClick={handleScan} disabled={isLoading} className="text-xs text-textMuted hover:text-primary mt-2 disabled:opacity-50">
                {isLoading ? 'Scanning...' : (lore ? 'Clear Scan' : 'Scan for Lore')}
            </button>
            {lore && <p className="text-xs text-textMuted italic mt-2 p-2 bg-bg/50 rounded">{lore}</p>}
        </div>
    );
};

const MapView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Stellar Cartography</h2>
        <p className="text-textMuted/80">Explore the galaxy, discover new systems, and dispatch your fleets.</p>
      </div>

      <Card>
        <div className="flex flex-col items-center justify-center h-96 text-textMuted/50 bg-bg rounded-lg border border-grid">
            <MapIcon className="w-24 h-24 mb-4" />
            <h3 className="text-xl font-bold text-textHi">Galaxy View In development</h3>
            <p>Future updates will reveal the secrets of the cosmos.</p>
        </div>
      </Card>

      <Card title="Local System Scan">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <MapHex type="Terran" bonus="Rich in Metallum" />
              <MapHex type="Volcanic" bonus="High Energy Output" />
              <MapHex type="Ice" bonus="Abundant Kristallin" />
              <MapHex type="Gas Giant" />
              <MapHex type="Asteroid Field" bonus="Debris for Recycling" />
          </div>
      </Card>
    </div>
  );
};

export default MapView;
