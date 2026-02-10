import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  console.log('Creating global settings...');
  await prisma.globalSetting.upsert({
    where: { key: 'FLAT_RATE_PER_HOUR' },
    update: { value: 50000 },
    create: {
      key: 'FLAT_RATE_PER_HOUR',
      value: 50000,
    },
  });

  console.log('Creating departments...');
  const departments = await Promise.all([
    prisma.department.upsert({
      where: { name: 'IT' },
      update: {},
      create: { name: 'IT' },
    }),
    prisma.department.upsert({
      where: { name: 'Store' },
      update: {},
      create: { name: 'Store' },
    }),
    prisma.department.upsert({
      where: { name: 'Finance' },
      update: {},
      create: { name: 'Finance' },
    }),
    prisma.department.upsert({
      where: { name: 'HRD' },
      update: {},
      create: { name: 'HRD' },
    }),
    prisma.department.upsert({
      where: { name: 'Marketing' },
      update: {},
      create: { name: 'Marketing' },
    }),
  ]);

  console.log('Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const financeUser = await prisma.user.upsert({
    where: { email: 'finance@dewaunited.com' },
    update: {},
    create: {
      email: 'finance@dewaunited.com',
      name: 'Finance Manager',
      password: hashedPassword,
      role: 'FINANCE',
      deptId: departments.find((d) => d.name === 'Finance')?.id,
    },
  });

  const hrdUser = await prisma.user.upsert({
    where: { email: 'hrd@dewaunited.com' },
    update: {},
    create: {
      email: 'hrd@dewaunited.com',
      name: 'HRD Manager',
      password: hashedPassword,
      role: 'HRD',
      deptId: departments.find((d) => d.name === 'HRD')?.id,
    },
  });

  const clevelUser = await prisma.user.upsert({
    where: { email: 'clevel@dewaunited.com' },
    update: {},
    create: {
      email: 'clevel@dewaunited.com',
      name: 'Director',
      password: hashedPassword,
      role: 'C_LEVEL',
      deptId: departments.find((d) => d.name === 'IT')?.id,
    },
  });

  const picIT = await prisma.user.upsert({
    where: { email: 'pic.it@dewaunited.com' },
    update: {},
    create: {
      email: 'pic.it@dewaunited.com',
      name: 'IT Team Lead',
      password: hashedPassword,
      role: 'PIC',
      deptId: departments.find((d) => d.name === 'IT')?.id,
    },
  });

  const employee1 = await prisma.user.upsert({
    where: { email: 'faris@dewaunited.com' },
    update: {},
    create: {
      email: 'faris@dewaunited.com',
      name: 'Faris',
      password: hashedPassword,
      role: 'EMPLOYEE',
      deptId: departments.find((d) => d.name === 'IT')?.id,
    },
  });

  const employee2 = await prisma.user.upsert({
    where: { email: 'arul@dewaunited.com' },
    update: {},
    create: {
      email: 'arul@dewaunited.com',
      name: 'Arul',
      password: hashedPassword,
      role: 'EMPLOYEE',
      deptId: departments.find((d) => d.name === 'Store')?.id,
    },
  });

  console.log('Seed completed!');
  console.log('\n Login credentials (all users):');
  console.log('Password: password123');
  console.log('\n Users created:');
  console.log('- finance@dewaunited.com (FINANCE)');
  console.log('- hrd@dewaunited.com (HRD)');
  console.log('- clevel@dewaunited.com (C_LEVEL)');
  console.log('- pic.it@dewaunited.com (PIC)');
  console.log('- faris@dewaunited.com (EMPLOYEE)');
  console.log('- arul@dewaunited.com (EMPLOYEE)');
}

main()
  .catch((e) => {
    console.error(' Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
