// app/api/create-checkout-session/route.js
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const corsHeaders = {
  "Access-Control-Allow-Origin": "chrome-extension://jlbajdeadaajjafapaochogphndfeicb",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  // Handle preflight requests with the CORS headers
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders,
  });
}

export async function POST(req) {
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

    return NextResponse.json({ id: session.id }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500, headers: corsHeaders });
  }
}
