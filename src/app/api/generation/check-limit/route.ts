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

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has coupon balance
    if (user.coupon_balance > 0) {
      return NextResponse.json({
        canGenerate: true,
        remaining: user.coupon_balance,
        type: 'coupon'
      });
    }

    // Check IP-based limit (2 free videos per IP)
    const ipGenerations = await db.generationLog.count({
      where: {
        userId: user.id,
        video_type: 'cartoon',
        status: 'success'
      }
    });

    const canGenerate = ipGenerations < 2;
    const remaining = Math.max(0, 2 - ipGenerations);

    return NextResponse.json({
      canGenerate,
      remaining,
      type: 'free',
      totalGenerated: ipGenerations
    });

  } catch (error) {
    console.error('Limit check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}