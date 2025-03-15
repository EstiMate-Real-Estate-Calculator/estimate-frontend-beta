import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define allowed origins.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://jlbajdeadaajjafapaochogphndfeicb"
];

// Helper function to build dynamic CORS headers.
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
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function POST(request) {
  const headers = getCorsHeaders(request);
  try {
    const { subscriptionId } = await request.json(); // Get the subscription ID from the request body

    // Cancel the subscription
    const deletedSubscription = await stripe.subscriptions.del(subscriptionId);

    return NextResponse.json(
      { success: true, subscription: deletedSubscription },
      { headers }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500, headers }
    );
  }
}
