# 🏢 Datacenter Monitoring System - Phase 1: Backend Core

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

A comprehensive **backend monitoring system** for datacenter infrastructure management, built with Node.js, TypeScript, PostgreSQL, and Docker. This Phase 1 implementation provides a solid REST API foundation for monitoring racks, servers, alerts, and network devices.

## 📋 Table of Contents

- [🚀 Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [📊 Data Models](#-data-models)
- [🔧 Installation](#-installation)
- [🐳 Docker Setup](#-docker-setup)
- [📡 API Documentation](#-api-documentation)
- [🌱 Database Seeding](#-database-seeding)
- [🧪 Testing](#-testing)
- [📈 Monitoring](#-monitoring)
- [🔒 Security](#-security)
- [🤝 Contributing](#-contributing)

## 🚀 Features

### Core Infrastructure Monitoring
- ✅ **Server Management**: Complete CRUD operations for datacenter servers
- ✅ **Rack Organization**: Manage datacenter racks with capacity tracking
- ✅ **Alert System**: Comprehensive alerting with multiple severity levels
- ✅ **Network Devices**: Track switches, routers, and firewalls
- ✅ **Real-time Metrics**: Simulated server metrics (CPU, memory, temperature, power)
- ✅ **Dashboard APIs**: Overview, capacity, and alert dashboard endpoints

### Technical Features
- ✅ **TypeORM Integration**: Type-safe database operations
- ✅ **PostgreSQL Database**: Robust relational database with proper indexing
- ✅ **Docker Support**: Complete containerization with multi-stage builds
- ✅ **Rate Limiting**: API protection against abuse
- ✅ **Input Validation**: Comprehensive request validation
- ✅ **Error Handling**: Structured error responses
- ✅ **Health Checks**: Application and database health monitoring

## 🏗️ Architecture

```
datacenter-monitoring/
├── backend/
│   ├── src/
│   │   ├── entities/          # TypeORM entities (Rack, Server, Alert, NetworkDevice)
│   │   ├── controllers/       # API request handlers
│   │   ├── services/          # Business logic layer
│   │   ├── routes/            # Express.js routing
│   │   ├── middleware/        # Authentication, validation, error handling
│   │   ├── migrations/        # Database schema migrations  
│   │   ├── seeds/             # Sample data for development
│   │   ├── config/            # Database and app configuration
│   │   └── app.ts             # Express application entry point
│   ├── Dockerfile             # Multi-stage Docker build
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml         # PostgreSQL + Backend services
├── docker-compose.dev.yml     # Development overrides
├── docker-compose.prod.yml    # Production optimizations
└── README.md
```

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Language** | TypeScript 5.1+ | Type-safe development |
| **Framework** | Express.js | Web application framework |
| **Database** | PostgreSQL 15+ | Primary data storage |
| **ORM** | TypeORM | Database abstraction layer |
| **Validation** | class-validator | Request/response validation |
| **Security** | Helmet, CORS, Rate Limiting | Security middleware |
| **Containerization** | Docker & Docker Compose | Application deployment |

## 📊 Data Models

### Server Entity
```typescript
interface Server {
  id: string;                    // Primary key (e.g., "RBT-A1-S001")
  name: string;                  // Human readable name
  rack_id: string;               // Foreign key to Rack
  position: string;              // Rack position (e.g., "U1-U2")
  server_type: string;           // Server purpose/type
  operating_system: string;      // OS information
  brand: string;                 // Hardware manufacturer
  model: string;                 // Hardware model
  cpu_specs: string;             // CPU specifications
  memory_specs: string;          // RAM specifications
  storage_specs: string;         // Storage configuration
  ip_address: string;            // Network IP address
  mac_address: string;           // MAC address
  vlan_id: number;               // VLAN assignment
  status: 'active'|'maintenance'|'error'|'offline';
  cpu_baseline: number;          // Normal CPU usage %
  memory_baseline: number;       // Normal memory usage %
  temp_idle: number;             // Idle temperature °C
  power_idle: number;            // Idle power consumption W
}
```

### Rack Entity
```typescript
interface Rack {
  id: string;                    // Primary key (e.g., "RBT-A1")
  zone: string;                  // Datacenter zone (A, B, C)
  position: number;              // Position in zone
  height: string;                // Rack height (e.g., "42U")
  power_capacity: number;        // Maximum power capacity W
  temperature: number;           // Current temperature °C
  servers_count: number;         // Number of servers
  servers: Server[];             // Related servers
}
```

### Alert Entity
```typescript
interface Alert {
  id: string;                    // UUID primary key
  alert_type: 'CRITICAL'|'WARNING'|'INFO';
  category: 'HARDWARE'|'NETWORK'|'SECURITY'|'ENVIRONMENT';
  title: string;                 // Alert title
  description: string;           // Detailed description
  server_id?: string;            // Optional server reference
  rack_id?: string;              // Optional rack reference
  threshold_value?: number;      // Alert threshold
  current_value?: number;        // Current measured value
  status: 'ACTIVE'|'ACKNOWLEDGED'|'RESOLVED';
  resolved_at?: Date;            // Resolution timestamp
}
```

### NetworkDevice Entity
```typescript
interface NetworkDevice {
  id: string;                    // Primary key (e.g., "SW-CORE-01")
  name: string;                  // Device name
  device_type: 'switch'|'router'|'firewall';
  brand: string;                 // Manufacturer
  model: string;                 // Device model
  rack_id?: string;              // Optional rack reference
  management_ip: string;         // Management interface IP
  ports_total: number;           // Total number of ports
  ports_used: number;            // Ports in use
  vlans: number[];               // Supported VLANs
  status: string;                // Device status
}
```

## 🔧 Installation

### Prerequisites
- **Node.js 18+**
- **PostgreSQL 15+** 
- **npm or yarn**
- **Docker & Docker Compose** (for containerized deployment)

### Local Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd datacenter-monitoring
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Setup environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start PostgreSQL** (if not using Docker)
```bash
# On macOS with Homebrew
brew services start postgresql

# On Ubuntu/Debian
sudo systemctl start postgresql
```

5. **Create database**
```bash
createdb datacenter
```

6. **Run database migrations and seed data**
```bash
npm run migration:run
npm run seed
```

7. **Start the development server**
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

## 🐳 Docker Setup

### Quick Start with Docker Compose

1. **Clone and navigate to project**
```bash
git clone <repository-url>
cd datacenter-monitoring
```

2. **Start all services**
```bash
# Production mode
docker-compose up -d

# Development mode with hot reloading
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# With additional tools (pgAdmin)
docker-compose --profile tools up -d
```

3. **Seed the database**
```bash
# Wait for services to be healthy, then seed
docker-compose exec backend npm run seed
```

4. **Access the services**
- **API**: http://localhost:5000
- **pgAdmin** (if using tools profile): http://localhost:8080
- **Database**: localhost:5432

### Docker Commands

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f postgres

# Execute commands in containers
docker-compose exec backend npm run migration:run
docker-compose exec backend npm run seed
docker-compose exec postgres psql -U datacenter -d datacenter

# Stop services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

### Environment Configuration

Create a `.env` file in the project root:

```bash
# Application
NODE_ENV=production
PORT=5000

# Database
DB_HOST=postgres  # Use 'localhost' for non-Docker setup
DB_PORT=5432
DB_USER=datacenter
DB_PASSWORD=password123
DB_NAME=datacenter

# Security
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📡 API Documentation

### Base URL
- **Development**: `http://localhost:5000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Authentication
Most endpoints support optional JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Response Format
All API responses follow this structure:
```json
{
  "success": true|false,
  "data": {...},
  "message": "Success message",
  "meta": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "total": 100,
    "count": 10
  },
  "error": {...} // Only present on errors
}
```

### Server Endpoints

#### GET /servers
List all servers with optional filtering and pagination.

**Query Parameters:**
- `status` - Filter by status (active, maintenance, error, offline)
- `rack_id` - Filter by rack ID
- `limit` - Number of results to return (max 1000)
- `offset` - Number of results to skip

**Example Request:**
```bash
curl "http://localhost:5000/api/v1/servers?status=active&limit=10"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "RBT-A1-S001",
      "name": "web-server-prod-01",
      "rack_id": "RBT-A1",
      "position": "U1-U2",
      "server_type": "Web Server",
      "operating_system": "Ubuntu 20.04 LTS",
      "brand": "Dell",
      "model": "PowerEdge R750",
      "cpu_specs": "Intel Xeon Gold 6338 (32 cores)",
      "memory_specs": "128 GB DDR4",
      "storage_specs": "2x 1TB NVMe SSD",
      "ip_address": "10.1.1.100",
      "mac_address": "aa:bb:cc:dd:ee:01",
      "vlan_id": 100,
      "status": "active",
      "cpu_baseline": 25.0,
      "memory_baseline": 65.0,
      "temp_idle": 35.0,
      "power_idle": 180,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "rack": {
        "id": "RBT-A1",
        "zone": "A",
        "position": 1,
        "height": "42U"
      }
    }
  ],
  "meta": {
    "total": 25,
    "count": 10,
    "limit": 10,
    "offset": 0
  }
}
```

#### GET /servers/:id
Get detailed information about a specific server.

**Example Request:**
```bash
curl "http://localhost:5000/api/v1/servers/RBT-A1-S001"
```

#### POST /servers
Create a new server.

**Example Request:**
```bash
curl -X POST "http://localhost:5000/api/v1/servers" \
  -H "Content-Type: application/json" \
  -d '{
    "id": "RBT-A1-S004",
    "name": "new-web-server",
    "rack_id": "RBT-A1", 
    "position": "U7-U8",
    "server_type": "Web Server",
    "operating_system": "Ubuntu 22.04 LTS",
    "brand": "Dell",
    "model": "PowerEdge R650",
    "cpu_specs": "Intel Xeon Gold 6338 (32 cores)",
    "memory_specs": "64 GB DDR4",
    "storage_specs": "2x 1TB NVMe SSD",
    "ip_address": "10.1.1.108",
    "mac_address": "aa:bb:cc:dd:ee:08",
    "vlan_id": 100,
    "status": "active"
  }'
```

#### GET /servers/:id/metrics
Get real-time or historical metrics for a server.

**Query Parameters:**
- `hours` - Number of hours of historical data (default: 24, use 1 for real-time)

**Example Request:**
```bash
# Real-time metrics
curl "http://localhost:5000/api/v1/servers/RBT-A1-S001/metrics?hours=1"

# 24-hour historical data
curl "http://localhost:5000/api/v1/servers/RBT-A1-S001/metrics?hours=24"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "cpu_usage": 28.5,
    "memory_usage": 67.2,
    "disk_usage": 45.8,
    "network_in": 450,
    "network_out": 380,
    "temperature": 38.5,
    "power_consumption": 195,
    "uptime": 2847600,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "meta": {
    "server_id": "RBT-A1-S001",
    "hours": 1
  }
}
```

#### GET /servers/:id/health
Get comprehensive health information for a server including metrics and potential alerts.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "server": {...},
    "metrics": {...},
    "alerts": [
      {
        "type": "WARNING",
        "category": "HARDWARE", 
        "title": "High CPU Usage Detected",
        "description": "CPU usage is at 87.2%, exceeding safe operating levels",
        "threshold_value": 85,
        "current_value": 87.2
      }
    ],
    "health_score": 85
  }
}
```

### Rack Endpoints

#### GET /racks
List all racks, optionally filtered by zone.

**Example Request:**
```bash
curl "http://localhost:5000/api/v1/racks?zone=A"
```

#### GET /racks/:id/servers  
Get all servers in a specific rack.

**Example Request:**
```bash
curl "http://localhost:5000/api/v1/racks/RBT-A1/servers"
```

#### GET /racks/:id/metrics
Get comprehensive metrics for a rack including all its servers.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "rack_info": {
      "id": "RBT-A1",
      "zone": "A",
      "position": 1,
      "height": "42U",
      "power_capacity": 12000
    },
    "rack_metrics": {
      "rack_id": "RBT-A1",
      "server_count": 3,
      "average_temperature": 22.8,
      "power_consumption": 2850,
      "utilization_percentage": 67.5,
      "timestamp": "2024-01-01T12:00:00.000Z"
    },
    "servers": [
      {
        "server_id": "RBT-A1-S001",
        "server_name": "web-server-prod-01",
        "position": "U1-U2",
        "metrics": {...}
      }
    ],
    "summary": {
      "total_servers": 3,
      "active_servers": 3,
      "average_cpu": 32.4,
      "average_temperature": 37.2,
      "total_power": 2850
    }
  }
}
```

#### GET /racks/:id/capacity
Get detailed capacity information for a rack.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "rack": {...},
    "capacity_info": {
      "total_units": 42,
      "used_units": 6,
      "free_units": 36,
      "utilization_percentage": 14.29,
      "power_used": 550,
      "power_available": 12000,
      "power_utilization_percentage": 4.58
    }
  }
}
```

### Alert Endpoints

#### GET /alerts
List alerts with comprehensive filtering options.

**Query Parameters:**
- `status` - ACTIVE, ACKNOWLEDGED, RESOLVED
- `type` - CRITICAL, WARNING, INFO
- `category` - HARDWARE, NETWORK, SECURITY, ENVIRONMENT
- `server_id` - Filter by specific server
- `rack_id` - Filter by specific rack
- `limit`, `offset` - Pagination

**Example Request:**
```bash
curl "http://localhost:5000/api/v1/alerts?status=ACTIVE&type=CRITICAL"
```

#### GET /alerts/active
Get all currently active alerts.

#### GET /alerts/critical  
Get all critical alerts (active and acknowledged).

#### PUT /alerts/:id/acknowledge
Acknowledge an alert.

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/v1/alerts/123e4567-e89b-12d3-a456-426614174000/acknowledge"
```

#### PUT /alerts/:id/resolve
Resolve an alert with optional resolution note.

**Example Request:**
```bash
curl -X PUT "http://localhost:5000/api/v1/alerts/123e4567-e89b-12d3-a456-426614174000/resolve" \
  -H "Content-Type: application/json" \
  -d '{"resolution_note": "Issue resolved by restarting service"}'
```

#### GET /alerts/trends
Get alert trends over time.

**Query Parameters:**
- `days` - Number of days to analyze (1-30, default: 7)

**Example Response:**
```json
{
  "success": true,
  "data": {
    "daily_counts": [
      {
        "date": "2024-01-01",
        "critical": 2,
        "warning": 5,
        "info": 3,
        "total": 10
      }
    ],
    "category_breakdown": [
      {
        "category": "HARDWARE",
        "count": 12
      }
    ]
  }
}
```

### Dashboard Endpoints

#### GET /dashboard/overview
Get comprehensive datacenter overview.

**Example Response:**
```json
{
  "success": true,
  "data": {
    "datacenter_summary": {
      "total_racks": 12,
      "total_servers": 25,
      "active_servers": 22,
      "offline_servers": 1,
      "maintenance_servers": 2,
      "error_servers": 0,
      "total_network_devices": 15
    },
    "alerts_summary": {
      "total_alerts": 18,
      "active_alerts": 8,
      "critical_alerts": 2,
      "warning_alerts": 4,
      "info_alerts": 2,
      "resolved_today": 3
    },
    "capacity_summary": {
      "total_rack_capacity": 504,
      "used_rack_capacity": 86,
      "average_rack_utilization": 17.06,
      "total_power_capacity": 180000,
      "estimated_power_usage": 45000,
      "power_utilization": 25.0
    },
    "performance_summary": {
      "average_cpu_usage": 32.5,
      "average_memory_usage": 68.2,
      "average_temperature": 36.8,
      "servers_over_threshold": 3
    },
    "recent_activity": [
      {
        "type": "alert_created",
        "message": "CRITICAL alert: High CPU Temperature on GPU Server",
        "timestamp": "2024-01-01T11:30:00.000Z",
        "severity": "high"
      }
    ]
  }
}
```

#### GET /dashboard/capacity
Get detailed capacity metrics across the datacenter.

#### GET /dashboard/alerts
Get alerts dashboard with trends and breakdowns.

## 🌱 Database Seeding

The system includes comprehensive seed data for development and testing:

### Running Seeds

```bash
# Local development
npm run seed

# Docker
docker-compose exec backend npm run seed
```

### Seed Data Overview

- **12 Racks** across 3 zones (A, B, C) with varying configurations
- **25 Servers** with realistic specifications and varied statuses
- **15 Network Devices** including switches, routers, and firewalls
- **18 Alerts** with different severities and statuses, including historical data

### Sample Data Structure

**Zones:**
- **Zone A**: Web services and application servers (4 racks)
- **Zone B**: Compute and storage infrastructure (4 racks)  
- **Zone C**: Kubernetes cluster and development (4 racks)

**Server Types:**
- Web Servers (Dell PowerEdge R750)
- Database Servers (HP ProLiant DL380 Gen10)
- Compute Nodes (Dell PowerEdge R7525)
- GPU Servers (NVIDIA DGX A100)
- Storage Servers (Supermicro)
- Kubernetes Masters/Workers

**Alert Scenarios:**
- High temperature warnings
- CPU and memory usage alerts
- Network connectivity issues
- Hardware failure simulations
- Maintenance notifications

## 🧪 Testing

### API Testing with curl

Test the health endpoint:
```bash
curl http://localhost:5000/api/v1/health
```

Test server listing:
```bash
curl http://localhost:5000/api/v1/servers
```

Test metrics:
```bash
curl "http://localhost:5000/api/v1/servers/RBT-A1-S001/metrics?hours=1"
```

Test dashboard:
```bash
curl http://localhost:5000/api/v1/dashboard/overview
```

### Testing with Postman

Import the provided Postman collection for comprehensive API testing:

1. Import `datacenter-monitoring-api.postman_collection.json`
2. Set environment variable `base_url` to `http://localhost:5000/api/v1`  
3. Run the full collection or individual requests

### Unit Testing (Future)

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run test:watch
```

## 📈 Monitoring

### Health Checks

The API provides built-in health check endpoints:

**Application Health:**
```bash
curl http://localhost:5000/api/v1/health
```

**Database Health:**
The health endpoint includes database connectivity status.

### Docker Health Checks

All services include Docker health checks:

```bash
# Check service health
docker-compose ps

# View health check logs
docker inspect datacenter_backend | grep -A 10 '"Health"'
```

### Metrics Collection

**Simulated Metrics:**
- CPU Usage (%)
- Memory Usage (%)
- Disk Usage (%)
- Network I/O (MB/s)
- Temperature (°C)
- Power Consumption (W)
- Uptime (seconds)

**Real-time vs Historical:**
- Real-time: Latest simulated values
- Historical: Time series data for analysis

### Production Monitoring (Optional)

Enable monitoring stack:
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --profile monitoring up -d
```

This includes:
- **Prometheus**: Metrics collection
- **Grafana**: Metrics visualization
- Custom dashboards for datacenter monitoring

## 🔒 Security

### Authentication & Authorization
- **JWT Token Support**: Optional authentication for API endpoints
- **Rate Limiting**: Configurable request limiting per IP
- **Input Validation**: Comprehensive request validation using class-validator
- **SQL Injection Protection**: TypeORM provides parameterized queries

### Security Headers
- **Helmet.js**: Security headers (CSP, HSTS, etc.)
- **CORS**: Configurable cross-origin resource sharing
- **Request Size Limits**: Protection against large payload attacks

### Database Security
- **Connection Pooling**: Efficient connection management
- **Prepared Statements**: SQL injection prevention
- **Environment Variables**: Secure configuration management

### Docker Security
- **Non-root User**: Containers run as non-privileged user
- **Multi-stage Builds**: Minimal production images
- **Health Checks**: Container health monitoring
- **Resource Limits**: CPU and memory constraints

### Production Security Checklist
- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS in production
- [ ] Configure firewall rules
- [ ] Set up log monitoring
- [ ] Enable database backups
- [ ] Review CORS origins
- [ ] Monitor for security updates

## 🚀 Deployment

### Development Deployment
```bash
# Start development environment
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# View logs
docker-compose logs -f backend
```

### Production Deployment
```bash
# Start production environment  
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# With monitoring
docker-compose -f docker-compose.yml -f docker-compose.prod.yml --profile monitoring up -d
```

### Environment Variables for Production
Create a production `.env` file:
```bash
NODE_ENV=production
DB_PASSWORD=<strong-database-password>
JWT_SECRET=<cryptographically-secure-secret>
CORS_ORIGIN=https://your-frontend-domain.com
```

### Reverse Proxy Configuration (Nginx)
```nginx
server {
    listen 80;
    server_name api.datacenter.local;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📚 Next Steps (Phase 2+)

### Frontend Development
- React.js dashboard with real-time metrics
- Interactive rack visualization
- Alert management interface
- Mobile-responsive design

### Advanced Features  
- Real hardware integration (SNMP, IPMI)
- Advanced analytics and reporting
- Email/Slack notifications
- User management and roles
- Audit logging
- API rate limiting per user
- WebSocket real-time updates

### Scalability Enhancements
- Redis caching layer
- Database read replicas
- Microservices architecture
- Load balancing
- Horizontal scaling

### Monitoring Improvements
- Prometheus metrics export
- Custom Grafana dashboards
- Log aggregation (ELK stack)
- APM integration
- Distributed tracing

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Add JSDoc comments for public APIs
- Include tests for new features
- Update documentation

### Commit Convention
```
feat: add new server metrics endpoint
fix: resolve rack capacity calculation
docs: update API documentation
test: add unit tests for alert service
chore: update dependencies
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Fast, unopinionated web framework
- [TypeORM](https://typeorm.io/) - Amazing TypeScript ORM
- [PostgreSQL](https://postgresql.org/) - Powerful relational database
- [Docker](https://docker.com/) - Containerization platform

---

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

**Happy Monitoring! 🏢📊**