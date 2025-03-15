import {
  appendTutorialToAllUsers,
  appendTutorialToUser,
  removeTutorialFromUser,
  tutorialExistsForUser, 
  getTutorialsByUserId,
} from "@lib/userTutorial"; // adjust the import path accordingly

// POST handler for appending/removing tutorials
export async function POST(req) {
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
        { status: 400 }
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
            { status: 400 }
          );
        }
        // Append tutorial for the specific user.
        await appendTutorialToUser(userId, tutorialNumber);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully appended tutorial ${tutorialNumber} for user ${userId}.`,
          }),
          { status: 200 }
        );
      } else {
        // For all users, assume the helper function handles duplicate checks internally.
        await appendTutorialToAllUsers(tutorialNumber);

        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully appended tutorial ${tutorialNumber} for all users.`,
          }),
          { status: 200 }
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
          { status: 200 }
        );
      } else {
        // Remove tutorial for all users.
        await removeTutorialFromAllUsers(tutorialNumber);
        return new Response(
          JSON.stringify({
            success: true,
            message: `Successfully removed tutorial ${tutorialNumber} for all users.`,
          }),
          { status: 200 }
        );
      }
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Invalid action. Valid actions are "append" or "remove".',
        }),
        { status: 400 }
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
      { status: 500 }
    );
  }
}

// GET handler to fetch all tutorials for a given user
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const tutorials = await getTutorialsByUserId(Number(userId));

    if (!tutorials) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "userId query parameter is required.",
        }),
        { status: 400 }
      );
    }
    return new Response(
      JSON.stringify({
        success: true,
        tutorials: tutorials,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}
