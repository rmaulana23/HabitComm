import { GoogleGenAI } from "@google/genai";

// In a real app, this should be handled securely and not exposed on the client-side.
// For this environment, we assume it's provided.
let ai: GoogleGenAI;
try {
  // Assume process.env.API_KEY is available from the execution environment
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
} catch (error) {
  console.error("Gemini API key not found or invalid. AI features will be disabled.", error);
}

export async function generateMotto(userName: string): Promise<string> {
    if (!ai) {
        return "AI service is not available.";
    }

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Create a short, motivational motto for a user named ${userName} on a habit-building social app. Keep it under 10 words. Be inspiring and concise. Provide only the motto text, without quotes.`,
        });

        const text = response.text.trim().replace(/"/g, '');
        return text;
    } catch (error) {
        console.error("Error generating motto with Gemini:", error);
        return "Couldn't generate a motto right now.";
    }
}
