import React from 'react';
import { Card } from '../components/ui/Card';
import { MarketIcon } from '../constants/icons';

const MarketView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Galactic Market</h2>
        <p className="text-textMuted/80">Trade resources with other commanders.</p>
      </div>

       <Card>
        <div className="flex flex-col items-center justify-center h-64 text-textMuted/50">
          <MarketIcon className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-bold text-textHi">Market Terminal Offline</h3>
          <p>The interstellar trade network is not yet available in this sector.</p>
        </div>
      </Card>
    </div>
  );
};

export default MarketView;