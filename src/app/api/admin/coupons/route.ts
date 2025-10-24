import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getAdminUser(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });
    
    if (!user || !user.is_admin) {
      return null;
    }
    
    return user;
  } catch (error) {
    return null;
  }
}

function generateCouponCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 12; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
}

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const coupons = await db.coupon.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100
    });

    return NextResponse.json({ coupons });

  } catch (error) {
    console.error('Coupons retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { value } = await request.json();

    if (!value || value <= 0) {
      return NextResponse.json(
        { error: 'Invalid coupon value' },
        { status: 400 }
      );
    }

    // Generate unique coupon code
    let code = generateCouponCode();
    
    // Ensure code is unique
    while (await db.coupon.findUnique({ where: { code } })) {
      code = generateCouponCode();
    }

    // Create coupon
    const coupon = await db.coupon.create({
      data: {
        code,
        value,
        created_by_admin: adminUser.email
      }
    });

    return NextResponse.json({
      message: 'Coupon created successfully',
      coupon
    });

  } catch (error) {
    console.error('Coupon creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}