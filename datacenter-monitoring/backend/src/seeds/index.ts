import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Rack } from '../entities/Rack';
import { Server } from '../entities/Server';
import { Alert } from '../entities/Alert';
import { NetworkDevice } from '../entities/NetworkDevice';

import { rackSeeds } from './rackSeeds';
import { serverSeeds } from './serverSeeds';
import { networkDeviceSeeds } from './networkDeviceSeeds';
import { alertSeeds } from './alertSeeds';
import { seedUsers } from './userSeeds';

async function seedDatabase(): Promise<void> {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Get repositories
    const rackRepository = AppDataSource.getRepository(Rack);
    const serverRepository = AppDataSource.getRepository(Server);
    const alertRepository = AppDataSource.getRepository(Alert);
    const networkDeviceRepository = AppDataSource.getRepository(NetworkDevice);

    // Check if data already exists
    const existingRacks = await rackRepository.count();
    const existingServers = await serverRepository.count();
    
    if (existingRacks > 0 || existingServers > 0) {
      console.log(`📊 Database already contains data (${existingRacks} racks, ${existingServers} servers)`);
      console.log('💡 Skipping seeding to avoid duplicates. To reseed, manually clear the database first.');
      return;
    }
    
    console.log('📝 Database is empty, proceeding with seeding...');

    // Seed Racks first (they are referenced by servers and network devices)
    console.log('🏗️ Seeding racks...');
    const racks = rackRepository.create(rackSeeds);
    await rackRepository.save(racks);
    console.log(`✅ Seeded ${racks.length} racks`);

    // Seed Servers (they reference racks)
    console.log('💻 Seeding servers...');
    const servers = serverRepository.create(serverSeeds);
    await serverRepository.save(servers);
    console.log(`✅ Seeded ${servers.length} servers`);

    // Seed Network Devices (they reference racks)
    console.log('🌐 Seeding network devices...');
    const networkDevices = networkDeviceRepository.create(networkDeviceSeeds);
    await networkDeviceRepository.save(networkDevices);
    console.log(`✅ Seeded ${networkDevices.length} network devices`);

    // Update rack server counts
    console.log('🔄 Updating rack server counts...');
    for (const rack of racks) {
      const serverCount = await serverRepository.count({
        where: { rack_id: rack.id },
      });
      await rackRepository.update(rack.id, { 
        servers_count: serverCount,
        updated_at: new Date(),
      });
    }
    console.log('✅ Rack server counts updated');

    // Seed Alerts (they reference servers and racks)
    console.log('🚨 Seeding alerts...');
    const alerts = alertRepository.create(alertSeeds);
    await alertRepository.save(alerts);
    console.log(`✅ Seeded ${alerts.length} alerts`);

    // Seed Users for authentication
    await seedUsers();

    // Display summary
    console.log('');
    console.log('📊 Seeding Summary:');
    console.log(`   • Racks: ${racks.length}`);
    console.log(`   • Servers: ${servers.length}`);
    console.log(`   • Network Devices: ${networkDevices.length}`);
    console.log(`   • Alerts: ${alerts.length}`);
    
    // Display zone breakdown
    const zoneBreakdown = racks.reduce((acc, rack) => {
      acc[rack.zone] = (acc[rack.zone] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('');
    console.log('🏢 Zone Breakdown:');
    Object.entries(zoneBreakdown).forEach(([zone, count]) => {
      const zoneServers = servers.filter(s => s.rack_id?.startsWith(`RBT-${zone}`)).length;
      console.log(`   • Zone ${zone}: ${count} racks, ${zoneServers} servers`);
    });

    // Display server status breakdown
    const statusBreakdown = servers.reduce((acc, server) => {
      acc[server.status || 'unknown'] = (acc[server.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('');
    console.log('⚡ Server Status:');
    Object.entries(statusBreakdown).forEach(([status, count]) => {
      console.log(`   • ${status}: ${count} servers`);
    });

    // Display alert status breakdown
    const alertStatusBreakdown = alerts.reduce((acc, alert) => {
      acc[alert.status || 'unknown'] = (acc[alert.status || 'unknown'] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('');
    console.log('🚨 Alert Status:');
    Object.entries(alertStatusBreakdown).forEach(([status, count]) => {
      console.log(`   • ${status}: ${count} alerts`);
    });

    console.log('');
    console.log('🎉 Database seeding completed successfully!');
    console.log('');
    console.log('📡 You can now test the API endpoints:');
    console.log('   • POST /api/v1/auth/login');
    console.log('   • GET /api/v1/servers');
    console.log('   • GET /api/v1/racks');
    console.log('   • GET /api/v1/alerts');
    console.log('   • GET /api/v1/dashboard/overview');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    // Close the connection
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run seeding if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('✨ Seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Seeding failed:', error);
      process.exit(1);
    });
}

export { seedDatabase };