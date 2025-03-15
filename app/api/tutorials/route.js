import UserHandler from '@lib/auth/userHandler';
import TutorialHandler from '@/lib/tutorialHandler';

// Create a new tutorial for each user
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
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// List tutorials
// - If ?userId=123 is provided, list that user's tutorials
// - If no query param, you can decide to either fetch all or return an error
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams)
    const id = searchParams.get('id');

    // If userId is provided, fetch that usr's tutorials
    if (id) {
      const tutorial = await TutorialHandler.getTutorialById(Number(id));
      return new Response(
        JSON.stringify({
          message: `Tutorial for user ID ${id}`,
          data: tutorial,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // If you want to list ALL tutorials, you'd need a getAllTutorials() method
      // in your TutorialHandler. Example:
      //
      // const allTutorials = await TutorialHandler.getAllTutorials();
      // return new Response(JSON.stringify({ data: allTutorials }), { ... });
      //
      // Or, if you only allow fetching by userId, return a 400 or 404:
      return new Response(
        JSON.stringify({ message: 'No userId provided.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal Server Error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
