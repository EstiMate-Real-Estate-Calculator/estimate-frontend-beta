// app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Define allowed origins. Modify as needed.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://jlbajdeadaajjafapaochogphndfeicb"
];

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
  // Handle preflight requests with the dynamic CORS headers
  return new NextResponse(null, {
    status: 200,
    headers,
  });
}

export async function POST(req) {
  const headers = getCorsHeaders(req);
  const { email, skipTrial } = await req.json(); // Assuming you collect the user's email and trial preference

  try {
    // Create a Checkout Session for a subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: 'price_1Q9xzWDED9NwxNfRx2XbXzYf', // Replace with your price ID from Stripe
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/success`,
      cancel_url: `${req.headers.get('origin')}/cancel`,
      customer_email: email, // Optional: pre-fill the email for the customer
      subscription_data: {
        trial_end: skipTrial
          ? undefined
          : Math.floor(Date.now() / 1000) + (3 * 24.01 * 60 * 60), // trial period (adjust as needed)
      },
    });

    return NextResponse.json({ id: session.id }, { headers });
  } catch (error) {
    return NextResponse.json(
      { message: error.message },
      { status: 500, headers }
    );
  }
}
