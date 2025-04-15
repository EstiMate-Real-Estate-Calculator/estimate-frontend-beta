import UserHandler from '@lib/auth/userHandler';
import validateCookie from '@lib/auth/validateCookie';
import { NextResponse } from 'next/server';

const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe",
  "chrome-extension://dlimagmnfejadhgiedoepmbpmnkceddo",
  "https://estimate-frontend-beta-git-develop-jons-projects-566ae2e5.vercel.app"
];

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
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function GET(request) {
  const headers = getCorsHeaders(request);
  try {
    const validCookie = await validateCookie();

    if (!validCookie) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401, headers }
      );
    }

    const user = await UserHandler.getUserById(validCookie.userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404, headers }
      );
    }

    return NextResponse.json(user, { status: 200, headers });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      {
        message: 'Failed to fetch profile',
        error: error.message,
        details: error.stack,
      },
      { status: 500, headers }
    );
  }
}