import OpenAI from 'openai';
import { AnalysisResult } from './types';

const SYSTEM_PROMPT = `
You are an assistant trained to identify complaints in customer service calls.
Each entry could contain one or multiple reviews, so you must return a list of objects under the key "analysis".
For each review in the entry, determine if it is a complaint. If it is, summarize the complaint in one or two sentences, and categorize it by product and subproduct. 
If it is not a complaint, set the summary and other related fields to null.
Return a JSON object with a single key "analysis" that contains a list of objects, where each object contains the following fields:
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
            "type": "object",
            "properties": {
              "isComplaint": {
                "type": "boolean",
                "description": "Flag to determine if it's a complaint."
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
              }
            },
            "required": ["isComplaint", "summary", "product", "sub_product"],
            "additionalProperties": false
          }
        }
      }
    });

    const response = JSON.parse(completion.choices[0].message.content ?? '{}');
    
    const analysisResult = Array.isArray(response.analysis) ? response.analysis : [];
    
    return analysisResult as AnalysisResult[];
  }
  catch (error) {
    console.error('Error analyzing transcript:', error);
    throw new Error('Failed to analyze transcript');
  }
}
