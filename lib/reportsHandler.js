import { prisma } from '@/lib/prisma';

/**
 * Handle all CRUD (Create, Read, Update, Delete) functionality for the reports table
 *
 * @example
 * // Create a new report for a specific user
const newReport = await ReportsHandler.createReport({
    userId: 1, // Ensure to set the userId
    propertyId: 'property123',
    reportNickName: 'Annual Report',
    // additional fields...
});
console.log('Report created:', newReport);

// Get a report by ID for a specific user
const reportById = await ReportsHandler.getReportById(newReport.reportId, newReport.userId);
console.log('Report found by ID:', reportById);

// Get all reports for a specific user
const userReports = await ReportsHandler.getReportsByUserId(1);
console.log('Reports for user:', userReports);

// Update report data for a specific user
const updatedReport = await ReportsHandler.updateReport(newReport.reportId, newReport.userId, {
    reportNickName: 'Updated Annual Report',
});
console.log('Report updated:', updatedReport);

// Delete the report for a specific user
const deleteResponse = await ReportsHandler.deleteReport(newReport.reportId, newReport.userId);
console.log(deleteResponse);
 */
class ReportsHandler {
  constructor() {}

  // Creates a new report for a specific user
  static async createReport(report) {
    console.log("incoming report", report)
    try {
      const newReport = await prisma.reports.create({
        data: report, // Ensure userId is part of the report object
      });

      return newReport;
    } catch (error) {
      console.error(error)
      throw new Error(
        `An exception occurred when creating a new report: ${error}`
      );
    }
  }

  // Gets a report's data based on the property ID and checks if it belongs to the user
  static async getReportById(propertyId, userId) {
    try {
      const report = await prisma.reports.findFirst({
        where: { propertyId },
      });

      if (!report) {
        throw new Error('Report not found');
      }

      if (report.userId !== userId) {
        throw new Error('Unauthorized access to this report');
      }

      return report;
    } catch (error) {
      throw new Error(`An exception occurred when getting a report: ${error}`);
    }
  }

  // Gets all reports by user ID
  static async getReportsByUserId(userId) {
    try {
      const reports = await prisma.reports.findMany({
        where: { userId },
      });

      return reports;
    } catch (error) {
      throw new Error(`An exception occurred when getting reports: ${error}`);
    }
  }

  // Updates a report's data based on the property ID and checks if it belongs to the user
  static async updateReport(propertyId, userId, reportData) {
    try {
      const report = await prisma.reports.findFirst({
        where: { propertyId },
      });

      if (!report) {
        throw new Error('Report not found');
      }

      if (report.userId !== userId) {
        throw new Error('Unauthorized access to this report');
      }

      const updatedReport = await prisma.reports.update({
        where: { reportId: report.reportId, userId },
        data: reportData,
      });

      return updatedReport;
    } catch (error) {
      throw new Error(`An exception occurred when updating a report: ${error}`);
    }
  }

  // Deletes a report based on the property ID and checks if it belongs to the user
  static async deleteReport(propertyId, userId) {
    try {
      const report = await prisma.reports.findFirst({
        where: { propertyId },
      });

      if (!report) {
        throw new Error('Report not found');
      }

      if (report.userId !== userId) {
        throw new Error('Unauthorized access to this report');
      }

      await prisma.reports.delete({
        where: { reportId: report.reportId, userId },
      });
      return { message: 'Report deleted successfully' }; // Confirmation message
    } catch (error) {
      throw new Error(`An exception occurred when deleting a report: ${error}`);
    }
  }
}

export default ReportsHandler;
