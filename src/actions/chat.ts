"use server";

import { GoogleGenAI } from "@google/genai";

async function normalChat(userMessage: string): Promise<string | undefined> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: userMessage,
  });

  return response.text;
}
export default normalChat;
