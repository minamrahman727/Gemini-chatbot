// app/api/chat/route.ts
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY, // Ensure your OpenAI API key is properly set in `.env.local`
  })
);

export async function POST(request: Request) {
  try {
    const { message } = await request.json(); // Get the user's input

    const completion = await openai.createChatCompletion({
      model: "gpt-4", // GPT-4 model
      messages: [{ role: "user", content: message }],
    });

    const reply = completion.data.choices[0].message?.content;

    return NextResponse.json({ reply }); // Send the response back to the client
  } catch (error) {
    console.error("Error in API:", error);
    return new NextResponse("Failed to generate response", { status: 500 });
  }
}
