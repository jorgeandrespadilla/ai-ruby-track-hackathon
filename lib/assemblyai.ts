// /lib/assemblyai.ts

import {AssemblyAI} from 'assemblyai';

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY ?? '',
});

export const transcribeAudio = async () => {
  try {
    const FILE_URL = 'https://storage.googleapis.com/aai-web-samples/5_common_sports_injuries.mp3';

    const data = {
      audio_url: FILE_URL
    };

    const transcript = await client.transcripts.transcribe(data);
    console.log(transcript.text);
    return transcript.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};
