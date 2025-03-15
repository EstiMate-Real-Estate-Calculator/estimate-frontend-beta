import UserHandler from '@lib/auth/userHandler';
import TutorialHandler from '@/lib/tutorialHandler';

const corsHeaders = {
  "Access-Control-Allow-Origin": "chrome-extension://jlbajdeadaajjafapaochogphndfeicb",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Respond to preflight requests with the CORS headers
  return new Response(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(request) {
  try {
    const { name } = await request.json();

    // Get all user IDs
    const users = await UserHandler.getAllUserIds();

    // Create a new tutorial for each user
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
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // If a user ID is provided, fetch that user's tutorials
    if (id) {
      const tutorial = await TutorialHandler.getTutorialById(Number(id));
      return new Response(
        JSON.stringify({
          message: `Tutorial for user ID ${id}`,
          data: tutorial,
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } else {
      return new Response(
        JSON.stringify({ message: 'No userId provided.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}
