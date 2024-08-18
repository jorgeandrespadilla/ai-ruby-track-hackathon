import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateUniqueFilename, startsWithPrefixes } from '@/lib/utils';
import { analyzeTranscript, ingestComplaint } from '@/lib/ai';
import { transcribeAudio } from '@/lib/assemblyai';
import { getOCRText } from '@/lib/getOCRText';
import { AnalysisResult } from '@/lib/types';

const SUPPORTED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
  "audio/wav",
  "audio/mp3",
];

interface ProcessFormDataResult {
  // The transcript of the file
  transcript: string;
  // The URL of the file if it was uploaded
  fileUrl?: string;
}

async function processFormData(formData: FormData): Promise<ProcessFormDataResult> {
  // Check if the request has a transcript
  if (formData.has("transcript")) {
    return {
      transcript: formData.get("transcript") as string,
    }
  }

  // Get the file from the request
  if (!formData.has("file")) {
    throw new Error("No file found");
  }
  const file = formData.get("file") as File;
  console.log(file.type);
  if (!startsWithPrefixes(file.type, SUPPORTED_FILE_TYPES)) {
    throw new Error("Invalid file type");
  }

  // Upload the file to Supabase
  const uniqueFilename = generateUniqueFilename(file.name);
  const result = await supabase.storage.from("files").upload(uniqueFilename, file);
  if (result.error) {
    console.error(result.error);
    throw new Error("Failed to upload file");
  }
  const fileUrl = supabase.storage.from("files").getPublicUrl(uniqueFilename).data.publicUrl;

  if (file.type.startsWith("audio")) {
    return {
      transcript: await transcribeAudio(fileUrl),
      fileUrl,
    };
  }
  else {
    return {
      transcript: await getOCRText(fileUrl),
      fileUrl,
    };
  }
}

interface ResponseData {
  transcript: string;
  fileUrl?: string;
  analysis: AnalysisResult[];
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const transcriptResult = await processFormData(formData);
    const analysisResult = await analyzeTranscript(transcriptResult.transcript);
    
    // Ingest complaints into the RAG vector store
    for (const result of analysisResult) {
      if (!result.isComplaint || !result.summary) {
        continue;
      }
      await ingestComplaint({
        complaintId: "123", // TODO: Replace with actual complaint ID
        complaintSummary: result.summary!,
      });
    }

    const data = {
      transcript: transcriptResult.transcript,
      fileUrl: transcriptResult.fileUrl,
      analysis: analysisResult,
    } satisfies ResponseData;
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}
