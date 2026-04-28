# ai-hackathon-park-man

Hackathon sandbox for Arrive game concepts.

## Playable Prototype: Acquisition Maze

This repository now includes a browser-based Three.js prototype for the Acquisition Maze concept:

- 3D city grid with roads and buildings
- Driveable Arrive-themed car
- WASD controls with Shift boost
- 10 floating, rotating acquisition targets
- Score UI overlay
- Snake-like trailing growth when collecting targets
- Touch controls for mobile

## How To Run

Because modules are loaded from a CDN, use a local web server (do not open the HTML file directly).

### Option A: Python

```bash
python -m http.server 5500
```

Then open:

http://localhost:5500

### Option B: VS Code Live Server

Open [index.html](index.html) with Live Server.

## Controls

- W: Accelerate
- S: Brake/Reverse
- A/D: Steer
- Shift: Boost

## Next Prototype (Planned)

Valet "Arrive" Hero:

- Physics-based parking loop
- Hotel arrival flow
- Highlighted Arrive-enabled parking zones
- 90-second timer challenge
- Suggested stack: Three.js + Cannon-es