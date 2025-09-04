import React from 'react';
import { clsx } from 'clsx';
import { ServerStatus } from '../../types';

interface StatusIndicatorProps {
  status: ServerStatus;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const statusConfig = {
  active: {
    color: 'bg-green-500',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    text: 'Actif',
    pulse: 'animate-pulse',
  },
  maintenance: {
    color: 'bg-yellow-500',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    text: 'Maintenance',
    pulse: '',
  },
  error: {
    color: 'bg-red-500',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    text: 'Erreur',
    pulse: 'animate-pulse',
  },
  offline: {
    color: 'bg-gray-400',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    text: 'Hors ligne',
    pulse: '',
  },
};

const sizeClasses = {
  sm: {
    dot: 'w-2 h-2',
    container: 'px-2 py-1 text-xs',
  },
  md: {
    dot: 'w-3 h-3',
    container: 'px-2.5 py-1 text-sm',
  },
  lg: {
    dot: 'w-4 h-4',
    container: 'px-3 py-1.5 text-base',
  },
};

const StatusIndicator: React.FC<StatusIndicatorProps> = ({ 
  status, 
  size = 'md', 
  showText = true 
}) => {
  const config = statusConfig[status];
  const sizeConfig = sizeClasses[size];

  if (showText) {
    return (
      <span className={clsx(
        'inline-flex items-center rounded-full font-medium',
        sizeConfig.container,
        config.bgColor,
        config.textColor
      )}>
        <span className={clsx(
          'rounded-full mr-2',
          sizeConfig.dot,
          config.color,
          config.pulse
        )} />
        {config.text}
      </span>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <span
        className={clsx(
          'rounded-full',
          sizeConfig.dot,
          config.color,
          config.pulse
        )}
        title={config.text}
      />
    </div>
  );
};

export default StatusIndicator;