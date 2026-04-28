export const DEFAULTS = {
  cell: 8,
  roadEvery: 3,
  turnEpsilon: 0.35,
  worldLimit: 96,
};

export function isRoadCell(ix, iz, roadEvery = DEFAULTS.roadEvery) {
  return ix % roadEvery === 0 || iz % roadEvery === 0;
}

export function getIntersectionSnap(x, z, cell = DEFAULTS.cell, roadEvery = DEFAULTS.roadEvery) {
  const step = cell * roadEvery;
  return {
    x: Math.round(x / step) * step,
    z: Math.round(z / step) * step,
    step,
  };
}

export function isAtIntersection(x, z, epsilon = DEFAULTS.turnEpsilon, cell = DEFAULTS.cell, roadEvery = DEFAULTS.roadEvery) {
  const snap = getIntersectionSnap(x, z, cell, roadEvery);
  const near = Math.abs(x - snap.x) < epsilon && Math.abs(z - snap.z) < epsilon;
  return { near, snapX: snap.x, snapZ: snap.z };
}

export function canApplyTurn(heading, pendingTurn) {
  const dot = heading.x * pendingTurn.x + heading.y * pendingTurn.y;
  if (dot === -1) {
    return false;
  }
  return dot === 0;
}

export function clampPosition(x, z, worldLimit = DEFAULTS.worldLimit) {
  const min = -worldLimit + 1;
  const max = worldLimit - 1;
  return {
    x: Math.min(max, Math.max(min, x)),
    z: Math.min(max, Math.max(min, z)),
  };
}

export function isAabbIntersect(a, b) {
  return (
    a.minX <= b.maxX &&
    a.maxX >= b.minX &&
    a.minY <= b.maxY &&
    a.maxY >= b.minY &&
    a.minZ <= b.maxZ &&
    a.maxZ >= b.minZ
  );
}

export function applySignCollection(state) {
  const next = {
    ...state,
    score: state.score + 10,
    signsCollected: state.signsCollected + 1,
    status: "Parking sign acquired",
  };

  if (next.signsCollected % 5 === 0) {
    next.baseSpeed = Number((next.baseSpeed * 1.15).toFixed(10));
  }

  if (!next.gridlockSpawned && next.score >= 100) {
    next.gridlockSpawned = true;
    next.status = "Gridlock event active";
  }

  return next;
}

export function getGridlockCount(randomValue) {
  // Mirrors: 3 + floor(random * 3)
  return 3 + Math.floor(randomValue * 3);
}
