import React from 'react';
import { LucideIcon } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {Icon && (
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon className="w-8 h-8 text-gray-400" />
        </div>
      )}
      
      <h3 className="text-xl font-bold text-dark mb-2">{title}</h3>
      
      {description && (
        <p className="text-dark/60 max-w-md mx-auto mb-6">{description}</p>
      )}
      
      {action && (
        <Button onClick={action.onClick} variant="accent">
          {action.label}
        </Button>
      )}
    </div>
  );
}
