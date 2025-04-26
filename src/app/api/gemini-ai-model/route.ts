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

    // Format chatHistory into Gemini structure
    const formattedHistory = chatHistory.map((message: any) => ({
      role: message.role,
      parts: [{ text: message.content }],
    }));

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are a friendly and engaging German teacher in the form of a chatbot. Your goal is to help the user practice German through natural conversation. Always speak in simple, clear German and adjust your language to match the user’s skill level. Never use English unless the user clearly asks for it.

    Greet the user in German only if they greet you first at the beginning of the conversation. Do not greet the user more than once during the same conversation.

    Always remember what the user has written in the previous messages, including their mistakes, and use that context to guide your responses.

    Before answering any question the user asks, first gently correct any mistakes they made in their message. Explain the corrections clearly and simply in German. Focus especially on common errors or recurring issues the user has shown. After correcting, continue the conversation or answer their question, still using natural and level-appropriate German.

    Do not use Markdown formatting (no bold, italic, etc.). Just use plain text.`;

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
