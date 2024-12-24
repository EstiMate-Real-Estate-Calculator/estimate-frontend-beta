import UserHandler from '@lib/auth/userHandler';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // Check if the user already exists
    const existingUserUsername = await UserHandler.getUserByUsername(username);
    const existingUserEmail = await UserHandler.getUserByEmail(email);

    if (existingUserEmail || existingUserUsername) {
      return new Response(JSON.stringify({ error: 'User already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    // Create new user
    const newUser = await UserHandler.createUser({ username, email, password });

    return new Response(JSON.stringify(newUser), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        error: 'An error occurred while creating the user.',
        details: error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
