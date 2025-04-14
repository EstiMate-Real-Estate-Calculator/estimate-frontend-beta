'use client';

import Formatter from '@lib/formatterClass';
// import Image from 'next/image';
import React, { useState } from 'react';
import { Row, Col } from "antd";
import "../styles/PropertyCard.scss";
import { FaBed } from 'react-icons/fa6';
import { FaBath } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { LuClipboardList } from 'react-icons/lu';
import { SiGoogledocs } from "react-icons/si";

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
    <>
      <div className="bg-white rounded-lg overflow-hidden shadow-md mainPropertyCard"
      >
        {/* Property Image with Stats */}
        <div className="relative">
          <div className="absolute top-2 right-2 bg-white p-1 rounded-full">
            <button
              onClick={() => onDelete(property.propertyId)}
              className="text-gray-500 hover:text-red-500"
              aria-label="Delete property"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div className="h-48 relative">

            {imageURL ? (
              <img
                src={imageURL}
                alt={`${property.name || 'Property'}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 22V12h6v10"></path>
                </svg>
              </div>
            )}
          </div>

          {/* Stats Overlay */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-between px-4 widgetsSection">
            <div className="bg-opacity-70 backdrop-filter text-white px-6 py-3 rounded-lg text-center border widget">
              <div className="font-bold text-sm label">NOI</div>
              <div className="text-sm font-semibold value">{Formatter.formatShortUSD(property.all_NOI[0])}</div>
            </div>
            <div className="bg-opacity-70 backdrop-filter text-white px-6 py-3 rounded-lg text-center border widget">
              <div className="font-bold text-sm">CAP</div>
              <div className="text-sm font-semibold">{Formatter.formatPercentage(property.year_one_cap)}</div>
            </div>
            <div className="bg-opacity-70 backdrop-filter text-white px-6 py-3 rounded-lg text-center border widget">
              <div className="font-bold text-sm">CF</div>
              <div className="text-sm font-semibold">{Formatter.formatShortUSD(property.all_revenue[0])}</div>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-4 cardDetails">
          <h3 className="text-lg font-semibold">{property.name || 'Summer Heights'}</h3>
          <p className="text-gray-600 flex items-center mt-1">
            <FaLocationDot />
            {addressDetails}
          </p>

          <div className="flex items-center justify-between mt-3 mb-4">
            <div className="flex items-center bathroomWrapper">
              <div className='left'>
                <div className="flex items-center mr-3">
                  <FaBed />
                  <span className="text-sm">{property.bedrooms || '4'}</span>
                </div>
                <div className="flex items-center mr-3">
                  <FaBath />
                  <span className="text-sm">{property.bathrooms || '3'}</span>
                </div>
              </div>
              <div className='right'>
                <div className="flex items-center">
                  <SiGoogledocs />
                  <span className="text-sm">{property.sqft || '1829'} sqft</span>
                </div>
              </div>
            </div>
          </div>

          <hr />
          <Row className='bottomRow'>
            <Col md={12} xs={12}>
              <div className="text-xs text-gray-500">STARTING PRICE</div>
              <div className="text-lg font-bold">{`${listingPrice ? Formatter.formatUSD(listingPrice) : ''}`}</div>
            </Col>
            <Col md={12} xs={12}>
              <div className='flex detailWrapper'>
                <a className="w-full bg-blue-700 text-white py-2 rounded-md"
                  target='_blank'
                  href={`${reportUrl}`}
                  onClick={(e) => e.stopPropagation()}
                  Details>
                  Details
                </a>
              </div>
            </Col>
          </Row>

        </div>
      </div >
    </>

  );
};

export default PropertyCard;