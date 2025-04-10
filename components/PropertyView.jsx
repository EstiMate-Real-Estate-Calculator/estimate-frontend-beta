import PropertyCard from '@components/PropertyCard';
import useSWR from 'swr';
import React, { Suspense, useState, useCallback } from 'react';
import Image from 'next/image';
import ExportClass from '@lib/exportClass';
import AlertBubble from '@components/AlertBubble'; // Make sure you have this component

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
    <div className='h-full w-full'>
      {alertMessage && <AlertBubble message={alertMessage} />}
      <div className='flex h-auto w-auto flex-row justify-start gap-5 pb-5'>
        <button className='flex flex-row items-center rounded-lg bg-[#FAFAFA] px-3 font-inter text-lg font-medium'>
          <Image
            height={20}
            width={20}
            src={'/icons/search.svg'}
            alt='Search Icon'
          />
          <p className='py-2 pl-2'>Search</p>
        </button>
        <button className='flex flex-row items-center rounded-lg bg-[#FAFAFA] px-3 font-inter text-lg font-medium'>
          <Image
            height={20}
            width={20}
            src={'/icons/filter.svg'}
            alt='Filter Icon'
          />
          <p className='py-2 pl-2'>Filter</p>
        </button>
        <button className='flex flex-row items-center rounded-lg bg-[#FAFAFA] px-3 font-inter text-lg font-medium'>
          <Image
            height={20}
            width={20}
            src={'/icons/sort.svg'}
            alt='Sort Icon'
          />
          <p className='py-2 pl-2'>Sort</p>
        </button>
        <button
          onClick={() => {
            exportData();
          }}
          className='flex flex-row items-center rounded-lg bg-[#FAFAFA] px-3 font-inter text-lg font-medium'
        >
          <Image
            height={20}
            width={20}
            src={'/icons/export.svg'}
            alt='Export Icon'
          />
          <p className='py-2 pl-2'>Export</p>
        </button>
      </div>
      <div className='no-scrollbar px-auto mx-auto flex h-full flex-row flex-wrap justify-start gap-5 pb-[170px] overflow-auto'>
        {properties.length > 0 ? (
          properties.map((property) => (
            <PropertyCard
              key={property.propertyId}
              property={property}
              onDelete={() => handleDeleteProperty(property.propertyId)}
            />
          ))
        ) : (
          <p>No Properties saved</p>
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
