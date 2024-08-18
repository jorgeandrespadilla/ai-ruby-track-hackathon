// DATABASE QUERIES SHOULD GO HERE

import { db } from './index';
import { usersTable, transcriptsTable, complaintsTable } from './schema';
import { InsertUser, SelectUser, InsertTranscript, SelectTranscript, InsertComplaint } from './schema';

export async function createUser(data: InsertUser) {
  await db.insert(usersTable).values(data);
}

export async function createTranscript(data: InsertTranscript): Promise<number> {
  const [transcript] = await db
    .insert(transcriptsTable)
    .values(data)
    .returning({ id: transcriptsTable.id });

  return transcript.id;
}

export async function createComplaints(complaints: InsertComplaint[]) {
  await db.insert(complaintsTable).values(complaints);
}

// Function to save transcript and associated complaints
export async function saveTranscriptAndComplaints(responseData: any) {
  const { userId, transcript, fileUrl, analysis } = responseData;

  const transcriptId = await createTranscript({
    userId: userId,
    text: transcript,
    fileUrl: fileUrl,
  });

  const complaints: InsertComplaint[] = analysis.map(complaint => ({
    transcriptId,
    summary: complaint.summary || '',
    product: complaint.product || '',
    sub_product: complaint.sub_product || null,
    rating: complaint.rating || null,
    company: complaint.company || null,
    isComplaint: complaint.isComplaint,
  }));

  // Insert the complaints into the complaints_table
  await createComplaints(complaints);
}
