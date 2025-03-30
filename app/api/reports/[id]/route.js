import { NextResponse } from 'next/server';
import ReportsHandler from '@lib/reportsHandler';
import validateCookie from '@lib/auth/validateCookie';

// Define allowed origins. Update this list as needed.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe",
  // Add your Vercel preview/production URLs if needed
  "chrome-extension://dlimagmnfejadhgiedoepmbpmnkceddo",
  "https://estimate-frontend-beta-git-develop-jons-projects-566ae2e5.vercel.app"
];

// Helper function to build dynamic CORS headers based on the request's origin.
function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "null";
  }
  return headers;
}

export async function OPTIONS(request) {
  const headers = getCorsHeaders(request);
  // Respond to preflight requests with the dynamic CORS headers.
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function GET(request, { params }) {
  const headers = getCorsHeaders(request);
  const { id } = params;

  if (!id) {
    return NextResponse.json(
      { error: 'ID is required' },
      { status: 400, headers }
    );
  }

  try {
    // Validate that the request is coming from a valid authToken.
    const validCookie = await validateCookie();

    if (validCookie) {
      // Get the report for the user.
      const report = await ReportsHandler.getReportById(id, validCookie.userId);

      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404, headers }
        );
      }

      return NextResponse.json(report, { status: 200, headers });
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch report.' },
      { status: 500, headers }
    );
  }
}

export async function PUT(request, { params }) {
  const headers = getCorsHeaders(request);
  const { id } = params;
  const reportData = await request.json();

  try {
    // Validate that the request is coming from a valid authToken.
    const validCookie = await validateCookie();

    if (validCookie) {
      // Update the report.
      const updatedReport = await ReportsHandler.updateReport(
        id,
        validCookie.userId,
        reportData
      );

      if (!updatedReport) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404, headers }
        );
      }

      return NextResponse.json(updatedReport, { status: 200, headers });
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to update report.' },
      { status: 500, headers }
    );
  }
}

export async function DELETE(request, { params }) {
  const headers = getCorsHeaders(request);
  const { id } = params;

  try {
    // Validate that the request is coming from a valid authToken.
    const validCookie = await validateCookie();

    if (validCookie) {
      // Attempt to delete the report.
      const deletedReport = await ReportsHandler.deleteReport(
        id,
        validCookie.userId
      );

      if (!deletedReport) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404, headers }
        );
      }

      return NextResponse.json(
        { message: 'Report deleted successfully' },
        { status: 204, headers }
      );
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete report.' },
      { status: 500, headers }
    );
  }
}
