import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const adminPasswordHash = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });

  console.log('Created admin user:', admin.email);

  // Create test user
  const userPasswordHash = await bcrypt.hash('User123!', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      passwordHash: userPasswordHash,
      role: 'USER',
    },
  });

  console.log('Created test user:', user.email);

  // Create sample items for test user
  await prisma.item.createMany({
    data: [
      {
        title: 'Sample Item 1',
        description: 'This is a sample active item',
        status: 'ACTIVE',
        userId: user.id,
      },
      {
        title: 'Sample Item 2',
        description: 'This is a completed item',
        status: 'COMPLETED',
        userId: user.id,
      },
      {
        title: 'Sample Item 3',
        description: 'This is an archived item',
        status: 'ARCHIVED',
        userId: user.id,
      },
    ],
    skipDuplicates: true,
  });

  console.log('Created sample items for test user');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
