import UserHandler from '@lib/auth/userHandler';

// Define allowed origins. Update this list as needed.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe",
  // Add your Vercel preview/production URLs if needed
  "chrome-extension://dlimagmnfejadhgiedoepmbpmnkceddo",
  "https://estimate-frontend-beta-git-develop-jons-projects-566ae2e5.vercel.app"
];

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
  // Respond to preflight requests with dynamic CORS headers
  return new Response(null, {
    status: 200,
    headers,
  });
}

export async function POST(request) {
  const headers = {
    ...getCorsHeaders(request),
    "Content-Type": "application/json"
  };

  try {
    const { username, email, password } = await request.json();

    // Check if the user already exists
    const existingUserUsername = await UserHandler.getUserByUsername(username);
    const existingUserEmail = await UserHandler.getUserByEmail(email);

    if (existingUserEmail || existingUserUsername) {
      return new Response(
        JSON.stringify({ error: 'User already exists' }),
        {
          status: 400,
          headers,
        }
      );
    }
    // Create new user
    const newUser = await UserHandler.createUser({ username, email, password });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while creating the user.',
        details: error.message
      }),
      {
        status: 500,
        headers,
      }
    );
  }
}
