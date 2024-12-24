import { NextResponse } from 'next/server';
import ReportsHandler from '@lib/reportsHandler';
import validateCookie from '@lib/auth/validateCookie';

export async function GET(request, { params }) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: 'ID is required' }, { status: 400 });
  }

  try {
    // Validate request is coming from valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Get reports for the user
      const report = await ReportsHandler.getReportById(id, validCookie.userId);

      if (!report) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(report, { status: 200 });
    } else {
      // Return unauthorized response
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch report.' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const reportData = await request.json();

  try {
    // Validate request is coming from valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Update the report
      const updatedReport = await ReportsHandler.updateReport(
        id,
        validCookie.userId,
        reportData
      );

      if (!updatedReport) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(updatedReport, { status: 200 });
    } else {
      // Return unauthorized response
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to update report.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    // Validate request is coming from a valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Attempt to delete the report
      const deletedReport = await ReportsHandler.deleteReport(
        id,
        validCookie.userId
      );

      if (!deletedReport) {
        return NextResponse.json(
          { error: 'Report not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: 'Report deleted successfully' },
        { status: 204 }
      );
    } else {
      // Return unauthorized response
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to delete report.' },
      { status: 500 }
    );
  }
}
