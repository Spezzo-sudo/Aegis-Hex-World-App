import React from 'react';

interface IconProps {
  className?: string;
}

export const MetallumIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
  </svg>
);

export const KristallinIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2.5l-5.12 3.53-1.9 5.44 3.73 4.97 5.29 1.56 5.29-1.56 3.73-4.97-1.9-5.44zM12 2.5v19"></path>
  </svg>
);

export const PlasmaCoreIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 21a9 9 0 000-18 9 9 0 000 18z"></path>
    <path d="M12 3a9 9 0 010 18V3z"></path>
    <path d="M12 12a3 3 0 11-3-3"></path>
  </svg>
);

export const EnergieIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
  </svg>
);

export const ClockIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M12 6v6l4 2"></path>
  </svg>
);

export const ChevronUpIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 15l7-7 7 7"></path>
  </svg>
);

export const PlusCircleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 8v8M8 12h8"></path>
    </svg>
);

export const AttackIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15.536 8.464a5 5 0 010 7.072M20 4l-6 6"></path>
        <path d="M12 12l6 6M4 20l6-6"></path>
    </svg>
);
// Sidebar Icons
export const BaseIcon: React.FC<IconProps> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><path d="M9 22V12h6v10"></path></svg>;
export const MapIcon: React.FC<IconProps> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"></path><path d="M8 2v16M16 6v16"></path></svg>;
export const AllianceIcon: React.FC<IconProps> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>;
export const MarketIcon: React.FC<IconProps> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18"></path><path d="M16 10a4 4 0 01-8 0"></path></svg>;
export const ShipyardIcon: React.FC<IconProps> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 21l.62-4.37a2 2 0 011.94-1.63H12v2H4.56l-.4 2.8M22 15.61l-1-3.61-3 1.39-4-1.4-4 1.4-3-1.39-1 3.61a2 2 0 001.94 2.39h14.12a2 2 0 001.94-2.39zM12 12.01V2.5l7 4.5-7 4.51z"></path></svg>;
export const ResearchIcon: React.FC<IconProps> = ({ className }) => <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 21l-8-4.5v-9l8-4.5 8 4.5v9L12 21z"></path><path d="M12 21V12l8-4.5"></path><path d="M12 12L4 7.5"></path><path d="M16.5 9.4L7.5 4.6"></path></svg>;
