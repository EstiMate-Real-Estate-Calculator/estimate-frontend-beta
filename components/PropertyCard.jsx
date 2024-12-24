'use client';

import Formatter from '@lib/formatterClass';
import Image from 'next/image';
import React, { useState } from 'react';

const PropertyCard = ({ property, onDelete }) => {
  const [visible, setVisible] = useState(false);

  // Shader visibility functions
  const toggleShader = () => {
    setVisible(!visible);
  };

  const handleDelete = (e) => {
    e.stopPropagation(); // Prevent the card from toggling when clicking delete
    if (window.confirm('Are you sure you want to delete this property?')) {
      onDelete(property.propertyId);
    }
  };

  const listingPrice = property.listing_price;
  const reportUrl = `/report/${property.propertyId}`;
  const address = property.address;
  const city = property.city;
  const state = property.state;
  const zipcode = property.zip;
  const squareFootage = property.sqft;
  const bed = property.bedrooms;
  const bath = property.bathrooms;
  const imageURL = property.image;

  // Conditionally display City, State, Zip
  var addressDetails = '';
  if (city) {
    addressDetails += `${city}, `;
  }
  if (state) {
    addressDetails += `${state} `;
  }
  if (zipcode) {
    addressDetails += `${zipcode}`;
  }

  // Conditionally display property details - SQFT, Bed, Bath
  const details = [];

  if (squareFootage) {
    details.push(`Sqft: ${squareFootage}`);
  }
  if (bed) {
    details.push(`Bed: ${bed}`);
  }
  if (bath) {
    details.push(`Bath: ${bath}`);
  }

  return (
    <div
      onClick={() => toggleShader()}
      className='relative h-[217px] w-[223.8px] overflow-hidden rounded-lg bg-[#D9D9D9] shadow-lg'
      style={{
        backgroundImage: `url(${imageURL}), url('/images/small 640x426 house.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Property Details */}
      <div
        className={`w-full overflow-y-clip rounded-lg p-2 text-white transition-all duration-300 ease-in-out ${visible ? 'flex h-full flex-col justify-between' : 'h-fit'}`}
      >
        <div className='w-full'>
          <div className='flex flex-row items-start justify-between'>
            <p className={`${visible ? 'inline' : 'hidden'}`}>
              {address ? address : ''}
            </p>
            <a
              target='_blank'
              href={`${reportUrl}`}
              className={`text-white ${visible ? 'inline' : 'hidden'}`}
              onClick={(e) => e.stopPropagation()} // Prevent the card from toggling when clicking the link
            >
              <Image
                height={20}
                width={20}
                src='/icons/newTab.svg'
                alt='New Tab Icon'
              />
            </a>
          </div>
          <p className={`${visible ? 'block' : 'hidden'}`}>
            {addressDetails ? addressDetails : ''}
          </p>
          <p className={`${visible ? 'block' : 'hidden'}`}>
            {details.length > 0 ? details.join(' | ') : ''}
          </p>
          <p>{`${listingPrice ? Formatter.formatUSD(listingPrice) : ''}`}</p>
        </div>

        <div className='flex w-full flex-row items-end justify-evenly pt-2'>
          <div className='h-min-10 w-min-10 flex flex-col items-center rounded-sm bg-[#9cecc7] p-1 text-[#333333]'>
            <p>NOI</p>
            <p>{Formatter.formatShortUSD(property.all_NOI[0])}</p>
          </div>
          <div className='h-min-10 w-min-10 flex flex-col items-center rounded-sm bg-[#9cecc7] p-1 text-[#333333]'>
            <p>CAP</p>
            <p>{Formatter.formatPercentage(property.year_one_cap)}</p>
          </div>
          <div className='h-min-10 w-min-10 flex flex-col items-center rounded-sm bg-[#9cecc7] p-1 text-[#333333]'>
            <p>CF</p>
            <p>{Formatter.formatShortUSD(property.all_revenue[0])}</p>
          </div>
        </div>
      </div>

      {/* Delete button */}
      {visible && (
        <button
          onClick={handleDelete}
          className="absolute bottom-2 right-2 z-10 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
        >
          <Image
            height={20}
            width={20}
            src='/icons/trash.svg'
            alt='Delete'
          />
        </button>
      )}
    </div>
  );
};

export default PropertyCard;