import * as THREE from 'three';

// ─── Constants ────────────────────────────────────────────────────────────────
const SIGN_COLLISION_RADIUS = 1.5;  // world units
const SIGN_HEIGHT            = 2.0;
const SIGN_WIDTH             = 0.8;
const POINTS_PER_SIGN        = 10;

// Fallback if hud.html hasn't loaded window.STREET_ZONES yet
const DEFAULT_STREET_ZONES = [
  { name: 'north-avenue',   xMin: -50, xMax: 50,  zMin: -30, zMax: -22 },
  { name: 'main-street',    xMin: -50, xMax: 50,  zMin:  -4, zMax:   4 },
  { name: 'south-avenue',   xMin: -50, xMax: 50,  zMin:  22, zMax:  30 },
  { name: 'west-boulevard', xMin: -30, xMax: -22, zMin: -50, zMax:  50 },
  { name: 'east-boulevard', xMin:  22, xMax:  30, zMin: -50, zMax:  50 },
];

function getStreetZones() {
  return (typeof window !== 'undefined' && window.STREET_ZONES) || DEFAULT_STREET_ZONES;
}

// ─── State ───────────────────────────────────────────────────────────────────
export let score        = 0;
export let currentSpeed = 0;          // updated each frame from playerCar velocity
export const parkingSigns = [];       // shared array the rest of the game can read

// ─── HUD elements (set after DOM is ready) ───────────────────────────────────
let hudScore = null;
let hudSpeed = null;

export function initHUD() {
  hudScore = document.getElementById('hud-score');
  hudSpeed = document.getElementById('hud-speed');
}

function updateHUD() {
  if (hudScore) hudScore.textContent = `Score: ${score}`;
  if (hudSpeed) hudSpeed.textContent = `Speed: ${Math.round(currentSpeed)} km/h`;
}

// ─── spawnSigns ───────────────────────────────────────────────────────────────
/**
 * Spawns `count` blue parking signs at random street coordinates.
 * Each sign is added to `scene` and tracked in `parkingSigns`.
 */
export function spawnSigns(scene, count = 20) {
  const signGeometry = new THREE.BoxGeometry(SIGN_WIDTH, SIGN_HEIGHT, 0.1);
  const signMaterial = new THREE.MeshStandardMaterial({ color: 0x1565c0 }); // blue

  // Post geometry (thin pole)
  const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, SIGN_HEIGHT, 8);
  const postMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });

  for (let i = 0; i < count; i++) {
    const group = new THREE.Group();

    const board = new THREE.Mesh(signGeometry, signMaterial);
    board.position.y = SIGN_HEIGHT / 2;
    board.castShadow = true;

    const post = new THREE.Mesh(postGeometry, postMaterial);
    post.position.y = 0;

    group.add(post, board);

    const { x, z } = randomStreetPoint();
    group.position.set(x, 0, z);

    scene.add(group);
    parkingSigns.push(group);
  }
}

// ─── checkSignCollisions ──────────────────────────────────────────────────────
/**
 * Call once per frame.
 * Removes any sign the playerCar overlaps, awards points, and refreshes the HUD.
 */
export function checkSignCollisions(scene, playerCar) {
  if (!playerCar) return;

  for (let i = parkingSigns.length - 1; i >= 0; i--) {
    const sign = parkingSigns[i];
    const distance = playerCar.position.distanceTo(sign.position);

    if (distance < SIGN_COLLISION_RADIUS) {
      scene.remove(sign);
      parkingSigns.splice(i, 1);

      score += POINTS_PER_SIGN;
      updateHUD();
    }
  }
}

// ─── Speed tracking ───────────────────────────────────────────────────────────
/**
 * Call once per frame with the playerCar's velocity vector.
 * Converts Three.js units/second to km/h (assumes 1 unit ≈ 1 metre).
 */
export function updateSpeed(velocityVector) {
  const metersPerSecond = velocityVector.length();
  currentSpeed = metersPerSecond * 3.6;   // m/s → km/h
  updateHUD();
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Picks a random (x, z) that falls inside one of the named street corridors.
// Zone selection is weighted by corridor area so all road surface is equally likely.
function randomStreetPoint() {
  const zones = getStreetZones();

  const areas = zones.map(z => (z.xMax - z.xMin) * (z.zMax - z.zMin));
  const total  = areas.reduce((sum, a) => sum + a, 0);

  let pick = Math.random() * total;
  let zone = zones[zones.length - 1];
  for (let i = 0; i < zones.length; i++) {
    pick -= areas[i];
    if (pick <= 0) { zone = zones[i]; break; }
  }

  return {
    x: randomInRange(zone.xMin, zone.xMax),
    z: randomInRange(zone.zMin, zone.zMax),
  };
}
