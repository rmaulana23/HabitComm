
import { GoogleGenAI } from "@google/genai";

// Securely access API Key, handling potential undefined 'process' in some environments
const API_KEY = typeof process !== 'undefined' && process.env && process.env.API_KEY 
    ? process.env.API_KEY 
    : '';

let ai: GoogleGenAI | null = null;

if (API_KEY) {
    try {
        ai = new GoogleGenAI({ apiKey: API_KEY });
    } catch (error) {
        console.error("Failed to initialize GoogleGenAI:", error);
    }
} else {
    console.warn("Gemini API key not found. AI features will be disabled.");
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
