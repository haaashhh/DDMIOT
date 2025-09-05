import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  Search, 
  Filter, 
  Server as ServerIcon, 
  Activity, 
  HardDrive,
  Cpu,
  MemoryStick,
  Thermometer,
  Power,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent, 
  Fade, 
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import { Server, ServerStatus } from '../types';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Servers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ServerStatus | 'all'>('all');
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  
  const { 
    data: serverData, 
    loading, 
    error, 
    refetch 
  } = useApi<{ servers: Server[]; total: number }>(() => 
    apiService.getServers({ 
      status: statusFilter === 'all' ? undefined : statusFilter 
    })
  );

  const servers = serverData?.servers || [];
  const totalServers = serverData?.total || 0;

  // Filter servers based on search query
  const filteredServers = servers.filter(server => 
    server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.ip_address.includes(searchQuery) ||
    server.rack_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    server.model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: ServerStatus) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 border-red-200';
      case 'offline': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: ServerStatus) => {
    switch (status) {
      case 'active': return <Activity className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <HardDrive className="h-4 w-4 text-yellow-500" />;
      case 'error': return <ServerIcon className="h-4 w-4 text-red-500" />;
      case 'offline': return <Power className="h-4 w-4 text-gray-500" />;
      default: return <ServerIcon className="h-4 w-4 text-gray-500" />;
    }
  };

  const statusCounts = {
    active: servers.filter(s => s.status === 'active').length,
    maintenance: servers.filter(s => s.status === 'maintenance').length,
    error: servers.filter(s => s.status === 'error').length,
    offline: servers.filter(s => s.status === 'offline').length,
  };

  if (loading && !serverData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Chargement des serveurs..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <ServerIcon className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Erreur de chargement des serveurs
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
    <Fade in={true} timeout={600}>
      <Box sx={{ minHeight: '100vh' }}>
        <div className="space-y-8">
          {/* Header Section */}
          <Box sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 3,
            p: 4,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              zIndex: 0
            }
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 700, 
                    mb: 1,
                    background: 'linear-gradient(45deg, #ffffff 30%, #f0f4ff 90%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Serveurs
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Gestion et surveillance de {totalServers} serveur{totalServers > 1 ? 's' : ''}
                  </Typography>
                </div>
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    onClick={refetch}
                    disabled={loading}
                    variant="contained"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      color: 'white',
                      fontWeight: 500,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:disabled': {
                        opacity: 0.6
                      }
                    }}
                    startIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
                  >
                    Actualiser
                  </Button>
                  
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      color: '#667eea',
                      fontWeight: 600,
                      px: 3,
                      py: 1.5,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 1)',
                        transform: 'scale(1.05)'
                      }
                    }}
                    startIcon={<Plus className="w-4 h-4" />}
                  >
                    Nouveau Serveur
                  </Button>
                </Box>
              </div>
            </Box>
          </Box>

          {/* Status Overview Cards */}
          <Grid container spacing={3}>
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%)',
                border: '2px solid #b8dabc',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(76, 175, 80, 0.3)' 
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" sx={{ color: '#2e7d32', fontWeight: 600, mb: 1 }}>
                        Actifs
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#1b5e20', fontWeight: 700 }}>
                        {statusCounts.active}
                      </Typography>
                    </div>
                    <Activity className="h-10 w-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                border: '2px solid #ffeaa7',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(255, 193, 7, 0.3)' 
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" sx={{ color: '#d68910', fontWeight: 600, mb: 1 }}>
                        Maintenance
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#b7950b', fontWeight: 700 }}>
                        {statusCounts.maintenance}
                      </Typography>
                    </div>
                    <HardDrive className="h-10 w-10 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%)',
                border: '2px solid #f5c6cb',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(244, 67, 54, 0.3)' 
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" sx={{ color: '#c82333', fontWeight: 600, mb: 1 }}>
                        Erreurs
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#a71e2a', fontWeight: 700 }}>
                        {statusCounts.error}
                      </Typography>
                    </div>
                    <ServerIcon className="h-10 w-10 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Card sx={{ 
                background: 'linear-gradient(135deg, #e2e3e5 0%, #d6d8db 100%)',
                border: '2px solid #d6d8db',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 25px rgba(108, 117, 125, 0.3)' 
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <Typography variant="body2" sx={{ color: '#6c757d', fontWeight: 600, mb: 1 }}>
                        Hors ligne
                      </Typography>
                      <Typography variant="h4" sx={{ color: '#495057', fontWeight: 700 }}>
                        {statusCounts.offline}
                      </Typography>
                    </div>
                    <Power className="h-10 w-10 text-gray-600" />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Search and Filter Bar */}
          <Card sx={{ 
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid rgba(255, 255, 255, 0.8)'
          }}>
            <CardContent sx={{ p: 3 }}>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, IP, rack, marque..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 w-full border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as ServerStatus | 'all')}
                    className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-300 bg-gray-50 hover:bg-white transition-all duration-200"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="error">Erreur</option>
                    <option value="offline">Hors ligne</option>
                  </select>
                  
                  <Button
                    onClick={() => setShowFilters(!showFilters)}
                    variant="outlined"
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1.5,
                      borderColor: '#e5e7eb',
                      color: '#6b7280',
                      '&:hover': {
                        borderColor: '#3b82f6',
                        backgroundColor: '#eff6ff'
                      }
                    }}
                    startIcon={<Filter className="w-4 h-4" />}
                  >
                    Filtres
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

      {/* Server List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Liste des Serveurs ({filteredServers.length})
          </h3>
        </div>
        
        {filteredServers.length === 0 ? (
          <div className="text-center py-12">
            <ServerIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun serveur trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all' 
                ? 'Essayez de modifier vos critères de recherche'
                : 'Aucun serveur configuré dans le système'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredServers.map((server) => (
              <div key={server.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4">
                    {/* Server Basic Info */}
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {getStatusIcon(server.status)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {server.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {server.ip_address}
                        </p>
                      </div>
                    </div>

                    {/* Server Specs */}
                    <div className="space-y-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Cpu className="h-3 w-3 mr-1" />
                        {server.cpu_specs}
                      </div>
                      <div className="flex items-center text-xs text-gray-500">
                        <MemoryStick className="h-3 w-3 mr-1" />
                        {server.memory_specs}
                      </div>
                    </div>

                    {/* Rack & Location */}
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500">
                        Rack: <span className="font-medium">{server.rack_id}</span>
                      </p>
                      <p className="text-xs text-gray-500">
                        {server.brand} {server.model}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(server.status)}`}>
                        {server.status === 'active' && 'Actif'}
                        {server.status === 'maintenance' && 'Maintenance'}
                        {server.status === 'error' && 'Erreur'}
                        {server.status === 'offline' && 'Hors ligne'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => setSelectedServer(server)}
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

      {/* Server Details Modal/Panel */}
      {selectedServer && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails du Serveur: {selectedServer.name}
              </h3>
              <button
                onClick={() => setSelectedServer(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-6 py-4 space-y-6">
              {/* Status and Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Informations Générales</h4>
                  <dl className="space-y-2">
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Nom:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.name}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Adresse IP:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.ip_address}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Adresse MAC:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.mac_address}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">VLAN:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.vlan_id}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Statut:</dt>
                      <dd>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedServer.status)}`}>
                          {selectedServer.status === 'active' && 'Actif'}
                          {selectedServer.status === 'maintenance' && 'Maintenance'}
                          {selectedServer.status === 'error' && 'Erreur'}
                          {selectedServer.status === 'offline' && 'Hors ligne'}
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
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.brand}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Modèle:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.model}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">OS:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.operating_system}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Type:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.server_type}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-sm text-gray-500">Rack:</dt>
                      <dd className="text-sm font-medium text-gray-900">{selectedServer.rack_id}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Hardware Specs */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Configuration Matérielle</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Cpu className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-900">Processeur</span>
                    </div>
                    <p className="text-sm text-blue-700">{selectedServer.cpu_specs}</p>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <MemoryStick className="h-5 w-5 text-green-600" />
                      <span className="font-medium text-green-900">Mémoire</span>
                    </div>
                    <p className="text-sm text-green-700">{selectedServer.memory_specs}</p>
                  </div>
                  
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <HardDrive className="h-5 w-5 text-purple-600" />
                      <span className="font-medium text-purple-900">Stockage</span>
                    </div>
                    <p className="text-sm text-purple-700">{selectedServer.storage_specs}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setSelectedServer(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Fermer
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Voir Métriques
              </button>
            </div>
            </div>
          </div>
        )}
        </div>
      </Box>
    </Fade>
  );
};

export default Servers;