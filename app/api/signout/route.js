const corsHeaders = {
  "Access-Control-Allow-Origin": "chrome-extension://jlbajdeadaajjafapaochogphndfeicb",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Respond to preflight requests with the CORS headers
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST() {
  try {
    return new Response(
      JSON.stringify({ message: 'Successfully signed out' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    let errorMessage = 'An error occurred while signing out.';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      // You can add more specific error handling here if needed
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
