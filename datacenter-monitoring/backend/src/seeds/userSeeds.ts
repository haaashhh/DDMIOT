import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User, UserRole } from '../entities/User';

export const seedUsers = async (): Promise<void> => {
  const userRepository = AppDataSource.getRepository(User);

  try {
    // Check if users already exist
    const existingUsers = await userRepository.count();
    if (existingUsers > 0) {
      console.log('👥 Users already exist, skipping user seeding...');
      return;
    }

    console.log('👥 Seeding users...');

    const saltRounds = 12;

    // Create default admin user
    const adminUser = userRepository.create({
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@datacenter.com',
      password_hash: await bcrypt.hash('admin123!', saltRounds),
      role: UserRole.ADMIN,
      is_active: true,
    });

    // Create default regular user
    const regularUser = userRepository.create({
      first_name: 'John',
      last_name: 'Doe',
      email: 'user@datacenter.com',
      password_hash: await bcrypt.hash('user123!', saltRounds),
      role: UserRole.USER,
      is_active: true,
    });

    // Create default viewer user
    const viewerUser = userRepository.create({
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'viewer@datacenter.com',
      password_hash: await bcrypt.hash('viewer123!', saltRounds),
      role: UserRole.VIEWER,
      is_active: true,
    });

    const users = [adminUser, regularUser, viewerUser];

    await userRepository.save(users);

    console.log(`✅ Successfully seeded ${users.length} users:`);
    console.log('   📧 admin@datacenter.com (Admin) - Password: admin123!');
    console.log('   📧 user@datacenter.com (User) - Password: user123!');
    console.log('   📧 viewer@datacenter.com (Viewer) - Password: viewer123!');
  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  }
};

// Run the seed function if this file is executed directly
const main = async () => {
  try {
    await AppDataSource.initialize();
    console.log('📡 Database connection established for seeding');
    
    await seedUsers();
    
    await AppDataSource.destroy();
    console.log('📡 Database connection closed');
    console.log('🎉 User seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed users:', error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}