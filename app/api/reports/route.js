import UserHandler from '@lib/auth/userHandler';
import validateCookie from '@lib/auth/validateCookie';
import ReportsHandler from '@lib/reportsHandler';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Validate request is coming from valid authToken
    const data = await request.json();

    if (data) {
      const { reportData, username, reportType} = data;

      const user = await UserHandler.getUserByUsername(username);

      if (reportType == "rental"){
      // Create a new report
        const newReport = await ReportsHandler.createReport({
          ...reportData,
          userId: user.id,
        });

        return NextResponse.json(newReport, { status: 201 });
      }
      else{
        return  NextResponse.json({error: 'Invalid Report Type', status: 401})
      }
    } else {
      // Return unauthorized response
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to create report.' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Validate request is coming from valid authToken
    const validCookie = await validateCookie();

    if (validCookie) {
      // Get reports for the user
      const reports = await ReportsHandler.getReportsByUserId(
        validCookie.userId
      );

      return NextResponse.json(reports, { status: 200 });
    } else {
      // Return unauthorized response
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}
