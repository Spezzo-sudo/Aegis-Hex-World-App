import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  titleClassName?: string;
  contentClassName?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, title, titleClassName, contentClassName }) => {
  return (
    <div className={`bg-surface border border-grid rounded-xl shadow-lg shadow-black/20 relative ${className}`}>
        <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_0_1px_theme(colors.primary/0.1)] pointer-events-none"></div>
      {title && (
        <div className={`px-4 py-3 border-b border-grid ${titleClassName}`}>
          <h3 className="text-base font-semibold text-textHi tracking-wide">{title}</h3>
        </div>
      )}
      <div className={`p-4 relative ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};