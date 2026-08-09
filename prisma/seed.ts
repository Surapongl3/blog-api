import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Hash รหัสผ่านสำหรับ Super Admin
  const hashedPassword = await bcrypt.hash('AdminPassword123!', 10);

  // สร้างหรืออัปเดตบัญชี Super Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.SUPER_ADMIN,
      isActive: true, // Super Admin โดน Active ตั้งแต่เกิด
    },
  });

  console.log('✅ Super Admin created successfully:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });