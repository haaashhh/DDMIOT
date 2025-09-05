import React, { useState } from 'react';
import { 
  RefreshCw, 
  Search, 
  Archive,
  Server,
  Activity,
  Battery,
  Eye,
  Edit,
  Trash2,
  Plus,
  Zap
} from 'lucide-react';
import { Rack } from '../types';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Racks: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState<string>('all');
  const [selectedRack, setSelectedRack] = useState<Rack | null>(null);
  const [rackDetails, setRackDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const { 
    data: racks, 
    loading, 
    error, 
    refetch 
  } = useApi<Rack[]>(() => 
    apiService.getRacks(zoneFilter === 'all' ? undefined : zoneFilter)
  );

  const filteredRacks = (racks || []).filter(rack => 
    rack.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
    rack.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const zones = Array.from(new Set((racks || []).map(rack => rack.zone))).sort();

  const fetchRackDetails = async (rack: Rack) => {
    setSelectedRack(rack);
    setLoadingDetails(true);
    try {
      const details = await apiService.getRackMetrics(rack.id);
      const capacity = await apiService.getRackCapacity(rack.id);
      setRackDetails({ ...details, capacity: capacity.capacity_info });
    } catch (error) {
      console.error('Error fetching rack details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const calculateUtilization = (used: number, total: number) => {
    return total > 0 ? Math.round((used / total) * 100) : 0;
  };

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading && !racks) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement des racks..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <Archive className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement des racks
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

  const rackStats = {
    totalRacks: racks?.length || 0,
    zones: zones.length,
    totalPowerCapacity: (racks || []).reduce((sum, rack) => sum + rack.power_capacity, 0),
    averagePowerCapacity: racks?.length ? Math.round(((racks || []).reduce((sum, rack) => sum + rack.power_capacity, 0) / racks.length)) : 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Racks</h1>
          <p className="text-gray-600">
            Gestion et surveillance de {rackStats.totalRacks} rack{rackStats.totalRacks > 1 ? 's' : ''} dans {rackStats.zones} zone{rackStats.zones > 1 ? 's' : ''}
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
            Nouveau Rack
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Racks</p>
              <p className="text-2xl font-bold text-blue-900">{rackStats.totalRacks}</p>
            </div>
            <Archive className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">Zones</p>
              <p className="text-2xl font-bold text-green-900">{rackStats.zones}</p>
            </div>
            <Activity className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-yellow-600">Puissance Totale</p>
              <p className="text-2xl font-bold text-yellow-900">{rackStats.totalPowerCapacity.toLocaleString()}W</p>
            </div>
            <Zap className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Puissance Moyenne</p>
              <p className="text-2xl font-bold text-purple-900">{rackStats.averagePowerCapacity.toLocaleString()}W</p>
            </div>
            <Battery className="h-8 w-8 text-purple-600" />
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
              placeholder="Rechercher par ID de rack ou zone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex items-center space-x-3">
            <select
              value={zoneFilter}
              onChange={(e) => setZoneFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Toutes les zones</option>
              {zones.map((zone) => (
                <option key={zone} value={zone}>{zone}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Racks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRacks.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Archive className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rack trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || zoneFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun rack configuré dans le système'
              }
            </p>
          </div>
        ) : (
          filteredRacks.map((rack) => (
            <div key={rack.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Archive className="h-8 w-8 text-blue-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{rack.id}</h3>
                    <p className="text-sm text-gray-500">Zone: {rack.zone}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => fetchRackDetails(rack)}
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

              <div className="space-y-4">
                {/* Rack Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Position:</span>
                    <span className="ml-2 font-medium">{rack.position}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Hauteur:</span>
                    <span className="ml-2 font-medium">{rack.height}</span>
                  </div>
                </div>

                {/* Power Capacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Capacité électrique</span>
                    <span className="font-medium">{rack.power_capacity.toLocaleString()}W</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-yellow-500 h-2 rounded-full" 
                        style={{ width: '60%' }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500">60%</span>
                  </div>
                </div>

                {/* Server Count */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-600">Serveurs</span>
                  </div>
                  <span className="text-sm font-medium">-</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => fetchRackDetails(rack)}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none"
                >
                  Voir les détails complets
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Rack Details Modal */}
      {selectedRack && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails du Rack: {selectedRack.id}
              </h3>
              <button
                onClick={() => {
                  setSelectedRack(null);
                  setRackDetails(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {loadingDetails ? (
                <div className="text-center py-8">
                  <LoadingSpinner size="md" text="Chargement des détails du rack..." />
                </div>
              ) : (
                <>
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Informations Générales</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">ID Rack:</dt>
                          <dd className="text-sm font-medium text-gray-900">{selectedRack.id}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Zone:</dt>
                          <dd className="text-sm font-medium text-gray-900">{selectedRack.zone}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Position:</dt>
                          <dd className="text-sm font-medium text-gray-900">{selectedRack.position}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Hauteur:</dt>
                          <dd className="text-sm font-medium text-gray-900">{selectedRack.height}</dd>
                        </div>
                      </dl>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Capacité Électrique</h4>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Capacité Max:</dt>
                          <dd className="text-sm font-medium text-gray-900">
                            {selectedRack.power_capacity.toLocaleString()}W
                          </dd>
                        </div>
                        {rackDetails?.capacity && (
                          <>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Utilisée:</dt>
                              <dd className="text-sm font-medium text-gray-900">
                                {rackDetails.capacity.power_used?.toLocaleString() || 0}W
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Disponible:</dt>
                              <dd className="text-sm font-medium text-gray-900">
                                {rackDetails.capacity.power_available?.toLocaleString() || selectedRack.power_capacity.toLocaleString()}W
                              </dd>
                            </div>
                            <div className="flex justify-between">
                              <dt className="text-sm text-gray-500">Utilisation:</dt>
                              <dd className="text-sm font-medium text-gray-900">
                                {rackDetails.capacity.power_utilization_percentage || 0}%
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>
                  </div>

                  {/* Capacity Visualization */}
                  {rackDetails?.capacity && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Visualisation de la Capacité</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Units Capacity */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Unités (U)</span>
                            <span className="text-sm font-medium text-gray-900">
                              {rackDetails.capacity.used_units || 0} / {rackDetails.capacity.total_units || 42}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${getUtilizationColor(rackDetails.capacity.utilization_percentage || 0)}`}
                              style={{ width: `${rackDetails.capacity.utilization_percentage || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{rackDetails.capacity.utilization_percentage || 0}% d'occupation</p>
                        </div>

                        {/* Power Capacity */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Puissance (W)</span>
                            <span className="text-sm font-medium text-gray-900">
                              {rackDetails.capacity.power_used?.toLocaleString() || 0} / {selectedRack.power_capacity.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                            <div 
                              className={`h-3 rounded-full transition-all duration-300 ${getUtilizationColor(rackDetails.capacity.power_utilization_percentage || 0)}`}
                              style={{ width: `${rackDetails.capacity.power_utilization_percentage || 0}%` }}
                            ></div>
                          </div>
                          <p className="text-xs text-gray-500">{rackDetails.capacity.power_utilization_percentage || 0}% d'utilisation</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Servers List */}
                  {rackDetails?.servers && rackDetails.servers.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Serveurs dans ce Rack ({rackDetails.servers.length})</h4>
                      <div className="bg-gray-50 rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-200">
                          {rackDetails.servers.map((server: any, index: number) => (
                            <div key={server.id || index} className="px-4 py-3 flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Server className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{server.name || `Serveur ${index + 1}`}</p>
                                  <p className="text-xs text-gray-500">{server.position || `Position ${index + 1}`}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-xs text-gray-500">{server.status || 'Actif'}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setSelectedRack(null);
                  setRackDetails(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Modifier Rack
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Racks;