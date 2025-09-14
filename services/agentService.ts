import { GoogleGenAI } from "@google/genai";
import { BuildingType } from "../types";

// Use process.env.API_KEY as mandated. The service will gracefully handle an empty key.
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

const isApiKeyAvailable = (): boolean => {
    if (!apiKey) {
        console.warn("Gemini API key is missing. AI features will be unavailable.");
        return false;
    }
    return true;
}

// --- LORE AGENT ---
const generatePlanetLore = async (planetType: string, bonus: string | undefined): Promise<string> => {
    if (!isApiKeyAvailable()) {
        return "Lore generation is unavailable. API key is missing.";
    }
    
    try {
        const prompt = `You are a creative world-builder for a fantasy sci-fi game called "Aegis Hex". 
        Write a short, evocative description (2-3 sentences) for a hex-based planet of type "${planetType}". 
        The tone should be a mix of arcane mystery and futuristic technology. 
        ${bonus ? `This location is known to be rich in "${bonus}".` : ''}
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

const generateBuildingLore = async (buildingName: string, buildingDescription: string): Promise<string> => {
    if (!isApiKeyAvailable()) {
        return "Lore generation is unavailable. API key is missing.";
    }

    try {
        const prompt = `You are a creative world-builder for a fantasy sci-fi game called "Aegis Hex".
        The player is inspecting a structure for more details.
        The building is a "${buildingName}". Its function is: "${buildingDescription}".
        Write a short, atmospheric description (2-3 sentences) for this building.
        The tone should be a mix of high-tech and arcane mystery.
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


// --- ARTWORK AGENT ---
const buildingImagePrompts: Partial<Record<BuildingType, string>> = {
    [BuildingType.AetherharzExtractor]: "Isometric low-poly hexagon tile, centered. A high-tech extractor with a central drilling mechanism penetrating a glowing turquoise resin pool (Ätherharz, #27D3E6). Polished white and grey hull (#2E3440 accents), transparent pipes showing cyan liquid flow, subtle particle effects rising from the pool. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.AetherharzRefinery]: "Isometric low-poly hexagon tile, centered. A compact refinery with tall, bubbling distillation columns filled with turquoise liquid (#27D3E6). Interconnected pipes, heat exchangers, and a final holding tank with a glowing cyan fuel gauge. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.FerrolytForge]: "Isometric low-poly hexagon tile, centered. A robust foundry with an electromagnetic crucible levitating a chunk of dark metal with glowing red veins (Ferrolyt, #F04747). Robotic arms manipulate the ore, casting sparks. Dark, heavy industrial design with safety stripes. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.LuminisFormer]: "Isometric low-poly hexagon tile, centered. An elegant crystal forming platform where golden, translucent shards of Luminis (#FFC94B) are shaped by focused light beams. A central crystal pulses with a warm, golden aura. Sleek, high-tech design. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.ObskuritCompressor]: "Isometric low-poly hexagon tile, centered. A heavy, hydraulic press compressing a black, light-absorbing cube of Obskurit. Glimmers of violet light (#A46BFF) escape from the seams under pressure. Massive, powerful design. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.EnergyCore]: "Isometric low-poly hexagon tile, centered. A central containment ring holds a floating, pulsing sphere of white-hot energy. Conduits with blue energy arcs (#27D3E6) connect the ring to the base plate. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.PlasmaChamber]: "Isometric low-poly hexagon tile, centered. A reinforced dome structure containing a swirling ball of violet plasma. External heat sinks and thick armored conduits. High-energy, advanced design. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.AetherharzSilo]: "Isometric low-poly hexagon tile, centered. A tall, cylindrical storage tank with a translucent vertical window showing the level of glowing turquoise Ätherharz (#27D3E6). Polished white and grey plating. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.FerrolytSilo]: "Isometric low-poly hexagon tile, centered. A heavy, dark metal silo with reinforced bands. A subtle red glow (#F04747) emanates from indicator lights and panel lines. Industrial and secure design. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.LuminisSilo]: "Isometric low-poly hexagon tile, centered. A crystalline silo made of semi-transparent golden panels (#FFC94B). Light refracts through the structure, creating a gentle glowing effect. Elegant and clean design. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.ObskuritSilo]: "Isometric low-poly hexagon tile, centered. A matte black, angular silo with minimal features. Thin, pulsing violet lines (#A46BFF) trace its edges. Secure, high-tech, and slightly ominous design. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.ConstructionYard]: "Isometric low-poly hexagon tile, centered. A large assembly pad with a robotic gantry crane, stacks of prefabricated hull plates, and tool racks. A small holographic timer floats above the pad. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.Nanoforge]: "Isometric low-poly hexagon tile, centered. A pristine, enclosed fabrication chamber with robotic arms assembling complex components under a blue laser light. Tiny spark particles are visible through a viewing window. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.LogisticsHub]: "Isometric low-poly hexagon tile, centered. A central hub with conveyor belts and anti-gravity drones moving resource containers. Yellow and black caution markings on the floor. Animated and busy feel. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.ResearchArchive]: "Isometric low-poly hexagon tile, centered. A circular building with holographic displays orbiting a central data crystal. Light beams connect the crystal to various terminals. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.TensorLab]: "Isometric low-poly hexagon tile, centered. A laboratory with a suspended, glowing prism core. Thin light beams connect the core to three surrounding research consoles. Advanced and mysterious. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.CryptologySphere]: "Isometric low-poly hexagon tile, centered. A spherical building with rotating outer rings covered in glowing green-blue glyphs. A tall antenna projects from the top. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.Shipyard]: "Isometric low-poly hexagon tile, centered. An open drydock with a large gantry and robotic assembly arms constructing a ship's frame. Blue guidance lights line the dock floor. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.Dock]: "Isometric low-poly hexagon tile, centered. An elevated landing pad with extendable mooring clamps and refueling arms. Blinking navigation beacons on the edges. Clean painted low-poly, transparent background, high fidelity.",
    [BuildingType.RepairBay]: "Isometric low-poly hexagon tile, centered. A maintenance bay with a drone swarm performing repairs on a docked frigate. Showers of sparks and diagnostic holograms are visible. Clean painted low-poly, transparent background, high fidelity.",
};

const generateBuildingImage = async (buildingType: BuildingType): Promise<string | null> => {
    if (!isApiKeyAvailable()) {
        return null;
    }
    try {
        const prompt = buildingImagePrompts[buildingType];
        if (!prompt) {
             console.warn(`No image prompt found for building type: ${buildingType}`);
             return null;
        }

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

export const agentService = {
    lore: {
        generatePlanetLore,
        generateBuildingLore,
    },
    artwork: {
        generateBuildingImage,
    },
};