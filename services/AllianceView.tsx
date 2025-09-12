import React from 'react';
import { Card } from '../components/ui/Card';
import { AllianceIcon } from '../constants/icons';

const AllianceView: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Alliance Diplomacy</h2>
        <p className="text-textMuted/80">Forge pacts, share resources, and conquer together.</p>
      </div>

      <Card>
        <div className="flex flex-col items-center justify-center h-64 text-textMuted/50">
          <AllianceIcon className="w-16 h-16 mb-4" />
          <h3 className="text-xl font-bold text-textHi">Alliance System Offline</h3>
          <p>This feature is currently in development. Prepare to unite.</p>
        </div>
      </Card>
    </div>
  );
};

export default AllianceView;