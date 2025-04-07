import { prisma } from '@lib/prisma';

class TutorialHandler {
    constructor() {}
  /**
   */
  static async createTutorial({ userId, name }) {
    try {
      // Note the lowercase 'tutorials' to match `model Tutorials` in schema.prisma
      const newTutorial = await prisma.tutorials.create({
        data: {
          id: userId, 
          name,
        },
      });
      return newTutorial;
    } catch (error) {
      console.error(error);
      throw new Error(`Error creating tutorial: ${error}`);
    }
  }

  /**
   * Upserts a tutorial (create if it doesn't exist, update if it does).
   * @param {Object} params
   * @param {number} params.id - The ID you want to store as 'id'.
   * @param {string} params.name - The tutorial name.
   */
  static async upsertTutorial({ id, name }) {
    try {
      const upsertedTutorial = await prisma.tutorials.upsert({
        where: { id: id },
        create: { id: id, name },
        update: { name },
      });
      return upsertedTutorial;
    } catch (error) {
      console.error(error);
      throw new Error(`Error upserting tutorial: ${error}`);
    }
  }

  /**
   * Retrieves a tutorial by userId.
   * @param {number} id - The ID used as 'id' in Tutorials.
   */
  static async getTutorialById(id) {
    try {
      const tutorial = await prisma.tutorials.findUnique({
        where: { id: id },
      });
      return tutorial;
    } catch (error) {
      throw new Error(`Error getting tutorial: ${error}`);
    }
  }

  /**
   * Updates a tutorial by userId.
   * @param {number} userId - The ID used as 'id' in Tutorials.
   * @param {Object} data - Fields to update (e.g. { name: "New name" }).
   */
  static async updateTutorial(userId, data) {
    try {
      // First, check if it exists
      const tutorial = await prisma.tutorials.findUnique({
        where: { id: userId },
      });
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }

      const updatedTutorial = await prisma.tutorials.update({
        where: { id: userId },
        data,
      });
      return updatedTutorial;
    } catch (error) {
      throw new Error(`Error updating tutorial: ${error}`);
    }
  }

  /**
   * Deletes a tutorial by userId.
   * @param {number} userId - The ID used as 'id' in Tutorials.
   */
  static async deleteTutorial(userId) {
    try {
      // Check if it exists
      const tutorial = await prisma.tutorials.findUnique({
        where: { id: userId },
      });
      if (!tutorial) {
        throw new Error('Tutorial not found');
      }

      await prisma.tutorials.delete({
        where: { id: userId },
      });
      return { message: 'Tutorial deleted successfully' };
    } catch (error) {
      throw new Error(`Error deleting tutorial: ${error}`);
    }
  }
}

export default TutorialHandler;
