const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedAdmin() {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@vidcrafter.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    const admin = await prisma.user.create({
      data: {
        email: 'admin@vidcrafter.com',
        password_hash: passwordHash,
        ip_address: 'localhost',
        is_admin: true,
        coupon_balance: 100
      }
    });

    console.log('Admin user created successfully:', admin.email);
    console.log('Login credentials:');
    console.log('Email: admin@vidcrafter.com');
    console.log('Password: admin123');

    // Create some sample coupons
    const sampleCoupons = [
      { value: 1 },
      { value: 3 },
      { value: 5 },
      { value: 10 }
    ];

    for (const couponData of sampleCoupons) {
      const code = Math.random().toString(36).substring(2, 14).toUpperCase();
      await prisma.coupon.create({
        data: {
          code,
          value: couponData.value,
          created_by_admin: admin.email
        }
      });
      console.log(`Created coupon: ${code} (${couponData.value} generations)`);
    }

  } catch (error) {
    console.error('Error seeding admin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();