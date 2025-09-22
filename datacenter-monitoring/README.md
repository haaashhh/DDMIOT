# 🏢 Système de Surveillance de Centre de Données

![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![React](https://img.shields.io/badge/React-18+-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.1+-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

Un **système de surveillance full-stack complet** pour la gestion d'infrastructure de centre de données, construit avec React, Node.js, TypeScript, PostgreSQL et Docker. Cette solution complète fournit une interface utilisateur moderne et une API REST robuste pour surveiller les racks, serveurs, alertes et équipements réseau.

## 📋 Table des Matières

- [🚀 Fonctionnalités](#-fonctionnalités)
- [🏗️ Architecture](#️-architecture)
- [📊 Modèles de Données](#-modèles-de-données)
- [🔧 Installation](#-installation)
- [🖥️ Frontend Development](#️-frontend-development)
- [🐳 Configuration Docker](#-configuration-docker)
- [📡 Documentation API](#-documentation-api)
- [🌱 Données d'Initialisation](#-données-dinitialisation)
- [🧪 Tests](#-tests)
- [📈 Surveillance](#-surveillance)
- [🔒 Sécurité](#-sécurité)
- [🤝 Contribution](#-contribution)

## 🚀 Fonctionnalités

### Interface Utilisateur (Frontend)
- ✅ **Dashboard Interactif**: Vue d'ensemble temps réel avec métriques clés
- ✅ **Gestion des Serveurs**: Interface complète pour visualiser et gérer les serveurs
- ✅ **Système d'Alertes**: Interface d'alertes avec filtrage et gestion des statuts
- ✅ **Vue Réseau**: Monitoring des équipements réseau
- ✅ **Gestion des Racks**: Organisation visuelle et suivi de capacité
- ✅ **Design Moderne**: Interface Material UI avec thème personnalisé et animations
- ✅ **Responsive Design**: Adaptatif mobile, tablette et desktop
- ✅ **Visualisations Graphiques**: Métriques et tendances en temps réel

### Surveillance d'Infrastructure (Backend)
- ✅ **Gestion des Serveurs**: Opérations CRUD complètes pour les serveurs du centre de données
- ✅ **Organisation des Racks**: Gestion des racks avec suivi de capacité
- ✅ **Système d'Alertes**: Alertes complètes avec plusieurs niveaux de sévérité
- ✅ **Équipements Réseau**: Suivi des commutateurs, routeurs et pare-feux
- ✅ **Métriques Temps Réel**: Métriques serveur simulées (CPU, mémoire, température, puissance)
- ✅ **APIs Tableau de Bord**: Points d'accès pour vue d'ensemble, capacité et alertes

### Fonctionnalités Techniques
- ✅ **Stack React Moderne**: React 18 avec TypeScript et Vite
- ✅ **Intégration TypeORM**: Opérations de base de données type-safe
- ✅ **Base de Données PostgreSQL**: Base de données relationnelle robuste avec indexation appropriée
- ✅ **Support Docker**: Conteneurisation complète avec builds multi-étapes
- ✅ **Material UI**: Composants UI cohérents avec thème personnalisé
- ✅ **Limitation de Taux**: Protection API contre les abus
- ✅ **Validation d'Entrée**: Validation complète des requêtes
- ✅ **Gestion d'Erreurs**: Réponses d'erreur structurées
- ✅ **Vérifications de Santé**: Surveillance de l'application et de la base de données

## 🏗️ Architecture

```
datacenter-monitoring/
├── frontend/
│   ├── src/
│   │   ├── components/        # Composants React réutilisables
│   │   │   ├── dashboard/     # Composants spécifiques au dashboard
│   │   │   ├── layout/        # Mise en page et navigation
│   │   │   └── ui/            # Composants UI de base (MetricCard, etc.)
│   │   ├── pages/             # Pages de l'application (Dashboard, Servers, etc.)
│   │   ├── theme/             # Configuration du thème Material UI
│   │   ├── services/          # Services API et utilitaires
│   │   ├── types/             # Types TypeScript
│   │   ├── hooks/             # Hooks React personnalisés
│   │   ├── App.tsx            # Composant racine avec routing
│   │   └── main.tsx           # Point d'entrée React
│   ├── public/                # Fichiers statiques
│   ├── index.html             # Template HTML
│   ├── package.json           # Dépendances frontend
│   ├── vite.config.ts         # Configuration Vite
│   ├── tailwind.config.js     # Configuration Tailwind CSS
│   └── tsconfig.json          # Configuration TypeScript
├── backend/
│   ├── src/
│   │   ├── entities/          # Entités TypeORM (Rack, Server, Alert, NetworkDevice)
│   │   ├── controllers/       # Gestionnaires de requêtes API
│   │   ├── services/          # Couche de logique métier
│   │   ├── routes/            # Routage Express.js
│   │   ├── middleware/        # Authentification, validation, gestion d'erreurs
│   │   ├── migrations/        # Migrations de schéma de base de données  
│   │   ├── seeds/             # Données d'exemple pour le développement
│   │   ├── config/            # Configuration de base de données et d'application
│   │   └── app.ts             # Point d'entrée de l'application Express
│   ├── Dockerfile             # Build Docker multi-étapes
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml         # Services PostgreSQL + Backend + Frontend
├── .env                       # Variables d'environnement
├── .gitignore                 # Fichiers ignorés par Git
└── README.md
```

### Stack Technologique

#### Frontend
| Composant | Technologie | Objectif |
|-----------|-------------|----------|
| **Framework** | React 18 | Interface utilisateur moderne |
| **Langage** | TypeScript 5.1+ | Développement type-safe |
| **Build Tool** | Vite | Build rapide et HMR |
| **UI Framework** | Material UI v5 | Composants UI cohérents |
| **Styling** | Tailwind CSS + Emotion | Styling utilitaire et CSS-in-JS |
| **Routing** | React Router v6 | Navigation côté client |
| **Icons** | Lucide React + MUI Icons | Icônes modernes |

#### Backend
| Composant | Technologie | Objectif |
|-----------|-------------|----------|
| **Runtime** | Node.js 18+ | Runtime JavaScript |
| **Langage** | TypeScript 5.1+ | Développement type-safe |
| **Framework** | Express.js | Framework d'application web |
| **Base de Données** | PostgreSQL 15+ | Stockage de données principal |
| **ORM** | TypeORM | Couche d'abstraction de base de données |
| **Validation** | class-validator | Validation requête/réponse |
| **Sécurité** | Helmet, CORS, Rate Limiting | Middleware de sécurité |

#### DevOps
| Composant | Technologie | Objectif |
|-----------|-------------|----------|
| **Conteneurisation** | Docker & Docker Compose | Déploiement d'application |
| **Développement** | Hot Reload (Frontend & Backend) | Expérience de développement optimisée |

## 📊 Modèles de Données

### Entité Server
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

### Entité Rack
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

### Entité Alert
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

### Entité NetworkDevice
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

### Prérequis
- **Node.js 18+**
- **PostgreSQL 15+** 
- **npm ou yarn**
- **Docker & Docker Compose** (pour le déploiement conteneurisé)

### Configuration de Développement Local

1. **Cloner le répertoire**
```bash
git clone <repository-url>
cd datacenter-monitoring
```

2. **Installer les dépendances**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Configurer les variables d'environnement**
```bash
# Créer le fichier .env avec la configuration appropriée
cp backend/.env.example backend/.env
# Éditer .env avec votre configuration
```

4. **Démarrer PostgreSQL avec Docker**
```bash
# Démarrer uniquement la base de données
docker-compose up postgres -d
```

5. **Démarrer les serveurs de développement**
```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Frontend React
cd frontend  
npm run dev
```

**URLs d'accès :**
- **Frontend**: http://localhost:5173/
- **Backend API**: http://localhost:5001/

## 🖥️ Frontend Development

### Structure des Composants

```
frontend/src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardMetrics.tsx     # Métriques du dashboard
│   │   ├── RecentActivity.tsx       # Activité récente
│   │   └── QuickActions.tsx         # Actions rapides
│   ├── layout/
│   │   ├── Layout.tsx               # Layout principal
│   │   ├── Header.tsx               # En-tête de navigation
│   │   └── Sidebar.tsx              # Barre latérale
│   └── ui/
│       ├── MetricCard.tsx           # Cartes de métriques
│       ├── LoadingSpinner.tsx       # Indicateur de chargement
│       └── ErrorBoundary.tsx        # Gestion d'erreurs
├── pages/
│   ├── Dashboard.tsx                # Page d'accueil
│   ├── Servers.tsx                  # Gestion des serveurs
│   ├── Alerts.tsx                   # Gestion des alertes
│   ├── Network.tsx                  # Équipements réseau
│   ├── Racks.tsx                    # Gestion des racks
│   ├── Reports.tsx                  # Rapports
│   └── Settings.tsx                 # Paramètres
└── theme/
    └── theme.ts                     # Configuration MUI
```

### Système de Thème

Le thème Material UI personnalisé inclut :

```typescript
// Palette de couleurs personnalisées
palette: {
  primary: { main: '#667eea' },      // Bleu-violet principal
  secondary: { main: '#764ba2' },    // Violet secondaire
  success: { main: '#4caf50' },      // Vert succès
  warning: { main: '#ff9800' },      // Orange avertissement
  error: { main: '#f44336' },        // Rouge erreur
}

// Composants personnalisés
components: {
  MuiButton: {
    // Boutons avec gradients et animations
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
  },
  MuiCard: {
    // Cartes avec bordures arrondies et ombres
    borderRadius: 16,
    boxShadow: '0px 4px 20px rgba(0,0,0,0.08)'
  }
}
```

### Composants Clés

#### MetricCard
Composant réutilisable pour afficher les métriques avec :
- Support des tendances (up/down/stable)
- Couleurs thématiques (success/warning/danger/info)
- Animations de survol
- Icônes personnalisées

#### DashboardMetrics  
Vue d'ensemble des métriques principales :
- Serveurs actifs/total
- Alertes critiques
- CPU et température moyens
- Consommation électrique
- Utilisation des racks

#### Layout
Structure de navigation avec :
- En-tête avec titre et actions
- Barre latérale avec navigation
- Zone de contenu principal
- Design responsive

### Scripts de Développement

```bash
# Serveur de développement avec HMR
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting avec ESLint
npm run lint

# Type checking avec TypeScript
npm run type-check
```

### Configuration Vite

Le projet utilise Vite pour :
- **Hot Module Replacement (HMR)** : Rechargement instantané
- **TypeScript** : Support natif TypeScript
- **Path aliases** : `@/` pour `src/`
- **Tree shaking** : Optimisation des bundles
- **Fast builds** : Compilation ultra-rapide

### Intégration API

Services pour l'intégration backend :

```typescript
// Services API (à implémenter)
services/
├── api.ts           # Configuration axios/fetch
├── servers.ts       # Endpoints serveurs
├── alerts.ts        # Endpoints alertes
├── dashboard.ts     # Endpoints dashboard
└── auth.ts          # Authentification
```

## 🐳 Configuration Docker

### Démarrage Rapide avec Docker Compose

1. **Cloner et naviguer vers le projet**
```bash
git clone <repository-url>
cd datacenter-monitoring
```

2. **Démarrer tous les services**
```bash
# Mode production
docker-compose up -d

# Mode développement avec rechargement à chaud
docker-compose -f docker-compose.yml --profile dev up -d

# Avec outils supplémentaires (pgAdmin)
docker-compose --profile tools up -d
```

3. **Initialiser la base de données**
```bash
# Attendre que les services soient en bonne santé, puis initialiser
docker-compose exec backend npm run seed
```

4. **Accéder aux services**
- **Frontend**: http://localhost:5173
- **API**: http://localhost:5001
- **pgAdmin** (si utilisation du profil tools): http://localhost:8080
- **Base de Données**: localhost:5433

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

### Configuration d'Environnement

Créer un fichier `.env` dans le répertoire backend :

```bash
# Application
NODE_ENV=development
PORT=5001

# Base de données
DB_HOST=localhost  # Utiliser 'postgres' pour une configuration Docker
DB_PORT=5433
DB_USER=datacenter
DB_PASSWORD=password123
DB_NAME=datacenter

# Sécurité
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000

# Limitation de taux
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📡 Documentation API

### URL de Base
- **Développement**: `http://localhost:5001/api/v1`
- **Production**: `https://your-domain.com/api/v1`

### Authentification
La plupart des points d'accès supportent l'authentification JWT optionnelle. Inclure le token dans l'en-tête Authorization :
```
Authorization: Bearer <your-jwt-token>
```

### Format de Réponse
Toutes les réponses API suivent cette structure :
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

### Points d'Accès Serveur

#### GET /servers
Lister tous les serveurs avec filtrage et pagination optionnels.

**Paramètres de Requête :**
- `status` - Filtrer par statut (active, maintenance, error, offline)
- `rack_id` - Filtrer par ID de rack
- `limit` - Nombre de résultats à retourner (max 1000)
- `offset` - Nombre de résultats à ignorer

**Exemple de Requête :**
```bash
curl "http://localhost:5001/api/v1/servers?status=active&limit=10"
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
Obtenir des informations détaillées sur un serveur spécifique.

**Exemple de Requête :**
```bash
curl "http://localhost:5001/api/v1/servers/RBT-A1-S001"
```

#### POST /servers
Créer un nouveau serveur.

**Exemple de Requête :**
```bash
curl -X POST "http://localhost:5001/api/v1/servers" \
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
Obtenir les métriques temps réel ou historiques pour un serveur.

**Paramètres de Requête :**
- `hours` - Nombre d'heures de données historiques (défaut: 24, utiliser 1 pour temps réel)

**Exemple de Requête :**
```bash
# Métriques temps réel
curl "http://localhost:5001/api/v1/servers/RBT-A1-S001/metrics?hours=1"

# Données historiques 24h
curl "http://localhost:5001/api/v1/servers/RBT-A1-S001/metrics?hours=24"
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
Obtenir des informations de santé complètes pour un serveur incluant métriques et alertes potentielles.

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

### Points d'Accès Rack

#### GET /racks
Lister tous les racks, optionnellement filtrés par zone.

**Exemple de Requête :**
```bash
curl "http://localhost:5001/api/v1/racks?zone=A"
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

## 🌱 Données d'Initialisation

Le système inclut des données d'initialisation complètes pour le développement et les tests :

### Exécution des Données d'Initialisation

```bash
# Développement local
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

## 🧪 Tests

### Tests API avec curl

Tester le point d'accès de santé :
```bash
curl http://localhost:5001/api/v1/health
```

Tester la liste des serveurs :
```bash
curl http://localhost:5001/api/v1/servers
```

Tester les métriques :
```bash
curl "http://localhost:5001/api/v1/servers/RBT-A1-S001/metrics?hours=1"
```

Tester le tableau de bord :
```bash
curl http://localhost:5001/api/v1/dashboard/overview
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

## 📈 Surveillance

### Vérifications de Santé

L'API fournit des points d'accès de vérification de santé intégrés :

**Santé de l'Application :**
```bash
curl http://localhost:5001/api/v1/health
```

**Santé de la Base de Données :**
Le point d'accès de santé inclut le statut de connectivité de la base de données.

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

## 🔒 Sécurité

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

## 🚀 Déploiement

### Déploiement de Développement
```bash
# Démarrer l'environnement de développement
docker-compose --profile dev up -d

# Voir les logs
docker-compose logs -f backend-dev
```

### Déploiement de Production
```bash
# Démarrer l'environnement de production  
docker-compose up -d

# Avec surveillance
docker-compose --profile cache up -d
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

## 📚 Étapes Suivantes (Phase 2+)

### Développement Frontend (Complété ✅)
- ✅ Tableau de bord React avec métriques temps réel
- ✅ Interface de gestion des serveurs  
- ✅ Interface de gestion des alertes
- ✅ Design responsive mobile avec Material UI
- 🔄 Visualisation interactive des racks (en cours)
- 🔄 Graphiques et tendances avancées

### Fonctionnalités Avancées  
- Intégration matériel réel (SNMP, IPMI)
- Analyses et rapports avancés
- Notifications Email/Slack
- Gestion des utilisateurs et rôles
- Journalisation d'audit
- Limitation de taux API par utilisateur
- Mises à jour temps réel WebSocket

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

## 🤝 Contribution

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

Pour le support, veuillez ouvrir une issue sur GitHub ou contacter l'équipe de développement.

**Bonne Surveillance ! 🏢📊**