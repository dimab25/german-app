import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const selectedText = body.selectedText;
    const context = body.context;

    // word has to be a string otherwise it's invalid
    if (!selectedText || typeof selectedText !== "string") {
      return NextResponse.json(
        { error: "Word is missing or it's invalid" },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const prompt = `Explain in a really short and simple way the meaning of the German words ${selectedText} in this sentence: ${context}. Use 15/20 words.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    if (!response.text) {
      return NextResponse.json(
        { error: "No definition/context generated by the AI model" },
        { status: 500 }
      );
    }

    if (response.text) {
      return NextResponse.json({ text: response.text });
    }
  } catch (error) {
    console.log("AI model error in the word-info route:", error);
    return NextResponse.json(
      { error: "AI model internal error in the word-info route" },
      { status: 500 }
    );
  }
}
