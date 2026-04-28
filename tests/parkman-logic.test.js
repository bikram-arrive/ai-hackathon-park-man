import { describe, it, expect } from "vitest";
import {
  DEFAULTS,
  applySignCollection,
  canApplyTurn,
  clampPosition,
  getGridlockCount,
  getIntersectionSnap,
  isAabbIntersect,
  isAtIntersection,
  isRoadCell,
} from "../parkman-logic.js";

describe("road grid rules", () => {
  it("marks cell as road when x index is on road cadence", () => {
    expect(isRoadCell(6, 5)).toBe(true);
  });

  it("marks cell as road when z index is on road cadence", () => {
    expect(isRoadCell(5, 9)).toBe(true);
  });

  it("marks cell as non-road when neither axis is on cadence", () => {
    expect(isRoadCell(5, 7)).toBe(false);
  });
});

describe("intersection and turning", () => {
  it("snaps to nearest intersection based on cell and cadence", () => {
    const snap = getIntersectionSnap(23, -25);
    expect(snap).toEqual({ x: 24, z: -24, step: 24 });
  });

  it("detects near intersection within epsilon", () => {
    const r = isAtIntersection(24.2, -23.8);
    expect(r.near).toBe(true);
    expect(r.snapX).toBe(24);
    expect(r.snapZ).toBe(-24);
  });

  it("does not detect intersection outside epsilon", () => {
    const r = isAtIntersection(24.6, -24.6);
    expect(r.near).toBe(false);
  });

  it("allows only orthogonal turns and blocks reverse", () => {
    expect(canApplyTurn({ x: 1, y: 0 }, { x: 0, y: -1 })).toBe(true);
    expect(canApplyTurn({ x: 1, y: 0 }, { x: -1, y: 0 })).toBe(false);
    expect(canApplyTurn({ x: 1, y: 0 }, { x: 1, y: 0 })).toBe(false);
  });
});

describe("movement bounds", () => {
  it("clamps x and z inside world limits", () => {
    const p = clampPosition(500, -500, DEFAULTS.worldLimit);
    expect(p).toEqual({ x: 95, z: -95 });
  });
});

describe("AABB collision", () => {
  it("detects overlap", () => {
    const a = { minX: 0, maxX: 2, minY: 0, maxY: 2, minZ: 0, maxZ: 2 };
    const b = { minX: 1, maxX: 3, minY: 1, maxY: 3, minZ: 1, maxZ: 3 };
    expect(isAabbIntersect(a, b)).toBe(true);
  });

  it("detects separation", () => {
    const a = { minX: 0, maxX: 1, minY: 0, maxY: 1, minZ: 0, maxZ: 1 };
    const b = { minX: 2, maxX: 3, minY: 2, maxY: 3, minZ: 2, maxZ: 3 };
    expect(isAabbIntersect(a, b)).toBe(false);
  });
});

describe("scoring, speed ramp, and gridlock event", () => {
  it("adds 10 points and one sign on each collection", () => {
    const next = applySignCollection({
      score: 0,
      signsCollected: 0,
      baseSpeed: 9,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.score).toBe(10);
    expect(next.signsCollected).toBe(1);
    expect(next.baseSpeed).toBe(9);
    expect(next.gridlockSpawned).toBe(false);
    expect(next.status).toBe("Parking sign acquired");
  });

  it("increases speed by 15% every 5 signs", () => {
    const next = applySignCollection({
      score: 40,
      signsCollected: 4,
      baseSpeed: 10,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.signsCollected).toBe(5);
    expect(next.baseSpeed).toBe(11.5);
  });

  it("spawns gridlock once score reaches 100", () => {
    const next = applySignCollection({
      score: 90,
      signsCollected: 9,
      baseSpeed: 9,
      gridlockSpawned: false,
      status: "",
    });

    expect(next.score).toBe(100);
    expect(next.gridlockSpawned).toBe(true);
    expect(next.status).toBe("Gridlock event active");
  });

  it("keeps gridlock flag true once already active", () => {
    const next = applySignCollection({
      score: 130,
      signsCollected: 13,
      baseSpeed: 12,
      gridlockSpawned: true,
      status: "",
    });

    expect(next.gridlockSpawned).toBe(true);
  });
});

describe("gridlock obstacle count", () => {
  it("generates between 3 and 5 obstacles", () => {
    expect(getGridlockCount(0.0)).toBe(3);
    expect(getGridlockCount(0.34)).toBe(4);
    expect(getGridlockCount(0.99)).toBe(5);
  });
});
