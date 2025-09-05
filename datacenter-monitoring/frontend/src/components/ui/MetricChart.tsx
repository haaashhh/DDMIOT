import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import { format } from 'date-fns';

export interface MetricPoint {
  timestamp: string;
  value: number;
}

export interface ChartProps {
  data: MetricPoint[];
  title: string;
  color: string;
  unit: string;
}

interface MetricChartProps extends ChartProps {
  type?: 'line' | 'area' | 'bar';
  height?: number;
}

const formatXAxisLabel = (tickItem: string) => {
  try {
    return format(new Date(tickItem), 'HH:mm');
  } catch {
    return tickItem;
  }
};

const CustomTooltip = ({ active, payload, label, unit }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm text-gray-600 mb-1">
          {format(new Date(label), 'HH:mm:ss')}
        </p>
        <p className="text-sm font-semibold">
          <span className="text-blue-600">
            {payload[0].value} {unit}
          </span>
        </p>
      </div>
    );
  }
  return null;
};

const MetricChart: React.FC<MetricChartProps> = ({ 
  data, 
  title, 
  color = '#3b82f6', 
  unit,
  type = 'line',
  height = 300
}) => {
  const chartData = data.map(point => ({
    ...point,
    timestamp: new Date(point.timestamp).toISOString(),
  }));

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (type) {
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${title})`}
            />
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Bar dataKey="value" fill={color} radius={[2, 2, 0, 0]} />
          </BarChart>
        );

      default: // line
        return (
          <LineChart {...commonProps}>
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={formatXAxisLabel}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <Tooltip content={<CustomTooltip unit={unit} />} />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={color} 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        );
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {format(new Date(), 'HH:mm:ss')}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default MetricChart;