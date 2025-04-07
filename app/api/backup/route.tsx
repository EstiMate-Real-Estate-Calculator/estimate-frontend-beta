// app/api/backup/route.ts
import { PrismaClient } from '@prisma/client';
import moment from 'moment';
import { createClient } from '@supabase/supabase-js';

const prisma = new PrismaClient();
const supabase = createClient(
  process.env.SUPABASE_PROJECT_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  // Authorization
  const apiKey = request.headers.get('x-api-key');
  if (apiKey !== process.env.BACKUP_API_KEY) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
    const backupFileName = `backup_${timestamp}.json`;

    // Fetch all data from your models
    const backupData = {
      reports: await prisma.reports.findMany(),
      brrrrReports: await prisma.bRRRRReports.findMany(),
      userTokens: await prisma.userTokens.findMany(),
      tutorials: await prisma.tutorials.findMany(),
      users: await prisma.users.findMany(),
      metadata: {
        backupDate: new Date().toISOString(),
        recordCounts: {
          reports: await prisma.reports.count(),
          brrrrReports: await prisma.bRRRRReports.count(),
          userTokens: await prisma.userTokens.count(),
          tutorials: await prisma.tutorials.count(),
          users: await prisma.users.count(),
        }
      }
    };

    // Convert to JSON string
    const backupContent = JSON.stringify(backupData, null, 2);

    // Upload to Supabase Storage
    const { error } = await supabase.storage
      .from(process.env.SUPABASE_BUCKET_NAME!)
      .upload(`backups/${backupFileName}`, backupContent, {
        contentType: 'application/json',
        upsert: false
      });

    if (error) throw error;

    return new Response(JSON.stringify({
      success: true,
      fileName: backupFileName,
      recordCounts: backupData.metadata.recordCounts,
      size: `${(backupContent.length / 1024).toFixed(2)} KB`
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Backup failed:', error);
    return new Response(JSON.stringify({
      error: 'Backup failed',
      message: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  } finally {
    await prisma.$disconnect();
  }
}

// Block non-POST methods
export async function GET() {
  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
}