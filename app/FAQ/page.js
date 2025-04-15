'use client';
import { useState } from 'react';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import HeaderComponent from '@components/Header/Header';
import EstimateFooter from '@components/Footer/Footer';

const FAQPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is EstiMate?",
      answer: "EstiMate is a platform to make analyzing investment properties easy. By eliminating the friction in calculating investment value, users can quickly find a property that they want to invest in."
    },
    {
      question: "How do I create an account?",
      answer: "You can create an account by clicking on the 'Sign Up' button on the homepage and filling out the required information."
    },
    {
      question: "What does this field or value mean?",
      answer: (
        <div className="data-dictionary">
          <h3 className="font-medium text-lg mb-3">Data Dictionary:</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <dt className="font-medium text-cyan-900">Listing Price</dt>
              <dd className="mt-1">The price at which a property is listed for sale.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Reserves</dt>
              <dd className="mt-1">Funds set aside to cover future expenses or unexpected costs related to the property.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Disposition Year</dt>
              <dd className="mt-1">The year in which the property is sold or disposed of.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Financing LTV (Loan-to-Value)</dt>
              <dd className="mt-1">A ratio that compares the amount of the loan to the appraised value of the property, expressed as a percentage.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Loan Rate</dt>
              <dd className="mt-1">The interest rate charged on a loan, typically expressed as an annual percentage rate (APR).</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Closing Costs</dt>
              <dd className="mt-1">Fees and expenses incurred during the closing of a real estate transaction, including title insurance, appraisal fees, and attorney fees.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Selling Costs</dt>
              <dd className="mt-1">Expenses associated with selling a property, such as agent commissions, marketing costs, and repairs.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Exit Cap</dt>
              <dd className="mt-1">The capitalization rate used to estimate the value of a property at the time of sale, based on the expected net operating income (NOI).</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Cap Rate</dt>
              <dd className="mt-1">The ratio of a property's net operating income (NOI) to its current market value, used to assess the potential return on investment.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Levered Profit</dt>
              <dd className="mt-1">The profit generated from an investment after accounting for the costs of financing (debt).</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Leveraged MoM (Month-over-Month)</dt>
              <dd className="mt-1">A measure of the change in profit or performance from one month to the next, taking into account the effects of leverage.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Cash on Cash Return</dt>
              <dd className="mt-1">A measure of the annual return on an investment based on the cash invested, calculated as the annual pre-tax cash flow divided by the total cash invested.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">Total Expenses</dt>
              <dd className="mt-1">The sum of all costs associated with operating and maintaining a property, including operating expenses, debt service, and capital expenditures.</dd>
            </div>
            <div>
              <dt className="font-medium text-cyan-900">NOI (Net Operating Income)</dt>
              <dd className="mt-1">The total income generated from a property minus the total operating expenses, excluding financing costs and taxes.</dd>
            </div>
          </dl>
        </div>
      )
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit cards, debit cards, and PayPal."
    },
    {
      question: "How can I contact support?",
      answer: (
        <div>
          <p>You can contact our support team via the 'Contact Us' page or by emailing <a href="mailto:support@estimate.com" className="text-cyan-700 hover:text-cyan-900 underline">support@estimate.com</a>.</p>
          <div className="mt-4 flex gap-4">
            <a href="/contact" className="inline-flex items-center px-4 py-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition-colors">
              Contact Us
            </a>
            <a href="mailto:support@estimate.com" className="inline-flex items-center px-4 py-2 border border-cyan-700 text-cyan-700 rounded-md hover:bg-cyan-50 transition-colors">
              Email Support
            </a>
          </div>
        </div>
      )
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <HeaderComponent />
      <div className="min-h-screen bg-gradient-to-b from-cyan-50 to-white pt-12 pb-20">
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-4xl font-bold text-center mb-3 text-cyan-900">Frequently Asked Questions</h1>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Find answers to common questions about EstiMate's platform, features, and investment property analysis tools.
          </p>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="border rounded-lg overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className={`flex justify-between items-center w-full p-5 text-left focus:outline-none transition-colors ${openIndex === index ? 'bg-cyan-800 text-white' : 'bg-cyan-700 text-white hover:bg-cyan-750'
                    }`}
                  aria-expanded={openIndex === index}
                  aria-controls={`faq-answer-${index}`}
                >
                  <span className="font-medium text-lg">{faq.question}</span>
                  <span className="text-xl flex items-center justify-center h-6 w-6">
                    {openIndex === index ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                >
                  <div className="p-6 bg-white">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-4">Can't find what you're looking for?</p>
            <a
              href="https://discord.gg/RXmpKUqz"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-cyan-700 text-white rounded-md hover:bg-cyan-800 transition-colors font-medium"
            >
              Ask a Question
            </a>
          </div>
        </div>
      </div>
      <EstimateFooter />
    </>
  );
};

export default FAQPage;