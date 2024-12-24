'use client'; // This is a client component

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CancelSubscriptionPage() {
    const [subscriptionId, setSubscriptionId] = useState(''); // State to hold the subscription ID
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        // Call your backend to cancel the subscription
        const response = await fetch('/api/cancel-subscription', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ subscriptionId }), // Send the subscription ID to the backend
        });

        const result = await response.json();

        if (response.ok) {
            // Handle successful cancellation (e.g., redirect or show a success message)
            alert('Subscription canceled successfully!');
            router.push('/'); // Redirect to the homepage or another page
        } else {
            setError(result.message || 'Failed to cancel subscription');
        }

        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Cancel Subscription</h1>
                <p className="text-center text-gray-600">Enter your subscription ID to cancel.</p>

                {error && <div className="p-2 text-red-600 bg-red-100 rounded">{error}</div>}

                <form onSubmit={handleCancel} className="space-y-4">
                    <div>
                        <label htmlFor="subscriptionId" className="block text-sm font-medium text-gray-700">Subscription ID</label>
                        <input
                            type="text"
                            id="subscriptionId"
                            placeholder="Enter your subscription ID"
                            value={subscriptionId}
                            onChange={(e) => setSubscriptionId(e.target.value)}
                            required
                            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 text-white font-semibold rounded-md ${loading ? 'bg-gray-400' : 'bg-red-600 hover:bg-red-500'} transition duration-200`}
                    >
                        {loading ? 'Processing...' : 'Cancel Subscription'}
                    </button>
                </form>
            </div>
        </div>
    );
}