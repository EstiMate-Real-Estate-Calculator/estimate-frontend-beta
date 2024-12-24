   // app/cancel/page.js
   export default function CancelPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Payment Canceled</h1>
                <p className="text-center text-gray-600">Your payment has been canceled. You can try again or contact support if you need assistance.</p>
                <a href="/payment" className="block w-full py-2 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition duration-200">
                    Try Again
                </a>
                <a href="/" className="block w-full py-2 text-center text-gray-600 border border-gray-300 rounded-md hover:bg-gray-200 transition duration-200">
                    Back to Home
                </a>
            </div>
        </div>
    );
}