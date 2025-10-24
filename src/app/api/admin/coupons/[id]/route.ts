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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const adminUser = await getAdminUser(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const couponId = params.id;

    // Check if coupon exists
    const coupon = await db.coupon.findUnique({
      where: { id: couponId }
    });

    if (!coupon) {
      return NextResponse.json(
        { error: 'Coupon not found' },
        { status: 404 }
      );
    }

    // Delete coupon usage records first
    await db.couponUsage.deleteMany({
      where: { couponId }
    });

    // Delete coupon
    await db.coupon.delete({
      where: { id: couponId }
    });

    return NextResponse.json({
      message: 'Coupon deleted successfully'
    });

  } catch (error) {
    console.error('Coupon deletion error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}