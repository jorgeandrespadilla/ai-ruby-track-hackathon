import { NextApiRequest, NextApiResponse } from 'next';
import { saveTranscriptAndComplaints } from '@/db/queries';

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { userId, transcript, fileUrl, analysis } = req.body;

  try {
    const body = await saveTranscriptAndComplaints({ userId, transcript, fileUrl, analysis });
    return Response.json({"body": body });
  } catch (error) {
    
  }
}
