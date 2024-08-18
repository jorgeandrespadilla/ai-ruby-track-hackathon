import { strict } from 'assert';
import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `
You are an assistant trained to identify complaints in customer service calls.
An entry could contain one or multiple reviews, so you must return a list of objects.
For each review in the entry, determine if it is a complaint. If it is, summarize the complaint in one or two sentences, and categorize it by product and subproduct. 
If it is not a complaint, set the summary and other related fields to null.
Return the result in the following JSON format:[
{
    "isComplaint": bool,  
    "summary": str | null, 

    "type": "string",  // Required string to hold the type of file, e.g., text, img, audio, etc.
    "product": "string | null",  // Product associated with the complaint. Can be null if not a complaint.
    "date_summary_created": "string | null",  // Date when the summary was generated. Can be null if not a complaint.
    "sub_product": "string | null",  // Sub-product category. Can be null if not a complaint.
    "tags": "string | null",  // Tags associated with the complaint, can be null.
    "company_response": "string | null",  // Response from the company. Can be null if not a complaint.
    "rating": "string | null",  // Rating of the product or service. Can be null if not a complaint.
    "company": "string | null",  // Name of the company. Can be null if not a complaint.
    "date_received": "string | null",  // Date when the complaint was received. Can be null if not a complaint.
    "status": "string | null",  // Status of the complaint: open, in review, closed. Can be null if not a complaint.
    "sort": number | null  // Sort order, based on relevance from the knowledge base. Can be null if not a complaint.
}]
`
interface RequestData {
    transcript: string;
}

export async function POST(req: NextRequest) {
    const openai = new OpenAI()
    const data: RequestData = await req.json()

    const completion = await openai.chat.completions.create({
        messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: data.transcript },
        ],
        model: "gpt-4o-mini",
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
                        "type": {
                            "type": "string",
                            "description": "Required string to hold the type of file, e.g., text, img, audio, etc."
                        },
                        "product": {
                            "type": ["string", "null"],
                            "description": "Product associated with the complaint. Can be null if not a complaint."
                        },
                        "date_summary_created": {
                            "type": ["string", "null"],
                            "description": "Date when the summary was generated. Can be null if not a complaint."
                        },
                        "sub_product": {
                            "type": ["string", "null"],
                            "description": "Sub-product category. Can be null if not a complaint."
                        },
                        "tags": {
                            "type": ["string", "null"],
                            "description": "Tags associated with the complaint, can be null."
                        },
                        "company_response": {
                            "type": ["string", "null"],
                            "description": "Response from the company. Can be null if not a complaint."
                        },
                        "rating": {
                            "type": ["string", "null"],
                            "description": "Rating of the product or service. Can be null if not a complaint."
                        },
                        "company": {
                            "type": ["string", "null"],
                            "description": "Name of the company. Can be null if not a complaint."
                        },
                        "date_received": {
                            "type": ["string", "null"],
                            "description": "Date when the complaint was received. Can be null if not a complaint."
                        },
                        "status": {
                            "type": ["string", "null"],
                            "description": "Status of the complaint: open, in review, closed. Can be null if not a complaint."
                        },
                        "sort": {
                            "type": ["number", "null"],
                            "description": "Sort order, based on relevance from the knowledge base. Can be null if not a complaint."
                        }
                    },
                    "required": ["type", "isComplaint", "summary", "product", "sub_product"],
                    "additionalProperties": false
                }
            }
        }
    })

    const response = JSON.parse(completion.choices[0].message.content ?? '{}')
    return NextResponse.json(response)
}
