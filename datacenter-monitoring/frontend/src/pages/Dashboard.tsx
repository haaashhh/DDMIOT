import React, { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Box, Container, Typography, Button, Alert, Fade, Skeleton } from '@mui/material';
import DashboardMetrics from '../components/dashboard/DashboardMetrics';
import MetricChart from '../components/ui/MetricChart';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { DashboardMetricsType } from '../components/dashboard/DashboardMetrics';
import { MetricPoint } from '../components/ui/MetricChart';
import { useApi } from '../hooks/useApi';
import { apiService } from '../services/api';

const Dashboard: React.FC = () => {
  const { 
    data: dashboardData, 
    loading, 
    error, 
    refetch 
  } = useApi<DashboardMetricsType>(() => apiService.getDashboardOverview());

  const [cpuMetrics, setCpuMetrics] = useState<MetricPoint[]>([]);
  const [temperatureMetrics, setTemperatureMetrics] = useState<MetricPoint[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Generate mock time series data for charts
  useEffect(() => {
    const generateMetrics = () => {
      const now = new Date();
      const cpuData: MetricPoint[] = [];
      const tempData: MetricPoint[] = [];

      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        
        cpuData.push({
          timestamp: timestamp.toISOString(),
          value: Math.random() * 30 + 40 + Math.sin(i * 0.5) * 15, // 40-85% range with variation
        });

        tempData.push({
          timestamp: timestamp.toISOString(),
          value: Math.random() * 10 + 30 + Math.sin(i * 0.3) * 5, // 25-45°C range
        });
      }

      setCpuMetrics(cpuData);
      setTemperatureMetrics(tempData);
      setLastUpdate(new Date());
    };

    generateMetrics();
    const interval = setInterval(generateMetrics, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    refetch();
    setLastUpdate(new Date());
  };

  if (loading && !dashboardData) {
    return (
      <Box 
        sx={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <LoadingSpinner size="lg" text="Chargement du tableau de bord..." />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        sx={{ 
          minHeight: '60vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          p: 4
        }}
      >
        <Alert 
          severity="error" 
          sx={{ maxWidth: 500, width: '100%' }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleRefresh}
              startIcon={<RefreshCw className="w-4 h-4" />}
            >
              Réessayer
            </Button>
          }
        >
          <Typography variant="h6" sx={{ mb: 1 }}>
            Erreur de chargement
          </Typography>
          <Typography variant="body2">
            {error}
          </Typography>
        </Alert>
      </Box>
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
                    Tableau de Bord
                  </Typography>
                  <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 400 }}>
                    Vue d'ensemble de votre infrastructure datacenter
                  </Typography>
                </div>
                
                <Button
                  onClick={handleRefresh}
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
              </div>
            </Box>
          </Box>

          {/* Metrics Cards */}
          {dashboardData && (
            <div className="transform transition-all duration-500">
              <DashboardMetrics metrics={dashboardData} loading={loading} />
            </div>
          )}

          {/* Charts Section */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, 
            gap: 4 
          }}>
            <Box sx={{ 
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <MetricChart
                data={cpuMetrics}
                title="Utilisation CPU - 24h"
                color="#3b82f6"
                unit="%"
                type="area"
              />
            </Box>
            
            <Box sx={{ 
              background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
              borderRadius: 3,
              p: 3,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <MetricChart
                data={temperatureMetrics}
                title="Température Moyenne - 24h"
                color="#ef4444"
                unit="°C"
                type="line"
              />
            </Box>
          </Box>

          {/* Recent Activity */}
          {dashboardData?.recent_activity && dashboardData.recent_activity.length > 0 && (
            <Box sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 3,
              p: 4,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)'
            }}>
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3,
                color: 'text.primary',
                background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Activité Récente
              </Typography>
              <div className="space-y-3">
                {dashboardData.recent_activity.map((activity, index) => (
                  <Fade in={true} timeout={300 + index * 100} key={index}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 2,
                      p: 2.5,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                      border: '1px solid rgba(255, 255, 255, 0.6)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                      }
                    }}>
                      <Box sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        mt: 1,
                        backgroundColor: 
                          activity.severity === 'high' ? 'error.main' :
                          activity.severity === 'medium' ? 'warning.main' :
                          'success.main',
                        boxShadow: `0 0 8px ${
                          activity.severity === 'high' ? 'rgba(244, 67, 54, 0.4)' :
                          activity.severity === 'medium' ? 'rgba(255, 152, 0, 0.4)' :
                          'rgba(76, 175, 80, 0.4)'
                        }`
                      }} />
                      <div className="flex-1">
                        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
                          {activity.message}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'text.secondary', mt: 0.5, display: 'block' }}>
                          {new Date(activity.timestamp).toLocaleString('fr-FR')}
                        </Typography>
                      </div>
                    </Box>
                  </Fade>
                ))}
              </div>
            </Box>
          )}

          {/* Last Update Info */}
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="caption" sx={{ 
              color: 'text.secondary',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 500
            }}>
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </Typography>
          </Box>
        </div>
      </Box>
    </Fade>
  );
};

export default Dashboard;