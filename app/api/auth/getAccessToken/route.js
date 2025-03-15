import TokenHandler from "@lib/auth/tokenHandler";
import AuthHandler from "@lib/auth/authHandler";

// List of allowed origins.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe"
];

// Dynamically build CORS headers based on the request's origin.
function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  
  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    // Optionally, you could set a fallback value or leave the header out.
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
    "Content-Type": "application/json"
  };

  try {
    const { username, password } = await request.json();
    const { userid } = await AuthHandler.logIn({ username, password });

    // Ensure userId is a number
    const numericUserId = Number(userid);
    if (isNaN(numericUserId)) {
      throw new Error('Invalid userId returned from login');
    }

    const token = await TokenHandler.getToken(numericUserId);

    return new Response(JSON.stringify({ token }), {
      status: 200,
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
