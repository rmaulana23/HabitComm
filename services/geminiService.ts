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

        const text = response.text ? response.text.trim().replace(/"/g, '') : "Keep moving forward!";
        return text;
    } catch (error) {
        console.error("Error generating motto with Gemini:", error);
        return "Couldn't generate a motto right now.";
    }
}

export async function generateHealthTip(language: 'id' | 'en'): Promise<string> {
    if (!ai) {
        return language === 'id' 
            ? "Minum 8 gelas air setiap hari untuk menjaga tubuh tetap terhidrasi." 
            : "Drink 8 glasses of water daily to keep your body hydrated.";
    }

    try {
        const prompt = language === 'id'
            ? "Berikan satu tips singkat (maksimal 15 kata) tentang kesehatan (seperti minum air, tidur cukup) atau tips agar konsisten membangun kebiasaan. Berikan hanya teks tipsnya saja tanpa tanda kutip."
            : "Give me one short tip (max 15 words) about health (like hydration, sleep) or how to stay consistent with habits. Provide only the tip text without quotes.";

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text ? response.text.trim().replace(/"/g, '') : "Consistency is key!";
    } catch (error) {
        console.error("Error generating tip with Gemini:", error);
        return language === 'id'
            ? "Istirahat yang cukup membantu otak memproses informasi dengan lebih baik."
            : "Adequate rest helps your brain process information better.";
    }
}