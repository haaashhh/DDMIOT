import React, { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  Network as NetworkIcon, 
  Router,
  Shield,
  Activity,
  Eye,
  Edit,
  Trash2,
  Plus,
  Wifi,
  Cable
} from 'lucide-react';
import { NetworkDevice, DeviceType } from '../types';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Network: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');
  const [selectedDevice, setSelectedDevice] = useState<NetworkDevice | null>(null);
  
  const { 
    data: devices, 
    loading, 
    error, 
    refetch 
  } = useApi<NetworkDevice[]>(() => apiService.getNetworkDevices());

  const filteredDevices = (devices || []).filter(device => 
    (typeFilter === 'all' || device.device_type === typeFilter) &&
    (device.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     device.management_ip.includes(searchQuery) ||
     device.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
     device.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
     (device.rack_id || '').toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getDeviceIcon = (type: DeviceType) => {
    switch (type) {
      case 'switch': return <NetworkIcon className="h-5 w-5 text-blue-500" />;
      case 'router': return <Router className="h-5 w-5 text-green-500" />;
      case 'firewall': return <Shield className="h-5 w-5 text-red-500" />;
      default: return <NetworkIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getDeviceColor = (type: DeviceType) => {
    switch (type) {
      case 'switch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'router': return 'bg-green-100 text-green-800 border-green-200';
      case 'firewall': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'up':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'down':
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const deviceCounts = {
    switch: (devices || []).filter(d => d.device_type === 'switch').length,
    router: (devices || []).filter(d => d.device_type === 'router').length,
    firewall: (devices || []).filter(d => d.device_type === 'firewall').length,
    total: (devices || []).length,
  };

  const calculatePortUtilization = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  if (loading && !devices) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement des équipements réseau..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <NetworkIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement des équipements réseau
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
          <h1 className="text-3xl font-bold text-gray-900">Équipements Réseau</h1>
          <p className="text-gray-600">
            Gestion et surveillance de {deviceCounts.total} équipement{deviceCounts.total > 1 ? 's' : ''} réseau
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={refetch}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </button>
          
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <Plus className="w-4 h-4 mr-2" />
            Nouvel Équipement
          </button>
        </div>
      </div>

      {/* Device Type Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Commutateurs</p>
              <p className="text-2xl font-bold text-blue-900">{deviceCounts.switch}</p>
            </div>
            <NetworkIcon className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Routeurs</p>
              <p className="text-2xl font-bold text-green-900">{deviceCounts.router}</p>
            </div>
            <Router className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-red-50 to-rose-50 border-2 border-red-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-red-600">Pare-feu</p>
              <p className="text-2xl font-bold text-red-900">{deviceCounts.firewall}</p>
            </div>
            <Shield className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 border-2 border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{deviceCounts.total}</p>
            </div>
            <Activity className="h-8 w-8 text-gray-600" />
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
              placeholder="Rechercher par nom, IP, rack, marque..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as DeviceType | 'all')}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Tous les types</option>
              <option value="switch">Commutateur</option>
              <option value="router">Routeur</option>
              <option value="firewall">Pare-feu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Network Devices List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des Équipements ({filteredDevices.length})
          </h3>
        </div>
        
        {filteredDevices.length === 0 ? (
          <div className="text-center py-12">
            <NetworkIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun équipement trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || typeFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun équipement réseau configuré dans le système'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDevices.map((device) => (
              <div key={device.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Device Basic Info */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getDeviceIcon(device.device_type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {device.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {device.management_ip}
                        </p>
                      </div>
                    </div>

                    {/* Device Type & Brand */}
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDeviceColor(device.device_type)}`}>
                        {device.device_type === 'switch' && 'Commutateur'}
                        {device.device_type === 'router' && 'Routeur'}
                        {device.device_type === 'firewall' && 'Pare-feu'}
                      </span>
                      <p className="text-xs text-gray-500">
                        {device.brand} {device.model}
                      </p>
                    </div>

                    {/* Ports Info */}
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Cable className="h-3 w-3 mr-1" />
                        {device.ports_used}/{device.ports_total} ports
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${calculatePortUtilization(device.ports_used, device.ports_total)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500">
                        {calculatePortUtilization(device.ports_used, device.ports_total)}% utilisé
                      </p>
                    </div>

                    {/* Status & Location */}
                    <div className="space-y-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(device.status)}`}>
                        {device.status}
                      </span>
                      {device.rack_id && (
                        <p className="text-xs text-gray-500">
                          Rack: <span className="font-medium">{device.rack_id}</span>
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        VLANs: {device.vlans.length > 0 ? device.vlans.join(', ') : 'Aucun'}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedDevice(device)}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-md"
                      title="Voir les détails"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-green-500 hover:bg-green-50 rounded-md"
                      title="Modifier"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Device Details Modal */}
      {selectedDevice && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails de l'Équipement: {selectedDevice.name}
              </h3>
              <button
                onClick={() => setSelectedDevice(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Informations Générales</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Nom:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedDevice.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Type:</dt>
                      <dd>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getDeviceColor(selectedDevice.device_type)}`}>
                          {selectedDevice.device_type === 'switch' && 'Commutateur'}
                          {selectedDevice.device_type === 'router' && 'Routeur'}
                          {selectedDevice.device_type === 'firewall' && 'Pare-feu'}
                        </span>
                      </dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">IP de Gestion:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedDevice.management_ip}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Statut:</dt>
                      <dd>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedDevice.status)}`}>
                          {selectedDevice.status}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Spécifications</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Marque:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedDevice.brand}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Modèle:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedDevice.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Rack:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedDevice.rack_id || 'Non assigné'}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Ports Total:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedDevice.ports_total}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Ports Utilisés:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedDevice.ports_used}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Port Utilization */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Utilisation des Ports</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      {selectedDevice.ports_used} / {selectedDevice.ports_total} ports utilisés
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {calculatePortUtilization(selectedDevice.ports_used, selectedDevice.ports_total)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${calculatePortUtilization(selectedDevice.ports_used, selectedDevice.ports_total)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* VLANs */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">VLANs Configurés</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  {selectedDevice.vlans.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {selectedDevice.vlans.map((vlan) => (
                        <span 
                          key={vlan} 
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          VLAN {vlan}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Aucun VLAN configuré</p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedDevice(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Modifier Configuration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Network;