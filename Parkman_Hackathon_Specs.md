# Park-Man — Full Game Specification

## Terminology

| Game concept | Name in this game |
|---|---|
| Game title | **Park-Man** |
| Pac-Man / player character | **Arrive Car** |
| Ghosts | **Yellow Fines** |
| Power-up fruits | **Parking Signs** |
| Dots in corridors | **Dots** |
| Safe zones | **Arrive Zones** (corners with "A" icon) |

---

## Overview

Park-Man is a 3D "Smart City" arcade game inspired by Pac-Man. The player navigates a city grid as a sleek Arrive-branded car, collecting Dots and Parking Signs while avoiding Swedish parking fines (Yellow Fines). Clearing all Dots advances the player to the next level. Arrive Zones in each corner of the board offer refuge during chase phases.

---

## Technical Stack

- **Language:** JavaScript (ES6+)
- **Library:** Three.js (via CDN)
- **Format:** Single-file HTML (`index.html`) containing all CSS, HTML, and JS
- **Assets:** No external files. All 3D models (Car, Signs, Fines, Buildings) are built exclusively from Three.js primitives: `BoxGeometry`, `CylinderGeometry`, `PlaneGeometry`
- **Physics:** Simple bounding-box collision detection (AABB)

---

## Visual Identity & Brand Palette

| Element | Color role | HEX |
|---|---|---|
| Arrive Car (body) | Arrive Primary | `#5F016F` |
| Arrive Car (accents) | Arrive Pink | `#FF33BB` |
| Environment (ground) | Dark Asphalt | `#1A1A1A` |
| Environment (buildings) | Off-White | `#F9F5F4` |
| Building highlights | Arrive Light Pink | `#FFADE4` |
| Yellow Fines | Swedish Fine Yellow | `#FFD700` |
| Parking Signs | Classic Parking Blue | `#0033AA` |

---

## 3D Art Direction

### Camera
- **Projection:** Perspective (not orthographic), with a **narrow-to-medium field of view** (suggested: 45–55°) to preserve depth without heavy distortion.
- **Angle:** Fixed, elevated isometric-style — camera sits **high above and behind** the board, tilted roughly **50–60° down** from horizontal. This matches a classic isometric arcade look: buildings have clear visible height, the floor stretches away naturally, and the whole maze fits comfortably in frame.
- **Distance:** Pulled **far back** so a large portion of the maze is visible at once — the player should see roughly 2/3 of the board at any time. Not a close follow-cam; the car is a small but clear element within the wider city grid.
- **Position:** Camera is fixed in world space — it does **not** follow the Arrive Car. The entire board is always visible from a single static viewpoint.
- **Suggested Three.js values:**
  ```js
  camera.position.set(0, 28, 22);  // high and back
  camera.lookAt(0, 0, 0);           // centre of the board
  camera.fov = 50;
  ```
- Reference feel: similar to the provided reference image — an elevated diagonal view where the building blocks have strong visible 3D sides, the floor is clearly readable, and characters are small relative to the cityscape.

