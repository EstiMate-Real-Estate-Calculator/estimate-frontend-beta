import { NextResponse } from 'next/server';
import ReportsHandler from '@lib/reportsHandler';
import validateCookie from '@lib/auth/validateCookie';

const corsHeaders = {
  "Access-Control-Allow-Origin": "chrome-extension://jlbajdeadaajjafapaochogphndfeicb",
  "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Respond to preflight requests with the CORS headers
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Validate request is coming from a valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Get the report for the user
      const report = await ReportsHandler.getReportById(id, validCookie.userId);

      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404, headers: corsHeaders }
        );
      }

      return NextResponse.json(report, { status: 200, headers: corsHeaders });
    } else {
      // Return unauthorized response
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch report.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const reportData = await request.json();

  try {
    // Validate request is coming from a valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Update the report
      const updatedReport = await ReportsHandler.updateReport(
        id,
        validCookie.userId,
        reportData
      );

      if (!updatedReport) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404, headers: corsHeaders }
        );
      }

      return NextResponse.json(updatedReport, { status: 200, headers: corsHeaders });
    } else {
      // Return unauthorized response
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to update report.' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // Validate request is coming from a valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Attempt to delete the report
      const deletedReport = await ReportsHandler.deleteReport(
        id,
        validCookie.userId
      );

      if (!deletedReport) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404, headers: corsHeaders }
        );
      }

      return NextResponse.json(
        { message: 'Report deleted successfully' },
        { status: 204, headers: corsHeaders }
      );
    } else {
      // Return unauthorized response
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers: corsHeaders }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete report.' },
      { status: 500, headers: corsHeaders }
    );
  }
}
