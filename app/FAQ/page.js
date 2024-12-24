'use client';
import { useState } from 'react';

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
        <>
          Data Dictionary:<br />
          - Listing Price: The price at which a property is listed for sale.<br />
          - Reserves: Funds set aside to cover future expenses or unexpected costs related to the property.<br />
          - Disposition Year: The year in which the property is sold or disposed of.<br />
          - Financing LTV (Loan-to-Value): A ratio that compares the amount of the loan to the appraised value of the property, expressed as a percentage.<br />
          - Loan Rate: The interest rate charged on a loan, typically expressed as an annual percentage rate (APR).<br />
          - Closing Costs: Fees and expenses incurred during the closing of a real estate transaction, including title insurance, appraisal fees, and attorney fees.<br />
          - Selling Costs: Expenses associated with selling a property, such as agent commissions, marketing costs, and repairs.<br />
          - Exit Cap: The capitalization rate used to estimate the value of a property at the time of sale, based on the expected net operating income (NOI).<br />
          - Cap Rate: The ratio of a property's net operating income (NOI) to its current market value, used to assess the potential return on investment.<br />
          - Levered Profit: The profit generated from an investment after accounting for the costs of financing (debt).<br />
          - Leveraged MoM (Month-over-Month): A measure of the change in profit or performance from one month to the next, taking into account the effects of leverage.<br />
          - Cash on Cash Return: A measure of the annual return on an investment based on the cash invested, calculated as the annual pre-tax cash flow divided by the total cash invested.<br />
          - Total Expenses: The sum of all costs associated with operating and maintaining a property, including operating expenses, debt service, and capital expenditures.<br />
          - NOI (Net Operating Income): The total income generated from a property minus the total operating expenses, excluding financing costs and taxes.
        </>
      )
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit cards, debit cards, and PayPal."
    },
    {
      question: "How can I contact support?",
      answer: "You can contact our support team via the 'Contact Us' page or by emailing support@estimate.com."
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className='max-w-4xl mx-auto p-6'>
      <h1 className='text-4xl font-bold text-center mb-8'>Frequently Asked Questions</h1>
      <div className='space-y-4'>
        {faqs.map((faq, index) => (
          <div key={index} className='border rounded-md shadow-md'>
            <button
              onClick={() => toggleFAQ(index)}
              className='flex justify-between w-full p-4 text-left bg-[#155E75] text-white rounded-md focus:outline-none'
            >
              <span className='font-medium'>{faq.question}</span>
              <span>{openIndex === index ? '-' : '+'}</span>
            </button>
            {openIndex === index && (
              <div className='p-4 bg-gray-100'>
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQPage;