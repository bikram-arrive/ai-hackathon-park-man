# Test Plan — PARKMAN

**Project:** Parkman (AI Hackathon — Arrive)  
**Stack:** JavaScript (ES6+), Three.js, Single HTML file  
**Spec source:** `Parkman_Hackathon_Specs.md`

---

## 1. Scene & Visual Setup

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 1 | Three.js scene renders without errors | Open `index.html` in browser, check console | No JS errors, canvas renders | ⬜ |
| 2 | Ground plane is dark asphalt colour | Inspect rendered ground | Ground colour is `#1A1A1A` | ⬜ |
| 3 | Buildings are off-white | Inspect rendered buildings | Buildings are `#F9F5F4` | ⬜ |
| 4 | Building highlights use Arrive Light Pink | Inspect building accent/edge colour | Highlight colour is `#FFADE4` | ⬜ |
| 5 | Grid of streets exists between buildings | Visually verify layout | Clear street paths between building blocks | ⬜ |
| 6 | Camera is fixed 3D perspective (isometric or follow-cam) | Observe camera angle on load | Top-down isometric or follow-cam view, not free-roam | ⬜ |
| 7 | "Arrive" brand text is visible top-left | Check top-left CSS overlay | "Arrive" text rendered in top-left corner | ⬜ |

---

## 2. Player Car

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 8 | Car body renders as a BoxGeometry | Inspect scene / source | Car body is a box primitive coloured `#5F016F` (Arrive Primary) | ⬜ |
| 9 | Car has four wheel cylinders | Inspect scene / source | Four `CylinderGeometry` wheels, coloured black | ⬜ |
| 10 | Car accent colour is Arrive Pink | Check accent elements on car | Accent colour is `#FF33BB` | ⬜ |
| 11 | Car spawns on a valid street cell | Observe spawn position | Car starts inside a street path, not inside a building | ⬜ |
| 12 | Car is visible on initial load | Open game, no interaction | Car is visible at start position | ⬜ |

---

## 3. Movement & Controls

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 13 | W / Arrow Up moves car forward (north) | Press W or ↑ | Car moves forward along grid | ⬜ |
| 14 | S / Arrow Down moves car backward (south) | Press S or ↓ | Car moves backward along grid | ⬜ |
| 15 | A / Arrow Left moves car left (west) | Press A or ← | Car moves left along grid | ⬜ |
| 16 | D / Arrow Right moves car right (east) | Press D or → | Car moves right along grid | ⬜ |
| 17 | Turning is restricted to 90-degree angles | Attempt a turn mid-street | Car only turns at intersections, not mid-block | ⬜ |
| 18 | Car cannot move through buildings | Drive into a building | Car is blocked; does not overlap with building geometry | ⬜ |
| 19 | Car stays within grid bounds | Drive to grid edge | Car stops or wraps at map boundary | ⬜ |
| 20 | Car moves continuously forward (grid-based) | Press a direction and hold | Car moves at constant forward speed on the grid | ⬜ |

---

## 4. Parking Signs (Collectibles)

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 21 | 20 parking signs spawn at game start | Count signs on load | Exactly 20 signs visible in streets | ⬜ |
| 22 | Signs are blue squares on poles | Inspect sign geometry/colour | Blue (`#0033AA`) flat square on a pole (primitives only) | ⬜ |
| 23 | Signs spawn only on street cells | Check spawn positions | No sign spawns inside a building | ⬜ |
| 24 | Driving over a sign removes it | Drive car onto a sign | Sign disappears from scene on collision | ⬜ |
| 25 | Collecting a sign adds +10 to score | Collect one sign, check HUD | Score increases by 10 | ⬜ |
| 26 | Collecting all 20 signs triggers victory | Collect all signs | "You Win" / victory state is shown | ⬜ |

---

## 5. Scoring & HUD

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 27 | Score starts at 0 | Open game | HUD shows score = 0 | ⬜ |
| 28 | Score updates on sign collection | Collect signs | HUD score increments by 10 per sign in real time | ⬜ |
| 29 | Current speed indicator is visible | Open game | HUD displays a "Speed" or `baseSpeed` value | ⬜ |
| 30 | Speed indicator updates when speed increases | Collect 5 signs | Speed value on HUD reflects new speed | ⬜ |
| 31 | HUD uses Arrive colour palette | Inspect HUD styling | HUD elements use `#5F016F`, `#FF33BB`, or other brand colours | ⬜ |
| 32 | HUD is minimalist and non-obstructive | Play game | HUD doesn't block the playfield | ⬜ |

---

