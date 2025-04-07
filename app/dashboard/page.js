"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import PropertiesView from "@components/PropertyView";
import SignOutButton from "@components/SplashSignOutButton";
import AlertBubble from "@components/AlertBubble";
import SideBar from "@components/SideBar"; // Import the Sidebar component

export default function Page() {
  const [activeView, setActiveView] = useState("properties");
  const [errorDetails, setErrorDetails] = useState(null); // full raw error
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
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const statusText = res.statusText;
        const status = res.status;
        let bodyText = "";

        try {
          bodyText = await res.text(); // attempt to get raw body even if not JSON
        } catch (bodyErr) {
          bodyText = "Unable to read response body";
        }

        const fullError = `Request failed!
                          Status: ${status} ${statusText}
                          Body:
                          ${bodyText}`;

        throw new Error(fullError);
      }

      const data = await res.json();
      // Handle both { properties: [...] } and [...] structures
      const reportsArray = Array.isArray(data) ? data : (data?.properties || []);
      setProperties(reportsArray);
    } catch (err) {
      const fullError = err.stack || err.message || JSON.stringify(err);
      console.error("Full fetch error:", fullError);
      setError('Click to view error details');
      setErrorDetails(fullError);
      
      setIsAlertVisible(true);
    }
  };

  // Change the view
  const handleViewChange = (viewName) => {
    setActiveView(viewName);
  };

  return (
    <div className="flex h-full w-full flex-row bg-[#E7E5E5]">
      {isAlertVisible && (
        <AlertBubble message={error} onClose={() => setIsAlertVisible(false)}
        onClick={() => {
          setIsAlertVisible(false);       // optional: hide after navigating
          setActiveView('errors');        // navigate to error tab
        }} />
      )}

      {/* Sidebar Component */}
      <SideBar />

      <div className="flex h-full w-full flex-col">
        <div className="relative flex h-[70px] w-full flex-row items-center justify-end bg-[#155E75] pr-24">
          <SignOutButton />
          <button
            onClick={() => handleViewChange("account")}
            className="absolute right-8 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FAFAFA] p-1"
          >
            <Image
              height={28}
              width={28}
              src="/icons/account.svg"
              alt="Account Icon"
            />
          </button>
        </div>
        <div className="h-full w-full overflow-hidden p-5">
          {activeView === "properties" && (
            <PropertiesView properties={properties} />
          )}
          {activeView === "data" && <DataView />}
          {activeView === "quick-start" && <QuickStartView />}
          {activeView === "documents" && <DocumentsView />}
          {activeView === "account" && <AccountView />}
          {activeView === 'errors' && <ErrorView details={errorDetails} />}
        </div>
      </div>
    </div>
  );
}
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
