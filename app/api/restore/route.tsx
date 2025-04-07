import { PrismaClient } from '@prisma/client'
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  // Authorization
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.BACKUP_API_KEY) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const { backupUrl } = await request.json();
    
    if (!backupUrl) {
      return NextResponse.json(
        { error: 'Missing backupUrl in request body' },
        { status: 400 }
      );
    }

    // Extract filename from URL
    const filename = backupUrl.split('/').pop()?.split('?')[0];
    if (!filename) {
      return NextResponse.json(
        { error: 'Invalid backup URL format' },
        { status: 400 }
      );
    }

    // Download backup file from Supabase
    const { data: fileData, error: downloadError } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME!)
      .download(`backups/${filename}`);

    if (downloadError || !fileData) {
      return NextResponse.json(
        { error: 'Failed to download backup', details: downloadError?.message },
        { status: 404 }
      );
    }

    // Parse backup data
    const backupContent = await fileData.text();
    const backupData = JSON.parse(backupContent);

    // Begin database restoration
    await prisma.$transaction(async (tx) => {
      // Clear existing data (in specific order to maintain referential integrity)
      await tx.userTokens.deleteMany();
      await tx.tutorials.deleteMany();
      await tx.reports.deleteMany();
      await tx.bRRRRReports.deleteMany();
      await tx.users.deleteMany();

      // Restore data (in reverse order of deletion)
      if (backupData.users) {
        await tx.users.createMany({
          data: backupData.users.map((user: any) => ({
            id: user.id,
            username: user.username,
            email: user.email,
            privateKey: user.privateKey || '', // Handle missing fields
            uniqueToken: user.uniqueToken || '',
            password: user.password || '',
            creation_date: user.creation_date,
            tutorials: user.tutorials || null
          })),
          skipDuplicates: true
        });
      }

      if (backupData.tutorials) {
        await tx.tutorials.createMany({
          data: backupData.tutorials,
          skipDuplicates: true
        });
      }

      if (backupData.reports) {
        await tx.reports.createMany({
          data: backupData.reports,
          skipDuplicates: true
        });
      }

      if (backupData.brrrrReports) {
        await tx.bRRRRReports.createMany({
          data: backupData.brrrrReports,
          skipDuplicates: true
        });
      }

      if (backupData.userTokens) {
        await tx.userTokens.createMany({
          data: backupData.userTokens,
          skipDuplicates: true
        });
      }
    });

    return NextResponse.json({
      success: true,
      restored: {
        users: backupData.users?.length || 0,
        reports: backupData.reports?.length || 0,
        brrrrReports: backupData.brrrrReports?.length || 0,
        userTokens: backupData.userTokens?.length || 0,
        tutorials: backupData.tutorials?.length || 0
      }
    });

  } catch (error: any) {
    console.error('Restore failed:', error);
    return NextResponse.json(
      { 
        error: 'Database restoration failed',
        message: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// Block non-POST methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}