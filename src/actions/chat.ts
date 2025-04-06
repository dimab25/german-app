"use server";

import { GoogleGenAI } from "@google/genai";

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

async function normalChat(userMessage: string): Promise<string | null> {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  async function main() {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: "Explain how AI works in a few words",
    });
    console.log(response.text);
  }

  main();
}
export default normalChat;
