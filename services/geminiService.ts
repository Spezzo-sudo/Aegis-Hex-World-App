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

export const generateBuildingLore = async (buildingName: string, buildingDescription: string): Promise<string> => {
    if (!process.env.API_KEY) {
        return Promise.resolve("Lore generation is unavailable. API key is missing.");
    }

    try {
        const prompt = `You are a creative world-builder for a sci-fi game called "Aegis Hex".
        The player is scanning a building for more details.
        The building is a "${buildingName}". Its function is: "${buildingDescription}".
        Write a short, atmospheric description (2-3 sentences) for this building.
        The tone should be industrial, slightly gritty, and hint at its function in a massive space colony.
        Do not repeat the function description verbatim. Be creative. Do not use markdown.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error generating building lore:", error);
        return "Local sensor network interference... could not generate details at this time.";
    }
};

export const generateBuildingImage = async (buildingName: string, buildingDescription: string): Promise<string | null> => {
    if (!process.env.API_KEY) {
        console.warn("Image generation is unavailable. API key is missing.");
        return null;
    }
    try {
        const prompt = `Digital painting of a futuristic sci-fi building, the ${buildingName}. It is described as: '${buildingDescription}'. The structure should look functional and integrated into a massive space colony. Cinematic lighting, highly detailed, epic scale, concept art style.`;

        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;

    } catch (error) {
        console.error("Error generating building image:", error);
        return null;
    }
};