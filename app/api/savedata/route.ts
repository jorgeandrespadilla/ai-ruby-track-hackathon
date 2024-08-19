import { NextRequest, NextResponse } from 'next/server';
import { saveTranscriptAndComplaints } from '@/db/queries';

interface TranscriptAndComplaints {
  userId: string;
  transcript: string;
  fileUrl: string;
  analysis: string;
}

export async function POST(req: NextRequest) {
  const { userId, transcript, fileUrl, analysis }: TranscriptAndComplaints = await req.json();

  try {
    const body = await saveTranscriptAndComplaints({ userId, transcript, fileUrl, analysis });
    return NextResponse.json({"body": body });
  } catch (error) {
    return NextResponse.json({"error": error }, { status: 500 });
  }
}
