import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readdir, stat } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { url, filename, fileType = 'video' } = await request.json();

    if (!url || !filename) {
      return NextResponse.json(
        { error: 'URL and filename are required' },
        { status: 400 }
      );
    }

    // Create downloads directory if it doesn't exist
    const downloadsDir = join(process.cwd(), 'downloads', fileType);
    if (!existsSync(downloadsDir)) {
      await mkdir(downloadsDir, { recursive: true });
    }

    // Download the file
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to download file: ${response.statusText}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const filePath = join(downloadsDir, filename);

    // Save the file locally
    await writeFile(filePath, buffer);

    // Return the local file URL
    const localUrl = `/api/files/${fileType}/${filename}`;

    return NextResponse.json({
      success: true,
      localUrl,
      filename,
      size: buffer.length,
      originalUrl: url
    });

  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('type') || 'video';
    
    const downloadsDir = join(process.cwd(), 'downloads', fileType);
    
    if (!existsSync(downloadsDir)) {
      return NextResponse.json({ files: [] });
    }

    const files = await readdir(downloadsDir);
    
    const fileList = await Promise.all(files.map(async (file: string) => {
      const filePath = join(downloadsDir, file);
      const stats = await stat(filePath);
      
      return {
        filename: file,
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        url: `/api/files/${fileType}/${file}`,
        downloadUrl: `/api/download/file?file=${file}&type=${fileType}`
      };
    }));

    return NextResponse.json({ files: fileList });

  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}