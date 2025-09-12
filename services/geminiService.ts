
import { GoogleGenAI } from "@google/genai";

// FIX: Use process.env.API_KEY as mandated by the coding guidelines.
// This resolves the error "Property 'env' does not exist on type 'ImportMeta'".
// Using `|| ''` allows the application to start without a key, failing gracefully on API calls.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generatePlanetLore = async (planetType: string, bonus: string | undefined): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("Lore generation is unavailable. API key is missing.");
    }
    
    try {
        const prompt = `You are a creative world-builder for a sci-fi game called "Aegis Hex". 
        Write a short, evocative description (2-3 sentences) for a hex-based planet of type "${planetType}". 
        The tone should be mysterious and slightly dangerous. 
        ${bonus ? `Mention its unique characteristic related to: "${bonus}".` : ''}
        Do not use markdown.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating planet lore:", error);
        return "The cosmic winds are silent... could not generate lore at this time.";
    }
};
