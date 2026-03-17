/**
 * Production Database Seeder
 *
 * Seeds minimal required data for production deployment:
 * - System admin user
 * - Default CRM activity types
 * - System configuration
 *
 * WARNING: This should only be run ONCE on initial deployment
 *
 * Usage:
 *   npm run seed:production
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production database seeding...');

  // Check if admin already exists
  const existingAdmin = await prisma.user.findFirst({
    where: { role: 'admin' },
  });

  if (existingAdmin) {
    console.log('⚠️  Admin user already exists. Skipping user creation.');
  } else {
    // Create system admin user
    const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@storagecompare.ae';

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        phone: '+971500000000',
        role: 'admin',
        isActive: true,
        emailVerified: true,
      },
    });

    console.log(`✅ Created admin user: ${admin.email}`);
    console.log(`⚠️  IMPORTANT: Change admin password immediately after first login!`);
  }

  // Create default CRM activity types
  const defaultActivityTypes = [
    { name: 'Call', description: 'Phone call with lead/customer', icon: 'phone' },
    { name: 'Email', description: 'Email communication', icon: 'mail' },
    { name: 'Meeting', description: 'In-person or virtual meeting', icon: 'users' },
    { name: 'Note', description: 'General note or comment', icon: 'file-text' },
    { name: 'Task', description: 'Follow-up task', icon: 'check-square' },
    { name: 'WhatsApp', description: 'WhatsApp communication', icon: 'message-circle' },
  ];

  for (const type of defaultActivityTypes) {
    await prisma.crmActivityType.upsert({
      where: { name: type.name },
      update: {},
      create: type,
    });
  }

  console.log('✅ Created default CRM activity types');

  console.log('🎉 Production seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
