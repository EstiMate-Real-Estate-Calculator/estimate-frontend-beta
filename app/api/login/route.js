import AuthHandler from '@lib/auth/authHandler';

// Define allowed origins. Adjust this list as needed.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe"
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
  // Respond to preflight requests with the dynamic CORS headers
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
    const { username, email, password } = await request.json();

    // Validate input
    if (!username && !email) {
      return new Response(
        JSON.stringify({ message: 'Username or email is required' }),
        {
          status: 400,
          headers,
        }
      );
    }

    const response = await AuthHandler.logIn({ username, email, password });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers,
    });
  } catch (error) {
    let errorMessage = 'An error occurred while signing in.';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      // Optionally add more specific error handling here
      // e.g., if (error.message === 'Invalid credentials') { statusCode = 401; }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: statusCode,
        headers,
      }
    );
  }
}