### Game world
- The board is a **3D city grid** rendered in Three.js.
- Ground plane: dark asphalt (`#1A1A1A`), flat `PlaneGeometry` covering the full board.
- **Buildings** (maze walls): tall `BoxGeometry` blocks, Off-White (`#F9F5F4`) faces with Arrive Light Pink (`#FFADE4`) edge/top highlights — giving them the glowing neon-city look visible in the reference. Buildings should have meaningful height (suggested: 2–3× the car's height) so they cast a strong 3D silhouette from the elevated camera.
- Streets (corridors) are the gaps between building blocks — the dark ground plane is visible between them.
- A subtle **reflective sheen** on the ground plane (low-opacity environment reflection or `MeshStandardMaterial` with slight `metalness`) reinforces the wet-asphalt city feel from the reference.

### Arrive Car
- Body: `BoxGeometry`, purple (`#5F016F`).
- Accents / trim: Arrive Pink (`#FF33BB`).
- Wheels: four black `CylinderGeometry` elements.
- Scale: small relative to the building blocks — readable from the pulled-back camera but not dominating the scene.

### Yellow Fines
- Represented as floating, slightly folded yellow (`#FFD700`) rectangles (`BoxGeometry`).
- Should hover slightly above the ground plane (offset on the Y axis) for visual clarity at the camera distance.

### Parking Signs
- Blue (`#0033AA`) square on a pole (`BoxGeometry` + `CylinderGeometry`).
- Tall enough to be visible from the elevated camera angle.

### Arrive Zones
- One in each corner of the board.
- Marked with the **Arrive "A" logo** rendered in the scene (text or geometry).
- Visually distinct floor tile — suggested: a glowing highlighted `PlaneGeometry` using Arrive Pink (`#FF33BB`) or Light Pink (`#FFADE4`) with slight emissive intensity.

### Dots
- Small white or light-grey spheres (`SphereGeometry`) or cubes placed along corridor tiles.
- Should be slightly elevated off the ground so they are visible from the high camera angle.

---

## Point System

| Collectible | Points |
|---|---|
| Dot | 1 pt |
| Parking Sign | 20 pts |

- There are **no bonus points** for touching Yellow Fines — they are a hazard, not a target.
- There are **no chain multipliers** or time bonuses.
- Score accumulates across levels.

---

## Lives

- The Arrive Car starts each game with **5 lives**.
- A life is lost whenever a Yellow Fine collides with the Arrive Car **during an active chase phase, outside an Arrive Zone**.
- Losing all 5 lives triggers **Game Over**.
- On life loss, the Arrive Car respawns at its starting corner position and Yellow Fines return to the centre of the board. The standard idle phase timer restarts (20 seconds).

---

## Game Board

- A **3D city grid** of streets and buildings forming a maze-like layout.
- **Dots** fill all walkable street tiles at the start of each level.
- **Parking Signs** are placed on the board at game start and replenish dynamically during play (see Parking Signs section).
- Yellow Fines start in the **centre of the board**.
- **Arrive Zones** are located in all **four corners** of the board (see Arrive Zones section).

---

## Arrive Car (Player)

### Starting position
- The Arrive Car starts each game and after each life loss in a **corner of the board**, adjacent to an Arrive Zone (e.g. bottom-left corner).

### Controls
- **Arrow keys** (↑ ↓ ← →) or **WASD**.
- Movement is continuous in the current direction.
- Turning is restricted to **90-degree angles at intersections**.
- Pressing a direction key queues the turn for the next valid junction.

### Goal
- Eat all Dots in the maze to complete the level.
- Collect Parking Signs for bonus points.
- Avoid Yellow Fines during their active chase phases.
- Use Arrive Zones for safety when needed.

### Speed
- **Base speed at level 1:** defined as `1.0×` (reference unit).
- Speed increases with each level (see Speed Progression table below).

---

## Dots

- Dots fill every walkable street tile at the start of each level.
- Eating a Dot scores **1 point**.
- When the **last Dot is eaten**, the level ends and the next level begins immediately.
- Dots are **not replenished mid-level**.

---

## Parking Signs

### Scoring
- Collecting a Parking Sign scores **20 points**.
- Parking Signs have **no effect on Yellow Fines** — they do not trigger a vulnerability mode.

### Placement rules
- At most **10 Parking Signs** are present on the board at any one time.
- Signs are distributed across **different areas of the board** — no two Signs may spawn within a minimum proximity threshold of each other (suggested: no closer than 5 tiles apart).
- Signs are **never placed** inside Arrive Zones or directly on corner tiles.

### Replenishment
- When a Parking Sign is collected, a **new Sign spawns at a random eligible location** (respecting spacing rules) shortly after, as long as Dots remain on the board.
- When the last Dot is eaten and the level ends, **all remaining Parking Signs are cleared** — they do not carry over to the next level.
- At the start of a new level, 10 fresh Parking Signs are placed on the new board.

---

## Arrive Zones (Safe Corners)

- There are **4 Arrive Zones**, one in each corner of the game board.
- Each zone is marked with the **Arrive "A" logo icon**, clearly visible in the 3D scene.
- When the Arrive Car enters an Arrive Zone:
  - It is **completely safe** — Yellow Fines cannot enter the zone and cannot harm the Arrive Car.
  - The Arrive Car **may wait** inside the zone for as long as needed, including through the remainder of an active chase phase.
- Yellow Fines **cannot enter** Arrive Zones under any circumstances.
- Arrive Zones do **not** contain Dots — these tiles are safe area only.
- The Arrive Car may freely **exit** the zone at any time, including during a chase phase (at the player's own risk).

---

## Yellow Fines (Enemies)

### Starting state
- There are **4 Yellow Fines**.
- At the start of each level and after each life loss, all 4 Yellow Fines spawn in the **centre of the board** and remain **stationary**.

### Chase cycle

The Yellow Fines operate on a repeating cycle:

1. **First idle phase at game start (40 seconds):** Extended double-length idle, applied only at the very start of a new game. Gives the player time to learn the board.
2. **Standard idle phase (20 seconds):** Yellow Fines are stationary. No threat to the Arrive Car.
3. **Warning:** A **police siren sound** plays, signalling the start of a chase.
4. **Chase phase (10 seconds):** All 4 Yellow Fines begin moving through the maze toward the Arrive Car. If any Yellow Fine reaches the Arrive Car **outside an Arrive Zone**, the Arrive Car **loses a life**.
5. **End of chase:** Siren stops. Yellow Fines **stop moving** and remain in place wherever they are on the board.
6. **Next idle phase (20 seconds):** Cycle repeats from step 2.

> The cycle resets on life loss: Yellow Fines return to centre, the standard idle phase (20 seconds) restarts.

> The double idle (40 seconds) applies **only once**, at the very beginning of a new game. It does **not** repeat on level transitions or after life loss.

### Movement speed
- Yellow Fines move **slightly faster than the Arrive Car** at all levels.
- Suggested ratio: Yellow Fine speed = Arrive Car speed × **1.2×**.
- This ratio remains constant across all levels (both scale up together).

### Pathfinding
- Yellow Fines navigate the city grid — they cannot pass through buildings and cannot enter Arrive Zones.
- At least **one Fine** (the Chaser) actively targets the Arrive Car's current position at all times during the chase phase.
- The remaining Fines may patrol fixed routes or use varied chase behaviours to avoid all four clustering identically.

---

## Speed Progression

Speed increases every level. The Arrive Car speed scales as follows:

| Level | Arrive Car speed | Yellow Fine speed (×1.2) |
|---|---|---|
| 1 | 1.00× | 1.20× |
| 2 | 1.10× | 1.32× |
| 3 | 1.20× | 1.44× |
| 4 | 1.30× | 1.56× |
| 5 | 1.40× | 1.68× |
| 6 | 1.50× | 1.80× |
| 7 | 1.60× | 1.92× |
| 8 | 1.70× | 2.04× |
| 9 | 1.80× | 2.16× |
| 10+ | 1.90× (cap) | 2.28× (cap) |

- Speed increases by **+0.10×** per level for the Arrive Car.
- Speed is **capped at level 10** — no further increase beyond that.
- Speed resets to the new level's base value at the start of each level (no mid-level acceleration).

---

## Level Transition

1. Player collects the last Dot.
2. A brief level-complete animation/screen plays.
3. The board resets: new full set of Dots, 10 new Parking Signs placed.
4. Yellow Fines return to the centre of the board, stationary.
5. Standard idle phase timer restarts (20 seconds before first chase of new level).
6. Arrive Car returns to its starting corner position.
7. Speed increases to the new level's value.

---

## HUD (Heads-Up Display)

- **Minimalist design** using Arrive brand colours.
- Displayed as an HTML/CSS overlay on top of the Three.js canvas.
- HUD elements:
  - **Score** — current point total, top centre or top right.
  - **Lives** — remaining lives shown as car icons or numeric count, top left.
  - **Level** — current level number.
  - **"Arrive" wordmark** — displayed in the **top-left corner** of the screen at all times, using Arrive brand colours.

---

## Game Over Screen

Triggered when the Arrive Car loses its **5th and final life**.

The Game Over screen displays the following, in order:

1. **"GAME OVER"** — large headline, styled in Arrive brand colours.
2. **"YOUR FINE:"** followed by the player's total score converted to **Swedish crowns (SEK)**: `[score] SEK`
   - Conversion: 1 point = 1 SEK (score = fine amount directly).
   - Example: a score of 347 points displays as `347 SEK`.
3. **"Remember to pay your fine, use the Swish."**
4. A **QR code** linking to **https://arrive.com** — scannable by the player.
5. A **"Play Again" / "RETRY"** button to restart from level 1.

---

## Audio Cues

| Event | Sound |
|---|---|
| Yellow Fine chase starts | Police siren (plays for duration of chase phase) |
| Yellow Fine chase ends | Siren stops |
| Arrive Car enters Arrive Zone during chase | Short safe/shelter sound |
| Dot collected | Short tick sound |
| Parking Sign collected | Distinct pickup sound |
| Life lost | Lose-life jingle |
| Level complete | Level-complete jingle |
| Game over | Game-over music |

---

## Summary of Key Numbers

| Parameter | Value |
|---|---|
| Game name | Park-Man |
| Tech stack | JavaScript ES6+, Three.js (CDN), single HTML file |
| Starting lives | 5 |
| Dot value | 1 pt |
| Parking Sign value | 20 pts |
| Max Parking Signs on board | 10 |
| Min distance between Signs | 5 tiles |
| Yellow Fines count | 4 |
| First idle phase (game start only) | 40 seconds |
| Standard idle phase duration | 20 seconds |
| Chase phase duration | 10 seconds |
| Yellow Fine speed multiplier | 1.2× Arrive Car |
| Arrive Zones | 4 (one per corner), marked with Arrive "A" icon |
| Arrive Car start position | Corner of the board |
| Controls | Arrow keys or WASD |
| Speed increase per level | +0.10× |
| Max speed level | Level 10 (1.90× Arrive Car, 2.28× Fines) |
| Car body colour | `#5F016F` (Arrive Purple) |
| Car accent colour | `#FF33BB` (Arrive Pink) |
| Yellow Fine colour | `#FFD700` (Swedish Fine Yellow) |
| Parking Sign colour | `#0033AA` (Classic Parking Blue) |
| Ground colour | `#1A1A1A` (Dark Asphalt) |
| Building colour | `#F9F5F4` (Off-White) |
| Game Over fine amount | Score in SEK (1 pt = 1 SEK) |
| Game Over QR code target | https://arrive.com |
