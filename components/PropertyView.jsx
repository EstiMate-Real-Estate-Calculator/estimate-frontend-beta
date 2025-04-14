import PropertyCard from '@components/PropertyCard';
import useSWR from 'swr';
import React, { Suspense, useState, useCallback } from 'react';
// import Image from 'next/image';
import ExportClass from '@lib/exportClass';
// import AlertBubble from '@components/AlertBubble'; // Make sure you have this component
import "../styles/PropertyView.scss";
import { BiExport } from "react-icons/bi";

const fetcher = (url) => fetch(url).then((res) => res.json());

const PropertiesList = () => {
  const { data: properties = [], error, mutate } = useSWR('/api/reports', fetcher, {
    suspense: true,
    fallbackData: [],
  });
  const [alertMessage, setAlertMessage] = useState(null);

  const handleDeleteProperty = useCallback(async (propertyId) => {
    try {
      const res = await fetch(`/api/reports/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error('Failed to delete property');
      }

      // Optimistically update the UI
      mutate(
        (currentData) => currentData.filter((property) => property.propertyId !== propertyId),
        false
      );

      setAlertMessage('Property deleted successfully');
    } catch (e) {
      setAlertMessage('Failed to delete property', e);
    } finally {
      // Trigger a revalidation to ensure our data is in sync with the server
      mutate();
      // Clear the alert message after 3 seconds
      setTimeout(() => setAlertMessage(null), 3000);
    }
  }, [mutate]);

  if (error) return <p>Error loading properties</p>;

  function exportData() {
    // Format current date
    const formattedDate = new Date()
      .toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
      .replace(/\//g, '_');

    // Export to CSV
    ExportClass.exportToCSV(
      properties,
      `properties_export_${formattedDate}.csv`
    );

    // Export to Excel
    ExportClass.exportToExcel(
      properties,
      `properties_export_${formattedDate}.xlsx`
    );
  }

  return (
    <div className="w-full PropertyViewWrapper">
      {alertMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {alertMessage}
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="flex justify-between items-center mb-6 filters">
        <div className="flex items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search anything"
              className="pl-8 pr-4 py-2 border rounded-md w-56"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
          </div>

          <div className="ml-2 flex items-center">
            <button className="flex items-center px-3 py-2 border rounded-md bg-white mx-1">
              <span>Sort</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </button>

            <button className="flex items-center px-3 py-2 border rounded-md bg-white mx-1">
              <span>Filter</span>
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414v6.586a1 1 0 01-1.414 0l-2-2A1 1 0 0110 17.586V13L3.293 6.293A1 1 0 013 5.586V4z"></path>
              </svg>
            </button>
          </div>
        </div>

        <button
          onClick={exportData}
          className="flex items-center px-4 py-2 bg-blue-700 text-white rounded-md customExportButton"
        >
          Export
          <BiExport />
        </button>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard
              key={property.propertyId}
              property={property}
              onDelete={() => handleDeleteProperty(property.propertyId)}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            No properties saved
          </div>
        )}
      </div>
    </div>
  );
};

// Fallback component
const Loading = () => <div>Loading...</div>;

const PropertiesView = () => (
  <Suspense fallback={<Loading />}>
    <PropertiesList />
  </Suspense>
);

export default PropertiesView;
