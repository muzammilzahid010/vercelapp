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

    const { video_type, status, reason, prompt, orientation, story_script, characters, response_data } = await request.json();

    const log = await db.generationLog.create({
      data: {
        userId: user.id,
        video_type,
        status,
        reason,
        prompt,
        orientation,
        story_script,
        characters,
        response_data
      }
    });

    return NextResponse.json({ success: true, log });
  } catch (error) {
    console.error('Log creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
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

    const logs = await db.generationLog.findMany({
      where: { userId: user.id },
      orderBy: { timestamp: 'desc' },
      take: 50
    });

    return NextResponse.json({ logs });
  } catch (error) {
    console.error('Log retrieval error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}