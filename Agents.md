# Aegis Hex - Agent-Based Asset Generation

This document outlines the philosophy and implementation of the AI Agent system used in Aegis Hex for dynamic asset generation. Instead of relying solely on pre-made assets, we leverage specialized AI agents to create unique content on-the-fly, enhancing game variety and reducing manual development overhead.

Each "agent" is a specialized service that interacts with a Generative AI model (like Google's Gemini) with a highly specific prompt and purpose.

---

## Agent Roster

### 1. Lore Agent (`loreAgent`)

-   **Responsibility:** Generates atmospheric and narrative text descriptions for in-game entities like planets and buildings.
-   **Model:** `gemini-2.5-flash`
-   **Input:** Entity type (e.g., "Volcanic Planet"), key characteristics (e.g., "rich in Ferrolyt").
-   **Output:** A short, evocative string of text (2-3 sentences).
-   **Status:** **Active**

### 2. Building Artwork Agent (`artworkAgent`)

-   **Responsibility:** Generates 2D isometric artwork for building cards.
-   **Model:** `imagen-4.0-generate-001`
-   **Input:** A detailed visual prompt describing the building's function, materials, and style on a low-poly hex tile.
-   **Output:** A base64-encoded JPEG image.
-   **Status:** **Active**

### 3. Hex Model Agent (`hexModelAgent`) - *Development-Time Tool*

-   **Responsibility:** Used during development to generate the static 3D models for map hex tiles. This agent's output is "baked" into a static data file (`preGeneratedHexModels.ts`) and included in the application bundle. This approach eliminates runtime API calls for map visuals, ensuring high performance, reliability, and zero API quota usage during gameplay.
-   **Model:** `gemini-2.5-flash` (with JSON response schema)
-   **Input:** Biome type (e.g., "FertilePlain"), Resource type (e.g., "Luminis").
-   **Output:** A structured JSON object that is stored in the application's static data.
-   **Status:** **Used for Development (Offline)**. The agent is **not** called by the live application.

---

## Workflow

1.  **Request (Runtime):** A game component (e.g., the Map View) needs an asset for a specific entity (e.g., the lore for a "Volcanic" planet).
2.  **Asset Loading:**
    *   For **3D hex models**, the appropriate pre-generated model description is loaded directly from the static data file (`constants/preGeneratedHexModels.ts`). No API call is made.
    *   For **dynamic content** (lore, artwork), the component proceeds to the next steps.
3.  **Cache Check:** The component first checks a local cache (`useContentCacheStore`) to see if the dynamic asset has already been generated in the current session.
4.  **Dispatch:** If not cached, the component calls the appropriate **runtime** agent (Lore or Artwork) from the `agentService`.
5.  **Generation:** The agent formats a detailed prompt and sends it to the designated AI model.
6.  **Response & Caching:** The agent receives the response (text or image), caches it for future use, and returns it to the component.
7.  **Render:** The component renders the newly loaded or generated asset.