import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateUniqueFilename, startsWithPrefixes } from '@/lib/utils';

export async function POST(req: NextRequest) {
  // Get the file from the request
  const formData = await req.formData();
  if (!formData.has("file")) {
    return Response.json({ error: "No file found" }, { status: 400 });
  }
  const file = formData.get("file") as File;
  if (!startsWithPrefixes(file.type, ["audio", "video"])) { 
    return Response.json({ error: "Invalid file type" }, { status: 400 });
  }

  // Upload the file to Supabase
  const uniqueFilename = generateUniqueFilename(file.name);
  const result = await supabase.storage.from("files").upload(uniqueFilename, file);
  if (result.error) {
    console.error(result.error);
    return Response.json({ error: "Failed to upload file" }, { status: 500 });
  }

  const fileUrl = supabase.storage.from("files").getPublicUrl(uniqueFilename);

  return NextResponse.json({ 
    path: result.data.path,
    fileUrl,
  });
}
