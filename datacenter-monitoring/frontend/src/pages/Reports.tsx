import React, { useState } from 'react';
import { 
  RefreshCw, 
  Download, 
  BarChart3,
  Calendar,
  FileText,
  TrendingUp,
  Activity,
  AlertTriangle,
  Server,
  Archive,
  Zap,
  Clock,
  Filter
} from 'lucide-react';
import MetricChart from '../components/ui/MetricChart';
import { MetricPoint } from '../components/ui/MetricChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';

interface ReportFilter {
  dateRange: string;
  reportType: string;
  format: string;
}

const Reports: React.FC = () => {
  const [filters, setFilters] = useState<ReportFilter>({
    dateRange: '7d',
    reportType: 'overview',
    format: 'pdf'
  });
  const [generating, setGenerating] = useState(false);

  // Mock data for charts
  const cpuTrendData: MetricPoint[] = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
    value: Math.random() * 30 + 40 + Math.sin(i * 0.5) * 15,
  }));

  const memoryTrendData: MetricPoint[] = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 60 * 60 * 1000).toISOString(),
    value: Math.random() * 20 + 50 + Math.sin(i * 0.3) * 10,
  }));

  const alertsTrendData: MetricPoint[] = Array.from({ length: 7 }, (_, i) => ({
    timestamp: new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.floor(Math.random() * 15) + 5,
  }));

  const powerConsumptionData: MetricPoint[] = Array.from({ length: 30 }, (_, i) => ({
    timestamp: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
    value: Math.random() * 5000 + 15000 + Math.sin(i * 0.2) * 2000,
  }));

  const handleGenerateReport = async () => {
    setGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setGenerating(false);
      // Here you would typically trigger a download
      console.log('Report generated:', filters);
    }, 3000);
  };

  const reportTypes = [
    { value: 'overview', label: 'Aperçu Général', icon: BarChart3 },
    { value: 'servers', label: 'Rapport Serveurs', icon: Server },
    { value: 'alerts', label: 'Rapport Alertes', icon: AlertTriangle },
    { value: 'capacity', label: 'Rapport Capacité', icon: Archive },
    { value: 'power', label: 'Rapport Énergie', icon: Zap },
    { value: 'performance', label: 'Performance', icon: Activity },
  ];

  const quickStats = {
    totalServers: 45,
    activeAlerts: 12,
    avgCpuUsage: 65,
    avgMemoryUsage: 78,
    powerConsumption: 18500,
    rackUtilization: 82,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rapports</h1>
          <p className="text-gray-600">
            Génération et analyse de rapports de performance du datacenter
          </p>
        </div>
        
        <button
          onClick={handleGenerateReport}
          disabled={generating}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Clock className="w-4 h-4 mr-2 animate-spin" />
              Génération...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Générer Rapport
            </>
          )}
        </button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-blue-600">Serveurs</p>
              <p className="text-lg font-bold text-blue-900">{quickStats.totalServers}</p>
            </div>
            <Server className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-red-600">Alertes</p>
              <p className="text-lg font-bold text-red-900">{quickStats.activeAlerts}</p>
            </div>
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-green-600">CPU Moy</p>
              <p className="text-lg font-bold text-green-900">{quickStats.avgCpuUsage}%</p>
            </div>
            <Activity className="h-5 w-5 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-yellow-600">RAM Moy</p>
              <p className="text-lg font-bold text-yellow-900">{quickStats.avgMemoryUsage}%</p>
            </div>
            <BarChart3 className="h-5 w-5 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-purple-600">Énergie</p>
              <p className="text-lg font-bold text-purple-900">{quickStats.powerConsumption.toLocaleString()}W</p>
            </div>
            <Zap className="h-5 w-5 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Racks</p>
              <p className="text-lg font-bold text-gray-900">{quickStats.rackUtilization}%</p>
            </div>
            <Archive className="h-5 w-5 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Report Configuration */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-4">
          <Filter className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">Configuration du Rapport</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Période
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1d">Dernières 24 heures</option>
              <option value="7d">7 derniers jours</option>
              <option value="30d">30 derniers jours</option>
              <option value="90d">90 derniers jours</option>
              <option value="custom">Période personnalisée</option>
            </select>
          </div>

          {/* Report Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de Rapport
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => setFilters({ ...filters, reportType: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {reportTypes.map((type) => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={filters.format}
              onChange={(e) => setFilters({ ...filters, format: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
      </div>

      {/* Available Report Types */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de Rapports Disponibles</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map((type) => {
            const IconComponent = type.icon;
            return (
              <div
                key={type.value}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  filters.reportType === type.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setFilters({ ...filters, reportType: type.value })}
              >
                <div className="flex items-center space-x-3">
                  <IconComponent className={`h-6 w-6 ${
                    filters.reportType === type.value ? 'text-blue-600' : 'text-gray-500'
                  }`} />
                  <div>
                    <h4 className={`font-medium ${
                      filters.reportType === type.value ? 'text-blue-900' : 'text-gray-900'
                    }`}>
                      {type.label}
                    </h4>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricChart
          data={cpuTrendData}
          title="Tendance CPU - 24h"
          color="#3b82f6"
          unit="%"
          type="area"
        />
        
        <MetricChart
          data={memoryTrendData}
          title="Utilisation Mémoire - 24h"
          color="#10b981"
          unit="%"
          type="line"
        />
        
        <MetricChart
          data={alertsTrendData}
          title="Alertes par Jour - 7 jours"
          color="#f59e0b"
          unit=""
          type="bar"
        />
        
        <MetricChart
          data={powerConsumptionData}
          title="Consommation Électrique - 30 jours"
          color="#8b5cf6"
          unit="W"
          type="area"
        />
      </div>

      {/* Recent Reports History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Rapports Récents</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {[
            {
              name: 'Rapport Performance Serveurs',
              type: 'Performance',
              date: '2025-09-04 09:30',
              format: 'PDF',
              size: '2.4 MB',
              status: 'Completed'
            },
            {
              name: 'Analyse Alertes Mensuelles',
              type: 'Alertes',
              date: '2025-09-03 14:15',
              format: 'Excel',
              size: '1.8 MB',
              status: 'Completed'
            },
            {
              name: 'Rapport Capacité Racks',
              type: 'Capacité',
              date: '2025-09-02 11:45',
              format: 'PDF',
              size: '3.1 MB',
              status: 'Completed'
            },
            {
              name: 'Consommation Énergétique',
              type: 'Énergie',
              date: '2025-09-01 16:20',
              format: 'CSV',
              size: '892 KB',
              status: 'Completed'
            },
          ].map((report, index) => (
            <div key={index} className="px-6 py-4 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{report.name}</h4>
                      <p className="text-sm text-gray-500">{report.type} • {report.date}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-900">{report.format}</p>
                    <p className="text-xs text-gray-500">{report.size}</p>
                  </div>
                  
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {report.status}
                  </span>
                  
                  <button className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generation Status */}
      {generating && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4">
                <LoadingSpinner size="lg" text="" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Génération du Rapport
              </h3>
              <p className="text-gray-600 mb-4">
                Votre rapport est en cours de génération. Cela peut prendre quelques minutes.
              </p>
              <div className="bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full transition-all duration-1000" style={{ width: '65%' }}></div>
              </div>
              <p className="text-sm text-gray-500 mt-2">65% terminé</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;