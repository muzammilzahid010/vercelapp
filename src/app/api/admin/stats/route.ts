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

export async function GET(request: NextRequest) {
  try {
    const adminUser = await getAdminUser(request);
    
    if (!adminUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get total videos
    const totalVideos = await db.generationLog.count();
    
    // Get successful videos
    const successfulVideos = await db.generationLog.count({
      where: { status: 'success' }
    });
    
    // Get failed videos
    const failedVideos = await db.generationLog.count({
      where: { status: 'failed' }
    });
    
    // Calculate success rate
    const successRate = totalVideos > 0 ? (successfulVideos / totalVideos) * 100 : 0;
    
    // Get total users
    const totalUsers = await db.user.count();
    
    // Get total coupons used
    const totalCouponsUsed = await db.coupon.count({
      where: { used: true }
    });

    return NextResponse.json({
      totalVideos,
      successfulVideos,
      failedVideos,
      successRate,
      totalUsers,
      totalCouponsUsed
    });

  } catch (error) {
    console.error('Stats retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}