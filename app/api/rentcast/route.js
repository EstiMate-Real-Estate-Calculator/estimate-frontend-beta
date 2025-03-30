import { NextResponse } from 'next/server';

// --- Helper Functions (Provided by User, slightly adapted for server-side) ---

// Placeholder for the formatting function - implement based on your needs
function formatRentData(params) {
  // Example: Directly use params or apply specific formatting/defaults
  return {
    address: params.get('address') || '',
    squareFootage: parseInt(params.get('squareFootage') || '0', 10),
    propertyType: params.get('propertyType') || 'Single Family', // Default example
    daysOld: parseInt(params.get('daysOld') || '30', 10), // Default example
    bathrooms: parseFloat(params.get('bathrooms') || '1'), // Use float for potential halves
    bedrooms: parseInt(params.get('bedrooms') || '1', 10),
    units: parseInt(params.get('units') || '1', 10),
  };
}

async function fetchData(url, headers, retries) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
      // Optional: Add cache control if needed for external APIs
      // cache: 'no-store',
    });

    if (response.status === 429 || response.status >= 500) { // Include server errors
      if (retries <= 0) {
        console.error(`Too many retries for ${url}. Last status: ${response.status}`);
        // Throw a specific error or return a structured error object
        throw new Error(`Failed to fetch data from ${url} after multiple retries. Status: ${response.status}`);
      }
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, 1500)); // Increased delay
      return fetchData(url, headers, retries - 1); // Return the promise
    } else if (!response.ok) {
      // Handle other client errors (e.g., 400, 401, 404)
      const errorBody = await response.text(); // Try to get more info
      console.error(`HTTP error for ${url}! Status: ${response.status}, Body: ${errorBody}`);
      throw new Error(`HTTP error! Status: ${response.status} for ${url}`);
    } else {
      return await response.json(); // Parse JSON response
    }
  } catch (error) {
    // Catch network errors or errors from response processing
    console.error(`FetchData Error for ${url}:`, error);
    // Re-throw or return a structured error
    throw new Error(`Network or processing error fetching data from ${url}: ${error.message}`);
  }
}


async function estimateRent(params) {
  const API_KEY = process.env.RENTCAST_API_KEY; // Use environment variable
  if (!API_KEY) {
    throw new Error("Rentcast API key is not configured.");
  }

  let {
    address,
    squareFootage,
    propertyType,
    daysOld,
    bathrooms,
    bedrooms,
    units
  } = formatRentData(params); // Use the formatted data

  // Basic validation
  if (!address) throw new Error("Address is required for rent estimation.");

  // Adjust per unit if units > 1
  if (units > 1 && squareFootage > 0) squareFootage = Math.floor(squareFootage / units);
  if (units > 1 && bathrooms > 0) bathrooms = Math.max(1, Math.floor(bathrooms / units)); // Ensure at least 1
  if (units > 1 && bedrooms > 0) bedrooms = Math.max(1, Math.floor(bedrooms / units)); // Ensure at least 1

  const url = `https://api.rentcast.io/v1/avm/rent/long-term?address=${encodeURIComponent(address)}&squareFootage=${squareFootage}&propertyType=${propertyType}&daysOld=${daysOld}&bathrooms=${bathrooms}&bedrooms=${bedrooms}`;
  const headers = { 'X-Api-Key': API_KEY };
  const numOfRetries = 3;

  return fetchData(url, headers, numOfRetries);
}

async function comparables(params) {
  const API_KEY = process.env.RENTCAST_API_KEY; // Use environment variable
   if (!API_KEY) {
    throw new Error("Rentcast API key is not configured.");
  }

  let {
    address,
    squareFootage,
    propertyType,
    daysOld,
    bathrooms,
    bedrooms,
    // units // units not directly used in this URL structure, but needed for potential adjustments
  } = formatRentData(params); // Use the formatted data

  // Basic validation
  if (!address) throw new Error("Address is required for comparables.");

  let compCount = 5; // Or get from params if needed: parseInt(params.get('compCount') || '5', 10);


  const url = `https://api.rentcast.io/v1/avm/value?address=${encodeURIComponent(address)}&squareFootage=${squareFootage}&propertyType=${propertyType}&daysOld=${daysOld}&bathrooms=${bathrooms}&bedrooms=${bedrooms}&compCount=${compCount}`;
  const headers = { 'X-Api-Key': API_KEY };
  const numOfRetries = 3;

  return fetchData(url, headers, numOfRetries);
}


// --- API Route Handler ---

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  try {
    // Call both external API functions concurrently
    const [rentEstimateResponse, comparablesResponse] = await Promise.all([
      estimateRent(searchParams),
      comparables(searchParams)
    ]);

    // Combine the results
    const responseData = {
      rentEstimate: rentEstimateResponse,
      comparables: comparablesResponse,
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error("API Route Error:", error.message);
    // Return a structured error response
    return NextResponse.json(
      { message: "Failed to fetch property data", error: error.message },
      { status: 500 } // Use 500 for server-side/external API issues
    );
  }
}