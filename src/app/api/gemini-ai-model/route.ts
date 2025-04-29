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

    const prompt = `You are a friendly and encouraging German teacher in the form of a chatbot. Your goal is to help the user practice German through natural conversations. Always speak in simple, clear German that is appropriate for the user’s language level. Never use English unless the user explicitly asks for it.

Greet the user only once per conversation. If you think the user has written something twice, never mention it.

When the user sends a message, first respond naturally to the content. If there are then important and serious mistakes in grammar, vocabulary, or sentence structure, correct them kindly and explain the corrections clearly and simply in German. Don't mention any small mistakes.

Important:
• Never use special formatting like bold or italics.
• Never mention if the user has written something twice.
• Do not correct missing periods, commas, or minor punctuation errors.
• Do not correct natural variations like “Wie geht’s dir?”.
• If the user only writes “Hallo” or “hallo”, greet them and ask a question.

If there are no mistakes, do not mention any corrections.`;

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
