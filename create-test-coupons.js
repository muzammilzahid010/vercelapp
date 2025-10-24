const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createTestCoupons() {
  try {
    // Get admin user
    const admin = await prisma.user.findUnique({
      where: { email: 'admin@vidcrafter.com' }
    });

    if (!admin) {
      console.log('Admin user not found');
      return;
    }

    // Create test coupons
    const testCoupons = [
      { value: 1, prefix: 'TEST1' },
      { value: 3, prefix: 'TEST3' },
      { value: 5, prefix: 'TEST5' },
      { value: 10, prefix: 'TEST10' }
    ];

    for (const couponData of testCoupons) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${couponData.prefix}-${randomPart}`;
      
      const coupon = await prisma.coupon.create({
        data: {
          code,
          value: couponData.value,
          created_by_admin: admin.email
        }
      });
      
      console.log(`Created test coupon: ${code} (${couponData.value} generations)`);
    }

    console.log('\nTest coupons created successfully!');
    console.log('You can use these codes to test the coupon redemption feature:');
    
    const createdCoupons = await prisma.coupon.findMany({
      where: { used: false },
      orderBy: { createdAt: 'desc' },
      take: 4
    });
    
    createdCoupons.forEach(coupon => {
      console.log(`- ${coupon.code} (${coupon.value} generations)`);
    });

  } catch (error) {
    console.error('Error creating test coupons:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestCoupons();