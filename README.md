# Aegis Hex — Master Design & Prompt Bible (v0.3)

> Canonical Resources: Ätherharz, Ferrolyt, Luminis, Obskurit. (Dies ist das einzige Ressourcenset im Spiel.)

---

## 1) Ressourcen (final)

**Ätherharz** — synthetisch gezüchtetes Kunstharz; Basis für Treibstoff. Farbe: türkis, irisierend. Indikator: Harztropfen & Adern, cyan Schimmer.

**Ferrolyt** — metallisch-mineralische Hybridlegierung; Bauten & Panzerung. Farbe: dunkelgrau mit roten Adern. Indikator: rotglühende Adern, Funken.

**Luminis** — glasig, lichtleitend; Bauteile & Schilde. Farbe: gold/gelb, halbtransparent. Indikator: goldene Kristalle, warme Aura.

**Obskurit** — dichtes, lichtabsorbierendes Material; Verteidigung & Tarnung. Farbe: schwarz-violett. Indikator: schwarze Brocken mit violettem Innenleuchten.

**Feldparameter:** Yield (0–3), Purity (0–100%), Buildable (S/M/L), Hazard (0–3). Felder können leer sein oder eine Ressource tragen.

---

## 2) Hexfelder / Biome

### 2.1 Kolonisierbare Basistypen

- **Fruchtbare Ebene** — flach, Gras, offene Fläche. Buildable L, Hazard 0.
- **Hochplateau** — Felsoberfläche, flach. Buildable M/L, Hazard 1.
- **Insel-Hex** — flache Sandinsel mit Kernfläche. Buildable M, Hazard 1.
- **Agrar-Hex** — Beete/Felder. Buildable L, Hazard 0.
- **Ebenes Verteidigungsfeld** — befestigt, für Türme/Schildkuppel. Buildable M, Hazard 0.
- **Wasserquelle** — kleiner Teich am Rand, trockener Kern. Buildable M, Hazard 0.
- **Vulkanisches Plateau** — dunkler Fels, stabiler Kern. Buildable M, Hazard 1.

### 2.2 Ressourcenfelder

- **Ätherharz-Node** — Harztümpel & Adern, cyan Schimmer, Partikel.
- **Ferrolyt-Ader** — rote Metalladern, Funken.
- **Luminis-Cluster** — goldene Glas-Kristalle, warme Aura.
- **Obskurit-Deposit** — schwarze Brocken, violette Spalten.

### 2.3 Sonderfelder (nicht kolonisierbar)

- **Zeit-Riss, Schwarzes Loch, Sturmfeld, Prisma** — Hazard 3, Event-/Anomalie-Logik.

---

## 3) Gebäude

### 3.1 Rohstoff & Verarbeitung

- **Ätherharz-Extraktor** — gewinnt Harz aus Boden/Flora. Adj.: Ätherharz-Node.
- **Ätherharz-Raffinerie** — veredelt Harz zu Treibstoff (reduziert Flottenkosten).
- **Ferrolyt-Schmiede** — erzeugt Legierungen & Panzerplatten. Adj.: Ferrolyt-Ader.
- **Luminis-Kristallformer** — produziert Lichtleiter, Schild- und Sensorkomponenten. Adj.: Luminis-Cluster.
- **Obskurit-Kompressor** — presst Obskurit zu Hochdichteblöcken (Bastionen/Tarnmodule). Adj.: Obskurit-Deposit.
- **Universal-Silo** — modulare Lager mit Farbindikatoren pro Material; Überlauf erzeugt Verluste.

### 3.2 Energie & Infrastruktur

- **Energiekern** — Basisstrom, manuelle Energieverteilung (UI-Slider pro Gebäude).
- **Plasmakammer** — erweiterte Energiequelle; +Wirkungsgrad für Schilde & Emissionen.
- **Logistik-Hub** — -5–12% Bau-/Fertigungszeiten im Umkreis; +Konvoi-Slots.
- **Bauhof** — globale Bauzeitreduktion, zusätzliche Bau-Queues.
- **Nanoforge** — seltene Komponenten (Cooldown, begrenzte Slots).
- **Relais-Knoten** — Kommunikationsreichweite, -Flottenlatenz.

