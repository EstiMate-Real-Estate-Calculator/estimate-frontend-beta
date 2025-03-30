import {
  appendTutorialToAllUsers,
  appendTutorialToUser,
  removeTutorialFromUser,
  removeTutorialFromAllUsers,
  tutorialExistsForUser, 
  getTutorialsByUserId,
} from "@lib/userTutorial"; // adjust the import path accordingly

// Define allowed origins. Update this list as needed.
const allowedOrigins = [
  "http://esti-matecalculator.com",
  "https://www.esti-matecalculator.com",
  "chrome-extension://ibgdanpaoapljanhifdofglnibahljbe",
  // Add your Vercel preview/production URLs if needed
  "chrome-extension://dlimagmnfejadhgiedoepmbpmnkceddo",
  "https://estimate-frontend-beta-git-develop-jons-projects-566ae2e5.vercel.app"
];

function getCorsHeaders(request) {
  const origin = request.headers.get("origin");
  const headers = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
  if (allowedOrigins.includes(origin)) {
    headers["Access-Control-Allow-Origin"] = origin;
  } else {
    headers["Access-Control-Allow-Origin"] = "null";
  }
  return headers;
}

export async function OPTIONS(request) {
  const headers = getCorsHeaders(request);
  // Respond to preflight requests with dynamic CORS headers
  return new Response(null, {
    status: 200,
    headers,
  });
}

export async function POST(req) {
  const headers = {
    ...getCorsHeaders(req),
    "Content-Type": "application/json",
  };

  try {
    const body = await req.json();
    const { tutorialNumber, action, userId } = body;

    if (tutorialNumber === undefined || !action) {
      return new Response(
        JSON.stringify({
          success: false,
          message:
            "tutorialNumber and action are required in the request body.",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    if (action === "append") {
      if (userId) {
        // Check if the tutorial already exists for this user.
        const exists = await tutorialExistsForUser(userId, tutorialNumber);
        if (exists) {
          return new Response(
            JSON.stringify({
              success: false,
              message: `Tutorial ${tutorialNumber} already exists for user ${userId}.`,
            }),
            {
              status: 400,
              headers,
            }
          );
        }
        // Append tutorial for the specific user.
        await appendTutorialToUser(userId, tutorialNumber);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully appended tutorial ${tutorialNumber} for user ${userId}.`,
          }),
          {
            status: 200,
            headers,
          }
        );
      } else {
        // For all users, assume the helper function handles duplicate checks internally.
        await appendTutorialToAllUsers(tutorialNumber);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully appended tutorial ${tutorialNumber} for all users.`,
          }),
          {
            status: 200,
            headers,
          }
        );
      }
    } else if (action === "remove") {
      if (userId) {
        // Remove tutorial for the specific user.
        await removeTutorialFromUser(userId, tutorialNumber);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully removed tutorial ${tutorialNumber} for user ${userId}.`,
          }),
          {
            status: 200,
            headers,
          }
        );
      } else {
        // Remove tutorial for all users.
        await removeTutorialFromAllUsers(tutorialNumber);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully removed tutorial ${tutorialNumber} for all users.`,
          }),
          {
            status: 200,
            headers,
          }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid action. Valid actions are "append" or "remove".',
        }),
        {
          status: 400,
          headers,
        }
      );
    }
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers,
      }
    );
  }
}

export async function GET(req) {
  const headers = {
    ...getCorsHeaders(req),
    "Content-Type": "application/json",
  };

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "userId query parameter is required.",
        }),
        {
          status: 400,
          headers,
        }
      );
    }

    const tutorials = await getTutorialsByUserId(Number(userId));
    return new Response(
      JSON.stringify({
        success: true,
        tutorials: tutorials,
      }),
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      {
        status: 500,
        headers,
      }
    );
  }
}
