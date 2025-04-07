'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ReportHighlight from '@components/ReportHighlight';
import Formatter from '@lib/formatterClass';
import { LineChart, DonutChart } from '@lib/chart';
import Chart from 'chart.js/auto'; // Ensure Chart.js is imported

// Simple component for displaying detail items
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between border-b border-gray-200 py-1">
    <span className="text-sm font-medium text-gray-600">{label}:</span>
    <span className="text-sm text-gray-800">{value ?? 'N/A'}</span>
  </div>
);


const Page = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [chartInstance, setChartInstance] = useState(null);
  const [error, setError] = useState(null); // <-- Add state for error messages
  const [isLoading, setIsLoading] = useState(true); // <-- Add loading state

  useEffect(() => {
    if (id) {
      setIsLoading(true); // Start loading
      setError(null); // Clear previous errors
      const fetchReport = async () => {
        try {
            const response = await fetch(`/api/reports/${id}`);
            if (!response.ok) {
                 // Try to get error message from response body
                 let errorData;
                 try {
                    errorData = await response.json();
                    console.log("ERR", errorData)
                 } catch (jsonError) {
                    // If response is not JSON, use status text
                    errorData = { message: response.statusText };
                 }
                throw new Error(errorData?.message || `Failed to fetch report: ${response.status}`);
            }
            const data = await response.json();
            setReport(data);
        } catch (error) {
            console.error("Error fetching report:", error);
            setError(error.message || "An unknown error occurred while fetching the report."); // Set error state
        } finally {
            setIsLoading(false); // Stop loading regardless of success or failure
        }
      };
      fetchReport();
    } else {
        setIsLoading(false); // No ID, so not loading
        setError("Report ID is missing.");
    }
  }, [id]);

  useEffect(() => {
    // Reset schedule when report changes or becomes null
    setSchedule([]);
    if (report && report.interest && report.all_loan_balance && report.all_loan_balance[0]) {
      const calculatedSchedule = calculateAmortizationSchedule(report);
      setSchedule(calculatedSchedule);
    } else if (report) {
        console.warn("Missing data required for amortization schedule calculation.");
    }
  }, [report]);

  // Helper function to create full address
  const createFullAddress = (report) => {
    if (!report) return '';
    const { address, city, state, zip } = report;
    return [address, city, state, zip].filter(Boolean).join(', ');
  };

  // Function to generate first year's total projections & key metrics
  const generateProjectionsAndMetrics = (report) => {
     if (!report) return {};

     // Ensure 'all' arrays exist before accessing index 0
     const firstRevenue = report.all_revenue?.[0];
     const firstTotalExpenses = report.all_total_expenses?.[0];
     const firstCashOnCash = report.all_cash_on_cash?.[0];

     // Calculate cashflow only if revenue and expenses are valid numbers
     const annualCashflow = (typeof firstRevenue === 'number' && typeof firstTotalExpenses === 'number')
         ? firstRevenue - firstTotalExpenses
         : undefined;

     return {
         acquisitionCosts: report.listing_price || 0,
         capitalizationRate: report.year_one_cap,
         annualCashflow: annualCashflow,
         cashOnCashReturn: typeof firstCashOnCash === 'number' ? firstCashOnCash : undefined,
         leveredIRR: report.levered_irr,
         unleveredIRR: report.unlevered_irr,
         leveredMoM: report.levered_mom,
         unleveredMoM: report.unlevered_mom,
         leveredProfit: report.levered_profit,
     };
  };

  function calculateAmortizationSchedule(report) {
    const { interest, all_loan_balance } = report;

    // Basic validation
    if (typeof interest !== 'number' || !Array.isArray(all_loan_balance) || typeof all_loan_balance[0] !== 'number' || all_loan_balance[0] <= 0) {
        console.error("Invalid data for amortization calculation:", { interest, all_loan_balance });
        return [];
    }

    const loanTermYears = 30; // Assuming 30 years, make dynamic if needed
    const loanAmount = all_loan_balance[0];
    const monthlyInterestRate = (interest / 100) / 12; // Convert annual percentage to monthly decimal
    const numberOfPayments = loanTermYears * 12;

    // Handle edge case for zero interest
     if (monthlyInterestRate === 0) {
         const monthlyPayment = loanAmount / numberOfPayments;
         let balance = loanAmount;
         const schedule = [];
         for (let i = 0; i < numberOfPayments; i++) {
             const principalPayment = monthlyPayment;
             balance -= principalPayment;
             schedule.push({
                 month: i + 1,
                 principal: principalPayment,
                 interest: 0,
                 balance: balance > 1e-6 ? balance : 0, // Use tolerance for float comparison
             });
         }
         return schedule;
     }

    // Calculate monthly payment using the standard formula
    const monthlyPayment = loanAmount * (monthlyInterestRate * Math.pow(1 + monthlyInterestRate, numberOfPayments)) / (Math.pow(1 + monthlyInterestRate, numberOfPayments) - 1);

    if (!isFinite(monthlyPayment) || isNaN(monthlyPayment)) {
      console.error("Calculated monthly payment is invalid:", monthlyPayment);
      return []; // Prevent further calculation with invalid payment
    }

    let balance = loanAmount;
    const schedule = [];

    for (let i = 0; i < numberOfPayments && balance > 1e-6; i++) { // Add balance check
        const interestPayment = balance * monthlyInterestRate;
        const principalPayment = monthlyPayment - interestPayment;
        balance -= principalPayment;

        // Ensure non-negative balance due to potential float inaccuracies
        const currentBalance = balance > 1e-6 ? balance : 0;

        schedule.push({
            month: i + 1,
            principal: principalPayment,
            interest: interestPayment,
            balance: currentBalance,
        });
         // Safety break if balance goes significantly negative
        if (balance < -1) {
            console.warn("Amortization balance became significantly negative. Breaking loop.");
            break;
        }
    }
     // Adjust final payment if necessary due to rounding
    if (schedule.length > 0 && schedule[schedule.length-1].balance !== 0) {
        // This part needs careful consideration of how to handle the final payment adjustment
        // For simplicity, we're currently relying on the loop condition and float tolerance.
         console.warn("Final amortization balance is non-zero:", schedule[schedule.length-1].balance);
    }

    return schedule;
  }

  // Helper function for formatting expenses
  const formatExpenses = (report) => {
    if (!report) return [];
    const labelMap = {
      all_insurance: 'Insurance',
      all_water: 'Water',
      all_electricity: 'Electricity',
      all_RM: 'Rental Management', // Corrected from API error
      all_vacancy: 'Vacancy',
      all_management: 'Management Fee', // More specific?
      all_HOA: 'HOA',
      all_utilities: 'Other Utilities',
      all_gas: 'Gas',
      all_total_loan_payment: 'Mortgage Payment',
      all_property_tax: 'Property Tax', // Added
      all_capex: 'Capital Expenditures', // Added
    };

    const result = [];

    Object.keys(labelMap).forEach((key) => {
      // Check if the property exists, has at least one value, and is not zero
      if (report[key] && Array.isArray(report[key]) && report[key].length > 0 && typeof report[key][0] === 'number' && report[key][0] !== 0) {
        let value = report[key][0];

        // Decide if value is annual or monthly. Assuming 'all' arrays are annual for now.
        value = value / 12; // Convert annual to monthly for breakdown chart

        result.push({
          label: labelMap[key],
          value: value,
        });
      }
    });

    return result.filter(item => item.value > 0); // Filter out zero/negative values after calculation
  };

  let projections = report ? generateProjectionsAndMetrics(report) : {};
  const formattedExpenses = report ? formatExpenses(report) : [];

  // Create the chart after the schedule is calculated
  useEffect(() => {
     // Don't proceed if there's no schedule data
     if (!schedule || schedule.length === 0) {
        // If a chart instance exists, destroy it
        if (chartInstance) {
            chartInstance.destroy();
            setChartInstance(null);
        }
        return; // Exit early
    }

    const ctx = document.getElementById('amortizationChart');
    if (ctx) {
      // Destroy the existing chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Create a new chart instance
      const newChartInstance = new Chart(ctx.getContext('2d'), {
        type: 'line',
        data: {
          labels: schedule.map(item => item.month),
          datasets: [
            {
              label: 'Principal',
              data: schedule.map(item => item.principal),
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
              pointRadius: 0, // Hide points for cleaner look
            },
            {
              label: 'Interest',
              data: schedule.map(item => item.interest),
              borderColor: 'rgb(255, 99, 132)',
              tension: 0.1,
               pointRadius: 0,
            },
            // Optional: Add remaining balance
            // {
            //   label: 'Balance',
            //   data: schedule.map(item => item.balance),
            //   borderColor: 'rgb(54, 162, 235)',
            //   tension: 0.1,
            //   yAxisID: 'y1', // Use secondary axis if desired
            // }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false, // Allow chart to fill container height
          scales: {
            x: {
              title: { display: true, text: 'Month' },
              ticks: { maxTicksLimit: 12 } // Limit ticks for readability
            },
            y: {
               beginAtZero: true,
               title: { display: true, text: 'Monthly Payment ($)' },
               ticks: { callback: value => Formatter.formatUSD(value, 0) } // Format Y-axis ticks
            },
            // Optional secondary axis for balance
            // y1: {
            //   type: 'linear',
            //   display: true,
            //   position: 'right',
            //   title: { display: true, text: 'Remaining Balance ($)'},
            //   grid: { drawOnChartArea: false }, // only want the grid lines for one axis to show up
            // },
          },
           plugins: {
              tooltip: {
                  callbacks: {
                      label: function(context) {
                          let label = context.dataset.label || '';
                          if (label) {
                              label += ': ';
                          }
                          if (context.parsed.y !== null) {
                              label += Formatter.formatUSD(context.parsed.y);
                          }
                          return label;
                      }
                  }
              }
          }
        }
      });
      setChartInstance(newChartInstance);
    }

     // Cleanup function to destroy chart on component unmount or schedule change
    return () => {
        if (chartInstance) {
            chartInstance.destroy();
            setChartInstance(null);
        }
    };
  }, [schedule]); // Dependency array includes schedule


  // --- Conditional Rendering based on loading and error state ---
  if (isLoading) {
      return (
        <div className='flex min-h-screen w-full items-center justify-center bg-[#F1F2F2] p-3'>
            <p>Loading Report...</p> {/* Or a spinner component */}
        </div>
      );
  }

  if (error) {
      return (
         <div className='flex min-h-screen w-full items-center justify-center bg-[#F1F2F2] p-3'>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">
                <strong className="font-bold">Error!</strong>
                <span className="block sm:inline"> Failed to load report: {error}</span>
            </div>
        </div>
      );
  }

  if (!report) {
       return (
        <div className='flex min-h-screen w-full items-center justify-center bg-[#F1F2F2] p-3'>
            <p>Report data is not available.</p>
        </div>
      );
  }
  // --- End Conditional Rendering ---


  return (
    <div className='min-h-screen w-full bg-[#F1F2F2] p-3'>
      <div className='mx-auto h-min-full flex w-full max-w-7xl flex-col items-center rounded-lg bg-[#FAFAFA] p-5 shadow-lg'>
        {/* Header */}
        <div className='mt-5 w-full text-center'>
          <h1 className='text-5xl text-light-accent'>EstiMate</h1>
          <p className='text-2xl text-gray-700'>Real Estate Investment Analysis</p>
           {report.reportNickName && (
             <p className='mt-2 text-xl text-gray-600'>Report: {report.reportNickName}</p>
           )}
        </div>

        {/* Address and Download Buttons */}
        <div className='mt-8 flex w-full flex-col items-center justify-between gap-4 md:flex-row'>
          <p className='text-center text-xl font-semibold text-gray-800 md:text-left'>{createFullAddress(report)}</p>
          <div className='flex flex-shrink-0 flex-row gap-3'>
            <button className='rounded-md bg-light-primary px-4 py-2 text-base text-white shadow hover:bg-light-primary_light transition duration-150'>
              Download Excel
            </button>
            <button className='rounded-md bg-light-primary px-4 py-2 text-base text-white shadow hover:bg-light-primary_light transition duration-150'>
              Download PDF
            </button>
          </div>
        </div>

        {/* --- Main Content Grid --- */}
        <div className="mt-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-3">

            {/* Left Column: Details & Assumptions */}
            <div className="flex flex-col gap-6 lg:col-span-1">
                {/* Property Details Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">Property Details</h3>
                    <DetailItem label="Property Type" value={report.property_type} />
                    <DetailItem label="Subtype" value={report.property_subtype} />
                    <DetailItem label="Sqft" value={Formatter.formatNumber(report.sqft)} />
                    <DetailItem label="Units" value={Formatter.formatNumber(report.units)} />
                    <DetailItem label="Bedrooms" value={Formatter.formatNumber(report.bedrooms)} />
                    <DetailItem label="Bathrooms" value={Formatter.formatNumber(report.bathrooms)} />
                    <DetailItem label="Year Built" value={report.year_built} />
                    <DetailItem label="Listing Price" value={Formatter.formatUSD(report.listing_price)} />
                </div>

                {/* Loan & Assumptions Section */}
                <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-gray-800">Loan & Assumptions</h3>
                    <DetailItem label="Loan to Value (LTV)" value={Formatter.formatPercentage(report.loan_to_value / 100)} />
                    <DetailItem label="Interest Rate" value={Formatter.formatPercentage(report.interest / 100)} />
                    <DetailItem label="Vacancy Rate" value={Formatter.formatPercentage(report.vacancy / 100)} />
                    <DetailItem label="Revenue Growth" value={Formatter.formatPercentage(report.revenue_growth / 100)} />
                    <DetailItem label="Expense Growth" value={Formatter.formatPercentage(report.expense_growth / 100)} />
                    <DetailItem label="Selling Costs" value={Formatter.formatPercentage(report.selling_cost / 100)} />
                    <DetailItem label="Exit Cap Rate" value={Formatter.formatPercentage(report.exit_cap / 100)} />
                    <DetailItem label="Reserves" value={Formatter.formatUSD(report.reserves)} />
                </div>
            </div>

             {/* Center Column: Highlights & Key Metrics */}
             <div className="flex flex-col gap-6 lg:col-span-1">
                 <div className="grid grid-cols-2 gap-4">
                    {/* Highlights */}
                    <ReportHighlight
                        title={'Acquisition Costs'}
                        value={Formatter.formatUSD(projections.acquisitionCosts)}
                        tooltip="Estimated total costs to acquire the property."
                    />
                    <ReportHighlight
                        title={'Year 1 Cap Rate'}
                        value={Formatter.formatPercentage(projections.capitalizationRate / 100)}
                         tooltip="Year 1 Net Operating Income / Acquisition Costs."
                    />
                     <ReportHighlight
                        title={'Est. Yr 1 Cash Flow'}
                        value={Formatter.formatUSD(projections.annualCashflow)}
                         tooltip="Estimated cash flow after all expenses and debt service in Year 1."
                    />
                    <ReportHighlight
                        title={'Est. Yr 1 CoC Return'}
                        value={Formatter.formatPercentage(projections.cashOnCashReturn / 100)}
                         tooltip="Estimated Year 1 Cash Flow / Total Cash Invested."
                    />
                 </div>
                 {/* Key Metrics Section */}
                 <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                     <h3 className="mb-3 text-lg font-semibold text-gray-800">Key Financial Metrics</h3>
                      <DetailItem label="Levered IRR" value={Formatter.formatPercentage(projections.leveredIRR / 100)} />
                      <DetailItem label="Unlevered IRR" value={Formatter.formatPercentage(projections.unleveredIRR / 100)} />
                      <DetailItem label="Levered Equity Multiple" value={Formatter.formatNumber(projections.leveredMoM, 2) + 'x'} />
                      <DetailItem label="Unlevered Equity Multiple" value={Formatter.formatNumber(projections.unleveredMoM, 2) + 'x'} />
                      <DetailItem label="Levered Profit" value={Formatter.formatUSD(projections.leveredProfit)} />
                 </div>
             </div>

            {/* Right Column: Charts */}
            <div className="flex flex-col gap-6 lg:col-span-1">
                {/* Financial Projections Chart */}
                <div className='h-fit min-h-[300px] w-full rounded-lg bg-blue-50 p-4 shadow-sm border border-blue-100'>
                  <p className='w-full text-start text-lg font-semibold mb-3 text-gray-800'>
                    Financial Analysis Over Time
                  </p>
                  <div className="h-64"> {/* Constrain height */}
                     <LineChart
                        data={{
                          title: '', // Title removed, handled above
                          datasets: [
                            { name: 'Income', values: report.all_revenue || [], color: '#22c55e' }, // Green
                            { name: 'Expenses', values: report.all_total_expenses || [], color: '#ef4444' }, // Red
                            { name: 'Loan Balance', values: report.all_loan_balance || [], color: '#3b82f6' }, // Blue
                          ],
                        }}
                      />
                  </div>
                </div>
                {/* Cost Breakdown Chart */}
                {formattedExpenses.length > 0 && (
                    <div className='flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
                      <p className='w-full text-start text-lg font-semibold mb-3 text-gray-800'>
                        Monthly Cost Breakdown (Year 1 Avg)
                      </p>
                      <div className="w-full max-w-xs mx-auto"> {/* Constrain width */}
                         <DonutChart data={formattedExpenses} />
                      </div>
                    </div>
                )}
            </div>
        </div>

         {/* Amortization Schedule - Full Width */}
        <div className='mt-8 w-full rounded-lg border border-gray-200 bg-white p-4 shadow-sm'>
            <h3 className='mb-3 text-lg font-semibold text-gray-800'>Loan Amortization Schedule</h3>
            <div className="h-80"> {/* Set fixed height */}
                 {schedule.length > 0 ? (
                    <canvas id="amortizationChart"></canvas>
                 ) : (
                    <p className="text-gray-500 text-center pt-4">Amortization data not available or calculation could not be completed.</p>
                 )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default Page;