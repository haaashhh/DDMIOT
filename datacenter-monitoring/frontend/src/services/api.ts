import {
  ApiResponse,
  Server,
  Rack,
  Alert,
  NetworkDevice,
  ServerMetrics,
  DashboardMetrics,
  ServerFilters,
  AlertFilters,
} from '../types';

class ApiService {
  private baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

  private async fetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ApiResponse<T> = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'API request failed');
      }

      return data.data;
    } catch (error) {
      console.error(`API Error for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health Check
  async healthCheck(): Promise<any> {
    return this.fetch('/health');
  }

  // Server endpoints
  async getServers(filters?: ServerFilters): Promise<{ servers: Server[]; total: number }> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.rack_id) params.append('rack_id', filters.rack_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.fetch(`/servers${query}`);
  }

  async getServerById(serverId: string): Promise<Server> {
    return this.fetch(`/servers/${serverId}`);
  }

  async createServer(serverData: Partial<Server>): Promise<Server> {
    return this.fetch('/servers', {
      method: 'POST',
      body: JSON.stringify(serverData),
    });
  }

  async updateServer(serverId: string, serverData: Partial<Server>): Promise<Server> {
    return this.fetch(`/servers/${serverId}`, {
      method: 'PUT',
      body: JSON.stringify(serverData),
    });
  }

  async deleteServer(serverId: string): Promise<void> {
    return this.fetch(`/servers/${serverId}`, {
      method: 'DELETE',
    });
  }

  async getServerMetrics(serverId: string, hours: number = 24): Promise<ServerMetrics | ServerMetrics[]> {
    return this.fetch(`/servers/${serverId}/metrics?hours=${hours}`);
  }

  async getServerHealth(serverId: string): Promise<{
    server: Server;
    metrics: ServerMetrics;
    alerts: any[];
    health_score: number;
  }> {
    return this.fetch(`/servers/${serverId}/health`);
  }

  async updateServerStatus(serverId: string, status: string): Promise<Server> {
    return this.fetch(`/servers/${serverId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Rack endpoints
  async getRacks(zone?: string): Promise<Rack[]> {
    const query = zone ? `?zone=${zone}` : '';
    return this.fetch(`/racks${query}`);
  }

  async getRackById(rackId: string): Promise<Rack> {
    return this.fetch(`/racks/${rackId}`);
  }

  async createRack(rackData: Partial<Rack>): Promise<Rack> {
    return this.fetch('/racks', {
      method: 'POST',
      body: JSON.stringify(rackData),
    });
  }

  async updateRack(rackId: string, rackData: Partial<Rack>): Promise<Rack> {
    return this.fetch(`/racks/${rackId}`, {
      method: 'PUT',
      body: JSON.stringify(rackData),
    });
  }

  async deleteRack(rackId: string): Promise<void> {
    return this.fetch(`/racks/${rackId}`, {
      method: 'DELETE',
    });
  }

  async getRackServers(rackId: string): Promise<Server[]> {
    return this.fetch(`/racks/${rackId}/servers`);
  }

  async getRackMetrics(rackId: string): Promise<{
    rack_info: Rack;
    rack_metrics: any;
    servers: any[];
    summary: any;
  }> {
    return this.fetch(`/racks/${rackId}/metrics`);
  }

  async getRackCapacity(rackId: string): Promise<{
    rack: Rack;
    capacity_info: {
      total_units: number;
      used_units: number;
      free_units: number;
      utilization_percentage: number;
      power_used: number;
      power_available: number;
      power_utilization_percentage: number;
    };
  }> {
    return this.fetch(`/racks/${rackId}/capacity`);
  }

  // Alert endpoints
  async getAlerts(filters?: AlertFilters): Promise<Alert[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.server_id) params.append('server_id', filters.server_id);
    if (filters?.rack_id) params.append('rack_id', filters.rack_id);
    if (filters?.limit) params.append('limit', filters.limit.toString());
    if (filters?.offset) params.append('offset', filters.offset.toString());

    const query = params.toString() ? `?${params.toString()}` : '';
    return this.fetch(`/alerts${query}`);
  }

  async getAlertById(alertId: string): Promise<Alert> {
    return this.fetch(`/alerts/${alertId}`);
  }

  async createAlert(alertData: Partial<Alert>): Promise<Alert> {
    return this.fetch('/alerts', {
      method: 'POST',
      body: JSON.stringify(alertData),
    });
  }

  async acknowledgeAlert(alertId: string): Promise<Alert> {
    return this.fetch(`/alerts/${alertId}/acknowledge`, {
      method: 'PUT',
    });
  }

  async resolveAlert(alertId: string, resolutionNote?: string): Promise<Alert> {
    return this.fetch(`/alerts/${alertId}/resolve`, {
      method: 'PUT',
      body: JSON.stringify({ resolution_note: resolutionNote }),
    });
  }

  async deleteAlert(alertId: string): Promise<void> {
    return this.fetch(`/alerts/${alertId}`, {
      method: 'DELETE',
    });
  }

  async getActiveAlerts(): Promise<Alert[]> {
    return this.fetch('/alerts/active');
  }

  async getCriticalAlerts(): Promise<Alert[]> {
    return this.fetch('/alerts/critical');
  }

  async getAlertTrends(days: number = 7): Promise<{
    daily_counts: Array<{
      date: string;
      critical: number;
      warning: number;
      info: number;
      total: number;
    }>;
    category_breakdown: Array<{
      category: string;
      count: number;
    }>;
  }> {
    return this.fetch(`/alerts/trends?days=${days}`);
  }

  // Dashboard endpoints
  async getDashboardOverview(): Promise<DashboardMetrics> {
    return this.fetch('/dashboard/overview');
  }

  async getDashboardCapacity(): Promise<any> {
    return this.fetch('/dashboard/capacity');
  }

  async getDashboardAlerts(): Promise<any> {
    return this.fetch('/dashboard/alerts');
  }

  // Network Device endpoints
  async getNetworkDevices(): Promise<NetworkDevice[]> {
    return this.fetch('/network-devices');
  }

  async getNetworkDeviceById(deviceId: string): Promise<NetworkDevice> {
    return this.fetch(`/network-devices/${deviceId}`);
  }

  async createNetworkDevice(deviceData: Partial<NetworkDevice>): Promise<NetworkDevice> {
    return this.fetch('/network-devices', {
      method: 'POST',
      body: JSON.stringify(deviceData),
    });
  }

  async updateNetworkDevice(deviceId: string, deviceData: Partial<NetworkDevice>): Promise<NetworkDevice> {
    return this.fetch(`/network-devices/${deviceId}`, {
      method: 'PUT',
      body: JSON.stringify(deviceData),
    });
  }

  async deleteNetworkDevice(deviceId: string): Promise<void> {
    return this.fetch(`/network-devices/${deviceId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
export default apiService;