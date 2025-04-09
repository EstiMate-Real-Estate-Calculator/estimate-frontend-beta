'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
// import ReportHighlight from '@components/ReportHighlight';
import Formatter from '@lib/formatterClass';
// import { LineChart, DonutChart } from '@lib/chart';
// import Chart from 'chart.js/auto'; // Ensure Chart.js is imported
import { Layout, Row, Col, Image, Input, Tabs, Card, Button, Drawer } from "antd";
import { FaBath } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { IoShareSocialOutline } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import { CiHeart } from "react-icons/ci";
import { AiFillHome } from "react-icons/ai";
import { IoMdArrowForward } from "react-icons/io";
import "../../../styles/globalStyle.scss";
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { FaBed } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import dayjs from 'dayjs';
import { MenuOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

const { Header, Footer, Content } = Layout;

// Simple component for displaying detail items
const DetailItem = ({ label, value }) => (
  <div className="flex justify-between" style={{ width: '100%' }}>
    <span className="text-sm font-medium text-gray-500">{label}:</span>
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
  const isLoggedIn = false;
  const [monthlyPayment, setMonthlyPayment] = useState({
    mortgage: 0,
    taxes: 0,
    insurance: 0,
  });
  const [inputs, setInputs] = useState({
    homePrice: 300000,
    downPayment: 60000,
    interestRate: 4.5,
    loanTerm: 30,
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const router = useRouter();

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
    if (schedule.length > 0 && schedule[schedule.length - 1].balance !== 0) {
      // This part needs careful consideration of how to handle the final payment adjustment
      // For simplicity, we're currently relying on the loop condition and float tolerance.
      console.warn("Final amortization balance is non-zero:", schedule[schedule.length - 1].balance);
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
  const newFormattedExpenses = formattedExpenses.map(item => ({
    name: item.label,
    y: item.value
  }));
  const total = formattedExpenses.reduce((sum, item) => sum + item.value, 0).toFixed(2);

  // // Create the chart after the schedule is calculated
  // useEffect(() => {
  //   // Don't proceed if there's no schedule data
  //   if (!schedule || schedule.length === 0) {
  //     // If a chart instance exists, destroy it
  //     if (chartInstance) {
  //       chartInstance.destroy();
  //       setChartInstance(null);
  //     }
  //     return; // Exit early
  //   }

  //   const ctx = document.getElementById('amortizationChart');
  //   if (ctx) {
  //     // Destroy the existing chart instance if it exists
  //     if (chartInstance) {
  //       chartInstance.destroy();
  //     }

  //     // Create a new chart instance
  //     const newChartInstance = new Chart(ctx.getContext('2d'), {
  //       type: 'line',
  //       data: {
  //         labels: schedule.map(item => item.month),
  //         datasets: [
  //           {
  //             label: 'Principal',
  //             data: schedule.map(item => item.principal),
  //             borderColor: 'rgb(75, 192, 192)',
  //             tension: 0.1,
  //             pointRadius: 0, // Hide points for cleaner look
  //           },
  //           {
  //             label: 'Interest',
  //             data: schedule.map(item => item.interest),
  //             borderColor: 'rgb(255, 99, 132)',
  //             tension: 0.1,
  //             pointRadius: 0,
  //           },
  //           // Optional: Add remaining balance
  //           // {
  //           //   label: 'Balance',
  //           //   data: schedule.map(item => item.balance),
  //           //   borderColor: 'rgb(54, 162, 235)',
  //           //   tension: 0.1,
  //           //   yAxisID: 'y1', // Use secondary axis if desired
  //           // }
  //         ]
  //       },
  //       options: {
  //         responsive: true,
  //         maintainAspectRatio: false, // Allow chart to fill container height
  //         scales: {
  //           x: {
  //             title: { display: true, text: 'Month' },
  //             ticks: { maxTicksLimit: 12 } // Limit ticks for readability
  //           },
  //           y: {
  //             beginAtZero: true,
  //             title: { display: true, text: 'Monthly Payment ($)' },
  //             ticks: { callback: value => Formatter.formatUSD(value, 0) } // Format Y-axis ticks
  //           },
  //           // Optional secondary axis for balance
  //           // y1: {
  //           //   type: 'linear',
  //           //   display: true,
  //           //   position: 'right',
  //           //   title: { display: true, text: 'Remaining Balance ($)'},
  //           //   grid: { drawOnChartArea: false }, // only want the grid lines for one axis to show up
  //           // },
  //         },
  //         plugins: {
  //           tooltip: {
  //             callbacks: {
  //               label: function (context) {
  //                 let label = context.dataset.label || '';
  //                 if (label) {
  //                   label += ': ';
  //                 }
  //                 if (context.parsed.y !== null) {
  //                   label += Formatter.formatUSD(context.parsed.y);
  //                 }
  //                 return label;
  //               }
  //             }
  //           }
  //         }
  //       }
  //     });
  //     setChartInstance(newChartInstance);
  //   }

  //   // Cleanup function to destroy chart on component unmount or schedule change
  //   return () => {
  //     if (chartInstance) {
  //       chartInstance.destroy();
  //       setChartInstance(null);
  //     }
  //   };
  // }, [schedule]); // Dependency array includes schedule

  useEffect(() => {
    const { homePrice, downPayment, interestRate, loanTerm } = inputs;
    const principal = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    const mortgage = principal * monthlyRate / (1 - Math.pow(1 + monthlyRate, -numPayments));
    const taxes = (homePrice * 0.012) / 12;
    const insurance = (homePrice * 0.005) / 12;

    setMonthlyPayment({
      mortgage: mortgage.toFixed(2),
      taxes: taxes.toFixed(2),
      insurance: insurance.toFixed(2),
    });
  }, [inputs]);

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

  const mortgage = report.all_total_loan_payment?.[0];
  const monthlyMortgage = mortgage ? (mortgage / 12).toFixed(2) : null;
  const taxes = report.all_property_tax?.[0];
  const insurance = report.all_insurance || 'NA';
  const rent = report.all_RM?.[0];
  const managementFeePercent = 0.08;
  const managementFees = rent ? -(rent * managementFeePercent).toFixed(2) : null;
  const otherExpenses = [
    report.all_HOA?.[0] || 0,
    report.all_water?.[0] || 0,
    report.all_gas?.[0] || 0,
    report.all_capex?.[0] || 0,
    report.all_utilities?.[0] || 0
  ];
  const othersTotal = -otherExpenses.reduce((sum, val) => sum + val, 0);
  const arv = Math.round(report.all_ending_balance[report.all_ending_balance.length - 2]);
  const allBalances = report.all_ending_balance || [];
  const valueOverTime = allBalances.slice(-6, -1);
  const totalYears = allBalances.length;
  // const years = Array.from({ length: valueOverTime.length }, (_, i) => `Year ${totalYears - 5 + i}`);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [id]: parseFloat(value) || 0
    }));
  };

  const tags = [
    {
      icon: <FaBed />,
      value: Formatter.formatNumber(report.bedrooms),
    },
    {
      icon: <FaBath />,
      value: Formatter.formatNumber(report.bathrooms),
    },
    {
      icon: <LuClipboardList />,
      value: report.year_built,
    },
    {
      icon: <AiFillHome />,
      value: report.property_subtype,
    }
  ];

  const widgets = [
    {
      label: 'Mortgage',
      value: Formatter.formatUSD(mortgage),
      color: '#57068C'
    },
    {
      label: 'Taxes',
      value: Formatter.formatUSD(taxes),
      color: '#D7162F'
    },
    {
      label: 'Insurance',
      value: insurance,
      color: '#57068C'
    },
    {
      label: 'Management Fees',
      value: Formatter.formatUSD(managementFees),
      color: '#D7162F'
    },
    {
      label: 'Others',
      value: Formatter.formatUSD(otherExpenses),
      color: '#57068C'
    }
  ];

  const options = {
    chart: {
      type: 'area',
      height: 364,
    },
    title: {
      text: null
    },
    xAxis: {
      visible: false,
    },
    // xAxis: {
    //   categories: years,
    //   labels: {
    //     style: {
    //       fontSize: '12px'
    //     }
    //   },
    //   lineColor: '#ccc',
    //   tickColor: '#ccc'
    // },
    yAxis: {
      labels: {
        formatter: function () {
          const num = this.value;
          if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
          if (num >= 1e3) return (num / 1e3).toFixed(0) + 'K';
          return num;
        },
        style: {
          fontSize: '12px'
        }
      },
      gridLineColor: '#f0f0f0',
      title: {
        text: null
      }
    },
    tooltip: {
      formatter: function () {
        const val = this.y;
        const short = val >= 1e6 ? (val / 1e6).toFixed(1) + 'M' : (val / 1e3).toFixed(0) + 'K';
        return `<b>${this.series.name}</b><br/>${this.x}: <b>$${short}</b>`;
      }
    },
    series: [{
      name: 'Ending Balance',
      data: valueOverTime,
      color: '#3290ED'
    }],
    credits: {
      enabled: false
    },
    legend: false
  };

  const propertyValue = [
    {
      label: 'Property Type',
      value: report.property_type || 'NA'
    },
    {
      label: 'Subtype',
      value: report.property_subtype
    },
    {
      label: 'Sqft',
      value: Formatter.formatNumber(report.sqft)
    },
    {
      label: 'Units',
      value: Formatter.formatNumber(report.units)
    },
    {
      label: 'Bedrooms',
      value: Formatter.formatNumber(report.bedrooms)
    },
    {
      label: 'Bathrooms',
      value: Formatter.formatNumber(report.bathrooms)
    },
    {
      label: 'Year Built',
      value: report.year_built
    },
    {
      label: 'Listing Price',
      value: Formatter.formatUSD(report.listing_price)
    },
  ]

  const pieData = [
    { name: "Mortgage", y: parseFloat(monthlyPayment.mortgage), color: "#4f8ef7" },
    { name: "Taxes", y: parseFloat(monthlyPayment.taxes), color: "#ff9f43" },
    { name: "Insurance", y: parseFloat(monthlyPayment.insurance), color: "#00cfe8" }
  ];

  const fields = [
    { id: "homePrice", label: "Home Price", placeholder: "Enter Home Price", prefix: "$" },
    { id: "downPayment", label: "Down Payment", placeholder: "Enter Down Payment", prefix: "$" },
    { id: "interestRate", label: "Interest Rate", placeholder: "e.g. 4.5", suffix: "%" },
    { id: "loanTerm", label: "Loan Term (years)", placeholder: "30", suffix: "yrs" },
  ];

  const graphOptions = {
    chart: {
      type: 'pie',
      backgroundColor: '#fff',
      height: 282,
    },
    title: {
      text: null
    },
    plotOptions: {
      pie: {
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: ${point.y:.2f}',
          distance: -30,
          style: { fontSize: '10px' }
        },
        innerSize: '60%',
      }
    },
    series: [{
      name: "Monthly Cost",
      data: pieData,
      colorByPoint: true
    }],
    credits: { enabled: false },
    exporting: { enabled: false }
  };

  const onChange = key => {
    console.log(key);
  };

  const cashFLow = () => {
    return (
      <Row gutter={16} className="cashFLowRow">
        <Col md={12} xs={24}>
          <div className="left">
            <h5>Loan & Assumptions</h5>
            <hr />
            <div className="body">
              <div className="flex">
                <DetailItem label="Loan to Value (LTV)" value={Formatter.formatPercentage(report.loan_to_value / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Interest Rate" value={Formatter.formatPercentage(report.interest / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Vacancy Rate" value={Formatter.formatPercentage(report.vacancy / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Revenue Growth" value={Formatter.formatPercentage(report.revenue_growth / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Expense Growth" value={Formatter.formatPercentage(report.expense_growth / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Selling Costs" value={Formatter.formatPercentage(report.selling_cost / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Exit Cap Rate" value={Formatter.formatPercentage(report.exit_cap / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Reserves" value={Formatter.formatPercentage(report.reserves / 100)} />
              </div>
            </div>
          </div>
        </Col>
        <Col md={12} xs={24}>
          <div className="right">
            <h5>Key Financial Metrics</h5>
            <hr />
            <div className="body">
              <div className="flex">
                <DetailItem label="Levered IRR" value={Formatter.formatPercentage(projections.leveredIRR / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Unlevered IRR" value={Formatter.formatPercentage(projections.unleveredIRR / 100)} />
              </div>
              <div className="flex">
                <DetailItem label="Levered Equity Multiple" value={Formatter.formatNumber(projections.leveredMoM, 2) + 'x'} />
              </div>
              <div className="flex">
                <DetailItem label="Unlevered Equity Multiple" value={Formatter.formatNumber(projections.unleveredMoM, 2) + 'x'} />
              </div>
              <div className="flex">
                <DetailItem label="Levered Profit" value={Formatter.formatUSD(projections.leveredProfit)} />
              </div>
            </div>
          </div>
        </Col>
      </Row>
    )
  }

  const chartWrapper = () => {
    return (
      <>
        <Row gutter={16} className="chartWrapper">
          <Col md={10} xs={24}>
            <Card>
              <HighchartsReact highcharts={Highcharts} options={donutOptions} />
            </Card>
          </Col>
          <Col md={14} xs={24}>
            <Card>
              <HighchartsReact highcharts={Highcharts} options={lineChartOptions} />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col md={24} xs={24}>
            <div className="bigChart mt-4">
              <Card>
                <HighchartsReact highcharts={Highcharts} options={comboChartOptions} />
              </Card>
            </div>
          </Col>
        </Row>
      </>
    )
  }

  const donutOptions = {
    chart: {
      type: 'pie',
      backgroundColor: '#fff',
      height: 400,
      events: {
        render() {
          const chart = this;

          if (chart.customCenterLabel) {
            chart.customCenterLabel.destroy();
          }

          chart.customCenterLabel = chart.renderer
            .label(
              `<div style="text-align: center; font-family: 'Source Sans Pro';">
              <div style="font-size: 20px; font-weight: 600;">$${total}</div>
              <div style="font-size: 12px; font-weight: 400;">Total</div>
            </div>`,
              0, 0, null, null, null, true
            )
            .attr({ zIndex: 5 })
            .add();

          const labelBBox = chart.customCenterLabel.getBBox();
          const centerX = chart.plotLeft + chart.plotWidth / 2;
          const centerY = chart.plotTop + chart.plotHeight / 2;

          chart.customCenterLabel.attr({
            x: centerX - labelBBox.width / 2,
            y: centerY - labelBBox.height / 2
          });
        }
      }
    },
    title: {
      text: 'Monthly Cost Breakdown (Year 1 Avg)',
      align: 'left',
      style: {
        fontWeight: '600',
        fontSize: '16px',
        fontFamily: 'Source Sans Pro',
        lineHeight: '24px',
      },
    },
    plotOptions: {
      pie: {
        innerSize: '60%',
        dataLabels: {
          enabled: true,
          format: '{point.percentage:.1f}%',
          distance: -22,
          style: {
            fontSize: '10px',
            fontWeight: '600',
            color: 'white',
            textOutline: 'none'
          }
        },
        showInLegend: true
      }
    },
    legend: {
      align: 'center',
      verticalAlign: 'bottom',
      layout: 'horizontal',
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: 'Share',
        colorByPoint: true,
        data: newFormattedExpenses
      },
    ],
    tooltip: {
      valuePrefix: '$',
      valueDecimals: 1,
    },
  };

  const revenue = report.all_revenue || [];
  const expenses = report.all_total_expenses || [];
  const loanBalance = report.all_loan_balance || [];

  const minLength = Math.min(revenue.length, expenses.length, loanBalance.length);

  const dynamicMonths = Array.from({ length: minLength }, (_, i) =>
    dayjs().subtract(minLength - 1 - i, 'month').format('MMM YYYY')
  );

  const lineChartOptions = {
    chart: {
      type: 'line',
      height: 400,
      backgroundColor: '#fff',
    },
    title: {
      text: 'Financial Analysis Over Time',
      align: 'left',
      style: {
        fontWeight: '600',
        fontSize: '16px',
        fontFamily: 'Source Sans Pro',
      },
    },
    xAxis: {
      categories: dynamicMonths,
      title: { text: 'Months' },
    },
    yAxis: {
      type: 'logarithmic',
      title: { text: 'Amount ($)' },
    },
    tooltip: {
      shared: true,
      valuePrefix: '$',
    },
    legend: {
      enabled: true,
    },
    credits: {
      enabled: false,
    },
    series: [
      {
        name: 'Income',
        data: revenue.slice(0, minLength),
        color: '#22c55e',
      },
      {
        name: 'Expenses',
        data: expenses.slice(0, minLength),
        color: '#ef4444',
      },
      {
        name: 'Loan Balance',
        data: loanBalance.slice(0, minLength),
        color: '#3b82f6',
      },
    ],
    tooltip: {
      shared: true,
      valuePrefix: '$',
      valueDecimals: 1,
    },
  };

  const interval = 6;
  const sampledSchedule = schedule.filter((_, i) => i % interval === 0);

  const comboChartOptions = {
    chart: {
      zoomType: 'xy',
      backgroundColor: '#ffffff',
      height: '50%',
      style: {
        fontFamily: 'Inter, Source Sans Pro, sans-serif',
      },
      animation: {
        duration: 1200,
        easing: 'easeOutBounce',
      },
    },
    title: {
      text: 'Loan Amortization Schedule',
      align: 'left',
      style: {
        fontWeight: '600',
        fontSize: '18px',
        color: '#1f2937',
      },
    },
    xAxis: {
      categories: sampledSchedule.map((item, i) => `${i * interval + 1}`),
      crosshair: true,
      title: {
        text: 'Month',
        style: {
          fontWeight: '500',
          color: '#374151',
        },
      },
      labels: {
        rotation: -45,
        style: {
          fontSize: '11px',
          color: '#6b7280',
        },
      },
    },
    yAxis: {
      title: {
        text: 'Amount ($)',
        style: {
          fontWeight: '500',
          color: '#374151',
        },
      },
      labels: {
        format: '${value}',
        style: {
          color: '#6b7280',
        },
      },
      gridLineDashStyle: 'Dash',
      gridLineColor: '#e5e7eb',
    },
    tooltip: {
      shared: true,
      backgroundColor: '#f9fafb',
      borderColor: '#d1d5db',
      borderRadius: 8,
      style: {
        color: '#111827',
        fontSize: '13px',
      },
      formatter: function () {
        let tooltip = `<b>${this.x}</b><br/>`;
        this.points.forEach(point => {
          tooltip += `<span style="color:${point.color}">\u25CF</span> ${point.series.name}: $${point.y.toFixed(2)}<br/>`;
        });
        return tooltip;
      },
    },
    legend: {
      layout: 'horizontal',
      align: 'center',
      verticalAlign: 'bottom',
      itemStyle: {
        fontWeight: '500',
        color: '#374151',
      },
    },
    plotOptions: {
      series: {
        animation: {
          duration: 1000,
          easing: 'easeOutCubic',
        },
      },
      areaspline: {
        marker: {
          enabled: false,
        },
      },
      column: {
        borderRadius: 6,
      },
    },
    series: [
      {
        name: 'Principal',
        type: 'areaspline',
        data: sampledSchedule.map(item => item.principal),
        color: 'rgba(34, 197, 94, 0.7)', // Tailwind green-500 with opacity
        fillOpacity: 0.2,
      },
      {
        name: 'Interest',
        type: 'areaspline',
        data: sampledSchedule.map(item => item.interest),
        color: 'rgba(239, 68, 68, 0.7)', // Tailwind red-500 with opacity
        fillOpacity: 0.2,
      },
    ],
    responsive: {
      rules: [{
        condition: {
          maxWidth: 768,
        },
        chartOptions: {
          legend: {
            layout: 'vertical',
            align: 'center',
            verticalAlign: 'bottom',
          },
          xAxis: {
            labels: {
              rotation: -30,
            },
          },
        },
      }],
    },
    credits: {
      enabled: false,
    },
  };

  const items = [
    {
      key: '1',
      label: 'Cash Flow',
      children: cashFLow(),

    },
    {
      key: '2',
      label: 'Breakdown',
      children: chartWrapper(),
    },
  ];

  const prevCard = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const nextCard = () => {
    if (currentIndex < cardsData.length - 4) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Just to get a preview of how the Cards will look like. This will be removed later
  const cardsData = [
    {
      id: 1,
      name: "Sunset Villa",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "123 Palm Street, Los Angeles, CA",
      bedrooms: 4,
      squareFeet: 2800,
      startingPrice: "$850,000",
    },
    {
      id: 2,
      name: "Urban Heights",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "789 Metro Ave, New York, NY",
      bedrooms: 2,
      squareFeet: 1100,
      startingPrice: "$2,300/mo",
    },
    {
      id: 3,
      name: "Coastal Retreat",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "456 Ocean Drive, Miami, FL",
      bedrooms: 3,
      squareFeet: 1900,
      startingPrice: "$620,000",
    },
    {
      id: 4,
      name: "Countryside Estate",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "88 Meadow Lane, Austin, TX",
      bedrooms: 5,
      squareFeet: 3500,
      startingPrice: "$975,000",
    },
    {
      id: 5,
      name: "City View Condo",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "901 Skyline Blvd, Chicago, IL",
      bedrooms: 1,
      squareFeet: 900,
      startingPrice: "$1,900/mo",
    },
    {
      id: 6,
      name: "Mountain Cabin",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "22 Alpine Road, Denver, CO",
      bedrooms: 3,
      squareFeet: 1500,
      startingPrice: "$430,000",
    },
    {
      id: 7,
      name: "Lakeside Bungalow",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "35 Serenity Bay, Lake Tahoe, NV",
      bedrooms: 2,
      squareFeet: 1300,
      startingPrice: "$510,000",
    },
    {
      id: 8,
      name: "Downtown Loft",
      image: "https://picsum.photos/350/350",
      tag: "Apartments",
      address: "16 Industrial Way, Seattle, WA",
      bedrooms: 1,
      squareFeet: 1000,
      startingPrice: "$2,100/mo",
    },
  ];

  return (
    <div className="detailWrapper">
      <Layout>
        <Header className="customHeader flex justify-between items-center px-6 py-4 bg-white shadow relative">
          <div className="text-xl font-bold text-white-600 logoSection" onClick={() => router.push('/dashboard')}>
            EstiMate
          </div>
          {/* Navigation menu */}
          <nav className="hidden md:flex space-x-12 text-base font-medium text-white-700">
            <a href="#home" className="hover:text-primary">Home</a>
            <a href="#listing" className="hover:text-primary">Listing</a>
            <a href="#features" className="hover:text-primary">Features</a>
            <a href="#extension" className="hover:text-primary">Extension</a>
            <a href="#contact" className="hover:text-primary">Contact Us</a>
          </nav>

          {/* To show Profile if logged in and login/signup if unauthenticated */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <img
                src="/profile-icon.png"
                alt="Profile"
                className="w-8 h-8 rounded-full cursor-pointer"
              />
            ) : (
              <button className="text-white px-4 py-1 customLoginButton">
                Login <span>Sign In</span>
              </button>
            )}
          </div>

          {/* Button to open the drawer  */}
          <Button
            className="md:hidden text-gray-700 menuButton"
            icon={<MenuOutlined />}
            onClick={() => setDrawerVisible(true)}
            type="text"
          />

          {/* This is a drawer for Mobile view of the Header*/}
          <Drawer
            title="Menu"
            placement="right"
            onClose={() => setDrawerVisible(false)}
            visible={drawerVisible}
          >
            <nav className="flex flex-col space-y-4 text-base font-medium">
              <a href="#home" onClick={() => setDrawerVisible(false)}>Home</a>
              <a href="#listing" onClick={() => setDrawerVisible(false)}>Listing</a>
              <a href="#features" onClick={() => setDrawerVisible(false)}>Features</a>
              <a href="#extension" onClick={() => setDrawerVisible(false)}>Extension</a>
              <a href="#contact" onClick={() => setDrawerVisible(false)}>Contact Us</a>

              <div className="mt-6">
                {isLoggedIn ? (
                  <img
                    src="/profile-icon.png"
                    alt="Profile"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                ) : (
                  <button className="customLoginButton">
                    Login <span>Sign In</span>
                  </button>
                )}
              </div>
            </nav>
          </Drawer>
        </Header>

        <Content className="customBodyWrapper">
          <div className="topSection">
            <div className="tagSection">
              APARTMENTS
            </div>

            <Row gutter={16} className="propertyInfoRow">
              <Col md={18} xs={24} className="propertyDetailColumn">
                <div>
                  <h2>Conscient Elaira Residences</h2>
                  <span className="locationWrapper"><FaLocationDot />{createFullAddress(report)}</span>
                  <div className="tagWrapper">
                    {tags.map((tag, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }} className="tag">
                        {tag.icon} <span>{tag.value} {tag.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>
              <Col md={6} xs={24} className="priceColumn">
                <div className="topRight">
                  <div className="iconWrapper">
                    <IoShareSocialOutline className="one" />
                    <CiHeart />
                  </div>
                  <div className="priceSection">
                    <h3>Starting Price</h3>
                    <span>{Formatter.formatUSD(projections.acquisitionCosts)}</span>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="bannerWrapper">
            <Row gutter={16}>
              <Col md={18} xs={24}>
                <div className="bannerImage">
                  <Image src={report?.image} alt="Not Found" className="img-fluid" preview={false} />
                </div>
                <div className="widgetWrapper">
                  {widgets?.map((item) => (
                    <div className="widgets">
                      <div className="top">
                        {item?.label}
                      </div>
                      <div className="bottom" style={{ color: item.color }}>
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </Col>
              <Col md={6} xs={24}>
                <div className="rightSection">
                  <div className="afterValue">
                    <div className="top">After Repair Value</div>
                    <div className="bottom"><span className="grey">{Formatter.formatUSD(projections.acquisitionCosts)}</span><IoMdArrowForward /> {Formatter.formatUSD(arv)}</div>
                  </div>
                  <div className="valueGraph">
                    <div className="top">Value</div>
                    <div className="bottom">
                      <div style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                        <HighchartsReact highcharts={Highcharts} options={options} />
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Card className='mt-4 propertyCard'>
            <div className="propertyDetailWrapper">
              <h2>Property Details</h2>
              <hr />
              <br />
              <Row gutter={16}>
                {propertyValue?.map((item) => (
                  <Col md={6} xs={24} className="detailValue">
                    <div className="property">
                      <div className="label">{item.label}</div>
                      <div className="value">{item.value}</div>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            <div className="mortgageCalculator">
              <h2>Mortgage Calculator</h2>
              <hr />
              <br />
              <Row gutter={16}>
                <Col md={18} xs={24}>
                  <div className="calculatorValues">
                    <Row gutter={16}>
                      {fields.map((item) => (
                        <Col md={12} xs={24} key={item.id}>
                          <div className="inputSection">
                            <label>{item.label}</label>
                            <Input
                              id={item.id}
                              placeholder={item.placeholder}
                              prefix={item.prefix}
                              suffix={item.suffix}
                              value={inputs[item.id]}
                              onChange={handleChange}
                              type="number"
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  <div className="monthlyValues">
                    <h5>Monthly Payment Breakdown</h5>
                    <Row gutter={16}>
                      {Object.entries(monthlyPayment).map(([key, value]) => (
                        <Col md={8} xs={24} key={key} className="valueColumn">
                          <div className="valueWrapper" >
                            <span className="top">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                            <span className="bottom">${value}</span>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Col>

                <Col md={6} xs={24}>
                  <div className="valueGraph">
                    <div style={{ borderRadius: '0 0 8px 8px', overflow: 'hidden', width: '100%', maxWidth: '100%' }}>
                      <HighchartsReact highcharts={Highcharts} options={graphOptions} />
                      <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
                        {pieData.map((item, index) => (
                          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: 12,
                              height: 12,
                              backgroundColor: item.color,
                              borderRadius: '50%',
                            }}></div>
                            <span style={{ fontSize: 10 }}>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </div>

            <div className="cashFlowSection">
              <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
            </div>

            <div className="moreProperties">
              <div className="headingSection">
                <div className="title">
                  <h2>More In The Area</h2>
                  <span>Explore more properties in your area</span>
                </div>
                <div className="slider-header">
                  <button onClick={prevCard} disabled={currentIndex === 0}><FaArrowLeft /></button>
                  <button onClick={nextCard} disabled={currentIndex >= cardsData.length - 4}><FaArrowRight /></button>
                </div>
              </div>
              <div className="carousalSection">
                <div className="slider-container">
                  <div className="slider-wrapper">
                    <div
                      className="slider-track"
                      style={{ transform: `translateX(-${currentIndex * (100 / 4.5)}%)` }}
                    >
                      {cardsData.map((card) => (
                        <Card className="slider-card" key={card.id}>
                          <div className="imgsection">
                            <Image src={card.image} preview={false} alt="Not found" />
                            <div className="tagWrapper">
                              <div className="tags">{card.tag}</div>
                              <div className="like"><FaHeart /></div>
                            </div>
                          </div>
                          <div className="infoSection">
                            <h3>{card.name}</h3>
                            <p className="address"><FaLocationDot />{card.address}</p>
                            <Row gutter={16} className="cardBedRoomWrapper">
                              <Col md={12} xs={24}>
                                <div className="bathroomWrapper"><FaBed />  <p>{card.bedrooms}</p></div>
                              </Col>
                              <Col md={12} xs={24} className="right">
                                <div className="squareWrapper"><LuClipboardList />  <p>{card.squareFeet} sqft</p></div>
                              </Col>
                            </Row>
                            <hr />
                            <Row gutter={16} className="viewDetailWrapper">
                              <Col xs={24} md={12}>
                                <div className="price">
                                  Starting Price
                                  <br />
                                  <p>{card.startingPrice}</p>
                                </div>
                              </Col>
                              <Col xs={24} md={12} className="right">
                                <div className="buttonsection">
                                  <Button>
                                    View Details
                                  </Button>
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

        </Content>
      </Layout>
      <Footer className="customFooter">
        © 2025 EstiMate
      </Footer>
    </div>
  );
};

export default Page;