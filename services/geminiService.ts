import { GoogleGenAI } from "@google/genai";

// IMPORTANT: This assumes the API key is set in the environment variables.
// Do not expose the API key in the client-side code.
const apiKey = process.env.API_KEY;
if (!apiKey) {
    console.warn("Google GenAI API key not found. Please set the API_KEY environment variable.");
}
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a motivational motto using the Gemini API.
 * @param userName The name of the user to generate a motto for.
 * @returns A promise that resolves to the generated motto string.
 */
export async function generateMotto(userName: string): Promise<string> {
    if (!apiKey) {
        return "Keep going, you've got this!"; // Fallback motto
    }

    try {
        const prompt = `Create a short, motivational motto (under 12 words) for a user named ${userName} who is building good habits on a social platform called HabitComm. The motto should be inspiring and positive. Respond with only the motto text, without any quotes or extra formatting.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        const motto = response.text.trim().replace(/"/g, ''); // Clean up response
        return motto;

    } catch (error) {
        console.error("Error generating motto with Gemini:", error);
        // Provide a user-friendly fallback in case of an API error
        return "Every step forward is a victory.";
    }
}