### 3.3 Forschung & Aufklärung

- **Forschungsarchiv** — Tech-Tree-Kern.
- **Tensor-Labor** — Forschungsgeschwindigkeit & Projektfokus.
- **Kryptologie-Sphäre** — Spionage/Gegenaufklärung; Signaturvergleich.
- **Sensorik-Phalanx** — Radar/Scan, Trajektorien.

### 3.4 Militär & Verteidigung

- **Werft** — Einheitenproduktion; Blueprints über Tech.
- **Dock** — Flottenkapazität & Umschlag.
- **Reparaturbucht** — passive und beschleunigte Reparatur.
- **Aegis-Schildkuppel** — Basisschild, skaliert mit Schildtech.
- **Ionen-Turm** — Anti-Fighter/Schilde; kurze Reichweite.
- **Plasma-Bastion** — Anti-Armor/Struktur; mittlere Reichweite.
- **Schild-Array** — Schild-HP-Aura (abnehmender Grenznutzen).

### 3.5 Diplomatie & Markt

- **Allianz-Zentral** — Allianzverwaltung, Banner/Aura.
- **Markthalle** — P2P-Handel, Gebühr als Resource Sink.
- **Terraformer (leicht)** — Hazard↓, Buildable↑.
- **Akademie** — Perks/Trainingsmissionen.

---

## 4) Forschung (Tech-Tree)

- **Reaktor-Optimierung** — Energieeffizienz.
- **Extraktions-Algorithmen** — Output & Purity-Nutzung.
- **Harz-Katalyse** — Treibstoffausbeute↑, Flottenkosten↓.
- **Hyperraum-Navigation** — Reisezeit↓, Routen.
- **Relais-Protokolle** — Reichweite/Übertragung.
- **Schiffsarchitektur** — Blueprint-Tiers/Slots.
- **Schildharmonie** — Schild-HP/Reg↑.
- **Tarnprotokolle** — Signatur↓, Tarnmodule.
- **Kryptologie** — Scanqualität/Anti-Spionage.
- **Ionen-Durchbruch** — Ionendurchschlag↑.
- **Plasma-Lanzenfokus** — Strukturschaden↑ (Belagerer/Türme).
- **Drohnenschwarm-KI** — Zielkoordination/Hit-Rate.

---

## 5) Einheiten

**Mechanik:** Schichten Schild → Panzerung → Rumpf. Konter: Jäger>Bomber, Kreuzer>Fregatte, Ionen>Schilde, Plasma>Panzerung/Struktur. Treibstoff: Ätherharz nach Distanz & Tonnage.

### 5.1 Kernflotte

- **Skim-Jäger** — schneller Raider, Anti-Bomber.
- **Aegis-Fregatte** — Allround-Eskorte.
- **Spektral-Bomber** — Anti-Struktur.
- **Phalanx-Kreuzer** — Anti-Fregatte, Reichweite.
- **Nyx-Späher** — Stealth-Scout, Scans.
- **Leitstern-Träger** — Carrier/Support (Drohnen).

### 5.2 Angriffserweiterungen

- **Vortex-Interceptor** — Elite-Dogfighter, Ringantrieb.
- **Helios-Kanonenboot** — Dauerfeuer, Seitentürme.
- **Pyros-Belagerer** — Dual-Plasmalanzen, Struktur-DPS.
- **Bastion-Dreadnought** — Schildanker, Tank.
- **Ionen-Kutter** — Schildbrecher.
- **Meteor-Sturmjäger** — Raketen-Schwarm.
- **Seraph-Kreuzritter** — Elite-Aura & DPS.
- **Solaris-Zerstörer** — Basenbrecher.
- **Eclipse-Drohnenschwarm** — Massendrohnen.

### 5.3 Utility & Expansion

- **Atlas-Transporter** — Ressourcenfrachter.
- **Nomad-Kolonieschiff** — benötigt zur Hex-Beanspruchung (verbraucht Koloniekern).
- **Aurora-Versorger** — Reparatur/Schildregen.
- **Umbra-Tarnkahn** — Stealth-Transport.

---

## 6) Verteidigungen

