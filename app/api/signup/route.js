import UserHandler from '@lib/auth/userHandler';

const corsHeaders = {
  "Access-Control-Allow-Origin": "chrome-extension://jlbajdeadaajjafapaochogphndfeicb",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Respond to preflight requests with CORS headers
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request) {
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
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    // Create new user
    const newUser = await UserHandler.createUser({ username, email, password });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while creating the user.',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
