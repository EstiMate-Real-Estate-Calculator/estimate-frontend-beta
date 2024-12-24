import AuthHandler from '@lib/auth/authHandler';

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    // Validate input
    if (!username && !email) {
      return new Response(
        JSON.stringify({ message: 'Username or email is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const response = await AuthHandler.logIn({ username, email, password });

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {

    let errorMessage = 'An error occurred while signing in.';
    let statusCode = 500;

    if (error instanceof Error) {
      errorMessage = error.message;
      // You can add more specific error handling here if needed
      // For example:
      // if (error.message === 'Invalid credentials') {
      //   statusCode = 401;
      // }
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: statusCode,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
