// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    timestamp?: string;
    total?: number;
    count?: number;
    limit?: number;
    offset?: number;
  };
  error?: any;
}

// Server Types
export type ServerStatus = 'active' | 'maintenance' | 'error' | 'offline';

export interface Server {
  id: string;
  name: string;
  rack_id: string;
  position?: string;
  server_type: string;
  operating_system: string;
  brand: string;
  model: string;
  cpu_specs: string;
  memory_specs: string;
  storage_specs: string;
  ip_address: string;
  mac_address: string;
  vlan_id: number;
  status: ServerStatus;
  cpu_baseline?: number;
  memory_baseline?: number;
  temp_idle?: number;
  power_idle?: number;
  created_at: string;
  updated_at: string;
  rack?: Rack;
}

// Rack Types
export interface Rack {
  id: string;
  zone: string;
  position: number;
  height: string;
  power_capacity: number;
  temperature?: number;
  servers_count: number;
  created_at: string;
  updated_at: string;
  servers?: Server[];
  network_devices?: any[];
}

// Alert Types
export type AlertType = 'CRITICAL' | 'WARNING' | 'INFO';
export type AlertCategory = 'HARDWARE' | 'NETWORK' | 'SECURITY' | 'ENVIRONMENT';
export type AlertStatus = 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED';

export interface Alert {
  id: string;
  alert_type: AlertType;
  category: AlertCategory;
  title: string;
  description: string;
  server_id?: string;
  rack_id?: string;
  threshold_value?: number;
  current_value?: number;
  status: AlertStatus;
  created_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  resolution_note?: string;
  server?: Server;
  rack?: Rack;
}

// Network Device Types
export type DeviceType = 'switch' | 'router' | 'firewall';

export interface NetworkDevice {
  id: string;
  name: string;
  device_type: DeviceType;
  brand: string;
  model: string;
  rack_id?: string;
  management_ip: string;
  ports_total: number;
  ports_used: number;
  vlans: number[];
  status: string;
  created_at: string;
  updated_at: string;
  rack?: Rack;
}

// Metrics Types
export interface ServerMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  temperature: number;
  power_consumption: number;
  uptime: number;
  timestamp: string;
}

// Filter Types
export interface ServerFilters {
  status?: ServerStatus;
  rack_id?: string;
  limit?: number;
  offset?: number;
}

export interface AlertFilters {
  status?: AlertStatus;
  type?: AlertType;
  category?: AlertCategory;
  server_id?: string;
  rack_id?: string;
  limit?: number;
  offset?: number;
}

// Utility Types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}