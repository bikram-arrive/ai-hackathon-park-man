# Hackathon Specification: Project "PARKMAN"

## 1. Project Overview
**Name:** Parkman  
**Company:** Arrive  
**Duration:** 90-Minute Sprint  
**Core Concept:** A 3D "Smart City" interpretation of Pac-Man. The player navigates a city grid as a sleek Arrive-branded car, collecting parking signs while avoiding Swedish parking fines (*parkeringsböter*).

---

## 2. Technical Stack (Constraints)
* **Language:** JavaScript (ES6+).
* **Library:** Three.js (via CDN).
* **Format:** Single-file HTML (index.html) containing CSS, HTML, and JS.
* **Assets:** **Strictly NO external files.** Use Three.js Primitives (`BoxGeometry`, `CylinderGeometry`, `PlaneGeometry`) to build all 3D models (Car, Signs, Fines, Buildings).
* **Physics:** Simple bounding-box collision detection (AABB).

---

## 3. Visual Identity & Brand Palette
Use the following HEX codes derived from Arrive brand guidelines:

| Element | Color Role | HEX Code |
| :--- | :--- | :--- |
| **Player Car (Body)** | Arrive Primary (P1) | `#5F016F` |
| **Player Car (Accents)** | Arrive Pink (P2) | `#FF33BB` |
| **Environment (Ground)** | Dark Asphalt | `#1A1A1A` |
| **Environment (Buildings)** | Off-White | `#F9F5F4` |
| **Building Highlights** | Arrive Light Pink (P4) | `#FFADE4` |
| **Enemies (Fines)** | Swedish Fine Yellow | `#FFD700` |
| **Collectibles (Signs)** | Classic Parking Blue | `#0033AA` |

---

## 4. Game Mechanics

### A. Movement
* **Grid-based:** The car moves constantly forward within a 3D grid of streets.
* **Input:** WASD or Arrow keys. Turning is restricted to 90-degree angles at intersections.
* **Camera:** Fixed 3D Perspective (top-down isometric or follow-cam).

### B. Objectives & Scoring
* **Parking Signs:** Scattered throughout the grid. Driving over one adds **+10 points**.
* **Victory Condition:** Collect all signs on the map.

### C. Enemies (The Yellow Fines)
* Represented as floating, slightly folded yellow rectangles.
* **Patrollers:** Move in fixed loops around specific blocks.
* **The Chaser:** One fine specifically targets the player's current coordinates.
* **Collision:** Touching a fine triggers "GAME OVER."

### D. Difficulty Scaling
* **Speed Ramp:** Every **5 signs collected**, the car's `baseSpeed` increases by **15%**.
* **The Gridlock Event:** Once the score reaches **100**, spawn 3-5 static "Traffic Jam" obstacles (Red cubes) randomly in the road.

---

## 5. Development Roadmap (Prompt Sequence)

### Step 1: The World & Player
> "Create a Three.js scene with a dark grey ground plane and a grid of buildings (Off-White #F9F5F4). Create a 3D car using a purple (#5F016F) BoxGeometry for the body and four black cylinders for wheels. Implement WASD movement that keeps the car on the 'street' paths."

### Step 2: The Logic & HUD
> "Add a scoring system. Spawn 20 'Parking Signs' (Blue squares on poles) in the streets. When the car collides with a sign, remove it and update an HTML/CSS overlay score. Include a 'Current Speed' indicator."

### Step 3: The Enemies & Events
> "Spawn 3 yellow floating rectangles (Fines) that move automatically. Implement a speed increase of 15% every 5 points. If score > 100, spawn static red cubes in the streets as obstacles. Add a 'Game Over' screen if the car hits a fine or an obstacle."

---

## 6. UI/UX Requirements
* **HUD:** Minimalist design using Arrive colors.
* **Overlay:** "GAME OVER" screen with "RETRY" button and final score.
* **Branding:** Display the "Arrive" text in the top left corner using CSS.
