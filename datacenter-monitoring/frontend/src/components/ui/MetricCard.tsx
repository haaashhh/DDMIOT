import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';
import { MetricCardProps } from '../../types';

const TrendIcon: React.FC<{ trend?: 'up' | 'down' | 'stable' }> = ({ trend }) => {
  const iconClass = "w-4 h-4";
  
  switch (trend) {
    case 'up':
      return <TrendingUp className={clsx(iconClass, "text-green-500")} />;
    case 'down':
      return <TrendingDown className={clsx(iconClass, "text-red-500")} />;
    case 'stable':
      return <Minus className={clsx(iconClass, "text-gray-500")} />;
    default:
      return null;
  }
};

const MetricCard: React.FC<MetricCardProps> = ({ 
  title, 
  value, 
  unit, 
  trend, 
  icon, 
  color = 'info'
}) => {
  const colorClasses = {
    success: 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:border-green-300',
    warning: 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-200 hover:border-yellow-300',
    danger: 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200 hover:border-red-300',
    info: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300',
  };

  const iconColorClasses = {
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
    info: 'text-blue-600',
  };

  const valueColorClasses = {
    success: 'text-green-900',
    warning: 'text-yellow-900',
    danger: 'text-red-900',
    info: 'text-blue-900',
  };

  return (
    <div className={clsx(
      'p-6 rounded-xl border-2 transition-all duration-200 hover:shadow-lg transform hover:-translate-y-1',
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </h3>
          <div className="flex items-baseline">
            <p className={clsx(
              'text-3xl font-bold tracking-tight',
              valueColorClasses[color]
            )}>
              {value}
            </p>
            {unit && (
              <span className="ml-2 text-lg font-medium text-gray-500">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div className={clsx('text-4xl opacity-80', iconColorClasses[color])}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center text-sm text-gray-600">
          <TrendIcon trend={trend} />
          <span className="ml-2">vs dernière heure</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;