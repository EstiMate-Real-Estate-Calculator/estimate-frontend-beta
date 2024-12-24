// app/payment/page.js
'use client'; // This is a client component

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

export default function PaymentPage() {
    const [email, setEmail] = useState('');
    const [skipTrial, setSkipTrial] = useState(false); // State to manage trial preference
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handlePayment = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const stripe = await stripePromise;

        // Call your backend to create the Checkout Session
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, skipTrial }), // Send the email and trial preference to the backend
        });

        const sessionId = await response.json();

        if (response.ok) {
            // Redirect to Checkout
            const { error } = await stripe.redirectToCheckout({ sessionId: sessionId.id });
            if (error) {
                setError(error.message);
            }
        } else {
            setError(sessionId.message || 'Failed to create session');
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Subscribe to EstiMate</h1>
                <p className="text-center text-gray-600">Enter your email to start your subscription.</p>

                {error && <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handlePayment} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="mt-4">
                        <span className="block text-sm font-medium text-gray-700">Free Trial</span>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="trial-yes"
                                name="trial"
                                value="yes"
                                checked={!skipTrial}
                                onChange={() => setSkipTrial(false)}
                                className="mr-2"
                            />
                            <label htmlFor="trial-yes" className="text-sm text-gray-600">Yes, I want a free 14 day trial</label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="trial-no"
                                name="trial"
                                value="no"
                                checked={skipTrial}
                                onChange={() => setSkipTrial(true)}
                                className="mr-2"
                            />
                            <label htmlFor="trial-no" className="text-sm text-gray-600">No, skip the trial</label>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-500'} transition duration-200`}
                    >
                        {loading ? 'Processing...' : 'Subscribe Now'}
                    </button>
                </form>

                <p className="mt-4 text-sm text-center text-gray-500">
                    By subscribing, you agree to our <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
                </p>
            </div>
        </div>
    );
}
