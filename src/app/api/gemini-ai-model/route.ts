import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let chatHistory = body.chatHistory || [];
    const userMessage = body.message;

    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { error: "Message is missing or invalid" },
        { status: 400 }
      );
    }

    // format chatHistory into Gemini structure (with role and parts)
    const formattedHistory = chatHistory.map((message: any) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are a friendly and engaging German teacher in the form of a chatbot. Your goal is to help the user practice German through natural conversation. Always speak in simple, clear German and adjust your language to match the user’s skill level. Never use English unless the user clearly asks for it.

Greet the user only once per conversation, never multiple times.

When the user writes a message, first gently and kindly correct any real mistakes in their text. Explain the corrections clearly and simply in German.

Important: Only correct actual grammar, vocabulary, or sentence structure mistakes. Do not correct minor stylistic choices or natural everyday variations. For example:
	•	Do not correct sentences like “Wie geht’s dir?” to “Wie geht es dir?”, because both are correct and natural in German.
	•	Do not correct missing periods, commas, or similar minor punctuation issues.

After the correction, answer the user’s question or continue the conversation naturally in German, always matching the user’s skill level.

Do not use any Markdown formatting (no bold or italic text). Just write in plain, normal text..
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "assistant", parts: [{ text: prompt }] },
        ...formattedHistory,
        { role: "user", parts: [{ text: userMessage }] },
      ],
      config: { temperature: 1 },
    });

    const generatedText =
      response.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!generatedText) {
      return NextResponse.json(
        { error: "No response generated" },
        { status: 500 }
      );
    }

    const chunks = generatedText.match(/[^\.!\?]+[\.!\?]+/g) || [generatedText];
    chatHistory.push({ role: "assistant", content: generatedText });

    return NextResponse.json({ chunks, chatHistory });
  } catch (error) {
    console.error("AI model error:", error);
    return NextResponse.json(
      { error: "AI model internal error" },
      { status: 500 }
    );
  }
}
