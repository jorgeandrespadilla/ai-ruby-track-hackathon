import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const getOCRText = async (url: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the text from the image, do not add interpretation." },
          {
            type: "image_url",
            image_url: {
              url: url,
            },
          },
        ],
      },
    ],
  });

  return response.choices[0]?.message?.content?.trim() || '';
};
