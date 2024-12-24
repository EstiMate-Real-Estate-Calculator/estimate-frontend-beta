   // app/success/page.js
   export default function SuccessPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center text-gray-800">Payment Successful!</h1>
                <p className="text-center text-gray-600">Thank you for your subscription. You can now access your account.</p>
                <a href="/sign-up" className="block w-full py-2 text-center text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition duration-200">
                    Go to Sign Up
                </a>
            </div>
        </div>
    );
}