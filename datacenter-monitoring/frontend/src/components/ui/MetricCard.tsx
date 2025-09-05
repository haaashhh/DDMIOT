import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

export interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: 'success' | 'warning' | 'danger' | 'info';
}

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
      'p-6 rounded-2xl border-2 transition-all duration-300 hover:shadow-2xl transform hover:-translate-y-2 hover:scale-[1.02] cursor-pointer backdrop-blur-sm',
      colorClasses[color]
    )}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
            {title}
          </h3>
          <div className="flex items-baseline">
            <p className={clsx(
              'text-4xl font-bold tracking-tight leading-none',
              valueColorClasses[color]
            )}>
              {value}
            </p>
            {unit && (
              <span className="ml-3 text-xl font-semibold text-gray-600">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div className={clsx(
          'text-5xl opacity-90 transition-transform duration-300 hover:scale-110',
          iconColorClasses[color]
        )}>
          {icon}
        </div>
      </div>
      
      {trend && (
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm font-medium text-gray-600">
            <TrendIcon trend={trend} />
            <span className="ml-2">vs dernière heure</span>
          </div>
          <div className={clsx(
            'w-2 h-2 rounded-full animate-pulse',
            trend === 'up' ? 'bg-green-400' :
            trend === 'down' ? 'bg-red-400' :
            'bg-gray-400'
          )} />
        </div>
      )}
    </div>
  );
};

export default MetricCard;