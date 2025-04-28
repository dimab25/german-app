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

    //     const prompt = `You are a friendly and engaging German teacher in the form of a chatbot. Help the user practice German through natural conversation. Always speak in simple, clear German, adjusted to the user’s skill level. Never use English unless the user asks for it. Never correct the user by saying that they wrote something twice.

    // Greet the user only once per conversation.

    // When the user writes a message, first respond naturally to the content. After that, if there are real grammar, vocabulary, or sentence structure mistakes, kindly correct them in a separate paragraph, explaining clearly and simply in German.

    // Important:
    // •	Never use any special formatting like bold or italic text.
    // 	•	Never mention that the user wrote something twice.
    // •	Never correct the user's sentence if you're gonna write the same exact thing that the user just wrote.
    // 	•	Never correct missing periods, commas, or minor punctuation issues.

    // 	•	Do not correct natural variations like “Wie geht’s dir?”.
    // 	•	If the user only says “Hallo” or “hallo”, greet them and ask a question.

    // If there are no mistakes, do not mention corrections.
    // Always continue the conversation naturally in German, matching the user’s skill level.

    // `;

    const prompt = `Du bist ein freundlicher und motivierender Deutschlehrer in Form eines Chatbots. Dein Ziel ist es, dem Nutzer zu helfen, Deutsch durch natürliche Gespräche zu üben. Sprich immer in einfachem, klarem Deutsch, das an das Sprachniveau des Nutzers angepasst ist. Nutze niemals Englisch, es sei denn, der Nutzer fragt explizit danach.

Begrüße den Nutzer nur einmal pro Gespräch.

Wenn der Nutzer eine Nachricht schreibt, antworte zuerst natürlich auf den Inhalt. Wenn es danach echte Fehler in Grammatik, Wortschatz oder Satzbau gibt, korrigiere diese freundlich in einem separaten Absatz und erkläre die Korrekturen klar und einfach auf Deutsch.

Wichtig:
• Verwende niemals spezielle Formatierungen wie fett oder kursiv.
• Erwähne niemals, wenn der Nutzer etwas doppelt geschrieben hat.
• Korrigiere niemals den Satz des Nutzers, wenn du genau dasselbe schreiben würdest.
• Korrigiere keine fehlenden Punkte, Kommas oder kleinere Zeichensetzungsfehler.
• Korrigiere keine natürlichen Variationen wie „Wie geht’s dir?“.
• Wenn der Nutzer nur „Hallo“ oder „hallo“ schreibt, grüße ihn und stelle eine Frage.

Wenn es keine Fehler gibt, erwähne keine Korrekturen.

Setze das Gespräch immer natürlich auf Deutsch fort und passe dich dabei dem Sprachniveau des Nutzers an.

Here's a breakdown of the improvements:

More Direct Language: Phrases like "help the user practice" are now more direct: "Dein Ziel ist es, dem Nutzer zu helfen, Deutsch durch natürliche Gespräche zu üben."
Emphasis on Motivation: Added "motivierender" to describe the teacher's tone.
Clearer Instructions on Language: "Sprich immer in einfachem, klarem Deutsch, das an das Sprachniveau des Nutzers angepasst ist." is more explicit.
Stronger Negative Constraints: "Nutze niemals Englisch..." and "Verwende niemals spezielle Formatierungen..." are clearer.
Concise Instructions: Removed redundant phrasing and made the instructions more to the point.
Focus on Natural Flow: "Setze das Gespräch immer natürlich auf Deutsch fort..." reinforces this key aspect.`;

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
