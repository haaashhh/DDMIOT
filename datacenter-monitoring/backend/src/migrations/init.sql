-- Database initialization script for Docker
-- This will be automatically executed by PostgreSQL on container startup

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables with proper constraints and indexes
CREATE TABLE IF NOT EXISTS racks (
  id VARCHAR(20) PRIMARY KEY,
  zone VARCHAR(10) NOT NULL,
  position INTEGER NOT NULL,
  height VARCHAR(10) DEFAULT '42U',
  power_capacity INTEGER,
  temperature DECIMAL(4,2),
  servers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS servers (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  rack_id VARCHAR(20) NOT NULL REFERENCES racks(id) ON DELETE CASCADE,
  position VARCHAR(10),
  server_type VARCHAR(50),
  operating_system VARCHAR(100),
  brand VARCHAR(50),
  model VARCHAR(100),
  cpu_specs VARCHAR(200),
  memory_specs VARCHAR(100),
  storage_specs VARCHAR(200),
  ip_address INET,
  mac_address MACADDR,
  vlan_id INTEGER,
  status VARCHAR(20) CHECK (status IN ('active', 'maintenance', 'error', 'offline')) DEFAULT 'active',
  cpu_baseline DECIMAL(5,2) DEFAULT 25.0,
  memory_baseline DECIMAL(5,2) DEFAULT 65.0,
  temp_idle DECIMAL(4,2) DEFAULT 35.0,
  power_idle INTEGER DEFAULT 180,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  alert_type VARCHAR(20) CHECK (alert_type IN ('CRITICAL', 'WARNING', 'INFO')) NOT NULL,
  category VARCHAR(20) CHECK (category IN ('HARDWARE', 'NETWORK', 'SECURITY', 'ENVIRONMENT')) NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  server_id VARCHAR(50) REFERENCES servers(id) ON DELETE CASCADE,
  rack_id VARCHAR(20) REFERENCES racks(id) ON DELETE CASCADE,
  threshold_value DECIMAL(10,2),
  current_value DECIMAL(10,2),
  status VARCHAR(20) CHECK (status IN ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED')) DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS network_devices (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  device_type VARCHAR(20) CHECK (device_type IN ('switch', 'router', 'firewall')) NOT NULL,
  brand VARCHAR(50),
  model VARCHAR(100),
  rack_id VARCHAR(20) REFERENCES racks(id) ON DELETE SET NULL,
  management_ip INET,
  ports_total INTEGER,
  ports_used INTEGER DEFAULT 0,
  vlans INTEGER[],
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_servers_rack ON servers(rack_id);
CREATE INDEX IF NOT EXISTS idx_servers_status ON servers(status);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_type ON alerts(alert_type);
CREATE INDEX IF NOT EXISTS idx_alerts_created ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_network_devices_rack ON network_devices(rack_id);
CREATE INDEX IF NOT EXISTS idx_network_devices_type ON network_devices(device_type);

-- Create trigger to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
CREATE TRIGGER update_racks_updated_at BEFORE UPDATE ON racks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_servers_updated_at BEFORE UPDATE ON servers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();