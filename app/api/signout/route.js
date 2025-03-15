// Define allowed origins. Update this list as needed.
const allowedOrigins = [
  "chrome-extension://jlbajdeadaajjafapaochogphndfeicb",
  // Example: "http://example.com", "https://example.com"
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
    // Optionally, set to a fallback or deny origin.
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
    return new Response(
      JSON.stringify({ message: 'Successfully signed out' }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    let errorMessage = 'An error occurred while signing out.';
    let statusCode = 500;
    
    if (error instanceof Error) {
      errorMessage = error.message;
      // Optionally add more specific error handling here.
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
