import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import * as dotenv from 'dotenv';

import { initializeDatabase } from './config/database';
import routes from './routes';
import { 
  errorHandler, 
  notFoundHandler, 
  defaultRateLimiter 
} from './middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
app.use(defaultRateLimiter);

// CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5174', process.env.CORS_ORIGIN].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API routes
app.use('/api/v1', routes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Datacenter Monitoring API Server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    api: {
      base_url: '/api/v1',
      documentation: '/api/v1',
      health: '/api/v1/health',
    },
  });
});

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

// Start server function
const startServer = async (): Promise<void> => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    // Start HTTP server
    app.listen(PORT, () => {
      console.log('🚀 Server Configuration:');
      console.log(`   • Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`   • Port: ${PORT}`);
      console.log(`   • Database: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}`);
      console.log(`   • CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
      console.log('');
      console.log('📡 API Endpoints:');
      console.log(`   • Health: http://localhost:${PORT}/api/v1/health`);
      console.log(`   • Servers: http://localhost:${PORT}/api/v1/servers`);
      console.log(`   • Racks: http://localhost:${PORT}/api/v1/racks`);
      console.log(`   • Alerts: http://localhost:${PORT}/api/v1/alerts`);
      console.log(`   • Dashboard: http://localhost:${PORT}/api/v1/dashboard`);
      console.log('');
      console.log('✅ Datacenter Monitoring API server started successfully!');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = (signal: string) => {
  console.log(`\n🔄 Received ${signal}. Starting graceful shutdown...`);
  
  // Close database connections, cleanup resources, etc.
  setTimeout(() => {
    console.log('👋 Server shut down gracefully');
    process.exit(0);
  }, 5000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
if (require.main === module) {
  startServer();
}

export default app;