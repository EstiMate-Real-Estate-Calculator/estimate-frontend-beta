import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
    const { subscriptionId } = await req.json(); // Get the subscription ID from the request body

    try {
        // Cancel the subscription
        const deletedSubscription = await stripe.subscriptions.del(subscriptionId);

        return NextResponse.json({ success: true, subscription: deletedSubscription });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}