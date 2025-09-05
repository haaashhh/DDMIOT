import React, { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  AlertTriangle, 
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Eye,
  Check,
  MessageSquare,
  Server,
  Archive
} from 'lucide-react';
import { Alert, AlertType, AlertCategory, AlertStatus } from '../types';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Alerts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<AlertType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<AlertStatus | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<AlertCategory | 'all'>('all');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  
  const { 
    data: alerts, 
    loading, 
    error, 
    refetch 
  } = useApi<Alert[]>(() => 
    apiService.getAlerts({
      type: typeFilter === 'all' ? undefined : typeFilter,
      status: statusFilter === 'all' ? undefined : statusFilter,
      category: categoryFilter === 'all' ? undefined : categoryFilter
    })
  );

  const filteredAlerts = (alerts || []).filter(alert => 
    alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (alert.server?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (alert.rack_id || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeIcon = (type: AlertType) => {
    switch (type) {
      case 'CRITICAL': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'WARNING': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'INFO': return <Info className="h-5 w-5 text-blue-500" />;
      default: return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: AlertType) => {
    switch (type) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'WARNING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'INFO': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: AlertStatus) => {
    switch (status) {
      case 'ACTIVE': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'ACKNOWLEDGED': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'RESOLVED': return <CheckCircle className="h-4 w-4 text-green-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: AlertStatus) => {
    switch (status) {
      case 'ACTIVE': return 'bg-red-100 text-red-800 border-red-200';
      case 'ACKNOWLEDGED': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RESOLVED': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: AlertCategory) => {
    switch (category) {
      case 'HARDWARE': return <Server className="h-4 w-4" />;
      case 'NETWORK': return <Archive className="h-4 w-4" />;
      case 'SECURITY': return <AlertTriangle className="h-4 w-4" />;
      case 'ENVIRONMENT': return <AlertCircle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const handleAcknowledge = async (alertId: string) => {
    try {
      await apiService.acknowledgeAlert(alertId);
      refetch();
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const handleResolve = async (alertId: string) => {
    try {
      await apiService.resolveAlert(alertId, resolutionNote);
      setSelectedAlert(null);
      setResolutionNote('');
      refetch();
    } catch (error) {
      console.error('Error resolving alert:', error);
    }
  };

  const alertCounts = {
    critical: (alerts || []).filter(a => a.alert_type === 'CRITICAL' && a.status === 'ACTIVE').length,
    warning: (alerts || []).filter(a => a.alert_type === 'WARNING' && a.status === 'ACTIVE').length,
    info: (alerts || []).filter(a => a.alert_type === 'INFO' && a.status === 'ACTIVE').length,
    total: (alerts || []).length,
  };

  if (loading && !alerts) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement des alertes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <AlertTriangle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement des alertes
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refetch}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Alertes</h1>
          <p className="text-gray-600">
            Gestion des alertes système ({alertCounts.total} total)
          </p>
        </div>
        
        <button
          onClick={refetch}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualiser
        </button>
      </div>

      {/* Alert Count Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Critiques</p>
              <p className="text-2xl font-bold text-red-900">{alertCounts.critical}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Avertissements</p>
              <p className="text-2xl font-bold text-yellow-900">{alertCounts.warning}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Informations</p>
              <p className="text-2xl font-bold text-blue-900">{alertCounts.info}</p>
            </div>
            <Info className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{alertCounts.total}</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par titre, description, serveur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as AlertType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="CRITICAL">Critique</option>
              <option value="WARNING">Avertissement</option>
              <option value="INFO">Information</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AlertStatus | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="ACTIVE">Actif</option>
              <option value="ACKNOWLEDGED">Acquitté</option>
              <option value="RESOLVED">Résolu</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as AlertCategory | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les catégories</option>
              <option value="HARDWARE">Matériel</option>
              <option value="NETWORK">Réseau</option>
              <option value="SECURITY">Sécurité</option>
              <option value="ENVIRONMENT">Environnement</option>
            </select>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des Alertes ({filteredAlerts.length})
          </h3>
        </div>
        
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune alerte trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || typeFilter !== 'all' || statusFilter !== 'all' || categoryFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucune alerte active dans le système'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredAlerts.map((alert) => (
              <div key={alert.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Alert Header */}
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(alert.alert_type)}
                      <h4 className="text-lg font-medium text-gray-900">{alert.title}</h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(alert.alert_type)}`}>
                        {alert.alert_type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                        {alert.status === 'ACTIVE' && 'Actif'}
                        {alert.status === 'ACKNOWLEDGED' && 'Acquitté'}
                        {alert.status === 'RESOLVED' && 'Résolu'}
                      </span>
                    </div>

                    {/* Alert Description */}
                    <p className="text-gray-600">{alert.description}</p>

                    {/* Alert Details */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(alert.category)}
                        <span>
                          {alert.category === 'HARDWARE' && 'Matériel'}
                          {alert.category === 'NETWORK' && 'Réseau'}
                          {alert.category === 'SECURITY' && 'Sécurité'}
                          {alert.category === 'ENVIRONMENT' && 'Environnement'}
                        </span>
                      </div>
                      
                      {alert.server && (
                        <div>
                          <span className="font-medium">Serveur:</span> {alert.server.name}
                        </div>
                      )}
                      
                      {alert.rack_id && (
                        <div>
                          <span className="font-medium">Rack:</span> {alert.rack_id}
                        </div>
                      )}
                      
                      <div>
                        <span className="font-medium">Créé:</span> {new Date(alert.created_at).toLocaleString('fr-FR')}
                      </div>
                    </div>

                    {/* Values if present */}
                    {(alert.current_value !== undefined || alert.threshold_value !== undefined) && (
                      <div className="flex items-center space-x-4 text-sm">
                        {alert.current_value !== undefined && (
                          <div className="bg-gray-100 px-3 py-1 rounded">
                            <span className="font-medium">Valeur actuelle:</span> {alert.current_value}
                          </div>
                        )}
                        {alert.threshold_value !== undefined && (
                          <div className="bg-gray-100 px-3 py-1 rounded">
                            <span className="font-medium">Seuil:</span> {alert.threshold_value}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    
                    {alert.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-md"
                        title="Acquitter"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                    )}
                    
                    {(alert.status === 'ACTIVE' || alert.status === 'ACKNOWLEDGED') && (
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-md"
                        title="Résoudre"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Alert Details Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails de l'Alerte
              </h3>
              <button
                onClick={() => setSelectedAlert(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-4">
              <div className="flex items-center space-x-3">
                {getTypeIcon(selectedAlert.alert_type)}
                <h4 className="text-xl font-medium text-gray-900">{selectedAlert.title}</h4>
              </div>

              <p className="text-gray-600">{selectedAlert.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Type</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(selectedAlert.alert_type)}`}>
                      {selectedAlert.alert_type}
                    </span>
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-gray-500">Statut</dt>
                  <dd className="mt-1">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedAlert.status)}`}>
                      {selectedAlert.status === 'ACTIVE' && 'Actif'}
                      {selectedAlert.status === 'ACKNOWLEDGED' && 'Acquitté'}
                      {selectedAlert.status === 'RESOLVED' && 'Résolu'}
                    </span>
                  </dd>
                </div>
              </div>

              {selectedAlert.resolution_note && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Note de résolution</dt>
                  <dd className="mt-1 text-sm text-gray-900 bg-gray-100 p-3 rounded">
                    {selectedAlert.resolution_note}
                  </dd>
                </div>
              )}

              {(selectedAlert.status === 'ACTIVE' || selectedAlert.status === 'ACKNOWLEDGED') && (
                <div className="border-t pt-4">
                  <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-2">
                    Note de résolution
                  </label>
                  <textarea
                    id="resolution"
                    rows={3}
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Décrivez comment cette alerte a été résolue..."
                  />
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Fermer
              </button>
              
              {selectedAlert.status === 'ACTIVE' && (
                <button
                  onClick={() => handleAcknowledge(selectedAlert.id)}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md text-sm font-medium hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                >
                  Acquitter
                </button>
              )}
              
              {(selectedAlert.status === 'ACTIVE' || selectedAlert.status === 'ACKNOWLEDGED') && (
                <button
                  onClick={() => handleResolve(selectedAlert.id)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Résoudre
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alerts;