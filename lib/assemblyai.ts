import {AssemblyAI} from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY!
});

export async function transcribeAudio(fileUrl: string): Promise<string> {
  try {
    const data = {
      audio_url: fileUrl
    };
    const transcript = await client.transcripts.transcribe(data);
    return transcript.text ?? '';
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio');
  }
};
