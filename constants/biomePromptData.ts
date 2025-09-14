import { BiomeType } from './biomeData';
import { Resource } from '../types';

export const GLOBAL_HEX_PROMPT_SPECS = `
Kamera/Look: Isometric 35–40°, orthografisch wirkend; FOV nicht sichtbar; keine Perspektivverzerrung.
Ausgabe: 2048×2048 PNG, transparenter Hintergrund; Alpha-Kante sauber; kein Hintergrund-Rauschen.
Hex-Basis: reguläres Hex, ratio 1:1:0.12 (W:D:H), edge bevel 4%, chamfer 2%; Oberseite leicht konkav (0.5%).
Grundmaterial: Mid-grey #9AA3A9; Trim #2D3A43 (2–3 px @2k) umlaufend; AO 8–10% in Kanten; North-Marker Dreieck #C3CED6 (8 px) an Nordkante.
Texel-Dichte: ~ 10 px/cm äquivalent; Pinselstruktur fein, Richtung von Nordwest→Südost.
Schatten: baked soft shadow 12% unter Props; kein Drop Shadow auf Alpha.
Naht/Schnittstellen: keine Überstände über die Hexkante > 2%; Props halten 3% Sicherheitsabstand.
Build-Mask: pro Tile Binary Build Mask (Center 60–80% frei, Rand 20–40% belegt). Für KI: „open buildable center“ immer explizit nennen.
`;

// FIX: Aligned this record with the current BiomeType enum. Renamed obsolete keys (e.g., HighPlateau -> Mountains), removed keys that are no longer in the enum, and added placeholders for new enum members to satisfy the type definition.
export const BIOME_PROMPT_SPECIFICATIONS: Record<BiomeType, string> = {
    [BiomeType.FertilePlain]: `
      Silhouette/Profil: Flache Oberseite; Höhenrauschen (Perlin) Amplitude 0.8% der Höhe; Baukern frei (Radius 0.55×).
      Palette: Grass base #6BBF59, shade #4F9444, highlights #8ED37A; Erd-Ader #7C6A4F.
      Mikro-Props: 10–14 Büsche (ovale low-poly vol.) #4A703C; 3–5 Kleinst-Steine #9FA9AF (0.02–0.04×); 6–10 Graspuschel #7CCB6B near edges.
      Verteilung: Blue-noise, Mindestabstand 6% zwischen gleichartigen Props; Center ±10% Zone bleibt leer.
      Boden-Details: 14–18 Pinselstreifen (2–6 px) diagonal NW→SO; 3 sehr subtile Lichtflecken (sun mottling) 6% Opazität.
      Feuchtigkeit/Glanz: Roughness hoch (matt), kein Emissive.
      Build-Mask: Ellipse 0.78×0.68 frei; Edge-Buffer 6%.
      Prompt-Add-on: "flat grassy hex with blue-noise bushes and small stones, open center build mask ellipse 78x68%, fine hand-painted grass streaks, no emissive".
    `,
    [BiomeType.Forest]: ``,
    [BiomeType.Mountains]: `
      Silhouette/Profil: Mesakörper, Randhöhe +0.12×; Top absolut plan (±0.2%).
      Fels-Schichtung: 3 Strata-Bänder: #5D6166 → #555A5E → #4B5156; Kantenbruch dunkler #3A3F44.
      Klippen-Geo: 18–26 triangulierte Brüche; Normalen leicht nach unten gekippt (5–7°) für Lesbarkeit.
      Vegetation: 2–3 Flechtenpolster #76846E top edge only.
      VFX: feine AO unter Überhängen 12%; Staub-Overlay (2 Wolken, 5% Opazität).
      Build-Mask: Topfläche 0.62×0.62 frei, quadratisch orientiert.
      Prompt-Add-on: "raised rock mesa with three visible strata bands, crisp beveled cliff edges, perfectly flat top building pad 62%, subtle dust overlay".
    `,
    [BiomeType.Wasteland]: ``,
    [BiomeType.CrystalSpires]: ``,
    [BiomeType.LavaFlows]: `
      Silhouette/Profil: Basaltplatte; Fissuren 5–7 Linien von Mitte nach Rand, Breite 3–6 px.
      Material: Basalt #3A3F44, Aschefilm #2B2F33; Edge-Soot 4–6% Opazität.
      Emissive: Glut #FF6A3C im Kern, Bloom streng limitiert (≤ 15% area).
      Build-Mask: 0.54–0.6 Kreis frei (je nach Fissurendichte).
      Prompt-Add-on: "basalt hex with glowing orange fissures (5–7), light ash film, safe flat center pad".
    `,
    [BiomeType.PirateOutpost]: ``,
    // Non-colonizable placeholders
    [BiomeType.TimeRift]: `Geometrie: zackige Hauptrisslinie (Zig-Zag 5–7 Segmente), 10–14 Nebenrisse; Tiefe via parallax shading. Emissive: Kern #A46BFF, Rand #7DF0FF; Partikelstrom nach innen (20–30). Distortion-Hinweis: Boden-UV um Riss um 3–5% verschoben (Moiré andeuten). Prompt-Add-on: "jagged violet time tear with inward particle flow and subtle ground distortion".`,
    [BiomeType.BlackHole]: `Geometrie: zentraler Vortex (3 konzentrische Wirbelringe), Krümmung 6–9%; Event Horizon Rim #7DF0FF. Grav-Effekt: Bodenobjekte 4–6% zum Zentrum geneigt. Prompt-Add-on: "triple-ring black hole vortex with blue rim, slight inward bending of nearby props".`,
    [BiomeType.StormField]: `Geometrie: 3 Blitzmasten (Höhe 0.18×), Arcs #27D3E6 zwischen Spitzen; Schwebtrümmer 6–8 Steine. Prompt-Add-on: "stormy hex with three lightning rods, blue electric arcs linking tips, floating rock debris".`,
    [BiomeType.PrismField]: `Geometrie: 1 Großprisma (Höhe 0.22×, 6 Flächen), Boden kristallin. Licht: 7–9 Regenbogenstrahlen; Spektralflecken 6–10. Prompt-Add-on: "large central prism refracting rainbow beams, crystalline ground sheen".`,
};

