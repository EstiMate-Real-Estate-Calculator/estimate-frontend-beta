'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import PropertiesView from '@components/PropertyView';
import SignOutButton from '@components/SplashSignOutButton';
import AlertBubble from '@/components/AlertBubble';
import SideBar from '@components/SideBar'; // Import the Sidebar component

export default function Page() {
  const [activeView, setActiveView] = useState('properties');
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
      const res = await fetch('/api/reports', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Include any necessary authentication headers
        },
      });

      if (res.ok) {
        const data = await res.json();
        setProperties(data.properties || []);
      } else {
        throw new Error('Failed to fetch properties');
      }
    } catch (err) {
      setError('Failed to fetch properties. Please try again. ', err);
    }
  };

  // Change the view
  const handleViewChange = (viewName) => {
    setActiveView(viewName);
  };

  return (
    <div className='flex h-full w-full flex-row bg-[#E7E5E5]'>
      {isAlertVisible && <AlertBubble message={error} onClose={() => setIsAlertVisible(false)} />}
      
      {/* Sidebar Component */}
      <SideBar />

      <div className='flex h-full w-full flex-col'>
        <div className='relative flex h-[70px] w-full flex-row items-center justify-end bg-[#155E75] pr-24'>
          <SignOutButton />
          <button
            onClick={() => handleViewChange('account')}
            className='absolute right-8 flex h-[48px] w-[48px] items-center justify-center rounded-full bg-[#FAFAFA] p-1'
          >
            <Image
              height={28}
              width={28}
              src='/icons/account.svg'
              alt='Account Icon'
            />
          </button>
        </div>
        <div className='h-full w-full overflow-hidden p-5'>
          {activeView === 'properties' && <PropertiesView properties={properties} />}
          {activeView === 'data' && <DataView />}
          {activeView === 'quick-start' && <QuickStartView />}
          {activeView === 'documents' && <DocumentsView />}
          {activeView === 'account' && <AccountView />}
        </div>
      </div>
    </div>
  );
}

const DataView = () => <div>Data View</div>;
const QuickStartView = () => <div>Quick Start View</div>;
const DocumentsView = () => <div>Documents View</div>;
const AccountView = () => <div>Account View</div>;