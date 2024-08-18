import { NextRequest, NextResponse } from 'next/server';
import { retrieveSimilarComplaints } from '@/lib/ai';
import { SimilarComplaint } from '@/lib/types';

interface SimilarComplaintsRequest {
  transcriptSummary: string;
  maxResults?: number;
}

interface SimilarComplaintsResponse {
  similarComplaints: SimilarComplaint[];
}

export async function POST(req: NextRequest) {
  try {
    const { 
      transcriptSummary,
      maxResults = 5,
    }: SimilarComplaintsRequest = await req.json();
    const similarComplaints = await retrieveSimilarComplaints({
      complaintSummary: transcriptSummary,
      maxResults: maxResults,
    });
    const response = {
      similarComplaints: similarComplaints,
    } as SimilarComplaintsResponse;
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
