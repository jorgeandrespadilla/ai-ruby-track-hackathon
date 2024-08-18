import OpenAI from 'openai';
import { AnalysisResult, SimilarComplaint } from './types';
import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { Document as VectorDocument } from "langchain/document";
import { TokenTextSplitter } from "langchain/text_splitter";

const SYSTEM_PROMPT = `
You are an assistant trained to identify complaints in customer service calls.
An entry could contain one or multiple reviews, so you must return a list of objects.
For each review in the entry, determine if it is a complaint. If it is, summarize the complaint in one or two sentences, and categorize it by product and subproduct. 
If it is not a complaint, set the summary and other related fields to null.
Return a JSON with a list of objects, where each object contains the following fields:
{
  "isComplaint": bool,
  "summary": string | null,  // Summary of the complaint. Can be null if not a complaint.
  "product": "string | null",  // Product associated with the complaint. Can be null if not a complaint.
  "sub_product": "string | null",  // Sub-product category. Can be null if not a complaint.
  "rating": "number | null",  // Rating of the product or service from 1 to 5. Can be null if not a complaint.
  "company": "string | null",  // Name of the company. Can be null if not a complaint.
}
`;

export async function analyzeTranscript(transcript: string) {
  try {
    const openai = new OpenAI();

    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript },
      ],
      model: 'gpt-4o-mini',
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'complaints',
          schema: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                "isComplaint": {
                  type: 'boolean',
                  description: 'Flag to determine if it\'s a complaint.'
                },
                "summary": {
                  "type": ["string", "null"],
                  "description": "Summary of the complaint. Can be null if not a complaint."
                },
                "product": {
                  "type": ["string", "null"],
                  "description": "Product associated with the complaint. Can be null if not a complaint."
                },
                "sub_product": {
                  "type": ["string", "null"],
                  "description": "Sub-product category. Can be null if not a complaint."
                },
                "rating": {
                  "type": ["string", "null"],
                  "description": "Rating of the product or service from 1 to 5. Can be null if not a complaint."
                },
                "company": {
                  "type": ["string", "null"],
                  "description": "Name of the company. Can be null if not a complaint."
                },
              },
              "required": ["isComplaint", "summary", "product", "sub_product"],
              "additionalProperties": false
            }
          }
        }
      }
    });

    const response = JSON.parse(completion.choices[0].message.content ?? '[]');
    return response as AnalysisResult[];
  }
  catch (error) {
    console.error('Error analyzing transcript:', error);
    throw new Error('Failed to analyze transcript');
  }
}

const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY as string
});
const pineconeIndex = pinecone.Index(process.env.PINECONE_INDEX_NAME as string);

async function createVectorStore() {
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    // Maximum number of batch requests to allow at once. Each batch is 1000 vectors.
    maxConcurrency: 5,
    // You can pass a namespace here too
    // namespace: "foo",
  });
  return vectorStore;
} 

interface IngestComplaintRequest {
  complaintId: string;
  complaintSummary: string;
}

export async function ingestComplaint(data: IngestComplaintRequest) {
  // Read the file and create a document
  const doc = new VectorDocument({
    pageContent: data.complaintSummary,
    metadata: {
      complaintId: data.complaintId,
    }
  });

  // 1. Split the text into chunks
  const textSplitter = new TokenTextSplitter({
    chunkSize: 1000,
    encodingName: "cl100k_base",
  });
  const splits = await textSplitter.splitDocuments([doc]);

  // 2. Store the first split in the vector store
  const firstSplit = splits[0];
  const vectorStore = await createVectorStore();
  await vectorStore.addDocuments([firstSplit]);
}

interface RetrieveSimilarComplaintsRequest {
  complaintSummary: string;
  maxResults: number;
}

export async function retrieveSimilarComplaints(data: RetrieveSimilarComplaintsRequest) {
  const vectorStore = await createVectorStore();
  
  // 1. Generate single split for the complaint
  const textSplitter = new TokenTextSplitter({
    chunkSize: 1000,
    encodingName: "cl100k_base",
  });
  const splits = await textSplitter.splitText(data.complaintSummary);
  const firstSplit = splits[0];


  // 2. Retrieve the most relevant results
  const retriever = vectorStore.asRetriever({
    k: data.maxResults, // Number of results to retrieve
  });
  const results = await retriever.invoke(firstSplit);

  return results.map(doc => ({
    complaintId: doc.metadata.complaintId as string,
    complaintSummary: doc.pageContent,
  } satisfies SimilarComplaint));
}
