import UserHandler from '@lib/auth/userHandler';
import validateCookie from '@lib/auth/validateCookie';
import ReportsHandler from '@lib/reportsHandler';
import { NextResponse } from 'next/server';

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

    if (!data) {
      return NextResponse.json(
        { error: 'Unauthorized: Missing request body.' },
        { status: 401, headers }
      );
    }

    const { reportData, username, reportType } = data;

    if (!username) {
        return NextResponse.json(
          { error: 'Bad Request: Missing username.' },
          { status: 400, headers }
        );
    }

    const user = await UserHandler.getUserByUsername(username);
    if (!user) {
        return NextResponse.json(
          { error: `User not found: ${username}` },
          { status: 404, headers }
        );
    }


    if (reportType === "rental") {
      // Create a new report for the user
      const newReport = await ReportsHandler.createReport({
        ...reportData,
        userId: user.id,
      });
      return NextResponse.json(newReport, { status: 201, headers });
    } else {
      return NextResponse.json(
        { error: `Invalid Report Type: ${reportType}` },
        { status: 400, headers }
      );
    }

  } catch (error) {
    console.error("Error creating report:", error); // Log the full error server-side
    return NextResponse.json(
      {
        message: 'Failed to create report.',
        error: error.message, // Include the specific error message
        details: error.stack // Optional: Include stack trace for debugging (consider removing in production)
      },
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
    console.error("Error fetching reports:", error); // Log the full error server-side
    return NextResponse.json(
      {
        message: 'Failed to fetch reports',
        error: error.message,
        details: error.stack // Optional
      },
      { status: 500, headers }
    );
  }
}