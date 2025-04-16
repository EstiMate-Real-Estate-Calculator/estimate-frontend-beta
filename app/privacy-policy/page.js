'use client';

import HeaderComponent from "@components/Header/Header";
import EstimateFooter from "@components/Footer/Footer";

const PrivacyPolicy = () => {
    return (
        <>
            <HeaderComponent />
            <div className="max-w-4xl mx-auto px-6 py-10 text-gray-800">
                <div className="bg-white rounded-xl shadow-md p-6 md:p-10">
                    <h1 className="text-4xl font-extrabold mb-2" style={{ color: '#155E75' }}>Privacy Policy</h1>
                    <p className="text-sm text-gray-500 mb-6">Effective Date: October 15, 2024</p>

                    <p className="mb-6">
                        At <span className="font-semibold" style={{ color: '#155E75' }}>EstiMate</span>, we value your privacy. This Privacy Policy outlines the types of information we collect, how we use and protect it, and your choices regarding your information.
                    </p>

                    <Section
                        title="1. Information We Collect"
                        content={[
                            {
                                label: "Account Information:",
                                text: "When you create an account, we collect the username and password you provide."
                            },
                            {
                                label: "Calculation Data:",
                                text: "EstiMate stores the property investment calculations you perform using the extension. This data is associated with your account for your convenience."
                            }
                        ]}
                    />

                    <Section
                        title="2. How We Use Your Information"
                        content={[
                            {
                                label: "Providing Services:",
                                text: "The information collected is used to operate and improve EstiMate, providing you with accurate property value calculations."
                            },
                            {
                                label: "Account Management:",
                                text: "We use your account details to manage your access to EstiMate and store your calculation history."
                            }
                        ]}
                    />

                    <Section
                        title="3. Data Sharing and Disclosure"
                        content={[
                            {
                                label: "No Third-Party Sharing:",
                                text: "EstiMate does not share, sell, or transfer your personal data to any third parties. The information collected is used solely for the operation of the EstiMate extension."
                            }
                        ]}
                    />

                    <Section
                        title="4. Data Security"
                        content={[
                            {
                                text: "We implement standard security measures to protect your information. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security."
                            }
                        ]}
                    />

                    <Section
                        title="5. Your Choices"
                        content={[
                            {
                                label: "Account Access and Management:",
                                text: "You can access, update, or delete your account information at any time through the EstiMate extension."
                            }
                        ]}
                    />

                    <Section
                        title="6. Changes to This Privacy Policy"
                        content={[
                            {
                                text: "EstiMate may update this Privacy Policy occasionally. If changes are made, the updated policy will be posted within the extension, and the effective date will be updated accordingly."
                            }
                        ]}
                    />

                    <Section
                        title="7. Contact Us"
                        content={[
                            {
                                text: "If you have any questions about this Privacy Policy or EstiMate’s data practices, please contact us at [Contact Information]."
                            }
                        ]}
                    />

                    <p className="mt-8">
                        By using the <span className="font-semibold" style={{ color: '#155E75' }}>EstiMate</span> extension, you agree to this Privacy Policy. Thank you for trusting us with your property value calculations.
                    </p>
                </div>
            </div>
            <EstimateFooter />
        </>
    );
};

const Section = ({ title, content }) => (
    <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        {content.map((item, index) => (
            <p key={index} className="mb-2">
                {item.label && <strong className="text-gray-700">{item.label} </strong>}
                {item.text}
            </p>
        ))}
    </div>
);

export default PrivacyPolicy;
