# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**PARKMAN** — A 3D "Smart City" Pac-Man game built for a 90-minute hackathon sprint. The player drives an Arrive-branded car through a city grid, collecting parking signs while evading Swedish parking fines (*parkeringsböter*).

Full specification: `Parkman_Hackathon_Specs.md`

## Running the Game

No build tools, no package manager, no server required. Open `index.html` directly in a browser:

```bash
start index.html        # Windows
open index.html         # macOS
```

Three.js is loaded from CDN inside the HTML file.

## Architecture

The entire game lives in a **single `index.html` file** — all HTML, CSS, and JavaScript in one place. No external assets or files.

**Key Three.js primitives used (no imported 3D models):**
- `BoxGeometry` — car body, buildings, traffic obstacles
- `CylinderGeometry` — car wheels
- `PlaneGeometry` — ground

**Core systems:**
- **Scene setup** — dark asphalt ground, city block grid of off-white buildings, lighting
- **Player** — purple car with constant forward momentum; WASD/arrow keys; turns only at intersections
- **Game loop** — `requestAnimationFrame` driving movement, collision checks, difficulty ramp
- **Collision** — AABB (axis-aligned bounding box) for sign collection and enemy contact
- **Enemies** — 3 yellow floating rectangles: 2 patrollers (fixed loops), 1 chaser (tracks player coordinates)
- **Scoring / difficulty** — +10 per sign; every 5 signs collected, `baseSpeed` increases 15%; score ≥ 100 spawns 3–5 red cube "Traffic Jam" obstacles
- **HUD** — HTML/CSS overlay (score, speed); "GAME OVER" screen with retry button

## Brand Palette

| Element | HEX |
|---|---|
| Player car body | `#5F016F` (Arrive purple) |
| Car accents | `#FF33BB` (Arrive pink) |
| Ground | `#1A1A1A` (dark asphalt) |
| Buildings | `#F9F5F4` (off-white) |
| Building highlights | `#FFADE4` (light pink) |
| Enemies (fines) | `#FFD700` (Swedish fine yellow) |
| Collectibles (signs) | `#0033AA` (parking blue) |

## Implementation Roadmap

The spec defines three prompt-driven phases:

1. **World & Player** — scene, building grid, car geometry, WASD movement on street paths
2. **Logic & HUD** — 20 collectible parking signs, collision detection, score overlay, speed display
3. **Enemies & Events** — 3 enemy fines with AI, difficulty scaling, traffic jam obstacles, game over screen