export const RESOURCE_PROMPT_SPECIFICATIONS: Record<Resource, string> = {
    [Resource.Ätherharz]: `
        Silhouette/Profil: 2–3 Harzbecken (Ø 0.10–0.16), verbunden durch 3–4 Adern (2–3 px).
        Flüssigkeit: Basis Cyan #27D3E6, Tiefe-Dither nach #178A99; Meniskus helle Linie #7DF0FF (1–2 px).
        Partikel: 20–35 Droplets (Spritelayer), Größe 3–6 px, Steigrate 12–18 px/s; verteilter Spawn an Beckenrändern.
        Umrandung: Moos #4FAE54 in Inseln (7–10 Patches).
        Geruch/Glanz (visuell): speckled highlights 4% auf Becken.
        Build-Mask: Harzbereiche ausgeschlossen; rest 58–62% frei.
        Prompt-Add-on: "two to three turquoise resin pools with meniscus highlight, 20–35 floating droplet particles, mossy rims, connecting thin cyan veins".
    `,
    [Resource.Ferrolyt]: `
        Silhouette/Profil: 6–9 Risskanäle (Breite 2–4 px), 3 Hauptadern (6–8 px), diagonale Führung.
        Material: Stein #2E3440; Metallkern #6B2A2A mit Red Emissive #F04747 (Puls 0.8s).
        Funkeneffekte: 8–12 Funken (1–2 px) sporadisch; kein Dauerfeuer.
        Metallreflex: Fresnel 6% an Aderkanten.
        Build-Mask: Aderband + 6% Puffer gesperrt; 52–60% frei.
        Prompt-Add-on: "cracked rocky hex with three primary red-metal veins and smaller fissures, subtle pulsing red glow, sparse spark particles".
    `,
    [Resource.Luminis]: `
        Silhouette/Profil: 4–5 Kristallprismen (Höhe 0.12–0.22×), 6–10 Splitter (klein).
        Material: transluzent Gold #FFC94B mit Kernlicht #FFE79A; Refractions angedeutet mit 6–8 Highlight-Stellen.
        Lichtkegel: 3–4 dünne Beams (1–2 px) radial; Halo 0.25× Radius 8% Opazität.
        Boden: Gras #6BBF59 leicht verdrängt, Erdsaum #7C6A4F.
        Build-Mask: Clusterradius + 5% gesperrt; 56–64% frei.
        Prompt-Add-on: "gold translucent crystal cluster (4–5 prisms, 6–10 shards) with warm core glow and soft halo, tiny light beams, grass base".
    `,
    [Resource.Obskurit]: `
        Silhouette/Profil: 2–3 Monolithe (Basis 0.10–0.14×, Höhe 0.16–0.24×), Kluftlinien 4–7 Stück.
        Material: matt Violet-Black #1A1020; Riss-Emissive #A46BFF (Puls 1.2s); matte Rauheit hoch.
        Nebel: violetter Mist 12–15% Opazität, bodennah (0.02×).
        Sicherheitsabstand: 6% um Monolithe.
        Build-Mask: 50–58% frei (zwischen Monolithen).
        Prompt-Add-on: "two to three matte black-violet monoliths with glowing cracks (violet), low ground mist, strong negative roughness contrast".
    `,
    // Energie doesn't have a physical node on the map
    [Resource.Energie]: '',
}