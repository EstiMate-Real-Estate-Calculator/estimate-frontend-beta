// app/privacy-policy/page.js
const PrivacyPolicy = () => {
    return (
        <div className="p-5">
            <h1 className="text-3xl font-bold">Privacy Policy for EstiMate</h1>
            <p className="mt-2">Effective Date: 10/15/2024</p>
            <p className="mt-4">
                At EstiMate, we value your privacy. This Privacy Policy outlines the types of information we collect, how we use and protect it, and your choices regarding your information.
            </p>
            <h2 className="mt-4 text-2xl font-semibold">1. Information We Collect</h2>
            <p>
                <strong>Account Information:</strong> When you create an account, we collect the username and password you provide.
            </p>
            <p>
                <strong>Calculation Data:</strong> EstiMate stores the property investment calculations you perform using the extension. This data is associated with your account for your convenience.
            </p>
            <h2 className="mt-4 text-2xl font-semibold">2. How We Use Your Information</h2>
            <p>
                <strong>Providing Services:</strong> The information collected is used to operate and improve EstiMate, providing you with accurate property value calculations.
            </p>
            <p>
                <strong>Account Management:</strong> We use your account details to manage your access to EstiMate and store your calculation history.
            </p>
            <h2 className="mt-4 text-2xl font-semibold">3. Data Sharing and Disclosure</h2>
            <p>
                <strong>No Third-Party Sharing:</strong> EstiMate does not share, sell, or transfer your personal data to any third parties. The information collected is used solely for the operation of the EstiMate extension.
            </p>
            <h2 className="mt-4 text-2xl font-semibold">4. Data Security</h2>
            <p>
                We implement standard security measures to protect your information. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>
            <h2 className="mt-4 text-2xl font-semibold">5. Your Choices</h2>
            <p>
                <strong>Account Access and Management:</strong> You can access, update, or delete your account information at any time through the EstiMate extension.
            </p>
            <h2 className="mt-4 text-2xl font-semibold">6. Changes to This Privacy Policy</h2>
            <p>
                EstiMate may update this Privacy Policy occasionally. If changes are made, the updated policy will be posted within the extension, and the effective date will be updated accordingly.
            </p>
            <h2 className="mt-4 text-2xl font-semibold">7. Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy or EstiMate’s data practices, please contact us at [Contact Information].
            </p>
            <p className="mt-4">
                By using the EstiMate extension, you agree to this Privacy Policy. Thank you for trusting us with your property value calculations.
            </p>
        </div>
    );
};

export default PrivacyPolicy; // Ensure this is the default export