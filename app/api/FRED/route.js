import { NextResponse } from 'next/server';

// --- CORS Configuration ---
// Define allowed origins. Adjust this list as needed.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe",
  "chrome-extension://dlimagmnfejadhgiedoepmbpmnkceddo",
  "https://estimate-frontend-beta-git-develop-jons-projects-566ae2e5.vercel.app",
];

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, OPTIONS", // Only GET and OPTIONS needed
    "Access-Control-Allow-Headers": "Content-Type, Authorization", // Standard headers
  };
  // Allow requests from listed origins or if origin is null/undefined (e.g., curl)
  if (!origin || allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin || "*"; // Be specific if possible
  }
  return headers;
}

// --- Date Helper ---
function getFormattedDate(date) {
  // Returns date in YYYY-MM-DD format required by FRED API
  return date.toISOString().split('T')[0];
}

// --- API Route Handlers ---

export async function OPTIONS(request) {
  const corsHeaders = getCorsHeaders(request);
  // Respond to preflight requests
  return new Response(null, {
    status: 204, // No Content
    headers: corsHeaders,
  });
}

export async function GET(request) {
  const corsHeaders = getCorsHeaders(request);

  // 1. Check Origin
  if (!corsHeaders['Access-Control-Allow-Origin']) {
      return NextResponse.json(
          { message: "Origin not allowed" },
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
  }

  // 2. Get API Key (Ensure this is set in your .env.local)
  const API_KEY = process.env.FRED_API_KEY;
  if (!API_KEY) {
    console.error("FRED API key is not configured in environment variables.");
    return NextResponse.json(
      { message: "Server configuration error: Missing API key." },
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // 3. Calculate Dates
    const todayDate = new Date();
    const weekAgoDate = new Date();
    weekAgoDate.setDate(todayDate.getDate() - 7);

    const today = getFormattedDate(todayDate);
    const weekAgo = getFormattedDate(weekAgoDate);

    // 4. Construct FRED API URL
    const seriesId = 'MORTGAGE30US';
    const url = `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&observation_start=${weekAgo}&observation_end=${today}&api_key=${API_KEY}&sort_order=desc&limit=1&file_type=json`;

    // 5. Fetch Data from FRED
    const fredResponse = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json' // Specify expected response type
        }
        // Consider adding cache control if desired: cache: 'no-store' or revalidate options
    });

    if (!fredResponse.ok) {
      // Attempt to get error details from FRED response
      let errorDetails = `Status: ${fredResponse.status}`;
      try {
        const errorBody = await fredResponse.json();
        errorDetails = errorBody.error_message || JSON.stringify(errorBody);
      } catch (e) {
        // If response is not JSON, use text
        errorDetails = `${errorDetails}, Body: ${await fredResponse.text()}`;
      }
      console.error("Error fetching from FRED API:", errorDetails);
      throw new Error(`Failed to fetch data from FRED API. ${errorDetails}`);
    }

    const data = await fredResponse.json();

    // 6. Process Response
    if (!data || !data.observations || data.observations.length === 0) {
        console.warn("No observations found in FRED response for the specified date range.");
        // Decide how to handle this - return null, 0, or an error?
        // Returning null might be appropriate if data might genuinely not exist yet.
         return NextResponse.json(
            { latestRate: null, message: "No recent mortgage rate data found." },
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
    }

    // Extract the latest rate (value should be a string, convert to number)
    const latestObservation = data.observations[0];
    const latestRate = parseFloat(latestObservation.value);

    // Check if the value is a valid number (FRED uses '.' for missing data)
    if (isNaN(latestRate)) {
         console.warn("Latest FRED observation value is not a valid number:", latestObservation.value);
         return NextResponse.json(
            { latestRate: null, message: "Latest mortgage rate data point is invalid or missing." },
            { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
         );
    }

    // 7. Return Success Response
    return NextResponse.json(
        { latestRate: latestRate, observationDate: latestObservation.date }, // Include date for context
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("API Route Error (FRED):", error.message);
    // Return a structured error response
    return NextResponse.json(
      { message: "Failed to fetch mortgage rate data", error: error.message },
      {
        status: 500, // Use 500 for server-side/external API issues
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}