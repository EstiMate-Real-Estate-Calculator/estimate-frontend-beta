import UserHandler from '@lib/auth/userHandler';
import TutorialHandler from '@lib/tutorialHandler';

// app/api/backup/route.js
import { knex } from 'knex';

const db = knex({
  client: 'pg', // Explicitly set to PostgreSQL
  connection: process.env.DATABASE_URL,
});

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
  // Respond to preflight requests with dynamic CORS headers.
  return new Response(null, {
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
    const { name } = await request.json();

    // Get all user IDs.
    const users = await UserHandler.getAllUserIds();

    // Create a new tutorial for each user.
    await Promise.all(
      users.map(async (user) => {
        await TutorialHandler.createTutorial({
          userId: user.id,
          name,
        });
      })
    );

    return new Response(JSON.stringify({ message: 'success' }), {
      status: 201, // Created
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      {
        status: 500,
        headers,
      }
    );
  }
}

export async function GET(request) {
  const headers = {
    ...getCorsHeaders(request),
    "Content-Type": "application/json",
  };

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If a user ID is provided, fetch that user's tutorials.
    if (id) {
      const tutorial = await TutorialHandler.getTutorialById(Number(id));
      return new Response(
        JSON.stringify({
          message: `Tutorial for user ID ${id}`,
          data: tutorial,
        }),
        { status: 200, headers }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'No userId provided.' }),
        { status: 400, headers }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers }
    );
  }
}
