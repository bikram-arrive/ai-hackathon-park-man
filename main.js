import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js";

const canvas = document.getElementById("game");
const pointsEl = document.getElementById("points");
const remainingEl = document.getElementById("remaining");
const statusEl = document.getElementById("status");
const touchControls = document.querySelectorAll("#touch-controls button");

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0x0b1016, 35, 160);

const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 350);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

scene.add(new THREE.HemisphereLight(0xc8e8ff, 0x16222f, 0.75));

const sun = new THREE.DirectionalLight(0xfff1cf, 1.2);
sun.position.set(25, 40, -25);
sun.castShadow = true;
sun.shadow.camera.left = -80;
sun.shadow.camera.right = 80;
sun.shadow.camera.top = 80;
sun.shadow.camera.bottom = -80;
scene.add(sun);

const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x283849, roughness: 0.85 });
const sidewalkMaterial = new THREE.MeshStandardMaterial({ color: 0x1a2531, roughness: 0.95 });
const buildingPalette = [0x6b8aa2, 0x7d6f9d, 0x69918f, 0xa7775a, 0x5f7c96, 0x8d8d5f];

const citySize = 9;
const blockStep = 12;
const roadWidth = 4;
const roadTiles = [];

function isRoad(x, z) {
  return Math.abs(x % blockStep) <= roadWidth || Math.abs(z % blockStep) <= roadWidth;
}

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 240),
  new THREE.MeshStandardMaterial({ color: 0x101922, roughness: 1.0 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

for (let gx = -citySize; gx <= citySize; gx += 1) {
  for (let gz = -citySize; gz <= citySize; gz += 1) {
    const x = gx * blockStep;
    const z = gz * blockStep;

    if (isRoad(x, z)) {
      const road = new THREE.Mesh(new THREE.BoxGeometry(blockStep, 0.2, blockStep), roadMaterial);
      road.position.set(x, 0.1, z);
      road.receiveShadow = true;
      scene.add(road);
      roadTiles.push(new THREE.Vector2(x, z));
      continue;
    }

    const height = 7 + Math.random() * 22;
    const building = new THREE.Mesh(
      new THREE.BoxGeometry(8 + Math.random() * 2, height, 8 + Math.random() * 2),
      new THREE.MeshStandardMaterial({
        color: buildingPalette[Math.floor(Math.random() * buildingPalette.length)],
        metalness: 0.12,
        roughness: 0.82,
      })
    );
    building.position.set(x, height * 0.5, z);
    building.castShadow = true;
    building.receiveShadow = true;
    scene.add(building);

    const lot = new THREE.Mesh(new THREE.BoxGeometry(blockStep, 0.12, blockStep), sidewalkMaterial);
    lot.position.set(x, 0.06, z);
    lot.receiveShadow = true;
    scene.add(lot);
  }
}

const car = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.BoxGeometry(3.2, 1, 5.2),
  new THREE.MeshStandardMaterial({ color: 0xff6a1f, metalness: 0.2, roughness: 0.6 })
);
body.position.y = 0.75;
body.castShadow = true;
car.add(body);

const cabin = new THREE.Mesh(
  new THREE.BoxGeometry(2.5, 0.8, 2.4),
  new THREE.MeshStandardMaterial({ color: 0xf4f5f5, metalness: 0.1, roughness: 0.3 })
);
cabin.position.set(0, 1.45, -0.2);
cabin.castShadow = true;
car.add(cabin);

const logoPlate = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 1.1),
  new THREE.MeshStandardMaterial({ color: 0x113049, side: THREE.DoubleSide })
);
logoPlate.position.set(0, 1.92, -0.2);
logoPlate.rotation.x = -Math.PI / 2;
car.add(logoPlate);

scene.add(car);

const trailSegments = [];
const trailPath = [];
const trailGap = 9;

function addTrailSegment() {
  const seg = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.65, 2.4),
    new THREE.MeshStandardMaterial({ color: 0xffb37e, roughness: 0.55 })
  );
  seg.castShadow = true;
  seg.position.copy(car.position);
  seg.position.y = 0.45;
  scene.add(seg);
  trailSegments.push(seg);
}

const competitorTargets = [];

function randomRoadTile() {
  return roadTiles[Math.floor(Math.random() * roadTiles.length)];
}

for (let i = 0; i < 10; i += 1) {
  const tile = randomRoadTile();
  const target = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshStandardMaterial({
      color: new THREE.Color(`hsl(${Math.floor(Math.random() * 360)} 80% 62%)`),
      emissive: 0x111111,
      metalness: 0.25,
      roughness: 0.28,
    })
  );
  target.position.set(tile.x, 1.6, tile.y);
  target.userData.baseY = target.position.y;
  target.castShadow = true;
  scene.add(target);
  competitorTargets.push(target);
}

