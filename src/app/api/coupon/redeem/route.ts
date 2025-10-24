import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

async function getUserFromRequest(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });
    return user;
  } catch (error) {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { error: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find coupon
    const coupon = await db.coupon.findUnique({
      where: { code: code.toUpperCase() }
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Invalid coupon code' },
        { status: 404 }
      );
    }

    if (coupon.used) {
      return NextResponse.json(
        { error: 'Coupon has already been used' },
        { status: 400 }
      );
    }

    // Mark coupon as used
    await db.coupon.update({
      where: { id: coupon.id },
      data: {
        used: true,
        used_by_user: user.email
      }
    });

    // Create coupon usage record
    await db.couponUsage.create({
      data: {
        userId: user.id,
        couponId: coupon.id
      }
    });

    // Update user's coupon balance
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        coupon_balance: user.coupon_balance + coupon.value
      }
    });

    return NextResponse.json({
      message: 'Coupon redeemed successfully',
      newBalance: updatedUser.coupon_balance,
      couponValue: coupon.value
    });

  } catch (error) {
    console.error('Coupon redemption error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}