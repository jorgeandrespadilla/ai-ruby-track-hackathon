import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `
You are an assistant trained to identify complaints in customer service calls.
If the input text is a complaint, summarize the complaint in one or two sentences. Otherwise, set the summary to null.
Return the result in the following JSON format:
{
    "isComplaint": bool,
    "summary": str | null
}
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
        model: "gpt-4o",
        response_format: { type: 'json_object' }
    })

    const response = JSON.parse(completion.choices[0].message.content ?? '{}')
    return NextResponse.json(response)
}
