import userHandler from "@/lib/auth/userHandler";

/**
 * Checks if a given tutorial number already exists for the specified user.
 *
 * @param {string|number} userId - The user's ID.
 * @param {number} tutorialNumber - The tutorial number to check.
 * @returns {Promise<boolean>} - Returns true if the tutorial exists, false otherwise.
 */
export async function tutorialExistsForUser(userId, tutorialNumber) {
  // Ensure the user exists and retrieve the user record.
  const user = await userHandler.getUserById(userId);
  const tutorials = user.tutorials || [];
  // Check if the tutorial already exists in the user's tutorials list.
  return tutorials.includes(tutorialNumber);
}

export async function getTutorialsByUserId(userId){
  const user = await userHandler.getUserById(userId);
    if (!user) {
      return [];
    }
    return user.tutorials || [];
  }

export async function appendTutorialToAllUsers(tutorialNumber) {
  const users = await userHandler.getAllUsers();

  for (const user of users) {
    const exists = await tutorialExistsForUser(user.id, tutorialNumber);
    console.log("E", exists)
    // Only append if the tutorial does NOT already exist.
    if (!exists) {
      let tutorials = [];
      if (user.tutorials && Array.isArray(user.tutorials)) {
        tutorials = [...user.tutorials];
      }
      tutorials.push(tutorialNumber);

      await userHandler.updateUser(user.id, { tutorials });
      console.log(`Appended tutorial ${tutorialNumber} for user ${user.id}`);
    }
  }
}

/**
 * Append a tutorial number for a single user.
 *
 * @param {string|number} userId - The user's ID.
 * @param {number} tutorialNumber - The tutorial number to append.
 */
export async function appendTutorialToUser(userId, tutorialNumber) {
  // Check if the tutorial already exists for the user.
  const exists = await tutorialExistsForUser(userId, tutorialNumber);
  if (exists) {
    console.log(`Tutorial ${tutorialNumber} already exists for user ${userId}.`);
    return;
  }

  // Retrieve the user.
  const user = await userHandler.getUserById(userId);
  let tutorials = [];
  if (user.tutorials && Array.isArray(user.tutorials)) {
    tutorials = [...user.tutorials];
  }
  // Append the new tutorial number.
  tutorials.push(tutorialNumber);

  // Update the user's record.
  await userHandler.updateUser(user.id, { tutorials });
  console.log(`Appended tutorial ${tutorialNumber} for user ${userId}.`);
}

/**
 * Remove a specific tutorial number from a single user.
 */
export async function removeTutorialFromUser(userId, tutorialNumber) {
  const user = await userHandler.getUserById(Number(userId));

  let tutorials = [];
  if (user.tutorials && Array.isArray(user.tutorials)) {
    tutorials = [...user.tutorials];
  }
  // Remove the tutorial number from the array.
  tutorials = tutorials.filter((num) => num !== tutorialNumber);

  await userHandler.updateUser(user.id, { tutorials });
  console.log(`Removed tutorial ${tutorialNumber} for user ${user.id}`);
}
