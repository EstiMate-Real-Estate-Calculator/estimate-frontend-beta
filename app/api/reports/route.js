import UserHandler from '@lib/auth/userHandler';
import validateCookie from '@lib/auth/validateCookie';
import ReportsHandler from '@lib/reportsHandler';
import { NextResponse } from 'next/server';

// Define allowed origins. Update this list as needed.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe"
];

// Helper function to build dynamic CORS headers based on the request's origin.
function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

export async function POST(request) {
  const headers = {
    ...getCorsHeaders(request),
    "Content-Type": "application/json",
  };

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
        return NextResponse.json(newReport, { status: 201, headers });
      } else {
        return NextResponse.json(
          { error: 'Invalid Report Type' },
          { status: 401, headers }
        );
      }
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create report.' },
      { status: 500, headers }
    );
  }
}

export async function GET(request) {
  const headers = getCorsHeaders(request);
  try {
    // Validate request is coming from a valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Get reports for the user
      const reports = await ReportsHandler.getReportsByUserId(validCookie.userId);
      return NextResponse.json(reports, { status: 200, headers });
    } else {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500, headers }
    );
  }
}
