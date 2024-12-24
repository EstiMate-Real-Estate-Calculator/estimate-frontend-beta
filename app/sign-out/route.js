export async function POST() {
  try {

    return new Response(JSON.stringify({ message: 'Successfully signed out' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
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
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}