const keys = { w: false, a: false, s: false, d: false, shift: false };
let score = 0;
let speed = 0;

function updateHud() {
  pointsEl.textContent = String(score);
  remainingEl.textContent = String(competitorTargets.length);
}

function onKey(event, pressed) {
  const key = event.key.toLowerCase();
  if (key === "w" || key === "a" || key === "s" || key === "d") {
    keys[key] = pressed;
  }
  if (event.key === "Shift") {
    keys.shift = pressed;
  }
}

window.addEventListener("keydown", (event) => onKey(event, true));
window.addEventListener("keyup", (event) => onKey(event, false));

for (const button of touchControls) {
  const key = button.dataset.key;
  button.addEventListener("touchstart", (event) => {
    event.preventDefault();
    keys[key] = true;
  });
  button.addEventListener("touchend", (event) => {
    event.preventDefault();
    keys[key] = false;
  });
  button.addEventListener("mousedown", () => {
    keys[key] = true;
  });
  button.addEventListener("mouseup", () => {
    keys[key] = false;
  });
  button.addEventListener("mouseleave", () => {
    keys[key] = false;
  });
}

function handleMovement(delta) {
  const accel = keys.shift ? 18 : 12;
  const maxSpeed = keys.shift ? 22 : 14;

  if (keys.w) {
    speed += accel * delta;
  }
  if (keys.s) {
    speed -= accel * 0.85 * delta;
  }

  speed *= 0.94;
  speed = THREE.MathUtils.clamp(speed, -maxSpeed * 0.55, maxSpeed);

  if (Math.abs(speed) > 0.05) {
    const turnFactor = THREE.MathUtils.clamp(Math.abs(speed) / maxSpeed, 0.2, 1);
    if (keys.a) {
      car.rotation.y += 1.7 * delta * turnFactor;
    }
    if (keys.d) {
      car.rotation.y -= 1.7 * delta * turnFactor;
    }
  }

  const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(car.quaternion);
  car.position.addScaledVector(forward, speed * delta);

  const bound = citySize * blockStep - 7;
  car.position.x = THREE.MathUtils.clamp(car.position.x, -bound, bound);
  car.position.z = THREE.MathUtils.clamp(car.position.z, -bound, bound);

  car.position.y = 0.35;

  trailPath.unshift(car.position.clone());
  const maxTrailPath = Math.max(120, trailSegments.length * trailGap + 2);
  if (trailPath.length > maxTrailPath) {
    trailPath.length = maxTrailPath;
  }

  for (let i = 0; i < trailSegments.length; i += 1) {
    const idx = Math.min((i + 1) * trailGap, trailPath.length - 1);
    const targetPos = trailPath[idx];
    if (targetPos) {
      trailSegments[i].position.x = THREE.MathUtils.lerp(trailSegments[i].position.x, targetPos.x, 0.35);
      trailSegments[i].position.z = THREE.MathUtils.lerp(trailSegments[i].position.z, targetPos.z, 0.35);
      trailSegments[i].rotation.y = THREE.MathUtils.lerp(
        trailSegments[i].rotation.y,
        car.rotation.y,
        0.06
      );
    }
  }
}

function collectTargets(time) {
  for (let i = competitorTargets.length - 1; i >= 0; i -= 1) {
    const target = competitorTargets[i];
    target.rotation.x += 1.3 * time;
    target.rotation.y += 1.8 * time;
    target.position.y = target.userData.baseY + Math.sin(time * 4 + i) * 0.3;

    if (target.position.distanceTo(car.position) < 2.2) {
      scene.remove(target);
      competitorTargets.splice(i, 1);
      score += 1;
      updateHud();
      addTrailSegment();

      if (competitorTargets.length === 0) {
        statusEl.textContent = "Market secured. You captured every target.";
      }
    }
  }
}

function updateCamera(delta) {
  const chaseOffset = new THREE.Vector3(0, 12, 16)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), car.rotation.y)
    .add(car.position);

  camera.position.lerp(chaseOffset, Math.min(1, 4.8 * delta));
  camera.lookAt(car.position.x, car.position.y + 0.9, car.position.z);
}

const clock = new THREE.Clock();
updateHud();

function animate() {
  requestAnimationFrame(animate);
  const delta = Math.min(clock.getDelta(), 0.03);
  const elapsed = clock.elapsedTime;

  handleMovement(delta);
  collectTargets(elapsed);
  updateCamera(delta);

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
