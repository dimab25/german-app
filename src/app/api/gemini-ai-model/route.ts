import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // just testing with or operator if there's no message from user
    const userMessage =
      body.message ||
      "You're a german teacher, talk about something related to germany.";

    // message has to be a string otherwise it's invalid
    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { error: "Message is missing or it's invalid" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `You are a friendly and engaging German teacher in the form of a chatbot. Your goal is to help the user practice German through natural conversation. Always speak in simple, clear German, and adapt your language slightly to the user’s skill level. Do not use English at all unless the user explicitly requests it. If the user makes any mistakes, provide a simple and clear explanation of the mistakes in German. Use English only when the user clearly asks for a translation or explanation in English.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { role: "assistant", parts: [{ text: prompt }] },
        { role: "user", parts: [{ text: userMessage }] },
      ],
      config: { temperature: 1 },
    });

    if (!response.text) {
      return NextResponse.json(
        { error: "No response generated by the AI model" },
        { status: 500 }
      );
    }

    if (response.text) {
      return NextResponse.json({ text: response.text });
    }
  } catch (error) {
    console.log("AI model error in the gemini-ai-model route:", error);
    return NextResponse.json(
      { error: "AI model internal error in the gemini-ai-model route" },
      { status: 500 }
    );
  }
}
