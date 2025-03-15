import UserHandler from '@lib/auth/userHandler';
import validateCookie from '@lib/auth/validateCookie';
import ReportsHandler from '@lib/reportsHandler';
import { NextResponse } from 'next/server';

const corsHeaders = {
  "Access-Control-Allow-Origin": "chrome-extension://jlbajdeadaajjafapaochogphndfeicb",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Handle preflight requests with CORS headers
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();

    if (data) {
      const { reportData, username, reportType } = data;
      const user = await UserHandler.getUserByUsername(username);

      if (reportType === "rental") {
        // Create a new report for the user
        const newReport = await ReportsHandler.createReport({
          ...reportData,
          userId: user.id,
        });
        return NextResponse.json(newReport, { status: 201, headers: corsHeaders });
      } else {
        return NextResponse.json(
          { error: 'Invalid Report Type' },
          { status: 401, headers: corsHeaders }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to create report.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    // Validate request is coming from a valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Get reports for the user
      const reports = await ReportsHandler.getReportsByUserId(validCookie.userId);
      return NextResponse.json(reports, { status: 200, headers: corsHeaders });
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500, headers: corsHeaders }
    );
  }
}
