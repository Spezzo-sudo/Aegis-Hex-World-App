
import React, { useState } from 'react';
import { usePlayerStore } from '../types/usePlayerStore';
import { DashboardActivityFeed } from '../components/game/DashboardActivityFeed';
import { CombatReportModal } from '../components/game/CombatReportModal';
import { CombatReport } from '../types';

const BaseView: React.FC = () => {
  const { colony } = usePlayerStore();
  const [selectedReport, setSelectedReport] = useState<CombatReport | null>(null);

  if (!colony) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <CombatReportModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      <div>
        <h2 className="text-3xl font-bold text-primary tracking-wider">Command Dashboard</h2>
        <p className="text-textMuted/80">An overview of all operations at {colony.name}.</p>
      </div>

      <div className="max-w-4xl mx-auto">
         <DashboardActivityFeed onReportClick={setSelectedReport} />
      </div>
      
    </div>
  );
};

export default BaseView;