## 6. Difficulty Scaling

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 33 | Speed increases by 15% after 5 signs | Collect exactly 5 signs | `baseSpeed` is 1.15× initial value | ⬜ |
| 34 | Speed increases again after 10 signs | Collect 10 signs | `baseSpeed` is 1.15² × initial value | ⬜ |
| 35 | Speed ramp continues every 5 signs | Collect 15, 20 signs | Speed increases at each 5-sign milestone | ⬜ |
| 36 | Gridlock Event triggers at score 100 | Reach score 100 | 3–5 red (`#FF0000`) static cube obstacles spawn in streets | ⬜ |
| 37 | Gridlock cubes spawn only on street cells | Observe spawn positions | No red cube appears inside a building | ⬜ |
| 38 | Gridlock cubes are static (do not move) | Reach score 100, observe | Red cubes remain stationary | ⬜ |
| 39 | Hitting a Gridlock cube triggers Game Over | Drive into a red cube | "GAME OVER" screen appears | ⬜ |

---

## 7. Enemies — The Yellow Fines

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 40 | 3 yellow fines spawn at game start | Count enemies on load | Exactly 3 fines present | ⬜ |
| 41 | Fines are yellow floating rectangles | Inspect geometry/colour | Floating, slightly folded rectangle, colour `#FFD700` | ⬜ |
| 42 | Patroller fines move in fixed loops | Observe fine movement | At least 2 fines move in a repeating loop around blocks | ⬜ |
| 43 | Chaser fine targets player position | Observe one fine behaviour | One fine moves toward player's current coordinates | ⬜ |
| 44 | Touching a fine triggers Game Over | Let car contact a fine | "GAME OVER" screen appears immediately | ⬜ |
| 45 | Fines do not pass through buildings | Watch enemy paths | Fines navigate streets, not through building geometry | ⬜ |

---

## 8. Game Over Screen

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 46 | "GAME OVER" overlay appears on fine collision | Touch a fine | Full-screen or prominent overlay with "GAME OVER" text | ⬜ |
| 47 | "GAME OVER" overlay appears on obstacle collision | Hit a red Gridlock cube | Same Game Over overlay shown | ⬜ |
| 48 | Final score is displayed on Game Over screen | Trigger Game Over | Overlay shows the player's score at time of death | ⬜ |
| 49 | "RETRY" button is present | Trigger Game Over | A "RETRY" button is visible on the overlay | ⬜ |
| 50 | "RETRY" resets score to 0 | Click RETRY | Score resets to 0 | ⬜ |
| 51 | "RETRY" resets car position | Click RETRY | Car returns to start position | ⬜ |
| 52 | "RETRY" respawns all 20 signs | Click RETRY | All 20 parking signs reappear | ⬜ |
| 53 | "RETRY" removes Gridlock cubes | Click RETRY (after score > 100) | Red cubes are gone | ⬜ |
| 54 | "RETRY" resets enemy positions | Click RETRY | Fines return to their start positions/loops | ⬜ |
| 55 | "RETRY" resets speed to base value | Click RETRY | `baseSpeed` is back to initial value | ⬜ |

---

## 9. Technical Constraints

| # | Test Case | How to Test | Expected Result | Status |
|---|-----------|-------------|-----------------|--------|
| 56 | Game runs from a single HTML file | Open `index.html` directly in browser | Game loads without a server or additional files | ⬜ |
| 57 | No external asset files used | Inspect network tab (DevTools) | No image, audio, or model files requested — only CDN for Three.js | ⬜ |
| 58 | Three.js loaded via CDN | Inspect `<script>` tags in HTML | Three.js sourced from a CDN URL | ⬜ |
| 59 | All geometry uses Three.js primitives | Review source code | Only `BoxGeometry`, `CylinderGeometry`, `PlaneGeometry` used | ⬜ |
| 60 | Collision detection uses AABB | Review source code | Bounding-box (Axis-Aligned Bounding Box) collision logic present | ⬜ |
| 61 | No console errors on normal play | Open DevTools console during play | Zero unhandled errors during standard gameplay | ⬜ |
| 62 | Game is playable in latest Chrome/Firefox | Open in both browsers | Game renders and controls work in both | ⬜ |

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ⬜ | Not tested |
| ✅ | Pass |
| ❌ | Fail |
| ⏭ | Skipped / Not applicable |

---

## Testing Notes

- All tests are **manual / visual** since the project is a single-file browser game with no test runner.
- Open `index.html` in a browser with DevTools open to monitor console errors and network requests.
- For colour verification, use the browser DevTools colour picker or a screenshot tool.
- Run tests in the order listed — earlier sections are prerequisites for later ones.
