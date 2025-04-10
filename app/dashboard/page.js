"use client";
import { useState, useEffect } from "react";
import PropertiesView from "@components/PropertyView";
import AlertBubble from "@components/AlertBubble";
import Header from "../../components/Header/Header.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import "../../styles/Listings.scss";

export default function Page() {
  const [activeView, setActiveView] = useState("properties");
  const [errorDetails, setErrorDetails] = useState(null);
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    if (error) {
      setIsAlertVisible(true);
      const timer = setTimeout(() => {
        setIsAlertVisible(false);
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const fetchProperties = async () => {
    try {
      const res = await fetch("/api/reports", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const bodyText = await res.text();
        throw new Error(`Status: ${res.status} ${res.statusText}\nBody:\n${bodyText}`);
      }

      const data = await res.json();
      const reportsArray = Array.isArray(data) ? data : data?.properties || [];
      setProperties(reportsArray);
    } catch (err) {
      const fullError = err.stack || err.message || JSON.stringify(err);
      console.error("Full fetch error:", fullError);
      setError("Click to view error details");
      setErrorDetails(fullError);
    }
  };

  const handleViewChange = (viewName) => {
    setActiveView(viewName);
  };

  return (
    <>
      <div className="h-screen w-screen flex flex-col listingWrapper">
        {/* Top Header */}
        <Header />
        {/* Alert Bubble */}
        {isAlertVisible && (
          <AlertBubble
            message={error}
            onClose={() => setIsAlertVisible(false)}
            onClick={() => {
              setIsAlertVisible(false);
              setActiveView("errors");
            }}
          />
        )}

        {/* Main Content Section */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          {/* <SideBar /> */}

          {/* Main Content Area */}
          <div className="flex flex-col w-full bg-[#E7E5E5] main">
            {/* Top Bar with Sign Out + Account Icon */}
            {/* <div className="flex items-center justify-end h-[70px] bg-[#155E75] px-6">
            <SignOutButton />
            <button
              onClick={() => handleViewChange("account")}
              className="ml-4 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FAFAFA] p-1"
            >
              <Image
                height={28}
                width={28}
                src="/icons/account.svg"
                alt="Account Icon"
              />
            </button>
          </div> */}

            {/* Page View Content */}
            <div className="flex-1 p-5">
              {activeView === "properties" && <PropertiesView properties={properties} />}
              {activeView === "data" && <DataView />}
              {activeView === "quick-start" && <QuickStartView />}
              {activeView === "documents" && <DocumentsView />}
              {activeView === "account" && <AccountView />}
              {activeView === "errors" && <ErrorView details={errorDetails} />}
            </div>
          </div>
        </div>
        <Footer />
      </div>

    </>
  );
}

// View Components
const ErrorView = ({ details }) => (
  <div className="p-4 bg-white rounded shadow border text-left">
    <h2 className="text-lg font-semibold text-red-600 mb-2">Error Details</h2>
    <pre className="whitespace-pre-wrap text-sm text-gray-800 bg-red-50 p-3 rounded overflow-auto max-h-[70vh]">
      {details}
    </pre>
  </div>
);

const DataView = () => <div>Data View</div>;
const QuickStartView = () => <div>Quick Start View</div>;
const DocumentsView = () => <div>Documents View</div>;
const AccountView = () => <div>Account View</div>;