- **Ionen-Turm** — kurz, anti-Schild/Kleinschiff.
- **Plasma-Bastion** — mittel, anti-Panzerung/Struktur.
- **Schild-Array** — Schild-HP-Aura.
- **Rail-Lanze** — lang, niedrige Feuerrate.
- **Minenfeld** — Anti-Schwarm, einmalige Abnutzung.

---

## 7) Missionen & Flottenaufträge

- **Transport** — Kolonie↔Kolonie (Konvois; Harzverbrauch).
- **Kolonisation** — erfordert Nomad-Kolonieschiff + Koloniekern; Ziel: Buildable ≥ M, Hazard ≤ 1.
- **Raid/Belagerung** — Beute limitiert durch Lager.
- **Blockade** — sperrt Starts/Landungen.
- **Aufklärung** — Scanqualität vs Tarnstufe.

---

## 8) Ökonomie & Ticks

- **Tick:** 15s; deterministisch; Offline-Catchup ≤ 24h.
- **Energiezuweisung:** pro Gebäude; Unterversorgung → proportionaler Outputverlust.
- **Queues:** signierte ETA; Abbruch Teilrückerstattung.
- **Markt:** P2P mit Gebühr; keine Echtgeldtrades.

---

## 9) Art Direction & Prompt-Templates

> Wichtige Regel: Bei der Prompt-Generierung muss immer auf höchstem Detaillierungsniveau gearbeitet werden. Jede Beschreibung enthält vollständige visuelle Spezifikation (Silhouette, Proportion, Farben mit Hexwerten, Materialien, Emissive-Effekte, Decals, Animation-Hinweise). Kein Detail darf ausgelassen werden, da die KI diese Informationen exakt für die Asset-Generierung nutzt. Prinzip: maximale Tiefe, keine Abkürzungen.

**Stil:** Isometrisch, low-poly, handgemalt, clean; transparente Hintergründe; keine Umgebung. Orthographische Kamera ~35–40°; Soft baked shadow.

**Ressourcenfarben:** Ätherharz cyan `#27D3E6`, Ferrolyt rot `#F04747`, Luminis gold `#FFC94B`, Obskurit violett-schwarz `#1A1020` / `#A46BFF`.

### Hexfeld (Rohstoff) — Template

Isometric low-poly hexagon tile, centered, flat base. [Detaillierte Formen: z.B. 3 resin pools with shimmering cyan glow, fine particle effects, edge bevel 4%, base trim #2D3A43]. Clean hand-painted textures with brush grain, whimsical fantasy-sci-fi, transparent background, standalone asset.

### Gebäude — Template

Isometric low-poly hexagon tile, centered. [Exakte Bauteile: Silhouette ratio, height proportion, forms (columns, rings, arms), materials (metal #2E3440, glass #BFEFF8), emissive accents (#27D3E6 strips, #FFC94B beacons), decals]. Clean painted low-poly, transparent background, high fidelity.

### Schiff — Template

Isometric low-poly spaceship asset, centered. [Full spec: silhouette, thruster shape, hull plating colors, glow colors, window layout, emblem decal]. Subtle glow trails, clean hand-painted low-poly, transparent background, maximum detail.

### Stil (abgekürzt)

Stil: isometrisch, low-poly, handgemalt, clean; transparente Hintergründe; keine Umgebung. Ressourcenfarben: Ätherharz cyan, Ferrolyt rot-grau, Luminis gold, Obskurit violett-schwarz.

**Hexfeld (Rohstoff) — Template**

Isometric low-poly hexagon tile, centered, flat base. [e.g., glowing turquoise resin pools (ätherharz) with subtle particles]. Clean hand-painted textures, whimsical fantasy-sci-fi, transparent background, standalone asset, no clutter.

**Gebäude — Template**

Isometric low-poly hexagon tile, centered. [concise building description with emissive accents matching its resource]. Clean painted low-poly, transparent background.

**Schiff — Template**

Isometric low-poly spaceship asset, centered, [clear class/role traits], subtle glow trails, clean hand-painted low-poly, transparent background.

---

*v0.3 — Dieses Dokument enthält keine Legacy-Ressourcen mehr.*